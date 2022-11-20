export default class ExpenseController {
    constructor({ expenseService, validationResult }) {
        this.expenseService = expenseService;
        this.validationResult = validationResult;
        this.addExpense = this.addExpense.bind(this);
        this.getExpenses = this.getExpenses.bind(this);
        this.updateExpense = this.updateExpense.bind(this);
        this.removeExpense = this.removeExpense.bind(this);
    }

    async addExpense(req, res) {
        //check if errors in validation
        const errors = this.validationResult(req);
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

            res.status(201).json({ msg: 'Expense created', newExpense });
        } catch (error) {
            res.status(500).json({ errors: [{ msg: `Server error, ${error.message}` }] });
        }
    }

    async getExpenses(req, res) {
        try {
            const user_id = req.query.user_id;
            const expenses = await this.expenseService.getExpenses(user_id);
            res.status(200).json({ expenses });
        } catch (error) {
            res.status(500).json({ errors: [{ msg: `Server error, ${error.message}` }] });
        }
    }

    async updateExpense(req, res) {
        //check if errors in validation
        const errors = this.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { concept, amount, date, category_id } = req.body;
        const { expense_id } = req.params;
        try {
            await this.expenseService.updateExpense(expense_id, concept, amount, date, category_id);

            res.status(200).json({ msg: 'Expense updated' });
        } catch (error) {
            res.status(500).json({ errors: [{ msg: `Server error, ${error.message}` }] });
        }
    }

    async removeExpense(req, res) {
        const { expense_id } = req.params;

        try {
            await this.expenseService.removeExpense(expense_id);

            res.status(200).json({ msg: 'Expense removed' });
        } catch (error) {
            res.status(500).json({ errors: [{ msg: `Server error, ${error.message}` }] });
        }
    }
}
