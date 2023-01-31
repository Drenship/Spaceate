import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router';
import Image from 'next/image'
import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper'


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
                toast.error(result.error);
            }
        } catch (err) {
            toast.error(getError(err));
        }
    };

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

export default LoginScreen