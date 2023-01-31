import React from 'react'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import useAuth from '@hooks/useAuth'
import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper'


function SignIn() {

    const [login, setLogin] = useState(false)
    const { signIn, signUp } = useAuth()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        if (login) {
            await signIn(data.email, data.password)
        } else {
            await signUp(data.email, data.password)
        }
    }

    return (

        <BasescreenWrapper title={!login ? "S'inscrire" : "Se connecter"} footer={false}>
            <div className="relative flex items-center justify-center w-full h-[calc(100vh-64px)] overflow-x-hidden">
                <Image
                    src="/devassets-images/wallpaper-auth.jpg"
                    layout="fill"
                    className="select-none"
                    objectFit="cover"
                />
                <form
                    className="relative px-6 py-10 mt-24 space-y-8 rounded bg-black/75 md:mt-0 md:max-w-md md:px-14"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h1 className="text-4xl font-semibold">{!login ? "S'inscrire" : "Se connecter"}</h1>

                    <div className="space-y-4">
                        {
                            !login && <label className="inline-block w-full">
                                <input
                                    type="text"
                                    placeholder="Nom Prénom"
                                    className={`input w-full ${errors.name && 'border-b-2 border-orange-500'
                                        }`}
                                    {...register('name', { required: true })}
                                />
                                {errors.name && (
                                    <p className="p-1 text-[13px] font-light  text-orange-500">
                                        Veuillez entrer un nom valide.
                                    </p>
                                )}
                            </label>
                        }
                        <label className="inline-block w-full">
                            <input
                                type="email"
                                placeholder="Email"
                                className={`input w-full ${errors.email && 'border-b-2 border-orange-500'
                                    }`}
                                {...register('email', { required: true })}
                            />
                            {errors.email && (
                                <p className="p-1 text-[13px] font-light  text-orange-500">
                                    Veuillez entrer un mail valide.
                                </p>
                            )}
                        </label>
                        <label className="inline-block w-full">
                            <input
                                type="password"
                                {...register('password', { required: true })}
                                placeholder="Password"
                                className={`input w-full ${errors.password && 'border-b-2 border-orange-500'
                                    }`}
                            />
                            {errors.password && (
                                <p className="p-1 text-[13px] font-light  text-orange-500">
                                    Veuillez entrer un mot de passe valide entre 4 et 60 caractères.
                                </p>
                            )}
                        </label>
                    </div>
                    <button
                        className="w-full rounded bg-[#E50914] py-3 font-semibold"
                        onClick={() => setLogin(true)}
                        type="submit"
                    >
                        Sign In
                    </button>
                    <div className="text-[gray]">
                        New to Netflix?{' '}
                        <button
                            className="text-white cursor-pointer hover:underline"
                            onClick={() => setLogin(e => !e)}
                            type="submit"
                        >
                            {login ? "S'inscrire" : "Se connecter"}
                        </button>
                    </div>
                </form>
            </div>
        </BasescreenWrapper>
    )
}

export default SignIn