
import React, { useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { fetchPostJSON } from '@libs/utils/api-helpers';
import { TypeUser } from '@libs/typings';

import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';
import Tabs from '@components/contents/Tab';
import { TypographyH1, TypographyH2, TypographyH3, TypographyH4, TypographyH5, TypographyH6, TypographyP, TypographySmall, TypographyTiny } from '@components/ui-ux/Typography';


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
                <div className={`flex-grow pt-5 border-t lg:mt-0 lg:w-full ${activeTab !== 1 && "hidden"}`}>
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
        </BasescreenWrapper>
    )
}

UserSettings.auth = true;
export default UserSettings