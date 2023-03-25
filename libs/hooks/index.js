import { useCallback, useEffect, useRef } from "react";

export function useInterval(callback, delay) {
    const savedCallback = useRef();
    let id = null;
    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    });
    // Set up the interval.
    useEffect(() => {
        function tick() {
            if (typeof savedCallback?.current === "function") {
                savedCallback.current();
            }
        }
        if (delay > 0) {
            id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
        if (delay === 0 && id !== null) {
            id = null
            return () => clearInterval(id);
        }
    }, [delay]);
}

/**
 * 
 * @param {function} callback
 * @param {number} delay 
 * @param {boolean | null | string} restart Condition pour annuler et redémarrer de 0 le Timeout
 */
export function useTimeout(callback, delay, restart) {
    const savedCallback = useRef();
    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    });
    // Set up the timeout.
    useEffect(() => {
        if (restart === false) return;

        function tick() {
            if (typeof savedCallback?.current === "function") {
                savedCallback.current();
            }
        }
        if (delay !== 0) {
            const id = setTimeout(tick, delay);
            return () => clearTimeout(id);
        }
    }, [restart]);
}

export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}


export function useEscapeListener(ref, callback) {
    // sidebar click event close
    const clickListener = useCallback(e => {
        if (ref.current && !ref.current.contains(e.target)) {
            callback()
        }
    }, [ref])

    // sidebar keyboard event close
    const escapeListener = useCallback(e => {
        if (e.key === 'Escape') {
            callback()
        }
    }, [])

    // sidebar init event
    useEffect(() => {
        if (ref) {
            document.addEventListener('click', clickListener)
            document.addEventListener('keyup', escapeListener)
        }
        return () => {
            document.removeEventListener('click', clickListener)
            document.removeEventListener('keyup', escapeListener)
        }
    }, [clickListener, escapeListener, ref])
}

export const useEscapeGallery = (isOpenLightboxGallery, setIsOpenLightboxGallery) => {
    const handleEscape = (event) => {
        if (event.key === "Escape") {
            setIsOpenLightboxGallery(false);
        }
    };

    const handleBackButton = () => {
        setIsOpenLightboxGallery(false);
    };

    useEffect(() => {
        if (isOpenLightboxGallery) {
            document.body.classList.add("no-scroll");
            document.addEventListener("keydown", handleEscape);
            window.addEventListener("popstate", handleBackButton);
        } else {
            document.body.classList.remove("no-scroll");
            document.removeEventListener("keydown", handleEscape);
            window.removeEventListener("popstate", handleBackButton);
        }
    }, [isOpenLightboxGallery, setIsOpenLightboxGallery]);
};

export const useClickOutside = (ref, onClose) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, onClose]);
};

export const useSwipeUp = (setIsOpenLightboxGallery) => {
    const startY = useRef(null);
    const endY = useRef(null);

    const handleTouchStart = (event) => {
        startY.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
        endY.current = event.touches[0].clientY;
    };

    const handleTouchEnd = () => {
        if (startY.current && endY.current && startY.current > endY.current) {
            setIsOpenLightboxGallery(false);
        }

        startY.current = null;
        endY.current = null;
    };

    useEffect(() => {
        document.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, [setIsOpenLightboxGallery]);
};