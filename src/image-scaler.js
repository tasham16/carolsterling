const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const dir = '/home/davem/dm/codebase/carolsterling/public/carol-images/photos/2021-09-18/original/'

function process_file(file_path) {

  console.log({file_path})
  const suffix = '.png'

  const filename = path.basename(file_path, suffix)

  sharp(file_path)
    .rotate()
    .resize(600, 600)
    .max()
    .toFormat('png')
    .toFile(dir + filename + '_preview.png', (err) => {
      if (err) console.log({err})
    });

  sharp(file_path)
    .rotate()
    .resize(217, 120)
    .max()
    .toFormat('png')
    .toFile(dir + filename + '_thumb.png', (err) => {
      if (err) console.log({err})
    })
}

fs.readdir(dir, (err, files) => {
  if (err)
    console.log(err)
  else
    files.forEach(file => {
      console.log(file)
      const ext = path.extname(file)
      if (ext.toLowerCase() === '.png') {
        process_file(dir + file)
      }
    });
})
