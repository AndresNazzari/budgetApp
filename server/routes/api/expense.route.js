import express from 'express';
import { check } from 'express-validator';
import auth from '../../middleware/auth.middleware.js';

export default class ExpenseRoute extends express.Router {
    constructor({ expenseController }) {
        super();
        this.expenseController = expenseController;

        //@route    POST api/expense
        //@desc     Add expense
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
            this.expenseController.addExpense
        );

        //@route    GET api/expense
        //@desc     Get all expenses
        //@access   Private
        this.get('/', auth, this.expenseController.getExpenses);

        //@route    PUT api/expense/:expense_id
        //@desc     Remove expense
        //@access   Private
        this.put(
            '/:expense_id',
            auth,
            [
                check('concept', 'Concept is Required').not().isEmpty(),
                check('amount', 'Amount is Required').not().isEmpty(),
                check('date', 'Date is Required').not().isEmpty(),
                check('category_id', 'Category is Required').not().isEmpty(),
                check('user_id', 'User ID is Required').not().isEmpty(),
            ],
            this.expenseController.updateExpense
        );

        //@route    DELETE api/expense
        //@desc     Remove expense
        //@access   Private
        this.delete('/:expense_id', auth, this.expenseController.removeExpense);
    }
}
