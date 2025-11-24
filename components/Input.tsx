import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-cpss-green mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 border rounded-apple focus:outline-none focus:ring-2 focus:ring-cpss-green focus:border-cpss-green bg-dark-bg-secondary text-dark-text placeholder-dark-text-muted ${
          error ? 'border-red-500' : 'border-dark-border'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}

