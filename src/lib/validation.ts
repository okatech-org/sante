import { z } from "zod";

// Schéma de validation pour l'inscription patient
export const patientRegistrationSchema = z.object({
  // Étape 1 : Informations personnelles
  lastName: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le nom ne peut contenir que des lettres")
    .transform((val) => val.toUpperCase()),
  
  firstName: z.string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le prénom ne peut contenir que des lettres")
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()),
  
  birthDate: z.date({
    required_error: "La date de naissance est requise",
  }).refine((date) => {
    const age = new Date().getFullYear() - date.getFullYear();
    return age >= 0 && age <= 120;
  }, "Date de naissance invalide"),
  
  gender: z.enum(["M", "F"], {
    required_error: "Le sexe est requis",
  }),
  
  phone: z.string()
    .regex(/^\+241\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/, "Format invalide. Ex: +241 XX XX XX XX")
    .min(1, "Le numéro de téléphone est requis"),
  
  email: z.string()
    .email("Adresse email invalide")
    .optional()
    .or(z.literal("")),

  // Étape 2 : Adresse
  province: z.string()
    .min(1, "La province est requise"),
  
  city: z.string()
    .min(1, "La ville est requise"),
  
  neighborhood: z.string()
    .max(100, "Le quartier ne peut pas dépasser 100 caractères")
    .optional()
    .or(z.literal("")),

  // Étape 3 : Assurance
  insuranceType: z.enum(["none", "cnamgs", "cnss", "mutuelle"], {
    required_error: "Le type d'assurance est requis",
  }),
  
  // CNAMGS
  cnamgsNumber: z.string()
    .optional()
    .or(z.literal("")),
  
  cnamgsFund: z.enum(["public", "private", "gef"])
    .optional(),

  // CNSS
  cnssNumber: z.string()
    .optional()
    .or(z.literal("")),

  // Mutuelle
  mutuelleProvider: z.string()
    .optional()
    .or(z.literal("")),
  
  mutuelleMemberNumber: z.string()
    .optional()
    .or(z.literal("")),

  // Étape 4 : Sécurité
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  
  passwordConfirm: z.string()
    .min(1, "Veuillez confirmer votre mot de passe"),
  
  acceptTerms: z.boolean()
    .refine((val) => val === true, "Vous devez accepter les conditions d'utilisation"),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Les mots de passe ne correspondent pas",
  path: ["passwordConfirm"],
}).refine((data) => {
  // Validation conditionnelle pour CNAMGS
  if (data.insuranceType === "cnamgs") {
    return data.cnamgsNumber && data.cnamgsNumber.length > 0 && data.cnamgsFund;
  }
  return true;
}, {
  message: "Numéro CNAMGS et fonds requis",
  path: ["cnamgsNumber"],
}).refine((data) => {
  // Validation conditionnelle pour CNSS
  if (data.insuranceType === "cnss") {
    return data.cnssNumber && data.cnssNumber.length > 0;
  }
  return true;
}, {
  message: "Numéro CNSS requis",
  path: ["cnssNumber"],
}).refine((data) => {
  // Validation conditionnelle pour Mutuelle
  if (data.insuranceType === "mutuelle") {
    return data.mutuelleProvider && data.mutuelleProvider.length > 0 && 
           data.mutuelleMemberNumber && data.mutuelleMemberNumber.length > 0;
  }
  return true;
}, {
  message: "Nom de la mutuelle et numéro d'adhérent requis",
  path: ["mutuelleProvider"],
});

export type PatientRegistrationData = z.infer<typeof patientRegistrationSchema>;

// Schéma de validation pour la connexion
export const loginSchema = z.object({
  identifier: z.string()
    .min(1, "Email ou téléphone requis"),
  
  password: z.string()
    .min(1, "Mot de passe requis"),
  
  rememberMe: z.boolean().optional(),
});

export type LoginData = z.infer<typeof loginSchema>;

// Schéma de validation pour l'inscription professionnelle
export const professionalRegistrationSchema = z.object({
  // Étape 1 : Type de professionnel
  professionalType: z.enum(["doctor", "medical-staff", "pharmacy", "laboratory", "hospital"], {
    required_error: "Le type de professionnel est requis",
  }),
  
  medicalStaffType: z.string()
    .optional()
    .or(z.literal("")),
  
  doctorSpecialty: z.string()
    .optional()
    .or(z.literal("")),
  
  // Étape 2 : Informations professionnelles
  lastName: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le nom ne peut contenir que des lettres")
    .transform((val) => val.toUpperCase()),
  
  firstName: z.string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le prénom ne peut contenir que des lettres")
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()),
  
  gender: z.enum(["M", "F"], {
    required_error: "Le genre est requis",
  }),
  
  title: z.enum(["doctor", "professor"], {
    required_error: "Le titre est requis",
  }),
  
  birthDate: z.date({
    required_error: "La date de naissance est requise",
  }).refine((date) => {
    const age = new Date().getFullYear() - date.getFullYear();
    return age >= 18 && age <= 80;
  }, "Vous devez avoir entre 18 et 80 ans"),
  
  nationality: z.string()
    .min(1, "La nationalité est requise"),
  
  establishmentName: z.string()
    .min(2, "Le nom de l'établissement doit contenir au moins 2 caractères")
    .max(150, "Le nom ne peut pas dépasser 150 caractères"),
  
  specialty: z.string()
    .min(2, "La spécialité est requise")
    .max(100, "La spécialité ne peut pas dépasser 100 caractères")
    .optional()
    .or(z.literal("")),
  
  licenseNumber: z.string()
    .min(5, "Le numéro de licence doit contenir au moins 5 caractères")
    .max(50, "Le numéro de licence ne peut pas dépasser 50 caractères"),
  
  // Étape 3 : Contact professionnel
  professionalPhone: z.string()
    .regex(/^\+241\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/, "Format invalide. Ex: +241 XX XX XX XX")
    .min(1, "Le numéro de téléphone professionnel est requis"),
  
  professionalEmail: z.string()
    .email("Adresse email invalide")
    .min(1, "L'email professionnel est requis"),
  
  // Étape 4 : Adresse de l'établissement
  province: z.string()
    .min(1, "La province est requise"),
  
  city: z.string()
    .min(1, "La ville est requise"),
  
  address: z.string()
    .min(5, "L'adresse complète est requise")
    .max(200, "L'adresse ne peut pas dépasser 200 caractères"),
  
  // Étape 5 : Sécurité
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  
  passwordConfirm: z.string()
    .min(1, "Veuillez confirmer votre mot de passe"),
  
  acceptTerms: z.boolean()
    .refine((val) => val === true, "Vous devez accepter les conditions d'utilisation"),
    
  acceptProfessionalCode: z.boolean()
    .refine((val) => val === true, "Vous devez accepter le code de déontologie"),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Les mots de passe ne correspondent pas",
  path: ["passwordConfirm"],
}).refine((data) => {
  // Validation conditionnelle pour le type de corps médical
  if (data.professionalType === "medical-staff") {
    return data.medicalStaffType && data.medicalStaffType.length > 0;
  }
  return true;
}, {
  message: "Veuillez spécifier votre corps médical",
  path: ["medicalStaffType"],
}).refine((data) => {
  // Validation conditionnelle pour la spécialité médicale
  if (data.professionalType === "doctor") {
    return data.doctorSpecialty && data.doctorSpecialty.length > 0;
  }
  return true;
}, {
  message: "Veuillez spécifier votre spécialité",
  path: ["doctorSpecialty"],
});

export type ProfessionalRegistrationData = z.infer<typeof professionalRegistrationSchema>;
