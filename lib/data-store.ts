// lib/data-store.ts
import fs from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
const rawFile = path.join(dataDir, "raw_records.json")
const biasFile = path.join(dataDir, "bias_weights.json")

export async function readRawRecords(): Promise<any[]> {
  try {
    if (!fs.existsSync(rawFile)) return []
    const text = await fs.promises.readFile(rawFile, "utf-8")
    return JSON.parse(text)
  } catch (e) {
    console.error("readRawRecords error", e)
    return []
  }
}

export async function writeRawRecords(records: any[]): Promise<boolean> {
  try {
    await fs.promises.mkdir(dataDir, { recursive: true })
    await fs.promises.writeFile(rawFile, JSON.stringify(records, null, 2), "utf-8")
    return true
  } catch (e) {
    console.error("writeRawRecords error", e)
    return false
  }
}

export async function readBiasWeights(): Promise<Record<string, number>> {
  try {
    if (!fs.existsSync(biasFile)) return {}
    const text = await fs.promises.readFile(biasFile, "utf-8")
    return JSON.parse(text)
  } catch (e) {
    console.error("readBiasWeights error", e)
    return {}
  }
}
