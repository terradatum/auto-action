import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import {SemVer} from 'semver'
import semver from 'semver/preload'
import {ExecOptions} from '@actions/exec/lib/interfaces'

export const MinimumAutoVersion = new SemVer('9.26.0')

export interface IAutoCommandManager {
  // Setup commands
  info(listPlugins: boolean): Promise<string>

  // Release commands
  version(onlyPublishWithReleaseVersion: boolean, from: string): Promise<string>

  changelog(
    dryRun: boolean,
    noVersionPrefix: boolean,
    name: string,
    email: string,
    from: string,
    to: string,
    title: string,
    message: string,
    baseBranch: string
  ): Promise<void>

  release(
    dryRun: boolean,
    noVersionPrefix: boolean,
    name: string,
    email: string,
    from: string,
    useVersion: string,
    baseBranch: string,
    preRelease: boolean
  ): Promise<void>

  shipit(
    dryRun: boolean,
    noVersionPrefix: boolean,
    name: string,
    email: string,
    useVersion: string,
    title: string,
    message: string,
    baseBranch: string,
    preRelease: boolean,
    onlyPublishWithReleaseLabel: boolean,
    onlyGraduateWithReleaseLabel: boolean
  ): Promise<void>

  latest(
    dryRun: boolean,
    noVersionPrefix: boolean,
    name: string,
    email: string,
    useVersion: string,
    title: string,
    message: string,
    baseBranch: string,
    preRelease: boolean,
    onlyPublishWithReleaseLabel: boolean
  ): Promise<void>

  next(dryRun: boolean, message: string): Promise<void>

  canary(
    dryRun: boolean,
    pr: number,
    build: string,
    message: string,
    force: boolean
  ): Promise<void>

  // Pull Request Interaction commands
  label(pr: number): Promise<string>

  prStatus(
    dryRun: boolean,
    pr: number,
    context: string,
    url: string,
    sha: string,
    state: PrState,
    description: string
  ): Promise<void>

  prCheck(
    dryRun: boolean,
    pr: number,
    context: string,
    url: string
  ): Promise<string>

  prBody(
    dryRun: boolean,
    pr: number,
    context: string,
    message: string
  ): Promise<void>

  comment(
    dryRun: boolean,
    pr: number,
    context: string,
    message: string,
    edit: boolean,
    del: boolean
  ): Promise<void>
}

export async function createCommandManager(
  workingDirectory: string,
  repo: string,
  owner: string,
  githubApi: string,
  plugins: string[]
): Promise<IAutoCommandManager> {
  return await AutoCommandManager.createCommandManager(
    workingDirectory,
    repo,
    owner,
    githubApi,
    plugins
  )
}

class AutoCommandManager implements IAutoCommandManager {
  private workingDirectory: string = ''
  private autoEnv: {} = {}
  private autoCommand: string = ''
  private globalArgs: string[] = []
  private useNpmAuto: boolean = false

  constructor() {}

  static async createCommandManager(
    workingDirectory: string,
    repo: string,
    owner: string,
    githubApi: string,
    plugins: string[]
  ): Promise<AutoCommandManager> {
    const result = new AutoCommandManager()
    await result.initializeCommandManager(
      workingDirectory,
      repo,
      owner,
      githubApi,
      plugins
    )
    return result
  }

  private static commonChangelogReleaseArgs(
    args: string[],
    dryRun: boolean,
    noVersionPrefix: boolean,
    name: string,
    email: string,
    from: string,
    baseBranch: string = ''
  ) {
    if (dryRun) {
      args.push('--dry-run')
    }
    if (noVersionPrefix) {
      args.push('--no-version-prefix')
    }
    if (name) {
      args.push('--name', name)
    }
    if (email) {
      args.push('--email', email)
    }
    if (from) {
      args.push('--from', from)
    }
    if (baseBranch) {
      args.push('--base-branch', baseBranch)
    }
  }

