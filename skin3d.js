/* Nasse Biology — Deri ve deri reseptörleri 3B modelleri (ayrıntılı, prosedürel) */
(function () {
  const TXT = {
    epi: 'Derinin en dış, koruyucu tabakasıdır. Üst yüzeyi ölü hücrelerden oluşur. Melanin pigmentini içerir; melanin deriye rengini verir ve zararlı ışınlardan korur. Serbest sinir uçları bu tabakaya kadar uzanır.',
    der: 'Epidermisin altındaki, kan damarları, sinirler, duyu reseptörleri, kıl kökleri ve çeşitli bezlerin bulunduğu tabakadır.',
    hip: 'Derinin en alt tabakasıdır (deri altı dokusu). Yağ dokusu bakımından zengindir; yalıtım ve darbelere karşı korumaya katkı sağlar.',
    mel: 'Epidermiste bulunan koyu renkli pigmenttir; deriye rengini verir ve zararlı ışınlara karşı korur.',
    meis: 'Dermisin üst kısmındaki papillalarda bulunan, hafif dokunmayı algılayan mekanoreseptördür. Nöron yapısındadır; kapsüllü bir yapıya sahiptir.',
    merk: 'Epidermis tabanında bulunan, sürekli hafif basıncı ve dokunmayı algılayan mekanoreseptördür; nöron ucu disk şeklindedir.',
    pac: 'Dermisin derininde ve deri altında yer alan, soğan zarı gibi katmanlı kapsüllü mekanoreseptördür. Basınç ve titreşimi algılar; nöron yapısındadır.',
    hot: 'Sıcaklık artışını algılayan termoreseptördür. Termoreseptörler çoğunlukla deri ve dilde bulunur.',
    cold: 'Sıcaklık azalmasını (soğuğu) algılayan termoreseptördür.',
    pain: 'Doku hasarına yol açabilecek fiziksel ve kimyasal uyaranları algılayan serbest sinir uçlarıdır (nosiseptör). Beyin hariç tüm vücutta bulunur; nöron yapısındadır.'
  };

  /* ============ DERİ ============ */
  M3.deri = {
    title: 'Deri', ico: '🖐️', tag: 'Mekano · Termo · Nosiseptör', cam: [3.2, 2.4, 8.4], target: [0, .7, 0], labScale: .8,
    layers: [['Epidermis (üst deri)', 'epi'], ['Dermis (alt deri) ve içindekiler', 'der'], ['Deri altı dokusu (yağ)', 'hip'], ['Reseptörler', 'rec'], ['Sinir ve damarlar', 'sin']],
    task: 'Deri katmanlarını (epidermis, dermis, deri altı dokusu) ve içindeki yapıları tek tek tıkla. Mekanoreseptör, termoreseptör ve ağrı reseptörünü ayırt edip her birinin hangi uyaranı algıladığını yaz; uyartının hangi yoldan beyne gittiğini izle.',
    q: { q: 'Derideki serbest sinir uçları hangi reseptöre örnektir?', o: ['Fotoreseptör', 'Ağrı reseptörü (nosiseptör)', 'Kemoreseptör', 'Elektromanyetik reseptör'], a: 1, e: 'Ağrı reseptörleri serbest sinir uçlarıdır; doku hasarına yol açabilecek uyaranları algılar.' },
    build() {
      const { g, sels, ticks, S, G } = B(), api = { rec: {} }, rr = srand(31);
      const lay = (h, y, c, op, n, i, t, grp) => { const m = S(new THREE.Mesh(new THREE.BoxGeometry(5.6, h, 3.2), mt(c, { transparent: true, opacity: op, depthWrite: false, roughness: .8 })), n, i, t, grp); m.userData.low = true; at(m, 0, y, 0); g.add(m); return m; };
      lay(.45, 1.775, 0xf3c2a2, .62, 'Epidermis (üst deri)', TXT.epi, 'Koruyucu dış tabaka · melanin', 'epi');
      g.add(G(at(new THREE.Mesh(new THREE.BoxGeometry(5.6, .08, 3.2), mt(0xf9e1d0, { roughness: .9 })), 0, 1.99, 0), 'epi'));
      lay(1.8, .65, 0xe88a9a, .5, 'Dermis (alt deri)', TXT.der, 'Reseptör · damar · sinir · bez', 'der');
      lay(1.35, -.925, 0xf2d27a, .42, 'Deri altı dokusu (hipodermis)', TXT.hip, 'Yağ · yalıtım · darbe koruması', 'hip');
      /* melanin */
      const mel = S(instMesh(new THREE.SphereGeometry(.05, 8, 6), mt(0x4a2a14), 90, (i, d) => { d.position.set((rr() - .5) * 5.2, 1.6 + rr() * .06, (rr() - .5) * 2.9); }), 'Melanin pigmenti', TXT.mel, 'Epidermiste · deri rengi', 'epi'); g.add(mel);
      /* dermal papillalar */
      g.add(G(instMesh(new THREE.ConeGeometry(.13, .3, 10), mt(0xf2a6b3, { transparent: true, opacity: .8 }), 14, (i, d) => { d.position.set(-2.4 + i * .38, 1.58, (i % 3 - 1) * .8 + .1); }), 'der'));
      /* kıl */
      const folPts = [[-1.6, .12, .2], [-1.55, .7, .2], [-1.47, 1.35, .2], [-1.4, 2.0, .2]];
      const fol = S(curveTube(folPts, .1, glass(0xe9c9b8, .5), 30), 'Kıl kökü (kıl folikülü)', 'Dermiste bulunan, kılın çıktığı keseciktir. Kılın dibindeki sinir uçları kılın hareketini ve dokunmayı algılar.', 'Dermiste · mekanik uyaranı hisseder', 'der'); g.add(fol);
      const bulb = S(new THREE.Mesh(new THREE.SphereGeometry(.18, 14, 12), mt(0xf5e1d3)), 'Kıl kökü (kıl folikülü)', 'Dermiste bulunan, kılın çıktığı keseciktir.', 'Dermiste', 'der'); at(bulb, -1.6, .08, .2); g.add(bulb);
      const hair = S(curveTube([[-1.6, .12, .2], [-1.5, 1.2, .2], [-1.42, 2.0, .2], [-1.25, 2.6, .2], [-.9, 3.1, .2]], .038, mt(0x3a2415), 40), 'Kıl', 'Epidermisin dışına uzanan keratinli yapıdır; kılın dibindeki sinir uçları dokunma ve hareketi algılar.', 'Mekanik uyaran', 'der'); g.add(hair);
      [[-1.2, 1.0, .2], [-1.1, 1.18, .38], [-1.22, 1.22, .02]].forEach(([x, y, z]) => { const sg = S(ellip(.14, .12, .14, mt(0xfff0a8), 12), 'Yağ bezi', 'Kıl kökünün yanında bulunan, deriyi ve kılı yağlayan bezdir. Dermiste yer alır.', 'Dermiste · bez', 'der'); at(sg, x, y, z); g.add(sg); });
      const ar = S(cylBetween([-1.5, .85, .2], [-.75, 1.52, .2], .04, mt(0xb34a4a)), 'Kıl dikleştirici kas', 'Kıl kökünü epidermise doğru çeken küçük kastır; kasılınca kıl dikleşir.', 'Dermiste · kas', 'der'); g.add(ar);
      /* ter bezi */
      const cp = []; for (let i = 0; i <= 70; i++) { const a = i / 70 * Math.PI * 2 * 4, r = .19; cp.push(V3(1.6 + Math.cos(a) * r, .0 + i / 70 * .62, .35 + Math.sin(a) * r)); }
      const sw = S(curveTube(cp, .034, mt(0x9ad1ff, { emissive: 0x112233 }), 140), 'Ter bezi', 'Dermiste bulunan, kıvrımlı bezdir; ter kanalıyla epidermisi geçerek deri yüzeyindeki gözeneğe açılır.', 'Dermiste · bez', 'der'); g.add(sw);
      const duct = S(curveTube([[1.6, .62, .35], [1.65, 1.0, .3], [1.5, 1.4, .35], [1.62, 1.75, .3], [1.55, 2.0, .3]], .028, mt(0x9ad1ff, { emissive: 0x112233 }), 40), 'Ter bezi kanalı', 'Ter bezinden deri yüzeyindeki gözeneğe uzanan kanaldır.', 'Dermiste · bez', 'der'); g.add(duct);
      g.add(G(at(new THREE.Mesh(new THREE.CircleGeometry(.06, 12).rotateX(-Math.PI / 2), mt(0x2a1a14)), 1.55, 2.035, .3), 'epi'));
      /* damarlar */
      const art = S(curveTube([[-2.7, -.1, .95], [0, -.1, .95], [2.7, -.1, .95]], .09, mt(0xd8433a), 20), 'Kan damarları', 'Dermiste bulunan kan damarlarıdır; derinin beslenmesini ve ısı dengesini sağlar.', 'Dermiste · beslenme', 'sin'); g.add(art);
      const vein = S(curveTube([[-2.7, -.05, .6], [0, -.05, .6], [2.7, -.05, .6]], .11, mt(0x4a66d8), 20), 'Kan damarları', 'Dermiste bulunan kan damarlarıdır; derinin beslenmesini ve ısı dengesini sağlar.', 'Dermiste · beslenme', 'sin'); g.add(vein);
      [-2.3, -.5, .9, 2.2].forEach((x, i) => { g.add(G(curveTube([[x, -.1, .95], [x + .05, .7, .85], [x, 1.5, .8], [x + .12, 1.65, .8], [x + .2, 1.5, .78], [x + .22, .7, .7], [x + .2, -.05, .6]], .03, mt(i % 2 ? 0xd8433a : 0xb83a6b), 40), 'sin')); });
      /* yağ hücreleri */
      const fat = S(instMesh(new THREE.SphereGeometry(1, 14, 12), glass(0xffe27a, .55), 70, (i, d) => { const r = .22 + rr() * .1; d.position.set((rr() - .5) * 5.0, -.5 - rr() * .85, (rr() - .5) * 2.6); d.scale.set(r, r, r); }), 'Yağ dokusu (yağ hücreleri)', 'Deri altı dokusunda bulunan yağ depolayan hücrelerdir. Isı yalıtımı sağlar, darbeleri sönümler ve enerji deposu olarak görev yapar.', 'Deri altı · yalıtım', 'hip'); g.add(fat);
      /* sinir gövdesi */
      const trunk = S(curveTube([[-1.0, 1.0, -.25], [-.4, .3, -.3], [.4, -.15, -.3], [2.8, -.15, -.3], [3.8, -.15, -.3]], .09, mt(0xf5c542, { emissive: 0x2b2100 }), 40), 'Duyu siniri', 'Reseptörlerde oluşan uyartıları nöronlarla merkezî sinir sistemine (omurilik ve beyin) taşır.', 'Uyartıyı iletir', 'sin'); g.add(trunk);
      const brain = labelSprite('Beyne ➜', .8); brain.position.set(3.6, .35, -.3); g.add(brain);
      /* reseptörler */
      const recs = [];
      const mkRec = (key, mesh, pos, trunkFrom) => { at(mesh, ...pos); g.add(mesh); const path = new THREE.CatmullRomCurve3([V3(...pos), V3(trunkFrom[0], trunkFrom[1], trunkFrom[2]), V3(.4, -.15, -.3), V3(2.8, -.15, -.3), V3(3.8, -.15, -.3)]); g.add(G(curveTube([pos, trunkFrom], .02, mt(0xf5c542), 10), 'sin')); const r = { key, mesh, path, a: 0 }; recs.push(r); api.rec[key] = r; return r; };
      const meis = S(ellip(.15, .3, .15, mt(0x34c38f, { emissive: 0 }), 14), 'Mekanoreseptör (hafif dokunma)', TXT.meis, 'Mekanoreseptör · nöron', 'rec');
      mkRec('meissner', meis, [-.3, 1.52, .55], [-.35, .6, .1]);
      for (let i = 0; i < 6; i++) g.add(G(at(new THREE.Mesh(new THREE.CylinderGeometry(.14, .14, .018, 12), mt(0x7de3c0)), -.3, 1.4 + i * .05, .55), 'rec'));
      const merk = S(new THREE.Mesh(new THREE.CylinderGeometry(.13, .13, .05, 14), mt(0x3ab0ff, { emissive: 0 })), 'Mekanoreseptör (sürekli hafif basınç)', TXT.merk, 'Mekanoreseptör · nöron', 'rec');
      mkRec('merkel', merk, [.85, 1.6, -.55], [.8, .6, -.3]);
      const pac = S(ellip(.38, .62, .38, glass(0xffa43a, .45), 20), 'Mekanoreseptör (basınç ve titreşim)', TXT.pac, 'Mekanoreseptör · nöron', 'rec');
      mkRec('pacini', pac, [.55, -.35, -.55], [.55, -.15, -.3]);
      [.82, .68, .54, .4].forEach(k => g.add(G(at(ellip(.38 * k / .82, .62 * k / .82, .38 * k / .82, glass(0xffb85c, .3), 16), .55, -.35, -.55), 'rec')));
      g.add(G(cylBetween([.55, -.8, -.55], [.55, .1, -.55], .03, mt(0xf5c542)), 'rec'));
      const hot = S(ellip(.1, .22, .1, mt(0xff4d4d, { emissive: 0 }), 12), 'Termoreseptör (sıcak)', TXT.hot, 'Termoreseptör · nöron', 'rec');
      mkRec('hot', hot, [-.85, 1.25, -.6], [-.8, .5, -.3]);
      const cold = S(new THREE.Mesh(new THREE.SphereGeometry(.14, 14, 12), mt(0x3aa0ff, { emissive: 0 })), 'Termoreseptör (soğuk)', TXT.cold, 'Termoreseptör · nöron', 'rec');
      mkRec('cold', cold, [.25, 1.38, -1.0], [.3, .6, -.3]);
      const painPts = [[-2.2, 1.9, .5], [-1.9, 1.55, -.5], [.15, 1.88, .15], [2.1, 1.85, -.4]];
      const painR = { key: 'pain', meshes: [], a: 0, path: new THREE.CatmullRomCurve3([V3(.15, 1.88, .15), V3(.2, .6, -.1), V3(.4, -.15, -.3), V3(2.8, -.15, -.3), V3(3.8, -.15, -.3)]) };
      painPts.forEach(([x, y, z], i) => { const f = S(curveTube([[x, .55, z * .4], [x - .06, 1.0, z], [x + .07, 1.45, z], [x, y, z]], .026, mt(0xffe14d, { emissive: 0x332a00 }), 18), 'Ağrı reseptörü (serbest sinir ucu)', TXT.pain, 'Nosiseptör · nöron', 'rec'); g.add(f); painR.meshes.push(f); const tip = S(new THREE.Mesh(new THREE.SphereGeometry(.05, 8, 8), mt(0xffe14d, { emissive: 0x332a00 })), 'Ağrı reseptörü (serbest sinir ucu)', TXT.pain, 'Nosiseptör · nöron', 'rec'); at(tip, x, y, z); g.add(tip); painR.meshes.push(tip); g.add(G(curveTube([[x, .55, z * .4], [x * .3, .2, -.2], [.4, -.15, -.3]], .02, mt(0xf5c542), 12), 'sin')); });
      recs.push(painR); api.rec.pain = painR;
      /* nabız havuzu */
      const pool = []; for (let i = 0; i < 40; i++) { const o = glow(0xffffff, .07); o.visible = false; g.add(G(o, 'sin')); pool.push({ o, r: null, u: 0, on: false }); }
      api.fire = (key, v) => { const r = api.rec[key]; if (r) r.a = Math.max(r.a, v === undefined ? 1 : v); };
      let acc = 0;
      ticks.push((t, dt) => {
        acc += dt;
        recs.forEach(r => {
          r.a = Math.max(0, r.a - dt * .45); const e = r.a;
          if (r.mesh && r.mesh.material.emissive) { const c = { meissner: [.1, .9, .6], merkel: [.1, .5, 1], pacini: [1, .55, .1], hot: [1, .15, .1], cold: [.1, .5, 1] }[r.key]; r.mesh.material.emissive.setRGB(c[0] * e, c[1] * e, c[2] * e); }
          if (r.meshes) r.meshes.forEach(m => m.material.emissive.setRGB(e, e * .9, 0));
          if (e > .1 && acc > .1 && Math.random() < .5 * e + .1) { const f = pool.find(p => !p.on); if (f) { f.on = true; f.r = r; f.u = 0; f.o.visible = true; } }
        });
        if (acc > .1) acc = 0;
        pool.forEach(p => { if (!p.on) return; p.u += dt * .42; if (p.u >= 1) { p.on = false; p.o.visible = false; return; } p.o.position.copy(p.r.path.getPoint(p.u)); });
      });
      return { g, sels, ticks, api };
    }
  };

  /* ============ DERİ RESEPTÖRLERİ (ayrıntı) ============ */
  M3.deriresept = {
    title: 'Deri Reseptörleri (ayrıntı)', ico: '🔍', tag: 'Mekano · Termo · Nosiseptör', cam: [0, 2.8, 13.5], target: [0, .2, 0], labScale: .9,
    task: 'Sırayla beş reseptör grubunu incele: hafif dokunma, sürekli basınç, basınç ve titreşim, ağrı, sıcaklık. Her biri için “uyaran türü – reseptör çeşidi – yapı” üçlüsünü yaz. Kapsüllü yapı hangisi? Serbest sinir ucu hangisi?',
    q: { q: 'Aşağıdakilerden hangisi basınç ve titreşimi algılayan, katmanlı kapsüllü mekanoreseptördür?', o: ['Serbest sinir ucu', 'Soğan zarı benzeri kapsüllü reseptör (Pacini)', 'Tat tomurcuğu', 'Koku nöronu'], a: 1, e: 'Dermisin derininde ve deri altında yer alan, katmanlı kapsüllü mekanoreseptör basınç ve titreşimi algılar.' },
    build() {
      const { g, sels, ticks, S, G } = B(), anim = [];
      const ped = (x, col) => { const p = G(at(new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.15, .22, 32), mt(col, { roughness: .7 })), x, -1.35, 0), ''); g.add(p); };
      const lab = (x, t1) => { const s = labelSprite(t1, 1.0); s.position.set(x, -2.0, 0); g.add(s); };
      const xs = [-6, -3, 0, 3, 6];
      /* 1 Meissner */
      ped(xs[0], 0x2c4a6a); lab(xs[0], 'Hafif dokunma');
      const cap = S(ellip(.55, 1.0, .55, glass(0x34c38f, .35), 24), 'Mekanoreseptör (hafif dokunma)', TXT.meis, 'Mekanoreseptör · nöron · kapsüllü', ''); at(cap, xs[0], -.1, 0); g.add(cap);
      for (let i = 0; i < 9; i++) g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(.48 - Math.abs(i - 4) * .04, .48 - Math.abs(i - 4) * .04, .04, 20), mt(0x7de3c0)), xs[0], -.75 + i * .16, 0));
      const ax1 = S(curveTube([[xs[0], -1.2, 0], [xs[0] + .1, -.6, .05], [xs[0] - .1, -.2, -.05], [xs[0] + .08, .2, .05], [xs[0] - .06, .6, 0]], .045, mt(0xf5c542, { emissive: 0x2b2100 }), 30), 'Sinir ucu (hafif dokunma reseptörü)', 'Kapsülün içinde kıvrılan nöron ucudur; dokunmayla şekil değiştiren kapsül nöronu uyarır.', 'Nöron', ''); g.add(ax1);
      anim.push(t => { const e = .3 + .7 * Math.max(0, Math.sin(t * 3.0)); cap.scale.set(1, 1 - .05 * e, 1); cap.material.emissive.setRGB(0, .35 * e, .2 * e); ax1.material.emissive.setRGB(.17 + .5 * e, .13 + .4 * e, 0); });
      /* 2 Merkel */
      ped(xs[1], 0x2c4a6a); lab(xs[1], 'Sürekli hafif basınç');
      for (let i = 0; i < 3; i++) { const c = S(ellip(.33, .5, .33, mt(0xc9a68a), 18), 'Epitel hücresi (Merkel hücresi)', 'Epidermis tabanında bulunan, sinir ucuyla disk şeklinde temas eden duyu epiteli hücresidir.', 'Duyu epiteli', ''); at(c, xs[1] - .6 + i * .6, .35, (i - 1) * .1); g.add(c); }
      const discs = []; for (let i = 0; i < 3; i++) { const d = S(new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .07, 20), mt(0x3ab0ff, { emissive: 0 })), 'Mekanoreseptör (sürekli hafif basınç)', TXT.merk, 'Mekanoreseptör · nöron · disk', ''); at(d, xs[1] - .6 + i * .6, -.07, (i - 1) * .1); g.add(d); discs.push(d); g.add(G(curveTube([[xs[1] - .6 + i * .6, -.1, (i - 1) * .1], [xs[1] - .3 + i * .15, -.7, 0], [xs[1], -1.2, 0]], .028, mt(0xf5c542), 12), '')); }
      anim.push(t => { const e = .55 + .1 * Math.sin(t * 1.5); discs.forEach(d => d.material.emissive.setRGB(.05 * e, .3 * e, .7 * e)); });
      /* 3 Pacini */
      ped(xs[2], 0x2c4a6a); lab(xs[2], 'Basınç ve titreşim');
      const pshells = []; for (let i = 0; i < 10; i++) { const k = 1 - i * .085; const m = S(ellip(.7 * k, 1.05 * k, .7 * k, glass(0xffb85c, .22 + i * .01), 22), 'Mekanoreseptör (basınç ve titreşim)', TXT.pac, 'Mekanoreseptör · nöron · katmanlı kapsül', ''); at(m, xs[2], -.05, 0); g.add(m); pshells.push(m); }
      const ax3 = S(cylBetween([xs[2], -1.3, 0], [xs[2], .6, 0], .06, mt(0xf5c542, { emissive: 0x2b2100 })), 'Sinir ucu (Pacini)', 'Kapsülün merkezindeki nöron ucudur; katmanlı kapsül basınç/titreşimi sinir ucuna iletir.', 'Nöron', ''); g.add(ax3);
      anim.push(t => { const v = Math.sin(t * 14) * .5 + .5; pshells.forEach((m, i) => { const k = 1 + .015 * Math.sin(t * 14 - i * .5); m.scale.set(.7 * (1 - i * .085) * k, 1.05 * (1 - i * .085) * k, .7 * (1 - i * .085) * k); }); ax3.material.emissive.setRGB(.17 + .6 * v, .13 + .4 * v, 0); });
      /* 4 Serbest sinir ucu */
      ped(xs[3], 0x2c4a6a); lab(xs[3], 'Ağrı (serbest sinir ucu)');
      const cells = []; for (let i = 0; i < 9; i++) { const c = new THREE.Mesh(new THREE.SphereGeometry(.28, 12, 10), glass(0xf3c2a2, .45)); at(c, xs[3] + (i % 3 - 1) * .55, .15 + Math.floor(i / 3) * .55, ((i * 7) % 3 - 1) * .2); g.add(G(c, '')); }
      const trees = []; [[0, 0], [-.4, .25], [.4, -.2]].forEach(([dx, dz], i) => { const base = [xs[3] + dx * .3, -1.2, dz * .3]; const br = S(curveTube([base, [xs[3] + dx * .6, -.4, dz], [xs[3] + dx, .4, dz], [xs[3] + dx * 1.2, 1.15, dz]], .04, mt(0xffe14d, { emissive: 0x332a00 }), 24), 'Ağrı reseptörü (serbest sinir ucu)', TXT.pain, 'Nosiseptör · nöron', ''); g.add(br); trees.push(br);
        [-.25, .25].forEach(s => { const sb = S(curveTube([[xs[3] + dx, .4, dz], [xs[3] + dx + s * .6, .8, dz + s * .2], [xs[3] + dx + s, 1.2, dz]], .025, mt(0xffe14d, { emissive: 0x332a00 }), 14), 'Ağrı reseptörü (serbest sinir ucu)', TXT.pain, 'Nosiseptör · nöron', ''); g.add(sb); trees.push(sb); const tp = S(new THREE.Mesh(new THREE.SphereGeometry(.06, 8, 8), mt(0xffe14d, { emissive: 0x332a00 })), 'Ağrı reseptörü (serbest sinir ucu)', TXT.pain, 'Nosiseptör · nöron', ''); at(tp, xs[3] + dx + s, 1.2, dz); g.add(tp); trees.push(tp); }); });
      anim.push(t => { const e = Math.max(0, Math.sin(t * 2.3) * Math.sin(t * 5.1)); trees.forEach(m => m.material.emissive.setRGB(.2 + e * .8, .18 + e * .7, 0)); });
      /* 5 Termoreseptörler */
      ped(xs[4], 0x2c4a6a); lab(xs[4], 'Sıcaklık (termoreseptör)');
      const hotM = S(ellip(.3, .65, .3, mt(0xff4d4d, { emissive: 0 }), 18), 'Termoreseptör (sıcak)', TXT.hot, 'Termoreseptör · nöron', ''); at(hotM, xs[4] - .7, -.1, 0); g.add(hotM);
      const coldM = S(new THREE.Mesh(new THREE.SphereGeometry(.42, 20, 16), mt(0x3aa0ff, { emissive: 0 })), 'Termoreseptör (soğuk)', TXT.cold, 'Termoreseptör · nöron', ''); at(coldM, xs[4] + .7, .0, 0); g.add(coldM);
      g.add(G(curveTube([[xs[4] - .7, -.7, 0], [xs[4] - .5, -1.2, 0]], .035, mt(0xf5c542), 8), '')); g.add(G(curveTube([[xs[4] + .7, -.4, 0], [xs[4] + .5, -1.2, 0]], .035, mt(0xf5c542), 8), ''));
      anim.push(t => { const h = .5 + .5 * Math.sin(t * 2), c = .5 + .5 * Math.sin(t * 2 + 3.1); hotM.material.emissive.setRGB(.9 * h, .1 * h, .05 * h); coldM.material.emissive.setRGB(.05 * c, .35 * c, .8 * c); });
      ticks.push((t) => anim.forEach(f => f(t)));
      return { g, sels, ticks };
    }
  };
})();
