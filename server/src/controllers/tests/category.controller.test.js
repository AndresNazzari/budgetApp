import jest from 'jest-mock';
import { expect } from 'chai';
import knex from 'knex';
import { dbMemoryConfig } from '../../utils/test-utils.js';
import { createTables } from '../../config/createTables.js';
import { validationResult } from 'express-validator';
import { validationResultMock } from '../../utils/validationResultMock.js';
import CategoryController from '../category.controller.js';
import CategoryService from '../../services/category.service.js';

describe('Category Controller tests', () => {
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

    describe('Get Category Tests', () => {
        beforeEach(() => {
            // reset the request and response objects before each test
            resetReqResMock();
        });
        it('Should get all categories', async () => {
            const categoryService = new CategoryService({ db: dbMemory });
            const categoryController = new CategoryController({
                categoryService,
                validationResult,
            });
            mockRequest.body = {
                name: 'New category 1',
            };

            await categoryController.createCategory(mockRequest, mockResponse);

            await categoryController.getCategories(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(200);
            expect(resultJson).to.be.a('object').to.have.property('categories');
            expect(resultJson.categories).to.be.a('array').lengthOf(1);
            expect(resultJson.categories[0])
                .to.be.a('object')
                .to.have.property('name')
                .equal('New category 1');

            mockRequest.body = {
                name: 'New category 2',
            };
            await categoryController.createCategory(mockRequest, mockResponse);

            await categoryController.getCategories(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(200);
            expect(resultJson).to.be.a('object').to.have.property('categories');
            expect(resultJson.categories).to.be.a('array').lengthOf(2);
        });

        it('Should return server error if cant connect to database', async () => {
            const categoryService = new CategoryService({});
            const categoryController = new CategoryController({
                categoryService,
                validationResult,
            });

            mockRequest.body = {
                name: 'New category 3',
            };
            await categoryController.getCategories(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });
    });

    describe('Create Category Tests', () => {
        beforeEach(() => {
            // reset the request and response objects before each test
            resetReqResMock();
        });

        it('Should create a new category', async () => {
            const categoryService = new CategoryService({ db: dbMemory });
            const categoryController = new CategoryController({
                categoryService,
                validationResult,
            });

            mockRequest.body = {
                name: 'New category 4',
            };
            await categoryController.createCategory(mockRequest, mockResponse);

            expect(resultStatus).to.equal(200);
            expect(resultJson).to.be.a('object').with.property('msg', 'Category created');
        });

        it('Should return a error if express-validations fail ', async () => {
            const categoryService = new CategoryService({ db: dbMemory });
            const categoryController = new CategoryController({
                categoryService,
                validationResult: validationResultMock,
            });

            await categoryController.createCategory(mockRequest, mockResponse);

            expect(resultStatus).to.equal(400);
            expect(resultJson)
                .to.be.a('object')
                .with.property('errors')
                .to.be.a('array')
                .lengthOf(1);
            expect(resultJson.errors[0]).to.be.a('object').with.property('msg', 'test error');
        });

        it('Should return server error if cant connect to database', async () => {
            const categoryService = new CategoryService({});
            const categoryController = new CategoryController({
                categoryService,
                validationResult,
            });

            mockRequest.body = {
                name: 'New category 1',
            };
            await categoryController.createCategory(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });
    });
});
