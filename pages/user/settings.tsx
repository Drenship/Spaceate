
import React, { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { fetchPostJSON } from '@libs/utils/api-helpers';
import { TypeUser } from '@libs/typings';
import { validateEmail } from '@libs/utils/formvalidate';

import BasescreenWrapper from '@components/Layouts/BasescreenLayout';
import Tabs from '@components/contents/Tab';
import { TypographyH1, TypographyH2, TypographyH3, TypographyH4, TypographyH5, TypographyH6, TypographyP, TypographySmall, TypographyTiny } from '@components/Typography/Typography';
import InputEmail from '@components/inputs/InputEmail';
import DefaultSendButton from '@components/buttons/DefaultSendButton';
import InputPastCode from '@components/inputs/InputPastCode';
import PopupWrapper from '@components/Wrapper/PopupWrapper';

import useEditUserAddressModal from '@libs/hooks/modals/useEditUserAddressModal';
import useUserStore from '@libs/hooks/modals/useUserStore';

interface Props { }

const UserSettings: NextPage<Props> = () => {

    const { data: session } = useSession();
    const user = session && session.user as TypeUser || null;

    const useUser = useUserStore();

    const [activeTab, setActiveTab] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [code, setCode] = useState<string | null>(null);
    const [newMail, setNewMail] = useState<string>("");
    const [sendMailDisablerd, setSendMailDisablerd] = useState<boolean>(false)
    const [updateMailMessage, setUpdateMailMessage] = useState<string | null>(null)
    const [toggleConfirmCodeMail, setToggleConfirmCodeMail] = useState<boolean>(false)
    const [togglePopupConfirmCodeMail, setTogglePopupConfirmCodeMail] = useState<boolean>(false)


    const eitUserAddressModal = useEditUserAddressModal();

    const handleUpdateNewMail = async () => {
        try {
            if (!user) return;
            if (sendMailDisablerd) return;
            if (!validateEmail(newMail)) return;
            if (user.email === newMail) return;

            setSendMailDisablerd(true)
            setIsLoading(true)

            const result = await fetchPostJSON("/api/mailer", {
                emailType: 'VERIFY_NEW_MAIL',
                user: {
                    _id: user._id,
                    name: user.name,
                    currentEmail: user.email,
                    newEmail: newMail,
                }
            })

            if (result.success) {
                setTogglePopupConfirmCodeMail(true)
                setToggleConfirmCodeMail(true)
                setTimeout(() => setSendMailDisablerd(false), 1000 * 60)
            } else {
                setSendMailDisablerd(false)
            }
            setUpdateMailMessage(result.message)
        } catch (error) {
            setSendMailDisablerd(false)
        } finally {
            setIsLoading(false)
        }

    }

    const handleConfirmNewMail = async () => {
        try {
            setIsLoading(true)

            const result = await fetchPostJSON("/api/user/update", {
                updateType: "UPDATE_NEW_EMAIL",
                data: {
                    newEmail: newMail,
                    code: code.join('')
                }
            })
            console.log(result)

            if (result.success) {
                setTogglePopupConfirmCodeMail(false)
                setToggleConfirmCodeMail(false)
            } else {

            }

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddAddress = async () => { }
    const handlePutAddress = async () => { }
    const handleRemoveAddress = async () => { }


    return (
        <BasescreenWrapper title="Profile">
            <div className='flex flex-col px-5 my-12 lg:flex max-w-[1400px] w-full'>
                <Tabs
                    tabsData={[
                        { title: 'Profil' },
                        { title: 'Sécurité' },
                        { title: 'Test' },
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
                                <InputEmail
                                    title="Nouvelle email"
                                    input={{
                                        name: "new_email",
                                        defaultValue: "",
                                        placeholder: "entrer votre nouvelle email ...",
                                    }}
                                    onChange={(e: React.BaseSyntheticEvent) => setNewMail(e.target.value)}
                                />
                                <div className='flex items-center justify-end w-full space-x-2'>
                                    {
                                        toggleConfirmCodeMail && !togglePopupConfirmCodeMail && (
                                            <DefaultSendButton
                                                title='Entrer le code'
                                                onClick={() => setTogglePopupConfirmCodeMail(true)}
                                            />
                                        )
                                    }
                                    <DefaultSendButton
                                        title='Modifier'
                                        isDisabled={sendMailDisablerd || isLoading}
                                        isLoading={isLoading}
                                        onClick={handleUpdateNewMail}
                                    />
                                </div>
                                {updateMailMessage && <p className='text-sm leading-[15px] italic'>{updateMailMessage}</p>}
                            </div>

                            { /* Update Old pass */}
                            { /* Update New pass */}
                            { /* Update Confif new pass */}


                            <div className='grid w-full grid-cols-1 py-5 mt-5 border-t col-span-full md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
                                <div className='flex items-center justify-end w-full space-x-2 col-span-full'>
                                    <DefaultSendButton
                                        title='Ajouter un Addresse'
                                        isDisabled={isLoading}
                                        isLoading={isLoading}
                                        onClick={eitUserAddressModal.onOpenAdd}
                                    />
                                </div>

                                {
                                    useUser.user?.addresses.map((address) => (
                                        <div
                                            key={address._id}
                                            className='border'
                                        >
                                            {address.fullName}

                                            <DefaultSendButton
                                                title='Modifier'
                                                isDisabled={isLoading}
                                                isLoading={isLoading}
                                                onClick={() => eitUserAddressModal.onOpenEdit(address)}
                                            />

                                            <DefaultSendButton
                                                title='Supprimer'
                                                isDisabled={isLoading}
                                                isLoading={isLoading}
                                                onClick={() => eitUserAddressModal.onOpenDelete(address)}
                                            />
                                        </div>
                                    ))
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

                { /* TAB 3 - Test */}
                <div className={`flex-grow pt-5 border-t lg:mt-0 lg:w-full ${activeTab !== 3 && "hidden"}`}>
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

            {
                togglePopupConfirmCodeMail && (
                    <PopupWrapper
                        toggleModal={togglePopupConfirmCodeMail}
                        setToggleModal={setTogglePopupConfirmCodeMail}
                    >

                        <TypographyH4 className='uppercase select-none max-md:hidden'>Entrez le code de vérification</TypographyH4>
                        <TypographyH6 className='uppercase select-none md:hidden'>Entrez le code de vérification</TypographyH6>
                        <InputPastCode setValue={setCode} />

                        <div className='flex flex-col items-end w-full mt-5'>
                            <DefaultSendButton
                                title='Confirmer'
                                isDisabled={isLoading}
                                isLoading={isLoading}
                                onClick={handleConfirmNewMail}
                            />
                        </div>
                    </PopupWrapper>
                )
            }

        </BasescreenWrapper >
    )
}

UserSettings.auth = true;
export default UserSettings