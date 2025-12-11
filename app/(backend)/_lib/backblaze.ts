import "server-only"

const B2 = require("backblaze-b2");

const b2 = new B2({
  applicationKeyId: process.env.B2_APPLICATION_KEY_ID || "",
  applicationKey: process.env.B2_APPLICATION_KEY || "",
});

// Authenticate
async function init() {
  await b2.authorize();
  console.log("Authorized!");
}

// Upload a file
async function uploadFile(file: File) {
  try {
    // Initialize auth first
    await init();

    if (!file) {
      throw new Error("File is required");
    }
    console.log("Uploading file:", file.name);
    // Get upload URL for your bucket
    const uploadUrlResponse = await b2.getUploadUrl({
      bucketId: process.env.B2_BUCKET_ID || "",
    });

    console.log("Upload URL:", uploadUrlResponse);

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    
    const uploadResponse = await b2.uploadFile({
      uploadUrl: uploadUrlResponse.data.uploadUrl,
      uploadAuthToken: uploadUrlResponse.data.authorizationToken,
      fileName: "restaurant/menu-image.jpg",
      data: fileBuffer,
    });

    console.log("Uploaded file:", uploadResponse);
    return uploadResponse;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

async function deleteFile(fileName: string, fileId: string) {
  try {
    // Initialize auth first
    await init();

    if (!fileName || !fileId) {
      throw new Error("File name and file id are required");
    }

    const deleteResponse = await b2.deleteFile({
      fileName: fileName,
      fileId: fileId,
    });
    console.log("Deleted file:", deleteResponse.data.fileName);
    return deleteResponse.data;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

const Bucket = {
  uploadFile,
  deleteFile,
};



export default Bucket;