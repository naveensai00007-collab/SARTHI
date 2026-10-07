import { LanguageCode } from '../types';
import { LANGUAGES } from '../data/translations';

let currentUtterance: SpeechSynthesisUtterance | null = null;

export const isSpeechSynthesisSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

export const speakText = (
  text: string,
  languageCode: LanguageCode = 'en',
  onEnd?: () => void
): void => {
  if (!isSpeechSynthesisSupported()) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel(); // stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;

    const langObj = LANGUAGES.find((l) => l.code === languageCode);
    const speechCode = langObj ? langObj.speechCode : 'en-IN';
    utterance.lang = speechCode;
    utterance.rate = 0.95; // Clear, easy to understand pace
    utterance.pitch = 1.0;

    // Pick Indian voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(
      (v) =>
        v.lang === speechCode ||
        v.lang.replace('_', '-').startsWith(speechCode.slice(0, 2))
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    if (onEnd) onEnd();
  }
};

export const stopSpeech = (): void => {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
      currentUtterance = null;
    } catch {
      // ignore
    }
  }
};

export const isSpeaking = (): boolean => {
  if (!isSpeechSynthesisSupported()) return false;
  return window.speechSynthesis.speaking;
};
