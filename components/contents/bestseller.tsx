import React from "react";
import BestsellerCard from "@components/cards/BestsellerCard"

const BestSeller = ({ products }) => {
    return (
        <div className="pb-16">
            <div className="flex flex-col items-center justify-center pb-24 bg-gray-100 pt-9 sm:pt-12 lg:pt-16 sm:pb-52">
                <div className="flex flex-col items-center justify-center px-4 space-y-4 2xl:container 2xl:mx-auto sm:pb-12 lg:pb-0 md:px-6 2xl:px-0">
                    <div>
                        <p className="text-3xl font-semibold leading-9 text-center text-gray-800 lg:text-4xl">Meilleures ventes</p>
                    </div>
                    <div>
                        <p className="text-base leading-normal text-center text-gray-600 sm:leading-none">Explorez les produits qui sont achetés le plus souvent par les gens</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center px-4 mb-16 -mt-16 space-y-4 sm:-mt-48 lg:-mt-32 xl:-mt-40 2xl:container 2xl:mx-auto md:px-6 2xl:px-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 justify-items-between gap-x-6 gap-y-5">
                    {
                        products.map((data, key) => <BestsellerCard product={data} key={key} />)
                    }
                </div>
            </div>
        </div>
    );
};

export default BestSeller