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
              <span className="text-[var(--color-alert)] ms-1">*</span>
            )}
          </label>
        )}
        <div className="flex items-center gap-3">
          {icon && (
            <span className="text-[var(--color-primary-light)] flex-shrink-0 w-5 h-5 flex items-center justify-center">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              `flex-1 h-12
              text-[var(--color-text-primary)]
              bg-white
              border border-gray-300 rounded-xl
              transition-all duration-200
              placeholder:text-[var(--color-text-muted)]
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
              disabled:opacity-60 disabled:cursor-not-allowed
              px-6`,
              error
                ? 'border-[var(--color-alert)] focus:ring-[var(--color-alert)]/30'
                : '',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-[var(--color-alert)]">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
