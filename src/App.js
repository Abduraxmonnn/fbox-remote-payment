import {Route, Routes} from 'react-router-dom'
import PaymentServices from "./components/PaymentSerivces/PaymentServices";
import TokenHandler from "./handlers/TokenHandlers/TokenHandlers";
import './App.css';

function App() {

    return (
        <div className='App'>
            <Routes>
                <Route path='/' element={<PaymentServices/>}/>
                <Route path="/:token">
                    <Route path="" element={<TokenHandler/>}/>
                </Route>
            </Routes>
        </div>
    )
}

export default App;