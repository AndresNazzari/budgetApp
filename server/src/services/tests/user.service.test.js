import { expect } from 'chai';
import UserService from '../user.service.js';
import knex from 'knex';
import { dbMemoryConfig } from '../../utils/test-utils.js';
import { createTables } from '../../config/createTables.js';

describe('User service test', () => {
    let dbMemory;

    before(async () => {
        dbMemory = knex(dbMemoryConfig);
        await createTables(dbMemory);
    });

    after(async () => {
        await dbMemory.destroy();
    });

    it('Should encrypt password', async () => {
        const userService = new UserService({ db: null });
        const password = '1234567890';
        const hash = await userService.encryptPassword(password);
        expect(hash).to.be.a('string').to.have.lengthOf(60).not.equal(password);
    });

    after(async () => {
        await dbMemory.destroy();
    });

    it('Should compare password and encrypted password', async () => {
        const userService = new UserService({ db: null });
        const password = '1234567890';
        const hash = await userService.encryptPassword(password);

        const isMatch = await userService.comparePassword(password, hash);
        expect(isMatch).to.be.a('boolean').equal(true);
    });

    it('Should generate token', () => {
        const userService = new UserService({ db: null });
        const email = 'test1@email.com';
        const token = userService.generateToken(email);
        expect(token).to.be.a('string').not.equal(email);
    });

    it('Should get gravatar', () => {
        const userService = new UserService({ db: null });
        const email = 'test2@email.com';
        const gravatar = userService.getGravatar(email);
        const gravatarWeb = gravatar.slice(2, 18);
        expect(gravatar).to.be.a('string');
        expect(gravatarWeb).equal('www.gravatar.com');
    });

    it('Should add user', async () => {
        const userService = new UserService({ db: dbMemory });
        const userId = await userService.addUser('Test Name', 'test3@email.com', '', 1234567890);
        expect(userId).to.be.a('array').to.have.lengthOf(1);
        expect(userId[0]).to.be.a('number');
    });

    it('Should get user by ID', async () => {
        const userService = new UserService({ db: dbMemory });
        const { name, email, avatar, password } = {
            name: 'Test Name',
            email: 'test4@email.com',
            avatar: userService.getGravatar('test4@email.com'),
            password: await userService.encryptPassword('123456789'),
        };
        const userId = await userService.addUser(name, email, avatar, password);
        const user = await userService.getUserById(userId[0]);

        expect(user).to.be.a('array').to.have.lengthOf(1);
        expect(user[0]).to.be.a('object');
        expect(user[0]).to.have.property('user_id').to.be.a('number').equal(userId[0]);
        expect(user[0]).to.have.property('name').to.be.a('string').equal(name);
        expect(user[0]).to.have.property('email').to.be.a('string').equal(email);
        expect(user[0]).to.have.property('avatar').to.be.a('string').equal(avatar);
        expect(user[0]).to.have.property('password').to.be.a('string').equal(password);
    });

    it('Should get user by email', async () => {
        const userService = new UserService({ db: dbMemory });
        const { name, email, avatar, password } = {
            name: 'Test Name',
            email: 'test5@email.com',
            avatar: userService.getGravatar('test5@email.com'),
            password: await userService.encryptPassword('123456789'),
        };
        await userService.addUser(name, email, avatar, password);
        const user = await userService.getUser(email);

        expect(user).to.be.a('array').to.have.lengthOf(1);
        expect(user[0]).to.be.a('object');
        expect(user[0]).to.have.property('user_id').to.be.a('number');
        expect(user[0]).to.have.property('name').to.be.a('string').equal(name);
        expect(user[0]).to.have.property('email').to.be.a('string').equal(email);
        expect(user[0]).to.have.property('avatar').to.be.a('string').equal(avatar);
        expect(user[0]).to.have.property('password').to.be.a('string').equal(password);
    });

    it('Should check if user exists by Email', async () => {
        const userService = new UserService({ db: dbMemory });
        const { name, email, avatar, password } = {
            name: 'Test Name',
            email: 'test6@email.com',
            avatar: userService.getGravatar('test6@email.com'),
            password: await userService.encryptPassword('123456789'),
        };
        await userService.addUser(name, email, avatar, password);

        const noExists = await userService.userExists('userNoExists@email.com');
        expect(noExists).to.be.a('array').to.have.lengthOf(0);

        const exists = await userService.userExists(email);

        expect(exists).to.be.a('array').to.have.lengthOf(1);
        expect(exists[0]).to.be.a('object');
        expect(exists[0]).to.have.property('user_id').to.be.a('number');
        expect(exists[0]).to.have.property('name').to.be.a('string').equal(name);
        expect(exists[0]).to.have.property('email').to.be.a('string').equal(email);
        expect(exists[0]).to.have.property('avatar').to.be.a('string').equal(avatar);
        expect(exists[0]).to.have.property('password').to.be.a('string').equal(password);
    });

    it('Should delete user by ID', async () => {
        const userService = new UserService({ db: dbMemory });
        const { name, email, avatar, password } = {
            name: 'Test Name',
            email: 'test7@email.com',
            avatar: userService.getGravatar('test7@email.com'),
            password: await userService.encryptPassword('123456789'),
        };
        const user = await userService.addUser(name, email, avatar, password);

        const deleted = await userService.deleteUserById(user[0]);
        expect(deleted).to.be.a('number').equal(1);

        const noExists = await userService.userExists(email);
        expect(noExists).to.be.a('array').to.have.lengthOf(0);
    });
});
