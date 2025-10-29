import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useOfflineAuth } from "@/contexts/OfflineAuthContext";

// Liste complète des comptes SOGARA
const SOGARA_ACCOUNTS = [
  { 
    email: "admin@sogara.com", 
    password: "Admin@SOGARA2024", 
    fullName: "Jean-Pierre Mbadinga",
    role: "admin",
    department: "Administration",
    matricule: "ADM-001"
  },
  { 
    email: "directeur@sogara.com", 
    password: "DirecteurSOGARA2024!", 
    fullName: "Dr. François Obiang",
    role: "admin",
    department: "Direction Médicale",
    matricule: "DIR-001"
  },
  { 
    email: "dr.okemba@sogara.com", 
    password: "Okemba@2024Med", 
    fullName: "Dr. Marie Okemba",
    role: "doctor",
    department: "Médecine Générale",
    matricule: "MED-012"
  },
  { 
    email: "dr.nguema@sogara.com", 
    password: "Nguema@Urgence24", 
    fullName: "Dr. Paul Nguema",
    role: "doctor",
    department: "Urgences",
    matricule: "MED-015"
  },
  { 
    email: "dr.mbina@sogara.com", 
    password: "Mbina@Cardio2024", 
    fullName: "Dr. Léa Mbina",
    role: "doctor",
    department: "Cardiologie",
    matricule: "MED-018"
  },
  { 
    email: "dr.mezui@sogara.com", 
    password: "Mezui@Pediatrie24", 
    fullName: "Dr. Thomas Mezui",
    role: "doctor",
    department: "Pédiatrie",
    matricule: "MED-022"
  },
  { 
    email: "nurse.mba@sogara.com", 
    password: "MbaSI@2024", 
    fullName: "Sylvie Mba",
    role: "nurse",
    department: "Soins Intensifs",
    matricule: "INF-025"
  },
  { 
    email: "nurse.nze@sogara.com", 
    password: "NzeUrg@2024", 
    fullName: "Patricia Nze",
    role: "nurse",
    department: "Urgences",
    matricule: "INF-028"
  },
  { 
    email: "nurse.andeme@sogara.com", 
    password: "Andeme@Mat2024", 
    fullName: "Claire Andeme",
    role: "nurse",
    department: "Maternité",
    matricule: "INF-030"
  },
  { 
    email: "lab.tech@sogara.com", 
    password: "LabSOGARA@2024", 
    fullName: "André Moussavou",
    role: "lab_tech",
    department: "Laboratoire",
    matricule: "LAB-008"
  },
  { 
    email: "pharma@sogara.com", 
    password: "PharmaSOGARA@24", 
    fullName: "Dr. Lydie Kombila",
    role: "pharmacist",
    department: "Pharmacie",
    matricule: "PHAR-004"
  },
  { 
    email: "accueil@sogara.com", 
    password: "AccueilSOGARA@24", 
    fullName: "Nadège Oyono",
    role: "receptionist",
    department: "Accueil",
    matricule: "REC-002"
  }
];

export default function SogaraLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useOfflineAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Vérifier dans les comptes SOGARA
      const account = SOGARA_ACCOUNTS.find(
        (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
      );

      if (!account) {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
        });
        return;
      }

      // Connecter l'utilisateur avec ses informations complètes
      await signIn(email, [account.role]);
      
      // Stocker les informations supplémentaires dans localStorage
      localStorage.setItem('sogara_user_data', JSON.stringify({
        fullName: account.fullName,
        department: account.department,
        matricule: account.matricule,
        establishment: 'CMST SOGARA'
      }));
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${account.fullName}`,
      });
      
      // Rediriger selon le rôle
      if (account.role === 'admin') {
        navigate("/establishments/sogara/admin");
      } else {
        navigate("/establishments/sogara/admin");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Accueil
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">CMST SOGARA</CardTitle>
          <CardDescription className="text-center">
            Connexion Personnel SOGARA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="prenom.nom@sogara.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              Cette interface est réservée au personnel du CMST SOGARA.
              Pour toute question, contactez l'administration.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

