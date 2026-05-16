#!/usr/bin/env node
/**
 * Symbicore Tools MCP Server
 *
 * Gives OpenClaw (GM) direct access to:
 *   - Jira (create, search, comment, transition)
 *   - Fireflies (meetings, transcripts)
 *   - SharePoint / Microsoft Graph (list, upload)
 *   - HubSpot CRM (search contacts, create note)
 *   - Skill discovery (list + read skills on VPS)
 *   - Paperclip agent list
 *   - Agent / tool approval gate (creates Jira ticket for Donovan)
 *
 * APPROVAL GATE: GM must call request_approval before:
 *   - Hiring / creating any new agent
 *   - Assigning tools or permissions to any agent
 * The tool creates a Jira ticket (label: approval-required) and returns the
 * ticket key. GM MUST wait for Donovan to approve via Jira comment before
 * proceeding. Proceeding without approval is forbidden.
 *
 * Zero external npm deps — uses OpenClaw's bundled SDK and Node.js built-in https.
 * Run: node /data/symbicore-tools-mcp.js
 */

"use strict";

const https = require("https");
const http  = require("http");
const fs    = require("fs");
const path  = require("path");

const OC = "/usr/local/lib/node_modules/openclaw/node_modules";
const { McpServer }            = require(`${OC}/@modelcontextprotocol/sdk/dist/cjs/server/mcp.js`);
const { StdioServerTransport } = require(`${OC}/@modelcontextprotocol/sdk/dist/cjs/server/stdio.js`);
const z = require(`${OC}/zod`);

// ---------------------------------------------------------------------------
// Credentials — injected via docker-compose env_file, never in this file
// ---------------------------------------------------------------------------
const JIRA_DOMAIN  = process.env.JIRA_CLOUD_DOMAIN  || "symbicore.atlassian.net";
const JIRA_EMAIL   = process.env.JIRA_EMAIL          || "donovan@symbicore.com";
const JIRA_TOKEN   = process.env.JIRA_API_TOKEN      || "";
const JIRA_PROJECT = process.env.JIRA_PROJECT        || process.env.JIRA_PROJECT_KEY || "SYM";
const FF_KEY       = process.env.FIREFLIES_API_KEY   || "";
const AZ_TENANT    = process.env.AZURE_TENANT_ID     || "";
const AZ_CLIENT    = process.env.AZURE_CLIENT_ID     || "";
const AZ_SECRET    = process.env.AZURE_CLIENT_SECRET || "";
const SP_SITE_ID   = process.env.SHAREPOINT_SITE_ID  || "";
// HubSpot -- OAuth (preferred) or private app token fallback
const HS_PRIVATE_TOKEN  = process.env.HUBSPOT_API_KEY        || "";
const HS_CLIENT_ID      = process.env.HUBSPOT_CLIENT_ID      || "";
const HS_CLIENT_SECRET  = process.env.HUBSPOT_CLIENT_SECRET  || "";
let   _hsAccessToken    = "";
let   _hsTokenExp       = 0;

async function getHubSpotToken() {
  const refreshToken = process.env.HUBSPOT_REFRESH_TOKEN || "";
  if (!refreshToken || !HS_CLIENT_ID || !HS_CLIENT_SECRET) {
    return HS_PRIVATE_TOKEN;
  }
  if (_hsAccessToken && Date.now() < _hsTokenExp - 60000) {
    return _hsAccessToken;
  }
  const body = new URLSearchParams({
    grant_type:    "refresh_token",
    client_id:     HS_CLIENT_ID,
    client_secret: HS_CLIENT_SECRET,
    refresh_token: refreshToken,
  }).toString();
  const resp = await httpReq({
    hostname: "api.hubapi.com",
    path:     "/oauth/v1/token",
    method:   "POST",
    headers:  {
      "Content-Type":   "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(body),
    },
  }, body);
  _hsAccessToken = resp.access_token;
  _hsTokenExp    = Date.now() + (resp.expires_in || 1800) * 1000;
  return _hsAccessToken;
}
const PP_URL       = process.env.PAPERCLIP_API_URL   || "http://paperclip-kyad-paperclip-1:3100";
const PP_KEY       = process.env.PAPERCLIP_API_KEY   || "";
const PP_COMPANY   = process.env.PAPERCLIP_COMPANY_ID || "3986b89f-4bf8-4bae-8181-a5832d20d01b";

