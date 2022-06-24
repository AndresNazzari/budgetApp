import ExpenseService from '../services/expense.service.js';
import { validationResult } from 'express-validator';

export default class ExpenseController {
    constructor() {
        this.expenseService = new ExpenseService();

        this.addExpense = this.addExpense.bind(this);
        this.getExpenses = this.getExpenses.bind(this);
        this.updateExpense = this.updateExpense.bind(this);
        this.removeExpense = this.removeExpense.bind(this);
    }

    async addExpense(req, res) {
        //check if errors in validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { concept, amount, category_id, user_id, date } = req.body;
        try {
            const newExpense = await this.expenseService.addExpense(
                concept,
                amount,
                date,
                category_id,
                user_id
            );

            res.status(200).json({ msg: 'Expense created', newExpense });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }

    async getExpenses(req, res) {
        try {
            const user_id = req.query.user_id;
            const expenses = await this.expenseService.getExpenses(user_id);
            res.status(200).json({ expenses });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }

    async updateExpense(req, res) {
        //check if errors in validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { concept, amount, date, category_id } = req.body;
        const { expense_id } = req.params;
        try {
            await this.expenseService.updateExpense(
                expense_id,
                concept,
                amount,
                date,
                category_id
            );

            res.status(200).json({ msg: 'Expense updated' });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }

    async removeExpense(req, res) {
        const { expense_id } = req.params;

        try {
            await this.expenseService.removeExpense(expense_id);

            res.status(200).json({ msg: 'Expense removed' });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }
}
