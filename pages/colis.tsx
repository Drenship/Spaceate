import React from 'react';
import type { NextPage } from 'next/types'
import BasescreenWrapper from '@components/Layouts/BasescreenLayout'
import BlurImage from '@components/contents/BlurImage'

const MyColis: NextPage = () => {
    return (
        <BasescreenWrapper title="Colis à la carte" footer={true}>
            <div className="flex flex-col w-full max-w-2xl px-4 py-16 mx-auto space-y-5 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 className='text-3xl font-bold text-left'>Colis de saison</h1>
                <div className='block space-x-5 space-y-5 md:space-y-0 md:flex'>
                    <div className='relative object-cover w-full overflow-hidden rounded-lg aspect-[4/2] md:aspect-[2/3] md:max-w-[30%]'>
                        <BlurImage
                            src="/devassets-images/panier.jpg"
                        />
                    </div>
                    <div className='flex-1 space-y-5 text-xl'>
                        <p>Notre service de colis de fruits et légumes vous offre la possibilité de recevoir des produits frais et de qualité directement chez vous, sans avoir à vous déplacer. Avec notre abonnement récurrent, vous pouvez choisir de recevoir votre colis toutes les semaines ou de le personnaliser en fonction de vos besoins et préférences. Nous avons sélectionné les meilleurs fruits et légumes de saison pour vous offrir une expérience gustative unique.</p>
                        <p>Notre colis de fruits et légumes est la solution idéale pour tous ceux qui souhaitent manger sainement et éviter les allers-retours inutiles chez les commerçants pour acheter des fruits et légumes. Commandez dès maintenant et découvrez tous les avantages de notre service ! Nous vous garantissons une livraison rapide et des produits frais et de qualité supérieure, pour que vous puissiez profiter d'un repas sain et équilibré à tout moment.</p>
                    </div>
                </div>
            </div>
            <div className="px-6 py-20 xl:mx-auto xl:container 2xl:px-0">
                <div className="items-center justify-between lg:flex">
                    <div className="w-full lg:w-1/2">
                        <p className="text-base leading-4 text-gray-600">Choose your plan</p>
                        <h1 role="heading" className="mt-3 text-3xl font-bold leading-10 text-gray-800 md:text-5xl">
                            Our pricing plan
                        </h1>
                        <p role="contentinfo" className="mt-5 text-base leading-5 text-gray-600">
                            We’re working on a suit of tools to make managing complex systems easier, for everyone for free. we can’t wait to hear what you think
                        </p>
                        <div className="w-56">
                            <div className="flex items-center mt-10 bg-gray-100 rounded-full shadow">
                                <button className="px-6 py-4 mr-1 text-base leading-none text-gray-600 bg-gray-100 rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:outline-none" id="monthly">
                                    Monthly
                                </button>
                                <button className="px-6 py-4 text-base leading-none text-white bg-indigo-700 rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:outline-none" id="annually">
                                    Annually
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="relative w-full mt-12 xl:w-1/2 lg:w-7/12 lg:mt-0 md:px-8" role="list">
                        <img src="https://i.ibb.co/0n6DSS3/bgimg.png" className="absolute w-full mt-24 -ml-12" alt="background circle images" />
                        <div role="listitem" className="relative z-30 p-8 bg-white rounded-lg shadow cursor-pointer">
                            <div className="items-center justify-between md:flex">
                                <h2 className="text-2xl font-semibold leading-6 text-gray-800">Starter</h2>
                                <p className="mt-4 text-2xl font-semibold leading-6 text-gray-800 md:mt-0">FREE</p>
                            </div>
                            <p className="mt-4 text-base leading-6 text-gray-600 md:w-80">Full access to all features and no credit card required</p>
                        </div>
                        <div role="listitem" className="relative z-30 flex mt-3 bg-white rounded-lg shadow cursor-pointer">
                            <div className="w-2.5  h-auto bg-indigo-700 rounded-tl-md rounded-bl-md" />
                            <div className="w-full p-8">
                                <div className="items-center justify-between md:flex">
                                    <h2 className="text-2xl font-semibold leading-6 text-gray-800">Personal</h2>
                                    <p className="mt-4 text-2xl font-semibold leading-6 text-gray-800 md:mt-0">
                                        $18<span className="text-base font-normal">/mo</span>
                                    </p>
                                </div>
                                <p className="mt-4 text-base leading-6 text-gray-600 md:w-80">Unlimited products features and dedicated support channels</p>
                            </div>
                        </div>
                        <div role="listitem" className="relative z-30 p-8 bg-white rounded-lg shadow cursor-pointer mt-7">
                            <div className="items-center justify-between md:flex">
                                <h2 className="text-2xl font-semibold leading-6 text-gray-800">Team</h2>
                                <p className="mt-4 text-2xl font-semibold leading-6 text-gray-800 md:mt-0">
                                    $18<span className="text-base font-normal">/mo</span>
                                </p>
                            </div>
                            <p className="mt-4 text-base leading-6 text-gray-600 md:w-80">Unlimited products features and dedicated support channels</p>
                        </div>
                    </div>
                </div>
            </div>
        </BasescreenWrapper>
    );
}


export default MyColis