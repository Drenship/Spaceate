import React, { useMemo, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { PDFDownloadLink } from '@react-pdf/renderer';

import db from '@libs/database/dbConnect';
import Order from '@libs/models/Order';
import { fixedPriceToCurrency, splitString } from '@libs/utils';
import { TypeOrder } from '@libs/typings';

import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';
import OrderItemCard from '@components/cards/OrderItemCard';
import { getStripe } from '@libs/utils/stripe-helpers';
import { fetchPostJSON } from '@libs/utils/api-helpers';
import OrderStatus from '@components/contents/orderStatus';
import Invoice from '@components/ui-ux/Invoice';

interface Props {
    order: TypeOrder,
    countOrders: number,
    orderNotFound: boolean,
    err?: any
}

const OrderSummary: NextPage<Props> = ({ order, countOrders, orderNotFound, err }) => {

    const [loading, setLoading] = useState(false)

    const shippingAdress = useMemo(() => {
        if (!order?.shippingAddress?.address) return "";
        return `${order.shippingAddress.address}, ${order.shippingAddress.city} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`
    }, [order]);

    const blindingAdress = useMemo(() => {
        if (!order?.shippingAddress?.address) return "";
        return `${order.shippingAddress.address}, ${order.shippingAddress.city} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`
    }, [order]);


    const enableCheckout = useMemo(() => order.isPaid === true || order.isCancel === true || order.isRefund === true, [order])

    const createCheckoutSession = async () => {
        if (enableCheckout) return;

        setLoading(true);

        // init stripe
        const stripe = await getStripe();
        if (!stripe) {
            setLoading(false);
            return;
        }

        const checkoutSession = await fetchPostJSON("/api/checkout_sessions", { items: order.orderItems, order_id: order._id });
        // Internal Server Error
        if ((checkoutSession).statusCode === 500) {
            console.error((checkoutSession).message);
            setLoading(false);
            return;
        }

        // Redirect to checkout
        const { error } = await stripe.redirectToCheckout({ sessionId: checkoutSession.id });
        if (!stripe) alert(error.message);

        setLoading(false);
    };

    return (
        <BasescreenWrapper title="Mes commandes" footer={false}>
            <div className="md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
                {
                    orderNotFound ? (
                        <h1 className='text-2xl font-bold'>Commande introuvable !</h1>
                    ) : (
                        <div className='w-screen pt-8 overflow-x-hidden sm:w-full max-w-screen'>

                            {
                                enableCheckout === false && (
                                    <div className='flex flex-col items-start justify-start w-full p-8 mb-8 space-y-4 bg-red-200 border-2 border-red-600 md:items-center md:justify-between md:flex-row md:space-y-0'>
                                        <p className='font-semibold'>La commande n'a pas encore été réglée. Vous pouvez régler la commande en utilisant le bouton ci-joint.</p>
                                        <button
                                            role="link"
                                            className='px-8 py-4 mt-5 text-white uppercase bg-black button-click-effect disabled:bg-gray-600 disabled:text-gray-300 disabled:hover:active:scale-100'
                                            onClick={createCheckoutSession}
                                            disabled={loading}
                                        >{loading ? "Chargement..." : "Paiement"}</button>
                                    </div>
                                )
                            }

                            <div className="flex flex-col items-stretch w-full space-y-4 xl:flex-row jusitfy-center xl:space-x-8 md:space-y-6 xl:space-y-0">
                                <div className="flex flex-col items-start justify-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                                    <div className="flex flex-col items-start justify-start w-full px-4 py-4 bg-gray-50 md:py-6 md:p-6 xl:p-8">
                                        <div className='flex items-center justify-end w-full font-semibold underline'>
                                            <PDFDownloadLink
                                                document={<Invoice order={order} />}
                                                fileName={`facture_avancee_${splitString(order._id)}.pdf`}
                                            >
                                                {({ loading }) => (loading ? 'Génération en cours...' : 'Télécharger la facture')}
                                            </PDFDownloadLink>
                                        </div>
                                        <div className='w-full py-2 border-b'>
                                            <h2 className="font-semibold text-md">N° DE COMMANDE: {splitString(order._id)}</h2>
                                            <div className='flex items-center justify-between'>
                                                <OrderStatus order={order} />
                                                <p className="text-base leading-6 text-gray-800 xl:text-lg">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <p className="mt-3 font-semibold leading-6 text-gray-800 ext-base md:text-xl xl:leading-5">Articles commander</p>

                                        {
                                            order.orderItems.map((item, key) => <OrderItemCard key={key} item={item} />)
                                        }
                                    </div>

                                    <div className="flex flex-col items-stretch justify-center w-full space-y-4 md:flex-row md:space-y-0 md:space-x-6 xl:space-x-8">

                                        <div className="flex flex-col w-full px-4 py-6 space-y-6 md:p-6 xl:p-8 bg-gray-50">
                                            <h3 className="text-xl font-semibold leading-5 text-gray-800">Résumé</h3>
                                            <div className="flex flex-col items-center justify-center w-full pb-4 space-y-4 border-b border-gray-200">
                                                <div className="flex justify-between w-full">
                                                    <p className="text-base leading-4 text-gray-800">Sous total (TTC)</p>
                                                    <p className="text-base leading-4 text-gray-600">{fixedPriceToCurrency(order.itemsPrice)}</p>
                                                </div>
                                                <div className="flex items-center justify-between w-full italic">
                                                    <p className="text-base leading-4 text-gray-800">dont TVA</p>
                                                    <p className="text-base leading-4 text-gray-600">{fixedPriceToCurrency(order.taxPrice)}</p>
                                                </div>
                                                <div className="flex items-center justify-between w-full">
                                                    <p className="text-base leading-4 text-gray-800">Expédition</p>
                                                    <p className="text-base leading-4 text-gray-600">{fixedPriceToCurrency(order.shippingPrice)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between w-full">
                                                <p className="text-base font-semibold leading-4 text-gray-800">Total TTC</p>
                                                <p className="text-base font-semibold leading-4 text-gray-600">{fixedPriceToCurrency(order.totalPrice)}</p>
                                            </div>
                                        </div>


                                        <div className="flex flex-col justify-center w-full px-4 py-6 space-y-6 md:p-6 xl:p-8 bg-gray-50 ">
                                            <h3 className="text-xl font-semibold leading-5 text-gray-800">Expédition</h3>
                                            <div className="flex items-start justify-between w-full">
                                                <div className="flex items-center justify-center">
                                                    <div className="w-8 h-8">
                                                        <img className="w-full h-full" alt="logo" src="https://i.ibb.co/L8KSdNQ/image-3.png" />
                                                    </div>
                                                    <div className="flex flex-col items-center justify-start px-4">
                                                        <p className="text-lg font-semibold leading-6 text-gray-800">
                                                            DPD Delivery
                                                            <br />
                                                            <span className="font-normal">Delivery with 24 Hours</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-lg font-semibold leading-6 text-gray-800">{fixedPriceToCurrency(order.shippingPrice)}</p>
                                            </div>
                                            <div className="flex items-center justify-center w-full">
                                                <button className="py-5 text-base font-medium leading-4 text-white bg-gray-800 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 w-96 md:w-full">Afficher les détails</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="flex flex-col items-center justify-between w-full px-4 py-6 bg-gray-50 xl:w-96 md:items-start md:p-6 xl:p-8 ">
                                    <h3 className="text-xl font-semibold leading-5 text-gray-800">Détails</h3>
                                    <div className="flex flex-col items-stretch justify-start w-full h-full md:flex-row xl:flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 ">
                                        <div className="flex flex-col items-start justify-start flex-shrink-0">
                                            <div className="flex items-center justify-center w-full px-4 py-8 border-b border-gray-200 md:justify-start">
                                                <img src="https://i.ibb.co/5TSg7f6/Rectangle-18.png" alt="avatar" />
                                                <div className="flex flex-col items-start justify-start px-2 space-y-2">
                                                    <p className="text-base font-semibold leading-4 text-left text-gray-800">{order.shippingAddress.fullName}</p>
                                                    <p className="text-sm leading-5 text-gray-600">{`${countOrders <= 1 ? countOrders + 'er commande' : countOrders + 'eme commandes'}`}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center w-full py-4 space-x-4 border-b border-gray-200 md:justify-start">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M3 7L12 13L21 7" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="text-sm leading-5 text-gray-800 cursor-pointer">{order.user.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-stretch justify-between w-full mt-6 xl:h-full md:mt-0">
                                            <div className="flex flex-col items-center justify-center space-y-4 md:justify-start xl:flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 xl:space-y-12 md:space-y-0 md:flex-row md:items-start ">
                                                <div className="flex flex-col items-center justify-center space-y-4 md:justify-start md:items-start xl:mt-8">
                                                    <p className="text-base font-semibold leading-4 text-center text-gray-800 md:text-left">Adresse de livraison</p>
                                                    <p className="w-full text-sm leading-5 text-center text-gray-600 lg:w-full xl:w-48 md:text-left">{shippingAdress}</p>
                                                </div>
                                                <div className="flex flex-col items-center justify-center space-y-4 md:justify-start md:items-start ">
                                                    <p className="text-base font-semibold leading-4 text-center text-gray-800 md:text-left">Adresse de facturation</p>
                                                    <p className="w-full text-sm leading-5 text-center text-gray-600 lg:w-full xl:w-48 md:text-left">{blindingAdress}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center w-full mt-6 md:justify-start md:items-start">
                                                <button className="py-5 mx-auto mt-6 text-base font-medium leading-4 text-gray-800 border border-gray-800 md:mt-0 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 w-96 2xl:w-full">Modifier les détails</button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </BasescreenWrapper>
    );
};


export const getServerSideProps: GetServerSideProps = async (context) => {

    const defaultReturn = (err?: object | undefined) => ({
        props: {
            order: {},
            countOrders: 0,
            orderNotFound: true,
            err: err
        },
    })

    try {
        const { query: { id } } = context;
        if (!id) return defaultReturn()

        const { user } = await getSession(context);
        if (!user) return defaultReturn()


        await db.connect();
        const order = await Order.findOne({ _id: id, user: user._id }, { paymentResultStripe: 0 }).populate('user').lean();
        const countOrders = await Order.countDocuments({ _id: id, user: user._id });
        await db.disconnect();

        return {
            props: {
                query_id: id,
                order: JSON.parse(JSON.stringify(order)),
                countOrders: countOrders,
                orderNotFound: order && order._id ? false : true
            },
        }

    } catch (err) {
        await db.disconnect();
        return defaultReturn(err)
    }
}

OrderSummary.auth = true;
export default OrderSummary;