import { readdirSync, mkdirSync, copyFileSync } from 'fs';
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';

export default async function ({
  outputFolderDestination,
  imagesSourceFolder,
}) {
  console.log('start renaming files...');

  const sortedFilesByDate = readdirSync(
    imagesSourceFolder,
    function (err, files) {
      files = files
        .map(function (fileName) {
          return {
            name: fileName,
            time: fs.statSync(dir + '/' + fileName).mtime.getTime(),
          };
        })
        .sort(function (a, b) {
          return a.time - b.time;
        })
        .map(function (v) {
          return v.name;
        });
    }
  ).filter((item) => !/(^|\/)\.[^\/\.]/g.test(item));

  sortedFilesByDate.forEach((file, i) => {
    mkdirSync(`${outputFolderDestination}/renamed_images`, { recursive: true });
    const number = i + 1;
    const fileExtension = file.split(/\./).pop().toLowerCase();
    copyFileSync(
      `${imagesSourceFolder}/${file}`,
      `${outputFolderDestination}/renamed_images/${number}.${fileExtension}`
    );
  });

  console.log('all renamed!');
  console.log('start compressing images...');

  try {
    const compressedImagesFolder = `${outputFolderDestination}/compressed_images`;
    const compressedImages = await imagemin(
      [`${outputFolderDestination}/renamed_images/*.{jpg,png,jpeg}`],
      {
        destination: compressedImagesFolder,
        plugins: [
          imageminJpegtran(),
          imageminPngquant({
            quality: [0.6, 0.8],
          }),
        ],
      }
    );

    console.log('all compressed!');
    return compressedImagesFolder;
  } catch (err) {
    console.log('Oops! Something went wrong while compressing images.');
    console.error(err);
  }
}
