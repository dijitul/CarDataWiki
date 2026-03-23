export const SPEC_SECTIONS = [
  {
    id: 'engine',
    label: 'Engine',
    fields: [
      { key: 'engineCode',         label: 'Engine Code',         unit: '' },
      { key: 'engineDisplacement', label: 'Displacement',         unit: 'cc' },
      { key: 'engineCylinders',    label: 'Cylinders',            unit: '' },
      { key: 'engineValves',       label: 'Valves',               unit: '' },
      { key: 'engineFuelType',     label: 'Fuel Type',            unit: '' },
      { key: 'enginePowerBhp',     label: 'Power',                unit: 'bhp' },
      { key: 'enginePowerKw',      label: 'Power',                unit: 'kW' },
      { key: 'engineTorqueNm',     label: 'Torque',               unit: 'Nm' },
      { key: 'engineAspiration',   label: 'Aspiration',           unit: '' },
      { key: 'enginePosition',     label: 'Engine Position',      unit: '' },
    ],
  },
  {
    id: 'transmission',
    label: 'Transmission',
    fields: [
      { key: 'gearboxType', label: 'Gearbox',    unit: '' },
      { key: 'gears',       label: 'Gears',      unit: '' },
      { key: 'drivetrain',  label: 'Drivetrain', unit: '' },
    ],
  },
  {
    id: 'performance',
    label: 'Performance',
    fields: [
      { key: 'acceleration0100', label: '0–100 km/h', unit: 's' },
      { key: 'topSpeedKph',      label: 'Top Speed',   unit: 'km/h' },
      { key: 'topSpeedMph',      label: 'Top Speed',   unit: 'mph' },
    ],
  },
  {
    id: 'economy',
    label: 'Fuel Economy & Emissions',
    fields: [
      { key: 'fuelEconomyCombinedMpg',    label: 'Combined (MPG)',         unit: 'mpg' },
      { key: 'fuelEconomyCombinedL100',   label: 'Combined',               unit: 'L/100km' },
      { key: 'fuelEconomyUrbanL100',      label: 'Urban',                  unit: 'L/100km' },
      { key: 'fuelEconomyExtraUrbanL100', label: 'Extra-Urban',            unit: 'L/100km' },
      { key: 'fuelTankLitres',            label: 'Fuel Tank',              unit: 'L' },
      { key: 'co2Gkm',                   label: 'CO₂ Emissions',          unit: 'g/km' },
      { key: 'emissionsStandard',         label: 'Emissions Standard',     unit: '' },
      { key: 'noxMgkm',                  label: 'NOx Emissions',          unit: 'mg/km' },
    ],
  },
  {
    id: 'dimensions',
    label: 'Dimensions & Weight',
    fields: [
      { key: 'lengthMm',      label: 'Length',        unit: 'mm' },
      { key: 'widthMm',       label: 'Width',         unit: 'mm' },
      { key: 'heightMm',      label: 'Height',        unit: 'mm' },
      { key: 'wheelbaseMm',   label: 'Wheelbase',     unit: 'mm' },
      { key: 'weightKg',      label: 'Kerb Weight',   unit: 'kg' },
      { key: 'grossWeightKg', label: 'Gross Weight',  unit: 'kg' },
      { key: 'bootLitres',    label: 'Boot Capacity', unit: 'L' },
      { key: 'bootLitresMax', label: 'Boot (max)',     unit: 'L' },
    ],
  },
  {
    id: 'body',
    label: 'Body',
    fields: [
      { key: 'bodyType', label: 'Body Style', unit: '' },
      { key: 'doors',    label: 'Doors',      unit: '' },
      { key: 'seats',    label: 'Seats',      unit: '' },
    ],
  },
  {
    id: 'tyres',
    label: 'Tyres & Brakes',
    fields: [
      { key: 'tyreFront',  label: 'Front Tyres',  unit: '' },
      { key: 'tyreRear',   label: 'Rear Tyres',   unit: '' },
      { key: 'brakeFront', label: 'Front Brakes', unit: '' },
      { key: 'brakeRear',  label: 'Rear Brakes',  unit: '' },
    ],
  },
  {
    id: 'electric',
    label: 'Electric / Hybrid',
    fields: [
      { key: 'batteryKwh',      label: 'Battery Capacity', unit: 'kWh' },
      { key: 'electricRangeKm', label: 'Electric Range',   unit: 'km' },
      { key: 'chargingKw',      label: 'Max Charging',     unit: 'kW' },
    ],
  },
] as const

export type SpecFieldKey =
  | 'engineCode' | 'engineDisplacement' | 'engineCylinders' | 'engineValves'
  | 'engineFuelType' | 'enginePowerBhp' | 'enginePowerKw' | 'engineTorqueNm'
  | 'engineAspiration' | 'enginePosition' | 'gearboxType' | 'gears' | 'drivetrain'
  | 'acceleration0100' | 'topSpeedKph' | 'topSpeedMph'
  | 'fuelEconomyCombinedMpg' | 'fuelEconomyCombinedL100' | 'fuelEconomyUrbanL100'
  | 'fuelEconomyExtraUrbanL100' | 'fuelTankLitres' | 'co2Gkm' | 'emissionsStandard' | 'noxMgkm'
  | 'lengthMm' | 'widthMm' | 'heightMm' | 'wheelbaseMm' | 'weightKg' | 'grossWeightKg'
  | 'bootLitres' | 'bootLitresMax' | 'bodyType' | 'doors' | 'seats'
  | 'tyreFront' | 'tyreRear' | 'brakeFront' | 'brakeRear'
  | 'batteryKwh' | 'electricRangeKm' | 'chargingKw'

export const EDITABLE_FIELDS = new Set<string>([
  'engineCode','engineDisplacement','engineCylinders','engineValves','engineFuelType',
  'enginePowerBhp','enginePowerKw','engineTorqueNm','engineAspiration','enginePosition',
  'gearboxType','gears','drivetrain','acceleration0100','topSpeedKph','topSpeedMph',
  'fuelEconomyCombinedMpg','fuelEconomyCombinedL100','fuelEconomyUrbanL100',
  'fuelEconomyExtraUrbanL100','fuelTankLitres','co2Gkm','emissionsStandard','noxMgkm',
  'lengthMm','widthMm','heightMm','wheelbaseMm','weightKg','grossWeightKg',
  'bootLitres','bootLitresMax','bodyType','doors','seats',
  'tyreFront','tyreRear','brakeFront','brakeRear','batteryKwh','electricRangeKm','chargingKw',
])

export const FUEL_TYPE_LABELS: Record<string, string> = {
  PETROL: 'Petrol', DIESEL: 'Diesel', ELECTRIC: 'Electric',
  HYBRID_PETROL: 'Hybrid (Petrol)', HYBRID_DIESEL: 'Hybrid (Diesel)',
  PLUG_IN_HYBRID: 'Plug-in Hybrid', HYDROGEN: 'Hydrogen', LPG: 'LPG',
}

export const GEARBOX_LABELS: Record<string, string> = {
  MANUAL: 'Manual', AUTOMATIC: 'Automatic', CVT: 'CVT',
  DCT: 'Dual-Clutch (DCT)', SEMI_AUTOMATIC: 'Semi-Automatic',
}

export const DRIVETRAIN_LABELS: Record<string, string> = {
  FWD: 'Front-Wheel Drive', RWD: 'Rear-Wheel Drive',
  AWD: 'All-Wheel Drive', FOUR_WD: '4WD',
}
