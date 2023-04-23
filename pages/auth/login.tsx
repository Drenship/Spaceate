import React, { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NextPage } from 'next';

import BasescreenWrapper from '@components/Layouts/BasescreenLayout'
import SpliteWrapper from '@components/Wrapper/SpliteWrapper';
import { toast } from 'react-hot-toast';


const LoginScreen: NextPage = () => {

    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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

    const {
        handleSubmit,
        register,
        getValues,
        formState: { errors },
    } = useForm();

    const submitHandler = async ({ email, password }: any) => {
        try {
            setIsLoading(true)
            const result: any = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });
            if (result.error) {
                setError(true)
                setErrorMessage(result.error);
                return toast.error(result.error || 'Une erreur server est survenue');
            }
        } catch (error) {
            setError(true)
            const err = error as Error;
            return toast.error(err.message || 'Une erreur server est survenue');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <BasescreenWrapper title={"Se connecter"}>
            <div className='md:min-h-[calc(100vh-64px)] min-h-[calc(100vh-128px)] w-full flex items-center justify-center'>
                <SpliteWrapper>
                    <form
                        className={`relative w-full px-6 py-10 space-y-8 bg-white rounded md:shadow-lg md:max-w-md md:px-14 ${error && 'border border-red-500'}`}
                        onSubmit={handleSubmit(submitHandler)}
                    >
                        <div>
                            <h1 className="text-4xl font-semibold">Se connecter</h1>
                            {error && <p className='text-red-400'>{errorMessage}</p>}
                        </div>

                        <div className="space-y-4">
                            <label className="inline-block w-full">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className={`input w-full border-b-2 outline-none ${errors.email ? 'border-orange-500' : 'border-gray-400'} ${error && 'border border-red-500'}`}
                                    {...register('email', {
                                        required: 'Veuillez entrer un mail valide.',
                                        pattern: {
                                            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                                            message: 'Veuillez entrer un mail valide.',
                                        },
                                    })}
                                />
                                {errors.email && errors.email.message && (
                                    <p className="p-1 text-[13px] font-light text-orange-500">{errors.email.message}</p>
                                )}
                            </label>
                            <div className="inline-block w-full">
                                <label className="inline-block w-full">
                                    <input
                                        type="password"
                                        {...register('password', {
                                            required: "Veuillez entrer un mot de passe valide entre 4 et 60 caractères.",
                                            minLength: { value: 6, message: 'password is more than 5 chars' },
                                        })}
                                        placeholder="Password"
                                        className={`input w-full border-b-2 outline-none ${errors.password ? 'border-orange-500' : 'border-gray-400'} ${error && 'border border-red-500'}`}
                                    />
                                    {errors.password && errors.password.message && (
                                        <p className="p-1 text-[13px] font-light  text-orange-500">{errors.password.message}</p>
                                    )}
                                </label>
                                <div className='flex items-end justify-end w-full'>
                                    <Link className="font-semibold cursor-pointer hover:underline" href="/auth/recovery" >Mot de passe oublier</Link>
                                </div>
                            </div>
                        </div>

                        <button
                            className="flex items-center justify-center w-full py-3 font-semibold text-white uppercase bg-black rounded button-click-effect"
                            disabled={isLoading}
                            type="submit"
                        >
                            {
                                isLoading && (
                                    <svg aria-hidden="true" role="status" className="inline w-5 h-5 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                    </svg>
                                )
                            }
                            <span>Se connecter</span>
                        </button>

                        <div className="text-gray-800">
                            Pas encore de compte ?{' '}
                            <Link className="cursor-pointer hover:underline" href="/auth/register" >S'inscrire</Link>
                        </div>
                    </form>

                </SpliteWrapper>
            </div>
        </BasescreenWrapper>
    )
}

export default LoginScreen