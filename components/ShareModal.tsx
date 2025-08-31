/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createAlbumPage } from '../lib/albumUtils';

// --- SVG Icons ---
const XIcon = () => (<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>);
const FacebookIcon = () => (<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>);
const LinkedInIcon = () => (<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.42c2.28 0 4.1 1.88 4.1 5.32z" /></svg>);
const CopyIcon = () => (<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>);
const CheckIcon = () => (<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>);


/**
 * Converts a data URL string to a File object.
 * @param dataUrl The data URL to convert.
 * @param fileName The desired name for the output file.
 * @returns A promise that resolves to a File object.
 */
async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: blob.type });
}

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    shareContent: {
        type: 'image' | 'album';
        decade?: string;
        imageUrl?: string;
        albumImages?: Record<string, string>;
    } | null;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareContent }) => {
    const [isGeneratingAlbum, setIsGeneratingAlbum] = useState(false);
    const [isLinkCopied, setIsLinkCopied] = useState(false);
    const [canShare, setCanShare] = useState(false);
    
    // Check for navigator.share and file sharing capabilities on mount
    useEffect(() => {
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([], "test.jpg", {type: "image/jpeg"})] })) {
            setCanShare(true);
        } else {
            setCanShare(false);
        }
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setIsLinkCopied(false);
            setIsGeneratingAlbum(false);
        }
    }, [isOpen]);

    const handleNativeShare = async () => {
        if (!shareContent) return;
        
        const title = shareContent.type === 'album' 
            ? 'My Agoda Time-Travel Album' 
            : `My ${shareContent.decade} Look!`;
            
        const text = "Check out my time-travel photo created with Agoda's Marketing Time Machine! #AgodaTimeMachine #PastForward";
        
        try {
            let fileToShare: File | null = null;
            if (shareContent.type === 'image' && shareContent.imageUrl) {
                fileToShare = await dataUrlToFile(shareContent.imageUrl, `past-forward-${shareContent.decade}.jpg`);
            } else if (shareContent.type === 'album' && shareContent.albumImages) {
                setIsGeneratingAlbum(true);
                const albumUrl = await createAlbumPage(shareContent.albumImages);
                fileToShare = await dataUrlToFile(albumUrl, 'past-forward-album.jpg');
                setIsGeneratingAlbum(false);
            }

            if (fileToShare) {
                 await navigator.share({
                    title,
                    text,
                    files: [fileToShare],
                });
            }
        } catch (error) {
            // Log error but don't alert the user, as they might have intentionally cancelled the share.
            if ((error as Error).name !== 'AbortError') {
                 console.error('Error using Web Share API:', error);
            }
        } finally {
            setIsGeneratingAlbum(false);
            onClose();
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setIsLinkCopied(true);
            setTimeout(() => setIsLinkCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy link: ', err);
            alert('Failed to copy link.');
        });
    };

    const getTitle = () => {
        if (!shareContent) return 'Share';
        return shareContent.type === 'album' ? 'Share Your Album' : `Share Your ${shareContent.decade} Look`;
    };

    const shareUrl = window.location.href;
    const shareText = "Check out my time-travel photo created with Agoda's Marketing Time Machine! #AgodaTimeMachine #PastForward";
    const socialLinks = [
        { name: 'X', icon: <XIcon />, url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
        { name: 'Facebook', icon: <FacebookIcon />, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
        { name: 'LinkedIn', icon: <LinkedInIcon />, url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(getTitle())}&summary=${encodeURIComponent(shareText)}` },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    aria-modal="true"
                    role="dialog"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative"
                        role="document"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6" id="share-modal-title">{getTitle()}</h2>
                        
                        {canShare ? (
                             <button
                                onClick={handleNativeShare}
                                disabled={isGeneratingAlbum}
                                className="w-full font-semibold text-lg text-center text-white bg-green-500 py-3 px-8 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-green-600 shadow-md flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-wait"
                             >
                                 {isGeneratingAlbum ? 'Preparing Album...' : 'Share via...'}
                             </button>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-center text-gray-500 text-sm">Your browser doesn't support direct image sharing. You can share a link to this app instead.</p>
                                <div className="flex justify-center items-center gap-4 py-2">
                                    {socialLinks.map(link => (
                                        <a href={link.url} key={link.name} target="_blank" rel="noopener noreferrer" className="p-3 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 hover:text-black transition-colors" aria-label={`Share on ${link.name}`}>
                                            {link.icon}
                                        </a>
                                    ))}
                                </div>
                                <div className="relative flex items-center">
                                     <input
                                        type="text"
                                        readOnly
                                        value={window.location.href}
                                        className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 pr-24 text-sm text-gray-700 focus:outline-none"
                                        aria-label="Application link"
                                     />
                                     <button onClick={handleCopyLink} className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#5392F9] text-white font-semibold text-xs py-1.5 px-3 rounded-md hover:bg-[#4382f7] transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#5392F9]">
                                        {isLinkCopied ? <CheckIcon /> : <CopyIcon />}
                                        <span>{isLinkCopied ? 'Copied!' : 'Copy'}</span>
                                     </button>
                                </div>
                            </div>
                        )}

                         <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-1 text-gray-400 rounded-full hover:text-gray-700 hover:bg-gray-100 transition-all"
                            aria-label="Close share dialog"
                         >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                             </svg>
                         </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ShareModal;
