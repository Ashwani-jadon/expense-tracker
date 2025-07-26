import express from 'express';
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
import { createExpense,deleteExpense,getAllExpenses,updateExpense,filterExpenses,searchExpenses } from "../Controllers/expense.controller.js";
const router = express.Router();

router.route("/create").post(isAuthenticated, createExpense);
router.route("/getallexpenses").get(isAuthenticated, getAllExpenses);
router.route("/delete/:id").delete(isAuthenticated, deleteExpense);
router.route("/update/:id").put(isAuthenticated, updateExpense); 
router.route("/filter").get(isAuthenticated, filterExpenses);
router.route("/search").get(isAuthenticated, searchExpenses);
export default router;