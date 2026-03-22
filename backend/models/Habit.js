const mongoose = require("mongoose");

const CompletionSchema = new mongoose.Schema({
  date: { type: String, required: true },
  note: { type: String, default: "" },
  completedAt: { type: Date, default: Date.now }
});

const HabitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  category: {
    type: String,
    enum: ["health","fitness","learning","mindfulness","productivity","social","finance","creativity","other"],
    default: "other"
  },
  frequency: { type: String, enum: ["daily","weekly"], default: "daily" },
  color: { type: String, default: "#22c55e" },
  icon: { type: String, default: "⭐" },
  startDate: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  completions: [CompletionSchema],
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  totalCompletions: { type: Number, default: 0 },
  reminder: {
    enabled: { type: Boolean, default: false },
    time: { type: String, default: "08:00" }
  }
}, { timestamps: true });

HabitSchema.methods.isCompletedOnDate = function(dateStr) {
  return this.completions.some(c => c.date === dateStr);
};

HabitSchema.methods.recalculateStreaks = function() {
  if (this.completions.length === 0) {
    this.currentStreak = 0; this.longestStreak = 0; this.totalCompletions = 0;
    return;
  }
  const dates = this.completions.map(c => c.date).sort().reverse();
  this.totalCompletions = dates.length;
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  let current = 1;
  if (dates[0] !== today && dates[0] !== yesterday) {
    this.currentStreak = 0;
  } else {
    for (let i = 0; i < dates.length - 1; i++) {
      const diff = Math.round((new Date(dates[i]) - new Date(dates[i+1])) / 86400000);
      if (diff === 1) current++; else break;
    }
    this.currentStreak = current;
  }
  let longest = 1, temp = 1;
  const asc = [...dates].reverse();
  for (let i = 1; i < asc.length; i++) {
    const diff = Math.round((new Date(asc[i]) - new Date(asc[i-1])) / 86400000);
    if (diff === 1) { temp++; longest = Math.max(longest, temp); } else temp = 1;
  }
  this.longestStreak = Math.max(longest, this.currentStreak);
};

module.exports = mongoose.model("Habit", HabitSchema);