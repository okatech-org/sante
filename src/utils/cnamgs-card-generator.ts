// Coordonnées des champs sur la carte CNAMGS (1050 × 650 px)
// Utilisation des coordonnées exactes fournies dans la documentation
export const CARD_FIELDS = {
  canvas: { width: 1050, height: 650 },
  fields: {
    card_number: {
      px: { x: 380, y: 130, width: 320, height: 48 },
      norm: { x: 0.3620, y: 0.2000, w: 0.3048, h: 0.0738 }
    },
    photo: {
      px: { x: 720, y: 320, width: 200, height: 250 },
      norm: { x: 0.6857, y: 0.4923, w: 0.1905, h: 0.3846 }
    },
    field_nom_rect: {
      px: { x: 120, y: 352, width: 430, height: 48 },
      norm: { x: 0.1143, y: 0.5415, w: 0.4095, h: 0.0738 }
    },
    field_prenoms_rect: {
      px: { x: 120, y: 436, width: 430, height: 48 },
      norm: { x: 0.1143, y: 0.6723, w: 0.4095, h: 0.0738 }
    },
    field_dob_rect: {
      px: { x: 120, y: 520, width: 220, height: 48 },
      norm: { x: 0.1143, y: 0.8000, w: 0.2095, h: 0.0738 }
    },
    field_sex_rect: {
      px: { x: 380, y: 520, width: 80, height: 48 },
      norm: { x: 0.3620, y: 0.8000, w: 0.0762, h: 0.0738 }
    }
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
  canvas.width = CARD_FIELDS.canvas.width;
  canvas.height = CARD_FIELDS.canvas.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  console.log('generateCNAMGSCard: Canvas created', { width: canvas.width, height: canvas.height });

  // 1. Dessiner l'image template
  ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
  console.log('generateCNAMGSCard: Template image drawn');

  // 2. Configurer le style de texte par défaut
  ctx.fillStyle = '#000000';
  ctx.textBaseline = 'middle';

  // 3. Dessiner le numéro de carte (centré, rouge, sous le titre)
  ctx.font = 'bold 36px Arial, sans-serif';
  ctx.fillStyle = '#DC2626'; // Rouge
  ctx.textAlign = 'center';
  const cardNumberText = data.numero_carte;
  ctx.fillText(
    cardNumberText,
    canvas.width / 2,
    340 // Position sous "Carte d'Assurance Maladie"
  );
  console.log('generateCNAMGSCard: Card number drawn:', cardNumberText);
  ctx.fillStyle = '#000000';

  // 4. Dessiner le nom (aligné à gauche, rouge, sous le label "Nom")
  const nomText = data.nom.substring(0, 28).toUpperCase();
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.fillStyle = '#DC2626';
  ctx.textAlign = 'left';
  ctx.fillText(
    nomText,
    120,
    530 // Position sous le label "Nom"
  );
  console.log('generateCNAMGSCard: Nom drawn:', nomText);
  ctx.fillStyle = '#000000';

  // 5. Dessiner les prénoms (aligné à gauche, rouge, sous le label "Prénoms")
  const prenomsText = data.prenoms.substring(0, 34).toUpperCase();
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.fillStyle = '#DC2626';
  ctx.textAlign = 'left';
  ctx.fillText(
    prenomsText,
    120,
    640 // Position sous le label "Prénoms"
  );
  console.log('generateCNAMGSCard: Prénoms drawn:', prenomsText);
  ctx.fillStyle = '#000000';

  // 6. Dessiner la date de naissance (aligné à gauche, rouge, sous le label "Date de naissance")
  ctx.font = 'bold 28px Arial, sans-serif';
  ctx.fillStyle = '#DC2626';
  ctx.textAlign = 'left';
  ctx.fillText(
    data.date_naissance,
    120,
    760 // Position sous le label "Date de naissance"
  );
  console.log('generateCNAMGSCard: Date drawn:', data.date_naissance);
  ctx.fillStyle = '#000000';

  // 7. Dessiner le sexe (aligné à gauche, rouge, sous le label "Sexe")
  ctx.font = 'bold 36px Arial, sans-serif';
  ctx.fillStyle = '#DC2626';
  ctx.textAlign = 'left';
  ctx.fillText(
    data.sexe,
    635,
    705 // Position sous le label "Sexe"
  );
  console.log('generateCNAMGSCard: Sexe drawn:', data.sexe);
  ctx.fillStyle = '#000000';

  // 8. Ajouter la photo si disponible (forme ovale)
  if (data.photo_url) {
    console.log('generateCNAMGSCard: Loading photo from:', data.photo_url);
    try {
      const photoImg = new Image();
      photoImg.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        photoImg.onload = () => {
          console.log('generateCNAMGSCard: Photo loaded successfully');
          const photoField = CARD_FIELDS.fields.photo.px;
          
          ctx.save();
          
          // Créer un clip path ovale
          const centerX = photoField.x + photoField.width / 2;
          const centerY = photoField.y + photoField.height / 2;
          const radiusX = photoField.width / 2;
          const radiusY = photoField.height / 2;
          
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
          ctx.clip();
          
          // Dessiner la photo en respectant le ratio et en remplissant la zone ovale
          const scale = Math.max(
            photoField.width / photoImg.width,
            photoField.height / photoImg.height
          );
          
          const scaledWidth = photoImg.width * scale;
          const scaledHeight = photoImg.height * scale;
          
          const offsetX = (photoField.width - scaledWidth) / 2;
          const offsetY = (photoField.height - scaledHeight) / 2;
          
          ctx.drawImage(
            photoImg,
            photoField.x + offsetX,
            photoField.y + offsetY,
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
