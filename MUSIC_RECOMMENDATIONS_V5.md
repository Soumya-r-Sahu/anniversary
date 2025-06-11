# 🎵 Anniversary Website v5.0.0 - Page-Specific Music Recommendations

## 📁 Suggested Directory Structure

```
public/assets/music/
├── main/                          # Main/general songs
├── anniversary/                   # Anniversary celebration
├── countdown/                     # Countdown page
├── love-story/                    # Love story timeline
├── games/                         # Interactive games
├── surprises/                     # Surprise unlocks
├── photo-gallery/                 # Photo memories
├── music-playlist/                # Music player page
├── love-letters/                  # Love letters reading
├── memory-book/                   # Memory book browsing
├── special-dates/                 # Important dates
├── future-plans/                  # Dreams and plans
├── challenges/                    # Relationship challenges
├── wish-list/                     # Bucket list items
└── fireworks/                     # Celebration moments
```

---

## 🎤 **HINDI SONGS BY PAGE THEME**

### 🎉 **Anniversary Page**
**Theme:** Celebration, Joy, Love Milestones

**Bollywood Hits:**
- **Tum Hi Ho** - Arijit Singh (Aashiqui 2)
- **Jeene Laga Hoon** - Atif Aslam & Shreya Ghoshal
- **Sunn Raha Hai** - Ankit Tiwari
- **Bolna** - Arijit Singh & Asees Kaur
- **Ae Dil Hai Mushkil** - Arijit Singh
- **Raabta** - Arijit Singh (Agent Vinod)
- **Tere Sang Yaara** - Atif Aslam
- **Mann Mera** - Gajendra Verma

**Classic Romantic:**
- **Tujhe Dekha To** - Kumar Sanu & Lata Mangeshkar
- **Dil To Pagal Hai** - Lata Mangeshkar & Udit Narayan
- **Kuch Kuch Hota Hai** - Kumar Sanu & Alka Yagnik

### ⏰ **Countdown Page**
**Theme:** Anticipation, Excitement, Building Romance

**Energetic & Romantic:**
- **Galliyan** - Ankit Tiwari
- **Sooraj Dooba Hain** - Arijit Singh & Aditi Singh Sharma
- **Ishq Wala Love** - Salim Merchant & Shreya Ghoshal
- **Nagada Sang Dhol** - Shreya Ghoshal & Osman Mir
- **Radha** - Shreya Ghoshal & Udit Narayan
- **Ainvayi Ainvayi** - Rahat Fateh Ali Khan

### 📖 **Love Story Page**
**Theme:** Journey, Memories, Timeline

**Storytelling Songs:**
- **Kahaani Suno** - Kaifi Khalil (Already have!)
- **Tera Ban Jaunga** - Akhil Sachdeva & Tulsi Kumar
- **Kabira** - Tochi Raina & Rekha Bhardwaj
- **Samjhawan** - Rahat Fateh Ali Khan & Shreya Ghoshal
- **Humsafar** - Akhil Sachdeva
- **Khamoshiyan** - Arijit Singh
- **Muskurane** - Arijit Singh

### 🎮 **Games Page**
**Theme:** Playful, Fun, Upbeat

**Fun & Energetic:**
- **Nagada Sang Dhol** - Shreya Ghoshal
- **Saturday Saturday** - Indeep Bakshi & Badshah
- **Abhi Toh Party Shuru Hui Hai** - Badshah
- **Tune Maari Entriyaan** - Nakash Aziz & Others
- **Baby Ko Bass Pasand Hai** - Vishal Dadlani & Others
- **Kar Gayi Chull** - Badshah & Fazilpuria

### 🎁 **Surprises Page**
**Theme:** Mystery, Wonder, Magical Moments

**Mystical & Romantic:**
- **Hawayein** - Arijit Singh
- **Channa Mereya** - Arijit Singh
- **Bulleya** - Amit Mishra & Shilpa Rao
- **Janam Janam** - Arijit Singh & Antara Mitra
- **Gerua** - Arijit Singh & Antara Mitra
- **Manma Emotion Jaage** - Amit Mishra & Others

