const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'icon.svg');

async function generateIcons() {
  console.log('🎨 Génération des icônes PWA...\n');

  const icons = [
    { size: 192, name: 'icon-192.png' },
    { size: 512, name: 'icon-512.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 16, name: 'favicon-16x16.png' },
  ];

  try {
    // Lire le SVG
    const svgBuffer = fs.readFileSync(svgPath);

    // Générer chaque icône
    for (const icon of icons) {
      const outputPath = path.join(publicDir, icon.name);

      await sharp(svgBuffer)
        .resize(icon.size, icon.size)
        .png()
        .toFile(outputPath);

      console.log(`✅ Créé: ${icon.name} (${icon.size}x${icon.size})`);
    }

    console.log('\n✨ Toutes les icônes ont été générées avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de la génération des icônes:', error.message);
    process.exit(1);
  }
}

generateIcons();
