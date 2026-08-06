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
  
  // Replace card border and box-shadow
  content = content.replace(/(?:\.svc-card|\.oft-card|\.lab-acc-item)\s*\{[^}]*?border:\s*1px solid[^;]+;[^}]*?box-shadow:[^;]+;/g, (match) => {
      return match
          .replace(/border:\s*1px solid[^;]+;/, 'border: 1px solid rgba(110,231,231,0.15);')
          .replace(/box-shadow:[^;]+;/, 'box-shadow: 0 8px 24px rgba(0,0,0,0.02), 0 0 15px rgba(110,231,231,0.05);');
  });

  // Replace hover box-shadow and border-color
  content = content.replace(/(?:\.svc-card:hover|\.oft-card:hover|\.lab-acc-item:hover)\s*\{[^}]*?(?:box-shadow:[^;]+;|border-color:[^;]+;)[^}]*?(?:box-shadow:[^;]+;|border-color:[^;]+;)/g, (match) => {
      let newMatch = match.replace(/box-shadow:[^;]+;/, 'box-shadow: 0 12px 32px rgba(0,0,0,0.04), 0 0 25px rgba(110,231,231,0.1);');
      newMatch = newMatch.replace(/border-color:[^;]+;/, 'border-color: rgba(110,231,231,0.3);');
      return newMatch;
  });

  fs.writeFileSync(filePath, content);
  console.log(`Successfully updated ${file}`);
}
