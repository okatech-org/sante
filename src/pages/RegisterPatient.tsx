import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ProgressIndicator } from "@/components/registration/ProgressIndicator";
import { patientRegistrationSchema, PatientRegistrationData } from "@/lib/validation";
import { toast } from "sonner";

// Import des composants d'étapes (à créer)
import { Step1PersonalInfo } from "@/components/registration/Step1PersonalInfo";
import { Step2Address } from "@/components/registration/Step2Address";
import { Step3Insurance } from "@/components/registration/Step3Insurance";
import { Step4Security } from "@/components/registration/Step4Security";
import { useAuth } from "@/contexts/AuthContext";
import { sanitizeAuthError, logError } from "@/lib/errorHandler";

const STEPS = ["Infos", "Adresse", "Assurance", "Sécurité"];

export default function RegisterPatient() {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const form = useForm<PatientRegistrationData>({
    resolver: zodResolver(patientRegistrationSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      gender: undefined,
      phone: "+241 ",
      email: "",
      province: "",
      city: "",
      neighborhood: "",
      insuranceType: "none",
      cnamgsNumber: "",
      cnamgsFund: undefined,
      cnssNumber: "",
      mutuelleProvider: "",
      mutuelleMemberNumber: "",
      password: "",
      passwordConfirm: "",
      acceptTerms: false,
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: PatientRegistrationData) => {
    try {
      const { error } = await signUp(data.email || data.phone, data.password, {
        full_name: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
      });

      if (error) {
        const sanitized = sanitizeAuthError(error);
        if (sanitized.shouldLog) {
          logError('Register', error);
        }
        toast.error("Erreur lors de l'inscription", {
          description: sanitized.message,
        });
        return;
      }

      toast.success("Inscription réussie !", {
        description: "Votre compte patient a été créé avec succès.",
      });
      navigate("/dashboard/patient");
    } catch (error: any) {
      toast.error("Erreur lors de l'inscription", {
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof PatientRegistrationData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["lastName", "firstName", "birthDate", "gender", "phone", "email"];
        break;
      case 2:
        fieldsToValidate = ["province", "city", "neighborhood"];
        break;
      case 3:
        fieldsToValidate = ["insuranceType"];
        const insuranceType = form.getValues("insuranceType");
        if (insuranceType === "cnamgs") {
          fieldsToValidate.push("cnamgsNumber", "cnamgsFund");
        } else if (insuranceType === "cnss") {
          fieldsToValidate.push("cnssNumber");
        } else if (insuranceType === "mutuelle") {
          fieldsToValidate.push("mutuelleProvider", "mutuelleMemberNumber");
        }
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
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
        return <Step1PersonalInfo form={form} />;
      case 2:
        return <Step2Address form={form} />;
      case 3:
        return <Step3Insurance form={form} />;
      case 4:
        return <Step4Security form={form} />;
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
            <div className="w-5" /> {/* Spacer for alignment */}
          </div>
          
          <div className="text-center space-y-2">
            <CardTitle className="text-2xl">Inscription Patient</CardTitle>
            <CardDescription>Étape {currentStep} sur 4</CardDescription>
          </div>

          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={4}
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

                {currentStep < 4 ? (
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
                    Créer mon compte
                  </Button>
                )}
              </div>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Déjà inscrit ?{" "}
              <Link to="/login/patient" className="text-primary hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
