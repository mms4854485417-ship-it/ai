import { test,after,before } from 'node:test';
import assert from 'node:assert/strict';
import {server} from '../server.js';
let base;
before(async()=>{await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base='http://127.0.0.1:'+server.address().port;});
after(()=>new Promise(resolve=>server.close(resolve)));
test('추모 페이지와 필요한 정적 파일을 제공한다',async()=>{const page=await fetch(base);assert.equal(page.status,200);assert.match(await page.text(),/추모 공간 만들기/);for(const [path,type] of [['/app.js','javascript'],['/style.css','css']]){const response=await fetch(base+path);assert.equal(response.status,200);assert.match(response.headers.get('content-type'),new RegExp(type));assert.ok((await response.text()).length>100);}});
test('존재하지 않는 경로와 소스 파일을 공개하지 않는다',async()=>{for(const path of ['/server.js','/package.json','/missing'])assert.equal((await fetch(base+path)).status,404);});
