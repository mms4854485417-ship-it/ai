import { test,after,before } from 'node:test';
import assert from 'node:assert/strict';
import {server} from '../server.js';
let base;
before(async()=>{await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base='http://127.0.0.1:'+server.address().port;});
after(()=>new Promise(resolve=>server.close(resolve)));
test('추모 페이지와 필요한 정적 파일을 제공한다',async()=>{const page=await fetch(base);assert.equal(page.status,200);const html=await page.text();assert.match(html,/이 별에 도착한 편지/);assert.match(html,/id="stars-json"/);assert.match(html,/id="letter-form"/);for(const [path,type] of [['/app.js','javascript'],['/style.css','css']]){const response=await fetch(base+path);assert.equal(response.status,200);assert.match(response.headers.get('content-type'),new RegExp(type));assert.ok((await response.text()).length>100);}});
test('존재하지 않는 경로와 소스 파일을 공개하지 않는다',async()=>{for(const path of ['/server.js','/package.json','/missing'])assert.equal((await fetch(base+path)).status,404);});

test('이전 시제품을 별도 경로에서 유지한다',async()=>{const response=await fetch(base+'/classic');assert.equal(response.status,200);assert.match(await response.text(),/기억할 별 만들기/);});
