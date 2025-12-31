export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append(
    'upload_preset',
    'FE-upload'
  );

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dmrgk9bbe/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error('Cloudinary upload failed');
  }

  const data = await res.json();

  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
};
