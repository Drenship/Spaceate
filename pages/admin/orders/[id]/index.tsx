import React from 'react';
import AdminscreenWrapper from '@components/Layouts/AdminscreenLayout';
import db from '@libs/database/dbConnect';
import Order from '@libs/models/Order';
import { TypeOrder } from '@libs/typings';
import DefaultSendButton from '@components/buttons/DefaultSendButton';
import OrderStatus from '@components/contents/orderStatus';
import { replaceURL } from '@libs/utils';

interface AdminOrdersIdScreenProps {
    order: TypeOrder | null
}

function AdminOrdersIdScreen({ order }: AdminOrdersIdScreenProps) {

    console.log("order", order)

    function handleMarkAsShipped() {
        // logique pour marquer la commande comme "expédiée"
        // ...
    }

    return (
        <AdminscreenWrapper title="Orders">
            {
                !order ? (
                    <div className="container mx-auto my-10">
                        <h1 className="mb-5 text-2xl font-bold">La commande n'existe pas</h1>
                    </div>
                ) : (
                    <div className="container mx-auto my-10">
                        <h1 className="mb-5 text-2xl font-bold">Détails de la commande</h1>
                        <div className="p-5 border rounded">
                            <div className="flex justify-between mb-5">
                                <div className="font-bold">ID de commande :</div>
                                <div>{order._id}</div>
                            </div>
                            <div className="flex justify-between mb-5">
                                <div className="font-bold">Statut de la commande :</div>
                                <OrderStatus order={order} />
                            </div>
                            <div className="mb-5">
                                <h2 className="mb-3 text-xl font-bold">Produits commandés</h2>
                                {order.orderItems.map((item) => (
                                    <div key={item._id} className="flex items-center mb-3">
                                        <div className="w-24">
                                            <img src={replaceURL(item.image)} alt={item.name} className="w-full" />
                                        </div>
                                        <div className="flex-grow ml-3">
                                            <h3 className="font-bold">{item.name}</h3>
                                            <div className="text-gray-600">{item.price}€ ({item.price_in})</div>
                                            <div className="text-gray-600">Quantité : {item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mb-5">
                                <h2 className="mb-3 text-xl font-bold">Adresse de livraison</h2>
                                <div className="text-gray-600">{order.shippingAddress.fullName}</div>
                                <div className="text-gray-600">{order.shippingAddress.address}</div>
                                {order.shippingAddress.address2 && (
                                    <div className="text-gray-600">{order.shippingAddress.address2}</div>
                                )}
                                <div className="text-gray-600">
                                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                                </div>
                                <div className="text-gray-600">{order.shippingAddress.country}</div>
                            </div>
                            <div className="mb-5">
                                <h2 className="mb-3 text-xl font-bold">Méthode de paiement</h2>
                                <div className="text-gray-600">{order.paymentMethod}</div>
                            </div>
                            <div className="mb-5">
                                <h2 className="mb-3 text-xl font-bold">Détails de la commande</h2>
                                <div className="text-gray-600">Total produits : {order.itemsPrice}€</div>
                                <div className="text-gray-600">Frais de livraison : {order.shippingPrice}€</div>
                            </div>
                            {!order.isSended && (
                                <div className='flex items-center justify-end w-full'>
                                    <DefaultSendButton
                                        title="Marquer comme expédiée"
                                        onClick={handleMarkAsShipped}
                                    />
                                </div>
                            )}
                        </div>
                    </div >

                )
            }
        </AdminscreenWrapper >
    );
}

export const getServerSideProps = async ({ query }: any) => {
    try {
        const id = query.id || null;

        const fixid = id.replace(/-/g, '');

        await db.connect();
        const order = await Order.findOne({ _id: fixid }).lean();


        return {
            props: {
                order: db.convertDocToObj(order),
            },
        }
    } catch (error) {
        return {
            props: {
                order: null,
            },
        }
    } finally {
        await db.disconnect()
    }
}

AdminOrdersIdScreen.auth = { adminOnly: true };
export default AdminOrdersIdScreen