import {useEffect} from "react";

import AOS from 'aos';
import 'aos/dist/aos.css';

import {images} from '../../constants';
import './PaymentServices.scss';

const PaymentServices = () => {

    useEffect(() => {
        AOS.init({duration: 2000});
    }, [])

    return (
        <section className='service-main'>
            <h1 data-aos="zoom-in">Добро пожаловать!</h1>
            <h3 data-aos="zoom-in">Пожалуйста, выберите один из способов оплаты</h3>
            <div className="service-content">
                <ul>
                    <li data-aos="zoom-in-up">
                        <button className='service-button'>
                            <img src={images.payme_icon} alt="PayMe"/>
                        </button>
                    </li>
                    <li data-aos="zoom-in-up">
                        <button className='service-button'>
                            <img src={images.click_icon} alt="Click"/>
                        </button>
                    </li>
                    <li data-aos="zoom-in-up">
                        <button className='service-button'>
                            <img src={images.uzum_icon} alt="Uzum"/>
                        </button>
                    </li>
                    <li data-aos="zoom-in-up">
                        <button className='service-button'>
                            <img src={images.anor_icon} alt="Anor"/>
                        </button>
                    </li>
                </ul>
            </div>
        </section>
    )
}

export default PaymentServices;