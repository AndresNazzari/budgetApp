import axios from 'axios';
import {
    clearLogin,
    requestLogin,
    requestLoginSuccess,
    requestLoginFailed,
    requestLoadSuccess,
} from '../states/user.state';
import { Endpoints } from '../../constants/endpoints';
import setAuthToken from '../../util/setAuthToken';
import { setAlertAction } from '../actions/alert.action';

export const loadUserAction = () => async (dispatch) => {
    if (localStorage.userToken) {
        setAuthToken(localStorage.userToken);
        try {
            dispatch(requestLogin());
            const response = await axios.get(Endpoints.GET_USER);
            dispatch(requestLoadSuccess(response.data));
        } catch (error) {
            const errors = error.response.data.errors;
            if (errors) {
                errors.forEach((error) => dispatch(setAlertAction(error.msg, 'danger')));
            }
            dispatch(requestLoginFailed(errors));
        }
    }
};

export const login = (email, password) => async (dispatch, getState) => {
    dispatch(requestLogin());
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const body = JSON.stringify({ email, password });
        const res = await axios.post(Endpoints.POST_AUTH_USER, body, config);
        dispatch(requestLoginSuccess(res.data));
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlertAction(error.msg, 'danger')));
        }
        dispatch(requestLoginFailed(errors));
    }
};

export const logout = () => async (dispatch, getState) => {
    dispatch(clearLogin());
};

export const signup =
    ({ name, email, password }) =>
    async (dispatch, getState) => {
        dispatch(requestLogin());
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const body = JSON.stringify({ name, email, password });
            const res = await axios.post(Endpoints.POST_SIGNUP_USER, body, config);
            dispatch(requestLoginSuccess(res.data));
        } catch (error) {
            const errors = error.response.data.errors;
            if (errors) {
                errors.forEach((error) => dispatch(setAlertAction(error.msg, 'danger')));
            }
            dispatch(requestLoginFailed(errors));
        }
    };
