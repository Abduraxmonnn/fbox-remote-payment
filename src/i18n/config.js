import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        lng: localStorage.getItem('i18nextLng') || 'en',
        resources: {
            en: {
                translations: require('./locales/en.json')
            },
            ru: {
                translations: require('./locales/ru.json')
            },
            uz: {
                translations: require('./locales/uz.json')
            }
        },
        ns: ['translations'],
        defaultNS: 'translations',
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
        react: {
            useSuspense: false,
        }
    });

i18n.languages = ['en', 'ru', 'uz'];

export default i18n;
