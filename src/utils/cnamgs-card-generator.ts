// Configuration des positions pour chaque champ sur la carte CNAMGS (1050 × 650 px)
// Ajustez ces valeurs pour déplacer individuellement chaque information
export const CARD_TEXT_POSITIONS = {
  canvas: { width: 1050, height: 650 },
  
  // Numéro de carte (centré, en haut)
  numero_carte: {
    x: 700,      // Position horizontale (centré)
    y: 300,      // Position verticale
    fontSize: 28,
    fontWeight: 'bold',
    align: 'center' as CanvasTextAlign
  },
  
  // Nom (aligné avec le label "Nom" du template)
  nom: {
    x: 120,      // Position horizontale (aligné à gauche)
    y: 472,      // Position verticale - aligné avec le champ du template
    fontSize: 30,
    fontWeight: 'bold',
    align: 'left' as CanvasTextAlign,
    maxLength: 28
  },
  
  // Prénoms (aligné avec le label "Prénoms" du template)
  prenoms: {
    x: 120,      // Position horizontale (aligné à gauche)
    y: 564,      // Position verticale - aligné avec le champ du template
    fontSize: 30,
    fontWeight: 'bold',
    align: 'left' as CanvasTextAlign,
    maxLength: 34
  },
  
  // Date de naissance
  date_naissance: {
    x: 120,      // Position horizontale
    y: 656,      // Position verticale - aligné avec le champ du template
    fontSize: 30,
    fontWeight: 'bold',
    align: 'left' as CanvasTextAlign
  },
  
  // Sexe
  sexe: {
    x: 603,      // Position horizontale
    y: 552,      // Position verticale - aligné avec le champ du template
    fontSize: 30,
    fontWeight: 'bold',
    align: 'left' as CanvasTextAlign
  },
  
  // Photo (cercle à droite)
  photo: {
    centerX: 865,
    centerY: 435,
    radiusX: 145,
    radiusY: 145
  }
};

// Validation des formats
export const VALIDATIONS = {
  numero_carte: /^\d{3}-\d{3}-\d{3}-\d$/,
  date_naissance: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
  sexe: /^[MF]$/,
};

interface CardData {
  numero_carte: string;
  nom: string;
  prenoms: string;
  date_naissance: string;
  sexe: string;
  photo_url?: string;
}

