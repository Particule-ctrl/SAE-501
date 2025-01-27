import React from 'react'

import Navbar from '../components/navbar'
import BannerOne from '../components/banner-one'
import FeaturesOne from '../components/features'
import Screenshot from '../components/screenshot'
import Faq from '../components/faq'
import Download from '../components/download'
import Contact from '../components/contact'
import Footer from '../components/footer'

export default function IndexFive() {
  return (
    <>
    <Navbar navLight={false} playBtn={true} bgLight={false} navCenter={true}/>
    <BannerOne/>
    
    <section className="relative md:py-24 py-16" id="features">
        <div className="container relative">
            <div className="grid grid-cols-1 pb-6 text-center">
                <h6 className="text-red-500 uppercase text-sm font-bold tracking-wider mb-3">Features</h6>
                <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-bold">Discover Powerful Features</h4>

                <p className="text-slate-400 max-w-xl mx-auto">Unleash the power of our platform with a multitude of powerful features, empowering you to achieve your goals.</p>
            </div>

            <FeaturesOne/>
        </div>

    </section>

    <section className="relative md:py-24 py-16 bg-slate-50/50 dark:bg-slate-800/20" id="screenshot">
        <div className="container relative">
            <div className="grid grid-cols-1 pb-6 text-center">
                <h6 className="text-red-500 uppercase text-sm font-bold tracking-wider mb-3">Screenshots</h6>
                <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-bold">Simple & Beautiful Interface</h4>

                <p className="text-slate-400 max-w-xl mx-auto">Unleash the power of our platform with a multitude of powerful features, empowering you to achieve your goals.</p>
            </div>

            <Screenshot/>
        </div>
    </section>

    <section className="relative overflow-hidden md:py-24 py-16" id="faqs">
        <Faq/>
    </section>
    
    <section className="relative md:py-24 py-16 bg-slate-50/50 dark:bg-slate-800/20" id="download">
        <Download/>
    </section>

    <section className="relative md:py-24 py-16 bg-slate-50/50 dark:bg-slate-800/20" id="contact">
        <Contact/>
    </section>

    <Footer/>

    </>
  )
}
