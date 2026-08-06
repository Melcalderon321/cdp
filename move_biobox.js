const fs = require('fs');
const path = require('path');

const files = [
  'imagenes-medicas.html',
  'laboratorio.html',
  'cardiologia.html',
  'odontologia.html',
  'oftalmologia.html'
];

for (const file of files) {
  const filePath = path.join('c:\\Users\\mcald\\Downloads\\CDP', file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const bioboxRegex = /(<!-- ==========================================\s*BIOBOX BANNER[\s\S]*?<\/section>\s*)/i;
  const bioboxMatch = content.match(bioboxRegex);
  
  if (!bioboxMatch) {
      console.log(`Could not find Biobox banner in ${file}`);
      continue;
  }
  
  const bioboxHtml = bioboxMatch[1];
  
  // Remove the bioboxHtml from content
  content = content.replace(bioboxHtml, '');
  
  // Find the CTA section
  const ctaRegex = /(<!-- ==========================================\s*CTA FINAL[\s\S]*?<section class="cta-section-new"|<section class="cta-section-new")/i;
  
  if (content.match(ctaRegex)) {
      content = content.replace(ctaRegex, bioboxHtml + '$1');
      fs.writeFileSync(filePath, content);
      console.log(`Successfully updated ${file}`);
  } else {
      console.log(`Could not find CTA section in ${file}`);
  }
}
