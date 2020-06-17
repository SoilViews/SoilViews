import React from 'react';
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
 
const SignedOutLinks = () => {
    const { t } = useTranslation();
    return (
        <React.Fragment>
            {/* <li><NavLink to='/signup'>SignUp</NavLink></li> */}
            <li><NavLink to='/signin'>{t('Login')}</NavLink></li>
        </React.Fragment>
    )
}

export default SignedOutLinks