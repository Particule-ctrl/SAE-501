import React from 'react';
import Navbar from '../components/navbar';
import { Link } from 'react-router-dom';

import bg from '../assets/images/bg1.png';
import app from '../assets/images/app.png';
import play from '../assets/images/play.png';
import phone from '../assets/images/phone/1.png';

import FeaturesOne from '../components/features';
import Screenshot from '../components/screenshot';
import Faq from '../components/faq';
import Download from '../components/download';
import Contact from '../components/contact';
import Footer from '../components/footer';

export default function IndexOne() {
  return (
    <>
      <Navbar navLight={false} playBtn={false} bgLight={false} navCenter={false} />

      <section
        className="relative overflow-hidden md:py-36 py-24 bg-slate-50/50 dark:bg-slate-800/20 bg-no-repeat bg-center bg-cover"
        id="home"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="container relative">
          <div className="grid md:grid-cols-2 grid-cols-1 items-center mt-6 gap-[30px] relative">
            <div className="md:me-6">
              <h6 className="text-red-500 uppercase text-sm font-bold tracking-wider mb-3">App Showcase</h6>
              <h4 className="font-bold lg:leading-normal leading-normal text-[42px] lg:text-[54px] mb-5">
                Welcome to our site
              </h4>
              <p className="text-slate-400 text-lg max-w-xl">
                Welcome to our project, an innovative solution designed to simplify multimodal travel for people with
                reduced mobility, combining advanced technology, ergonomics, and data protection.
              </p>

              <div className="mt-6">
                <Link to="#">
                  <img src={app} className="h-12 inline-block m-1" alt="" />
                </Link>
                <Link to="#">
                  <img src={play} className="h-12 inline-block m-1" alt="" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <img src={phone} className="mx-auto w-80 rotate-12 relative z-2" alt="" />
              <div className="overflow-hidden absolute md:size-[500px] size-[400px] bg-gradient-to-tl to-red-500/20 via-red-500/70 from-red-500 bottom-1/2 translate-y-1/2 md:start-0 start-1/2 ltr:md:translate-x-0 ltr:-translate-x-1/2 rtl:md:translate-x-0 rtl:translate-x-1/2 z-1 shadow-md shadow-red-500/10 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative md:py-24 py-16" id="features">
        <div className="container relative">
          <div className="grid grid-cols-1 pb-6 text-center">
            <h6 className="text-red-500 uppercase text-sm font-bold tracking-wider mb-3">Features</h6>
            <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-bold">
              Discover an innovative platform
            </h4>
            <p className="text-slate-400 max-w-xl mx-auto">
              Simplify your multimodal journeys with tools designed to offer a seamless, inclusive, and secure
              experience.
            </p>
          </div>
          <FeaturesOne />
        </div>
      </section>

      <section className="relative md:py-24 py-16 bg-slate-50/50 dark:bg-slate-800/20" id="screenshot">
        <div className="container relative">
          <div className="grid grid-cols-1 pb-6 text-center">
            <h6 className="text-red-500 uppercase text-sm font-bold tracking-wider mb-3">Screenshots</h6>
            <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-bold">
              Simple & Beautiful Interface
            </h4>
            <p className="text-slate-400 max-w-xl mx-auto">
              Benefit from an intuitive and accessible interface designed to simplify travel and meet the needs of
              people with reduced mobility.
            </p>
          </div>
          <Screenshot />
        </div>
      </section>

      <section className="relative overflow-hidden md:py-24 py-16" id="faqs">
        <Faq />
      </section>

      <section className="relative md:py-24 py-16 bg-slate-50/50 dark:bg-slate-800/20" id="download">
        <Download />
      </section>

      <section className="relative md:py-24 py-16 bg-slate-50/50 dark:bg-slate-800/20" id="contact">
        <Contact />
      </section>

      <Footer />
    </>
  );
}