/* ============================================================
   THE SMOKE SHOP — shared data layer (store.js)
   localStorage-backed. Used by the storefront AND the admin area.
   NOTE: this is a front-end store for a static site. The login is a
   convenience gate, not real security, and data lives in this browser.
   ============================================================ */

const CATALOG_KEY = "tss_catalog";
const SALES_KEY   = "tss_sales";
const AUTH_KEY    = "tss_admin_auth";   // session flag
const PASS_KEY    = "tss_admin_pass";   // hashed passcode
const DEFAULT_PASS = "admin1234";       // <-- change this on first login (Settings)
const LOW_STOCK   = 10;                  // low-stock threshold

/* ---- tiny non-crypto hash (obfuscation only) ---- */
function _hash(s){ let h=5381; for(let i=0;i<s.length;i++){ h=((h<<5)+h)+s.charCodeAt(i); h|=0; } return String(h>>>0); }

/* ---------------- Catalog ---------------- */
function seedCatalog(){
  // PRODUCTS comes from products.js; add cost (est. 60% of price) + starting stock
  return (typeof PRODUCTS!=="undefined"?PRODUCTS:[]).map(p=>({
    ...p,
    cost: Math.round(p.price*0.6),
    stock: 40
  }));
}
function getCatalog(){
  try{ const c=JSON.parse(localStorage.getItem(CATALOG_KEY)); if(Array.isArray(c)&&c.length) return c; }catch(e){}
  return seedCatalog();
}
function saveCatalog(list){ localStorage.setItem(CATALOG_KEY, JSON.stringify(list)); }
function ensureCatalog(){ if(!localStorage.getItem(CATALOG_KEY)) saveCatalog(seedCatalog()); return getCatalog(); }
function getProductById(id){ return getCatalog().find(p=>p.id===id); }
function upsertProduct(prod){
  const cat=getCatalog(); const i=cat.findIndex(p=>p.id===prod.id);
  if(i>=0) cat[i]={...cat[i],...prod}; else cat.push(prod);
  saveCatalog(cat); return cat;
}
function deleteProduct(id){ saveCatalog(getCatalog().filter(p=>p.id!==id)); }
function adjustStock(id, delta){
  const cat=getCatalog(); const p=cat.find(x=>x.id===id);
  if(p){ p.stock=Math.max(0,(p.stock||0)+delta); saveCatalog(cat); }
}

/* ---------------- Sales ---------------- */
function getSales(){ try{ return JSON.parse(localStorage.getItem(SALES_KEY))||[]; }catch(e){ return []; } }
function saveSales(s){ localStorage.setItem(SALES_KEY, JSON.stringify(s)); }
function recordSale(items, channel){
  // items: [{id, qty}]
  const cat=getCatalog();
  const lines=items.map(it=>{
    const p=cat.find(x=>x.id===it.id)||{};
    return { id:it.id, name:p.name||it.id, qty:it.qty, price:p.price||0, cost:p.cost||0 };
  }).filter(l=>l.qty>0);
  if(!lines.length) return null;
  const total=lines.reduce((s,l)=>s+l.price*l.qty,0);
  const sale={ id:"S"+Date.now(), ts:Date.now(), items:lines, total, channel:channel||"online" };
  const sales=getSales(); sales.push(sale); saveSales(sales);
  // decrement stock
  lines.forEach(l=>{ const p=cat.find(x=>x.id===l.id); if(p) p.stock=Math.max(0,(p.stock||0)-l.qty); });
  saveCatalog(cat);
  return sale;
}
function deleteSale(id){
  const sales=getSales(); const s=sales.find(x=>x.id===id);
  if(s){ s.items.forEach(l=>adjustStock(l.id, l.qty)); } // restock
  saveSales(sales.filter(x=>x.id!==id));
}

