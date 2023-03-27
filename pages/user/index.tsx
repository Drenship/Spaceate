import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { AnnotationIcon, CheckIcon, ShieldCheckIcon } from '@heroicons/react/solid';

import BasescreenWrapper from '@components/Wrapper/BasescreenWrapper';
import CommentaireCard from '@components/cards/CommentaireCard';


function LocationCard({ item }: any){
    return (
        <div className="flex flex-col overflow-hidden border rounded-xl shadow-lg max-w-[320px] min-w-[320px] w-full cursor-pointer button-click-effect">
            
            <div className="relative w-full h-40">
                <Image 
                    src={item.img}
                    layout='fill'
                    objectFit="cover"
                />
            </div>
            <div className="p-5">
                <h3 className="text-lg font-bold">{ item.title }</h3>
                <p className="text-sm text-gray-600 truncate">{ item.description }</p>
                <p className="font-bold text-right">30€</p>
            </div>

        </div>
    )
}



interface Props {
    myLocations: any[]
}

const UserProfil: NextPage<Props> = ({ myLocations }) => {
    

    const [commentaires, setCommentaires] = useState([]);

    return (
        <BasescreenWrapper title="Profile" footer={true}>
            <div className='block px-5 my-12 lg:flex max-w-[1400px]'>

                { /* Left */}
                <div className='flex flex-col items-center justify-start rounded-xl w-full lg:max-w-[320px] mr-0 lg:mr-16 lg:py-4 lg:px-6 lg:border flex-shrink-0'>
                    <div className='flex items-center justify-between w-full'>

                        <div className='inline-block lg:hidden'>
                            <h3 className='text-3xl font-bold'>Bonjour, je m'appelle Florentin</h3>
                            <p className='pt-2 text-gray-400'>Membre depuis 2022</p>
                            <button className='mt-5 font-semibold underline active:text-gray-400'>Modifier le profil</button>
                        </div>

                        <div className='flex flex-col items-end justify-end lg:items-center lg:w-full'>
                            <div className='relative w-20 h-20 lg:w-32 lg:h-32'>
                                <Image src='https://a0.muscache.com/defaults/user_pic-225x225.png?v=3'
                                    layout='fill'
                                    objectFit='cover'
                                    className='rounded-full'
                                />
                            </div>
                            <button className='mt-5 font-semibold underline active:text-gray-400'>Modifier le profil</button>
                        </div>

                    </div>


                    <div className='w-full mt-5'>
                        <ShieldCheckIcon className="h-7" />
                    </div>

                    <div className='w-full mt-5'>
                        <h4 className='text-xl font-semibold'>Vérification de l'identité</h4>
                        <p className='mt-2'>Confirmez votre identité avec le badge de vérification d'identité.</p>
                        <button className='py-3 mt-2 font-semibold border border-black rounded-lg px-7 button-click-effect'>Obtenir le badge</button>
                    </div>

                    <div className='w-full border-t border-b pb-7 my-7 lg:pb-0 lg:border-b-0'>
                        <h4 className='mt-5 text-xl font-semibold'>Florentin : identification vérifiée</h4>
                        <div className='flex items-center mt-5 space-x-2'>
                            <CheckIcon className='w-5' />
                            <p>Adresse e-mail</p>
                        </div>
                    </div>

                </div>

                { /* Right */}
                <div className='flex-grow lg:mt-0 lg:w-full'>
                    <div className='hidden lg:block'>
                        <h3 className='text-3xl font-bold'>Bonjour, je m'appelle Florentin</h3>
                        <p className='pt-2 text-gray-400'>Membre depuis 2022</p>
                        <button className='mt-5 font-semibold underline active:text-gray-400'>Modifier le profil</button>
                    </div>

                    <div className='inline-grid border-b lg:mt-10 pb-7 mb-7'>
                        <div className='flex justify-between py-3'>
                            <h4 className='text-xl font-semibold'>Mes locations</h4>

                            <Link href='/user/all_location' className='font-semibold underline active:text-gray-400'>Voire plus</Link>
                        </div>
                        <div className='flex items-start space-x-2 overflow-y-auto scrollbar-hide'>
                            {
                                myLocations?.slice(0, 4).map((item: any, key: any) => <LocationCard
                                    key={key}
                                    item={item}
                                />)
                            }
                        </div>

                    </div>

                    <div className='flex flex-col'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-2'>
                                <AnnotationIcon className="h-5" />
                                <h4 className='text-xl font-bold'>0 commentaire</h4>
                            </div>

                            <Link href='/user/myReviews' className='font-semibold underline active:text-gray-400'>Voire plus</Link>
                        </div>
                        <div className='grid grid-cols-1'>
                            {
                                commentaires?.map((item: any, key: any) => <CommentaireCard
                                    key={key}
                                    img={item.img}
                                    name={item.name}
                                    rating={item.rating}
                                    description={item.description}
                                    date={item.date}
                                />)
                            }
                        </div>
                    </div>

                    <div className='border-t border-b my-7 py-7'>
                        <Link href='/user/reviews' className='font-semibold underline active:text-gray-400'>Commentaires de votre part</Link>
                    </div>
                </div>

            </div>
        </BasescreenWrapper>
    )
}

export async function getStaticProps() {

    const myLocations = [{
        _id: "1",
        img: "https://images8.alphacoders.com/110/thumb-1920-1102284.jpg",
        title: 'Piscine',
        description: "bbudsvbozusidv  ndszouv zod^_jvùZDPOIM?VC ZDÖPIFGVHZEDoifazepùfvhbre vdpç ghrzov bfdqkmu ,qdsP9%FVRZEUFGOZDSNVEFQ%O8V QREFDZ9HR"
    }, {
        _id: "2",
        img: "https://images8.alphacoders.com/110/thumb-1920-1102284.jpg",
        title: 'Appartent',
        description: "dvgil du kgfd poufhdo dqsnf oupdz vnv ZSDGO8  NGFEZD7b ngfomlubl pùfd b^o_gsfdhbdf dvn hqdfoidfi oiu fo ifd boiowdpfhbdf dfloi f !"
    }, {
        _id: "3",
        img: "https://images8.alphacoders.com/110/thumb-1920-1102284.jpg",
        title: 'Maison',
        description: "dvgil du kgfd poufhdo dqsnf oupdz vnv ZSDGO8  NGFEZD7b ngfomlubl pùfd b^o_gsfdhbdf dvn hqdfoidfi oiu fo ifd boiowdpfhbdf dfloi f !"
    }, {
        _id: "4",
        img: "https://images8.alphacoders.com/110/thumb-1920-1102284.jpg",
        title: 'Champ',
        description: "dvgil du kgfd poufhdo dqsnf oupdz vnv ZSDGO8  NGFEZD7b ngfomlubl pùfd b^o_gsfdhbdf dvn hqdfoidfi oiu fo ifd boiowdpfhbdf dfloi f !"
    }]

    return {
        props: {
            myLocations,
        }
    }
}


UserProfil.auth = true;
export default UserProfil