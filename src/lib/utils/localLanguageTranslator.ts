// MIU Local Language Translation Utility
// Translates Luganda, Swahili, Runyankore/Rukiga, Luo, and East African phrases into English marketplace keywords

export interface TranslationResult {
  original: string;
  translated: string;
  detectedLanguage: string | null;
  isTranslated: boolean;
  matchedKeywords: string[];
}

// Intent and filler phrases to clean out
const INTENT_STOP_WORDS = [
  // Luganda
  "njagala", "nnoonya", "noonya", "ndaga", "mpe", "leeta", "leta", "ngula", "tunda",
  "olina", "mulina", "nina", "obwetaavu", "bwe", "bwa", "kiki",
  // Swahili
  "nataka", "ninataka", "natafuta", "tafuta", "nionyeshe", "onyesha", "lete", "niletee",
  "nunua", "uko na", "mko na", "iko", "ziko", "kwa ajili ya", "vya", "ya", "za", "wa",
  // English common intent phrases
  "i want", "i need", "looking for", "show me", "give me", "buy me", "search for", "find me"
];

// Multi-word phrase mappings (checked first for higher precision)
const PHRASE_DICTIONARY: { phrase: string; translation: string; lang: string }[] = [
  // Luganda phrases
  { phrase: "mubisi gwenjuki omutongole", translation: "pure raw organic honey", lang: "Luganda" },
  { phrase: "mubisi gwenjuki", translation: "pure honey", lang: "Luganda" },
  { phrase: "mubisi gw'enjuki", translation: "pure honey", lang: "Luganda" },
  { phrase: "engatto z'abasajja", translation: "men shoes leather boots", lang: "Luganda" },
  { phrase: "engatto z'abakazi", translation: "women shoes sandals heels", lang: "Luganda" },
  { phrase: "engatto z'abaana", translation: "children school shoes", lang: "Luganda" },
  { phrase: "engatto za baana", translation: "children school shoes", lang: "Luganda" },
  { phrase: "engoye z'abasajja", translation: "men clothing shirts kitenge", lang: "Luganda" },
  { phrase: "engoye z'abakazi", translation: "women dresses kitenge fashion", lang: "Luganda" },
  { phrase: "engoye z'abaana", translation: "kids children clothing wear", lang: "Luganda" },
  { phrase: "ensawo y'omu ngalo", translation: "leather handbag clutch", lang: "Luganda" },
  { phrase: "ensawo y'omugongo", translation: "leather backpack school travel bag", lang: "Luganda" },
  { phrase: "ensawo y'olukoba", translation: "leather shoulder cross bag", lang: "Luganda" },
  { phrase: "ebisero by'omukeeka", translation: "handwoven baskets crafts", lang: "Luganda" },
  { phrase: "ebintu by'omu nnyumba", translation: "home decor living kitchen furniture", lang: "Luganda" },
  { phrase: "ebikozesebwa mu fumbiro", translation: "kitchen cooking utensils pottery", lang: "Luganda" },
  { phrase: "ebizigo by'omubiri", translation: "body lotion shea butter skincare", lang: "Luganda" },
  { phrase: "ebizigo by'olususu", translation: "face cream skincare shea butter", lang: "Luganda" },
  { phrase: "emmwanyi ya mbale", translation: "Mbale Arabica coffee", lang: "Luganda" },
  { phrase: "emmwanyi ez'okunywa", translation: "roasted ground Arabica coffee", lang: "Luganda" },
  { phrase: "ebitabo by'abaana", translation: "children school textbooks books", lang: "Luganda" },
  { phrase: "ebitabo by'esomero", translation: "school textbooks exercise books", lang: "Luganda" },
  { phrase: "eby'obulimi n'obulunzi", translation: "agriculture farming organic tools", lang: "Luganda" },

  // Swahili phrases
  { phrase: "viatu vya kiume", translation: "men shoes leather boots", lang: "Swahili" },
  { phrase: "viatu vya kike", translation: "women shoes sandals", lang: "Swahili" },
  { phrase: "viatu vya watoto", translation: "children school shoes", lang: "Swahili" },
  { phrase: "nguo za kiume", translation: "men shirts suits kitenge wear", lang: "Swahili" },
  { phrase: "nguo za kike", translation: "women dresses kitenge skirts", lang: "Swahili" },
  { phrase: "nguo za watoto", translation: "children kids wear clothing", lang: "Swahili" },
  { phrase: "mikoba ya ngozi", translation: "genuine leather bags tote", lang: "Swahili" },
  { phrase: "asali safi", translation: "pure raw organic honey", lang: "Swahili" },
  { phrase: "kahawa ya uganda", translation: "Ugandan Arabica coffee", lang: "Swahili" },
  { phrase: "mafuta ya shea", translation: "pure nilotica shea butter skincare", lang: "Swahili" },
  { phrase: "mafuta ya kujipaka", translation: "body lotion organic skincare", lang: "Swahili" },
  { phrase: "vikapu vya asili", translation: "handwoven traditional craft baskets", lang: "Swahili" },
  { phrase: "vifaa vya shule", translation: "school stationery supplies books", lang: "Swahili" },
  { phrase: "vyombo vya nyumbani", translation: "home decor furniture utensils", lang: "Swahili" },
];

