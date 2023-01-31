import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Notification from '@components/ui-ux/Notification'


const defaultPush = (notify) => { }; // Méthode de base que l'on mettra dans le contexte par défaut

const NotifyContext = createContext({
    pushNotifyRef: { current: defaultPush },
});

// On entourera notre application de ce provider pour rendre le notify fonctionnel
export function NotifyContextProvider({ children }) {
    const pushNotifyRef = useRef(defaultPush);
    return (
        <NotifyContext.Provider value={{ pushNotifyRef }}>
            <Notifys />
            {children}
        </NotifyContext.Provider>
    );
}


export function Notifys() {
    const [notifys, setNotify] = useState([]);
    // On modifie la méthode du contexte
    const { pushNotifyRef } = useContext(NotifyContext);
    pushNotifyRef.current = ({ duration, ...props }) => {
        // On génère un id pour différencier les messages
        const id = Date.now();
        // On sauvegarde le timer pour pouvoir l'annuler si le message est fermé
        const timer = setTimeout(() => {
            setNotify((v) => v.filter((t) => t.id !== id));
        }, (duration ?? 5) * 1000);
        const notify = { ...props, id, timer };
        setNotify((v) => [...v, notify]);
    };

    const onRemove = (notify) => {
        clearTimeout(notify.timer);
        setNotify((v) => v.filter((t) => t !== notify));
    };

    return (
        <div className="fixed right-0 z-50 flex flex-col justify-end overflow-hidden top-16">
            <AnimatePresence>
                {notifys.map((notify) => (
                    <motion.div
                        onClick={() => onRemove(notify)}
                        key={notify.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                    >
                        <Notification {...notify} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

export function useNotifys() {
    const { pushNotifyRef } = useContext(NotifyContext);
    return {
        pushNotify: useCallback((notify) => {
            pushNotifyRef.current(notify);
        }, [pushNotifyRef])
    }
}