// MIU AI Search & Voice Assistant
// Intelligent Multilingual Translation & Audio Processing for Ugandan Marketplace

export interface AITranslationResult {
  original: string;
  translated: string;
  detectedLanguage: string;
  source: "gemini_ai" | "free_translation_api" | "semantic_nlp";
  matchedCategories: string[];
  extractedDistrict?: string;
  priceFilter?: { maxPrice?: number; minPrice?: number };
}

export interface AIAudioResult {
  transcript: string;
  englishQuery: string;
  detectedLanguage: string;
  category?: string;
  success: boolean;
  error?: string;
}

// Local storage key for optional free Google Gemini API key
const GEMINI_KEY_STORAGE = "miu_gemini_api_key";

export function getSavedGeminiKey(): string {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem(GEMINI_KEY_STORAGE) ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    ""
  );
}

export function setSavedGeminiKey(key: string): void {
  if (typeof window === "undefined") return;
  if (!key.trim()) {
    localStorage.removeItem(GEMINI_KEY_STORAGE);
  } else {
    localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
  }
}

// Common phonetic speech-to-text corrections for Ugandan languages
const PHONETIC_SPEECH_REPLACEMENTS: [RegExp, string][] = [
  [/\b(and\s+gatto|in\s+gatto|engato|angatto|nkaito)\b/gi, "engatto shoes"],
  [/\b(am\s+wanyi|m\s+wanyi|mwanyi|omwanyi|kahawa)\b/gi, "emmwanyi coffee"],
  [/\b(a\s+matter\s+k|matoke|amatoke|ebitooke)\b/gi, "amatooke food"],
  [/\b(on\s+the\s+caker|omukeka|mikeka|emikeka)\b/gi, "omukeeka woven mats"],
  [/\b(share\s+butter|she\s+butter|bizigo|ebizigo)\b/gi, "shea butter skincare"],
  [/\b(mubisi\s+gwenjuki|mubisi|asali)\b/gi, "honey pure organic"],
  [/\b(vya\s+two|v\s+ya\s+to|viyatu)\b/gi, "viatu shoes"],
  [/\b(kitenge|vitenge|bitenge)\b/gi, "kitenge dress african fashion"],
  [/\b(kikapu|ebikapu|ebisero|ekisero)\b/gi, "handwoven baskets crafts"],
];

/**
 * Phonetically heals common browser speech-to-text mishearings
 */
export function healVoiceTranscription(transcript: string): string {
  let healed = transcript;
  for (const [regex, replacement] of PHONETIC_SPEECH_REPLACEMENTS) {
    if (regex.test(healed)) {
      healed = healed.replace(regex, replacement);
    }
  }
  return healed;
}

/**
 * Calls Google Gemini AI with recorded audio (MediaRecorder Blob)
 * Gemini natively understands African languages (Luganda, Swahili, Runyankore, Acholi) and Ugandan accents
 */
