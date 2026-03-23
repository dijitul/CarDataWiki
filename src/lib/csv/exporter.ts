import { ModelVariant, Model, Make } from '@prisma/client'

type VariantWithRelations = ModelVariant & { model: Model & { make: Make } }

const CSV_HEADERS = [
  'make', 'model', 'variant', 'yearFrom', 'yearTo',
  'bodyType', 'doors', 'seats',
  'engineCode', 'engineDisplacement', 'engineCylinders', 'engineValves',
  'engineFuelType', 'enginePowerBhp', 'enginePowerKw', 'engineTorqueNm',
  'engineAspiration', 'enginePosition',
  'gearboxType', 'gears', 'drivetrain',
  'acceleration0100', 'topSpeedKph', 'topSpeedMph',
  'fuelEconomyCombinedMpg', 'fuelEconomyCombinedL100', 'fuelEconomyUrbanL100',
  'fuelEconomyExtraUrbanL100', 'fuelTankLitres',
  'co2Gkm', 'emissionsStandard', 'noxMgkm',
  'lengthMm', 'widthMm', 'heightMm', 'wheelbaseMm',
  'weightKg', 'grossWeightKg', 'bootLitres', 'bootLitresMax',
  'tyreFront', 'tyreRear', 'brakeFront', 'brakeRear',
  'batteryKwh', 'electricRangeKm', 'chargingKw',
]

function escapeCSV(val: unknown): string {
  if (val === null || val === undefined) return ''
  const str = String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function variantsToCsv(variants: VariantWithRelations[]): string {
  const rows = [CSV_HEADERS.join(',')]
  for (const v of variants) {
    const row = [
      v.model.make.name,
      v.model.name,
      v.name,
      v.yearFrom,
      v.yearTo,
      v.bodyType,
      v.doors,
      v.seats,
      v.engineCode,
      v.engineDisplacement,
      v.engineCylinders,
      v.engineValves,
      v.engineFuelType,
      v.enginePowerBhp,
      v.enginePowerKw,
      v.engineTorqueNm,
      v.engineAspiration,
      v.enginePosition,
      v.gearboxType,
      v.gears,
      v.drivetrain,
      v.acceleration0100,
      v.topSpeedKph,
      v.topSpeedMph,
      v.fuelEconomyCombinedMpg,
      v.fuelEconomyCombinedL100,
      v.fuelEconomyUrbanL100,
      v.fuelEconomyExtraUrbanL100,
      v.fuelTankLitres,
      v.co2Gkm,
      v.emissionsStandard,
      v.noxMgkm,
      v.lengthMm,
      v.widthMm,
      v.heightMm,
      v.wheelbaseMm,
      v.weightKg,
      v.grossWeightKg,
      v.bootLitres,
      v.bootLitresMax,
      v.tyreFront,
      v.tyreRear,
      v.brakeFront,
      v.brakeRear,
      v.batteryKwh,
      v.electricRangeKm,
      v.chargingKw,
    ].map(escapeCSV)
    rows.push(row.join(','))
  }
  return rows.join('\n')
}
