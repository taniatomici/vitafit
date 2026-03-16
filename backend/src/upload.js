const path = require('path');
const fs = require('fs');
const os = require('os');
const multer = require('multer');

// On Vercel use /tmp (ephemeral – uploads won't persist). For persistent uploads use Vercel Blob or another host.
const contentDir = process.env.VERCEL
  ? path.join(os.tmpdir(), 'vitafit-content')
  : path.join(__dirname, '..', 'content');
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, contentDir),
  filename: (req, file, cb) => {
    const ext = (file.originalname && path.extname(file.originalname)) || '.jpg';
    const safe = (ext && /^\.\w+$/.test(ext)) ? ext : '.jpg';
    cb(null, Date.now() + '-' + Math.random().toString(36).slice(2, 10) + safe);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const progressPhotos = upload.fields([
  { name: 'photo_front', maxCount: 1 },
  { name: 'photo_side', maxCount: 1 },
  { name: 'photo_back', maxCount: 1 }
]);

module.exports = { progressPhotos, contentDir };
