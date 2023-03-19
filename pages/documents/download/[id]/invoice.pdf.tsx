import React from 'react';
import { NextPage } from 'next';
import { BlobProvider } from '@react-pdf/renderer';
import { getSession } from 'next-auth/react';

import db from '@libs/database/dbConnect';
import Order from '@libs/models/Order';
import { TypeOrder } from '@libs/typings';

import Invoice from '@components/ui-ux/DocumentsPDF/Invoice';

interface Props {
    order: TypeOrder | null
}

const InvoicePdf: NextPage<Props> = ({ order }) => {

    if (!order) return <div className='flex items-center justify-center w-screen h-screen'>Invoice does not exist</div>;

    return (
        <div className='w-screen h-screen'>
            <BlobProvider document={<Invoice order={order} />}>
                {({ blob, url, loading, error }) =>
                    loading ? (
                        'Chargement du PDF...'
                    )
                        : error
                            ? (
                                <div>
                                    <a href={url} download={`Facture-${order._id}.pdf`}>
                                        Télécharger la facture
                                    </a>
                                </div>
                            )
                            : (
                                <iframe
                                    src={url}
                                    title="Facture"
                                    style={{ width: '100%', height: '100vh', border: 'none' }}
                                />
                            )
                }
            </BlobProvider>
        </div>
    );
}

export const getServerSideProps = async (context: any) => {

    const pdfId = context.query.id || null

    const defaultReturn = {
        props: {
            order: null
        },
    }

    try {
        if (!pdfId) return defaultReturn;

        const { user } = await getSession(context);
        if (!user) return defaultReturn;

        let orderId = pdfId.replace(/-/g, "");

        await db.connect();
        const order = await Order.findOne({ _id: orderId, user: user._id }, { paymentResultStripe: 0 });
        await db.disconnect();

        return {
            props: {
                order: JSON.parse(JSON.stringify(order))
            },
        }
    } catch (err) {
        await db.disconnect();
        return defaultReturn;
    }
}

InvoicePdf.auth = true;
export default InvoicePdf;