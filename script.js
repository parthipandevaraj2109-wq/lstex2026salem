/* =====================================================
   LS TEX SAREE SILK : script.js
   1) Edit CONFIG  2) Edit CATALOGUE  3) Keep the /images folder beside this file
   ===================================================== */
const CONFIG = {
  // International format: country code + number, NO "+", spaces or dashes. Example: 919876543210
  whatsappNumber: "919843298453",
  shopName: "LS TEX SAREE SILK",
  currency: "₹",
  previewCount: 8          // designs shown per type before "View all"
};

/* ---------- Catalogue: one block per saree type ----------
   slug   = image prefix, so images/<slug>-01.jpg, -02.jpg ...
   price  = original price, offer = offer price (INR)
   designs = optional names for each design; if empty, "Design 01, 02 ..." is used (count = number of images) */
const CATALOGUE = [
  { type:"Kanchi Silk Saree", slug:"kanchi-silk", price:1500, offer:950, count:20, fabric:"Kanchi silk",
    blurb:"Rich Kanchi-style silk with zari borders." },
  { type:"Arani Soft Silk Saree", slug:"arani-soft-silk", price:1500, offer:800, count:20, fabric:"Arani soft silk",
    blurb:"Light, soft-feel silk that is easy to drape and wear." },
  { type:"Silk Cotton Saree", slug:"silk-cotton", price:1500, offer:950, count:20, fabric:"Silk cotton",
    blurb:"Silk-cotton blend with a comfortable all-day feel." },
  { type:"Kalyani Cotton Checked Saree", slug:"kalyani", price:1500, offer:1000, fabric:"Silk cotton, checked zari",
    blurb:"Checked silk-cotton sarees with zari borders.",
    designs:["Leaf Green Checks with Deep Purple Zari Border","Emerald Teal Checks with Royal Purple Zari Border","Rust Terracotta Checks with Jet Black Zari Border","Mustard Gold Checks with Deep Plum Zari Border","Lime Olive Checks with Jet Black Zari Border","Classic Jet Black with Gold Zari Checks & Border","Peacock Teal Checks with Deep Aubergine Zari Border","Lime Yellow Checks with Purple Temple Zari Border","Rani Magenta Pink Checks with Black Zari Border","Soft Beige Grey Checks with Forest Green Copper Border"] },
  { type:"Maheshwari Cotton Saree", slug:"maheshwari", price:1000, offer:800, fabric:"Silk cotton, handloom style",
    blurb:"Handloom-style silk cotton with contrast pallus.",
    designs:["Magenta Pink & Bottle Green Pallu with Zari Buttas","Ivory White & Crimson Red Contrast Pallu","Burnt Rust Orange & Forest Green Pallu","Slate Teal Blue & Deep Maroon Contrast Pallu","Midnight Navy Blue with Silver-Gold Zari Stripes","Royal Plum Purple & Jet Black Contrast Pallu","Deep Navy Blue & Ruby Maroon Contrast Pallu","Warm Peach Coral with Gold Floral Buttas","Royal Indigo Violet & Magenta Contrast Pallu","Charcoal Black & Olive Parrot Green Contrast Pallu"] },
  { type:"Emboss Saree", slug:"emboss", price:850, offer:550, fabric:"Emboss weave",
    blurb:"Embossed weaves with zari and jacquard borders.",
    designs:["Deep Maroon & Teal Dual-Tone with Circular Zari Border","Vibrant Tangerine Orange & Plum Geometric Emboss","Berry Brown & Emerald Green Floral Emboss","Peacock Blue & Magenta Figurine Border","Charcoal Black & Ruby Pink Floral Zari Border","Cocoa Brown & Sky Blue Lotus Medallion Border","Copper Rust & Forest Green Floral Jacquard","Cerulean Blue & Crimson Peacock Motif Border","Rose Pink & Royal Violet Floral Emboss","Slate Blue & Cream Petal Emboss with Emerald Border"] },
  { type:"Poonam Saree with Blouse", slug:"poonam", price:600, offer:500, fabric:"Fancy printed, blouse included",
    blurb:"Fancy printed sarees that come with a blouse piece.",
    designs:["Forest Green with White Butterfly & Floral Print","Midnight Black & Magenta Swan Floral Digital Print","Turquoise Peacock Motif with Rani Pink Border","Rustic Coffee Brown with Pastel Floral Print","Crimson Red & White Bandhani-Butterfly Print","Mauve Wine with Peach & Ivory Rose Print","Deep Plum Purple with Monochrome Floral Print","Ruby Red with White Butterfly & Geometric Border","Olive Green & Off-White Chrysanthemum Burst Print","Brick Red & White Chrysanthemum Burst Print"] }
];
// Calculated automatically from CATALOGUE (id = "slug-01")
const PRODUCTS = CATALOGUE.flatMap(c => {
  const n = c.designs ? c.designs.length : c.count;
  return Array.from({ length: n }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    return { id:`${c.slug}-${num}`, cat:c.type, name:`${c.type.replace(" Saree","").replace(" with Blouse","")} Design ${num}`,
      fabric:c.fabric, price:c.price, offer:c.offer, img:`images/${c.slug}-${num}.jpg`,
      desc: c.designs ? c.designs[i] : `${c.blurb} Message us for more photos and colours.` };
  });
});
// Pick which designs appear in the New Arrivals / Best Sellers rows (edit the ids)
const NEW_IDS  = ["kanchi-silk-01","arani-soft-silk-01","silk-cotton-01","kalyani-01"];
const BEST_IDS = ["emboss-01","maheshwari-02","poonam-03","arani-soft-silk-05"];
const REVIEWS = [   // sample text: replace with real customer reviews
  { t:"Colours were exactly like the photos and the price was very fair. Delivery was quick.", n:"Meenakshi R., Salem" },
  { t:"Ordering on WhatsApp was so easy. They sent extra photos before I paid.", n:"Priya S., Chennai" },
  { t:"Good quality for the price. The silk cotton saree is light and I got many compliments.", n:"Anitha K., Coimbatore" }
];

