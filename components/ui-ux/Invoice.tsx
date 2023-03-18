import React from 'react';
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Font,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        padding: 30
    },
    header: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    label: {
        width: '40%',
    },
    value: {
        width: '60%',
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
    invoiceData: any
}

const Invoice = ({ invoiceData }: Props) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Facture</Text>

                {/* Emetteur et destinataire */}
                <View style={[styles.row, styles.section]}>
                    <View style={styles.label}>
                        <Text>Émetteur:</Text>
                        <Text>{invoiceData.sender.name}</Text>
                        <Text>{invoiceData.sender.address}</Text>
                        <Text>{invoiceData.sender.city}</Text>
                        <Text>{invoiceData.sender.country}</Text>
                    </View>
                    <View style={styles.value}>
                        <Text>Destinataire:</Text>
                        <Text>{invoiceData.recipient.name}</Text>
                        <Text>{invoiceData.recipient.address}</Text>
                        <Text>{invoiceData.recipient.city}</Text>
                        <Text>{invoiceData.recipient.country}</Text>
                    </View>
                </View>

                {/* Informations de facturation */}
                <View style={[styles.row, styles.section]}>
                    <View style={styles.label}>
                        <Text>Numéro de facture:</Text>
                        <Text>Date:</Text>
                    </View>
                    <View style={styles.value}>
                        <Text>{invoiceData.invoiceNumber}</Text>
                        <Text>{invoiceData.date}</Text>
                    </View>
                </View>

                {/* Tableau des articles */}
                <View style={styles.section}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableColHeader}>Description</Text>
                        <Text style={styles.tableColHeader}>Quantité</Text>
                        <Text style={styles.tableColHeader}>Prix unitaire</Text>
                        <Text style={styles.tableColHeader}>Total</Text>
                    </View>
                    {invoiceData.items.map((item: any, index: any) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.tableCol}>{item.description}</Text>
                            <Text style={styles.tableCol}>{item.quantity}</Text>
                            <Text style={styles.tableCol}>{item.unitPrice.toFixed(2)} €</Text>
                            <Text style={styles.tableCol}>{(item.quantity * item.unitPrice).toFixed(2)} €</Text>
                        </View>
                    ))}
                </View>

                {/* Informations fiscales et de paiement */}
                <View style={[styles.row, styles.section]}>
                    <View style={styles.label}>
                        <Text>Sous-total:</Text>
                        <Text>TVA ({invoiceData.taxRate}%):</Text>
                        <Text>Total:</Text>
                    </View>
                    <View style={styles.value}>
                        <Text>{invoiceData.subtotal.toFixed(2)} €</Text>
                        <Text>{invoiceData.taxAmount.toFixed(2)} €</Text>
                        <Text>{invoiceData.total.toFixed(2)} €</Text>
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