"use client";

import { useState, useRef, useCallback, type ReactNode } from "react";
import {
  ChatContainer,
  ConversationContext,
  type ChatMessage,
  type ParsedMeasurement,
} from "@optomitron/chat-ui";
import { MythBusterCard } from "./MythBusterCard";
import { OutcomeCard } from "./OutcomeCard";
import { BudgetResultCard } from "./BudgetResultCard";
import {
  BUDGET_CATEGORIES,
  getActualGovernmentAllocations,
} from "../../lib/wishocracy-data";
import { listExplorerOutcomes, getOutcomeMegaStudy } from "../../lib/analysis-explorer-data";
import { getOutcomeHubPath } from "../../lib/analysis-explorer-routes";
import misconceptionsData from "../../../public/data/misconceptions.json";
import "./chat-theme.css";

const STORAGE_KEY_API = "opto-chat-api-key";
const STORAGE_KEY_PROVIDER = "opto-chat-provider";

// --- Extended message types for app-specific cards ---
type MythCardMessage = { type: "mythCard"; finding: { myth: string; reality: string; grade: string } };
type OutcomeCardMessage = { type: "outcomeCard"; outcome: { label: string; topPredictor: string; score: number; id: string } };
type BudgetResultMessage = { type: "budgetResult"; allocations: Record<string, number>; actualAllocations: Record<string, number> };

type AppChatMessage = ChatMessage | MythCardMessage | OutcomeCardMessage | BudgetResultMessage;

// --- Budget voting pairs ---
const BUDGET_PAIRS: Array<[string, string]> = [
  ["Pragmatic Clinical Trials", "Drug War Enforcement"],
  ["Addiction Treatment Programs", "Prison Construction & Operations"],
  ["Early Childhood Education", "Nuclear Weapons Development"],
  ["Pragmatic Clinical Trials", "Weapons and Military Systems"],
  ["Addiction Treatment Programs", "Fossil Fuel Subsidies"],
  ["Early Childhood Education", "ICE Immigration Enforcement"],
  ["Pragmatic Clinical Trials", "Agribusiness Subsidies"],
];

const BUDGET_COMMENTARY = [
  "Interesting. Next one.",
  "Predictable choice, but let's see if you stay consistent.",
  "On my planet, this one was settled in about six seconds.",
  "Alright, halfway through. Still with me?",
  "Almost done. You're being surprisingly rational for a human.",
  "One more after this.",
];

// --- Initial hint buttons ---
const INITIAL_HINTS: ChatMessage = {
  type: "hints",
  buttons: [
    { label: "Rate my mood", action: "mood" },
    { label: "Log food", action: "food" },
    { label: "Log a symptom", action: "symptom" },
    { label: "Vote on budget", action: "budget" },
    { label: "Bust a myth", action: "myth" },
    { label: "Show an insight", action: "insight" },
  ],
};

function formatMeasurement(m: ParsedMeasurement): string {
  return `${m.variableName}: ${m.value} ${m.unitAbbreviation}`;
}

