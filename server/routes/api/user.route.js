import express from 'express';
import UserController from '../../controllers/user.controller.js';
import { check } from 'express-validator';
import auth from '../../middleware/auth.middleware.js';

export class UserRoute extends express.Router {
    constructor() {
        super();
        this.userController = new UserController();

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
                    min: 3,
                }),
            ],
            this.userController.loginUser
        );

        //@route    GET api/user/
        //@desc     Get user by email
        //@access   Public
        this.get('/', auth, this.userController.getUser);
    }
}
