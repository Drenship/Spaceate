import type { NextPage } from 'next/types'
import React from 'react'
import Image from 'next/image';

import db from '@libs/database/dbConnect'
import Product from '@libs/models/Product'
import { TypeCategorie, TypeProduct } from '@libs/typings'

import BasescreenWrapper from '@components/Layouts/BasescreenLayout'
import CarouselProduct from '@components/Carousel/CarouselProduct'
import ServiceCard from '@components/cards/ServiceCard'
import Slider from '@components/Carousel/Slider';

type Props = {
  homePageDetails: {
    _id: TypeCategorie
    categorie: TypeCategorie
    items: TypeProduct[]
  }[];
  promotions: TypeProduct[]
}

const Home: NextPage<Props> = ({ homePageDetails, promotions }) => {

  const services = [
    {
      title: "Fruits",
      src: "https://t3.ftcdn.net/jpg/05/52/09/76/360_F_552097663_QLhLtZgGzmHqKtW0fBBxLAc3cnn8n53g.jpg",
      link: "/search?query=&categorie=63e56ca43835b8c932531a9a&subCategorie=all"
    },
    {
      title: "Légumes",
      src: "https://www.finedininglovers.fr/sites/g/files/xknfdk1291/files/styles/article_1200_800_fallback/public/2021-03/fruits%20l%C3%A9gumes%20avril.jpg?itok=dXANY9eR",
      link: "/search?query=&categorie=63e573b93835b8c932531ad3&subCategorie=all"
    },
    {
      title: "Fleurs",
      src: "https://img.freepik.com/photos-premium/fleurs-lumineuses-fantastiques-nuit-beau-fond-floral-ai-generative_788189-2607.jpg?w=2000",
      link: "/search?query=&categorie=63fb7f1173b8b3dfdd2f78f3&subCategorie=all"
    },
    {
      title: "Herbes aromatiques",
      src: "/banner/d98de407e5c695dfb66185798aacaab9.jpg",
      link: "/search?query=&categorie=642832b3f777fbce28f1b08e&subCategorie=all"
    }
  ]

  return (
    <BasescreenWrapper title="Accueil" footer={true}>
      
      <div className='w-full'>
        <div className='relative w-screen '>

          <div className='absolute bottom-0 z-10 w-full h-32 bg-gradient-to-t from-white to-transparent' />
          <img src="https://blog.liebherr.com/electromenager/fr/wp-content/uploads/sites/13/2020/10/harvestedfood-min-1-1920x800.png" className='absolute top-0 bottom-0 z-0 object-cover w-screen max-h-[100vh] h-full min-h-[50vh] opacity-80' alt="" />
          <div className='absolute top-0 bottom-0 w-full h-full' />

          <div className='flex flex-col items-center justify-center w-full h-full bg-white/20'>
            
            <div className='relative w-full md:max-w-[1400px] overflow-hidden'>
              <Slider />
            </div>

            <div className='max-w-[1400px] w-full inline-flex md:px-0 mt-5 overflow-visible'>
              <div className='inline-grid w-full'>
                <div className='flex items-start w-full gap-2 px-4 overflow-y-auto scrollbar-hide js-not-swipe'>
                  {
                    services.map((data, key) => <ServiceCard service={data} key={key} />)
                  }
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>


      <div className="max-w-screen md:max-w-[1400px] w-full py-10 mx-auto space-y-8 px-4">

        {
          promotions && promotions.length > 0 && (
            <div>
              <Image
                src="/icons/Deal-du-jour.svg"
                alt="Deal du jour"
                width="250"
                height="100"
                className='select-none w-[35vw] max-w-[250px] mb-1'
              />
              <CarouselProduct products={promotions} />
            </div>
          )
        }

        {
          homePageDetails.map((categorie, key) => (
            <div key={key}>
              <h2 className='mb-3 text-4xl font-bold'>{categorie.categorie.name}</h2>
              <CarouselProduct products={categorie.items} />
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

    const currentDate = new Date();

    const productsWithActivePromotions = await Product.find({
      promotions: {
        $elemMatch: {
          isActive: true,
          startDate: { $lte: currentDate },
          endDate: { $gte: currentDate },
        },
      },
    })
      .sort({ 'promotions.discountPercentage': -1 })
      .limit(10);

    const results = await Product.aggregate([
      {
        $match: {
          isPublished: true,
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categorie',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $group: {
          _id: '$category',
          items: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $project: {
          categorie: '$_id',
          items: {
            $slice: ['$items', 10],
          },
        },
      },
    ]);

    return {
      props: {
        promotions: JSON.parse(JSON.stringify(productsWithActivePromotions)),
        homePageDetails: JSON.parse(JSON.stringify(results)),
      },
      revalidate: 300, // => 5 minutes
    }
  } catch (err) {
    return {
      props: {
        homePageDetails: []
      },
    }
  } finally {
    await db.disconnect();
  }
}

export default Home
