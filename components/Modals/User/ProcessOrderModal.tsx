'use client';

import { useMemo, useState } from "react";
import useProcessOrderStore from "@libs/hooks/modals/useProcessOrderModal";
import useUserStore from "@libs/hooks/modals/useUserStore";

import InputRadio from "@components/inputs/InputRadio";
import InputPhone from "@components/inputs/InputPhone";
import InputCheckbox from "@components/inputs/InputCheckbox";
import InputText from "@components/inputs/InputText";
import Modal from "@components/Modals/Modal";

import { getStripe } from "@libs/utils/stripe-helpers";
import { fetchPostJSON } from "@libs/utils/api-helpers";

const ProcessOrderModal = () => {

  const useProcessOrder = useProcessOrderStore();
  const useUser = useUserStore();
  const { user, cart: cartItems } = useUser;
  const [isLoading, setLoading] = useState(false);


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

    // Put order
    const createOrder = await fetchPostJSON("/api/order", { items: itemsForCheckout });
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

  const onSubmit = async () => { }

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <div className='grid w-full grid-cols-1 gap-5 py-5 mt-5 text-black col-span-full md:grid-cols-2'>

        {/** Address de livraison */}
        {/** Address de facturation */}
        {/** Mode de livraison */}

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