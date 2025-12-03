# 📤 Upload Project to GitHub

## Step-by-Step Guide

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **"+"** icon → **"New repository"**
3. Repository name: `Agentic_Automation_Workflow_Builder`
4. Description: `AI-Powered Workflow Automation Platform with Email Scheduling`
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

### Step 2: Initialize Git (if not already done)

Open terminal in your project root and run:

```bash
git init
```

### Step 3: Add All Files

```bash
git add .
```

### Step 4: Commit Your Changes

```bash
git commit -m "Initial commit: Workflow Automation Platform with email scheduling, Google OAuth, and role-based access"
```

### Step 5: Add Remote Repository

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/Agentic_Automation_Workflow_Builder.git
```

### Step 6: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

---

## Complete Command Sequence

Copy and paste these commands (replace YOUR_USERNAME):

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Workflow Automation Platform"

# Add remote (REPLACE YOUR_USERNAME!)
git remote add origin https://github.com/YOUR_USERNAME/Agentic_Automation_Workflow_Builder.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## If You Get Authentication Error

### Option 1: Use Personal Access Token (Recommended)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "Workflow Automation Upload"
4. Select scopes: `repo` (full control)
5. Click "Generate token"
6. Copy the token (you won't see it again!)
7. When pushing, use token as password:
   - Username: your GitHub username
   - Password: paste the token

### Option 2: Use GitHub CLI

```bash
# Install GitHub CLI first: https://cli.github.com/
gh auth login
gh repo create Agentic_Automation_Workflow_Builder --public --source=. --remote=origin --push
```

---

## Verify Upload

1. Go to `https://github.com/YOUR_USERNAME/Agentic_Automation_Workflow_Builder`
2. Check that all files are uploaded
3. Verify `.env` files are NOT uploaded (protected by .gitignore)

---

## Important Security Notes

✅ **Protected files (NOT uploaded):**
- `backend/.env` - Contains sensitive SMTP credentials
- `Mini_Project-main/Blank-main/.env` - Contains Google Client ID
- `node_modules/` - Dependencies (too large)
- `venv/` - Python virtual environment
- `__pycache__/` - Python cache files

✅ **Safe to upload:**
- `backend/.env.example` - Template without sensitive data
- All source code
- README.md and documentation
- Configuration files

---

## After Upload

### Update README with Your Repository

Add this badge to your README.md:

```markdown
[![GitHub](https://img.shields.io/badge/GitHub-Agentic_Automation_Workflow_Builder-blue?logo=github)](https://github.com/YOUR_USERNAME/Agentic_Automation_Workflow_Builder)
```

### Share Your Project

Your repository URL:
```
https://github.com/YOUR_USERNAME/Agentic_Automation_Workflow_Builder
```

---

## Troubleshooting

### "Repository already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/Agentic_Automation_Workflow_Builder.git
git push -u origin main
```

### "Permission denied"
- Use Personal Access Token instead of password
- Or use SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### "Large files detected"
- Check .gitignore is working
- Remove large files: `git rm --cached <file>`

---

**Ready to deploy?** After pushing to GitHub, follow `RENDER_DEPLOYMENT.md` to deploy on Render!
