import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Heart, Sparkles, X, ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import { useBirthday } from '../context/BirthdayContext';
import { triggerHeartShower } from '../utils/confetti';
import { PinkBowSticker, TornPaperSticker, GroovyHeartSticker } from '../components/Stickers/AestheticStickers';

export const MemoriesPage = () => {
  const { config, nextPage, unlockSurprise } = useBirthday();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activePhoto, setActivePhoto] = useState(null);

  const categories = config.memoriesScrapbook.categoryTabs || [
    { id: 'all', label: 'All Memories' },
    { id: 'favourites', label: 'Our Favourite Moments' },
    { id: 'crazy', label: 'Crazy Memories' },
    { id: 'unforgettable', label: 'Unforgettable Days' },
    { id: 'smiles', label: 'Little Things That Make Us Smile' },
  ];

  const photos = config.memoriesScrapbook.photos || [];

  const filteredPhotos = selectedCategory === 'all'
    ? photos
    : photos.filter((p) => p.category === selectedCategory);

  const handleOpenPhoto = (photo) => {
    setActivePhoto(photo);
    unlockSurprise(`photo_viewed_${photo.id}`, false);
    triggerHeartShower();
  };

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === activePhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[nextIndex]);
  };

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === activePhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[prevIndex]);
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full py-8 px-4 sm:px-8 max-w-6xl mx-auto flex flex-col items-center select-none">
      
      {/* Decorative Washi Tapes at top */}
      <div className="washi-tape washi-tape-pink -top-2 left-10 -rotate-6 opacity-60" />
      <div className="washi-tape washi-tape-lavender -top-2 right-12 rotate-6 opacity-60" />

      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-8 relative">
        {config.stickers?.showStickers !== false && (
          <>
            <div className="absolute -top-4 -left-6 sm:-left-12 z-10 rotate-6">
              <TornPaperSticker text={config.stickers?.memoriesBadgeText || "memories"} />
            </div>
            <div className="absolute -top-4 -right-6 sm:-right-12 z-10">
              <PinkBowSticker size="sm" />
            </div>
          </>
        )}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-2">
          <Camera className="w-3.5 h-3.5" />
          <span>Chapter 3 • Digital Memory Scrapbook</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-gray-800 tracking-tight">
          {config.memoriesScrapbook.title}
        </h1>
        <p className="font-rounded text-sm sm:text-base text-gray-600 mt-2">
          {config.memoriesScrapbook.subtitle}
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-3xl">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-soft-pink scale-105'
                : 'bg-white/80 hover:bg-pink-100 text-gray-600 border border-pink-200/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Polaroid Scrapbook Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 w-full mb-12">
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            onClick={() => handleOpenPhoto(photo)}
            className={`relative group cursor-pointer ${photo.rotation || 'rotate-0'}`}
          >
            {/* Realistic Washi Tape Pin on top of polaroid */}
            <div className={`washi-tape ${photo.tapeColor ? 'bg-gradient-to-r ' + photo.tapeColor : 'washi-tape-peach'} -top-3 left-1/2 -translate-x-1/2 -rotate-2 opacity-80 group-hover:opacity-100 transition`} />

            {/* Polaroid Photo Frame */}
            <div className="polaroid-card rounded-sm flex flex-col justify-between h-full bg-white relative overflow-hidden">
              {/* Photo Area */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-pink-50 rounded-sm mb-3">
                <img
                  src={photo.image}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Cute Floating Sticker */}
                <span className="absolute bottom-2 right-2 text-xl drop-shadow-md select-none group-hover:scale-125 transition-transform">
                  {photo.sticker || '🌸'}
                </span>
              </div>

              {/* Polaroid Handwritten Caption */}
              <div className="text-center px-1">
                <span className="font-handwriting text-xl sm:text-2xl text-gray-800 font-bold block leading-tight truncate">
                  {photo.title}
                </span>
                <span className="text-[10px] text-pink-500 font-medium block mt-1">
                  {photo.date || 'Timeless Memory'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal for Photo Details */}
      <AnimatePresence>
        {activePhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setActivePhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-white flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev / Next photo buttons */}
              <button
                onClick={handlePrevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Large Image Frame */}
              <div className="relative aspect-[16/10] w-full bg-gray-900">
                <img
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Memory Caption Section */}
              <div className="p-6 bg-gradient-to-br from-cream-50 via-white to-pink-50 text-left">
                <div className="flex items-center justify-between text-xs text-rose-500 font-semibold mb-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {activePhoto.date}
                  </span>
                  <span className="text-lg">{activePhoto.sticker || '💖'}</span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">
                  {activePhoto.title}
                </h3>

                <p className="font-rounded text-sm sm:text-base text-gray-700 leading-relaxed bg-white/80 p-4 rounded-xl border border-pink-100 shadow-inner">
                  "{activePhoto.caption}"
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Page Navigation to Next Surprise */}
      <div className="text-center mt-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            unlockSurprise('completed_photo_album');
            nextPage();
          }}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-sm shadow-soft-pink hover:shadow-glow-pink flex items-center gap-2 cursor-pointer mx-auto"
        >
          <span>Continue to Things I Never Told You</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

