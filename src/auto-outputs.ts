import {SemVer} from 'semver'

export interface IAutoOutputs {
  /**
   * Release published
   */
  newRelease: boolean

  /**
   * Pre-release published
   */
  preRelease: boolean

  /**
   * Version
   */
  version: SemVer
}

export class AutoOutputs implements IAutoOutputs {
  newRelease: boolean = false
  preRelease: boolean = false
  version: SemVer = new SemVer('0.0.1')
}
