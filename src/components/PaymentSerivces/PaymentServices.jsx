import {useState, useEffect} from "react";
import Modal from 'react-modal';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {images} from '../../constants';
import './PaymentServices.scss';
import {INIT_API, INIT_LOCAL_API} from "../../api";

Modal.setAppElement('#root');

const PaymentServices = () => {
    const [selectedService, setSelectedService] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const isSafari = () => {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    };

    const isIphone = () => {
        return /iPhone/i.test(navigator.userAgent);
    };

    useEffect(() => {
        AOS.init({duration: 2000});
    }, []);

    const handleButtonClick = async (service) => {
        setSelectedService(service); // Set the selected service

        const body = {
            params: {
                source: service, // Use the service passed to the function
                first: localStorage.getItem('params_first'),
                second: localStorage.getItem('params_second'),
            }
        };

        try {
            const response = await INIT_API.post('/', body, {
                headers: {
                    Authorization: `Token ${process.env.REACT_APP_SERVER_TOKEN}`
                }
            });

            if (response.data.status === "successfully") {
                const url = response.data.message;
                if (isSafari() || isIphone()) {
                    setModalContent(url);
                    setModalIsOpen(true);
                } else {
                    window.open(url, '_blank'); // Open in new tab for other browsers/devices
                }
            } else if (response.data.status === 'error') {
                alert("Транзакция уже обработана.");
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

    const closeModal = () => {
        setModalIsOpen(false);
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
                    {/* Uncomment these if needed
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
                    */}
                </ul>
            </div>
            {(isSafari() || isIphone()) && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Payment Link"
                    className="modal"
                    overlayClassName="overlay"
                >
                    <h2>Ссылка для оплаты</h2>
                    <button onClick={() => {
                        window.open(modalContent, '_blank');
                        closeModal();
                    }}>Открыть в новой вкладке</button>
                    <button onClick={closeModal}>Закрывать</button>
                </Modal>
            )}
        </section>
    );
};

export default PaymentServices;
