'use client';

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Modal from "@components/Modals/Modal";
import useEditUserAddressModal from "@libs/hooks/modals/useEditUserAddressModal";
import InputText from "@components/inputs/InputText";
import InputCheckbox from "@components/inputs/InputCheckbox";
import { Address } from "@libs/typings";
import { fetchPostJSON } from "@libs/utils/api-helpers";
import useUserStore from "@libs/hooks/modals/useUserStore";
import InputRadio from "@components/inputs/InputRadio";
import InputPhone from "@components/inputs/InputPhone";


const EditUserAddressModal = () => {
    const useUser = useUserStore();
    const editUserAddressModal = useEditUserAddressModal();
    const [isLoading, setIsLoading] = useState(false);
    const [address, setAddress] = useState<Address>({
        fullName: null,
        streetAddress: null,
        city: null,
        postalCode: null,
        country: null,
        phone: null,
        addressType: 'shipping',
        isDefault: false
    });

    useEffect(() => {
        if (['edit', 'delete'].includes(editUserAddressModal.mode) && editUserAddressModal.address) {
            setAddress(editUserAddressModal.address)
        } else {
            setAddress({
                fullName: null,
                streetAddress: null,
                city: null,
                postalCode: null,
                country: null,
                phone: null,
                addressType: 'shipping',
                isDefault: false
            })
        }
    }, [editUserAddressModal])

    const onSubmit = async () => {
        try {
            setIsLoading(true)
            if (editUserAddressModal.mode === 'add') {

                const result = await fetchPostJSON("/api/user/update", {
                    updateType: 'ADD_ADDRESS',
                    data: {
                        address: address
                    }
                })
                if (result.success) {
                    toast.success('Addresse ajouté avec succée');
                    editUserAddressModal.onClose();
                } else {
                    toast.error('Echec de l\'insertion');
                }
            }

            if (editUserAddressModal.mode === 'edit' && editUserAddressModal?.address?._id) {
                const result = await fetchPostJSON("/api/user/update", {
                    updateType: 'PUT_ADDRESS',
                    data: {
                        addressId: editUserAddressModal.address._id,
                        address: address
                    }
                })
                if (result.success) {
                    toast.success(result.message || 'Addresse mise à jour');
                    editUserAddressModal.onClose();
                } else {
                    toast.error(result.message || 'Echec de la mise à jour');
                }
            }

            if (editUserAddressModal.mode === 'delete' && editUserAddressModal?.address?._id) {
                const result = await fetchPostJSON("/api/user/update", {
                    updateType: 'REMOVE_ADDRESS',
                    data: {
                        addressId: editUserAddressModal.address._id
                    }
                })
                if (result.success) {
                    toast.success('Addresse supprimer');
                    editUserAddressModal.onClose();
                } else {
                    toast.error('Echec de la suppression');
                }
            }

        } catch (error) {
            toast.error(error?.message || "Une erreur server est survenue");
        } finally {
            setIsLoading(false)
            useUser.fetchUser();
        }
    }

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <div className='grid w-full grid-cols-1 gap-5 py-5 mt-5 text-black col-span-full md:grid-cols-2'>

                <InputText
                    title="Nom prénom"
                    input={{
                        name: "fullName",
                        defaultValue: address.fullName || '',
                        forceValue: address.fullName || '',
                        placeholder: "Nom complet ...",
                    }}
                    onChange={(e: React.BaseSyntheticEvent) => setAddress(prev => ({ ...prev, fullName: e.target.value }))}
                />

                <InputPhone
                    title="Téléphone"
                    input={{
                        name: "phone",
                        defaultValue: address.phone || '',
                        placeholder: "entrer votre numéro de téléphone...",
                    }}
                    onChange={(e: React.BaseSyntheticEvent) => setAddress(prev => ({ ...prev, phone: e.target.value }))}
                />

                <InputText
                    title="Address"
                    input={{
                        name: "address",
                        defaultValue: address.streetAddress || '',
                        forceValue: address.streetAddress || '',
                        placeholder: "address ...",
                    }}
                    onChange={(e: React.BaseSyntheticEvent) => setAddress(prev => ({ ...prev, streetAddress: e.target.value }))}
                />

                <InputText
                    title="Ville"
                    input={{
                        name: "city",
                        defaultValue: address.city || '',
                        forceValue: address.city || '',
                        placeholder: "entrer une ville ...",
                    }}
                    onChange={(e: React.BaseSyntheticEvent) => setAddress(prev => ({ ...prev, city: e.target.value }))}

                />

                <InputText
                    title="Code postal"
                    input={{
                        name: "postalCode",
                        defaultValue: address.postalCode || '',
                        forceValue: address.postalCode || '',
                        placeholder: "entrer votre code postal ...",
                    }}
                    onChange={(e: React.BaseSyntheticEvent) => setAddress(prev => ({ ...prev, postalCode: e.target.value }))}

                />

                <InputText
                    title="Pays"
                    input={{
                        name: "country",
                        defaultValue: address.country || '',
                        forceValue: address.country || '',
                        placeholder: "entrer un pays ...",
                    }}
                    onChange={(e: React.BaseSyntheticEvent) => setAddress(prev => ({ ...prev, country: e.target.value }))}
                />

                <InputRadio
                    label="Address de livraison"
                    input={{
                        name: "addressType",
                        value: "shipping",
                        checked: address.addressType === "shipping" ? true : false,
                    }}
                    onChange={(e: React.BaseSyntheticEvent) => setAddress(prev => ({ ...prev, addressType: e.target.value }))}
                />

                <InputRadio
                    label="Address de facturation"
                    input={{
                        name: "addressType",
                        value: "billing",
                        checked: address.addressType === "billing" ? true : false,
                    }}
                    onChange={(e: React.BaseSyntheticEvent) => setAddress(prev => ({ ...prev, addressType: e.target.value }))}
                />

                <div className="text-black col-span-full">
                    <InputCheckbox
                        title="Definir comme addresse par default"
                        input={{
                            name: "isDefault",
                            checked: address.isDefault || false,
                        }}
                        onChange={(e: React.BaseSyntheticEvent) => setAddress(prev => ({ ...prev, isDefault: e.target.checked ? true : false }))}
                    />
                </div>

            </div>
        </div>
    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={editUserAddressModal.isOpen}
            title={
                editUserAddressModal.mode === 'add'
                    ? "Ajouter un nouvelle addresse !"
                    : editUserAddressModal.mode === 'edit'
                        ? "Mettre a jour l'addresse"
                        : "Supprimer l'addresse"
            }
            actionLabel={
                editUserAddressModal.mode === 'add'
                    ? "Ajouter"
                    : editUserAddressModal.mode === 'edit'
                        ? "Mettre a jour"
                        : "Supprimer"
            }
            onClose={editUserAddressModal.onClose}
            onSubmit={onSubmit}
            body={bodyContent}
        />
    );
}

export default EditUserAddressModal;