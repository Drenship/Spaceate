'use client';

import React, { useMemo, useState, useEffect } from "react";

import useProcessOrderStore from "@libs/hooks/modals/useProcessOrderModal";
import useUserStore from "@libs/hooks/modals/useUserStore";
import { getStripe } from "@libs/utils/stripe-helpers";
import { fetchPostJSON } from "@libs/utils/api-helpers";

import Modal from "@components/Modals/Modal";

import ShippingOptions from '@datassets/ShippingOptions.json'
import OrderAddressCard from "@components/cards/OrderAddressCard";
import { TypographyH4 } from "@components/Typography/Typography";
import InputRadio from "@components/inputs/InputRadio";
import { Address } from "@libs/typings";
import InputCheckbox from "@components/inputs/InputCheckbox";


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




  const disabledCheckoutButton = useMemo(() => isLoading || cartItems.length === 0 || !user, [user, cartItems, isLoading]);
  const createCheckoutSession = async () => {

    if (!user) return;

    setLoading(true);

    const itemsForCheckout = [...cartItems].filter(i => {
      if (i.outOfQuantity === true || i.outOfStock === true) return;
      return i;
    })

    if (itemsForCheckout.length <= 0) return;

    // init stripe
    const stripe = await getStripe();
    if (!stripe) {
      setLoading(false);
      return;
    }

// verif


    // Put order
    const createOrder = await fetchPostJSON("/api/order", { items: itemsForCheckout, ...orderOptions });
    if (!createOrder || createOrder.err) {
      setLoading(false);
      return;
    }

    const checkoutSession = await fetchPostJSON("/api/checkout_sessions", { items: itemsForCheckout, order_id: createOrder.data._id });
    // Internal Server Error
    if ((checkoutSession).statusCode === 500) {
      console.error((checkoutSession).message);
      setLoading(false);
      return;
    }

    // Redirect to checkout
    const { error } = await stripe.redirectToCheckout({ sessionId: checkoutSession.id });
    if (!stripe) alert(error.message);

    setLoading(false);
  };

  const onShippingAddressSelect = async (address: Address) => setOrderOptions(prev => ({ ...prev, shippingAddress: address }))
  const onBillingAddressSelect = async (address: Address) => setOrderOptions(prev => ({ ...prev, billingAddress: address }))

  const onSubmit = async () => { }

  useEffect(() => console.log(orderOptions), [orderOptions])


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
          title="L'address de facturation et de livraison son identique"
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
                  description={`${option.shipping_rate_data.fixed_amount.amount / 100} ${option.shipping_rate_data.fixed_amount.currency}`}
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
    >{isLoading ? "Chargement..." : "Paiement"}</button>
  )

  return (
    <Modal
      size='large'
      disabled={isLoading}
      isOpen={useProcessOrder.isOpen}
      onClose={useProcessOrder.onClose}
      onSubmit={onSubmit}

      title={"Passer la commande"}
      actionLabel={"Passer commande"}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default ProcessOrderModal;