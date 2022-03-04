const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const categories = {
  young: {
    dir: '/Users/davem/dm/carolsterlingnet/carolsterling-node/public/carol-images/photos/young/selected/'
  },
  highschool: {
    dir: '/Users/davem/dm/carolsterlingnet/carolsterling-node/public/carol-images/photos/highschool/selected/'
  }
}

function generate_item_xml(category_name) {

  const category = categories[category_name]

  const dir = category.dir

  if (!dir) {
    throw new Error("unable to find setting for: " + category_name)

  }

  fs.readdir(dir, (err, files) => {
    if (err)
      console.log(err)
    else
      files.forEach(file => {
        const ext = path.extname(file)
        if (ext === '.JPG') {
          const filename = path.basename(file, '.JPG')
          console.log(`
        <item>
        <thumbnail>carol-images/photos/${category_name}/selected/${filename}_thumb.png</thumbnail>
        <preview>carol-images/photos/${category_name}/selected/${filename}_preview.png</preview>
        <category>${category_name}</category>
        <description>Carol Sterling conducts workshops with older adults</description>
        </item>
      `)
        }
      });
  })
}

generate_item_xml('highschool')

/*
<item>
<thumbnail>carol-images/photos/older/selected/DSCF1501_thumb.png</thumbnail>
<preview>carol-images/photos/older/selected/DSCF1501_preview.png</preview>
<category>older</category>
<description>Carol Sterling conducts workshops with older adults</description>
</item>
*/

