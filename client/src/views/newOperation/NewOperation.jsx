import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FetchState } from '../../constants/fetchState';
import OperationForm from '../../components/operationForm/OperationForm';
import Dashboard from '../../components/dashboard/Dashboard';
import Alert from '../../components/alert/Alert';
import Spinner from '../../components/spinner/Spinner';
import { loadCategoriesAction } from '../../redux/actions/categories.action';

const NewOperation = () => {
    const dispatch = useDispatch();
    const fetchingStateUser = useSelector((store) => store.userReducer.fetchState);
    const fetchingStateIncomes = useSelector((store) => store.incomeReducer.fetchState);
    const fetchingStateExpenses = useSelector((store) => store.expenseReducer.fetchState);
    const fetchingStateCategories = useSelector((store) => store.categoryReducer.fetchState);

    useEffect(() => {
        dispatch(loadCategoriesAction());
    }, [dispatch]);

    return (
        <Dashboard>
            {fetchingStateUser !== FetchState.FETCHED ||
            fetchingStateIncomes !== FetchState.FETCHED ||
            fetchingStateExpenses !== FetchState.FETCHED ||
            fetchingStateCategories !== FetchState.FETCHED ? (
                <Spinner />
            ) : (
                <>
                    <Alert />
                    <OperationForm />
                </>
            )}
        </Dashboard>
    );
};

export default NewOperation;
