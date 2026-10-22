/* Nasse Biology — Burun, koku epiteli, dil ve tat tomurcuğu 3B modelleri (ayrıntılı, prosedürel) */
(function () {
  const SKIN = 0xf0b9a0, PINK = 0xff9aa8;
  function extrudeSide(pts, depth, mat, bev) {
    const c = new THREE.SplineCurve(pts.map(p => new THREE.Vector2(p[0], p[1]))), sh = new THREE.Shape(c.getPoints(90));
    const geo = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: !!bev, bevelThickness: bev || 0, bevelSize: bev || 0, bevelSegments: 3, curveSegments: 12 }).rotateY(-Math.PI / 2);
    geo.translate(depth / 2, 0, 0); return new THREE.Mesh(geo, mat);
  }

  /* ============ BURUN ============ */
  M3.burun = {
    title: 'Burun', ico: '👃', tag: 'Kemoreseptör · Nöron', cam: [8.2, 1.4, 3.4], target: [0, .5, -.2], labScale: .8,
    clip: { axis: 'x', min: -.7, max: .7, def: 0, on: false },
    layers: [['Dış burun', 'dis'], ['Burun boşluğu ve konkalar', 'bos'], ['Koku epiteli ve koku siniri', 'koku'], ['Kalbur kemik, koku soğanı ve beyin', 'beyin'], ['Koku molekülleri', 'mol']],
    task: 'Koku moleküllerinin burun deliğinden girip burun boşluğunun üst kısmındaki koku epiteline ulaşma yolunu izle. Koku epiteli, koku siniri ve koku soğanına tıkla. Koku reseptörlerinin çeşidini ve yapısını (nöron) yaz.',
    q: { q: 'Burundaki koku reseptörleri için hangisi doğrudur?', o: ['Mekanoreseptör, duyu epiteli', 'Kemoreseptör, nöron', 'Fotoreseptör, nöron', 'Termoreseptör, duyu epiteli'], a: 1, e: 'Koku molekülleri kimyasal uyarandır; koku reseptör nöronları kemoreseptördür.' },
    build() {
      const { g, sels, ticks, S, G } = B(), api = { sniff: .18 };
      const outer = S(extrudeSide([[-.2, 2.3], [.45, 1.2], [1.1, -.2], [1.75, -1.0], [2.05, -1.4], [1.85, -1.8], [1.3, -1.95], [.4, -2.0], [-.4, -1.6], [-.9, .4], [-.5, 1.7], [-.2, 2.3]], 1.5, glass(SKIN, .13), .05), 'Dış burun', 'Havanın (ve içindeki koku moleküllerinin) burun deliklerinden burun boşluğuna girdiği, dışarıdan görünen bölümdür.', 'Hava yolu', 'dis');
      outer.userData.low = true; g.add(outer);
      const nostril = G(ellip(.16, .06, .3, mt(0x331122), 14), 'dis'); at(nostril, 0, -1.93, 1.35); g.add(nostril);
      /* burun boşluğu */
      const cav = S(extrudeSide([[1.55, -1.5], [1.5, -.55], [.95, .45], [.55, 1.35], [-.1, 1.45], [-.75, .5], [-1.0, -.7], [-.7, -1.15], [.1, -1.0], [.9, -1.45]], .95, glass(0xff7a92, .36), .03), 'Burun boşluğu', 'Burun deliklerinden giren havanın geçtiği boşluktur. Koku molekülleri bu boşlukta ilerleyerek üst kısımdaki koku epiteline ulaşır; hava yutağa doğru devam eder.', 'Hava yolu', 'bos');
      cav.userData.low = true; g.add(cav);
      [[.95, .55, .12, 'Üst konka', 'Burun boşluğunun yan duvarındaki kıvrımlardan en üsttekidir; koku epiteline yakındır. Kıvrımlar hava ile temas yüzeyini artırır.', .0], [.38, .62, .45, 'Orta konka', 'Burun boşluğunun yan duvarındaki orta kıvrımdır; havanın yönlenmesini ve nemlenmesini sağlar.', .35], [-.4, .7, .75, 'Alt konka', 'En alttaki ve en büyük burun kıvrımıdır; solunan havayı nemlendirir ve ısıtır.', .6]].forEach(([y, rz, z, nm, inf, dz]) => {
        const c = S(ellip(.5, .09, rz * 1.1, mt(0xd9536f, { roughness: .7 }), 20), nm, inf, 'Hava yolunu şekillendirir', 'bos'); at(c, -.2, y, z - dz * .1); c.rotation.x = -.15; g.add(c);
      });
      const palate = S(ellip(.45, .06, 1.3, mt(0xd98f86), 18), 'Damak (burun boşluğunun tabanı)', 'Burun boşluğunu ağız boşluğundan ayıran yapıdır.', 'Boşluk tabanı', 'bos'); at(palate, 0, -1.3, .45); g.add(palate);
      const ph = S(curveTube([[0, -.9, -1.0], [0, -1.8, -1.25], [0, -3.0, -1.2]], .38, glass(0xffb3a8, .3), 20), 'Yutak (boğaz)', 'Burun boşluğunun arka tarafta devam ettiği, havanın soluk borusuna doğru ilerlediği yoldur.', 'Hava yolu', 'bos'); ph.userData.low = true; g.add(ph);
      /* koku epiteli */
      const ep = S(ellip(.52, .055, .75, mt(0xffb02e, { emissive: 0x6a3900 }), 20), 'Koku epiteli', 'Burun boşluğunun üst kısmındaki, koku reseptörlerinin bulunduğu özel dokudur. Koku molekülleri burada çözünür ve reseptörleri uyarır.', 'Kemoreseptör · nöron', 'koku'); at(ep, 0, 1.36, .12); g.add(ep);
      const ep2 = G(ellip(.05, .38, .5, mt(0xffb02e, { emissive: 0x6a3900 }), 14), 'koku'); at(ep2, -.48, 1.02, .12); g.add(ep2);
      /* kalbur kemik */
      const cr = S(new THREE.Mesh(new THREE.BoxGeometry(.95, .07, 1.5), mt(0xe8e4d6)), 'Kalbur kemik', 'Koku siniri liflerinin geçtiği, delikli ince kemik plakadır. Burun boşluğu ile kafatası boşluğu (koku soğanı) arasında yer alır.', 'Delikli kemik plaka', 'beyin'); at(cr, 0, 1.62, .1); g.add(cr);
      const rr = srand(7), holes = [];
      for (let i = 0; i < 14; i++) { const x = (rr() - .5) * .7, z = -.5 + rr() * 1.3; holes.push([x, z]); const h = G(at(new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, .09, 8), mt(0x111111)), x, 1.62, z + .1), 'beyin'); g.add(h); }
      holes.forEach(([x, z], i) => { const nv = S(cylBetween([x * .8, 1.4, z + .1], [x * .5, 2.0, z * .6 + .12], .018, mt(0xffd34d, { emissive: 0x3a2900 }), 6), 'Koku siniri', 'Koku reseptör nöronlarının uzantılarından oluşan sinirdir; reseptörlerde oluşan uyartıları kalbur kemikteki deliklerden geçirerek koku soğanına taşır.', 'Uyartıyı iletir', 'koku'); g.add(nv); });
      const bulb = S(ellip(.55, .25, .75, mt(0x9b6be8), 24), 'Koku soğanı', 'Koku sinirlerinin sonlandığı, uyartıların nöronlarla merkezî sinir sistemine aktarıldığı yapıdır.', 'Uyartının iletimi', 'beyin'); at(bulb, 0, 2.08, .12); g.add(bulb);
      const tract = S(curveTube([[0, 2.1, -.5], [0, 2.3, -1.3], [0, 2.8, -2.2], [0, 3.1, -2.9]], .09, mt(0xf5c542, { emissive: 0x2b2100 }), 24), 'Koku yolu', 'Koku soğanından beyne giden sinirsel yoldur.', 'Uyartıyı beyne taşır', 'beyin'); g.add(tract);
      const br = S(new THREE.Mesh(new THREE.SphereGeometry(1.2, 40, 30), glass(0xe9a9b8, .55)), 'Beyin (koku merkezi)', 'Koku soğanından gelen sinirsel mesajları yorumlar; koku algısı beyinde oluşur. Koku, tat ile birlikte besinin lezzetinin algılanmasına katkı sağlar.', 'Algının oluştuğu yer', 'beyin');
      br.scale.set(.95, .8, 1.3); at(br, 0, 3.0, -3.7); br.userData.low = true; g.add(br);
      /* sinyal nabzı */
      { const f = pathFollower(0xffffff, .09, [V3(0, 1.4, .1), V3(0, 1.75, .12), V3(0, 2.1, .1), V3(0, 2.15, -.5), V3(0, 2.4, -1.3), V3(0, 2.8, -2.2), V3(0, 3.0, -3.1)], .2, 0); g.add(G(f.orb, 'koku')); ticks.push(t => f.tick(t)); }
      /* koku molekülleri */
      const mol = [], colors = [0xffd34d, 0x6ee7b7, 0xff7ab8, 0x8ab4ff];
      const toEp = new THREE.CatmullRomCurve3([V3(.0, -2.7, 2.9), V3(0, -1.85, 1.45), V3(0, -.6, 1.1), V3(0, .6, .75), V3(0, 1.25, .25)]);
      const toTh = new THREE.CatmullRomCurve3([V3(.0, -2.7, 2.9), V3(0, -1.85, 1.45), V3(0, -.7, 1.0), V3(0, -.3, -.1), V3(0, -.5, -.9), V3(0, -1.6, -1.25), V3(0, -2.8, -1.2)]);
      for (let i = 0; i < 46; i++) { const m = new THREE.Mesh(i % 3 === 0 ? new THREE.OctahedronGeometry(.075) : i % 3 === 1 ? new THREE.BoxGeometry(.1, .1, .1) : new THREE.SphereGeometry(.07, 8, 8), new THREE.MeshBasicMaterial({ color: colors[i % 4] })); g.add(G(m, 'mol')); mol.push({ m, u: Math.random(), s: .07 + Math.random() * .05, jx: (Math.random() - .5) * .22, jz: (Math.random() - .5) * .1, ep: Math.random() }); }
      ticks.push((t, dt) => mol.forEach(o => { o.u += dt * o.s * (api.flow === undefined ? 1 : api.flow); if (o.u > 1) { o.u = 0; o.ep = Math.random(); } const c = o.ep < api.sniff ? toEp : toTh; const p = c.getPoint(o.u); o.m.position.set(p.x + o.jx * Math.sin(o.u * 9), p.y, p.z + o.jz); o.m.rotation.x += dt * 2; o.m.rotation.y += dt * 1.5; }));
      return { g, sels, ticks, api };
    }
  };

  /* ============ KOKU EPİTELİ (ayrıntı) ============ */
  M3.kokuepiteli = {
    title: 'Koku Epiteli (ayrıntı)', ico: '🌸', tag: 'Kemoreseptör · Nöron', cam: [6.5, 2.4, 8.2], target: [0, 1.4, 0], labScale: .8,
    layers: [['Mukus tabakası ve tüycükler', 'muk'], ['Koku reseptör nöronları', 'nor'], ['Destek ve bazal hücreler', 'des'], ['Kalbur kemik ve koku soğanı', 'bul'], ['Koku molekülleri', 'mol']],
    task: 'Koku moleküllerinin mukus tabakasında çözünüp tüycüklerdeki reseptörlere bağlanmasını izle. Koku reseptörünün bir nöron olduğuna ve aksonunun kalbur kemikten geçerek koku soğanına ulaştığına dikkat et.',
    q: { q: 'Koku reseptörleri nöron yapısındadır ve ......... uyarılır. Boşluğa ne gelmelidir?', o: ['ışıkla', 'kimyasal maddelerle (koku molekülleriyle)', 'basınçla', 'sıcaklıkla'], a: 1, e: 'Koku reseptör nöronları kemoreseptördür; havadaki koku molekülleri (kimyasal uyaran) mukusta çözünüp tüycüklerdeki reseptörlere bağlanınca uyarılır.' },
    build() {
      const { g, sels, ticks, S, G } = B(), api = { N: [], act: [0, 0, 0] };
      const rr = srand(41), TC = [0xff6b6b, 0x59e08a, 0x6b8aff];
      /* katmanlar */
      const muk = S(new THREE.Mesh(new THREE.BoxGeometry(5, 1.1, 2.8), glass(0xfff2a8, .3)), 'Mukus tabakası', 'Koku epitelini örten sıvı tabakadır. Havadaki koku molekülleri burada çözünür ve tüycüklerdeki reseptörlere ulaşır.', 'Koku moleküllerinin çözündüğü yer', 'muk'); muk.userData.low = true; at(muk, 0, -.45, 0); g.add(muk);
      const lam = S(new THREE.Mesh(new THREE.BoxGeometry(5, .09, 2.8), mt(0xb9a083)), 'Taban zarı (epitel tabanı)', 'Koku epitelinin tabanında yer alan ince zardır; bazal hücreler buraya oturur.', 'Epitelin alt sınırı', 'des'); at(lam, 0, 2.3, 0); g.add(lam);
      const xs = [-2, -1.2, -.4, .4, 1.2, 2], zs = [-.8, .6];
      let k = 0;
      xs.forEach((x, ix) => zs.forEach((z, iz) => {
        const type = (ix + iz) % 3, c = TC[type], zz = z + (ix % 2 ? .2 : -.1);
        const knob = S(new THREE.Mesh(new THREE.SphereGeometry(.1, 12, 10), mt(c, { emissive: 0x000000 })), 'Koku reseptör nöronu', 'Koku molekülünü algılayıp elektrik sinyaline dönüştüren duyu hücresidir; nöron yapısındadır (kemoreseptör). Her nöron belirli koku moleküllerine duyarlı reseptörler taşır.', 'Kemoreseptör · nöron', 'nor'); at(knob, x, .15, zz); g.add(knob);
        const den = S(cylBetween([x, .15, zz], [x, 1.25, zz], .05, mt(c, { emissive: 0x000000 })), 'Koku reseptör nöronu', 'Koku molekülünü algılayıp elektrik sinyaline dönüştüren duyu hücresidir; nöron yapısındadır (kemoreseptör).', 'Kemoreseptör · nöron', 'nor'); g.add(den);
        const body = S(ellip(.19, .3, .19, mt(c, { emissive: 0x000000 }), 16), 'Koku reseptör nöronu', 'Koku molekülünü algılayıp elektrik sinyaline dönüştüren duyu hücresidir; nöron yapısındadır (kemoreseptör).', 'Kemoreseptör · nöron', 'nor'); at(body, x, 1.55, zz); g.add(body);
        const ax = S(curveTube([[x, 1.85, zz], [x, 2.6, zz], [x + (rr() - .5) * .3, 3.35, zz], [x * .9, 3.95, zz * .9]], .028, mt(0xffd34d, { emissive: 0x2b2100 }), 24), 'Akson (koku siniri lifi)', 'Koku reseptör nöronunun aksonudur; kalbur kemikteki delikten geçerek koku soğanına ulaşır ve uyartıyı iletir.', 'Uyartıyı iletir', 'nor'); g.add(ax);
        const cil = []; for (let j = 0; j < 6; j++) { const a = j / 6 * 6.283, pts = [[x, .15, zz], [x + Math.cos(a) * .25, -.2, zz + Math.sin(a) * .25], [x + Math.cos(a + .6) * .55, -.55 - rr() * .1, zz + Math.sin(a + .6) * .55], [x + Math.cos(a + 1.1) * .85, -.85 - rr() * .1, zz + Math.sin(a + 1.1) * .6]]; const t = S(curveTube(pts, .012, mt(c, { emissive: new THREE.Color(c).multiplyScalar(.15).getHex() }), 14), 'Koku tüycükleri (silyum)', 'Koku reseptör nöronunun mukus içine uzanan tüycükleridir. Koku moleküllerinin bağlandığı reseptör proteinleri bu tüycüklerin zarında bulunur.', 'Reseptörlerin bulunduğu bölge', 'muk'); g.add(t); cil.push(t); }
        const glom = S(new THREE.Mesh(new THREE.SphereGeometry(.17, 14, 12), mt(c, { emissive: 0x000000 })), 'Glomerül (koku soğanı)', 'Aynı tür reseptör nöronların aksonlarının toplandığı küçük yuvarlak yapıdır; uyartı burada sonraki nöronlara aktarılır.', 'Sinaps bölgesi', 'bul'); at(glom, x * .9, 4.0, zz * .9); g.add(glom);
        api.N.push({ type, knob, den, body, ax, glom, cil, curve: new THREE.CatmullRomCurve3([V3(x, .15, zz), V3(x, 1.25, zz), V3(x, 1.85, zz), V3(x, 2.6, zz), V3(x * .9, 3.95, zz * .9)]), pulses: [], x, z: zz, a: 0 });
      }));
      /* destek hücreleri */
      for (let i = 0; i < 9; i++) { const x = -2.4 + i * .6 + .0, z = (i % 2 ? .1 : -.2); const d = S(new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, 2.1, 12), glass(0x9fc9ff, .22)), 'Destek hücresi', 'Reseptör nöronlarının arasında yer alan, onlara destek olan ve mukusu besleyen hücrelerdir.', 'Destek', 'des'); at(d, x, 1.2, z + (i % 3 - 1) * .5); g.add(d); }
      for (let i = 0; i < 16; i++) { const b = S(ellip(.13, .1, .13, mt(0x8c7bb8), 10), 'Bazal hücre', 'Epitelin tabanında bulunan, yaşlanan reseptör nöronlarının yerine yenisini oluşturabilen kök hücrelerdir.', 'Yenilenme', 'des'); at(b, -2.3 + (i % 8) * .65, 2.15, (i < 8 ? -.9 : .8)); g.add(b); }
      /* kalbur kemik */
      const plate = S(new THREE.Mesh(new THREE.BoxGeometry(5, .24, 2.8), mt(0xe8e4d6, { transparent: true, opacity: .9 })), 'Kalbur kemik', 'Delikli ince kemik plakadır; koku nöronlarının aksonları buradaki deliklerden geçerek koku soğanına ulaşır.', 'Delikli kemik plaka', 'bul'); at(plate, 0, 3.3, 0); g.add(plate);
      api.N.forEach(n => g.add(G(at(new THREE.Mesh(new THREE.TorusGeometry(.09, .03, 8, 14).rotateX(Math.PI / 2), mt(0x222222)), n.x * .95, 3.42, n.z * .95), 'bul')));
      const bulb = S(ellip(2.9, .75, 1.7, glass(0xb48cf0, .35), 28), 'Koku soğanı', 'Reseptör nöronlarının aksonlarının ulaştığı, uyartının merkezî sinir sistemine aktarıldığı yapıdır.', 'Uyartının iletimi', 'bul'); bulb.userData.low = true; at(bulb, 0, 4.15, 0); g.add(bulb);
      for (let i = 0; i < 6; i++) { const mi = S(ellip(.16, .14, .16, mt(0x7a4cd6), 10), 'Mitral hücre', 'Koku soğanındaki nöronlardır; glomerüldeki aksonlardan sinyal alıp koku yoluyla beyne iletir.', 'Uyartıyı beyne taşır', 'bul'); at(mi, -2 + i * .8, 4.4, (i % 2 ? .4 : -.4)); g.add(mi); }
      const tr = S(curveTube([[1.9, 4.4, 0], [2.8, 4.5, 0], [4.0, 4.5, 0], [5.0, 4.6, 0]], .12, mt(0xf5c542, { emissive: 0x2b2100 }), 24), 'Koku yolu', 'Koku soğanından beyne giden sinirsel yoldur.', 'Uyartıyı beyne taşır', 'bul'); g.add(tr);
      /* hareketli moleküller */
      const mol = []; for (let i = 0; i < 40; i++) { const t = i % 3; const m = new THREE.Mesh(t === 0 ? new THREE.BoxGeometry(.13, .13, .13) : t === 1 ? new THREE.OctahedronGeometry(.1) : new THREE.SphereGeometry(.09, 8, 8), new THREE.MeshBasicMaterial({ color: TC[t] })); g.add(G(m, 'mol')); mol.push({ m, t, u: Math.random(), x: (rr() - .5) * 4.4, z: (rr() - .5) * 2.2 }); }
      api.moleculeRate = 1; api.molType = -1; /* -1: hepsi */
      ticks.push((tm, dt) => mol.forEach(o => { o.u += dt * .13 * api.moleculeRate; if (o.u > 1) { o.u = 0; o.x = (rr() - .5) * 4.4; o.z = (rr() - .5) * 2.2; } o.m.visible = api.molType < 0 || api.molType === o.t; o.m.position.set(o.x + Math.sin(tm * 2 + o.u * 7) * .1, -2.3 + o.u * 2.1, o.z); o.m.rotation.x += dt * 2; o.m.rotation.y += dt * 2; }));
      /* etkinlik */
      api.stim = (type, v) => { api.N.forEach(n => { if (type < 0 || n.type === type) n.a = Math.max(n.a, v); }); };
      const pool = []; for (let i = 0; i < 60; i++) { const o = glow(0xffffff, .075); o.visible = false; g.add(G(o, 'nor')); pool.push({ o, n: null, u: 0, on: false }); }
      let acc = 0;
      ticks.push((tm, dt) => {
        acc += dt;
        api.N.forEach(n => {
          n.a = Math.max(0, n.a - dt * .35); const e = n.a, c = new THREE.Color(TC[n.type]);
          [n.knob, n.den, n.body, n.glom].forEach(m => { if (m.material.emissive) m.material.emissive.copy(c).multiplyScalar(e * .9); });
          n.cil.forEach(m => m.material.emissive.copy(c).multiplyScalar(.15 + e * .8));
          if (e > .12 && acc > .18 / Math.max(.3, e) && Math.random() < .35) { const f = pool.find(p => !p.on); if (f) { f.on = true; f.n = n; f.u = 0; f.o.visible = true; } }
        });
        if (acc > .2) acc = 0;
        pool.forEach(p => { if (!p.on) return; p.u += dt * .5; if (p.u >= 1) { p.on = false; p.o.visible = false; return; } p.o.position.copy(p.n.curve.getPoint(p.u)); });
      });
      return { g, sels, ticks, api };
    }
  };

  /* ============ DİL ============ */
  function tongueTopY(x, z) { const a = x / (1.3 * (1 - .5 * Math.pow(Math.max(0, z) / 2.4, 2))), q = a * a + (z / 2.4) * (z / 2.4); return q >= 1 ? 0 : .42 * Math.sqrt(1 - q); }
  M3.dil = {
    title: 'Dil', ico: '👅', tag: 'Kemoreseptör · Duyu epiteli', cam: [0, 6.2, 4.6], target: [0, 0, 0], labScale: .8,
    layers: [['Filiform papilla (tat tomurcuğu yok)', 'fil'], ['Mantar şekilli papilla', 'fun'], ['Çevrili ve yaprak şekilli papilla', 'cir'], ['Tat tomurcukları', 'bud'], ['“Dil haritası” efsanesi (yanlış)', 'mit', 'off']],
    task: 'Parlayan sarı tat tomurcuklarını bul ve tıkla; hangi papillalarda bulunduklarını not et. Tat tomurcuklarının reseptör çeşidini ve yapısını (duyu epiteli) belirle. “Dil haritası efsanesi” katmanını açıp gerçekle karşılaştır.',
    q: { q: 'Dildeki tat tomurcukları için hangisi doğrudur?', o: ['Nöron yapısında mekanoreseptör', 'Duyu epiteli yapısında kemoreseptör', 'Nöron yapısında fotoreseptör', 'Duyu epiteli yapısında nosiseptör'], a: 1, e: 'Tat tomurcukları duyu epiteli yapısındadır ve kimyasal uyaranları (tat molekülleri) algılayan kemoreseptörler içerir. Dilde ayrıca termoreseptörler de bulunur.' },
    build() {
      const { g, sels, ticks, S, G } = B(), api = {};
      const geo = new THREE.SphereGeometry(1, 72, 48); const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) { let x = pos.getX(i) * 1.3, y = pos.getY(i) * .42, z = pos.getZ(i) * 2.4; const tp = 1 - .5 * Math.pow(Math.max(0, z) / 2.4, 2); x *= tp; if (y > 0) y -= .035 * Math.exp(-Math.pow(x / .09, 2)) * (z > -1 ? 1 : 0); pos.setXYZ(i, x, y, z); }
      geo.computeVertexNormals();
      const body = S(new THREE.Mesh(geo, mt(0xe0707f, { roughness: .85 })), 'Dil gövdesi', 'Kas yapılı, hareketli bir organdır. Yüzeyindeki papillalarda tat tomurcukları bulunur. Dilde kemoreseptörlerin yanı sıra termoreseptörler de yer alır.', 'Duyu organı', 'fil'); g.add(body);
      const rr = srand(17);
      /* filiform */
      const fil = S(instMesh(new THREE.ConeGeometry(.022, .075, 5), mt(0xf6c9c9, { roughness: .9 }), 1500, (i, d) => { let x, z; do { x = (rr() * 2 - 1) * 1.3; z = (rr() * 2 - 1) * 2.4; } while (tongueTopY(x, z) <= .02); const y = tongueTopY(x, z); d.position.set(x, y + .02, z); }), 'Filiform (iplik şekilli) papilla', 'Dil yüzeyini kaplayan, en çok sayıdaki küçük çıkıntılardır. Dile pürüzlü bir doku verir; tat tomurcuğu bulundurmaz.', 'Dil yüzeyi · tat tomurcuğu yok', 'fil'); g.add(fil);
      /* mantar şekilli papillalar + tomurcuk */
      const funPos = []; for (let i = 0; i < 80 && funPos.length < 46; i++) { const tip = rr() < .55; const z = tip ? .7 + rr() * 1.5 : -.6 + rr() * 2.3; const w = 1.3 * (1 - .5 * Math.pow(Math.max(0, z) / 2.4, 2)) * Math.sqrt(Math.max(0, 1 - (z / 2.4) ** 2)); const x = (tip ? (rr() * 2 - 1) : (rr() < .5 ? -1 : 1) * (.7 + rr() * .3)) * w * .92; if (tongueTopY(x, z) > .03) funPos.push([x, z]); }
      const fun = S(instMesh(new THREE.SphereGeometry(.065, 10, 8), mt(0xd6405a, { roughness: .6 }), funPos.length, (i, d) => { const [x, z] = funPos[i]; d.position.set(x, tongueTopY(x, z) + .045, z); d.scale.set(1, .75, 1); }), 'Mantar şekilli papilla', 'Özellikle dil ucunda ve kenarlarında bulunan, mantara benzeyen kırmızımsı papillalardır. Üst yüzeylerinde tat tomurcukları bulunur.', 'Tat tomurcuğu içerir', 'fun'); g.add(fun);
      const bud = []; funPos.forEach(([x, z]) => { const b = S(new THREE.Mesh(new THREE.SphereGeometry(.03, 8, 8), mt(0xffd34d, { emissive: 0xaa8000 })), 'Tat tomurcuğu', 'Tat tomurcukları duyu epiteli yapısındadır. İçlerindeki kemoreseptörler (tat reseptör hücreleri) tat moleküllerini algılar; uyartılar nöronlarla merkezî sinir sistemine iletilir.', 'Kemoreseptör · duyu epiteli', 'bud'); at(b, x, tongueTopY(x, z) + .11, z); g.add(b); bud.push(b); });
      /* çevrili papillalar (V şekli) */
      for (let i = 0; i < 9; i++) { const side = i - 4, x = side * .2, z = -1.3 + Math.abs(side) * .13; const y = tongueTopY(x, z);
        const cp = S(new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, .1, 16), mt(0xc65a6c)), 'Çevrili papilla', 'Dilin arka kısmında “V” şeklinde dizilmiş, etrafı oluklu büyük papillalardır. Kenarlarında çok sayıda tat tomurcuğu bulunur.', 'Tat tomurcuğu içerir', 'cir'); at(cp, x, y + .03, z); g.add(cp);
        const tr = G(at(new THREE.Mesh(new THREE.TorusGeometry(.15, .025, 8, 20).rotateX(Math.PI / 2), mt(0x7a2b3a)), x, y + .0, z), 'cir'); g.add(tr);
        for (let k = 0; k < 4; k++) { const a = k * 1.57 + .4, b = S(new THREE.Mesh(new THREE.SphereGeometry(.025, 8, 8), mt(0xffd34d, { emissive: 0xaa8000 })), 'Tat tomurcuğu', 'Tat tomurcukları duyu epiteli yapısındadır. İçlerindeki kemoreseptörler tat moleküllerini algılar.', 'Kemoreseptör · duyu epiteli', 'bud'); at(b, x + Math.cos(a) * .12, y + .02, z + Math.sin(a) * .12); g.add(b); bud.push(b); } }
      /* yaprak şekilli papilla */
      [-1, 1].forEach(sd => { for (let i = 0; i < 7; i++) { const z = -1.5 + i * .17, x = sd * (1.05 - Math.abs(z + 1) * .25); const f = S(new THREE.Mesh(new THREE.BoxGeometry(.2, .1, .035), mt(0xb04a5e)), 'Yaprak şekilli papilla', 'Dilin arka yan kenarlarında bulunan, yaprağa benzeyen kıvrımlı papillalardır; tat tomurcukları içerir.', 'Tat tomurcuğu içerir', 'cir'); at(f, x, tongueTopY(x * .9, z) + .02, z); f.rotation.y = Math.PI / 2; f.rotation.z = sd * .2; g.add(f); const b = S(new THREE.Mesh(new THREE.SphereGeometry(.02, 8, 8), mt(0xffd34d, { emissive: 0xaa8000 })), 'Tat tomurcuğu', 'Tat tomurcukları duyu epiteli yapısındadır.', 'Kemoreseptör · duyu epiteli', 'bud'); at(b, x, tongueTopY(x * .9, z) + .09, z); g.add(b); bud.push(b); } });
      ticks.push(t => bud.forEach((b, i) => b.scale.setScalar(1 + Math.sin(t * 3 + i) * .22)));
      /* terminal oluk */
      const root = S(ellip(1.1, .3, .5, mt(0xd9606f), 20), 'Dil kökü', 'Dilin arka, yutağa bakan bölümüdür.', 'Dil', 'fil'); at(root, 0, -.02, -2.45); g.add(root);
      /* efsane haritası */
      const tex = canvasTex(256, 420, (x, w, h) => { x.clearRect(0, 0, w, h); const z = [['#ff5da8', 'TATLI', .75, 1], ['#ffd34d', 'TUZLU', .5, .75], ['#59e08a', 'EKŞİ', .2, .5], ['#6b8aff', 'ACI', 0, .2]]; x.globalAlpha = .65; z.forEach(([c, t, a, b]) => { x.fillStyle = c; x.fillRect(0, h * (1 - b), w, h * (b - a)); }); x.globalAlpha = 1; x.fillStyle = '#fff'; x.font = '800 26px sans-serif'; x.textAlign = 'center'; z.forEach(([c, t, a, b]) => x.fillText(t, w / 2, h * (1 - (a + b) / 2) + 8)); x.fillStyle = 'rgba(255,60,60,.95)'; x.font = '800 34px sans-serif'; x.fillText('✖ EFSANE', w / 2, 36); });
      const mit = G(new THREE.Mesh(new THREE.PlaneGeometry(3.0, 5.0).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })), 'mit'); mit.position.set(0, .62, 0); mit.visible = false; g.add(mit);
      /* tat molekülleri */
      const mols = []; for (let i = 0; i < 30; i++) { const m = glow([0x6ee7b7, 0xffd34d, 0xff7ab8, 0x8ab4ff][i % 4], .05); g.add(m); mols.push({ m, p: Math.random(), x: (Math.random() - .5) * 2, z: (Math.random() - .5) * 4.4, s: .15 + Math.random() * .1 }); }
      ticks.push((t, dt) => mols.forEach(o => { o.p += dt * o.s; if (o.p > 1) o.p = 0; o.m.position.set(o.x, 2.2 - o.p * 1.9, o.z); }));
      return { g, sels, ticks, api };
    }
  };

  /* ============ TAT TOMURCUĞU (ayrıntı) ============ */
  M3.tattomurcugu = {
    title: 'Tat Tomurcuğu (ayrıntı)', ico: '🍋', tag: 'Kemoreseptör · Duyu epiteli', cam: [5.2, 2.2, 7.6], target: [0, .6, 0], labScale: .8,
    layers: [['Tükürük ve çözünen maddeler', 'sal'], ['Tat tomurcuğu (reseptör ve destek hücreleri)', 'bud'], ['Dil epiteli ve alt doku', 'epi'], ['Sinir lifleri', 'sin']],
    task: 'Tükürükte çözünen tat moleküllerinin tat gözeneğinden girip tat reseptör hücrelerinin tüycüklerine ulaşmasını izle. Reseptör hücrelerin duyu epiteli yapısında olduğunu, sinir liflerinin ise nöron olduğunu not et.',
    q: { q: 'Tat alma sürecinde besinlerdeki kimyasal maddeler önce nerede çözünür?', o: ['Tükürükte', 'Kan damarlarında', 'Kulak zarında', 'Miyelin kılıfta'], a: 0, e: 'Besinlerdeki kimyasal maddeler tükürükte çözünür; çözünen maddeler tat tomurcuklarındaki reseptörleri uyarır.' },
    build() {
      const { g, sels, ticks, S, G } = B(), api = { act: [0, 0, 0, 0, 0] };
      const TCOL = [0xff5da8, 0x9be34f, 0xf0f0f0, 0x8a6bff, 0xff9f3b], TN = ['tatlı', 'ekşi', 'tuzlu', 'acı', 'umami'];
      const rr = srand(5);
      /* epitel + alt doku */
      [-1, 1].forEach(sd => { const e = S(new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.0, 2.6), mt(0xe99aa8, { transparent: true, opacity: .8 })), 'Dil epiteli', 'Dilin yüzeyini örten hücre tabakasıdır; tat tomurcukları bu tabakanın içine gömülüdür.', 'Epitel doku', 'epi'); at(e, sd * 1.6, .6, 0); g.add(e); });
      const lp = S(new THREE.Mesh(new THREE.BoxGeometry(5.4, 1.2, 2.6), mt(0xc9606f, { transparent: true, opacity: .7 })), 'Alt doku (bağ doku)', 'Epitelin altındaki, kan damarları ve sinir liflerini bulunduran dokudur.', 'Alt doku', 'epi'); at(lp, 0, -1.0, 0); g.add(lp);
      const sal = S(new THREE.Mesh(new THREE.BoxGeometry(5.4, 1.3, 2.6), glass(0x9fd9ff, .22)), 'Tükürük', 'Besinlerdeki kimyasal maddelerin çözündüğü sıvıdır; çözünen maddeler tat tomurcuklarındaki reseptörlere ulaşır.', 'Çözücü sıvı', 'sal'); sal.userData.low = true; at(sal, 0, 2.25, 0); g.add(sal);
      /* tomurcuk hücreleri (soğan biçimi) */
      const N = 14, cells = [];
      for (let i = 0; i < N; i++) {
        const a = i / N * 6.283, rad = .5 + .22 * Math.sin(a * 2 + 1) * 0, isRec = i % 2 === 0, t = (i / 2 | 0) % 5;
        const base = V3(Math.cos(a) * .55, -.55, Math.sin(a) * .55), top = V3(Math.cos(a) * .12, 1.55, Math.sin(a) * .12), mid = V3(Math.cos(a) * .72, .55, Math.sin(a) * .72);
        const c = new THREE.CatmullRomCurve3([base, mid, top]);
        const col = isRec ? TCOL[t] : 0x8fb2d9;
        const geo = new THREE.TubeGeometry(c, 20, .12, 8, false), p = geo.attributes.position; /* uçlara doğru ince */
        const m = S(new THREE.Mesh(geo, mt(col, { emissive: 0x000000, transparent: true, opacity: .9 })), isRec ? 'Tat reseptör hücresi' : 'Destek hücresi', isRec ? 'Tat tomurcuğunun içindeki, tat moleküllerini algılayan duyu hücresidir (kemoreseptör). Duyu epiteli yapısındadır; ucundaki tüycükler tat gözeneğine uzanır. Altında sinir uçlarıyla temas eder.' : 'Tat reseptör hücrelerini saran ve destekleyen hücrelerdir.', isRec ? 'Kemoreseptör · duyu epiteli' : 'Destek', 'bud');
        g.add(m); cells.push({ m, rec: isRec, t });
        if (isRec) { const mv = G(curveTube([top.clone().add(V3(0, 0, 0)), top.clone().add(V3(0, .3, 0))], .016, mt(col, { emissive: 0x222222 }), 6), 'bud'); mv.position.set(Math.cos(a) * .0, 0, Math.sin(a) * .0); g.add(mv); for (let k = 0; k < 3; k++) { const tf = S(cylBetween(top, top.clone().add(V3((rr() - .5) * .22, .42, (rr() - .5) * .22)), .01, mt(col, { emissive: 0x333333 }), 4), 'Tat tüycükleri', 'Reseptör hücrenin ucundaki ince uzantılardır; tat gözeneğinden içeri giren moleküller burada reseptörlere bağlanır.', 'Reseptörlerin bulunduğu uç', 'bud'); g.add(tf); } }
      }
      const pore = S(new THREE.Mesh(new THREE.TorusGeometry(.2, .05, 8, 24).rotateX(Math.PI / 2), mt(0x7a2b3a)), 'Tat gözeneği', 'Tat tomurcuğunun tükürükle temas ettiği küçük açıklıktır; çözünmüş tat molekülleri buradan tomurcuğa girer.', 'Moleküllerin girişi', 'bud'); at(pore, 0, 1.58, 0); g.add(pore);
      for (let i = 0; i < 6; i++) { const b = S(ellip(.1, .08, .1, mt(0x8c7bb8), 10), 'Bazal hücre', 'Tat tomurcuğunun tabanında bulunan, yıpranan tat hücrelerinin yenilenmesini sağlayan hücrelerdir.', 'Yenilenme', 'bud'); at(b, Math.cos(i) * .45, -.62, Math.sin(i) * .45); g.add(b); }
      /* sinirler */
      const nv = [], nvp = [];
      for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283 + .3; const pts = [[Math.cos(a) * .55, -.4, Math.sin(a) * .55], [Math.cos(a) * .4, -.9, Math.sin(a) * .4], [Math.cos(a) * .25, -1.3, Math.sin(a) * .25], [0, -1.8, 0]]; const t = S(curveTube(pts, .035, mt(0xffd34d, { emissive: 0x2b2100 }), 14), 'Duyu siniri lifi (nöron)', 'Tat reseptör hücrelerinden aldığı mesajı beyne taşıyan sinir hücresi uzantısıdır.', 'Uyartıyı iletir', 'sin'); g.add(t); nv.push(t); }
      const tr = S(curveTube([[0, -1.8, 0], [0, -2.5, .6], [-1.0, -3.3, 1.8], [-2.5, -4.0, 3.0]], .13, mt(0xf5c542, { emissive: 0x2b2100 }), 24), 'Tat siniri (beyne giden sinir)', 'Tat tomurcuklarından gelen sinirsel mesajları merkezî sinir sistemine (beyne) taşıyan sinirdir.', 'Uyartıyı beyne taşır', 'sin'); g.add(tr);
      { const f = pathFollower(0xffffff, .09, [V3(0, -.4, 0), V3(0, -1.8, 0), V3(0, -2.5, .6), V3(-1, -3.3, 1.8), V3(-2.5, -4.0, 3.0)], .2, 0); g.add(G(f.orb, 'sin')); ticks.push(t => f.tick(t)); }
      /* moleküller */
      const mol = []; for (let i = 0; i < 60; i++) { const t = i % 5; const m = new THREE.Mesh(t === 0 ? new THREE.SphereGeometry(.07, 8, 8) : t === 1 ? new THREE.OctahedronGeometry(.08) : t === 2 ? new THREE.BoxGeometry(.1, .1, .1) : t === 3 ? new THREE.TetrahedronGeometry(.1) : new THREE.IcosahedronGeometry(.08), new THREE.MeshBasicMaterial({ color: TCOL[t] })); g.add(G(m, 'sal')); mol.push({ m, t, u: Math.random(), ang: Math.random() * 6.283, r: Math.random() }); }
      api.molType = -1; api.rate = 1; api.dry = false;
      ticks.push((tm, dt) => mol.forEach(o => { const vis = (api.molType < 0 || api.molType === o.t); o.m.visible = vis && !api.dry; if (!o.m.visible) return; o.u += dt * .16 * api.rate; if (o.u > 1) { o.u = 0; o.ang = Math.random() * 6.283; o.r = Math.random(); api.act[o.t] = Math.min(1, api.act[o.t] + .35); } const rad = (1 - o.u) * (2.0 * (1 - o.u) + .1) * o.r + .02; o.m.position.set(Math.cos(o.ang + o.u * 3) * rad, 3.0 - o.u * 1.4, Math.sin(o.ang + o.u * 3) * rad); o.m.rotation.x += dt * 2; o.m.rotation.y += dt * 2; }));
      ticks.push((tm, dt) => { for (let i = 0; i < 5; i++) api.act[i] = Math.max(0, api.act[i] - dt * .5); cells.forEach(c => { if (!c.rec) return; const e = api.act[c.t]; c.m.material.emissive.setHex(TCOL[c.t]).multiplyScalar(e * .55); }); nv.forEach(n => { const e = Math.max(...api.act); n.material.emissive.setRGB(.17 + e * .6, .13 + e * .45, 0); }); });
      api.TN = TN; api.TCOL = TCOL;
      return { g, sels, ticks, api };
    }
  };
})();
