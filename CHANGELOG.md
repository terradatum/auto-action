# v1.0.12 (Thu May 21 2020)

#### 🐛 Bug Fix

- Detect "package.json" to determine how to run auto [#118](https://github.com/terradatum/auto-action/pull/118) ([@rbellamy](https://github.com/rbellamy))
- Replace dependabot with renovate ([@rbellamy](https://github.com/rbellamy))

#### Authors: 1

- G. Richard Bellamy ([@rbellamy](https://github.com/rbellamy))

---

# v1.0.11 (Fri Apr 10 2020)

#### 🐛 Bug Fix

- Dependabot/merge [#41](https://github.com/terradatum/auto-action/pull/41) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@rbellamy](https://github.com/rbellamy))
- Merge remote-tracking branch 'origin/dependabot/npm_and_yarn/types/node-13.11.1' into dependabot/merge [#40](https://github.com/terradatum/auto-action/pull/40) ([@rbellamy](https://github.com/rbellamy))
- Merge remote-tracking branch 'origin/dependabot/npm_and_yarn/jest-circus-25.3.0' into dependabot/merge [#39](https://github.com/terradatum/auto-action/pull/39) ([@rbellamy](https://github.com/rbellamy))
- Merge remote-tracking branch 'origin/dependabot/npm_and_yarn/jest-25.3.0' into dependabot/merge [#36](https://github.com/terradatum/auto-action/pull/36) ([@rbellamy](https://github.com/rbellamy))
- Merge remote-tracking branch 'origin/dependabot/npm_and_yarn/auto-it/released-9.26.8' into dependabot/merge [#35](https://github.com/terradatum/auto-action/pull/35) ([@rbellamy](https://github.com/rbellamy))
- Merge remote-tracking branch 'origin/dependabot/npm_and_yarn/auto-it/npm-9.26.8' into dependabot/merge [#38](https://github.com/terradatum/auto-action/pull/38) ([@rbellamy](https://github.com/rbellamy))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- G. Richard Bellamy ([@rbellamy](https://github.com/rbellamy))

---

# v1.0.10 (Wed Apr 08 2020)

#### 🐛 Bug Fix

- Merge branch 'master' into fix-verbose-flag-on-step-debug [#30](https://github.com/terradatum/auto-action/pull/30) ([@rbellamy](https://github.com/rbellamy))
- Merge branch 'dependabot/npm_and_yarn/eslint-6.8.0' [#32](https://github.com/terradatum/auto-action/pull/32) ([@rbellamy](https://github.com/rbellamy))
- Merge branch 'dependabot/npm_and_yarn/auto-it/released-9.26.7' [#33](https://github.com/terradatum/auto-action/pull/33) ([@rbellamy](https://github.com/rbellamy))
- Merge branch 'dependabot/npm_and_yarn/auto-it/npm-9.26.7' [#34](https://github.com/terradatum/auto-action/pull/34) ([@rbellamy](https://github.com/rbellamy))
- Bump auto from 9.26.4 to 9.26.7 [#31](https://github.com/terradatum/auto-action/pull/31) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- G. Richard Bellamy ([@rbellamy](https://github.com/rbellamy))

---

# v1.0.9 (Tue Apr 07 2020)

#### 🐛 Bug Fix

- The working directory is set to GITHUB_WORKSPACE [#29](https://github.com/terradatum/auto-action/pull/29) ([@rbellamy](https://github.com/rbellamy))
- Merge branch 'master' into dependabot/npm_and_yarn/jest-circus-25.2.7 [#25](https://github.com/terradatum/auto-action/pull/25) ([@rbellamy](https://github.com/rbellamy))

#### ⚠️  Pushed to `master`

- Bump jest-circus to 25.2.7. ts-jest 25.3.1 works. ([@rbellamy](https://github.com/rbellamy))
- Update CHANGELOG to remove empty entries ([@rbellamy](https://github.com/rbellamy))

#### Authors: 1

- G. Richard Bellamy ([@rbellamy](https://github.com/rbellamy))

---

# v1.0.8 (Mon Apr 06 2020)

#### 🐛 Bug Fix

- Must have git history in checkout [#23](https://github.com/terradatum/auto-action/pull/23) ([@rbellamy](https://github.com/rbellamy))

#### Authors: 1

- G. Richard Bellamy ([@rbellamy](https://github.com/rbellamy))

---

# v1.0.3 (Mon Apr 06 2020)

#### 🐛 Bug Fix

- Mark the package as public [#7](https://github.com/terradatum/auto-action/pull/7) ([@rbellamy](https://github.com/rbellamy))

#### Authors: 1

- G. Richard Bellamy ([@rbellamy](https://github.com/rbellamy))

---

# v1.0.2 (Sun Apr 05 2020)

#### 🐛 Bug Fix

- Update package version. [#6](https://github.com/terradatum/auto-action/pull/6) ([@rbellamy](https://github.com/rbellamy))
- Update to new minimum version for auto = 9.26.0 [#5](https://github.com/terradatum/auto-action/pull/5) ([@rbellamy](https://github.com/rbellamy))
- Update to shipit and latest command line [#5](https://github.com/terradatum/auto-action/pull/5) ([@rbellamy](https://github.com/rbellamy))
- Use a sane workingDirectory for CWD [#4](https://github.com/terradatum/auto-action/pull/4) ([@rbellamy](https://github.com/rbellamy))
- Try a a different approach to stdout/stderr and exit codes. [#3](https://github.com/terradatum/auto-action/pull/3) ([@rbellamy](https://github.com/rbellamy))
- Fix tests to run with ACTIONS_STEP_DEBUGGING. Update workflows [#2](https://github.com/terradatum/auto-action/pull/2) ([@rbellamy](https://github.com/rbellamy))
- Run "npm ci" to ensure "npx auto" will work. [#1](https://github.com/terradatum/auto-action/pull/1) ([@rbellamy](https://github.com/rbellamy))

#### ⚠️  Pushed to `master`

- Update package name to @terradatum/auto-action ([@rbellamy](https://github.com/rbellamy))
- Add NPM_TOKEN so the npm plugin will work. ([@rbellamy](https://github.com/rbellamy))
- Configure name and email ([@rbellamy](https://github.com/rbellamy))
- Initial commit. ([@rbellamy](https://github.com/rbellamy))

#### Authors: 1

- G. Richard Bellamy ([@rbellamy](https://github.com/rbellamy))
