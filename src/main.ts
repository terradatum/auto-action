import * as core from '@actions/core'
import * as inputHelper from './input-helper'
import * as autoCommandManager from './auto-command-manager'
import {AutoCommand} from './auto-command-manager'

async function run(): Promise<void> {
  const settings = inputHelper.getInputs()

  try {
    core.debug(
      `Running auto with the following action settings:\n${JSON.stringify(
        settings
      )}`
    )
    const commandManager = await autoCommandManager.createCommandManager(
      settings.workingDirectory,
      settings.repo,
      settings.owner,
      settings.githubApi,
      settings.plugins
    )

    // TODO: Change the way stdout/stderr and exitCodes are handled
    const version = await commandManager.version(
      settings.onlyPublishWithReleaseLabel,
      settings.from
    )

    // NOTE: The version command doesn't return a semver - it returns the string indication of the KIND of semver bump
    //       E.g. major, minor, patch, etc.
    // TODO: Figure out what the semver will actually be

    switch (settings.command) {
      // Setup Commands
      case AutoCommand.info: {
        // TODO: Change the way stdout/stderr and exitCodes are handled
        const info = await commandManager.info(settings.listPlugins)
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
          settings.noVersionPrefix,
          settings.name,
          settings.email,
          settings.useVersion,
          settings.title,
          settings.message,
          settings.baseBranch,
          settings.preRelease,
          settings.onlyPublishWithReleaseLabel,
          settings.onlyGraduateWithReleaseLabel
        )
        break
      }
      case AutoCommand.latest: {
        await commandManager.latest(
          settings.dryRun,
          settings.noVersionPrefix,
          settings.name,
          settings.email,
          settings.useVersion,
          settings.title,
          settings.message,
          settings.baseBranch,
          settings.preRelease,
          settings.onlyPublishWithReleaseLabel
        )
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
        // TODO: Change the way stdout/stderr and exitCodes are handled
        const label = await commandManager.label(settings.pr)
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
    //outputHelper.setOutputs(autoOutputs)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
