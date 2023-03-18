import React from 'react';
import { NextPage } from 'next';
import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Invoice from '@components/ui-ux/Invoice';

interface Props {

}

const UserProfil: NextPage<Props> = ({ }) => {


    const invoiceData = {
        invoiceNumber: '123',
        date: '18/03/2023',
        sender: {
            name: 'John Doe',
            address: '123 Main St',
            city: 'Paris',
            country: 'France',
        },
        recipient: {
            name: 'Jane Smith',
            address: '456 Oak St',
            city: 'Lyon',
            country: 'France',
        },
        items: [
            { description: 'Produit 1', quantity: 2, unitPrice: 50 },
            { description: 'Produit 2', quantity: 1, unitPrice: 100 },
        ],
        subtotal: 200,
        taxRate: 20,
        taxAmount: 40,
        total: 240,
        paymentMethod: 'Virement bancaire',
        paymentTerms: '30 jours',
    };

    return (
        <BasescreenWrapper title="Profile" footer={true}>
            <div>
                <h1>Facture avancée en PDF</h1>
                <PDFDownloadLink
                    document={<Invoice invoiceData={invoiceData} />}
                    fileName="facture_avancee.pdf"
                >
                    {({ loading }) => (loading ? 'Génération en cours...' : 'Télécharger la facture')}
                </PDFDownloadLink>
            </div>

        </BasescreenWrapper>
    );
}

export const getServerSideProps = async () => {

    const defaultReturn = {
        props: {},
    }

    try {
        return {
            props: {},
        }
    } catch (err) {
        return defaultReturn
    }
}

UserProfil.auth = true;
export default UserProfil