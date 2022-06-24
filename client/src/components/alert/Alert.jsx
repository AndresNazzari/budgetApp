import React from 'react';
import { useSelector } from 'react-redux';
import './style/alert.css';

const Alert = () => {
    const alerts = useSelector((store) => store.alertsReducer);

    return (
        <div className='alerts-container'>
            {alerts !== null &&
                alerts.map((alert) => (
                    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
                        {alert.message}
                    </div>
                ))}
        </div>
    );
};

export default Alert;
