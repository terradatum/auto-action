import {AutoCommand, PrState} from './auto-command-manager'

export interface IAutoSettings {
  /**
   * Commands to run
   */
  command: AutoCommand

  /**
   * The repo to set status on. Defaults to looking in the package definition for the platform
   */
  repo: string

  /**
   * The owner of the GitHub repo. Defaults to reading from the package definition for the platform
   */
  owner: string

  /**
   * The url to GitHub Enterprise API
   */
  githubApi: string

  /**
   * The plugins to use. Defaults to just npm
   */
  plugins: string[]

  /**
   * Dry run - report what a command would do, but don't do it
   */
  dryRun: boolean

  /**
   * The base branch considered "master"
   */
  baseBranch: string

  /**
   * Tag to start the CHANGELOG notes from
   */
  from: string

  /**
   * Only PRs merged with "release" label will generate a "latest" release.
   */
  onlyGraduateWithReleaseLabel: boolean

  /**
   * Only bump version if 'release' label is on pull request
   */
  onlyPublishWithReleaseLabel: boolean

  /**
   * The name to use with git
   */
  name: string

  /**
   * The email to use with git
   */
  email: string

  /**
   * Use the version tag without the prefix
   */
  noVersionPrefix: boolean

  /**
   * Tag to end changelog generation on
   */
  to: string

  /**
   * Override the default title of the CHANGELOG entry
   */
  title: string

  /**
   * changelog: message to commit to the changelog
   * next: Message used when attaching the prerelease version to the PR
   * canary: Message to comment on PR with for canary release
   * pr-body: Message to post to PR Body
   * comment: Message to post to comment
   */
  message: string

  /**
   * PR number to use to create the canary version. Detected in CI env.
   */
  pr: number

  /**
   * Version number to publish as
   */
  useVersion: string

  /**
   * Publish a prerelease
   */
  preRelease: boolean

  /**
   * Build number to use to create the canary version. Detected in the CI env.
   */
  build: string

  /**
   * Force a canary release, even if the PR is marked to skip the release
   */
  force: boolean

  /**
   * A string label to differentiate this status from others
   */
  context: string

  /**
   * Url to associate with the status
   */
  url: string

  /**
   * Specify a custom git sha. Defaults to the HEAD for the git repo in the current repository.
   */
  sha: string

  /**
   * State of the PR. One of ['pending', 'success', 'error', 'failure']
   */
  state: PrState

  /**
   * Description of the status
   */
  description: string

  /**
   * Edit old comment
   */
  edit: boolean

  /**
   * Delete old comment
   */
  del: boolean

  /**
   * List installed plugins
   */
  listPlugins: boolean

  /**
   * Working directory
   */
  workingDirectory: string
}
