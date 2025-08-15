import {useState} from "react";
import {useTranslation} from "react-i18next";
import "./TipReceiver.scss";

export default function TipReceiver({onChange}) {
    const {t} = useTranslation();
    const [recipient, setRecipient] = useState("waiter");
    const [isEditing, setIsEditing] = useState(false);

    const recipientOptions = [
        {label: t("base.waiter") || "Waiter", value: "waiter"},
        {label: t("base.chef") || "Chef", value: "chef"},
        {label: t("base.manager") || "Manager", value: "manager"},
    ];

    const handleChange = (e) => {
        const value = e.target.value;
        setRecipient(value);
        setIsEditing(false);
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <div className="tip-receiver">
            {!isEditing ? (
                <div className="tip-receiver-display">
                    <span className="tip-receiver-label">
                        {t("base.tipReceiver") || "Tip Receiver"}:{" "}
                        <strong>
                            {recipientOptions.find((r) => r.value === recipient)?.label}
                        </strong>
                    </span>
                    <button
                        className="tip-receiver-change-btn"
                        onClick={() => setIsEditing(true)}
                    >
                        {t("base.change") || "Change"}
                    </button>
                </div>
            ) : (
                <select
                    className="tip-receiver-select"
                    value={recipient}
                    onChange={handleChange}
                >
                    {recipientOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
}
