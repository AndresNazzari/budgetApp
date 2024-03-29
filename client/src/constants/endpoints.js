// const URL = 'https://budgetapp-production.up.railway.app';
const URL = 'https://budget-app-five-brown.vercel.app';
// const URL = 'https://localhost';

export const Endpoints = {
    GET_USER: `${URL}/api/user`,
    GET_INCOMES: `${URL}/api/income`,
    GET_EXPENSES: `${URL}/api/expense`,
    GET_CATEGORIES: `${URL}/api/category`,
    POST_AUTH_USER: `${URL}/api/user/auth`,
    POST_SIGNUP_USER: `${URL}/api/user`,
    POST_INCOME: `${URL}/api/income`,
    POST_EXPENSE: `${URL}/api/expense`,
    DELETE_INCOME: `${URL}/api/income`,
    DELETE_EXPENSE: `${URL}/api/expense`,
    PUT_INCOME: `${URL}/api/income`,
    PUT_EXPENSE: `${URL}/api/expense`,
};
