import "./RatingPlaceholder.css"
import {useTranslation} from "react-i18next";

const RatingPlaceholder = ({feedback, setFeedback}) => {
    const {t} = useTranslation();

    return (
        <div className="feedback-section">
            <label htmlFor="feedback">{t("main.feedback.messageTitle")}</label>
            <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={t("main.feedback.messagePlaceholder")}
                rows={4}
                className="feedback-textarea"
            />
        </div>
    );
};

export default RatingPlaceholder;
