# Contributing to AO Jira Tracker Plugin

Thank you for your interest in contributing! 🎉

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/ao-plugin-tracker-jira.git
   cd ao-plugin-tracker-jira
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Build the plugin**:
   ```bash
   npm run build
   ```

## Development Workflow

### Making Changes

1. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/my-new-feature
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes** in the `src/` directory

3. **Build and test**:
   ```bash
   npm run build
   npm run typecheck
   ```

4. **Test locally** with Agent Orchestrator:
   ```bash
   # In your test project's agent-orchestrator.yaml
   tracker:
     path: /path/to/ao-plugin-tracker-jira
     jiraUrl: https://your-jira.atlassian.net
     jiraProject: TEST
   
   # Start AO and test
   ao start
   ao spawn TEST-123
   ```

### Code Style

- Use TypeScript strict mode
- Follow existing code formatting
- Add JSDoc comments for public functions
- Keep functions focused and small

### Commit Messages

Use conventional commit format:

```
feat: add support for custom fields
fix: handle null assignee gracefully
docs: update installation instructions
refactor: simplify status mapping logic
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Testing

### Manual Testing

Test these scenarios before submitting:

1. **Fetch issue**: `ao spawn PROJ-123`
2. **Batch spawn**: `ao batch-spawn PROJ-1 PROJ-2 PROJ-3`
3. **List issues**: Verify `listIssues()` works
4. **Update status**: Test status transitions
5. **Add comments**: Verify comments are added

### Prerequisites for Testing

- Jira CLI configured: `jira init`
- Agent Orchestrator installed: `npm install -g @aoagents/ao`
- Test Jira project with issues

## Pull Request Process

1. **Update documentation** if you changed behavior
2. **Update README** if you added features
3. **Ensure builds pass**: `npm run build && npm run typecheck`
4. **Push your branch**:
   ```bash
   git push origin feature/my-new-feature
   ```
5. **Open a Pull Request** on GitHub
6. **Describe your changes** clearly in the PR description

### PR Checklist

- [ ] Code builds without errors
- [ ] TypeScript type checks pass
- [ ] Tested manually with Agent Orchestrator
- [ ] Documentation updated (if applicable)
- [ ] README updated (if adding features)
- [ ] Commit messages follow conventional format

## Reporting Issues

When reporting bugs, include:

1. **Version**: `npm list ao-plugin-tracker-jira`
2. **Environment**: Node.js version, OS
3. **Steps to reproduce**
4. **Expected behavior**
5. **Actual behavior**
6. **Error messages** (if any)

Example:
```
**Bug**: Plugin fails to fetch issue with special characters

**Environment**:
- ao-plugin-tracker-jira: 0.1.0
- Node.js: v20.11.0
- OS: macOS 14.2

**Steps**:
1. Configure plugin with Jira URL
2. Run: ao spawn PROJ-123
3. Issue title contains emoji 🚀

**Expected**: Issue fetches successfully
**Actual**: Error: "Failed to parse JSON"
**Error**: [paste error message]
```

## Feature Requests

Feature requests are welcome! Please:

1. **Check existing issues** first
2. **Describe the use case** clearly
3. **Explain why** this would be useful
4. **Provide examples** if possible

## Questions?

- Open an issue with the `question` label
- Start a discussion in GitHub Discussions

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on what's best for the community

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
