import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building2, Sparkles, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const isPasswordStrong = password.length >= 8 && 
    /[A-Z]/.test(password) && 
    /[0-9]/.test(password) && 
    /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return;
    }

    if (!isPasswordStrong) {
      toast({
        title: 'Senha fraca',
        description: 'A senha deve atender todos os requisitos de segurança.',
        variant: 'destructive',
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: 'Termos obrigatórios',
        description: 'Você precisa aceitar os termos de uso.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, fullName, companyName || undefined);

    if (error) {
      toast({
        title: 'Erro ao criar conta',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Você já pode fazer login.',
      });
      navigate('/login');
    }

    setLoading(false);
  };

  return (
    <AuthBackground>
      <div className="w-full max-w-[450px] mx-auto px-4 py-8">
        <div 
          className="relative backdrop-blur-2xl rounded-3xl p-10 animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, rgba(24,24,27,0.95), rgba(18,18,20,0.98))',
            border: '2px solid rgba(0,255,148,0.2)',
            boxShadow: `
              0 30px 80px rgba(0,0,0,0.6),
              0 0 60px rgba(0,255,148,0.15),
              inset 0 1px 0 rgba(255,255,255,0.05)
            `,
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div 
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00FF94] to-[#00D97E] flex items-center justify-center mb-3"
              style={{
                boxShadow: '0 8px 32px rgba(0,255,148,0.4)',
              }}
            >
              <Sparkles className="w-7 h-7 text-black" />
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              DEV <span className="text-[#00FF94]">PROMPTS</span>
            </h1>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 
              className="text-2xl font-bold text-white mb-2"
              style={{ letterSpacing: '-0.02em' }}
            >
              Crie sua conta
            </h2>
            <p className="text-gray-400 text-sm">
              Comece a criar prompts profissionais hoje
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              label="Nome Completo *"
              type="text"
              icon={User}
              placeholder="Seu nome"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
            />

            <AuthInput
              label="E-mail profissional *"
              type="email"
              icon={Mail}
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <div>
              <AuthInput
                label="Senha *"
                icon={Lock}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                showPasswordToggle
                autoComplete="new-password"
              />
              <PasswordStrength password={password} />
            </div>

            <div className="relative">
              <AuthInput
                label="Confirme a senha *"
                icon={Lock}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                showPasswordToggle
                autoComplete="new-password"
                error={confirmPassword && !passwordsMatch ? 'As senhas não coincidem' : undefined}
              />
              {passwordsMatch && (
                <div className="absolute right-4 top-[38px] text-green-500">
                  <Check className="w-5 h-5" />
                </div>
              )}
            </div>

            <AuthInput
              label="Nome da Empresa"
              type="text"
              icon={Building2}
              placeholder="Ex: Minha Empresa Ltda"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              autoComplete="organization"
            />
            <p className="text-gray-500 text-xs -mt-2">
              Você pode convidar colaboradores depois
            </p>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group mt-6">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="sr-only"
                  required
                />
                <div 
                  className={cn(
                    "w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center",
                    acceptTerms 
                      ? 'bg-[#00FF94] border-[#00FF94]' 
                      : 'border-zinc-600 group-hover:border-zinc-500'
                  )}
                >
                  {acceptTerms && (
                    <svg className="w-3 h-3 text-black" viewBox="0 0 12 12">
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-gray-300 text-sm leading-relaxed">
                Eu aceito os{' '}
                <Link to="/terms" className="text-[#00FF94] hover:underline">
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link to="/privacy" className="text-[#00FF94] hover:underline">
                  Política de Privacidade
                </Link>
              </span>
            </label>

            {/* Submit button */}
            <AuthButton 
              type="submit" 
              loading={loading} 
              loadingText="Criando conta..."
              className="mt-6"
            >
              Criar minha conta
            </AuthButton>
          </form>

          {/* Login link */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-[#00FF94] hover:underline font-medium">
              Faça login
            </Link>
          </p>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-6">
            © 2025 DEV PROMPTS. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </AuthBackground>
  );
};

export default Register;
