# Branch Protection Setup

Configure in **GitHub → Settings → Branches → Add rule** for `main`:

- Require pull request before merging
- Required approvals: 1
- Require branch to be up to date
- Require status checks (if using CI)
- Do not allow bypassing
- Block direct pushes to main
