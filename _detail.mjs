import { chromium } from 'playwright-core';
import fs from 'node:fs';
const FILE='file:///root/.claude/uploads/d87dc9c1-2d07-5ff9-9344-698c0eaef078/8f3c3a90-Site_Agence_LL.html';
const OUT='/tmp/claude-0/-home-user-agence-ll/d87dc9c1-2d07-5ff9-9344-698c0eaef078/scratchpad';
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await browser.newContext({viewport:{width:1440,height:1000}});
await ctx.route('**/*',async r=>{const u=r.request().url();
  if(u.startsWith('file:')||u.startsWith('data:')||u.startsWith('blob:'))return r.continue();
  try{const x=await fetch(u);r.fulfill({status:x.status,body:Buffer.from(await x.arrayBuffer()),headers:{'content-type':x.headers.get('content-type')||'application/octet-stream'}});}catch{r.abort();}});
const page=await ctx.newPage();
await page.goto(FILE,{waitUntil:'load',timeout:90000}).catch(()=>{});
await page.waitForTimeout(7000);
async function clickText(t){return page.evaluate((t)=>{const e=[...document.querySelectorAll('a,button,[role=button],li,span,div,h1,h2,h3')].find(e=>e.textContent.trim()===t&&e.offsetParent!==null);if(e){e.click();return true}return false;},t);}
// Projet détail : aller sur Projets puis cliquer un projet
await clickText('Projets'); await page.waitForTimeout(1500);
let ok=await clickText('Villa Coteaux'); if(!ok) ok=await clickText('Maison Ourcq'); if(!ok) ok=await clickText('École des Saules');
console.log('click projet:',ok); await page.waitForTimeout(2000);
await page.evaluate(()=>{const t=document.querySelector('astro-dev-toolbar');if(t)t.remove();});
await page.screenshot({path:OUT+'/d-projet-detail.png',fullPage:true});
fs.writeFileSync(OUT+'/r-projet-detail.html', await page.evaluate(()=>document.documentElement.outerHTML));
console.log('proj detail text:', (await page.evaluate(()=>document.body.innerText.slice(0,500))).replace(/\n+/g,' | '));
// Article détail : Journal puis cliquer un article
await clickText('Journal'); await page.waitForTimeout(1500);
let oa=await clickText('Grange de Brou : la charpente d’origine retrouve son rôle');
if(!oa) oa=await page.evaluate(()=>{const e=[...document.querySelectorAll('h2,h3,a')].find(e=>/Grange de Brou|charpente|isolons/.test(e.textContent)&&e.offsetParent!==null);if(e){e.click();return true}return false;});
console.log('click article:',oa); await page.waitForTimeout(2000);
await page.evaluate(()=>{const t=document.querySelector('astro-dev-toolbar');if(t)t.remove();});
await page.screenshot({path:OUT+'/d-article-detail.png',fullPage:true});
console.log('article detail text:', (await page.evaluate(()=>document.body.innerText.slice(0,500))).replace(/\n+/g,' | '));
await browser.close();
