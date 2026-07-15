import('./caseport-nextjs/src/data/index').then(m => {
  console.log('exports:', Object.keys(m).filter(k => !k.startsWith('__')));
  console.log('guidePillars type:', typeof m.guidePillars);
  console.log('guideFAQ type:', typeof m.guideFAQ);
  console.log('guides type:', typeof m.guides);
}).catch(e => { console.error('ERROR:', e.message); process.exit(1); });
