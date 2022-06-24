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

export const loadUserAction = () => async (dispatch) => {};

export const login = (email, password) => async (dispatch, getState) => {};

export const logout = () => async (dispatch, getState) => {};

export const signup =
    ({ name, email, password }) =>
    async (dispatch, getState) => {};
