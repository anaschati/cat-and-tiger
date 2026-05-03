export interface Memory {
  id: string;
  coordinates: [number, number]; // [longitude, latitude]
  lieu?: string; // Le "?" indique que ce champ est optionnel
  zoomLevel: number;
  date: string;
  displayDate: string;
  title: string;
  description: string;
  images: string[];
}

export interface Auth {
    question: string; 
    choices: string[] | null; 
    answer: string;    
    hints: string[] | null; 
}

// Ce type représente le dictionnaire { "clef": Auth }
export type AuthData = Record<string, Auth>;
