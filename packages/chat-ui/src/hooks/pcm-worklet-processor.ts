/**
 * AudioWorkletProcessor that downsamples browser audio (typically 48kHz)
 * to 16kHz PCM for streaming to Gemini Live API.
 *
 * This file is loaded via `audioWorklet.addModule()` and runs off-main-thread.
 * It cannot import anything — it's a standalone worklet script.
 */

// This string is exported so the main thread can create a Blob URL from it.
// AudioWorklet processors cannot be imported as modules in all browsers.
export const PCM_WORKLET_SOURCE = /* js */ `
class PCMDownsampleProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = [];
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const channelData = input[0];
    const inputRate = sampleRate; // global in AudioWorklet scope
    const outputRate = 16000;
    const ratio = inputRate / outputRate;

    for (let i = 0; i < channelData.length; i += ratio) {
      const idx = Math.floor(i);
      if (idx < channelData.length) {
        // Clamp to [-1, 1] and convert to 16-bit PCM
        const sample = Math.max(-1, Math.min(1, channelData[idx]));
        this._buffer.push(sample * 0x7fff);
      }
    }

    // Send chunks of 4096 samples (~256ms at 16kHz)
    while (this._buffer.length >= 4096) {
      const chunk = this._buffer.splice(0, 4096);
      const int16 = new Int16Array(chunk);
      this.port.postMessage(int16.buffer, [int16.buffer]);
    }

    return true;
  }
}

registerProcessor('pcm-downsample-processor', PCMDownsampleProcessor);
`;

/**
 * Creates a Blob URL for the PCM worklet processor.
 * Call this once, then pass the URL to `audioContext.audioWorklet.addModule()`.
 */
export function createWorkletBlobUrl(): string {
  const blob = new Blob([PCM_WORKLET_SOURCE], { type: 'application/javascript' });
  return URL.createObjectURL(blob);
}
