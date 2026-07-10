"use client"

import * as React from "react"
import { useFormContext } from "react-hook-form"

import {
  PROVINCES,
  getDistrictsByProvince,
  getSubdistrictsByDistrict,
} from "@/lib/thai-address"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { SearchableCombobox, type ComboboxOption } from "@/components/ui/combobox"

// Pre-build province options (static — never changes)
const PROVINCE_OPTIONS: ComboboxOption[] = PROVINCES.map((p) => ({
  value: p.name_th,
  label: p.name_th,
}))

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ThaiLocationFields() {
  const form = useFormContext()
  const selectedProvince = form.watch("province") as string
  const selectedDistrict = form.watch("district") as string

  // Derive district options from selected province
  const districtOptions = React.useMemo<ComboboxOption[]>(() => {
    if (!selectedProvince) return []
    const province = PROVINCES.find((p) => p.name_th === selectedProvince)
    if (!province) return []
    return getDistrictsByProvince(province.code).map((d) => ({
      value: d.name_th,
      label: d.name_th,
    }))
  }, [selectedProvince])

  // Derive subdistrict options from selected district
  const subdistrictOptions = React.useMemo<ComboboxOption[]>(() => {
    if (!selectedProvince || !selectedDistrict) return []
    const province = PROVINCES.find((p) => p.name_th === selectedProvince)
    if (!province) return []
    const districts = getDistrictsByProvince(province.code)
    const district = districts.find((d) => d.name_th === selectedDistrict)
    if (!district) return []
    return getSubdistrictsByDistrict(district.code).map((s) => ({
      value: s.name_th,
      label: s.name_th,
    }))
  }, [selectedProvince, selectedDistrict])

  // When province changes → clear district + subdistrict + postalCode
  const handleProvinceChange = (value: string) => {
    form.setValue("province", value, { shouldValidate: true })
    form.setValue("district", "", { shouldValidate: false })
    form.setValue("subDistrict", "", { shouldValidate: false })
    form.setValue("postalCode", "", { shouldValidate: false })
  }

  // When district changes → clear subdistrict + postalCode
  const handleDistrictChange = (value: string) => {
    form.setValue("district", value, { shouldValidate: true })
    form.setValue("subDistrict", "", { shouldValidate: false })
    form.setValue("postalCode", "", { shouldValidate: false })
  }

  // When subdistrict changes → auto-fill postalCode
  const handleSubdistrictChange = (value: string) => {
    form.setValue("subDistrict", value, { shouldValidate: true })

    // Auto-fill postal code
    if (value && selectedProvince && selectedDistrict) {
      const province = PROVINCES.find((p) => p.name_th === selectedProvince)
      if (province) {
        const districts = getDistrictsByProvince(province.code)
        const district = districts.find((d) => d.name_th === selectedDistrict)
        if (district) {
          const subdistricts = getSubdistrictsByDistrict(district.code)
          const sub = subdistricts.find((s) => s.name_th === value)
          if (sub) {
            form.setValue("postalCode", String(sub.postal_code), {
              shouldValidate: true,
            })
          }
        }
      }
    }
  }

  return (
    <>
      {/* Province */}
      <FormField
        control={form.control}
        name="province"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>จังหวัด</FormLabel>
            <FormControl>
              <SearchableCombobox
                id={field.name}
                value={field.value as string}
                onValueChange={handleProvinceChange}
                options={PROVINCE_OPTIONS}
                placeholder="เลือกจังหวัด"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* District */}
      <FormField
        control={form.control}
        name="district"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>อำเภอ / เขต</FormLabel>
            <FormControl>
              <SearchableCombobox
                id={field.name}
                value={field.value as string}
                onValueChange={handleDistrictChange}
                options={districtOptions}
                placeholder={
                  selectedProvince ? "เลือกอำเภอ/เขต" : "เลือกจังหวัดก่อน"
                }
                disabled={!selectedProvince}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* SubDistrict */}
      <FormField
        control={form.control}
        name="subDistrict"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>ตำบล / แขวง</FormLabel>
            <FormControl>
              <SearchableCombobox
                id={field.name}
                value={field.value as string}
                onValueChange={handleSubdistrictChange}
                options={subdistrictOptions}
                placeholder={
                  selectedDistrict ? "เลือกตำบล/แขวง" : "เลือกอำเภอก่อน"
                }
                disabled={!selectedDistrict}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Postal Code — auto-filled, but user can also type manually */}
      <FormField
        control={form.control}
        name="postalCode"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>รหัสไปรษณีย์</FormLabel>
            <FormControl>
              <input
                id={field.name}
                className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm font-mono outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
                placeholder="กรอกอัตโนมัติ"
                maxLength={5}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
