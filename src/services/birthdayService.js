import { getSupabase, isSupabaseConfigured } from './supabase';
import { birthdayConfig } from '../data/birthdayConfig';

const DEFAULT_EXPERIENCE_ID = 'default';
const BUCKET_NAME = 'birthday-media';

/**
 * Deep merge helper to ensure user config retains all expected schema fields
 */
const mergeWithDefaults = (cloudConfig) => {
  if (!cloudConfig || typeof cloudConfig !== 'object') return birthdayConfig;
  return {
    ...birthdayConfig,
    ...cloudConfig,
    recipient: { ...birthdayConfig.recipient, ...(cloudConfig.recipient || {}) },
    sender: { ...birthdayConfig.sender, ...(cloudConfig.sender || {}) },
    envelope: { ...birthdayConfig.envelope, ...(cloudConfig.envelope || {}) },
    entrance: { ...birthdayConfig.entrance, ...(cloudConfig.entrance || {}) },
    memoriesScrapbook: {
      ...birthdayConfig.memoriesScrapbook,
      ...(cloudConfig.memoriesScrapbook || {}),
      photos: Array.isArray(cloudConfig.memoriesScrapbook?.photos) && cloudConfig.memoriesScrapbook.photos.length > 0
        ? cloudConfig.memoriesScrapbook.photos
        : birthdayConfig.memoriesScrapbook.photos,
    },
    secretEnvelopes: Array.isArray(cloudConfig.secretEnvelopes) && cloudConfig.secretEnvelopes.length > 0
      ? cloudConfig.secretEnvelopes
      : birthdayConfig.secretEnvelopes,
    mysteryGifts: Array.isArray(cloudConfig.mysteryGifts) && cloudConfig.mysteryGifts.length > 0
      ? cloudConfig.mysteryGifts
      : birthdayConfig.mysteryGifts,
    scratchCard: { ...birthdayConfig.scratchCard, ...(cloudConfig.scratchCard || {}) },
    cake: { ...birthdayConfig.cake, ...(cloudConfig.cake || {}) },
    letter: {
      ...birthdayConfig.letter,
      ...(cloudConfig.letter || {}),
      paragraphs: Array.isArray(cloudConfig.letter?.paragraphs) && cloudConfig.letter.paragraphs.length > 0
        ? cloudConfig.letter.paragraphs
        : birthdayConfig.letter.paragraphs,
    },
    timeline: Array.isArray(cloudConfig.timeline) && cloudConfig.timeline.length > 0
      ? cloudConfig.timeline
      : birthdayConfig.timeline,
    finalCelebration: { ...birthdayConfig.finalCelebration, ...(cloudConfig.finalCelebration || {}) },
    stickers: { ...birthdayConfig.stickers, ...(cloudConfig.stickers || {}) },
    audio: { ...birthdayConfig.audio, ...(cloudConfig.audio || {}) },
    secretHearts: Array.isArray(cloudConfig.secretHearts) && cloudConfig.secretHearts.length > 0
      ? cloudConfig.secretHearts
      : birthdayConfig.secretHearts,
  };
};

/**
 * Fetches the birthday configuration with precedence:
 * Cloud Database -> Local Storage Cache -> Default Template
 */
export const fetchBirthdayConfig = async (experienceId = DEFAULT_EXPERIENCE_ID) => {
  const client = getSupabase();

  if (client) {
    try {
      const { data, error } = await client
        .from('birthday_experiences')
        .select('config, updated_at')
        .eq('id', experienceId)
        .maybeSingle();

      if (!error && data && data.config) {
        const merged = mergeWithDefaults(data.config);
        // Cache to local storage for offline resiliency
        try {
          localStorage.setItem('birthday_custom_config', JSON.stringify(merged));
        } catch (e) {
          console.warn('Could not cache cloud config locally:', e);
        }
        return {
          config: merged,
          source: 'cloud',
          updatedAt: data.updated_at,
          ok: true,
        };
      } else if (error) {
        console.warn('Supabase fetch error, falling back to cache:', error.message);
      }
    } catch (err) {
      console.warn('Failed to query Supabase cloud database:', err);
    }
  }

  // Fallback: Local Storage cache
  try {
    const saved = localStorage.getItem('birthday_custom_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        config: mergeWithDefaults(parsed),
        source: 'local_cache',
        ok: true,
      };
    }
  } catch (e) {
    console.warn('Error reading local storage cache:', e);
  }

  // Final Fallback: Default template
  return {
    config: birthdayConfig,
    source: 'default',
    ok: true,
  };
};

/**
 * Saves the birthday configuration to Cloud Database & Local Storage
 */
export const saveBirthdayConfig = async (newConfig, experienceId = DEFAULT_EXPERIENCE_ID) => {
  // 1. Always save to local storage as instant local cache
  try {
    localStorage.setItem('birthday_custom_config', JSON.stringify(newConfig));
  } catch (e) {
    console.warn('Local storage write warning:', e);
  }

  const client = getSupabase();

  if (!client) {
    return {
      ok: true,
      savedToCloud: false,
      savedLocally: true,
      message: 'Saved to local device cache. Connect Supabase to sync across all devices!',
    };
  }

  try {
    const payload = {
      id: experienceId,
      config: newConfig,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await client
      .from('birthday_experiences')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('Supabase save error:', error);
      return {
        ok: false,
        savedToCloud: false,
        savedLocally: true,
        error: error.message,
      };
    }

    return {
      ok: true,
      savedToCloud: true,
      savedLocally: true,
      message: 'Successfully saved and synced to the cloud across all devices! ☁️✨',
    };
  } catch (err) {
    console.error('Unexpected error saving to Supabase:', err);
    return {
      ok: false,
      savedToCloud: false,
      savedLocally: true,
      error: err.message || 'Network error saving to cloud.',
    };
  }
};

/**
 * Uploads a photograph to Supabase Storage ('birthday-media')
 * and returns the public CDN URL.
 */
export const uploadPhotoToStorage = async (file) => {
  if (!file) throw new Error('No file provided');

  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image (JPG, PNG, WebP)');
  }

  if (file.size > 15 * 1024 * 1024) {
    throw new Error('Image must be under 15MB');
  }

  const client = getSupabase();

  if (!client) {
    throw new Error('Supabase is not configured. Please set up Supabase in the Cloud Sync tab.');
  }

  // Create clean, unique filename
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
  const filePath = `photos/${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${cleanName}`;

  const { data, error } = await client.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    // If bucket does not exist
    if (error.message?.includes('bucket not found') || error.error === 'Bucket not found') {
      throw new Error(`Storage bucket "${BUCKET_NAME}" does not exist in your Supabase project. Please create it or run the SQL setup script.`);
    }
    throw new Error(error.message);
  }

  // Retrieve public URL
  const { data: urlData } = client.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    ok: true,
    path: filePath,
    publicUrl: urlData.publicUrl,
  };
};

/**
 * Real-time listener: Syncs changes across open devices in real time
 */
export const subscribeToBirthdayConfig = (experienceId = DEFAULT_EXPERIENCE_ID, onUpdate) => {
  const client = getSupabase();
  if (!client) return () => {};

  try {
    const channel = client
      .channel(`realtime_birthday_${experienceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'birthday_experiences',
          filter: `id=eq.${experienceId}`,
        },
        (payload) => {
          if (payload.new && payload.new.config) {
            const merged = mergeWithDefaults(payload.new.config);
            try {
              localStorage.setItem('birthday_custom_config', JSON.stringify(merged));
            } catch (e) {}
            if (onUpdate) onUpdate(merged);
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Realtime subscription error:', err);
    return () => {};
  }
};

