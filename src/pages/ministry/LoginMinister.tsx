import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Lock, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={cn(
      "relative rounded-3xl border border-white/20 bg-white/70 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70",
      className
    )}
  >
    {children}
  </div>
);

export default function LoginMinister() {
  const [email, setEmail] = useState('ministre@sante.ga');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 via-white to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_15%_15%,rgba(16,185,129,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_85%_85%,rgba(56,189,248,0.15),transparent_55%)]" />

      <GlassCard className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">SANTE.GA</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ministère de la Santé publique et de la Population
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            République Gabonaise
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Adresse email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ministre@sante.ga"
                className="pl-10 rounded-xl bg-white/80 border-white/40 dark:bg-slate-800/50 dark:border-white/10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 rounded-xl bg-white/80 border-white/40 dark:bg-slate-800/50 dark:border-white/10"
                required
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-400/40 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              Email ou mot de passe incorrect
            </div>
          )}

          <Button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/30"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Connexion en cours...
              </span>
            ) : (
              'Se connecter'
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/20 dark:border-white/10 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Accès réservé aux membres autorisés du Ministère
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            © 2025 République Gabonaise — Tous droits réservés
          </p>
        </div>
      </GlassCard>

      {/* Dev Hint */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 rounded-xl bg-slate-900/90 text-white px-4 py-3 text-xs shadow-lg">
          <p className="font-semibold mb-1">🔐 Identifiants de test</p>
          <p className="text-slate-300">Email: ministre@sante.ga</p>
          <p className="text-slate-300">Mot de passe: (à configurer)</p>
        </div>
      )}
    </div>
  );
}