/* ---------------- Auth (front-end gate only) ---------------- */
function getPassHash(){ return localStorage.getItem(PASS_KEY) || _hash(DEFAULT_PASS); }
function checkPass(p){ return _hash(p)===getPassHash(); }
function setPass(p){ localStorage.setItem(PASS_KEY, _hash(p)); }
function usingDefaultPass(){ return !localStorage.getItem(PASS_KEY); }
function adminLogin(p){ if(checkPass(p)){ sessionStorage.setItem(AUTH_KEY,"1"); return true; } return false; }
function adminLogout(){ sessionStorage.removeItem(AUTH_KEY); }
function isLoggedIn(){ return sessionStorage.getItem(AUTH_KEY)==="1"; }
function requireAuth(redirect){ if(!isLoggedIn()){ window.location.href = redirect||"admin.html"; return false; } return true; }

/* ---------------- Analytics ---------------- */
function analytics(){
  const sales=getSales(), cat=getCatalog();
  const revenue=sales.reduce((s,x)=>s+x.total,0);
  const cogs=sales.reduce((s,x)=>s+x.items.reduce((a,l)=>a+l.cost*l.qty,0),0);
  const profit=revenue-cogs;
  const orders=sales.length;
  const units=sales.reduce((s,x)=>s+x.items.reduce((a,l)=>a+l.qty,0),0);
  const aov=orders?revenue/orders:0;
  const invValue=cat.reduce((s,p)=>s+(p.cost||0)*(p.stock||0),0);   // stock at cost
  const invRetail=cat.reduce((s,p)=>s+(p.price||0)*(p.stock||0),0); // stock at retail
  const potentialMargin=invRetail-invValue;
  const lowStock=cat.filter(p=>(p.stock||0)<=LOW_STOCK);
  const outStock=cat.filter(p=>(p.stock||0)===0);
  return { revenue, cogs, profit, orders, units, aov,
           marginPct: revenue?profit/revenue:0,
           invValue, invRetail, potentialMargin,
           lowStock, outStock, skuCount:cat.length };
}
/* revenue grouped by day for last N days -> {labels:[], data:[]} */
function revenueByDay(days){
  days=days||14; const sales=getSales();
  const today=new Date(); today.setHours(0,0,0,0);
  const labels=[], data=[], keys=[];
  for(let i=days-1;i>=0;i--){
    const d=new Date(today); d.setDate(d.getDate()-i);
    keys.push(d.getTime());
    labels.push(d.toLocaleDateString(undefined,{month:"short",day:"numeric"}));
    data.push(0);
  }
  sales.forEach(s=>{ const d=new Date(s.ts); d.setHours(0,0,0,0);
    const idx=keys.indexOf(d.getTime()); if(idx>=0) data[idx]+=s.total; });
  return { labels, data };
}
/* units sold grouped by category -> {labels, data} */
function salesByCategory(){
  const sales=getSales(); const map={};
  const catName=id=>{ const p=getProductById(id); const c=(typeof CATEGORIES!=="undefined")&&CATEGORIES.find(x=>x.id===(p&&p.cat)); return c?c.name:(p&&p.cat)||"Other"; };
  sales.forEach(s=>s.items.forEach(l=>{ const k=catName(l.id); map[k]=(map[k]||0)+l.qty; }));
  return { labels:Object.keys(map), data:Object.values(map) };
}
/* top products by units -> [{name, units, revenue}] */
function topProducts(n){
  n=n||5; const sales=getSales(); const map={};
  sales.forEach(s=>s.items.forEach(l=>{
    if(!map[l.id]) map[l.id]={name:l.name,units:0,revenue:0};
    map[l.id].units+=l.qty; map[l.id].revenue+=l.price*l.qty;
  }));
  return Object.values(map).sort((a,b)=>b.units-a.units).slice(0,n);
}

/* ---------------- Data export / reset ---------------- */
function exportData(){ return JSON.stringify({ catalog:getCatalog(), sales:getSales() }, null, 2); }
function resetSales(){ saveSales([]); }
function resetAll(){ localStorage.removeItem(SALES_KEY); localStorage.removeItem(CATALOG_KEY); }
