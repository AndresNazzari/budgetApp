import awilix from 'awilix';
import { db } from './config/db_connection.js';
import UserService from './services/user.service.js';
import UserController from './controllers/user.controller.js';

//create container
const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
});

function setup() {
    //register services
    container.register({
        userController: awilix.asClass(UserController),
        userService: awilix.asClass(UserService),

        //register db connection
        db: awilix.asValue(db),
    });
}

export { container, setup };
