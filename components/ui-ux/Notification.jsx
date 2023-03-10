import React, { useMemo, useState } from "react";

export default function Notification({ type, icon, title, subTitle }) {
    const [show, setShow] = useState(true);

    const imageNotificationUrl = useMemo(() => {
        switch (icon ? icon.toUpperCase() : "") {
            case "CART":
                return "https://cdn3d.iconscout.com/3d/premium/thumb/cart-5590713-4652405.png"

            case "PAY":
                return "https://static.vecteezy.com/system/resources/thumbnails/012/487/843/small/payment-icon-for-shopping-online-3d-hand-holding-banknote-cartoon-businessman-wear-blue-suit-hold-money-floating-isolated-on-transparent-e-commerce-withdraw-money-concept-3d-minimal-render-png.png"

            case "TRACK":
                return "https://cdn3d.iconscout.com/3d/premium/thumb/tracking-location-5815770-4873886.png"

            case "SHIPMENT":
                return "https://cdn3d.iconscout.com/3d/premium/thumb/fast-delivery-package-wings-5168320-4323791.png"

            case "NOTIFICATION":
                return "https://i.pinimg.com/originals/60/16/c1/6016c1cac8ea844a34116f0df05b8736.png"

            case "ERROR":
                return "https://cdn2.iconfinder.com/data/icons/business-work-2/512/error_404___warning_danger_alert_notification.png"

            default:
                return "https://cdn3d.iconscout.com/3d/premium/thumb/clapping-hands-3311967-2764509.png"
        }
    }, [icon]);

    const background = useMemo(() => {
        switch (type ? type.toUpperCase() : "") {
            case "SUCCESS":
                return "bg-green-800"

            case "DEFAULT":
                return "bg-gray-800"

            case "ERROR":
                return "bg-red-800"

            default:
                return "bg-gray-800"
        }
    }, [type]);

    if (show === false) return;

    return (
        <div className="z-50 mt-2">
            <div className="flex items-end justify-end">
                {/*code for notification starts */}
                <div role="alert" className={`relative max-w-[580px] w-full flex justify-between h-[88px] py-4 pl-3 pr-4 transition duration-150 ease-in-out rounded shadow sm:items-center sm:pr-8 sm:py-0 ${background}`} id="notification">

                    <img className="relative object-cover h-full sm:p-2 aspect-square" src={imageNotificationUrl} />

                    <div className="flex items-start w-full ml-5">
                        <div>
                            <p className="text-sm font-bold text-gray-100 sm:text-lg md:leading-5">{title}</p>
                            <p className="text-xs font-medium leading-4 sm:leading-3 text-gray-300 mt-1.5 sm:mt-3">{subTitle}</p>
                        </div>
                    </div>

                    <div className="right-0 h-full pl-4 border-gray-700 sm:ml-14 sm:pl-8 sm:border-l sm:py-7 absolue aspect-square">
                        <button
                            onClick={() => setShow(false)}
                            className="flex items-center justify-center w-5 h-5 text-gray-100 focus:outline-none sm:w-8 sm:h-8 aspect-square"
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