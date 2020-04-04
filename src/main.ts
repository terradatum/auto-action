import * as core from '@actions/core'
import * as inputHelper from './input-helper'
import * as outputHelper from './output-helper'
import * as autoCommandManager from './auto-command-manager'
import {AutoCommand} from './auto-command-manager'
import {AutoOutputs} from './auto-outputs'
import {SemVer} from 'semver'

async function run(): Promise<void> {
  const settings = inputHelper.getInputs()

  try {
    const commandManager = await autoCommandManager.createCommandManager(
      settings.repo,
      settings.owner,
      settings.githubApi,
      settings.plugins
    )

    let stdout = await commandManager.version(
      settings.onlyPublishWithReleaseLabel,
      settings.from
    )
    let autoOutputs = new AutoOutputs()
    autoOutputs.version = new SemVer(stdout)
    core.info(String(autoOutputs))
    core.startGroup('Starting the run of auto')
    switch (settings.command) {
      // Setup Commands
      case AutoCommand.info: {
        stdout = await commandManager.info(settings.listPlugins)
        core.info(stdout)
        break
      }
      // Publishing
      case AutoCommand.changelog: {
        await commandManager.changelog(
          settings.dryRun,
          settings.noVersionPrefix,
          settings.name,
          settings.email,
          settings.from,
          settings.to,
          settings.title,
          settings.message,
          settings.baseBranch
        )
        break
      }
      case AutoCommand.release: {
        await commandManager.release(
          settings.dryRun,
          settings.noVersionPrefix,
          settings.name,
          settings.email,
          settings.from,
          settings.useVersion,
          settings.baseBranch,
          settings.preRelease
        )
        break
      }
      case AutoCommand.shipit: {
        await commandManager.shipit(
          settings.dryRun,
          settings.baseBranch,
          settings.onlyGraduateWithReleaseLabel
        )
        break
      }
      case AutoCommand.latest: {
        await commandManager.latest(settings.dryRun, settings.baseBranch)
        break
      }
      case AutoCommand.next: {
        await commandManager.next(settings.dryRun, settings.message)
        break
      }
      case AutoCommand.canary: {
        await commandManager.canary(
          settings.dryRun,
          settings.pr,
          settings.build,
          settings.message,
          settings.force
        )
        break
      }
      // PR Interaction
      case AutoCommand.label: {
        await commandManager.label(settings.pr)
        break
      }
      case AutoCommand.prStatus: {
        await commandManager.prStatus(
          settings.dryRun,
          settings.pr,
          settings.context,
          settings.url,
          settings.sha,
          settings.state,
          settings.description
        )
        break
      }
      case AutoCommand.prCheck: {
        await commandManager.prCheck(
          settings.dryRun,
          settings.pr,
          settings.context,
          settings.url
        )
        break
      }
      case AutoCommand.prBody: {
        await commandManager.prBody(
          settings.dryRun,
          settings.pr,
          settings.context,
          settings.message
        )
        break
      }
      case AutoCommand.comment: {
        await commandManager.comment(
          settings.dryRun,
          settings.pr,
          settings.context,
          settings.message,
          settings.edit,
          settings.del
        )
        break
      }
    }
    core.endGroup()
    outputHelper.setOutputs(autoOutputs)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
