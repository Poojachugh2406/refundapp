import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/ocr/scan-url
router.post('/scan-url', async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ 
      success: false, 
      message: 'Image URL is required' 
    });
  }

  try {
     console.log(`Scanning image: ${imageUrl}`); // Optional logging

    // Upload to Cloudinary with OCR enabled
    // 'adv_ocr' is the parameter for Advanced OCR (Google Vision based)
    const result = await cloudinary.uploader.upload(imageUrl, {
      ocr: "adv_ocr" 
    });

    // Check if the OCR process was successful
    if (result.info && result.info.ocr && result.info.ocr.adv_ocr.status === "complete") {
      
      // Extract the full text block
      // The structure is specific to Cloudinary's response
      const fullText = result.info.ocr.adv_ocr.data[0].textAnnotations[0].description;
      
      return res.status(200).json({
        success: true,
        text: fullText,
        // rawData: result.info.ocr.adv_ocr // Uncomment if you need full data for debugging
      });

    } else {
      return res.status(200).json({
        success: false,
        text: "",
        message: "No text detected or OCR incomplete."
      });
    }

  } catch (error) {
    console.error("Cloudinary OCR Error:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process image',
      error: error.message
    });
  }
});

export default router;