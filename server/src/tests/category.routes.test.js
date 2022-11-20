import chai, { expect, should } from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
chai.use(chaiHttp);
import app, { appServer } from '../../index.js';

describe('Category Routes', () => {
    const category1 = { name: 'Category 1' };
    const user2 = {
        name: 'test2',
        email: 'test2@test.com',
        password: '123456',
        password2: '123456',
    };
    let user1Token = '';

    before((done) => {
        supertest(app)
            .post('/api/user')
            .send(user2)
            .end((err, res) => {
                expect(res).to.have.status(200);
                user1Token = res.body.token;
                done();
            });
    });

    after(() => {
        appServer.close();
    });

    describe('POST /api/category', () => {
        it('Should create a new category', (done) => {
            supertest(app)
                .post('/api/category')
                .set('x-auth-token', user1Token)
                .send(category1)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body)
                        .to.be.a('object')
                        .to.have.property('msg')
                        .to.equal('Category created');
                    done();
                });
        });
        it('Should get a error is token is invalid', (done) => {
            supertest(app)
                .post('/api/category')
                .set('x-auth-token', 'invalidToken')
                .send({ name: 'Category 1' })
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
                .post('/api/category')
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

    describe('GET /api/category', () => {
        it('Should get all categories', (done) => {
            supertest(app)
                .get('/api/category')
                .set('x-auth-token', user1Token)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body)
                        .to.be.an('object')
                        .to.have.property('categories')
                        .to.be.a('array')
                        .lengthOf(1);
                    expect(res.body.categories[0])
                        .to.be.a('object')
                        .to.have.property('name')
                        .to.equal(category1.name);
                    expect(res.body.categories[0])
                        .to.have.property('category_id')
                        .to.be.a('number');
                    done();
                });
        });
        it('Should get a error is token is invalid', (done) => {
            supertest(app)
                .get('/api/category')
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
                .get('/api/category')
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
