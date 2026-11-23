import multer from "multer";

// Vercel prima najviše 4,5 MB po zahtevu, pa slike ograničavamo na 4 MB.
export const MAX_IMAGE_MB = 4;

export const IMAGE_TYPES: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
};

// memoryStorage: fajl ostaje u memoriji (req.file.buffer), a mi ga upišemo u bazu.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    cb(null, file.mimetype in IMAGE_TYPES);
  },
});
