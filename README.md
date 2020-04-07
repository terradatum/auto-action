# Auto Action

![Build and Release][workflows-badge-image]
[![Release date][release-date-image]][release-url]
[![auto-release][auto-image]][auto-url]
[![npm license][license-image]][license-url]

# Workflow

In general the workflow is:
1. `auto changelog`
2. `auto version`
3. Use the version from step 2 to bump the version in your package file (e.g. `package.json`, or `pom.xml`, etc.)
4. Publish the artifact
5. Push the new tag
6. `auto release`

*OR*
1. `auto shipit` _(which takes care of all the steps above)_

# Usage

If your project uses npm, this action will attempt to run auto using npx. If that fails, it will go looking in the $PATH
for a binary. If it finds neither, it will not run.

auto expects to have the full history and tags available for inspection, you must use `git fetch --unshallow --tags` when
checking out your code:

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v2
  - run: git fetch --unshallow --tags
```

<!-- start usage -->
```yaml
- uses: terradatum/auto-action@master
  with:
    # Choose one of the commands below.
    # Setup Commands
    # * info: Determine the environment and check if auto is set up correctly
    # Pull Request Interaction Commands
    # * label: Get the labels for a pull request. Doesn't do much, but the return
    # value lets you write you own scripts based off of the PR labels! * comment:
    # Comment on a pull request with a markdown message. Each comment has a context,
    # and each context only has one comment. * pr-check: Check that a pull request has
    # a SemVer label * pr-status: Set the status on a PR commit * pr-body: Update the
    # body of a PR with a message. Appends to PR and will not overwrite user content.
    # Each comment has a context, and each context only has one comment.
    # Release Commands
    # * version: Get the semantic version bump for the given changes. Requires all PRs
    # to have labels for the change type. If a PR does not have a label associated
    # with it, it will default to `patch`. * changelog: Prepend release notes to
    # `CHANGELOG.md`, create one if it doesn't exist, and commit the changes. *
    # release: Auto-generate a github release * shipit: Context aware publishing.
    #  1. call from base branch -> latest version released (LATEST)
    #  2. call from prerelease branch -> prerelease version released (NEXT)
    #  3. call from PR in CI -> canary version released (CANARY)
    #  4. call locally when not on base/prerelease branch -> canary version released
    # (CANARY)
    # * latest: Run the full `auto` release pipeline. Force a release to latest and
    # bypass `shipit` safeguards. * canary: Make a canary release of the project.
    # Useful on PRs. If ran locally, `canary` will release a canary version for your
    # current git HEAD. This is ran automatically from "shipit".
    #  1. In PR: 1.2.3-canary.123.0 + add version to PR body
    #  2. Locally: 1.2.3-canary.1810cfd
    # * next: Make a release for your "prerelease" release line. This is ran
    # automatically from "shipit".
    #  1. Creates a prerelease on package management platform
    #  2. Creates a "Pre Release" on GitHub releases page.
    #
    # Calling the `next` command from a prerelease branch will publish a prerelease,
    # otherwise it will publish to the default prerelease branch.
    #
    # Default: shipit
    command: ''

    # The repo to set status on. Defaults to looking in the package definition for the
    # platform. (global)
    repo: ''

    # The owner of the GitHub repo. Defaults to reading from the package definition
    # for the platform (global)
    owner: ''

    # The url to GitHub Enterprise API (global)
    github-api: ''

    # Plugins to load auto with. If running the binary distribution, the default
    # plugin is 'git-tag', if running from 'node_modules', then it's 'npm'. (global)
    plugins: ''

    # Report what a command will do but do not actually do anything. (changelog,
    # release, shipit, latest, next, canary)
    # Default: false
    dry-run: ''

    # Branch to treat as the 'master' branch. (changelog, release, shipit, latest)
    base-branch: ''

    # Tag to start the CHANGELOG notes from. Defaults to latest tag. (version,
    # changelog, release)
    from: ''

    # Make auto publish prerelease versions when merging to master. Only PRs merged
    # with "release" label will generate a "latest" release. Only use this flag if you
    # do not want to maintain a prerelease branch, and instead only want to use
    # master. (shipit)
    # Default: false
    only-graduate-with-release-label: ''

    # Only bump version if 'release' label is on pull request. (version, shipit)
    # Default: true
    only-publish-with-release-label: ''

    # The name to use with git. Defaults to package definitions for the platform.
    # (changelog, release)
    name: ''

    # Git email to commit with. Defaults to package definition for the platform
    # (changelog, release)
    email: ''

    # Use the version as the tag without the 'v' prefix. WARNING: some plugins might
    # need extra config to use this option (ex: npm). (changelog, release)
    # Default: false
    no-version-prefix: ''

    # Git revision (tag, commit sha, ...) to start release notes from. Defaults to
    # latest tag. (changelog)
    to: ''

    # Override the default title of the CHANGELOG entry.
    title: ''

    # Depending on the command:
    #  * changelog: message to commit to the changelog
    #  * next: Message used when attaching the prerelease version to the PR
    #  * canary: Message to comment on PR with for canary release
    #  * pr-body: Message to post to PR Body
    #  * comment: Message to post to comment
    message: ''

    # The pull request the command should use. Detects PR number in CI (defaults to
    # last merged PR). (canary, label, pr-status, pr-check, pr-body, comment)
    pr: ''

    # Version number to publish as. Defaults to reading from the package definition
    # for the platform. (release)
    use-version: ''

    # Publish a prerelease. (release)
    # Default: false
    pre-release: ''

    # Build number to use to create the canary version. Detected in CI env. (canary)
    build: ''

    # Force a canary release, even if the PR is marked to skip the release (canary)
    # Default: false
    force: ''

    # A string label to differentiate this status from others. (pr-status, pr-check,
    # pr-body, comment)
    context: ''

    # URL to associate with this status. (pr-status, pr-check)
    url: ''

    # Specify a custom git sha. Defaults to the HEAD for a git repo in the current
    # repository. (pr-status)
    sha: ''

    # State of the PR. ['pending', 'success', 'error', 'failure']. (pr-status)
    state: ''

    # A description of the status. (pr-status)
    description: ''

    # Edit an old comment. (pr-body)
    # Default: false
    edit: ''

    # Delete an old comment. (pr-body)
    # Default: false
    delete: ''
