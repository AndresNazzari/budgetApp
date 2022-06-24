import express from 'express';
import { check } from 'express-validator';
import IncomeController from '../../controllers/income.controller.js';
import auth from '../../middleware/auth.middleware.js';

export class IncomeRoute extends express.Router {
    constructor() {
        super();
        this.incomeController = new IncomeController();

        //@route    POST api/Income
        //@desc     Add Income
        //@access   Private
        this.post(
            '/',
            auth,
            [
                check('concept', 'Concept is Required').not().isEmpty(),
                check('amount', 'Amount is Required').not().isEmpty(),
                check('date', 'Date is Required').not().isEmpty(),
                check('category_id', 'Category is Required').not().isEmpty(),
                check('user_id', 'User ID is Required').not().isEmpty(),
            ],
            this.incomeController.addIncome
        );

        //@route    GET api/income
        //@desc     Get all Incomes
        //@access   Private
        this.get('/', auth, this.incomeController.getIncomes);

        //@route    PUT api/income/:income_id
        //@desc     Remove Income
        //@access   Private
        this.put(
            '/:income_id',
            auth,
            [
                check('concept', 'Concept is Required').not().isEmpty(),
                check('amount', 'Amount is Required').not().isEmpty(),
                check('date', 'Date is Required').not().isEmpty(),
                check('category_id', 'Category is Required').not().isEmpty(),
            ],
            this.incomeController.updateIncome
        );

        //@route    DELETE api/income
        //@desc     Remove Income
        //@access   Private
        this.delete('/:income_id', auth, this.incomeController.removeIncome);
    }
}
