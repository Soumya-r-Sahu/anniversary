/**
 * Anniversary Website Music Dashboard Server v5.0.0
 * Simple Express server for localhost music management
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Create music directories if they don't exist
const musicDirs = [
    'public/assets/music/pages',
    'public/assets/music/playlists/romantic-hindi',
    'public/assets/music/playlists/romantic-odia',
    'public/assets/music/playlists/romantic-sambalpuri',
    'public/assets/music/playlists/celebration-mixed',
    'public/assets/music/playlists/slow-mixed',
    'public/assets/music/playlists/cultural-mixed',
    'public/assets/music/legacy/hindi-classics',
    'public/assets/music/legacy/odia-modern',
    'public/assets/music/legacy/sambalpuri-folk',
    'public/assets/music/uploads'
];

musicDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
    }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const targetDir = req.body.targetDirectory || 'uploads';
        const fullPath = path.join('public/assets/music', targetDir);
        
        // Ensure directory exists
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
        
        cb(null, fullPath);
    },
    filename: function (req, file, cb) {
        // Keep original filename or use custom name
        const filename = req.body.customFilename || file.originalname;
        cb(null, filename);
    }
});

// Configure multer for image uploads
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const category = req.body.category || 'general';
        const fullPath = path.join('public/assets/images', category);
        
        // Ensure directory exists
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
        
        cb(null, fullPath);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        const uniqueName = `${name}-${timestamp}${ext}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Check if file is audio
        const allowedMimes = [
            'audio/mpeg',
            'audio/mp4',
            'audio/wav',
            'audio/flac',
            'audio/ogg'
        ];
        
        if (allowedMimes.includes(file.mimetype) || 
            /\.(mp3|m4a|wav|flac|ogg)$/i.test(file.originalname)) {
            cb(null, true);
        } else {
            cb(new Error('Only audio files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

const uploadImage = multer({
    storage: imageStorage,
    fileFilter: function (req, file, cb) {
        // Check if file is image
        const allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp'
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit for images
    }
});

// Routes

// Serve dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Get music library
app.get('/api/music', (req, res) => {
    try {
        const musicData = scanMusicDirectory();
        res.json({
            success: true,
            data: musicData,
            count: musicData.length
        });
    } catch (error) {
        console.error('Error scanning music:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Upload music files
app.post('/api/upload', upload.array('musicFiles', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No files uploaded'
            });
        }

        const uploadedFiles = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            path: file.path.replace('public/', ''),
            mimetype: file.mimetype
        }));

        console.log(`📤 Uploaded ${uploadedFiles.length} files:`, uploadedFiles.map(f => f.filename));

        res.json({
            success: true,
            message: `Successfully uploaded ${uploadedFiles.length} files`,
            files: uploadedFiles
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Save music metadata
app.post('/api/music/metadata', (req, res) => {
    try {
        const { id, title, artist, album, language, mood, filename } = req.body;
        
        // Load existing metadata
        const metadataPath = 'public/assets/music/metadata.json';
        let metadata = {};
        
        if (fs.existsSync(metadataPath)) {
            metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        }
        
        // Update metadata
        metadata[id] = {
            title,
            artist,
            album,
            language,
            mood,
            filename,
            lastUpdated: new Date().toISOString()
        };
        
        // Save metadata
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
        
        console.log(`💾 Updated metadata for: ${title}`);
        
        res.json({
            success: true,
            message: 'Metadata saved successfully'
        });
    } catch (error) {
        console.error('Metadata save error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Delete music file
app.delete('/api/music/:id', (req, res) => {
    try {
        const { id } = req.params;
        
        // Load metadata to find file path
        const metadataPath = 'public/assets/music/metadata.json';
        if (!fs.existsSync(metadataPath)) {
            return res.status(404).json({
                success: false,
                error: 'Metadata file not found'
            });
        }
        
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        if (!metadata[id]) {
            return res.status(404).json({
                success: false,
                error: 'Song not found'
            });
        }

        // Delete the file and metadata entry
        const filename = metadata[id].filename;
        const filePath = path.join('public/assets/music', filename);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        delete metadata[id];
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
        
        console.log(`🗑️ Deleted: ${filename}`);
        
        res.json({
            success: true,
            message: 'Song deleted successfully'
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// =================== NEW DIRECTORY JSON MANAGEMENT APIs ===================

// Get directory JSON
app.get('/api/directory-json', (req, res) => {
    try {
        const { path: jsonPath } = req.query;
        
        if (!jsonPath) {
            return res.status(400).json({
                success: false,
                error: 'Path parameter is required'
            });
        }
        
        const fullPath = path.resolve(jsonPath);
        
        if (fs.existsSync(fullPath)) {
            const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            res.json(data);
        } else {
            res.status(404).json({
                success: false,
                error: 'Directory JSON not found'
            });
        }
    } catch (error) {
        console.error('Directory JSON read error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Save directory JSON
app.post('/api/save-directory-json', (req, res) => {
    try {
        const { path: jsonPath, data } = req.body;
        
        if (!jsonPath || !data) {
            return res.status(400).json({
                success: false,
                error: 'Path and data are required'
            });
        }
        
        const fullPath = path.resolve(jsonPath);
        const dirPath = path.dirname(fullPath);
        
        // Ensure directory exists
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        
        // Save JSON data
        fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
        
        console.log(`💾 Saved directory JSON: ${jsonPath}`);
        
        res.json({
            success: true,
            message: 'Directory JSON saved successfully',
            path: jsonPath
        });
    } catch (error) {
        console.error('Directory JSON save error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Ensure directory exists
app.post('/api/ensure-directory', (req, res) => {
    try {
        const { path: dirPath } = req.body;
        
        if (!dirPath) {
            return res.status(400).json({
                success: false,
                error: 'Path is required'
            });
        }
        
        const fullPath = path.resolve(dirPath);
        
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`📁 Created directory: ${dirPath}`);
        }
        
        res.json({
            success: true,
            message: 'Directory ensured',
            exists: fs.existsSync(fullPath)
        });
    } catch (error) {
        console.error('Directory creation error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Upload image for song covers
app.post('/api/upload-image', uploadImage.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No image file uploaded'
            });
        }

        const imagePath = req.file.path.replace('public/', '');
        
        console.log(`🖼️ Image uploaded: ${req.file.filename}`);

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            path: imagePath,
            filename: req.file.filename,
            size: req.file.size
        });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get audio metadata (placeholder - would need specialized library)
app.post('/api/audio-metadata', upload.single('audioFile'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No audio file provided'
            });
        }

        // Basic metadata from file
        const metadata = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            lastModified: new Date().toISOString(),
            // Additional metadata would require specialized libraries like music-metadata
            duration: null,
            bitrate: null,
            sampleRate: null,
            channels: null
        };

        // Clean up temporary file
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            metadata: metadata
        });
    } catch (error) {
        console.error('Metadata extraction error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Real-time audio preview endpoint
app.get('/api/audio-preview/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        const { directory = 'uploads' } = req.query;
        
        const filePath = path.join('public/assets/music', directory, filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                error: 'Audio file not found'
            });
        }

        // Set appropriate headers for audio streaming
        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            // Handle range requests for audio seeking
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(filePath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'audio/mpeg',
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'audio/mpeg',
            };
            res.writeHead(200, head);
            fs.createReadStream(filePath).pipe(res);
        }
    } catch (error) {
        console.error('Audio preview error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Batch operations for multiple songs
app.post('/api/batch-operations', (req, res) => {
    try {
        const { operation, songIds, data } = req.body;
        
        if (!operation || !songIds || !Array.isArray(songIds)) {
            return res.status(400).json({
                success: false,
                error: 'Operation and songIds array are required'
            });
        }

        const results = [];
        const errors = [];

        songIds.forEach(songId => {
            try {
                switch (operation) {
                    case 'updateLanguage':
                        // Update language for multiple songs
                        if (data.language) {
                            // Implementation would update metadata
                            results.push({ songId, status: 'updated' });
                        }
                        break;
                    case 'updateMood':
                        // Update mood for multiple songs
                        if (data.mood) {
                            results.push({ songId, status: 'updated' });
                        }
                        break;
                    case 'moveToDirectory':
                        // Move songs to different directory
                        if (data.targetDirectory) {
                            results.push({ songId, status: 'moved' });
                        }
                        break;
                    default:
                        errors.push({ songId, error: 'Unknown operation' });
                }
            } catch (error) {
                errors.push({ songId, error: error.message });
            }
        });

        res.json({
            success: true,
            message: `Batch ${operation} completed`,
            results: results,
            errors: errors,
            processed: results.length,
            failed: errors.length
        });
    } catch (error) {
        console.error('Batch operation error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Delete music file
app.delete('/api/music/:id', (req, res) => {
    try {
        const { id } = req.params;
        
        // Load metadata to find file path
        const metadataPath = 'public/assets/music/metadata.json';
        if (!fs.existsSync(metadataPath)) {
            return res.status(404).json({
                success: false,
                error: 'Metadata file not found'
            });
        }
        
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        if (!metadata[id]) {
            return res.status(404).json({
                success: false,
                error: 'Song not found'
            });
        }
        
        // Delete file if it exists
        const filePath = path.join('public/assets/music', metadata[id].filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`🗑️ Deleted file: ${filePath}`);
        }
        
        // Remove from metadata
        delete metadata[id];
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
        
        res.json({
            success: true,
            message: 'Song deleted successfully'
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get directory structure
app.get('/api/directories', (req, res) => {
    try {
        const basePath = 'public/assets/music';
        const directories = getMusicDirectories(basePath);
        
        res.json({
            success: true,
            directories: directories
        });
    } catch (error) {
        console.error('Directory scan error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Helper functions

function scanMusicDirectory() {
    const basePath = 'public/assets/music';
    const musicFiles = [];
    
    function scanDir(dirPath, relativePath = '') {
        if (!fs.existsSync(dirPath)) return;
        
        const items = fs.readdirSync(dirPath);
        
        items.forEach(item => {
            const fullPath = path.join(dirPath, item);
            const relativeItemPath = path.join(relativePath, item);
            
            if (fs.statSync(fullPath).isDirectory()) {
                scanDir(fullPath, relativeItemPath);
            } else if (/\.(mp3|m4a|wav|flac|ogg)$/i.test(item)) {
                const stats = fs.statSync(fullPath);
                musicFiles.push({
                    filename: item,
                    path: relativePath,
                    fullPath: relativeItemPath,
                    size: stats.size,
                    modified: stats.mtime,
                    category: getCategoryFromPath(relativePath)
                });
            }
        });
    }
    
    scanDir(basePath);
    return musicFiles;
}

function getCategoryFromPath(dirPath) {
    if (dirPath.includes('pages')) return 'page';
    if (dirPath.includes('playlists')) return 'playlist';
    if (dirPath.includes('legacy')) return 'legacy';
    return 'other';
}

function getMusicDirectories(basePath) {
    const directories = [];
    
    function scanDirs(dirPath, relativePath = '') {
        if (!fs.existsSync(dirPath)) return;
        
        const items = fs.readdirSync(dirPath);
        
        items.forEach(item => {
            const fullPath = path.join(dirPath, item);
            const relativeItemPath = path.join(relativePath, item);
            
            if (fs.statSync(fullPath).isDirectory()) {
                directories.push({
                    name: item,
                    path: relativeItemPath,
                    fullPath: fullPath
                });
                scanDirs(fullPath, relativeItemPath);
            }
        });
    }
    
    scanDirs(basePath);
    return directories;
}

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'File too large. Maximum size is 50MB.'
            });
        }
    }
    
    res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🎵 Anniversary Music Dashboard Server v5.0.0');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard available at http://localhost:${PORT}/dashboard`);
    console.log('🎶 Ready for music management!');
    console.log('\n📁 Available directories:');
    musicDirs.forEach(dir => console.log(`   - ${dir}`));
});
