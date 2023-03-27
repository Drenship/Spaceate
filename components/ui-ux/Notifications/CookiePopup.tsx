// components/CookiePopup.js

import Link from 'next/link';
import { useState, useEffect } from 'react';

const CookiePopup = () => {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            setShowPopup(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setShowPopup(false);
    };

    return (
        showPopup ? (
            <div className="fixed bottom-0 left-0 z-50 w-full p-4 text-white bg-gray-900">
                <div className="container flex items-center justify-between mx-auto">
                    <p>
                        Ce site utilise des cookies pour améliorer votre expérience. En
                        continuant à naviguer sur ce site, vous acceptez notre utilisation
                        des cookies. 
                        Voire la <Link href="/terms/politique-de-confidentialite" className='underline hover:text-gray-400'>Politique de confidentialité</Link>.
                    </p>
                    <button
                        onClick={acceptCookies}
                        className="px-4 py-2 ml-4 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Accepter
                    </button>
                </div>
            </div>
        ) : <></>
    );
};

export default CookiePopup;
