"use client"

import type { SubastaState } from "@/lib/xp-types"

interface Props {
  subasta: SubastaState
  onUpdateSubasta: (data: Partial<SubastaState>) => void
}

export default function AuctionView({ subasta, onUpdateSubasta }: Props) {
  return (
    <div style={{ padding: 20 }}>
      <h2>Subasta</h2>

      <input
        type="text"
        placeholder="Premio de la subasta"
        value={subasta.item}
        onChange={(e) =>
          onUpdateSubasta({
            item: e.target.value,
          })
        }
      />

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() =>
            onUpdateSubasta({
              activa: true,
            })
          }
        >
          Iniciar subasta
        </button>

        <button
          onClick={() =>
            onUpdateSubasta({
              activa: false,
            })
          }
        >
          Finalizar subasta
        </button>
      </div>
    </div>
  )
}