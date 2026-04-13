# Publishing Guide

This guide walks you through publishing the AO Jira Tracker Plugin to npm and GitHub.

## Prerequisites

1. **npm account**: Create one at https://www.npmjs.com/signup if you don't have one
2. **GitHub account**: Make sure you have access to create repositories
3. **Git configured**: 
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `ao-plugin-tracker-jira`
3. Description: "Jira issue tracker plugin for Agent Orchestrator"
4. Choose **Public** (for open source)
5. **Don't** initialize with README (we already have one)
6. Click "Create repository"

## Step 2: Push to GitHub

```bash
cd /home/eran/go/src/github/eranco74/ao-plugin-tracker-jira

# Build the plugin first
npm install
npm run build

# Initialize git and commit
git add .
git commit -m "Initial commit: Jira tracker plugin for Agent Orchestrator

Features:
- Fetch Jira issues via jira CLI
- Auto-map Jira statuses to agent states
- Generate prompts from issue content
- Smart branch naming (PROJ-123 → feat/proj-123)
- Update issues, add comments, create issues
- List and filter issues
"

# Add GitHub remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/ao-plugin-tracker-jira.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Create GitHub Release

1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Click "Choose a tag" → type `v0.1.0` → "Create new tag"
4. Release title: `v0.1.0 - Initial Release`
5. Description:
   ```markdown
   ## 🎉 Initial Release
   
   Jira tracker plugin for Agent Orchestrator that integrates with Jira Issues via the `jira` CLI.
   
   ### Features
   - ✅ Fetch Jira issues with full details
   - ✅ Auto-map Jira statuses to agent states
   - ✅ Generate contextual prompts for agents
   - ✅ Smart branch naming from Jira keys
   - ✅ Update issues, labels, assignees
   - ✅ Add comments to issues
   - ✅ Create new issues
   - ✅ List and filter issues
   
   ### Installation
   ```bash
   npm install -g ao-plugin-tracker-jira
   ```
   
   See [README](https://github.com/YOUR-USERNAME/ao-plugin-tracker-jira#readme) for configuration and usage.
   ```
6. Click "Publish release"

## Step 4: Publish to npm

### First-time Setup

```bash
# Login to npm
npm login
# Enter your username, password, and email
```

### Publish

```bash
cd /home/eran/go/src/github/eranco74/ao-plugin-tracker-jira

# Make sure everything is built
npm run clean
npm install
npm run build

# Publish to npm
npm publish
```

If successful, you'll see:
```
+ ao-plugin-tracker-jira@0.1.0
```

Your package is now live at: https://www.npmjs.com/package/ao-plugin-tracker-jira

## Step 5: Update README Badge URLs

Update the GitHub URLs in README.md to match your username:

```bash
# Edit README.md and replace:
# https://github.com/eranco74/ao-plugin-tracker-jira
# with:
# https://github.com/YOUR-USERNAME/ao-plugin-tracker-jira
```

Then commit and push:
```bash
git add README.md
git commit -m "docs: update GitHub URLs in README"
git push
```

## Step 6: Share with Others

Now people can install your plugin:

```bash
npm install -g ao-plugin-tracker-jira
```

And use it in their `agent-orchestrator.yaml`:

```yaml
tracker:
  package: "ao-plugin-tracker-jira"
  jiraUrl: https://your-jira.atlassian.net
  jiraProject: PROJ
```

## Publishing Updates

When you make changes:

### 1. Update Version

```bash
# For bug fixes
npm version patch  # 0.1.0 → 0.1.1

# For new features
npm version minor  # 0.1.0 → 0.2.0

# For breaking changes
npm version major  # 0.1.0 → 1.0.0
```

### 2. Update CHANGELOG.md

Add a new section:
```markdown
## [0.1.1] - 2026-04-14

### Fixed
- Fix issue with null assignee handling

### Changed
- Improve error messages for failed Jira CLI calls
```

### 3. Commit Changes

```bash
git add .
git commit -m "chore: bump version to 0.1.1"
```

### 4. Create Git Tag

```bash
git tag v0.1.1
git push origin main --tags
```

### 5. Rebuild and Publish

```bash
npm run clean
npm install
npm run build
npm publish
```

### 6. Create GitHub Release

Go to GitHub → Releases → Create new release with tag `v0.1.1`

## Verification

After publishing, verify:

1. **npm package**: Visit https://www.npmjs.com/package/ao-plugin-tracker-jira
2. **GitHub repo**: Visit https://github.com/YOUR-USERNAME/ao-plugin-tracker-jira
3. **Install test**: 
   ```bash
   npm install -g ao-plugin-tracker-jira
   npm list -g ao-plugin-tracker-jira
   ```

## Troubleshooting

### "You do not have permission to publish"

The package name might be taken. Choose a different name in `package.json`:
```json
{
  "name": "ao-plugin-jira-tracker"
}
```

### "No git tag found"

Create a tag first:
```bash
git tag v0.1.0
git push origin v0.1.0
```

### "npm publish failed"

Make sure:
- You're logged in: `npm whoami`
- Package builds: `npm run build`
- Version is unique: Check https://www.npmjs.com/package/ao-plugin-tracker-jira

## Support

After publishing, consider:

1. **Add topics** on GitHub: `jira`, `agent-orchestrator`, `ai`, `automation`
2. **Create issues template**: For bug reports and feature requests
3. **Enable Discussions**: For Q&A and community chat
4. **Add CI/CD**: GitHub Actions for automated testing
5. **Monitor**: Watch for issues and PRs from users

## Marketing

Share your plugin:

1. **Twitter/X**: "Just published a Jira tracker plugin for Agent Orchestrator!"
2. **Reddit**: r/programming, r/jira
3. **Hacker News**: Show HN
4. **Agent Orchestrator Discord**: Share in the plugins channel
5. **Dev.to**: Write a tutorial blog post

Enjoy your published plugin! 🎉
