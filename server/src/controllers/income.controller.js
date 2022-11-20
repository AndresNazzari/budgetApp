export default class IncomeController {
    constructor({ incomeService, validationResult }) {
        this.incomeService = incomeService;
        this.validationResult = validationResult;

        this.addIncome = this.addIncome.bind(this);
        this.getIncomes = this.getIncomes.bind(this);
        this.updateIncome = this.updateIncome.bind(this);
        this.removeIncome = this.removeIncome.bind(this);
    }

    async addIncome(req, res) {
        //check if errors in validation
        const errors = this.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { concept, amount, date, category_id, user_id } = req.body;
        try {
            const newIncome = await this.incomeService.addIncome(
                concept,
                amount,
                date,
                category_id,
                user_id
            );

            res.status(201).json({ msg: 'Income created', newIncome });
        } catch (error) {
            res.status(500).json({ errors: [{ msg: `Server error, ${error.message}` }] });
        }
    }

    async getIncomes(req, res) {
        try {
            const user_id = req.query.user_id;
            const incomes = await this.incomeService.getIncomes(user_id);
            res.status(200).json({ incomes });
        } catch (error) {
            res.status(500).json({ errors: [{ msg: `Server error, ${error.message}` }] });
        }
    }

    async updateIncome(req, res) {
        //check if errors in validation
        const errors = this.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { concept, amount, date, category_id } = req.body;
        const { income_id } = req.params;
        try {
            await this.incomeService.updateIncome(income_id, concept, amount, date, category_id);

            res.status(200).json({ msg: 'Income updated' });
        } catch (error) {
            res.status(500).json({ errors: [{ msg: `Server error, ${error.message}` }] });
        }
    }

    async removeIncome(req, res) {
        const { income_id } = req.params;

        try {
            await this.incomeService.removeIncome(income_id);
            res.status(200).json({ msg: 'Income removed' });
        } catch (error) {
            res.status(500).json({ errors: [{ msg: `Server error, ${error.message}` }] });
        }
    }
}
