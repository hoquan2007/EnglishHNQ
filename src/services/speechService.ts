// Web Speech API Service for Text-To-Speech (TTS) and Speech-To-Text (STT)

export interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Text-to-Speech (TTS) function
 */
export const speakText = (
  text: string,
  voiceGender: 'male' | 'female' = 'male',
  rate: number = 1.0,
  onEnd?: () => void
): boolean => {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.lang = 'en-US';

  // Get available voices
  const voices = window.speechSynthesis.getVoices();

  if (voices.length > 0) {
    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (voiceGender === 'male') {
      // Look for male US/UK voice
      selectedVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('David') ||
            v.name.includes('George') ||
            v.name.includes('Male') ||
            v.name.includes('Google US English'))
      );
    } else {
      // Look for female US/UK voice
      selectedVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Zira') ||
            v.name.includes('Susan') ||
            v.name.includes('Female') ||
            v.name.includes('Google UK English Female') ||
            v.name.includes('Samantha'))
      );
    }

    // Fallback to any English voice
    if (!selectedVoice) {
      selectedVoice = voices.find((v) => v.lang.startsWith('en'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  }

  if (onEnd) {
    utterance.onend = () => {
      activeUtterance = null;
      onEnd();
    };
    utterance.onerror = () => {
      activeUtterance = null;
      onEnd();
    };
  }

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
};

/**
 * Stop any active TTS playback
 */
export const stopSpeaking = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
};

/**
 * Check if Speech Recognition is supported by the browser
 */
export const isSTTSupported = (): boolean => {
  const win = window as SpeechRecognitionWindow;
  return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
};

let currentRecognition: any = null;

/**
 * Start listening via Web Speech API (STT)
 */
export const startListening = (
  onResult: (transcript: string) => void,
  onError?: (error: string) => void,
  onEnd?: () => void
): boolean => {
  const win = window as SpeechRecognitionWindow;
  const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

  if (!SpeechRecognitionClass) {
    if (onError) onError('Trình duyệt của bạn không hỗ trợ Web Speech Recognition (STT). Hãy dùng Chrome/Edge.');
    return false;
  }

  try {
    if (currentRecognition) {
      currentRecognition.stop();
    }

    const recognition = new SpeechRecognitionClass();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onResult(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      if (onError) {
        if (event.error === 'not-allowed') {
          onError('Quyền truy cập Microphone bị từ chối.');
        } else {
          onError(`Lỗi mic: ${event.error}`);
        }
      }
    };

    recognition.onend = () => {
      currentRecognition = null;
      if (onEnd) onEnd();
    };

    currentRecognition = recognition;
    recognition.start();
    return true;
  } catch (err: any) {
    console.error('Error starting speech recognition:', err);
    if (onError) onError(err.message || 'Không thể bắt đầu thu âm.');
    return false;
  }
};

/**
 * Stop active speech recognition
 */
export const stopListening = (): void => {
  if (currentRecognition) {
    currentRecognition.stop();
    currentRecognition = null;
  }
};
