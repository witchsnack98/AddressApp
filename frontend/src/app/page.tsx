"use client"

import * as React from "react"
import { MapPinIcon, Loader2Icon, AlertCircleIcon } from "lucide-react"

import type { Address } from "@/types/address"
import { getAddresses } from "@/lib/api/addresses"

import { AddressTable } from "@/components/AddressTable"
import { AddressFormDialog } from "@/components/AddressFormDialog"
import { Button } from "@/components/ui/button"

// ---------------------------------------------------------------------------
// Page — Client Component (uses state + fetching)
// ---------------------------------------------------------------------------
export default function HomePage() {
  const [addresses, setAddresses] = React.useState<Address[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch all addresses on mount
  const fetchAddresses = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAddresses()
      setAddresses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void fetchAddresses()
  }, [fetchAddresses])

  // Optimistic update: prepend new / replace updated address
  const handleSuccess = React.useCallback((saved: Address) => {
    setAddresses((prev) => {
      const exists = prev.some((a) => a.id === saved.id)
      return exists
        ? prev.map((a) => (a.id === saved.id ? saved : a))
        : [saved, ...prev]
    })
  }, [])

  // Optimistic delete
  const handleDelete = React.useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* ------------------------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------------------------ */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <MapPinIcon className="size-5 text-primary" />
          <h1 className="text-base font-semibold tracking-tight">
            ระบบจัดการที่อยู่
          </h1>
          <span className="ml-1 inline-flex h-5 items-center rounded-full bg-primary/10 px-2 text-[11px] font-medium text-primary">
            {addresses.length} รายการ
          </span>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Main content */}
      {/* ------------------------------------------------------------------ */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">รายการที่อยู่</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              จัดการข้อมูลที่อยู่ทั้งหมดของคุณในที่เดียว
            </p>
          </div>
          <AddressFormDialog onSuccess={handleSuccess} />
        </div>

        {/* States */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-24 text-muted-foreground">
            <Loader2Icon className="size-5 animate-spin" />
            <span className="text-sm">กำลังโหลดข้อมูล…</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertCircleIcon className="size-8 text-destructive" />
            </div>
            <p className="text-sm font-medium">โหลดข้อมูลไม่สำเร็จ</p>
            <p className="max-w-sm text-xs text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void fetchAddresses()}
            >
              ลองใหม่อีกครั้ง
            </Button>
          </div>
        )}

        {!loading && !error && (
          <AddressTable
            addresses={addresses}
            onUpdate={handleSuccess}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  )
}
