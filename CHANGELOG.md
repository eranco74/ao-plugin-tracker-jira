# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-04-13

### Added
- Initial release of Jira tracker plugin for Agent Orchestrator
- Fetch Jira issues via `jira` CLI with full details (title, description, labels, assignee)
- Map Jira status categories to agent session states (New→open, Indeterminate→in_progress, Done→closed)
- Generate contextual prompts for agents based on issue content
- Smart branch naming from Jira keys (PROJ-123 → feat/proj-123)
- Update issue status, labels, and assignees
- Add comments to Jira issues
- List and filter issues with custom queries
- Create new Jira issues programmatically
- Full TypeScript implementation with type definitions
- Comprehensive documentation and examples

### Dependencies
- `@aoagents/ao-core`: ^0.2.5
- `typescript`: ^5.7.0
- `@types/node`: ^22.0.0

### Requirements
- Node.js 20 or later
- Jira CLI (`jira`) installed and configured
- Agent Orchestrator (`ao`) CLI

[0.1.0]: https://github.com/eranco74/ao-plugin-tracker-jira/releases/tag/v0.1.0
