/* ============================================================
   THE SMOKE SHOP — product catalog
   Prices in Zambian Kwacha (K). Edit freely.
   icon keys: vape | device | liquid | cigar | cigarette | shisha | grinder | papers | lighter
   ============================================================ */

const CATEGORIES = [
  { id:"disposables", name:"Disposable Vapes", icon:"vape",     desc:"Ready-to-use, huge flavour range" },
  { id:"devices",     name:"Devices & Pods",   icon:"device",   desc:"Kits, mods & rechargeable pods" },
  { id:"eliquids",    name:"E-Liquids & Flavours", icon:"liquid", desc:"Freebase & nic-salt juices" },
  { id:"tobacco",     name:"Cigarettes & Tobacco", icon:"cigarette", desc:"Cigarettes, HEETS & rolling tobacco" },
  { id:"cigars",      name:"Cigars",           icon:"cigar",    desc:"Premium hand-rolled cigars" },
  { id:"shisha",      name:"Shisha / Hookah",  icon:"shisha",   desc:"Hookah flavours & setups" },
  { id:"accessories", name:"Accessories",      icon:"grinder",  desc:"Grinders, papers, lighters & more" },
];

const GRADS = {
  blue:"linear-gradient(150deg,#0f6fd6,#0a2740)",
  red:"linear-gradient(150deg,#ff2d55,#3a0a15)",
  purple:"linear-gradient(150deg,#7a3cff,#1a0d33)",
  teal:"linear-gradient(150deg,#12c2b4,#062b28)",
  orange:"linear-gradient(150deg,#ff8a3c,#33170a)",
  pink:"linear-gradient(150deg,#ff5db1,#33091f)",
  green:"linear-gradient(150deg,#22c55e,#0a2a17)",
  gold:"linear-gradient(150deg,#e0b64a,#332711)",
};

