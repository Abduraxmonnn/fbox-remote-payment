import {useState, useEffect} from 'react';
import Modal from 'react-modal';
import {Save} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {FcOk} from "react-icons/fc";
import {images} from '../../constants';
import {INIT_API, INIT_LOCAL_API, DATA_API, DATA_LOCAL_API} from '../../api';
import DefaultPaymentServices from '../DefaultPaymentService/DefaultPaymentService';
import {useTranslation} from "react-i18next";
import Localization from "../../components/Localization/Localization";
import AnimatedAmount from "../../components/AnimatedAmount/AnimatedAmount";
import '../PaymentServices.scss';

Modal.setAppElement('#root');

const API = INIT_API;
// const API = INIT_LOCAL_API;

const APIData = DATA_API;
// const APIData = DATA_LOCAL_API;

const paymentMethods = [
    {key: 'payme', name: 'Payme', icon: images.payme_square_icon, isPopular: true},
    {
        key: 'click',
        name: 'Click',
        icon: images.click_square_icon,
        inactive_icon: images.inactive_click_square_icon,
        disableWhenTip: true,
    },
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
    const {t} = useTranslation();
    const [transactionData, setTransactionData] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isProcessed, setIsProcessed] = useState(false);
    const [theme, setTheme] = useState('light'); // Default theme
    const [selectedTip, setSelectedTip] = useState(null);
    const [customTipAmount, setCustomTipAmount] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isManualTipConfirmed, setIsManualTipConfirmed] = useState(false);

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
            const saved = localStorage.getItem('scan2payTipData');
            if (saved) {
                try {
                    const {tipType, tipValue, tipAmount} = JSON.parse(saved);

                    if (tipType === 'percentage') {
                        setSelectedTip(tipValue);
                        setCustomTipAmount('');
                    } else if (tipType === 'manual') {
                        setSelectedTip('manual');
                        setCustomTipAmount(tipValue.toString());
                        setIsManualTipConfirmed(true);
                    }
                } catch (e) {
                    console.warn("Failed to restore tip data:", e);
                }
            }
        }
    }, [transactionData]);

    const handleTipSelect = (tip) => {
        setIsManualTipConfirmed(false);
        if (tip === 'manual') {
            setSelectedTip('manual');
            setCustomTipAmount('');
        } else {
            setSelectedTip(tip);
            setCustomTipAmount('');
            const base = transactionData?.amount || 0;
            const tipAmt = Math.round(base * (tip / 100));
            const total = base + tipAmt;
            saveTipToStorage(base, 'percentage', tip, tipAmt, total);
        }
    };

    const tipOptions = [
        {label: 'Вручную', value: 'manual'},
        {label: '0%', value: 0},
        {label: '5%', value: 5},
        {label: '10%', value: 10},
        {label: '15%', value: 15},
        {label: '20%', value: 20},
    ];

    const handleButtonClick = async (service) => {
        setSelectedService(service);

        const body = {
            params: {
                source: service,
                order_id: transactionData.orderId,
                transaction_id: transactionData.transactionId,
                tip_percentage: selectedTip !== 'manual' && Number(customTipAmount) <= 0 ? selectedTip : null,
                tip_custom_amount: selectedTip === 'manual' && Number(customTipAmount) > 0 ? customTipAmount : null,
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
            } else if (
                response.data.status === 'error' &&
                response.data.message === 'Transaction already Processed.'
            ) {
                setErrorMessage(t("main.alreadyProcessed"));
                setTimeout(() => setErrorMessage(''), 5000);
            } else {
                console.log('Response status:', response.data.status);
                console.log('Message:', response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const saveTipToStorage = (baseAmount, tipType, tipValue, tipAmount, totalAmount) => {
        const data = {
            baseAmount,
            tipType,
            tipValue,
            tipAmount,
            totalAmount,
        };
        localStorage.setItem('scan2payTipData', JSON.stringify(data));
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleConfirmManualTip = () => {
        const amount = Number(customTipAmount);
        if (amount > 0 && transactionData) {
            setIsManualTipConfirmed(true);
            const base = transactionData.amount;
            const total = base + amount;
            saveTipToStorage(base, 'manual', amount, amount, total);
        }
    };

    return (
        <div className="payment-page">
            {errorMessage && (
                <div className="toast-error">
                    {errorMessage}
                </div>
            )}
            {transactionData ? (
                <div className="payment-page default-page">
                    <div className="banner">
                        <Localization/>
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
                                {transactionData.marketAddress || t("main.marketAddress")}
                            </p>
                        </div>

                        <div className="amount-container">
                            <p className="total-amount">
                                <AnimatedAmount
                                    baseAmount={transactionData.amount}
                                    tipPercentage={
                                        typeof selectedTip === 'number' ? selectedTip : 0
                                    }
                                    customTipAmount={
                                        selectedTip === 'manual' && isManualTipConfirmed && Number(customTipAmount) > 0
                                            ? Number(customTipAmount)
                                            : 0
                                    }
                                />
                                <span className="currency">{t("base.currency")}</span>
                            </p>
                        </div>

                        <p className="invoice-number">{t("main.invoiceNumber")} №{transactionData.orderId}</p>

                        <h3 className="tip-title">{t("base.leaveTip")}</h3>
                        <div className="tip-buttons">
                            <button
                                className={`tip-button ${selectedTip === 'manual' && !isManualTipConfirmed ? 'selected' : ''}`}
                                onClick={() => handleTipSelect('manual')}
                            >
                                {t("base.manual")}
                            </button>

                            {(selectedTip !== 'manual' || isManualTipConfirmed) ? (
                                // Show percentage buttons (including manual confirmed case)
                                tipOptions
                                    .filter((tip) => typeof tip.value === 'number')
                                    .map((tip) => (
                                        <button
                                            key={tip.value}
                                            className={`tip-button ${selectedTip === tip.value ? 'selected' : ''}`}
                                            onClick={() => handleTipSelect(tip.value)}
                                        >
                                            {tip.label}
                                        </button>
                                    ))
                            ) : (
                                <>
                                    <input
                                        type="number"
                                        className="manual-tip-input"
                                        placeholder={t("base.customTipPlaceholder")}
                                        value={customTipAmount}
                                        onChange={(e) => setCustomTipAmount(e.target.value)}
                                    />
                                    <button
                                        className="tip-confirm-button"
                                        onClick={handleConfirmManualTip}
                                    >
                                        <FcOk size={24}/>
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="invoice-breakdown">
                            <div className="invoice-row">
                                <span className="invoice-label">{t("main.initAmount")}</span>
                                <span
                                    className="invoice-value">{transactionData.amount.toLocaleString()} {t("base.currency")}
                                </span>
                            </div>
                            {(selectedTip || customTipAmount) && (
                                <div className="invoice-row">
                                    <span className="invoice-label">
                                        {t("main.tipAmount")}
                                        {(() => {
                                            if (selectedTip === 'manual' && isManualTipConfirmed && Number(customTipAmount) > 0) {
                                                const percent = (Number(customTipAmount) / transactionData.amount) * 100;
                                                return ` ${percent.toFixed(1)}%`;
                                            } else if (typeof selectedTip === 'number') {
                                                return ` ${selectedTip}%`;
                                            } else {
                                                return '';
                                            }
                                        })()}
                                    </span>
                                    <span className="invoice-value">
                                        {(
                                            selectedTip === 'manual' && isManualTipConfirmed && Number(customTipAmount) > 0
                                                ? Number(customTipAmount)
                                                : typeof selectedTip === 'number'
                                                    ? Math.round(transactionData.amount * (selectedTip / 100))
                                                    : 0
                                        ).toLocaleString()} {t("base.currency")}
                                    </span>
                                </div>
                            )}
                        </div>

                        <h3 className="section-title">{t("base.selectPaymentMethod")}</h3>

                        <div className="payment-methods-grid">
                            {paymentMethods.map((method) => (
                                <div
                                    key={method.name}
                                    className={`payment-method-card 
                                    ${method.isPopular ? 'popular-card' : ''} 
                                    ${method.comingSoon || (method.disableWhenTip && selectedTip > 0 || method.disableWhenTip && customTipAmount > 0) ? 'coming-soon-card' : ''}`}
                                    onClick={
                                        !method.comingSoon && !(method.disableWhenTip && selectedTip > 0)
                                            ? () => handleButtonClick(method.key)
                                            : undefined
                                    }
                                >
                                    {method.isPopular && <div className="popular-badge">{t("base.popular")}</div>}
                                    {(method.comingSoon) && (
                                        <div className="soon-badge">{t("base.comingSoon")}</div>
                                    )}
                                    {(method.disableWhenTip && selectedTip > 0 || method.disableWhenTip && customTipAmount > 0) && (
                                        <div className="soon-badge disable-badge">{t("main.notAvailableWithTip")}</div>
                                    )}
                                    <div className="method-icon">
                                        <img
                                            src={
                                                method.comingSoon || (method.disableWhenTip && selectedTip > 0)
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
                                    <h2 className="modal-title">{t("main.payLinkTitle")}</h2>
                                    <div className="modal-buttons">
                                        <button
                                            className="modal-button primary-button"
                                            onClick={() => {
                                                window.open(modalContent, '_blank');
                                                closeModal();
                                            }}
                                        >
                                            {t("main.openNewTab")}
                                        </button>
                                        <button
                                            className="modal-button secondary-button"
                                            onClick={closeModal}
                                        >
                                            {t("main.close")}
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
                                        {t("main.alreadyProcessed")}
                                    </h2>
                                    <div className="modal-buttons">
                                        <button
                                            className="modal-button secondary-button"
                                            onClick={closeModal}
                                        >
                                            {t("main.close")}
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