  private static commonPrArgs(
    args: string[],
    dryRun: boolean,
    pr: number,
    context: string
  ) {
    if (dryRun) {
      args.push('--dry-run')
    }
    if (pr > 0) {
      args.push('--pr', pr.toString())
    }
    if (context) {
      args.push('--context', context)
    }
  }

  async info(listPlugins: boolean): Promise<string> {
    const args: string[] = [AutoCommand.info]
    if (listPlugins) {
      args.push('--list-plugins')
    }
    const output = await this.execAuto(args)
    return output.stdout
  }

  async version(
    onlyPublishWithReleaseVersion: boolean,
    from: string
  ): Promise<string> {
    const args = ['version']
    if (onlyPublishWithReleaseVersion) {
      args.push('--only-publish-with-release-label')
    }
    if (from) {
      args.push('--from', from)
    }
    const autoExecOutput = await this.execAuto(args)
    if (autoExecOutput.exitCode === 0) {
      core.info(autoExecOutput.stdout)
      core.debug(autoExecOutput.stderr)
    } else {
      core.error(autoExecOutput.stdout)
      core.error(autoExecOutput.stderr)
      throw new Error('auto did not complete successfully.')
    }
    return autoExecOutput.stdout
  }

  async changelog(
    dryRun: boolean,
    noVersionPrefix: boolean,
    name: string,
    email: string,
    from: string,
    to: string,
    title: string,
    message: string,
    baseBranch: string
  ): Promise<void> {
    const args: string[] = [AutoCommand.changelog]
    AutoCommandManager.commonChangelogReleaseArgs(
      args,
      dryRun,
      noVersionPrefix,
      name,
      email,
      from,
      baseBranch
    )
    if (to) {
      args.push('--to', to)
    }
    if (title) {
      args.push('--title', title)
    }
    if (message) {
      args.push('--message', message)
    }
    await this.execAuto(args)
  }

  async release(
    dryRun: boolean,
    noVersionPrefix: boolean,
    name: string,
    email: string,
    from: string,
    useVersion: string,
    baseBranch: string,
    preRelease: boolean
  ): Promise<void> {
    const args: string[] = [AutoCommand.release]
    AutoCommandManager.commonChangelogReleaseArgs(
      args,
      dryRun,
      noVersionPrefix,
      name,
      email,
      from,
      baseBranch
    )
    if (useVersion) {
      args.push('--use-version', useVersion)
    }
    if (preRelease) {
      args.push('--pre-release')
    }
    await this.execAuto(args)
  }

  async shipit(
    dryRun: boolean,
    noVersionPrefix: boolean,
    name: string,
    email: string,
    useVersion: string,
    title: string,
    message: string,
    baseBranch: string,
    preRelease: boolean,
    onlyPublishWithReleaseLabel: boolean,
    onlyGraduateWithReleaseLabel: boolean
  ): Promise<void> {
    const args: string[] = [AutoCommand.shipit]
    this.commonShipitLatestArgs(
      args,
      dryRun,
      noVersionPrefix,
      name,
      email,
      useVersion,
      title,
      message,
      baseBranch,
      onlyPublishWithReleaseLabel
    )
    if (onlyGraduateWithReleaseLabel) {
      args.push('--only-graduate-with-release-label')
    }
    await this.execAuto(args)
  }

  private commonShipitLatestArgs(
    args: string[],
    dryRun: boolean,
    noVersionPrefix: boolean,
    name: string,
    email: string,
    useVersion: string,
    title: string,
    message: string,
    baseBranch: string,
    onlyPublishWithReleaseLabel: boolean
  ) {
    if (dryRun) {
      args.push('--dry-run')
    }
    if (noVersionPrefix) {
      args.push('--no-version-prefix')
    }
    if (name) {
      args.push('--name', name)
    }
    if (email) {
      args.push('--email', email)
    }
    if (useVersion) {
      args.push('--use-version', useVersion)
    }
    if (title) {
      args.push('--title', title)
    }
    if (message) {
      args.push('--message', message)
    }
    if (baseBranch) {
      args.push('--base-branch', baseBranch)
    }
    if (onlyPublishWithReleaseLabel) {
      args.push('--only-publish-with-release-label')
    }
  }

