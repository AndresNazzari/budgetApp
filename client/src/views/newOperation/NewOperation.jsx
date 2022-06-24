import React from 'react';
import { useSelector } from 'react-redux';
import { FetchState } from '../../constants/fetchState';
import OperationForm from '../../components/operationForm/OperationForm';
import Dashboard from '../../components/dashboard/Dashboard';
import Alert from '../../components/alert/Alert';
import Spinner from '../../components/spinner/Spinner';

const NewOperation = () => {
    const fetchingStateUser = useSelector((store) => store.userReducer.fetchState);
    const fetchingStateIncomes = useSelector((store) => store.incomeReducer.fetchState);
    const fetchingStateExpenses = useSelector((store) => store.expenseReducer.fetchState);
    const fetchingStateCategories = useSelector((store) => store.categoriesReducer.fetchState);

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
