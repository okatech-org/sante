// Configuration des positions pour chaque champ sur la carte CNAMGS
// Chargée dynamiquement depuis le fichier JSON

interface LayoutField {
  id: string;
  type: string;
  bbox: [number, number, number, number];
  text?: string;
  fontSize?: number;
  circle?: {
    cx: number;
    cy: number;
    r: number;
  };
}

interface CardLayout {
  template: string;
  canvas: {
    width: number;
    height: number;
  };
  fields: LayoutField[];
}

let cachedLayout: CardLayout | null = null;

export const loadCardLayout = async (): Promise<CardLayout> => {
  if (cachedLayout) return cachedLayout;
  
  try {
    const response = await fetch('/cnamgs_layout.json');
    if (!response.ok) {
      throw new Error('Failed to load card layout');
    }
    cachedLayout = await response.json();
    return cachedLayout!;
  } catch (error) {
    console.error('Error loading card layout:', error);
    // Fallback aux positions par défaut
    return {
      template: 'CNAMGS-fallback',
      canvas: { width: 1050, height: 650 },
      fields: []
    };
  }
};

// Fonction utilitaire pour trouver un champ dans le layout
const findField = (layout: CardLayout, id: string): LayoutField | undefined => {
  return layout.fields.find(f => f.id === id);
};

// Place un texte selon bbox (x,y,width,height)
const placeText = (
  ctx: CanvasRenderingContext2D,
  bbox: [number, number, number, number],
  text: string,
  opts: { align?: CanvasTextAlign; fontSize?: number; fontWeight?: string } = {}
): void => {
  const [x, y, w, h] = bbox;
  
  if (w === 0 && h === 0) return; // Sera géré par fallback
  
  ctx.font = `${opts.fontWeight || 'bold'} ${opts.fontSize || 30}px Arial, sans-serif`;
  ctx.textAlign = opts.align || 'left';
  
  // baseline ≈ y + h - (h*0.2)
  const baselineY = Math.round(y + h - h * 0.2);
  ctx.fillText(text, x, baselineY);
};

// Fallback si bbox = [0,0,0,0] : on aligne après le libellé
const placeTextNearLabel = (
  ctx: CanvasRenderingContext2D,
  layout: CardLayout,
  labelId: string,
  text: string,
  dx: number = 22,
  dy: number = 0
): void => {
  const label = findField(layout, labelId);
  if (!label || !label.bbox) return;
  
  const [lx, ly, lw, lh] = label.bbox;
  const x = lx + lw + dx;
  const y = ly + lh - lh * 0.2 + dy;
  
  ctx.font = 'bold 30px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(text, x, y);
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
  
  // Charger le layout
  const layout = await loadCardLayout();
  
  const canvas = document.createElement('canvas');
  canvas.width = layout.canvas.width;
  canvas.height = layout.canvas.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  console.log('generateCNAMGSCard: Canvas created', { width: canvas.width, height: canvas.height });

  // 1. Dessiner l'image template
  ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
  console.log('generateCNAMGSCard: Template image drawn');

  // 2. Configurer le style de texte par défaut
  ctx.fillStyle = '#DC2626'; // Rouge pour tous les champs
  ctx.textBaseline = 'top';

  // 3. Numéro de carte (centré)
  const cardNumberField = findField(layout, 'field-card-number');
  if (cardNumberField && cardNumberField.bbox.some(v => v !== 0)) {
    placeText(ctx, cardNumberField.bbox, data.numero_carte, { 
      align: 'center', 
      fontSize: 28 
    });
  } else {
    // Fallback: centrer à y=300
    ctx.font = 'bold 28px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(data.numero_carte, 700, 300);
  }
  console.log('generateCNAMGSCard: Card number drawn:', data.numero_carte);

  // 4. Nom
  const nomText = data.nom.substring(0, 28).toUpperCase();
  const nomField = findField(layout, 'field-name');
  if (nomField && nomField.bbox.some(v => v !== 0)) {
    placeText(ctx, nomField.bbox, nomText);
  } else {
    placeTextNearLabel(ctx, layout, 'label-nom', nomText);
  }
  console.log('generateCNAMGSCard: Nom drawn:', nomText);

  // 5. Prénoms
  const prenomsText = data.prenoms.substring(0, 34).toUpperCase();
  const prenomsField = findField(layout, 'field-given-names');
  if (prenomsField && prenomsField.bbox.some(v => v !== 0)) {
    placeText(ctx, prenomsField.bbox, prenomsText);
  } else {
    placeTextNearLabel(ctx, layout, 'label-prenoms', prenomsText);
  }
  console.log('generateCNAMGSCard: Prénoms drawn:', prenomsText);

  // 6. Date de naissance
  const dobField = findField(layout, 'field-birthdate');
  if (dobField && dobField.bbox.some(v => v !== 0)) {
    placeText(ctx, dobField.bbox, data.date_naissance);
  } else {
    placeTextNearLabel(ctx, layout, 'label-dob', data.date_naissance);
  }
  console.log('generateCNAMGSCard: Date drawn:', data.date_naissance);

  // 7. Sexe
  const sexeField = findField(layout, 'field-sex');
  if (sexeField && sexeField.bbox.some(v => v !== 0)) {
    placeText(ctx, sexeField.bbox, data.sexe);
  } else {
    placeTextNearLabel(ctx, layout, 'label-sex', data.sexe);
  }
  console.log('generateCNAMGSCard: Sexe drawn:', data.sexe);

  // 8. Ajouter la photo si disponible
  if (data.photo_url) {
    console.log('generateCNAMGSCard: Loading photo from:', data.photo_url);
    try {
      const photoImg = new Image();
      photoImg.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        photoImg.onload = () => {
          console.log('generateCNAMGSCard: Photo loaded successfully');
          
          // Récupérer les coordonnées du cercle depuis le layout
          const photoField = findField(layout, 'photo-placeholder');
          const centerX = photoField?.circle?.cx || 853;
          const centerY = photoField?.circle?.cy || 435;
          const radiusX = photoField?.circle?.r || 145;
          const radiusY = photoField?.circle?.r || 145;
          
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
