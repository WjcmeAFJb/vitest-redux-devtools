# Releasing

Two artifacts ship per release:

- `vitest-redux-devtools-proxy-<ver>.tgz` — npm tarball for the proxy package
- `vitest-redux-devtools-<ver>.vsix` — VSCode extension installer

Both go into `releases/v<ver>/`.

## Building the artifacts

```bash
pnpm install
pnpm -r build

# proxy tarball
pnpm --filter @vitest-redux-devtools/proxy pack \
  --pack-destination releases/v<ver>

# extension vsix
cd packages/vscode-extension
pnpm dlx @vscode/vsce package --no-dependencies --skip-license \
  -o ../../releases/v<ver>/vitest-redux-devtools-<ver>.vsix
```

Bump the `version` in both `packages/proxy/package.json` and
`packages/vscode-extension/package.json` to keep them aligned.

## Publishing to GitHub Releases

```bash
gh release create v<ver> \
  releases/v<ver>/vitest-redux-devtools-proxy-<ver>.tgz \
  releases/v<ver>/vitest-redux-devtools-<ver>.vsix \
  --title "v<ver>" \
  --notes "…"
```

Once uploaded, the public download URLs are:

```
https://github.com/<owner>/<repo>/releases/download/v<ver>/vitest-redux-devtools-proxy-<ver>.tgz
https://github.com/<owner>/<repo>/releases/download/v<ver>/vitest-redux-devtools-<ver>.vsix
```

## Pointing consumers at a release

`examples/installed/package.json` uses a relative `file:` path during
development. To consume from a real release, change one line:

```diff
-"@vitest-redux-devtools/proxy": "file:../../releases/v0.1.0/vitest-redux-devtools-proxy-0.1.0.tgz"
+"@vitest-redux-devtools/proxy": "https://github.com/<owner>/<repo>/releases/download/v0.1.0/vitest-redux-devtools-proxy-0.1.0.tgz"
```

pnpm fetches and caches the tarball — no extra registry config needed.

For the `.vsix`: download manually, then in VSCode
**Extensions: Install from VSIX…**, or `code --install-extension <path>` from
the CLI. There is no equivalent of `npm install` for `.vsix` files.

## Notes

- vsce warns about the missing `repository` field. Add one to
  `packages/vscode-extension/package.json` once the project has a real
  git remote, or pass `--allow-missing-repository` to silence it.
- The `publisher` field is `local`, which is fine for unsigned VSIX
  distribution. To publish to the marketplace, register a publisher and
  update the field.
