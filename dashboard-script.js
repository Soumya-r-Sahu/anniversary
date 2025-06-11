/**
 * Anniversary Website Music Dashboard v5.0.0
 * Advanced Music Management System for Localhost
 */

class MusicDashboard {
    constructor() {
        this.musicLibrary = new Map();
        this.activityLog = [];
        this.currentFilter = 'all';
        this.isUploading = false;
        this.tempImageData = null;
        this.previewAudio = null;
        this.currentlyPreviewing = null;
        
        this.initializeDashboard();
        this.setupEventListeners();
        this.loadMusicLibrary();
        this.initializeAudioPreview();
        this.initializeSearch();
    }

    initializeDashboard() {
        this.log('🎵 Dashboard v5.0.0 initialized');
        this.log('📊 Loading music statistics...');
        
        // Initialize drag and drop
        this.setupDragAndDrop();
        
        // Load existing music data
        this.loadStoredData();
        
        this.log('✅ Dashboard ready for operations');
    }

    setupEventListeners() {
        // File input change
        document.getElementById('file-input').addEventListener('change', (e) => {
            this.handleFileSelect(e);
        });

        // Modal file input
        document.getElementById('modal-file-input').addEventListener('change', (e) => {
            this.previewSelectedFiles(e);
        });

        // Image preview
        document.getElementById('song-image').addEventListener('change', (e) => {
            this.handleImagePreview(e);
        });

        // Auto-fill current date/time for new songs
        const addedDateInput = document.getElementById('song-added-date');
        if (addedDateInput && !addedDateInput.value) {
            addedDateInput.value = this.formatDateTimeLocal(new Date().toISOString());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'u': // Ctrl+U for upload
                        e.preventDefault();
                        this.openUploadModal();
                        break;
                    case 'e': // Ctrl+E for edit
                        e.preventDefault();
                        this.openEditModal();
                        break;
                    case 'r': // Ctrl+R for refresh
                        e.preventDefault();
                        this.refreshLibrary();
                        break;
                }
            }
        });
    }

    setupDragAndDrop() {
        const uploadZone = document.getElementById('upload-zone');
        
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            
            const files = Array.from(e.dataTransfer.files);
            this.processFiles(files);
        });
    }

    loadMusicLibrary() {
        // Sample music data based on our v5.0.0 structure
        const sampleMusic = [
            // Page Songs (Hindi Priority)
            {
                id: 'anniversary-main',
                title: 'Tum Hi Ho',
                artist: 'Arijit Singh',
                album: 'Aashiqui 2 (2013)',
                language: 'hindi',
                mood: 'Anniversary Celebration',
                filename: 'anniversary.m4a',
                category: 'page',
                path: 'pages/'
            },
            {
                id: 'countdown-main',
                title: 'Galliyan',
                artist: 'Ankit Tiwari',
                album: 'Ek Villain (2014)',
                language: 'hindi',
                mood: 'Building Anticipation',
                filename: 'countdown.m4a',
                category: 'page',
                path: 'pages/'
            },
            {
                id: 'love-story-main',
                title: 'Jeene Laga Hoon',
                artist: 'Atif Aslam & Shreya Ghoshal',
                album: 'Ramaiya Vastavaiya (2013)',
                language: 'hindi',
                mood: 'Love Story Narrative',
                filename: 'love-story.m4a',
                category: 'page',
                path: 'pages/'
            },
            
            // Odia Collection
            {
                id: 'tu-mo-love-story',
                title: 'Tu Mo Love Story',
                artist: 'Ananya Sritam Nanda & Humane Sagar',
                album: 'Love Story (2019)',
                language: 'odia',
                mood: 'Romantic Duet',
                filename: 'tu-mo-love-story.m4a',
                category: 'playlist',
                path: 'playlists/romantic-odia/'
            },
            {
                id: 'mo-man-bhamara',
                title: 'Mo Man Bhamara',
                artist: 'Humane Sagar',
                album: 'Love Station (2018)',
                language: 'odia',
                mood: 'Romantic Metaphor',
                filename: 'mo-man-bhamara.m4a',
                category: 'playlist',
                path: 'playlists/romantic-odia/'
            },
            {
                id: 'laila-o-laila',
                title: 'Laila O Laila',
                artist: 'Humane Sagar',
                album: 'Laila O Laila (2019)',
                language: 'odia',
                mood: 'Passionate Call',
                filename: 'laila-o-laila.m4a',
                category: 'playlist',
                path: 'playlists/romantic-odia/'
            },
            
            // Sambalpuri Collection (Bijay Anand Sahu)
            {
                id: 'tora-bina-mo-jibana',
                title: 'Tora Bina Mo Jibana',
                artist: 'Bijay Anand Sahu',
                album: 'Sambalpuri Romantic Collection',
                language: 'sambalpuri',
                mood: 'Deep Love Expression',
                filename: 'tora-bina-mo-jibana.m4a',
                category: 'playlist',
                path: 'playlists/romantic-sambalpuri/'
            },
            {
                id: 'prema-re-jhulana',
                title: 'Prema Re Jhulana',
                artist: 'Bijay Anand Sahu',
                album: 'Sambalpuri Folk Fusion',
                language: 'sambalpuri',
                mood: 'Playful Romantic',
                filename: 'prema-re-jhulana.m4a',
                category: 'playlist',
                path: 'playlists/romantic-sambalpuri/'
            },
            {
                id: 'rangabati-bijay',
                title: 'Rangabati',
                artist: 'Bijay Anand Sahu',
                album: 'Classic Sambalpuri',
                language: 'sambalpuri',
                mood: 'Joyful Celebration',
                filename: 'rangabati.m4a',
                category: 'playlist',
                path: 'playlists/romantic-sambalpuri/'
            },
            
            // Legacy Songs
            {
                id: 'legacy-arijit',
                title: 'Mixed Collection',
                artist: 'Arijit Singh',
                album: 'Various',
                language: 'hindi',
                mood: 'Romantic Collection',
                filename: 'Arijitsingh.m4a',
                category: 'legacy',
                path: 'legacy/hindi-classics/'
            }
        ];

        // Load sample data
        sampleMusic.forEach(song => {
            this.musicLibrary.set(song.id, song);
        });

        this.updateUI();
        this.updateStats();
        this.log(`📀 Loaded ${sampleMusic.length} songs to library`);
    }

    loadStoredData() {
        try {
            const stored = localStorage.getItem('anniversary-music-data');
            if (stored) {
                const data = JSON.parse(stored);
                this.musicLibrary = new Map(data.library || []);
                this.log('💾 Loaded stored music data');
            }
        } catch (error) {
            this.log('⚠️ Error loading stored data: ' + error.message, 'error');
        }
    }

    saveData() {
        try {
            const data = {
                library: Array.from(this.musicLibrary.entries()),
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('anniversary-music-data', JSON.stringify(data));
            this.log('💾 Data saved successfully');
        } catch (error) {
            this.log('❌ Error saving data: ' + error.message, 'error');
        }
    }

    handleFileSelect(event) {
        const files = Array.from(event.target.files);
        this.processFiles(files);
    }

    processFiles(files) {
        if (files.length === 0) return;

        this.log(`📁 Processing ${files.length} files...`);
        
        const audioFiles = files.filter(file => 
            file.type.startsWith('audio/') || 
            /\.(mp3|m4a|wav|flac|ogg)$/i.test(file.name)
        );

        if (audioFiles.length === 0) {
            this.log('❌ No valid audio files found', 'error');
            return;
        }

        this.showUploadProgress(true);
        
        audioFiles.forEach((file, index) => {
            setTimeout(() => {
                this.processAudioFile(file, index, audioFiles.length);
            }, index * 100);
        });
    }

    processAudioFile(file, index, total) {
        const progress = ((index + 1) / total) * 100;
        this.updateUploadProgress(progress, `Processing ${file.name}...`);

        // Extract basic info from filename
        const filename = file.name;
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
        const parts = nameWithoutExt.split('-');
        
        const currentDate = new Date().toISOString();
        
        const songInfo = {
            id: Date.now() + '-' + index,
            title: this.cleanTitle(parts[parts.length - 1] || nameWithoutExt),
            artist: 'Unknown Artist',
            album: 'Uploaded Collection',
            language: this.detectLanguage(filename),
            mood: 'General',
            filename: filename,
            category: 'uploaded',
            path: 'uploads/',
            size: this.formatFileSize(file.size),
            releaseDate: null,
            addedDate: currentDate,
            lastModified: currentDate,
            uploadDate: currentDate,
            imagePath: null,
            metadata: {
                duration: null,
                bitrate: null,
                sampleRate: null,
                channels: null
            },
            tags: [],
            playCount: 0,
            lastPlayed: null
        };

        this.musicLibrary.set(songInfo.id, songInfo);
        this.saveToDirectoryJson(songInfo);
        this.log(`✅ Added: ${songInfo.title} by ${songInfo.artist}`);

        if (index === total - 1) {
            setTimeout(() => {
                this.showUploadProgress(false);
                this.updateUI();
                this.updateStats();
                this.saveData();
                this.log(`🎉 Upload complete! Added ${total} songs`);
            }, 500);
        }
    }

    detectLanguage(filename) {
        const lowerName = filename.toLowerCase();
        
        if (lowerName.includes('sambalpuri') || lowerName.includes('bijay')) {
            return 'sambalpuri';
        } else if (lowerName.includes('odia') || lowerName.includes('humane')) {
            return 'odia';
        } else {
            return 'hindi';
        }
    }

    cleanTitle(title) {
        return title
            .replace(/^\d+[-_\s]*/, '') // Remove leading numbers
            .replace(/[-_]/g, ' ') // Replace dashes/underscores with spaces
            .replace(/\b\w/g, l => l.toUpperCase()) // Title case
            .trim();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    updateUI() {
        const musicGrid = document.getElementById('music-library');
        musicGrid.innerHTML = '';

        const filteredSongs = Array.from(this.musicLibrary.values()).filter(song => {
            if (this.currentFilter === 'all') return true;
            return song.language === this.currentFilter;
        });

        if (filteredSongs.length === 0) {
            musicGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🎵</div>
                    <h3>No songs found</h3>
                    <p>Try adjusting your filter or upload some music files.</p>
                </div>
            `;
            return;
        }

        filteredSongs.forEach(song => {
            const musicItem = this.createMusicItem(song);
            musicGrid.appendChild(musicItem);
        });
    }

    createMusicItem(song) {
        const item = document.createElement('div');
        item.className = 'music-item';
        item.innerHTML = `
            <div class="music-info">
                <div class="music-title">${song.title}</div>
                <div class="music-artist">${song.artist}</div>
                <div style="margin: 0.5rem 0;">
                    <span class="music-language ${song.language}">${song.language.toUpperCase()}</span>
                    ${song.size ? `<span style="font-size: 0.75rem; color: #666; margin-left: 0.5rem;">${song.size}</span>` : ''}
                </div>
                <div style="font-size: 0.8rem; color: #666;">${song.mood}</div>
                <div style="font-size: 0.75rem; color: #999; margin-top: 0.25rem;">${song.path}${song.filename}</div>
            </div>
            <div class="music-controls">
                <button class="control-btn play-btn" onclick="dashboard.playPreview('${song.id}')" title="Preview">
                    ▶️
                </button>
                <button class="control-btn edit-btn" onclick="dashboard.editSong('${song.id}')" title="Edit">
                    ✏️
                </button>
                <button class="control-btn delete-btn" onclick="dashboard.deleteSong('${song.id}')" title="Delete">
                    🗑️
                </button>
            </div>
        `;
        return item;
    }

    updateStats() {
        const songs = Array.from(this.musicLibrary.values());
        
        document.getElementById('total-songs').textContent = songs.length;
        document.getElementById('hindi-count').textContent = songs.filter(s => s.language === 'hindi').length;
        document.getElementById('odia-count').textContent = songs.filter(s => s.language === 'odia').length;
        document.getElementById('sambalpuri-count').textContent = songs.filter(s => s.language === 'sambalpuri').length;
    }

    showUploadProgress(show) {
        const progressContainer = document.getElementById('upload-progress');
        progressContainer.style.display = show ? 'block' : 'none';
        this.isUploading = show;
        
        if (!show) {
            document.getElementById('progress-bar').style.width = '0%';
            document.getElementById('upload-status').textContent = '';
        }
    }

    updateUploadProgress(percent, status) {
        document.getElementById('progress-bar').style.width = percent + '%';
        document.getElementById('upload-status').textContent = status;
    }

    filterMusic() {
        this.currentFilter = document.getElementById('filter-language').value;
        this.updateUI();
        this.log(`🔍 Filtered by: ${this.currentFilter}`);
    }

    refreshLibrary() {
        this.log('🔄 Refreshing music library...');
        this.updateUI();
        this.updateStats();
        this.log('✅ Library refreshed');
    }

    playPreview(songId) {
        const song = this.musicLibrary.get(songId);
        if (!song) return;

        this.log(`▶️ Playing preview: ${song.title}`);
        
        // In a real implementation, this would play the actual audio file
        // For now, we'll simulate it
        setTimeout(() => {
            this.log(`⏸️ Preview ended: ${song.title}`);
        }, 3000);
    }

    editSong(songId) {
        const song = this.musicLibrary.get(songId);
        if (!song) return;

        // Populate edit modal with song data
        document.getElementById('song-title').value = song.title || '';
        document.getElementById('song-artist').value = song.artist || '';
        document.getElementById('song-album').value = song.album || '';
        document.getElementById('song-language').value = song.language || 'hindi';
        document.getElementById('song-mood').value = song.mood || '';
        document.getElementById('song-filename').value = song.filename || '';
        
        // Set dates
        if (song.releaseDate) {
            document.getElementById('song-release-date').value = song.releaseDate.split('T')[0];
        }
        if (song.addedDate) {
            document.getElementById('song-added-date').value = this.formatDateTimeLocal(song.addedDate);
        }
        if (song.lastModified) {
            document.getElementById('song-modified-date').value = this.formatDateTimeLocal(song.lastModified);
        }
        
        // Show image preview if exists
        if (song.imagePath) {
            this.showImagePreview(song.imagePath);
        }

        // Store the ID for saving
        document.getElementById('edit-modal').dataset.songId = songId;
        
        this.openEditModal();
    }

    deleteSong(songId) {
        const song = this.musicLibrary.get(songId);
        if (!song) return;

        if (confirm(`Are you sure you want to delete "${song.title}" by ${song.artist}?`)) {
            this.musicLibrary.delete(songId);
            this.updateUI();
            this.updateStats();
            this.saveData();
            this.log(`🗑️ Deleted: ${song.title}`);
        }
    }

    openUploadModal() {
        document.getElementById('upload-modal').style.display = 'flex';
    }

    openEditModal() {
        document.getElementById('edit-modal').style.display = 'flex';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    startUpload() {
        const fileInput = document.getElementById('modal-file-input');
        const targetDir = document.getElementById('target-directory').value;
        
        if (fileInput.files.length === 0) {
            alert('Please select files to upload');
            return;
        }

        this.log(`📤 Uploading to: ${targetDir}`);
        this.processFiles(Array.from(fileInput.files));
        this.closeModal('upload-modal');
    }

    saveSongInfo() {
        const songId = document.getElementById('edit-modal').dataset.songId;
        const isNew = !songId;
        const currentDate = new Date().toISOString();
        
        // Handle image upload
        const imageFile = document.getElementById('song-image').files[0];
        let imagePath = null;
        
        if (imageFile) {
            imagePath = this.saveImageFile(imageFile, songId || Date.now().toString());
        }
        
        const songData = {
            id: songId || Date.now().toString(),
            title: document.getElementById('song-title').value,
            artist: document.getElementById('song-artist').value,
            album: document.getElementById('song-album').value,
            language: document.getElementById('song-language').value,
            mood: document.getElementById('song-mood').value,
            filename: document.getElementById('song-filename').value,
            releaseDate: document.getElementById('song-release-date').value || null,
            addedDate: document.getElementById('song-added-date').value || currentDate,
            lastModified: currentDate,
            imagePath: imagePath || (this.musicLibrary.get(songId)?.imagePath),
            category: 'manual',
            path: 'manual/',
            tags: [],
            playCount: isNew ? 0 : (this.musicLibrary.get(songId)?.playCount || 0),
            lastPlayed: this.musicLibrary.get(songId)?.lastPlayed || null
        };

        this.musicLibrary.set(songData.id, songData);
        this.saveToDirectoryJson(songData);
        this.updateUI();
        this.updateStats();
        this.saveData();
        this.closeModal('edit-modal');
        
        this.log(`💾 ${isNew ? 'Added' : 'Updated'}: ${songData.title}`);
        
        // Clear form
        this.clearEditForm();
    }

    clearEditForm() {
        document.getElementById('song-title').value = '';
        document.getElementById('song-artist').value = '';
        document.getElementById('song-album').value = '';
        document.getElementById('song-language').value = 'hindi';
        document.getElementById('song-mood').value = '';
        document.getElementById('song-filename').value = '';
        document.getElementById('song-release-date').value = '';
        document.getElementById('song-added-date').value = '';
        document.getElementById('song-modified-date').value = '';
        document.getElementById('song-image').value = '';
        
        // Clear image preview
        const preview = document.getElementById('image-preview');
        if (preview) {
            preview.style.display = 'none';
        }
        
        // Clear stored image data
        this.tempImageData = null;
    }

    previewSelectedFiles(event) {
        const files = Array.from(event.target.files);
        const previewContainer = document.getElementById('file-preview');
        
        if (!previewContainer) return;
        
        previewContainer.innerHTML = '';
        
        if (files.length === 0) {
            previewContainer.innerHTML = '<p>No files selected</p>';
            return;
        }
        
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-preview-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <strong>${file.name}</strong><br>
                    <small>${this.formatFileSize(file.size)} • ${file.type || 'Unknown type'}</small>
                </div>
                <div class="file-status">✅ Ready</div>
            `;
            previewContainer.appendChild(fileItem);
        });
    }

    showImagePreview(imagePath) {
        const preview = document.getElementById('image-preview');
        if (preview) {
            preview.src = imagePath;
            preview.style.display = 'block';
            preview.style.maxWidth = '200px';
            preview.style.maxHeight = '200px';
            preview.style.borderRadius = '8px';
            preview.style.marginTop = '10px';
        }
    }

    saveImageFile(imageFile, songId) {
        // In a real implementation, this would upload the image to server
        // For now, we'll create a simulated path
        const timestamp = Date.now();
        const ext = imageFile.name.split('.').pop();
        const imagePath = `assets/images/song-covers/${songId}-${timestamp}.${ext}`;
        
        this.log(`🖼️ Image saved: ${imagePath}`);
        return imagePath;
    }

    // =================== AUDIO PREVIEW FUNCTIONALITY ===================

    async initializeAudioPreview() {
        this.previewAudio = new Audio();
        this.previewAudio.volume = 0.5;
        this.currentlyPreviewing = null;
        
        this.previewAudio.addEventListener('ended', () => {
            this.stopPreview();
        });
        
        this.previewAudio.addEventListener('error', (e) => {
            this.log('❌ Audio preview error', 'error');
            this.stopPreview();
        });
    }

    async playPreview(songId) {
        const song = this.musicLibrary.get(songId);
        if (!song) return;

        // Stop any currently playing preview
        if (this.currentlyPreviewing) {
            this.stopPreview();
        }

        try {
            this.log(`▶️ Loading preview: ${song.title}`);
            
            // Get audio URL (in real implementation, this would be the actual file)
            const audioUrl = `/api/audio-preview/${song.filename}?directory=${song.path}`;
            
            this.previewAudio.src = audioUrl;
            this.currentlyPreviewing = songId;
            
            // Update UI to show playing state
            this.updatePlayButton(songId, 'playing');
            
            await this.previewAudio.play();
            this.log(`🎵 Playing: ${song.title}`);
            
            // Auto-stop after 30 seconds
            setTimeout(() => {
                if (this.currentlyPreviewing === songId) {
                    this.stopPreview();
                }
            }, 30000);
            
        } catch (error) {
            this.log(`❌ Preview failed: ${error.message}`, 'error');
            this.stopPreview();
        }
    }

    stopPreview() {
        if (this.previewAudio) {
            this.previewAudio.pause();
            this.previewAudio.currentTime = 0;
        }
        
        if (this.currentlyPreviewing) {
            this.updatePlayButton(this.currentlyPreviewing, 'stopped');
            this.currentlyPreviewing = null;
        }
    }

    updatePlayButton(songId, state) {
        const musicItems = document.querySelectorAll('.music-item');
        musicItems.forEach(item => {
            const playBtn = item.querySelector('.play-btn');
            if (playBtn && playBtn.onclick.toString().includes(songId)) {
                if (state === 'playing') {
                    playBtn.textContent = '⏸️';
                    playBtn.onclick = () => this.stopPreview();
                } else {
                    playBtn.textContent = '▶️';
                    playBtn.onclick = () => this.playPreview(songId);
                }
            }
        });
    }

    // =================== BATCH OPERATIONS ===================

    showBatchOperations() {
        const selectedSongs = this.getSelectedSongs();
        if (selectedSongs.length === 0) {
            alert('Please select songs first by checking the checkboxes');
            return;
        }

        const batchModal = document.createElement('div');
        batchModal.className = 'modal';
        batchModal.innerHTML = `
            <div class="modal-content">
                <h3>Batch Operations (${selectedSongs.length} songs)</h3>
                <div class="batch-options">
                    <button onclick="dashboard.batchUpdateLanguage('${selectedSongs.join(',')}')">
                        Update Language
                    </button>
                    <button onclick="dashboard.batchUpdateMood('${selectedSongs.join(',')}')">
                        Update Mood
                    </button>
                    <button onclick="dashboard.batchMoveToDirectory('${selectedSongs.join(',')}')">
                        Move to Directory
                    </button>
                    <button onclick="dashboard.batchDelete('${selectedSongs.join(',')}')">
                        Delete Selected
                    </button>
                </div>
                <button onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
        
        document.body.appendChild(batchModal);
        batchModal.style.display = 'flex';
    }

    getSelectedSongs() {
        const checkboxes = document.querySelectorAll('.song-checkbox:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    async batchUpdateLanguage(songIds) {
        const language = prompt('Enter new language (hindi/odia/sambalpuri):');
        if (!language || !['hindi', 'odia', 'sambalpuri'].includes(language)) {
            alert('Invalid language. Use: hindi, odia, or sambalpuri');
            return;
        }

        const ids = songIds.split(',');
        ids.forEach(id => {
            const song = this.musicLibrary.get(id);
            if (song) {
                song.language = language;
                song.lastModified = new Date().toISOString();
                this.musicLibrary.set(id, song);
            }
        });

        this.updateUI();
        this.updateStats();
        this.saveData();
        this.log(`🔄 Updated language to ${language} for ${ids.length} songs`);
    }

    // =================== EXPORT/IMPORT FUNCTIONALITY ===================

    async exportAllData() {
        try {
            const exportData = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    version: '5.0.0',
                    totalSongs: this.musicLibrary.size,
                    exportType: 'complete'
                },
                library: Array.from(this.musicLibrary.entries()),
                statistics: {
                    hindi: Array.from(this.musicLibrary.values()).filter(s => s.language === 'hindi').length,
                    odia: Array.from(this.musicLibrary.values()).filter(s => s.language === 'odia').length,
                    sambalpuri: Array.from(this.musicLibrary.values()).filter(s => s.language === 'sambalpuri').length
                },
                activityLog: this.activityLog.slice(-100) // Last 100 entries
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `anniversary-music-complete-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.log('💾 Complete data export successful');
        } catch (error) {
            this.log(`❌ Export failed: ${error.message}`, 'error');
        }
    }

    async importData(file) {
        try {
            const text = await file.text();
            const importData = JSON.parse(text);

            if (importData.library && Array.isArray(importData.library)) {
                // Merge with existing data
                importData.library.forEach(([id, songData]) => {
                    this.musicLibrary.set(id, songData);
                });

                this.updateUI();
                this.updateStats();
                this.saveData();

                this.log(`✅ Imported ${importData.library.length} songs successfully`);
            } else {
                throw new Error('Invalid import file format');
            }
        } catch (error) {
            this.log(`❌ Import failed: ${error.message}`, 'error');
        }
    }

    // =================== SEARCH AND FILTER FUNCTIONALITY ===================

    initializeSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchSongs(e.target.value);
            });
        }
    }

    searchSongs(query) {
        if (!query.trim()) {
            this.updateUI();
            return;
        }

        const musicGrid = document.getElementById('music-library');
        const filteredSongs = Array.from(this.musicLibrary.values()).filter(song => {
            const searchText = `${song.title} ${song.artist} ${song.album} ${song.mood}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        });

        musicGrid.innerHTML = '';

        if (filteredSongs.length === 0) {
            musicGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <h3>No songs found</h3>
                    <p>No songs match your search: "${query}"</p>
                </div>
            `;
            return;
        }

        filteredSongs.forEach(song => {
            const musicItem = this.createMusicItem(song);
            musicGrid.appendChild(musicItem);
        });

        this.log(`🔍 Search results: ${filteredSongs.length} songs found for "${query}"`);
    }

    // =================== ANALYTICS AND REPORTING ===================

    generateAnalyticsReport() {
        const songs = Array.from(this.musicLibrary.values());
        
        const report = {
            overview: {
                totalSongs: songs.length,
                languages: {
                    hindi: songs.filter(s => s.language === 'hindi').length,
                    odia: songs.filter(s => s.language === 'odia').length,
                    sambalpuri: songs.filter(s => s.language === 'sambalpuri').length
                },
                categories: {
                    page: songs.filter(s => s.category === 'page').length,
                    playlist: songs.filter(s => s.category === 'playlist').length,
                    uploaded: songs.filter(s => s.category === 'uploaded').length,
                    legacy: songs.filter(s => s.category === 'legacy').length
                }
            },
            topArtists: this.getTopArtists(songs),
            recentlyAdded: songs
                .filter(s => s.addedDate)
                .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
                .slice(0, 10),
            analytics: {
                averagePlayCount: songs.reduce((sum, s) => sum + (s.playCount || 0), 0) / songs.length,
                mostPlayedSongs: songs
                    .filter(s => s.playCount > 0)
                    .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
                    .slice(0, 5)
            }
        };

        this.showAnalyticsModal(report);
    }

    getTopArtists(songs) {
        const artistCounts = {};
        songs.forEach(song => {
            artistCounts[song.artist] = (artistCounts[song.artist] || 0) + 1;
        });

        return Object.entries(artistCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([artist, count]) => ({ artist, count }));
    }

    showAnalyticsModal(report) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content analytics-modal">
                <h3>📊 Music Library Analytics</h3>
                <div class="analytics-content">
                    <h4>Overview</h4>
                    <p>Total Songs: ${report.overview.totalSongs}</p>
                    <p>Hindi: ${report.overview.languages.hindi} | Odia: ${report.overview.languages.odia} | Sambalpuri: ${report.overview.languages.sambalpuri}</p>
                    
                    <h4>Top Artists</h4>
                    <ul>
                        ${report.topArtists.map(({artist, count}) => `<li>${artist}: ${count} songs</li>`).join('')}
                    </ul>
                    
                    <h4>Recently Added</h4>
                    <ul>
                        ${report.recentlyAdded.slice(0, 5).map(song => `<li>${song.title} by ${song.artist}</li>`).join('')}
                    </ul>
                </div>
                <button onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    exportData() {
        const data = {
            library: Array.from(this.musicLibrary.entries()),
            stats: {
                total: this.musicLibrary.size,
                hindi: Array.from(this.musicLibrary.values()).filter(s => s.language === 'hindi').length,
                odia: Array.from(this.musicLibrary.values()).filter(s => s.language === 'odia').length,
                sambalpuri: Array.from(this.musicLibrary.values()).filter(s => s.language === 'sambalpuri').length
            },
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `anniversary-music-collection-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.log('💾 Music collection exported successfully');
    }

    clearCache() {
        if (confirm('Are you sure you want to clear all cached data? This will remove all uploaded song information.')) {
            localStorage.removeItem('anniversary-music-data');
            this.musicLibrary.clear();
            this.updateUI();
            this.updateStats();
            this.log('🗑️ Cache cleared successfully');
        }
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}`;
        
        this.activityLog.push({ timestamp, message, type });
        
        const logArea = document.getElementById('activity-log');
        const logElement = document.createElement('div');
        logElement.textContent = logEntry;
        
        if (type === 'error') {
            logElement.style.color = '#ff6b6b';
        } else if (type === 'success') {
            logElement.style.color = '#4ecdc4';
        }
        
        logArea.appendChild(logElement);
        logArea.scrollTop = logArea.scrollHeight;

        // Keep only last 100 log entries
        if (logArea.children.length > 100) {
            logArea.removeChild(logArea.firstChild);
        }
    }

    // =================== UTILITY FUNCTIONS ===================

    /**
     * Format date for datetime-local input
     */
    formatDateTimeLocal(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        
        // Format as YYYY-MM-DDTHH:MM for datetime-local input
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    /**
     * Handle image preview for song covers
     */
    handleImagePreview(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.log('❌ Please select a valid image file', 'error');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.log('❌ Image file too large. Maximum size is 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('image-preview');
            if (preview) {
                preview.src = e.target.result;
                preview.style.display = 'block';
                preview.style.maxWidth = '200px';
                preview.style.maxHeight = '200px';
                preview.style.borderRadius = '8px';
                preview.style.marginTop = '10px';
            }

            // Store image data for later use
            this.tempImageData = {
                filename: file.name,
                data: e.target.result,
                size: file.size,
                type: file.type
            };

            this.log(`🖼️ Image preview loaded: ${file.name}`);
        };

        reader.readAsDataURL(file);
    }

    /**
     * Save song data to appropriate directory JSON
     */
    async saveToDirectoryJson(songData) {
        try {
            // Determine target directory based on song properties
            let targetPath = this.getTargetDirectory(songData);
            
            // Create directory structure if needed
            await this.ensureDirectoryExists(targetPath);
            
            // Load existing JSON or create new structure
            const jsonPath = `${targetPath}/songs.json`;
            let existingData = await this.loadDirectoryJson(jsonPath);
            
            // Add or update song in directory data
            const songIndex = existingData.songs.findIndex(s => s.id === songData.id);
            if (songIndex >= 0) {
                existingData.songs[songIndex] = songData;
                existingData.lastModified = new Date().toISOString();
            } else {
                existingData.songs.push(songData);
                existingData.lastModified = new Date().toISOString();
                existingData.totalSongs = existingData.songs.length;
            }

            // Update metadata
            existingData.metadata = {
                ...existingData.metadata,
                totalSongs: existingData.songs.length,
                languages: [...new Set(existingData.songs.map(s => s.language))],
                categories: [...new Set(existingData.songs.map(s => s.category))],
                averageRating: this.calculateAverageRating(existingData.songs),
                lastUpdated: new Date().toISOString()
            };

            // Save to server via API
            await this.saveDirectoryJsonToServer(jsonPath, existingData);
            
            this.log(`💾 Saved to directory: ${targetPath}`);
            
        } catch (error) {
            this.log(`❌ Failed to save to directory: ${error.message}`, 'error');
            console.error('Directory save error:', error);
        }
    }

    /**
     * Determine target directory based on song properties
     */
    getTargetDirectory(songData) {
        // Determine if song belongs to pages, playlists, or uploads
        if (songData.category === 'page-song') {
            return `public/assets/music/pages/${songData.pageCategory || 'general'}`;
        } else if (songData.category === 'playlist') {
            return `public/assets/music/playlists/${songData.playlistType || 'mixed'}`;
        } else if (songData.language === 'sambalpuri') {
            return `public/assets/music/playlists/sambalpuri`;
        } else if (songData.language === 'odia') {
            return `public/assets/music/playlists/odia`;
        } else if (songData.language === 'hindi') {
            return `public/assets/music/playlists/hindi`;
        } else {
            return `public/assets/music/uploads`;
        }
    }

    /**
     * Load existing directory JSON or create default structure
     */
    async loadDirectoryJson(jsonPath) {
        try {
            const response = await fetch(`/api/directory-json?path=${encodeURIComponent(jsonPath)}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log('Creating new directory JSON structure');
        }

        // Return default structure if file doesn't exist
        return {
            metadata: {
                created: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                totalSongs: 0,
                languages: [],
                categories: [],
                averageRating: 0
            },
            songs: []
        };
    }

    /**
     * Save directory JSON to server
     */
    async saveDirectoryJsonToServer(jsonPath, data) {
        const response = await fetch('/api/save-directory-json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: jsonPath,
                data: data
            })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Ensure directory exists on server
     */
    async ensureDirectoryExists(dirPath) {
        try {
            await fetch('/api/ensure-directory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ path: dirPath })
            });
        } catch (error) {
            console.warn('Could not ensure directory exists:', error);
        }
    }

    /**
     * Calculate average rating for songs
     */
    calculateAverageRating(songs) {
        if (!songs.length) return 0;
        const ratingsSum = songs.reduce((sum, song) => sum + (song.rating || 0), 0);
        return Math.round((ratingsSum / songs.length) * 100) / 100;
    }

    /**
     * Extract audio metadata (placeholder for future implementation)
     */
    async extractAudioMetadata(file) {
        return new Promise((resolve) => {
            // For now, return basic file information
            // In the future, this could use libraries like music-metadata
            const metadata = {
                duration: null, // Would need audio element or Web Audio API
                bitrate: null,  // Would need specialized library
                sampleRate: null, // Would need specialized library
                channels: null,   // Would need specialized library
                fileSize: file.size,
                mimeType: file.type,
                lastModified: new Date(file.lastModified).toISOString()
            };

            // Try to get duration using audio element
            const audio = new Audio();
            const objectUrl = URL.createObjectURL(file);
            
            audio.addEventListener('loadedmetadata', () => {
                metadata.duration = audio.duration;
                URL.revokeObjectURL(objectUrl);
                resolve(metadata);
            });

            audio.addEventListener('error', () => {
                URL.revokeObjectURL(objectUrl);
                resolve(metadata);
            });

            audio.src = objectUrl;
        });
    }

    /**
     * Update date modified for song
     */
    updateDateModified(songId) {
        const song = this.musicLibrary.get(songId);
        if (song) {
            song.lastModified = new Date().toISOString();
            this.musicLibrary.set(songId, song);
            this.saveToDirectoryJson(song);
            this.log(`📅 Updated modification date for: ${song.title}`);
        }
    }

    /**
     * Auto-fill current dates for new songs
     */
    autoFillCurrentDates() {
        const now = new Date().toISOString();
        const addedDateInput = document.getElementById('song-added-date');
        const modifiedDateInput = document.getElementById('song-modified-date');

        if (addedDateInput && !addedDateInput.value) {
            addedDateInput.value = this.formatDateTimeLocal(now);
        }

        if (modifiedDateInput) {
            modifiedDateInput.value = this.formatDateTimeLocal(now);
        }
    }

    /**
     * Upload image to server and get path
     */
    async uploadImageToServer(imageData) {
        try {
            const formData = new FormData();
            
            // Convert base64 to blob
            const response = await fetch(imageData.data);
            const blob = await response.blob();
            
            formData.append('image', blob, imageData.filename);
            formData.append('category', 'song-covers');

            const uploadResponse = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData
            });

            if (uploadResponse.ok) {
                const result = await uploadResponse.json();
                return result.path;
            } else {
                throw new Error('Image upload failed');
            }
        } catch (error) {
            this.log(`❌ Image upload failed: ${error.message}`, 'error');
            return null;
        }
    }

    /**
     * Generate unique song ID
     */
    generateSongId(title, artist) {
        const base = `${title}-${artist}`.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        
        const timestamp = Date.now().toString(36);
        return `${base}-${timestamp}`;
    }

    /**
     * Validate song data
     */
    validateSongData(data) {
        const errors = [];

        if (!data.title || data.title.trim() === '') {
            errors.push('Title is required');
        }

        if (!data.artist || data.artist.trim() === '') {
            errors.push('Artist is required');
        }

        if (!data.language || !['hindi', 'odia', 'sambalpuri'].includes(data.language)) {
            errors.push('Valid language is required');
        }

        if (!data.mood || data.mood.trim() === '') {
            errors.push('Mood is required');
        }

        return errors;
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Create backup of current data
     */
    createBackup() {
        const backupData = {
            timestamp: new Date().toISOString(),
            version: '5.0.0',
            library: Array.from(this.musicLibrary.entries()),
            activityLog: this.activityLog.slice(-50) // Keep last 50 entries
        };

        const filename = `anniversary-music-backup-${new Date().toISOString().split('T')[0]}-${Date.now()}.json`;
        
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.log(`💾 Backup created: ${filename}`);
    }

    /**
     * Restore from backup file
     */
    async restoreFromBackup(file) {
        try {
            const text = await file.text();
            const backupData = JSON.parse(text);

            if (backupData.library && Array.isArray(backupData.library)) {
                this.musicLibrary.clear();
                
                backupData.library.forEach(([id, songData]) => {
                    this.musicLibrary.set(id, songData);
                });

                this.updateUI();
                this.updateStats();
                this.saveData();

                this.log(`✅ Restored ${backupData.library.length} songs from backup`);
            } else {
                throw new Error('Invalid backup file format');
            }
        } catch (error) {
            this.log(`❌ Restore failed: ${error.message}`, 'error');
        }
    }
}

// Global functions for HTML onclick handlers
window.openUploadModal = () => dashboard.openUploadModal();
window.openEditModal = () => dashboard.openEditModal();
window.closeModal = (modalId) => dashboard.closeModal(modalId);
window.startUpload = () => dashboard.startUpload();
window.saveSongInfo = () => dashboard.saveSongInfo();
window.exportData = () => dashboard.exportData();
window.clearCache = () => dashboard.clearCache();
window.filterMusic = () => dashboard.filterMusic();
window.refreshLibrary = () => dashboard.refreshLibrary();
window.handleFileSelect = (event) => dashboard.handleFileSelect(event);

// New enhanced functions
window.playPreview = (songId) => dashboard.playPreview(songId);
window.stopPreview = () => dashboard.stopPreview();
window.showBatchOperations = () => dashboard.showBatchOperations();
window.generateAnalyticsReport = () => dashboard.generateAnalyticsReport();
window.exportAllData = () => dashboard.exportAllData();
window.createBackup = () => dashboard.createBackup();

// File handling
window.handleImportFile = (input) => {
    const file = input.files[0];
    if (file) {
        dashboard.importData(file);
    }
};

window.handleRestoreFile = (input) => {
    const file = input.files[0];
    if (file) {
        dashboard.restoreFromBackup(file);
    }
};

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new MusicDashboard();
    console.log('🎵 Anniversary Music Dashboard v5.0.0 Ready!');
});

// Handle modal clicks outside content
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Handle escape key to close modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
});
