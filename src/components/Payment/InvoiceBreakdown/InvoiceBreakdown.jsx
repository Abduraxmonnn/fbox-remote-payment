import {useTranslation} from "react-i18next";
import {formatNumber} from "../../../utils/formatNumber";
import "./InvoiceBreakdown.scss"

export default function InvoiceBreakdown({amount, selectedTip, customTipAmount, isManualTipConfirmed}) {
    const {t} = useTranslation();
    const tipAmount = selectedTip === 'manual' && Number(customTipAmount) > 0
        ? Number(customTipAmount)
        : typeof selectedTip === 'number'
            ? (amount * selectedTip) / 100
            : 0;

    return (
        <div className="invoice-breakdown">
            <div className="invoice-row">
                <span className="invoice-label">{t("main.initAmount")}</span>
                <span className="invoice-value">{formatNumber(amount)} {t("base.currency")}</span>
            </div>
            {tipAmount > 0 && (
                <div className="invoice-row">
                    <div className="label-percent">
                        <span className="label">{t("main.tipAmount")}</span>
                        {selectedTip === 'manual' ? (
                            <span className="percent">{((tipAmount / amount) * 100).toFixed(1)}%</span>
                        ) : (
                            <span className="percent">{selectedTip}%</span>
                        )}
                    </div>
                    <div className="amount">{formatNumber(tipAmount)} {t("base.currency")}</div>
                </div>
            )}
        </div>
    );
}
