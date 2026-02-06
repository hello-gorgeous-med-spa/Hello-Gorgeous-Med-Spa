'use client';

// ============================================================
// VOICE DICTATION COMPONENT
// Browser-native speech recognition for chart notes
// Uses Web Speech API with fallback handling
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';

interface VoiceDictationProps {
  onTranscript: (text: string, targetField?: string) => void;
  targetField?: 'subjective' | 'objective' | 'assessment' | 'plan' | 'all';
  className?: string;
  compact?: boolean;
}

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceDictation({
  onTranscript,
  targetField = 'all',
  className = '',
  compact = false,
}: VoiceDictationProps) {
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [selectedField, setSelectedField] = useState<string>(targetField);
  const [showFieldSelector, setShowFieldSelector] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef('');

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Voice dictation not supported in this browser. Try Chrome or Edge.');
    }
  }, []);

  // Initialize speech recognition
  const initRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setIsPaused(false);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      if (final) {
        finalTranscriptRef.current += final;
        setTranscript(finalTranscriptRef.current);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access and try again.');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else {
        setError(`Error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening && !isPaused) {
        // Auto-restart if we want continuous listening
        try {
          recognition.start();
        } catch (e) {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    return recognition;
  }, [isListening, isPaused]);

  // Start listening
  const startListening = useCallback(() => {
    if (!isSupported) return;
    
    setError(null);
    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');

    const recognition = initRecognition();
    if (recognition) {
      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (e) {
        console.error('Failed to start recognition:', e);
        setError('Failed to start voice recognition');
      }
    }
  }, [isSupported, initRecognition]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      setIsListening(false);
      setIsPaused(false);
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  // Pause/Resume
  const togglePause = useCallback(() => {
    if (isPaused) {
      // Resume
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsPaused(false);
        } catch (e) {
          console.error('Failed to resume:', e);
        }
      }
    } else {
      // Pause
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsPaused(true);
      }
    }
  }, [isPaused]);

  // Insert transcript into selected field
  const insertTranscript = useCallback(() => {
    if (transcript.trim()) {
      onTranscript(transcript.trim(), selectedField);
      setTranscript('');
      finalTranscriptRef.current = '';
      setShowFieldSelector(false);
    }
  }, [transcript, selectedField, onTranscript]);

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    finalTranscriptRef.current = '';
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  if (!isSupported) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        🎤 Voice dictation not available in this browser
      </div>
    );
  }

  // Compact mode - just a mic button
  if (compact) {
    return (
      <button
        onClick={isListening ? stopListening : startListening}
        className={`p-2 rounded-lg transition-colors ${
          isListening 
            ? 'bg-red-100 text-red-600 animate-pulse' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } ${className}`}
        title={isListening ? 'Stop dictation' : 'Start voice dictation'}
      >
        🎤
      </button>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎤</span>
          <span className="font-medium text-gray-900">Voice Dictation</span>
          {isListening && (
            <span className="flex items-center gap-1 text-xs text-red-600">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {isPaused ? 'Paused' : 'Listening...'}
            </span>
          )}
        </div>
        
        {/* Field Selector */}
        <div className="relative">
          <button
            onClick={() => setShowFieldSelector(!showFieldSelector)}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            Insert into: <span className="font-medium capitalize">{selectedField}</span>
            <span className="text-xs">▼</span>
          </button>
          
          {showFieldSelector && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[140px]">
              {['subjective', 'objective', 'assessment', 'plan'].map((field) => (
                <button
                  key={field}
                  onClick={() => {
                    setSelectedField(field);
                    setShowFieldSelector(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 capitalize ${
                    selectedField === field ? 'bg-pink-50 text-pink-700' : 'text-gray-700'
                  }`}
                >
                  {field}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Transcript Display */}
      <div className="mb-3 p-3 bg-gray-50 rounded-lg min-h-[80px] max-h-[200px] overflow-y-auto">
        {transcript || interimTranscript ? (
          <>
            <span className="text-gray-900">{transcript}</span>
            <span className="text-gray-400 italic">{interimTranscript}</span>
          </>
        ) : (
          <span className="text-gray-400 text-sm">
            {isListening 
              ? 'Start speaking...' 
              : 'Click "Start Recording" to begin dictation'}
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {!isListening ? (
          <button
            onClick={startListening}
            className="flex-1 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 flex items-center justify-center gap-2"
          >
            <span>🎤</span> Start Recording
          </button>
        ) : (
          <>
            <button
              onClick={togglePause}
              className="flex-1 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 flex items-center justify-center gap-2"
            >
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
            <button
              onClick={stopListening}
              className="flex-1 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
            >
              ⏹️ Stop
            </button>
          </>
        )}
      </div>

      {/* Insert/Clear Buttons */}
      {transcript && (
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={insertTranscript}
            className="flex-1 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 text-sm"
          >
            Insert into {selectedField.charAt(0).toUpperCase() + selectedField.slice(1)}
          </button>
          <button
            onClick={clearTranscript}
            className="py-2 px-4 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 text-sm"
          >
            Clear
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="mt-3 text-xs text-gray-500">
        <p>💡 Tips: Speak clearly • Say "period" or "comma" for punctuation • Works best in Chrome</p>
      </div>
    </div>
  );
}
