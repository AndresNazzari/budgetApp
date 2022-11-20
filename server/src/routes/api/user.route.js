import express from 'express';
import { check } from 'express-validator';
import auth from '../../middleware/auth.middleware.js';

export default class UserRoute extends express.Router {
    constructor({ userController }) {
        super();
        // this.userController = new UserController();
        this.userController = userController;

        //@route    POST api/user
        //@desc     Register User
        //@access   Public
        this.post(
            '/',
            [
                check('name', 'Name is Required').not().isEmpty(),
                check('email', 'Please include a valid email').isEmail(),
                check('password', 'Please enter a password with 6 or more characters').isLength({
                    min: 6,
                }),
                check('password2', 'Please enter a password with 6 or more characters').isLength({
                    min: 6,
                }),
            ],
            this.userController.createUser
        );

        //@route    POST api/user/auth
        //@desc     Authenticate user & get token
        //@access   Public
        this.post(
            '/auth',
            [
                check('email', 'Please include a valid email.').isEmail(),
                check('password', 'Please enter a password.').exists(),
                check('password', 'Please enter a valid password.').isLength({
                    min: 6,
                }),
            ],
            this.userController.loginUser
        );

        //@route    GET api/user/
        //@desc     Get user by email
        //@access   Public
        this.get('/', auth, this.userController.getUser);

        //@route    DELETE api/user/
        //@desc     Delete user by email
        //@access   Public
        this.delete('/:id', auth, this.userController.deleteUser);
    }
}
