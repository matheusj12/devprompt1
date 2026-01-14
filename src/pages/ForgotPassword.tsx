import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setSent(true);
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

          {sent ? (
            // Success state
            <div className="text-center animate-fade-in">
              <div 
                className="w-20 h-20 rounded-full bg-[#00FF94]/20 flex items-center justify-center mx-auto mb-6"
                style={{
                  boxShadow: '0 0 40px rgba(0,255,148,0.3)',
                }}
              >
                <CheckCircle2 className="w-10 h-10 text-[#00FF94]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                E-mail enviado!
              </h2>
              <p className="text-gray-400 mb-8">
                Verifique sua caixa de entrada para instruções de recuperação de senha.
              </p>
              <AuthButton onClick={() => navigate('/login')}>
                Voltar ao login
              </AuthButton>
            </div>
          ) : (
            // Form state
            <>
              {/* Back link */}
              <Link 
                to="/login"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao login
              </Link>

              {/* Title */}
              <div className="mb-8">
                <h2 
                  className="text-3xl font-bold text-white mb-2"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Recuperar senha
                </h2>
                <p className="text-gray-400 text-base">
                  Digite seu e-mail e enviaremos instruções para recuperar sua senha.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
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

                <AuthButton 
                  type="submit" 
                  loading={loading} 
                  loadingText="Enviando..."
                >
                  Enviar instruções
                </AuthButton>
              </form>
            </>
          )}

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-8">
            © 2025 DEV PROMPTS. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </AuthBackground>
  );
};

export default ForgotPassword;
