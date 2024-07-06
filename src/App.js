import {Route, Routes} from 'react-router-dom'
import './App.css';
import PaymentServices from "./components/PaymentSerivces/PaymentServices";

function App() {

    return (
        <div className='App'>
            <Routes>
                <Route path='/' element={<PaymentServices/>}/>
            </Routes>
        </div>
    )
}

export default App;