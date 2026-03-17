import { useEffect, useRef, type FC } from 'react';

export interface AudioVisualizerProps {
  analyserNode: AnalyserNode | null;
  width?: number;
  height?: number;
  color?: string;
}

/**
 * Canvas waveform visualization driven by an AnalyserNode.
 * Renders a frequency bar visualization matching the neobrutalist style.
 */
export const AudioVisualizer: FC<AudioVisualizerProps> = ({
  analyserNode,
  width = 200,
  height = 40,
  color = '#000',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserNode) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      analyserNode.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, width, height);

      const barCount = Math.min(bufferLength, 32);
      const barWidth = width / barCount;

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i] ?? 0;
        const barHeight = (value / 255) * height;
        const x = i * barWidth;
        const y = height - barHeight;

        ctx.fillStyle = color;
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [analyserNode, width, height, color]);

  if (!analyserNode) return null;

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="opto-voice-visualizer"
      aria-hidden="true"
    />
  );
};
