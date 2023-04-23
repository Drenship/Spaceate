import React, { useEffect, useState } from 'react';
import { NextPage } from 'next/types';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { fetchPostJSON } from '@libs/utils/api-helpers';
import BasescreenWrapper from '@components/Layouts/BasescreenLayout';
import SpliteWrapper from '@components/Wrapper/SpliteWrapper';
import InputEmail from '@components/inputs/InputEmail';
import DefaultSendButton from '@components/buttons/DefaultSendButton';
import { toast } from 'react-hot-toast';
import { validateEmail } from '@libs/utils/formvalidate';
import InputPassword from '@components/inputs/InputPassword';
import InputPastCode from '@components/inputs/InputPastCode';

const Recovery: NextPage = () => {

    const { data: session } = useSession();

    const router = useRouter();
    const { redirect } = router.query;

    useEffect(() => {
        if (session?.user) {
            if (typeof redirect === 'string') {
                router.push(redirect);
            } else {
                router.push('/');
            }
        }
    }, [router, session, redirect]);

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [email, setEmail] = useState<string | undefined>(undefined)
    const [code, setCode] = useState<string | undefined>(undefined)
    const [step, setStep] = useState<number>(0)
    const [updatePassword, setUpdatePassword] = useState<{ newPassword: string, confirmPassword: string }>({
        newPassword: "",
        confirmPassword: ""
    });

    const handleSendEmail = async () => {
        try {
            setIsLoading(true);
            if (!email) {
                return toast.error('Entrer un email')
            }

            const isValid = validateEmail(email)
            if (!isValid) {
                return toast.error('Entrer un email valide')
            }

            const result = await fetchPostJSON("/api/mailer", {
                emailType: 'RECOVERY_PASSWORD_MAIL',
                email: email
            })

            if (result.success) {
                setStep(1)
                return toast.success(result.message || 'Un mail vous à étais envoyer')
            } else {
                return toast.error(result.message || 'Echec de l\'envoie dumail')
            }

        } catch (error) {
            const err = error as Error;
            return toast.error(err.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyCode = async () => {
        try {
            setIsLoading(true);

            if (!email || !validateEmail(email)) {
                return toast.error('Entrer un email valide');
            }

            const result = await fetchPostJSON('/api/user/recovery_password', {
                action: 'VERIFY_CODE',
                email,
                code,
            });

            if (result.success) {
                setStep(2);
                toast.success(result.message || 'Code vérifié avec succès');
            } else {
                toast.error(result.message || "Échec de la vérification du code");
            }
        } catch (error) {
            const err = error as Error;
            return toast.error(err.message || 'Une erreur est survenue');
          } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitNewPassword = async () => {
        try {
            setIsLoading(true);

            if (!email || !validateEmail(email)) {
                return toast.error('Entrer un email valide');
            }

            if (updatePassword.newPassword !== updatePassword.confirmPassword) {
                return toast.error('Les mots de passe ne correspondent pas');
            }

            const result = await fetchPostJSON('/api/user/recovery_password', {
                action: 'UPDATE_PASSWORD',
                email,
                newPassword: updatePassword.newPassword,
            });

            if (result.success) {
                toast.success(result.message || 'Mot de passe mis à jour avec succès');
                // Redirect or show a success message
                router.push('/auth/login');
            } else {
                toast.error(result.message || "Échec de la mise à jour du mot de passe");
            }
        } catch (error) {
            const err = error as Error;
            return toast.error(err.message || 'Une erreur est survenue');
          } finally {
            setIsLoading(false);
        }
    };

    return (
        <BasescreenWrapper title={"Mot de passe oublier"}>
            <div className='min-h-[calc(100vh-64px)] w-full flex items-center justify-center'>
                <SpliteWrapper title='Mot de passe oublier'>

                    {
                        step === 0 && (
                            <form className='w-full max-w-4xl space-y-5' onSubmit={e => e.preventDefault()}>
                                <InputEmail
                                    title="Email"
                                    input={{
                                        name: "email",
                                        defaultValue: "",
                                        placeholder: "entrer votre email ...",
                                    }}
                                    onChange={(e: React.BaseSyntheticEvent) => setEmail(e.target.value)}
                                />
                                <div className='flex justify-end'>
                                    <DefaultSendButton
                                        title='Recevoir un code'
                                        isDisabled={isLoading}
                                        isLoading={isLoading}
                                        onClick={handleSendEmail}
                                    />
                                </div>
                            </form>
                        )
                    }
                    {
                        step === 1 && (
                            <form className='w-full max-w-4xl space-y-5' onSubmit={e => e.preventDefault()}>
                                <InputPastCode setValue={setCode} />
                                <div className='flex justify-end'>
                                    <DefaultSendButton
                                        title='Envoyer le code'
                                        isDisabled={isLoading}
                                        isLoading={isLoading}
                                        onClick={handleVerifyCode}
                                    />
                                </div>
                            </form>
                        )
                    }

                    {
                        step === 2 && (
                            <form className='w-full max-w-4xl space-y-5' onSubmit={e => e.preventDefault()}>
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

                                <div className='flex justify-end'>
                                    <DefaultSendButton
                                        title='Mettre à jour le mot de passe'
                                        isDisabled={isLoading}
                                        isLoading={isLoading}
                                        onClick={handleSubmitNewPassword}
                                    />
                                </div>
                            </form>
                        )
                    }

                </SpliteWrapper>
            </div>
        </BasescreenWrapper>
    );
}

export default Recovery