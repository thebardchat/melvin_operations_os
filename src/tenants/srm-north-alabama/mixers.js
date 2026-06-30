// SRM North Alabama — mixer truck fleet + simple mixer driver roster.
// PUBLIC-SAFE: generic/sample names only.

export const DRIVERS = [
  { id: 'driver-01', name: 'Driver 01', crew: 'Mixer', start: '06:00', status: 'Available' },
  { id: 'driver-02', name: 'Driver 02', crew: 'Mixer', start: '06:00', status: 'Available' },
  { id: 'driver-03', name: 'Driver 03', crew: 'Mixer', start: '06:30', status: 'Assigned' },
  { id: 'driver-04', name: 'Driver 04', crew: 'Mixer', start: '07:00', status: 'Off duty' },
  { id: 'driver-05', name: 'Driver 05', crew: 'Mixer', start: '06:00', status: 'Available' },
  { id: 'driver-06', name: 'Driver 06', crew: 'Mixer', start: '06:30', status: 'Assigned' },
]

export const MIXERS = [
  { id: 'mix-001', truckNumber: 'Mixer 001', status: 'Available', driverId: 'driver-01' },
  { id: 'mix-002', truckNumber: 'Mixer 002', status: 'Loading', driverId: 'driver-02' },
  { id: 'mix-003', truckNumber: 'Mixer 003', status: 'On job', driverId: 'driver-03' },
  { id: 'mix-004', truckNumber: 'Mixer 004', status: 'Down', driverId: null },
  { id: 'mix-005', truckNumber: 'Mixer 005', status: 'Returning', driverId: 'driver-05' },
  { id: 'mix-006', truckNumber: 'Mixer 006', status: 'On the way', driverId: 'driver-06' },
]

export function driverNameById(id) {
  const d = DRIVERS.find(x => x.id === id)
  return d ? d.name : 'Unassigned'
}
