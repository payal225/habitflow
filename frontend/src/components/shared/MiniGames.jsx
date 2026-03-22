import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Confetti from "./Confetti";

const MiniGames = ({ habits }) => {
  const [coins, setCoins] = useState(0);
  const [activeGame, setActiveGame] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // ── Habit Quiz State ──────────────────────────
  const [quizQ, setQuizQ] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(null);

  // ── Memory Game State ─────────────────────────
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [memoryWon, setMemoryWon] = useState(false);

  // ── Reaction Game State ───────────────────────
  const [reactionState, setReactionState] = useState("idle");
  const [reactionTime, setReactionTime] = useState(null);
  const [bestReaction, setBestReaction] = useState(null);
  const reactionTimer = useRef(null);
  const reactionStart = useRef(null);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem("ht_coins") || "0");
    const best = localStorage.getItem("ht_best_reaction");
    setCoins(stored);
    if (best) setBestReaction(parseInt(best));
  }, []);

  const addCoins = (amount) => {
    const newCoins = coins + amount;
    setCoins(newCoins);
    localStorage.setItem("ht_coins", newCoins.toString());
    toast.success(`+${amount} coins! 🪙`);
  };

  // ── QUIZ GAME ─────────────────────────────────
  const QUIZ_QUESTIONS = [
    { q: "How many days does it take to form a habit?", options: ["7 days", "21 days", "66 days", "100 days"], answer: 2 },
    { q: "What is the best time to start a new habit?", options: ["Evening", "Morning", "Afternoon", "Midnight"], answer: 1 },
    { q: "What helps maintain habit streaks?", options: ["Willpower only", "Tracking & accountability", "Luck", "Motivation"], answer: 1 },
    { q: "What is habit stacking?", options: ["Doing many habits at once", "Linking new habits to existing ones", "Stacking books", "None of above"], answer: 1 },
    { q: "Which is NOT a good habit tracking strategy?", options: ["Daily check-ins", "Streak tracking", "Skipping 2 days in a row", "Rewards system"], answer: 2 },
  ];

  const handleQuizAnswer = (idx) => {
    if (quizAnswered !== null) return;
    setQuizAnswered(idx);
    const correct = idx === QUIZ_QUESTIONS[quizQ].answer;
    if (correct) {
      setQuizScore(s => s + 1);
      toast.success("Correct! ✅");
    } else {
      toast.error("Wrong! ❌");
    }
    setTimeout(() => {
      if (quizQ < QUIZ_QUESTIONS.length - 1) {
        setQuizQ(q => q + 1);
        setQuizAnswered(null);
      } else {
        setQuizDone(true);
        const earned = (quizScore + (correct ? 1 : 0)) * 10;
        addCoins(earned);
        if (quizScore + (correct ? 1 : 0) === QUIZ_QUESTIONS.length) setShowConfetti(true);
      }
    }, 1000);
  };

  const resetQuiz = () => { setQuizQ(0); setQuizScore(0); setQuizDone(false); setQuizAnswered(null); };

  // ── MEMORY GAME ───────────────────────────────
  const EMOJIS = ["🌱", "🔥", "⭐", "💪", "🎯", "🏆", "📚", "🧘"];

  const initMemory = () => {
    const doubled = [...EMOJIS, ...EMOJIS];
    const shuffled = doubled.sort(() => Math.random() - 0.5).map((e, i) => ({ id: i, emoji: e }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setMemoryWon(false);
  };

  const handleCardFlip = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped;
      if (cards[a].emoji === cards[b].emoji) {
        const newMatched = [...matched, a, b];
        setMatched(newMatched);
        setFlipped([]);
        if (newMatched.length === cards.length) {
          setMemoryWon(true);
          const earned = Math.max(50 - moves * 2, 10);
          addCoins(earned);
          setShowConfetti(true);
        }
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  // ── REACTION GAME ─────────────────────────────
  const startReaction = () => {
    setReactionState("waiting");
    setReactionTime(null);
    const delay = 2000 + Math.random() * 3000;
    reactionTimer.current = setTimeout(() => {
      setReactionState("go");
      reactionStart.current = Date.now();
    }, delay);
  };

  const handleReactionClick = () => {
    if (reactionState === "waiting") {
      clearTimeout(reactionTimer.current);
      setReactionState("early");
      return;
    }
    if (reactionState === "go") {
      const time = Date.now() - reactionStart.current;
      setReactionTime(time);
      setReactionState("result");
      if (!bestReaction || time < bestReaction) {
        setBestReaction(time);
        localStorage.setItem("ht_best_reaction", time.toString());
      }
      const earned = time < 300 ? 30 : time < 500 ? 20 : 10;
      addCoins(earned);
    }
  };

  const GAMES = [
    { id: "quiz", name: "Habit Quiz", icon: "🧠", desc: "Test your habit knowledge", coins: "10-50", color: "#8b5cf6" },
    { id: "memory", name: "Memory Match", icon: "🎴", desc: "Match habit emoji pairs", coins: "10-50", color: "#3b82f6" },
    { id: "reaction", name: "Reaction Test", icon: "⚡", desc: "Test your reaction speed", coins: "10-30", color: "#f97316" },
  ];

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "20px" }}>
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>🎮 Mini Games</h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Earn coins by playing games!</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "100px", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
          <span style={{ fontSize: "18px" }}>🪙</span>
          <span style={{ fontSize: "18px", fontWeight: 800, color: "#fbbf24", fontFamily: "Syne, sans-serif" }}>{coins}</span>
        </div>
      </div>

      {/* Game selector */}
      {!activeGame && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {GAMES.map(game => (
            <button key={game.id} onClick={() => { setActiveGame(game.id); if (game.id === "memory") initMemory(); if (game.id === "quiz") resetQuiz(); }}
              style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px", borderRadius: "16px", border: `1px solid ${game.color}25`, background: `${game.color}08`, cursor: "pointer", transition: "all 0.3s", textAlign: "left" }}
              onMouseEnter={e => { e.currentTarget.style.background = `${game.color}15`; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${game.color}08`; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: `${game.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>{game.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "3px" }}>{game.name}</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{game.desc}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#fbbf24" }}>🪙 {game.coins}</p>
                <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>coins</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Back button */}
      {activeGame && (
        <button onClick={() => setActiveGame(null)} style={{ marginBottom: "16px", padding: "7px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "var(--text-muted)", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
          ← Back to Games
        </button>
      )}

      {/* QUIZ GAME */}
      {activeGame === "quiz" && (
        <div className="animate-fade-in">
          {!quizDone ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Question {quizQ + 1}/{QUIZ_QUESTIONS.length}</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#8b5cf6" }}>Score: {quizScore}</span>
              </div>
              <div style={{ height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.06)", marginBottom: "20px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${((quizQ) / QUIZ_QUESTIONS.length) * 100}%`, background: "#8b5cf6", transition: "width 0.5s ease" }} />
              </div>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "20px", lineHeight: 1.5 }}>{QUIZ_QUESTIONS[quizQ].q}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {QUIZ_QUESTIONS[quizQ].options.map((opt, idx) => {
                  let bg = "rgba(255,255,255,0.04)";
                  let border = "rgba(255,255,255,0.08)";
                  if (quizAnswered !== null) {
                    if (idx === QUIZ_QUESTIONS[quizQ].answer) { bg = "rgba(34,197,94,0.15)"; border = "#22c55e"; }
                    else if (idx === quizAnswered) { bg = "rgba(239,68,68,0.15)"; border = "#ef4444"; }
                  }
                  return (
                    <button key={idx} onClick={() => handleQuizAnswer(idx)}
                      style={{ padding: "13px 16px", borderRadius: "12px", border: `1px solid ${border}`, background: bg, color: "var(--text-primary)", cursor: quizAnswered !== null ? "not-allowed" : "pointer", textAlign: "left", fontSize: "14px", transition: "all 0.3s", fontWeight: 500 }}>
                      {String.fromCharCode(65 + idx)}. {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "56px", marginBottom: "12px" }}>{quizScore === QUIZ_QUESTIONS.length ? "🏆" : quizScore >= 3 ? "🎉" : "📚"}</div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                {quizScore}/{QUIZ_QUESTIONS.length} Correct!
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>You earned 🪙 {quizScore * 10} coins!</p>
              <button onClick={resetQuiz} style={{ padding: "12px 28px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #8b5cf6, #6366f1)", color: "white", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>Play Again</button>
            </div>
          )}
        </div>
      )}

      {/* MEMORY GAME */}
      {activeGame === "memory" && (
        <div className="animate-fade-in">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Moves: {moves}</span>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Matched: {matched.length / 2}/{EMOJIS.length}</span>
            <button onClick={initMemory} style={{ fontSize: "12px", color: "#3b82f6", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>↺ Reset</button>
          </div>
          {memoryWon && (
            <div style={{ textAlign: "center", padding: "16px", borderRadius: "14px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", marginBottom: "14px" }}>
              <p style={{ fontSize: "20px", marginBottom: "4px" }}>🏆 You Won!</p>
              <p style={{ fontSize: "13px", color: "#22c55e", fontWeight: 600 }}>Completed in {moves} moves!</p>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
            {cards.map((card, idx) => {
              const isFlipped = flipped.includes(idx) || matched.includes(idx);
              return (
                <button key={idx} onClick={() => handleCardFlip(idx)}
                  style={{
                    aspectRatio: "1", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)",
                    background: isFlipped ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.05)",
                    fontSize: "24px", cursor: "pointer", transition: "all 0.3s",
                    transform: isFlipped ? "rotateY(0deg)" : "rotateY(90deg)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: matched.includes(idx) ? "0 0 12px rgba(34,197,94,0.3)" : "none",
                    borderColor: matched.includes(idx) ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)",
                  }}>
                  {isFlipped ? card.emoji : "❓"}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* REACTION GAME */}
      {activeGame === "reaction" && (
        <div className="animate-fade-in" style={{ textAlign: "center" }}>
          {bestReaction && (
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px" }}>Best: {bestReaction}ms 🏆</p>
          )}
          <button onClick={reactionState === "idle" || reactionState === "result" || reactionState === "early" ? startReaction : handleReactionClick}
            style={{
              width: "100%", padding: "60px 20px", borderRadius: "20px", border: "none", cursor: "pointer",
              background: reactionState === "go" ? "linear-gradient(135deg, #22c55e, #16a34a)" : reactionState === "waiting" ? "linear-gradient(135deg, #f59e0b, #f97316)" : "linear-gradient(135deg, #3b82f6, #6366f1)",
              transition: "background 0.3s",
              boxShadow: reactionState === "go" ? "0 0 40px rgba(34,197,94,0.5)" : "none",
            }}
            onClick={reactionState === "waiting" ? handleReactionClick : reactionState === "go" ? handleReactionClick : startReaction}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>
              {reactionState === "idle" ? "👆" : reactionState === "waiting" ? "⏳" : reactionState === "go" ? "🟢" : reactionState === "early" ? "❌" : "✅"}
            </div>
            <p style={{ fontSize: "18px", fontWeight: 700, color: "white" }}>
              {reactionState === "idle" ? "Tap to Start" : reactionState === "waiting" ? "Wait for green..." : reactionState === "go" ? "TAP NOW!" : reactionState === "early" ? "Too Early! Tap to retry" : `${reactionTime}ms - Tap to retry`}
            </p>
            {reactionState === "result" && (
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginTop: "8px" }}>
                {reactionTime < 300 ? "⚡ Lightning Fast!" : reactionTime < 500 ? "😊 Pretty Good!" : "🐢 Keep Practicing!"}
              </p>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default MiniGames;