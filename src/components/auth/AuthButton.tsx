import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary';
}

export const AuthButton = React.forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ children, loading, loadingText, variant = 'primary', className, disabled, ...props }, ref) => {
    const isPrimary = variant === 'primary';

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "w-full font-bold text-base rounded-xl py-4 px-6 transition-all duration-300 flex items-center justify-center gap-2",
          isPrimary && [
            "bg-gradient-to-r from-[#00FF94] to-[#00D97E] text-black",
            "shadow-[0_8px_24px_rgba(0,255,148,0.4)]",
            "hover:translate-y-[-2px] hover:shadow-[0_12px_32px_rgba(0,255,148,0.5)]",
            "active:scale-[0.98]",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_8px_24px_rgba(0,255,148,0.4)]",
          ],
          !isPrimary && [
            "bg-transparent border-2 border-[#00FF94]/30 text-[#00FF94]",
            "hover:bg-[#00FF94]/5 hover:border-[#00FF94]/50 hover:translate-y-[-1px]",
            "active:scale-[0.98]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          ],
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {loadingText || 'Carregando...'}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

AuthButton.displayName = 'AuthButton';
