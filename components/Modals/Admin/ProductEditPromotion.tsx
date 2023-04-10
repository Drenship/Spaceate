'use client';

import useAdminPromotionModal from "@libs/hooks/modals/useAdminPromotionModal";
import Modal from "@components/Modals/Modal";


const ProductEditPromotion = () => {
    const usePromotionStore = useAdminPromotionModal();


    const onSubmit = async () => {
        try {
            usePromotionStore.setLoading(true)
        } catch (error) {
            
        } finally {
            usePromotionStore.setLoading(false)
        }
    }

    const bodyModal = (
        <>
            <h1>Modal </h1>
            {
                usePromotionStore.products.map(x => (
                    <div>{x}</div>
                ))
            }
        </>
    )

    return (
        <Modal
            disabled={usePromotionStore.isLoading}
            isOpen={usePromotionStore.isOpen}
            title="Code de vérification"
            actionLabel="Confirmer"
            onClose={usePromotionStore.onClose}
            onSubmit={onSubmit}
            body={bodyModal}
        />
    );
}

export default ProductEditPromotion;