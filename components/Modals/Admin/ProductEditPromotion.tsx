'use client';

import { useState } from "react";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import useAdminPromotionModal from "@libs/hooks/modals/useAdminPromotionModal";
import Modal from "@components/Modals/Modal";
import { InputNumber } from "@components/inputs/InputNumber";
import InputCheckbox from "@components/inputs/InputCheckbox";
import { fetchPostJSON } from "@libs/utils/api-helpers";
import { toast } from "react-hot-toast";

interface IPromotionsProps {
    startDate: Date | undefined;
    endDate: Date | undefined;
    discountPercentage: number;
    isActive: boolean;
}

const ProductEditPromotion = () => {
    const usePromotionStore = useAdminPromotionModal();
    const [promotion, setPromotion] = useState<IPromotionsProps>({
        startDate: new Date(),
        endDate: new Date(),
        discountPercentage: 5,
        isActive: true,
    })

    const selectionRange = {
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        key: 'selection',
    }


    const onSubmit = async () => {
        try {
            usePromotionStore.setLoading(true)


            const result = await fetchPostJSON("/api/admin/products/update", {
                updateType: 'PUT_PROMOTION',
                data: {
                    promotion: promotion,
                    productIds: usePromotionStore.products,
                }
            })
            if (result.success) {
                toast.success(result.message || 'Addresse mise à jour');
                usePromotionStore.onClose();
            } else {
                toast.error(result.message || 'Echec de la mise à jour');
            }
        } catch (error) {
            toast.error(error?.message || "Une erreur server est survenue");
        } finally {
            usePromotionStore.setLoading(false)
        }
    }

    const bodyModal = (
        <div className="flex flex-col gap-4">
            <div className='grid w-full grid-cols-1 gap-5 text-black col-span-full md:grid-cols-2'>
                <p>{usePromotionStore.products.length} produits selectionner</p>

                <div className="flex items-center justify-center col-span-full">
                    <DateRangePicker
                        ranges={[selectionRange]}
                        minDate={new Date()}
                        rangeColors={['#FD5B61']}
                        className="hide-rdrDefinedRangesWrapper"
                        direction="horizontal"
                        staticRanges={[]}
                        inputRanges={[]}
                        onChange={(ranges) => setPromotion(prev => ({
                            ...prev,
                            startDate: ranges.selection.startDate,
                            endDate: ranges.selection.endDate
                        }))}
                    />
                </div>

                <div className="col-span-full">
                    <InputNumber
                        title="Remise en pourcentage sur le produit"
                        description="Remise applicable"
                        input={{
                            name: "discountPercentage",
                            defaultValue: promotion.discountPercentage || 5,
                            min: 1,
                            max: 100,
                            step: 1,
                            placeholder: "Pourcentage de remise...",
                        }}
                        onChange={(e: React.BaseSyntheticEvent) => setPromotion(prev => ({ ...prev, discountPercentage: e.target.value }))}
                    />
                </div>

                <div className="text-black col-span-full">
                    <InputCheckbox
                        title="Definir comme addresse par default"
                        input={{
                            name: "isDefault",
                            checked: promotion.isActive || false,
                        }}
                        onChange={(e: React.BaseSyntheticEvent) => setPromotion(prev => ({ ...prev, isActive: e.target.checked ? true : false }))}
                    />
                </div>

            </div>
        </div>
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