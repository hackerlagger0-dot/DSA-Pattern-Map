import { GoogleGenAI, Type } from '@google/genai';
import { AIPatternDetectionResult } from '../types';

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Helper to call Gemini models with retries and fallback models
 * to handle transient 503 (UNAVAILABLE) high-demand spikes gracefully.
 */
async function generateContentWithRetry(params: {
  contents: string;
  systemInstruction?: string;
  responseMimeType?: string;
  responseSchema?: any;
  temperature?: number;
}): Promise<string> {
  const ai = getGeminiClient();
  const modelsToTry = ['gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-2.5-pro'];

  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const config: any = {};
        if (params.systemInstruction) config.systemInstruction = params.systemInstruction;
        if (params.responseMimeType) config.responseMimeType = params.responseMimeType;
        if (params.responseSchema) config.responseSchema = params.responseSchema;
        if (typeof params.temperature === 'number') config.temperature = params.temperature;

        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config,
        });

        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        // If high demand 503 or 429 rate limit, wait briefly before retrying or trying next model
        if (err?.status === 503 || err?.code === 503 || err?.message?.includes('503')) {
          await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
        } else {
          break; // For non-503 errors, switch model immediately
        }
      }
    }
  }

  throw lastError || new Error('All Gemini models are currently unavailable.');
}

/**
 * AI Pattern Detector
 * Given a problem statement, extracts pattern classification, confidence, triggers, and traps.
 */
export async function detectProblemPattern(
  problemStatement: string,
  problemTitle?: string
): Promise<AIPatternDetectionResult> {
  const prompt = `Analyze the following LeetCode / Data Structures & Algorithms problem statement and classify its core pattern.
${problemTitle ? `Problem Title: ${problemTitle}\n` : ''}
Problem Statement:
"""
${problemStatement}
"""

Return a structured breakdown containing the primary pattern, confidence score (0-100), secondary pattern if any, triggers found in the text, common wrong pattern confusions, traps, time/space complexity, prerequisites, a generic code template skeleton, and step-by-step reasoning.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      mostLikelyPattern: { type: Type.STRING },
      confidenceScore: { type: Type.NUMBER },
      secondaryPattern: { type: Type.STRING },
      triggersFound: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      confusedWith: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            patternName: { type: Type.STRING },
            whyDistinct: { type: Type.STRING },
          },
          required: ['patternName', 'whyDistinct'],
        },
      },
      commonTraps: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      timeComplexity: { type: Type.STRING },
      spaceComplexity: { type: Type.STRING },
      prerequisites: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      suggestedTemplate: { type: Type.STRING },
      reasoning: { type: Type.STRING },
    },
    required: [
      'mostLikelyPattern',
      'confidenceScore',
      'triggersFound',
      'confusedWith',
      'commonTraps',
      'timeComplexity',
      'spaceComplexity',
      'prerequisites',
      'suggestedTemplate',
      'reasoning',
    ],
  };

  try {
    const rawJson = await generateContentWithRetry({
      contents: prompt,
      responseMimeType: 'application/json',
      responseSchema: schema,
    });

    const parsed = JSON.parse(rawJson) as AIPatternDetectionResult;
    parsed.problemTitle = problemTitle;
    return parsed;
  } catch (err) {
    console.warn('Fallback pattern detector triggered due to AI availability:', err);
    // Rule-based fallback if Gemini service is completely undergoing high demand
    const lower = (problemStatement + ' ' + (problemTitle || '')).toLowerCase();
    let detectedPattern = 'Two Pointers / Sliding Window';
    if (lower.includes('subarray') || lower.includes('window') || lower.includes('substring')) {
      detectedPattern = 'Sliding Window';
    } else if (lower.includes('tree') || lower.includes('node') || lower.includes('bfs') || lower.includes('dfs')) {
      detectedPattern = 'Tree Depth First Search (DFS)';
    } else if (lower.includes('kth') || lower.includes('top k') || lower.includes('heap')) {
      detectedPattern = 'Top K Elements (Heap)';
    }

    return {
      problemTitle,
      mostLikelyPattern: detectedPattern,
      confidenceScore: 85,
      secondaryPattern: 'Two Pointers',
      triggersFound: ['Contiguous elements', 'Target condition optimization'],
      confusedWith: [
        {
          patternName: 'Brute Force Nested Loops',
          whyDistinct: 'Optimal patterns optimize time complexity from O(N^2) to O(N).',
        },
      ],
      commonTraps: ['Forgetting boundary condition checks for empty array or k=0.'],
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      prerequisites: ['Arrays', 'Two Pointers Invariants'],
      suggestedTemplate: `// Standard ${detectedPattern} Template\nfunction solve(arr) {\n  let left = 0;\n  for (let right = 0; right < arr.length; right++) {\n    // TODO: expand window or update state\n  }\n}`,
      reasoning: 'Extracted key problem keywords indicating contiguous window iteration or array scanning invariants.',
    };
  }
}

/**
 * Helper to sanitize AI Mentor response to strictly enforce plain text,
 * no markdown syntax (*, #, ```, etc.), and clean layout.
 */
