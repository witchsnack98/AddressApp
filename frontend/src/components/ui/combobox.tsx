"use client"

import * as React from "react"
import { Combobox } from "@base-ui/react/combobox"
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ComboboxOption {
  value: string
  label: string
}

interface SearchableComboboxProps {
  /** Current selected value string (controlled) */
  value: string
  /** Called with the new value string when selection changes */
  onValueChange: (value: string) => void
  /** All available options */
  options: ComboboxOption[]
  /** Placeholder text shown in the input */
  placeholder?: string
  /** Disables the combobox */
  disabled?: boolean
  /** id forwarded to the inner input */
  id?: string
  /** aria-* props forwarded from FormControl */
  "aria-describedby"?: string
  "aria-invalid"?: boolean
  /** Extra class for the input group wrapper */
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function SearchableCombobox({
  value,
  onValueChange,
  options,
  placeholder = "ค้นหา...",
  disabled,
  id,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
}: SearchableComboboxProps) {
  return (
    <Combobox.Root
      items={options}
      // value is the selected option object (or null)
      value={value ? options.find((o) => o.value === value) ?? null : null}
      onValueChange={(opt) => {
        onValueChange(opt ? (opt as ComboboxOption).value : "")
      }}
      disabled={disabled}
      // base-ui auto-reads label from {value, label} shape
    >
      <Combobox.InputGroup
        className={cn(
          "relative flex h-8 w-full items-center rounded-lg border border-input bg-transparent transition-colors",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
          "aria-disabled:pointer-events-none aria-disabled:opacity-50",
          ariaInvalid &&
            "border-destructive ring-3 ring-destructive/20 focus-within:border-destructive",
          className,
        )}
      >
        <Combobox.Input
          id={id}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          placeholder={placeholder}
          className="h-full w-full bg-transparent px-2.5 text-sm outline-none placeholder:text-muted-foreground"
          autoComplete="off"
        />

        <div className="flex shrink-0 items-center gap-0.5 pr-1">
          {/* Clear button */}
          <Combobox.Clear
            aria-label="ล้างค่า"
            className="flex size-5 items-center justify-center rounded text-muted-foreground opacity-0 transition-opacity hover:text-foreground data-[has-value]:opacity-100"
          >
            <XIcon className="size-3" />
          </Combobox.Clear>

          <Combobox.Trigger
            aria-label="เปิดรายการ"
            className="flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronsUpDownIcon className="size-3.5" />
          </Combobox.Trigger>
        </div>
      </Combobox.InputGroup>

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4} className="z-50">
          <Combobox.Popup
            className={cn(
              "w-[var(--anchor-width)] min-w-[180px] overflow-hidden rounded-xl border bg-popover p-1 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10",
              "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
              "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            )}
          >
            <Combobox.Empty className="py-4 text-center text-xs text-muted-foreground">
              ไม่พบผลลัพธ์
            </Combobox.Empty>

            <Combobox.List className="max-h-60 overflow-y-auto">
              {(option: ComboboxOption) => (
                <Combobox.Item
                  key={option.value}
                  value={option}
                  className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
                >
                  <Combobox.ItemIndicator className="absolute left-2 flex items-center justify-center">
                    <CheckIcon className="size-3 text-primary" />
                  </Combobox.ItemIndicator>
                  <span className="pl-5">{option.label}</span>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  )
}
