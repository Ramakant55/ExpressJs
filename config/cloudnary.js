const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,       
    api_secret: process.env.CLOUDINARY_API_SECRET  
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'avatars',
                width: 500,
                height: 500,
                crop: 'fill'
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        const bufferStream = require('stream').Readable.from(buffer);
        bufferStream.pipe(uploadStream);
    });
};

// Helper function to delete from Cloudinary
const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(`avatars/${publicId}`);
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
};

module.exports = {
    cloudinary,
    uploadToCloudinary,
    deleteFromCloudinary
};
