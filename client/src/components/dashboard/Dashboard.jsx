import './style/dashboard.scss';
import Navbar from '../navbar/Navbar';
import Header from '../header/Header';

const Dashboard = ({ children }) => {
    return (
        <div className='container'>
            <Navbar />
            <div className='mainContainer'>
                <Header />
                <main>{children}</main>
            </div>
        </div>
    );
};

export default Dashboard;
