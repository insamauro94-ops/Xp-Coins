"use client"

interface ConfettiParticle {
  id: number
  x: number
  color: string
  delay: number
  size: number
}

export function Confetti({ particles }: { particles: ConfettiParticle[] }) {
  if (particles.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="animate-confetti absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
