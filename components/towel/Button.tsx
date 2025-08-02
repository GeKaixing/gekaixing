import clsx from "clsx"
import React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
  children: React.ReactNode
}

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx('h-9 border border-gray-300 rounded-2xl flex justify-center items-center w-2xs', className)}
      {...props}
    >
      {children}
    </button>
  )
}
