import React from 'react';
import {
    Page,
    Text,
    Font,
    View,
    Document,
    StyleSheet,
} from '@react-pdf/renderer';

import { TypeOrder } from '@libs/typings';
import { fixedPriceToCurrency, splitString } from '@libs/utils';

Font.register({ family: 'MyCustomFont', src: "/fonts/Roboto/Roboto-Medium.ttf" });

const styles = StyleSheet.create({
    page: {
        fontFamily: 'MyCustomFont',
        backgroundColor: '#ffffff',
        padding: 30,
        fontSize: 11,
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
        paddingBottom: 8,
        width: "100%",
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1pt solid #ccc',
        paddingVertical: 8,
        width: "100%",
    },
    tableCol: {
        flexGrow: 1,
        paddingHorizontal: 5,
        width: "100%",
    },
    alignRight: {
        textAlign: 'right',
    },
    tableColHeader: {
        flexGrow: 1,
        paddingHorizontal: 5,
        fontWeight: 'bold',
        width: "100%",
    },
    borderLeft: {
        borderLeft: '2pt solid #000',
    },
    borderTop: {
        borderTop: '2pt solid #000',
    }
});

export
    const convertOrderToInvoiceData = (order: TypeOrder) => {
        // Récupération des informations de facturation
        const invoiceNumber = order._id;
        const date = new Date(order.createdAt).toLocaleDateString('fr-FR');
        const { shippingAddress, blindingAdress } = order;

        // Récupération des informations des produits commandés
        const items = order.orderItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            unitTva: 5.5, // TODO: Changer la valeur en fonction du taux de TVA applicable
        }));

        // Calcul des totaux
        const subtotal = order.itemsPrice;
        const taxRate = 5.5; // TODO: Changer la valeur en fonction du taux de TVA applicable
        const taxAmount = order.taxPrice;
        const total = order.totalPrice;
        const shippingPrice = order.shippingPrice;

        // Récupération des informations de paiement
        const paymentMethod = order.paymentMethod;
        const paymentTerms = '30 jours'; // TODO: Changer la valeur en fonction des termes de paiement applicables

        // Création de l'objet de données de facture
        const invoiceData = {
            invoiceNumber,
            date,
            sender: {
                name: 'Spaceate',
                address: 'Le grand champ',
                city: 'St martin du vx belleme',
                postalCode: '61130',
                country: 'France',
            },
            recipient: {
                ...shippingAddress,
            },
            blindingAdress: {
                ...blindingAdress,
            },
            items,
            subtotal,
            taxRate,
            taxAmount,
            shippingPrice,
            total,
            paymentMethod,
            paymentTerms,
        };

        return invoiceData;
    };

interface Props {
    order: TypeOrder
}

const Invoice = ({ order }: Props) => {

    const invoiceData = convertOrderToInvoiceData(order)

    return (
        <Document title={`facture_n°_${splitString(order._id)}.pdf`}>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Facture</Text>


                {/* Informations de facturation */}
                <View style={[styles.row, styles.section]}>
                    <Text>N°{splitString(invoiceData.invoiceNumber)}</Text>
                    <View style={styles.value}>
                        <Text>Date du {invoiceData.date}</Text>
                    </View>
                </View>

                {/* Emetteur et destinataire */}
                <View style={[styles.row, styles.section]}>
                    <View style={[styles.tableCol]}>
                        <Text>Expediteur:</Text>
                        <Text>{invoiceData.sender.name}</Text>
                        <Text>{invoiceData.sender.address}</Text>
                        <Text>{invoiceData.sender.city}, {invoiceData.sender.postalCode}</Text>
                        <Text>{invoiceData.sender.country}</Text>
                    </View>

                    {
                        invoiceData.blindingAdress.fullName ? (
                            <View style={[styles.tableCol, styles.borderLeft]}>
                                <Text>Address de facturation:</Text>
                                <Text>{invoiceData.blindingAdress.fullName}</Text>
                                <Text>{invoiceData.blindingAdress.address}</Text>
                                <Text>{invoiceData.blindingAdress.city}, {invoiceData.blindingAdress.postalCode}</Text>
                                <Text>{invoiceData.blindingAdress.country}</Text>
                            </View>
                        ) : (
                            <View style={[styles.tableCol, styles.borderLeft]}>
                                <Text>Address de facturation:</Text>
                                <Text>{invoiceData.recipient.fullName}</Text>
                                <Text>{invoiceData.recipient.address}</Text>
                                <Text>{invoiceData.recipient.city}, {invoiceData.recipient.postalCode}</Text>
                                <Text>{invoiceData.recipient.country}</Text>
                            </View>
                        )
                    }

                    <View style={[styles.tableCol, styles.borderLeft]}>
                        <Text>Address de livraison:</Text>
                        <Text>{invoiceData.recipient.fullName}</Text>
                        <Text>{invoiceData.recipient.address}</Text>
                        <Text>{invoiceData.recipient.city}, {invoiceData.recipient.postalCode}</Text>
                        <Text>{invoiceData.recipient.country}</Text>
                    </View>
                </View>

                {/* Tableau des articles */}
                <View style={styles.section}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableColHeader}>Article</Text>
                        <Text style={[styles.tableColHeader, styles.alignRight]}>Quantité</Text>
                        <Text style={[styles.tableColHeader, styles.alignRight]}>Prix unit. HT</Text>
                        <Text style={[styles.tableColHeader, styles.alignRight]}>Total HT</Text>
                        <Text style={[styles.tableColHeader, styles.alignRight]}>TVA</Text>
                        <Text style={[styles.tableColHeader, styles.alignRight]}>Total TTC</Text>
                    </View>
                    {invoiceData.items.map((item: any, index: any) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.tableCol}>{item.name}</Text>
                            <Text style={[styles.tableCol, styles.alignRight]}>{item.quantity}</Text>
                            <Text style={[styles.tableCol, styles.alignRight]}>{fixedPriceToCurrency(item.unitPrice)}</Text>
                            <Text style={[styles.tableCol, styles.alignRight]}>{fixedPriceToCurrency(item.quantity * item.unitPrice)}</Text>
                            <Text style={[styles.tableCol, styles.alignRight]}>{item.unitTva}%</Text>
                            <Text style={[styles.tableCol, styles.alignRight]}>{fixedPriceToCurrency(item.quantity * item.unitPrice * (1 + item.unitTva / 100))}</Text>
                        </View>
                    ))}
                </View>

                {/* Informations fiscales et de paiement */}
                <View style={[styles.row, styles.section]}>
                    <View style={styles.label}></View>
                    <View style={[styles.row, styles.value]}>
                        <View style={styles.label}>
                            <Text>Sous-total:</Text>
                            <Text>total TVA:</Text>
                            <Text>frais de livraison</Text>
                            <Text>Total:</Text>
                        </View>
                        <View style={styles.value}>
                            <Text>{fixedPriceToCurrency(invoiceData.subtotal - invoiceData.taxAmount)}</Text>
                            <Text>{fixedPriceToCurrency(invoiceData.taxAmount)}</Text>
                            <Text>{fixedPriceToCurrency(invoiceData.shippingPrice)}</Text>
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