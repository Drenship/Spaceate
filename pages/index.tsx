import type { NextPage } from 'next/types'
import React from 'react'

import { TypeProduct } from '@libs/typings'

import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper'
import Productcard from '@components/cards/product-card'
import ServiceCard from '@components/cards/ServiceCard'
import Carousel from '@components/contents/Carousel'

import { fetchGetJSON, fetchPostJSON } from '@libs/utils/api-helpers'
import db from '@libs/database/dbConnect'
import Product from '@libs/models/Product'

type Props = {
  products: TypeProduct[];
}

const Home: NextPage<Props> = ({ products }) => {

  console.log(products)

  const services = [
    {
      title: "Légumes",
      src: "https://www.finedininglovers.fr/sites/g/files/xknfdk1291/files/styles/article_1200_800_fallback/public/2021-03/fruits%20l%C3%A9gumes%20avril.jpg?itok=dXANY9eR",
      link: "/search?query=&categorie=63e573b93835b8c932531ad3&subCategorie=all"
    },
    {
      title: "Fruits",
      src: "https://t3.ftcdn.net/jpg/05/52/09/76/360_F_552097663_QLhLtZgGzmHqKtW0fBBxLAc3cnn8n53g.jpg",
      link: "/search?query=&categorie=63e56ca43835b8c932531a9a&subCategorie=all"
    },
    {
      title: "Fleurs",
      src: "https://img.freepik.com/photos-premium/fleurs-lumineuses-fantastiques-nuit-beau-fond-floral-ai-generative_788189-2607.jpg?w=2000",
      link: "/search?query=&categorie=63fb7f1173b8b3dfdd2f78f3&subCategorie=all"
    }
  ]

  const slidesData = [
    {
      image: "https://images.unsplash.com/photo-1456518563096-0ff5ee08204e?auto=format&fit=crop&w=1351&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
      title: "Slider One",
      subtitle: "Tagline • 2017",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      link: "#",
    },
    {
      image: "https://images.unsplash.com/photo-1510709657750-f5a80fc8da9c?auto=format&fit=crop&w=1950&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
      title: "Slider Two",
      subtitle: "Tagline • 2017",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      link: "#",
    },
    {
      image: "https://images.unsplash.com/photo-1505567745926-ba89000d255a?auto=format&fit=crop&w=1951&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
      title: "Slider Three",
      subtitle: "Tagline • 2017",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      link: "#",
    }
  ]

  return (
    <BasescreenWrapper title="Accueil" footer={true}>
      <div>
        <div className='relative'>
          <div className='absolute bottom-0 w-full h-full' />

          <div className='absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full bg-white/20'>
            <div className='relative w-full overflow-hidden'>
              <Carousel slidesData={slidesData} />
            </div>
          </div>

          <div className='absolute bottom-0 z-0 w-full h-32 bg-gradient-to-t from-white to-transparent' />
          <img src="https://blog.liebherr.com/electromenager/fr/wp-content/uploads/sites/13/2020/10/harvestedfood-min-1-1920x800.png" className='w-screen max-h-[100vh] h-full min-h-[50vh] object-cover' alt="" />
        </div>
        <div className='max-w-[1400px] mx-auto -mt-10 grid grid-cols-1 sm:grid-cols-3 gap-x-5 px-4'>
          {
            services.map((data, key) => <ServiceCard service={data} key={key} />)
          }
        </div>
      </div>

      <div className="max-w-[1400px] py-10 mx-auto space-y-8 px-4">

        {
          products.map((categorie, key) => (
            <div>
              <h2 className='mb-3 text-2xl font-bold'>{categorie.categorie.name}</h2>
              <div key={key} className="grid grid-cols-1 gap-y-10 gap-x-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {
                  categorie.items.map((data, key) => <Productcard product={data} key={key} />)
                }
              </div>
            </div>
          ))
        }
      </div>

    </BasescreenWrapper>
  )
}

export const getStaticProps = async () => {
  try {
    await db.connect();

    const results = await Product.aggregate([
      {
        $lookup: {
          from: 'categories', // Remplacez par le nom de votre collection de catégories
          localField: 'categorie', // Remplacez par le nom de champ qui fait référence à la catégorie dans votre modèle de produit
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category', // "Dérouler" le tableau des catégories pour accéder aux sous-catégories
      },
      {
        $group: {
          _id: '$category',
          items: {
            $push: '$$ROOT', // Ajouter l'objet du produit complet au groupe
          },
        },
      },
      {
        $project: {
          categorie: '$_id',
          items: {
            $slice: ['$items', 20],
          },
        },
      },
    ]);

    return {
      props: {
        products: JSON.parse(JSON.stringify(results)),
      },
      revalidate: 300, // => 5 minutes
    }
  } catch (err) {
    return {
      props: {
        products: []
      },
    }
  } finally {
    await db.disconnect();
  }
}

export default Home
