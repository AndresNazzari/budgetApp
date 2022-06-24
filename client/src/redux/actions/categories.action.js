import axios from 'axios';
import {
    requestCategories,
    requestSuccess,
    requestFailed,
    createCategory,
    removeCategory,
} from '../states/category.state';
import { Endpoints } from '../../constants/endpoints';
import { setAlertAction } from '../actions/alert.action';

export const loadCategoriesAction = () => async (dispatch) => {
    try {
        dispatch(requestCategories());
        const response = await axios.get(Endpoints.GET_CATEGORIES);
        dispatch(requestSuccess(response.data));
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlertAction(error.msg, 'danger')));
        }
        dispatch(requestFailed(errors));
    }
};
