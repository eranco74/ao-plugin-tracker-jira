/**
 * tracker-jira plugin — Jira Issues as an issue tracker.
 *
 * Uses the `jira` CLI for all Jira API interactions.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { Tracker, Issue, IssueFilters, IssueUpdate, CreateIssueInput, ProjectConfig } from "@aoagents/ao-core";

const execFileAsync = promisify(execFile);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function jira(args: string[]): Promise<string> {
  try {
    const { stdout } = await execFileAsync("jira", args, {
      maxBuffer: 10 * 1024 * 1024,
      timeout: 30_000,
    });
    return stdout.trim();
  } catch (err: any) {
    throw new Error(
      `jira ${args.slice(0, 3).join(" ")} failed: ${err.message}`,
      { cause: err }
    );
  }
}

interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    description: string | null;
    status: {
      name: string;
      statusCategory: {
        key: string;
      };
    };
    labels: string[];
    assignee: {
      displayName: string;
      emailAddress: string;
    } | null;
    priority: {
      id: string;
      name: string;
    } | null;
  };
}

function mapJiraStatusToState(status: JiraIssue["fields"]["status"]): Issue["state"] {
  const category = status.statusCategory.key.toLowerCase();

  // Jira status categories: new, indeterminate, done
  if (category === "done") {
    return "closed";
  }
  if (category === "indeterminate") {
    // In Progress, Review, etc.
    return "in_progress";
  }
  // "new" or other
  return "open";
}

function sanitizeBranchName(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 50);
}

// ---------------------------------------------------------------------------
// Tracker implementation
// ---------------------------------------------------------------------------

function createJiraTracker(): Tracker {
  return {
    name: "jira",

    async getIssue(identifier: string, project: ProjectConfig): Promise<Issue> {
      // Fetch issue as JSON
      const raw = await jira(["issue", "view", identifier, "--raw"]);
      const data: JiraIssue = JSON.parse(raw);

      return {
        id: data.key,
        title: data.fields.summary,
        description: data.fields.description || "",
        url: `${(project as any).jiraUrl || "https://issues.redhat.com"}/browse/${data.key}`,
        state: mapJiraStatusToState(data.fields.status),
        labels: data.fields.labels,
        assignee: data.fields.assignee?.emailAddress,
        priority: data.fields.priority ? parseInt(data.fields.priority.id, 10) : undefined,
      };
    },

    async isCompleted(identifier: string, _project: ProjectConfig): Promise<boolean> {
      const raw = await jira(["issue", "view", identifier, "--raw"]);
      const data: JiraIssue = JSON.parse(raw);
      return data.fields.status.statusCategory.key.toLowerCase() === "done";
    },

    issueUrl(identifier: string, project: ProjectConfig): string {
      const baseUrl = (project as any).jiraUrl || "https://issues.redhat.com";
      return `${baseUrl}/browse/${identifier}`;
    },

    issueLabel(url: string, _project: ProjectConfig): string {
      // Extract Jira key from URL
      // Example: https://issues.redhat.com/browse/MGMT-12345 → "MGMT-12345"
      const match = url.match(/\/browse\/([A-Z]+-\d+)/);
      if (match) {
        return match[1];
      }
      // Fallback: return the last segment of the URL
      const parts = url.split("/");
      return parts[parts.length - 1] || url;
    },

    branchName(identifier: string, project: ProjectConfig): string {
      // For Jira issues, use the key and a sanitized title
      // We'll need to fetch the issue to get the title
      // For now, just use the key
      return `feat/${identifier.toLowerCase()}`;
    },

    async generatePrompt(identifier: string, project: ProjectConfig): Promise<string> {
      const issue = await this.getIssue(identifier, project);

      const lines = [
        `You are working on Jira issue ${issue.id}: ${issue.title}`,
        `Issue URL: ${issue.url}`,
        "",
      ];

      if (issue.labels.length > 0) {
        lines.push(`Labels: ${issue.labels.join(", ")}`);
      }

      if (issue.assignee) {
        lines.push(`Assignee: ${issue.assignee}`);
      }

      if (issue.description) {
        lines.push("## Description", "", issue.description);
      }

      lines.push(
        "",
        "Please implement the changes described in this issue. When done, commit and push your changes."
      );

      return lines.join("\n");
    },

    async listIssues(filters: IssueFilters, project: ProjectConfig): Promise<Issue[]> {
      // Build args for jira issue list
      const args: string[] = ["issue", "list"];

      const limit = filters.limit ?? 30;
      args.push("--limit", String(limit));

      // State filter
      if (filters.state === "closed") {
        args.push("--status", "Done");
      } else if (filters.state === "open") {
        args.push("--status", "To Do");
      }

      // Labels filter
      if (filters.labels && filters.labels.length > 0) {
        args.push("--label", filters.labels.join(","));
      }

      // Assignee filter
      if (filters.assignee) {
        args.push("--assignee", filters.assignee);
      }

      args.push("--raw");

      // Execute search
      const raw = await jira(args);
      const data: { issues: JiraIssue[] } = JSON.parse(raw);

      return data.issues.map((issue) => ({
        id: issue.key,
        title: issue.fields.summary,
        description: issue.fields.description || "",
        url: this.issueUrl(issue.key, project),
        state: mapJiraStatusToState(issue.fields.status),
        labels: issue.fields.labels,
        assignee: issue.fields.assignee?.emailAddress,
        priority: issue.fields.priority ? parseInt(issue.fields.priority.id, 10) : undefined,
      }));
    },

    async updateIssue(
      identifier: string,
      update: IssueUpdate,
      _project: ProjectConfig
    ): Promise<void> {
      // Handle state change using jira issue move
      if (update.state === "in_progress") {
        await jira(["issue", "move", identifier, "In Progress"]);
      } else if (update.state === "closed") {
        await jira(["issue", "move", identifier, "Done"]);
      } else if (update.state === "open") {
        await jira(["issue", "move", identifier, "To Do"]);
      }

      // Handle labels
      if (update.labels && update.labels.length > 0) {
        await jira(["issue", "edit", identifier, "--label", update.labels.join(",")]);
      }

      // Handle assignee
      if (update.assignee) {
        await jira(["issue", "assign", identifier, update.assignee]);
      }

      // Handle comment separately
      if (update.comment) {
        await jira(["issue", "comment", "add", identifier, update.comment]);
      }
    },

    async createIssue(input: CreateIssueInput, project: ProjectConfig): Promise<Issue> {
      const args = [
        "issue",
        "create",
        "--summary", input.title,
        "--body", input.description || "",
      ];

      if ((project as any).jiraProject) {
        args.push("--project", (project as any).jiraProject);
      }

      if (input.labels && input.labels.length > 0) {
        args.push("--label", input.labels.join(","));
      }

      if (input.assignee) {
        args.push("--assignee", input.assignee);
      }

      if (input.priority) {
        args.push("--priority", String(input.priority));
      }

      // Create the issue - note: jira CLI might not support --raw for create
      // The output is typically just the issue key
      const issueKey = await jira(args);

      // Return the created issue by fetching it
      return this.getIssue(issueKey.trim(), project);
    },
  };
}

// ---------------------------------------------------------------------------
// Plugin module export
// ---------------------------------------------------------------------------

export const manifest = {
  name: "jira",
  slot: "tracker" as const,
  description: "Tracker plugin: Jira Issues",
  version: "0.1.0",
};

export function create(): Tracker {
  return createJiraTracker();
}

export default { manifest, create };
