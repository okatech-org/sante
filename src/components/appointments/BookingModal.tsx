import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Step1ConsultationType } from "./Step1ConsultationType";
import { Step2DateTime } from "./Step2DateTime";
import { Step3ReasonInfo } from "./Step3ReasonInfo";
import { Step4Payment } from "./Step4Payment";
import { useAppointmentStore } from "@/stores/appointmentStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

export const BookingModal = ({ open, onClose }: BookingModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { resetAppointment } = useAppointmentStore();

  const steps = [
    { number: 1, title: "Type de consultation" },
    { number: 2, title: "Date & Heure" },
    { number: 3, title: "Motif & Informations" },
    { number: 4, title: "Paiement & Confirmation" }
  ];

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirm = () => {
    // Simulate booking confirmation
    toast.loading("Confirmation du rendez-vous...");
    
    setTimeout(() => {
      toast.success("Rendez-vous confirmé !");
      onClose();
      setCurrentStep(1);
      navigate("/appointments/confirmation/123"); // Mock ID
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setCurrentStep(1);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-background border-b">
          {/* Stepper horizontal */}
          <div className="hidden md:flex items-center justify-between px-8 py-6">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
                      currentStep >= step.number
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="hidden lg:block">
                    <p
                      className={`text-sm font-medium ${
                        currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      Étape {step.number}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.title}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-muted mx-4" />
                )}
              </div>
            ))}
          </div>

          {/* Progress bar mobile */}
          <div className="md:hidden px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">
                Étape {currentStep} / {steps.length}
              </p>
              <p className="text-xs text-muted-foreground">{steps[currentStep - 1].title}</p>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="p-6 md:p-8">
          {currentStep === 1 && <Step1ConsultationType onNext={handleNext} />}
          {currentStep === 2 && <Step2DateTime onNext={handleNext} onBack={handleBack} />}
          {currentStep === 3 && <Step3ReasonInfo onNext={handleNext} onBack={handleBack} />}
          {currentStep === 4 && <Step4Payment onConfirm={handleConfirm} onBack={handleBack} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};
