import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import AuthscreenWrapper from '@components/Wrapper/AuthscreenWrapper'


function LoginScreen() {

    const { data: session } = useSession();

    const router = useRouter();
    const { redirect } = router.query;

    useEffect(() => {
        if (session?.user) {
            router.push(redirect || '/');
        }
    }, [router, session, redirect]);

    const {
        handleSubmit,
        register,
        getValues,
        formState: { errors },
    } = useForm();

    const submitHandler = async ({ name, email, password }) => {
        try {
            await axios.post('/api/auth/signup', {
                name,
                email,
                password,
            });

            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });
            if (result.error) {
                console.log(result.error);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <AuthscreenWrapper title="S'inscrire">
            <form
                className="relative px-6 py-10 mt-24 space-y-8 bg-white rounded shadow-lg md:mt-0 md:max-w-md md:px-14"
                onSubmit={handleSubmit(submitHandler)}
            >
                <h1 className="text-4xl font-semibold">S'inscrire</h1>

                <div className="space-y-4">
                    <label className="inline-block w-full">
                        <input
                            type="text"
                            placeholder="Nom, prénom"
                            className={`input w-full border-b-2 outline-none ${errors.email ? 'border-orange-500' : 'border-gray-400'}`}
                            {...register('name', {
                                required: 'Veuillez entrer votre nom et prénom',
                            })}
                        />
                        {errors.name && (
                            <p className="p-1 text-[13px] font-light  text-orange-500">{errors.name.message}</p>
                        )}
                    </label>
                    <label className="inline-block w-full">
                        <input
                            type="email"
                            placeholder="Email"
                            className={`input w-full border-b-2 outline-none ${errors.email ? 'border-orange-500' : 'border-gray-400'}`}
                            {...register('email', {
                                required: 'Veuillez entrer un mail valide.',
                                pattern: {
                                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                                    message: 'Veuillez entrer un mail valide.',
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="p-1 text-[13px] font-light  text-orange-500">{errors.email.message}</p>
                        )}
                    </label>
                    <label className="inline-block w-full">
                        <input
                            type="password"
                            {...register('password', {
                                required: "Veuillez entrer un mot de passe valide entre 4 et 60 caractères.",
                                minLength: { value: 6, message: 'password is more than 5 chars' },
                            })}
                            placeholder="Password"
                            className={`input w-full border-b-2 outline-none ${errors.password ? 'border-orange-500' : 'border-gray-400'}`}
                        />
                        {errors.password && (
                            <p className="p-1 text-[13px] font-light  text-orange-500">{errors.password.message}</p>
                        )}
                    </label>
                </div>

                <button
                    className="w-full py-3 font-semibold text-white uppercase bg-black rounded button-click-effect"
                    type="submit"
                >S'inscrire</button>

                <div className="text-gray-800">
                    Pas encore de compte ?{' '}
                    <Link className="cursor-pointer hover:underline" href="/auth/login">Se connecter</Link>
                </div>
            </form>
        </AuthscreenWrapper>
    )
}

export default LoginScreen