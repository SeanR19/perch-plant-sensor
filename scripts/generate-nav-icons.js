const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const iconsDir = path.join(__dirname, '../src/assets/icons/nav');

// The SVGs are the masters, exported from Figma (Plotted | Product Design,
// nav bar 90:1269). The native iOS tab bar only takes images, not React
// components, so each one is rasterised here at @1x/@2x/@3x. React Native picks
// the right scale from the filename suffix.
//
// The tab bar renders them in template mode, so only the alpha channel
// matters — iOS supplies the colour. Re-run after changing an SVG:
//   npm run icons:nav
const ICONS = ['house', 'plant-pot', 'calendar-check', 'notebook'];
const DISPLAY_SIZE = 23;
const SCALES = [1, 2, 3];

async function run() {
  for (const name of ICONS) {
    const svg = fs.readFileSync(path.join(iconsDir, `${name}.svg`));
    for (const scale of SCALES) {
      const suffix = scale === 1 ? '' : `@${scale}x`;
      const output = path.join(iconsDir, `${name}${suffix}.png`);
      // SVG units are points; 72 dpi renders 1pt as 1px, so scale the density
      // rather than resizing a small bitmap up.
      await sharp(svg, { density: 72 * scale })
        .resize(DISPLAY_SIZE * scale, DISPLAY_SIZE * scale)
        .png()
        .toFile(output);
      console.log('wrote', path.relative(process.cwd(), output));
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
