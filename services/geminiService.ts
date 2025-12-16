import { Participant } from "../types";

/**
 * Parses raw text locally.
 * PRIMARY RULE: One line = One participant.
 * 
 * It cleans up common list prefixes like "1.", "1 -", "•".
 * It optionally extracts a trailing number as an ID/DNI for display purposes,
 * but generally accepts any format.
 */
export const parseParticipantsLocal = (rawText: string): Participant[] => {
  if (!rawText) return [];

  const lines = rawText.split(/\r?\n/);
  
  return lines
    .map(line => line.trim())
    .filter(line => line.length > 0) // Remove empty lines
    .map((line, index) => {
      // 1. Clean format: Remove leading numbers or bullets (e.g., "1.", "1 -", "•", "-")
      // ^[\d]+[\.\)\-\s]+\s* matches "1. ", "10) ", "1 - "
      // ^[\-\*•]\s* matches bullets
      let name = line.replace(/^([\d]+[\.\)\-\s]+|[\-\*•])\s*/, '').trim();
      
      let dni = '';

      // 2. Soft attempt to extract an ID/Number at the end for display
      // Matches "Separator + Digits" at the end of the string.
      // e.g. "Juan Perez 12345", "Juan Perez - 12345", "Juan Perez (12345)"
      // It's permissive: if it finds a long number at the end, it takes it as ID.
      const match = name.match(/^(.*?)[\s\-\.|:\(\[]+(\d{3,}[\d\.]*)[\)\]]?$/);

      if (match) {
        // If found, separate them
        name = match[1].trim();
        dni = match[2].replace(/\./g, '').trim();
      }

      // If no DNI found, 'dni' stays empty. 
      // Uniqueness checks in App.tsx will fallback to 'name' automatically.

      return {
        id: `local-${index}-${Date.now()}`,
        originalString: line,
        name: name,
        dni: dni
      };
    });
};

export const parseParticipantsWithGemini = async (text: string) => {
    return parseParticipantsLocal(text);
}