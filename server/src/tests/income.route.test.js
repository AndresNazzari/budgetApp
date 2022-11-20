import chai, { expect, should } from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
chai.use(chaiHttp);
import app, { appServer } from '../../index.js';

describe('Income Routes', () => {
    const user = {
        name: 'test3',
        email: 'test3@test.com',
        password: '123456',
        password2: '123456',
    };
    let userToken = '';
    const income1 = {
        concept: 'Test Concept 1',
        amount: 100,
        date: '2021-01-01',
        category_id: 1,
        user_id: 1,
    };
    const incomeUpdated = {
        concept: 'Test Concept Updated',
        amount: 999,
        date: '2021-09-22',
        category_id: 2,
        user_id: 1,
    };

    before((done) => {
        supertest(app)
            .post('/api/user')
            .send(user)
            .end((err, res) => {
                userToken = res.body.token;
                done();
            });
    });

    after(() => {
        appServer.close();
    });

    describe('POST /api/income', () => {
        it('Should create a new income', (done) => {
            supertest(app)
                .post('/api/income')
                .set('x-auth-token', userToken)
                .send(income1)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body)
                        .to.be.a('object')
                        .to.have.property('msg')
                        .to.equal('Income created');
                    expect(res.body)
                        .to.be.a('object')
                        .to.have.property('newIncome')
                        .to.be.a('object');
                    expect(res.body.newIncome).to.have.property('income_id').to.be.a('number');
                    expect(res.body.newIncome)
                        .to.have.property('concept')
                        .to.be.a('string')
                        .equal(income1.concept);
                    expect(res.body.newIncome)
                        .to.have.property('amount')
                        .to.be.a('number')
                        .equal(income1.amount);
                    expect(res.body.newIncome)
                        .to.have.property('date')
                        .to.be.a('string')
                        .equal(income1.date);
                    expect(res.body.newIncome)
                        .to.have.property('category_id')
                        .to.be.a('number')
                        .equal(income1.category_id);
                    expect(res.body.newIncome)
                        .to.have.property('user_id')
                        .to.be.a('number')
                        .equal(income1.user_id);
                    done();
                });
        });
        it('Should get a error is token is invalid', (done) => {
            supertest(app)
                .post('/api/income')
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
                .post('/api/income')
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
        it('Should get error if express-validators get an error', (done) => {
            supertest(app)
                .post('/api/income')
                .set('x-auth-token', userToken)
                .send({})
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('errors').to.be.an('array');
                    expect(res.body.errors[0])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('Concept is Required');
                    expect(res.body.errors[1])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('Amount is Required');
                    expect(res.body.errors[2])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('Date is Required');
                    expect(res.body.errors[3])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('Category is Required');
                    expect(res.body.errors[4])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('User ID is Required');
                    done();
                });
        });
    });

    describe('GET /api/income?user_id=1', () => {
        it('Should get all incomes of user id 1', (done) => {
            supertest(app)
                .get('/api/income')
                .query({ user_id: 1 })
                .set('x-auth-token', userToken)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body)
                        .to.be.an('object')
                        .to.have.property('incomes')
                        .to.be.an('array');
                    expect(res.body.incomes).not.lengthOf(0);
                    expect(res.body.incomes[0]).to.have.property('income_id').to.be.a('number');
                    expect(res.body.incomes[0]).to.have.property('concept').to.be.a('string');
                    expect(res.body.incomes[0]).to.have.property('amount');
                    expect(res.body.incomes[0]).to.have.property('date').to.be.a('string');
                    expect(res.body.incomes[0]).to.have.property('category_id').to.be.a('number');
                    expect(res.body.incomes[0]).to.have.property('user_id').to.be.a('number');
                    done();
                });
        });
        it('Should get a error is token is invalid', (done) => {
            supertest(app)
                .get('/api/income')
                .query({ user_id: 1 })
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
                .get('/api/income')
                .query({ user_id: 1 })
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

    describe('PUT /api/income/:id', () => {
        it('Should update an income', (done) => {
            supertest(app)
                .put('/api/income/1')
                .set('x-auth-token', userToken)
                .send(incomeUpdated)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body)
                        .to.be.a('object')
                        .to.have.property('msg')
                        .to.equal('Income updated');
                    done();
                });
        });
        it('Should get a error is token is invalid', (done) => {
            supertest(app)
                .put('/api/income/1')
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
                .put('/api/income/1')
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
        it('Should get error if express-validators get an error', (done) => {
            supertest(app)
                .put('/api/income/1')
                .set('x-auth-token', userToken)
                .send({})
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('errors').to.be.an('array');
                    expect(res.body.errors[0])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('Concept is Required');
                    expect(res.body.errors[1])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('Amount is Required');
                    expect(res.body.errors[2])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('Date is Required');
                    expect(res.body.errors[3])
                        .to.have.property('msg')
                        .to.be.a('string')
                        .equal('Category is Required');
                    done();
                });
        });
    });

    describe('DELETE /api/income/:id', () => {
        it('Should delete income with id 1', (done) => {
            supertest(app)
                .delete('/api/income/1')
                .set('x-auth-token', userToken)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body)
                        .to.be.a('object')
                        .to.have.property('msg')
                        .to.equal('Income removed');
                    done();
                });
        });
        it('Should get a error is token is invalid', (done) => {
            supertest(app)
                .delete('/api/income/1')
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
                .delete('/api/income/1')
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