/* ---------- Helpers ---------- */
const $ = s => document.querySelector(s);
const inr = n => CONFIG.currency + n.toLocaleString("en-IN");
const FALLBACK = "this.onerror=null;this.style.display='none'"; // shows the gradient behind a missing image
const byId = ids => ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

// Builds the wa.me link with a personalised, URL-encoded message
function waLink(p) {
  const text =
`Hello ${CONFIG.shopName}, I would like to order this saree:

*${p.type || p.cat} - ${p.name}*
Offer price: ${inr(p.offer)} (MRP ${inr(p.price)})
Fabric: ${p.fabric}
Details: ${p.desc}
Design code: ${p.id}

Please confirm availability and delivery details.`;
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/* ---------- Rendering ---------- */
function card(p, badge) {
  const off = Math.round((1 - p.offer / p.price) * 100);
  return `<div class="col-6 col-lg-3 reveal"><article class="card-saree">
    <div class="pimg"><img src="${p.img}" alt="${p.cat}: ${p.desc}" loading="lazy" onerror="${FALLBACK}"><span class="badge-tag">${badge || off + "% off"}</span></div>
    <div class="pbody"><h3>${p.name}</h3><span class="fabric">${p.cat}</span>
      <p class="pdesc">${p.desc}</p>
      <div class="price">${inr(p.offer)} <s class="mrp">${inr(p.price)}</s></div>
      <a class="btn btn-wa" href="${waLink(p)}" target="_blank" rel="noopener">Order on WhatsApp</a>
      <button class="btn btn-outline-gold btn-add" data-add="${p.id}" type="button">+ Add to order list</button></div></article></div>`;
}
const fill = (sel, list, badge) => { $(sel).innerHTML = list.map(p => card(p, badge)).join(""); };

function renderStatic() {
  fill("#newGrid", byId(NEW_IDS), "New");
  fill("#bestGrid", byId(BEST_IDS), "Best Seller");
  $("#categoryGrid").innerHTML = CATALOGUE.map(c => {
    const n = PRODUCTS.filter(p => p.cat === c.type).length;
    return `<div class="col-6 col-md-4 col-lg-3 reveal"><a class="cat" href="#shop" data-cat="${c.type}">
      <img src="images/${c.slug}-01.jpg" alt="${c.type}" loading="lazy" onerror="${FALLBACK}"><span>${c.type}<small>${n} designs from ${inr(c.offer)}</small></span></a></div>`;
  }).join("");
  $("#reviewGrid").innerHTML = REVIEWS.map(r => `<div class="col-md-4 reveal"><div class="review"><p>“${r.t}”</p><b>${r.n}</b></div></div>`).join("");
  $("#instaGrid").innerHTML = byId(["kanchi-silk-03","emboss-04","silk-cotton-05","kalyani-06","arani-soft-silk-07","maheshwari-08"]).map(p =>
    `<div class="col-4 col-md-2 reveal"><a class="insta" href="#" aria-label="Instagram post"><img src="${p.img}" alt="" loading="lazy" onerror="${FALLBACK}"></a></div>`).join("");
  $("#storyImg").style.backgroundImage = `url("images/silk-cotton-01.jpg")`; // swap for a shop/weaver photo
  $("#footerWa").href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent("Hello " + CONFIG.shopName + ", I need help choosing a saree.")}`;
  $("#footerWaIcon").href = $("#footerWa").href;
  $("#year").textContent = new Date().getFullYear();
}

/* ---------- Search + saree-type filters (shop is split by type) ---------- */
let activeCat = "All";
const expanded = new Set();
function renderShop() {
  const q = $("#searchInput").value.trim().toLowerCase();
  let html = "", total = 0;
  CATALOGUE.forEach(c => {
    if (activeCat !== "All" && activeCat !== c.type) return;
    const list = PRODUCTS.filter(p => p.cat === c.type && (p.name + p.fabric + p.desc + p.cat).toLowerCase().includes(q));
    if (!list.length) return;
    total += list.length;
    const showAll = activeCat !== "All" || q || expanded.has(c.type);
    const shown = showAll ? list : list.slice(0, CONFIG.previewCount);
    html += `<div class="col-12 type-head reveal"><h3>${c.type}</h3><p>${c.blurb} <b>${inr(c.offer)}</b> <s class="mrp">${inr(c.price)}</s></p></div>`;
    html += shown.map(p => card(p)).join("");
    if (shown.length < list.length)
      html += `<div class="col-12 text-center"><button class="btn btn-outline-gold more" data-more="${c.type}">View all ${list.length} ${c.type} designs</button></div>`;
  });
  $("#productGrid").innerHTML = html;
  $("#noResults").classList.toggle("d-none", total > 0);
  observe();
}
function setCat(c) {
  activeCat = c;
  document.querySelectorAll(".chip").forEach(b => b.classList.toggle("active", b.dataset.cat === c));
  renderShop();
}
function initFilters() {
  $("#filterBar").innerHTML = ["All", ...CATALOGUE.map(c => c.type)].map(c => `<button class="chip${c==="All"?" active":""}" data-cat="${c}">${c.replace(" Saree","").replace(" with Blouse","")}</button>`).join("");
  $("#filterBar").addEventListener("click", e => { if (e.target.dataset.cat) setCat(e.target.dataset.cat); });
  $("#searchInput").addEventListener("input", renderShop);
  $("#productGrid").addEventListener("click", e => { const b = e.target.closest("[data-more]"); if (b) { expanded.add(b.dataset.more); renderShop(); } });
  // Collection tiles set the filter, then the browser scrolls to #shop
  $("#categoryGrid").addEventListener("click", e => { const a = e.target.closest("[data-cat]"); if (a) setCat(a.dataset.cat); });
}

/* ---------- Order list (cart) + WhatsApp checkout ---------- */
let cart = [];   // [{ id, qty }]
try { cart = JSON.parse(localStorage.getItem("lstexCart")) || []; } catch (e) {}
const saveCart = () => { try { localStorage.setItem("lstexCart", JSON.stringify(cart)); } catch (e) {} };

function renderCart() {
  const rows = cart.map(i => ({ p: PRODUCTS.find(p => p.id === i.id), qty: i.qty })).filter(r => r.p);
  $("#cartCount").textContent = rows.reduce((s, r) => s + r.qty, 0);
  $("#cartTotal").textContent = inr(rows.reduce((s, r) => s + r.p.offer * r.qty, 0));
  $("#cartItems").innerHTML = rows.length ? rows.map(({ p, qty }) => `<div class="ci">
      <img src="${p.img}" alt=""><div><b>${p.name}</b><br>${p.cat}<br>${inr(p.offer)}</div>
      <div class="qty"><button data-q="-1" data-id="${p.id}" aria-label="Less">-</button> ${qty} <button data-q="1" data-id="${p.id}" aria-label="More">+</button></div></div>`).join("")
    : "<p>Your list is empty. Tap “Add to order list” on any saree.</p>";
  $("#checkoutBtn").disabled = !rows.length;
}
function addToCart(id) {
  const item = cart.find(i => i.id === id);
  item ? item.qty++ : cart.push({ id, qty: 1 });
  saveCart(); renderCart();
}
function changeQty(id, d) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty += d;
  cart = cart.filter(i => i.qty > 0);
  saveCart(); renderCart();
}
// Step 1: "Checkout on WhatsApp" in the order list opens the customer details form
function openDetailsForm() {
  const rows = cart.map(i => ({ p: PRODUCTS.find(x => x.id === i.id), qty: i.qty })).filter(r => r.p);
  if (!rows.length) return;
  const pieces = rows.reduce((s, r) => s + r.qty, 0);
  const total = rows.reduce((s, r) => s + r.p.offer * r.qty, 0);
  $("#orderSummary").innerHTML = `<b>${pieces}</b> saree${pieces > 1 ? "s" : ""} (${rows.length} design${rows.length > 1 ? "s" : ""}) &middot; Total <b>${inr(total)}</b>`;
  const panel = bootstrap.Offcanvas.getInstance($("#cartPanel"));
  if (panel) panel.hide();
  bootstrap.Modal.getOrCreateInstance($("#detailsModal")).show();
}

// Step 2: loop through cart items, build ONE message (customer details + saree list), encode it, open WhatsApp
function checkout(c) {
  let total = 0, pieces = 0;
  const lines = cart.map((i, n) => {
    const p = PRODUCTS.find(x => x.id === i.id);
    if (!p) return "";
    total += p.offer * i.qty; pieces += i.qty;
    return `${n + 1}. ${p.cat} - ${p.name} (${p.id})\n   ${p.desc}\n   Qty: ${i.qty} x ${inr(p.offer)} = ${inr(p.offer * i.qty)}`;
  }).filter(Boolean);
  const text =
`*New Order - ${CONFIG.shopName}*

*Customer Details*
Name: ${c.name}
Mobile: ${c.phone}
Email: ${c.email || "-"}
Address: ${c.address}
${c.note ? "Note: " + c.note + "\n" : ""}
*Saree List*
${lines.join("\n\n")}

*Total sarees: ${pieces}* (${lines.length} design${lines.length > 1 ? "s" : ""})
*Total amount: ${inr(total)}*

Please confirm availability and delivery charges.`;
  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
}

// Validate the details form, then send
$("#detailsForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target;
  f.classList.add("was-validated");
  if (!f.checkValidity()) return;
  const v = id => $(id).value.trim();
  checkout({ name: v("#cName"), phone: "+91 " + v("#cPhone"), email: v("#cEmail"), address: v("#cAddress"), note: v("#cNote") });
  bootstrap.Modal.getInstance($("#detailsModal")).hide();
});

document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]"); if (add) addToCart(add.dataset.add);
  const q = e.target.closest("[data-q]"); if (q) changeQty(q.dataset.id, +q.dataset.q);
  if (e.target.id === "checkoutBtn") openDetailsForm();
});

/* ---------- Scroll reveal + mobile menu auto-close ---------- */
let io;
function observe() {
  io = io || new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll(".reveal:not(.show)").forEach(el => io.observe(el));
}
document.addEventListener("click", e => {
  if (e.target.closest(".nav-link")) {
    const m = $("#menu");
    if (m.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(m).hide();
  }
});

renderStatic();
renderCart();
initFilters();
renderShop();
observe();
