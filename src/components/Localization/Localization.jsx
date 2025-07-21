import {useTranslation} from "react-i18next";

import "./Localization.scss"

export default function Localization() {
    const {i18n} = useTranslation();

    function changeLanguage(lang) {
        i18n.changeLanguage(lang);
        localStorage.setItem('i18nextLng', lang);
    }

    return (
        <div className="language-switcher">
            <button
                className={`lang-btn ${i18n.language === 'ru' ? 'active' : ''}`}
                onClick={() => changeLanguage('ru')}
            >
                🇷🇺
            </button>
            <button
                className={`lang-btn ${i18n.language === 'uz' ? 'active' : ''}`}
                onClick={() => changeLanguage('uz')}
            >
                🇺🇿
            </button>
            <button
                className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
            >
                🇬🇧
            </button>
        </div>
    )
}