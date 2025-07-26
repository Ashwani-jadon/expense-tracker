import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "food",
        "transport",
        "entertainment",
        "utilities",
        "healthcare",
        "education",
        "clothing",
        "housing",
        "miscellaneous",
        "salary",
        "investment",
        "gift",
      ],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0, // ensure amount is not 
    },
    date: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    select: {
      type: String,
      enum: ["spent", "income"],
      default: "spent",
      required: true,
    },
    note: {
      type: String,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
