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
  
  const searchStr = 'background: linear-gradient(135deg, #012a2a 0%, #018080 50%, #029fa0 100%);';
  const replaceStr = "background: url('assets/biobox-texture.svg') center/cover no-repeat, linear-gradient(135deg, #012a2a 0%, #018080 50%, #029fa0 100%);\n            background-blend-mode: soft-light;";
  
  if (content.includes(searchStr)) {
      content = content.replace(searchStr, replaceStr);
      fs.writeFileSync(filePath, content);
      console.log(`Successfully updated ${file}`);
  } else {
      console.log(`Could not find target CSS in ${file}`);
  }
}
