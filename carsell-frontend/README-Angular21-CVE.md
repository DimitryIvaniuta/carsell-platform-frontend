# CarSell Frontend — Angular 21 migration + CVE remediation playbook

This README gives a **repeatable, production-safe** way to:
- migrate the workspace to **Angular 21** (one major at a time),
- remove/mitigate the security advisories you reported (including **CVE-2026-23950** in `tar`),
- avoid common post-upgrade runtime errors (Material/CDK mismatch),
- keep installs stable behind corporate proxies/registries.

> Repo path in your case: `J:\carsell-platform-frontend\carsell-frontend`

---

## 1) Prerequisites

### Node / npm
Angular 21 works best with:
- Node **20.19+** or **22.12+**
- npm 10+ (npm 11 is fine)

Check:
```powershell
node -v
npm -v
```

### Clean working tree
Before migrations:
```powershell
git status
```
Commit or stash changes.

---

## 2) Fix “ETIMEDOUT registry … internal.api.openai.org” (if it happens)

If `npm install` / `npm ci` fails with `ETIMEDOUT` and the URL contains an internal registry,
your npm registry is pointed to a network you can’t reach.

Check registry:
```powershell
npm config get registry
```

Set public registry:
```powershell
npm config set registry https://registry.npmjs.org/
npm config get registry
```

Also check `.npmrc` in:
- project: `...\carsell-frontend\.npmrc`
- user: `C:\Users\<you>\.npmrc`

Remove/adjust any `registry=` / `@scope:registry=` lines if needed.

---

## 3) Angular migration to 21 (correct upgrade sequence)

Angular only supports upgrading **one major at a time**.

### 3.1 Migrate 19 → 20
```powershell
cd J:\carsell-platform-frontend\carsell-frontend
npx ng update @angular/cli@20 @angular/core@20
npm install
```

### 3.2 Migrate 20 → 21
```powershell
npx ng update @angular/cli@21 @angular/core@21
npm install
```

Verify:
```powershell
npx ng version
```

> If you hit peer dependency conflicts during update only:
```powershell
$env:NPM_CONFIG_LEGACY_PEER_DEPS="true"
npx ng update @angular/cli@20 @angular/core@20
npm install
npx ng update @angular/cli@21 @angular/core@21
npm install
Remove-Item Env:\NPM_CONFIG_LEGACY_PEER_DEPS
```

---

## 4) Fix runtime crash after upgrade: `afterRender` missing export

### Symptom
App fails on start with errors like:
- `No matching export ... afterRender`
- errors originating from `@angular/material` or `@angular/cdk`

### Root cause
**Angular major mismatch**: e.g. Angular 21 + Material/CDK 19.

### Fix
Keep **all** `@angular/*` packages on the **same major** (21.x):
```powershell
npm i -D @angular/material@^21 @angular/cdk@^21
```

Then clean install:
```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install
npm start
```

---

## 5) CVE remediation strategy (safe and repeatable)

### Rule 1 — Prefer upgrading the toolchain first
Most high vulnerabilities are **transitive** (Angular CLI / builders / npm toolchain).
So: **upgrade Angular/CLI/build tooling first**, then re-run audit.

### Rule 2 — Avoid `npm audit fix --force` unless you accept breaking changes
`--force` can jump majors / replace Angular CLI majors and break the workspace.

### Recommended workflow
```powershell
npm audit
npm audit fix
npm audit
```

If high issues remain: use targeted **overrides** (next section).

---

## 6) Fix CVE-2026-23950 (node-tar race condition on macOS APFS)

### What it is
A high severity race condition in `tar` (node-tar) when extracting archives on macOS APFS
due to Unicode ligature collisions. The fix is to run a patched `tar` version.

### Correct fix in this project
Your app doesn’t depend on `tar` directly — it’s pulled by:
`@angular/cli -> pacote -> tar`

**Mitigation:** enforce a patched `tar` via `npm overrides`.

In `package.json` keep (or add) these overrides:
```json
{
  "overrides": {
    "tar": "7.5.6",
    "cacache": { "tar": "7.5.6" },
    "node-gyp": { "tar": "7.5.6" }
  }
}
```

Then do a clean install so overrides apply:
```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install
npm audit
```

### Why `npm ls tar` shows “invalid … overridden”
`pacote@21.0.4` pins `tar` to **exactly** `7.5.3`. When you override to `7.5.6`,
npm marks it as “invalid/overridden” and `npm ls` exits with a non-zero code.

You have two valid approaches:

#### Option A (recommended): keep override, don’t use `npm ls` as a hard gate
Your installed `tar` is patched; `npm audit` is the meaningful gate.
Avoid using `npm ls` as a CI “must pass” step in this case.

#### Option B (cleanest): patch `pacote` to accept patched tar (removes “invalid”)
This makes npm happy and keeps you secure.

1) Install patch-package:
```powershell
npm i -D patch-package
```

2) Edit `node_modules/pacote/package.json` and change:
```json
"tar": "7.5.3"
```
to:
```json
"tar": "^7.5.4"
```

3) Create patch:
```powershell
npx patch-package pacote
```

4) Add postinstall script in `package.json`:
```json
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
```

5) Reinstall clean:
```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install
npm audit
```

---

## 7) Other CVEs you listed (what to do in this repo)

### `qs` DoS bypass (arrayLimit)
Pin via overrides (already present in your repo):
```json
"overrides": { "qs": "6.14.1" }
```

### `node-forge` ASN.1 validator desync
Pin via overrides (already present):
```json
"overrides": { "node-forge": "1.3.2" }
```

### `glob` CLI injection (older glob CLI)
If any transitive chain pulls old `glob`, pin in the specific parent that owns it.
Your repo pins `glob` in `@npmcli/package-json` and `cacache`:
```json
"overrides": {
  "@npmcli/package-json": { "glob": "10.5.0" },
  "cacache": { "glob": "10.5.0" }
}
```

### Angular SVG/MathML/XSS advisories
The correct mitigation is always:
- upgrade Angular to the **latest patch of the major** you are on (21.x),
- keep Material/CDK aligned to the same major.

---

## 8) Run the project

### Dev server
```powershell
npm start
```
This runs:
`ng serve --proxy-config proxy.conf.json`

Open:
- http://localhost:4200/

### Build
```powershell
npm run build
```

### Tests
```powershell
npm test
```

---

## 9) “Clean install” recipe (use after any dependency/security changes)

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm cache verify
npm install
npm audit
```

---

## 10) Security checklist for PR/CI

- ✅ `npm audit` has **0 high** (or an approved exception with justification)
- ✅ Angular versions are aligned (all `@angular/*` same major)
- ✅ `overrides` do not pin vulnerable versions (avoid “<= fixed version”)
- ✅ If using `patch-package`, patches are committed and `postinstall` exists

