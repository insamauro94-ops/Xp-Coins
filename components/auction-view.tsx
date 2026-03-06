"use client"

import { SubastaState } from "@/types/xp-types"

interface Props {
  subasta: SubastaState
  onUpdate: (data: Partial<SubastaState>) => void
}

export default function AuctionView({ subasta, onUpdate }: Props) {

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Subasta</h2>

      <input
        type="text"
        placeholder="Premio"
        value={subasta.premio}
        onChange={(e) =>
          onUpdate({ premio: e.target.value })
        }
      />

      <div style={{ marginTop: 10 }}>
        Puja actual: {subasta.pujaActual}
      </div>

    </div>
  )
}