  async next(dryRun: boolean, message: string): Promise<void> {
    const args: string[] = [AutoCommand.next]
    if (dryRun) {
      args.push('--dry-run')
    }
    if (message) {
      args.push('--message', message)
    }
    await this.execAuto(args)
  }

  async canary(
    dryRun: boolean,
    pr: number,
    build: string,
    message: string,
    force: boolean
  ): Promise<void> {
    const args: string[] = [AutoCommand.canary]
    if (dryRun) {
      args.push('--dry-run')
    }
    if (pr > 0) {
      args.push('--pr', pr.toString())
    }
    if (build) {
      args.push('--build', build)
    }
    if (message) {
      args.push('--message', message)
    }
    if (force) {
      args.push('--force')
    }
    await this.execAuto(args)
  }

  async label(pr: number): Promise<string> {
    const args: string[] = [AutoCommand.label]
    if (pr > 0) {
      args.push('--pr', pr.toString())
    }
    const autoExecOutput = await this.execAuto(args)
    if (autoExecOutput.exitCode === 0) {
      core.info(autoExecOutput.stdout)
      core.debug(autoExecOutput.stderr)
    } else {
      core.error(autoExecOutput.stdout)
      core.error(autoExecOutput.stderr)
      throw new Error('auto did not complete successfully.')
    }
    return autoExecOutput.stdout
  }

  async latest(
    dryRun: boolean,
    noVersionPrefix: boolean,
    name: string,
    email: string,
    useVersion: string,
    title: string,
    message: string,
    baseBranch: string,
    preRelease: boolean,
    onlyPublishWithReleaseLabel: boolean
  ): Promise<void> {
    const args: string[] = [AutoCommand.latest]
    this.commonShipitLatestArgs(
      args,
      dryRun,
      noVersionPrefix,
      name,
      email,
      useVersion,
      title,
      message,
      baseBranch,
      onlyPublishWithReleaseLabel
    )
    await this.execAuto(args)
  }

  async prStatus(
    dryRun: boolean,
    pr: number,
    context: string,
    url: string,
    sha: string,
    state: PrState,
    description: string
  ): Promise<void> {
    const args: string[] = [AutoCommand.prStatus]
    AutoCommandManager.commonPrArgs(args, dryRun, pr, context)
    if (url) {
      args.push('--url', url)
    }
    if (sha) {
      args.push('--sha', sha)
    }
    if (state) {
      args.push('--state', state)
    }
    if (description) {
      args.push('--description', description)
    }
    this.execAuto(args)
  }

  async prCheck(
    dryRun: boolean,
    pr: number,
    context: string,
    url: string
  ): Promise<string> {
    const args: string[] = [AutoCommand.prCheck]
    AutoCommandManager.commonPrArgs(args, dryRun, pr, context)
    if (url) {
      args.push('--url', url)
    }
    const output = await this.execAuto(args)
    return output.stdout
  }

  async prBody(
    dryRun: boolean,
    pr: number,
    context: string,
    message: string
  ): Promise<void> {
    const args: string[] = [AutoCommand.prBody]
    AutoCommandManager.commonPrArgs(args, dryRun, pr, context)
    if (message) {
      args.push('--message', message)
    }
    this.execAuto(args)
  }

  async comment(
    dryRun: boolean,
    pr: number,
    context: string,
    message: string,
    edit: boolean,
    del: boolean
  ): Promise<void> {
    const args: string[] = [AutoCommand.comment]
    AutoCommandManager.commonPrArgs(args, dryRun, pr, context)
    if (message) {
      args.push('--message', message)
    }
    if (edit) {
      args.push('--edit')
    }
    if (del) {
      args.push('--delete')
    }
    this.execAuto(args)
  }

