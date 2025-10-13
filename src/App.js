import {Route, Routes} from "react-router-dom";
import PaymentServices from "./pages/PaymentSerivces/PaymentServices";
import ParamsHandler from "./handlers/ParamsHandlers/ParamsHandlers";
import DefaultPaymentServices from "./pages/DefaultPaymentService/DefaultPaymentService";
import {Toaster} from "sonner";
import "./App.css";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<DefaultPaymentServices/>}/>
                <Route path="/pay/" element={<PaymentServices/>}/>
                <Route path="/:transaction_id/" element={<ParamsHandler/>}/>
            </Routes>
            <Toaster richColors position="top-center" closeButton duration={2000}/>
        </div>
    );
}


export default App;
