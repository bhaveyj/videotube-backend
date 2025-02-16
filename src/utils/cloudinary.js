// import {v2 as cloudinary} from 'cloudinary';
// import fs from 'fs';
// import dotenv from 'dotenv';

// cloudinary.config({ 
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//         api_key: process.env.CLOUDINARY_API_KEY, 
//         api_secret: process.env.CLOUDINARY_API_SECRET
//     });

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null
//         // upload the file on cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         })
//         // file has been uploaded successfully
//         // console.log('File uploaded successfully on cloudinary', response.url);
//         fs.unlinkSync(localFilePath)
//         return response;
        
        
//     } catch (error) {
//         fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation failed
//         return error;
//     }
// }

// export {uploadOnCloudinary};


// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';
// import dotenv from 'dotenv';

// dotenv.config();

// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) {
//             throw new Error("No file path provided for upload.");
//         }

//         // Upload the file to Cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         });

//         // Clean up local file
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath);
//         }

//         // Return the Cloudinary response
//         return { success: true, url: response.url, response };
//     } catch (error) {
//         console.error("Error during Cloudinary upload:", error);

//         // Clean up the local file if it exists
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath);
//         }

//         return { success: false, message: "Upload failed", error };
//     }
// };

// export { uploadOnCloudinary };

// import path from 'path';


// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) {
//             throw new Error("No file path provided for upload.");
//         }

//         const absoluteFilePath = path.resolve(localFilePath);
//         if (!fs.existsSync(absoluteFilePath)) {
//             throw new Error(`File not found: ${absoluteFilePath}`);
//         }

//         // Upload the file to Cloudinary
//         const response = await cloudinary.uploader.upload(absoluteFilePath, {
//             resource_type: "auto"
//         });

//         // Clean up local file
//         fs.unlinkSync(absoluteFilePath);

//         return { success: true, url: response.url, response };
//     } catch (error) {
//         console.error("Error during Cloudinary upload:", error);

//         // Clean up the local file if it exists
//         const absoluteFilePath = path.resolve(localFilePath);
//         if (fs.existsSync(absoluteFilePath)) {
//             fs.unlinkSync(absoluteFilePath);
//         }

//         return { success: false, message: "Upload failed", error };
//     }
// };

// export { uploadOnCloudinary };


import { v2 as cloudinary } from 'cloudinary';
import { promises as fs } from 'fs';  // Use fs.promises
import dotenv from 'dotenv';
import path from 'path';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Ensure the file exists before uploading
        const absoluteFilePath = path.resolve(localFilePath);
        const fileExists = await fs.access(absoluteFilePath).then(() => true).catch(() => false);

        if (!fileExists) {
            throw new Error(`File not found: ${absoluteFilePath}`);
        }

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(absoluteFilePath, {
            resource_type: "auto"
        });

        // Remove the file after upload
        await fs.unlink(absoluteFilePath);

        return response;
    } catch (error) {
        console.error("Error during Cloudinary upload:", error);

        // Clean up the local file if it exists
        const absoluteFilePath = path.resolve(localFilePath);
        try {
            await fs.access(absoluteFilePath);
            await fs.unlink(absoluteFilePath);  // Clean up
        } catch (e) {
            console.error(`Error cleaning up file: ${absoluteFilePath}`);
        }

        return { success: false, message: "Upload failed", error };
    }
};

export { uploadOnCloudinary };

