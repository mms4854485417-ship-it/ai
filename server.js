import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('./public/', import.meta.url);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
export const server = http.createServer(async (req,res) => {
  const path = new URL(req.url,'http://localhost').pathname;
  const files = {'/':'index.html','/classic':'classic.html','/style.css':'style.css','/app.js':'app.js'};
  if (!files[path]) { res.writeHead(404); res.end('Not found'); return; }
  try {
    const file=files[path]; const body=await readFile(fileURLToPath(new URL(file,root)));
    res.writeHead(200,{'Content-Type':types[file.slice(file.lastIndexOf('.'))],'X-Content-Type-Options':'nosniff'});res.end(body);
  } catch {res.writeHead(500);res.end('Unable to load page');}
});
if (process.argv[1] === fileURLToPath(import.meta.url)) server.listen(Number(process.env.PORT || 3000),'0.0.0.0',()=>console.log('추모 서비스가 포트 '+(process.env.PORT || 3000)+'에서 실행 중입니다.'));
