import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { BlobProvider } from '@react-pdf/renderer';
import { getSession } from 'next-auth/react';

import db from '@libs/database/dbConnect';
import Order from '@libs/models/Order';
import { TypeOrder } from '@libs/typings';
import { splitString } from '@libs/utils';

import Invoice from '@components/DocumentsPDF/Invoice';

interface Props {
    order: TypeOrder | null
}

const InvoicePdf: NextPage<Props> = ({ order }) => {

    const [error, setError] = useState(false);

    if (!order) return <div className='flex items-center justify-center w-screen h-screen'>Invoice does not exist</div>;

    return (
        <div className='w-screen h-screen'>
            <Head>
                <title>{`Facture n°${splitString(order._id)}`}</title>
            </Head>
            <BlobProvider document={<Invoice order={order} />}>
                {({ blob, url, loading, error: blobError }) => {
                    if (loading) {
                        return 'Chargement du PDF...';
                    }

                    if (blobError) {
                        return 'Erreur lors de la génération du PDF';
                    }

                    if (!error) {
                        return (
                            <iframe
                                src={url}
                                title="Facture"
                                style={{ width: '100%', height: '100vh', border: 'none' }}
                                onError={() => setError(true)}
                            />
                        );
                    } else {
                        return (
                            <div>
                                <p>Impossible d'afficher le PDF, veuillez le télécharger :</p>
                                <a href={url} download={`Facture-${splitString(order._id)}.pdf`}>
                                    Télécharger la facture
                                </a>
                            </div>
                        );
                    }
                }}
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

        const order = user.isAdmin === true
            ? await Order.findOne({ _id: orderId }, { paymentResultStripe: 0 })
            : await Order.findOne({ _id: orderId, user: user._id }, { paymentResultStripe: 0 });

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