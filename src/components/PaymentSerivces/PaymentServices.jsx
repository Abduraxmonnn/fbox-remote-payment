import {useState, useEffect} from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import {images} from '../../constants';
import './PaymentServices.scss';

const PaymentServices = () => {
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        AOS.init({duration: 2000});
    }, []);

    const handleButtonClick = async (service) => {
        setSelectedService(service);

        const body = {
            params: {
                first: localStorage.getItem('params_first'),
                second: localStorage.getItem('params_second'),
            },
            service,
        };

        try {
            const response = await fetch('http://your-backend-api-endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({body}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error);
        }
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
                            className='service-button disabled'
                            onClick={() => handleButtonClick('uzum')}
                        >
                            <img src={images.uzum_icon} alt="Uzum"/>
                        </button>
                    </li>
                    <li data-aos="zoom-in-up">
                        <button
                            className='service-button disabled'
                            onClick={() => handleButtonClick('anor')}
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
