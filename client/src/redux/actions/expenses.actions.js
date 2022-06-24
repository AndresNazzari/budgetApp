import axios from 'axios';
import {
    requestExpense,
    requestExpenseSuccess,
    requestExpensesSuccess,
    requestUpdateExpenseSuccess,
    requestExpenseFailed,
    requestRemoveExpenseSuccess,
} from '../states/expense.state';
import { Endpoints } from '../../constants/endpoints';
import { setAlertAction } from '../actions/alert.action';

export const getAllExpensesAction = (user_id) => async (dispatch) => {
    dispatch(requestExpense());
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const params = { params: { user_id } };
        const response = await axios.get(Endpoints.GET_EXPENSES, params, config);

        dispatch(requestExpensesSuccess(response.data.expenses));
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlertAction(error.msg, 'danger')));
        }
        dispatch(requestExpenseFailed(errors));
    }
};

export const addExpenseAction = (expense) => async (dispatch) => {
    dispatch(requestExpense());
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const body = JSON.stringify(expense);
        const response = await axios.post(Endpoints.POST_EXPENSE, body, config);
        dispatch(requestExpenseSuccess(response.data.newExpense));
        dispatch(setAlertAction(response.data.msg, 'success'));
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlertAction(error.msg, 'danger')));
        }
        dispatch(requestExpenseFailed(errors));
    }
};

export const removeExpenseAction =
    ({ expense_id }) =>
    async (dispatch) => {
        dispatch(requestExpense());
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const response = await axios.delete(
                Endpoints.DELETE_EXPENSE + `/${expense_id}`,
                config
            );
            dispatch(requestRemoveExpenseSuccess(expense_id));
            dispatch(setAlertAction(response.data.msg, 'success'));
        } catch (error) {
            const errors = error.response.data.errors;
            if (errors) {
                errors.forEach((error) => dispatch(setAlertAction(error.msg, 'danger')));
            }
            dispatch(requestExpenseFailed(errors));
        }
    };

export const editExpenseAction = (expense, expense_id) => async (dispatch) => {
    dispatch(requestExpense());
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const body = JSON.stringify({ ...expense, expense_id });
        const response = await axios.put(Endpoints.PUT_EXPENSE + `/${expense_id}`, body, config);
        dispatch(requestUpdateExpenseSuccess({ ...expense, expense_id }));
        dispatch(setAlertAction(response.data.msg, 'success'));
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlertAction(error.msg, 'danger')));
        }
        dispatch(requestExpenseFailed(errors));
    }
};
