/**
 * Configuration Mapbox
 * 
 * Pour obtenir votre clé publique Mapbox:
 * 1. Créez un compte sur https://mapbox.com/
 * 2. Allez dans votre dashboard > Tokens
 * 3. Copiez votre "Default public token" ou créez-en un nouveau
 * 4. Remplacez la valeur ci-dessous par votre clé
 * 
 * Note: Les clés publiques Mapbox sont conçues pour être utilisées côté client
 * et peuvent être stockées directement dans le code.
 */

export const MAPBOX_PUBLIC_TOKEN = 'pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJ5b3VyLXRva2VuIn0.your-signature';

// Si vous préférez utiliser une variable d'environnement:
// export const MAPBOX_PUBLIC_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';
