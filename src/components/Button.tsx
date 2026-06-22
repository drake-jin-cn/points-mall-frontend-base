import React from 'react'

export interface ButtonProps {
  label: string
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {label}
    </button>
  )
}
