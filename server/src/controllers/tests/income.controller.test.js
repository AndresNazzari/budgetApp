import jest from 'jest-mock';
import { expect } from 'chai';
import knex from 'knex';
import { dbMemoryConfig } from '../../utils/test-utils.js';
import { createTables } from '../../config/createTables.js';
import { validationResult } from 'express-validator';
import { validationResultMock } from '../../utils/validationResultMock.js';
import IncomeController from '../income.controller.js';
import IncomeService from '../../services/income.service.js';

describe('Income Controller tests', () => {
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
    describe('Get Incomes Tests', () => {
        beforeEach(() => {
            // reset the request and response objects before each test
            resetReqResMock();
        });

        it('Should get all incomes', async () => {
            const incomeService = new IncomeService({ db: dbMemory });
            const incomeController = new IncomeController({ incomeService, validationResult });

            mockRequest.body = {
                concept: 'Almuerzo 2',
                amount: 350,
                category_id: 1,
                user_id: 1,
            };

            await incomeController.addIncome(mockRequest, mockResponse);
            mockRequest.query = { user_id: 1 };

            await incomeController.getIncomes(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(200);
            expect(resultJson).to.be.a('object').to.have.property('incomes');
            expect(resultJson.incomes).to.be.a('array').not.to.have.lengthOf(0);
            expect(resultJson.incomes[0]).to.be.a('object').to.have.property('income_id');
            expect(resultJson.incomes[0])
                .to.be.a('object')
                .to.have.property('concept')
                .equal('Almuerzo 2');
            expect(resultJson.incomes[0]).to.be.a('object').to.have.property('amount');
            expect(resultJson.incomes[0])
                .to.be.a('object')
                .to.have.property('category_id')
                .equal(1);
            expect(resultJson.incomes[0]).to.be.a('object').to.have.property('user_id').equal(1);
        });

        it('Should return empty array if user id no exists', async () => {
            const incomeService = new IncomeService({ db: dbMemory });
            const incomeController = new IncomeController({ incomeService, validationResult });

            mockRequest.query = { user_id: 999 };

            await incomeController.getIncomes(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(200);
            expect(resultJson).to.be.a('object').to.have.property('incomes');
            expect(resultJson.incomes).to.be.a('array').to.have.lengthOf(0);
        });

        it('Should return server error if user_id is undefined', async () => {
            const incomeService = new IncomeService({ db: dbMemory });
            const incomeController = new IncomeController({ incomeService, validationResult });

            mockRequest.query = { user_id: undefined };

            await incomeController.getIncomes(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });

        it('Should return server error if cant connect to database', async () => {
            const incomeService = new IncomeService({});
            const incomeController = new IncomeController({ incomeService, validationResult });

            await incomeController.getIncomes(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });
    });

    describe('Add Income Tests', () => {
        beforeEach(() => {
            // reset the request and response objects before each test
            resetReqResMock();
        });

        it('Should add an income', async () => {
            const incomeService = new IncomeService({ db: dbMemory });
            const incomeController = new IncomeController({ incomeService, validationResult });

            mockRequest.body = {
                concept: 'Almuerzo 1',
                amount: 350,
                category_id: 1,
                user_id: 1,
            };
            await incomeController.addIncome(mockRequest, mockResponse);
            expect(resultStatus).to.equal(201);
            expect(resultJson).to.have.property('msg').equal('Income created');
            expect(resultJson).to.have.property('newIncome').to.be.a('object');
            expect(resultJson.newIncome).to.have.property('income_id');
            expect(resultJson.newIncome).to.have.property('concept').equal('Almuerzo 1');
            expect(resultJson.newIncome).to.have.property('amount').equal(350);
            expect(resultJson.newIncome).to.have.property('category_id').equal(1);
            expect(resultJson.newIncome).to.have.property('user_id').equal(1);
        });

        it('Should return error if the income does not have user_id ', async () => {
            const incomeService = new IncomeService({ db: dbMemory });
            const incomeController = new IncomeController({ incomeService, validationResult });

            mockRequest.body = {
                concept: 'Almuerzo 2',
                amount: 350,
                category_id: 1,
            };
            await incomeController.addIncome(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });

        it('Should return error if the income does not have category_id ', async () => {
            const incomeService = new IncomeService({ db: dbMemory });
            const incomeController = new IncomeController({ incomeService, validationResult });

            mockRequest.body = {
                concept: 'Almuerzo 2',
                amount: 350,
                user_id: 1,
            };
            await incomeController.addIncome(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });

        it('Should return server error if cant connect to database', async () => {
            const incomeService = new IncomeService({});
            const incomeController = new IncomeController({ incomeService, validationResult });

            mockRequest.body = {
                concept: 'Almuerzo 1',
                amount: 350,
                category_id: 1,
                user_id: 1,
            };
            await incomeController.addIncome(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });

        it('Should return error if express-validation gets an error', async () => {
            const incomeService = new IncomeService({ db: dbMemory });
            const incomeController = new IncomeController({
                incomeService,
                validationResult: validationResultMock,
            });

            mockRequest.body = {
                nameee: 'test4',
                email: 'test4@test.com',
                password: '123456',
                password2: '123456',
            };
            await incomeController.addIncome(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(400);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('test error');
        });
    });

    describe('Delete Income Tests', () => {
        beforeEach(() => {
            // reset the request and response objects before each test
            resetReqResMock();
        });

        it('Should delete an income', async () => {
            const incomeService = new IncomeService({ db: dbMemory });
            const incomeController = new IncomeController({ incomeService, validationResult });

            mockRequest.body = {
                concept: 'Almuerzo 1',
                amount: 350,
                category_id: 1,
                user_id: 1,
            };
            await incomeController.addIncome(mockRequest, mockResponse);
            const incomeId = resultJson.newIncome.income_id;
            mockRequest.params = { income_id: incomeId };
            await incomeController.removeIncome(mockRequest, mockResponse);
            expect(resultStatus).to.equal(200);
            expect(resultJson).to.be.a('object').to.have.property('msg').equal('Income removed');
        });

        it('Should return server error if income_id is undefined', async () => {
            const incomeService = new IncomeService({ db: dbMemory });
            const incomeController = new IncomeController({ incomeService, validationResult });

            mockRequest.params = { income_id: undefined };
            await incomeController.removeIncome(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });

        it('Should return server error if cant connect to database', async () => {
            const incomeService = new IncomeService({});
            const incomeController = new IncomeController({ incomeService, validationResult });

            mockRequest.params = { income_id: 1 };
            await incomeController.removeIncome(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });
    });

    describe('Update Incomes Tests', () => {
        beforeEach(() => {
            // reset the request and response objects before each test
            resetReqResMock();
        });

        it('Should update a income', async () => {
            const incomeService = new IncomeService({ db: dbMemory });
            const incomeController = new IncomeController({ incomeService, validationResult });

            //create new income
            mockRequest.body = {
                concept: 'Almuerzo 99',
                amount: 2364,
                category_id: 1,
                user_id: 1,
            };

            await incomeController.addIncome(mockRequest, mockResponse);
            const income_id = resultJson.newIncome.income_id;
            resetReqResMock();

            mockRequest.params = { income_id };
            //update income with thios values
            mockRequest.body = {
                concept: 'Almuerzo 87',
                amount: 354,
                category_id: 2,
                user_id: 2,
            };

            await incomeController.updateIncome(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(200);
            expect(resultJson).to.be.a('object').to.have.property('msg').equal('Income updated');
        });

        it('Should return server error if income_id is undefined', async () => {
            const incomeService = new IncomeService({ db: dbMemory });
            const incomeController = new IncomeController({ incomeService, validationResult });

            mockRequest.params = { income_id: undefined };
            mockRequest.body = {
                concept: 'Almuerzo 87',
                amount: 354,
                category_id: 2,
                user_id: 2,
            };

            await incomeController.updateIncome(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });

        it('Should return server error if cant connect to database', async () => {
            const incomeService = new IncomeService({});
            const incomeController = new IncomeController({ incomeService, validationResult });
            mockRequest.body = {
                concept: 'Almuerzo 87',
                amount: 354,
                category_id: 2,
                user_id: 2,
            };
            mockRequest.params = { income_id: 1 };
            await incomeController.updateIncome(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });

        it('Should return error if express-validation gets an error', async () => {
            const incomeService = new IncomeService({ db: dbMemory });
            const incomeController = new IncomeController({
                incomeService,
                validationResult: validationResultMock,
            });

            await incomeController.updateIncome(mockRequest, mockResponse);

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
