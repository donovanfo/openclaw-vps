#!/usr/bin/env python3
"""KIE.ai MCP server for OpenClaw — image and video generation."""

import os
import json
import time
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer

try:
    import requests
except ImportError:
    print("Error: requests not installed. Run: pip3 install requests", file=sys.stderr)
    sys.exit(1)

KIE_API_KEY = os.environ.get("KIE_AI_API_KEY", "")
KIE_BASE_URL = os.environ.get("KIE_AI_BASE_URL", "https://api.kie.ai")
PORT = int(os.environ.get("KIE_MCP_PORT", "18900"))

TOOLS = [
    {
        "name": "generate_image",
        "description": "Generate an AI image using KIE.ai. Available models: flux-kontext-max (highest quality hero images), flux-kontext-pro (social graphics, drafts), gpt4o-image (text accuracy for ads/banners).",
        "inputSchema": {
            "type": "object",
            "properties": {
                "prompt": {"type": "string", "description": "Image description prompt"},
                "model": {
                    "type": "string",
                    "enum": ["flux-kontext-max", "flux-kontext-pro", "gpt4o-image"],
                    "default": "flux-kontext-pro",
                    "description": "Model to use"
                },
                "width": {"type": "integer", "default": 1024, "description": "Image width in pixels"},
                "height": {"type": "integer", "default": 1024, "description": "Image height in pixels"}
            },
            "required": ["prompt"]
        }
    },
    {
        "name": "generate_video",
        "description": "Generate an AI video using KIE.ai. Available models: veo3 (highest quality), veo3_fast (faster/cheaper), runway (cinematic).",
        "inputSchema": {
            "type": "object",
            "properties": {
                "prompt": {"type": "string", "description": "Video description prompt"},
                "model": {
                    "type": "string",
                    "enum": ["veo3", "veo3_fast", "runway"],
                    "default": "veo3_fast",
                    "description": "Model to use"
                },
                "duration": {"type": "integer", "default": 5, "description": "Duration in seconds (5-10)"}
            },
            "required": ["prompt"]
        }
    }
]


def poll_for_result(job_id: str, endpoint: str, max_wait: int = 300) -> dict:
    """Poll KIE.ai job until complete."""
    headers = {"Authorization": f"Bearer {KIE_API_KEY}"}
    deadline = time.time() + max_wait
    while time.time() < deadline:
        r = requests.get(f"{KIE_BASE_URL}{endpoint}/{job_id}", headers=headers, timeout=30)
        r.raise_for_status()
        data = r.json()
        status = data.get("status", "")
        if status in ("completed", "succeeded", "done"):
            return data
        if status in ("failed", "error"):
            raise RuntimeError(f"KIE.ai job failed: {data.get('error', 'unknown error')}")
        time.sleep(5)
    raise TimeoutError(f"KIE.ai job {job_id} timed out after {max_wait}s")


def call_generate_image(args: dict) -> str:
    prompt = args["prompt"]
    model = args.get("model", "flux-kontext-pro")
    width = args.get("width", 1024)
    height = args.get("height", 1024)

    headers = {"Authorization": f"Bearer {KIE_API_KEY}", "Content-Type": "application/json"}
    payload = {"prompt": prompt, "model": model, "width": width, "height": height}

    r = requests.post(f"{KIE_BASE_URL}/api/v1/images/generate", headers=headers, json=payload, timeout=60)
    r.raise_for_status()
    data = r.json()

    job_id = data.get("id") or data.get("job_id")
    if job_id and data.get("status") not in ("completed", "succeeded"):
        data = poll_for_result(job_id, "/api/v1/images/jobs")

    url = data.get("url") or (data.get("images") or [{}])[0].get("url", "")
    return json.dumps({"url": url, "model": model, "status": "completed"})


def call_generate_video(args: dict) -> str:
    prompt = args["prompt"]
    model = args.get("model", "veo3_fast")
    duration = args.get("duration", 5)

    headers = {"Authorization": f"Bearer {KIE_API_KEY}", "Content-Type": "application/json"}
    payload = {"prompt": prompt, "model": model, "duration": duration}

    r = requests.post(f"{KIE_BASE_URL}/api/v1/videos/generate", headers=headers, json=payload, timeout=60)
    r.raise_for_status()
    data = r.json()

    job_id = data.get("id") or data.get("job_id")
    if job_id and data.get("status") not in ("completed", "succeeded"):
        data = poll_for_result(job_id, "/api/v1/videos/jobs", max_wait=600)

    url = data.get("url") or (data.get("videos") or [{}])[0].get("url", "")
    return json.dumps({"url": url, "model": model, "status": "completed"})


class MCPHandler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"[KIE-MCP] {fmt % args}", file=sys.stderr)

    def send_json(self, code: int, body: dict):
        data = json.dumps(body).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", len(data))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        if self.path == "/health":
            self.send_json(200, {"status": "ok", "service": "kie-ai-mcp"})
        else:
            self.send_json(404, {"error": "not found"})

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length)) if length else {}

        if self.path == "/tools/list":
            self.send_json(200, {"tools": TOOLS})

        elif self.path == "/tools/call":
            tool = body.get("name")
            args = body.get("arguments", {})
            try:
                if tool == "generate_image":
                    result = call_generate_image(args)
                elif tool == "generate_video":
                    result = call_generate_video(args)
                else:
                    self.send_json(404, {"error": f"unknown tool: {tool}"})
                    return
                self.send_json(200, {"content": [{"type": "text", "text": result}]})
            except Exception as e:
                self.send_json(500, {"error": str(e)})
        else:
            self.send_json(404, {"error": "not found"})


if __name__ == "__main__":
    if not KIE_API_KEY:
        print("Error: KIE_AI_API_KEY not set", file=sys.stderr)
        sys.exit(1)
    print(f"[KIE-MCP] Starting on port {PORT}", file=sys.stderr)
    HTTPServer(("0.0.0.0", PORT), MCPHandler).serve_forever()
