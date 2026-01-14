import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: 'Erro ao entrar',
        description: error.message === 'Invalid login credentials' 
          ? 'Email ou senha incorretos'
          : error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Bem-vindo de volta!',
        description: 'Login realizado com sucesso.',
      });
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <AuthBackground>
      <div className="w-full max-w-[450px] mx-auto px-4">
        <div 
          className="relative backdrop-blur-2xl rounded-3xl p-12 animate-fade-in"
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
          <div className="flex flex-col items-center mb-8">
            <div 
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00FF94] to-[#00D97E] flex items-center justify-center mb-4"
              style={{
                boxShadow: '0 8px 32px rgba(0,255,148,0.4)',
              }}
            >
              <Sparkles className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              DEV <span className="text-[#00FF94]">PROMPTS</span>
            </h1>
          </div>

          {/* Title */}
          <div className="text-center mb-10">
            <h2 
              className="text-3xl font-bold text-white mb-2"
              style={{ letterSpacing: '-0.02em' }}
            >
              Bem-vindo de volta
            </h2>
            <p className="text-gray-400 text-base">
              Entre para gerenciar seus prompts profissionais
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              label="E-mail"
              type="email"
              icon={Mail}
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <AuthInput
              label="Senha"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              showPasswordToggle
              autoComplete="current-password"
            />

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div 
                    className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                      rememberMe 
                        ? 'bg-[#00FF94] border-[#00FF94]' 
                        : 'border-zinc-600 group-hover:border-zinc-500'
                    }`}
                  >
                    {rememberMe && (
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
                <span className="text-gray-300 text-sm">Lembrar-me</span>
              </label>

              <Link 
                to="/forgot-password"
                className="text-[#00FF94] text-sm hover:underline transition-all"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            {/* Submit button */}
            <AuthButton 
              type="submit" 
              loading={loading} 
              loadingText="Entrando..."
            >
              Entrar
            </AuthButton>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-zinc-900/50 text-gray-500">ou</span>
            </div>
          </div>

          {/* Create account button */}
          <AuthButton 
            variant="secondary"
            onClick={() => navigate('/register')}
          >
            Criar nova conta
          </AuthButton>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-8">
            © 2025 DEV PROMPTS. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </AuthBackground>
  );
};

export default Login;
