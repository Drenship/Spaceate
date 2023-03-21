import React from 'react';
import {
    Page,
    Text,
    Image,
    View,
    Document,
    StyleSheet,
} from '@react-pdf/renderer';

import { TypeOrder } from '@libs/typings';
import { fixedPriceToCurrency, splitString } from '@libs/utils';

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        padding: 30,
        fontSize: 12,
    },
    header: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 15,
        width: "100%",
    },
    row: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    label: {
        width: '50%',
    },
    value: {
        width: '50%',
        textAlign: 'right',
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottom: '2pt solid #000',
        marginBottom: 8,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1pt solid #ccc',
        paddingVertical: 8,
    },
    tableCol: {
        flexGrow: 1,
        paddingHorizontal: 5,

    },
    tableColHeader: {
        flexGrow: 1,
        paddingHorizontal: 5,
        fontWeight: 'bold',
    },
});

interface Props {
    order: TypeOrder
}

const Invoice = ({ order }: Props) => {

    const convertOrderToInvoiceData = () => {

    }

    const invoiceData = {
        _id: order._id,
        invoiceNumber: '123',
        date: '18/03/2023',
        sender: {
            name: 'Spaceate',
            address: 'Le grand champ',
            city: 'St martin du vx belleme',
            postalCode: '61130',
            country: 'France',
        },
        recipient: {
            name: 'Florentin Greneche',
            address: '12 rue des paresseux',
            city: 'Igé',
            postalCode: '61130',
            country: 'France',
        },
        items: [
            { name: 'Produit 1', quantity: 4, unitPrice: 50, unitTva: 5.5 },
            { name: 'Produit 2', quantity: 1, unitPrice: 100, unitTva: 5.5 },
        ],
        subtotal: 200,
        taxRate: 20,
        taxAmount: 40,
        total: 240,
        paymentMethod: 'Virement bancaire',
        paymentTerms: '30 jours',
    };

    return (
        <Document title={`facture_n°_${splitString(order._id)}.pdf`}>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Facture</Text>

                {/* Emetteur et destinataire */}
                <View style={[styles.row, styles.section]}>
                    <View style={styles.label}>
                        <Text>Émetteur:</Text>
                        <Text>{invoiceData.sender.name}</Text>
                        <Text>{invoiceData.sender.address}</Text>
                        <Text>{invoiceData.sender.city}, {invoiceData.sender.postalCode}</Text>
                        <Text>{invoiceData.sender.country}</Text>
                    </View>
                    <View style={styles.value}>
                        <Text>Address :</Text>
                        <Text>{invoiceData.recipient.name}</Text>
                        <Text>{invoiceData.recipient.address}</Text>
                        <Text>{invoiceData.recipient.city}, {invoiceData.recipient.postalCode}</Text>
                        <Text>{invoiceData.recipient.country}</Text>
                    </View>
                </View>

                {/* Informations de facturation */}
                <View style={[styles.row, styles.section]}>
                    <Text>N° DE COMMANDE: {splitString(invoiceData._id)}</Text>
                    <View style={styles.value}>
                        <Text>{invoiceData.date}</Text>
                    </View>
                </View>

                {/* Tableau des articles */}
                <View style={styles.section}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableColHeader}>Nom</Text>
                        <Text style={styles.tableColHeader}>Quantité</Text>
                        <Text style={styles.tableColHeader}>Prix unit. HT</Text>
                        <Text style={styles.tableColHeader}>Total HT</Text>
                        <Text style={styles.tableColHeader}>TVA</Text>
                        <Text style={styles.tableColHeader}>Total TTC</Text>
                    </View>
                    {invoiceData.items.map((item: any, index: any) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.tableCol}>{item.name}</Text>
                            <Text style={styles.tableCol}>{item.quantity}</Text>
                            <Text style={styles.tableCol}>{fixedPriceToCurrency(item.unitPrice)}</Text>
                            <Text style={styles.tableCol}>{fixedPriceToCurrency(item.quantity * item.unitPrice)}</Text>
                            <Text style={styles.tableCol}>{item.unitTva}%</Text>
                            <Text style={styles.tableCol}>{fixedPriceToCurrency((item.quantity * item.unitPrice) + (item.quantity * item.unitPrice) * (item.unitTva / 100))}</Text>
                        </View>
                    ))}
                </View>

                {/* Informations fiscales et de paiement */}
                <View style={[styles.row, styles.section]}>
                    <View style={styles.label}></View>
                    <View style={[styles.row, styles.value]}>
                        <View style={styles.label}>
                            <Text>Sous-total:</Text>
                            <Text>TVA ({invoiceData.taxRate}%):</Text>
                            <Text>Total:</Text>
                        </View>
                        <View style={styles.value}>
                            <Text>{fixedPriceToCurrency(invoiceData.subtotal)}</Text>
                            <Text>{fixedPriceToCurrency(invoiceData.taxAmount)}</Text>
                            <Text>{fixedPriceToCurrency(invoiceData.total)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text>Méthode de paiement: {invoiceData.paymentMethod}</Text>
                    <Text>Conditions de paiement: {invoiceData.paymentTerms}</Text>
                </View>
            </Page>
        </Document>
    );
};

export default Invoice;