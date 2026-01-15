import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, AlertCircle } from 'lucide-react';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { AuthButton } from '@/components/auth/AuthButton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDemoAccess = async () => {
    setLoading(true);
    await signIn('demo@devprompts.com', 'demo123');
    toast({
      title: 'Modo Demo Ativado!',
      description: 'Você está usando o sistema em modo demonstração.',
    });
    navigate('/');
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

          {/* Back link */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao login
          </Link>

          {/* Demo Mode Info */}
          <div
            className="flex items-start gap-3 mb-8 p-4 rounded-xl"
            style={{
              background: 'rgba(0,255,148,0.1)',
              border: '1px solid rgba(0,255,148,0.2)',
            }}
          >
            <AlertCircle className="w-5 h-5 text-[#00FF94] flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-semibold text-[#00FF94] mb-1">Modo Demo Ativo</p>
              <p>No modo demonstração, não é necessário recuperar senha. Você pode acessar diretamente o sistema.</p>
            </div>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h2
              className="text-3xl font-bold text-white mb-2"
              style={{ letterSpacing: '-0.02em' }}
            >
              Recuperar senha
            </h2>
            <p className="text-gray-400 text-base">
              Esta funcionalidade está disponível apenas com Supabase configurado.
            </p>
          </div>

          {/* Demo Access Button */}
          <button
            type="button"
            onClick={handleDemoAccess}
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl text-base font-semibold transition-all duration-300 mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(0,255,148,0.15) 0%, rgba(0,255,148,0.05) 100%)',
              border: '2px solid rgba(0,255,148,0.3)',
              color: '#00FF94',
            }}
          >
            🚀 Acessar Modo Demo
          </button>

          {/* Back to Login Button */}
          <AuthButton
            variant="secondary"
            onClick={() => navigate('/login')}
          >
            Voltar ao Login
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

export default ForgotPassword;
