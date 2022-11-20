import awilix from 'awilix';
import { validationResult } from 'express-validator';
import { db } from './src/config/db_connection.js';
import { dbMemory } from './src/utils/test-utils.js';
import UserRoute from './src/routes/api/user.route.js';
import CategoryRoute from './src/routes/api/category.route.js';
import ExpenseRoute from './src/routes/api/expense.route.js';
import IncomeRoute from './src/routes/api/income.route.js';

import UserController from './src/controllers/user.controller.js';
import CategoryController from './src/controllers/category.controller.js';
import ExpenseController from './src/controllers/expense.controller.js';
import IncomeController from './src/controllers/income.controller.js';

import UserService from './src/services/user.service.js';
import CategoryService from './src/services/category.service.js';
import ExpenseService from './src/services/expense.service.js';
import IncomeService from './src/services/income.service.js';

//create container
const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
});

function depInySetup() {
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
        db: process.env.NODE_ENV == 'test' ? awilix.asValue(dbMemory) : awilix.asValue(db),

        //inject express validator
        validationResult: awilix.asValue(validationResult),
    });
}

export { container, depInySetup };
