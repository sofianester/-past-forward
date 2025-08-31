/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REMIX_IDEAS = [
    "to see yourself in different travel destinations.",
    "to create a postcard from your time-travel trip.",
    "to design a travel-themed profile picture.",
    "to imagine your dream vacation outfit.",
    "to generate a passport photo from another era.",
    "to put yourself on a vintage travel poster.",
];

const Footer = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setIndex(prevIndex => (prevIndex + 1) % REMIX_IDEAS.length);
        }, 3500); // Change text every 3.5 seconds

        return () => clearInterval(intervalId);
    }, []);

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-sm p-3 z-50 text-gray-700 text-xs sm:text-sm border-t border-gray-200">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center gap-4 px-4">
                {/* Left Side */}
                <div className="hidden md:flex items-center gap-4 text-gray-500 whitespace-nowrap">
                    <p>Powered by Gemini 2.5 Flash Image Preview</p>
                    <span className="text-gray-300" aria-hidden="true">|</span>
                    <p>
                        Created by{' '}
                        <a
                            href="https://x.com/ammaar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 font-medium hover:text-[#5392F9] transition-colors duration-200"
                        >
                            @ammaar
                        </a>
                    </p>
                </div>

                {/* Right Side */}
                <div className="flex-grow flex justify-end items-center gap-4 sm:gap-6">
                    <div className="hidden lg:flex items-center gap-2 text-gray-500 text-right min-w-0">
                        <span className="flex-shrink-0">Remix this app...</span>
                        <div className="relative w-72 h-5">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    className="absolute inset-0 font-medium text-gray-800 whitespace-nowrap text-left"
                                >
                                    {REMIX_IDEAS[index]}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <a
                            href="https://aistudio.google.com/apps"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-sm sm:text-base text-center text-white bg-[#5392F9] py-2 px-4 rounded-lg transform transition-transform duration-200 hover:scale-105 shadow-sm hover:shadow-md whitespace-nowrap"
                        >
                            Apps on AI Studio
                        </a>
                        <a
                            href="https://gemini.google.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-sm sm:text-base text-center text-[#5392F9] bg-transparent border border-[#5392F9] py-2 px-4 rounded-lg transform transition-transform duration-200 hover:scale-105 hover:bg-[#5392F9]/10 whitespace-nowrap"
                        >
                            Chat with Gemini
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;