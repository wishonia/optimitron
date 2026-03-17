// Components
export { ChatContainer } from './components/ChatContainer.js';
export { MoodCard } from './components/MoodCard.js';
export { TreatmentCard } from './components/TreatmentCard.js';
export { SymptomCard } from './components/SymptomCard.js';
export { PairwiseCard } from './components/PairwiseCard.js';
export { FoodCard } from './components/FoodCard.js';
export { InsightCard } from './components/InsightCard.js';
export { ApiKeyCard } from './components/ApiKeyCard.js';
export { HintBar } from './components/HintBar.js';
export { CheckInCard } from './components/CheckInCard.js';

// Voice components
export { VoiceMicButton } from './components/VoiceMicButton.js';
export { AudioVisualizer } from './components/AudioVisualizer.js';
export { VoiceTranscript } from './components/VoiceTranscript.js';

// Voice hooks
export { useAudioCapture } from './hooks/useAudioCapture.js';
export { useAudioPlayback } from './hooks/useAudioPlayback.js';
export { createWorkletBlobUrl } from './hooks/pcm-worklet-processor.js';

// Types
export type {
  ChatMessage,
  TreatmentAction,
  VoiceState,
  AudioChunk,
  MoodCardProps,
  TreatmentCardProps,
  SymptomCardProps,
  PairwiseCardProps,
  FoodCardProps,
  InsightCardProps,
  ApiKeyCardProps,
  HintBarProps,
  CheckInCardProps,
  ChatContainerProps,
} from './types.js';

export type { VoiceMicButtonProps } from './components/VoiceMicButton.js';
export type { AudioVisualizerProps } from './components/AudioVisualizer.js';
export type { VoiceTranscriptProps, TranscriptEntry } from './components/VoiceTranscript.js';
export type { UseAudioCaptureOptions, UseAudioCaptureReturn } from './hooks/useAudioCapture.js';
export type { UseAudioPlaybackReturn } from './hooks/useAudioPlayback.js';

// NLP
export { ConversationContext, textToMeasurements, parseWithRegex } from './nlp/index.js';
export type {
  ParsedMeasurement,
  LLMProvider,
  TextToMeasurementsOptions,
  ConversationMessage,
  ParseWithContextOptions,
  ContextParseResult,
} from './nlp/index.js';
