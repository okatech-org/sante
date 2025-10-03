import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ProgressIndicator } from "@/components/registration/ProgressIndicator";
import { professionalRegistrationSchema, ProfessionalRegistrationData } from "@/lib/validation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { sanitizeAuthError, logError } from "@/lib/errorHandler";

// Import des composants d'étapes
import { Step1ProfessionalType } from "@/components/registration/pro/Step1ProfessionalType";
import { Step2ProfessionalInfo } from "@/components/registration/pro/Step2ProfessionalInfo";
import { Step3ProfessionalContact } from "@/components/registration/pro/Step3ProfessionalContact";
import { Step4ProfessionalAddress } from "@/components/registration/pro/Step4ProfessionalAddress";
import { Step5ProfessionalSecurity } from "@/components/registration/pro/Step5ProfessionalSecurity";

const STEPS = ["Type", "Infos", "Contact", "Adresse", "Sécurité"];

export default function RegisterProfessional() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const form = useForm<ProfessionalRegistrationData>({
    resolver: zodResolver(professionalRegistrationSchema),
    defaultValues: {
      professionalType: searchParams.get('type') as any || undefined,
      fullName: "",
      establishmentName: "",
      specialty: "",
      licenseNumber: "",
      professionalPhone: "+241 ",
      professionalEmail: "",
      province: "",
      city: "",
      address: "",
      password: "",
      passwordConfirm: "",
      acceptTerms: false,
      acceptProfessionalCode: false,
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: ProfessionalRegistrationData) => {
    try {
      const { error } = await signUp(data.professionalEmail, data.password, {
        full_name: data.fullName,
        phone: data.professionalPhone,
        professional_type: data.professionalType,
        establishment_name: data.establishmentName,
        specialty: data.specialty,
        license_number: data.licenseNumber,
        address: data.address,
        city: data.city,
        province: data.province,
      });

      if (error) {
        const sanitized = sanitizeAuthError(error);
        if (sanitized.shouldLog) {
          logError('Register Professional', error);
        }
        toast.error("Erreur lors de l'inscription", {
          description: sanitized.message,
        });
        return;
      }

      toast.success("Inscription réussie !", {
        description: "Votre compte professionnel sera activé après vérification par nos équipes. Vous recevrez un email de confirmation.",
        duration: 6000,
      });
      navigate("/login/pro");
    } catch (error: any) {
      toast.error("Erreur lors de l'inscription", {
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof ProfessionalRegistrationData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["professionalType"];
        break;
      case 2:
        fieldsToValidate = ["fullName", "establishmentName", "specialty", "licenseNumber"];
        break;
      case 3:
        fieldsToValidate = ["professionalEmail", "professionalPhone"];
        break;
      case 4:
        fieldsToValidate = ["province", "city", "address"];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Veuillez corriger les erreurs avant de continuer");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ProfessionalType form={form} />;
      case 2:
        return <Step2ProfessionalInfo form={form} />;
      case 3:
        return <Step3ProfessionalContact form={form} />;
      case 4:
        return <Step4ProfessionalAddress form={form} />;
      case 5:
        return <Step5ProfessionalSecurity form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-primary/5 to-background">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-7 w-7 text-primary-foreground" fill="currentColor" />
            </div>
            <div className="w-5" /> {/* Spacer */}
          </div>
          
          <div className="text-center space-y-2">
            <CardTitle className="text-2xl">Inscription Professionnel</CardTitle>
            <CardDescription>Étape {currentStep} sur 5</CardDescription>
          </div>

          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={5}
            stepLabels={STEPS}
          />
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStep()}

              <div className="flex gap-4 pt-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 btn-mobile-xxl"
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    Précédent
                  </Button>
                )}

                {currentStep < 5 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 btn-mobile-xxl"
                  >
                    Suivant
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <Button type="submit" className="flex-1 btn-mobile-xxl">
                    Créer mon compte professionnel
                  </Button>
                )}
              </div>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Déjà inscrit ?{" "}
              <Link to="/login/pro" className="text-primary hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
