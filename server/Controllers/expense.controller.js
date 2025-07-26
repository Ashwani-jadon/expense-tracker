import Expense from "../Models/expense.model.js";
import User from "../Models/user.model.js";

export const createExpense = async (req, res) => {
  const { category, amount, date, select, note } = req.body;

  try {
    if (!category || !amount) {
      return res
        .status(400)
        .json({ message: "Category and amount are required." });
    }
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { walletMoney: select === "spent" ? -amount : amount } },
      { new: true }
    );

    const newExpense = await Expense.create({
      category,
      amount,
      date: date ? new Date(date) : undefined,
      user: userId,
      select,
      note,
    });

    return res.status(201).json({
      message: "Expense created successfully and wallet updated.",
      expense: newExpense,
      user: {
        _id: user._id,
        walletMoney: user.walletMoney,
      },
    });
  } catch (error) {
    console.error("Create Expense Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while creating expense." });
  }
};

export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({
      createdAt: -1,
    }); // Fetch expenses for the authenticated
    //  user in descending order
    return res.status(200).json({ expenses });
  } catch (error) {
    console.error("Get Expenses Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching expenses." });
  }
};

export const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }
    const userId = expense.user;

    await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          walletMoney:
            expense.select === "spent" ? expense.amount : -expense.amount,
        },
      },
      { new: true }
    );

    await Expense.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Expense deleted successfully and wallet updated.",
    });
  } catch (error) {
    console.error("Delete Expense Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while deleting expense." });
  }
};

export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { category, amount, date, select, note } = req.body;

  try {
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    if (!category || !amount || !note || !select) {
      return res.status(400).json({ message: "Updated note, category, select, and amount are required." });
    }

    const userId = expense.user;

    // Step 1: Reverse old expense effect on wallet
    const oldImpact = expense.select === "spent" ? +expense.amount : -expense.amount;

    // Step 2: Apply new expense impact
    const newImpact = select === "spent" ? -amount : +amount;

    // Step 3: Net wallet change
    const walletChange = oldImpact + newImpact;

    // Step 4: Update user's wallet
    await User.findByIdAndUpdate(
      userId,
      { $inc: { walletMoney: walletChange } },
      { new: true }
    );

    // Step 5: Update the expense document
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      {
        category,
        amount,
        date: date ? new Date(date) : undefined,
        select,
        note,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Expense updated successfully and wallet updated.",
      expense: updatedExpense,
    });

  } catch (error) {
    console.error("Update Expense Error:", error);
    return res.status(500).json({ message: "Server error while updating expense." });
  }
};
