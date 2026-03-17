import { useState, useRef, useCallback, useEffect } from 'react';

export interface UseAudioPlaybackReturn {
  /** Enqueue PCM audio data (24kHz Int16) for playback */
  enqueueAudio: (pcmData: ArrayBuffer) => void;
  isPlaying: boolean;
  analyserNode: AnalyserNode | null;
  /** Stop playback and clear the queue */
  stop: () => void;
}

const PLAYBACK_SAMPLE_RATE = 24000;

/**
 * Hook for playing back PCM audio chunks via AudioContext.
 * Expects 24kHz 16-bit PCM (Gemini Live API output format).
 */
export function useAudioPlayback(): UseAudioPlaybackReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const queueRef = useRef<AudioBuffer[]>([]);
  const nextStartTimeRef = useRef(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const getOrCreateContext = useCallback(() => {
    if (!audioContextRef.current) {
      const ctx = new AudioContext({ sampleRate: PLAYBACK_SAMPLE_RATE });
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
      setAnalyserNode(analyser);
    }
    return audioContextRef.current;
  }, []);

  const scheduleNext = useCallback(() => {
    const ctx = audioContextRef.current;
    const analyser = analyserRef.current;
    if (!ctx || !analyser) return;

    const buffer = queueRef.current.shift();
    if (!buffer) {
      if (activeSourcesRef.current.size === 0) {
        setIsPlaying(false);
      }
      return;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(analyser);

    const now = ctx.currentTime;
    const startTime = Math.max(now, nextStartTimeRef.current);
    nextStartTimeRef.current = startTime + buffer.duration;

    activeSourcesRef.current.add(source);
    source.onended = () => {
      activeSourcesRef.current.delete(source);
      scheduleNext();
    };

    source.start(startTime);
    setIsPlaying(true);
  }, []);

  const enqueueAudio = useCallback(
    (pcmData: ArrayBuffer) => {
      const ctx = getOrCreateContext();

      // Convert Int16 PCM to Float32
      const int16 = new Int16Array(pcmData);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = (int16[i] ?? 0) / 0x7fff;
      }

      const audioBuffer = ctx.createBuffer(1, float32.length, PLAYBACK_SAMPLE_RATE);
      audioBuffer.copyToChannel(float32, 0);

      queueRef.current.push(audioBuffer);

      // If nothing is playing, start scheduling
      if (activeSourcesRef.current.size === 0) {
        scheduleNext();
      }
    },
    [getOrCreateContext, scheduleNext],
  );

  const stop = useCallback(() => {
    for (const source of activeSourcesRef.current) {
      try {
        source.stop();
      } catch {
        // Already stopped
      }
    }
    activeSourcesRef.current.clear();
    queueRef.current.length = 0;
    nextStartTimeRef.current = 0;
    setIsPlaying(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      for (const source of activeSourcesRef.current) {
        try {
          source.stop();
        } catch {
          // noop
        }
      }
      void audioContextRef.current?.close();
    };
  }, []);

  return { enqueueAudio, isPlaying, analyserNode, stop };
}
