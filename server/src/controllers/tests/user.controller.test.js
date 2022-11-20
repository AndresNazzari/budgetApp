import jest from 'jest-mock';
import { expect } from 'chai';
import knex from 'knex';
import { dbMemoryConfig } from '../../utils/test-utils.js';
import { createTables } from '../../config/createTables.js';
import { validationResult } from 'express-validator';
import { validationResultMock } from '../../utils/validationResultMock.js';
import UserController from '../user.controller.js';
import UserService from '../../services/user.service.js';

describe('User controller tests', () => {
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
    describe('Create User tests', () => {
        beforeEach(() => {
            // reset the request and response objects before each test
            resetReqResMock();
        });

        it('Should create user', async () => {
            const userService = new UserService({ db: dbMemory });
            const userController = new UserController({ userService, validationResult });

            mockRequest.body = {
                name: 'test',
                email: 'test@test.com',
                password: '123456',
                password2: '123456',
            };

            await userController.createUser(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(200);
            expect(resultJson).to.be.a('object').to.have.property('token');
            expect(resultJson.token).to.be.a('string');
        });

        it('Should not create user if email is already registered', async () => {
            const userService = new UserService({ db: dbMemory });
            const userController = new UserController({ userService, validationResult });

            mockRequest.body = {
                name: 'test2',
                email: 'test2@test.com',
                password: '123456',
                password2: '123456',
            };

            //create user test 2
            await userController.createUser(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(200);

            //try to create user test 2 again
            await userController.createUser(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(400);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .equal('Email already registered');
        });

        it("Should not create user if passwords don't match", async () => {
            const userService = new UserService({ db: dbMemory });
            const userController = new UserController({ userService, validationResult });

            mockRequest.body = {
                name: 'test3',
                email: 'test3@test.com',
                password: '123456',
                password2: '1234567',
            };
            await userController.createUser(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(400);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .equal('Passwords do not match');
        });

        it('Should return server error if cant connect to database', async () => {
            const userService = new UserService({});
            const userController = new UserController({ userService, validationResult });

            mockRequest.body = {
                nameee: 'test3',
                email: 'test3@test.com',
                password: '123456',
                password2: '123456',
            };
            await userController.createUser(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });

        it('Should return error if express-validation gets an error', async () => {
            const userService = new UserService({ db: dbMemory });
            const userController = new UserController({
                userService,
                validationResult: validationResultMock,
            });

            mockRequest.body = {
                nameee: 'test4',
                email: 'test4@test.com',
                password: '123456',
                password2: '123456',
            };
            await userController.createUser(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(400);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('test error');
        });
    });

    describe('Login User tests', () => {
        beforeEach(() => {
            // reset the request and response objects before each test
            resetReqResMock();
        });

        it('Should login user', async () => {
            const userService = new UserService({ db: dbMemory });
            const userController = new UserController({ userService, validationResult });

            mockRequest.body = {
                name: 'test5',
                email: 'test5@test.com',
                password: '123456',
                password2: '123456',
            };

            await userController.createUser(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(200);

            mockRequest.body = {
                email: 'test5@test.com',
                password: '123456',
            };

            await userController.loginUser(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(200);
            expect(resultJson).to.be.a('object').to.have.property('token');
            expect(resultJson.token).to.be.a('string');
        });

        it("Should not login if password doesn't match", async () => {
            const userService = new UserService({ db: dbMemory });
            const userController = new UserController({ userService, validationResult });

            mockRequest.body = {
                name: 'test6',
                email: 'test6@test.com',
                password: '123456',
                password2: '123456',
            };

            await userController.createUser(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(200);

            mockRequest.body = {
                email: 'test6@test.com',
                password: 'asdasdasd',
            };

            await userController.loginUser(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(401);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .equal('Invalid Credentials');
        });

        it("Should not login user if email doesn't exist", async () => {
            const userService = new UserService({ db: dbMemory });
            const userController = new UserController({ userService, validationResult });
            mockRequest.body = {
                email: 'test7@test.com',
                password: '123456',
            };
            await userController.loginUser(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(401);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .equal('Invalid Credentials');
        });

        it('Should return server error if cant connect to database', async () => {
            const userService = new UserService({});
            const userController = new UserController({ userService, validationResult });

            mockRequest.body = {
                email: 'test7@test.com',
                password: '123456',
            };
            await userController.loginUser(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });

        it('Should return error if express-validation gets an error', async () => {
            const userService = new UserService({ db: dbMemory });
            const userController = new UserController({
                userService,
                validationResult: validationResultMock,
            });

            mockRequest.body = {
                email: 'test7@test.com',
                password: '123456',
            };
            await userController.loginUser(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(400);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('test error');
        });
    });

    describe('Get User tests', () => {
        beforeEach(() => {
            // reset the request and response objects before each test
            resetReqResMock();
        });

        it('Should get an user', async () => {
            const userService = new UserService({ db: dbMemory });
            const userController = new UserController({ userService, validationResult });

            mockRequest.body = {
                name: 'test7',
                email: 'test7@test.com',
                password: '123456',
                password2: '123456',
            };

            await userController.createUser(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(200);
            resetReqResMock();

            mockRequest.user = { id: 'test7@test.com' };

            await userController.getUser(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(200);
            expect(resultJson).to.be.a('object').to.have.property('user').to.be.a('object');
            expect(resultJson.user).to.have.property('name').to.be.a('string').equal('test7');
            expect(resultJson.user)
                .to.have.property('email')
                .to.be.a('string')
                .equal('test7@test.com');
            expect(resultJson.user)
                .to.have.property('password')
                .to.be.a('string')
                .not.equal('123456');
            expect(resultJson.user).to.have.property('avatar').to.be.a('string');
        });

        it('Should not get an user if email is incorrect', async () => {
            const userService = new UserService({ db: dbMemory });
            const userController = new UserController({ userService, validationResult });

            mockRequest.user = { id: 'test8@test.com' };

            await userController.getUser(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(200);
            expect(resultJson).to.be.a('object').to.have.property('user').to.be.undefined;
        });

        it('Should return server error if cant connect to database', async () => {
            const userService = new UserService({});
            const userController = new UserController({ userService, validationResult });

            mockRequest.user = { id: 'test8@test.com' };

            await userController.getUser(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(500);
            expect(resultJson).to.be.a('object').to.have.property('errors');
            expect(resultJson.errors).to.be.a('array').to.have.lengthOf(1);
            expect(resultJson.errors[0])
                .to.have.property('msg')
                .to.be.a('string')
                .to.include('Server error');
        });
    });

    describe('Delete User tests', () => {
        beforeEach(() => {
            // reset the request and response objects before each test
            resetReqResMock();
        });

        it('Should delete an user', async () => {
            const userService = new UserService({ db: dbMemory });
            const userController = new UserController({ userService, validationResult });

            mockRequest.body = {
                name: 'test9',
                email: 'test9@test.com',
                password: '123456',
                password2: '123456',
            };
            await userController.createUser(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(200);
            resetReqResMock();

            const user = await userService.getUser('test9@test.com');
            mockRequest.params = { id: user[0].user_id };
            await userController.deleteUser(mockRequest, mockResponse);

            expect(resultStatus).to.be.a('number').equal(200);
            expect(resultJson)
                .to.be.a('object')
                .to.have.property('user')
                .to.be.a('array')
                .lengthOf(1);
            expect(resultJson.user[0]).to.have.property('user_id').equal(user[0].user_id);
            expect(resultJson.user[0]).to.have.property('name').to.be.a('string').equal('test9');
            expect(resultJson.user[0])
                .to.have.property('email')
                .to.be.a('string')
                .equal('test9@test.com');
            expect(resultJson.user[0])
                .to.have.property('password')
                .to.be.a('string')
                .not.equal('123456');
            expect(resultJson.user[0]).to.have.property('avatar').to.be.a('string');
        });

        it('Should return an empty array if cant find a user to delete', async () => {
            const userService = new UserService({ db: dbMemory });
            const userController = new UserController({ userService, validationResult });
            mockRequest.params = { id: 9999 };
            await userController.deleteUser(mockRequest, mockResponse);
            expect(resultStatus).to.be.a('number').equal(200);
            expect(resultJson)
                .to.be.a('object')
                .to.have.property('user')
                .to.be.a('array')
                .lengthOf(0);
        });

        it('Should return server error if cant connect to database', async () => {
            const userService = new UserService({});
            const userController = new UserController({ userService, validationResult });

            mockRequest.user = { id: 'test8@test.com' };

            await userController.deleteUser(mockRequest, mockResponse);

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
