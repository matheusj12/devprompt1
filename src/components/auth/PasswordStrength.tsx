import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const requirements = [
    { label: 'Mínimo 8 caracteres', test: password.length >= 8 },
    { label: '1 letra maiúscula', test: /[A-Z]/.test(password) },
    { label: '1 número', test: /[0-9]/.test(password) },
    { label: '1 caractere especial', test: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const passedCount = requirements.filter(r => r.test).length;
  const strength = passedCount === 0 ? 0 : passedCount <= 2 ? 1 : passedCount <= 3 ? 2 : 3;
  
  const strengthLabels = ['', 'Fraca', 'Média', 'Forte'];
  const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-green-500'];
  const textColors = ['', 'text-red-400', 'text-yellow-400', 'text-green-400'];

  if (!password) return null;

  return (
    <div className="space-y-3 mt-3">
      {/* Strength bar */}
      <div className="space-y-1.5">
        <div className="flex gap-1.5">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-300",
                strength >= level ? strengthColors[strength] : "bg-zinc-700"
              )}
            />
          ))}
        </div>
        <p className={cn("text-xs font-medium", textColors[strength])}>
          {strengthLabels[strength]}
        </p>
      </div>

      {/* Requirements list */}
      <div className="grid grid-cols-2 gap-2">
        {requirements.map((req, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-2 text-xs transition-colors duration-200",
              req.test ? "text-green-400" : "text-gray-500"
            )}
          >
            {req.test ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <X className="w-3.5 h-3.5" />
            )}
            {req.label}
          </div>
        ))}
      </div>
    </div>
  );
};
