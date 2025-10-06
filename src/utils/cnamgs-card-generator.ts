// Coordonnées des champs sur la carte CNAMGS (1050 × 650 px)
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
  const canvas = document.createElement('canvas');
  canvas.width = CARD_FIELDS.canvas.width;
  canvas.height = CARD_FIELDS.canvas.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  // 1. Dessiner l'image template
  ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);

  // 2. Configurer le style de texte
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 3. Dessiner le numéro de carte
  const cardNumberField = CARD_FIELDS.fields.card_number.px;
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.fillText(
    data.numero_carte,
    cardNumberField.x + cardNumberField.width / 2,
    cardNumberField.y + cardNumberField.height / 2
  );

  // 4. Dessiner le nom (majuscules)
  const nomField = CARD_FIELDS.fields.field_nom_rect.px;
  const nomText = data.nom.substring(0, 28).toUpperCase();
  ctx.font = 'bold 28px Arial, sans-serif';
  ctx.fillText(
    nomText,
    nomField.x + nomField.width / 2,
    nomField.y + nomField.height / 2
  );

  // 5. Dessiner les prénoms
  const prenomsField = CARD_FIELDS.fields.field_prenoms_rect.px;
  const prenomsText = data.prenoms.substring(0, 34).toUpperCase();
  ctx.font = '28px Arial, sans-serif';
  ctx.fillText(
    prenomsText,
    prenomsField.x + prenomsField.width / 2,
    prenomsField.y + prenomsField.height / 2
  );

  // 6. Dessiner la date de naissance
  const dobField = CARD_FIELDS.fields.field_dob_rect.px;
  ctx.font = '24px Arial, sans-serif';
  ctx.fillText(
    data.date_naissance,
    dobField.x + dobField.width / 2,
    dobField.y + dobField.height / 2
  );

  // 7. Dessiner le sexe
  const sexField = CARD_FIELDS.fields.field_sex_rect.px;
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.fillText(
    data.sexe,
    sexField.x + sexField.width / 2,
    sexField.y + sexField.height / 2
  );

  // 8. Ajouter la photo si disponible
  if (data.photo_url) {
    try {
      const photoImg = new Image();
      photoImg.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        photoImg.onload = () => {
          const photoField = CARD_FIELDS.fields.photo.px;
          
          // Dessiner la photo en respectant le ratio et en remplissant la zone
          const scale = Math.max(
            photoField.width / photoImg.width,
            photoField.height / photoImg.height
          );
          
          const scaledWidth = photoImg.width * scale;
          const scaledHeight = photoImg.height * scale;
          
          const offsetX = (photoField.width - scaledWidth) / 2;
          const offsetY = (photoField.height - scaledHeight) / 2;
          
          ctx.save();
          ctx.beginPath();
          ctx.rect(photoField.x, photoField.y, photoField.width, photoField.height);
          ctx.clip();
          
          ctx.drawImage(
            photoImg,
            photoField.x + offsetX,
            photoField.y + offsetY,
            scaledWidth,
            scaledHeight
          );
          
          ctx.restore();
          resolve();
        };
        photoImg.onerror = () => resolve(); // Continue même si la photo échoue
      });
      
      photoImg.src = data.photo_url;
    } catch (error) {
      console.error('Error loading photo:', error);
    }
  }

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
