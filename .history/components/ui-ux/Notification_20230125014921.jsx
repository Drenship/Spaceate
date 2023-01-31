import React, { useState } from "react";

export default function Notification() {
    const [show, setShow] = useState(true);

    if (show === false) return;

    return (
        <div className="fixed bottom-5 right-5">
            <div className="flex items-end justify-end mr-6 sm:mr-12">
                {/*code for notification starts*/}
                <div role="alert" className="relative flex justify-between py-4 pl-3 pr-4 transition duration-150 ease-in-out bg-white rounded shadow sm:items-center dark:bg-gray-800 sm:pr-8 sm:py-0" id="notification">
                    <img className="absolute bottom-0" src="https://i.ibb.co/xXc3LDg/Saly-8.png" />
                    <div className="flex items-start w-full ml-11">
                        <div>
                            <p className="text-sm font-bold text-gray-800 sm:text-lg md:leading-5 dark:text-gray-100">Install and get 50% off</p>
                            <p className="text-xs font-medium leading-4 sm:leading-3 text-gray-600 dark:text-gray-300 mt-1.5 sm:mt-3">The wait is over. Our sale is now live. Go get it</p>
                        </div>
                    </div>

                    <div className="right-0 h-full pl-4 border-gray-200 sm:ml-14 sm:pl-8 sm:border-l dark:border-gray-700 sm:py-7 absolue">
                        <button
                            onClick={() => setShow(false)}
                            className="flex items-center justify-center w-5 h-5 text-gray-800 focus:outline-none dark:text-gray-100 sm:w-8 sm:h-8"
                        >
                            <svg width={8} height={12} viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.2294 5.99999L0.457397 2.22932L2.34273 0.342651L8.00006 5.99999L2.34273 11.6573L0.457397 9.77065L4.2294 5.99999Z" fill="currentColor" />
                            </svg>
                        </button>
                    </div>
                </div>
                {/*code for notification ends*/}
            </div>
        </div>
    );
}