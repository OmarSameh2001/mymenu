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
export async function uploadFile(filePath: string, fileName: string) {
  try {
    // Initialize auth first
    await init();

    if (!filePath || !fileName) {
      throw new Error("File path and file name are required");
    } else if (!fileName) {
      fileName = filePath.split("/").pop() || "unnamed-file";
    }

    // Get upload URL for your bucket
    const uploadUrlResponse = await b2.getUploadUrl({
      bucketId: process.env.B2_BUCKET_ID || "",
    });

    // Upload the file
    const fs = require("fs");
    const fileBuffer = fs.readFileSync("menu-image.jpg");

    const uploadResponse = await b2.uploadFile({
      uploadUrl: uploadUrlResponse.data.uploadUrl,
      uploadAuthToken: uploadUrlResponse.data.authorizationToken,
      fileName: "restaurant/menu-image.jpg",
      data: fileBuffer,
    });

    console.log("Uploaded file:", uploadResponse.data.fileName);
    return uploadResponse.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function deleteFile(fileName: string, fileId: string) {
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
