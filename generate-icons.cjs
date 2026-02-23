const sharp = require('sharp');
const fs = require('fs');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

if (!fs.existsSync('./public/icons')) {
  fs.mkdirSync('./public/icons', { recursive: true });
}

sizes.forEach(size => {
  sharp('./public/TrustLogo.png')
    .resize(size, size)
    .toFile(`./public/icons/icon-${size}x${size}.png`, (err) => {
      if (err) console.error(`❌ Error ${size}x${size}:`, err);
      else console.log(`✅ icon-${size}x${size}.png generated`);
    });
});