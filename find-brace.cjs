const fs = require('fs');
const data = fs.readFileSync('src/app/(frontend)/guide/[category]/[slug]/GuideArticleClient.tsx', 'utf8');
let depth = 0;
let inStr = false, strChar = '';
const lines = data.split('\n');
let report = [];
for(let i=0;i<lines.length;i++){
  const line = lines[i];
  let changes = [];
  let before = depth;
  for(let j=0;j<line.length;j++){
    const c = line[j];
    if(!inStr && (c==='"'||c==="'"||c==='`')) { inStr=true; strChar=c; continue; }
    if(inStr && c==='\\' && line[j+1]===strChar) { j++; continue; }
    if(inStr && c===strChar) { inStr=false; continue; }
    if(inStr) continue;
    if(c==='{') { depth++; changes.push('{'+depth); }
    if(c==='}') { depth--; changes.push('}'+depth); }
  }
  if(before !== depth) report.push(`Line ${i+1}: ${changes.join(',')} (was ${before}) | ${line.trim().substring(0,100)}`);
}
// show from line 1140 onwards
report.filter(r => {
  const m = r.match(/Line (\d+)/);
  return m && parseInt(m[1]) >= 1140;
}).forEach(r => console.log(r));
console.log('---');
// show where it first reaches 0 after being higher
for(let i=0;i<report.length;i++){
  const m = report[i].match(/Line (\d+):.*\(was (\d+)\)/);
  if(m && parseInt(m[2]) > 0) {
    const next = report[i+1];
    if(next && next.includes('(was 0)')) {
      console.log('First return to 0 from depth > 0:');
      console.log(report[i]);
      console.log(next);
      break;
    }
  }
}