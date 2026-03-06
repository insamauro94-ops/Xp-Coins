"use client"

import { SubastaState } from "@/lib/xp-types"

interface Props {
  subasta: SubastaState
  onUpdate: (data: Partial<SubastaState>) => void
}

export default function AuctionView({ subasta, onUpdate }: Props) {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Subasta</h3>

      <input
        placeholder="Premio"
        value={subasta.premio}
        onChange={(e) => onUpdate({ premio: e.target.value })}
      />

      <div>Puja actual: {subasta.pujaActual}</div>

      <button onClick={() => onUpdate({ pujaActual: subasta.pujaActual + subasta.incremento })}>
        Subir Puja
      </button>
    </div>
  )
}