const PRODUCTS = [
  // ---- Disposables ----
  { id:"ivg-800",   name:"IVG Bar 800 Puffs",        cat:"disposables", price:150, puffs:"800 puffs",  icon:"vape", grad:"blue",   tag:"hot",  desc:"Compact disposable, smooth draw, assorted flavours." },
  { id:"yuto-2000", name:"YUTO 2000 Puffs",          cat:"disposables", price:190, puffs:"2000 puffs", icon:"vape", grad:"purple",             desc:"Mid-size disposable with rich, long-lasting flavour." },
  { id:"elux-3500", name:"Elux Legend 3500 Puffs",   cat:"disposables", price:170, puffs:"3500 puffs", icon:"vape", grad:"teal",   tag:"hot",  desc:"Fan-favourite Elux with bold flavour and big clouds." },
  { id:"vape-3000", name:"Vozol 3000 Puffs",         cat:"disposables", price:240, puffs:"3000 puffs", icon:"vape", grad:"pink",               desc:"Rechargeable disposable, consistent to the last puff." },
  { id:"vape-3500", name:"Crystal Pro 3500 Puffs",   cat:"disposables", price:350, puffs:"3500 puffs", icon:"vape", grad:"orange",             desc:"Premium mesh-coil disposable, ultra-smooth." },
  { id:"vape-4500", name:"Aroma King 4500 Puffs",    cat:"disposables", price:300, puffs:"4500 puffs", icon:"vape", grad:"green",              desc:"High-capacity disposable for all-day flavour." },
  { id:"dragbar",   name:"Dragbar B5000 Puffs",      cat:"disposables", price:280, puffs:"5000 puffs", icon:"vape", grad:"red",    tag:"new",  desc:"ZOVOO Dragbar, rechargeable, mesh coil, 5K puffs." },

  // ---- Devices & Pods ----
  { id:"geek-pod",  name:"GEEKVAPE Pod Kit",         cat:"devices",     price:450, icon:"device", grad:"blue",   tag:"new",  desc:"Refillable pod system with adjustable airflow." },
  { id:"vaporesso", name:"Vaporesso XROS Kit",       cat:"devices",     price:520, icon:"device", grad:"teal",               desc:"Sleek rechargeable pod kit, great for nic-salts." },
  { id:"smok-mod",  name:"SMOK Nord Kit",            cat:"devices",     price:600, icon:"device", grad:"purple",             desc:"Powerful pod-mod with long battery life." },
  { id:"coils",     name:"Replacement Coils (5pk)",  cat:"devices",     price:120, icon:"device", grad:"gold",               desc:"Mesh replacement coils for popular pod kits." },

  // ---- E-Liquids ----
  { id:"eliq-60",   name:"Freebase E-Liquid 60ml",   cat:"eliquids",    price:130, icon:"liquid", grad:"pink",   tag:"hot",  desc:"60ml bottle, wide flavour range, 3mg/6mg." },
  { id:"saltnic",   name:"Nic-Salt E-Liquid 30ml",   cat:"eliquids",    price:110, icon:"liquid", grad:"purple",             desc:"Smooth nic-salt, perfect for pod devices." },
  { id:"shortfill", name:"Shortfill 100ml",          cat:"eliquids",    price:220, icon:"liquid", grad:"teal",               desc:"Big 100ml shortfill, premium flavour blends." },
  { id:"flavours",  name:"Flavour Concentrate 10ml", cat:"eliquids",    price:60,  icon:"liquid", grad:"orange",             desc:"DIY flavour concentrate for mixing." },

  // ---- Cigarettes & Tobacco ----
  { id:"heets",     name:"HEETS (Pack)",             cat:"tobacco",     price:90,  icon:"cigarette", grad:"gold", tag:"hot", desc:"Heated-tobacco sticks for IQOS devices." },
  { id:"cigs",      name:"Cigarettes (Carton)",      cat:"tobacco",     price:280, icon:"cigarette", grad:"red",             desc:"Popular cigarette brands, sold by carton." },
  { id:"rolling",   name:"Rolling Tobacco 30g",      cat:"tobacco",     price:120, icon:"cigarette", grad:"orange",          desc:"Fine-cut rolling tobacco pouch." },

  // ---- Cigars ----
  { id:"cigar-sgl", name:"Premium Cigar (Single)",   cat:"cigars",      price:150, icon:"cigar", grad:"gold",               desc:"Hand-rolled premium cigar, rich and smooth." },
  { id:"cigar-box", name:"Cigar Gift Box (5)",       cat:"cigars",      price:650, icon:"cigar", grad:"red",    tag:"new",  desc:"Curated box of five premium cigars." },

  // ---- Shisha / Hookah ----
  { id:"shisha-fl", name:"Shisha Flavour 50g",       cat:"shisha",      price:80,  icon:"shisha", grad:"teal",   tag:"hot", desc:"Premium hookah flavour, long-lasting sessions." },
  { id:"hookah-set",name:"Hookah Set (Complete)",    cat:"shisha",      price:750, icon:"shisha", grad:"purple",             desc:"Full hookah kit with hose, bowl & base." },
  { id:"coals",     name:"Coconut Coals (1kg)",      cat:"shisha",      price:120, icon:"shisha", grad:"blue",               desc:"Natural coconut coals, clean & long-burning." },

  // ---- Accessories ----
  { id:"raw",       name:"RAW Rolling Papers",       cat:"accessories", price:30,  icon:"papers", grad:"gold",   tag:"hot", desc:"Classic unbleached RAW papers with tips." },
  { id:"grinder",   name:"Cookies Metal Grinder",    cat:"accessories", price:150, icon:"grinder", grad:"green",             desc:"4-piece aluminium grinder, sharp teeth." },
  { id:"crusher",   name:"Herb Crusher / Grind",     cat:"accessories", price:120, icon:"grinder", grad:"purple",            desc:"Durable crusher for a fine, even grind." },
  { id:"lighter",   name:"Refillable Lighter",       cat:"accessories", price:40,  icon:"lighter", grad:"red",              desc:"Windproof refillable lighter." },
  { id:"tray",      name:"Rolling Tray",             cat:"accessories", price:90,  icon:"papers", grad:"blue",              desc:"Metal rolling tray to keep things tidy." },
];

/* ---- inline SVG icons (white) ---- */
const ICONS = {
  vape:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="20" rx="3"/><path d="M9 7h6"/><path d="M12 2v2"/></svg>`,
  device:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="3" width="10" height="18" rx="2"/><rect x="10" y="7" width="4" height="6" rx="1"/><path d="M12 3v1"/></svg>`,
  liquid:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2h4v3l3 3v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8l3-3z"/><path d="M7 13h10"/></svg>`,
  cigar:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="9" width="20" height="6" rx="2"/><path d="M18 9V7M18 17v-2"/></svg>`,
  cigarette:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="11" width="18" height="5" rx="1"/><path d="M16 11v5"/><path d="M20 6c1 1 1 2 0 3M17 6c1 1 1 2 0 3"/></svg>`,
  shisha:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v6"/><path d="M9 9h6l-1 8a2 2 0 0 1-2 2 2 2 0 0 1-2-2z"/><path d="M12 3c2 0 3 1 4 2"/></svg>`,
  grinder:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3"/><circle cx="12" cy="12" r="2"/></svg>`,
  papers:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>`,
  lighter:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="9" width="8" height="12" rx="2"/><path d="M15 12h2a2 2 0 0 0 2-2c0-2-2-3-2-5"/></svg>`,
};
