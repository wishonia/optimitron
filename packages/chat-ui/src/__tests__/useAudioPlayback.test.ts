import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudioPlayback } from '../hooks/useAudioPlayback.js';

const mockDestination = {};
const mockConnect = vi.fn();
const mockStart = vi.fn();
const mockStop = vi.fn();

let lastSourceOnEnded: (() => void) | null = null;

const mockCreateBufferSource = vi.fn().mockImplementation(() => ({
  buffer: null,
  connect: mockConnect,
  start: mockStart,
  stop: mockStop,
  set onended(fn: () => void) {
    lastSourceOnEnded = fn;
  },
  get onended() {
    return lastSourceOnEnded;
  },
}));

const mockCreateBuffer = vi.fn().mockImplementation((_channels: number, length: number) => ({
  duration: length / 24000,
  copyToChannel: vi.fn(),
  length,
}));

const mockCreateAnalyser = vi.fn().mockReturnValue({
  fftSize: 256,
  connect: mockConnect,
});

const mockClose = vi.fn().mockResolvedValue(undefined);

class MockAudioContext {
  sampleRate = 24000;
  currentTime = 0;
  destination = mockDestination;
  createBufferSource = mockCreateBufferSource;
  createBuffer = mockCreateBuffer;
  createAnalyser = mockCreateAnalyser;
  close = mockClose;
}

beforeEach(() => {
  vi.clearAllMocks();
  lastSourceOnEnded = null;
  // @ts-expect-error -- mock global
  globalThis.AudioContext = MockAudioContext;
});

describe('useAudioPlayback', () => {
  it('starts in non-playing state', () => {
    const { result } = renderHook(() => useAudioPlayback());
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.analyserNode).toBeNull();
  });

  it('creates audio context and plays enqueued audio', () => {
    const { result } = renderHook(() => useAudioPlayback());

    // Create a small Int16 PCM buffer
    const pcm = new Int16Array(480).buffer;

    act(() => {
      result.current.enqueueAudio(pcm);
    });

    expect(mockCreateBufferSource).toHaveBeenCalled();
    expect(mockStart).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.analyserNode).not.toBeNull();
  });

  it('stops playback and clears queue', () => {
    const { result } = renderHook(() => useAudioPlayback());

    const pcm = new Int16Array(480).buffer;

    act(() => {
      result.current.enqueueAudio(pcm);
    });

    act(() => {
      result.current.stop();
    });

    expect(result.current.isPlaying).toBe(false);
  });
});
