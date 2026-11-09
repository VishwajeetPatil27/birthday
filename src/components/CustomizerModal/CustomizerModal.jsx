import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Save, RotateCcw, Sparkles, User, Image, Music, HeartHandshake,
  Lock, KeyRound, Eye, EyeOff, Upload, Plus, Trash2, Download, FileUp,
  Mail, Gift, Cake, Award, HelpCircle, CheckCircle2, AlertCircle,
  Cloud, CloudUpload, Database, RefreshCw, CheckCircle, ExternalLink, Copy, Check, Loader2, Globe
} from 'lucide-react';
import { useBirthday } from '../../context/BirthdayContext';
import { soundFX } from '../../utils/soundEffects';
import { uploadPhotoToStorage } from '../../services/birthdayService';
import {
  getSupabaseConfig,
  setSupabaseCredentials,
  testSupabaseConnection,
  isSupabaseConfigured
} from '../../services/supabase';

const MASTER_PASSWORD = "Vishu@0303";

const SUPABASE_SQL_SCRIPT = `-- ==============================================================================
-- A THOUSAND LITTLE REASONS - SUPABASE CLOUD DATABASE & STORAGE SETUP
-- ==============================================================================
-- Copy and paste this script into your Supabase SQL Editor and click "Run".

-- 1. Create the birthday experiences configuration table
CREATE TABLE IF NOT EXISTS public.birthday_experiences (
  id TEXT PRIMARY KEY,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.birthday_experiences ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow anyone with the link to read the birthday surprise
DROP POLICY IF EXISTS "Allow public read access" ON public.birthday_experiences;
CREATE POLICY "Allow public read access"
  ON public.birthday_experiences
  FOR SELECT
  USING (true);

-- 4. Policy: Allow updating/inserting configuration
DROP POLICY IF EXISTS "Allow public upsert access" ON public.birthday_experiences;
CREATE POLICY "Allow public upsert access"
  ON public.birthday_experiences
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Enable Realtime for cross-device instant sync
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'birthday_experiences'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.birthday_experiences;
  END IF;
END $$;

-- 6. Create the Storage Bucket for uploaded photos and music ('birthday-media')
INSERT INTO storage.buckets (id, name, public)
VALUES ('birthday-media', 'birthday-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 7. Storage Policies: Allow public read of uploaded photos
DROP POLICY IF EXISTS "Public media read access" ON storage.objects;
CREATE POLICY "Public media read access"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'birthday-media');

-- 8. Storage Policies: Allow uploading photos
DROP POLICY IF EXISTS "Public media upload access" ON storage.objects;
CREATE POLICY "Public media upload access"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'birthday-media');

DROP POLICY IF EXISTS "Public media update access" ON storage.objects;
CREATE POLICY "Public media update access"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'birthday-media');
`;

