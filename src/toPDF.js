import fs from 'fs';
import PDFDocument from 'pdfkit';

export default function toPDF({ outputFolderDestination, PDFName }) {
  const size = [1280, 720];
  fs.mkdirSync(`${outputFolderDestination}/pdf`, { recursive: true });
  const fileName = `${PDFName}.pdf`;

  const doc = new PDFDocument({ size, margin: 0 });

  // Pipe its output somewhere, like to a file or HTTP response
  // See below for browser usage

  doc.pipe(fs.createWriteStream(`${outputFolderDestination}/pdf/${fileName}`));

  /**
   * Get all file names and
   * remove hidden files from the list.
   */
  const images = fs
    .readdirSync(`${outputFolderDestination}/compressed_images`)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((fileName) => {
      const splitted = fileName.split('.');
      return {
        name: Number(splitted[0]),
        fileExtension: splitted[1],
      };
    })
    .sort((a, b) => a.name - b.name);

  console.log('start ...');

  images.forEach((image, i) => {
    doc.image(
      `${outputFolderDestination}/compressed_images/${image.name}.${image.fileExtension}`,
      {
        fit: size,
        align: 'center',
        valign: 'center',
      }
    );

    const currentPage = i + 1;
    console.log(`page ${currentPage} done`);

    const isLastPage = currentPage !== images.length;
    if (isLastPage) {
      doc.addPage();
    }
  });

  doc.end();

  console.log('all done!');
}
