'use client';

import { useState } from "react";

import Modal from "@components/Modals/Modal";
import useEditUserAddressModal from "@libs/hooks/modals/useEditUserAddressModal";
import InputText from "@components/inputs/InputText";

const EditUserAddressModal = () => {
    const eitUserAddressModal = useEditUserAddressModal();
    const [isLoading, setIsLoading] = useState(false);



    const onSubmit = () => {
        //setIsLoading(true);

    }

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <div className='grid w-full grid-cols-1 gap-5 py-5 mt-5 col-span-full md:grid-cols-2'>
                <InputText
                    title="Address"
                    input={{
                        name: "address",
                        defaultValue: "",
                        placeholder: "address ...",
                    }}
                    onChange={(e: React.BaseSyntheticEvent) => console.log(e.target.value)}
                />
                <InputText
                    title="Address 2"
                    input={{
                        name: "address2",
                        defaultValue: "",
                        placeholder: "address 2 ...",
                    }}
                    onChange={(e: React.BaseSyntheticEvent) => console.log(e.target.value)}
                />

                <InputText
                    title="Ville"
                    input={{
                        name: "city",
                        defaultValue: "",
                        placeholder: "entrer une ville ...",
                    }}
                    onChange={(e: React.BaseSyntheticEvent) => console.log(e.target.value)}
                />

                <InputText
                    title="Code postal"
                    input={{
                        name: "postalCode",
                        defaultValue: "",
                        placeholder: "entrer votre code postal ...",
                    }}
                    onChange={(e: React.BaseSyntheticEvent) => console.log(e.target.value)}
                />

                <InputText
                    title="Pays"
                    input={{
                        name: "country",
                        defaultValue: "",
                        placeholder: "entrer un pays ...",
                    }}
                    onChange={(e: React.BaseSyntheticEvent) => console.log(e.target.value)}
                />

            </div>
        </div>
    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={eitUserAddressModal.isOpen}
            title={
                eitUserAddressModal.mode === 'add'
                    ? "Ajouter un nouvelle addresse !"
                    : "Mettre a jour l'addresse"
            }
            actionLabel="Ajouter"
            onClose={eitUserAddressModal.onClose}
            onSubmit={onSubmit}
            body={bodyContent}
        />
    );
}

export default EditUserAddressModal;