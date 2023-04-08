
import React, { useMemo, useRef, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';

import { fetchPostJSON } from '@libs/utils/api-helpers';
import { validateEmail, verifyPassword } from '@libs/utils/formvalidate';
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
import { PASSWORD_REQUIRED } from '@config/index';
import { CheckIcon } from '@heroicons/react/solid';
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-hot-toast';

interface Props { }

const UserSettings: NextPage<Props> = () => {

    const useUser = useUserStore();
    const user = useUser.user;

    const useCodeStore = useConfirmCodeModal();
    const editUserAddressModal = useEditUserAddressModal();

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoadingPassword, setIsLoadingPassword] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState<number>(1);
    
    const formEmailRef = useRef<HTMLFormElement>(null);
    const [updateEmail, setUpdateEmail] = useState<{
        newEmail: string | null,
        message: string | null,
        isSendedEmail: boolean
    }>({
        newEmail: null,
        message: null,
        isSendedEmail: false
    });

    const formPasswordRef = useRef<HTMLFormElement>(null);
    const [updatePassword, setUpdatePassword] = useState<{
        oldPassword: string,
        newPassword: string,
        confirmPassword: string,
    }>({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [isValidePasswords, isValidConditions] = useMemo(() => {

        const hasOldPassword = updatePassword.oldPassword.length > 0
        const isSamePassWord = updatePassword.newPassword === updatePassword.confirmPassword
        const [isValidate, isValidConditions] = verifyPassword(updatePassword.newPassword, PASSWORD_REQUIRED)

        return [isValidate && isSamePassWord && hasOldPassword, {
            hasOldPassword,
            ...isValidConditions,
            isSamePassWord
        }]
    }, [updatePassword])



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
                toast.success(result.message || "Un email vous à été envoyer.");
            } else {
                toast.error(result.message || "Une erreur est survenue.");
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
                if (formEmailRef.current) {
                    formEmailRef.current.reset();
                }
                useCodeStore.onClose()
                setUpdateEmail({
                    newEmail: null,
                    message: null,
                    isSendedEmail: false
                })
                useUser.fetchUser()
                toast.success(result.message || "Votre email à bien été mit à jour.");
            } else {
                toast.error(result.message || "Une erreur est survenue.");
            }
        } catch (error) {
            toast.error(error?.message || "Une erreur est survenue.");
        } finally {
            useCodeStore.setLoading(false)
        }
    }

    const handleSubmitPassword = async () => {
        try {
            if (!isValidePasswords) return toast.error("Les conditions ne sont pas remplit.");
            setIsLoadingPassword(true)

            const result = await fetchPostJSON("/api/user/update", {
                updateType: "UPDATE_PASSWORD",
                data: updatePassword
            })

            if (result.success) {
                if (formPasswordRef.current) {
                    formPasswordRef.current.reset();
                }
                toast.success(result.message);
                setUpdatePassword({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                })
            } else {
                toast.error(result.message || "Une erreur est survenue.");
            }

        } catch (error) {
            toast.error(error?.message || "Une erreur est survenue.");
        } finally {
            setIsLoadingPassword(false)
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
                                <TypographyH4 className='font-semibold col-span-full'>Changer d'addresse email</TypographyH4>
                                <form 
                                    ref={formEmailRef}
                                    onSubmit={e => e.preventDefault()} 
                                    className='w-full max-w-lg'
                                    >
                                    <InputEmail
                                        title="Nouvelle email"
                                        input={{
                                            name: "new_email",
                                            defaultValue: "",
                                            placeholder: "entrer votre nouvelle email ...",
                                        }}
                                        onChange={(e: React.BaseSyntheticEvent) => setUpdateEmail(prev => ({ ...prev, newEmail: e.target.value }))}
                                    />
                                </form>
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
                                <TypographyH4 className='font-semibold col-span-full'>Modifier le mot de passe</TypographyH4>
                                <div className='flex justify-between max-md:flex-col'>
                                    <form
                                        ref={formPasswordRef}
                                        onSubmit={e => e.preventDefault()}
                                        className='flex flex-col items-center justify-center w-full max-w-lg space-y-5 col-span-full'
                                    >
                                        <InputPassword
                                            title="Ancien mot de passe"
                                            input={{
                                                name: "oldPassword",
                                                defaultValue: "",
                                                placeholder: "Ancien mot de passe ...",
                                            }}
                                            onChange={(e: React.BaseSyntheticEvent) => setUpdatePassword(prev => ({ ...prev, oldPassword: e.target.value }))}
                                        />
                                        <InputPassword
                                            title="Nouveau mot de passe"
                                            input={{
                                                name: "newPassword",
                                                defaultValue: "",
                                                placeholder: "Nouveau mot de passe ...",
                                            }}
                                            onChange={(e: React.BaseSyntheticEvent) => setUpdatePassword(prev => ({ ...prev, newPassword: e.target.value }))}
                                        />
                                        <InputPassword
                                            title="Confirmer le mot de passe"
                                            input={{
                                                name: "confirmPassword",
                                                defaultValue: "",
                                                placeholder: "Confirmer le mot de passe ...",
                                            }}
                                            onChange={(e: React.BaseSyntheticEvent) => setUpdatePassword(prev => ({ ...prev, confirmPassword: e.target.value }))}

                                        />
                                        <DefaultSendButton
                                            title='Mettre à jour le mot de passe'
                                            className="w-full"
                                            isDisabled={isLoadingPassword}
                                            isLoading={isLoadingPassword}
                                            onClick={handleSubmitPassword}
                                        />
                                    </form>

                                    <div className='flex items-center justify-center w-full'>
                                        <div className='w-full max-w-lg p-4 space-y-3'>
                                            <TypographyH6 className='font-semibold col-span-full'>Modifier le mot de passe</TypographyH6>
                                            <div className='flex items-center space-x-2'>
                                                {isValidConditions.hasOldPassword ? <CheckIcon className='w-5' /> : <RxCross1 className='w-5' />}
                                                <span className={`text-base leading-[15px] ${isValidConditions.hasOldPassword && 'line-through'}`}>Entrer votre ancien mot de passe.</span>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                {isValidConditions.isLength ? <CheckIcon className='w-5' /> : <RxCross1 className='w-5' />}
                                                <span className={`text-base leading-[15px] ${isValidConditions.isLength && 'line-through'}`}>Doit contenir au moins {PASSWORD_REQUIRED.minLength} caractère(s).</span>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                {isValidConditions.isUpperCase ? <CheckIcon className='w-5' /> : <RxCross1 className='w-5' />}
                                                <span className={`text-base leading-[15px] ${isValidConditions.isUpperCase && 'line-through'}`}>Doit contenir au moins {PASSWORD_REQUIRED.minUpperCase} caractère(s) en MAJUSCULE.</span>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                {isValidConditions.isLowerCase ? <CheckIcon className='w-5' /> : <RxCross1 className='w-5' />}
                                                <span className={`text-base leading-[15px] ${isValidConditions.isLowerCase && 'line-through'}`}>Doit contenir au moins {PASSWORD_REQUIRED.minLowerCase} caractère(s) en minuscule.</span>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                {isValidConditions.isNumbers ? <CheckIcon className='w-5' /> : <RxCross1 className='w-5' />}
                                                <span className={`text-base leading-[15px] ${isValidConditions.isNumbers && 'line-through'}`}>Doit contenir au moins {PASSWORD_REQUIRED.minNumbers} nombre(s).</span>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                {isValidConditions.isSpecialChars ? <CheckIcon className='w-5' /> : <RxCross1 className='w-5' />}
                                                <span className={`text-base leading-[15px] ${isValidConditions.isSpecialChars && 'line-through'}`}>Doit contenir au moins {PASSWORD_REQUIRED.minSpecialChars} caractère(s) spéciaux.</span>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                {isValidConditions.isSamePassWord ? <CheckIcon className='w-5' /> : <RxCross1 className='w-5' />}
                                                <span className={`text-base leading-[15px] ${isValidConditions.isSamePassWord && 'line-through'}`}>Confirmer le mot de passe.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='grid w-full grid-cols-1 gap-4 py-5 mt-5 border-t col-span-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                                <TypographyH4 className='font-semibold col-span-full'>Mes addresses</TypographyH4>

                                {
                                    useUser.user?.addresses?.map((address) => <UserAddressCard key={address._id} address={address} />)
                                }
                                <div className='flex items-center justify-end w-full mb-5 space-x-2 col-span-full'>
                                    <DefaultSendButton
                                        title='Ajouter un Addresse'
                                        isDisabled={isLoading}
                                        isLoading={isLoading}
                                        onClick={editUserAddressModal.onOpenAdd}
                                    />
                                </div>
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