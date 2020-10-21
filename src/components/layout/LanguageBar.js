import React from 'react';
import ReactCountryFlag from "react-country-flag"
import { useTranslation } from 'react-i18next';
import cx from "classnames";

import styles from './styles/LanguageBar.module.css'

const LanguageBar = () => {
    const { i18n } = useTranslation();
    const changeLanguage = lng => {
        i18n.changeLanguage(lng)
    }
    return (
        <div className={cx(styles.position, styles.cursor)}>
                <ReactCountryFlag onClick={() => changeLanguage('bg')}
                countryCode="BG"
                svg
                className={styles.flag}
                title="Български" />
            
            <ReactCountryFlag
                onClick={() => changeLanguage('en')}
                countryCode="GB"
                svg
                className={styles.flag}
                title="GB"
            />
            <ReactCountryFlag
                onClick={() => changeLanguage('de')}
                countryCode="DE"
                svg
                className={styles.flag}
                title="DE"
            />
        </div>
    );
};
export default LanguageBar;