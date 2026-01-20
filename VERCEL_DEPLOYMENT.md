# Vercel Deployment Guide with Environment Variables

## ⚠️ Security Warning
**NEVER commit API keys to GitHub!** The config.js file is already in .gitignore to prevent accidental commits.

## 🚀 Deployment Steps

### 1. Set Environment Variables in Vercel

After deploying to Vercel, go to your project settings:

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Add the following variables:**

   | Name | Value | Environment |
   |------|-------|-------------|
   | `GEMINI_API_KEY` | `your-real-gemini-key` (paste only inside Vercel) | Production, Preview, Development |
   | `WEATHER_API_KEY` | Your weather API key (optional) | Production, Preview, Development |

3. Click **Save**
4. **Redeploy** your application for changes to take effect

### 2. Update Your Code (Already Done)

The config.js file is in .gitignore, so it won't be pushed to GitHub.

### 3. For Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your actual API keys:
   ```
   GEMINI_API_KEY=your-real-gemini-key
   WEATHER_API_KEY=your_actual_key
   ```

3. The `.env` file is already in `.gitignore` so it won't be committed

### 4. Push to GitHub

Now you can safely push to GitHub:

```bash
git add .
git commit -m "Deploy to Vercel with environment variables"
git push origin main
```

## 🔒 Security Best Practices

✅ **Do:**
- Use Vercel Environment Variables for API keys
- Keep `.env` in `.gitignore`
- Use `.env.example` as a template (without real keys)
- Commit `config.template.js` (template without real keys)

❌ **Don't:**
- Never commit `.env` file
- Never commit `config.js` with real API keys
- Never hardcode API keys in source code

## 📝 How It Works

1. **Production (Vercel):** 
   - API keys are loaded from Vercel Environment Variables
   - Frontend accesses them via server-side rendering or API routes

2. **Development (Local):**
   - API keys are loaded from `config.js` (not committed)
   - `.env` file can be used for backend secrets

## 🔄 After Making Changes

1. Update environment variables in Vercel dashboard if needed
2. Trigger a new deployment in Vercel
3. Your API will work with the new keys

## ✅ Current Status

- ✅ `config.js` is in `.gitignore`
- ✅ `.env` is in `.gitignore`
- ✅ Template files are committed for reference
- ⚠️ Remember to set environment variables in Vercel Dashboard

---

**Need Help?**
- Vercel Env Vars Docs: https://vercel.com/docs/projects/environment-variables
- Gemini API Docs: https://ai.google.dev/docs
