import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CERT_DIR = path.join(__dirname, '../public/certifications');
const THUMB_DIR = path.join(CERT_DIR, 'thumbnails');

// Ensure thumbnails directory exists
if (!fs.existsSync(THUMB_DIR)) {
  fs.mkdirSync(THUMB_DIR, { recursive: true });
}

console.log('--- Generador de Miniaturas de Certificados ---');
console.log(`Buscando PDFs en: ${CERT_DIR}`);
console.log(`Guardando miniaturas en: ${THUMB_DIR}\n`);

try {
  // Check if pdftoppm is available
  execSync('which pdftoppm');
} catch (e) {
  console.error('Error: "pdftoppm" no está instalado en el sistema. Instálelo usando "apt-get install poppler-utils"');
  process.exit(1);
}

const files = fs.readdirSync(CERT_DIR);
const pdfFiles = files.filter(file => file.endsWith('.pdf'));

console.log(`Se encontraron ${pdfFiles.length} archivos PDF.`);

let successCount = 0;
let skippedCount = 0;
let errorCount = 0;

pdfFiles.forEach((file, index) => {
  const pdfPath = path.join(CERT_DIR, file);
  // Remove spaces and special characters for output name
  const safeBaseName = path.basename(file, '.pdf').replace(/\s+/g, '_');
  const outPath = path.join(THUMB_DIR, safeBaseName);
  const finalPngPath = `${outPath}.png`;

  console.log(`[${index + 1}/${pdfFiles.length}] Procesando: ${file}...`);

  if (fs.existsSync(finalPngPath)) {
    console.log(`  -> Miniatura existente. Omitiendo.`);
    skippedCount++;
    return;
  }

  try {
    // Render only first page (-f 1 -l 1), resolution 120 DPI (-r 120), single file output
    const cmd = `pdftoppm -png -f 1 -l 1 -r 120 -singlefile "${pdfPath}" "${outPath}"`;
    execSync(cmd, { stdio: 'ignore' });
    console.log(`  -> ¡Miniatura creada con éxito!`);
    successCount++;
  } catch (err) {
    console.error(`  -> Error generando miniatura para ${file}:`, err.message);
    errorCount++;
  }
});

console.log('\n--- Resumen de Ejecución ---');
console.log(`Completados: ${successCount}`);
console.log(`Omitidos: ${skippedCount}`);
console.log(`Errores: ${errorCount}`);
console.log('---------------------------');
