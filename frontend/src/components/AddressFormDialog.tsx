"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2Icon, PlusIcon, PencilIcon } from "lucide-react"

import type { Address, CreateAddressInput } from "@/types/address"
import { createAddress, updateAddress } from "@/lib/api/addresses"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ThaiLocationFields } from "@/components/ThaiLocationFields"

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------
const addressSchema = z.object({
  firstName: z.string().min(1, "กรุณากรอกชื่อ").max(100),
  lastName: z.string().min(1, "กรุณากรอกนามสกุล").max(100),
  houseNumber: z.string().min(1, "กรุณากรอกบ้านเลขที่/ซอย").max(100),
  street: z.string().min(1, "กรุณากรอกถนน").max(200),
  subDistrict: z.string().min(1, "กรุณาเลือกตำบล/แขวง").max(100),
  district: z.string().min(1, "กรุณาเลือกอำเภอ/เขต").max(100),
  province: z.string().min(1, "กรุณาเลือกจังหวัด").max(100),
  postalCode: z
    .string()
    .min(1, "กรุณากรอกรหัสไปรษณีย์")
    .regex(/^\d{5}$/, "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก"),
})

type AddressFormValues = z.infer<typeof addressSchema>

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface AddressFormDialogProps {
  /** When provided the dialog is in "edit" mode; otherwise "create" mode. */
  address?: Address
  /** Called with the saved/updated address so the parent can refresh its list. */
  onSuccess: (address: Address) => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function AddressFormDialog({
  address,
  onSuccess,
}: AddressFormDialogProps) {
  const [open, setOpen] = React.useState(false)
  const isEdit = !!address

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: address?.firstName ?? "",
      lastName: address?.lastName ?? "",
      houseNumber: address?.houseNumber ?? "",
      street: address?.street ?? "",
      subDistrict: address?.subDistrict ?? "",
      district: address?.district ?? "",
      province: address?.province ?? "",
      postalCode: address?.postalCode ?? "",
    },
  })

  // Reset form when dialog opens (to pick up latest address values on edit)
  React.useEffect(() => {
    if (open) {
      form.reset({
        firstName: address?.firstName ?? "",
        lastName: address?.lastName ?? "",
        houseNumber: address?.houseNumber ?? "",
        street: address?.street ?? "",
        subDistrict: address?.subDistrict ?? "",
        district: address?.district ?? "",
        province: address?.province ?? "",
        postalCode: address?.postalCode ?? "",
      })
    }
  }, [open, address, form])

  const onSubmit = async (values: AddressFormValues) => {
    try {
      const payload: CreateAddressInput = values
      const saved = isEdit
        ? await updateAddress(address.id, payload)
        : await createAddress(payload)
      onSuccess(saved)
      setOpen(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่"
      form.setError("root", { message })
    }
  }

  const triggerElement = isEdit ? (
    <DialogTrigger
      render={
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`แก้ไขที่อยู่ของ ${address?.firstName} ${address?.lastName}`}
        />
      }
    >
      <PencilIcon className="size-4" />
    </DialogTrigger>
  ) : (
    <DialogTrigger
      render={<Button id="add-address-btn" className="gap-2" />}
    >
      <PlusIcon className="size-4" />
      เพิ่มที่อยู่ใหม่
    </DialogTrigger>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerElement}
      <DialogContent className="sm:max-w-lg max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "แก้ไขข้อมูลที่อยู่แล้วกดบันทึก"
              : "กรอกข้อมูลที่อยู่แล้วกดบันทึก"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="address-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-x-4 gap-y-3"
          >
            {/* ชื่อ */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>ชื่อ</FormLabel>
                  <FormControl>
                    <Input placeholder="สมชาย" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* นามสกุล */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>นามสกุล</FormLabel>
                  <FormControl>
                    <Input placeholder="ใจดี" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* บ้านเลขที่ / ซอย */}
            <FormField
              control={form.control}
              name="houseNumber"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>บ้านเลขที่ / ซอย</FormLabel>
                  <FormControl>
                    <Input placeholder="123/4 ซ.สุขุมวิท 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ถนน */}
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>ถนน</FormLabel>
                  <FormControl>
                    <Input placeholder="สุขุมวิท" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* จังหวัด, อำเภอ, ตำบล, รหัสไปรษณีย์ — cascading dropdowns */}
            <ThaiLocationFields />

            {/* Root-level server error */}
            {form.formState.errors.root && (
              <p className="col-span-2 text-xs text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="submit"
            form="address-form"
            disabled={form.formState.isSubmitting}
            className="w-full sm:w-auto"
          >
            {form.formState.isSubmitting && (
              <Loader2Icon className="size-4 animate-spin" />
            )}
            บันทึก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
