# Why admin changes aren’t showing on hellogorgeousmedspa.com

Your repo has **two** git setups:

1. **Outer repo** – `Hello-Gorgeous-Med-Spa` (root with `hello-gorgeous-med-spa` as a **submodule**).  
   The `.vercel` folder is here, so Vercel may be linked to this layout.

2. **Inner repo** – `hello-gorgeous-med-spa/` (the actual Next.js app).  
   We push to **GitHub** from here (`main` → `hello-gorgeous-med-spa/Hello-Gorgeous-Med-Spa`).

So: **pushes from the app folder update GitHub**, but **Vercel might be building from the outer repo** (which still points the submodule at an old commit). Until that’s fixed, the live site can show an old build.

---

## What to do in Vercel

1. **Project → Settings → Git**
   - **Production Branch:** must be `main`.
   - **Root Directory:** must be **empty** (not `hello-gorgeous-med-spa`).
     - The GitHub repo we push to has the **app at the repo root** (no subfolder).
     - If Root Directory is set to `hello-gorgeous-med-spa`, Vercel expects a different repo shape and the build won’t match our pushes.

2. **Confirm connected repo**
   - Connected repository should be: **hello-gorgeous-med-spa/Hello-Gorgeous-Med-Spa** (the same one we push to from the app folder).

3. **Redeploy**
   - **Deployments** → open the latest deployment → **Redeploy** (or push a small change to `main` and wait for the new deployment).

4. **Check which build is live**
   - Open **admin** (e.g. `/admin` or `/admin/settings`).
   - At the bottom you should see **Build: XXXXXXX** (first 7 chars of the git commit).
   - In Vercel **Deployments**, open the deployment that’s assigned to **Production** and compare the commit SHA with that Build value. They should match.

5. **Cache**
   - Do a hard refresh (e.g. Cmd+Shift+R) or use an incognito window when checking the admin.

---

## If you deploy with the CLI from the outer folder

If you run `vercel` or `vercel --prod` from the **outer** folder (`Hello-Gorgeous-Med-Spa`, not from `hello-gorgeous-med-spa/`):

- Vercel builds from that directory and uses the **submodule at the commit the outer repo has recorded**.
- We’ve updated that submodule reference locally to the latest app commit, but the outer repo has **no remote** and wasn’t pushed, so the **live site** won’t see that update until either:
  - You **don’t** use the outer folder for deploy and instead let Vercel build from **Git** (with Root Directory empty), or  
  - You add a remote to the outer repo, push it, and set Vercel’s Root Directory to `hello-gorgeous-med-spa` (then the live site would follow the outer repo’s submodule ref).

The simplest fix is: **use Git-based deploys** with **Root Directory** left **empty** so the repo we push to from the app folder is exactly what gets built and deployed.
