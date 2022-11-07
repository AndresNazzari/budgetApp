import { expect } from 'chai';
import IncomeService from '../income.service.js';
import UserService from '../user.service.js';
import { dbMemory, createDb } from '../../utils/test-utils.js';

describe('Income service test', () => {
    let testUserId;

    before(async () => {
        await createDb(dbMemory);
        const userService = new UserService({ db: dbMemory });
        testUserId = await userService.addUser('Test Name', 'test8@email.com', '', 1234567890);
        testUserId = testUserId[0];
    });

    it('Should Add income', async () => {
        const incomeService = new IncomeService({ db: dbMemory });

        const { concept, amount, date, category_id, user_id } = {
            concept: 'Test Concept 1',
            amount: 100,
            date: '2021-01-01',
            category_id: 1,
            user_id: testUserId,
        };

        const newIncome = await incomeService.addIncome(
            concept,
            amount,
            date,
            category_id,
            user_id
        );
        expect(newIncome).to.be.a('object');
        expect(newIncome).to.have.property('income_id').to.be.a('number');
        expect(newIncome).to.have.property('concept').to.be.a('string').equal(concept);
        expect(newIncome).to.have.property('amount').to.be.a('number').equal(amount);
        expect(newIncome).to.have.property('date').to.be.a('string').equal(date);
        expect(newIncome).to.have.property('category_id').to.be.a('number').equal(category_id);
        expect(newIncome).to.have.property('user_id').to.be.a('number').equal(user_id);
    });

    it('Should get all incomes of the user ID', async () => {
        const incomeService = new IncomeService({ db: dbMemory });
        await incomeService.addIncome('Test Concept 2', 200, '2021-01-01', 1, testUserId);

        const incomes = await incomeService.getIncomes(testUserId);

        expect(incomes).to.be.a('array').not.to.have.lengthOf(0);
        expect(incomes[0]).to.be.a('object');
        expect(incomes[0]).to.have.property('income_id');
        expect(incomes[0]).to.have.property('concept');
        expect(incomes[0]).to.have.property('amount');
        expect(incomes[0]).to.have.property('date');
        expect(incomes[0]).to.have.property('category_id');
        expect(incomes[0]).to.have.property('user_id');

        const noIncomes = await incomeService.getIncomes(999);
        expect(noIncomes).to.be.a('array').to.have.lengthOf(0);
    });

    it('Should update income', async () => {
        const incomeService = new IncomeService({ db: dbMemory });

        const { concept, amount, date, category_id, user_id } = {
            concept: 'Test Concept 1',
            amount: 100,
            date: '2021-01-01',
            category_id: 1,
            user_id: testUserId,
        };

        const newIncome = await incomeService.addIncome(
            concept,
            amount,
            date,
            category_id,
            user_id
        );

        const updatedIncome = await incomeService.updateIncome(
            newIncome.income_id,
            concept + ' updated',
            amount + 99,
            '2020-10-10',
            2,
            user_id
        );

        expect(updatedIncome).to.be.a('number').equal(1);
    });

    it('Should delete income by ID', async () => {
        const incomeService = new IncomeService({ db: dbMemory });

        const { concept, amount, date, category_id, user_id } = {
            concept: 'Test Concept 1',
            amount: 100,
            date: '2021-01-01',
            category_id: 1,
            user_id: testUserId,
        };

        const newIncome = await incomeService.addIncome(
            concept,
            amount,
            date,
            category_id,
            user_id
        );

        const removedIncome = await incomeService.removeIncome(newIncome.income_id);
        expect(removedIncome).to.be.a('number').equal(1);

        const notRemoved = await incomeService.removeIncome(9999999);
        expect(notRemoved).to.be.a('number').equal(0);
    });
});
