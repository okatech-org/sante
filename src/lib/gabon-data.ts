// Données géographiques du Gabon
export const gabonProvinces = [
  { value: "estuaire", label: "Estuaire" },
  { value: "haut-ogooue", label: "Haut-Ogooué" },
  { value: "moyen-ogooue", label: "Moyen-Ogooué" },
  { value: "ngounie", label: "Ngounié" },
  { value: "nyanga", label: "Nyanga" },
  { value: "ogooue-ivindo", label: "Ogooué-Ivindo" },
  { value: "ogooue-lolo", label: "Ogooué-Lolo" },
  { value: "ogooue-maritime", label: "Ogooué-Maritime" },
  { value: "woleu-ntem", label: "Woleu-Ntem" },
];

export const gabonCities: Record<string, { value: string; label: string }[]> = {
  "estuaire": [
    { value: "libreville", label: "Libreville" },
    { value: "akanda", label: "Akanda" },
    { value: "owendo", label: "Owendo" },
    { value: "ntoum", label: "Ntoum" },
    { value: "kango", label: "Kango" },
  ],
  "haut-ogooue": [
    { value: "franceville", label: "Franceville" },
    { value: "moanda", label: "Moanda" },
    { value: "mounana", label: "Mounana" },
    { value: "okondja", label: "Okondja" },
  ],
  "moyen-ogooue": [
    { value: "lambarene", label: "Lambaréné" },
    { value: "ndjole", label: "Ndjolé" },
  ],
  "ngounie": [
    { value: "mouila", label: "Mouila" },
    { value: "ndende", label: "Ndendé" },
    { value: "mbigou", label: "Mbigou" },
  ],
  "nyanga": [
    { value: "tchibanga", label: "Tchibanga" },
    { value: "mayumba", label: "Mayumba" },
  ],
  "ogooue-ivindo": [
    { value: "makokou", label: "Makokou" },
    { value: "mekambo", label: "Mékambo" },
  ],
  "ogooue-lolo": [
    { value: "koulamoutou", label: "Koulamoutou" },
    { value: "lastoursville", label: "Lastoursville" },
  ],
  "ogooue-maritime": [
    { value: "port-gentil", label: "Port-Gentil" },
    { value: "omboue", label: "Omboué" },
  ],
  "woleu-ntem": [
    { value: "oyem", label: "Oyem" },
    { value: "bitam", label: "Bitam" },
    { value: "mitzic", label: "Mitzic" },
  ],
};

// Fonds CNAMGS
export const cnamgsFunds = [
  { value: "public", label: "Fonds Public" },
  { value: "private", label: "Fonds Privé" },
  { value: "gef", label: "GEF (Grandes Entreprises)" },
];

// Mutuelles principales
export const mutuelles = [
  { value: "ascoma", label: "ASCOMA" },
  { value: "sogac", label: "SOGAC" },
  { value: "saham", label: "SAHAM Assurance" },
  { value: "nsia", label: "NSIA Assurance" },
  { value: "ogar", label: "OGAR" },
  { value: "autre", label: "Autre" },
];
