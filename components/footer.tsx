import React from 'react';
import Link from "next/link"

interface FooterProps { }

const Footer: React.FC<FooterProps> = () => {
    return (
        <footer className="w-full px-4 py-8 mb-16 text-black bg-white border-t shadow-inner sm:mb-0">
            <div className="container flex flex-col justify-around mx-auto space-y-5 md:space-y-0 md:flex-row">
                <div>
                    <Link href='/' className="relative select-none" >
                        <img width={150} src="/icons/spaceate.svg" alt="My SVG Image" />
                        <div className='absolute inset-0 z-10' />
                    </Link>
                </div>
                <div>
                    <h3 className="mb-4 text-xl font-bold">À propos</h3>
                    <ul className="pl-0 list-none">
                        <li><a href="/about" className="block mb-2 hover:text-gray-400 hover:underline">Notre histoire</a></li>
                        <li><a href="/team" className="block mb-2 hover:text-gray-400 hover:underline">L'équipe</a></li>
                        <li><a href="/mission" className="block mb-2 hover:text-gray-400 hover:underline">Notre mission</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="mb-4 text-xl font-bold">Produits</h3>
                    <ul className="pl-0 list-none">
                        <li><a href="/fruits" className="block mb-2 hover:text-gray-400 hover:underline">Fruits</a></li>
                        <li><a href="/legumes" className="block mb-2 hover:text-gray-400 hover:underline">Légumes</a></li>
                        <li><a href="/fleurs" className="block mb-2 hover:text-gray-400 hover:underline">Fleurs</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="mb-4 text-xl font-bold">Support</h3>
                    <ul className="pl-0 list-none">
                        <li><a href="/terms/conditions-generales-d-utilisation" className="block mb-2 hover:text-gray-400 hover:underline">Conditions Générales d'Utilisation</a></li>
                        <li><a href="/terms/politique-de-confidentialite" className="block mb-2 hover:text-gray-400 hover:underline">Politique de confidentialité</a></li>
                        <li><a href="/faq" className="block mb-2 hover:text-gray-400 hover:underline">FAQ</a></li>
                        <li><a href="/contact" className="block mb-2 hover:text-gray-400 hover:underline">Contactez-nous</a></li>
                    </ul>
                </div>
            </div>
            <div className='mt-5 md:text-center'>
                <p>Copyright © 2023 - Tous droits réservés</p>
            </div>
        </footer>
    )
}

export default Footer;