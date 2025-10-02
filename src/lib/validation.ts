import { z } from "zod";

// Schéma de validation pour l'inscription patient
export const patientRegistrationSchema = z.object({
  // Étape 1 : Informations personnelles
  fullName: z.string()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le nom ne peut contenir que des lettres"),
  
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
