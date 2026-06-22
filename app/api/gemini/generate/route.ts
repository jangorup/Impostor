import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Fallback lists of words in Croatian categorized by difficulty if the Gemini API key is not configured or fails
const FALLBACKS = [
  // LAGANO
  { difficulty: "lagano", category: "Hrana", word: "Pizza", hint: "Tijesto" },
  { difficulty: "lagano", category: "Hrana", word: "Banana", hint: "Oguliti" },
  { difficulty: "lagano", category: "Životinje", word: "Pas", hint: "Kosti" },
  { difficulty: "lagano", category: "Životinje", word: "Mačka", hint: "Presti" },
  { difficulty: "lagano", category: "Priroda", word: "Sunce", hint: "Svjetlo" },
  { difficulty: "lagano", category: "Priroda", word: "Voda", hint: "Mokro" },
  { difficulty: "lagano", category: "Predmeti", word: "Auto", hint: "Kotači" },
  { difficulty: "lagano", category: "Građevine", word: "Kuća", hint: "Prozor" },
  { difficulty: "lagano", category: "Predmeti", word: "Avion", hint: "Krilo" },
  { difficulty: "lagano", category: "Predmeti", word: "Knjiga", hint: "Čitati" },
  { difficulty: "lagano", category: "Lokacije", word: "Škola", hint: "Učenik" },
  { difficulty: "lagano", category: "Priroda", word: "Cvijet", hint: "Latice" },
  { difficulty: "lagano", category: "Namještaj", word: "Stol", hint: "Drvo" },
  { difficulty: "lagano", category: "Igračke", word: "Lopta", hint: "Kotrljanje" },
  { difficulty: "lagano", category: "Hrana", word: "Jabuka", hint: "Crveno" },
  { difficulty: "lagano", category: "Priroda", word: "Vatra", hint: "Toplina" },
  { difficulty: "lagano", category: "Priroda", word: "More", hint: "Valovi" },
  { difficulty: "lagano", category: "Priroda", word: "Zvijezda", hint: "Nebo" },
  { difficulty: "lagano", category: "Životinje", word: "Riba", hint: "Voda" },
  { difficulty: "lagano", category: "Predmeti", word: "Sat", hint: "Vrijeme" },

  // SREDNJE
  { difficulty: "srednje", category: "Građevine", word: "Svjetionik", hint: "Obala" },
  { difficulty: "srednje", category: "Vozila", word: "Helikopter", hint: "Elisa" },
  { difficulty: "srednje", category: "Priroda", word: "Vulkan", hint: "Krater" },
  { difficulty: "srednje", category: "Lokacije", word: "Kineski zid", hint: "Obrana" },
  { difficulty: "srednje", category: "Lokacije", word: "Eiffelov toranj", hint: "Pariz" },
  { difficulty: "srednje", category: "Životinje", word: "Klokan", hint: "Skakanje" },
  { difficulty: "srednje", category: "Životinje", word: "Dupin", hint: "Peraja" },
  { difficulty: "srednje", category: "Životinje", word: "Pingvin", hint: "Antarktika" },
  { difficulty: "srednje", category: "Instrumenti", word: "Mikroskop", hint: "Leća" },
  { difficulty: "srednje", category: "Predmeti", word: "Kompas", hint: "Sjever" },
  { difficulty: "srednje", category: "Oprema", word: "Padobran", hint: "Skok" },
  { difficulty: "srednje", category: "Zanimanja", word: "Vatrogasac", hint: "Požar" },
  { difficulty: "srednje", category: "Zanimanja", word: "Programer", hint: "Kodiranje" },
  { difficulty: "srednje", category: "Zanimanja", word: "Astronaut", hint: "Svemir" },
  { difficulty: "srednje", category: "Vozila", word: "Podmornica", hint: "Dubina" },
  { difficulty: "srednje", category: "Predmeti", word: "Termometar", hint: "Celzijus" },
  { difficulty: "srednje", category: "Lokacije", word: "Labirint", hint: "Prolaz" },
  { difficulty: "srednje", category: "Predmeti", word: "Vatromet", hint: "Nebo" },
  { difficulty: "srednje", category: "Umjetnost", word: "Skulptura", hint: "Kamen" },
  { difficulty: "srednje", category: "Zanimanja", word: "Liječnik", hint: "Bolnica" },

  // TEŠKO
  { difficulty: "tesko", category: "Tehnologija", word: "Egzoskelet", hint: "Oklop" },
  { difficulty: "tesko", category: "Informatika", word: "Kriptografija", hint: "Šifra" },
  { difficulty: "tesko", category: "Fizika", word: "Entropija", hint: "Kaos" },
  { difficulty: "tesko", category: "Filozofija", word: "Paradoks", hint: "Kontradikcija" },
  { difficulty: "tesko", category: "Biologija", word: "Fotosinteza", hint: "Klorofil" },
  { difficulty: "tesko", category: "Znanost", word: "Arheologija", hint: "Iskopavanja" },
  { difficulty: "tesko", category: "Biologija", word: "Simbioza", hint: "Zajednica" },
  { difficulty: "tesko", category: "Fizika", word: "Gravitacija", hint: "Masa" },
  { difficulty: "tesko", category: "Povijest", word: "Alkemija", hint: "Pretvorba" },
  { difficulty: "tesko", category: "Spomenici", word: "Monolit", hint: "Blok" },
  { difficulty: "tesko", category: "Književnost", word: "Metafora", hint: "Usporedba" },
  { difficulty: "tesko", category: "Mitologija", word: "Proročanstvo", hint: "Budućnost" },
  { difficulty: "tesko", category: "Medicina", word: "Inkubator", hint: "Toplina" },
  { difficulty: "tesko", category: "Psihologija", word: "Halucinacija", hint: "Privid" },
  { difficulty: "tesko", category: "Svemir", word: "Crna rupa", hint: "Gravitacija" },
  { difficulty: "tesko", category: "Psihologija", word: "Hipnoza", hint: "Trans" },
  { difficulty: "tesko", category: "Strojarstvo", word: "Turbina", hint: "Oštrice" },
  { difficulty: "tesko", category: "Tehnologija", word: "Oscilator", hint: "Valovi" },
  { difficulty: "tesko", category: "Znanost", word: "Nanotehnologija", hint: "Atomi" },
  { difficulty: "tesko", category: "Filozofija", word: "Labirint uma", hint: "Misli" }
];

