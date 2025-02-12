import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import faqImg from '../assets/images/phone/2.png';

import CountUp from 'react-countup';
import { FiChevronUp, FiDownload } from 'react-icons/fi';

import { faq } from '../data/data';

interface FaqData {
    id: number;
    title: string;
    desc: string;
}

export default function Faq() {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<number>(1);

    return (
        <div className="container relative">
            <div className="grid md:grid-cols-2 grid-cols-1 items-center gap-[30px]">
                <div className="relative order-1 md:order-2">
                    <div className="relative">
                        <img src={faqImg} className="mx-auto md:max-w-xs lg:max-w-sm" alt="" />

                        <div className="absolute top-24 md:end-14 -end-2 text-center">
                            <Link
                                to="#!"
                                onClick={() => setOpen(true)}
                                className="lightbox size-20 rounded-full shadow-md dark:shadow-gray-700 inline-flex items-center justify-center text-white bg-red-500"
                            >
                                <i className="mdi mdi-play inline-flex items-center justify-center text-2xl"></i>
                            </Link>
                        </div>

                        {/* Modal pour la vidéo MP4 */}
                        {isOpen && (
                            <div
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: 1000,
                                }}
                                onClick={() => setOpen(false)}
                            >
                                <div
                                    style={{
                                        backgroundColor: '#fff',
                                        padding: '20px',
                                        borderRadius: '8px',
                                        maxWidth: '90%',
                                        maxHeight: '90%',
                                        overflow: 'auto',
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <video controls width="100%">
                                        <source
                                            src="https://cdn.discordapp.com/attachments/1283000631485005848/1333611813165596673/MAIN.mp4?ex=67998649&is=679834c9&hm=5ae70cc72d835c1fe76893647ae322e955162595c116af88feee38eee80182c5&"
                                            type="video/mp4"
                                        />
                                        Votre navigateur ne supporte pas la lecture de vidéos.
                                    </video>
                                    <button
                                        onClick={() => setOpen(false)}
                                        style={{ marginTop: '10px' }}
                                    >
                                        Fermer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="overflow-hidden absolute md:size-[500px] size-[400px] bg-gradient-to-tr to-red-500/20 via-red-500/70 from-red-500 bottom-1/2 translate-y-1/2 md:end-0 end-1/2 md:translate-x-0 translate-x-1/2 -z-1 shadow-md shadow-red-500/10 rounded-full"></div>
                </div>

                <div className="lg:me-8 order-2 md:order-1">
                    <h6 className="text-red-500 uppercase text-sm font-bold tracking-wider mb-3">FAQs</h6>
                    <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-bold">Have Questions? Look Here</h4>
                    <p className="text-slate-400 max-w-xl mx-auto">Benefit from an intuitive and accessible interface designed to simplify travel and meet the needs of people with reduced mobility.</p>

                    <div id="accordion-collapseone" className="mt-8">
                        {faq.map((item: FaqData, index: number) => {
                            return (
                                <div
                                    className={`relative shadow dark:shadow-gray-800 rounded-md overflow-hidden ${item.id !== 1 ? 'mt-3' : ''}`}
                                    key={index}
                                >
                                    <h2 className="font-semibold">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab(item.id)}
                                            className={`flex justify-between items-center p-5 w-full font-medium text-start ${activeTab === item.id ? 'bg-slate-50/50 dark:bg-slate-800/20 text-red-500' : ''}`}
                                        >
                                            <span>{item.title}</span>
                                            <FiChevronUp className={`size-4 shrink-0 ${activeTab === item.id ? '' : 'rotate-180'}`} />
                                        </button>
                                    </h2>
                                    <div className={`${activeTab === item.id ? '' : 'hidden'}`}>
                                        <div className="p-5">
                                            <p className="text-slate-400 dark:text-gray-400">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6">
                        <Link
                            to="#"
                            className="hover:text-red-500 dark:hover:text-red-500 after:bg-red-500 dark:text-white transition duration-500 font-medium"
                        >
                            Find Out More <i className="mdi mdi-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}