export async function transcribeAudioWithGemini(
  audioBlob: Blob,
  apiKey: string
): Promise<AIAudioResult> {
  if (!apiKey) {
    return {
      transcript: "",
      englishQuery: "",
      detectedLanguage: "unknown",
      success: false,
      error: "No Gemini API key provided",
    };
  }

  try {
    // Convert audio Blob to base64
    const base64Audio = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.includes(",") ? result.split(",")[1] : result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });

    const mimeType = audioBlob.type || "audio/webm";

    const prompt = `You are the voice search AI for Made In Uganda (MIU), an e-commerce platform for authentic Ugandan goods.
Listen carefully to this voice audio recording. The speaker may be speaking in Luganda, Swahili, Runyankore, Acholi, or Ugandan English.
Your task:
1. Accurately transcribe what the user said in the original language.
2. Translate and extract the specific products or items they want to buy into concise, search-optimized English keywords.
3. Identify the detected language (e.g., Luganda, Swahili, Runyankore, English).
4. Identify which marketplace category it belongs to (e.g., Fashion & Clothing, Food & Beverages, Arts & Crafts, Footwear, Beauty & Personal Care).

Respond strictly with valid JSON only, using this schema:
{
  "transcript": "string with original words",
  "englishQuery": "string with concise english search keywords",
  "detectedLanguage": "string",
  "category": "string or null"
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Audio,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            response_mime_type: "application/json",
            temperature: 0.2,
          },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error("No transcription response returned from Gemini");
    }

    const parsed = JSON.parse(candidateText);
    return {
      transcript: parsed.transcript || "",
      englishQuery: parsed.englishQuery || parsed.transcript || "",
      detectedLanguage: parsed.detectedLanguage || "Local Language",
      category: parsed.category,
      success: true,
    };
  } catch (error: any) {
    console.warn("Gemini audio transcription error:", error);
    return {
      transcript: "",
      englishQuery: "",
      detectedLanguage: "unknown",
      success: false,
      error: error.message || "Failed to transcribe audio with Gemini",
    };
  }
}

/**
 * Free online AI Translation service using public translation endpoints
 * Translates Luganda, Swahili, French, etc. to English
 */
export async function translateWithFreeAI(text: string): Promise<AITranslationResult> {
  const cleanInput = text.trim();
  if (!cleanInput) {
    return {
      original: "",
      translated: "",
      detectedLanguage: "en",
      source: "semantic_nlp",
      matchedCategories: [],
    };
  }

  // First apply phonetic healing
  const healedText = healVoiceTranscription(cleanInput);

  // If user provided a Gemini API Key, use Gemini for translation
  const geminiKey = getSavedGeminiKey();
  if (geminiKey) {
    try {
      const geminiPrompt = `Translate this query to concise English e-commerce search keywords. The input is from Uganda and may be in Luganda, Swahili, Runyankore, Acholi, or Ugandan slang.
