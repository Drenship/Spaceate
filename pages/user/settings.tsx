
import React, { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';

import { fetchPostJSON } from '@libs/utils/api-helpers';
import { validateEmail } from '@libs/utils/formvalidate';
import useEditUserAddressModal from '@libs/hooks/modals/useEditUserAddressModal';
import useConfirmCodeModal from "@libs/hooks/modals/useConfirmCodeModal";
import useUserStore from '@libs/hooks/modals/useUserStore';

import BasescreenWrapper from '@components/Layouts/BasescreenLayout';
import Tabs from '@components/contents/Tab';
import { TypographyH1, TypographyH2, TypographyH3, TypographyH4, TypographyH5, TypographyH6, TypographyP, TypographySmall, TypographyTiny } from '@components/Typography/Typography';
import InputEmail from '@components/inputs/InputEmail';
import DefaultSendButton from '@components/buttons/DefaultSendButton';
import UserAddressCard from '@components/cards/UserAddressCard';
import InputPassword from '@components/inputs/InputPassword';

interface Props { }

const UserSettings: NextPage<Props> = () => {

    const useUser = useUserStore();
    const user = useUser.user;

    const useCodeStore = useConfirmCodeModal();

    const [activeTab, setActiveTab] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [updateEmail, setUpdateEmail] = useState<{
        newEmail: string | null,
        message: string | null,
        isSendedEmail: boolean
    }>({
        newEmail: null,
        message: null,
        isSendedEmail: false
    });

    

    const editUserAddressModal = useEditUserAddressModal();

    const handleUpdateNewEmail = async () => {
        try {
            if (!user) return;
            if (isLoading) return;
            if (!updateEmail.newEmail || !validateEmail(updateEmail.newEmail)) return;
            if (user.email === updateEmail.newEmail) return;

            setIsLoading(true)

            const result = await fetchPostJSON("/api/mailer", {
                emailType: 'VERIFY_NEW_MAIL',
                user: {
                    _id: user._id,
                    name: user.name,
                    currentEmail: user.email,
                    newEmail: updateEmail.newEmail,
                }
            })

            if (result.success) {
                useCodeStore.onOpen(handleConfirmCodeOfNewEmail, {
                    newEmail: updateEmail.newEmail,
                    code: null
                })

                setUpdateEmail(prev => ({ ...prev, isSendedEmail: true }))
            }
            setUpdateEmail(prev => ({ ...prev, message: result.message }))
        } catch (error) {
            setUpdateEmail(prev => ({ ...prev, message: error?.message || "Une erreur est survenue" }))
        } finally {
            setIsLoading(false)
        }

    }

    const handleConfirmCodeOfNewEmail = async (data) => {
        try {
            console.log(data)
            if (!data.code) return;
            useCodeStore.setLoading(true)

            const result = await fetchPostJSON("/api/user/update", {
                updateType: "UPDATE_NEW_EMAIL",
                data: data
            })

            if (result.success) {
                useCodeStore.onClose()
                setUpdateEmail(prev => ({ ...prev, isSendedEmail: false }))
                useUser.fetchUser()
            } else {

            }
        } catch (error) {
            console.log(error)
        } finally {
            useCodeStore.setLoading(false)
        }
    }

    return (
        <BasescreenWrapper title="Profile">
            <div className='flex flex-col px-5 my-12 lg:flex max-w-[1400px] w-full'>
                <Tabs
                    tabsData={[
                        { title: 'Profil' },
                        { title: 'Sécurité' },
                    ]}
                    setActive={setActiveTab}
                />

                { /* TAB 1 - Profil */}
                <div className={`flex-grow pt-5 border-t lg:mt-0 lg:w-full ${activeTab !== 1 && "hidden"}`}>
                    <div>
                        <Link href='/user'>
                            <h3 className='inline-block text-3xl font-bold'>{user?.name}</h3>
                        </Link>
                    </div>

                    <div className='inline-grid w-full pb-7'>
                        <div className='flex flex-col items-start w-full'>

                            { /* Update name and other information */}

                            <div className='grid w-full grid-cols-1 mt-5 col-span-full md:grid-cols-2'>
                                <div className='w-full max-w-lg'>
                                    <InputEmail
                                        title="Nouvelle email"
                                        input={{
                                            name: "new_email",
                                            defaultValue: "",
                                            placeholder: "entrer votre nouvelle email ...",
                                        }}
                                        onChange={(e: React.BaseSyntheticEvent) => setUpdateEmail(prev => ({ ...prev, newEmail: e.target.value })) }
                                    />
                                </div>
                                <div className='flex items-center justify-end w-full space-x-2'>
                                    {
                                        updateEmail.isSendedEmail ? (
                                            <DefaultSendButton
                                                title='Entrer le code'
                                                onClick={() => useCodeStore.onOpen(handleConfirmCodeOfNewEmail, {
                                                    newEmail: updateEmail.newEmail,
                                                    code: null
                                                })}
                                            />
                                        ) : (
                                            <DefaultSendButton
                                                title='Modifier'
                                                isDisabled={isLoading}
                                                isLoading={isLoading}
                                                onClick={handleUpdateNewEmail}
                                            />
                                        )
                                    }
                                </div>
                                {updateEmail.message && <p className='text-sm leading-[15px] italic'>{updateEmail.message}</p>}
                            </div>


                            <div className='w-full pt-5 mt-5 border-t'>
                                <div className='grid w-full max-w-lg grid-cols-1 space-y-5 col-span-full'>
                                    <InputPassword
                                        title="Ancien mot de passe"
                                        input={{
                                            name: "old_password",
                                            defaultValue: "",
                                            placeholder: "Ancien mot de passe ...",
                                        }}
                                    />

                                    <InputPassword
                                        title="Nouveau mot de passe"
                                        input={{
                                            name: "new_password",
                                            defaultValue: "",
                                            placeholder: "Nouveau mot de passe ...",
                                        }}
                                    />

                                    <InputPassword
                                        title="Confirmer le mot de passe"
                                        input={{
                                            name: "new_conf_password",
                                            defaultValue: "",
                                            placeholder: "Confirmer le mot de passe ...",
                                        }}
                                    />

                                    <DefaultSendButton
                                        title='Mettre à jour le mot de passe'
                                        isDisabled={isLoading}
                                        isLoading={isLoading}
                                        onClick={editUserAddressModal.onOpenAdd}
                                    />
                                </div>
                            </div>

                            <div className='grid w-full grid-cols-1 gap-4 py-5 mt-5 border-t col-span-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                                <div className='flex items-center justify-end w-full mb-5 space-x-2 col-span-full'>
                                    <DefaultSendButton
                                        title='Ajouter un Addresse'
                                        isDisabled={isLoading}
                                        isLoading={isLoading}
                                        onClick={editUserAddressModal.onOpenAdd}
                                    />
                                </div>

                                {
                                    useUser.user?.addresses?.map((address) => <UserAddressCard key={address._id} address={address} />)
                                }
                            </div>

                        </div>
                    </div>

                </div>

                { /* TAB 2 - Sécurité */}
                <div className={`flex-grow pt-5 border-t lg:mt-0 lg:w-full ${activeTab !== 2 && "hidden"}`}>
                    <div className="container px-4 mx-auto">
                        <TypographyH1>Titre h1</TypographyH1>
                        <TypographyH2>Titre h2</TypographyH2>
                        <TypographyH3>Titre h3</TypographyH3>
                        <TypographyH4>Titre h4</TypographyH4>
                        <TypographyH5>Titre h5</TypographyH5>
                        <TypographyH6>Titre h6</TypographyH6>
                        <TypographyP>
                            Paragraphe avec du texte standard. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.
                        </TypographyP>
                        <TypographySmall>
                            Texte en taille small. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.
                        </TypographySmall>
                        <TypographyTiny>
                            Texte en taille tiny. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.
                        </TypographyTiny>
                    </div>
                </div>

            </div>
        </BasescreenWrapper >
    )
}

UserSettings.auth = true;
export default UserSettings