"use client"

import * as React from "react"
import { Trash2Icon, Loader2Icon } from "lucide-react"

import type { Address } from "@/types/address"
import { deleteAddress } from "@/lib/api/addresses"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AddressFormDialog } from "@/components/AddressFormDialog"

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface AddressTableProps {
  addresses: Address[]
  onUpdate: (address: Address) => void
  onDelete: (id: string) => void
}

// ---------------------------------------------------------------------------
// Delete confirmation row
// ---------------------------------------------------------------------------
function DeleteAddressDialog({
  address,
  onDelete,
}: {
  address: Address
  onDelete: (id: string) => void
}) {
  const [loading, setLoading] = React.useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteAddress(address.id)
      onDelete(address.id)
    } catch (err) {
      console.error("ลบที่อยู่ไม่สำเร็จ:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:text-destructive"
            aria-label={`ลบที่อยู่ของ ${address.firstName} ${address.lastName}`}
          />
        }
      >
        {loading ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <Trash2Icon className="size-4" />
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
          <AlertDialogDescription>
            คุณต้องการลบที่อยู่ของ{" "}
            <span className="font-medium text-foreground">
              {address.firstName} {address.lastName}
            </span>{" "}
            ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete}>
            ลบ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ---------------------------------------------------------------------------
// Main table
// ---------------------------------------------------------------------------
export function AddressTable({
  addresses,
  onUpdate,
  onDelete,
}: AddressTableProps) {
  if (addresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <div className="rounded-full bg-muted p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          ยังไม่มีที่อยู่ในระบบ
        </p>
        <p className="text-xs text-muted-foreground">
          กดปุ่ม &quot;เพิ่มที่อยู่ใหม่&quot; เพื่อเริ่มต้น
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[180px]">ชื่อ-นามสกุล</TableHead>
            <TableHead>บ้านเลขที่ / ซอย</TableHead>
            <TableHead className="hidden md:table-cell">ถนน</TableHead>
            <TableHead className="hidden lg:table-cell">ตำบล/แขวง</TableHead>
            <TableHead className="hidden lg:table-cell">อำเภอ/เขต</TableHead>
            <TableHead className="hidden xl:table-cell">จังหวัด</TableHead>
            <TableHead className="hidden sm:table-cell w-[90px]">
              รหัสไปรษณีย์
            </TableHead>
            <TableHead className="w-[80px] text-right">จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addresses.map((address) => (
            <TableRow
              key={address.id}
              className="group transition-colors hover:bg-muted/30"
            >
              <TableCell className="font-medium">
                {address.firstName} {address.lastName}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {address.houseNumber}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {address.street}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {address.subDistrict}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {address.district}
              </TableCell>
              <TableCell className="hidden xl:table-cell text-muted-foreground">
                {address.province}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground font-mono text-xs">
                {address.postalCode}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <AddressFormDialog address={address} onSuccess={onUpdate} />
                  <DeleteAddressDialog address={address} onDelete={onDelete} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
