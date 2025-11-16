const fs = require('fs');
const path = require('path');

// Créer les icônes SVG
const createSVGIcon = (size) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#gradient)"/>
  <text
    x="50%"
    y="50%"
    text-anchor="middle"
    dominant-baseline="middle"
    fill="white"
    font-size="${size * 0.4}"
    font-family="system-ui, -apple-system, sans-serif"
    font-weight="bold"
  >💡</text>
  <text
    x="50%"
    y="${size * 0.75}"
    text-anchor="middle"
    fill="white"
    font-size="${size * 0.12}"
    font-family="system-ui, -apple-system, sans-serif"
    font-weight="600"
  >IDEA</text>
</svg>`;
};

// Créer le dossier public s'il n'existe pas
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Générer les icônes
const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon.svg', size: 32 }
];

sizes.forEach(({ name, size }) => {
  const svgContent = createSVGIcon(size);
  const ext = path.extname(name);
  const basename = path.basename(name, ext);

  // Pour les PNG, on crée d'abord un SVG temporaire
  if (ext === '.png') {
    const svgPath = path.join(publicDir, `${basename}.svg`);
    fs.writeFileSync(svgPath, svgContent);
    console.log(`✓ Créé ${basename}.svg (temporaire)`);
  } else {
    const filePath = path.join(publicDir, name);
    fs.writeFileSync(filePath, svgContent);
    console.log(`✓ Créé ${name}`);
  }
});

console.log('\n📝 Note: Les fichiers PNG nécessitent une conversion manuelle.');
console.log('Pour l\'instant, utilisez les SVG ou convertissez-les avec un outil en ligne.');
console.log('Alternative: Utilisez https://realfavicongenerator.net/\n');
