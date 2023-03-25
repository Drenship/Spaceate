import { useCallback, useEffect, useRef, useState } from "react";
import isMobile from "is-mobile";

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
    const screenHeight = typeof window !== "undefined" ? window.innerHeight : 0;

    const handleTouchStart = (event) => {
        startY.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
        endY.current = event.touches[0].clientY;
    };

    const handleTouchEnd = () => {
        if (
            startY.current &&
            endY.current &&
            startY.current - endY.current > screenHeight / 10
        ) {
            setIsOpenLightboxGallery(false);
        }

        startY.current = null;
        endY.current = null;
    };

    useEffect(() => {
        if (isMobile()) {
            document.addEventListener("touchstart", handleTouchStart);
            document.addEventListener("touchmove", handleTouchMove);
            document.addEventListener("touchend", handleTouchEnd);

            return () => {
                document.removeEventListener("touchstart", handleTouchStart);
                document.removeEventListener("touchmove", handleTouchMove);
                document.removeEventListener("touchend", handleTouchEnd);
            };
        }
    }, [setIsOpenLightboxGallery]);
};

export const useDoubleTap = (onDoubleTap) => {
    const lastTapRef = useRef(null);

    const handleTouchEnd = () => {
        const now = Date.now();

        if (lastTapRef.current && now - lastTapRef.current <= 500) {
            onDoubleTap();
        }

        lastTapRef.current = now;
    };

    return { onTouchEnd: handleTouchEnd };
};

export const useSwipeAndDoubleTap = (setIsOpenLightboxGallery) => {
    useSwipeUp(setIsOpenLightboxGallery);

    const { onTouchEnd } = useDoubleTap(() => {
        setIsOpenLightboxGallery(false);
    });

    useEffect(() => {
        if (typeof window !== "undefined" && isMobile()) {
            document.addEventListener("touchend", onTouchEnd);

            return () => {
                document.removeEventListener("touchend", onTouchEnd);
            };
        }
    }, [onTouchEnd, setIsOpenLightboxGallery]);
};

export const useLeftSwipe = (onSwipe) => {
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchStartY, setTouchStartY] = useState(null);

    useEffect(() => {
        const handleTouchStart = (event) => {
            const touch = event.touches[0];

            setTouchStartX(touch.clientX);
            setTouchStartY(touch.clientY);
        };

        const handleTouchEnd = (event) => {
            if (touchStartX !== null && touchStartY !== null) {
                const touch = event.changedTouches[0];
                const deltaX = touch.clientX - touchStartX;
                const deltaY = touch.clientY - touchStartY;
                const absDeltaX = Math.abs(deltaX);
                const absDeltaY = Math.abs(deltaY);

                if (absDeltaX > 0.2 * window.innerWidth && absDeltaX > absDeltaY && deltaX < 0) {
                    onSwipe();
                }

                setTouchStartX(null);
                setTouchStartY(null);
            }
        };

        document.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchend", handleTouchEnd);

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, [touchStartX, touchStartY, onSwipe]);

    return {};
};

export const useRightSwipe = (onSwipe) => {
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchStartY, setTouchStartY] = useState(null);

    useEffect(() => {
        const handleTouchStart = (event) => {
            const touch = event.touches[0];

            setTouchStartX(touch.clientX);
            setTouchStartY(touch.clientY);
        };

        const handleTouchEnd = (event) => {
            if (touchStartX !== null && touchStartY !== null) {
                const touch = event.changedTouches[0];
                const deltaX = touch.clientX - touchStartX;
                const deltaY = touch.clientY - touchStartY;
                const absDeltaX = Math.abs(deltaX);
                const absDeltaY = Math.abs(deltaY);

                if (absDeltaX > 0.2 * window.innerWidth && absDeltaX > absDeltaY && deltaX > 0) {
                    onSwipe();
                }

                setTouchStartX(null);
                setTouchStartY(null);
            }
        };

        document.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchend", handleTouchEnd);

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, [touchStartX, touchStartY, onSwipe]);

    return {};
};

export const useSwipeAxeX = (onSwipeLeft, onSwipeRight) => {
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchStartY, setTouchStartY] = useState(null);

    useEffect(() => {
        const handleTouchStart = (event) => {
            const touch = event.touches[0];

            setTouchStartX(touch.clientX);
            setTouchStartY(touch.clientY);
        };

        const handleTouchEnd = (event) => {
            if (touchStartX !== null && touchStartY !== null) {
                const touch = event.changedTouches[0];
                const deltaX = touch.clientX - touchStartX;
                const deltaY = touch.clientY - touchStartY;
                const absDeltaX = Math.abs(deltaX);
                const absDeltaY = Math.abs(deltaY);

                if (absDeltaX > 0.2 * window.innerWidth && absDeltaX > absDeltaY) {
                    if (deltaX < 0) {
                        onSwipeLeft();
                    } else {
                        onSwipeRight();
                    }
                }

                setTouchStartX(null);
                setTouchStartY(null);
            }
        };

        document.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchend", handleTouchEnd);

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, [touchStartX, touchStartY, onSwipeLeft, onSwipeRight]);

    return {};
};