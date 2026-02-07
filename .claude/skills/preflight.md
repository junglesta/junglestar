# Preflight

Pre-deploy checklist. Run this before every production push.

## Steps

1. **Format** — `pnpm format`
2. **Lint** — `pnpm lint`
3. **Build** — `pnpm build`
4. **Preview** — `pnpm preview` (manual spot-check)
5. **Version bump** — update `version` in `package.json`
6. **Changelog** — update `CHANGELOG.md` with brief summary of changes
7. **Stop** — report summary of all changes and propose the commit message. Do NOT commit or push. Wait for human approval.

## Commit message format

```
3.5.7 | PWA installability
```

Keep it short. Version number, pipe, what changed.

## Notes

- Always use `pnpm`, never npm/yarn
- If `pnpm build` fails, run `pnpm buildwithtest` for detailed errors
- Check Netlify deploy status after push at the deploy_check URL