export const generateCNAMGSCard = async (
  templateImage: HTMLImageElement,
  data: CardData
): Promise<HTMLCanvasElement> => {
  console.log('generateCNAMGSCard: Starting generation with data:', data);
  
  const canvas = document.createElement('canvas');
  canvas.width = CARD_TEXT_POSITIONS.canvas.width;
  canvas.height = CARD_TEXT_POSITIONS.canvas.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  console.log('generateCNAMGSCard: Canvas created', { width: canvas.width, height: canvas.height });

  // 1. Dessiner l'image template
  ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
  console.log('generateCNAMGSCard: Template image drawn');

  // 2. Configurer le style de texte par défaut
  ctx.fillStyle = '#DC2626'; // Rouge pour tous les champs
  ctx.textBaseline = 'top';

  // 3. Numéro de carte
  const numConfig = CARD_TEXT_POSITIONS.numero_carte;
  ctx.font = `${numConfig.fontWeight} ${numConfig.fontSize}px Arial, sans-serif`;
  ctx.textAlign = numConfig.align;
  ctx.fillText(data.numero_carte, numConfig.x, numConfig.y);
  console.log('generateCNAMGSCard: Card number drawn:', data.numero_carte);

  // 4. Nom (aligné avec le label "Nom")
  const nomConfig = CARD_TEXT_POSITIONS.nom;
  const nomText = data.nom.substring(0, nomConfig.maxLength).toUpperCase();
  ctx.font = `${nomConfig.fontWeight} ${nomConfig.fontSize}px Arial, sans-serif`;
  ctx.textAlign = nomConfig.align;
  ctx.fillText(nomText, nomConfig.x, nomConfig.y);
  console.log('generateCNAMGSCard: Nom drawn:', nomText);

  // 5. Prénoms (aligné avec le label "Prénoms")
  const prenomsConfig = CARD_TEXT_POSITIONS.prenoms;
  const prenomsText = data.prenoms.substring(0, prenomsConfig.maxLength).toUpperCase();
  ctx.font = `${prenomsConfig.fontWeight} ${prenomsConfig.fontSize}px Arial, sans-serif`;
  ctx.textAlign = prenomsConfig.align;
  ctx.fillText(prenomsText, prenomsConfig.x, prenomsConfig.y);
  console.log('generateCNAMGSCard: Prénoms drawn:', prenomsText);

  // 6. Date de naissance
  const dobConfig = CARD_TEXT_POSITIONS.date_naissance;
  ctx.font = `${dobConfig.fontWeight} ${dobConfig.fontSize}px Arial, sans-serif`;
  ctx.textAlign = dobConfig.align;
  ctx.fillText(data.date_naissance, dobConfig.x, dobConfig.y);
  console.log('generateCNAMGSCard: Date drawn:', data.date_naissance);

  // 7. Sexe
  const sexeConfig = CARD_TEXT_POSITIONS.sexe;
  ctx.font = `${sexeConfig.fontWeight} ${sexeConfig.fontSize}px Arial, sans-serif`;
  ctx.textAlign = sexeConfig.align;
  ctx.fillText(data.sexe, sexeConfig.x, sexeConfig.y);
  console.log('generateCNAMGSCard: Sexe drawn:', data.sexe);

  // 8. Ajouter la photo si disponible (forme ovale)
  if (data.photo_url) {
    console.log('generateCNAMGSCard: Loading photo from:', data.photo_url);
    try {
      const photoImg = new Image();
      photoImg.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        photoImg.onload = () => {
          console.log('generateCNAMGSCard: Photo loaded successfully');
          
          // Position et dimensions de la zone photo (ovale sur la droite)
          const photoConfig = CARD_TEXT_POSITIONS.photo;
          const centerX = photoConfig.centerX;
          const centerY = photoConfig.centerY;
          const radiusX = photoConfig.radiusX;
          const radiusY = photoConfig.radiusY;
          
          ctx.save();
          
          // Créer un clip path ovale
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
          ctx.clip();
          
          // Dessiner la photo en respectant le ratio et en remplissant la zone ovale
          const scale = Math.max(
            (radiusX * 2) / photoImg.width,
            (radiusY * 2) / photoImg.height
          );
          
          const scaledWidth = photoImg.width * scale;
          const scaledHeight = photoImg.height * scale;
          
          const offsetX = centerX - scaledWidth / 2;
          const offsetY = centerY - scaledHeight / 2;
          
          ctx.drawImage(
            photoImg,
            offsetX,
            offsetY,
            scaledWidth,
            scaledHeight
          );
          
          ctx.restore();
          console.log('generateCNAMGSCard: Photo drawn successfully in oval shape');
          resolve();
        };
        photoImg.onerror = (error) => {
          console.error('generateCNAMGSCard: Error loading photo:', error);
          resolve(); // Continue même si la photo échoue
        };
        
        photoImg.src = data.photo_url;
      });
    } catch (error) {
      console.error('generateCNAMGSCard: Error in photo loading:', error);
    }
  } else {
    console.log('generateCNAMGSCard: No photo URL provided');
  }

  console.log('generateCNAMGSCard: Card generation complete');
  return canvas;
};

export const validateCardData = (data: CardData): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!VALIDATIONS.numero_carte.test(data.numero_carte)) {
    errors.push("Numéro de carte invalide (format: ###-###-###-#)");
  }

  if (data.nom.length > 28) {
    errors.push("Nom trop long (max 28 caractères)");
  }

  if (data.prenoms.length > 34) {
    errors.push("Prénoms trop longs (max 34 caractères)");
  }

  if (!VALIDATIONS.date_naissance.test(data.date_naissance)) {
    errors.push("Date de naissance invalide (format: JJ/MM/AAAA)");
  }

  if (!VALIDATIONS.sexe.test(data.sexe)) {
    errors.push("Sexe invalide (M ou F)");
  }

  return { valid: errors.length === 0, errors };
};
