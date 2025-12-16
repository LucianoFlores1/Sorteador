export interface Participant {
  id: string; // Unique ID (often generated from original index or uuid)
  originalString: string; // The raw line (for reference)
  name: string;
  dni: string;
}

export enum AppStep {
  INPUT = 'INPUT',
  PARSING = 'PARSING',
  VERIFICATION = 'VERIFICATION',
  DRAWING = 'DRAWING',
  RESULTS = 'RESULTS'
}

export interface ParsingResult {
  participants: Participant[];
  totalParsed: number;
}