export const CustomizerModal = ({ isOpen, onClose }) => {
  const { config, updateCustomConfig, resetCustomConfig, cloudSyncStatus, cloudError } = useBirthday();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Form State
  const [formData, setFormData] = useState(() => JSON.parse(JSON.stringify(config)));
  const [activeTab, setActiveTab] = useState('recipient');
  const [saveNotification, setSaveNotification] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatusText, setSaveStatusText] = useState('');
  const [uploadingPhotoIndex, setUploadingPhotoIndex] = useState(null);

  // Cloud Sync State
  const [supabaseUrl, setSupabaseUrl] = useState(() => getSupabaseConfig().url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(() => getSupabaseConfig().anonKey);
  const [isTestingCloud, setIsTestingCloud] = useState(false);
  const [cloudTestResult, setCloudTestResult] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Synchronize formData with incoming external or cloud config when modal is opened
  useEffect(() => {
    if (isOpen && config) {
      setFormData(JSON.parse(JSON.stringify(config)));
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  // Handle Password Unlock
  const handleVerifyPassword = (e) => {
    e.preventDefault();
    if (passwordInput === MASTER_PASSWORD) {
      soundFX.playChime();
      setIsAuthenticated(true);
      setAuthError(false);
      setFormData(JSON.parse(JSON.stringify(config)));
    } else {
      setAuthError(true);
      soundFX.playPop();
    }
  };

  // Handle Save (Saves to Supabase Cloud DB and local cache)
  const handleSave = async () => {
    setIsSaving(true);
    soundFX.playChime();

    try {
      const result = await updateCustomConfig(formData);
      setIsSaving(false);
      setSaveNotification(true);

      if (result && result.savedToCloud) {
        setSaveStatusText('Saved & Synced across all devices! ☁️✨');
      } else {
        setSaveStatusText('Saved locally on this device! Connect Supabase in Cloud Sync for mobile sync.');
      }

      setTimeout(() => {
        setSaveNotification(false);
        setSaveStatusText('');
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Save error:', err);
      setIsSaving(false);
      setSaveNotification(true);
      setSaveStatusText('Saved locally on this device.');
      setTimeout(() => {
        setSaveNotification(false);
        setSaveStatusText('');
        onClose();
      }, 1300);
    }
  };

  // Handle Reset to Defaults
  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset all customizations back to the original default setup?")) {
      await resetCustomConfig();
      soundFX.playPop();
      onClose();
    }
  };

  // Direct Image File Upload (Uploads to Supabase Storage or falls back to local data URL)
  const handleImageFileUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert("Image is larger than 15MB. Please choose an image under 15MB for best performance.");
      return;
    }

    setUploadingPhotoIndex(index);

    // If Supabase is configured, upload directly to cloud storage ('birthday-media')
    if (isSupabaseConfigured()) {
      try {
        const uploadRes = await uploadPhotoToStorage(file);
        if (uploadRes && uploadRes.publicUrl) {
          const updatedPhotos = [...formData.memoriesScrapbook.photos];
          updatedPhotos[index] = {
            ...updatedPhotos[index],
            image: uploadRes.publicUrl,
          };
          setFormData({
            ...formData,
            memoriesScrapbook: {
              ...formData.memoriesScrapbook,
              photos: updatedPhotos,
            },
          });
          soundFX.playChime();
          setUploadingPhotoIndex(null);
          return;
        }
      } catch (err) {
        console.warn("Cloud photo upload error, falling back to local encoding:", err);
      }
    }

    // Fallback: Read as base64 Data URL
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
      setUploadingPhotoIndex(null);
    };
    reader.onerror = () => {
      setUploadingPhotoIndex(null);
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
          alert("Configuration imported successfully! Click 'Save All Changes' to sync.");
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

  // Test Supabase connection
  const handleTestConnection = async () => {
    setIsTestingCloud(true);
    setCloudTestResult(null);

    // Save temporarily to test with provided credentials
    setSupabaseCredentials(supabaseUrl, supabaseAnonKey);

    const result = await testSupabaseConnection();
    setIsTestingCloud(false);
    setCloudTestResult(result);
    if (result.ok) {
      soundFX.playChime();
    } else {
      soundFX.playPop();
    }
  };

  // Save Supabase credentials and immediately sync current formData
  const handleSaveCloudCredentials = async () => {
    setSupabaseCredentials(supabaseUrl, supabaseAnonKey);
    const result = await testSupabaseConnection();
    setCloudTestResult(result);

    if (result.ok) {
      // Immediately push current formData to Supabase table
      setIsSaving(true);
      await updateCustomConfig(formData);
      setIsSaving(false);
      soundFX.playChime();
      alert("Supabase Cloud Connected! Your customizations have been uploaded and will now sync across all devices!");
    } else {
      soundFX.playPop();
      alert("Credentials saved, but connection test failed: " + (result.error || "Please verify URL and Anon Key."));
    }
  };

  // Disconnect Supabase (reverts to local storage only)
  const handleDisconnectCloud = () => {
    if (window.confirm("Disconnect Supabase cloud sync? Your website will switch back to local device storage.")) {
      setSupabaseCredentials('', '');
      setSupabaseUrl('');
      setSupabaseAnonKey('');
      setCloudTestResult(null);
      soundFX.playPop();
    }
  };

  // Copy SQL script to clipboard
  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopiedSql(true);
    soundFX.playChime();
    setTimeout(() => setCopiedSql(false), 2500);
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
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-lg font-bold leading-tight">Master Birthday Customizer Studio</h2>
                    {isSupabaseConfigured() ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/25 text-emerald-100 text-[10px] font-bold border border-emerald-300/40">
                        <Cloud className="w-2.5 h-2.5 text-emerald-200" /> Cloud Active
                      </span>
                    ) : (
                      <button
                        onClick={() => setActiveTab('cloudSync')}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/25 text-amber-100 text-[10px] font-bold border border-amber-300/40 hover:bg-amber-400/40 transition"
                        title="Connect Supabase for cross-device syncing"
                      >
                        <Cloud className="w-2.5 h-2.5 text-amber-200" /> Connect Cloud
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-pink-100 font-medium">Customize all 8 chapters, photos, letters, and audio in real-time</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-3.5 py-1.5 bg-white text-rose-600 rounded-xl text-xs font-bold hover:bg-pink-50 shadow-sm flex items-center gap-1 transition disabled:opacity-60"
                >
                  {isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{isSaving ? "Saving..." : "Save"}</span>
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
              <button
                onClick={() => setActiveTab('cloudSync')}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
                  activeTab === 'cloudSync' ? 'border-blue-500 text-blue-600 bg-white shadow-xs' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Cloud className="w-3.5 h-3.5 text-blue-500" /> Cloud Sync & Database
                {isSupabaseConfigured() ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                )}
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
                          className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Recipient Nickname / Pet Name</label>
                        <input
                          type="text"
                          value={formData.recipient.nickname}
                          onChange={(e) => setFormData({ ...formData, recipient: { ...formData.recipient, nickname: e.target.value } })}
                          className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Birthday Age / Milestone (e.g. 24 or 21st)</label>
                        <input
                          type="text"
                          value={formData.recipient.age}
                          onChange={(e) => setFormData({ ...formData, recipient: { ...formData.recipient, age: e.target.value } })}
                          className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                    <h3 className="font-serif font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4 text-purple-500" />
                      Sender Identity
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Your Name (Sender)</label>
                        <input
                          type="text"
                          value={formData.sender.name}
                          onChange={(e) => setFormData({ ...formData, sender: { ...formData.sender, name: e.target.value } })}
                          className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Your Nickname</label>
                        <input
                          type="text"
                          value={formData.sender.nickname}
                          onChange={(e) => setFormData({ ...formData, sender: { ...formData.sender, nickname: e.target.value } })}
                          className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Sign-off Phrase (e.g. Always & Forever,)</label>
                        <input
                          type="text"
                          value={formData.sender.signature}
                          onChange={(e) => setFormData({ ...formData, sender: { ...formData.sender, signature: e.target.value } })}
                          className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
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
                      <p className="text-xs text-gray-500">
                        {isSupabaseConfigured() 
                          ? "Photos are securely saved to your Supabase Cloud Storage and CDN." 
                          : "Upload photos from device or enter image URLs. Connect Supabase in Cloud Sync for permanent cross-device media!"}
                      </p>
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
                          <div className="w-24 h-24 rounded-xl overflow-hidden bg-white border-2 border-pink-200 shadow-sm flex-shrink-0 relative">
                            <img src={photo.image} alt={photo.title} className="w-full h-full object-cover" />
                            {uploadingPhotoIndex === idx && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-[9px] font-bold gap-1">
                                <Loader2 className="w-4 h-4 animate-spin text-pink-300" />
                                <span>Uploading...</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-2 w-full">
                            <div className="flex items-center gap-2">
                              {/* Direct File Upload Button */}
                              <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-bold hover:opacity-95 shadow-xs flex items-center gap-1.5 transition">
                                <Upload className="w-3.5 h-3.5" />
                                <span>{uploadingPhotoIndex === idx ? "Uploading..." : "Upload Image from Device"}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingPhotoIndex !== null}
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
                    <h3 className="font-serif font-bold text-gray-800 text-base">Chapter 4: The 5 Secret Open When Letters</h3>
                    <p className="text-xs text-gray-500">Customize the 5 envelopes she can unseal and read during her journey.</p>
                  </div>

                  <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                    {formData.secretEnvelopes.map((env, idx) => (
                      <div key={env.id || idx} className="p-4 bg-pink-50/40 rounded-2xl border border-pink-200 space-y-3">
                        <div className="flex items-center justify-between border-b border-pink-100 pb-1.5">
                          <span className="font-bold text-xs text-rose-600">Envelope #{idx + 1}: {env.title}</span>
                          <span className="text-xs text-gray-400 font-mono">Stamp: {env.stamp}</span>
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

                  {/* Friendship Timeline */}
                  <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-bold text-gray-800 text-base">Friendship Timeline Milestones</h3>
                      <button
                        type="button"
                        onClick={handleAddMilestone}
                        className="px-2.5 py-1 rounded-lg bg-purple-200 text-purple-800 text-xs font-bold hover:bg-purple-300 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Milestone
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.timeline.map((item, mIdx) => (
                        <div key={mIdx} className="p-3 bg-white rounded-xl border border-purple-200 space-y-2 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-purple-700">Milestone #{mIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteMilestone(mIdx)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              placeholder="Year (e.g. 2021)"
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
                            value={heart.note}
                            onChange={(e) => {
                              const updated = [...formData.secretHearts];
                              updated[hIdx].note = e.target.value;
                              setFormData({ ...formData, secretHearts: updated });
                            }}
                            className="w-full px-2.5 py-1 text-xs rounded-lg border border-pink-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: STICKERS & AESTHETIC */}
              {activeTab === 'stickers' && (
                <div className="space-y-4">
                  <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-4">
                    <h3 className="font-serif font-bold text-gray-800 text-base flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-500" />
                      Aesthetic Scrapbook Stickers & Badges
                    </h3>
                    <p className="text-xs text-gray-500">
                      Personalize every sticker from your scrapbook kit — 3D metallic foil balloons, 11:11 angel number, cutie pie badges, and Spotify music player cards.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          3D Metallic Foil Balloon Number (Age)
                        </label>
                        <input
                          type="number"
                          value={formData.stickers?.foilBalloonAge || 24}
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

              {/* TAB 10: AUDIO & BACKUP */}
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

              {/* TAB 11: CLOUD SYNC & DATABASE (CENTRALIZED CROSS-DEVICE PERSISTENCE) */}
              {activeTab === 'cloudSync' && (
                <div className="space-y-5">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-2xl border transition ${
                    isSupabaseConfigured()
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50/70 border-amber-200 text-amber-900'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl mt-0.5 ${
                        isSupabaseConfigured() ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        <Cloud className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-base">
                            {isSupabaseConfigured() ? "Supabase Cloud Database Connected ☁️✨" : "Local Device Mode (Laptop Only) ⚠️"}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isSupabaseConfigured() ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
                          }`}>
                            {isSupabaseConfigured() ? 'Cross-Device Live Sync' : 'Local Only'}
                          </span>
                        </div>
                        <p className="text-xs mt-1 leading-relaxed text-gray-600">
                          {isSupabaseConfigured()
                            ? "Your website is connected to Supabase! Any changes, photos, and letters you save from this laptop will instantly update and appear on your mobile phone and her phone in real-time."
                            : "Why does my mobile phone show the default template? Because changes are currently stored only inside this laptop's browser storage. Connect your free Supabase cloud database below to sync across all devices permanently!"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Supabase Credentials Form */}
                  <div className="p-5 bg-white rounded-2xl border border-blue-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-600" />
                        <h4 className="font-serif font-bold text-gray-800 text-sm">Supabase API Configuration</h4>
                      </div>
                      <a
                        href="https://supabase.com/dashboard"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
                      >
                        Open Supabase Dashboard <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Supabase Project URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://your-project-id.supabase.co"
                          value={supabaseUrl}
                          onChange={(e) => setSupabaseUrl(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-blue-200 bg-blue-50/15 font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Supabase Anon Public API Key
                        </label>
                        <input
                          type="password"
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                          value={supabaseAnonKey}
                          onChange={(e) => setSupabaseAnonKey(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-blue-200 bg-blue-50/15 font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>

                    {/* Connection Test Diagnostics Feedback */}
                    {cloudTestResult && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                          cloudTestResult.ok
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {cloudTestResult.ok ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-bold">
                            {cloudTestResult.ok ? 'Connection Successful! 🟢' : 'Connection Check Failed'}
                          </span>
                          <p className="mt-0.5 text-[11px]">
                            {cloudTestResult.ok
                              ? 'Successfully reached your Supabase birthday database. Live sync is active!'
                              : cloudTestResult.error}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleTestConnection}
                          disabled={isTestingCloud || !supabaseUrl || !supabaseAnonKey}
                          className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                        >
                          {isTestingCloud ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <RefreshCw className="w-3.5 h-3.5" />
                          )}
                          <span>{isTestingCloud ? "Testing..." : "Test Connection"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSaveCloudCredentials}
                          disabled={!supabaseUrl || !supabaseAnonKey}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs disabled:opacity-50"
                        >
                          <CloudUpload className="w-3.5 h-3.5" />
                          <span>Save & Connect Cloud</span>
                        </button>
                      </div>

                      {isSupabaseConfigured() && (
                        <button
                          type="button"
                          onClick={handleDisconnectCloud}
                          className="px-3 py-2 text-xs font-semibold text-gray-400 hover:text-red-500 transition"
                        >
                          Disconnect
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 60-Second Setup Guide */}
                  <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-gray-800 text-sm flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        Quick 60-Second Supabase Setup (100% Free)
                      </h4>
                      <button
                        type="button"
                        onClick={handleCopySql}
                        className="px-3 py-1.5 bg-white border border-purple-300 text-purple-700 rounded-xl text-xs font-bold hover:bg-purple-100 flex items-center gap-1.5 transition shadow-xs"
                      >
                        {copiedSql ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied SQL! ✅</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy SQL Setup Script</span>
                          </>
                        )}
                      </button>
                    </div>

                    <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside leading-relaxed">
                      <li>
                        Sign up for free at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-purple-700 font-bold underline">supabase.com</a> and click <strong>"New Project"</strong>.
                      </li>
                      <li>
                        In your Supabase project menu, click <strong>SQL Editor</strong>, click <strong>"New query"</strong>, paste the script (click the <em>"Copy SQL Setup Script"</em> button above), and click <strong>Run</strong>. This creates the table, realtime sync, and photo storage!
                      </li>
                      <li>
                        Go to <strong>Project Settings &gt; API</strong>, copy your <strong>Project URL</strong> and <strong>anon public key</strong>, and paste them in the inputs above, then click <strong>"Save & Connect Cloud"</strong>.
                      </li>
                      <li>
                        <strong>Optional (Permanent for Render):</strong> In your Render dashboard, under <strong>Environment Variables</strong>, add <code className="font-mono bg-purple-100 px-1 py-0.5 rounded text-[11px]">VITE_SUPABASE_URL</code> and <code className="font-mono bg-purple-100 px-1 py-0.5 rounded text-[11px]">VITE_SUPABASE_ANON_KEY</code>.
                      </li>
                    </ol>
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
                  disabled={isSaving}
                  className="px-6 py-2.5 text-xs font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white rounded-xl shadow-soft-pink hover:shadow-glow-pink flex items-center gap-1.5 transition active:scale-95 disabled:opacity-70"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving & Syncing...</span>
                    </>
                  ) : saveNotification ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-200" />
                      <span>{saveStatusText || "Saved & Applied! ✨"}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save All Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
