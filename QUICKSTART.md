# Quick Start Guide

Get up and running with the Jira tracker plugin in 5 minutes.

## 1. Prerequisites

Make sure you have these installed:

```bash
# Check Node.js (need v20+)
node --version

# Check Jira CLI
jira version

# Check Agent Orchestrator
ao --version
```

Don't have them? Install:

```bash
# Node.js 20+ from https://nodejs.org

# Jira CLI
go install github.com/ankitpokhrel/jira-cli/cmd/jira@latest

# Agent Orchestrator
npm install -g @aoagents/ao
```

## 2. Configure Jira CLI

If you haven't already:

```bash
jira init
```

Enter your:
- Jira URL (e.g., `https://mycompany.atlassian.net`)
- Email
- API token (create at: https://id.atlassian.com/manage-profile/security/api-tokens)

Test it works:
```bash
jira issue view PROJ-123
```

## 3. Install Plugin

### Option A: From npm (when published)

```bash
npm install -g ao-plugin-tracker-jira
```

### Option B: From source

```bash
git clone https://github.com/YOUR-USERNAME/ao-plugin-tracker-jira.git
cd ao-plugin-tracker-jira
npm install
npm run build
```

## 4. Configure Agent Orchestrator

Create or edit `agent-orchestrator.yaml` in your project:

```yaml
port: 3001

defaults:
  runtime: tmux
  agent: claude-code
  workspace: worktree

projects:
  my-project:
    name: My Project
    repo: myorg/my-repo
    path: ~/code/my-project
    defaultBranch: main
    
    # Add Jira tracker
    tracker:
      package: "ao-plugin-tracker-jira"  # or use path: /path/to/plugin
      jiraUrl: https://mycompany.atlassian.net
      jiraProject: PROJ  # Your Jira project key
    
    agentRules: |-
      Always run tests before pushing.
      Use conventional commits (feat:, fix:, chore:).
      Link Jira issue keys in commit messages.
```

## 5. Start Agent Orchestrator

```bash
cd ~/code/my-project
ao start
```

Your dashboard opens at: **http://localhost:3001**

## 6. Spawn Your First Agent

```bash
ao spawn PROJ-123
```

Watch the magic happen! 🎉

The agent will:
1. ✅ Fetch issue PROJ-123 from Jira
2. ✅ Create branch `feat/proj-123`
3. ✅ Spawn in a tmux session
4. ✅ Start working on the issue
5. ✅ Show in the dashboard

## 7. Monitor Progress

### In the dashboard
Open http://localhost:3001 in your browser

### In the terminal
```bash
ao status
```

### Attach to agent session
```bash
tmux attach -t <session-name>
```

## 8. Spawn More Agents

```bash
# One at a time
ao spawn PROJ-124
ao spawn PROJ-125

# Or all at once
ao batch-spawn PROJ-124 PROJ-125 PROJ-126
```

## Common Commands

```bash
# Start orchestrator
ao start

# Stop orchestrator
ao stop

# Spawn agent for issue
ao spawn PROJ-123

# Batch spawn
ao batch-spawn PROJ-1 PROJ-2 PROJ-3

# Check status
ao status

# View dashboard
# Open http://localhost:3001

# List sessions
ao session ls

# Kill a session
ao session kill my-project-1
```

## What's Next?

- **Configure agent rules** in `agent-orchestrator.yaml` to customize behavior
- **Set up notifications** (Discord, Slack) for agent completion
- **Connect to GitHub** to auto-create PRs
- **Customize branch naming** by modifying the plugin

## Troubleshooting

### Plugin not found

```bash
# Check it's installed
npm list -g ao-plugin-tracker-jira

# Or if using path, verify
ls -la /path/to/ao-plugin-tracker-jira/dist/
```

### Can't fetch issues

```bash
# Test Jira CLI works
jira issue view PROJ-123 --raw

# Reconfigure if needed
jira init
```

### Agent not spawning

```bash
# Check Claude CLI exists
which claude

# Check tmux is installed
which tmux
```

## Support

- 📖 [Full Documentation](README.md)
- 🐛 [Report Issues](https://github.com/eranco74/ao-plugin-tracker-jira/issues)
- 💬 [Discussions](https://github.com/eranco74/ao-plugin-tracker-jira/discussions)

Happy orchestrating! 🤖✨
