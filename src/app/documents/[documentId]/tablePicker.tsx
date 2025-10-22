'use client'

import { useState } from "react"
import { useEditorStore } from "@/store/use-editor-store"

export function TablePicker() {
  const { editor } = useEditorStore()
  const [rows, setRows] = useState(0)
  const [cols, setCols] = useState(0)

  const maxRows = 8
  const maxCols = 8

  const handleInsert = (r: number, c: number) => {
    editor?.chain().focus().insertTable({
      rows: r,
      cols: c,
      withHeaderRow: false
    }).run()
  }

  return (
    <div className="p-2">
      <div className="flex flex-col gap-1">
        {[...Array(maxRows)].map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {[...Array(maxCols)].map((_, colIndex) => {
              const r = rowIndex + 1
              const c = colIndex + 1
              const active = r <= rows && c <= cols
              return (
                <div
                  key={colIndex}
                  onMouseEnter={() => {
                    setRows(r)
                    setCols(c)
                  }}
                  onClick={() => handleInsert(r, c)}
                  className={`w-5 h-5 border cursor-pointer rounded-sm ${
                    active ? "bg-blue-200" : "bg-gray-200"
                  }`}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="mt-2 text-sm text-center">
        {rows} x {cols}
      </div>
    </div>
  )
}
