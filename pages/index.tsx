import type { NextPage } from 'next/types'
import React from 'react'

import { TypeProduct } from '@libs/typings'

import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper'
import Productcard from '@components/cards/product-card'
import Slider from '@components/ui-ux/Slider'

import database from "@devasset/database.json"


type Props = {
  products: TypeProduct[];
}

const Home: NextPage<Props> = ({ products }) => {

  const slides = [
    { link: "", url: "https://thumbs.dreamstime.com/b/s%C3%A9lection-saine-de-nourriture-121936825.jpg" },
    { link: "", url: "https://thumbs.dreamstime.com/b/fond-de-nourriture-d-alimentation-%C3%A9quilibr%C3%A9e-121936796.jpg" },
    { link: "", url: "https://thumbs.dreamstime.com/b/photos-de-nourriture-avec-des-fruits-et-l%C3%A9gumes-dans-une-disposition-d-arc-en-ciel-54120499.jpg" },
    { link: "", url: "https://thumbs.dreamstime.com/b/table-en-bois-avec-la-nourriture-vue-sup%C3%A9rieure-102532611.jpg" },
  ]
  
  return (
    <BasescreenWrapper title="Accueil" footer={true}>
      <Slider slides={slides} />

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
