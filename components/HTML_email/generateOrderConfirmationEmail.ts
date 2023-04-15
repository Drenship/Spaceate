// HTML_email.js

import { TypeOrder, TypeOrderProduct } from "@libs/typings";

export const generateOrderConfirmationEmail = (order: TypeOrder) => {
  const generateOrderItemsHTML = (items: TypeOrderProduct[]) => {
    return items.map((item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.price.toFixed(2)} ${item.currency}</td>
        </tr>
      `).join("");
  };

  const orderDetailsHTML = `
    <div style="background-color:#ffffff"> 
      <div style="margin:auto;background-color:#ffffff;max-width:580px;width:100%;">
        <h1>Confirmation de commande</h1>
        <p>Merci pour votre commande ! Voici le récapitulatif de votre commande :</p>
  
        <h2>Produits commandés</h2>
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Nom du produit</th>
              <th>Quantité</th>
              <th>Prix</th>
            </tr>
          </thead>
          <tbody>
            ${generateOrderItemsHTML(order.orderItems)}
          </tbody>
        </table>
    
        <h2>Adresse de livraison</h2>s
        <p>
          ${order.shippingAddress.fullName}<br>
          ${order.shippingAddress.streetAddress}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
          ${order.shippingAddress.country}<br>
          Téléphone : ${order.shippingAddress.phone || "Non renseigné"}
        </p>
  
        <h2>Adresse de facturation</h2>
        <p>
          ${order.billingAddress.fullName}<br>
          ${order.billingAddress.streetAddress}<br>
          ${order.billingAddress.city}, ${order.billingAddress.postalCode}<br>
          ${order.billingAddress.country}<br>
          Téléphone : ${order.billingAddress.phone || "Non renseigné"}
        </p>
  
        <h2>Mode de livraison</h2>
        <p>${order.shippingMethode.display_name}</p>
  
        <h2>Total de la commande</h2>
        <p>Prix des articles : ${order.itemsPrice.toFixed(2)} ${order.orderItems[0].currency}</p>
        <p>Frais de livraison : ${order.shippingPrice.toFixed(2)} ${order.orderItems[0].currency}</p>
        <p>Taxes : ${order.taxPrice.toFixed(2)} ${order.orderItems[0].currency}</p>
        <p><strong>Total : ${order.totalPrice.toFixed(2)} ${order.orderItems[0].currency}</strong></p>
      </div>
    </div>
  `;

  return orderDetailsHTML;
};
