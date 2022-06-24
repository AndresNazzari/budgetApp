import React from 'react';
import styles from './style/Empty.module.scss';

const Empty = ({ message }) => {
    return <div className={styles.error}>{message}</div>;
};

export default Empty;
