import {Route, Routes} from 'react-router-dom';
import PaymentServices from './components/PaymentSerivces/PaymentServices';
import ParamsHandler from './handlers/ParamsHandlers/ParamsHandlers';
import './App.css';

function App() {
    return (
        <div className='App'>
            <Routes>
                <Route path='/' element={<PaymentServices/>}/>
                <Route path='/:params_first/:params_second' element={<ParamsHandler />} />
            </Routes>
        </div>
    );
}

export default App;
