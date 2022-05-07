import path from 'path';
import compressImages from './compressImages.js';
import toPDF from './toPDF.js';

const __dirname = path.resolve(path.dirname(''));
const currentDate = new Date();
const dateFormat =
  currentDate.toLocaleDateString().replace(/\//g, '-') +
  ' ' +
  currentDate.toLocaleTimeString().replace(/:/g, '.');
const outputFolderDestination = `${__dirname}/output_${dateFormat}`;
const [imagesSourceFolderName, PDFName] = [process.argv[2], process.argv[3]];

if (!imagesSourceFolderName || !PDFName) {
  throw new Error(
    'Please insert imagesFolder (images source folder name) and PDFName (output PDF file name).'
  );
}

try {
  const compressedImages = await compressImages({
    imagesSourceFolder: `${__dirname}/${imagesSourceFolderName}`,
    outputFolderDestination,
  });
  toPDF({
    images: compressedImages,
    PDFName,
    outputFolderDestination,
  });
} catch (err) {
  console.error(err);
}
