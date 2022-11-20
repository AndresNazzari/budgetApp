import { expect } from 'chai';
import ExpenseService from '../expense.service.js';
import UserService from '../user.service.js';
import knex from 'knex';
import { dbMemoryConfig } from '../../utils/test-utils.js';
import { createTables } from '../../config/createTables.js';

describe('Expense service test', () => {
    let testUserId;
    let dbMemory;

    before(async () => {
        dbMemory = knex(dbMemoryConfig);
        await createTables(dbMemory);
        const userService = new UserService({ db: dbMemory });
        testUserId = await userService.addUser('Test Name', 'test9@email.com', '', 1234567890);
        testUserId = testUserId[0];
    });

    after(async () => {
        await dbMemory.destroy();
    });

    it('Should Add expense', async () => {
        const expenseService = new ExpenseService({ db: dbMemory });

        const { concept, amount, date, category_id, user_id } = {
            concept: 'Test Concept 1',
            amount: 100,
            date: '2021-01-01',
            category_id: 1,
            user_id: testUserId,
        };

        const newExpense = await expenseService.addExpense(
            concept,
            amount,
            date,
            category_id,
            user_id
        );
        expect(newExpense).to.be.a('object');
        expect(newExpense).to.have.property('expense_id').to.be.a('number');
        expect(newExpense).to.have.property('concept').to.be.a('string').equal(concept);
        expect(newExpense).to.have.property('amount').to.be.a('number').equal(amount);
        expect(newExpense).to.have.property('date').to.be.a('string').equal(date);
        expect(newExpense).to.have.property('category_id').to.be.a('number').equal(category_id);
        expect(newExpense).to.have.property('user_id').to.be.a('number').equal(user_id);
    });

    it('Should get all expenses of the user ID', async () => {
        const expenseService = new ExpenseService({ db: dbMemory });
        await expenseService.addExpense('Test Concept 2', 200, '2021-01-01', 1, testUserId);

        const expenses = await expenseService.getExpenses(testUserId);

        expect(expenses).to.be.a('array').not.to.have.lengthOf(0);
        expect(expenses[0]).to.be.a('object');
        expect(expenses[0]).to.have.property('expense_id');
        expect(expenses[0]).to.have.property('concept');
        expect(expenses[0]).to.have.property('amount');
        expect(expenses[0]).to.have.property('date');
        expect(expenses[0]).to.have.property('category_id');
        expect(expenses[0]).to.have.property('user_id');

        const noIncomes = await expenseService.getExpenses(999);
        expect(noIncomes).to.be.a('array').to.have.lengthOf(0);
    });

    it('Should update expense', async () => {
        const expenseService = new ExpenseService({ db: dbMemory });

        const { concept, amount, date, category_id, user_id } = {
            concept: 'Test Concept 1',
            amount: 100,
            date: '2021-01-01',
            category_id: 1,
            user_id: testUserId,
        };

        const newExpense = await expenseService.addExpense(
            concept,
            amount,
            date,
            category_id,
            user_id
        );

        const updatedExpense = await expenseService.updateExpense(
            newExpense.expense_id,
            concept + ' updated',
            amount + 99,
            '2020-10-10',
            2,
            user_id
        );

        expect(updatedExpense).to.be.a('number').equal(1);
    });

    it('Should delete expense by ID', async () => {
        const expenseService = new ExpenseService({ db: dbMemory });

        const { concept, amount, date, category_id, user_id } = {
            concept: 'Test Concept 1',
            amount: 100,
            date: '2021-01-01',
            category_id: 1,
            user_id: testUserId,
        };

        const newExpense = await expenseService.addExpense(
            concept,
            amount,
            date,
            category_id,
            user_id
        );

        const removedIncome = await expenseService.removeExpense(newExpense.expense_id);
        expect(removedIncome).to.be.a('number').equal(1);

        const notRemoved = await expenseService.removeExpense(9999999);
        expect(notRemoved).to.be.a('number').equal(0);
    });
});
