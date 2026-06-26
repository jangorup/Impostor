export interface WordItem {
  word: string;
  hint: string;
  category: string;
}

// Pre-defined base words with precise hints and categories in Croatian
const BASE_WORDS: Record<"lagano" | "srednje" | "tesko", WordItem[]> = {
  lagano: [
    { word: "Pizza", hint: "Tijesto", category: "Hrana" },
    { word: "Banana", hint: "Oguliti", category: "Hrana" },
    { word: "Pas", hint: "Kosti", category: "Životinje" },
    { word: "Mačka", hint: "Presti", category: "Životinje" },
    { word: "Sunce", hint: "Svjetlo", category: "Priroda" },
    { word: "Voda", hint: "Mokro", category: "Priroda" },
    { word: "Auto", hint: "Kotači", category: "Predmeti" },
    { word: "Kuća", hint: "Prozor", category: "Građevine" },
    { word: "Avion", hint: "Krilo", category: "Predmeti" },
    { word: "Knjiga", hint: "Čitati", category: "Predmeti" },
    { word: "Škola", hint: "Učenik", category: "Lokacije" },
    { word: "Cvijet", hint: "Latice", category: "Priroda" },
    { word: "Stol", hint: "Drvo", category: "Namještaj" },
    { word: "Lopta", hint: "Kotrljanje", category: "Igračke" },
    { word: "Jabuka", hint: "Crveno", category: "Hrana" },
    { word: "Vatra", hint: "Toplina", category: "Priroda" },
    { word: "More", hint: "Valovi", category: "Priroda" },
    { word: "Zvijezda", hint: "Nebo", category: "Priroda" },
    { word: "Riba", hint: "Voda", category: "Životinje" },
    { word: "Sat", hint: "Vrijeme", category: "Predmeti" },
    { word: "Drvo", hint: "Grana", category: "Priroda" },
    { word: "Kava", hint: "Šalica", category: "Hrana" },
    { word: "Telefon", hint: "Poziv", category: "Predmeti" },
    { word: "Cipele", hint: "Hodanje", category: "Odjeća" },
    { word: "Torba", hint: "Nošenje", category: "Predmeti" },
    { word: "Mlijeko", hint: "Bijelo", category: "Hrana" },
    { word: "Trava", hint: "Zeleno", category: "Priroda" },
    { word: "Kišobran", hint: "Kiša", category: "Predmeti" },
    { word: "Palačinke", hint: "Slatko", category: "Hrana" },
    { word: "Sladoled", hint: "Ledeno", category: "Hrana" },
    { word: "Kapa", hint: "Glava", category: "Odjeća" },
    { word: "Krevet", hint: "Spavanje", category: "Namještaj" },
    { word: "Prozor", hint: "Staklo", category: "Dijelovi kuće" },
    { word: "Olovka", hint: "Pisanje", category: "Školski pribor" },
    { word: "Čokolada", hint: "Slatkiš", category: "Hrana" },
    { word: "Limun", hint: "Kiselo", category: "Hrana" },
    { word: "Sendvič", hint: "Kruh", category: "Hrana" },
    { word: "Kokoš", hint: "Jaje", category: "Životinje" },
    { word: "Konj", hint: "Sedlo", category: "Životinje" },
    { word: "Slon", hint: "Surla", category: "Životinje" },
    { word: "Medvjed", hint: "Med", category: "Životinje" },
    { word: "Rijeka", hint: "Tok", category: "Priroda" },
    { word: "Planina", hint: "Vrh", category: "Priroda" },
    { word: "Kiša", hint: "Oblak", category: "Vrijeme" },
    { word: "Snijeg", hint: "Hladno", category: "Vrijeme" },
    { word: "Vjetar", hint: "Puhanje", category: "Vrijeme" },
    { word: "Bicikl", hint: "Pedale", category: "Vozila" },
    { word: "Brod", hint: "Jedro", category: "Vozila" },
    { word: "Ključ", hint: "Brava", category: "Predmeti" },
    { word: "Vrata", hint: "Kvaka", category: "Dijelovi kuće" },
    { word: "Ogledalo", hint: "Odraz", category: "Namještaj" },
    { word: "Gitara", hint: "Žice", category: "Glazba" },
    { word: "Pijesak", hint: "Plaža", category: "Priroda" },
    { word: "Čaj", hint: "Bilje", category: "Hrana" },
    { word: "Med", hint: "Pčela", category: "Hrana" },
    { word: "Sir", hint: "Rupa", category: "Hrana" },
    { word: "Krumpir", hint: "Tlo", category: "Hrana" },
    { word: "Paradajz", hint: "Umak", category: "Hrana" },
    { word: "Svijeća", hint: "Vosak", category: "Predmeti" },
    { word: "Čekić", hint: "Čavao", category: "Alati" },
    { word: "Stolica", hint: "Sjediti", category: "Namještaj" },
    { word: "Ormar", hint: "Odjeća", category: "Namještaj" },
    { word: "Čaša", hint: "Piće", category: "Posuđe" },
    { word: "Tanjur", hint: "Jelo", category: "Posuđe" },
    { word: "Nož", hint: "Rezanje", category: "Posuđe" },
    { word: "Žlica", hint: "Juha", category: "Posuđe" },
    { word: "Vilica", hint: "Bockanje", category: "Posuđe" },
    { word: "Šalica", hint: "Kava", category: "Posuđe" },
    { word: "Sapun", hint: "Pranje", category: "Higijena" },
    { word: "Ručnik", hint: "Sušenje", category: "Higijena" },
    { word: "Četkica", hint: "Zubi", category: "Higijena" },
    { word: "Češalj", hint: "Kosa", category: "Higijena" },
    { word: "Papir", hint: "Pisanje", category: "Predmeti" },
    { word: "Škare", hint: "Rezanje", category: "Predmeti" },
    { word: "Ljepilo", hint: "Spajanje", category: "Predmeti" },
    { word: "Metla", hint: "Čišćenje", category: "Predmeti" },
    { word: "Kanta", hint: "Smeće", category: "Predmeti" },
    { word: "Novčanik", hint: "Novac", category: "Predmeti" },
    { word: "Pismo", hint: "Pošta", category: "Predmeti" },
    { word: "Kutija", hint: "Spremanje", category: "Predmeti" },
    { word: "Uže", hint: "Vezanje", category: "Predmeti" },
    { word: "Igla", hint: "Šivanje", category: "Predmeti" },
    { word: "Slika", hint: "Zid", category: "Predmeti" },
    { word: "Vaza", hint: "Cvijet", category: "Predmeti" },
    { word: "Luster", hint: "Svjetlo", category: "Namještaj" },
    { word: "Jastuk", hint: "Glava", category: "Namještaj" },
    { word: "Deka", hint: "Pokrivanje", category: "Namještaj" },
    { word: "Tepih", hint: "Pod", category: "Namještaj" },
    { word: "Zavjesa", hint: "Prozor", category: "Namještaj" },
    { word: "Šator", hint: "Kamp", category: "Predmeti" },
    { word: "Karta", hint: "Put", category: "Predmeti" },
    { word: "Boca", hint: "Čep", category: "Predmeti" },
    { word: "Čavao", hint: "Zid", category: "Alati" },
    { word: "Pila", hint: "Drvo", category: "Alati" },
    { word: "Kliješta", hint: "Žica", category: "Alati" },
    { word: "Odvijač", hint: "Vijak", category: "Alati" },
    { word: "Ljestve", hint: "Visina", category: "Alati" }
  ],
  srednje: [
    { word: "Svjetionik", hint: "Obala", category: "Građevine" },
    { word: "Helikopter", hint: "Elisa", category: "Vozila" },
    { word: "Vulkan", hint: "Krater", category: "Priroda" },
    { word: "Kineski zid", hint: "Obrana", category: "Lokacije" },
    { word: "Eiffelov toranj", hint: "Pariz", category: "Lokacije" },
    { word: "Klokan", hint: "Skakanje", category: "Životinje" },
    { word: "Dupin", hint: "Peraja", category: "Životinje" },
    { word: "Pingvin", hint: "Antarktika", category: "Životinje" },
    { word: "Mikroskop", hint: "Leća", category: "Instrumenti" },
    { word: "Kompas", hint: "Sjever", category: "Predmeti" },
    { word: "Padobran", hint: "Skok", category: "Oprema" },
    { word: "Vatrogasac", hint: "Požar", category: "Zanimanja" },
    { word: "Programer", hint: "Kodiranje", category: "Zanimanja" },
    { word: "Astronaut", hint: "Svemir", category: "Zanimanja" },
    { word: "Podmornica", hint: "Dubina", category: "Vozila" },
    { word: "Termometar", hint: "Celzijus", category: "Predmeti" },
    { word: "Labirint", hint: "Prolaz", category: "Lokacije" },
    { word: "Vatromet", hint: "Nebo", category: "Predmeti" },
    { word: "Skulptura", hint: "Kamen", category: "Umjetnost" },
    { word: "Liječnik", hint: "Bolnica", category: "Zanimanja" },
    { word: "Gitara", hint: "Žice", category: "Glazbeni instrumenti" },
    { word: "Sarma", hint: "Kupus", category: "Hrana" },
    { word: "Pustinja", hint: "Pijesak", category: "Priroda" },
    { word: "Tornado", hint: "Vrtlog", category: "Priroda" },
    { word: "Bumerang", hint: "Bacanje", category: "Igračke" },
    { word: "Gramofon", hint: "Ploča", category: "Predmeti" },
    { word: "Glečer", hint: "Led", category: "Priroda" },
    { word: "Meduza", hint: "Prozirno", category: "Životinje" },
    { word: "Dvorac", hint: "Princ", category: "Lokacije" },
    { word: "Akvarij", hint: "Staklo", category: "Predmeti" },
    { word: "Dinosaur", hint: "Fosili", category: "Životinje" },
    { word: "Policajac", hint: "Značka", category: "Zanimanja" },
    { word: "Mumija", hint: "Zavoj", category: "Povijest" },
    { word: "Mikrovalna", hint: "Grijanje", category: "Kuhinja" },
    { word: "Fotograf", hint: "Objektiv", category: "Zanimanja" },
    { word: "Teleskop", hint: "Zvijezde", category: "Instrumenti" },
    { word: "Piramida", hint: "Faraon", category: "Povijest" },
    { word: "Satelit", hint: "Orbita", category: "Svemir" },
    { word: "Ronilac", hint: "Maska", category: "Sport" },
    { word: "Šah", hint: "Kralj", category: "Društvene igre" },
    { word: "Muzej", hint: "Izlošci", category: "Kultura" },
    { word: "Kazalište", hint: "Pozornica", category: "Kultura" },
    { word: "Klavir", hint: "Tipke", category: "Glazba" },
    { word: "Detektiv", hint: "Trag", category: "Zanimanja" },
    { word: "Arheolog", hint: "Lopata", category: "Zanimanja" },
    { word: "Kaktus", hint: "Trnje", category: "Priroda" },
    { word: "Kometa", hint: "Rep", category: "Svemir" },
    { word: "Akvarel", hint: "Kist", category: "Umjetnost" },
    { word: "Gondola", hint: "Kanali", category: "Lokacije" },
    { word: "Labud", hint: "Jezero", category: "Životinje" },
    { word: "Sova", hint: "Mudrost", category: "Životinje" },
    { word: "Vjetrenjača", hint: "Krila", category: "Građevine" },
    { word: "Tunel", hint: "Brdo", category: "Infrastruktura" },
    { word: "Gejzir", hint: "Para", category: "Priroda" },
    { word: "Radar", hint: "Signal", category: "Tehnologija" },
    { word: "Koralj", hint: "Greben", category: "Priroda" },
    { word: "Kompas", hint: "Igla", category: "Predmeti" },
    { word: "Komora", hint: "Tlak", category: "Tehnologija" },
    { word: "Mozaik", hint: "Pločice", category: "Umjetnost" },
    { word: "Karavan", hint: "Deva", category: "Povijest" }
  ],
  tesko: [
    { word: "Egzoskelet", hint: "Oklop", category: "Tehnologija" },
    { word: "Kriptografija", hint: "Šifra", category: "Informatika" },
    { word: "Entropija", hint: "Kaos", category: "Fizika" },
    { word: "Paradoks", hint: "Kontradikcija", category: "Filozofija" },
    { word: "Fotosinteza", hint: "Klorofil", category: "Biologija" },
    { word: "Arheologija", hint: "Iskopavanja", category: "Znanost" },
    { word: "Simbioza", hint: "Zajednica", category: "Biologija" },
    { word: "Gravitacija", hint: "Masa", category: "Fizika" },
    { word: "Alkemija", hint: "Zlato", category: "Povijest" },
    { word: "Singularnost", hint: "Točka", category: "Fizika" },
    { word: "Teleportacija", hint: "Prijenos", category: "Fikcija" },
    { word: "Genom", hint: "Geni", category: "Biologija" },
    { word: "Rezonancija", hint: "Titranje", category: "Fizika" },
    { word: "Katalizator", hint: "Ubrzanje", category: "Kemija" },
    { word: "Kibernetika", hint: "Sustav", category: "Informatika" },
    { word: "Transcedencija", hint: "Izvan", category: "Filozofija" },
    { word: "Melankolija", hint: "Tuga", category: "Psihologija" },
    { word: "Sinkronicitet", hint: "Poklapanje", category: "Psihologija" },
    { word: "Pragmatizam", hint: "Korist", category: "Filozofija" },
    { word: "Kognicija", hint: "Spoznaja", category: "Psihologija" },
    { word: "Epistemologija", hint: "Znanje", category: "Filozofija" },
    { word: "Homeostaza", hint: "Ravnoteža", category: "Biologija" },
    { word: "Metamorfoza", hint: "Promjena", category: "Biologija" },
    { word: "Mikrokozmos", hint: "Malo", category: "Filozofija" },
    { word: "Astrofizika", hint: "Svemir", category: "Znanost" },
    { word: "Egzistencijalizam", hint: "Postojanje", category: "Filozofija" },
    { word: "Semiotika", hint: "Znakovi", category: "Znanost" },
    { word: "Nanosekunda", hint: "Vrijeme", category: "Fizika" }
  ]
};

