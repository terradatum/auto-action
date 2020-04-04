import * as core from '@actions/core'
import {IAutoOutputs} from './auto-outputs'

export function setOutputs(outputs: IAutoOutputs) {
  core.setOutput('new-release', String(outputs.newRelease))
  core.setOutput('pre-release', String(outputs.preRelease))
  core.setOutput('version', String(outputs?.version))
  core.setOutput('major', String(outputs?.version?.major))
  core.setOutput('minor', String(outputs?.version?.minor))
  core.setOutput('patch', String(outputs?.version?.patch))
}
