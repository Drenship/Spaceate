'use client';
import Modal from "@components/Modals/Modal";

import useConfirmCodeModal from "@libs/hooks/modals/useConfirmCodeModal";
import InputPastCode from "@components/inputs/InputPastCode";
import { useCallback, useEffect, useState } from "react";


const ConfirmCodeModal = () => {
    const useCodeStore = useConfirmCodeModal();
    const [code, setCode] = useState<string | null>(null)

    useEffect(() => {
        if (!code) return;
        const data = Object.assign({ ...useCodeStore.data }, { code: code })
        useCodeStore.setData(data)
    }, [code])


    const onSubmit = async () => {
        console.log(useCodeStore.data)
        useCodeStore.handleSubmit(useCodeStore.data)
    }


    return (
        <Modal
            disabled={useCodeStore.isLoading}
            isOpen={useCodeStore.isOpen}
            title="Code de vérification"
            actionLabel="Confirmer"
            onClose={useCodeStore.onClose}
            onSubmit={onSubmit}
            body={(
                <InputPastCode setValue={setCode} />
            )}
        />
    );
}

export default ConfirmCodeModal;