import React from 'react';
import ReactCountryFlag from "react-country-flag"
import { useTranslation } from 'react-i18next';

import styles from './styles/LanguageBar.module.css'

const LanguageBar = () => {
    const { i18n } = useTranslation();
    const changeLanguage = lng => {
        i18n.changeLanguage(lng)
    }
    return (
        <div className={styles.position}>
            <ReactCountryFlag onClick={() => changeLanguage('bg')}
                countryCode="BG"
                svg
                className={styles.flag}
                title="BG" />
            <ReactCountryFlag
                onClick={() => changeLanguage('en')}
                countryCode="GB"
                svg
                className={styles.flag}
                title="GB"
            />
        </div>
    );
};
export default LanguageBar;