/* ============================================================
   THE SMOKE SHOP — app logic
   Cart (localStorage) • WhatsApp checkout • Age gate • Filters
   ============================================================ */

/* >>> EDIT THIS: your WhatsApp number in full international format,
   digits only, no + or spaces. Zambia example: 260 97X XXX XXX  <<< */
const CONFIG = {
  whatsapp: "260970000000",       // <-- REPLACE with the shop's real WhatsApp number
  shopName: "The Smoke Shop",
  currency: "K",
  instagram: "https://www.instagram.com/thesmokeshop22",
  location: "Lusaka, Zambia",
};

/* ---------------- Cart state ---------------- */
const CART_KEY = "tss_cart_v1";
let cart = loadCart();

function loadCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch(e){ return {}; }
}
function saveCart(){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function findProduct(id){ return PRODUCTS.find(p => p.id === id); }
function money(n){ return CONFIG.currency + Number(n).toLocaleString(); }

function cartCount(){ return Object.values(cart).reduce((a,q)=>a+q,0); }
function cartTotal(){
  return Object.entries(cart).reduce((sum,[id,q])=>{
    const p = findProduct(id); return sum + (p ? p.price*q : 0);
  },0);
}

function addToCart(id){
  cart[id] = (cart[id]||0) + 1;
  saveCart(); updateCartUI();
  const p = findProduct(id);
  toast(`${p ? p.name : "Item"} added to cart`);
}
function setQty(id,q){
  if(q<=0){ delete cart[id]; } else { cart[id]=q; }
  saveCart(); updateCartUI(); renderCartItems();
}
function removeItem(id){ delete cart[id]; saveCart(); updateCartUI(); renderCartItems(); }

/* ---------------- Cart UI ---------------- */
function updateCartUI(){
  document.querySelectorAll(".cart-count").forEach(el=>{
    const c = cartCount();
    el.textContent = c;
    el.style.display = c ? "grid" : "none";
  });
  const totalEl = document.getElementById("cartTotal");
  if(totalEl) totalEl.textContent = money(cartTotal());
}

function renderCartItems(){
  const wrap = document.getElementById("cartItems");
  if(!wrap) return;
  const ids = Object.keys(cart);
  const foot = document.getElementById("cartFooter");
  if(ids.length === 0){
    wrap.innerHTML = `<div class="cart-empty">
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
      <p>Your cart is empty.<br>Add some products to get started.</p></div>`;
    if(foot) foot.style.display = "none";
    return;
  }
  if(foot) foot.style.display = "block";
  wrap.innerHTML = ids.map(id=>{
    const p = findProduct(id); if(!p) return "";
    const q = cart[id];
    return `<div class="cart-item">
      <div class="ci-thumb" style="background:${GRADS[p.grad]}">${ICONS[p.icon]}</div>
      <div class="ci-body">
        <h4>${p.name}</h4>
        <div class="ci-price">${money(p.price)} <span style="color:var(--muted);font-weight:400">× ${q} = ${money(p.price*q)}</span></div>
        <div class="qty">
          <button aria-label="decrease" onclick="setQty('${id}',${q-1})">−</button>
          <span>${q}</span>
          <button aria-label="increase" onclick="setQty('${id}',${q+1})">+</button>
        </div>
      </div>
      <button class="ci-remove" aria-label="remove" onclick="removeItem('${id}')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
      </button>
    </div>`;
  }).join("");
}

/* ---------------- WhatsApp checkout ---------------- */
function checkoutWhatsApp(){
  const ids = Object.keys(cart);
  if(ids.length === 0){ toast("Your cart is empty"); return; }
  let msg = `Hello ${CONFIG.shopName}! 👋 I'd like to order:\n\n`;
  ids.forEach(id=>{
    const p = findProduct(id); if(!p) return;
    msg += `• ${p.name} × ${cart[id]} — ${money(p.price*cart[id])}\n`;
  });
  msg += `\n*Total: ${money(cartTotal())}*\n\nPlease confirm availability and delivery. Thank you!`;
  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

/* ---------------- Drawer ---------------- */
function openCart(){
  renderCartItems();
  document.getElementById("cartDrawer")?.classList.add("open");
  document.getElementById("overlay")?.classList.add("open");
  document.body.classList.add("no-scroll");
}
function closeCart(){
  document.getElementById("cartDrawer")?.classList.remove("open");
  document.getElementById("overlay")?.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

/* ---------------- Toast ---------------- */
let toastTimer;
function toast(text){
  let t = document.getElementById("toast");
  if(!t){
    t = document.createElement("div"); t.id="toast"; t.className="toast";
    document.body.appendChild(t);
  }
  t.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg><span>${text}</span>`;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove("show"), 2200);
}

/* ---------------- Product rendering (shop) ---------------- */
let activeCat = "all";
let searchTerm = "";

function productCardHTML(p){
  const tag = p.tag ? `<span class="tag ${p.tag}">${p.tag}</span>` : "";
  const puffs = p.puffs ? `<span class="puffs">${p.puffs}</span>` : "";
  return `<article class="product-card" data-cat="${p.cat}" data-name="${p.name.toLowerCase()}">
    <div class="product-thumb" style="background:${GRADS[p.grad]}">
      ${puffs}${tag}
      <div class="thumb-icon">${ICONS[p.icon]}</div>
    </div>
    <div class="product-info">
      <span class="cat-label">${(CATEGORIES.find(c=>c.id===p.cat)||{}).name||p.cat}</span>
      <h3>${p.name}</h3>
      <p class="desc">${p.desc}</p>
      <div class="product-foot">
        <div class="price">${money(p.price)}</div>
        <button class="add-btn" aria-label="Add ${p.name}" onclick="addToCart('${p.id}');flashAdd(this)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
    </div>
  </article>`;
}

function flashAdd(btn){
  btn.classList.add("added");
  btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`;
  setTimeout(()=>{ btn.classList.remove("added");
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`;
  },1100);
}

function renderProducts(){
  const grid = document.getElementById("productGrid");
  if(!grid) return;
  const list = PRODUCTS.filter(p=>{
    const okCat = activeCat==="all" || p.cat===activeCat;
    const okSearch = !searchTerm || (p.name+" "+p.desc).toLowerCase().includes(searchTerm);
    return okCat && okSearch;
  });
  grid.innerHTML = list.length
    ? list.map(productCardHTML).join("")
    : `<div class="no-results">No products match your search. Try another category.</div>`;
}

function setFilter(cat, btn){
  activeCat = cat;
  document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
  if(btn) btn.classList.add("active");
  renderProducts();
}

/* build filter bar + grid on shop page */
function initShop(){
  const bar = document.getElementById("filterBar");
  if(bar){
    let html = `<button class="filter-btn active" onclick="setFilter('all',this)">All</button>`;
    CATEGORIES.forEach(c=> html += `<button class="filter-btn" onclick="setFilter('${c.id}',this)">${c.name}</button>`);
    bar.innerHTML = html;
  }
  const search = document.getElementById("searchInput");
  if(search){
    search.addEventListener("input", e=>{ searchTerm = e.target.value.toLowerCase().trim(); renderProducts(); });
  }
  // deep link e.g. shop.html#devices
  const hash = location.hash.replace("#","");
  if(hash && CATEGORIES.some(c=>c.id===hash)){
    activeCat = hash;
    const btns = [...document.querySelectorAll(".filter-btn")];
    const match = btns.find(b=>b.textContent === (CATEGORIES.find(c=>c.id===hash)||{}).name);
    if(match){ btns.forEach(b=>b.classList.remove("active")); match.classList.add("active"); }
  }
  renderProducts();
}

/* ---------------- Categories (home) ---------------- */
function renderCategories(){
  const wrap = document.getElementById("catGrid");
  if(!wrap) return;
  wrap.innerHTML = CATEGORIES.map(c=>`
    <a class="cat-card" href="shop.html#${c.id}">
      <div class="cat-icon">${ICONS[c.icon]}</div>
      <h3>${c.name}</h3>
      <p>${c.desc}</p>
      <span class="arrow"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
    </a>`).join("");
}

/* ---------------- Featured (home) ---------------- */
function renderFeatured(){
  const grid = document.getElementById("featuredGrid");
  if(!grid) return;
  const feat = PRODUCTS.filter(p=>p.tag==="hot").slice(0,4);
  grid.innerHTML = feat.map(productCardHTML).join("");
}

/* ---------------- Age gate ---------------- */
const AGE_KEY = "tss_age_ok";
function initAgeGate(){
  const gate = document.getElementById("ageGate");
  if(!gate) return;
  if(localStorage.getItem(AGE_KEY)==="1"){ gate.classList.add("hidden"); return; }
  document.body.classList.add("no-scroll");
  document.getElementById("ageYes")?.addEventListener("click",()=>{
    localStorage.setItem(AGE_KEY,"1");
    gate.classList.add("hidden");
    document.body.classList.remove("no-scroll");
  });
  document.getElementById("ageNo")?.addEventListener("click",()=>{
    window.location.href = "https://www.google.com";
  });
}

/* ---------------- Nav + reveal + WhatsApp link ---------------- */
function initChrome(){
  // mobile nav
  const burger = document.getElementById("hamburger");
  const links = document.getElementById("navLinks");
  burger?.addEventListener("click",()=>links?.classList.toggle("open"));
  links?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>links.classList.remove("open")));

  // wire whatsapp links/buttons
  const waMsg = encodeURIComponent(`Hello ${CONFIG.shopName}! I'd like to make an enquiry.`);
  document.querySelectorAll("[data-wa]").forEach(el=>{
    el.setAttribute("href", `https://wa.me/${CONFIG.whatsapp}?text=${waMsg}`);
    el.setAttribute("target","_blank");
  });
  document.querySelectorAll("[data-ig]").forEach(el=> el.setAttribute("href", CONFIG.instagram));

  // reveal on scroll (graceful fallback if IntersectionObserver is unavailable)
  if("IntersectionObserver" in window){
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target);} });
    },{threshold:.12});
    document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach(el=>el.classList.add("in"));
  }

  // contact form -> whatsapp
  const form = document.getElementById("contactForm");
  form?.addEventListener("submit", e=>{
    e.preventDefault();
    const name = form.name.value, phone = form.phone.value, message = form.message.value;
    const txt = encodeURIComponent(`Hello ${CONFIG.shopName}!\nName: ${name}\nPhone: ${phone}\n\n${message}`);
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${txt}`,"_blank");
    form.reset();
    toast("Opening WhatsApp to send your message…");
  });
}

/* ---------------- boot ---------------- */
document.addEventListener("DOMContentLoaded",()=>{
  initAgeGate();
  initChrome();
  renderCategories();
  renderFeatured();
  initShop();
  updateCartUI();

  // cart open/close wiring
  document.querySelectorAll("[data-open-cart]").forEach(b=>b.addEventListener("click",openCart));
  document.getElementById("closeCart")?.addEventListener("click",closeCart);
  document.getElementById("overlay")?.addEventListener("click",closeCart);
  document.getElementById("checkoutBtn")?.addEventListener("click",checkoutWhatsApp);
});
/* end of app.js */
