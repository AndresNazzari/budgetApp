import chai, { expect, should } from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
chai.use(chaiHttp);
import app, { appServer } from '../../index.js';

describe('User Route', () => {
    const user1 = {
        name: 'test1',
        email: 'test1@test.com',
        password: '123456',
        password2: '123456',
    };
    let user1Token = '';

    after(() => {
        appServer.close();
    });

    describe('POST api/users', () => {
        it('Should post a new user', (done) => {
            supertest(app)
                .post('/api/user')
                .send(user1)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('token').to.be.a('string');
                    done();
                });
        });

        it('Should get error trying to post new user with email already registered', (done) => {
            supertest(app)
                .post('/api/user')
                .send(user1)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('errors').to.be.an('array');
                    expect(res.body.errors[0])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('Email already registered');
                    done();
                });
        });

        //se testea esto porque no es algo que verifique express-validator
        it('Should get error trying to post new user if passwors do not match', (done) => {
            supertest(app)
                .post('/api/user')
                .send({
                    name: 'test',
                    email: 'test@test.com',
                    password: '123456',
                    password2: '1234567',
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('errors').to.be.an('array');
                    expect(res.body.errors[0])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('Passwords do not match');
                    done();
                });
        });
        //NO se testean todas lasvalidaciones de express-validator, se asume que la libreria cumple su funcion
        it('Should get error if express-validators get an error', (done) => {
            supertest(app)
                .post('/api/user')
                .send({
                    name: '',
                    email: 'test@test.com',
                    password: '123',
                    password2: '1234567',
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('errors').to.be.an('array');
                    expect(res.body.errors[0])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('Name is Required');
                    expect(res.body.errors[1])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('Please enter a password with 6 or more characters');
                    done();
                });
        });
    });

    describe('GET api/users', () => {
        it('Should auth a user', (done) => {
            supertest(app)
                .post('/api/user/auth')
                .send({
                    email: user1.email,
                    password: user1.password,
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('token').to.be.a('string');
                    user1Token = res.body.token;
                    done();
                });
        });

        it('Should get error if email does not exists', (done) => {
            supertest(app)
                .post('/api/user/auth')
                .send({
                    email: 'user1@user1.com',
                    password: user1.password,
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property('errors').to.be.an('array');
                    expect(res.body.errors[0])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('Invalid Credentials');
                    done();
                });
        });

        it('Should get error if passwors does not match with db', (done) => {
            supertest(app)
                .post('/api/user/auth')
                .send({
                    email: user1.email,
                    password: '999999',
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property('errors').to.be.an('array');
                    expect(res.body.errors[0])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('Invalid Credentials');
                    done();
                });
        });

        //NO se testean todas lasvalidaciones de express-validator, se asume que la libreria cumple su funcion
        it('Should get error if express-validators get an error', (done) => {
            supertest(app)
                .post('/api/user/auth')
                .send({
                    email: 'testest.com',
                    password: '123',
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('errors').to.be.an('array');
                    expect(res.body.errors[0])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('Please include a valid email.');
                    expect(res.body.errors[1])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('Please enter a valid password.');
                    done();
                });
        });
    });

    describe('GET api/users', () => {
        it('Should get a user with a valid token.', (done) => {
            supertest(app)
                .get('/api/user')
                .set('x-auth-token', user1Token)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('user').to.be.an('object');
                    expect(res.body.user)
                        .to.have.property('name')
                        .to.be.a('string')
                        .equal(user1.name);
                    expect(res.body.user)
                        .to.have.property('email')
                        .to.be.a('string')
                        .equal(user1.email);
                    expect(res.body.user).to.have.property('password').to.be.a('string');
                    expect(res.body.user)
                        .to.have.property('avatar')
                        .to.be.a('string')
                        .to.match(/www.gravatar.com/);
                    done();
                });
        });

        it('Should get a error is token is invalid', (done) => {
            supertest(app)
                .get('/api/user')
                .set('x-auth-token', 'invalidToken')
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property('errors').to.be.an('array');
                    expect(res.body.errors[0])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('Token is not valid');
                    done();
                });
        });

        it('Should get a error is not token set', (done) => {
            supertest(app)
                .get('/api/user')
                // .set('x-auth-token', 'invalidToken')
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property('errors').to.be.an('array');
                    expect(res.body.errors[0])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('No token set, authorization denied');
                    done();
                });
        });
    });

    describe('DELETE api/users', () => {
        it('Should delete a user', (done) => {
            supertest(app)
                .get('/api/user')
                .set('x-auth-token', user1Token)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('user').to.be.an('object');
                    expect(res.body.user)
                        .to.have.property('name')
                        .to.be.a('string')
                        .equal(user1.name);
                    expect(res.body.user)
                        .to.have.property('email')
                        .to.be.a('string')
                        .equal(user1.email);
                    expect(res.body.user).to.have.property('password').to.be.a('string');
                    expect(res.body.user)
                        .to.have.property('avatar')
                        .to.be.a('string')
                        .to.match(/www.gravatar.com/);
                    done();
                });
        });

        it('Should get a error is token is invalid', (done) => {
            supertest(app)
                .get('/api/user')
                .set('x-auth-token', 'invalidToken')
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property('errors').to.be.an('array');
                    expect(res.body.errors[0])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('Token is not valid');
                    done();
                });
        });

        it('Should get a error is not token set', (done) => {
            supertest(app)
                .get('/api/user')
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property('errors').to.be.an('array');
                    expect(res.body.errors[0])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('No token set, authorization denied');
                    done();
                });
        });
    });
});
