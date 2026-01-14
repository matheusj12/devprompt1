import React, { useState } from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  showPasswordToggle?: boolean;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, icon: Icon, error, showPasswordToggle, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = showPasswordToggle 
      ? (showPassword ? 'text' : 'password')
      : type;

    return (
      <div className="space-y-2">
        <label className="block text-white font-semibold text-sm">
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <Icon 
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200",
                isFocused ? "text-[#00FF94]" : "text-gray-400"
              )}
            />
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full bg-black/40 border-2 border-zinc-700/60 rounded-xl text-gray-200 text-base placeholder:text-gray-500 placeholder:italic transition-all duration-300",
              "focus:outline-none focus:border-[#00FF94] focus:ring-4 focus:ring-[#00FF94]/20",
              "hover:border-zinc-600",
              Icon ? "pl-12 pr-4 py-3.5" : "px-4 py-3.5",
              showPasswordToggle && "pr-12",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
            style={{
              boxShadow: isFocused ? '0 0 20px rgba(0,255,148,0.3)' : 'none',
            }}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
            <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';