### 📸 **Photo Gallery**
**Theme:** Nostalgia, Sweet Memories

**Nostalgic & Sweet:**
- **Dil Diyan Gallan** - Atif Aslam
- **Ik Vaari Aa** - Arijit Singh
- **Zara Sa** - KK & Shreya Ghoshal
- **Yeh Dooriyan** - Mohit Chauhan
- **Phir Mohabbat** - Arijit Singh & Mohammed Irfan
- **Pee Loon** - Mohit Chauhan

---

## 🎵 **ODIA SONGS RECOMMENDATIONS**

### 🎶 **Traditional Odia Romantic:**
- **Mo Priya Heba** - Abhijit Majumdar
- **Bhala Laguchi** - Kumar Bapi
- **Tora Prema Re** - Udit Narayan
- **Milana Sagara** - Sricharan Mohanty
- **To Akhi Mo Aaina** - Abhijit Majumdar
- **Rangabati** - Jitendra Haripal (Folk classic)

### 🎤 **Modern Odia Love Songs:**
- **Mo Man Bhamara** - Humane Sagar
- **Prema Adhara** - Ananya Sritam Nanda
- **Tu Mo Love Story** - Ananya Sritam Nanda & Humane Sagar
- **Laila O Laila** - Humane Sagar
- **Chanda Mama** - Shasank Sekhar
- **Balunga Kete Katha** - Humane Sagar

### 🌅 **Classical Odia:**
- **Jaya Jagannatha** - Traditional
- **Mo Kanthe Basichhi** - Akshaya Mohanty
- **Emiti Bela Gala** - Prafulla Kar
- **Ei Je Dunia** - Akshaya Mohanty

---

## 📱 **MUSIC PLAYER INTEGRATION SUGGESTIONS**

### 🎵 **Main Playlist Structure:**
```javascript
const pageSpecificPlaylists = {
    anniversary: [
        'tum-hi-ho.m4a',
        'jeene-laga-hoon.m4a',
        'sunn-raha-hai.m4a'
    ],
    countdown: [
        'galliyan.m4a',
        'sooraj-dooba-hain.m4a',
        'ishq-wala-love.m4a'
    ],
    loveStory: [
        'kahaani-suno.m4a',
        'tera-ban-jaunga.m4a',
        'kabira.m4a'
    ],
    games: [
        'nagada-sang-dhol.m4a',
        'saturday-saturday.m4a',
        'tune-maari-entriyaan.m4a'
    ],
    odia: [
        'mo-priya-heba.m4a',
        'bhala-laguchi.m4a',
        'to-akhi-mo-aaina.m4a'
    ]
};
```

### 🔄 **Auto-Switch Feature:**
- Automatically switch playlists based on current page
- Smooth transitions between songs
- Volume control and fade effects
- Mood-based recommendations

### 🎚️ **Advanced Features:**
- **Mood Selector:** Happy, Romantic, Nostalgic, Playful
- **Language Toggle:** Hindi/Odia/Mixed
- **Time-based:** Morning/Evening/Night themes
- **Occasion:** First meeting, Engagement, Wedding anniversary
- **Activity:** Dancing, Reading, Gaming, Browsing photos

---

## 📁 **Implementation Steps:**

1. **Create Directory Structure:**
   ```bash
   mkdir -p public/assets/music/{anniversary,countdown,love-story,games,surprises,photo-gallery,odia}
   ```

2. **Organize Current Songs:**
   - Move existing songs to appropriate directories
   - Rename for better organization

3. **Add New Songs:**
   - Download suggested Hindi/Odia songs
   - Convert to .m4a format for consistency
   - Follow naming convention: `01-song-name.m4a`

4. **Update Music Player:**
   - Add page detection
   - Implement playlist switching
   - Add Odia language support

Would you like me to create the directory structure and implement the page-specific music player system?