export async function POST(req: NextRequest) {
  let difficulty = "srednje";
  try {
    const body = await req.json().catch(() => ({}));
    difficulty = body.difficulty || "srednje";

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      const filtered = FALLBACKS.filter(item => item.difficulty === difficulty);
      const pool = filtered.length > 0 ? filtered : FALLBACKS;
      const selected = pool[Math.floor(Math.random() * pool.length)];
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

    const prompt = `Generiraj detalje za društvenu igru Impostor na hrvatskom jeziku.
Zadana težina igre je: ${difficulty} (lagano, srednje ili teško). Ovisno o toj težini, odaberi tajnu riječ:
- Ako je zadana težina "lagano" (easy): odaberi iznimno jednostavan, uobičajen i opipljiv svakodnevni pojam (npr. "Kruh", "Auto", "Pas", "Zvijezda", "Banane", "Škola", "Sunce"). Pojam mora biti iznimno lagan za prepoznati i opisati.
- Ako je zadana težina "srednje" (medium): odaberi umjereno poznat i malo specifičniji pojam koji zahtijeva malo razmišljanja za opisati (npr. "Svjetionik", "Padobran", "Tornado", "Klokan", "Vatrogasac", "Mumija").
- Ako je zadana težina "teško" (hard): odaberi apstraktne, znanstvene, filozofske, tehničke ili rijetke pojmove koji su teški za opisati bez brzog otkrivanja uloge (npr. "Entropija", "Paradoks", "Fotosinteza", "Egzoskelet", "Alkemija", "Amnezija", "Crna rupa", "Utopija").

Moramo dobiti:
1. Tajna riječ (specifičan pojam na hrvatskom jeziku, prilagođen zadanoj težini: "${difficulty}").
2. Impostor hint (isključivo točno JEDNA riječ na hrvatskom jeziku).
VAŽNO PRAVILO ZA HINT: trag (hint) mora biti vrlo labavo i neizravno povezan s tajnom riječju (eng. extremely vague / loosely connected), nikako očigledan. 
Na primjer:
- Ako je tajna riječ "Klokan", hint ne smije biti "Skakač" ili "Torba" (to je prelagano), nego "Skok" ili "Rep" ili "Divljina".
- Ako je tajna riječ "Pizza", hint ne smije biti "Talijansko" ili "Trokut", nego "Tijesto" ili "Peć".
- Ako je tajna riječ "Mobitel", hint ne smije biti "Ekran" ili "Zvanje", nego "Staklo" ili "Džep".
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
    // Silent fallback to standard offline word list
    const filtered = FALLBACKS.filter(item => item.difficulty === difficulty);
    const pool = filtered.length > 0 ? filtered : FALLBACKS;
    const selected = pool[Math.floor(Math.random() * pool.length)];
    return NextResponse.json({
      category: selected.category,
      word: selected.word,
      hint: selected.hint,
      isFallback: true,
      error: error instanceof Error ? error.message : "Nepoznata greška"
    });
  }
}
