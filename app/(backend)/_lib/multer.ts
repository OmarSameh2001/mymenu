import { NextRequest } from "next/server";

const multer = require('multer');
const { format } = require('date-fns');
const fs = require('fs');

interface MulterFile {
    mimetype: string;
    originalname: string;
}
class MulterClient {
  date: Date;
  basePath: string;

  // initialize date and base local path
  constructor(basePath = './upload/') {
    this.date = format(new Date(Date.now()), 'yyyy-MM-dd_HH.mm.ss').toString();
    this.basePath = basePath;
  }

  // define file filer (accepted types)
  // (ex: application/pdf, images/) = (accept pdf and all image types)
  fileFilter = (filters: string[]) => {
    return (req: NextRequest, file: MulterFile, cb: any) => {
      // Check if the file's MIME type matches any of the filters
      const matches = filters.some(filter => file.mimetype.startsWith(filter));
  
      if (matches) {
        cb(null, true);
      } else {
        const expectedTypes = filters.join(', ');
        cb(new Error(`File type ${file.mimetype} does not match any of the expected types: ${expectedTypes}`), false);
      }
    };
  };
  

  // define storage config
  // (ex: filepath = './uploads/users')
  storageConfig(filePath: string) {
    return multer.diskStorage({
      destination: (req: NextRequest, file: MulterFile, cb: any) => {
        const dir = filePath
        
        // Check if directory exists, if not, create it
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
  
        cb(null, dir);
      },
      filename: (req: NextRequest, file: MulterFile, cb: any) => {
        cb(null, this.date + '-' + file.originalname);
      }
    });
  }

  // the main module
  // can have dynamic filters, path, and fields
  upload(filePath: string, fields: any, filter: string[]) {
    const storage = this.storageConfig(filePath);
    const fileFilter = this.fileFilter(filter);

    return multer({ storage: storage, fileFilter: fileFilter }).fields(fields);
  }
}


const multerService = new MulterClient();

// Define employeeImage as middleware function
const createUserFiles = (req:NextRequest) => {
  
  // (filePath, fields, filter)
  multerService.upload(
    './uploads/user/images/', // could be dynamic {`./uploads/${req.body.name}/images`} or temporary like (os.tmpdir())   
    [
      { name: 'logo', maxCount: 1 },
      { name: 'images', maxCount: 1 },
    ],
    ['image/']
  )
  return req;
};

export { createUserFiles, multerService };