```
<!-- end usage -->

The action's configuration will always override the `.autorc` settings, with the exception of those options which are
[exclusive to `.autorc`][auto-exclusive-options] and not available via the command line.

[Make sure to read the `auto` documentation.][auto-docs]

## Make Latest Release

If your project is already published then you need to make sure that your last release is tagged and that it's the `Latest 
Release` on GitHub.

To tag your last release find that last commit where you bumped the version and run the following commands with your 
version number.

```shell script
git tag v1.2.3
git push --tags
```

Then on GitHub go to your project's releases and click Draft a new release. In the Tag version field enter the version 
number you just tagged and click `Publish release`.

Now your github project is set up to use auto.

## Basic Usage

Expects correct setup with an `.autorc` and correct values in your package control file (e.g. `package.json` or `pom.xml`).

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v2
  - run: git fetch --unshallow --tags
  - name: auto shipit
    uses: terradatum/auto-action@master
    env:
      GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Advanced Usage

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v2
  - run: git fetch --unshallow --tags
  - name: auto release
    uses: terradatum/auto-action@master
    env:
      GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
    with:
      email: kbaz@gmail.com
      name: Kathy Baz
      command: release
      plugins: |
        npm
        git-tag
        releases
```

## Changelog
See [CHANGELOG][changelog-url].

## License
This project is released under the [MIT License][license-url].

<!-- Links: -->
[workflows-badge-image]: https://github.com/terradatum/auto-action/workflows/Build%20and%20Release/badge.svg
[release-date-image]: https://img.shields.io/github/release-date/terradatum/auto-action
[release-url]: https://github.com/terradatum/auto-action/releases

[auto-image]: https://img.shields.io/badge/release-auto.svg?style=flat-square&colorA=888888&amp;colorB=9B065A&amp;label=auto&amp;logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACzElEQVR4AYXBW2iVBQAA4O+/nLlLO9NM7JSXasko2ASZMaKyhRKEDH2ohxHVWy6EiIiiLOgiZG9CtdgG0VNQoJEXRogVgZYylI1skiKVITPTTtnv3M7+v8UvnG3M+r7APLIRxStn69qzqeBBrMYyBDiL4SD0VeFmRwtrkrI5IjP0F7rjzrSjvbTqwubiLZffySrhRrSghBJa8EBYY0NyLJt8bDBOtzbEY72TldQ1kRm6otana8JK3/kzN/3V/NBPU6HsNnNlZAz/ukOalb0RBJKeQnykd7LiX5Fp/YXuQlfUuhXbg8Di5GL9jbXFq/tLa86PpxPhAPrwCYaiorS8L/uuPJh1hZFbcR8mewrx0d7JShr3F7pNW4vX0GRakKWVk7taDq7uPvFWw8YkMcPVb+vfvfRZ1i7zqFwjtmFouL72y6C/0L0Ie3GvaQXRyYVB3YZNE32/+A/D9bVLcRB3yw3hkRCdaDUtFl6Ykr20aaLvKoqIXUdbMj6GFzAmdxfWx9iIRrkDr1f27cFONGMUo/gRI/jNbIMYxJOoR1cY0OGaVPb5z9mlKbyJP/EsdmIXvsFmM7Ql42nEblX3xI1BbYbTkXCqRnxUbgzPo4T7sQBNeBG7zbAiDI8nWfZDhQWYCG4PFr+HMBQ6l5VPJybeRyJXwsdYJ/cRnlJV0yB4ZlUYtFQIkMZnst8fRrPcKezHCblz2IInMIkPzbbyb9mW42nWInc2xmE0y61AJ06oGsXL5rcOK1UdCbEXiVwNXsEy/6+EbaiVG8eeEAfxvaoSBnCH61uOD7BS1Ul8ESHBKWxCrdyd6EYNKihgEVrwOAbQruoytuBYIFfAc3gVN6iawhjKyNCEpYhVJXgbOzARyaU4hCtYizq5EI1YgiUoIlT1B7ZjByqmRWYbwtdYjoWoN7+LOIQefIqKawLzK6ID69GGpQgwhhEcwGGUzfEPAiPqsCXadFsAAAAASUVORK5CYII=
[auto-url]: https://github.com/intuit/auto

[license-image]: https://img.shields.io/npm/l/@terradatum/auto-action.svg
[license-url]: https://github.com/terradatum/auto-action/blob/master/LICENSE.md

[changelog-url]: https://github.com/terradatum/auto-action/blob/master/CHANGELOG.md

[auto-exclusive-options]: https://intuit.github.io/auto/pages/autorc.html#exclusive-options
[auto-docs]: https://intuit.github.io/auto/pages/introduction.html