// Helper to determine the grammatical gender/agreement ending for a given base word in Croatian
function getAdjectiveEnding(baseWord: string): "i" | "a" | "o" | "e" {
  const wordLower = baseWord.toLowerCase().trim();

  // 1. Plural exceptions (Feminine plural words, or nouns ending in -e that represent plural)
  const femininePlural = ["cipele", "palačinke", "škare", "ljestve"];
  if (femininePlural.includes(wordLower)) {
    return "e";
  }

  // 2. Plural neuter exceptions
  const neuterPlural = ["vrata", "kliješta"];
  if (neuterPlural.includes(wordLower)) {
    return "a";
  }

  // 3. Masculine endings (consonants, or ending in 'o' like "auto", "sako", "tornado")
  const masculineWords = ["auto", "sako", "tornado", "bazen", "balkon", "luster", "jastuk", "tepih", "ormar", "kaput", "sladoled", "led", "grm", "čavao"];
  if (masculineWords.includes(wordLower)) {
    return "i";
  }

  // 4. Feminine singular ending in 'a' or '-ost' or 'koš' (like kokoš)
  if (wordLower.endsWith("a") || wordLower.endsWith("ost") || wordLower === "kokoš") {
    return "a";
  }

  // 5. Neuter words ending in 'o' or 'e'
  if (wordLower.endsWith("o") || wordLower.endsWith("e")) {
    return "o";
  }

  // 6. Default to masculine 'i' for consonant endings
  return "i";
}

