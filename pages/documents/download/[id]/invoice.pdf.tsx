import React from 'react';
import { NextPage } from 'next';
import { PDFViewer } from '@react-pdf/renderer';

import db from '@libs/database/dbConnect';
import Order from '@libs/models/Order';
import { TypeOrder } from '@libs/typings';

import Invoice from '@components/ui-ux/DocumentsPDF/Invoice';
import { getSession } from 'next-auth/react';

interface Props {
    order: TypeOrder | null
}

const InvoicePdf: NextPage<Props> = ({ order }) => {

    if (!order) return <div className='flex items-center justify-center w-screen h-screen'>Invoice does not exist</div>;

    return (
        <div className='w-screen h-screen'>
            <PDFViewer
                width="100%"
                height="100%"
            >
                <Invoice order={order} />
            </PDFViewer>
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