  private async execAuto(
    args: string[],
    allowAllExitCodes = false
  ): Promise<AutoExecOutput> {
    const result = new AutoExecOutput()
    let execArgs: string[]
    let stdout: string[] = []
    let stderr = ([] = [])
    const env = this.getEnv()
    if (core.isDebug()) {
      execArgs = ['-vv', ...args, ...this.globalArgs]
    } else {
      execArgs = [...args, ...this.globalArgs]
    }
    this.useNpmAuto && execArgs.unshift('auto')
    const options = this.getExecOptions(
      this.workingDirectory,
      stdout,
      stderr,
      env,
      allowAllExitCodes
    )

    result.exitCode = await exec.exec(
      `"${this.autoCommand}"`,
      execArgs,
      options
    )
    result.stdout = stdout.join('')
    result.stderr = stderr.join('')
    return result
  }

  private getEnv() {
    const env = {}
    for (const key of Object.keys(process.env)) {
      env[key] = process.env[key]
    }
    for (const key of Object.keys(this.autoEnv)) {
      env[key] = this.autoEnv[key]
    }
    return env
  }

  private getExecOptions(
    workingDirectory: string,
    stdout: string[],
    stderr: string[],
    env: {} = {},
    allowAllExitCodes: boolean = false
  ): ExecOptions {
    return {
      cwd: workingDirectory,
      env,
      ignoreReturnCode: allowAllExitCodes,
      listeners: {
        stdout: (data: Buffer) => {
          stdout.push(data.toString())
        },
        stderr: (data: Buffer) => {
          stderr.push(data.toString())
        }
      }
    }
  }

  private async initializeCommandManager(
    workingDirectory: string,
    repo: string,
    owner: string,
    githubApi: string,
    plugins: string[]
  ): Promise<void> {
    this.workingDirectory = workingDirectory
    try {
      this.autoCommand = await io.which('npx', true)
      const stdout: string[] = []
      const env = this.getEnv()
      const options = this.getExecOptions(
        this.workingDirectory,
        stdout,
        [],
        env
      )
      const args = ['ci', '--only=prod']
      await exec.exec('"npm"', args, options)
      core.info(stdout?.join(''))
      this.useNpmAuto = true
    } catch (npxError) {
      try {
        this.autoCommand = await io.which('auto', true)
      } catch (autoError) {
        throw new Error(
          'Unable to locate executable file for either npx or auto'
        )
      }
    }
    if (repo) {
      this.globalArgs.push('--repo', repo)
    }
    if (owner) {
      this.globalArgs.push('--owner', owner)
    }
    if (githubApi) {
      this.globalArgs.push('--githubApi', githubApi)
    }
    if (plugins && plugins.length > 0) {
      this.globalArgs.push('--plugins', ...plugins)
    }
    core.debug('Getting auto version')
    let autoVersion: SemVer
    let autoOutput = await this.execAuto(['--version'])
    let stdout = autoOutput.stdout.trim()
    if (!stdout.includes('\n')) {
      const match = stdout.match(/\d+\.\d+(\.\d+)?/)
      if (!match || !semver.valid(match[0])) {
        throw new Error('Unable to determine the auto version')
      } else {
        autoVersion = new SemVer(match[0])
        if (autoVersion < MinimumAutoVersion) {
          throw new Error(
            `Minimum required auto version is ${MinimumAutoVersion}. Your auto ('${this.autoCommand}') is ${autoVersion}`
          )
        }
      }
    }
  }
}

export enum AutoCommand {
  // Setup commands
  info = 'info',
  // Publishing commands
  //version = 'version',
  changelog = 'changelog',
  release = 'release',
  shipit = 'shipit',
  latest = 'latest',
  next = 'next',
  canary = 'canary',
  // PR Interaction
  label = 'label',
  prStatus = 'pr-status',
  prCheck = 'pr-check',
  prBody = 'pr-body',
  comment = 'comment'
}

export enum PrState {
  // ['pending', 'success', 'error', 'failure']
  pending = 'pending',
  success = 'success',
  error = 'error',
  failure = 'failure'
}

export class AutoExecOutput {
  stdout = ''
  stderr = ''
  exitCode = 0
}
