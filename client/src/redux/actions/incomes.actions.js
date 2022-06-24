import axios from 'axios';
import {
    requestIncome,
    requestIncomeSuccess,
    requestIncomesSuccess,
    requestUpdateIncomeSuccess,
    requestIncomeFailed,
    requestRemoveIncomeSuccess,
} from '../states/income.state';
import { Endpoints } from '../../constants/endpoints';
import { setAlertAction } from '../actions/alert.action';

export const getAllIncomesAction = (user_id) => async (dispatch) => {
    dispatch(requestIncome());
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const params = { params: { user_id } };
        const response = await axios.get(Endpoints.GET_INCOMES, params, config);

        dispatch(requestIncomesSuccess(response.data.incomes));
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlertAction(error.msg, 'danger')));
        }
        dispatch(requestIncomeFailed(errors));
    }
};

export const addIncomeAction = (income) => async (dispatch) => {
    dispatch(requestIncome());
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const body = JSON.stringify(income);
        const response = await axios.post(Endpoints.POST_INCOME, body, config);
        dispatch(requestIncomeSuccess(response.data.newIncome));
        dispatch(setAlertAction(response.data.msg, 'success'));
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlertAction(error.msg, 'danger')));
        }
        dispatch(requestIncomeFailed(errors));
    }
};

export const removeIncomeAction =
    ({ income_id }) =>
    async (dispatch) => {
        dispatch(requestIncome());
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const response = await axios.delete(Endpoints.DELETE_INCOME + `/${income_id}`, config);

            dispatch(requestRemoveIncomeSuccess(income_id));
            dispatch(setAlertAction(response.data.msg, 'success'));
        } catch (error) {
            const errors = error.response.data.errors;
            if (errors) {
                errors.forEach((error) => dispatch(setAlertAction(error.msg, 'danger')));
            }
            dispatch(requestIncomeFailed(errors));
        }
    };

export const editIncomeAction = (income, income_id) => async (dispatch) => {
    dispatch(requestIncome());
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const body = JSON.stringify(income);
        const response = await axios.put(Endpoints.PUT_INCOME + `/${income_id}`, body, config);
        dispatch(requestUpdateIncomeSuccess({ ...income, income_id }));
        dispatch(setAlertAction(response.data.msg, 'success'));
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlertAction(error.msg, 'danger')));
        }
        dispatch(requestIncomeFailed(errors));
    }
};
