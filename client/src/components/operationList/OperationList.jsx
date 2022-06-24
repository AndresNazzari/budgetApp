import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Moment from 'react-moment';
import style from './style/OperationList.module.scss';
import IconEdit from './assets/edit.svg';
import IconDelete from './assets/iconDelete.svg';
import NextArrow from './assets/nextarrow.svg';
import PrevArrow from './assets/prevarrow.svg';
import { removeIncomeAction } from '../../redux/actions/incomes.actions';
import { removeExpenseAction } from '../../redux/actions/expenses.actions';
import Empty from '../empty/Empty';

import { Link } from 'react-router-dom';

const OperationList = ({ list, last10 }) => {
    const dispatch = useDispatch();

    const [page, setPage] = useState(0);
    const eventsPerPage = 10;
    const offset = page * eventsPerPage;
    let checkLastPage = eventsPerPage + offset >= list.length;

    const removeOperation = (op) => {
        op.amount > 0 ? dispatch(removeIncomeAction(op)) : dispatch(removeExpenseAction(op));
    };

    const editOperation = (op) => {};

    let listOp = [];

    for (let i = offset; i < offset + eventsPerPage; i++) {
        if (i >= list.length) {
            break;
        }
        listOp.push(list[i]);
    }

    const nextPage = () => {
        setPage(page + 1);
    };

    const prevPage = () => {
        setPage(page - 1);
    };

    return (
        <>
            {list.length === 0 ? (
                <Empty message={`No operations Registered`} />
            ) : (
                <div className={style.container}>
                    <div
                        className={
                            last10
                                ? `${style.paginator} ${style.noPaginator}`
                                : `${style.paginator}`
                        }>
                        <p className={style.paginatorData}>
                            {page * eventsPerPage + 1}-
                            {checkLastPage ? list.length : listOp.length * page + eventsPerPage} de{' '}
                            {list.length}
                        </p>
                        {page !== 0 ? (
                            <img
                                className={style.prevarrow}
                                src={PrevArrow}
                                alt=''
                                onClick={() => prevPage()}
                            />
                        ) : (
                            <img className={style.prevarrowdis} src={PrevArrow} alt='' />
                        )}
                        {!checkLastPage ? (
                            <img
                                className={style.nextarrow}
                                src={NextArrow}
                                alt=''
                                onClick={() => nextPage()}
                            />
                        ) : (
                            <img className={style.nextarrowdis} src={NextArrow} alt='' />
                        )}
                    </div>
                    <table className={style.table}>
                        <thead className={style.thead}>
                            <tr className={style.rowHeader}>
                                <th className={style.infoHeader}>Concept</th>
                                <th className={style.infoHeader}>Amount</th>
                                <th className={style.infoHeader}>Date</th>
                                <th className={style.eraseCol}></th>
                            </tr>
                        </thead>
                        {
                            <tbody>
                                {listOp.map((op, index) => (
                                    <tr key={index}>
                                        <td className={`${style.infoHeader} ${style.info}`}>
                                            {op.concept}
                                        </td>
                                        <td className={`${style.infoHeader} ${style.info}`}>
                                            {op.amount < 0 && '-'}${Math.abs(op.amount)}
                                        </td>
                                        <td className={`${style.infoHeader} ${style.info}`}>
                                            {<Moment format='DD/MM/YYYY'>{op.date}</Moment>}
                                        </td>
                                        <td className={style.eraseTd}>
                                            <Link to='/operations' state={op}>
                                                <img
                                                    src={IconEdit}
                                                    className={style.iconEdit}
                                                    alt=''
                                                    onClick={() => editOperation(op)}
                                                />
                                            </Link>
                                            <img
                                                src={IconDelete}
                                                className={style.iconDelete}
                                                alt=''
                                                onClick={() => removeOperation(op)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        }
                    </table>
                </div>
            )}
        </>
    );
};

export default OperationList;
