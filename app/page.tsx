"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Play, 
  Pause, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  Timer, 
  Skull, 
  Flame, 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  Check, 
  ShieldAlert, 
  Award,
  Crown
} from "lucide-react";

interface Player {
  id: string;
  name: string;
  role: "citizen" | "impostor";
  word: string;
  hint: string;
  eliminated: boolean;
  votes: number;
}

const PRESET_PLAYER_NAMES = [
  "Ivan", "Marija", "Luka", "Ana", "Marko", "Lucija", "Mateo", "Petra"
];

interface WordItem {
  word: string;
  hint: string;
  category: string;
}

// Fallback lists of words in Croatian categorized by difficulty for offline play
const OFFLINE_DIFFICULTY_WORDS: Record<"lagano" | "srednje" | "tesko", WordItem[]> = {
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
    { word: "Čokolada", hint: "Slatkiš", category: "Hrana" }
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
    { word: "Fotograf", hint: "Objektiv", category: "Zanimanja" }
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
    { word: "Alkemija", hint: "Pretvorba", category: "Povijest" },
    { word: "Monolit", hint: "Blok", category: "Spomenici" },
    { word: "Metafora", hint: "Usporedba", category: "Književnost" },
    { word: "Proročanstvo", hint: "Budućnost", category: "Mitologija" },
    { word: "Inkubator", hint: "Toplina", category: "Medicina" },
    { word: "Halucinacija", hint: "Privid", category: "Psihologija" },
    { word: "Crna rupa", hint: "Gravitacija", category: "Svemir" },
    { word: "Hipnoza", hint: "Trans", category: "Psihologija" },
    { word: "Turbina", hint: "Oštrice", category: "Strojarstvo" },
    { word: "Oscilator", hint: "Valovi", category: "Tehnologija" },
    { word: "Nanotehnologija", hint: "Atomi", category: "Znanost" },
    { word: "Labirint uma", hint: "Misli", category: "Filozofija" },
    { word: "Ekvator", hint: "Krug", category: "Geografija" },
    { word: "Gromobran", hint: "Munja", category: "Tehnologija" },
    { word: "Atmosfera", hint: "Zrak", category: "Geografija" },
    { word: "Aura", hint: "Energija", category: "Ezoterija" },
    { word: "Kozmos", hint: "Beskonačnost", category: "Svemir" },
    { word: "Telepatija", hint: "Prijenos", category: "Parapsihologija" },
    { word: "Klaustrofobija", hint: "Zatvoreno", category: "Ljudski um" },
    { word: "Amnezija", hint: "Zaborav", category: "Ljudski um" },
    { word: "Fuzija", hint: "Reakcija", category: "Fizika" },
    { word: "Kameleon", hint: "Maskiranje", category: "Životinje" },
    { word: "Ezoterija", hint: "Tajanstveno", category: "Filozofija" },
    { word: "Arhetip", hint: "Uzorak", category: "Psihologija" },
    { word: "Plagijat", hint: "Kopija", category: "Zakon" },
    { word: "Kohezija", hint: "Spajanje", category: "Fizika" },
    { word: "Utopija", hint: "Savršenstvo", category: "Filozofija" }
  ]
};

