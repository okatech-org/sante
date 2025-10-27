import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  Lock,
  MapPin,
  Phone,
  Shield,
  Upload,
  User,
  X,
  Loader2,
  Download,
  Eye
} from "lucide-react";
import { 
  claimService, 
  type Establishment, 
  type EstablishmentClaim,
  type ValidationResult 
} from '@/services/EstablishmentClaimService';
import { supabase } from '@/integrations/supabase/client';

// Étapes du processus
const STEPS = [
  { id: 1, title: 'Vérification Identité', description: 'Confirmez votre identité et votre rôle' },
  { id: 2, title: 'Documents Légaux', description: 'Téléchargez les documents requis' },
  { id: 3, title: 'Validation', description: 'Vérifiez et soumettez votre demande' }
];

// Rôles possibles
const CLAIMANT_ROLES = [
  { value: 'Directeur', label: 'Directeur Général' },
  { value: 'Administrateur', label: 'Administrateur' },
  { value: 'Propriétaire', label: 'Propriétaire' },
  { value: 'Gérant', label: 'Gérant' },
  { value: 'Médecin Chef', label: 'Médecin Chef' }
];

// Types de documents requis
const DOCUMENT_TYPES = {
  official_letter: {
    label: 'Lettre Officielle',
    description: 'Lettre sur papier en-tête de l\'établissement',
    required: true,
    accept: '.pdf,.jpg,.jpeg,.png'
  },
  identity_proof: {
    label: 'Pièce d\'Identité',
    description: 'CNI ou Passeport du responsable',
    required: true,
    accept: '.pdf,.jpg,.jpeg,.png'
  },
  authority_proof: {
    label: 'Justificatif d\'Autorité',
    description: 'Nomination, contrat, ou mandat',
    required: true,
    accept: '.pdf,.jpg,.jpeg,.png'
  },
  rccm_document: {
    label: 'Registre de Commerce',
    description: 'RCCM pour les établissements privés',
    required: false,
    accept: '.pdf,.jpg,.jpeg,.png'
  },
  msp_authorization: {
    label: 'Autorisation Ministère Santé',
    description: 'Autorisation du Ministère de la Santé',
    required: false,
    accept: '.pdf,.jpg,.jpeg,.png'
  }
};

