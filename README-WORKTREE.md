# Worktree – mirror of main

**Main is the only source of truth.**

This folder is a one-way mirror of the main repo. Do not use it as the source for commits.

- **Commit and push from:** `/Users/danid/Hello-Gorgeous-Med-Spa/hello-gorgeous-med-spa`
- **To refresh this worktree from main** (so Cursor matches main):

```bash
MAIN="/Users/danid/Hello-Gorgeous-Med-Spa/hello-gorgeous-med-spa"
WT="/Users/danid/.cursor/worktrees/Hello-Gorgeous-Med-Spa/gzh/hello-gorgeous-med-spa"
rsync -a --delete \
  --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='.vercel' \
  --exclude='.env.local' --exclude='.env' --exclude='*.local' \
  "$MAIN/" "$WT/"
```
