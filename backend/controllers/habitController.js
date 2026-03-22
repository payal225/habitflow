const Habit = require("../models/Habit");
const { validationResult } = require("express-validator");

exports.getHabits = async (req, res, next) => {
  try {
    const filter = { user: req.user.id };
    if (req.query.category) filter.category = req.query.category;
    const habits = await Habit.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: habits.length, habits });
  } catch (error) { next(error); }
};

exports.createHabit = async (req, res, next) => {
  try {
    const habit = await Habit.create({ ...req.body, user: req.user.id, startDate: req.body.startDate || new Date().toISOString().split("T")[0] });
    res.status(201).json({ success: true, habit });
  } catch (error) { next(error); }
};

exports.getHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ success: false, message: "Habit not found" });
    if (habit.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: "Not authorized" });
    res.status(200).json({ success: true, habit });
  } catch (error) { next(error); }
};

exports.updateHabit = async (req, res, next) => {
  try {
    let habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ success: false, message: "Habit not found" });
    if (habit.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: "Not authorized" });
    habit = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, habit });
  } catch (error) { next(error); }
};

exports.deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ success: false, message: "Habit not found" });
    if (habit.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: "Not authorized" });
    await habit.deleteOne();
    res.status(200).json({ success: true, message: "Habit deleted" });
  } catch (error) { next(error); }
};

exports.toggleCompletion = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ success: false, message: "Habit not found" });
    if (habit.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: "Not authorized" });
    const date = req.body.date || new Date().toISOString().split("T")[0];
    const existingIndex = habit.completions.findIndex(c => c.date === date);
    let action;
    if (existingIndex > -1) { habit.completions.splice(existingIndex, 1); action = "uncompleted"; }
    else { habit.completions.push({ date, note: req.body.note || "" }); action = "completed"; }
    habit.recalculateStreaks();
    await habit.save();
    res.status(200).json({ success: true, action, habit });
  } catch (error) { next(error); }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user.id, isActive: true });
    const today = new Date().toISOString().split("T")[0];
    let completedToday = 0, bestStreak = 0;
    const weeklyTrend = [];
    habits.forEach(h => {
      if (h.isCompletedOnDate(today)) completedToday++;
      bestStreak = Math.max(bestStreak, h.longestStreak);
    });
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000).toISOString().split("T")[0];
      weeklyTrend.push({ date, count: habits.filter(h => h.isCompletedOnDate(date)).length, total: habits.length });
    }
    res.status(200).json({
      success: true,
      analytics: {
        totalHabits: habits.length, completedToday,
        completionRateToday: habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0,
        bestStreak, weeklyTrend
      }
    });
  } catch (error) { next(error); }
};