// Composant pour l'upload de fichier
function DocumentUpload({
  type,
  label,
  description,
  required,
  accept,
  value,
  onChange,
  onUpload
}: {
  type: string;
  label: string;
  description: string;
  required: boolean;
  accept: string;
  value?: string;
  onChange: (file: File | null) => void;
  onUpload: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    onChange(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    await onUpload();
    setUploading(false);
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <Label className="text-base font-semibold">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        {value && (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Téléchargé
          </Badge>
        )}
      </div>
      
      <div className="flex gap-2">
        <Input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="flex-1"
          disabled={uploading}
        />
        {selectedFile && !value && (
          <Button
            onClick={handleUpload}
            disabled={uploading}
            size="sm"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
          </Button>
        )}
        {value && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(value, '_blank')}
          >
            <Eye className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function ClaimEstablishment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [claim, setClaim] = useState<EstablishmentClaim | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [claimReason, setClaimReason] = useState<string>('');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  
  // Données du formulaire
  const [formData, setFormData] = useState({
    claimant_role: '',
    claimant_title: '',
    claimant_phone: '',
    claimant_email: '',
    documents: {} as Record<string, File | null>,
    uploadedDocuments: {} as Record<string, string>
  });

  useEffect(() => {
    if (id) {
      loadEstablishment();
      checkClaimEligibility();
    }
  }, [id]);

  const loadEstablishment = async () => {
    try {
      setLoading(true);
      const data = await claimService.getEstablishmentDetails(id!);
      if (data) {
        setEstablishment(data);
      } else {
        toast({
          title: "Erreur",
          description: "Établissement introuvable",
          variant: "destructive"
        });
        navigate('/establishments/unclaimed');
      }
    } catch (error) {
      console.error('Error loading establishment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'établissement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkClaimEligibility = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setClaimReason('Vous devez être connecté pour revendiquer un établissement');
        return;
      }
      
      const result = await claimService.canUserClaimEstablishment(user.id, id!);
      setCanClaim(result.canClaim);
      if (!result.canClaim && result.reason) {
        setClaimReason(result.reason);
      }
    } catch (error) {
      console.error('Error checking eligibility:', error);
    }
  };

  const handleInitiateClaim = async () => {
    try {
      const claimData = await claimService.initiateClaim(id!, {
        claimant_role: formData.claimant_role,
        claimant_phone: formData.claimant_phone,
        claimant_email: formData.claimant_email,
        claimant_title: formData.claimant_title
      });
      setClaim(claimData);
      setCurrentStep(2);
    } catch (error) {
      console.error('Error initiating claim:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'initier la revendication",
        variant: "destructive"
      });
    }
  };

  const handleDocumentUpload = async (type: string) => {
    if (!claim || !formData.documents[type]) return;
    
    try {
      const url = await claimService.uploadVerificationDocument(
        claim.id,
        type,
        formData.documents[type]!
      );
      
      setFormData(prev => ({
        ...prev,
        uploadedDocuments: {
          ...prev.uploadedDocuments,
          [type]: url
        }
      }));
      
      toast({
        title: "Document téléchargé",
        description: "Le document a été téléchargé avec succès"
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document",
        variant: "destructive"
      });
    }
  };

  const validateClaim = async () => {
    if (!claim) return;
    
    try {
      const result = await claimService.validateDocuments(claim.id);
      setValidation(result);
      
      if (result.isValid) {
        setCurrentStep(3);
      } else {
        toast({
          title: "Documents manquants",
          description: result.missingDocuments.join(', '),
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error validating claim:', error);
    }
  };

  const handleSubmitClaim = async () => {
    if (!claim) return;
    
    try {
      setSubmitting(true);
      await claimService.submitClaimForReview(claim.id);
      
      toast({
        title: "Revendication soumise",
        description: "Votre demande sera examinée sous 24-48 heures"
      });
      
      navigate('/my-claims');
    } catch (error) {
      console.error('Error submitting claim:', error);
      toast({
        title: "Erreur",
        description: "Impossible de soumettre la revendication",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="role">Votre Rôle dans l'Établissement *</Label>
              <Select
                value={formData.claimant_role}
                onValueChange={(value) => setFormData({...formData, claimant_role: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre rôle" />
                </SelectTrigger>
                <SelectContent>
                  {CLAIMANT_ROLES.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="title">Titre Officiel</Label>
              <Input
                id="title"
                value={formData.claimant_title}
                onChange={(e) => setFormData({...formData, claimant_title: e.target.value})}
                placeholder="Ex: Directeur Général, Médecin Chef..."
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Téléphone Professionnel *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.claimant_phone}
                onChange={(e) => setFormData({...formData, claimant_phone: e.target.value})}
                placeholder="+241..."
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Professionnel *</Label>
              <Input
                id="email"
                type="email"
                value={formData.claimant_email}
                onChange={(e) => setFormData({...formData, claimant_email: e.target.value})}
                placeholder="direction@etablissement.ga"
                required
              />
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Information importante</AlertTitle>
              <AlertDescription>
                Vous devez être officiellement mandaté pour représenter cet établissement.
                Les fausses déclarations sont passibles de poursuites judiciaires.
              </AlertDescription>
            </Alert>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>Documents Requis</AlertTitle>
              <AlertDescription>
                Téléchargez tous les documents nécessaires pour vérifier votre autorité sur cet établissement.
                Les documents doivent être lisibles et en format PDF ou image.
              </AlertDescription>
            </Alert>
            
            {Object.entries(DOCUMENT_TYPES).map(([key, doc]) => {
              // Afficher RCCM uniquement pour les privés
              if (key === 'rccm_document' && establishment?.sector !== 'private') {
                return null;
              }
              // Afficher autorisation MSP pour hôpitaux/cliniques
              if (key === 'msp_authorization' && 
                  !['hospital', 'clinic'].includes(establishment?.type || '')) {
                return null;
              }
              
              return (
                <DocumentUpload
                  key={key}
                  type={key}
                  label={doc.label}
                  description={doc.description}
                  required={doc.required}
                  accept={doc.accept}
                  value={formData.uploadedDocuments[key]}
                  onChange={(file) => setFormData(prev => ({
                    ...prev,
                    documents: { ...prev.documents, [key]: file }
                  }))}
                  onUpload={() => handleDocumentUpload(key)}
                />
              );
            })}
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-900">Prêt pour la soumission</AlertTitle>
              <AlertDescription className="text-blue-700">
                Vérifiez une dernière fois vos informations avant de soumettre votre demande.
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Récapitulatif de votre Demande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Établissement</p>
                  <p className="font-semibold">{establishment?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Votre Rôle</p>
                  <p className="font-semibold">{formData.claimant_role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-semibold">{formData.claimant_email}</p>
                  <p className="font-semibold">{formData.claimant_phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Documents Fournis</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Object.keys(formData.uploadedDocuments).map(doc => (
                      <Badge key={doc} variant="secondary">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {DOCUMENT_TYPES[doc as keyof typeof DOCUMENT_TYPES]?.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {validation && !validation.isValid && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Validation échouée</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2">
                    {validation.errors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertTitle>Engagement de Responsabilité</AlertTitle>
              <AlertDescription>
                En soumettant cette demande, je certifie sur l'honneur :
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Être légalement autorisé à représenter cet établissement</li>
                  <li>Que tous les documents fournis sont authentiques</li>
                  <li>Comprendre que les fausses déclarations sont punissables par la loi</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!establishment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Établissement introuvable</h3>
            <Button onClick={() => navigate('/establishments/unclaimed')} className="mt-4">
              Retour à la liste
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/establishments/unclaimed')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Revendiquer la Gestion de l'Établissement
          </h1>
        </div>

        {/* Établissement Info */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{establishment.name}</CardTitle>
                <CardDescription className="mt-2">
                  {establishment.type === 'hospital' ? 'Hôpital' :
                   establishment.type === 'clinic' ? 'Clinique' :
                   establishment.type === 'cabinet' ? 'Cabinet Médical' :
                   establishment.type === 'pharmacy' ? 'Pharmacie' : 'Laboratoire'}
                  {' • '}
                  {establishment.sector === 'public' ? 'Public' : 'Privé'}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Clock className="w-3 h-3 mr-1" />
                Non-Revendiqué
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{establishment.address || 'Adresse non spécifiée'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>{establishment.city}, {establishment.province}</span>
              </div>
              {establishment.public_contact_phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{establishment.public_contact_phone}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Check eligibility */}
        {!canClaim && claimReason && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Revendication impossible</AlertTitle>
            <AlertDescription>{claimReason}</AlertDescription>
          </Alert>
        )}

        {canClaim && (
          <>
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {STEPS.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center font-semibold
                        ${currentStep > step.id ? 'bg-green-500 text-white' :
                          currentStep === step.id ? 'bg-blue-500 text-white' :
                          'bg-gray-200 text-gray-500'}
                      `}>
                        {currentStep > step.id ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <p className="text-sm font-medium mt-2">{step.title}</p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className={`flex-1 h-1 mx-4 ${
                        currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <Card>
              <CardHeader>
                <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
                <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
              </CardHeader>
              <CardContent>
                {getStepContent()}
              </CardContent>
              <div className="px-6 pb-6 flex justify-between">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    disabled={submitting}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Précédent
                  </Button>
                )}
                
                <div className="ml-auto">
                  {currentStep === 1 && (
                    <Button
                      onClick={handleInitiateClaim}
                      disabled={!formData.claimant_role || !formData.claimant_phone || !formData.claimant_email}
                    >
                      Suivant
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                  
                  {currentStep === 2 && (
                    <Button onClick={validateClaim}>
                      Valider les Documents
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                  
                  {currentStep === 3 && (
                    <Button
                      onClick={handleSubmitClaim}
                      disabled={submitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Soumission...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Soumettre la Revendication
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
