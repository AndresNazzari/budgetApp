import styles from './style/Navbar.module.scss';
import { Link, useLocation } from 'react-router-dom';
import { ReactComponent as HomeIcon } from './assets/home1.svg';
import { ReactComponent as IncomeIcon } from './assets/income.svg';
import { ReactComponent as ExpenseIcon } from './assets/expense.svg';
import { ReactComponent as OperationsIcon } from './assets/operations.svg';

import logo from './assets/logo.png';

const Navbar = () => {
    const location = useLocation();

    return (
        <>
            <nav className={styles.navBar}>
                <div className={styles.logo}>
                    <Link to='/home'>
                        <img src={logo} alt='' className={styles.navLogo} />
                    </Link>
                </div>
                <div className={styles.navLinks}>
                    <Link
                        to='/home'
                        className={
                            location.pathname == '/home'
                                ? `${styles.navLink} ${styles.navLinkOn}`
                                : `${styles.navLink}`
                        }>
                        <HomeIcon className={styles.navIcon} />
                        <span>Home</span>
                    </Link>
                    <Link
                        to='/operations'
                        className={
                            location.pathname == '/operations'
                                ? `${styles.navLink} ${styles.navLinkOn}`
                                : `${styles.navLink}`
                        }>
                        <OperationsIcon className={styles.navIcon} />
                        <span>Operations</span>
                    </Link>
                    <Link
                        to='/operations/incomes'
                        className={
                            location.pathname == '/operations/incomes'
                                ? `${styles.navLink} ${styles.navLinkOn}`
                                : `${styles.navLink}`
                        }>
                        <IncomeIcon className={styles.navIcon} />
                        <span>Incomes</span>
                    </Link>
                    <Link
                        to='/operations/expenses'
                        className={
                            location.pathname == '/operations/expenses'
                                ? `${styles.navLink} ${styles.navLinkOn}`
                                : `${styles.navLink}`
                        }>
                        <ExpenseIcon className={styles.navIcon} />
                        <span>Expenses</span>
                    </Link>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
