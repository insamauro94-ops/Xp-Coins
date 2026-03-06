import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  variant?: string
  size?: string
  asChild?: boolean
}

export function Button({ className = "", children, ...props }: ButtonProps) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  )
}