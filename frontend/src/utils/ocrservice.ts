// src/utils/ocrService.ts

/**
 * REAL OCR SERVICE
 * Sends image URL to your Node.js backend for Cloudinary processing.
 */
export const checkImageVerification = async (imageUrl: string, keyword: string = 'verified') => {
  try {
    // Point this to your backend URL
    const response = await fetch('http://localhost:5000/api/ocr/scan-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      return { 
        success: false, 
        isVerified: false, 
        extractedText: "OCR Failed or No Text Found",
        error: data.message 
      };
    }
    
    // The backend returns the full text in `data.text`
    const fullText = data.text || "";
    
    // Perform the keyword check here
    const isFound = fullText.toLowerCase().includes(keyword.toLowerCase());

    return {
      success: true,
      isVerified: isFound,
      extractedText: fullText
    };

  } catch (error: any) {
    console.error("OCR Service Error:", error);
    return { success: false, isVerified: false, error: error.message };
  }
};