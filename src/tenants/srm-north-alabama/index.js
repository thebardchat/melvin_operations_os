export * from './drivers.js'
export * from './plants.js'
export * from './mixers.js'
export * from './rotations.js'
export * from './rules.js'
export * from './customers.sample.js'
// contacts.js also exports CONTACTS (office placeholders); alias to avoid clashing
// with the legacy CONTACTS in drivers.js.
export { CONTACTS as OFFICE_CONTACTS } from './contacts.js'

export const TENANT = {
  id: 'srm-north-alabama',
  name: 'SRM North Alabama',
  region: 'North Alabama',
  motto: 'Pedal to the Medal',
}
