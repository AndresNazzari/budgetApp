import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';

export default class UserService {
    constructor({ db }) {
        this.db = db;
    }

    async userExists(email) {
        return await this.db.select('*').from('users').where('email', email);
    }

    async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    async encryptPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    async addUser(name, email, avatar = '', password) {
        return await this.db('users').insert({
            name,
            email,
            avatar,
            password,
            created_at: new Date(),
        });
    }

    generateToken(email) {
        const payload = { user: { id: email } };
        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 60 /*seconds*/ * 60 * 24,
        });
    }

    getGravatar(email) {
        return gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm',
        });
    }

    async getUser(email) {
        return await this.db
            .select('user_id', 'name', 'email', 'avatar')
            .from('users')
            .where('email', email);
    }
}
