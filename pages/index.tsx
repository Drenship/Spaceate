import type { NextPage } from 'next'
import React from 'react'
import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper'
import Productcard from '@components/cards/product-card'

import database from "@devasset/database.json"

interface Product {
  slug: string;
  name: string;
  categorie_products_id: string;
  description: string;
  main_image: string;
  images: string[];
  price: number;
  count_in_stock: number;
  price_in: string;
  rating: number;
  reviews: number;
}

type Props = {
  products: Product[];
}

const Home: NextPage<Props> = ({ products }) => {

  return (
    <BasescreenWrapper title="Accueil" footer={true}>

      <div className="max-w-2xl px-4 py-16 mx-auto sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {
            products.map((data: Product, key) => <Productcard product={data} key={key} />)
          }
          {
            products.map((data: Product, key) => <Productcard product={data} key={key} />)
          }
        </div>
      </div>

    </BasescreenWrapper>
  )
}

export const getServerSideProps = async () => {

  return {
    props: {
      products: database.products
    },
  }
}

export default Home
