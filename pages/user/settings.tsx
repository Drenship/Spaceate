
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

                <div className='flex-grow lg:mt-0 lg:w-full'>
                    <div>
                        <Link href='/user'>
                            <h3 className='text-3xl font-bold'>{user?.name}</h3>
                        </Link>
                    </div>

                    <div className='inline-grid w-full border-b lg:mt-10 py-7'>
                        <div className='flex justify-between py-3'>
                            <h4 className='text-xl font-semibold'>Proil</h4>
                        </div>
                        <div className='flex flex-col items-start w-full'>


                        </div>
                    </div>

                    <div className='inline-grid w-full border-b lg:mt-10 py-7'>
                        <div className='flex justify-between py-3'>
                            <h4 className='text-xl font-semibold'>Addresse de livraison</h4>
                        </div>
                        <div className='flex flex-col items-start w-full'>


                        </div>
                    </div>

                    <div className='inline-grid w-full border-b lg:mt-10 py-7'>
                        <div className='flex justify-between py-3'>
                            <h4 className='text-xl font-semibold'>Addresse de facturation</h4>
                        </div>
                        <div className='flex flex-col items-start w-full'>


                        </div>
                    </div>

                    <div className='inline-grid w-full border-b lg:mt-10 py-7'>
                        <div className='flex justify-between py-3'>
                            <h4 className='text-xl font-semibold'>Sécurité</h4>
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