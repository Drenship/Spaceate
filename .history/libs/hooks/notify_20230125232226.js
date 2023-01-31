import { useCallback, useContext, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Notification from '@components/ui-ux/Notification'


const defaultPush = (toast) => { }; // Méthode de base que l'on mettra dans le contexte par défaut

const ToastContext = createContext({
    pushToastRef: { current: defaultPush },
});

// On entourera notre application de ce provider pour rendre le toasts fonctionnel
export function NotifyContextProvider({ children }) {
    const pushToastRef = useRef(defaultPush);
    return (
        <ToastContext.Provider value={{ pushToastRef }}>
            <Toasts />
            {children}
        </ToastContext.Provider>
    );
}


export function Toasts() {
    const [toasts, setToasts] = useState([]);
    // On modifie la méthode du contexte
    const { pushToastRef } = useContext(ToastContext);
    pushToastRef.current = ({ duration, ...props }) => {
        // On génère un id pour différencier les messages
        const id = Date.now();
        // On sauvegarde le timer pour pouvoir l'annuler si le message est fermé
        const timer = setTimeout(() => {
            setToasts((v) => v.filter((t) => t.id !== id));
        }, (duration ?? 5) * 1000);
        const toast = { ...props, id, timer };
        setToasts((v) => [...v, toast]);
    };

    const onRemove = (toast) => {
        clearTimeout(toast.timer);
        setToasts((v) => v.filter((t) => t !== toast));
    };

    return (
        <div className="toast-container">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        onClick={() => onRemove(toast)}
                        key={toast.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                    >
                        <Notification {...toast} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

export function useToasts() {
    const { pushToastRef } = useContext(ToastContext);
    return {
        pushToast: useCallback((toast) => {
            pushToastRef.current(toast);
        }, [pushToastRef])
    }
}