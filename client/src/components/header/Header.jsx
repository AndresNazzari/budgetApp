import styles from './style/Header.module.scss';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../../redux/actions/user.action';

import { ReactComponent as HomeIcon } from './assets/home1.svg';
import { ReactComponent as IncomeIcon } from './assets/income.svg';
import { ReactComponent as ExpenseIcon } from './assets/expense.svg';
import { ReactComponent as OperationsIcon } from './assets/operations.svg';
import { ReactComponent as ExitIcon } from './assets/exit.svg';

const Header = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const avatar = useSelector((store) => store.userReducer.avatar);
    const name = useSelector((store) => store.userReducer.name);

    const [modalPerfilOpen, setModalPerfilOpen] = useState(false);

    const logOutHandler = () => {
        dispatch(logout());
    };

    const setTitle = () => {
        return (
            (location.pathname == '/home' && `Welcome, ${name}!`) ||
            (location.pathname == '/operations/incomes' && 'Incomes') ||
            (location.pathname == '/operations/expenses' && 'Expenses') ||
            (location.pathname == '/operations' && 'Operations')
        );
    };

    return (
        <>
            <div
                id={modalPerfilOpen ? styles.modalProfileContainer : ''}
                onClick={(e) =>
                    e.target.id === styles.modalProfileContainer &&
                    setModalPerfilOpen(!modalPerfilOpen)
                }></div>
            <header className={styles.header}>
                <p>{setTitle()}</p>
                <div className={styles.headerAvatarContainer}>
                    <img
                        src={avatar}
                        alt='avatar'
                        className={styles.headerAvatar}
                        onClick={() => setModalPerfilOpen(!modalPerfilOpen)}
                    />
                    <div
                        className={
                            modalPerfilOpen
                                ? `${styles.modalProfile} ${styles.modalProfile_visible}`
                                : `${styles.modalProfile} `
                        }>
                        <div>
                            <HomeIcon className={styles.modalIcon} />
                            <Link to='/home' onClick={() => setModalPerfilOpen(!modalPerfilOpen)}>
                                <span>Home</span>
                            </Link>
                        </div>
                        {/*  <div>
                            <ProfileIcon className={styles.modalIcon} />
                            <Link
                                to='/home/profile'
                                onClick={() => setModalPerfilOpen(!modalPerfilOpen)}>
                                <span>My profile</span>
                            </Link>
                        </div> */}
                        <div>
                            <OperationsIcon className={styles.modalIcon} />
                            <Link
                                to='/operations'
                                onClick={() => setModalPerfilOpen(!modalPerfilOpen)}>
                                <span>Operations</span>
                            </Link>
                        </div>
                        <div>
                            <IncomeIcon className={styles.modalIcon} />
                            <Link
                                to='/operations/incomes'
                                onClick={() => setModalPerfilOpen(!modalPerfilOpen)}>
                                <span>Incomes</span>
                            </Link>
                        </div>
                        <div>
                            <ExpenseIcon className={styles.modalIcon} />
                            <Link
                                to='/operations/expenses'
                                onClick={() => setModalPerfilOpen(!modalPerfilOpen)}>
                                <span>Expenses</span>
                            </Link>
                        </div>
                        <div>
                            <ExitIcon className={styles.modalIcon} />
                            <Link
                                to='/'
                                onClick={() => {
                                    setModalPerfilOpen(!modalPerfilOpen);
                                    logOutHandler();
                                }}>
                                <span>Log Out</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
