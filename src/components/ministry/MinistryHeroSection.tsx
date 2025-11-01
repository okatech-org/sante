import { Button } from "@/components/ui/button";
import { Building2, Phone, Mail, Clock } from "lucide-react";
import { MinistryContact } from "@/types/ministry";

interface MinistryHeroSectionProps {
  contact: MinistryContact;
}

export const MinistryHeroSection = ({ contact }: MinistryHeroSectionProps) => {
  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      
      <div className="relative container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="flex-shrink-0">
            <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-xl">
              <Building2 className="h-12 w-12 text-blue-900" />
            </div>
          </div>

          <div className="flex-1">
            <div className="inline-block px-3 py-1 bg-blue-700/50 rounded-full text-xs font-semibold mb-3">
              République Gabonaise
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Ministère de la Santé publique et de la Population
            </h1>
            <p className="text-lg text-blue-100 mb-4">
              Vers une Couverture Sanitaire Universelle
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="lg">
                Accéder aux Services
              </Button>
              <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" size="lg">
                Programmes Nationaux
              </Button>
            </div>
          </div>

          <div className="lg:w-80 w-full">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wide">
                Contact
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Building2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{contact.adresse_physique}</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div>{contact.telephone_principal}</div>
                    <div className="text-blue-200 text-xs">
                      Secrétariat: {contact.telephone_secretariat}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <a href={`mailto:${contact.email_officiel}`} className="hover:underline">
                    {contact.email_officiel}
                  </a>
                </div>
                
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div>{contact.horaires.lundi_vendredi}</div>
                    <div className="text-blue-200 text-xs">
                      {contact.horaires.weekend}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

