
import React, { useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { AnnotationIcon, CheckIcon } from '@heroicons/react/solid';
import { RxCross1 } from 'react-icons/rx';

import { fetchPostJSON } from '@libs/utils/api-helpers';
import { fixedPriceToCurrency, replaceURL, splitString, UTCStringToDate } from '@libs/utils';
import { TypeOrder, TypeUser } from '@libs/typings';

import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';


interface Props { }

const UserSettings: NextPage<Props> = () => {


    const { data: session } = useSession();
    const user: TypeUser | null = session?.user || null;

    const [member, orders] = useMemo(() => {
        const createdAt = new Date(user?.createdAt).getFullYear()
        const orders = [...(user?.orders || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        return [createdAt, orders];
    }, [user]);

    const [sendMailDisablerd, setSendMailDisablerd] = useState(false)
    const sendMailForVerify = async () => {

        if (!user) {
            return;
        }

        if (user?.email_is_verified) {
            return;
        }

        setSendMailDisablerd(true)

        const result = await fetchPostJSON("/api/mailer", {
            emailType: 'VERIFY_MAIL',
            user: {
                email: user.email
            }
        })

        if (result.success) {
            setSendMailDisablerd(true)
        } else {
            setSendMailDisablerd(false)
        }

    }


    return (
        <BasescreenWrapper title="Profile" footer={true}>
            <div className='block px-5 my-12 lg:flex max-w-[1400px] w-full'>


                { /* Left */}
                <div className='flex flex-col items-center justify-start rounded-xl w-full lg:max-w-[320px] mr-0 lg:mr-16 lg:py-4 lg:px-6 lg:border flex-shrink-0'>
                    <div className='flex items-center justify-between w-full'>

                        <div className='inline-block lg:hidden'>
                            <h3 className='text-3xl font-bold'>Bonjour, {user?.name}</h3>
                            <p className='pt-2 text-gray-400'>Membre depuis {member}</p>
                            <button className='mt-5 font-semibold underline active:text-gray-400'>Modifier le profil</button>
                        </div>

                        <div className='flex flex-col items-end justify-end lg:items-center lg:w-full'>
                            <div className='relative w-20 h-20 lg:w-32 lg:h-32'>
                                <Image src='https://a0.muscache.com/defaults/user_pic-225x225.png?v=3'
                                    layout='fill'
                                    objectFit='cover'
                                    className='rounded-full'
                                />
                            </div>
                        </div>

                    </div>

                    <div className='w-full border-t border-b pb-7 my-7 lg:pb-0 lg:border-b-0'>
                        <h4 className='mt-5 text-xl font-semibold'>Vérification</h4>
                        <div className='flex items-center mt-5 space-x-2'>
                            {
                                user?.email_is_verified
                                    ? <CheckIcon className='w-5 text-green-600' />
                                    : <RxCross1 className='w-5 text-red-600' />
                            }
                            <p>Adresse e-mail</p>
                        </div>
                        {
                            !user?.email_is_verified && <button
                                className='py-3 mt-2 font-semibold border border-black rounded-lg px-7 button-click-effect'
                                onClick={sendMailForVerify}
                                disabled={sendMailDisablerd}
                            >Verifier mon e-mail</button>
                        }
                    </div>

                </div>

                { /* Right */}
                <div className='flex-grow lg:mt-0 lg:w-full'>
                    <div className='hidden lg:block'>
                        <Link href='/user'>
                            <h3 className='text-3xl font-bold'>{user?.name}</h3>
                        </Link>
                    </div>

                    <div className='inline-grid w-full border-b lg:mt-10 pb-7 mb-7'>
                        <div className='flex justify-between py-3'>
                            <h4 className='text-xl font-semibold'>Commandes en cours</h4>
                            <Link href='/user/order-history' className='font-semibold underline active:text-gray-400'>Voire plus</Link>
                        </div>
                        <div className='flex flex-col items-start w-full'>


                        </div>
                    </div>




                </div>

            </div>
        </BasescreenWrapper>
    )
}

UserSettings.auth = true;
export default UserSettings