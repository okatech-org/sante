import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, Mail, MessageCircle, HelpCircle, Book, Video } from "lucide-react";
import { toast } from "sonner";

export default function Support() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Votre message a été envoyé avec succès");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Aide & Support</h1>
          <p className="text-muted-foreground mt-2">
            Nous sommes là pour vous aider. Consultez notre FAQ ou contactez-nous directement.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Téléphone</h3>
            <p className="text-sm text-muted-foreground mb-3">Lun-Ven 8h-18h</p>
            <a href="tel:+24111234567" className="text-primary hover:underline">
              +241 11 23 45 67
            </a>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-sm text-muted-foreground mb-3">Réponse sous 24h</p>
            <a href="mailto:support@sante.ga" className="text-primary hover:underline">
              support@sante.ga
            </a>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Chat en direct</h3>
            <p className="text-sm text-muted-foreground mb-3">Disponible maintenant</p>
            <Button variant="link" className="p-0">
              Démarrer le chat
            </Button>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Questions Fréquentes (FAQ)</h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Comment prendre un rendez-vous ?</AccordionTrigger>
                <AccordionContent>
                  Pour prendre rendez-vous, cliquez sur "Mes Rendez-vous" dans le menu, puis "Nouveau rendez-vous". 
                  Sélectionnez votre prestataire, la date et l'heure souhaitées.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>Comment utiliser la CNAMGS ?</AccordionTrigger>
                <AccordionContent>
                  Présentez votre carte CNAMGS lors de votre consultation. Le prestataire conventionné 
                  appliquera automatiquement le tiers-payant. Vous pouvez suivre vos remboursements 
                  dans la section "Remboursements CNAMGS".
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>Comment accéder à mes résultats d'analyses ?</AccordionTrigger>
                <AccordionContent>
                  Vos résultats sont disponibles dans la section "Mes Résultats". Vous recevrez également 
                  une notification par email dès qu'un nouveau résultat est disponible.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Puis-je annuler un rendez-vous ?</AccordionTrigger>
                <AccordionContent>
                  Oui, vous pouvez annuler un rendez-vous jusqu'à 24h avant l'heure prévue. 
                  Allez dans "Mes Rendez-vous", sélectionnez le rendez-vous et cliquez sur "Annuler".
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>Comment modifier mes informations personnelles ?</AccordionTrigger>
                <AccordionContent>
                  Rendez-vous dans votre profil en cliquant sur l'icône utilisateur. 
                  Vous pourrez modifier vos informations personnelles, adresse et contacts.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Contactez-nous</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Sujet</Label>
                <Input id="subject" placeholder="Objet de votre demande" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Décrivez votre problème ou question..."
                  rows={6}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                Envoyer le message
              </Button>
            </form>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Book className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Guides & Tutoriels</h2>
            </div>
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start">
                <Book className="h-4 w-4 mr-2" />
                Guide de démarrage
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Book className="h-4 w-4 mr-2" />
                Utiliser la cartographie santé
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Book className="h-4 w-4 mr-2" />
                Gérer vos ordonnances
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Video className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Vidéos d'aide</h2>
            </div>
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start">
                <Video className="h-4 w-4 mr-2" />
                Prendre un rendez-vous
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Video className="h-4 w-4 mr-2" />
                Consulter vos résultats
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Video className="h-4 w-4 mr-2" />
                Demander un remboursement
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
