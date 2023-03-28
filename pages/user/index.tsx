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
import CommentaireCard from '@components/cards/CommentaireCard';
import OrderStatus from '@components/contents/orderStatus';


interface ProfilOrderCardProps {
    order: TypeOrder
}

const ProfilOrderCard = ({ order }: ProfilOrderCardProps) => (
    <div className="flex flex-col overflow-hidden border rounded-xl shadow-lg md:max-w-[320px] max-w-[80vw] min-w-[320px] w-full cursor-pointer button-click-effect">

        <div className="relative w-full h-40">
            <Image
                src={order.orderItems[0].image}
                layout='fill'
                objectFit="cover"
            />
        </div>
        <div className="p-5">
            <h3 className="text-lg font-bold">{order.shippingAddress.fullName}</h3>
            <p className="text-sm text-gray-600 truncate">{order.shippingAddress.address}</p>
            <p className="font-bold text-right">{fixedPriceToCurrency(order.totalPrice)}</p>
        </div>

    </div>
)


const ProfilCurrentOrderLine = ({ order }: ProfilOrderCardProps) => (
    <Link href={`/user/order-history/${order._id}`} className="w-full [&:nth-child(1)]:border-t [&:not(:last-child)]:border-b hover:bg-gray-50 px-1">
        <div className='flex items-center justify-between w-full space-x-1'>
            <div className="-space-x-6 avatar-group">

                {
                    order.orderItems.length > 0 && [...order.orderItems].slice(0, 4).map((p, k) => <div key={k} className="avatar">
                        <div className="w-12">
                            <img src={replaceURL(p.image)} alt={`panier spaceate - ${p.name}`} />
                        </div>
                    </div>)
                }

                {
                    order.orderItems.length > 4 && (
                        <div className="select-none avatar placeholder">
                            <div className="w-12 bg-neutral-focus text-neutral-content">
                                <span>+{order.orderItems.length - 3}</span>
                            </div>
                        </div>
                    )
                }
            </div>
            <div className="px-3 whitespace-no-wrap">
                <OrderStatus order={order} />
            </div>
            <div className="px-3 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">{fixedPriceToCurrency(order.totalPrice)}</div>
            <div className="pl-3 text-sm leading-4 tracking-normal text-gray-800 whitespace-no-wrap">{UTCStringToDate(order.createdAt)}</div>
        </div>
    </Link>
)


interface Props {}

const UserProfil: NextPage<Props> = () => {


    const { data: session } = useSession();
    const user: TypeUser | null = session?.user || null;

    const [member] = useMemo(() => {
        const createdAt = new Date(user?.createdAt).getFullYear()
        return [createdAt];
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
                        <h3 className='text-3xl font-bold'>Bonjour, {user?.name}</h3>
                        <p className='pt-2 text-gray-400'>Membre depuis {member}</p>
                        <button className='mt-5 font-semibold underline active:text-gray-400'>Modifier le profil</button>
                    </div>

                    <div className='inline-grid w-full border-b lg:mt-10 pb-7 mb-7'>
                        <div className='flex justify-between py-3'>
                            <h4 className='text-xl font-semibold'>Commandes en cours</h4>
                            <Link href='/user/order-history' className='font-semibold underline active:text-gray-400'>Voire plus</Link>
                        </div>
                        <div className='flex flex-col items-start w-full '>
                            {
                                [...(user?.orders || []),...(user?.orders || []),...(user?.orders || []),...(user?.orders || []),...(user?.orders || [])]
                                    .filter((order) => order.isPaid === true && order.isDelivered === false && order.isRefund === false && order.isCancel === false).slice(0, 4)
                                    .map((item: any, key: any) => <ProfilCurrentOrderLine
                                        key={key}
                                        order={item}
                                    />)
                            }
                        </div>
                    </div>

                    <div className='inline-grid w-full border-b lg:mt-10 pb-7 mb-7'>
                        <div className='flex justify-between py-3'>
                            <h4 className='text-xl font-semibold'>Mes dernieres commandes</h4>

                            <Link href='/user/order-history' className='font-semibold underline active:text-gray-400'>Voire plus</Link>
                        </div>
                        <div className='flex items-start w-full space-x-2 overflow-y-auto scrollbar-hide'>
                            {
                                user?.orders?.slice(0, 4).map((item: any, key: any) => <ProfilOrderCard
                                    key={key}
                                    order={item}
                                />)
                            }
                        </div>

                    </div>

                    <div className='flex flex-col'>
                        <div className='flex flex-col md:justify-between md:items-center md:flex-row'>
                            <div className='flex items-center space-x-2'>
                                <AnnotationIcon className="h-5" />
                                <h4 className='text-xl font-bold'>{user?.reviews ? user?.reviews.length : 0} commentaire</h4>
                            </div>

                            <Link href='/user/myReviews' className='font-semibold underline active:text-gray-400'>Voire mes commentaires</Link>
                        </div>
                        <div className='grid grid-cols-1'>
                            {
                                user?.reviews?.map((item: any, key: any) => <CommentaireCard
                                    key={key}
                                    img={item.img}
                                    name={item.name}
                                    rating={item.rating}
                                    description={item.description}
                                    date={item.date}
                                />)
                            }
                        </div>
                    </div>
                </div>

            </div>
        </BasescreenWrapper>
    )
}

UserProfil.auth = true;
export default UserProfil