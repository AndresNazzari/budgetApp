import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styles from './style/OperationForm.module.scss';
import { setAlertAction } from '../../redux/actions/alert.action';
import { loadCategoriesAction } from '../../redux/actions/categories.action';
import { addExpenseAction, editExpenseAction } from '../../redux/actions/expenses.actions';
import { addIncomeAction, editIncomeAction } from '../../redux/actions/incomes.actions';
import SearchIcon from './assets/searchIcon.svg';
import Select, { components } from 'react-select';
import DatePicker, { CalendarContainer, registerLocale } from 'react-datepicker';
import './style/Dates-override.scss';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';

const OperationForm = () => {
    const dispatch = useDispatch();
    const categories = useSelector((store) => store.categoryReducer.categories);
    const location = useLocation();

    const [op, setOp] = useState(location.state);
    const [operation, setOperation] = useState('');
    const [formData, setFormData] = useState({
        concept: op ? op.concept : '',
        amount: op ? op.amount : '',
        category_id: '',
        user_id: useSelector((store) => store.userReducer.user_id),
        date: null,
    });

    useEffect(() => {
        op && Number(op.amount) > 0 && setOperation('income');
        op && Number(op.amount) < 0 && setOperation('expense');
    }, [op]);

    useEffect(() => {
        dispatch(loadCategoriesAction());
    }, [dispatch]);

    const btnClickHandler = (e) => {
        setOperation(e.target.value);
    };

    const onCategoryChange = (selectedOption) => {
        setFormData({ ...formData, category_id: selectedOption.value });
    };

    const onAmountChange = (e) => {
        if (e.target.value < 0) {
            return;
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onConceptChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const submitBtnClickHandler = (e) => {
        let amount = Math.abs(formData.amount);
        operation === 'expense' && (amount *= -1);
        setFormData({ ...formData, amount });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (Object.values(formData).some((x) => x === '' || x === null || x === 0)) {
            dispatch(setAlertAction(`No empty fields allowed`, 'danger'));
            return;
        } else if (operation === '') {
            dispatch(setAlertAction(`Select Income or Expense`, 'danger'));
            return;
        }
        if (!op) {
            if (formData.amount < 0) {
                dispatch(addExpenseAction(formData));
            } else if (formData.amount > 0) {
                dispatch(addIncomeAction(formData));
            }
        } else {
            if (formData.amount < 0) {
                dispatch(editExpenseAction(formData, op.expense_id));
            } else if (formData.amount > 0) {
                dispatch(editIncomeAction(formData, op.income_id));
            }
        }

        setFormData({
            ...formData,
            concept: '',
            amount: '',
            date: null,
        });
        setOperation('');
        setOp(false);
    };

    const categoriesOptions = categories.map((category) => {
        return { value: category.category_id, label: category.name };
    });

    //FROM SELECT LIBRARY
    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    <label className={props.isSelected ? styles.selectedLabel : null}>
                        {props.label}
                    </label>
                </components.Option>
            </div>
        );
    };
    const DropdownIndicator = (props) => {
        return (
            <components.DropdownIndicator {...props}>
                <img src={SearchIcon} alt='search' />
            </components.DropdownIndicator>
        );
    };
    const customStyles = {
        control: (styles, state) => ({
            ...styles,
            width: window.innerWidth > 768 ? '40vw' : '80vw',
            height: '40px',
            margin: '0.5rem',
            borderRadius: '8px',
            fontSize: '14px',
            border: state.isFocused ? '1px solid #0BA4A0' : '1px solid #dadeeb',
            '&:hover': { borderColor: '#0BA4A0' },
            boxShadow: 'none',
        }),
        menu: (styles, state) => ({
            ...styles,
            width: window.innerWidth > 768 ? '40vw' : '80vw',
            margin: '0.5rem',
            borderRadius: '8px',
            color: 'green',
        }),
        menuList: (styles, state) => ({
            ...styles,
            width: window.innerWidth > 768 ? '40vw' : '80vw',
        }),
        option: (styles, state) => ({
            ...styles,
            backgroundColor: 'white',
            cursor: 'pointer',
            '&:hover': { backgroundColor: '#dadeeb' },
        }),
        Input: (styles, state) => ({
            ...styles,
            border: state.isFocused ? '1px solid #0BA4A0' : '1px solid #dadeeb',
        }),
    };

    // REACT DATEPICKER
    const calendarContainer = ({ className, children }) => {
        return (
            <div
                style={{
                    borderRadius: '8px',
                }}>
                <CalendarContainer className={className}>
                    <div>{children}</div>
                </CalendarContainer>
            </div>
        );
    };

    registerLocale('es', es);

    const onChangeDate = (date) => {
        setFormData({ ...formData, date: date });
    };

    return (
        <>
            <h1>
                {!op
                    ? `Register new Operation`
                    : op.amount > 0
                    ? `Edit income operation`
                    : `Edit expense operation`}
            </h1>
            <div
                className={
                    !op
                        ? `${styles.btnContainer}`
                        : `${styles.btnContainer} ${styles.noBtnContainer}`
                }>
                <button
                    className={
                        operation === 'income'
                            ? `${styles.btn} ${styles.btnIncome} ${styles.btnActive}`
                            : `${styles.btn} ${styles.btnIncome} `
                    }
                    onClick={(e) => btnClickHandler(e)}
                    value='income'>
                    Income
                </button>
                <button
                    className={
                        operation === 'expense'
                            ? `${styles.btn} ${styles.btnExpense} ${styles.btnActive}`
                            : `${styles.btn} ${styles.btnExpense} `
                    }
                    onClick={(e) => btnClickHandler(e)}
                    value='expense'>
                    Expense
                </button>
            </div>
            <form onSubmit={(e) => onSubmit(e)}>
                <section>
                    <input
                        className={styles.inputForm}
                        type='text'
                        name='concept'
                        placeholder='Concept'
                        onChange={(e) => onConceptChange(e)}
                        value={formData.concept}
                    />
                    <input
                        className={styles.inputForm}
                        type='number'
                        step='any'
                        value={formData.amount && Math.abs(formData.amount)}
                        min='0'
                        name='amount'
                        placeholder='Amount ($ only numbers)'
                        onChange={(e) => onAmountChange(e)}
                    />
                    <div>
                        <Select
                            styles={customStyles}
                            components={{
                                Option,
                                DropdownIndicator,
                                IndicatorSeparator: () => null,
                            }}
                            className='basic-single'
                            classNamePrefix='select'
                            placeholder='Select Category'
                            isSearchable={true}
                            name='color'
                            options={categoriesOptions}
                            onChange={onCategoryChange}
                        />
                    </div>
                    <div className={styles.dayPicker}>
                        <DatePicker
                            placeholderText='Date'
                            selected={formData.date}
                            onChange={(date) => onChangeDate(date)}
                            calendarContainer={calendarContainer}
                            disabledKeyboardNavigation
                            formatWeekDay={(d) => {
                                return d.slice(0, 1);
                            }}
                            showDisabledMonthNavigation={false}
                            locale='es'
                            dateFormat='dd/MM/yyyy'
                        />
                    </div>
                    <button
                        className={`${styles.btn} ${styles.btnSubmit}`}
                        value='submit'
                        onClick={(e) => submitBtnClickHandler(e)}>
                        Submit
                    </button>
                </section>
            </form>
        </>
    );
};

export default OperationForm;
