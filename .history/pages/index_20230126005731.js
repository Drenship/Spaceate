import React from 'react'
import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper'
import Productcard from '@components/cards/product-card'
import Highlight from '@components/contents/highlights'
import Faq from '@components/contents/Faq'
import BestSeller from '@components/contents/BestSeller'
import { useNotifys } from '@libs/hooks/notify';

import database from "@devasset/database.json"

const Home = () => {

  const products = database.products;
  const { pushNotify } = useNotifys();

  const notify = () => {

    const array = ["CART", "PAY", "TRACK", "SHIPMENT", "NOTIFICATION", "ERROR"];
    const randomIndex = Math.floor(Math.random() * array.length);
    const randomElement = array[randomIndex];

    pushNotify({
      title: "-10% sur votre 1er commande",
      subTitle: "The wait is over. Our sale is now live. Go get it",
      icon: randomElement,
      duration: 5
    })

    
    pushNotify({
      title: "Article ajouter au panier",
      subTitle: "The wait is over. Our sale is now live. Go get it",
      icon: "CART",
      duration: 5
    })

  }

  return (
    <BasescreenWrapper title="Accueil">

      <button onClick={notify}>Notify</button>

      <BestSeller products={[...products, ...products]} />

      <div className="max-w-2xl px-4 py-16 mx-auto sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {
            products.map((data, key) => <Productcard product={data} key={key} />)
          }
          {
            products.map((data, key) => <Productcard product={data} key={key} />)
          }
        </div>
      </div>

      <Faq />

      <Highlight />

    </BasescreenWrapper>
  )
}

export default Home