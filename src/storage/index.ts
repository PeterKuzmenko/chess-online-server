// Define the storage for uploaded files
import multer from 'multer';
import { staticDirectory } from '../paths';

const storage = multer.diskStorage({
  destination: staticDirectory, // Specify the directory to store the uploaded files
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = '.' + file.originalname.split('.')[1];
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Set the filename for the uploaded file
  },
});

// Create a multer instance with the storage configuration
export const uploadFile = multer({ storage });
