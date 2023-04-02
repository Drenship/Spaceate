
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { fetchPostJSON } from '@libs/utils/api-helpers';
import { TypeUser } from '@libs/typings';

import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';
import Tabs from '@components/contents/Tab';
import { TypographyH1, TypographyH2, TypographyH3, TypographyH4, TypographyH5, TypographyH6, TypographyP, TypographySmall, TypographyTiny } from '@components/ui-ux/Typography';
import InputEmail from '@components/ui-ux/inputs/InputEmail';
import DefaultSendButton from '@components/ui-ux/buttons/DefaultSendButton';
import { validateEmail } from '@libs/utils/formvalidate';


interface Props { }

const UserSettings: NextPage<Props> = () => {

    const { data: session } = useSession();
    const user = session && session.user as TypeUser || null;

    const [activeTab, setActiveTab] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [newMail, setNewMail] = useState<string>("");
    const [sendMailDisablerd, setSendMailDisablerd] = useState<boolean>(false)
    const [updateMailMessage, setUpdateMailMessage] = useState<string | null>(null)
    const [togglePopupConfirmCodeMail, setTogglePopupConfirmCodeMail] = useState<boolean>(false)
    const [toggleConfirmCodeMail, setToggleConfirmCodeMail] = useState<boolean>(false)
    const [code, setCode] = useState<string[]>(Array(7).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

    const handleCodeChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const newCode = [...code];
        newCode[index] = e.target.value;
        setCode(newCode);

        if (e.target.value && index < code.length - 1) {
            // Focus on the next input field
            inputRefs.current[index + 1]?.focus();
        } else if (
            !e.target.value &&
            index > 0 &&
            e.nativeEvent.inputType === 'deleteContentBackward'
        ) {
            // Focus on the previous input field
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text');
        const pastedData = paste.length > 7 ? paste.slice(0, 6) : paste;
        console.log(pastedData)

        const newCode = pastedData.split('');
        setCode(newCode);
        inputRefs.current[code.length - 1]?.focus();

    };

    const handleConfirmNewMail = async () => {
        try {
            setIsLoading(true)

            const result = await fetchPostJSON("/api/user/update", { newEmail: newMail })

            if(result.success) {
                setTogglePopupConfirmCodeMail(false)
                setToggleConfirmCodeMail(false)
            }

        } catch (error) {

        } finally {
            setIsLoading(false)
        }
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

                    <div className='inline-grid w-full border-b py-7'>
                        <div className='flex flex-col items-start w-full'>
                            <p className="block text-xl font-semibold leading-tight text-gray-800">Profil</p>
                            <div className='grid w-full grid-cols-1 col-span-full md:grid-cols-2 gap-7 mt-7'>
                                <InputEmail
                                    title="Nouveau mail"
                                    description="Slug du produit"
                                    input={{
                                        name: "name",
                                        defaultValue: "",
                                        placeholder: "entrer un nom ...",
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


                            { /* Update name */}

                            { /* Update Email + confirmation */}
                            { /* Update New Email + confirmation */}

                            { /* Update Old pass */}
                            { /* Update New pass */}
                            { /* Update Confif new pass */}

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
                    <div className='fixed inset-0 z-50 flex items-center justify-center cursor-pointer bg-black/10'
                        onClick={() => setTogglePopupConfirmCodeMail(false)}
                    >
                        <div
                            className='relative w-full max-w-md p-5 bg-white rounded-md cursor-default'
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute text-2xl font-bold leading-none text-gray-400 transition-colors duration-300 top-5 right-5 hover:text-red-600"
                                onClick={() => setTogglePopupConfirmCodeMail(false)}
                            >
                                &times;
                            </button>

                            <TypographyH4 className='uppercase'>Entrez le code de vérification</TypographyH4>

                            <div className="flex space-x-2">
                                {code.map((value, index) => (
                                    <input
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        key={index}
                                        type="text"
                                        maxLength={1}
                                        className="w-10 font-mono text-3xl text-center border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                                        value={value}
                                        onChange={(e) => handleCodeChange(e, index)}
                                        onPaste={handlePaste}
                                    />
                                ))}
                            </div>

                            <div className='flex flex-col items-end w-full'>
                                <DefaultSendButton
                                    title='Confirmer'
                                    isDisabled={sendMailDisablerd || isLoading}
                                    isLoading={isLoading}
                                    onClick={handleConfirmNewMail}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
        </BasescreenWrapper>
    )
}

UserSettings.auth = true;
export default UserSettings