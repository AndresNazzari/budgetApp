import chai, { expect, should } from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
chai.use(chaiHttp);
import app, { appServer } from '../../index.js';

describe('Expense Routes', () => {
    const user = {
        name: 'test4',
        email: 'test4@test.com',
        password: '123456',
        password2: '123456',
    };
    let userToken = '';
    const expense1 = {
        concept: 'Test Concept 4',
        amount: 100,
        date: '2021-01-01',
        category_id: 1,
        user_id: 1,
    };
    const expenseUpdated = {
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

    describe('POST /api/expense', () => {
        it('Should create a new expense', (done) => {
            supertest(app)
                .post('/api/expense')
                .set('x-auth-token', userToken)
                .send(expense1)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body)
                        .to.be.a('object')
                        .to.have.property('msg')
                        .to.equal('Expense created');
                    expect(res.body)
                        .to.be.a('object')
                        .to.have.property('newExpense')
                        .to.be.a('object');
                    expect(res.body.newExpense).to.have.property('expense_id').to.be.a('number');
                    expect(res.body.newExpense)
                        .to.have.property('concept')
                        .to.be.a('string')
                        .equal(expense1.concept);
                    expect(res.body.newExpense)
                        .to.have.property('amount')
                        .to.be.a('number')
                        .equal(expense1.amount);
                    expect(res.body.newExpense)
                        .to.have.property('date')
                        .to.be.a('string')
                        .equal(expense1.date);
                    expect(res.body.newExpense)
                        .to.have.property('category_id')
                        .to.be.a('number')
                        .equal(expense1.category_id);
                    expect(res.body.newExpense)
                        .to.have.property('user_id')
                        .to.be.a('number')
                        .equal(expense1.user_id);
                    done();
                });
        });
        it('Should get a error is token is invalid', (done) => {
            supertest(app)
                .post('/api/expense')
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
                .post('/api/expense')
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
                .post('/api/expense')
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

    describe('GET /api/expense?user_id=1', () => {
        it('Should get all expenses of user id 1', (done) => {
            supertest(app)
                .get('/api/expense')
                .query({ user_id: 1 })
                .set('x-auth-token', userToken)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body)
                        .to.be.an('object')
                        .to.have.property('expenses')
                        .to.be.an('array');
                    expect(res.body.expenses).not.lengthOf(0);
                    expect(res.body.expenses[0]).to.have.property('expense_id').to.be.a('number');
                    expect(res.body.expenses[0]).to.have.property('concept').to.be.a('string');
                    expect(res.body.expenses[0]).to.have.property('amount');
                    expect(res.body.expenses[0]).to.have.property('date').to.be.a('string');
                    expect(res.body.expenses[0]).to.have.property('category_id').to.be.a('number');
                    expect(res.body.expenses[0]).to.have.property('user_id').to.be.a('number');
                    done();
                });
        });
        it('Should get a error is token is invalid', (done) => {
            supertest(app)
                .get('/api/expense')
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
                .get('/api/expense')
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

    describe('PUT /api/expense/:id', () => {
        it('Should update an expense', (done) => {
            supertest(app)
                .put('/api/expense/1')
                .set('x-auth-token', userToken)
                .send(expenseUpdated)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body)
                        .to.be.a('object')
                        .to.have.property('msg')
                        .to.equal('Expense updated');
                    done();
                });
        });
        it('Should get a error is token is invalid', (done) => {
            supertest(app)
                .put('/api/expense/1')
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
                .put('/api/expense/1')
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
                .put('/api/expense/1')
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

    describe('DELETE /api/expense/:id', () => {
        it('Should delete expense with id 1', (done) => {
            supertest(app)
                .delete('/api/expense/1')
                .set('x-auth-token', userToken)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body)
                        .to.be.a('object')
                        .to.have.property('msg')
                        .to.equal('Expense removed');
                    done();
                });
        });
        it('Should get a error is token is invalid', (done) => {
            supertest(app)
                .delete('/api/expense/1')
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
                .delete('/api/expense/1')
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