function pickRandom<T>(arr: T[]): T | undefined {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<AppChatMessage[]>([
    {
      type: "text",
      role: "assistant",
      content:
        "Hello. I'm Wishonia — World Integrated System for High-Efficiency Optimization Networked Intelligence for Allocation. I've been running a planet for 4,237 years. We ended war in year 12 and disease in year 340. Now I'm here to help you track your meals, symptoms, treatments, and mood. It's not exactly planetary governance but everyone's got to start somewhere. Try \"took 500mg magnesium\" or \"mood 4/5\".",
    },
    { type: "apiKey" },
    INITIAL_HINTS,
  ]);

  const [recentFoods, setRecentFoods] = useState<string[]>([]);
  const ctxRef = useRef(new ConversationContext());
  const budgetVotesRef = useRef(new Map<string, number>());
  const budgetStepRef = useRef(0);

  const appendMultiple = useCallback((...msgs: AppChatMessage[]) => {
    setMessages((prev) => [...prev, ...msgs]);
  }, []);

  const append = useCallback((msg: AppChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  // --- Hint click handler ---
  const handleHintClick = useCallback(
    (action: string) => {
      switch (action) {
        case "mood":
          append({ type: "mood", id: crypto.randomUUID() } as ChatMessage);
          break;

        case "food":
          append({ type: "food", id: crypto.randomUUID() } as ChatMessage);
          break;

        case "symptom":
          append({
            type: "symptom",
            id: "general",
            name: "Overall Symptom",
            valence: "negative",
          } as ChatMessage);
          break;

        case "budget": {
          budgetVotesRef.current.clear();
          budgetStepRef.current = 0;
          const pair = BUDGET_PAIRS[0];
          if (!pair) break;
          appendMultiple(
            {
              type: "text",
              role: "assistant",
              content:
                "Right. Let's see how you'd run things. I'll show you some budget trade-offs — just slide to allocate. On my planet we automated this, but you lot seem to enjoy arguing about it.",
            } as ChatMessage,
            {
              type: "pairwise",
              id: "budget-0",
              itemA: pair[0],
              itemB: pair[1],
            } as ChatMessage,
          );
          break;
        }

        case "myth": {
          const finding = pickRandom(misconceptionsData.findings);
          if (!finding) break;
          appendMultiple(
            {
              type: "text",
              role: "assistant",
              content:
                "Ah, this one's a favourite. Humans have been getting this wrong for decades.",
            } as ChatMessage,
            {
              type: "mythCard",
              finding: { myth: finding.myth, reality: finding.reality, grade: finding.grade },
            } as MythCardMessage,
            {
              type: "hints",
              buttons: [
                { label: "Bust another myth", action: "myth" },
                { label: "Vote on budget", action: "budget" },
                { label: "Show an insight", action: "insight" },
              ],
            } as ChatMessage,
          );
          break;
        }

        case "insight": {
          const outcomes = listExplorerOutcomes();
          const outcome = pickRandom(outcomes);
          if (!outcome) {
            append({
              type: "text",
              role: "assistant",
              content: "No outcome data available yet. Try another action.",
            } as ChatMessage);
            break;
          }

          const megaStudy = getOutcomeMegaStudy(outcome.id);
          const topRow = megaStudy?.rows[0];

          if (topRow) {
            appendMultiple(
              {
                type: "outcomeCard",
                outcome: {
                  label: outcome.label,
                  topPredictor: topRow.predictorLabel ?? topRow.predictorId,
                  score: topRow.score,
                  id: outcome.id,
                },
              } as OutcomeCardMessage,
              {
                type: "hints",
                buttons: [
                  { label: "Show another insight", action: "insight" },
                  { label: "Bust a myth", action: "myth" },
                  { label: "Rate my mood", action: "mood" },
                ],
              } as ChatMessage,
            );
          } else {
            appendMultiple(
              {
                type: "insight",
                title: outcome.label,
                body: `Explore what drives ${outcome.label.toLowerCase()} across jurisdictions.`,
                actionLabel: "See full analysis",
                onAction: () => {
                  window.location.href = getOutcomeHubPath(outcome.id);
                },
              } as ChatMessage,
              {
                type: "hints",
                buttons: [
                  { label: "Show another insight", action: "insight" },
                  { label: "Bust a myth", action: "myth" },
                  { label: "Rate my mood", action: "mood" },
                ],
              } as ChatMessage,
            );
          }
          break;
        }

        case "menu":
          append(INITIAL_HINTS as ChatMessage);
          break;

        case "alignment":
          window.location.href = "/vote";
          break;

        default:
          break;
      }
    },
    [append, appendMultiple],
  );

  // --- Budget-aware pairwise handler ---
  const handlePairwiseCompare = useCallback(
    (id: string, allocationA: number) => {
      if (id.startsWith("budget-")) {
        const step = budgetStepRef.current;
        const pair = BUDGET_PAIRS[step];
        if (pair) {
          // Store votes
          const [itemA, itemB] = pair;
          budgetVotesRef.current.set(
            itemA,
            (budgetVotesRef.current.get(itemA) ?? 0) + allocationA,
          );
          budgetVotesRef.current.set(
            itemB,
            (budgetVotesRef.current.get(itemB) ?? 0) + (100 - allocationA),
          );
        }

        const nextStep = step + 1;
        budgetStepRef.current = nextStep;

        if (nextStep < BUDGET_PAIRS.length) {
          const nextPair = BUDGET_PAIRS[nextStep];
          if (!nextPair) return;
          const commentary = BUDGET_COMMENTARY[step] ?? "Next.";
          appendMultiple(
            {
              type: "text",
              role: "assistant",
              content: commentary,
            } as ChatMessage,
            {
              type: "pairwise",
              id: `budget-${nextStep}`,
              itemA: nextPair[0],
              itemB: nextPair[1],
            } as ChatMessage,
          );
        } else {
          // All done — compute allocations
          const votes = budgetVotesRef.current;
          const total = Array.from(votes.values()).reduce((s, v) => s + v, 0) || 1;
          const allocations: Record<string, number> = {};
          for (const [name, raw] of votes) {
            allocations[name] = Number(((raw / total) * 100).toFixed(1));
          }

          // Map actual allocations to names
          const actualRaw = getActualGovernmentAllocations();
          const actualByName: Record<string, number> = {};
          for (const cat of Object.values(BUDGET_CATEGORIES)) {
            if (actualRaw[cat.id as keyof typeof actualRaw] != null) {
              actualByName[cat.name] = actualRaw[cat.id as keyof typeof actualRaw];
            }
          }

          appendMultiple(
            {
              type: "text",
              role: "assistant",
              content:
                "Well, well. Here's how you'd run things compared to how your government actually allocates money. The discrepancy is... educational.",
            } as ChatMessage,
            {
              type: "budgetResult",
              allocations,
              actualAllocations: actualByName,
            } as BudgetResultMessage,
            {
              type: "hints",
              buttons: [
                { label: "See alignment report", action: "alignment" },
                { label: "Try another action", action: "menu" },
              ],
            } as ChatMessage,
          );
        }
      } else {
        append({
          type: "text",
          role: "assistant",
          content: `Allocation saved: ${allocationA}% / ${100 - allocationA}%.`,
        } as ChatMessage);
      }
    },
    [append, appendMultiple],
  );

  // --- renderCustomMessage for app-specific cards ---
  const renderCustomMessage = useCallback((msg: ChatMessage): ReactNode | null => {
    const m = msg as AppChatMessage;
    switch (m.type) {
      case "mythCard":
        return <MythBusterCard finding={m.finding} />;
      case "outcomeCard":
        return <OutcomeCard outcome={m.outcome} />;
      case "budgetResult":
        return <BudgetResultCard allocations={m.allocations} actualAllocations={m.actualAllocations} />;
      default:
        return null;
    }
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      append({ type: "text", role: "user", content: text } as ChatMessage);

      const apiKey = localStorage.getItem(STORAGE_KEY_API) ?? undefined;
      const provider =
        (localStorage.getItem(STORAGE_KEY_PROVIDER) as
          | "openai"
          | "anthropic"
          | "gemini"
          | undefined) ?? undefined;

      try {
        const result = await ctxRef.current.parseWithContext({
          text,
          apiKey,
          provider,
        });

        if (result.measurements.length > 0) {
          const summary = result.measurements.map(formatMeasurement).join(", ");
          append({
            type: "text",
            role: "assistant",
            content: `Logged: ${summary}`,
          } as ChatMessage);

          for (const m of result.measurements) {
            if (m.categoryName === "Food") {
              setRecentFoods((prev) =>
                [m.variableName, ...prev.filter((f) => f !== m.variableName)].slice(0, 5),
              );
            }
          }
        } else if (result.followUpQuestion) {
          append({
            type: "text",
            role: "assistant",
            content: result.followUpQuestion,
          } as ChatMessage);
        } else {
          append({
            type: "text",
            role: "assistant",
            content:
              "I've been running a planet for four millennia and I couldn't parse that. Try something like \"took 200mg ibuprofen\" or \"headache 3/5\". I need structure. We all do.",
          } as ChatMessage);
        }
      } catch {
        append({
          type: "text",
          role: "assistant",
          content: "Something went wrong on my end. Even alien systems have bad days. Try again.",
        } as ChatMessage);
      }
    },
    [append],
  );

  const handleMoodRate = useCallback(
    (_id: string, value: number) => {
      appendMultiple(
        {
          type: "text",
          role: "assistant",
          content: `Mood rated ${value}/5. Thanks!`,
        } as ChatMessage,
        {
          type: "hints",
          buttons: [
            { label: "Log food", action: "food" },
            { label: "Log a symptom", action: "symptom" },
            { label: "Bust a myth", action: "myth" },
          ],
        } as ChatMessage,
      );
    },
    [appendMultiple],
  );

  const handleTreatmentAction = useCallback(
    (_id: string, action: string, minutes?: number) => {
      const label =
        action === "done"
          ? "Marked as taken."
          : action === "skip"
            ? "Skipped."
            : `Snoozed for ${minutes ?? 15} minutes.`;
      append({ type: "text", role: "assistant", content: label } as ChatMessage);
    },
    [append],
  );

  const handleSymptomRate = useCallback(
    (_id: string, value: number) => {
      appendMultiple(
        {
          type: "text",
          role: "assistant",
          content: `Symptom rated ${value}/5. Recorded.`,
        } as ChatMessage,
        {
          type: "hints",
          buttons: [
            { label: "Rate my mood", action: "mood" },
            { label: "Log food", action: "food" },
            { label: "Show an insight", action: "insight" },
          ],
        } as ChatMessage,
      );
    },
    [appendMultiple],
  );

  const handleFoodLog = useCallback(
    (_id: string, description: string) => {
      setRecentFoods((prev) =>
        [description, ...prev.filter((f) => f !== description)].slice(0, 5),
      );
      appendMultiple(
        {
          type: "text",
          role: "assistant",
          content: `Logged food: ${description}`,
        } as ChatMessage,
        {
          type: "hints",
          buttons: [
            { label: "Rate my mood", action: "mood" },
            { label: "Log a symptom", action: "symptom" },
            { label: "Show an insight", action: "insight" },
          ],
        } as ChatMessage,
      );
    },
    [appendMultiple],
  );

  const handleCheckIn = useCallback(
    (_id: string, health: number, happiness: number, note: string) => {
      const noteText = note ? ` Note: "${note}"` : "";
      appendMultiple(
        {
          type: "text",
          role: "assistant",
          content: `Check-in recorded. Health: ${health}/5, Happiness: ${happiness}/5.${noteText}`,
        } as ChatMessage,
        {
          type: "hints",
          buttons: [
            { label: "Log food", action: "food" },
            { label: "Bust a myth", action: "myth" },
            { label: "Vote on budget", action: "budget" },
          ],
        } as ChatMessage,
      );
    },
    [appendMultiple],
  );

  const handleApiKeySave = useCallback(
    (provider: string, key: string) => {
      localStorage.setItem(STORAGE_KEY_API, key);
      localStorage.setItem(STORAGE_KEY_PROVIDER, provider);
      append({
        type: "text",
        role: "assistant",
        content: `API key saved (${provider}). I'll use AI-powered parsing for better accuracy.`,
      } as ChatMessage);
    },
    [append],
  );

  const handleInsightAction = useCallback(
    (title: string) => {
      const outcomes = listExplorerOutcomes();
      const match = outcomes.find((o) => o.label === title);
      if (match) {
        window.location.href = getOutcomeHubPath(match.id);
      }
    },
    [],
  );

  return (
    <section className="min-h-screen border-b-4 border-black bg-white pb-8 pt-4">
      <ChatContainer
        messages={messages as ChatMessage[]}
        onSend={handleSend}
        onMoodRate={handleMoodRate}
        onTreatmentAction={handleTreatmentAction}
        onSymptomRate={handleSymptomRate}
        onPairwiseCompare={handlePairwiseCompare}
        onFoodLog={handleFoodLog}
        onApiKeySave={handleApiKeySave}
        onHintClick={handleHintClick}
        onCheckIn={handleCheckIn}
        onInsightAction={handleInsightAction}
        renderCustomMessage={renderCustomMessage}
        recentFoods={recentFoods}
      />
    </section>
  );
}
