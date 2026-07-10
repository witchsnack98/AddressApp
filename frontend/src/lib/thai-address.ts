/**
 * Thai address data — imported from a pre-generated static JSON file
 * so it works in the browser (no Node.js `fs` dependency).
 */
import data from "./thai-address-data.json"

export interface Province {
  code: number
  name_th: string
}

export interface District {
  code: number
  name_th: string
  province_code: number
}

export interface Subdistrict {
  code: number
  name_th: string
  district_code: number
  province_code: number
  postal_code: number
}

// Cast the JSON data to typed arrays
export const PROVINCES = data.provinces as Province[]
const ALL_DISTRICTS = data.districts as District[]
const ALL_SUBDISTRICTS = data.subdistricts as Subdistrict[]

export function getDistrictsByProvince(provinceCode: number): District[] {
  return ALL_DISTRICTS.filter((d) => d.province_code === provinceCode)
}

export function getSubdistrictsByDistrict(districtCode: number): Subdistrict[] {
  return ALL_SUBDISTRICTS.filter((s) => s.district_code === districtCode)
}
