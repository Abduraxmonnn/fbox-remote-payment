import {useEffect, useRef, useState} from 'react';
import AOS from 'aos';
import {toast} from "sonner";
import Modal from 'react-modal';
import 'aos/dist/aos.css';
import {useTranslation} from 'react-i18next';
import {images} from '../../constants';
import {INIT_API, INIT_LOCAL_API, DATA_API, DATA_LOCAL_API} from '../../api';
import DefaultPaymentServices from '../DefaultPaymentService/DefaultPaymentService';
import {
    AlreadyProcessedModal,
    AmountSection,
    BannerSection,
    InvoiceBreakdown,
    PaymentMethodGrid,
    SafariModal,
    TipSection
} from "../../components/Payment";
import RatingStar from "../../components/Feedback/RatingStar/RatingStar";
import RatingDropdown from "../../components/Feedback/RatingDropdown/RatingDropdown";
import RatingPlaceholder from "../../components/Feedback/RatingPlaceholder/RatingPlaceholder";
import '../PaymentServices.scss';

Modal.setAppElement('#root');

const API = INIT_LOCAL_API;
// const API = INIT_API;
const APIData = DATA_LOCAL_API;
// const APIData = DATA_API;
//
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
    const [theme, setTheme] = useState('light');
    const [selectedTip, setSelectedTip] = useState(null);
    const [customTipAmount, setCustomTipAmount] = useState('');
    const [isManualTipConfirmed, setIsManualTipConfirmed] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isProcessed, setIsProcessed] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [rating, setRating] = useState(0)
    const [hoveredStar, setHoveredStar] = useState(0)
    const [feedback, setFeedback] = useState("")

    const hasShownRef = useRef(false);

    useEffect(() => {
        if (
            transactionData &&
            !transactionData.isExistTip &&
            !hasShownRef.current
        ) {
            toast.info(t("main.tipUnavailable"), {
                style: {
                    background: "var(--sonner-info-bg)",
                    color: "var(--sonner-info-label)",
                    borderColor: "var(--sonner-info-bg)"
                },
            });
            hasShownRef.current = true;
        }
    }, [transactionData, t]);


    useEffect(() => {
        if (transactionData?.s2pTheme) {
            setTheme(transactionData.s2pTheme);
        }
    }, [transactionData]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        AOS.init({duration: 2000});
        fetchTransactionData();
    }, []);

    useEffect(() => {
        if (transactionData) {
            const saved = localStorage.getItem('scan2payTipData');
            if (saved) {
                try {
                    const {tipType, tipValue} = JSON.parse(saved);

                    if (tipType === 'percentage') {
                        setSelectedTip(tipValue);
                        setCustomTipAmount('');
                    } else if (tipType === 'manual') {
                        setSelectedTip('manual');
                        setCustomTipAmount(tipValue.toString());
                        setIsManualTipConfirmed(true);
                    }
                } catch (e) {
                    console.warn('Failed to restore tip data:', e);
                }
            }
        }
    }, [transactionData]);

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
                iSScan2payTip: response.data.is_scan2pay_tip,
                scan2payDefaultTipPercent: response.data.scan2pay_default_tip_percent,
                isExistTip: response.data.is_exist_tip
            };

            setTransactionData(data);
        } catch (err) {
            console.error('Something went wrong:', err);
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

    const handleConfirmManualTip = () => {
        const amount = Number(customTipAmount);
        if (amount > 0 && transactionData) {
            setIsManualTipConfirmed(true);
            const base = transactionData.amount;
            const total = base + amount;
            saveTipToStorage(base, 'manual', amount, amount, total);
        }
    };

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
            } else if (response.data.status === 'error' && response.data.message === 'Transaction already Processed.') {
                setIsProcessed(true);
                setModalIsOpen(true);
            } else {
                console.log('Response status:', response.data.status);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(t('main.paymentError'));
            setTimeout(() => setErrorMessage(''), 5000);
        }
    };

    const isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIphone = () => /iPhone/i.test(navigator.userAgent);
    const closeModal = () => setModalIsOpen(false);

    if (!transactionData) return <DefaultPaymentServices/>;

    return (
        <div className="payment-page default-page">
            {errorMessage && <div className="toast-error">{errorMessage}</div>}

            <BannerSection banner={transactionData.marketBanner || images.default_banner}
                           logo={transactionData.marketLogo || images.default_store}/>

            <div className="content">
                <div className="address-container">
                    <p className="restaurant-address">
                        {transactionData.marketAddress || t('main.marketAddress')}
                    </p>
                </div>

                <AmountSection
                    amount={transactionData.amount}
                    selectedTip={selectedTip}
                    customTipAmount={customTipAmount}
                    isManualTipConfirmed={isManualTipConfirmed}
                />

                <p className="invoice-number">{t('main.invoiceNumber')} №{transactionData.orderId}</p>

                <>
                    <div
                        className={`tip-content ${
                            transactionData.isExistTip === false
                                ? "blurred"
                                : ""
                        }`}
                    >
                        <TipSection
                            selectedTip={selectedTip}
                            setSelectedTip={setSelectedTip}
                            customTipAmount={customTipAmount}
                            setCustomTipAmount={setCustomTipAmount}
                            isManualTipConfirmed={isManualTipConfirmed}
                            setIsManualTipConfirmed={setIsManualTipConfirmed}
                            transactionData={transactionData}
                            saveTipToStorage={saveTipToStorage}
                            handleConfirmManualTip={handleConfirmManualTip}
                        />

                        {/*<TipReceiver onChange={(value) => console.log("Selected receiver:", value)}/>*/}
                    </div>
                    {/*{transactionData.isExistTip === false && (*/}
                    {/*    <div className="tip-overlay">*/}
                    {/*        <span>{t("main.tipUnavailable")}</span>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </>

                <InvoiceBreakdown
                    amount={transactionData.amount}
                    selectedTip={selectedTip}
                    customTipAmount={customTipAmount}
                    isExistTip={transactionData.isExistTip}
                    isManualTipConfirmed={isManualTipConfirmed}
                />

                <RatingStar
                    rating={rating}
                    setRating={setRating}
                    hoveredStar={hoveredStar}
                    setHoveredStar={setHoveredStar}
                    t={t}
                />
                <RatingDropdown rating={rating} setRating={setRating}/>
                <RatingPlaceholder feedback={feedback} setFeedback={setFeedback}/>

                <h3 className="section-title">{t('base.selectPaymentMethod')}</h3>

                <PaymentMethodGrid
                    paymentMethods={paymentMethods}
                    selectedTip={selectedTip}
                    customTipAmount={customTipAmount}
                    theme={theme}
                    handleButtonClick={handleButtonClick}
                />

                <p className="footer">scan2pay powered by FiscalBox</p>

                {(isSafari() || isIphone()) && (
                    <SafariModal isOpen={modalIsOpen && !isProcessed} onClose={closeModal} url={modalContent}/>
                )}

                {isProcessed && (
                    <AlreadyProcessedModal isOpen={modalIsOpen} onClose={closeModal}/>
                )}
            </div>
        </div>
    );
}
