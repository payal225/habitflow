import React, { useState, useEffect } from "react";

const QUOTES = [
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "Habits are the compound interest of self-improvement.", author: "James Clear" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "First forget inspiration. Habit is more dependable.", author: "Octavia Butler" },
  { text: "Your net worth to the world is usually determined by what remains after your bad habits are subtracted from your good ones.", author: "Benjamin Franklin" },
  { text: "Champions are not born, they are made through daily habits.", author: "Unknown" },
  { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
];

const MotivationQuote = () => {
  const [quote, setQuote] = useState(QUOTES[0]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    // Show a random quote based on current day
    const dayIndex = new Date().getDate() % QUOTES.length;
    setQuote(QUOTES[dayIndex]);
  }, []);

  const getNewQuote = () => {
    setFade(false);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * QUOTES.length);
      setQuote(QUOTES[randomIndex]);
      setFade(true);
    }, 300);
  };

  return (
    <div className="card" style={{ background: "linear-gradient(135deg, #22c55e15, #4ade8015)" }}>
      <div className="flex items-start gap-3">
        <span className="text-3xl flex-shrink-0">💡</span>
        <div className="flex-1">
          <p className="text-sm font-medium italic leading-relaxed"
            style={{
              color: "var(--text-primary)",
              opacity: fade ? 1 : 0,
              transition: "opacity 0.3s ease"
            }}>
            "{quote.text}"
          </p>
          <p className="text-xs mt-2 font-semibold" style={{ color: "var(--accent)" }}>
            — {quote.author}
          </p>
        </div>
      </div>
      <button onClick={getNewQuote} className="mt-3 text-xs font-medium hover:underline"
        style={{ color: "var(--text-muted)" }}>
        New quote →
      </button>
    </div>
  );
};

export default MotivationQuote;