// Single word dictionary
const WORD_DICTIONARY: Record<string, { en: string; lang: string }> = {
  // Luganda
  engatto: { en: "shoes", lang: "Luganda" },
  ngatto: { en: "shoes", lang: "Luganda" },
  engoye: { en: "clothes", lang: "Luganda" },
  ngoye: { en: "clothing", lang: "Luganda" },
  olugoye: { en: "clothing", lang: "Luganda" },
  ebyambalo: { en: "fashion clothes", lang: "Luganda" },
  kitenge: { en: "kitenge", lang: "Luganda" },
  ekitenge: { en: "kitenge", lang: "Luganda" },
  ebitenge: { en: "kitenge", lang: "Luganda" },
  kanzu: { en: "traditional kanzu", lang: "Luganda" },
  gomesi: { en: "traditional gomesi dress", lang: "Luganda" },
  ensawo: { en: "bag", lang: "Luganda" },
  nsawo: { en: "bag", lang: "Luganda" },
  ekikapu: { en: "basket bag", lang: "Luganda" },
  ebikapu: { en: "baskets bags", lang: "Luganda" },
  ekisero: { en: "basket", lang: "Luganda" },
  ebisero: { en: "handwoven baskets", lang: "Luganda" },
  omukeeka: { en: "woven mat", lang: "Luganda" },
  mukeeka: { en: "woven mat", lang: "Luganda" },
  emikeeka: { en: "woven mats", lang: "Luganda" },
  mikeeka: { en: "woven mats", lang: "Luganda" },
  ekibbo: { en: "handcrafted basket", lang: "Luganda" },
  ebibbo: { en: "handcrafted baskets", lang: "Luganda" },
  emmwanyi: { en: "coffee", lang: "Luganda" },
  mwanyi: { en: "coffee", lang: "Luganda" },
  omubisi: { en: "honey", lang: "Luganda" },
  mubisi: { en: "honey", lang: "Luganda" },
  enjuki: { en: "bee honey", lang: "Luganda" },
  ebizigo: { en: "shea butter skincare lotion", lang: "Luganda" },
  bizigo: { en: "shea butter lotion", lang: "Luganda" },
  olususu: { en: "skin face skincare", lang: "Luganda" },
  sabuuni: { en: "organic soap", lang: "Luganda" },
  ebitabo: { en: "books", lang: "Luganda" },
  ekitabo: { en: "book", lang: "Luganda" },
  obutabo: { en: "books notebooks", lang: "Luganda" },
  kalaamu: { en: "pen stationery", lang: "Luganda" },
  entebe: { en: "chair furniture", lang: "Luganda" },
  emmeeza: { en: "table furniture", lang: "Luganda" },
  caai: { en: "organic tea", lang: "Luganda" },
  chai: { en: "tea", lang: "Luganda" },
  chokoleti: { en: "Ugandan cocoa chocolate", lang: "Luganda" },
  emmere: { en: "food organic produce", lang: "Luganda" },
  matooke: { en: "fresh matooke bananas", lang: "Luganda" },
  amatooke: { en: "matooke bananas", lang: "Luganda" },
  gonja: { en: "roasted gonja plantain snacks", lang: "Luganda" },
  lumonde: { en: "sweet potatoes", lang: "Luganda" },
  muwogo: { en: "cassava flour", lang: "Luganda" },
  bijanjaalo: { en: "beans legumes", lang: "Luganda" },
  ebijanjaalo: { en: "beans legumes", lang: "Luganda" },
  obuwunga: { en: "organic maize flour posho", lang: "Luganda" },
  amata: { en: "pasteurized milk dairy", lang: "Luganda" },
  obutunda: { en: "passion fruit juice", lang: "Luganda" },
  ensigo: { en: "farming seeds agriculture", lang: "Luganda" },
  ebigimusa: { en: "organic fertilizer", lang: "Luganda" },
  ebirime: { en: "crops agriculture", lang: "Luganda" },
  abasajja: { en: "men", lang: "Luganda" },
  abakazi: { en: "women", lang: "Luganda" },
  abaana: { en: "children kids", lang: "Luganda" },
  baana: { en: "kids", lang: "Luganda" },

  // Swahili
  viatu: { en: "shoes", lang: "Swahili" },
  kiatu: { en: "shoes footwear", lang: "Swahili" },
  sapatu: { en: "sandals slippers", lang: "Swahili" },
  kandambili: { en: "slippers sandals", lang: "Swahili" },
  nguo: { en: "clothing clothes", lang: "Swahili" },
  mavazi: { en: "clothing fashion", lang: "Swahili" },
  vitenge: { en: "kitenge African wear", lang: "Swahili" },
  gauni: { en: "dress gown", lang: "Swahili" },
  magauni: { en: "dresses", lang: "Swahili" },
  shati: { en: "shirt", lang: "Swahili" },
  mashati: { en: "shirts", lang: "Swahili" },
  mkoba: { en: "bag handbag", lang: "Swahili" },
  mikoba: { en: "bags handbags tote", lang: "Swahili" },
  pochi: { en: "wallet clutch bag", lang: "Swahili" },
  mfuko: { en: "bag backpack", lang: "Swahili" },
  mifuko: { en: "bags backpacks", lang: "Swahili" },
  kikapu: { en: "woven basket", lang: "Swahili" },
  vikapu: { en: "woven craft baskets", lang: "Swahili" },
  mkeka: { en: "woven mat", lang: "Swahili" },
  mikeka: { en: "woven mats", lang: "Swahili" },
  kahawa: { en: "Arabica coffee", lang: "Swahili" },
  asali: { en: "pure honey", lang: "Swahili" },
  mafuta: { en: "shea butter lotion oil", lang: "Swahili" },
  sabuni: { en: "soap", lang: "Swahili" },
  vipodozi: { en: "cosmetics skincare beauty", lang: "Swahili" },
  vitabu: { en: "books stationery", lang: "Swahili" },
  kitabu: { en: "book", lang: "Swahili" },
  daftari: { en: "exercise book notebook", lang: "Swahili" },
  kalamu: { en: "pen stationery", lang: "Swahili" },
  chakula: { en: "food organic snacks", lang: "Swahili" },
  maziwa: { en: "milk dairy", lang: "Swahili" },
  matunda: { en: "fresh fruits", lang: "Swahili" },
  viazi: { en: "potatoes", lang: "Swahili" },
  unga: { en: "flour posho", lang: "Swahili" },
  maharage: { en: "beans legumes", lang: "Swahili" },
  viti: { en: "chairs furniture", lang: "Swahili" },
  kiti: { en: "chair", lang: "Swahili" },
  meza: { en: "table furniture", lang: "Swahili" },
  kilimo: { en: "agriculture farming", lang: "Swahili" },
  mbegu: { en: "seeds planting agriculture", lang: "Swahili" },
  mbolea: { en: "fertilizer organic", lang: "Swahili" },
  mifugo: { en: "livestock poultry", lang: "Swahili" },
  wanaume: { en: "men", lang: "Swahili" },
  wanawake: { en: "women", lang: "Swahili" },
  watoto: { en: "children kids", lang: "Swahili" },

  // Runyankore / Rukiga / Western Uganda
  enkaito: { en: "shoes leather", lang: "Runyankore" },
  enketo: { en: "shoes footwear", lang: "Runyankore" },
  emyenda: { en: "clothes dresses", lang: "Runyankore" },
  ensaho: { en: "bag tote leather", lang: "Runyankore" },
  amajuta: { en: "shea butter oil lotion", lang: "Runyankore" },
  omwanyi: { en: "Arabica coffee", lang: "Runyankore" },
  ebitooke: { en: "matooke bananas", lang: "Runyankore" },
  amate: { en: "fresh milk dairy", lang: "Runyankore" },
  obushera: { en: "millet flour porridge", lang: "Runyankore" },

  // Luo / Northern Uganda
  wara: { en: "shoes leather boots", lang: "Luo" },
  bongo: { en: "clothing dress shirt", lang: "Luo" },
  kicaa: { en: "handcrafted bag basket", lang: "Luo" },
  moo: { en: "shea butter nilotica oil", lang: "Luo" },
  kic: { en: "pure honey", lang: "Luo" },
  cam: { en: "food agriculture", lang: "Luo" },
};

