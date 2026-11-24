const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// The native iOS tab bar only takes images, and React Native can't draw SVG
// filters (the home gauge's drop shadows), so every Figma SVG is rasterised
// here to @1x/@2x/@3x PNGs. React Native picks the right scale from the
// filename suffix. The SVGs stay in the repo as the masters.
//
// Each PNG is the size of the SVG's root width/height, which Figma sets to the
// layer's rendered bounds (shadows included). Re-run after changing an SVG:
//   npm run svgs
const DIRS = ['../src/assets/icons/nav', '../src/assets/home'];
const SCALES = [1, 2, 3];

function rootSize(svg) {
  const tag = svg.toString().match(/<svg[^>]*>/)[0];
  const width = parseFloat(tag.match(/\bwidth="([\d.]+)"/)[1]);
  const height = parseFloat(tag.match(/\bheight="([\d.]+)"/)[1]);
  return { width, height };
}

async function run() {
  for (const dir of DIRS) {
    const abs = path.join(__dirname, dir);
    for (const file of fs.readdirSync(abs).filter((f) => f.endsWith('.svg'))) {
      const name = file.replace(/\.svg$/, '');
      const svg = fs.readFileSync(path.join(abs, file));
      const { width, height } = rootSize(svg);
      for (const scale of SCALES) {
        const suffix = scale === 1 ? '' : `@${scale}x`;
        const output = path.join(abs, `${name}${suffix}.png`);
        // SVG units are points; 72 dpi renders 1pt as 1px, so scale the
        // density rather than resizing a small bitmap up.
        await sharp(svg, { density: 72 * scale })
          .resize(Math.round(width * scale), Math.round(height * scale))
          .png()
          .toFile(output);
        console.log('wrote', path.relative(process.cwd(), output));
      }
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
