import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface SelectButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'p-2 text-sm',
  md: 'p-3 text-base',
  lg: 'p-4 text-lg',
}

export const SelectButton = forwardRef<HTMLButtonElement, SelectButtonProps>(
  ({ selected, size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'font-medium rounded-md border transition-colors duration-200',
          sizeClasses[size],
          selected
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

SelectButton.displayName = 'SelectButton'

export default SelectButton
