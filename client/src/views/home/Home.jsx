import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserAction } from '../../redux/actions/user.action';
import { getAllIncomesAction } from '../../redux/actions/incomes.actions';
import { getAllExpensesAction } from '../../redux/actions/expenses.actions';
import { FetchState } from '../../constants/fetchState';
import Dashboard from '../../components/dashboard/Dashboard';
import Spinner from '../../components/spinner/Spinner';
import OperationList from '../../components/operationList/OperationList';
import Alert from '../../components/alert/Alert';
const Home = () => {
    const dispatch = useDispatch();
    const fetchingStateUser = useSelector((store) => store.userReducer.fetchState);
    const fetchingStateIncomes = useSelector((store) => store.incomeReducer.fetchState);
    const fetchingStateExpenses = useSelector((store) => store.expenseReducer.fetchState);

    const user_id = useSelector((store) => store.userReducer.user_id);
    const incomes = useSelector((store) => store.incomeReducer.incomes);
    const expenses = useSelector((store) => store.expenseReducer.expenses);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        dispatch(loadUserAction());
        dispatch(getAllIncomesAction(user_id));
        dispatch(getAllExpensesAction(user_id));
    }, [user_id]);

    useEffect(() => {
        setBalance(calcBalance());
    }, [balance, incomes, expenses]);

    const calcBalance = () => {
        return (
            incomes.reduce((acc, income) => acc + Number(income.amount), 0) +
            expenses.reduce((acc, expense) => acc + Number(expense.amount), 0)
        );
    };

    const allOpp = [...incomes, ...expenses];
    allOpp.sort((a, b) => {
        let c = new Date(a.date);
        let d = new Date(b.date);
        return d - c;
    });
    const opp = allOpp.slice(0, 10);

    return (
        <Dashboard>
            {fetchingStateUser !== FetchState.FETCHED ||
            fetchingStateIncomes !== FetchState.FETCHED ||
            fetchingStateExpenses !== FetchState.FETCHED ? (
                <Spinner />
            ) : (
                <>
                    <Alert />
                    <div>All time balance: {balance}</div>
                    <div>
                        <h1>Last Operations</h1>
                        <OperationList list={opp} last10={true} />
                    </div>
                </>
            )}
        </Dashboard>
    );
};

export default Home;
