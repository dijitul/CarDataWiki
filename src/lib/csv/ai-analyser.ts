import { anthropic } from '../anthropic'

export interface AiAnalysisReport {
  summary: string
  newRows: Record<string, unknown>[]
  duplicates: { rowIndex: number; matchedVariantSlug: string }[]
  conflicts: { rowIndex: number; field: string; existingValue: string; csvValue: string }[]
  unknownFields: string[]
  validationErrors: { rowIndex: number; field: string; message: string }[]
  confidence: 'high' | 'medium' | 'low'
}

export async function analyseCsvWithAI(
  rows: Record<string, unknown>[],
  existingSlugs: string[],
): Promise<AiAnalysisReport> {
  const sample = rows.slice(0, Number(process.env.CSV_AI_SAMPLE_ROWS ?? 200))

  const prompt = `You are a vehicle data quality analyst for cardata.wiki — a Wikipedia-style car specifications database.

You have been given a CSV upload containing vehicle specification data. Your job is to analyse the data and return a structured JSON report.

## Existing variant slugs in our database (sample):
${existingSlugs.slice(0, 100).join('\n')}

## CSV rows to analyse (${sample.length} rows):
${JSON.stringify(sample, null, 2)}

## Known spec fields:
make, model, variant, yearFrom, yearTo, bodyType, doors, seats,
engineCode, engineDisplacement (cc), engineCylinders, engineValves,
engineFuelType (PETROL/DIESEL/ELECTRIC/HYBRID_PETROL/HYBRID_DIESEL/PLUG_IN_HYBRID/HYDROGEN/LPG),
enginePowerBhp, enginePowerKw, engineTorqueNm, engineAspiration, enginePosition,
gearboxType (MANUAL/AUTOMATIC/CVT/DCT/SEMI_AUTOMATIC), gears,
drivetrain (FWD/RWD/AWD/FOUR_WD),
acceleration0100 (seconds), topSpeedKph, topSpeedMph,
fuelEconomyCombinedMpg, fuelEconomyCombinedL100, fuelEconomyUrbanL100, fuelEconomyExtraUrbanL100,
fuelTankLitres, co2Gkm, emissionsStandard, noxMgkm,
lengthMm, widthMm, heightMm, wheelbaseMm, weightKg, grossWeightKg, bootLitres, bootLitresMax,
tyreFront, tyreRear, brakeFront, brakeRear,
batteryKwh, electricRangeKm, chargingKw

## Your task:
Return ONLY valid JSON (no markdown, no explanation) matching this exact schema:
{
  "summary": "A 2-3 sentence plain-English summary of what this CSV contains and its quality",
  "newRows": [...],          // rows that appear to be genuinely new data not in our DB
  "duplicates": [{ "rowIndex": 0, "matchedVariantSlug": "..." }],
  "conflicts": [{ "rowIndex": 0, "field": "enginePowerBhp", "existingValue": "148", "csvValue": "150" }],
  "unknownFields": [...],    // column headers not in our known field list
  "validationErrors": [{ "rowIndex": 0, "field": "engineFuelType", "message": "Invalid fuel type value" }],
  "confidence": "high"       // high/medium/low: your confidence in the data quality overall
}`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  try {
    return JSON.parse(text) as AiAnalysisReport
  } catch {
    return {
      summary: 'Analysis failed — could not parse AI response.',
      newRows: sample,
      duplicates: [],
      conflicts: [],
      unknownFields: [],
      validationErrors: [],
      confidence: 'low',
    }
  }
}
