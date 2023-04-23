'use client';

import React, { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import useProcessOrderStore from "@libs/hooks/modals/useProcessOrderModal";
import useUserStore from "@libs/hooks/modals/useUserStore";
import { getStripe } from "@libs/utils/stripe-helpers";
import { fetchPostJSON } from "@libs/utils/api-helpers";
import { Address } from "@libs/typings";

import Modal from "@components/Modals/Modal";
import OrderAddressCard from "@components/cards/OrderAddressCard";
import { TypographyH4 } from "@components/Typography/Typography";
import InputRadio from "@components/inputs/InputRadio";
import InputCheckbox from "@components/inputs/InputCheckbox";
import ShippingOptions from '@datassets/ShippingOptions.json'


const ProcessOrderModal = () => {

  const useProcessOrder = useProcessOrderStore();
  const useUser = useUserStore();
  const { user, cart: cartItems } = useUser;
  const [isLoading, setLoading] = useState(false);
  const [orderOptions, setOrderOptions] = useState<{
    shippingAddress: Address | null;
    billingAddress: Address | null;
    sameAddress: boolean;
    shippingMethode: any;
  }>({
    shippingAddress: null,
    billingAddress: null,
    sameAddress: true,
    shippingMethode: null,
  });

  const disabledCheckoutButton = useMemo(() => {
    return isLoading
      || cartItems.length === 0
      || !user
      || orderOptions.shippingAddress === null
      || orderOptions.billingAddress === null && orderOptions.sameAddress === false
      || orderOptions.shippingMethode === null
      ? true
      : false
  }, [user, cartItems, isLoading, orderOptions]);


  const createCheckoutSession = async () => {
    try {
      setLoading(true);

      if (!user) {
        return toast.error("Vous devez être connecté pour passer une commande !");
      };

      const itemsForCheckout = [...cartItems].filter(i => {
        if (i.outOfQuantity === true || i.outOfStock === true) return;
        return i;
      })

      if (itemsForCheckout.length <= 0) {
        return toast.error("Votre panier est vide !");
      };

      // orderOptions verify
      if (orderOptions.shippingAddress === null) {
        return toast.error("Ajouter une adresse de livraison !");
      };
      if (orderOptions.billingAddress === null && orderOptions.sameAddress === false) {
        return toast.error("Ajouter une adresse de facturation !");
      };
      if (orderOptions.shippingMethode === null) {
        return toast.error("Sélectionner le mode de livraison !");
      };

      // init stripe
      const stripe = await getStripe();
      if (!stripe) {
        return toast.error("Une erreur est survenue lors du chargement du processeur de paiement.");
      }

      // Put order
      const createOrder = await fetchPostJSON("/api/order", { items: itemsForCheckout, ...orderOptions });
      if (!createOrder || createOrder.err) {
        return toast.error(createOrder?.message || "Une erreur est survenue lors du passage de la commande.");
      }

      const checkoutSession = await fetchPostJSON("/api/checkout_sessions", { items: itemsForCheckout, order_id: createOrder.data._id });
      // Internal Server Error
      if ((checkoutSession).statusCode === 500) {
        return toast.error((checkoutSession).message);
      }

      // Redirect to checkout
      const { error } = await stripe.redirectToCheckout({ sessionId: checkoutSession.id });
      if (!stripe) {
        return toast.error(error?.message || "La redirection vers la session de paiement a échoué.")
      };

    } catch (error: any) {
      return toast.error(error?.message || "Une erreur est survenue, veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const onShippingAddressSelect = async (address: Address) => setOrderOptions(prev => ({ ...prev, shippingAddress: address }))
  const onBillingAddressSelect = async (address: Address) => setOrderOptions(prev => ({ ...prev, billingAddress: address }))

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <div className='flex flex-col w-full gap-5 text-black'>

        {/** Address de livraison */}
        <div>
          <TypographyH4 className='font-semibold col-span-full'>Mes addresses</TypographyH4>
          <div
            className='flex items-start w-full space-x-2 overflow-y-auto scrollbar-hide js-not-swipe'
          >

            {
              user && user.addresses?.filter(a => a.addressType === "shipping").map((address) => <OrderAddressCard
                key={address._id}
                address={address}
                onAddressSelect={onShippingAddressSelect}
                currentValue={orderOptions.shippingAddress}
              />)
            }
          </div>
        </div>
        {/** Address de facturation */}

        {
          !orderOptions.sameAddress && (
            <div>
              <TypographyH4 className='font-semibold col-span-full'>Mes addresses</TypographyH4>
              <div
                className='flex items-start overflow-y-auto scrollbar-hide js-not-swipe'
              >
                {
                  user && user.addresses?.filter(a => a.addressType === "billing").map((address) => <OrderAddressCard
                    key={address._id}
                    address={address}
                    onAddressSelect={onBillingAddressSelect}
                    currentValue={orderOptions.billingAddress}
                  />)
                }
              </div>
            </div>
          )
        }

        <InputCheckbox
          title="L'adresse de facturation et de livraison est identique"
          input={{
            name: "sameAddress",
            checked: orderOptions.sameAddress,
          }}
          onChange={(e: React.BaseSyntheticEvent) => setOrderOptions(prev => ({ ...prev, sameAddress: e.target.checked ? true : false }))}
        />

        {/** Mode de livraison */}
        <div>
          <TypographyH4 className='font-semibold col-span-full'>Mode de livraison</TypographyH4>
          <div
            className='flex items-start space-x-2 overflow-y-auto scrollbar-hide js-not-swipe'
          >
            {
              ShippingOptions.map(option => <div key={option._id} className="min-w-[180px]">
                <InputRadio
                  label={option.shipping_rate_data.display_name}
                  description={
                    option.shipping_rate_data.fixed_amount.amount === 0
                      ? "Gratuit"
                      : `${option.shipping_rate_data.fixed_amount.amount / 100} ${option.shipping_rate_data.fixed_amount.currency}`
                  }
                  input={{
                    name: "shippingMethode",
                    value: option._id,
                    checked: orderOptions.shippingMethode && orderOptions.shippingMethode?._id === option._id ? true : false,
                  }}
                  onChange={(e: React.BaseSyntheticEvent) => setOrderOptions(prev => ({ ...prev, shippingMethode: option }))}
                />
              </div>)
            }
          </div>
        </div>

      </div>
    </div>
  )

  const footerContent = (
    <button
      role="link"
      className='px-8 py-4 mt-5 text-white uppercase bg-black button-click-effect disabled:bg-gray-600 disabled:text-gray-300 disabled:hover:active:scale-100'
      onClick={createCheckoutSession}
      disabled={disabledCheckoutButton}
    >{isLoading ? "Chargement..." : "Valider et passer la commande"}</button>
  )

  return (
    <Modal
      size='large'
      disabled={isLoading}
      isOpen={useProcessOrder.isOpen}
      onClose={useProcessOrder.onClose}
      onSubmit={() => { }}
      title={"Finalisez votre achat : Passer la commande"}
      actionLabel={"Valider et passer la commande"}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default ProcessOrderModal;