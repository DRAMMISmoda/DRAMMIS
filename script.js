/* ===================================================
   DRAMMIS — interactions & shop
   =================================================== */
(function () {
  'use strict';

  /* ---------- IMAGE HELPER ---------- */
  const IMG = (id, w) => {
    if (!id) return '';
    return /^assets\//.test(id) ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w || 900}&q=80`;
  };

  /* ---------- PRODUCT DATA — cinture ---------- */
  let _id = 0;
  const P = (o) => {
    const id = 'p' + ++_id;
    return Object.assign({
      id,
      sizes: ['90', '95', '100', '105', '110'],
      colors: ['Nero', 'Cognac', 'Testa di Moro'],
      stock: 14, lim: false,
      specs: [['Materiale', 'Pelle pieno fiore italiana'], ['Fibbia', 'Ottone brunito'], ['Codice', id.toUpperCase()], ['Origine', 'Made in Italy']],
    }, o);
  };

  const products = {
    street: [
      P({ name:'Street Black Belt LUMA Buckle', cat:'Street', price:'€150', tag:'Nuovo', img:'assets/products/street-nera.jpg', gallery:['1624222247344-550fb60583dc','1629958513881-a086d21383cd'], colors:['Nero'], pair:{img:'assets/products/street-bianca.jpg',color:'Bianco'}, specs:[['Materiale','Pelle crust artigianale'],['Fibbia','Zamak'],['Codice','STREETBLK'],['Origine','Made in Italy']], desc:'Cintura in pelle crust artigianale con fibbia LUMA in zamak. Costruzione robusta, anima urbana. Made in Italy.' }),
      P({ name:'Street White Belt LUMA Buckle', cat:'Street', price:'€150', img:'assets/products/street-bianca.jpg', gallery:['1679759022456-a7eae2257ba2','1611858288848-8d864a7a8738'], colors:['Bianco'], pair:{img:'assets/products/street-nera.jpg',color:'Nero'}, specs:[['Materiale','Pelle crust artigianale'],['Fibbia','Zamak'],['Codice','STREETWHT'],['Origine','Made in Italy']], desc:'Cintura in pelle crust artigianale con fibbia LUMA in zamak. Costruzione robusta, anima urbana. Made in Italy.' }),
      P({ name:'Canvas Studs',      cat:'Street', price:'€165', tag:'Icona', lim:true, stock:5, img:'1631160246898-58192f971b5f', gallery:['1635100299010-0410d7434a93','1642166900939-4f6b9db890ca'], colors:['Nero','Indaco'], desc:'Cintura in canvas rinforzato con borchie applicate a mano e fibbia scultorea. Un pezzo che segna il carattere.' }),
      P({ name:'Metro Reversibile', cat:'Street', price:'€195', img:'1665573708655-7320ed78bbeb', gallery:['1664285612706-b32633c95820','1644258676710-ffb99d7d7a1b'], colors:['Nero','Kaki'], desc:'Cintura reversibile in pelle e nylon tecnico. Due anime, un solo gesto per cambiarle.' }),
    ],
    luxo: [
      P({ name:'Luxo Black Belt MM Monogram', cat:'Luxo', price:'€250', tag:'Icona', lim:true, stock:6, img:'assets/products/luxo-nera.jpg', gallery:['1637868796504-32f45a96d5a0','1531188929123-0cfa61e6c770'], colors:['Nero'], pair:{img:'assets/products/luxo-bianca.jpg',color:'Bianco'}, specs:[['Materiale','Pelle canvas artigianale'],['Fibbia','Zamak'],['Codice','LUXOBLK'],['Origine','Made in Italy']], desc:'Cintura in pelle canvas artigianale con monogramma MM e fibbia in zamak. L’essenza dell’alta manifattura. Made in Italy.' }),
      P({ name:'Luxo White Belt MM Monogram', cat:'Luxo', price:'€250', lim:true, stock:3, img:'assets/products/luxo-bianca.jpg', gallery:['1684510334550-0c4fa8aaffd1','1543331904-0369ab9e25f3'], colors:['Bianco'], specs:[['Materiale','Pelle canvas artigianale'],['Fibbia','Zamak'],['Codice','LUXOWHT'],['Origine','Made in Italy']], desc:'Cintura in pelle canvas artigianale con monogramma MM e fibbia in zamak. L’essenza dell’alta manifattura. Made in Italy.' }),
      P({ name:'Sovrana',    cat:'Luxo', price:'€720', tag:'Nuovo', img:'1711443982852-b3df5c563448', gallery:['1664286022075-8e997e95bd17','1717156816269-89f5f968db8b'], colors:['Nero','Cammello'], desc:'Cintura in vitello pieno fiore con fibbia scultorea firmata. Una silhouette che non passa inosservata.' }),
      P({ name:'Héritage',   cat:'Luxo', price:'€580', img:'1705493655920-20c572928501', gallery:['1664286074240-d7059e004dff','1628483211662-9bcc692c46dc'], colors:['Nero','Cognac','Panna'], desc:'Cintura senza tempo in pelle vacchetta conciata al vegetale. L’essenziale della maison, per sempre.' }),
    ],
  };

  const ALL = {};
  Object.values(products).flat().forEach((p) => (ALL[p.id] = p));

  /* ---------- ENTRY DEDICATA AL BOX LUNGO STREET — foto editoriale nero+bianco insieme ---------- */
  const streetDuo = Object.assign({}, products.street[0], {
    id: 'streetDuo',
    name: 'Street Belt LUMA Buckle',
    colors: ['Nero', 'Bianco'],
    cartId: products.street[0].id,
    heroDuo: { mobile: 'assets/products/street-duo-official.jpg', desktop: 'assets/products/street-duo-official-desktop.jpg' },
    duoVariants: [
      { key: 'duo', label: 'Nero e Bianco', price: '€300', swatch: 'linear-gradient(135deg,#141414 50%,#f4f4f0 50%)' },
      { key: 'white', label: 'Bianco', price: '€150', swatch: '#f4f4f0', img: 'assets/products/street-bianca-official.jpg', imgDesktop: 'assets/products/street-bianca-official-desktop.jpg', cartId: products.street[1].id },
      { key: 'black', label: 'Nero', price: '€150', swatch: '#141414', img: 'assets/products/street-nera-official.jpg', imgDesktop: 'assets/products/street-nera-official-desktop.jpg', cartId: products.street[0].id },
    ],
  });
  delete streetDuo.pair;
  ALL[streetDuo.id] = streetDuo;

  /* ---------- SHOP STATE (localStorage) ---------- */
  const store = {
    cart: load('dr_cart', []),
    save() {
      localStorage.setItem('dr_cart', JSON.stringify(this.cart));
    },
  };
  function load(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }

  /* ---------- ACCOUNT — autenticazione reale via Supabase Auth ---------- */
  const supa = window.supabase.createClient(
    'https://lyflfedxiosvayxjttzt.supabase.co',
    'sb_publishable_QDVY9dfdfWN6hmPbcY2YiQ_u990NtPE'
  );
  let authSession = null;
  let authMode = 'login'; // 'login' | 'register' | 'forgot' | 'recovery'
  const AUTH_ERRORS = {
    'Invalid login credentials': 'Email o password non corrette.',
    'User already registered': 'Esiste già un account con questa email — prova ad accedere.',
    'Password should be at least 6 characters': 'La password deve avere almeno 6 caratteri.',
  };
  const authErrorText = (err) => (err && (AUTH_ERRORS[err.message] || err.message)) || 'Si è verificato un errore. Riprova.';
  function currentUser() {
    if (!authSession) return null;
    const u = authSession.user;
    return { id: u.id, email: u.email, firstname: (u.user_metadata && u.user_metadata.firstname) || u.email.split('@')[0] };
  }
  supa.auth.onAuthStateChange((event, sess) => {
    authSession = sess;
    if (event === 'PASSWORD_RECOVERY') { authMode = 'recovery'; goTo('account'); }
    if (document.querySelector('.view--active') && document.querySelector('.view--active').dataset.view === 'account') renderAccount();
  });

  const priceNum = (s) => parseInt(String(s).replace(/[^\d]/g, ''), 10) || 0;
  const euro = (n) => '€' + n.toLocaleString('it-IT');
  const cartQtyTotal = () => store.cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = () => store.cart.reduce((s, i) => s + priceNum(ALL[i.id].price) * i.qty, 0);
  const shippingCost = () => (subtotal() >= 500 || store.cart.length === 0 ? 0 : 15);

  function addToCart(id, size, color, qty) {
    if (!ALL[id]) return false; // guardia: evita un crash se il pulsante viene premuto prima che la scheda prodotto sia pronta
    const max = ALL[id].stock;
    const line = store.cart.find((i) => i.id === id && i.size === size && i.color === color);
    const already = line ? line.qty : 0;
    const next = Math.min(max, already + qty);
    if (line) line.qty = next; else if (next > 0) store.cart.push({ id, size, color, qty: next });
    store.save(); updateBadges();
    return next > already;
  }
  function updateBadges() {
    const c = document.getElementById('cartCount');
    if (c) { c.textContent = cartQtyTotal(); c.classList.toggle('is-empty', cartQtyTotal() === 0); }
  }

  /* ---------- CARD BUILDER (editorial) ---------- */
  function card(p) {
    const el = document.createElement('article');
    el.className = 'card';
    el.dataset.product = p.id;
    const flag = p.lim ? `<span class="card__tag card__tag--ltd">Limited edition</span>` : '';
    el.innerHTML = `
      <div class="card__media">
        ${flag}
        <div class="card__img" role="img" aria-label="${p.name}" style="background-image:url('${IMG(p.img, 1100)}')"></div>
      </div>
      <div class="card__body">
        <h3 class="card__name">${p.name}</h3>
        <span class="card__cat">${p.cat}</span>
        <span class="card__price">${p.price}</span>
      </div>`;
    return el;
  }
  /* ---------- BANNER PRODOTTO IN EVIDENZA — largo, nome sotto in striscia nera ---------- */
  function fillFeature(id, p) {
    const el = document.getElementById(id);
    if (!el || !p) return;
    el.dataset.product = p.id;
    const frameId = id + 'Frame';
    if (p.heroDuo) {
      el.innerHTML = `
        <div class="feature-banner__frame">
          <div class="feature-banner__img feature-banner__img--duo feature-banner__img--desktop" style="background-image:url('${IMG(p.heroDuo.desktop, 1800)}')"></div>
          <div class="feature-banner__img feature-banner__img--duo feature-banner__img--mobile" style="background-image:url('${IMG(p.heroDuo.mobile, 1200)}')"></div>
        </div>
        <div class="feature-banner__label">
          <span class="feature-banner__name">${p.name}</span>
          <span class="feature-banner__price">${p.price}</span>
        </div>`;
    } else if (p.pair) {
      el.innerHTML = `
        <div class="feature-banner__frame" id="${frameId}">
          <div class="feature-banner__img feature-banner__img--a" style="background-image:url('${IMG(p.img, 1800)}')"></div>
          <div class="feature-banner__img feature-banner__img--b" style="background-image:url('${IMG(p.pair.img, 1800)}')"></div>
        </div>
        <div class="feature-banner__label">
          <span class="feature-banner__name">${p.name.replace(/ (Black|White) Belt/, ' Belt')}</span>
          <span class="feature-banner__price">${p.price}</span>
        </div>`;
      const frame = document.getElementById(frameId);
      setInterval(() => frame.classList.toggle('is-flip'), 3000);
    } else {
      el.innerHTML = `
        <div class="feature-banner__frame">
          <div class="feature-banner__img feature-banner__img--a" style="background-image:url('${IMG(p.img, 1800)}')"></div>
        </div>
        <div class="feature-banner__label">
          <span class="feature-banner__name">${p.name}</span>
          <span class="feature-banner__price">${p.price}</span>
        </div>`;
    }
  }
  fillFeature('streetFeature', streetDuo);
  fillFeature('luxoFeature', products.luxo[1]);

  /* ---------- FOOTER INJECTION ---------- */
  const footerTpl = document.getElementById('footerTpl');
  document.querySelectorAll('[data-footer]').forEach((slot) =>
    slot.appendChild(footerTpl.content.cloneNode(true))
  );

  /* ---------- REVEAL ON SCROLL ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  function observeReveals(scope) {
    scope.querySelectorAll('.reveal, .card, .pdp__shot').forEach((el) => io.observe(el));
  }
  observeReveals(document);

  /* ---------- HEADER STATE ---------- */
  const header = document.getElementById('header');
  const heroLogo = document.getElementById('heroLogo');
  function updateHeader() {
    const active = document.querySelector('.view--active');
    const hero = active && active.querySelector('.hero');
    const heroH = hero ? hero.offsetHeight : 0;
    // col menu aperto il body è "position:fixed" per bloccare lo scroll: window.scrollY
    // risulterebbe 0 anche se in realtà si era scorso più giù, facendo ringrandire il logo per errore
    const y = document.body.style.position === 'fixed' ? lockedScrollY : window.scrollY;
    const isDark = heroH > 0 && y < heroH - 90;
    header.classList.toggle('is-solid', y > 40);
    header.classList.toggle('is-dark', isDark);

    if (heroLogo) {
      const isHome = document.body.classList.contains('theme-home');
      heroLogo.classList.toggle('is-visible', isHome);
      heroLogo.classList.toggle('is-dark', isDark);
      heroLogo.classList.toggle('is-small', y > 40);
    }
  }
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ---------- HERO VIDEO ---------- */
  function initVideos() {
    document.querySelectorAll('.hero__video[data-src]').forEach((v) => {
      if (v.dataset.init) return;
      v.dataset.init = '1';
      v.src = v.dataset.src; v.load();
      const show = () => v.classList.add('is-playing');
      v.addEventListener('playing', show);
      v.addEventListener('loadeddata', () => v.play().then(show).catch(() => {}));
      v.addEventListener('error', () => v.classList.remove('is-playing'));
    });
  }
  initVideos();

  /* ---------- HERO CAROUSEL (home) ---------- */
  const homeSlides = document.querySelectorAll('.view[data-view="home"] .hero__slide');
  let slideIdx = 0;
  if (homeSlides.length > 1) {
    setInterval(() => {
      homeSlides[slideIdx].classList.remove('is-active');
      slideIdx = (slideIdx + 1) % homeSlides.length;
      homeSlides[slideIdx].classList.add('is-active');
    }, 5200);
  }

  /* ---------- DRAWER ---------- */
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawerOverlay');
  const toggle = document.getElementById('menuToggle');
  const closeBtn = document.getElementById('drawerClose');
  let lockedScrollY = 0;
  function lockBodyScroll() {
    // "overflow:hidden" da solo non blocca lo scroll touch su iOS/Android: blocchiamo
    // il body in posizione fissa così la pagina sotto al menu non si muove più.
    lockedScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = -lockedScrollY + 'px';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }
  function unlockBodyScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    // il sito ha "scroll-behavior: smooth" globale: senza "instant" qui la pagina
    // scorrerebbe animata fino al punto giusto invece di scattarci subito
    window.scrollTo({ top: lockedScrollY, left: 0, behavior: 'instant' });
  }
  function openDrawer() {
    drawer.classList.add('is-open'); overlay.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false'); lockBodyScroll();
  }
  function closeDrawer() {
    // switchView chiama closeDrawer() ad ogni cambio pagina come pulizia precauzionale:
    // sblocchiamo lo scroll solo se il menu era davvero aperto, altrimenti la pagina
    // veniva riportata in cima ad ogni navigazione, facendo "lampeggiare" il logo grande
    const wasOpen = drawer.classList.contains('is-open');
    drawer.classList.remove('is-open'); overlay.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (wasOpen) unlockBodyScroll();
  }
  toggle.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeDrawer(); closeSearch(); } });

  /* ---------- THEME PER VIEW ---------- */
  function setTheme(view) {
    const t = view === 'street' || view === 'luxo' ? view : (view === 'home' ? 'home' : 'neutral');
    document.body.classList.remove('theme-home', 'theme-neutral', 'theme-street', 'theme-luxo');
    document.body.classList.add('theme-' + t);
  }

  /* ---------- VIEW NAVIGATION (diretta, senza dissolvenza) ---------- */
  let animating = false;
  // pila di navigazione: ogni voce ricorda la vista lasciata E la posizione di scroll
  // che aveva, così "torna indietro" ripristina esattamente dove si era arrivati.
  let navStack = [];
  let currentProduct = null;

  function onEnter(view) {
    if (view === 'cart') renderCart();
    else if (view === 'checkout') renderCheckout();
    else if (view === 'account') { if (authMode !== 'recovery') authMode = 'login'; renderAccount(); }
  }

  function switchView(view, prep, opts) {
    opts = opts || {};
    const current = document.querySelector('.view--active');
    if (animating) return;
    const target = document.querySelector(`.view[data-view="${view}"]`);
    if (!target) return;
    if (current && current.dataset.view === view && view !== 'product') { closeDrawer(); return; }
    if (!opts.back && current) navStack.push({ view: current.dataset.view, scrollY: window.scrollY });
    animating = true; closeDrawer();

    if (typeof prep === 'function') prep(target);
    onEnter(view);
    if (current) current.classList.remove('view--active');
    target.classList.add('view--active');
    setTheme(view);
    if (window.gtag) window.gtag('event', 'page_view', { page_title: view, page_path: '/' + view });
    const restoreY = opts.back && opts.scrollY ? opts.scrollY : 0;
    window.scrollTo({ top: restoreY, left: 0, behavior: 'instant' });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      window.scrollTo({ top: restoreY, left: 0, behavior: 'instant' });
    }));
    target.querySelectorAll('.reveal, .card, .pdp__shot').forEach((el) => el.classList.remove('in'));
    requestAnimationFrame(() => observeReveals(target));
    setTimeout(() => target.querySelectorAll('.hero .reveal, .about-hero .reveal, .page-head .reveal, .shop-head .reveal').forEach((el) => el.classList.add('in')), 60);
    initVideos();
    updateHeader();

    animating = false;
  }
  function goTo(view) { switchView(view); }
  // torna indietro: riprende l'ultima vista lasciata, con lo scroll che aveva allora
  function goBack() {
    const entry = navStack.pop();
    if (entry) switchView(entry.view, null, { back: true, scrollY: entry.scrollY });
    else switchView('home');
  }

  /* ---------- PRODUCT DETAIL ---------- */
  const swatch = (c) => ({
    Nero:'#141414', Bianco:'#f4f4f0', Panna:'#efe9dc', Cammello:'#b58b57', Grigio:'#8f8f92',
    Kaki:'#6f6a4a', Sabbia:'#cbb894', Indaco:'#2b3a67', Bordeaux:'#5b1a2b', Nude:'#d8b79c',
    'Nero e Bianco':'linear-gradient(135deg,#141414 50%,#f4f4f0 50%)',
  }[c] || '#bbb');

  function setPdpColor(c) {
    const nm = document.getElementById('pdpColorName');
    const prev = document.getElementById('pdpColorPrev');
    if (nm) nm.textContent = c;
    if (prev) prev.style.background = swatch(c);
  }

  function openProduct(p) {
    currentProduct = p;
    switchView('product', () => {
      const main = document.getElementById('pdpMain');
      const thumbs = document.getElementById('pdpThumbs');
      thumbs.innerHTML = '';

      main.style.backgroundImage = '';
      main.removeAttribute('role'); main.removeAttribute('aria-label');
      if (p.duoVariants) {
        applyLuxoVariant(p, 'duo');
      } else if (p.pair) {
        // COLONNA DESTRA — galleria scorrevole nero/bianco
        main.innerHTML = `
          <div class="pdp__gallery">
            <div class="pdp__slide" role="img" aria-label="${p.name} — ${p.colors[0]}" style="background-image:url('${IMG(p.img, 1600)}')"></div>
            <div class="pdp__slide" role="img" aria-label="${p.name} — ${p.pair.color}" style="background-image:url('${IMG(p.pair.img, 1600)}')"></div>
          </div>`;
        main.querySelector('.pdp__gallery').scrollLeft = 0;
      } else {
        // COLONNA DESTRA — immagine principale
        main.innerHTML = '';
        main.style.backgroundImage = p.img ? `url('${IMG(p.img, 1300)}')` : '';
        if (p.img) { main.setAttribute('role', 'img'); main.setAttribute('aria-label', p.name); }
      }

      // COLONNA SINISTRA — info
      document.getElementById('pdpName').textContent = p.name;
      document.getElementById('pdpDesc').textContent = p.desc;
      const mat = (p.specs.find((s) => /material/i.test(s[0])) || [null, 'Materiali pregiati'])[1];
      document.getElementById('pdpMaterials').textContent = `${mat}. Lavorazione artigianale, finiture a mano. Made in Italy.`;

      const add = document.getElementById('pdpAdd');
      add.dataset.size = (p.sizes && p.sizes[0]) || 'Unica';
      add.firstChild.textContent = 'Aggiungi al carrello ';

      if (p.duoVariants) {
        document.getElementById('pdpColors').innerHTML = p.duoVariants
          .map((v, i) => `<button class="pdp__color pdp__variant${i === 0 ? ' is-active' : ''}" data-variant="${v.key}" aria-label="${v.label}"><span class="pdp__sw" style="background:${v.swatch}"></span></button>`).join('');
      } else {
        document.getElementById('pdpPrice').textContent = p.price;
        document.getElementById('pdpColors').innerHTML = p.colors
          .map((c, i) => `<button class="pdp__color${i === 0 ? ' is-active' : ''}" data-color="${c}" aria-label="${c}"><span class="pdp__sw" style="background:${swatch(c)}"></span></button>`).join('');
        setPdpColor(p.colors[0]);
        add.dataset.product = p.cartId || p.id;
        delete add.dataset.duo;
        updateStockNote(p.stock);
      }
    });
  }

  /* ---------- PDP — nota "ultimi pezzi" quando lo stock scende sotto soglia ---------- */
  function updateStockNote(stock) {
    const el = document.getElementById('pdpStock');
    if (!el) return;
    if (stock <= 5) { el.hidden = false; el.textContent = stock > 0 ? `Ultimi ${stock} pezzi disponibili` : 'Esaurito'; }
    else el.hidden = true;
  }

  /* ---------- BOX LUNGO LUXO — selezione variante (entrambe / bianco / nero) ---------- */
  function applyLuxoVariant(p, key) {
    const v = p.duoVariants.find((x) => x.key === key) || p.duoVariants[0];
    const main = document.getElementById('pdpMain');
    main.style.backgroundImage = '';
    const label = `${p.name} — ${v.label}`;
    if (v.key === 'duo') {
      main.innerHTML = `
        <div class="pdp__herodup pdp__herodup--desktop" role="img" aria-label="${label}" style="background-image:url('${IMG(p.heroDuo.desktop, 1800)}')"></div>
        <div class="pdp__herodup pdp__herodup--mobile" role="img" aria-label="${label}" style="background-image:url('${IMG(p.heroDuo.mobile, 1300)}')"></div>`;
    } else {
      main.innerHTML = `
        <div class="pdp__herodup pdp__herodup--desktop" role="img" aria-label="${label}" style="background-image:url('${IMG(v.imgDesktop || v.img, 1800)}')"></div>
        <div class="pdp__herodup pdp__herodup--mobile" role="img" aria-label="${label}" style="background-image:url('${IMG(v.img, 1300)}')"></div>`;
    }
    document.getElementById('pdpPrice').textContent = v.price;
    setPdpColor(v.label);

    const add = document.getElementById('pdpAdd');
    if (v.key === 'duo') {
      const blackId = p.duoVariants.find((x) => x.key === 'black').cartId;
      const whiteId = p.duoVariants.find((x) => x.key === 'white').cartId;
      add.dataset.duo = '1';
      add.dataset.blackId = blackId;
      add.dataset.whiteId = whiteId;
      updateStockNote(Math.min(ALL[blackId].stock, ALL[whiteId].stock));
    } else {
      delete add.dataset.duo;
      add.dataset.product = v.cartId;
      updateStockNote(ALL[v.cartId].stock);
    }
  }

  /* ---------- ACCOUNT RENDERER ---------- */
  function renderAccount() {
    const panel = document.getElementById('accountPanel');
    if (!panel) return;
    const user = currentUser();

    if (user) {
      panel.innerHTML = `
        <div class="account__panel account__panel--alt account__panel--wide">
          <h3>Bentornato, ${user.firstname}</h3>
          <p>Hai effettuato l'accesso come <strong>${user.email}</strong>.</p>
          <button class="pill pill--ghost" id="logoutBtn">Esci <em>→</em></button>
        </div>
        <div class="account__panel account__panel--wide">
          <h3>I tuoi ordini</h3>
          <div id="orderHistory"><p class="account__msg">Carico i tuoi ordini…</p></div>
        </div>`;
      loadOrderHistory(user.id);
      return;
    }

    if (authMode === 'recovery') {
      panel.innerHTML = `
        <div class="account__panel">
          <h3>Imposta una nuova password</h3>
          <p>Sei arrivata/o qui dal link che ti abbiamo mandato via email. Scegli una nuova password per il tuo account.</p>
          <form class="account-form" id="recoveryForm" novalidate>
            <label>Nuova password<input type="password" name="password" required minlength="6"></label>
            <button class="pill pill--dark" type="submit">Salva password <em>→</em></button>
          </form>
          <p class="account__msg" id="recoveryMsg" hidden></p>
        </div>`;
      return;
    }

    if (authMode === 'forgot') {
      panel.innerHTML = `
        <div class="account__panel">
          <h3>Recupera la password</h3>
          <p>Inserisci l'email del tuo account: ti mandiamo un link per reimpostare la password.</p>
          <form class="account-form" id="forgotForm" novalidate>
            <label>Email<input type="email" name="email" required></label>
            <button class="pill pill--dark" type="submit">Invia link <em>→</em></button>
            <a class="account__link" href="#" id="backToLogin">Torna al login</a>
          </form>
          <p class="account__msg" id="forgotMsg" hidden></p>
        </div>`;
      return;
    }

    panel.innerHTML = `
      <div class="account__panel">
        <h3>Accedi</h3>
        <form class="account-form" id="loginForm" novalidate>
          <label>Email<input type="email" name="email" required></label>
          <label>Password<input type="password" name="password" required></label>
          <button class="pill pill--dark" type="submit">Accedi <em>→</em></button>
          <a class="account__link" href="#" id="forgotLink">Password dimenticata?</a>
        </form>
        <p class="account__msg" id="loginMsg" hidden></p>
      </div>
      <div class="account__panel account__panel--alt">
        <h3>Nuovo cliente</h3>
        <p>Crea un account per un checkout più rapido, salvare i tuoi preferiti e seguire lo stato dei tuoi ordini.</p>
        <ul class="account__perks">
          <li>Ordini e resi in un tocco</li>
          <li>Preferiti sempre sincronizzati</li>
          <li>Accesso anticipato alle collezioni</li>
        </ul>
        <form class="account-form" id="registerForm" novalidate>
          <label>Nome<input type="text" name="firstname" required></label>
          <label>Cognome<input type="text" name="lastname" required></label>
          <label>Email<input type="email" name="email" required></label>
          <label>Password<input type="password" name="password" required minlength="6"></label>
          <button class="pill pill--ghost" type="submit">Crea account <em>→</em></button>
        </form>
        <p class="account__msg" id="registerMsg" hidden></p>
      </div>`;
  }

  /* ---------- STORICO ORDINI (dal database Supabase) ---------- */
  function loadOrderHistory(userId) {
    supa.from('orders')
      .select('id, created_at, total, order_items(name, qty, color, size)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        const el = document.getElementById('orderHistory');
        if (!el) return; // l'utente ha già cambiato pagina
        if (error) { el.innerHTML = `<p class="account__msg">Non riesco a caricare i tuoi ordini al momento.</p>`; return; }
        if (!data.length) { el.innerHTML = `<p class="account__msg">Non hai ancora effettuato ordini.</p>`; return; }
        el.innerHTML = data.map((o) => `
          <div class="order-card">
            <div class="order-card__head">
              <span>${new Date(o.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span>${euro(o.total)}</span>
            </div>
            <div class="order-card__items">${o.order_items.map((it) =>
              `<span>${it.qty}× ${it.name}${it.color ? ' · ' + it.color : ''}${it.size ? ' · ' + it.size : ''}</span>`
            ).join('')}</div>
          </div>`).join('');
      });
  }

  /* ---------- CART / CHECKOUT RENDERERS ---------- */
  function renderCart() {
    const wrap = document.getElementById('cartItems');
    const sum = document.getElementById('cartSummary');
    const layout = document.getElementById('cartLayout');
    const empty = document.getElementById('cartEmpty');
    if (!store.cart.length) { layout.hidden = true; empty.hidden = false; return; }
    layout.hidden = false; empty.hidden = true;

    wrap.innerHTML = store.cart.map((it, i) => {
      const p = ALL[it.id];
      return `<div class="citem">
        <div class="citem__img" style="background-image:url('${IMG(p.img, 400)}')"></div>
        <div class="citem__main">
          <div class="citem__top">
            <div>
              <h4 class="citem__name" data-open="${p.id}">${p.name}</h4>
              <span class="citem__opts">${it.color || '—'} · Taglia ${it.size || '—'}</span>
            </div>
            <button class="citem__rm" data-rm="${i}" aria-label="Rimuovi">✕</button>
          </div>
          <div class="citem__bottom">
            <div class="qty">
              <button data-qty="dec" data-i="${i}" aria-label="Diminuisci">−</button>
              <span>${it.qty}</span>
              <button data-qty="inc" data-i="${i}" aria-label="Aumenta">+</button>
            </div>
            <span class="citem__price">${euro(priceNum(p.price) * it.qty)}</span>
          </div>
        </div>
      </div>`;
    }).join('');

    const sh = shippingCost();
    sum.innerHTML = `
      <h3>Riepilogo ordine</h3>
      <div class="sum__row"><span>Subtotale</span><span>${euro(subtotal())}</span></div>
      <div class="sum__row"><span>Spedizione</span><span>${sh === 0 ? 'Gratuita' : euro(sh)}</span></div>
      <div class="sum__row sum__total"><span>Totale</span><span>${euro(subtotal() + sh)}</span></div>
      <p class="sum__note">${subtotal() >= 500 ? 'Spedizione gratuita inclusa.' : 'Spedizione gratuita sopra €500.'}</p>
      <button class="pill pill--dark sum__checkout" data-nav="checkout">Procedi al checkout <em>→</em></button>`;
  }

  function renderCheckout() {
    const sum = document.getElementById('checkoutSummary');
    const layout = document.getElementById('checkoutLayout');
    const empty = document.getElementById('checkoutEmpty');
    document.getElementById('coDone').hidden = true;
    if (!store.cart.length) { layout.hidden = true; empty.hidden = false; return; }
    layout.hidden = false; empty.hidden = true;
    const sh = shippingCost();
    sum.innerHTML = `
      <h3>Il tuo ordine</h3>
      <div class="co-items">${store.cart.map((it) => {
        const p = ALL[it.id];
        return `<div class="co-line">
          <div class="co-line__img" style="background-image:url('${IMG(p.img, 300)}')"><span>${it.qty}</span></div>
          <div class="co-line__info"><strong>${p.name}</strong><span>${it.color} · ${it.size}</span></div>
          <span class="co-line__price">${euro(priceNum(p.price) * it.qty)}</span>
        </div>`;
      }).join('')}</div>
      <div class="sum__row"><span>Subtotale</span><span>${euro(subtotal())}</span></div>
      <div class="sum__row"><span>Spedizione</span><span>${sh === 0 ? 'Gratuita' : euro(sh)}</span></div>
      <div class="sum__row sum__total"><span>Totale</span><span>${euro(subtotal() + sh)}</span></div>`;
  }

  /* ---------- SEARCH ---------- */
  const search = document.getElementById('search');
  const searchInput = document.getElementById('searchInput');
  const searchGhost = document.getElementById('searchGhost');
  const productNameList = Object.values(ALL).map((p) => p.name);
  // trova il primo nome prodotto che inizia con quello che l'utente sta scrivendo
  function matchSuggestion(typed) {
    if (!typed) return null;
    const lower = typed.toLowerCase();
    const found = productNameList.find((name) => name.toLowerCase().startsWith(lower) && name.length > typed.length);
    return found || null;
  }
  function updateGhost() {
    if (!searchGhost) return;
    const typed = searchInput.value;
    const suggestion = matchSuggestion(typed);
    searchGhost.innerHTML = suggestion
      ? `<em>${typed}</em><span>${suggestion.slice(typed.length)}</span>`
      : '';
  }
  function openSearch() {
    search.classList.add('is-open'); search.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput.focus(), 250);
  }
  function closeSearch() {
    search.classList.remove('is-open'); search.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function runSearch(q) {
    const res = document.getElementById('searchResults');
    const meta = document.getElementById('searchMeta');
    const query = q.trim().toLowerCase();
    if (!query) {
      res.innerHTML = ''; meta.textContent = 'Inizia a digitare per cercare nella collezione.';
      return;
    }
    const hits = Object.values(ALL).filter((p) =>
      (p.name + ' ' + p.cat + ' ' + p.desc).toLowerCase().includes(query));
    meta.textContent = hits.length ? `${hits.length} risultati per “${q.trim()}”` : `Nessun risultato per “${q.trim()}”`;
    res.innerHTML = '';
    hits.forEach((p) => res.appendChild(card(p)));
    observeReveals(res); // le card create qui non erano mai "osservate": restavano invisibili (opacity:0)
  }
  document.getElementById('searchBtn').addEventListener('click', openSearch);
  document.getElementById('searchClose').addEventListener('click', closeSearch);
  searchInput.addEventListener('input', (e) => { runSearch(e.target.value); updateGhost(); });
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' || e.key === 'ArrowRight') {
      const suggestion = matchSuggestion(searchInput.value);
      const atEnd = searchInput.selectionStart === searchInput.value.length;
      if (suggestion && (e.key === 'Tab' || atEnd)) {
        e.preventDefault();
        searchInput.value = suggestion;
        runSearch(suggestion);
        updateGhost();
      }
    }
  });
  document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const suggestion = matchSuggestion(searchInput.value);
    if (suggestion) searchInput.value = suggestion; // completa col suggerimento prima di cercare
    runSearch(searchInput.value);
    updateGhost();
    searchInput.blur(); // chiude la tastiera su mobile dopo l'invio
  });

  /* ---------- GLOBAL CLICK ROUTER ---------- */
  document.addEventListener('click', (e) => {
    // nav links / buttons
    const nav = e.target.closest('[data-nav]');
    if (nav) { e.preventDefault(); closeSearch(); goTo(nav.dataset.nav); return; }

    // torna indietro (pulsante flottante in alto a sinistra, presente in più schermate)
    const back = e.target.closest('[data-back]');
    if (back) { e.preventDefault(); goBack(); return; }

    // account: esci
    const logout = e.target.closest('#logoutBtn');
    if (logout) { supa.auth.signOut().then(() => { authMode = 'login'; renderAccount(); }); return; }

    // account: passa alla schermata "password dimenticata" / torna al login
    const forgotLink = e.target.closest('#forgotLink');
    if (forgotLink) { e.preventDefault(); authMode = 'forgot'; renderAccount(); return; }
    const backToLogin = e.target.closest('#backToLogin');
    if (backToLogin) { e.preventDefault(); authMode = 'login'; renderAccount(); return; }

    // PDP box lungo Luxo — selezione variante (entrambe / bianco / nero)
    const variant = e.target.closest('.pdp__variant');
    if (variant) {
      document.querySelectorAll('#pdpColors .pdp__variant').forEach((b) => b.classList.remove('is-active'));
      variant.classList.add('is-active');
      applyLuxoVariant(currentProduct, variant.dataset.variant);
      return;
    }

    // PDP colour selection (updates preview)
    const col = e.target.closest('.pdp__color');
    if (col) {
      document.querySelectorAll('#pdpColors .pdp__color').forEach((b) => b.classList.remove('is-active'));
      col.classList.add('is-active');
      setPdpColor(col.dataset.color);
      return;
    }
    // PDP thumbnail -> swap main image
    const thumb = e.target.closest('.pdp__thumb');
    if (thumb) {
      document.getElementById('pdpMain').style.backgroundImage = `url('${IMG(thumb.dataset.img, 1300)}')`;
      return;
    }

    // add to cart (PDP)
    const add = e.target.closest('#pdpAdd');
    if (add) {
      let ok;
      if (add.dataset.duo === '1') {
        const okBlack = addToCart(add.dataset.blackId, add.dataset.size || 'Unica', 'Nero', 1);
        const okWhite = addToCart(add.dataset.whiteId, add.dataset.size || 'Unica', 'Bianco', 1);
        ok = okBlack || okWhite;
      } else {
        const id = add.dataset.product;
        const c = document.querySelector('#pdpColors .is-active');
        ok = addToCart(id, add.dataset.size || 'Unica', c ? c.dataset.color : '', 1);
      }
      add.firstChild.textContent = ok ? 'Aggiunto ✓ ' : 'Esaurito ';
      add.animate([{ transform:'scale(1)' }, { transform:'scale(.97)' }, { transform:'scale(1)' }], { duration: 260 });
      setTimeout(() => { add.firstChild.textContent = 'Aggiungi al carrello '; }, 1500);
      return;
    }

    // cart qty / remove
    const qtyBtn = e.target.closest('[data-qty]');
    if (qtyBtn) {
      const i = +qtyBtn.dataset.i;
      const line = store.cart[i];
      if (qtyBtn.dataset.qty === 'inc') line.qty = Math.min(ALL[line.id].stock, line.qty + 1);
      else line.qty = Math.max(1, line.qty - 1);
      store.save(); updateBadges(); renderCart(); return;
    }
    const rm = e.target.closest('[data-rm]');
    if (rm) { store.cart.splice(+rm.dataset.rm, 1); store.save(); updateBadges(); renderCart(); return; }

    // open product from cart line name
    const openId = e.target.closest('[data-open]');
    if (openId && ALL[openId.dataset.open]) { openProduct(ALL[openId.dataset.open]); return; }

    // card / square tile -> product page
    const cd = e.target.closest('[data-product]');
    if (cd && ALL[cd.dataset.product]) { e.preventDefault(); closeSearch(); openProduct(ALL[cd.dataset.product]); return; }

    // search overlay backdrop
    if (e.target === search) closeSearch();
  });

  /* ---------- CHECKOUT: payment fields + submit ---------- */
  document.addEventListener('change', (e) => {
    if (e.target.name === 'pay') {
      const isCard = e.target.value === 'card';
      document.getElementById('payFields').hidden = !isCard;
      document.getElementById('payNote').hidden = isCard;
    }
    if (e.target.id === 'invoiceToggle') {
      const fields = document.getElementById('invoiceFields');
      const checked = e.target.checked;
      fields.hidden = !checked;
      fields.querySelectorAll('[name="company"], [name="vat"]').forEach((inp) => { inp.required = checked; });
    }
  });
  document.addEventListener('submit', (e) => {
    if (e.target.id === 'loginForm') {
      e.preventDefault();
      const fd = new FormData(e.target);
      const msg = document.getElementById('loginMsg');
      const btn = e.target.querySelector('button[type="submit"]');
      btn.disabled = true;
      supa.auth.signInWithPassword({ email: fd.get('email').trim().toLowerCase(), password: fd.get('password') })
        .then(({ error }) => {
          btn.disabled = false;
          if (error && msg) { msg.hidden = false; msg.textContent = authErrorText(error); }
          // sul successo ci pensa onAuthStateChange a ri-renderizzare il pannello
        });
      return;
    }
    if (e.target.id === 'registerForm') {
      e.preventDefault();
      const fd = new FormData(e.target);
      const msg = document.getElementById('registerMsg');
      const btn = e.target.querySelector('button[type="submit"]');
      btn.disabled = true;
      supa.auth.signUp({
        email: fd.get('email').trim().toLowerCase(),
        password: fd.get('password'),
        options: { data: { firstname: fd.get('firstname').trim(), lastname: fd.get('lastname').trim() } },
      }).then(({ data, error }) => {
        btn.disabled = false;
        if (error) { if (msg) { msg.hidden = false; msg.textContent = authErrorText(error); } return; }
        if (!data.session && msg) {
          msg.hidden = false;
          msg.textContent = 'Controlla la tua email: ti abbiamo mandato un link per confermare l\'account.';
        }
        // se la conferma email non è richiesta arriva già una sessione e onAuthStateChange ri-renderizza da solo
      });
      return;
    }
    if (e.target.id === 'forgotForm') {
      e.preventDefault();
      const fd = new FormData(e.target);
      const msg = document.getElementById('forgotMsg');
      const btn = e.target.querySelector('button[type="submit"]');
      btn.disabled = true;
      supa.auth.resetPasswordForEmail(fd.get('email').trim().toLowerCase(), { redirectTo: window.location.origin + window.location.pathname })
        .then(({ error }) => {
          btn.disabled = false;
          if (msg) {
            msg.hidden = false;
            msg.textContent = error ? authErrorText(error) : 'Se l\'indirizzo esiste ti abbiamo inviato un link per reimpostare la password.';
          }
        });
      return;
    }
    if (e.target.id === 'recoveryForm') {
      e.preventDefault();
      const fd = new FormData(e.target);
      const msg = document.getElementById('recoveryMsg');
      const btn = e.target.querySelector('button[type="submit"]');
      btn.disabled = true;
      supa.auth.updateUser({ password: fd.get('password') }).then(({ error }) => {
        btn.disabled = false;
        if (error) { if (msg) { msg.hidden = false; msg.textContent = authErrorText(error); } return; }
        authMode = 'login';
        renderAccount();
      });
      return;
    }
    if (e.target.classList.contains('news-form')) {
      e.preventDefault();
      const form = e.target;
      const input = form.querySelector('input[type="email"]');
      const email = input.value.trim().toLowerCase();
      supa.from('newsletter_subscribers').insert({ email })
        .then(() => {}) // successo, oppure email già iscritta (errore di unicità): in entrambi i casi mostriamo conferma
        .catch(() => {})
        .finally(() => {
          form.outerHTML = '<p class="news-form__msg">Iscrizione confermata — a presto nella community DRAMMIS.</p>';
        });
      return;
    }
    if (e.target.id === 'checkoutForm') {
      e.preventDefault();
      if (!store.cart.length) return;
      const form = e.target;
      const fd = new FormData(form);
      const btn = form.querySelector('.co-submit');
      const msg = document.getElementById('checkoutMsg');
      btn.disabled = true;
      if (msg) msg.hidden = true;

      (async () => {
        const sh = shippingCost();
        const user = currentUser();
        const orderRow = {
          id: crypto.randomUUID(),
          user_id: user ? user.id : null,
          email: fd.get('email').trim().toLowerCase(),
          firstname: fd.get('firstname').trim(),
          lastname: fd.get('lastname').trim(),
          phone: fd.get('phone') ? fd.get('phone').trim() : null,
          address: fd.get('address').trim(),
          city: fd.get('city').trim(),
          zip: fd.get('zip').trim(),
          province: fd.get('province') ? fd.get('province').trim() : null,
          country: (fd.get('country') || '').trim() || 'Italia',
          invoice_requested: fd.get('invoice') === 'on',
          company: fd.get('company') ? fd.get('company').trim() : null,
          vat: fd.get('vat') ? fd.get('vat').trim() : null,
          fiscal_code: fd.get('fiscalcode') ? fd.get('fiscalcode').trim() : null,
          sdi: fd.get('sdi') ? fd.get('sdi').trim() : null,
          shipping_method: fd.get('shipping'),
          shipping_cost: sh,
          payment_method: fd.get('pay'),
          subtotal: subtotal(),
          total: subtotal() + sh,
        };

        const { error: orderErr } = await supa.from('orders').insert(orderRow);
        if (orderErr) throw orderErr;

        const items = store.cart.map((it) => ({
          order_id: orderRow.id,
          product_id: it.id,
          name: ALL[it.id].name,
          price: priceNum(ALL[it.id].price),
          size: it.size || null,
          color: it.color || null,
          qty: it.qty,
        }));
        const { error: itemsErr } = await supa.from('order_items').insert(items);
        if (itemsErr) throw itemsErr;

        supa.functions.invoke('super-processor', {
          body: {
            email: orderRow.email,
            firstname: orderRow.firstname,
            orderId: orderRow.id,
            items: items.map((it) => ({ name: it.name, qty: it.qty, price: it.price, size: it.size, color: it.color })),
            total: orderRow.total,
          },
        }).catch(() => {}); // l'ordine è già salvato: se l'email fallisce non blocchiamo la conferma

        const total = euro(orderRow.total);
        store.cart = []; store.save(); updateBadges();
        document.getElementById('checkoutLayout').hidden = true;
        document.getElementById('coDoneTotal').textContent = total;
        document.getElementById('coDone').hidden = false;
        form.reset();
      })().catch((err) => {
        btn.disabled = false;
        if (msg) { msg.hidden = false; msg.textContent = 'Non siamo riusciti a registrare il tuo ordine. Riprova tra poco.'; }
        console.error('checkout error:', err);
      });
    }
  });

  /* ---------- LIGHT PARALLAX ---------- */
  window.addEventListener('scroll', () => {
    const m = document.querySelector('.view--active .hero__media');
    if (m && window.scrollY < window.innerHeight) m.style.transform = `translateY(${window.scrollY * 0.18}px)`;
  }, { passive: true });

  /* ---------- CAMPAIGN COUNTDOWN (dynamic) ---------- */
  (function countdown() {
    const el = document.getElementById('countdown');
    if (!el) return;
    const target = Date.now() + (2 * 24 * 3600 + 8 * 3600 + 42 * 60) * 1000;
    const cells = { d: el.querySelector('[data-cd="d"]'), h: el.querySelector('[data-cd="h"]'), m: el.querySelector('[data-cd="m"]'), s: el.querySelector('[data-cd="s"]') };
    const pad = (n) => String(n).padStart(2, '0');
    function tick() {
      let t = Math.max(0, target - Date.now());
      const d = Math.floor(t / 86400000); t -= d * 86400000;
      const h = Math.floor(t / 3600000); t -= h * 3600000;
      const m = Math.floor(t / 60000); t -= m * 60000;
      const s = Math.floor(t / 1000);
      if (cells.d) cells.d.textContent = pad(d);
      if (cells.h) cells.h.textContent = pad(h);
      if (cells.m) cells.m.textContent = pad(m);
      if (cells.s) cells.s.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  })();

  /* ---------- ANALYTICS (Google Analytics 4) — parte solo col consenso dell'utente ---------- */
  const GA_MEASUREMENT_ID = 'G-W6VNG2Z24Q';
  function loadAnalytics() {
    if (window.__gaLoaded || !GA_MEASUREMENT_ID) return;
    window.__gaLoaded = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);
  }

  /* ---------- COOKIE CONSENT ---------- */
  (function cookieConsent() {
    const KEY = 'dr_cookie_consent';
    const banner = document.getElementById('cookieBanner');
    const stored = localStorage.getItem(KEY);
    if (stored === 'all') loadAnalytics();
    if (!banner) return;
    if (!stored) banner.hidden = false;
    const dismiss = (choice) => {
      localStorage.setItem(KEY, choice);
      banner.hidden = true;
      if (choice === 'all') loadAnalytics();
    };
    document.getElementById('cookieAccept').addEventListener('click', () => dismiss('all'));
    document.getElementById('cookieDeny').addEventListener('click', () => dismiss('necessary'));
    document.addEventListener('click', (e) => {
      if (e.target.closest('#cookiePrefsBtn')) { localStorage.removeItem(KEY); banner.hidden = false; }
    });
  })();

  /* ---------- COMMUNITY — numeri animati (lenti), reali dove disponibili ---------- */
  (function counters() {
    const els = document.querySelectorAll('.count[data-count]');
    if (!els.length) return;

    function animate(el, target) {
      const group = el.dataset.group;
      const dur = 2400, t0 = performance.now();
      function frame(now) {
        const t = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const v = Math.round(target * eased);
        el.textContent = group ? v.toLocaleString('it-IT') : String(v);
        if (t < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    // il contatore "community" mostra i follower Instagram reali, letti dalla
    // funzione server /api/followers (vedi api/followers.js). Finché quella
    // funzione non è configurata con un vero account, resta il numero di
    // fallback (data-count) così la sezione non appare mai vuota o rotta.
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io2.unobserve(entry.target);
        const el = entry.target;
        const fallback = +el.dataset.count;
        if (!el.dataset.community) { animate(el, fallback); return; }
        let target = fallback;
        const ready = fetch('/api/followers').then((r) => r.json())
          .then((data) => { if (typeof data.followers === 'number') target = data.followers; })
          .catch(() => {});
        Promise.race([ready, new Promise((r) => setTimeout(r, 1500))])
          .then(() => animate(el, target));
      });
    }, { threshold: 0.5 });
    els.forEach((el) => io2.observe(el));
  })();

  /* ---------- ASSISTENTE VIRTUALE (chatbot) ---------- */
  (function chatbot() {
    const headerBtn = document.getElementById('assistantBtn');
    const panel = document.getElementById('chatbotPanel');
    const closeBtn = document.getElementById('chatbotClose');
    const form = document.getElementById('chatbotForm');
    const input = document.getElementById('chatbotInput');
    const list = document.getElementById('chatbotMessages');
    if (!panel || !form) return;

    let history = []; // {role:'user'|'assistant', content:string} — solo testo semplice lato client
    let sending = false;

    // blocca lo scroll del body mentre la chat è aperta: su mobile, quando si apre la
    // tastiera, senza questo il browser scrolla/zooma la pagina sotto al pannello fisso
    // facendolo sembrare "saltare" verso l'alto
    let lockedScrollY = 0;
    function lockBodyScroll() {
      lockedScrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = -lockedScrollY + 'px';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    }
    function unlockBodyScroll() {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo({ top: lockedScrollY, left: 0, behavior: 'instant' });
    }

    function addBubble(text, who) {
      const el = document.createElement('div');
      el.className = 'chatbot__msg chatbot__msg--' + who;
      el.textContent = text;
      list.appendChild(el);
      list.scrollTop = list.scrollHeight;
      return el;
    }

    function toggleOpen() {
      const isOpen = panel.classList.toggle('is-open');
      panel.setAttribute('aria-hidden', String(!isOpen));
      if (isOpen) { lockBodyScroll(); setTimeout(() => input.focus(), 200); }
      else unlockBodyScroll();
    }
    if (headerBtn) headerBtn.addEventListener('click', toggleOpen);
    closeBtn.addEventListener('click', () => {
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      unlockBodyScroll();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text || sending) return;
      sending = true;
      addBubble(text, 'user');
      history.push({ role: 'user', content: text });
      input.value = '';

      const typing = addBubble('Sto scrivendo…', 'typing');

      try {
        const user = currentUser();
        const { data, error } = await supa.functions.invoke('chat-support', {
          body: { messages: history, customerEmail: user ? user.email : null },
        });
        typing.remove();
        if (error || !data || !data.reply) throw error || new Error('Nessuna risposta');
        addBubble(data.reply, 'bot');
        history.push({ role: 'assistant', content: data.reply });
      } catch (err) {
        typing.remove();
        addBubble('Scusa, in questo momento non riesco a risponderti. Riprova tra poco o scrivi a info.drammis@gmail.com.', 'bot');
      } finally {
        sending = false;
      }
    });
  })();

  /* ---------- INIT ---------- */
  updateBadges();
  updateHeader();
  setTimeout(() => document.querySelectorAll('.view--active .hero .reveal').forEach((el) => el.classList.add('in')), 120);

  /* ---------- HERO LOGO — dissolvenza d'ingresso al primo caricamento ---------- */
  if (heroLogo && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(() => requestAnimationFrame(updateHeader));
  }
})();
