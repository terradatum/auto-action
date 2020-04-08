import * as io from '@actions/io'
import * as ioUtil from '@actions/io/lib/io-util'
import * as github from '@actions/github'
import * as path from 'path'
import * as core from '@actions/core'
import {IAutoSettings} from '../src/auto-settings'
import * as inputHelper from '../src/input-helper'
import * as autoCommandManager from '../src/auto-command-manager'
import * as fsHelper from '../src/fs-helper'
import * as exec from '@actions/exec'

const originalActionStepDebug = process.env['RUNNER_DEBUG']
const originalGitHubWorkspace = process.env['GITHUB_WORKSPACE']
const gitHubWorkspace = path.resolve('/checkout-tests/workspace')

jest.mock('@actions/exec')
jest.mock('@actions/io')

describe('auto-command-manager tests', () => {
  beforeAll(() => {
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

    // Mock ./fs-helper directoryExistsSync()
    jest
      .spyOn(fsHelper, 'directoryExistsSync')
      .mockImplementation((path: string) => path == gitHubWorkspace)

    // GitHub workspace
    process.env['GITHUB_WORKSPACE'] = gitHubWorkspace
    delete process.env.RUNNER_DEBUG
  })

  afterAll(() => {
    // Restore GitHub workspace
    delete process.env['GITHUB_WORKSPACE']
    if (originalGitHubWorkspace) {
      process.env['GITHUB_WORKSPACE'] = originalGitHubWorkspace
    }
    if (originalActionStepDebug) {
      process.env['RUNNER_DEBUG'] = originalActionStepDebug
    }

    jest.resetAllMocks()
  })

  it('creation throws an error if neither npx nor auto are found in the path', async () => {
    jest.spyOn(io, 'which').mockImplementation(tool => {
      if (ioUtil.IS_WINDOWS) {
        throw new Error(
          `Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`
        )
      } else {
        throw new Error(
          `Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`
        )
      }
    })

    const settings: IAutoSettings = inputHelper.getInputs()
    expect.assertions(1)
    await expect(
      autoCommandManager.createCommandManager(
        settings.workingDirectory,
        settings.repo,
        settings.owner,
        settings.githubApi,
        settings.plugins
      )
    ).rejects.toMatchObject({
      message: expect.stringMatching(/Unable to locate executable file.*/)
    })
  })

  it('creation uses auto from the path if npx is not found', async () => {
    const execMock = jest.spyOn(exec, 'exec')
    jest.spyOn(io, 'which').mockImplementation(tool => {
      if (tool === 'auto') {
        return Promise.resolve(tool)
      } else {
        if (ioUtil.IS_WINDOWS) {
          throw new Error(
            `Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`
          )
        } else {
          throw new Error(
            `Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`
          )
        }
      }
    })

    const settings: IAutoSettings = inputHelper.getInputs()
    expect.assertions(3)
    await expect(
      autoCommandManager.createCommandManager(
        settings.workingDirectory,
        settings.repo,
        settings.owner,
        settings.githubApi,
        settings.plugins
      )
    ).rejects.toMatchObject({
      message: expect.stringMatching(/Unable to determine the auto version/)
    })
    expect(execMock).toHaveBeenCalledTimes(1)
    expect(execMock).toHaveBeenCalledWith(
      '"auto"',
      ['--version', '--repo', 'some-repo', '--owner', 'some-owner'],
      expect.anything()
    )
  })

  it('creation uses "npx auto" with verbose when ACTION_STEP_DEBUG is true', async () => {
    const execMock = jest.spyOn(exec, 'exec')
    jest.spyOn(core, 'isDebug').mockImplementation(() => true)
    jest.spyOn(io, 'which').mockImplementation(tool => {
      if (tool === 'npx') {
        return Promise.resolve(tool)
      } else {
        if (ioUtil.IS_WINDOWS) {
          throw new Error(
            `Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`
          )
        } else {
          throw new Error(
            `Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`
          )
        }
      }
    })

    const settings: IAutoSettings = inputHelper.getInputs()
    expect.assertions(4)
    await expect(
      autoCommandManager.createCommandManager(
        settings.workingDirectory,
        settings.repo,
        settings.owner,
        settings.githubApi,
        settings.plugins
      )
    ).rejects.toMatchObject({
      message: expect.stringMatching(/Unable to determine the auto version/)
    })
    expect(execMock).toHaveBeenCalledTimes(2)
    expect(execMock).toHaveBeenNthCalledWith(
      1,
      '"npm"',
      ['ci', '--only=prod'],
      expect.anything()
    )
    expect(execMock).toHaveBeenNthCalledWith(
      2,
      '"npx"',
      [
        'auto',
        '--version',
        '-vv',
        '--repo',
        'some-repo',
        '--owner',
        'some-owner'
      ],
      expect.anything()
    )
  })

  /**
   * TODO: Figure out how to inject arbitrary strings to test stdout.
   *       https://github.com/actions/toolkit/blob/master/packages/core/__tests__/core.test.ts
   */
  /*
    it('creation throws an error if the executable is found and has the wrong version', async () => {

      const execMock = jest.spyOn(exec, 'exec').mockImplementation((commandLine, args, options) => {
        if (commandLine == '"auto"') {

          //options.listeners.stdout(new Buffer('v9.25.0'));
          return Promise.resolve(0)
        } else {
          return Promise.resolve(1)
        }
      });
      jest.spyOn(io, 'which').mockImplementation(tool => {
        if (tool === 'auto') {
          return Promise.resolve(tool)
        } else {
          if (ioUtil.IS_WINDOWS) {
            throw new Error(
              `Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`
            )
          } else {
            throw new Error(
              `Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`
            )
          }
        }
      });

      const settings: IAutoSettings = inputHelper.getInputs();
      expect.assertions(3);
      await expect(autoCommandManager.createCommandManager(
        settings.repo,
        settings.owner,
        settings.githubApi,
        settings.plugins
      )).rejects.toMatchObject({
        message: expect.stringMatching(/Unable to determine the auto version/)
      });
      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        '"auto"',
        ['--repo', 'some-repo', '--owner', 'some-owner', '--version'],
        expect.anything()
      )

    });

    it('creation succeeds if an executable is found and is newer than the minimum version', async () => {

      const execMock = jest.spyOn(exec, 'exec').mockImplementation(commandLine => {
        if (commandLine == '"auto"') {
          return Promise.resolve(0)
        } else {
          return Promise.resolve(1)
        }
      });
      jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
      process.stdout.write('v9.26.0');
      jest.spyOn(io, 'which').mockImplementation(tool => {
        if (tool === 'auto') {
          return Promise.resolve(tool)
        } else {
          if (ioUtil.IS_WINDOWS) {
            throw new Error(
              `Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`
            )
          } else {
            throw new Error(
              `Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`
            )
          }
        }
      });

      const settings: IAutoSettings = inputHelper.getInputs();
      expect.assertions(3);
      await expect(autoCommandManager.createCommandManager(
        settings.repo,
        settings.owner,
        settings.githubApi,
        settings.plugins
      )).resolves.toMatchObject(expect.any(autoCommandManager));
      expect(execMock).toHaveBeenCalledTimes(2);
      expect(execMock).toHaveBeenCalledWith(
        '"auto"',
        ['--repo', 'some-repo', '--owner', 'some-owner', '--version'],
        expect.anything()
      )

    })
  */
})

/*
function getExecOptions(): ExecOptions {
  return {
    cwd: __dirname,
    env: {},
    silent: false,
    failOnStdErr: false,
    ignoreReturnCode: false,
    outStream: outstream,
    errStream: errstream
  }
}
*/
