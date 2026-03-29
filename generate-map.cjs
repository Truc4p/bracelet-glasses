const fs = require('fs');
const path = require('path');

const map = {};
const mapping = {
  'BLACK_OUT': 'black-out',
  'Blonde_Clear': 'blonde-clear',
  'Light_Grey': 'light-grey',
  'TORTOISE_OUT': 'tortoise-out'
};

const lensColorIds = [
  'amber', 'american-grey-fade', 'aqua-sunrise', 'bel-air-blue', 'big-apple-fade', 'blonde', 'broadway-blue-fade', 'cabernet', 'candy-corn', 'celebrity-blue', 'chestnut-fade', 'city-lights', 'denim-blue', 'forest-wood', 'g-15-fade', 'garnet-green', 'lavender', 'light-grey', 'limelight', 'matte-black', 'mellow-yellow', 'new-york-rose', 'pastel-yellow', 'purple-nurple', 'root-beer-fade', 'tortoise', 'turquoise', 'woodstock-orange'
];

function norm(s) { return s.toLowerCase().replace(/[^a-z0-9]/g, ''); }

Object.keys(mapping).forEach(dir => {
  const frame = mapping[dir];
  map[frame] = {};
  const dirPath = path.join(__dirname, 'public/glasses/shaded-glasses', dir);
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);
  lensColorIds.forEach(colorId => {
    let best = null;
    let nColorId = norm(colorId);
    
    for (const f of files) {
      if (norm(f).includes(nColorId)) { best = f; break; }
    }
    if (!best) {
      const parts = colorId.split('-');
      for (const f of files) {
        if (parts.every(p => norm(f).includes(norm(p)))) { best = f; break; }
      }
    }
    
    if (colorId === 'mellow-yellow' && dir === 'TORTOISE_OUT') best = 'Tortoise_Mellolw_Yellow_OUT.jpg';
    if (colorId === 'woodstock-orange' && dir === 'Light_Grey') best = 'Light_Grey_Woodstock_OUT.png';
    if (colorId === 'bel-air-blue') best = files.find(f => norm(f).includes('belair'));
    if (colorId === 'g-15-fade') best = files.find(f => norm(f).includes('g15'));
    
    map[frame][colorId] = best ? `/glasses/shaded-glasses/${dir}/${best}` : null;
  });
});

fs.writeFileSync(path.join(__dirname, 'backend/shadeMap.json'), JSON.stringify(map, null, 2));
console.log('done');
