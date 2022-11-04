import awilix from 'awilix';
import { db } from './config/db_connection.js';
import UserRoute from './routes/api/user.route.js';
import CategoryRoute from './routes/api/category.route.js';
import ExpenseRoute from './routes/api/expense.route.js';
import IncomeRoute from './routes/api/income.route.js';

import UserController from './controllers/user.controller.js';
import CategoryController from './controllers/category.controller.js';
import ExpenseController from './controllers/expense.controller.js';
import IncomeController from './controllers/income.controller.js';

import UserService from './services/user.service.js';
import CategoryService from './services/category.service.js';
import ExpenseService from './services/expense.service.js';
import IncomeService from './services/income.service.js';

//create container
const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
});

function setup() {
    container.register({
        //routes
        userRoute: awilix.asClass(UserRoute),
        categoryRoute: awilix.asClass(CategoryRoute),
        expenseRoute: awilix.asClass(ExpenseRoute),
        incomeRoute: awilix.asClass(IncomeRoute),

        //controllers
        userController: awilix.asClass(UserController),
        categoryController: awilix.asClass(CategoryController),
        expenseController: awilix.asClass(ExpenseController),
        incomeController: awilix.asClass(IncomeController),

        //services
        userService: awilix.asClass(UserService),
        categoryService: awilix.asClass(CategoryService),
        expenseService: awilix.asClass(ExpenseService),
        incomeService: awilix.asClass(IncomeService),

        // inject knexjs object with database connection pooling
        db: awilix.asValue(db),
    });
}

export { container, setup };
