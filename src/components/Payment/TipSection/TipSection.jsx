import {FcOk} from 'react-icons/fc';
import {useTranslation} from 'react-i18next';
import "./TipSection.scss"

export default function TipSection({
                                       selectedTip,
                                       setSelectedTip,
                                       customTipAmount,
                                       setCustomTipAmount,
                                       isManualTipConfirmed,
                                       setIsManualTipConfirmed,
                                       transactionData,
                                       saveTipToStorage,
                                       handleConfirmManualTip,
                                   }) {
    const {t} = useTranslation();

    const tipOptions = [
        {label: '0%', value: 0},
        {label: '5%', value: 5},
        {label: '10%', value: 10},
        {label: '15%', value: 15},
        {label: '20%', value: 20},
    ];

    const handleTipSelect = (tip) => {
        if (tip === 'manual') {
            if (selectedTip === 'manual' && !isManualTipConfirmed) {
                setSelectedTip(null);
                setCustomTipAmount('');
            } else {
                setSelectedTip('manual');
                setCustomTipAmount('');
                setIsManualTipConfirmed(false);
            }
        } else {
            setSelectedTip(tip);
            setCustomTipAmount('');
            setIsManualTipConfirmed(false);

            const base = transactionData?.amount || 0;
            const tipAmt = Math.round(base * (tip / 100));
            const total = base + tipAmt;
            saveTipToStorage(base, 'percentage', tip, tipAmt, total);
        }
    };

    return (
        <>
            <h3 className="tip-title">{t('base.leaveTip')}</h3>
            <div className="tip-buttons">
                <button
                    className={`tip-button ${selectedTip === 'manual' && !isManualTipConfirmed ? 'selected' : ''}`}
                    onClick={() => handleTipSelect('manual')}
                >
                    {t('base.manual')}
                </button>

                {(selectedTip !== 'manual' || isManualTipConfirmed) ? (
                    tipOptions.map((tip) => (
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
                            placeholder={t('base.customTipPlaceholder')}
                            value={customTipAmount}
                            onChange={(e) => setCustomTipAmount(e.target.value)}
                        />
                        <button className="tip-confirm-button" onClick={handleConfirmManualTip}>
                            <FcOk size={42}/>
                        </button>
                    </>
                )}
            </div>
        </>
    );
}
