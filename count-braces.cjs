const fs = require('fs');
const data = fs.readFileSync('src/app/(frontend)/guides/[category]/[slug]/GuideArticleClient.tsx', 'utf8');
let open = 0, close = 0;
let inStr = false, strChar = '';
for(let i=0;i<data.length;i++){
  const c = data[i];
  if(!inStr && (c==='"'||c==="'".charCodeAt(0)||c==='`')) { inStr=true; strChar=c; continue; }
  if(inStr && c==='\\' && data[i+1]===strChar) { i++; continue; }
  if(inStr && c===strChar) { inStr=false; continue; }
  if(inStr) continue;
  if(c==='{') open++;
  if(c==='}') close++;
}
console.log('Open:', open, 'Close:', close, 'Diff:', open-close);