
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
import Tabs from '@components/contents/Tab';


interface Props { }

const UserSettings: NextPage<Props> = () => {

    const { data: session } = useSession();
    const user = session && session.user as TypeUser || null;

    const [activeTab, setActiveTab] = useState<number>(1);
    const [sendMailDisablerd, setSendMailDisablerd] = useState<boolean>(false)

    const [member, orders] = useMemo(() => {
        const createdAt = new Date(user?.createdAt).getFullYear()
        const orders = [...(user?.orders || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        return [createdAt, orders];
    }, [user]);


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
            <div className='flex flex-col px-5 my-12 lg:flex max-w-[1400px] w-full'>
                <Tabs
                    tabsData={[
                        { title: 'Profil' },
                        { title: 'Sécurité' },
                    ]}
                    setActive={setActiveTab}
                />
                
                { /* TAB 1 - Profil */}
                <div className={`flex-grow pt-5 border-t lg:mt-0 lg:w-full ${ activeTab !== 1 && "hidden"}`}>
                    <div>
                        <Link href='/user'>
                            <h3 className='inline-block text-3xl font-bold'>{user?.name}</h3>
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

                { /* TAB 2 - Sécurité */}
                <div className={`flex-grow pt-5 border-t lg:mt-0 lg:w-full ${ activeTab !== 2 && "hidden"}`}>
                    sécurity tab
                </div>

            </div>
        </BasescreenWrapper>
    )
}

UserSettings.auth = true;
export default UserSettings