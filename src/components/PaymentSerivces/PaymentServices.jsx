import {useState, useEffect} from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import {images} from '../../constants';
import './PaymentServices.scss';
import {API, CLICK_API_LOCAL, PAYME_API_LOCAL} from "../../api";

const PaymentServices = () => {
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        AOS.init({duration: 2000});
    }, []);

    const getApiClient = (service) => {
        const clients = {
            payme: PAYME_API_LOCAL,
            click: CLICK_API_LOCAL,
        };
        return clients[service] || API;
    };

    const handleButtonClick = async (service) => {
        setSelectedService(service);

        const body = {
            params: {
                first: localStorage.getItem('params_first'),
                second: localStorage.getItem('params_second'),
            }
        };

        const apiClient = getApiClient(service);

        try {
            const response = await apiClient.post('/', body, {
                headers: {
                    Authorization: `Token 1d5ec3304c8b3935f67c4ab598f2b464954f19f6`
                }
            });

            if (response.data.status === "successfully") {
                const url = response.data.message;
                window.open(url, '_blank');
            } else {
                console.log('Response status:', response.data.status);
                console.log('Message:', response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const isServiceEnabled = (service) => {
        const enabledServices = ['payme', 'click'];
        return enabledServices.includes(service);
    };

    return (
        <section className='service-main'>
            <h1 data-aos="zoom-in">Добро пожаловать!</h1>
            <h3 data-aos="zoom-in">Пожалуйста, выберите один из способов оплаты</h3>
            <div className="service-content">
                <ul>
                    <li data-aos="zoom-in-up">
                        <button
                            className='service-button'
                            onClick={() => handleButtonClick('payme')}
                        >
                            <img src={images.payme_icon} alt="PayMe"/>
                        </button>
                    </li>
                    <li data-aos="zoom-in-up">
                        <button
                            className='service-button'
                            onClick={() => handleButtonClick('click')}
                        >
                            <img src={images.click_icon} alt="Click"/>
                        </button>
                    </li>
                    <li data-aos="zoom-in-up">
                        <button
                            className={`service-button ${isServiceEnabled('uzum') ? '' : 'disabled'}`}
                            onClick={() => isServiceEnabled('uzum') && handleButtonClick('uzum')}
                            disabled={!isServiceEnabled('uzum')}
                        >
                            <img src={images.uzum_icon} alt="Uzum"/>
                        </button>
                    </li>
                    <li data-aos="zoom-in-up">
                        <button
                            className={`service-button ${isServiceEnabled('anor') ? '' : 'disabled'}`}
                            onClick={() => isServiceEnabled('anor') && handleButtonClick('anor')}
                            disabled={!isServiceEnabled('anor')}
                        >
                            <img src={images.anor_icon} alt="Anor"/>
                        </button>
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default PaymentServices;
