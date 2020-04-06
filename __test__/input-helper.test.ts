import * as assert from 'assert'
import * as core from '@actions/core'
import * as github from '@actions/github'
import * as fsHelper from '../src/fs-helper'
import * as inputHelper from '../src/input-helper'
import {IAutoSettings} from '../src/auto-settings'
import {AutoCommand} from '../src/auto-command-manager'
import * as path from 'path'

const originalGitHubWorkspace = process.env['GITHUB_WORKSPACE']
const gitHubWorkspace = path.resolve('/checkout-tests/workspace')

// Inputs for mock @actions/core
let inputs = {} as any

// Shallow clone original @actions/github context
let originalContext = {...github.context}

describe('input-helper tests', () => {
  beforeAll(() => {
    // Mock getInput
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      const val: string = inputs[name] || ''
      return val.trim()
    })

    // Mock error/warning/info/debug
    jest.spyOn(core, 'error').mockImplementation(jest.fn())
    jest.spyOn(core, 'warning').mockImplementation(jest.fn())
    jest.spyOn(core, 'info').mockImplementation(jest.fn())
    jest.spyOn(core, 'debug').mockImplementation(jest.fn())

    // Mock github context
    jest.spyOn(github.context, 'repo', 'get').mockImplementation(() => {
      return {
        owner: 'some-owner',
        repo: 'some-repo'
      }
    })
    github.context.ref = 'refs/heads/some-ref'
    github.context.sha = '1234567890123456789012345678901234567890'

    // Mock ./fs-helper directoryExistsSync()
    jest
      .spyOn(fsHelper, 'directoryExistsSync')
      .mockImplementation((path: string) => path == gitHubWorkspace)

    // GitHub workspace
    process.env['GITHUB_WORKSPACE'] = gitHubWorkspace
  })

  beforeEach(() => {
    // Reset inputs
    inputs = {}
  })

  afterAll(() => {
    // Restore GitHub workspace
    delete process.env['GITHUB_WORKSPACE']
    if (originalGitHubWorkspace) {
      process.env['GITHUB_WORKSPACE'] = originalGitHubWorkspace
    }

    // Restore @actions/github context
    github.context.ref = originalContext.ref
    github.context.sha = originalContext.sha

    // Restore
    jest.restoreAllMocks()
  })

  it('sets defaults', () => {
    const settings: IAutoSettings = inputHelper.getInputs()
    expect(settings).toBeTruthy()
    expect(settings.command).toBe(AutoCommand.shipit)
    expect(settings.repo).toBe('some-repo')
    expect(settings.owner).toBe('some-owner')
    expect(settings.githubApi).toBeFalsy()
    expect(settings.plugins).toHaveLength(0)
    expect(settings.dryRun).toBe(false)
    expect(settings.baseBranch).toBeFalsy()
    expect(settings.from).toBeFalsy()
    expect(settings.onlyGraduateWithReleaseLabel).toBeFalsy()
    expect(settings.onlyPublishWithReleaseLabel).toBeTruthy()
    expect(settings.name).toBeFalsy()
    expect(settings.email).toBeFalsy()
    expect(settings.noVersionPrefix).toBe(false)
    expect(settings.email).toBeFalsy()
    expect(settings.to).toBeFalsy()
    expect(settings.title).toBeFalsy()
    expect(settings.message).toBeFalsy()
    expect(settings.pr).toBe(0)
    expect(settings.useVersion).toBeFalsy()
    expect(settings.preRelease).toBe(false)
    expect(settings.build).toBeFalsy()
    expect(settings.force).toBe(false)
    expect(settings.context).toBeFalsy()
    expect(settings.url).toBeFalsy()
    expect(settings.sha).toBeFalsy()
    expect(settings.state).toBeFalsy()
    expect(settings.description).toBeFalsy()
    expect(settings.edit).toBe(false)
    expect(settings.del).toBe(false)
    expect(settings.workingDirectory).toBe(gitHubWorkspace)
  })

  it('requires qualified repo', () => {
    inputs['repo'] = 'some-unqualified-repo'
    assert.throws(() => {
      inputHelper.getInputs()
    }, /Invalid repository 'some-unqualified-repo'/)
  })

  it('sets dryRun to true with npm and git-tag plugins', () => {
    inputs['dry-run'] = 'true'
    inputs['plugins'] = 'npm\ngit-tag'
    const settings: IAutoSettings = inputHelper.getInputs()
    expect(settings).toBeTruthy()
    expect(settings.dryRun).toBe(true)
    expect(settings.plugins).toStrictEqual(['npm', 'git-tag'])
  })

  it('sets onlyPublishWithReleaseLabel to the correct boolean', () => {
    // NOTE: Currently GitHub actions is using Yaml 1.1 which has no support for booleans - thus all 'true'/'false' is dealt
    //       with as strings. This means that the code will fail if EVER a true boolean is accepted from the workflow
    // inputs['only-publish-with-release-label'] = false
    inputs['only-publish-with-release-label'] = 'false'
    inputs['plugins'] = 'npm\ngit-tag'
    const settings = inputHelper.getInputs()
    expect(settings).toBeTruthy()
    expect(settings.onlyPublishWithReleaseLabel).toBe(false)
    expect(settings.plugins).toStrictEqual(['npm', 'git-tag'])
  })
})