/**
 * Translates a user search string in Luganda, Swahili, Runyankore, or Luo to English.
 * Cleans intent filler words and maps key product nouns.
 */
export function translateLocalQuery(input: string): TranslationResult {
  if (!input || !input.trim()) {
    return {
      original: "",
      translated: "",
      detectedLanguage: null,
      isTranslated: false,
      matchedKeywords: [],
    };
  }

  const rawClean = input.trim();
  let queryLower = rawClean.toLowerCase();

  // Strip punctuation except apostrophe
  queryLower = queryLower.replace(/[^\w\s']/g, " ").replace(/\s+/g, " ").trim();

  // Helper to remove stop / intent words
  const cleanStopWords = (text: string) => {
    const parts = text.split(" ").filter(Boolean);
    return parts.filter((w) => !INTENT_STOP_WORDS.includes(w.toLowerCase())).join(" ");
  };

  // Check multi-word phrase matches first
  for (const item of PHRASE_DICTIONARY) {
    if (queryLower.includes(item.phrase)) {
      const remainingRaw = queryLower.replace(item.phrase, "").trim();
      const remainingClean = cleanStopWords(remainingRaw);
      const translated = remainingClean ? `${remainingClean} ${item.translation}`.trim() : item.translation;
      return {
        original: rawClean,
        translated,
        detectedLanguage: item.lang,
        isTranslated: true,
        matchedKeywords: [item.phrase, item.translation],
      };
    }
  }

  // Tokenize and clean intent words
  const tokens = queryLower.split(" ").filter(Boolean);
  let detectedLang: string | null = null;
  const translatedTokens: string[] = [];
  const matchedKeywords: string[] = [];
  let translatedAny = false;

  for (const token of tokens) {
    // Check if token is a filler intent word
    if (INTENT_STOP_WORDS.includes(token)) {
      continue;
    }

    // Check single word dictionary
    const dictMatch = WORD_DICTIONARY[token];
    if (dictMatch) {
      translatedTokens.push(dictMatch.en);
      matchedKeywords.push(token);
      detectedLang = dictMatch.lang;
      translatedAny = true;
    } else {
      // Keep original word (could be brand name, district like "Mbale", "Kampala", or already English)
      translatedTokens.push(token);
    }
  }

  const finalTranslated = translatedTokens.join(" ").trim() || rawClean;

  return {
    original: rawClean,
    translated: finalTranslated,
    detectedLanguage: detectedLang,
    isTranslated: translatedAny && finalTranslated.toLowerCase() !== rawClean.toLowerCase(),
    matchedKeywords,
  };
}
