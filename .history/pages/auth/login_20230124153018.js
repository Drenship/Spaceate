import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router';
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
                toast.error(result.error);
            }
        } catch (err) {
            toast.error(getError(err));
        }
    };

    return (

        <AuthscreenWrapper title={"Se connecter"}>
            <form
                className="relative px-6 py-10 mt-24 space-y-8 bg-white rounded shadow-lg md:mt-0 md:max-w-md md:px-14"
                onSubmit={handleSubmit(submitHandler)}
            >
                <h1 className="text-4xl font-semibold">Se connecter</h1>

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
                    className="w-full py-3 font-semibold text-white uppercase bg-black rounded button-click-effect"
                    onClick={() => setLogin(true)}
                    type="submit"
                >
                    Se connecter
                </button>
                <div className="text-gray-800">
                    Pas encore de compte ?{' '}
                    <button
                        className="cursor-pointer hover:underline"
                        onClick={() => setLogin(e => !e)}
                        type="submit"
                    >S'inscrire</button>
                </div>
            </form>
        </AuthscreenWrapper>
    )
}

export default LoginScreen