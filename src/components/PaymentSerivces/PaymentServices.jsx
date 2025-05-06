import {useState, useEffect} from 'react';
import Modal from 'react-modal';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {ChevronRight} from 'lucide-react';
import '../PaymentServices.scss';
import {images} from '../../constants';
import {INIT_API, INIT_LOCAL_API, DATA_API, DATA_LOCAL_API} from '../../api'
import DefaultPaymentServices from '../DefaultPaymentService/DefaultPaymentService';
import axios from "axios";
import {API_URLS} from "../../api/apiConfig";

Modal.setAppElement('#root');

const API = INIT_API
// const API = INIT_LOCAL_API

const APIData = DATA_API
// const APIData = DATA_LOCAL_API

const paymentMethods = [
    {key: 'payme', name: 'Payme', icon: images.payme_square_icon},
    {key: 'click', name: 'Click', icon: images.click_square_icon},
    {
        key: 'uzum',
        name: 'Uzum',
        icon: images.uzum_square_icon,
        isWork: 'Скоро доступно',
    },
    {
        key: 'anorbank',
        name: 'Anorbank',
        icon: images.anorbank_square_icon,
        isWork: 'Скоро доступно',
    },
];

export default function PaymentServices() {
    const [transactionData, setTransactionData] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isProcessed, setIsProcessed] = useState(false);

    const
        isSafari = () => {
            return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
        }

    const isIphone = () => {
        return /iPhone/i.test(navigator.userAgent)
    }

    const fetchTransactionData = async () => {
        const body = {
            transaction_id: localStorage.getItem('transactionId'),
        };

        try {
            const response = await axios.post(API_URLS.DATA_API, body, {
                headers: {
                    Authorization: `Token ${process.env.REACT_APP_SERVER_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = {
                marketName: response.data.company_name,
                marketAddress: response.data.company_address,
                amount: response.data.amount,
                orderId: response.data.order_id,
                marketLogo: response.data.company_logo,
                marketBanner: response.data.company_banner,
                transactionId: localStorage.getItem('transactionId'),
            };

            setTransactionData(data);
        } catch (err) {
            console.error('Something went wrong:', err);
        }
    };

    useEffect(() => {
        AOS.init({duration: 2000})
        fetchTransactionData()
    }, [])

    // Log transactionData whenever it changes
    useEffect(() => {
        if (transactionData) {
            // console.log('transactionData: ', transactionData)
        }
    }, [transactionData])

    const handleButtonClick = async service => {
        setSelectedService(service) // Set the selected service

        const body = {
            params: {
                source: service,
                order_id: transactionData.orderId,
                transaction_id: transactionData.transactionId,
            },
        }

        try {
            const response = await API.post('/', body, {
                headers: {
                    Authorization: `Token ${process.env.REACT_APP_SERVER_TOKEN}`,
                },
            })

            console.log(response.data.status)

            if (response.data.status === 'successfully') {
                const url = response.data.message
                if (isSafari() || isIphone()) {
                    setModalContent(url)
                    setModalIsOpen(true)
                } else {
                    window.open(url, '_blank')
                }
            } else if (response.data.status === 'error') {
                setIsProcessed(true);
                setModalIsOpen(true)
            } else {
                console.log('Response status:', response.data.status)
                console.log('Message:', response.data.message)
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const closeModal = () => {
        setModalIsOpen(false)
    }

    return (
        <div className='payment-page'>
            {transactionData ? (
                <>
                    <div className='banner'>
                        <img
                            src={transactionData.marketBanner || images.default_banner}
                            alt='Restaurant banner'
                            className='banner-image'
                        />
                        <div className='banner-overlay'>
                            <div className='logo-container'>
                                <div className='logo'>
                                    <img
                                        src={transactionData.marketLogo || images.default_store}
                                        alt='store-image'
                                        className='store-image'
                                    />
                                </div>
                                <div>
                                    <h1 className='restaurant-name'>
                                        {transactionData.marketName}
                                    </h1>
                                    <p className='restaurant-address'>
                                        <img
                                            src={images.locationIcon}
                                            alt='location icon'
                                            className='location-image'
                                        />
                                        {transactionData.marketAddress || 'Узбекистан'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='content'>
                        <h2 className='section-title'>Итого к оплате</h2>
                        <p className='total-amount'>
                            {transactionData.amount
                                .toFixed(2)
                                .replace(/\d(?=(\d{3})+\.)/g, '$& ')}
                        </p>
                        <p className='invoice-number'>Счет №{transactionData.orderId}</p>

                        <h3 className='section-title'>Выберите способы оплаты</h3>

                        <div className='button-section'>
                            <div className='divider'></div>

                            {paymentMethods.map(method => (
                                <div
                                    key={method.name}
                                    className='payment-method'
                                    onClick={() => handleButtonClick(method.key)}
                                >
                                    <div className='method-info'>
                                        <div className='method-icon'>
                                            <img
                                                src={method.icon}
                                                alt={`${method.name} icon`}
                                                className='icon-image'
                                            />
                                        </div>
                                        <span className='payment-provider'>
											{method.name}
                                            {method.isWork && (
                                                <span className='soon-payment-provider'>
													{' '}
                                                    - {method.isWork}
												</span>
                                            )}
										</span>
                                    </div>
                                    <ChevronRight className='chevron'/>
                                </div>
                            ))}

                            <p className='footer'>Design powered by FiscalBox</p>
                        </div>
                        {(isSafari() || isIphone()) && (
                            <Modal
                                isOpen={modalIsOpen}
                                onRequestClose={closeModal}
                                contentLabel='Payment Link'
                                className='payment-modal'
                                overlayClassName='payment-modal-overlay'
                            >
                                <div className='modal-content'>
                                    <h2 className='modal-title'>Ссылка для оплаты</h2>
                                    <div className='modal-buttons'>
                                        <button
                                            className='modal-button primary-button'
                                            onClick={() => {
                                                window.open(modalContent, '_blank')
                                                closeModal()
                                            }}
                                        >
                                            Открыть в новой вкладке
                                        </button>
                                        <button
                                            className='modal-button secondary-button'
                                            onClick={closeModal}
                                        >
                                            Закрывать
                                        </button>
                                    </div>
                                </div>
                            </Modal>
                        )}
                        {(isProcessed) && (
                            <>
                                <Modal
                                    isOpen={modalIsOpen}
                                    onRequestClose={closeModal}
                                    contentLabel='Payment Link'
                                    className='payment-modal'
                                    overlayClassName='payment-modal-overlay'
                                >
                                    <div className='modal-content'>
                                        <h2 className={`modal-title${isProcessed ? ' processed' : ''}`}>Транзакция уже
                                            обработана.</h2>
                                        <div className='modal-buttons'>
                                            <button
                                                className='modal-button secondary-button'
                                                onClick={closeModal}
                                            >
                                                Закрывать
                                            </button>
                                        </div>
                                    </div>
                                </Modal>
                            </>
                        )}
                    </div>
                </>
            ) : (
                <>{DefaultPaymentServices()}</>
            )}
        </div>
    )
}
