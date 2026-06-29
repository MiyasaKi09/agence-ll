import { chromium } from 'playwright-core';
const OUT='/tmp/claude-0/-home-user-agence-ll/d87dc9c1-2d07-5ff9-9344-698c0eaef078/scratchpad';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:1440,height:1000}});
await ctx.route('**/*',async r=>{const u=r.request().url();
  if(u.includes('localhost')||u.startsWith('data:')||u.startsWith('blob:'))return r.continue();
  try{const x=await fetch(u);r.fulfill({status:x.status,body:Buffer.from(await x.arrayBuffer()),headers:{'content-type':x.headers.get('content-type')||'application/octet-stream'}});}catch{r.abort();}});
const p=await ctx.newPage();
for(const [path,name] of [['/projets/exemple-rehabilitation-thermique/','pdetail'],['/journal/partir-de-l-existant/','adetail']]){
  await p.goto('http://localhost:4321'+path,{waitUntil:'networkidle',timeout:30000}).catch(e=>console.log(name,e.message));
  await p.waitForTimeout(1500);
  await p.evaluate(()=>{const t=document.querySelector('astro-dev-toolbar');if(t)t.remove();});
  await p.screenshot({path:`${OUT}/built-${name}.png`,fullPage:true}); console.log('shot',name);
}
await b.close();
