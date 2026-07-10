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
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center rounded-md bg-primary/10 p-2">
            <MapPinIcon className="size-5 text-primary" />
          </div>
          <h1 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Address System
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="inline-flex h-6 items-center rounded-full bg-secondary px-2.5 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary-foreground/10">
              {addresses.length} รายการ
            </span>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Main content */}
      {/* ------------------------------------------------------------------ */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        {/* Toolbar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">รายการที่อยู่</h2>
            <p className="text-base text-muted-foreground">
              จัดการข้อมูลที่อยู่และสถานที่จัดส่งทั้งหมดของคุณ
            </p>
          </div>
          <div className="shrink-0">
            <AddressFormDialog onSuccess={handleSuccess} />
          </div>
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
