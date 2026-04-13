# Jira Tracker Plugin for Agent Orchestrator

A tracker plugin for [Agent Orchestrator](https://github.com/ComposioHQ/agent-orchestrator) that integrates with Jira Issues via the `jira` CLI.

[![npm version](https://badge.fury.io/js/ao-plugin-tracker-jira.svg)](https://www.npmjs.com/package/ao-plugin-tracker-jira)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎯 **Fetch Jira issues** and their details (title, description, labels, assignee)
- 🔄 **Auto-map Jira statuses** to agent session states
- 🤖 **Generate prompts** for agents based on issue content
- 📝 **Update issues** - change status, labels, assignees, add comments
- ✨ **Create new issues** programmatically
- 🔍 **List and filter** issues with powerful queries
- 🌿 **Smart branch naming** - automatically creates branches like `feat/proj-123`

## Prerequisites

- **Node.js** 20 or later
- **Agent Orchestrator** (`ao`) CLI installed
- **Jira CLI** (`jira`) installed and configured
  - Install: https://github.com/ankitpokhrel/jira-cli
  - The plugin uses this CLI tool to interact with Jira

## Installation

### Method 1: npm (Recommended)

```bash
npm install -g ao-plugin-tracker-jira
```

Then configure in your `agent-orchestrator.yaml`:

```yaml
projects:
  my-project:
    name: My Project
    repo: owner/repo
    path: ~/code/my-project
    defaultBranch: main
    
    tracker:
      package: "ao-plugin-tracker-jira"
      jiraUrl: https://your-company.atlassian.net  # Your Jira instance
      jiraProject: PROJ                             # Your project key
```

### Method 2: Local Installation

Clone this repository and build:

```bash
git clone https://github.com/eranco74/ao-plugin-tracker-jira.git
cd ao-plugin-tracker-jira
npm install
npm run build
```

Then configure with a local path:

```yaml
projects:
  my-project:
    tracker:
      path: /path/to/ao-plugin-tracker-jira
      jiraUrl: https://your-company.atlassian.net
      jiraProject: PROJ
```

## Configuration

### Plugin Options

Add these to your project's tracker configuration:

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `jiraUrl` | string | No | `https://issues.redhat.com` | Base URL of your Jira instance |
| `jiraProject` | string | No | - | Default Jira project key for filtering |

### Example Configuration

```yaml
port: 3001

defaults:
  runtime: tmux
  agent: claude-code
  workspace: worktree

projects:
  my-app:
    name: My Application
    repo: myorg/my-app
    path: ~/code/my-app
    defaultBranch: main
    
    tracker:
      package: "ao-plugin-tracker-jira"
      jiraUrl: https://mycompany.atlassian.net
      jiraProject: MYAPP
    
    agentRules: |-
      Always run tests before pushing.
      Use conventional commits (feat:, fix:, chore:).
      Link Jira issue numbers in commit messages.
```

## Usage

### Start Agent Orchestrator

```bash
cd ~/code/my-app
ao start
```

Your dashboard will open at http://localhost:3001

### Spawn an Agent for a Jira Issue

```bash
ao spawn PROJ-123
```

This will:
1. ✅ Fetch issue PROJ-123 from Jira
2. ✅ Create a git worktree with branch `feat/proj-123`
3. ✅ Spawn a Claude Code agent in tmux
4. ✅ Provide the agent with issue context (title, description, labels, assignee)
5. ✅ Display in the dashboard for monitoring

### Spawn Multiple Agents

```bash
ao batch-spawn PROJ-123 PROJ-124 PROJ-125
```

### Check Agent Status

```bash
ao status
```

Example output:
```
┌─────────────────────────────────────────────────┐
│ my-app                                          │
└─────────────────────────────────────────────────┘
  Session       Branch              PR    Activity
  ──────────────────────────────────────────────────
  myapp-1       feat/proj-123       -     working
  myapp-2       feat/proj-124       #42   review
```

## How It Works

### Status Mapping

The plugin maps Jira's status categories to Agent Orchestrator states:

| Jira Status Category | Agent State |
|---------------------|-------------|
| New | `open` |
| Indeterminate (In Progress, Review, etc.) | `in_progress` |
| Done | `closed` |

### Branch Naming

Issues are automatically converted to branch names:

- `PROJ-123` → `feat/proj-123`
- `BUG-456` → `feat/bug-456`

### Jira CLI Commands Used

The plugin uses these `jira` CLI commands:

```bash
jira issue view <key> --raw          # Fetch issue details
jira issue list --limit 30 --raw     # List issues
jira issue move <key> <status>       # Update status
jira issue assign <key> <user>       # Assign issue
jira issue comment add <key> <text>  # Add comment
jira issue create --summary <title>  # Create issue
```

## Development

### Build

```bash
npm install
npm run build
```

### Type Check

```bash
npm run typecheck
```

### Clean

```bash
npm run clean
```

## Architecture

This plugin implements the Agent Orchestrator `Tracker` interface:

```typescript
interface Tracker {
  name: string;
  getIssue(identifier: string, project: ProjectConfig): Promise<Issue>;
  isCompleted(identifier: string, project: ProjectConfig): Promise<boolean>;
  issueUrl(identifier: string, project: ProjectConfig): string;
  branchName(identifier: string, project: ProjectConfig): string;
  generatePrompt(identifier: string, project: ProjectConfig): Promise<string>;
  // Optional methods for advanced features
  listIssues?(filters: IssueFilters, project: ProjectConfig): Promise<Issue[]>;
  updateIssue?(identifier: string, update: IssueUpdate, project: ProjectConfig): Promise<void>;
  createIssue?(input: CreateIssueInput, project: ProjectConfig): Promise<Issue>;
}
```

## Troubleshooting

### "jira: command not found"

Install the Jira CLI:
```bash
go install github.com/ankitpokhrel/jira-cli/cmd/jira@latest
```

Make sure Go's bin is in your PATH:
```bash
export PATH=$PATH:$(go env GOPATH)/bin
```

### "Failed to fetch issue"

Configure the Jira CLI:
```bash
jira init
```

Follow the prompts to set up your Jira credentials.

### "Plugin not found"

If using the package method, make sure it's installed globally:
```bash
npm list -g ao-plugin-tracker-jira
```

If using the path method, verify the path is correct:
```bash
ls -la /path/to/ao-plugin-tracker-jira/dist/index.js
```

### "Agent not spawning"

Check that the `claude` CLI is available:
```bash
which claude
```

And verify Agent Orchestrator is configured to use it:
```yaml
defaults:
  agent: claude-code
  claudeExecutable: /path/to/claude  # Add if not in PATH
```

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Eran Ifrach](https://github.com/eranco74)

## Related

- [Agent Orchestrator](https://github.com/ComposioHQ/agent-orchestrator) - Parallel AI agent orchestration
- [Jira CLI](https://github.com/ankitpokhrel/jira-cli) - Interactive Jira command line tool
- [Claude Code](https://claude.ai/code) - AI coding assistant

## Support

- 🐛 [Report a bug](https://github.com/eranco74/ao-plugin-tracker-jira/issues)
- 💡 [Request a feature](https://github.com/eranco74/ao-plugin-tracker-jira/issues)
- 📖 [Documentation](https://github.com/eranco74/ao-plugin-tracker-jira#readme)
