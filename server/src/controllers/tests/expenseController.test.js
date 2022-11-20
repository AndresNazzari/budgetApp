import jest from 'jest-mock';
import { expect } from 'chai';
import knex from 'knex';
import { dbMemoryConfig } from '../../utils/test-utils.js';
import { createTables } from '../../config/createTables.js';
import { validationResult } from 'express-validator';
import { validationResultMock } from '../../utils/validationResultMock.js';
import ExpenseController from '../expense.controller.js';
import ExpenseService from '../../services/expense.service.js';

describe('Expense Controller tests', () => {
    let mockRequest = {};
    let mockResponse = {};
    let resultJson = {};
    let resultStatus = {};
    let dbMemory;

    const resetReqResMock = () => {
        // reset the request and response objects before each test
        mockRequest = {};
        mockResponse = {};

        // reset the objects that store results in them
        resultJson = {};
        resultStatus = {};

        // The mockImplementation catches the .status function when it is called in express,
        // 	then runs the below test code to "implement" what the function will do.
        //
        // To test express there is a special requirement, that is to return the "mockResponse" object every time,
        // 	this mimics the "function chaining" behaviour of express where we call .status().json({}) in the controller
        //
        // the .mockImplementation((result) => {} "result" variable is given to us by express and represents
        // 	what the controller and express passed to the .status and .json parts of the chain,
        // 	essentiall we just steal that and keep it for our assertions later on in the test
        mockResponse.status = jest.fn().mockImplementation((result) => {
            resultStatus = result;
            return mockResponse;
        });
        mockResponse.json = jest.fn().mockImplementation((result) => {
            resultJson = result;
            return mockResponse;
        });
    };

    before(async () => {
        dbMemory = knex(dbMemoryConfig);
        await createTables(dbMemory);
    });

    after(async () => {
        await dbMemory.destroy();
    });

    describe('Get Expenses Tests', () => {
        beforeEach(() => {
            // reset the request and response objects before each test
            resetReqResMock();
        });

        it('Should get all expenses', async () => {
            const expenseService = new ExpenseService({ db: dbMemory });
            const expenseController = new ExpenseController({ expenseService, validationResult });

            mockRequest.body = {
                concept: 'Almuerzo 2',
                amount: 350,
                category_id: 1,
                user_id: 1,
            };

            await expenseController.addExpense(mockRequest, mockResponse);
            mockRequest.query = { user_id: 1 };

            await expenseController.getExpenses(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(200);
            expect(resultJson).to.be.a('object').to.have.property('expenses');
            expect(resultJson.expenses).to.be.a('array').not.to.have.lengthOf(0);
            expect(resultJson.expenses[0]).to.be.a('object').to.have.property('expense_id');
            expect(resultJson.expenses[0])
                .to.be.a('object')
                .to.have.property('concept')
                .equal('Almuerzo 2');
            expect(resultJson.expenses[0]).to.be.a('object').to.have.property('amount');
            expect(resultJson.expenses[0])
                .to.be.a('object')
                .to.have.property('category_id')
                .equal(1);
            expect(resultJson.expenses[0]).to.be.a('object').to.have.property('user_id').equal(1);
        });

        it('Should return empty array if user id no exists', async () => {
            const expenseService = new ExpenseService({ db: dbMemory });
            const expenseController = new ExpenseController({ expenseService, validationResult });

            mockRequest.query = { user_id: 999 };

            await expenseController.getExpenses(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(200);
            expect(resultJson).to.be.a('object').to.have.property('expenses');
            expect(resultJson.expenses).to.be.a('array').to.have.lengthOf(0);
        });

        it('Should return server error if user_id is undefined', async () => {
            const expenseService = new ExpenseService({ db: dbMemory });
            const expenseController = new ExpenseController({ expenseService, validationResult });

            mockRequest.query = { user_id: undefined };

            await expenseController.getExpenses(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });

        it('Should return server error if cant connect to database', async () => {
            const expenseService = new ExpenseService({});
            const expenseController = new ExpenseController({ expenseService, validationResult });

            await expenseController.getExpenses(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });
    });

    describe('Add Expense Tests', () => {
        beforeEach(() => {
            // reset the request and response objects before each test
            resetReqResMock();
        });

        it('Should add an expense', async () => {
            const expenseService = new ExpenseService({ db: dbMemory });
            const expenseController = new ExpenseController({ expenseService, validationResult });

            mockRequest.body = {
                concept: 'Almuerzo 1',
                amount: 350,
                category_id: 1,
                user_id: 1,
            };
            await expenseController.addExpense(mockRequest, mockResponse);
            expect(resultStatus).to.equal(201);
            expect(resultJson).to.have.property('msg').equal('Expense created');
            expect(resultJson).to.have.property('newExpense').to.be.a('object');
            expect(resultJson.newExpense).to.have.property('expense_id');
            expect(resultJson.newExpense).to.have.property('concept').equal('Almuerzo 1');
            expect(resultJson.newExpense).to.have.property('amount').equal(350);
            expect(resultJson.newExpense).to.have.property('category_id').equal(1);
            expect(resultJson.newExpense).to.have.property('user_id').equal(1);
        });

        it('Should return error if the expense does not have user_id ', async () => {
            const expenseService = new ExpenseService({ db: dbMemory });
            const expenseController = new ExpenseController({ expenseService, validationResult });

            mockRequest.body = {
                concept: 'Almuerzo 2',
                amount: 350,
                category_id: 1,
            };
            await expenseController.addExpense(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });

        it('Should return error if the expense does not have category_id ', async () => {
            const expenseService = new ExpenseService({ db: dbMemory });
            const expenseController = new ExpenseController({ expenseService, validationResult });

            mockRequest.body = {
                concept: 'Almuerzo 2',
                amount: 350,
                user_id: 1,
            };
            await expenseController.addExpense(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });

        it('Should return server error if cant connect to database', async () => {
            const expenseService = new ExpenseService({});
            const expenseController = new ExpenseController({ expenseService, validationResult });

            mockRequest.body = {
                concept: 'Almuerzo 1',
                amount: 350,
                category_id: 1,
                user_id: 1,
            };
            await expenseController.addExpense(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });

        it('Should return error if express-validation gets an error', async () => {
            const expenseService = new ExpenseService({ db: dbMemory });
            const expenseController = new ExpenseController({
                expenseService,
                validationResult: validationResultMock,
            });

            mockRequest.body = {
                nameee: 'test4',
                email: 'test4@test.com',
                password: '123456',
                password2: '123456',
            };
            await expenseController.addExpense(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(400);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('test error');
        });
    });

    describe('Delete Expense Tests', () => {
        beforeEach(() => {
            // reset the request and response objects before each test
            resetReqResMock();
        });

        it('Should delete an expense', async () => {
            const expenseService = new ExpenseService({ db: dbMemory });
            const expenseController = new ExpenseController({ expenseService, validationResult });

            mockRequest.body = {
                concept: 'Almuerzo 1',
                amount: 350,
                category_id: 1,
                user_id: 1,
            };
            await expenseController.addExpense(mockRequest, mockResponse);
            const expenseId = resultJson.newExpense.expense_id;
            mockRequest.params = { expense_id: expenseId };
            await expenseController.removeExpense(mockRequest, mockResponse);
            expect(resultStatus).to.equal(200);
            expect(resultJson).to.be.a('object').to.have.property('msg').equal('Expense removed');
        });

        it('Should return server error if expense_id is undefined', async () => {
            const expenseService = new ExpenseService({ db: dbMemory });
            const expenseController = new ExpenseController({ expenseService, validationResult });

            mockRequest.params = { expense_id: undefined };
            await expenseController.removeExpense(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });

        it('Should return server error if cant connect to database', async () => {
            const expenseService = new ExpenseService({});
            const expenseController = new ExpenseController({ expenseService, validationResult });

            mockRequest.params = { expense_id: 1 };
            await expenseController.removeExpense(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });
    });

    describe('Update Expense Tests', () => {
        beforeEach(() => {
            // reset the request and response objects before each test
            resetReqResMock();
        });

        it('Should update a expense', async () => {
            const expenseService = new ExpenseService({ db: dbMemory });
            const expenseController = new ExpenseController({ expenseService, validationResult });

            //create new expense
            mockRequest.body = {
                concept: 'Almuerzo 99',
                amount: 2364,
                category_id: 1,
                user_id: 1,
            };

            await expenseController.addExpense(mockRequest, mockResponse);
            const expense_id = resultJson.newExpense.expense_id;
            resetReqResMock();

            mockRequest.params = { expense_id };
            //update expense with thios values
            mockRequest.body = {
                concept: 'Almuerzo 87',
                amount: 354,
                category_id: 2,
                user_id: 2,
            };

            await expenseController.updateExpense(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(200);
            expect(resultJson).to.be.a('object').to.have.property('msg').equal('Expense updated');
        });

        it('Should return server error if expense_id is undefined', async () => {
            const expenseService = new ExpenseService({ db: dbMemory });
            const expenseController = new ExpenseController({ expenseService, validationResult });

            mockRequest.params = { expense_id: undefined };
            mockRequest.body = {
                concept: 'Almuerzo 87',
                amount: 354,
                category_id: 2,
                user_id: 2,
            };

            await expenseController.updateExpense(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });

        it('Should return server error if cant connect to database', async () => {
            const expenseService = new ExpenseService({});
            const expenseController = new ExpenseController({ expenseService, validationResult });
            mockRequest.body = {
                concept: 'Almuerzo 87',
                amount: 354,
                category_id: 2,
                user_id: 2,
            };
            mockRequest.params = { expense_id: 1 };
            await expenseController.updateExpense(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });

        it('Should return error if express-validation gets an error', async () => {
            const expenseService = new ExpenseService({ db: dbMemory });
            const expenseController = new ExpenseController({
                expenseService,
                validationResult: validationResultMock,
            });

            await expenseController.updateExpense(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(400);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('test error');
        });
    });
});
