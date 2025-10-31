import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * Page de redirection depuis l'ancien dashboard SOGARA
 * vers la nouvelle interface unifiée /professional
 */
export default function SogaraRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Nettoyer l'ancien localStorage
    localStorage.removeItem('sogara_user_data');
    
    // Afficher un message
    toast.info("Redirection vers la nouvelle interface", {
      description: "Nous vous redirigeons vers l'espace professionnel unifié"
    });

    // Rediriger après un court délai
    const timer = setTimeout(() => {
      navigate('/professional', { replace: true });
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Redirection en cours...</h2>
        <p className="text-muted-foreground">
          Nous vous redirigeons vers la nouvelle interface professionnelle
        </p>
      </div>
    </div>
  );
}

