import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { OFFLINE_DIFFICULTY_WORDS } from "../../../../lib/words_db";

const FALLBACKS = [
  ...OFFLINE_DIFFICULTY_WORDS.lagano.map(item => ({ ...item, difficulty: "lagano" })),
  ...OFFLINE_DIFFICULTY_WORDS.srednje.map(item => ({ ...item, difficulty: "srednje" })),
  ...OFFLINE_DIFFICULTY_WORDS.tesko.map(item => ({ ...item, difficulty: "tesko" }))
];

export async function POST(req: NextRequest) {
  let difficulty = "srednje";
  let avoidWords: string[] = [];
  try {
    const body = await req.json().catch(() => ({}));
    difficulty = body.difficulty || "srednje";
    avoidWords = body.avoidWords || [];
    const avoidSet = new Set(avoidWords.map(w => w.toLowerCase()));

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      const filtered = FALLBACKS.filter(item => item.difficulty === difficulty);
      const pool = filtered.length > 0 ? filtered : FALLBACKS;
      let available = pool.filter(item => !avoidSet.has(item.word.toLowerCase()));
      if (available.length === 0) {
        available = pool; // reset pool if all words are used
      }
      const selected = available[Math.floor(Math.random() * available.length)];
      return NextResponse.json({
        category: selected.category,
        word: selected.word,
        hint: selected.hint,
        isFallback: true
      });
    }

    // Initialize Gemini API
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const avoidPromptSection = avoidWords.length > 0 
      ? `\nZABRANJENO JE generirati bilo koju od sljedećih riječi (koje su već iskorištene): [${avoidWords.join(", ")}]. Generiraj potpuno drugu riječ.` 
      : "";

    const prompt = `Generiraj detalje za društvenu igru Impostor na hrvatskom jeziku.
Zadana težina igre je: ${difficulty} (lagano, srednje ili teško). Ovisno o toj težini, odaberi tajnu riječ:
- Ako je zadana težina "lagano" (easy): odaberi iznimno jednostavan, uobičajen i opipljiv svakodnevni pojam (npr. "Kruh", "Auto", "Pas", "Zvijezda", "Banane", "Škola", "Sunce"). Pojam mora biti iznimno lagan za prepoznati i opisati.
- Ako je zadana težina "srednje" (medium): odaberi umjereno poznat i malo specifičniji pojam koji zahtijeva malo razmišljanja za opisati (npr. "Svjetionik", "Padobran", "Tornado", "Klokan", "Vatrogasac", "Mumija").
- Ako je zadana težina "teško" (hard): odaberi apstraktne, znanstvene, filozofske, tehničke ili rijetke pojmove koji su teški za opisati bez brzog otkrivanja uloge (npr. "Entropija", "Paradoks", "Fotosinteza", "Egzoskelet", "Alkemija", "Amnezija", "Crna rupa", "Utopija").
${avoidPromptSection}

Moramo dobiti:
1. Tajna riječ (specifičan pojam na hrvatskom jeziku, prilagođen zadanoj težini: "${difficulty}").
2. Impostor hint (isključivo točno JEDNA riječ na hrvatskom jeziku).
VAŽNO PRAVILO ZA HINT: trag (hint) mora biti vrlo labavo i neizravno povezan s tajnom riječju (eng. extremely vague / loosely connected), nikako očigledan. 
Na primjer:
- Ako je tajna riječ "Klokan", hint ne smije biti "Skakač" ili "Torba" (to je prelagano), nego "Skok" ili "Rep" ili "Divljina".
- Ako je tajna riječ "Pizza", hint ne smije biti "Talijansko" ili "Trokut", nego "Tijesto" ili "Peć".
- Ako je tajna riječ "Mobitel", hint ne smije biti "Ekran" ili "Zvanje", nego "Staklo" or "Džep".
Tajna riječ mora biti općepoznati pojam unutar te razine težine. Trag mora biti iznimno neodređen tako da impostor ne može lako pogoditi točnu tajnu riječ na temelju njega.
U polju category vrati općeniti naziv kategorije te riječi (npr. "Predmet", "Životinja", "Zanimanje", "Hrana", "Fizika" itd.).

Vrati isključivo JSON prema zadanoj shemi. Sve vrijednosti moraju biti na hrvatskom jeziku.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 1.0,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "Naziv općenite kategorije tajne riječi na hrvatskom jeziku." },
            word: { type: Type.STRING, description: "Tajna riječ na hrvatskom jeziku (mora biti pojedinačan općepoznati pojam)." },
            hint: { type: Type.STRING, description: "Izuzetno neodređen trag za impostora koji se sastoji od točno jedne riječi na hrvatskom jeziku." },
          },
          required: ["category", "word", "hint"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini");
    }

    const data = JSON.parse(text.trim());
    return NextResponse.json({
      category: data.category,
      word: data.word,
      hint: data.hint,
      isFallback: false
    });

  } catch (error) {
    console.error("Greška pri generiranju riječi pomoću Gemini API-ja:", error);
    // Silent fallback to standard offline word list using already-parsed avoidWords
    const avoidSet = new Set(avoidWords.map(w => w.toLowerCase()));

    const filtered = FALLBACKS.filter(item => item.difficulty === difficulty);
    const pool = filtered.length > 0 ? filtered : FALLBACKS;
    let available = pool.filter(item => !avoidSet.has(item.word.toLowerCase()));
    if (available.length === 0) {
      available = pool;
    }
    const selected = available[Math.floor(Math.random() * available.length)];
    return NextResponse.json({
      category: selected.category,
      word: selected.word,
      hint: selected.hint,
      isFallback: true,
      error: error instanceof Error ? error.message : "Nepoznata greška"
    });
  }
}