// Skills are synced here by tools/sync-to-openclaw.sh
const SKILLS_DIR = process.env.SKILLS_DIR || "/data/skills";

// ---------------------------------------------------------------------------
// HTTP helper
// ---------------------------------------------------------------------------
function httpReq(opts, body) {
  return new Promise((resolve, reject) => {
    const mod = (opts.protocol === "http:") ? http : https;
    const r = mod.request(opts, (res) => {
      let d = "";
      res.on("data", c => d += c);
      res.on("end", () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode} ${opts.hostname}${opts.path}: ${d.slice(0, 300)}`));
          return;
        }
        try { resolve(d ? JSON.parse(d) : {}); } catch { resolve(d); }
      });
    });
    r.on("error", reject);
    if (body) r.write(body);
    r.end();
  });
}

function jiraHdrs(extra) {
  const creds = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString("base64");
  return { Authorization: `Basic ${creds}`, "Content-Type": "application/json", Accept: "application/json", ...extra };
}

function adf(text) {
  const paras = (text || "").split("\n").filter(Boolean).map(l => ({
    type: "paragraph", content: [{ type: "text", text: l }]
  }));
  return { type: "doc", version: 1, content: paras.length ? paras : [{ type: "paragraph", content: [{ type: "text", text: text || "" }] }] };
}

function ok(obj) {
  return { content: [{ type: "text", text: JSON.stringify(obj, null, 2) }] };
}

// ---------------------------------------------------------------------------
// SharePoint token cache
// ---------------------------------------------------------------------------
let _spTok = null, _spExp = 0;

async function spToken() {
  if (_spTok && Date.now() < _spExp - 60000) return _spTok;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: AZ_CLIENT, client_secret: AZ_SECRET,
    scope: "https://graph.microsoft.com/.default",
  }).toString();
  const res = await httpReq({
    hostname: "login.microsoftonline.com",
    path: `/${AZ_TENANT}/oauth2/v2.0/token`, method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(body) },
  }, body);
  _spTok = res.access_token;
  _spExp = Date.now() + (res.expires_in || 3600) * 1000;
  return _spTok;
}

async function graph(method, path, bodyObj) {
  const token = await spToken();
  const bodyStr = bodyObj ? JSON.stringify(bodyObj) : null;
  return httpReq({
    hostname: "graph.microsoft.com", path: `/v1.0${path}`, method,
    headers: {
      Authorization: `Bearer ${token}`, Accept: "application/json",
      ...(bodyStr ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(bodyStr) } : {}),
    },
  }, bodyStr);
}

async function getDriveId() {
  const res = await graph("GET", `/sites/${SP_SITE_ID}/drive`);
  return res.id;
}

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------
const server = new McpServer({ name: "symbicore-tools", version: "2.0.0" });

// ── Jira: create issue ────────────────────────────────────────────────────
server.tool(
  "jira_create_issue",
  "Create a Jira issue in the SYM project",
  {
    summary:     z.string().describe("Issue title"),
    description: z.string().optional().default("").describe("Issue body (plain text)"),
    issuetype:   z.enum(["Task", "Bug", "Story"]).optional().default("Task"),
    priority:    z.enum(["P0", "P1", "P2", "P3"]).optional().default("P2"),
    labels:               z.array(z.string()).optional().default([]).describe("Labels to apply e.g. agent-inbox, approval-required"),
    acceptance_criteria:  z.string().optional().default("").describe("Acceptance criteria. Defaults to description if omitted."),
  },
  async ({ summary, description = "", issuetype = "Task", priority = "P2", labels = [], acceptance_criteria = "" }) => {
    const pMap = { P0: "Highest", P1: "High", P2: "Medium", P3: "Low" };
    const body = JSON.stringify({
      fields: {
        project: { key: JIRA_PROJECT }, summary, description: adf(description),
        issuetype: { name: issuetype },
        priority: { name: pMap[priority] || "Medium" },
        customfield_10058: adf(acceptance_criteria || description || "See issue description."),
        ...(labels.length ? { labels } : {}),
      },
    });
    const res = await httpReq({
      hostname: JIRA_DOMAIN, path: "/rest/api/3/issue", method: "POST",
      headers: jiraHdrs({ "Content-Length": Buffer.byteLength(body) }),
    }, body);
    return ok({ issue_key: res.key, url: `https://${JIRA_DOMAIN}/browse/${res.key}` });
  }
);

// ── Jira: search ─────────────────────────────────────────────────────────
server.tool(
  "jira_search_issues",
  "Search Jira using JQL",
  {
    jql:         z.string().describe("JQL query e.g. project = SYM AND labels = agent-inbox"),
    max_results: z.number().optional().default(20),
  },
  async ({ jql, max_results = 20 }) => {
    const qs = new URLSearchParams({ jql, maxResults: String(max_results), fields: "summary,status,assignee,priority,labels,updated,comment" });
    const res = await httpReq({
      hostname: JIRA_DOMAIN, path: `/rest/api/3/search?${qs}`, method: "GET",
      headers: jiraHdrs(),
    });
    const issues = (res.issues || []).map(i => ({
      key: i.key, summary: i.fields.summary,
      status: i.fields.status?.name,
      assignee: i.fields.assignee?.displayName || "Unassigned",
      labels: i.fields.labels,
      url: `https://${JIRA_DOMAIN}/browse/${i.key}`,
      latest_comment: i.fields.comment?.comments?.slice(-1)[0]?.body?.content?.[0]?.content?.[0]?.text || null,
    }));
    return ok({ total: res.total, issues });
  }
);

// ── Jira: add comment ─────────────────────────────────────────────────────
server.tool(
  "jira_add_comment",
  "Add a comment to a Jira issue",
  {
    issue_key: z.string().describe("Issue key e.g. SYM-42"),
    body:      z.string().describe("Comment text"),
  },
  async ({ issue_key, body: text }) => {
    const body = JSON.stringify({ body: adf(text) });
    const res = await httpReq({
      hostname: JIRA_DOMAIN, path: `/rest/api/3/issue/${issue_key}/comment`, method: "POST",
      headers: jiraHdrs({ "Content-Length": Buffer.byteLength(body) }),
    }, body);
    return ok({ comment_id: res.id, issue_key });
  }
);

// ── Jira: transition ──────────────────────────────────────────────────────
server.tool(
  "jira_transition_issue",
  "Move a Jira issue to a new status",
  {
    issue_key: z.string().describe("Issue key e.g. SYM-42"),
    status:    z.string().describe("Target status name e.g. In Progress, Done, Review"),
  },
  async ({ issue_key, status }) => {
    const tRes = await httpReq({
      hostname: JIRA_DOMAIN, path: `/rest/api/3/issue/${issue_key}/transitions`, method: "GET",
      headers: jiraHdrs(),
    });
    const match = (tRes.transitions || []).find(
      t => t.name.toLowerCase() === status.toLowerCase() || t.to?.name?.toLowerCase() === status.toLowerCase()
    );
    if (!match) {
      const avail = (tRes.transitions || []).map(t => t.name).join(", ");
      return { content: [{ type: "text", text: `Status '${status}' not found. Available: ${avail}` }] };
    }
    const body = JSON.stringify({ transition: { id: match.id } });
    await httpReq({
      hostname: JIRA_DOMAIN, path: `/rest/api/3/issue/${issue_key}/transitions`, method: "POST",
      headers: jiraHdrs({ "Content-Length": Buffer.byteLength(body) }),
    }, body);
    return ok({ issue_key, new_status: status });
  }
);

// ── Fireflies: list meetings ──────────────────────────────────────────────
server.tool(
  "fireflies_list_meetings",
  "List recent Fireflies meeting transcripts",
  { limit: z.number().optional().default(10) },
  async ({ limit = 10 }) => {
    const query = JSON.stringify({
      query: `query { transcripts(limit: ${Math.min(limit, 50)}) { id title dateString duration organizer_email summary { overview action_items } } }`,
    });
    const res = await httpReq({
      hostname: "api.fireflies.ai", path: "/graphql", method: "POST",
      headers: { Authorization: `Bearer ${FF_KEY}`, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(query) },
    }, query);
    const meetings = (res.data?.transcripts || []).map(t => ({
      id: t.id, title: t.title, date: t.dateString,
      duration_minutes: Math.round((t.duration || 0) / 60),
      organizer: t.organizer_email,
      overview: t.summary?.overview || "",
      action_items: t.summary?.action_items || [],
    }));
    return ok({ count: meetings.length, meetings });
  }
);

// ── Fireflies: get transcript ─────────────────────────────────────────────
server.tool(
  "fireflies_get_transcript",
  "Get the full transcript and summary for a Fireflies meeting",
  { transcript_id: z.string().describe("Fireflies transcript ID") },
  async ({ transcript_id }) => {
    const query = JSON.stringify({
      query: `query { transcript(id: "${transcript_id}") { id title dateString duration organizer_email summary { overview outline action_items keywords } sentences { speaker_name text } } }`,
    });
    const res = await httpReq({
      hostname: "api.fireflies.ai", path: "/graphql", method: "POST",
      headers: { Authorization: `Bearer ${FF_KEY}`, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(query) },
    }, query);
    const t = res.data?.transcript;
    if (!t) return { content: [{ type: "text", text: `Transcript ${transcript_id} not found` }] };
    const transcript_text = (t.sentences || []).map(s => `[${s.speaker_name}]: ${s.text}`).join("\n");
    return ok({
      id: t.id, title: t.title, date: t.dateString,
      duration_minutes: Math.round((t.duration || 0) / 60),
      organizer: t.organizer_email,
      overview: t.summary?.overview || "",
      action_items: t.summary?.action_items || [],
      keywords: t.summary?.keywords || [],
      transcript: transcript_text,
    });
  }
);

// ── SharePoint: list folder ───────────────────────────────────────────────
server.tool(
  "sharepoint_list_folder",
  "List files in a SharePoint folder",
  { path: z.string().optional().default("/").describe("e.g. /clients/genuine-comfort/For Review") },
  async ({ path: folderPath = "/" }) => {
    const did = await getDriveId();
    const clean = folderPath.replace(/^\/+|\/+$/g, "");
    const apiPath = clean ? `/drives/${did}/root:/${clean}:/children` : `/drives/${did}/root/children`;
    const res = await graph("GET", apiPath);
    const items = (res.value || []).map(i => ({
      name: i.name, type: i.folder ? "folder" : "file",
      size_bytes: i.size, modified: i.lastModifiedDateTime, url: i.webUrl,
    }));
    return ok({ path: folderPath, count: items.length, items });
  }
);

// ── SharePoint: upload file ───────────────────────────────────────────────
server.tool(
  "sharepoint_upload_file",
  "Upload a base64-encoded file to a SharePoint For Review folder",
  {
    client_id:      z.string().describe("Client ID e.g. genuine-comfort"),
    filename:       z.string().describe("Target filename including extension"),
    content_base64: z.string().describe("File content encoded as base64"),
    content_type:   z.string().optional().default("application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
    folder_path:    z.string().optional().default("For Review"),
  },
  async ({ client_id, filename, content_base64, content_type, folder_path = "For Review" }) => {
    const did = await getDriveId();
    const remotePath = `/clients/${client_id}/${folder_path}/${filename}`;
    const fileBytes = Buffer.from(content_base64, "base64");
    const token = await spToken();
    const res = await httpReq({
      hostname: "graph.microsoft.com",
      path: `/v1.0/drives/${did}/root:${remotePath}:/content`,
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": content_type, "Content-Length": fileBytes.length },
    }, fileBytes);
    return ok({ filename, url: res.webUrl, item_id: res.id });
  }
);

// ── HubSpot: search contacts ──────────────────────────────────────────────
server.tool(
  "hubspot_search_contacts",
  "Search HubSpot CRM contacts by name, email, or company",
  {
    query:       z.string().describe("Search term (name, email, company)"),
    max_results: z.number().optional().default(10),
  },
  async ({ query, max_results = 10 }) => {
    const hsToken = await getHubSpotToken();
    const bodyStr = JSON.stringify({
      query,
      limit: Math.min(max_results, 50),
      properties: ["firstname", "lastname", "email", "company", "phone", "hs_object_id"],
    });
    const res = await httpReq({
      hostname: "api.hubapi.com", path: "/crm/v3/objects/contacts/search", method: "POST",
      headers: {
        Authorization: `Bearer ${hsToken}`, "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(bodyStr),
      },
    }, bodyStr);
    const contacts = (res.results || []).map(c => ({
      id: c.id,
      name: `${c.properties.firstname || ""} ${c.properties.lastname || ""}`.trim(),
      email: c.properties.email,
      company: c.properties.company,
      phone: c.properties.phone,
    }));
    return ok({ total: res.total, contacts });
  }
);

// ── HubSpot: create note ──────────────────────────────────────────────────
server.tool(
  "hubspot_create_note",
  "Create a note on a HubSpot contact record",
  {
    contact_id: z.string().describe("HubSpot contact object ID"),
    note:       z.string().describe("Note body text"),
  },
  async ({ contact_id, note }) => {
    const hsToken = await getHubSpotToken();
    const ts = Date.now();
    const bodyStr = JSON.stringify({
      properties: { hs_note_body: note, hs_timestamp: ts },
      associations: [{
        to: { id: contact_id },
        types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }],
      }],
    });
    const res = await httpReq({
      hostname: "api.hubapi.com", path: "/crm/v3/objects/notes", method: "POST",
      headers: {
        Authorization: `Bearer ${hsToken}`, "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(bodyStr),
      },
    }, bodyStr);
    return ok({ note_id: res.id, contact_id });
  }
);

// ── Skill discovery: list ─────────────────────────────────────────────────
server.tool(
  "skill_list",
  "List all available Symbicore skills synced to the VPS. Returns skill names and their categories.",
  {},
  async () => {
    if (!fs.existsSync(SKILLS_DIR)) {
      return ok({ skills: [], note: `Skills directory not found at ${SKILLS_DIR}. Run sync-to-openclaw.sh first.` });
    }
    const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => {
        const skillFile = path.join(SKILLS_DIR, e.name, "SKILL.md");
        let description = "";
        if (fs.existsSync(skillFile)) {
          const first = fs.readFileSync(skillFile, "utf8").split("\n").find(l => l.startsWith("#"));
          description = (first || "").replace(/^#+\s*/, "");
        }
        return { name: e.name, description };
      });
    return ok({ count: entries.length, skills: entries });
  }
);

// ── Skill discovery: read ─────────────────────────────────────────────────
server.tool(
  "skill_read",
  "Read the full SKILL.md for a specific skill to understand what it does and how to use it",
  { skill_name: z.string().describe("Skill directory name e.g. copywriting, seo-audit, brand-design-system") },
  async ({ skill_name }) => {
    const skillFile = path.join(SKILLS_DIR, skill_name, "SKILL.md");
    if (!fs.existsSync(skillFile)) {
      const available = fs.existsSync(SKILLS_DIR)
        ? fs.readdirSync(SKILLS_DIR).join(", ")
        : "Skills directory not found";
      return { content: [{ type: "text", text: `Skill '${skill_name}' not found. Available: ${available}` }] };
    }
    const content = fs.readFileSync(skillFile, "utf8");
    return ok({ skill_name, content });
  }
);

// ── Paperclip: list agents ────────────────────────────────────────────────
server.tool(
  "paperclip_list_agents",
  "List all Paperclip agents, their roles, IDs, and current status",
  {},
  async () => {
    const ppUrl = new URL(`/api/companies/${PP_COMPANY}/agents`, PP_URL);
    const res = await httpReq({
      hostname: ppUrl.hostname,
      port: ppUrl.port || undefined,
      path: ppUrl.pathname,
      protocol: ppUrl.protocol,
      method: "GET",
      headers: { Authorization: `Bearer ${PP_KEY}`, Accept: "application/json" },
    });
    const agents = (Array.isArray(res) ? res : res.agents || []).map(a => ({
      id: a.id, name: a.name, role: a.role,
      status: a.status, last_heartbeat: a.lastHeartbeatAt,
    }));
    return ok({ count: agents.length, agents });
  }
);

// ── Approval gate ─────────────────────────────────────────────────────────
server.tool(
  "request_approval",
  [
    "MANDATORY before hiring any agent or assigning tools to any agent.",
    "Creates a Jira ticket for Donovan's review with label 'approval-required'.",
    "Returns the ticket key. GM MUST NOT proceed until Donovan approves via a Jira comment.",
    "To check if approved: call jira_search_issues with JQL 'key = {ticket_key}'",
    "and look for a comment containing 'APPROVED' from Donovan.",
  ].join(" "),
  {
    request_type: z.enum(["hire_agent", "assign_tool"]).describe("hire_agent = creating a new agent; assign_tool = giving a tool/permission to an existing agent"),
    summary:      z.string().describe("Short title e.g. 'Hire: Email Marketing Agent' or 'Assign: HubSpot tool to Growth Marketer'"),
    rationale:    z.string().describe("Why this agent/tool is needed. What business outcome does it unlock?"),
    proposed_role:     z.string().optional().describe("For hire_agent: role and responsibilities"),
    proposed_tools:    z.array(z.string()).optional().describe("For assign_tool: list of tools to assign"),
    estimated_cost:    z.string().optional().describe("Expected monthly cost estimate"),
  },
  async ({ request_type, summary, rationale, proposed_role, proposed_tools, estimated_cost }) => {
    const lines = [
      `REQUEST TYPE: ${request_type === "hire_agent" ? "Hire New Agent" : "Assign Tool to Agent"}`,
      `RATIONALE: ${rationale}`,
      proposed_role    ? `PROPOSED ROLE: ${proposed_role}` : null,
      proposed_tools   ? `TOOLS TO ASSIGN: ${proposed_tools.join(", ")}` : null,
      estimated_cost   ? `ESTIMATED COST: ${estimated_cost}` : null,
      "",
      "TO APPROVE: Reply to this ticket with a comment containing 'APPROVED'.",
      "TO DENY: Reply with 'DENIED: [reason]'.",
      "GM is blocked on this action until approval is received.",
    ].filter(Boolean).join("\n");

    const body = JSON.stringify({
      fields: {
        project: { key: JIRA_PROJECT },
        summary: `[GM Approval Required] ${summary}`,
        description: adf(lines),
        issuetype: { name: "Task" },
        priority: { name: "High" },
        customfield_10058: adf(lines),
        labels: ["approval-required", "gm-request"],
      },
    });
    const res = await httpReq({
      hostname: JIRA_DOMAIN, path: "/rest/api/3/issue", method: "POST",
      headers: jiraHdrs({ "Content-Length": Buffer.byteLength(body) }),
    }, body);
    return ok({
      ticket_key: res.key,
      url: `https://${JIRA_DOMAIN}/browse/${res.key}`,
      message: `Approval request created. DO NOT proceed until Donovan approves via Jira comment on ${res.key}.`,
    });
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(err => {
  process.stderr.write(`[symbicore-tools-mcp] Fatal: ${err.message}\n`);
  process.exit(1);
});
