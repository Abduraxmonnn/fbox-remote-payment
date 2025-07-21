import {useState, useEffect} from 'react';
import Modal from 'react-modal';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../PaymentServices.scss';
import {images} from '../../constants';
import {INIT_API, INIT_LOCAL_API, DATA_API, DATA_LOCAL_API} from '../../api';
import DefaultPaymentServices from '../DefaultPaymentService/DefaultPaymentService';

Modal.setAppElement('#root');

const API = INIT_API;
// const API = INIT_LOCAL_API;

const APIData = DATA_API;
// const APIData = DATA_LOCAL_API;

const paymentMethods = [
    {key: 'payme', name: 'Payme', icon: images.payme_square_icon, isPopular: true},
    {key: 'click', name: 'Click', icon: images.click_square_icon},
    {
        key: 'uzum',
        name: 'Uzum',
        icon: images.uzum_square_icon,
        inactive_icon: images.inactive_uzum_square_icon,
        comingSoon: true,
    },
    {
        key: 'anorbank',
        name: 'Anorbank',
        icon: images.anorbank_square_icon,
        inactive_icon: images.inactive_anorbank_square_icon,
        comingSoon: true,
    },
];

export default function PaymentServices() {
    const [transactionData, setTransactionData] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isProcessed, setIsProcessed] = useState(false);
    const [theme, setTheme] = useState('light'); // Default theme
    const [selectedTip, setSelectedTip] = useState(0); // State to track selected tip percentage

    useEffect(() => {
        if (transactionData?.s2pTheme) {
            setTheme(transactionData.s2pTheme);
        }
    }, [transactionData]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const isSafari = () => {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    };

    const isIphone = () => {
        return /iPhone/i.test(navigator.userAgent);
    };

    const fetchTransactionData = async () => {
        const body = {
            transaction_id: localStorage.getItem('transactionId'),
        };

        try {
            const response = await APIData.post('/', body, {
                headers: {
                    Authorization: `Token ${process.env.REACT_APP_SERVER_TOKEN}`,
                },
            });

            const data = {
                marketName: response.data.company_name,
                marketAddress: response.data.company_address,
                amount: response.data.amount,
                orderId: response.data.order_id,
                marketLogo: response.data.company_logo,
                marketBanner: response.data.company_banner,
                s2pTheme: response.data.s2p_theme,
                transactionId: localStorage.getItem('transactionId'),
            };

            setTransactionData(data);
        } catch (err) {
            console.error('Something went wrong:', err);
        }
    };

    useEffect(() => {
        AOS.init({duration: 2000});
        fetchTransactionData();
    }, []);

    useEffect(() => {
        if (transactionData) {
            // console.log('transactionData: ', transactionData);
        }
    }, [transactionData]);

    const handleTipSelect = (tip) => {
        setSelectedTip(tip === selectedTip ? null : tip); // Toggle selection or deselect
    };

    const tipOptions = [
        { label: 'Без чаевых', value: 0 },
        { label: '5%', value: 5 },
        { label: '10%', value: 10 },
        { label: '15%', value: 15 },
        { label: '20%', value: 20 },
    ];

    const handleButtonClick = async (service) => {
        setSelectedService(service);

        const body = {
            params: {
                source: service,
                order_id: transactionData.orderId,
                transaction_id: transactionData.transactionId,
                tip_percentage: selectedTip
            },
        };

        try {
            const response = await API.post('/', body, {
                headers: {
                    Authorization: `Token ${process.env.REACT_APP_SERVER_TOKEN}`,
                },
            });

            if (response.data.status === 'successfully') {
                const url = response.data.message;
                if (isSafari() || isIphone()) {
                    setModalContent(url);
                    setModalIsOpen(true);
                } else {
                    window.open(url, '_blank');
                }
            } else if (response.data.status === 'error') {
                setIsProcessed(true);
                setModalIsOpen(true);
            } else {
                console.log('Response status:', response.data.status);
                console.log('Message:', response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className="payment-page">
            {transactionData ? (
                <div className="payment-page default-page">
                    <div className="banner">
                        <img
                            src={transactionData.marketBanner || images.default_banner}
                            alt="Restaurant banner"
                            className="banner-image"
                        />
                        <div className="banner-overlay">
                            <div className="logo-container">
                                <div className="logo">
                                    <img
                                        src={transactionData.marketLogo || images.default_store}
                                        alt="store-image"
                                        className="store-image"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="content">
                        <div className="address-container">
                            <p className="restaurant-address">
                                {transactionData.marketAddress || 'Узбекистан'}
                            </p>
                        </div>

                        <div className="amount-container">
                            <p className="total-amount">
                                {transactionData.amount
                                    .toFixed(2)
                                    .replace(/\d(?=(\d{3})+\.)/g, '$& ')}{' '}
                                <span className="currency">сум</span>
                            </p>
                        </div>

                        <p className="invoice-number">Счет №{transactionData.orderId}</p>

                        <h3 className="tip-title">Оставьте чаевые</h3>
                        <div className="tip-buttons">
                            {tipOptions.map((tip) => (
                                <button
                                    key={tip.value || 'none'}
                                    className={`tip-button ${selectedTip === tip.value ? 'selected' : ''}`}
                                    onClick={() => handleTipSelect(tip.value)}
                                    aria-label={`Select ${tip.label}`}
                                >
                                    {tip.label}
                                </button>
                            ))}
                        </div>

                        <h3 className="section-title">Выберите способ оплаты</h3>

                        <div className="payment-methods-grid">
                            {paymentMethods.map((method) => (
                                <div
                                    key={method.name}
                                    className={`payment-method-card ${
                                        method.isPopular ? 'popular-card' : ''
                                    } ${method.comingSoon ? 'coming-soon-card' : ''}`}
                                    onClick={
                                        !method.comingSoon
                                            ? () => handleButtonClick(method.key)
                                            : undefined
                                    }
                                >
                                    {method.isPopular && <div className="popular-badge">Популярный</div>}
                                    {method.comingSoon && <div className="soon-badge">Скоро</div>}
                                    <div className="method-icon">
                                        <img
                                            src={
                                                method.comingSoon
                                                    ? method.inactive_icon || '/placeholder.svg'
                                                    : method.icon || '/placeholder.svg'
                                            }
                                            alt={`${method.name} icon`}
                                            className="icon-image"
                                        />
                                    </div>
                                    <span
                                        className={`payment-provider ${
                                            theme === 'dark' && method.isPopular ? 'popular-provider' : ''
                                        }`}
                                    >
                    {method.name}
                  </span>
                                </div>
                            ))}
                        </div>

                        <p className="footer">scan2pay powered by FiscalBox</p>

                        {(isSafari() || isIphone()) && (
                            <Modal
                                isOpen={modalIsOpen}
                                onRequestClose={closeModal}
                                contentLabel="Payment Link"
                                className="payment-modal"
                                overlayClassName="payment-modal-overlay"
                            >
                                <div className="modal-content">
                                    <h2 className="modal-title">Ссылка для оплаты</h2>
                                    <div className="modal-buttons">
                                        <button
                                            className="modal-button primary-button"
                                            onClick={() => {
                                                window.open(modalContent, '_blank');
                                                closeModal();
                                            }}
                                        >
                                            Открыть в новой вкладке
                                        </button>
                                        <button
                                            className="modal-button secondary-button"
                                            onClick={closeModal}
                                        >
                                            Закрывать
                                        </button>
                                    </div>
                                </div>
                            </Modal>
                        )}
                        {isProcessed && (
                            <Modal
                                isOpen={modalIsOpen}
                                onRequestClose={closeModal}
                                contentLabel="Payment Link"
                                className="payment-modal"
                                overlayClassName="payment-modal-overlay"
                            >
                                <div className="modal-content">
                                    <h2 className={`modal-title${isProcessed ? ' processed' : ''}`}>
                                        Транзакция уже обработана.
                                    </h2>
                                    <div className="modal-buttons">
                                        <button
                                            className="modal-button secondary-button"
                                            onClick={closeModal}
                                        >
                                            Закрывать
                                        </button>
                                    </div>
                                </div>
                            </Modal>
                        )}
                    </div>
                </div>
            ) : (
                <DefaultPaymentServices/>
            )}
        </div>
    );
}