Input: "${healedText}"
Output format: JSON only
{"translated": "english keywords", "detectedLanguage": "language name"}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: geminiPrompt }] }],
            generationConfig: { response_mime_type: "application/json", temperature: 0.1 },
          }),
        }
      );

      if (res.ok) {
        const gData = await res.json();
        const jsonText = gData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          if (parsed.translated) {
            return {
              original: cleanInput,
              translated: parsed.translated,
              detectedLanguage: parsed.detectedLanguage || "AI Translated",
              source: "gemini_ai",
              matchedCategories: [],
            };
          }
        }
      }
    } catch {
      // Fallback to free public translation below
    }
  }

  // Try free MyMemory Translation API (100% free, no key needed)
  try {
    const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      healedText
    )}&langpair=autodetect|en`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(myMemoryUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const translation = data?.responseData?.translatedText;
      if (
        translation &&
        !translation.toUpperCase().includes("PLEASE SELECT") &&
        !translation.toUpperCase().includes("INVALID") &&
        !translation.toUpperCase().includes("WARNING") &&
        translation.toLowerCase() !== healedText.toLowerCase()
      ) {
        return {
          original: cleanInput,
          translated: translation,
          detectedLanguage: data?.responseData?.detectedLanguage || "Local Language",
          source: "free_translation_api",
          matchedCategories: [],
        };
      }
    }
  } catch {
    // Timeout or network offline -> fall through to semantic NLP
  }

  // Intelligent fallback: Dynamic Semantic NLP parser
  const semantic = dynamicSemanticParser(healedText);
  return {
    original: cleanInput,
    translated: semantic.translated || healedText,
    detectedLanguage: semantic.detectedLanguage || "Local Language",
    source: "semantic_nlp",
    matchedCategories: semantic.matchedCategories,
  };
}

// Comprehensive Semantic Knowledge Graph for Ugandan Marketplace
const SEMANTIC_ENTITIES: {
  categories: string[];
  patterns: RegExp[];
  canonicalEnglish: string;
  language: string;
}[] = [
  // Footwear
  {
    categories: ["Footwear"],
    patterns: [/\b(engatto|ngatto|enkaito|enketo|viatu|kiatu|sapatu|sandalo|shoes?|boots?|sandals?|footwear)\b/i],
    canonicalEnglish: "leather shoes boots sandals footwear",
    language: "Luganda / Swahili",
  },
  // Coffee & Beverages
  {
    categories: ["Food & Beverages"],
    patterns: [/\b(emmwanyi|mwanyi|omwanyi|kahawa|coffee|arabica|robusta|beans?|espresso)\b/i],
    canonicalEnglish: "Arabica coffee beans ground",
    language: "Luganda / Swahili",
  },
  // Honey & Pure Organic
  {
    categories: ["Food & Beverages"],
    patterns: [/\b(mubisi|enjuki|asali|honey|bee|raw honey)\b/i],
    canonicalEnglish: "pure raw organic honey",
    language: "Luganda / Swahili",
  },
  // Kitenge & Fashion
  {
    categories: ["Fashion & Clothing"],
    patterns: [/\b(kitenge|vitenge|bitenge|engoye|ngoye|nguo|mavazi|kanzu|gomesi|dress|shirts?|dresses?|clothes?)\b/i],
    canonicalEnglish: "Kitenge African fashion dress clothing",
    language: "Luganda / Swahili",
  },
  // Bags & Leathercraft
  {
    categories: ["Bags & Accessories"],
    patterns: [/\b(ensawo|nsawo|ensaho|mkoba|mikoba|pochi|mfuko|mifuko|bags?|backpack|tote|wallet|leather)\b/i],
    canonicalEnglish: "handcrafted leather bags tote backpack",
    language: "Luganda / Swahili",
  },
  // Woven Crafts, Mats & Baskets
  {
    categories: ["Arts & Crafts"],
    patterns: [/\b(omukeeka|emikeeka|mikeeka|mkeka|mikeka|ekisero|ebisero|kikapu|vikapu|ekibbo|ebibbo|mats?|baskets?|crafts?)\b/i],
    canonicalEnglish: "handwoven baskets crafts woven mats",
    language: "Luganda / Swahili",
  },
  // Shea Butter & Skincare
  {
    categories: ["Beauty & Personal Care"],
    patterns: [/\b(ebizigo|bizigo|mafuta|olususu|shea|butter|lotion|skincare|soap|sabuuni)\b/i],
    canonicalEnglish: "Nilotica shea butter natural skincare",
    language: "Luganda / Swahili",
  },
  // Matooke, Bananas & Agricultural Food
  {
    categories: ["Food & Beverages", "Agriculture"],
    patterns: [/\b(matooke|amatooke|gonja|lumonde|muwogo|ebijanjaalo|posho|cassava|bananas?|food)\b/i],
    canonicalEnglish: "fresh matooke organic agriculture food",
    language: "Luganda / Swahili",
  },
  // Books & Stationery
  {
    categories: ["Books & Stationery"],
    patterns: [/\b(ebitabo|ekitabo|vitabu|kitabu|daftari|books?|notebooks?|stationery|school)\b/i],
    canonicalEnglish: "books novels stationery school supplies",
    language: "Luganda / Swahili",
  },
];

// Stop intent words to strip
const INTENT_WORDS = /\b(njagala|nnoonya|noonya|ndaga|mpe|leeta|leta|ngula|nataka|ninataka|natafuta|tafuta|nionyeshe|onyesha|lete|i want|looking for|show me|find me|buy me)\b/gi;

function dynamicSemanticParser(input: string): {
  translated: string;
  detectedLanguage: string | null;
  matchedCategories: string[];
} {
  let cleaned = input.replace(INTENT_WORDS, " ").replace(/\s+/g, " ").trim();
  const matchedCategories: string[] = [];
  const matchedTerms: string[] = [];
  let detectedLang: string | null = null;

  for (const entity of SEMANTIC_ENTITIES) {
    for (const pattern of entity.patterns) {
      if (pattern.test(cleaned)) {
        entity.categories.forEach((c) => {
          if (!matchedCategories.includes(c)) matchedCategories.push(c);
        });
        matchedTerms.push(entity.canonicalEnglish);
        detectedLang = entity.language;
        // Clean out the matched local word to avoid duplication
        cleaned = cleaned.replace(pattern, " ");
      }
    }
  }

  const remainder = cleaned.replace(/\s+/g, " ").trim();
  const finalTerms = [...new Set([...matchedTerms, remainder])].filter(Boolean).join(" ");

  return {
    translated: finalTerms || input,
    detectedLanguage: detectedLang,
    matchedCategories,
  };
}
