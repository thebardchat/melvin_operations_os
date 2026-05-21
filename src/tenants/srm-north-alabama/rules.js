// Business rules for SRM North Alabama dispatch

// 514 chain rule: after first 514 load, follow with 516 then 519
export const CHAIN_514 = ['514', '516', '519']

// End of shift buffer in minutes — don't start a run that can't complete
export const END_OF_SHIFT_BUFFER = 90

// Quarry close time in minutes from midnight (16:00 = 960)
export const QUARRY_CLOSE = 960

// 518 requires a phone call to both Shane and Anthony before dispatching
export const PLANT_518_CONTACTS = ['SHANE', 'ANTHONY']

// Mh (Mt. Hope 591) vs Cherokee (594) toggle — controlled by mhDay state
export const MH_PLANT = '591'
export const CHEROKEE_PLANT = '594'

// Curtis office override plant
export const CURTIS_OFFICE_PLANT = 'POD'

// Alexis short day: runs only 2 rounds, starts at 516
export const ALEXIS_ROUNDS = 2
export const ALEXIS_START_PLANT = '516'
