import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FetchState } from '../../constants/fetchState';
import Dashboard from '../../components/dashboard/Dashboard';
import Spinner from '../../components/spinner/Spinner';
import OperationList from '../../components/operationList/OperationList.jsx';
import Alert from '../../components/alert/Alert';

const Operations = () => {
    const fetchingStateUser = useSelector((store) => store.userReducer.fetchState);
    const fetchingStateIncomes = useSelector((store) => store.incomeReducer.fetchState);
    const fetchingStateExpenses = useSelector((store) => store.expenseReducer.fetchState);
    const fetchingStateCategories = useSelector((store) => store.categoriesReducer.fetchState);

    const incomes = useSelector((store) => store.incomeReducer.incomes);
    const expenses = useSelector((store) => store.expenseReducer.expenses);
    const { op } = useParams();

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
                    <OperationList list={op === 'incomes' ? incomes : expenses} />
                </>
            )}
        </Dashboard>
    );
};

export default Operations;
