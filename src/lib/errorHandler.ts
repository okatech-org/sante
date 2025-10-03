/**
 * Security: Sanitize error messages to prevent information disclosure
 * Never expose raw database errors or technical details to end users
 */

interface SanitizedError {
  message: string;
  shouldLog: boolean;
}

export const sanitizeAuthError = (error: any): SanitizedError => {
  const errorMessage = error?.message?.toLowerCase() || '';
  
  // Map technical errors to user-friendly messages
  const errorMappings: Record<string, string> = {
    'invalid login credentials': 'Email/téléphone ou mot de passe incorrect',
    'invalid credentials': 'Email/téléphone ou mot de passe incorrect',
    'email not confirmed': 'Veuillez confirmer votre email avant de vous connecter',
    'user not found': 'Email/téléphone ou mot de passe incorrect', // Same message to prevent enumeration
    'invalid email': 'Format d\'email invalide',
    'user already registered': 'Un compte existe déjà avec cet email',
    'email rate limit exceeded': 'Trop de tentatives. Veuillez réessayer dans quelques minutes',
    'password is too weak': 'Le mot de passe ne respecte pas les exigences de sécurité',
    'over email send rate limit': 'Trop d\'emails envoyés. Veuillez réessayer plus tard',
    'new row violates row-level security': 'Accès refusé. Vérifiez vos permissions',
    'permission denied': 'Accès refusé. Vérifiez vos permissions',
  };

  // Check for known error patterns
  for (const [pattern, message] of Object.entries(errorMappings)) {
    if (errorMessage.includes(pattern)) {
      return { message, shouldLog: true };
    }
  }

  // Default generic message for unknown errors
  return {
    message: 'Une erreur est survenue. Si le problème persiste, contactez le support',
    shouldLog: true
  };
};

export const sanitizeDatabaseError = (error: any): SanitizedError => {
  const errorMessage = error?.message?.toLowerCase() || '';
  
  if (errorMessage.includes('foreign key') || errorMessage.includes('constraint')) {
    return {
      message: 'Les données fournies ne sont pas valides',
      shouldLog: true
    };
  }

  if (errorMessage.includes('unique') || errorMessage.includes('duplicate')) {
    return {
      message: 'Cette information existe déjà dans le système',
      shouldLog: true
    };
  }

  if (errorMessage.includes('check constraint')) {
    return {
      message: 'Les données fournies ne respectent pas les règles de validation',
      shouldLog: true
    };
  }

  return {
    message: 'Erreur lors de l\'enregistrement des données',
    shouldLog: true
  };
};

/**
 * Log errors securely - only in development or to a logging service
 */
export const logError = (context: string, error: any, additionalInfo?: any) => {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error, additionalInfo);
  } else {
    // In production, send to a logging service instead
    // For now, just log minimal info
    console.error(`[${context}] Error occurred`);
  }
};
