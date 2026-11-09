import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Save, RotateCcw, Sparkles, User, Image, Music, HeartHandshake,
  Lock, KeyRound, Eye, EyeOff, Upload, Plus, Trash2, Download, FileUp,
  Mail, Gift, Cake, Award, HelpCircle, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useBirthday } from '../../context/BirthdayContext';
import { soundFX } from '../../utils/soundEffects';

const MASTER_PASSWORD = "Vishu@0303";

export const CustomizerModal = ({ isOpen, onClose }) => {
  const { config, updateCustomConfig, resetCustomConfig } = useBirthday();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Form State
  const [formData, setFormData] = useState(() => JSON.parse(JSON.stringify(config)));
  const [activeTab, setActiveTab] = useState('recipient');
  const [saveNotification, setSaveNotification] = useState(false);
  const fileInputRef = useRef(null);
  const importFileRef = useRef(null);
  const [uploadingPhotoIndex, setUploadingPhotoIndex] = useState(null);

  if (!isOpen) return null;

  // Handle Password Unlock
  const handleVerifyPassword = (e) => {
    e.preventDefault();
    if (passwordInput === MASTER_PASSWORD) {
      soundFX.playChime();
      setIsAuthenticated(true);
      setAuthError(false);
      // Refresh form data from latest config
      setFormData(JSON.parse(JSON.stringify(config)));
    } else {
      setAuthError(true);
      soundFX.playPop();
    }
  };

  // Handle Save
  const handleSave = () => {
    soundFX.playChime();
    updateCustomConfig(formData);
    setSaveNotification(true);
    setTimeout(() => {
      setSaveNotification(false);
      onClose();
    }, 1000);
  };

  // Handle Reset to Defaults
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all customizations back to the original default setup?")) {
      resetCustomConfig();
      soundFX.playPop();
      onClose();
    }
  };

  // Handle Direct Image File Upload (Converts file to base64 Data URL)
  const handleImageFileUpload = (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert("Image is larger than 8MB. Please choose an image under 8MB for best performance.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result;
      const updatedPhotos = [...formData.memoriesScrapbook.photos];
      updatedPhotos[index] = {
        ...updatedPhotos[index],
        image: dataUrl,
      };
      setFormData({
        ...formData,
        memoriesScrapbook: {
          ...formData.memoriesScrapbook,
          photos: updatedPhotos,
        },
      });
      soundFX.playChime();
    };
    reader.readAsDataURL(file);
  };

  // Export Config as JSON file
  const handleExportConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `birthday-config-${formData.recipient.name.toLowerCase() || 'custom'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    soundFX.playChime();
  };

  // Import Config from JSON file
  const handleImportConfig = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      try {
        const parsed = JSON.parse(uploadEvent.target?.result);
        if (parsed.recipient && parsed.memoriesScrapbook) {
          setFormData(parsed);
          soundFX.playChime();
          alert("Configuration imported successfully! Click 'Save Changes' to apply.");
        } else {
          alert("Invalid configuration file format.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // Add a new memory photo
  const handleAddPhoto = () => {
    const newId = Date.now();
    const newPhoto = {
      id: newId,
      title: "New Cherished Moment",
      category: "favourites",
      date: "Special Day",
      caption: "Write a memorable caption for this beautiful memory here.",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      tapeColor: "from-pink-300 to-rose-300",
      rotation: "rotate-1",
      sticker: "🌸",
    };
    setFormData({
      ...formData,
      memoriesScrapbook: {
        ...formData.memoriesScrapbook,
        photos: [...formData.memoriesScrapbook.photos, newPhoto],
      },
    });
    soundFX.playPop();
  };

  // Delete a memory photo
  const handleDeletePhoto = (index) => {
    if (formData.memoriesScrapbook.photos.length <= 1) {
      alert("You need at least one photo in your album.");
      return;
    }
    const updated = formData.memoriesScrapbook.photos.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      memoriesScrapbook: {
        ...formData.memoriesScrapbook,
        photos: updated,
      },
    });
  };

  // Add paragraph to letter
  const handleAddParagraph = () => {
    setFormData({
      ...formData,
      letter: {
        ...formData.letter,
        paragraphs: [...formData.letter.paragraphs, "Write another heartfelt thought here..."],
      },
    });
  };

  // Delete paragraph from letter
  const handleDeleteParagraph = (index) => {
    if (formData.letter.paragraphs.length <= 1) return;
    const updated = formData.letter.paragraphs.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      letter: {
        ...formData.letter,
        paragraphs: updated,
      },
    });
  };

  // Add milestone to timeline
  const handleAddMilestone = () => {
    const newMilestone = {
      year: "New Milestone",
      date: "Special Date",
      title: "Unforgettable Moment",
      description: "Describe what happened on this special milestone day.",
      badge: "Memory",
      icon: "HeartHandshake",
    };
    setFormData({
      ...formData,
      timeline: [...formData.timeline, newMilestone],
    });
  };

  // Delete milestone from timeline
  const handleDeleteMilestone = (index) => {
    if (formData.timeline.length <= 1) return;
    const updated = formData.timeline.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      timeline: updated,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
        
        {/* ==================================================================== */}
        {/* STEP 1: PASSWORD GATE MODAL (If Not Authenticated)                   */}
        {/* ==================================================================== */}
        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-pink-200 text-center"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-pink-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lock Icon Badge */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-500 p-0.5 shadow-glow-pink">
              <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-rose-500">
                <Lock className="w-7 h-7" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Creator Access Only</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">
              Unlock Customizer Studio
            </h3>

            <p className="font-rounded text-xs sm:text-sm text-gray-500 mb-6">
              This panel lets you customize every photo, message, letter, and secret on the website. Enter your secret passcode to begin.
            </p>

            {/* Password Form */}
            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter creator passcode..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(false);
                  }}
                  autoFocus
                  className={`w-full px-4 py-3 pr-11 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 transition ${
                    authError
                      ? 'border-red-400 ring-2 ring-red-200 bg-red-50/30'
                      : 'border-pink-200 focus:ring-pink-400 bg-pink-50/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-1.5 text-xs text-red-500 font-semibold"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Incorrect passcode. Access is restricted to the creator.</span>
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-bold text-sm shadow-soft-pink hover:shadow-glow-pink transition active:scale-98"
              >
                Unlock & Open Customizer ✨
              </button>
            </form>
          </motion.div>
        ) : (
          /* ==================================================================== */
          /* STEP 2: FULL COMPREHENSIVE CUSTOMIZER STUDIO                         */
          /* ==================================================================== */
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-pink-200 overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Studio Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-200 animate-spin" style={{ animationDuration: '8s' }} />
                <div>
                  <h2 className="font-serif text-lg font-bold leading-tight">Master Birthday Customizer Studio</h2>
                  <span className="text-[10px] text-pink-100 font-medium">Customize all 8 chapters, photos, letters, and audio in real-time</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="px-3.5 py-1.5 bg-white text-rose-600 rounded-xl text-xs font-bold hover:bg-pink-50 shadow-sm flex items-center gap-1 transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-white/20 transition text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="flex border-b border-pink-100 bg-pink-50/40 px-3 text-xs font-semibold overflow-x-auto select-none">
              <button
                onClick={() => setActiveTab('recipient')}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'recipient' ? 'border-rose-500 text-rose-600 bg-white shadow-xs' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Recipient & Sender
              </button>
              <button
                onClick={() => setActiveTab('envelopeEntrance')}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'envelopeEntrance' ? 'border-rose-500 text-rose-600 bg-white shadow-xs' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> Ch 1 & 2 (Envelope & Hero)
              </button>
              <button
                onClick={() => setActiveTab('memories')}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'memories' ? 'border-rose-500 text-rose-600 bg-white shadow-xs' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Image className="w-3.5 h-3.5" /> Ch 3 (Photos & Scrapbook)
              </button>
              <button
                onClick={() => setActiveTab('secretMessages')}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'secretMessages' ? 'border-rose-500 text-rose-600 bg-white shadow-xs' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> Ch 4 (5 Secret Envelopes)
              </button>
              <button
                onClick={() => setActiveTab('giftsScratch')}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'giftsScratch' ? 'border-rose-500 text-rose-600 bg-white shadow-xs' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Gift className="w-3.5 h-3.5" /> Ch 5 (Gifts & Scratch Ticket)
              </button>
              <button
                onClick={() => setActiveTab('cake')}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'cake' ? 'border-rose-500 text-rose-600 bg-white shadow-xs' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Cake className="w-3.5 h-3.5" /> Ch 6 (Birthday Cake)
              </button>
              <button
                onClick={() => setActiveTab('letterTimeline')}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'letterTimeline' ? 'border-rose-500 text-rose-600 bg-white shadow-xs' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5" /> Ch 7 (Letter & Timeline)
              </button>
              <button
                onClick={() => setActiveTab('finaleEaster')}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'finaleEaster' ? 'border-rose-500 text-rose-600 bg-white shadow-xs' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Award className="w-3.5 h-3.5" /> Ch 8 (Finale & Easter Eggs)
              </button>
              <button
                onClick={() => setActiveTab('stickers')}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'stickers' ? 'border-rose-500 text-rose-600 bg-white shadow-xs' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Stickers & Aesthetic
              </button>
              <button
                onClick={() => setActiveTab('backupAudio')}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'backupAudio' ? 'border-rose-500 text-rose-600 bg-white shadow-xs' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Music className="w-3.5 h-3.5" /> Audio & Backup
              </button>
            </div>

            {/* Form Panels Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm text-gray-700 flex-1">
              
              {/* TAB 1: RECIPIENT & SENDER */}
              {activeTab === 'recipient' && (
                <div className="space-y-4">
                  <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100">
                    <h3 className="font-serif font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-rose-500" />
                      Recipient Identity
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Recipient First Name</label>
                        <input
                          type="text"
                          value={formData.recipient.name}
                          onChange={(e) => setFormData({ ...formData, recipient: { ...formData.recipient, name: e.target.value } })}
                          className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-xs font-medium bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Cute Nickname</label>
                        <input
                          type="text"
                          value={formData.recipient.nickname}
                          onChange={(e) => setFormData({ ...formData, recipient: { ...formData.recipient, nickname: e.target.value } })}
                          className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-xs font-medium bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Birthday Date (e.g. November 9)</label>
                        <input
                          type="text"
                          value={formData.recipient.birthDate}
                          onChange={(e) => setFormData({ ...formData, recipient: { ...formData.recipient, birthDate: e.target.value } })}
                          className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-xs font-medium bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Honorary Title</label>
                        <input
                          type="text"
                          value={formData.recipient.title}
                          onChange={(e) => setFormData({ ...formData, recipient: { ...formData.recipient, title: e.target.value } })}
                          className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-xs font-medium bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                    <h3 className="font-serif font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4 text-purple-600" />
                      Sender Identity
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Your Name / Signature</label>
                        <input
                          type="text"
                          value={formData.sender.name}
                          onChange={(e) => setFormData({ ...formData, sender: { ...formData.sender, name: e.target.value } })}
                          className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs font-medium bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Sign-off Phrase (e.g. Always & Forever,)</label>
                        <input
                          type="text"
                          value={formData.sender.signature}
                          onChange={(e) => setFormData({ ...formData, sender: { ...formData.sender, signature: e.target.value } })}
                          className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs font-medium bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ENVELOPE & GRAND ENTRANCE */}
              {activeTab === 'envelopeEntrance' && (
                <div className="space-y-4">
                  <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-3">
                    <h3 className="font-serif font-bold text-gray-800 text-base">Chapter 1: The Secret Envelope</h3>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Teaser Headline</label>
                      <input
                        type="text"
                        value={formData.envelope.teaserText}
                        onChange={(e) => setFormData({ ...formData, envelope: { ...formData.envelope, teaserText: e.target.value } })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Sub-teaser Description</label>
                      <textarea
                        rows={2}
                        value={formData.envelope.subTeaserText}
                        onChange={(e) => setFormData({ ...formData, envelope: { ...formData.envelope, subTeaserText: e.target.value } })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Envelope Button Text</label>
                        <input
                          type="text"
                          value={formData.envelope.buttonText}
                          onChange={(e) => setFormData({ ...formData, envelope: { ...formData.envelope, buttonText: e.target.value } })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Hint Text Below Envelope</label>
                        <input
                          type="text"
                          value={formData.envelope.hintText}
                          onChange={(e) => setFormData({ ...formData, envelope: { ...formData.envelope, hintText: e.target.value } })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-3">
                    <h3 className="font-serif font-bold text-gray-800 text-base">Chapter 2: The Grand Birthday Entrance</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Celebration Headline</label>
                        <input
                          type="text"
                          value={formData.entrance.celebrationHeadline}
                          onChange={(e) => setFormData({ ...formData, entrance: { ...formData.entrance, celebrationHeadline: e.target.value } })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Journey Button Text</label>
                        <input
                          type="text"
                          value={formData.entrance.buttonText}
                          onChange={(e) => setFormData({ ...formData, entrance: { ...formData.entrance, buttonText: e.target.value } })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Poetic Subtitle</label>
                      <input
                        type="text"
                        value={formData.entrance.subtitle}
                        onChange={(e) => setFormData({ ...formData, entrance: { ...formData.entrance, subtitle: e.target.value } })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PHOTOS & SCRAPBOOK */}
              {activeTab === 'memories' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-gray-800 text-base">Polaroid Photo Album ({formData.memoriesScrapbook.photos.length} Photos)</h3>
                      <p className="text-xs text-gray-500">Upload your real photos directly from your computer or phone!</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPhoto}
                      className="px-3 py-1.5 rounded-xl bg-pink-100 text-rose-600 hover:bg-pink-200 text-xs font-bold flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add New Photo
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                    {formData.memoriesScrapbook.photos.map((photo, idx) => (
                      <div key={photo.id || idx} className="p-4 bg-pink-50/40 rounded-2xl border border-pink-200 space-y-3 relative">
                        <div className="flex items-center justify-between border-b border-pink-100 pb-2">
                          <span className="font-bold text-xs text-rose-600">Photo #{idx + 1}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{photo.sticker || '🌸'}</span>
                            <button
                              type="button"
                              onClick={() => handleDeletePhoto(idx)}
                              className="text-gray-400 hover:text-red-500 p-1 transition"
                              title="Delete photo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Photo Image Preview & Upload Control */}
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                          <div className="w-24 h-24 rounded-xl overflow-hidden bg-white border-2 border-pink-200 shadow-sm flex-shrink-0">
                            <img src={photo.image} alt={photo.title} className="w-full h-full object-cover" />
                          </div>

                          <div className="flex-1 space-y-2 w-full">
                            <div className="flex items-center gap-2">
                              {/* Direct File Upload Button */}
                              <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-bold hover:opacity-95 shadow-xs flex items-center gap-1.5 transition">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Image from Device</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileUpload(e, idx)}
                                />
                              </label>
                              <span className="text-[11px] text-gray-400 font-medium">Or enter URL / file path below:</span>
                            </div>

                            <input
                              type="text"
                              placeholder="Image URL or /images/filename.jpg"
                              value={photo.image}
                              onChange={(e) => {
                                const updated = [...formData.memoriesScrapbook.photos];
                                updated[idx].image = e.target.value;
                                setFormData({
                                  ...formData,
                                  memoriesScrapbook: { ...formData.memoriesScrapbook, photos: updated },
                                });
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-xl border border-pink-200 bg-white"
                            />
                          </div>
                        </div>

                        {/* Title & Category */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">Title</label>
                            <input
                              type="text"
                              value={photo.title}
                              onChange={(e) => {
                                const updated = [...formData.memoriesScrapbook.photos];
                                updated[idx].title = e.target.value;
                                setFormData({ ...formData, memoriesScrapbook: { ...formData.memoriesScrapbook, photos: updated } });
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-xl border border-pink-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">Date / Occasion</label>
                            <input
                              type="text"
                              value={photo.date}
                              onChange={(e) => {
                                const updated = [...formData.memoriesScrapbook.photos];
                                updated[idx].date = e.target.value;
                                setFormData({ ...formData, memoriesScrapbook: { ...formData.memoriesScrapbook, photos: updated } });
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-xl border border-pink-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">Category Tab</label>
                            <select
                              value={photo.category}
                              onChange={(e) => {
                                const updated = [...formData.memoriesScrapbook.photos];
                                updated[idx].category = e.target.value;
                                setFormData({ ...formData, memoriesScrapbook: { ...formData.memoriesScrapbook, photos: updated } });
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-xl border border-pink-200 bg-white"
                            >
                              <option value="favourites">Our Favourite Moments</option>
                              <option value="crazy">Crazy Memories</option>
                              <option value="unforgettable">Unforgettable Days</option>
                              <option value="smiles">Little Things That Make Us Smile</option>
                            </select>
                          </div>
                        </div>

                        {/* Caption */}
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Personal Memory Caption</label>
                          <textarea
                            rows={2}
                            value={photo.caption}
                            onChange={(e) => {
                              const updated = [...formData.memoriesScrapbook.photos];
                              updated[idx].caption = e.target.value;
                              setFormData({ ...formData, memoriesScrapbook: { ...formData.memoriesScrapbook, photos: updated } });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-xl border border-pink-200 bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SECRET ENVELOPES */}
              {activeTab === 'secretMessages' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-gray-800 text-base">Chapter 4: The 5 Secret Envelopes</h3>
                    <p className="text-xs text-gray-500">Edit the private handwritten letters revealed when she opens each envelope.</p>
                  </div>

                  <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                    {formData.secretEnvelopes.map((env, idx) => (
                      <div key={env.id || idx} className="p-4 bg-pink-50/40 rounded-2xl border border-pink-200 space-y-3">
                        <div className="flex items-center justify-between border-b border-pink-100 pb-2">
                          <span className="font-bold text-xs text-rose-600">Secret Envelope #{idx + 1}</span>
                          <span className="text-[10px] bg-pink-100 px-2 py-0.5 rounded font-bold uppercase text-pink-700">{env.stamp}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">Envelope Title</label>
                            <input
                              type="text"
                              value={env.title}
                              onChange={(e) => {
                                const updated = [...formData.secretEnvelopes];
                                updated[idx].title = e.target.value;
                                setFormData({ ...formData, secretEnvelopes: updated });
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-xl border border-pink-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">Postal Stamp Text</label>
                            <input
                              type="text"
                              value={env.stamp}
                              onChange={(e) => {
                                const updated = [...formData.secretEnvelopes];
                                updated[idx].stamp = e.target.value;
                                setFormData({ ...formData, secretEnvelopes: updated });
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded-xl border border-pink-200 bg-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Preview Quote</label>
                          <input
                            type="text"
                            value={env.letterPreview}
                            onChange={(e) => {
                              const updated = [...formData.secretEnvelopes];
                              updated[idx].letterPreview = e.target.value;
                              setFormData({ ...formData, secretEnvelopes: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-xl border border-pink-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Full Handwritten Letter</label>
                          <textarea
                            rows={3}
                            value={env.fullLetter}
                            onChange={(e) => {
                              const updated = [...formData.secretEnvelopes];
                              updated[idx].fullLetter = e.target.value;
                              setFormData({ ...formData, secretEnvelopes: updated });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded-xl border border-pink-200 bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: GIFTS & SCRATCH CARD */}
              {activeTab === 'giftsScratch' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-gray-800 text-base">Chapter 5: Mystery Gifts & Scratch Card</h3>
                    <p className="text-xs text-gray-500">Customize the 4 gift box surprises and the secret scratch ticket message.</p>
                  </div>

                  {/* 4 Mystery Gift Boxes */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs text-rose-600">The 4 Gift Boxes</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formData.mysteryGifts.map((gift, idx) => (
                        <div key={gift.id || idx} className="p-3 bg-pink-50/40 rounded-xl border border-pink-200 space-y-2">
                          <span className="font-bold text-xs text-gray-800">Box #{idx + 1}: {gift.boxTitle}</span>
                          <input
                            type="text"
                            placeholder="Box Title"
                            value={gift.boxTitle}
                            onChange={(e) => {
                              const updated = [...formData.mysteryGifts];
                              updated[idx].boxTitle = e.target.value;
                              setFormData({ ...formData, mysteryGifts: updated });
                            }}
                            className="w-full px-2.5 py-1 text-xs rounded-lg border border-pink-200 bg-white"
                          />
                          <input
                            type="text"
                            placeholder="Surprise Header"
                            value={gift.surpriseTitle}
                            onChange={(e) => {
                              const updated = [...formData.mysteryGifts];
                              updated[idx].surpriseTitle = e.target.value;
                              setFormData({ ...formData, mysteryGifts: updated });
                            }}
                            className="w-full px-2.5 py-1 text-xs rounded-lg border border-pink-200 bg-white"
                          />
                          <textarea
                            rows={2}
                            placeholder="Surprise Content"
                            value={gift.content}
                            onChange={(e) => {
                              const updated = [...formData.mysteryGifts];
                              updated[idx].content = e.target.value;
                              setFormData({ ...formData, mysteryGifts: updated });
                            }}
                            className="w-full px-2.5 py-1 text-xs rounded-lg border border-pink-200 bg-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scratch Card Secret */}
                  <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-3">
                    <h4 className="font-bold text-xs text-amber-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Interactive Golden Scratch Card Surprise
                    </h4>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Ticket Title</label>
                      <input
                        type="text"
                        value={formData.scratchCard.title}
                        onChange={(e) => setFormData({ ...formData, scratchCard: { ...formData.scratchCard, title: e.target.value } })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-amber-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Hidden Message (Revealed upon scratching!)</label>
                      <textarea
                        rows={3}
                        value={formData.scratchCard.hiddenMessage}
                        onChange={(e) => setFormData({ ...formData, scratchCard: { ...formData.scratchCard, hiddenMessage: e.target.value } })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-amber-200 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: BIRTHDAY CAKE */}
              {activeTab === 'cake' && (
                <div className="space-y-4">
                  <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-3">
                    <h3 className="font-serif font-bold text-gray-800 text-base">Chapter 6: Birthday Cake & Wishing</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Number of Candles (1 to 10)</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={formData.cake.candlesCount || 5}
                          onChange={(e) => setFormData({ ...formData, cake: { ...formData.cake, candlesCount: parseInt(e.target.value) || 5 } })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Cake Tagline</label>
                        <input
                          type="text"
                          value={formData.cake.tagline}
                          onChange={(e) => setFormData({ ...formData, cake: { ...formData.cake, tagline: e.target.value } })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Post-Blow Grand Message</label>
                      <input
                        type="text"
                        value={formData.cake.blewMessage}
                        onChange={(e) => setFormData({ ...formData, cake: { ...formData.cake, blewMessage: e.target.value } })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Wish Dedication Note</label>
                      <textarea
                        rows={2}
                        value={formData.cake.subBlewMessage}
                        onChange={(e) => setFormData({ ...formData, cake: { ...formData.cake, subBlewMessage: e.target.value } })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: LETTER & MILESTONES TIMELINE */}
              {activeTab === 'letterTimeline' && (
                <div className="space-y-5">
                  {/* Heartfelt Letter */}
                  <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-bold text-gray-800 text-base">The Letter From My Heart</h3>
                      <button
                        type="button"
                        onClick={handleAddParagraph}
                        className="px-2.5 py-1 rounded-lg bg-pink-200 text-rose-700 text-xs font-bold hover:bg-pink-300 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Paragraph
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Salutation</label>
                      <input
                        type="text"
                        value={formData.letter.salutation}
                        onChange={(e) => setFormData({ ...formData, letter: { ...formData.letter, salutation: e.target.value } })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-pink-200 bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-700">Paragraphs (Read Progressively)</label>
                      {formData.letter.paragraphs.map((p, pIdx) => (
                        <div key={pIdx} className="flex gap-2 items-start">
                          <textarea
                            rows={2}
                            value={p}
                            onChange={(e) => {
                              const updated = [...formData.letter.paragraphs];
                              updated[pIdx] = e.target.value;
                              setFormData({ ...formData, letter: { ...formData.letter, paragraphs: updated } });
                            }}
                            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-pink-200 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteParagraph(pIdx)}
                            className="text-gray-400 hover:text-red-500 p-1.5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Closing & Signature</label>
                        <input
                          type="text"
                          value={formData.letter.closing}
                          onChange={(e) => setFormData({ ...formData, letter: { ...formData.letter, closing: e.target.value } })}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Postscript (P.S.)</label>
                        <input
                          type="text"
                          value={formData.letter.postscript}
                          onChange={(e) => setFormData({ ...formData, letter: { ...formData.letter, postscript: e.target.value } })}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Friendship Milestones Timeline */}
                  <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-bold text-gray-800 text-base">Friendship Milestones Timeline</h3>
                      <button
                        type="button"
                        onClick={handleAddMilestone}
                        className="px-2.5 py-1 rounded-lg bg-purple-200 text-purple-700 text-xs font-bold hover:bg-purple-300 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Milestone
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.timeline.map((item, mIdx) => (
                        <div key={mIdx} className="p-3 bg-white rounded-xl border border-purple-100 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-purple-700">
                            <span>Milestone #{mIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteMilestone(mIdx)}
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              placeholder="Year / Tag"
                              value={item.year}
                              onChange={(e) => {
                                const updated = [...formData.timeline];
                                updated[mIdx].year = e.target.value;
                                setFormData({ ...formData, timeline: updated });
                              }}
                              className="px-2.5 py-1 text-xs rounded-lg border border-purple-200 bg-purple-50/30"
                            />
                            <input
                              type="text"
                              placeholder="Date"
                              value={item.date}
                              onChange={(e) => {
                                const updated = [...formData.timeline];
                                updated[mIdx].date = e.target.value;
                                setFormData({ ...formData, timeline: updated });
                              }}
                              className="px-2.5 py-1 text-xs rounded-lg border border-purple-200 bg-purple-50/30"
                            />
                            <input
                              type="text"
                              placeholder="Badge Label"
                              value={item.badge}
                              onChange={(e) => {
                                const updated = [...formData.timeline];
                                updated[mIdx].badge = e.target.value;
                                setFormData({ ...formData, timeline: updated });
                              }}
                              className="px-2.5 py-1 text-xs rounded-lg border border-purple-200 bg-purple-50/30"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Milestone Title"
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...formData.timeline];
                              updated[mIdx].title = e.target.value;
                              setFormData({ ...formData, timeline: updated });
                            }}
                            className="w-full px-2.5 py-1 text-xs rounded-lg border border-purple-200"
                          />
                          <textarea
                            rows={2}
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => {
                              const updated = [...formData.timeline];
                              updated[mIdx].description = e.target.value;
                              setFormData({ ...formData, timeline: updated });
                            }}
                            className="w-full px-2.5 py-1 text-xs rounded-lg border border-purple-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: FINALE & SECRET HEARTS */}
              {activeTab === 'finaleEaster' && (
                <div className="space-y-4">
                  {/* Chapter 8 Finale */}
                  <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-3">
                    <h3 className="font-serif font-bold text-gray-800 text-base">Chapter 8: Final Surprise & Certificate</h3>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Grand Hero Greeting</label>
                      <input
                        type="text"
                        value={formData.finalCelebration.heroGreeting}
                        onChange={(e) => setFormData({ ...formData, finalCelebration: { ...formData.finalCelebration, heroGreeting: e.target.value } })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-pink-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Friendship Quote</label>
                      <input
                        type="text"
                        value={formData.finalCelebration.favouriteQuote}
                        onChange={(e) => setFormData({ ...formData, finalCelebration: { ...formData.finalCelebration, favouriteQuote: e.target.value } })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-pink-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Final Emotional Ending Line</label>
                      <textarea
                        rows={2}
                        value={formData.finalCelebration.emotionalEnding}
                        onChange={(e) => setFormData({ ...formData, finalCelebration: { ...formData.finalCelebration, emotionalEnding: e.target.value } })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-pink-200 bg-white"
                      />
                    </div>
                  </div>

                  {/* Secret Hearts Easter Eggs */}
                  <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-3">
                    <h3 className="font-serif font-bold text-gray-800 text-base">The 4 Secret Heart Whispers</h3>
                    <p className="text-xs text-gray-500">Whispered notes revealed when she clicks the glowing secret hearts on pages 2, 4, 6, 8.</p>
                    <div className="space-y-2">
                      {formData.secretHearts.map((heart, hIdx) => (
                        <div key={heart.id || hIdx} className="p-2.5 bg-white rounded-xl border border-rose-100 space-y-1">
                          <span className="text-[11px] font-bold text-rose-600">Secret Heart #{hIdx + 1} (Page {heart.page})</span>
                          <textarea
                            rows={2}
                            value={heart.message}
                            onChange={(e) => {
                              const updated = [...formData.secretHearts];
                              updated[hIdx].message = e.target.value;
                              setFormData({ ...formData, secretHearts: updated });
                            }}
                            className="w-full px-2.5 py-1 text-xs rounded-lg border border-rose-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: STICKERS & AESTHETIC */}
              {activeTab === 'stickers' && (
                <div className="space-y-4">
                  <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                      <div>
                        <h3 className="font-serif font-bold text-gray-800 text-base">Aesthetic Scrapbook Stickers</h3>
                        <p className="text-xs text-gray-500">Customize the bows, 11:11 angel numbers, foil balloons, lipstick kisses & badges.</p>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-rose-600">
                        <input
                          type="checkbox"
                          checked={formData.stickers?.showStickers !== false}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              stickers: { ...formData.stickers, showStickers: e.target.checked },
                            })
                          }
                          className="w-4 h-4 rounded text-rose-500 accent-rose-500"
                        />
                        <span>Enable Stickers</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Foil Balloons Age (e.g. 16, 18, 20, 21, 24)
                        </label>
                        <input
                          type="number"
                          value={formData.stickers?.foilBalloonAge || formData.recipient.age || 24}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              stickers: { ...formData.stickers, foilBalloonAge: parseInt(e.target.value) || 24 },
                            })
                          }
                          className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Angel Number Wish Sticker (e.g. 11:11)
                        </label>
                        <input
                          type="text"
                          value={formData.stickers?.angelNumberText || "11:11"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              stickers: { ...formData.stickers, angelNumberText: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          "Birthday Girl" Badge Text
                        </label>
                        <input
                          type="text"
                          value={formData.stickers?.birthdayGirlBadgeText || "Birthday Girl"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              stickers: { ...formData.stickers, birthdayGirlBadgeText: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Torn Kraft Paper Text (e.g. Happiness)
                        </label>
                        <input
                          type="text"
                          value={formData.stickers?.tornPaperText || "Happiness"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              stickers: { ...formData.stickers, tornPaperText: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Scrapbook Memories Tape Text
                        </label>
                        <input
                          type="text"
                          value={formData.stickers?.memoriesBadgeText || "memories"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              stickers: { ...formData.stickers, memoriesBadgeText: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          "Favorite Person" Stamp Text
                        </label>
                        <input
                          type="text"
                          value={formData.stickers?.favoritePersonText || "favorite person"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              stickers: { ...formData.stickers, favoritePersonText: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Spotify Music Card Lyric / Quote
                      </label>
                      <input
                        type="text"
                        value={formData.stickers?.spotifySongQuote || "Day by day, I'm fallin' more in love with our friendship"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stickers: { ...formData.stickers, spotifySongQuote: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: AUDIO & BACKUP */}
              {activeTab === 'backupAudio' && (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-3">
                    <h3 className="font-serif font-bold text-gray-800 text-base">Audio & Soundtrack Experience</h3>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Song Title</label>
                      <input
                        type="text"
                        value={formData.audio.title}
                        onChange={(e) => setFormData({ ...formData, audio: { ...formData.audio, title: e.target.value } })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-purple-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">MP3 Audio File Path or URL</label>
                      <input
                        type="text"
                        value={formData.audio.src}
                        onChange={(e) => setFormData({ ...formData, audio: { ...formData.audio, src: e.target.value } })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-purple-200 bg-white"
                      />
                      <p className="text-[11px] text-gray-500 mt-1">
                        If no MP3 is detected, the website plays the gentle acoustic celesta dream synthesizer automatically.
                      </p>
                    </div>
                  </div>

                  {/* Backup / Export / Import */}
                  <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-200 space-y-3">
                    <h3 className="font-serif font-bold text-gray-800 text-base flex items-center gap-1.5">
                      <Save className="w-4 h-4 text-pink-600" />
                      Backup, Export & Import
                    </h3>
                    <p className="text-xs text-gray-500">
                      Download your entire customized configuration to your computer as a backup JSON file or import a saved configuration!
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={handleExportConfig}
                        className="px-4 py-2 bg-white border border-pink-300 text-rose-600 rounded-xl text-xs font-bold hover:bg-pink-100 flex items-center gap-1.5 transition shadow-xs"
                      >
                        <Download className="w-4 h-4" /> Export Configuration File
                      </button>

                      <label className="cursor-pointer px-4 py-2 bg-white border border-purple-300 text-purple-700 rounded-xl text-xs font-bold hover:bg-purple-100 flex items-center gap-1.5 transition shadow-xs">
                        <FileUp className="w-4 h-4" /> Import Configuration File
                        <input
                          type="file"
                          accept=".json"
                          className="hidden"
                          onChange={handleImportConfig}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Studio Footer Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-red-500 flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset to Defaults
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2.5 text-xs font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white rounded-xl shadow-soft-pink hover:shadow-glow-pink flex items-center gap-1.5 transition active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{saveNotification ? "Saved & Applied! ✨" : "Save All Changes"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