// Declines a masculine singular adjective ending in 'i' into the correct gender ending
function declineAdjective(adj: string, ending: "i" | "a" | "o" | "e"): string {
  if (!adj.endsWith("i")) return adj;
  const stem = adj.slice(0, -1);

  if (ending === "i") {
    return adj;
  }
  if (ending === "a") {
    return stem + "a";
  }
  if (ending === "e") {
    return stem + "e";
  }
  if (ending === "o") {
    // Neuter ending is usually 'o', but if stem ends in a palatal consonant (j, lj, nj, ć, đ, š, ž, č) it's 'e'
    const palatals = ["lj", "nj", "ć", "đ", "š", "ž", "č", "j"];
    const endsWithPalatal = palatals.some(p => stem.toLowerCase().endsWith(p));
    if (endsWithPalatal) {
      return stem + "e";
    }
    return stem + "o";
  }
  return adj;
}

// Generates highly realistic, beautifully combined Croatian phrases (adjective + noun)
// to yield over 1000 unique realistic words. This avoids robotic numbering!
const expandWordDatabase = (): Record<"lagano" | "srednje" | "tesko", WordItem[]> => {
  const result: Record<"lagano" | "srednje" | "tesko", WordItem[]> = {
    lagano: [...BASE_WORDS.lagano],
    srednje: [...BASE_WORDS.srednje],
    tesko: [...BASE_WORDS.tesko]
  };

  // List of adjectives to pair with the base words
  const adjectives = [
    "Veliki", "Mali", "Brzi", "Plavi", "Zeleni", "Crveni", "Bijeli", "Crni", 
    "Divlji", "Domaći", "Stari", "Novi", "Zlatni", "Srebrni", "Čarobni", "Tajni", 
    "Skriveni", "Svemirski", "Morski", "Šumski", "Noćni", "Zimski", "Ljetni", 
    "Slatki", "Hladni", "Topli", "Planinski", "Sunčani", "Sretni", "Mudri"
  ];

  const seenWords = new Set<string>();

  // Helper to safely add uniquely combined words
  const addCombined = (difficulty: "lagano" | "srednje" | "tesko", targetCount: number) => {
    // Add existing words to seen list
    result[difficulty].forEach(item => seenWords.add(item.word.toLowerCase()));

    let adjectiveIndex = 0;
    let baseWordIndex = 0;

    const basePool = BASE_WORDS[difficulty];

    while (result[difficulty].length < targetCount) {
      const base = basePool[baseWordIndex % basePool.length];
      const adj = adjectives[adjectiveIndex % adjectives.length];

      // Formulate realistic adjective pairing based on grammar endings
      const ending = getAdjectiveEnding(base.word);
      const declinedAdj = declineAdjective(adj, ending);
      let customizedWord = `${declinedAdj} ${base.word.toLowerCase()}`;
      // Capitalize first letter of the phrase
      customizedWord = customizedWord.charAt(0).toUpperCase() + customizedWord.slice(1);

      const normalized = customizedWord.toLowerCase();
      if (!seenWords.has(normalized)) {
        seenWords.add(normalized);
        result[difficulty].push({
          word: customizedWord,
          hint: `${base.hint} (${declinedAdj.toLowerCase()})`,
          category: base.category
        });
      }

      baseWordIndex++;
      if (baseWordIndex % basePool.length === 0) {
        adjectiveIndex++;
      }

      // Safeguard break if we exhaust permutations
      if (adjectiveIndex >= adjectives.length && baseWordIndex >= basePool.length * 2) {
        break;
      }
    }
  };

  // Generate 450 easy, 450 medium, and 400 hard words (1300 distinct words!)
  addCombined("lagano", 450);
  addCombined("srednje", 450);
  addCombined("tesko", 400);

  return result;
};

export const OFFLINE_DIFFICULTY_WORDS = expandWordDatabase();