export default function ImpostorGame() {
  // Game state
  const [players, setPlayers] = useState<Player[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameStage, setGameStage] = useState<"lobby" | "reveal" | "starter" | "play" | "voting" | "elimination" | "over">("lobby");
  
  // Game Setup variables
  const [newPlayerName, setNewPlayerName] = useState<string>("");
  const [customPlayers, setCustomPlayers] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Slučajno");
  const [customCategoryInput, setCustomCategoryInput] = useState<string>("");
  const [impostorCount, setImpostorCount] = useState<number>(1);
  const [timerSetting, setTimerSetting] = useState<number>(120); // default 2 mins in seconds
  const [difficulty, setDifficulty] = useState<"lagano" | "srednje" | "tesko">("srednje");
  const [enableImpostorHints, setEnableImpostorHints] = useState<boolean>(true);


  // Active Round variables
  const [secretWord, setSecretWord] = useState<string>("");
  const [impostorHint, setImpostorHint] = useState<string>("");
  const [actualCategory, setActualCategory] = useState<string>("");
  const [isLoadingWord, setIsLoadingWord] = useState<boolean>(false);
  const [revealIndex, setRevealIndex] = useState<number>(0);
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [starterPlayer, setStarterPlayer] = useState<string>("");
  const [timerLeft, setTimerLeft] = useState<number>(120);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  
  // Voting & Elimination variables
  const [judgedPlayerId, setJudgedPlayerId] = useState<string | null>(null);
  const [roundHistory, setRoundHistory] = useState<string[]>([]);
  const [lastEliminated, setLastEliminated] = useState<{ name: string; role: string; wasActualImpostor: boolean } | null>(null);
  
  // UI helpers
  const [rulesOpen, setRulesOpen] = useState<boolean>(false);
  const [generationSource, setGenerationSource] = useState<"AI" | "Local">("Local");

  // Audio effects synth completely removed based on user intent
  const playSoundEffect = (type: "tick" | "ping" | "reveal" | "eliminate" | "victory" | "defeat") => {
    // No-op (Silent application context)
  };

  // Keep timer working silently
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerLeft > 0 && gameStage === "play") {
      interval = setInterval(() => {
        setTimerLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setGameStage("voting");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerLeft, gameStage]);

  // Handle adding names
  const handleAddPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = newPlayerName.trim();
    if (!name) return;
    if (customPlayers.includes(name)) return;
    setCustomPlayers([...customPlayers, name]);
    setNewPlayerName("");
    playSoundEffect("ping");
  };

  const handleAddRandomPresetName = () => {
    const available = PRESET_PLAYER_NAMES.filter(n => !customPlayers.includes(n));
    if (available.length > 0) {
      const idx = Math.floor(Math.random() * available.length);
      setCustomPlayers([...customPlayers, available[idx]]);
      playSoundEffect("ping");
    }
  };

  const handleRemovePlayer = (nameToRemove: string) => {
    const updatedPlayers = customPlayers.filter(name => name !== nameToRemove);
    setCustomPlayers(updatedPlayers);
    const maxImpostors = Math.max(1, Math.floor(updatedPlayers.length / 3));
    setImpostorCount((prev) => Math.min(prev, maxImpostors));
    playSoundEffect("tick");
  };

  // Set up game elements, select roles and word via API or Offlines
  const handleStartGameSetup = async () => {
    if (customPlayers.length < 3) return;
    
    setIsLoadingWord(true);
    playSoundEffect("ping");
    
    let generatedWord = "";
    let generatedHint = "";
    let generatedCategory = "";
    let source: "AI" | "Local" = "Local";

    const targetCategory = selectedCategory === "Slobodan unos" 
      ? customCategoryInput.trim() || "Slučajno" 
      : selectedCategory;

    try {
      // API call to server-side Gemini wrapper
      const response = await fetch("/app/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: targetCategory, difficulty: difficulty }),
      });

      if (response.ok) {
        const data = await response.json();
        generatedWord = data.word;
        generatedHint = data.hint;
        generatedCategory = data.category;
        source = data.isFallback ? "Local" : "AI";
      } else {
        throw new Error("HTTP connection failed");
      }
    } catch (err) {
      console.warn("AI generation error. Reverting to local database of words safely.", err);
    }

    // In case API fails or returns empty/local fallback
    if (!generatedWord) {
      source = "Local";
      const pool = OFFLINE_DIFFICULTY_WORDS[difficulty] || OFFLINE_DIFFICULTY_WORDS.srednje;
      const item = pool[Math.floor(Math.random() * pool.length)];
      generatedWord = item.word;
      generatedHint = item.hint;
      generatedCategory = item.category || "Općenito";
    }

    setSecretWord(generatedWord);
    setImpostorHint(generatedHint);
    setActualCategory(generatedCategory);
    setGenerationSource(source);

    // Pick Impostors
    const chosenIndexes = new Set<number>();
    const actualImpostorCount = Math.min(impostorCount, Math.floor(customPlayers.length / 3) || 1);
    
    while (chosenIndexes.size < actualImpostorCount) {
      const randIdx = Math.floor(Math.random() * customPlayers.length);
      chosenIndexes.add(randIdx);
    }

    // Build Players Array
    const roundPlayers: Player[] = customPlayers.map((name, index) => {
      const isImpostor = chosenIndexes.has(index);
      return {
        id: `p-${index}-${Math.random().toString(36).substr(2, 4)}`,
        name,
        role: isImpostor ? "impostor" : "citizen",
        word: isImpostor ? "" : generatedWord,
        hint: enableImpostorHints ? generatedHint : "", // Both get the hint if enabled, otherwise empty
        eliminated: false,
        votes: 0
      };
    });

    // Select WHO starts!
    const randomStarterIndex = Math.floor(Math.random() * roundPlayers.length);
    setStarterPlayer(roundPlayers[randomStarterIndex].name);

    setPlayers(roundPlayers);
    setIsLoadingWord(false);
    setRevealIndex(0);
    setShowSecret(false);
    setGameStage("reveal");
    setTimerLeft(timerSetting);
    setIsTimerRunning(false);
  };

  // Progress through player reveals
  const handleNextReveal = () => {
    setShowSecret(false);
    playSoundEffect("tick");
    
    if (revealIndex + 1 < players.length) {
      setRevealIndex(revealIndex + 1);
    } else {
      // Completed reveal phase
      playSoundEffect("ping");
      setGameStage("starter");
    }
  };

  const handleStartGameplay = () => {
    playSoundEffect("reveal");
    setGameStage("play");
    setIsTimerRunning(true);
  };

  const handleToggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
    playSoundEffect("ping");
  };

  const handleIncrementVote = (playerId: string) => {
    setPlayers(players.map(p => p.id === playerId ? { ...p, votes: p.votes + 1 } : p));
    playSoundEffect("tick");
  };

  const handleDecrementVote = (playerId: string) => {
    setPlayers(players.map(p => {
      if (p.id === playerId) {
        return { ...p, votes: Math.max(0, p.votes - 1) };
      }
      return p;
    }));
    playSoundEffect("tick");
  };

  // Execute trial voting elimination outcome
  const handleConfirmElimination = (player: Player) => {
    // Sound & animation
    playSoundEffect("eliminate");
    
    const wasActualImpostor = player.role === "impostor";
    
    if (wasActualImpostor) {
      const updatedPlayers = players.map(p => p.id === player.id ? { ...p, eliminated: true } : p);
      setPlayers(updatedPlayers);
      
      setLastEliminated({
        name: player.name,
        role: player.role,
        wasActualImpostor: true
      });

      // Check Victory settings
      const activeCitizens = updatedPlayers.filter(p => !p.eliminated && p.role === "citizen").length;
      const activeImpostors = updatedPlayers.filter(p => !p.eliminated && p.role === "impostor").length;

      if (activeImpostors === 0) {
        // All Impostors eliminated -> Citizens victory!
        setGameStage("over");
        setTimeout(() => playSoundEffect("victory"), 600);
      } else if (activeImpostors >= activeCitizens) {
        // Impostors have hijacked the crew
        setGameStage("over");
        setTimeout(() => playSoundEffect("defeat"), 600);
      } else {
        // Directly transition back to play for the next round
        setPlayers(updatedPlayers.map(p => ({ ...p, votes: 0 })));
        setTimerLeft(timerSetting);
        setGameStage("play");
        setIsTimerRunning(true);
      }
    } else {
      // Wrong choice: Impostors win immediately! Do NOT eliminate this player.
      setLastEliminated({
        name: player.name,
        role: player.role,
        wasActualImpostor: false
      });
      
      setGameStage("over");
      setTimeout(() => playSoundEffect("defeat"), 600);
    }
  };

  const handleContinueAfterElimination = () => {
    // Clear votes, prepare next round in active play
    setPlayers(players.map(p => ({ ...p, votes: 0 })));
    setTimerLeft(timerSetting);
    setGameStage("play");
    setIsTimerRunning(true);
    playSoundEffect("ping");
  };

  // Reset lobby for brand new round
  const handleResetToLobby = () => {
    setGameStage("lobby");
    setLastEliminated(null);
    playSoundEffect("ping");
  };

  // Dynamic analysis of players
  const aliveImpostors = players.filter(p => !p.eliminated && p.role === "impostor").length;
  const aliveCitizens = players.filter(p => !p.eliminated && p.role === "citizen").length;

  return (
    <main className="min-h-screen bg-[#070000] text-red-100 flex flex-col justify-between p-3 sm:p-5 md:p-6 font-sans selection:bg-red-600 selection:text-white border-4 sm:border-8 border-[#150202] scanlines">
      {/* Top Header Panel */}
      <header className="max-w-4xl w-full mx-auto h-20 bg-gradient-to-b from-[#3a0000]/60 to-transparent flex items-center justify-between px-4 sm:px-8 border-b border-red-900/30 rounded-t-xl mb-6 shadow-[0_4px_30px_rgba(30,0,0,0.35)] backdrop-blur-xs">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center justify-center animate-pulse">
            <Skull className="w-5 h-5 text-[#0a0000]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-widest text-red-600 uppercase italic font-display">
              IMPOSTOR
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Rules Indicator */}
          <button
            onClick={() => { setRulesOpen(true); playSoundEffect("ping"); }}
            className="px-4 py-2 bg-red-950/25 border border-red-900/40 text-red-300 text-xs font-bold uppercase tracking-wider hover:bg-red-600 hover:text-black hover:border-red-500 transition-all rounded-lg cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(220,38,38,0.1)] hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] duration-200"
            id="btn-rules"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Pravila</span>
          </button>
        </div>
      </header>

      {/* Main Container Area */}
      <section className="flex-grow max-w-4xl w-full mx-auto flex flex-col justify-center py-4 bg-transparent">
        <AnimatePresence mode="wait">
          
          {/* 1. LOBBY / SETUP STAGE */}
          {gameStage === "lobby" && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 py-2">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-red-100 font-display flex items-center justify-center gap-2">
                  <Flame className="w-6 h-6 text-red-500 animate-bounce" /> Postavke terminala igre
                </h2>
                <p className="text-xs md:text-sm text-red-400/70 max-w-md mx-auto">
                  Okupite sumnjive igrače (potrebno minimalno 3), unesite imena i pokrenite proces pretrage za tajnim uljezom.
                </p>
              </div>

              {/* Grid Settings Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Left side: Players list */}
                <div className="bg-red-950/10 border border-red-900/30 p-5 rounded-2xl shadow-[0_0_25px_rgba(20,0,0,0.2)] backdrop-blur-md space-y-4">
                  <div className="flex justify-between items-center border-b border-red-900/20 pb-3">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-red-400 flex items-center gap-2">
                      <Users className="w-4 h-4 text-red-500 animate-pulse" /> Popis Igrača ({customPlayers.length})
                    </h3>
                  </div>

                  {/* Add Player Input Form */}
                  <form onSubmit={handleAddPlayer} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      className="flex-grow bg-black/60 border border-red-900/40 rounded-lg px-3.5 py-2 text-sm text-red-50 placeholder-red-905/30 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 transition-all font-mono min-w-0"
                      placeholder="Upišite ime igrača..."
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      maxLength={14}
                      id="input-player-name"
                    />
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-500 active:scale-95 text-black font-extrabold px-5 py-2 sm:py-0 rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(220,38,38,0.3)] cursor-pointer shrink-0 whitespace-nowrap"
                      id="btn-add-player"
                    >
                      <UserPlus className="w-4 h-4" /> Dodaj
                    </button>
                  </form>

                  {/* Live scrolling pill container */}
                  {customPlayers.length === 0 ? (
                    <div className="text-center py-8 text-red-700/50 text-xs border border-dashed border-red-900/20 rounded-xl bg-black/30 font-mono">
                      Nema unesenih igrača. Potrebno je upisati barem 3 igrača.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                      {customPlayers.map((name, index) => (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          key={`name-${name}-${index}`}
                          className="flex items-center justify-between p-2.5 bg-black/40 border-l-4 border-red-600 rounded-r-md hover:bg-red-950/10 transition-all border border-red-900/10"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-red-950/40 rounded-full flex items-center justify-center border border-red-900/40 text-[10px] font-bold text-red-400 font-mono">
                              {index + 1}
                            </div>
                            <span className="text-sm font-bold text-red-200">{name}</span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleRemovePlayer(name)}
                            className="text-red-900 hover:text-red-500 p-1 rounded hover:bg-red-950/20 transition-all cursor-pointer"
                            title="Ukloni igrača"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {customPlayers.length < 3 && (
                    <p className="text-[10px] text-red-500 animate-pulse italic font-mono border-t border-red-950 pt-2 flex items-center gap-1">
                      ❌ MINIMALNI STANDARDI POSADE NISU ISPUNJENI (Započnite s minimalno 3 člana).
                    </p>
                  )}
                </div>

                {/* Right side: Impostor settings and Timer settings */}
                <div className="bg-red-950/10 border border-red-900/30 p-5 rounded-2xl shadow-[0_0_25px_rgba(20,0,0,0.2)] backdrop-blur-md space-y-5">
                  {/* Impostors count selection */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold uppercase tracking-widest text-red-400">Prikriveni Impostori</span>
                      <span className="px-2.5 py-0.5 rounded-md bg-red-950/30 border border-red-600/40 text-red-400 font-extrabold font-mono">
                        {impostorCount} {impostorCount === 1 ? "ULJEZ" : "ULJEZA"}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-1">
                      {Array.from({ length: Math.max(1, Math.floor(customPlayers.length / 3)) }, (_, i) => i + 1).map((num) => {
                        const isSelected = impostorCount === num;
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => { setImpostorCount(num); playSoundEffect("ping"); }}
                            className={`flex-grow px-4 py-2.5 rounded-xl border text-center font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                              isSelected
                                ? "bg-red-650 text-black border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                                : "bg-black/50 text-red-400 border-red-955 hover:bg-red-955/20 hover:border-red-900"
                            }`}
                          >
                            {num} {num === 1 ? "Uljez" : "Uljeza"}
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-[10px] text-red-500/50 block italic leading-tight font-mono">
                      *Maksimalne proporcije: 1 uljez na svaka 3 člana kako bi se očuvao balans posade.
                    </span>
                  </div>

                  {/* Game Difficulty selection */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold uppercase tracking-widest text-red-400">Težina igre</span>
                      <span className="px-2.5 py-0.5 rounded bg-black/50 border border-red-910/20 text-red-300 font-mono tracking-wider font-extrabold text-[11px] uppercase">
                        {difficulty === "lagano" ? "Lagano" : difficulty === "srednje" ? "Srednje" : "Teško"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(["lagano", "srednje", "tesko"] as const).map((level) => {
                        const isSelected = difficulty === level;
                        const label = level === "lagano" ? "Lagano" : level === "srednje" ? "Srednje" : "Teško";
                        const desc = level === "lagano" ? "Jednostavno" : level === "srednje" ? "Standardno" : "Zbunjujuće";
                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() => { setDifficulty(level); playSoundEffect("ping"); }}
                            className={`py-2 rounded-xl text-center border font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                              isSelected 
                                ? "bg-red-600 text-black border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.35)] font-black" 
                                : "bg-black/60 text-red-400 border-red-955/45 hover:bg-red-955/10 hover:text-red-300 font-bold"
                            }`}
                          >
                            <span className="text-xs uppercase tracking-wider">{label}</span>
                            <span className={`text-[8px] font-mono tracking-wider uppercase opacity-80 ${isSelected ? "text-red-950 font-black" : "text-red-400/40 font-bold"}`}>{desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Toggle Impostor Hints */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold uppercase tracking-widest text-red-400">Tragovi (Hintovi) za Impostora</span>
                      <span className={`px-2.5 py-0.5 rounded border text-xs font-mono tracking-wider font-extrabold ${enableImpostorHints ? "bg-red-950/30 border-red-650 text-red-400" : "bg-black/50 border-red-955 text-red-700/60"}`}>
                        {enableImpostorHints ? "UKLJUČENO" : "ISKLJUČENO"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => { setEnableImpostorHints(true); playSoundEffect("ping"); }}
                        className={`py-2 rounded-xl text-center border font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                          enableImpostorHints 
                            ? "bg-red-650 text-black border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.35)] font-black" 
                            : "bg-black/60 text-red-400 border-red-955/45 hover:bg-red-955/10 hover:text-red-300 font-bold"
                        }`}
                      >
                        Uključi tragove
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEnableImpostorHints(false); playSoundEffect("ping"); }}
                        className={`py-2 rounded-xl text-center border font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                          !enableImpostorHints 
                            ? "bg-red-650 text-black border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.35)] font-black" 
                            : "bg-black/60 text-red-400 border-red-955/45 hover:bg-red-955/10 hover:text-red-300 font-bold"
                        }`}
                      >
                        Isključi tragove
                      </button>
                    </div>
                    <span className="text-[10px] text-red-500/50 block italic leading-tight font-mono">
                      *Impostor dobiva opći trag/hint o riječi (npr. &quot;Tijesto&quot; za Pizzu) ako je uključeno, inače igra naslijepo bez ikakvih tragova.
                    </span>
                  </div>

                  {/* Timer settings selection */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold uppercase tracking-widest text-red-400">Tajmer Rasprave</span>
                      <span className="px-2.5 py-0.5 rounded bg-black/50 border border-red-950 text-red-300 font-mono tracking-wider font-extrabold text-[11px]">
                        {timerSetting === 0 ? "Bez limita" : `${Math.floor(timerSetting / 60)}m ${timerSetting % 60}s`}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[30, 60, 120, 180, 300].map((sec) => {
                        return (
                          <button
                            key={sec}
                            type="button"
                            onClick={() => { setTimerSetting(sec); playSoundEffect("tick"); }}
                            className={`py-1.5 rounded text-center text-[10px] border font-mono tracking-tighter font-extrabold transition-all cursor-pointer ${
                              timerSetting === sec 
                                ? "bg-red-900/30 text-red-300 border-red-600/70 shadow-[0_0_10px_rgba(220,38,38,0.2)]" 
                                : "bg-black/60 text-red-900/40 border-red-955/45 hover:bg-red-955/10 hover:text-red-400"
                            }`}
                          >
                            {sec < 60 ? `${sec}s` : `${sec / 60}m`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Trigger Button */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleStartGameSetup}
                  disabled={customPlayers.length < 3 || isLoadingWord}
                  className="w-full md:w-80 mx-auto bg-red-600 hover:bg-red-500 disabled:bg-red-950/20 disabled:text-red-900/40 disabled:border-red-950/40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 text-black font-black tracking-widest text-base shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-500 py-4 px-8 rounded-xl transition-all uppercase flex items-center justify-center gap-2 anim-glow-pulse cursor-pointer"
                  id="btn-play-game"
                >
                  {isLoadingWord ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Generator inicijalizira...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current text-black" />
                      <span>Pokreni Igru!</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* 2. REVEAL STAGE (Podjela uloga) */}
          {gameStage === "reveal" && players.length > 0 && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full mx-auto text-center space-y-6"
            >
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-widest text-red-500 font-extrabold flex items-center justify-center gap-1.5 font-mono">
                  Podjela Uloga ({revealIndex + 1} od {players.length})
                </div>
                <h3 className="text-sm text-red-400/50 uppercase tracking-widest">Predaj uređaj igraču:</h3>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-widest uppercase font-display text-glitch">
                  {players[revealIndex].name}
                </h2>
              </div>

              {/* Main secret card interactive mockup */}
              <div className="relative min-h-80 w-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {!showSecret ? (
                    <motion.button
                      key="hidden-card"
                      initial={{ opacity: 0, rotateY: 180 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      exit={{ opacity: 0, rotateY: -180 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => { setShowSecret(true); playSoundEffect("reveal"); }}
                      className="w-full h-80 bg-gradient-to-br from-[#120000] via-[#050000] to-red-950/25 border-2 border-red-905/30 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-red-500 transition-all group hover:shadow-[0_0_25px_rgba(220,38,38,0.25)] relative overflow-hidden"
                      id="card-hidden"
                    >
                      <div className="w-16 h-16 rounded-full bg-red-900/20 border border-red-600/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-all">
                        <EyeOff className="w-8 h-8 text-red-500 animate-pulse" />
                      </div>
                      <h4 className="text-base font-bold uppercase tracking-wider text-red-200 font-display">Klikni za otkrivanje uloge</h4>
                      <p className="text-xs text-red-400/50 mt-2 max-w-[240px] font-mono uppercase tracking-wider text-[10px]">
                        Osigurajte potpunu tajnost prije pritiska tipke za otkrivanje!
                      </p>
                    </motion.button>
                  ) : (
                    <motion.div
                      key="revealed-card"
                      initial={{ opacity: 0, rotateY: -180 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      exit={{ opacity: 0, rotateY: 180 }}
                      transition={{ duration: 0.25 }}
                      className={`w-full min-h-80 rounded-2xl p-6 flex flex-col justify-between border-2 shadow-2xl relative overflow-hidden ${
                        players[revealIndex].role === "impostor"
                          ? "bg-gradient-to-br from-[#300000] via-[#080000] to-black border-red-600 shadow-[0_0_35px_rgba(220,38,38,0.35)]"
                          : "bg-gradient-to-br from-[#120000] via-[#050000] to-black border-red-900/50 shadow-[0_0_20px_rgba(220,38,38,0.15)]"
                      }`}
                      id="card-revealed"
                    >
                      {/* Decorative elements */}
                      <div className="absolute top-2 right-2 opacity-5">
                        <Skull className="w-32 h-32 text-red-500" />
                      </div>

                      <div className="space-y-4 pt-4 text-center">
                        <span className="text-[10px] px-2.5 py-1 rounded border uppercase tracking-widest font-bold bg-[#0c0000]/90 text-red-400 border-red-900/40 font-mono inline-block">
                          POVJERLJIVA ULOGA
                        </span>

                        {players[revealIndex].role === "impostor" ? (
                          <div className="space-y-3">
                            <h3 className="text-3xl font-black text-red-500 tracking-widest animate-pulse uppercase font-display text-glitch">
                              🚨 IMPOSTOR
                            </h3>
                            <div className="bg-red-950/40 rounded-lg p-3 border border-red-600/30 max-w-xs mx-auto">
                              <p className="text-xs text-red-200 font-mono">
                                Ti si pritajeni uljez! Ne znaš tajnu riječ. Tvoj cilj je stopiti se i pretvarati se.
                              </p>
                            </div>
                            
                            {players[revealIndex].hint && (
                              <div className="space-y-1 pt-2">
                                <span className="text-[10px] text-red-400/60 uppercase tracking-widest block font-mono">Trag iz baze Crimson Protocol</span>
                                <p className="text-lg font-bold text-white uppercase tracking-wider px-4 py-1.5 bg-red-950/60 rounded inline-block border border-red-600/30 min-w-[200px] font-mono">
                                  {players[revealIndex].hint}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <h3 className="text-3xl font-black text-red-400 tracking-widest uppercase font-display">
                              👩‍🌾 GRAĐANIN
                            </h3>
                            <div className="bg-red-950/10 rounded-lg p-3 border border-red-900/30 max-w-xs mx-auto">
                              <p className="text-xs text-red-350/80 font-mono">
                                Ti si pošteni građanin posade! Opiši riječ oprezno i prokušaj tko je uljez.
                              </p>
                            </div>

                            <div className="space-y-1 pt-2">
                              <span className="text-[10px] text-red-400/60 uppercase tracking-widest block font-mono">Tvoja tajna riječ je</span>
                              <p className="text-2xl font-black text-red-500 uppercase tracking-widest px-5 py-2.5 bg-black/80 rounded inline-block border border-red-900/40 hover:border-red-500 transition-all animate-fade-in shadow-[inset_0_0_10px_rgba(220,38,38,0.2)] font-mono">
                                {players[revealIndex].word}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-6 w-full">
                        <button
                          type="button"
                          onClick={handleNextReveal}
                          className="w-full bg-red-600 hover:bg-red-500 active:scale-95 text-black font-black uppercase tracking-widest py-3 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(220,38,38,0.3)] cursor-pointer"
                          id="btn-hide-and-continue"
                        >
                          <span>Spremi i nastavi dalje</span>
                          <ArrowRight className="w-4 h-4 text-black" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* 3. STARTER PLAYER STAGE */}
          {gameStage === "starter" && (
            <motion.div
              key="starter"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full mx-auto text-center space-y-6 bg-red-950/10 border border-red-900/40 p-6 rounded-2xl shadow-[0_0_25px_rgba(220,38,38,0.15)] backdrop-blur-md"
            >
              <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center mx-auto mb-2 animate-bounce">
                <Crown className="w-9 h-9 text-red-500" />
              </div>

              <div className="space-y-2">
                <h3 className="text-red-400/50 text-[10px] font-bold uppercase tracking-widest font-mono">Sustav je odabrao</h3>
                <p className="text-2xl font-black text-white tracking-widest uppercase font-display">Prvi Potez Opisa</p>
                <p className="text-xs text-red-400/70">Ova osoba mora započeti davanje svog jednorječnog opisa!</p>
              </div>

              <div className="p-4 bg-black/60 border border-red-900/30 rounded-xl max-w-sm mx-auto shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
                <span className="text-[10px] uppercase font-bold tracking-widest text-red-500/60 block font-mono">Potez kretanja kreće od</span>
                <span className="text-2xl font-black tracking-widest text-red-500 block mt-1 uppercase font-display text-glitch">
                  👑 {starterPlayer}
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-[11px] text-red-400/50 leading-relaxed text-left mx-auto max-w-xs font-mono">
                  👉 **Pravila Opisa:** Svi daju točno **jednu riječ** u krugu. Ne smijete direktno reći pojam ni dati previše laganu poveznicu!
                </p>
              </div>

              <button
                type="button"
                onClick={handleStartGameplay}
                className="w-full bg-red-650 hover:bg-red-550 active:scale-95 text-black font-black tracking-widest text-xs py-4 rounded-xl transition-all uppercase flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(220,38,38,0.3)] cursor-pointer"
                id="btn-starter-go"
              >
                <span>Započni Raspravu!</span>
                <Play className="w-4 h-4 fill-current text-black" />
              </button>
            </motion.div>
          )}

          {/* 4. MAIN PLAYSTAGE (Rasprava & Timer) */}
          {gameStage === "play" && (
            <motion.div
              key="play"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Header Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-red-950/10 border border-red-900/30 p-4 rounded-xl shadow-md backdrop-blur-md">
                <div className="space-y-0.5">
                  <div className="text-xs text-red-500 font-semibold flex items-center gap-1.5 pt-1 font-mono uppercase tracking-wider">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span>Aktivna pretraga pokrenuta</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-red-400/50 uppercase tracking-widest text-[10px]">Preostali Impostor(i):</span>
                  <span className="font-extrabold text-sm text-red-500 bg-red-950/40 border border-red-900/60 px-2.5 py-0.5 rounded">
                    💀 {aliveImpostors}
                  </span>
                </div>
              </div>

              {/* Centered suspense Layout: Timer & Starter reminder & Go to Vote */}
              <div className="max-w-md mx-auto bg-red-950/15 border border-red-900/35 p-6 rounded-2xl space-y-6 shadow-xl text-center backdrop-blur-md">
                <h3 className="font-bold text-xs uppercase tracking-widest text-red-400 flex items-center justify-center gap-1 font-mono">
                  <Timer className="w-4 h-4 text-red-500 animate-pulse" /> Vrijeme za raspravu
                </h3>

                {/* Circular visual representation of seconds */}
                <div className="relative w-36 h-36 mx-auto flex flex-col items-center justify-center rounded-full border-4 border-red-955 bg-black/50 shadow-inner">
                  {/* Glowing outer boundary if danger */}
                  <div className={`absolute inset-0 rounded-full border-2 animate-pulse ${timerLeft <= 15 ? 'border-red-650 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'border-red-955/20'}`}></div>
                  
                  <span className={`text-4xl font-black font-mono tracking-tighter ${timerLeft <= 15 ? 'text-red-500 animate-bounce' : 'text-red-200'}`}>
                    {Math.floor(timerLeft / 60)}:{(timerLeft % 60).toString().padStart(2, "0")}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-red-500/50 mt-1 font-mono">ostalo sekundi</span>
                </div>

                {/* Timer Controls action bar */}
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleTimer}
                    className={`flex-grow px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isTimerRunning 
                        ? "bg-amber-600/20 hover:bg-amber-600/35 text-amber-400 border border-amber-900/50" 
                        : "bg-red-600 hover:bg-red-550 text-black shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                    }`}
                    id="btn-timer-toggle"
                  >
                    {isTimerRunning ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pauziraj</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Nastavi</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => { setTimerLeft(timerSetting); playSoundEffect("ping"); }}
                    className="p-2 aspect-square rounded-lg bg-black/40 border border-red-950 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                    title="Resetiraj timer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-[11px] text-red-400/50 bg-black/60 border border-red-950 px-3 py-2.5 rounded-lg text-left font-mono">
                  <span className="font-extrabold text-red-300 block mb-0.5 uppercase tracking-wider text-[10px]">ℹ️ Prvi je krenuo:</span>
                  <span className="text-red-400 font-bold block tracking-wider uppercase">{starterPlayer}</span>
                  <p className="mt-1 leading-tight text-[10px] text-red-400/40">
                    Svi daju jedan opis u smjeru kretanja. Zatim slobodno raspravljajte i glasajte!
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => { setGameStage("voting"); playSoundEffect("ping"); }}
                    className="w-full bg-red-650 hover:bg-red-550 active:scale-95 text-black font-black tracking-widest text-xs py-3.5 rounded-xl transition-all uppercase flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(220,38,38,0.3)] cursor-pointer"
                    id="btn-goto-voting"
                  >
                    <span>Završi raspravu i glasaj!</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 5. VOTING AND NOMINATION STAGE */}
          {gameStage === "voting" && (
            <motion.div
              key="voting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6 max-w-2xl w-full mx-auto"
            >
              <div className="text-center space-y-2">
                <span className="bg-red-950/40 border border-red-900/60 text-red-400 text-[10px] px-2.5 py-1 rounded font-extrabold uppercase tracking-widest font-mono">
                  Faza optužbe i glasanja
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-widest uppercase font-display text-glitch">KOGA IZBACUJETE?</h2>
                <p className="text-xs text-red-400/60 max-w-sm mx-auto leading-relaxed font-mono">
                  Raspravite tko je dao najsumnjivije opise ili pokazao zbunjenost. Odaberite sumnjivog igrača za kojeg sumnjate da je Impostor i potvrdite eliminaciju!
                </p>
              </div>

              <div className="bg-red-950/10 border border-red-900/30 p-5 rounded-xl space-y-4 shadow-xl backdrop-blur-md">
                <span className="text-xs font-bold uppercase tracking-widest text-red-400 block border-b border-red-900/20 pb-2 font-mono">
                  Odaberite sumnjivog člana posade:
                </span>

                <div className="space-y-2">
                  {players.filter(p => !p.eliminated).map((player) => (
                    <div 
                      key={player.id}
                      className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border transition-all font-mono ${
                        judgedPlayerId === player.id 
                          ? "bg-red-900/25 border-red-650 shadow-[0_0_15px_rgba(220,38,38,0.2)]" 
                          : "bg-black/40 border-red-950 hover:border-red-900/40"
                      }`}
                    >
                      {/* Name area */}
                      <div className="flex items-center gap-3 w-full cursor-pointer" onClick={() => { setJudgedPlayerId(player.id); playSoundEffect("ping"); }}>
                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                            judgedPlayerId === player.id 
                              ? "bg-red-600 border-red-500 text-black shadow-[0_0_10px_rgba(220,38,38,0.5)]" 
                              : "border-red-900/40 bg-black hover:border-red-500 text-transparent"
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-[3px]" />
                        </div>
                        
                        <div>
                          <span className="font-bold text-sm text-red-100 block">{player.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Confirm Elimination Actions */}
                <div className="pt-4 border-t border-red-900/20 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => { setGameStage("play"); setIsTimerRunning(true); playSoundEffect("ping"); }}
                    className="text-xs font-semibold text-red-400 hover:text-red-250 bg-red-950/20 px-4 py-2.5 rounded-lg border border-red-900/40 cursor-pointer"
                    id="btn-back-to-play"
                  >
                    Natrag na raspravu
                  </button>

                  <button
                    type="button"
                    disabled={!judgedPlayerId}
                    onClick={() => {
                      const selected = players.find(p => p.id === judgedPlayerId);
                      if (selected) handleConfirmElimination(selected);
                    }}
                    className={`px-6 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all flex items-center gap-1.5 shadow-lg ${
                      judgedPlayerId 
                        ? "bg-red-650 hover:bg-red-550 hover:scale-[1.02] active:scale-95 text-black shadow-[0_0_15px_rgba(220,38,38,0.3)] cursor-pointer" 
                        : "bg-red-950/20 text-red-900/40 border-red-950/40 border cursor-not-allowed"
                    }`}
                    id="btn-eliminate-player"
                  >
                    <span>Potvrdi glas</span>
                    <Check className="w-4 h-4 stroke-[3px]" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 6. CONSTITUENCY REVEAL / ELIMINATION CONSEQUENCE STAGE */}
          {gameStage === "elimination" && lastEliminated && (
            <motion.div
              key="elimination_reveal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full mx-auto text-center space-y-6 bg-red-950/10 border-2 border-red-650 p-6 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-md"
            >
              {/* Suspense red radar lines */}
              <div className="absolute inset-x-0 top-0 h-1 bg-red-600 animate-pulse"></div>

              <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center mx-auto mb-2 animate-pulse">
                <ShieldAlert className="w-8 h-8 text-red-500" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-red-500/60 block font-mono">POSLJEDICA GLASANJA</span>
                <p className="text-lg font-mono text-red-400">Izbačen je igrač</p>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-widest uppercase font-display text-glitch">
                  ⚡ {lastEliminated.name}
                </h3>
              </div>

              <div className="p-4 bg-black/60 border border-red-900/30 rounded-xl shadow-inner max-w-sm mx-auto space-y-2">
                <span className="text-xs text-red-400/50 block uppercase font-bold font-mono">Njegova je stvarna uloga bila</span>
                
                {lastEliminated.wasActualImpostor ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-1"
                  >
                    <span className="text-2xl font-black bg-red-600 text-black inline-block px-4 py-1.5 rounded uppercase tracking-widest shadow shadow-red-500 animate-pulse font-display">
                      🚨 IMPOSTOR!
                    </span>
                    <p className="text-xs text-red-400 pt-1 font-mono">
                      Uspješno! Posada građana je uklonila jednog opasnog uljeza.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-1"
                  >
                    <span className="text-2xl font-black bg-red-950/60 text-red-450 inline-block px-4 py-1.5 rounded uppercase tracking-wider border border-red-900 font-mono">
                      🧑‍🌾 GRAĐANIN
                    </span>
                    <p className="text-xs text-red-400/40 pt-1 font-mono">
                      Greška! Nedužan građanin je proganjan i izbačen iz sustava.
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="pt-2">
                <p className="text-xs text-red-400/60 font-mono text-[11px]">
                  Preostalo: **{aliveCitizens} građana** i **{aliveImpostors} uljeza ({aliveImpostors === 1 ? "Impostor" : "Impostora"})**.
                </p>
              </div>

              <button
                type="button"
                onClick={handleContinueAfterElimination}
                className="w-full bg-red-600 hover:bg-red-500 active:scale-95 text-black font-black tracking-widest text-xs py-4 rounded-xl transition-all uppercase flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(220,38,38,0.3)] cursor-pointer"
                id="btn-continue-elimination"
              >
                <span>Nastavi Igru</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </motion.div>
          )}

          {/* 7. GAME OVER STAGE */}
          {gameStage === "over" && (
            <motion.div
              key="over"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 max-w-xl w-full mx-auto"
            >
              {/* Dynamic Victory Header Cards based on outcome */}
              {aliveImpostors === 0 ? (
                <div className="bg-red-950/15 border-2 border-red-650 p-6 rounded-2xl shadow-[0_0_25px_rgba(220,38,38,0.2)] text-center space-y-4 backdrop-blur-md">
                  <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center mx-auto mb-2 animate-bounce">
                    <Award className="w-10 h-10 text-red-500" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] tracking-widest uppercase text-red-500 font-extrabold bg-red-950/45 px-3 py-1 rounded inline-block font-mono">
                      Kraj Igre - Građani pobjeđuju!
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest font-display text-glitch">GRAĐANI SU DOKRAJČILI ULJEZE</h2>
                  </div>
                  <p className="text-xs text-red-400/50 max-w-sm mx-auto leading-relaxed font-mono">
                    Svi Impostori su uspješno otkriveni i izbačeni iz igre. Mir i poštenje su ponovno zavladali u igri!
                  </p>
                </div>
              ) : (
                <div className="bg-[#0e0000] border-2 border-red-500 p-6 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)] text-center space-y-4 backdrop-blur-md">
                  <div className="w-16 h-16 rounded-full bg-red-900/10 border border-red-500 flex items-center justify-center mx-auto mb-2 animate-pulse">
                    <Skull className="w-9 h-9 text-red-500" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] tracking-widest uppercase text-white font-extrabold bg-red-600 px-3 py-1 rounded inline-block animate-pulse font-mono tracking-wider animate-pulse">
                      Kraj Igre - Impostori pobjeđuju!
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-red-500 uppercase tracking-widest font-display text-glitch">IMPOSTORI SU PREUZELI KONTROLU!</h2>
                  </div>
                  <p className="text-xs text-red-350 max-w-sm mx-auto leading-relaxed font-mono">
                    Uljezi su nadmudrili građane. Broj građana je pao na ili ispod razine impostora!
                  </p>
                </div>
              )}

              {/* Secret breakdown results card */}
              <div className="bg-red-950/10 border border-red-900/30 p-5 rounded-xl space-y-4 shadow-xl backdrop-blur-md">
                <div className="border-b border-red-900/35 pb-2 flex justify-between items-center text-xs font-mono">
                  <span className="font-extrabold text-red-400 uppercase tracking-widest text-[10px]">Konačni Pregled Igrača</span>
                  <span className="text-red-400/50">Tajna riječ: <strong className="text-red-500 uppercase font-bold tracking-widest bg-red-950/60 px-2.5 py-0.5 rounded border border-red-900/30">{secretWord}</strong></span>
                </div>

                <div className="space-y-2">
                  {players.map((p) => {
                    return (
                      <div 
                        key={p.id}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                          p.role === "impostor"
                            ? "bg-red-950/20 border-red-900/60 shadow-[inset_0_0_10px_rgba(220,38,38,0.05)]"
                            : "bg-black/40 border-red-955"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-sm text-red-100">{p.name}</span>
                          {p.eliminated && <span className="text-[9px] text-red-500/45 inline-block bg-red-950/30 px-1.5 py-0.5 rounded border border-red-950/50">(Eliminiran)</span>}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black ${
                            p.role === "impostor"
                              ? "bg-red-600 text-black font-display tracking-wider"
                              : "bg-red-950/60 text-red-450 border border-red-900/40"
                          }`}>
                            {p.role === "impostor" ? (p.hint ? `Impostor (Trag: ${p.hint})` : `Impostor`) : `Građanin`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center font-mono">
                  <button
                    type="button"
                    onClick={handleStartGameSetup}
                    className="flex-grow bg-red-600 hover:bg-red-500 active:scale-95 text-black font-black tracking-widest text-xs py-3.5 rounded-xl transition-all uppercase flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(220,38,38,0.2)] cursor-pointer"
                    id="btn-play-again"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Igraj Ponovno (Iste Postavke)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToLobby}
                    className="flex-grow sm:flex-none hover:bg-red-950/30 text-red-400 hover:text-red-350 font-bold text-xs py-3.5 px-5 rounded-xl border border-red-900/40 transition-all uppercase cursor-pointer"
                    id="btn-lobby"
                  >
                    Početne postavke
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </section>

      {/* Rules overlay screen modal */}
      <AnimatePresence>
        {rulesOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-black/95 border border-red-650 p-5 md:p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-[0_0_50px_rgba(220,38,38,0.255)] relative font-sans"
            >
              <div className="border-b border-red-950 pb-3">
                <h3 className="text-xl font-black text-red-500 tracking-wider uppercase flex items-center gap-2 font-display">
                  <HelpCircle className="w-5 h-5 animate-pulse" /> Kako se igra Impostor?
                </h3>
              </div>

              <div className="space-y-3 text-xs text-red-300/80 leading-relaxed max-h-[350px] overflow-y-auto pr-2 font-mono scrollbar-custom">
                <div className="space-y-1">
                  <span className="font-extrabold text-red-200 text-sm block font-sans">1. Postavljanje igrača</span>
                  <p>
                    Igru igra najmanje **3 igrača**. Prije početka, u postavkama unesite imena svih prisutnih igrača, odaberite broj uljeza (Impostora) te željeni tajmer za raspravu.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-extrabold text-red-200 text-sm block font-sans">2. Podjela i tajnost uloga</span>
                  <p>
                    Igrači prenose uređaj jedni drugima. Svaki igrač potajno pritisne tipku na kartici kako bi vidio svoju ulogu. 
                    Normalni **Građani** dobivaju tajnu riječ (npr. *Pizza*), dok **Impostori** ne dobivaju riječ nego samo saznaju da su uljezi te dobivaju opći trag/hint (npr. *Talijanska hrana*).
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-extrabold text-red-200 text-sm block font-sans">3. Krug opisa</span>
                  <p>
                    Aplikacija odabire od kojeg igrača kreće krug. Igrači u smjeru kazaljke na satu govore **točno jednu riječ** kojom opisuju svoj pojam.
                    **Građani** moraju reći riječ dovoljno specifičnu da drugi građani shvate da znaju pojam, ali dovoljno neodređenu da Impostor ne shvati točnu tajnu riječ.
                    **Impostor** mora mudro slušati druge opise, iskoristiti svoj trag i reći riječ kako se ne bi istaknuo kao netko tko nema pojma!
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-extrabold text-red-200 text-sm block font-sans">4. Rasprava i glasanje</span>
                  <p>
                    Nakon što svi daju svoj opis, započinje rasprava s timerom. Igrači raspravljaju tko je sumnjiv. Zatim se glasa o tome tko se proglašava uljezom. Igrač koji dobije najviše glasova se eliminira, a aplikacija otkriva njegovu stvarnu ulogu!
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-extrabold text-red-200 text-sm block font-sans">5. Uvjeti pobjede</span>
                  <p>
                    🏁 **Građani pobjeđuju** ako uspješno identificiraju i eliminiraju sve Impostore na stolu.
                    🏁 **Impostori pobjeđuju** ako uspiju preživjeti tako da broj preostalih građana padne na ili ispod broja impostora.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-red-950 text-center font-mono">
                <button
                  type="button"
                  onClick={() => { setRulesOpen(false); playSoundEffect("ping"); }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-red-650 hover:bg-red-500 text-black font-black tracking-widest text-xs rounded-xl uppercase transition-all cursor-pointer shadow-[0_0_10px_rgba(220,38,38,0.2)]"
                  id="btn-close-rules"
                >
                  Zatvori Pravila
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </main>
  );
}
