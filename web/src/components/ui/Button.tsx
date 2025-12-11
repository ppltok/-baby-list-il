import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'sage'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-semibold rounded-full
      transition-all duration-200 ease-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:opacity-60 disabled:cursor-not-allowed
    `

    const variants = {
      primary: `
        bg-[var(--color-chestnut)] text-white
        hover:bg-[var(--color-chestnut-hover)]
        focus-visible:ring-[var(--color-chestnut)]
        active:scale-[0.98]
      `,
      secondary: `
        bg-[var(--color-beige)] text-[var(--color-text-primary)]
        hover:bg-[var(--color-beige-dark)]
        focus-visible:ring-[var(--color-beige)]
        active:scale-[0.98]
      `,
      outline: `
        bg-transparent text-[var(--color-chestnut)]
        border-2 border-[var(--color-chestnut)]
        hover:bg-[var(--color-chestnut)] hover:text-white
        focus-visible:ring-[var(--color-chestnut)]
        active:scale-[0.98]
      `,
      ghost: `
        bg-transparent text-[var(--color-text-secondary)]
        hover:bg-[var(--color-cream-dark)] hover:text-[var(--color-text-primary)]
        focus-visible:ring-[var(--color-chestnut)]
      `,
      sage: `
        bg-[var(--color-sage)] text-white
        hover:bg-[var(--color-sage-light)]
        focus-visible:ring-[var(--color-sage)]
        active:scale-[0.98]
      `,
    }

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-13 px-8 text-lg',
    }

    return (
      <button
        ref={ref}
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          icon && <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
