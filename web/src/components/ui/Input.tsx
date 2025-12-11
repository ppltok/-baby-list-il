import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, required, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm font-medium text-[var(--color-text-primary)]"
          >
            {label}
            {required && (
              <span className="text-[var(--color-terracotta)] ms-1">*</span>
            )}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              `w-full h-12 px-4
              text-[var(--color-text-primary)]
              bg-[var(--color-cream)]
              border rounded-xl
              transition-all duration-200
              placeholder:text-[var(--color-text-muted)]
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:opacity-60 disabled:cursor-not-allowed`,
              icon && 'ps-11',
              error
                ? 'border-[var(--color-terracotta)] focus:ring-[var(--color-terracotta)]'
                : 'border-[var(--color-border-light)] focus:border-[var(--color-chestnut)] focus:ring-[var(--color-chestnut)]',
              className
            )}
            {...props}
          />
          {icon && (
            <span className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              {icon}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-[var(--color-terracotta)]">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
