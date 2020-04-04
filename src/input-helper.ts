import * as core from '@actions/core'
import * as github from '@actions/github'
import * as fsHelper from './fs-helper'
import {IAutoSettings} from './auto-settings'
import {AutoCommand, PrState} from './auto-command-manager'
import * as path from 'path'

export function getInputs(): IAutoSettings {
  const result = ({} as unknown) as IAutoSettings

  // GitHub workspace
  let githubWorkspacePath = process.env['GITHUB_WORKSPACE']
  if (!githubWorkspacePath) {
    throw new Error('GITHUB_WORKSPACE not defined')
  }
  githubWorkspacePath = path.resolve(githubWorkspacePath)
  core.debug(`GITHUB_WORKSPACE = '${githubWorkspacePath}'`)
  fsHelper.directoryExistsSync(githubWorkspacePath, true)

  // Qualified repository
  const qualifiedRepository =
    core.getInput('repo') ||
    `${github.context.repo.owner}/${github.context.repo.repo}`
  core.debug(`qualified repository = '${qualifiedRepository}'`)
  const splitRepository = qualifiedRepository.split('/')
  if (
    splitRepository.length !== 2 ||
    !splitRepository[0] ||
    !splitRepository[1]
  ) {
    throw new Error(
      `Invalid repository '${qualifiedRepository}'. Expected format {owner}/{repo}.`
    )
  }
  const repoOwner = splitRepository[0]
  const repoName = splitRepository[1]

  result.command = AutoCommand[core.getInput('commands') || 'shipit']

  result.repo = core.getInput('repo') || repoName

  result.owner = core.getInput('owner') || repoOwner

  result.githubApi = core.getInput('githubApi')

  result.plugins = core
    .getInput('plugins')
    ?.split('\n')
    ?.filter(x => x !== '')

  result.dryRun = (core.getInput('dryRun') || 'false').toUpperCase() === 'TRUE'

  result.baseBranch = core.getInput('baseBranch')

  result.from = core.getInput('from')

  result.onlyGraduateWithReleaseLabel =
    (core.getInput('onlyGraduateWithReleaseLabel') || 'false').toUpperCase() ===
    'TRUE'

  result.onlyPublishWithReleaseLabel =
    (core.getInput('onlyPublishWithReleaseLabel') || 'true').toUpperCase() ===
    'TRUE'

  result.name = core.getInput('name')

  result.email = core.getInput('email')

  result.noVersionPrefix =
    (core.getInput('noVersionPrefix') || 'false').toUpperCase() === 'TRUE'

  result.to = core.getInput('to')

  result.title = core.getInput('title')

  result.message = core.getInput('message')

  result.pr = Math.floor(Number(core.getInput('pr') || '0'))
  if (isNaN(result.pr) || result.pr < 0) {
    result.pr = 0
  }

  result.useVersion = core.getInput('useVersion')

  result.preRelease =
    (core.getInput('preRelease') || 'false').toUpperCase() === 'TRUE'

  result.build = core.getInput('build')

  result.force = (core.getInput('force') || 'false').toUpperCase() === 'TRUE'

  result.context = core.getInput('context')

  result.url = core.getInput('url')

  result.sha = core.getInput('sha')

  result.state = core.getInput('state') ? PrState[core.getInput('state')] : null

  result.description = core.getInput('description')

  result.edit = (core.getInput('edit') || 'false').toUpperCase() === 'TRUE'

  result.del = (core.getInput('del') || 'false').toUpperCase() === 'TRUE'

  return result
}
