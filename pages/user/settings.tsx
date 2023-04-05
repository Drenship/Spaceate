
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { fetchPostJSON } from '@libs/utils/api-helpers';
import { TypeUser } from '@libs/typings';
import { validateEmail } from '@libs/utils/formvalidate';

import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';
import Tabs from '@components/contents/Tab';
import { TypographyH1, TypographyH2, TypographyH3, TypographyH4, TypographyH5, TypographyH6, TypographyP, TypographySmall, TypographyTiny } from '@components/ui-ux/Typography';
import InputEmail from '@components/ui-ux/inputs/InputEmail';
import DefaultSendButton from '@components/ui-ux/buttons/DefaultSendButton';
import InputPastCode from '@components/ui-ux/inputs/InputPastCode';
import PopupWrapper from '@components/Wrapper/PopupWrapper';
import InputText from '@components/ui-ux/inputs/InputText';
import ScrollShadowWrapper from '@components/Wrapper/ScrollShadowWrapper';


interface Props { }

const UserSettings: NextPage<Props> = () => {

    const { data: session } = useSession();
    const user = session && session.user as TypeUser || null;

    const [activeTab, setActiveTab] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [code, setCode] = useState<string | null>(null);
    const [newMail, setNewMail] = useState<string>("");
    const [sendMailDisablerd, setSendMailDisablerd] = useState<boolean>(false)
    const [updateMailMessage, setUpdateMailMessage] = useState<string | null>(null)
    const [toggleConfirmCodeMail, setToggleConfirmCodeMail] = useState<boolean>(false)
    const [togglePopupConfirmCodeMail, setTogglePopupConfirmCodeMail] = useState<boolean>(false)

    const [togglePopupAddress, setTogglePopupAddress] = useState<boolean>(false)

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

    const handleAddAddress = async () => {}
    const handlePutAddress = async () => {}
    const handleRemoveAddress = async () => {}

    const getAddress = (address) => {
        if (!address?.address) return "";
        return `${address.address}, ${address.city} ${address.postalCode}, ${address.country}`
    }

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
                                        onClick={() => setTogglePopupAddress(true)}
                                    />
                                </div>

                                <div>d</div>
                                <div>d</div>
                                <div>d</div>
                                <div>d</div>
                                <div>d</div>

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

            {
                togglePopupAddress && (
                    <PopupWrapper
                        toggleModal={togglePopupAddress}
                        setToggleModal={setTogglePopupAddress}
                    >

                        <TypographyH4 className='uppercase select-none max-md:hidden'>Ajouter un nouvelle addresse</TypographyH4>
                        <TypographyH6 className='uppercase select-none md:hidden'>Ajouter un nouvelle addresse</TypographyH6>

                        <ScrollShadowWrapper className='w-full'>
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

                        </ScrollShadowWrapper>

                        <div className='flex flex-col items-end w-full mt-5'>
                            <DefaultSendButton
                                title='Ajouter'
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