import * as core from '@actions/core'
import * as outputHelper from '../src/output-helper'
import {AutoOutputs, IAutoOutputs} from '../src/auto-outputs'
import {SemVer} from 'semver'
import * as fsHelper from '../src/fs-helper'
import * as path from 'path'

const originalGitHubWorkspace = process.env['GITHUB_WORKSPACE']
const gitHubWorkspace = path.resolve('/checkout-tests/workspace')

// Inputs for mock @actions/core
let outputs = {} as any

describe('output-helper tests', () => {
  beforeAll(() => {
    // Mock getInput
    jest
      .spyOn(core, 'setOutput')
      .mockImplementation((name: string, value: string) => {
        outputs[name] = value
      })

    // Mock error/warning/info/debug
    jest.spyOn(core, 'error').mockImplementation(jest.fn())
    jest.spyOn(core, 'warning').mockImplementation(jest.fn())
    jest.spyOn(core, 'info').mockImplementation(jest.fn())
    jest.spyOn(core, 'debug').mockImplementation(jest.fn())

    // Mock ./fs-helper directoryExistsSync()
    jest
      .spyOn(fsHelper, 'directoryExistsSync')
      .mockImplementation((path: string) => path == gitHubWorkspace)

    // GitHub workspace
    process.env['GITHUB_WORKSPACE'] = gitHubWorkspace
  })

  beforeEach(() => {
    // Restore GitHub workspace
    delete process.env['GITHUB_WORKSPACE']
    if (originalGitHubWorkspace) {
      process.env['GITHUB_WORKSPACE'] = originalGitHubWorkspace
    }
    // Reset inputs
    outputs = {}
  })

  afterAll(() => {
    // Restore
    jest.restoreAllMocks()
  })

  it('outputs defaults', () => {
    const autoOutputs: IAutoOutputs = new AutoOutputs()
    outputHelper.setOutputs(autoOutputs)
    expect(outputs).toBeTruthy()
    expect(outputs['new-release']).toBe('false')
    expect(outputs['pre-release']).toBe('false')
    expect(outputs.version).toBe(String(new SemVer('0.0.0')))
    expect(outputs.major).toBe('0')
    expect(outputs.minor).toBe('0')
    expect(outputs.patch).toBe('0')
  })

  it('outputs the correct version, major, minor and patch', () => {
    const autoOutputs: IAutoOutputs = new AutoOutputs()
    autoOutputs.version = new SemVer('1.0.0')
    outputHelper.setOutputs(autoOutputs)
    expect(outputs).toBeTruthy()
    expect(outputs['new-release']).toBe('false')
    expect(outputs['pre-release']).toBe('false')
    expect(outputs.version).toBe(String(autoOutputs.version))
    expect(outputs.major).toBe('1')
    expect(outputs.minor).toBe('0')
    expect(outputs.patch).toBe('0')
  })

  it('outputs true for a new release', () => {
    const autoOutputs: IAutoOutputs = new AutoOutputs()
    autoOutputs.version = new SemVer('1.0.0')
    autoOutputs.newRelease = true
    outputHelper.setOutputs(autoOutputs)
    expect(outputs).toBeTruthy()
    expect(outputs['new-release']).toBe('true')
    expect(outputs['pre-release']).toBe('false')
    expect(outputs.version).toBe(String(autoOutputs.version))
    expect(outputs.major).toBe('1')
    expect(outputs.minor).toBe('0')
    expect(outputs.patch).toBe('0')
  })
})