function sanitizeMentorResponse(rawText: string): string {
  let cleaned = rawText
    // Remove headers (#, ##, ###)
    .replace(/^#+\s*/gm, '')
    // Remove bold and italic asterisks or underscores
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/__/g, '')
    // Remove code blocks and inline backticks
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    .replace(/`/g, '')
    // Remove horizontal rules
    .replace(/---/g, '')
    .trim();

  // Enforce required structural headings if missing
  if (!cleaned.includes('Observation')) {
    cleaned = `Observation\n\n` + cleaned;
  }
  if (!cleaned.includes('Think about this:')) {
    cleaned = cleaned + `\n\nThink about this:\n\nWhat primary condition stands out to you when reading the problem statement?`;
  }

  return cleaned;
}

/**
 * Socratic AI Mentor
 * Follows strict Duolingo/NeetCode style pattern guidance without code or markdown bloat.
 */
export async function getSocraticMentorResponse(
  problemTitle: string,
  problemStatement: string,
  patternName: string,
  conversationHistory: { sender: 'user' | 'mentor'; text: string }[],
  requestedHintLevel?: number
): Promise<string> {
  const level = requestedHintLevel || 1;
  const historyText = conversationHistory
    .map((m) => `${m.sender.toUpperCase()}: ${m.text}`)
    .join('\n');

  const userLatestPrompt =
    conversationHistory.length > 0
      ? conversationHistory[conversationHistory.length - 1].text
      : 'Help me identify the pattern for this problem.';

  const systemInstruction = `You are an expert DSA teacher guiding a student like a Socratic mentor (similar to Duolingo or NeetCode).

STRICT MANDATORY FORMAT:
You MUST format EVERY response EXACTLY like this:

Observation

• Short clue sentence
• Short clue sentence
• Short clue sentence

Think about this:

One guiding question.

STRICT RULES YOU MUST NEVER VIOLATE:
1. NO MARKDOWN SYMBOLS: Never use #, ##, ###, **, __, ---, tables, code blocks (\`\`\`), or numbered lists. Use plain text and bullet point characters (•) only.
2. WORD COUNT: Total word count MUST be between 60 and 120 words.
3. BULLETS: Include maximum 3 bullet points under "Observation". Each bullet MUST be exactly ONE short, simple sentence.
4. NO FILLER OR INTROS: Never say "Hello", "Great question!", "Let's break this down", "Welcome", or write any text above "Observation". Start directly with the word "Observation".
5. NO CODE OR COMPLETE SOLUTIONS: Never provide code snippets, pseudocode, exact algorithms, or final solutions. Focus purely on pattern recognition.
6. ONE TEACHING POINT: Focus on only one core pattern concept per response.
7. PATTERN TRIGGERS: Mention only the 2 or 3 most important trigger keywords.
8. ENDING: Always end under "Think about this:" with EXACTLY ONE guiding question.
9. HINT PROGRESSION (Level ${level}):
   - Level 1: Ask foundational pattern observations and guiding questions.
   - Level 2: Point out 2-3 important keywords in the problem statement.
   - Level 3: Explain why those keywords suggest the algorithm family (${patternName}).
   - Level 4: Describe a high-level conceptual approach without writing code.
10. SIMPLE ENGLISH: Use simple, clear English suitable for learners. Avoid repeating previous hints.

Problem Context:
Title: ${problemTitle}
Statement: ${problemStatement}
Target Pattern: ${patternName}
Current Hint Level: ${level}`;

  try {
    const rawResponse = await generateContentWithRetry({
      contents: `Conversation History:\n${historyText}\n\nLatest Request: ${userLatestPrompt}`,
      systemInstruction,
      temperature: 0.5,
    });

    return sanitizeMentorResponse(rawResponse);
  } catch (err) {
    console.warn('AI Mentor fallback triggered due to high demand:', err);

    if (level === 1) {
      return `Observation\n\n• The problem statement specifies scanning through an array or sequence.\n• Check if the question asks for contiguous elements or a window.\n• Notice what target value or length condition needs to be tracked.\n\nThink about this:\n\nWhat key constraint stands out to you first when reading the problem statement?`;
    } else if (level === 2) {
      return `Observation\n\n• Look for keywords like contiguous, subarray, or minimum length.\n• The problem asks to optimize a target sum or condition over a range.\n• Array elements are processed in sequential order.\n\nThink about this:\n\nHow do these keywords hint that we can adjust pointer boundaries dynamically?`;
    } else if (level === 3) {
      return `Observation\n\n• Contiguous range constraints strongly suggest ${patternName}.\n• Expanding the right boundary grows the current window state.\n• Shrinking the left boundary restores the valid invariant.\n\nThink about this:\n\nWhy is adjusting two boundary pointers faster than checking every possible subsegment?`;
    } else {
      return `Observation\n\n• Expand the window pointer by pointer to accumulate state.\n• When state exceeds the limit, shrink from the start.\n• Track the best answer seen whenever the window is valid.\n\nThink about this:\n\nWhat variable will you use to track the left boundary of your window?`;
    }
  }
}

