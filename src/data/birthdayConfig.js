/**
 * ==============================================================================
 * A THOUSAND LITTLE REASONS - BIRTHDAY CONFIGURATION
 * ==============================================================================
 * Easily customize the entire birthday surprise from this single file!
 * Update recipient name, memories, letters, gifts, secret surprises and photos.
 */

export const birthdayConfig = {
  // Recipient & Sender Identity
  recipient: {
    name: "Aaditi", // Recipient's first name
    nickname: "Aadu", // Cute nickname used in playful notes
    fullName: "Aaditi Sharma", // Full name (optional)
    birthDate: "November 9", // Birthday date
    birthYear: "2002",
    age: 24, // Optional
    title: "Chief Happiness Officer & Best Friend Forever",
  },
  
  sender: {
    name: "Your Best Friend",
    signature: "Always & Forever,",
  },

  // Audio / Music Experience
  audio: {
    title: "Romantic Birthday Melody ✨",
    artist: "A Little Universe Just For You",
    // Can be a local path in /music/birthday-song.mp3 or an online URL or use the built-in dream synth
    src: "/music/birthday-song.mp3",
    autoPlayPrompt: true,
  },

  // Aesthetic Stickers & Scrapbook Configuration
  stickers: {
    showStickers: true,
    angelNumberText: "11:11",
    birthdayGirlBadgeText: "Birthday Girl",
    cutiePieText: "cutie PIE",
    tornPaperText: "Happiness",
    memoriesBadgeText: "memories",
    foilBalloonAge: 24,
    spotifySongQuote: "Day by day, I'm fallin' more in love with our friendship",
    favoritePersonText: "favorite person",
  },

  // Page 1: The Secret Envelope
  envelope: {
    badge: "CONFIDENTIAL & SPECIAL",
    stampText: "SPECIAL DELIVERY",
    waxSealIcon: "heart",
    teaserText: "Hey, Someone Special! ✨",
    subTeaserText: "I have something for you. But this time, your birthday surprise isn't inside an ordinary gift box...",
    buttonText: "OPEN YOUR LITTLE SURPRISE 💌",
    hintText: "Click the seal to unfold the magic",
  },

  // Page 2: The Grand Birthday Entrance
  entrance: {
    celebrationHeadline: "HAPPY BIRTHDAY,",
    subtitle: "Today, the universe has one extra reason to smile.",
    sparkleMessage: "A journey of a thousand smiles begins with one tap.",
    buttonText: "LET'S BEGIN OUR LITTLE JOURNEY 🚀✨",
    balloonsCount: 12,
  },

  // Page 3: Our Little Universe – Photo Memories Scrapbook
  memoriesScrapbook: {
    title: "Our Little Universe",
    subtitle: "A digital scrapbook of moments, giggles, chaos, and pure joy.",
    categoryTabs: [
      { id: "all", label: "All Memories" },
      { id: "favourites", label: "Our Favourite Moments" },
      { id: "crazy", label: "Crazy Memories" },
      { id: "unforgettable", label: "Unforgettable Days" },
      { id: "smiles", label: "Little Things That Make Us Smile" },
    ],
    photos: [
      {
        id: 1,
        title: "The Laugh We Couldn't Stop",
        category: "favourites",
        date: "Summer Afternoon",
        caption: "Remember when we laughed so hard our stomachs ached and tears streamed down our faces? Pure gold.",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
        tapeColor: "from-pink-300 to-rose-300",
        rotation: "-rotate-2",
        sticker: "🌸",
      },
      {
        id: 2,
        title: "Spontaneous Adventures",
        category: "crazy",
        date: "Midnight Escapade",
        caption: "No plan, wrong turns, loud music, and the best conversations we've ever had under the stars.",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        tapeColor: "from-purple-300 to-pink-300",
        rotation: "rotate-3",
        sticker: "✨",
      },
      {
        id: 3,
        title: "Golden Hour Glow",
        category: "unforgettable",
        date: "That Golden Evening",
        caption: "The sunlight was perfect, but honestly your genuine smile outshone everything else around.",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        tapeColor: "from-amber-200 to-rose-200",
        rotation: "-rotate-1",
        sticker: "💖",
      },
      {
        id: 4,
        title: "Coffee & Chaos",
        category: "smiles",
        date: "Every Single Weekend",
        caption: "Three hours of ordering coffee and solving every world crisis before getting distracted by dessert.",
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
        tapeColor: "from-rose-200 to-peach-200",
        rotation: "rotate-2",
        sticker: "☕",
      },
      {
        id: 5,
        title: "Partners in Crime",
        category: "crazy",
        date: "The Day of Bad Decisions",
        caption: "When someone says 'let's do something sensible', we both know neither of us is listening.",
        image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
        tapeColor: "from-pink-300 to-lavender-300",
        rotation: "-rotate-3",
        sticker: "🎀",
      },
      {
        id: 6,
        title: "Sunset Whispers",
        category: "favourites",
        date: "Beach Breeze Day",
        caption: "Sitting side by side watching the sky paint itself in pastel shades, talking about dreams we will achieve.",
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
        tapeColor: "from-peach-200 to-pink-300",
        rotation: "rotate-1",
        sticker: "🌅",
      },
      {
        id: 7,
        title: "Silly Faces & Pure Joy",
        category: "smiles",
        date: "Photo Booth Take #47",
        caption: "We took 50 photos, 49 were completely goofy, and this is the one that shows how fun we are.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
        tapeColor: "from-lavender-200 to-pink-200",
        rotation: "-rotate-2",
        sticker: "🧸",
      },
      {
        id: 8,
        title: "The Unforgettable Celebration",
        category: "unforgettable",
        date: "Last Year's Bash",
        caption: "Every time we celebrate you, the room becomes warmer, brighter, and full of genuine laughter.",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        tapeColor: "from-rose-300 to-amber-200",
        rotation: "rotate-2",
        sticker: "🎂",
      },
    ],
  },

  // Page 4: Things I Never Told You (Secret Envelopes)
  secretEnvelopes: [
    {
      id: "envelope-1",
      title: "Something I Appreciate About You",
      color: "bg-gradient-to-br from-pink-100 to-rose-200 border-pink-300",
      accent: "text-rose-600",
      icon: "Heart",
      stamp: "THANK YOU",
      letterPreview: "You might never notice this, but whenever you walk into a room...",
      fullLetter: `You might never notice this, but whenever you enter a room or send a message on a dull day, the entire energy shifts. You have this rare, quiet superpower of making people feel valued without even trying. Thank you for always listening to my longest rants with patient kindness and never judging my silliest thoughts.`,
    },
    {
      id: "envelope-2",
      title: "A Memory I Will Never Forget",
      color: "bg-gradient-to-br from-lavender-100 to-purple-200 border-purple-300",
      accent: "text-purple-600",
      icon: "Sparkles",
      stamp: "MEMORIES",
      letterPreview: "Do you remember that evening when everything went completely off schedule...",
      fullLetter: `Do you remember that evening when everything went completely off schedule? It was raining, our plans fell apart, and we ended up sitting on the curb sharing snacks and laughing until we couldn't breathe. That was the moment I realized friendship isn't about grand plans; it's about the company that makes the worst plans feel like magic.`,
    },
    {
      id: "envelope-3",
      title: "Why You Are So Irreplaceable",
      color: "bg-gradient-to-br from-peach-100 to-pink-200 border-pink-300",
      accent: "text-pink-600",
      icon: "Star",
      stamp: "ONE & ONLY",
      letterPreview: "In a world where everyone wears masks, you stay genuine...",
      fullLetter: `In a world where everyone wears masks, you stay effortlessly genuine. You are brave when things get rough, compassionate when someone is down, and fiercely loyal to the people you love. Having you in my corner is one of life's greatest gifts. There really isn't anyone else like you.`,
    },
    {
      id: "envelope-4",
      title: "Something I Have Always Wanted to Say",
      color: "bg-gradient-to-br from-amber-50 to-rose-100 border-rose-300",
      accent: "text-rose-500",
      icon: "Bookmark",
      stamp: "CONFESSION",
      letterPreview: "I don't say this out loud often enough, but...",
      fullLetter: `I don't say this out loud often enough, but I am endlessly proud of you. I see how hard you try, how gently you love, and how much grace you carry even when things are heavy. Never underestimate the impact you have on the people around you. You matter deeply.`,
    },
    {
      id: "envelope-5",
      title: "One Thing I Never Want to Change",
      color: "bg-gradient-to-br from-rose-100 to-lavender-100 border-lavender-300",
      accent: "text-purple-600",
      icon: "Infinity",
      stamp: "FOREVER",
      letterPreview: "Years may pass, seasons will shift, but I promise you this...",
      fullLetter: `Years may pass, hair may turn grey, and seasons will shift, but I promise that our silly inside jokes, midnight calls, and comfortable silences will remain untouched. No matter where life takes us, you will always have a sanctuary in our friendship. Always.`,
    },
  ],

  // Page 5: Mystery Gift Collection & Scratch Card
  mysteryGifts: [
    {
      id: "gift-1",
      boxTitle: "A Tiny Box of Pure Happiness",
      ribbonColor: "bg-rose-400",
      boxBg: "bg-gradient-to-br from-pink-200 to-rose-300",
      lidBg: "bg-rose-300",
      surpriseType: "quote",
      surpriseTitle: "Daily Dose of Joy ✨",
      content: "May this year bring you the kind of happiness that makes your heart feel light, your coffee taste sweeter, and your dreams feel closer than ever before!",
      sticker: "🌸",
    },
    {
      id: "gift-2",
      boxTitle: "A Box of Unforgettable Memories",
      ribbonColor: "bg-purple-400",
      boxBg: "bg-gradient-to-br from-purple-200 to-lavender-300",
      lidBg: "bg-purple-300",
      surpriseType: "memory",
      surpriseTitle: "Our Golden Ticket 🎟️",
      content: "Valid for: One spontaneous weekend getaway, endless dessert runs, zero guilt, and 100% unconditional friendship support whenever needed!",
      sticker: "✈️",
    },
    {
      id: "gift-3",
      boxTitle: "A Box of Friendship Promises",
      ribbonColor: "bg-amber-400",
      boxBg: "bg-gradient-to-br from-amber-100 to-peach-200",
      lidBg: "bg-amber-200",
      surpriseType: "promise",
      surpriseTitle: "My Triple Pinky Swear 🤙",
      content: "1. I will always answer when you need to vent.\n2. I will always take 50 photos till we get the perfect angle.\n3. I will always celebrate your wins louder than anyone else!",
      sticker: "💖",
    },
    {
      id: "gift-4",
      boxTitle: "A Box of Unlimited Smiles",
      ribbonColor: "bg-pink-400",
      boxBg: "bg-gradient-to-br from-pink-100 to-blush-200",
      lidBg: "bg-pink-300",
      surpriseType: "scratchCard",
      surpriseTitle: "Secret Scratch & Win! 🎁",
      content: "Scratch the magical card below to reveal your secret mystery surprise!",
      sticker: "🎉",
    },
  ],

  // Interactive Scratch Card data inside Page 5
  scratchCard: {
    title: "Golden Birthday Surprise Ticket",
    subtitle: "Rub or swipe your finger/mouse across the shimmering surface to uncover your hidden wish!",
    hiddenMessage: "🌟 SECRET WISH UNLOCKED 🌟\n\nYou are entitled to 365 days of good fortune, radiant health, big belly laughs, and a free birthday dinner of your choice on me! Happy Birthday, superstar!",
    scratchCoverColor: "#D4AF37", // Rose gold / gold metallic
    completionThreshold: 55, // Percentage scratched to reveal
  },

  // Page 6: The Birthday Cake Experience
  cake: {
    tagline: "Time to make a wish come true!",
    instructionWish: "Step 1: Close your eyes and make a special secret wish in your heart...",
    instructionLight: "Step 2: Tap the candles to light them up with birthday warmth 🕯️",
    instructionBlow: "Step 3: Blow out the candles using the magic button (or your microphone)! 🎂💨",
    blewMessage: "YAY! YOUR WISH HAS BEEN SENT TO THE STARS! 🌟✨",
    subBlewMessage: "Close your eyes, make a beautiful wish, and remember that you deserve every wonderful thing in this world.",
    candlesCount: 5,
  },

  // Page 7: The Letter From My Heart
  letter: {
    header: "A Letter Written With Love & Warmth",
    dateText: "On Your Special Birthday",
    salutation: "Dearest Aaditi,",
    paragraphs: [
      "I don't know whether I can ever put into words how truly special you are to me. But today, on your birthday, I wanted to create something that says what ordinary text messages never could.",
      "Some people enter our lives quietly and make ordinary days feel extraordinary. You are one of those rare people. Through every season, through every high and low, your genuine kindness and radiant laughter have been my favourite constant.",
      "Thank you for being my sounding board, my partner in laughter, the keeper of all our inside jokes, and the truest friend anyone could ever dream of having in their universe.",
      "As you step into another chapter of your life, my only prayer is that the universe treats you as gently and generously as you treat everyone around you. May your days be filled with warm sunshine, endless reasons to smile, quiet peace in your heart, and gigantic victories in everything you touch.",
      "No matter how many birthdays come and go, you will always have my unwavering love, support, and loudest cheers from the sidelines.",
    ],
    closing: "Forever & Always Your Best Friend,",
    signature: "Alex ✨",
    postscript: "P.S. Yes, I really spent hours building this little digital universe just to make you smile today!",
  },

  // Page 8: The Final Surprise – Forever My Favourite Person
  finalCelebration: {
    heroGreeting: "HAPPY BIRTHDAY, AADITI! 🎆💖",
    favouriteQuote: "Of all the beautiful things life has given me, your friendship is one of my favourites.",
    emotionalEnding: "This little website will end here, but the memories we create together never will.",
    promiseBadge: "FRIENDSHIP PROMISE: LIFETIME VALIDITY",
    replayButtonText: "REPLAY OUR LITTLE UNIVERSE 🔄",
    shareMessage: "Share a snapshot of this little universe with me!",
  },

  // Additional Feature: Memory Timeline
  timeline: [
    {
      year: "Year 1",
      date: "The Day We First Met",
      title: "Where The Magic Began",
      description: "Two strangers who had no idea they were about to become inseparable friends for life.",
      badge: "The Beginning",
      icon: "Compass",
    },
    {
      year: "Year 2",
      date: "The 3 AM Phone Call",
      title: "From Friends to Family",
      description: "When we realized we could talk for four hours about absolutely nothing and feel completely understood.",
      badge: "Deep Bond",
      icon: "PhoneCall",
    },
    {
      year: "Year 3",
      date: "Our Legendary Road Trip",
      title: "Adventures Unlocked",
      description: "Windows down, singing songs at the top of our lungs, and discovering secret roadside viewpoints.",
      badge: "Pure Freedom",
      icon: "Car",
    },
    {
      year: "Year 4",
      date: "Weathering The Storms",
      title: "Always In Your Corner",
      description: "The moments that proved our friendship isn't just for sunshine, but built to weather any storm.",
      badge: "Unbreakable",
      icon: "HeartHandshake",
    },
    {
      year: "Today",
      date: "Your Special Birthday",
      title: "A Thousand Reasons to Celebrate You",
      description: "Celebrating the wonderful human being you are today, and all the magical years still waiting ahead.",
      badge: "Happy Birthday",
      icon: "PartyPopper",
    },
  ],

  // Secret Heart Easter Eggs (Found on pages 2, 4, 6, 8)
  secretHearts: [
    {
      id: "sh-1",
      page: 2,
      hint: "Hiding among the birthday balloons...",
      message: "Secret Note #1: You have a smile that can instantly brighten anyone's darkest cloudy day. Never lose it! ✨",
    },
    {
      id: "sh-2",
      page: 4,
      hint: "Hiding near the wax stamps...",
      message: "Secret Note #2: If I could give you one gift for your birthday, it would be the ability to see yourself through my eyes. You would see how truly magnificent you are! 💖",
    },
    {
      id: "sh-3",
      page: 6,
      hint: "Hiding behind the cake flowers...",
      message: "Secret Note #3: Every candle on this cake represents a thousand wishes for your happiness that will come true! 🎂",
    },
    {
      id: "sh-4",
      page: 8,
      hint: "Hiding in the sparkling fireworks...",
      message: "Secret Note #4: You unlocked all the secret hearts! You are officially the greatest best friend in the entire galaxy! 🏆🌟",
    },
  ],
};
