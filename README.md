# A THOUSAND LITTLE REASONS ✨
> *"A little universe created just for you."*

A digital scrapbook, interactive storybook, photo memory album, and emotional surprise celebration created for your best friend's birthday.

---

## 🌟 The 8 Interactive Chapters

1. **Chapter 1: The Secret Envelope** – A 3D postal envelope with an authentic wax seal, air-mail stamp, personalized name tag, and unfolding letter accompanied by a confetti and heart burst.
2. **Chapter 2: The Grand Birthday Entrance** – Floating rising balloons, celebratory countdown, glowing typography, and instant soundtrack toggle. Includes *Secret Heart Easter Egg #1*.
3. **Chapter 3: Our Little Universe (Photo Scrapbook)** – Authentic Polaroid photo cards pinned with washi tape, 5 category filters, and a full-screen interactive lightbox with memory dates and captions.
4. **Chapter 4: Things I Never Told You** – 5 sealed vintage letters that reveal handwritten heartfelt confessions on nostalgic notebook paper. Includes *Secret Heart Easter Egg #2*.
5. **Chapter 5: The Mystery Gift Collection & Scratch Card** – 4 spring-animated gift boxes with perks, promises, and quotes, plus an interactive HTML5 Canvas **Scratch Card** with real-time scratching physics (touch + mouse).
6. **Chapter 6: The Birthday Cake Experience** – A 3-tier birthday cake with flickering candles, tap-to-light, candle blowing via on-screen button OR real-time microphone breath-detection, and wish-granted celebration. Includes *Secret Heart Easter Egg #3*.
7. **Chapter 7: The Letter From My Heart & Memory Timeline** – Elegant stationery parchment with progressive paragraph reveal and an interactive vertical Friendship Milestones Timeline.
8. **Chapter 8: The Final Surprise (Forever My Favourite Person)** – Continuous real-time canvas fireworks, glowing typography, mini polaroid collage, Lifetime Friendship Certificate, unlock stats, and experience replay loop. Includes *Secret Heart Easter Egg #4*.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 2. Run Locally
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
```
The optimized static build will be generated in the `dist/` directory.

---

## 🎨 How to Personalize Content

### Method 1: The Master Config File (`src/data/birthdayConfig.js`)
All personalized content is centralized in [src/data/birthdayConfig.js](file:///c:/Users/vspat/OneDrive/Desktop%20-%20Copy/Desktop/birthday/src/data/birthdayConfig.js). You can edit:
- **Recipient's Name & Nickname**: Change `"Aaditi"` to your friend's name.
- **Birthday Date & Year**: Change to her birth date.
- **Sender's Name & Signature**: Change `"Alex"` to your name.
- **Photos & Captions**: Replace URLs with links or local paths like `"/images/photo1.jpg"`.
- **Letters & Confessions**: Customize each secret note and the heart letter.
- **Friendship Milestones Timeline**: Add your own years and memories.
- **Mystery Gifts & Scratch Card Message**: Customize the prize and promises.

### Method 2: Live In-Browser Customizer Drawer (Password Protected)
Click the **pencil/lock icon (✏️🔒)** in the top right of the navigation header on any page to open the live customizer!
- **Creator Passcode**: `Vishu@0303`
- Enter `Vishu@0303` to unlock full creator access.
- You can edit:
  1. **Recipient & Sender Details**: Names, nicknames, birth date, title, signature.
  2. **Chapters 1 & 2**: Opening envelopes, headlines, subtitles, buttons.
  3. **Chapter 3 Photos**: Add/delete photos, edit captions, and **upload photos directly from your device** (converts images automatically without editing code!).
  4. **Chapter 4 Secret Envelopes**: All 5 handwritten letters and wax stamps.
  5. **Chapter 5 Mystery Gifts & Scratch Ticket**: Custom gift box surprises and the secret scratch reveal message.
  6. **Chapter 6 Birthday Cake**: Number of candles, wishes, and blow messages.
  7. **Chapter 7 Heartfelt Letter & Milestones**: Add/edit letter paragraphs, add/edit friendship milestone timeline cards.
  8. **Chapter 8 Grand Finale & 4 Secret Heart Easter Eggs**: Finale quote, certificate, and secret whispered notes.
  9. **Backup & Audio**: Export your customizations as a JSON backup file or import a saved config.
- Click **"Save All Changes"** and everything updates live instantly!

---

## 📸 Adding Your Real Photos & Music

### Photos
1. Place your pictures in the `public/images/` folder (e.g. `pic1.jpg`, `pic2.jpg`).
2. In `src/data/birthdayConfig.js`, set `image: "/images/pic1.jpg"` for each photo card.

### Music
1. Place your MP3 file in `public/music/` and name it `birthday-song.mp3` (or update `src/data/birthdayConfig.js`).
2. **Built-in Fallback**: If you do not provide an MP3, the website automatically plays an acoustic celesta dream melody using the Web Audio API, so music will ALWAYS work out of the box!

---

## 🌐 Free 1-Minute Deployment (Vercel / Netlify)

### Deploy to Vercel (Recommended)
1. Push this folder to a GitHub repository (or use the Vercel CLI).
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your GitHub repository.
4. Framework Preset: **Vite** (detected automatically).
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**! You will receive a private `.vercel.app` link to share with your best friend.

### Deploy to Netlify
1. Drag and drop the `dist/` folder directly into [app.netlify.com/drop](https://app.netlify.com/drop), or connect via GitHub.
2. Build command: `npm run build`
3. Publish directory: `dist`

---

## ✅ Final Quality & Testing Checklist

- [x] Responsive layout tested on desktop, tablet, and smartphone screen sizes.
- [x] Smooth Framer Motion transitions between all 8 chapters.
- [x] 3D Envelope opens smoothly on wax seal tap.
- [x] Photo Scrapbook displays Polaroid cards, category filters, and full-screen lightbox.
- [x] Secret letters open individual handwritten notes on lined stationery.
- [x] Gift boxes pop open with spring animation and reveal unique surprises.
- [x] Scratch card supports both mouse drag and touch swipe with automatic completion reveal.
- [x] Birthday cake candles light up and extinguish with both on-screen button and optional microphone breath-detection.
- [x] Heartfelt letter features progressive reading reveal and milestone timeline.
- [x] Finale triggers continuous canvas fireworks, friendship certificate, and replay loop.
- [x] Music player supports play/pause, volume control, and acoustic celesta synthesizer fallback.
- [x] All 4 Secret Heart easter eggs function and update discovery progress.
- [x] Anti-Inspect & Security Protection: Right-click context menu, F12, Ctrl+Shift+I/J/C, Ctrl+U, and image dragging are disabled to preserve surprise privacy.
- [x] Production build passes cleanly with zero errors (`npm run build`).

