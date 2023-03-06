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