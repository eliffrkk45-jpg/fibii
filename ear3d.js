/* Nasse Biology — Kulak, Korti organı ve Denge organı 3B modelleri (ayrıntılı, prosedürel) */
(function () {
  const BONE = 0xe9dcb0, SKIN = 0xf0b9a0;
  const INFO = {
    kepce: 'Dış kulağın görünen, kıvrımlı kıkırdak yapılı bölümüdür. Ses dalgalarını toplar ve kulak yoluna yönlendirir.',
    kanal: 'Kulak kepçesinden kulak zarına uzanan kanaldır. Ses dalgalarını kulak zarına iletir.',
    zar: 'Dış kulak ile orta kulağı ayıran ince zardır. Ses dalgalarıyla titreşir. Mikrofondaki diyaframa benzer.',
    cekic: 'Orta kulaktaki üç kemikçiğin ilkidir; kulak zarına bağlıdır. Zarın titreşimini örse aktarır.',
    ors: 'Çekiç ile üzengi arasındaki kemikçiktir; titreşimi çekiçten alıp üzengiye iletir.',
    uzengi: 'Üç kemikçiğin sonuncusu ve en küçüğüdür. Titreşimi oval pencere aracılığıyla iç kulağa (salyangozun sıvısına) aktarır. Kemikçikler titreşimleri iç kulağa aktarır ve ses basıncının iletilmesine yardımcı olur.',
    ostaki: 'Orta kulağı yutağa (boğaza) bağlayan borudur. Orta kulak basıncının dış ortam basıncıyla dengelenmesini sağlar.',
    oval: 'Üzengi kemikçiğinin dayandığı zar kaplı açıklıktır; titreşimler buradan iç kulak sıvılarına geçer.',
    yuvarlak: 'İç kulak sıvılarındaki basınç değişimini dengeleyen zar kaplı açıklıktır.',
    koklea: 'İç kulakta, salyangoz kabuğuna benzeyen kıvrımlı yapıdır; işitmede görevlidir. İçindeki sıvı titreşimleri Korti organındaki reseptörlere ulaştırır.',
    korti: 'Salyangoz (koklea) içindeki işitme reseptörlerini (tüylü duyu hücreleri) içeren yapıdır. Titreşimlerin oluşturduğu hareketler tüylü hücreleri uyarır ve sinirsel mesajlar oluşur. Tüylü hücreler duyu epiteli yapısındaki mekanoreseptörlerdir.',
    yarim: 'İç kulakta birbirine dik düzlemlerde bulunan üç kanaldır. Başın dönme hareketlerinin algılanmasında görevlidir (denge).',
    tulum: 'İç kulaktaki denge organıdır. Yer çekimi, başın konumu ve doğrusal ivmelenme hakkında bilgi sağlar. Yüzeyindeki tüylü hücrelerin üstünde kalsiyum kristalleri (otolit) bulunur.',
    kesecik: 'Tulumcukla birlikte çalışan denge organıdır. Yer çekimi, başın konumu ve doğrusal ivmelenme bilgisi sağlar.',
    isitme: 'Salyangozda oluşan sinirsel mesajları (uyartıları) beyne taşıyan sinirdir.',
    denge: 'Yarım daire kanalları, tulumcuk ve keseciğin denge reseptörlerinden gelen mesajları beyne taşıyan sinirdir.',
    beyin: 'Kulaktan gelen sinirsel mesajları yorumlar: ses ve baş/vücut hareketleri burada algıya dönüşür.'
  };

  function canalPts(C, e1, e2, R, toV) {
    const gapA = Math.atan2(toV.dot(e2), toV.dot(e1)), gap = .55, pts = [], n = 54;
    for (let i = 0; i <= n; i++) { const th = gapA + gap / 2 + (2 * Math.PI - gap) * i / n; pts.push(C.clone().addScaledVector(e1, Math.cos(th) * R).addScaledVector(e2, Math.sin(th) * R)); }
    return pts;
  }
  /* Vestibüler aygıt (üç kanal + tulumcuk + kesecik). Vc: vestibül merkezi */
  function vestibular(ctx, Vc) {
    const { g, S, G } = ctx, api = { canals: [], Vc };
    const fluid = glass(0x7fe8c0, .35);
    const dirs = [
      { n: 'yatay', e1: V3(1, 0, 0), e2: V3(0, 0, 1), off: V3(.52, .32, 0), col: 0x35c58a },
      { n: 'ön', e1: V3(1, 0, 0), e2: V3(0, 1, 0), off: V3(.3, .72, .2), col: 0x3fa9f5 },
      { n: 'arka', e1: V3(0, 1, 0), e2: V3(0, 0, 1), off: V3(.12, .62, -.62), col: 0xe0a53a }
    ];
    dirs.forEach(d => {
      const C = Vc.clone().add(d.off), R = .62, toV = Vc.clone().sub(C).normalize();
      const pts = canalPts(C, d.e1, d.e2, R, toV);
      const tube = S(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 90, .075, 10, false), glass(d.col, .5)), 'Yarım daire kanalları', INFO.yarim, 'Mekanoreseptör · denge (dönme)', 'denge');
      g.add(tube);
      const amp = S(new THREE.Mesh(new THREE.SphereGeometry(.13, 16, 14), glass(d.col, .6)), 'Yarım daire kanalları', INFO.yarim, 'Mekanoreseptör · denge (dönme)', 'denge');
      amp.position.copy(pts[0]); g.add(amp);
      const cup = G(new THREE.Mesh(new THREE.ConeGeometry(.1, .2, 10), mt(0xffffff, { transparent: true, opacity: .75 })), 'denge');
      cup.position.copy(pts[0]); g.add(cup);
      const n = pts[1].clone().sub(pts[0]).normalize(); cup.quaternion.setFromUnitVectors(V3(0, 1, 0), n);
      const nrm = new THREE.Vector3().crossVectors(d.e1, d.e2).normalize();
      api.canals.push({ name: d.n, normal: nrm, cup, amp, base: cup.quaternion.clone(), axisBend: new THREE.Vector3().crossVectors(n, nrm).normalize(), pts, mat: amp.material });
    });
    const ut = S(ellip(.4, .2, .3, mt(0x35c58a, { transparent: true, opacity: .75 }), 22), 'Tulumcuk', INFO.tulum, 'Mekanoreseptör · denge (doğrusal hareket)', 'denge');
    at(ut, Vc.x + .1, Vc.y + .22, 0); g.add(ut);
    const ks = S(ellip(.2, .34, .22, mt(0x2fbf9b, { transparent: true, opacity: .75 }), 22), 'Kesecik', INFO.kesecik, 'Mekanoreseptör · denge (doğrusal hareket)', 'denge');
    at(ks, Vc.x - .05, Vc.y - .3, .05); g.add(ks);
    const rr = srand(3);
    const oto = (cx, cy, cz, ax) => instMesh(new THREE.OctahedronGeometry(.035), mt(0xffffff, { emissive: 0x444444 }), 26, (i, d) => { d.position.set(cx + (rr() - .5) * .42 * (ax === 'x' ? 1 : .2), cy + (ax === 'x' ? .0 : (rr() - .5) * .45), cz + (rr() - .5) * .3); d.rotation.set(rr() * 3, rr() * 3, rr() * 3); });
    const ou = oto(ut.position.x, ut.position.y + .09, 0, 'x'), ok = oto(ks.position.x + .1, ks.position.y, ks.position.z, 'y');
    G(ou, 'denge'); G(ok, 'denge'); g.add(ou, ok); api.otoU = ou; api.otoK = ok; api.ut = ut; api.ks = ks;
    return api;
  }

  /* ============ KULAK ============ */
  M3.kulak = {
    title: 'Kulak', ico: '👂', tag: 'Mekanoreseptör · Duyu epiteli', cam: [-4.5, 3.4, 11.5], target: [2.3, -.5, 0], labScale: .8,
    clip: { axis: 'z', min: -1.4, max: 1.4, def: 0, on: false, flip: true },
    layers: [['Dış kulak (kepçe · kanal · zar)', 'dis'], ['Orta kulak (kemikçikler · östaki)', 'orta'], ['İç kulak: işitme (salyangoz)', 'ic'], ['İç kulak: denge', 'denge'], ['Sinirler ve beyin', 'sinir'], ['Ses dalgaları', 'ses']],
    task: 'Ses dalgalarının soldan sağa yolunu izle: kulak kepçesi → kulak yolu → kulak zarı → çekiç-örs-üzengi → salyangoz. “Kesit” düğmesiyle kulağı aç. Salyangozdaki işitme reseptörlerini (Korti organı) ve dengeyle ilgili yarım daire kanallarını bul. Sesin elektrik sinyaline hangi bölümde dönüştüğünü yaz.',
    q: { q: 'Kulaktaki tüylü duyu hücreleri hangi reseptör çeşidine ve hangi yapıya örnektir?', o: ['Fotoreseptör – nöron', 'Mekanoreseptör – duyu epiteli', 'Kemoreseptör – nöron', 'Termoreseptör – duyu epiteli'], a: 1, e: 'Kulak mekanoreseptörleri (tüylü duyu hücreleri) duyu epiteli yapısındadır; ses ve dengeyle ilişkili mekanik uyaranları algılar.' },
    build() {
      const { g, sels, ticks, S, G } = B(), api = { amp: .02, freq: 1.6 };
      /* — DIŞ KULAK — */
      const sh = new THREE.Shape();
      sh.moveTo(0, -1.45); sh.bezierCurveTo(.5, -1.55, .92, -1.0, .88, -.4); sh.bezierCurveTo(.88, .3, 1.02, .9, .8, 1.4); sh.bezierCurveTo(.5, 1.95, -.45, 1.95, -.72, 1.3);
      sh.bezierCurveTo(-1.02, .5, -.92, -.5, -.6, -1.0); sh.bezierCurveTo(-.4, -1.38, -.2, -1.45, 0, -1.45);
      const pg = new THREE.ExtrudeGeometry(sh, { depth: .22, bevelEnabled: true, bevelThickness: .14, bevelSize: .12, bevelSegments: 6, curveSegments: 28 }).rotateY(-Math.PI / 2);
      const pin = S(new THREE.Mesh(pg, mt(SKIN, { roughness: .65, side: THREE.DoubleSide })), 'Kulak kepçesi', INFO.kepce, 'Dış kulak · ses dalgalarını toplar', 'dis');
      at(pin, -3.3, -.2, 0); pin.rotation.z = -.12; g.add(pin);
      const conc = G(ellip(.16, .62, .42, mt(0xd9917a), 20), 'dis'); at(conc, -3.55, -.25, -.05); g.add(conc);
      const anti = G(curveTube([[-3.62, .55, .45], [-3.62, .85, .1], [-3.62, .55, -.28], [-3.62, .05, -.38], [-3.62, -.5, -.3]], .07, mt(0xe7a58f), 24), 'dis'); g.add(anti);
      const trag = G(ellip(.12, .2, .16, mt(SKIN), 14), 'dis'); at(trag, -3.5, -.1, .52); g.add(trag);
      const canal = S(curveTube([[-3.3, -.2, 0], [-2.3, -.15, .03], [-1.2, -.05, -.05], [0, 0, 0]], .34, glass(SKIN, .38), 40), 'Dış kulak yolu', INFO.kanal, 'Dış kulak · ses dalgalarını iletir', 'dis');
      g.add(canal);
      const drum = S(new THREE.Mesh(new THREE.ConeGeometry(.58, .16, 32, 1, true).rotateZ(-Math.PI / 2), mt(0xf6efe3, { transparent: true, opacity: .88, side: THREE.DoubleSide, emissive: 0x201c14 })), 'Kulak zarı', INFO.zar, 'Ses dalgalarıyla titreşir', 'dis');
      g.add(drum);
      /* — ORTA KULAK — */
      const mid = S(ellip(1.15, 1.0, .85, glass(0xffd9e0, .2), 28), 'Orta kulak boşluğu', 'Kulak zarının arkasındaki hava dolu boşluktur; kemikçikleri (çekiç, örs, üzengi) barındırır. Östaki borusuyla yutağa açılır.', 'Orta kulak', 'orta');
      mid.userData.low = true; at(mid, 1.05, .1, 0); g.add(mid);
      const oss = new THREE.Group(); g.add(oss); api.oss = oss; oss.position.set(.7, .3, 0);
      const bm = mt(BONE, { roughness: .45 });
      const mh = S(cylBetween(V3(.04 - .7, -.35 - .3, 0), V3(.6 - .7, .3 - .3, 0), .045, bm, 8), 'Çekiç', INFO.cekic, 'Orta kulak · kemikçik', 'orta'); oss.add(mh);
      const mhd = S(at(new THREE.Mesh(new THREE.SphereGeometry(.15, 16, 14), bm), .66 - .7, .42 - .3, 0), 'Çekiç', INFO.cekic, 'Orta kulak · kemikçik', 'orta'); oss.add(mhd);
      const ors = S(at(ellip(.17, .15, .13, bm, 14), .9, .44, 0), 'Örs', INFO.ors, 'Orta kulak · kemikçik', 'orta'); ors.position.sub(oss.position); oss.add(ors);
      const orsL = S(cylBetween(V3(.9 - .7, .4 - .3, 0), V3(1.26 - .7, -.08 - .3, 0), .04, bm, 8), 'Örs', INFO.ors, 'Orta kulak · kemikçik', 'orta'); oss.add(orsL);
      const orsT = S(at(new THREE.Mesh(new THREE.SphereGeometry(.06, 10, 10), bm), 1.28 - .7, -.1 - .3, 0), 'Örs', INFO.ors, 'Orta kulak · kemikçik', 'orta'); oss.add(orsT);
      const stH = S(at(new THREE.Mesh(new THREE.SphereGeometry(.07, 10, 10), bm), 1.34 - .7, -.14 - .3, 0), 'Üzengi', INFO.uzengi, 'Orta kulak · kemikçik', 'orta'); oss.add(stH);
      [-.07, .07].forEach(z => { const cr = S(cylBetween(V3(1.34 - .7, -.14 - .3, 0), V3(1.66 - .7, -.2 - .3, z), .026, bm, 8), 'Üzengi', INFO.uzengi, 'Orta kulak · kemikçik', 'orta'); oss.add(cr); });
      const fp = S(at(ellip(.03, .13, .085, bm, 12), 1.69 - .7, -.2 - .3, 0), 'Üzengi', INFO.uzengi, 'Orta kulak · kemikçik', 'orta'); oss.add(fp);
      ticks.push(t => { const a = api.amp, w = api.freq * 6.283; drum.position.x = Math.sin(t * w) * a * .9; oss.rotation.z = Math.sin(t * w) * a * 1.1; });
      /* östaki borusu */
      const ost = S(curveTube([[1.1, -.75, .1], [1.55, -1.7, .6], [2.0, -2.6, 1.3], [2.5, -3.3, 2.1]], .15, glass(0x7fb0ff, .55), 30), 'Östaki borusu', INFO.ostaki, 'Basıncı dengeler', 'orta'); g.add(ost);
      const ostE = G(at(new THREE.Mesh(new THREE.ConeGeometry(.3, .35, 16, 1, true), glass(0x7fb0ff, .5)), 2.62, -3.5, 2.3), 'orta'); ostE.rotation.set(-1.0, 0, -.45); g.add(ostE);
      /* — İÇ KULAK — */
      const Vc = V3(2.55, .0, 0);
      const ves = vestibular({ g, S, G }, Vc); api.ves = ves;
      const vest = S(ellip(.62, .52, .5, glass(0xc9a8ff, .22), 24), 'Vestibül (iç kulak girişi)', 'İç kulakta salyangoz ile yarım daire kanalları arasındaki bölümdür; tulumcuk ve kesecik bu bölümdedir.', 'İç kulak', 'denge'); vest.userData.low = true; at(vest, Vc.x, Vc.y, 0); g.add(vest);
      const oval = S(at(new THREE.Mesh(new THREE.CircleGeometry(.14, 20).rotateY(-Math.PI / 2), mt(0xf3e9d2, { side: THREE.DoubleSide })), 1.98, -.08, 0), 'Oval pencere', INFO.oval, 'Orta kulaktan iç kulağa geçiş', 'ic'); g.add(oval);
      /* salyangoz */
      const N = 160, cp = []; for (let i = 0; i <= N; i++) { const u = i / N, th = u * 2.75 * Math.PI * 2 + Math.PI / 2, r = 1.05 - .72 * u; cp.push(V3(3.3 + Math.cos(th) * r, -1.7 + Math.sin(th) * r, -.5 + u * 1.1)); }
      const cc = new THREE.CatmullRomCurve3(cp); api.cochCurve = cc;
      const cg = new THREE.TubeGeometry(cc, 200, .28, 14, false); { const pos = cg.attributes.position, seg = 200, rad = 15; for (let i = 0; i <= seg; i++) { const P = cc.getPointAt(i / seg), k = 1 - .55 * (i / seg); for (let j = 0; j < rad; j++) { const id = i * rad + j; const v = V3(pos.getX(id), pos.getY(id), pos.getZ(id)); v.sub(P).multiplyScalar(k).add(P); pos.setXYZ(id, v.x, v.y, v.z); } } }
      const cochM = S(new THREE.Mesh(cg, glass(0xb996f2, .36)), 'Salyangoz (koklea)', INFO.koklea, 'İç kulak · işitme', 'ic'); g.add(cochM);
      const cdPts = []; for (let i = 0; i <= N; i += 2) cdPts.push(cp[i]); const duct = G(curveTube(cdPts, .06, mt(0xffd34d, { emissive: 0x332600 }), 160), 'ic'); g.add(duct);
      const M = 70; const hair = S(instMesh(new THREE.SphereGeometry(.055, 10, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .4 }), M, (i, d) => { const P = cc.getPointAt((i + .5) / M); d.position.copy(P); }), 'Korti organı (işitme reseptörleri)', INFO.korti, 'Mekanoreseptör · duyu epiteli (tüylü hücreler)', 'ic');
      const col = new THREE.Color(); for (let i = 0; i < M; i++) { col.setHSL(.55 - .5 * (i / M), .8, .55); hair.setColorAt(i, col); } hair.instanceColor.needsUpdate = true; g.add(hair);
      api.hair = hair; api.hairN = M;
      api.setHair = (fn) => { const c = new THREE.Color(); for (let i = 0; i < M; i++) { const a = fn(i / (M - 1)); c.setHSL(.6 - .55 * (i / (M - 1)), .8, .22 + .55 * a); c.lerp(new THREE.Color(0xffffff), a * .6); hair.setColorAt(i, c); } hair.instanceColor.needsUpdate = true; };
      const rnd = S(at(new THREE.Mesh(new THREE.CircleGeometry(.1, 16), mt(0xf3e9d2, { side: THREE.DoubleSide })), 2.78, -.78, .3), 'Yuvarlak pencere', INFO.yuvarlak, 'İç kulak sıvı basıncını dengeler', 'ic'); rnd.rotation.y = .4; g.add(rnd);
      /* sinirler */
      const cn = S(curveTube([[3.3, -1.7, .45], [3.9, -1.1, .3], [4.6, -.3, .1], [5.3, .25, 0]], .1, mt(0xf5c542, { emissive: 0x2b2100 }), 30), 'İşitme siniri', INFO.isitme, 'Uyartıyı beyne iletir', 'sinir'); g.add(cn);
      const vn = S(curveTube([[Vc.x + .3, Vc.y + .3, 0], [3.9, .75, 0], [4.7, .55, 0], [5.3, .25, 0]], .075, mt(0x7de3d1, { emissive: 0x0a2b25 }), 30), 'Denge siniri', INFO.denge, 'Denge bilgisini beyne iletir', 'sinir'); g.add(vn);
      const tr = S(curveTube([[5.3, .25, 0], [6.4, .25, 0], [7.2, .25, 0]], .16, mt(0xf5c542, { emissive: 0x2b2100 }), 24), 'İşitme ve denge siniri (kulak siniri)', 'İşitme ve denge sinirlerinin birleşerek beyne uzandığı sinir demetidir.', 'Uyartıyı beyne iletir', 'sinir'); g.add(tr);
      const br = S(new THREE.Mesh(new THREE.SphereGeometry(1.1, 48, 36), mt(0xe9a9b8, { roughness: .8 })), 'Beyin (işitme ve denge merkezi)', INFO.beyin, 'Algının oluştuğu yer', 'sinir');
      { const p = br.geometry.attributes.position, rr = srand(9); for (let i = 0; i < p.count; i++) { const v = V3(p.getX(i), p.getY(i), p.getZ(i)); const f = 1 + .07 * Math.sin(v.x * 7) * Math.sin(v.y * 6) * Math.sin(v.z * 8); v.multiplyScalar(f); p.setXYZ(i, v.x, v.y, v.z); } br.geometry.computeVertexNormals(); }
      br.scale.set(.85, 1, .95); at(br, 8.2, .6, 0); br.userData.low = true; g.add(br);
      [['cn', cn, [[3.3, -1.7, .45], [3.9, -1.1, .3], [4.6, -.3, .1], [5.3, .25, 0], [7.2, .25, 0]]]].forEach(([, , pts]) => { const f = pathFollower(0xffffff, .1, pts, .22, 0); g.add(G(f.orb, 'sinir')); ticks.push(t => f.tick(t)); });
      /* ses dalgaları */
      const rings = []; for (let i = 0; i < 6; i++) { const r = G(new THREE.Mesh(new THREE.TorusGeometry(.9, .03, 8, 40).rotateY(Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x4fb3ff, transparent: true })), 'ses'); g.add(r); rings.push(r); }
      ticks.push(t => rings.forEach((r, i) => { const u = (t * .2 + i / 6) % 1, x = -7.5 + u * 7.3; r.position.set(x, -.1, 0); r.scale.setScalar(x < -3.4 ? .6 + u * .9 : .3); r.material.opacity = .9 * (1 - u * .6); }));
      return { g, sels, ticks, api };
    }
  };

  /* ============ KORTİ ORGANI (koklea kesiti) ============ */
  M3.korti = {
    title: 'Korti Organı (ayrıntı)', ico: '🎼', tag: 'Mekanoreseptör · Duyu epiteli', cam: [3.2, 3.4, 8.2], target: [0, .2, 0], labScale: .8,
    layers: [['Tüylü hücreler ve tüycükler', 'hc'], ['Zarlar (taban · örtü)', 'mem'], ['Sinir lifleri ve ganglion', 'sin'], ['Koklea sıvıları', 'fl']],
    task: 'Taban zarının (bazilar membran) üstündeki iç ve dış tüylü hücreleri bul. Titreşim dalgası ilerlerken tüylü hücrelerin tüycüklerinin örtü zarına nasıl değdiğini ve eğildiğini izle. Hangi yapı sinirsel mesajı beyne taşır?',
    q: { q: 'Salyangoz içindeki işitme reseptörlerini (tüylü duyu hücreleri) barındıran yapı hangisidir?', o: ['Yarım daire kanalları', 'Korti organı', 'Östaki borusu', 'Kulak zarı'], a: 1, e: 'Korti organı koklea içinde bulunur ve işitme reseptörlerini (tüylü hücreler) içerir. Titreşimlerin oluşturduğu hareketler tüylü hücreleri uyarır.' },
    build() {
      const { g, sels, ticks, S, G } = B(), api = { amp: .12, peak: .2, speed: 3 };
      const LZ = 3.4, NZ = 12, zs = []; for (let i = 0; i < NZ; i++) zs.push(-LZ / 2 + .2 + i * (LZ - .4) / (NZ - 1));
      /* sıvı odacıkları */
      const tube = S(new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, LZ, 40, 1, true).rotateX(Math.PI / 2), glass(0x9ec3ff, .13)), 'Koklea kanalı (kemik duvar)', 'Salyangozun kemik duvarlı, sıvı dolu kanalıdır. İçi taban zarı ve Reissner zarı ile üç sıvı odacığa ayrılır.', 'İç kulak', 'fl'); tube.userData.low = true; g.add(tube);
      const sv = S(new THREE.Mesh(new THREE.BoxGeometry(2.9, .95, LZ - .1), glass(0x6fa8ff, .22)), 'Üst sıvı odacığı (skala vestibüli)', 'Oval pencereden gelen titreşimlerin ilk geçtiği, sıvı dolu üst odacıktır.', 'Titreşim iletimi', 'fl'); sv.userData.low = true; at(sv, .15, 1.1, 0); g.add(sv);
      const sm = S(new THREE.Mesh(new THREE.BoxGeometry(2.7, .75, LZ - .1), glass(0xffe08a, .28)), 'Orta sıvı odacığı (koklea kanalı)', 'Korti organının bulunduğu odacıktır; taban zarı ile Reissner zarı arasındadır.', 'Korti organını içerir', 'fl'); sm.userData.low = true; at(sm, .1, .25, 0); g.add(sm);
      const st = S(new THREE.Mesh(new THREE.BoxGeometry(2.9, .95, LZ - .1), glass(0x6fa8ff, .22)), 'Alt sıvı odacığı (skala timpani)', 'Titreşimlerin yuvarlak pencereye doğru döndüğü, sıvı dolu alt odacıktır.', 'Titreşim iletimi', 'fl'); st.userData.low = true; at(st, .15, -1.05, 0); g.add(st);
      const reis = S(new THREE.Mesh(new THREE.PlaneGeometry(2.7, LZ - .1).rotateX(-Math.PI / 2), mt(0xcfe3ff, { transparent: true, opacity: .5, side: THREE.DoubleSide })), 'Reissner zarı', 'Üst ve orta sıvı odacıklarını ayıran çok ince zardır.', 'Odacık ayırıcı', 'mem'); at(reis, .1, .62, 0); g.add(reis);
      /* taban zarı (dalgalanır) */
      const bg = new THREE.PlaneGeometry(2.4, LZ - .1, 6, 70).rotateX(-Math.PI / 2), bpos = bg.attributes.position, by = new Float32Array(bpos.count); for (let i = 0; i < bpos.count; i++) by[i] = bpos.getY(i);
      const basil = S(new THREE.Mesh(bg, mt(0xe0a060, { side: THREE.DoubleSide, roughness: .6 })), 'Taban zarı (bazilar membran)', 'Orta odacığın tabanını oluşturan, titreşimle dalgalanan zardır. Üzerinde Korti organı oturur. Dalganın en çok kabardığı yer sesin frekansına bağlıdır.', 'Titreşimle hareket eder', 'mem'); at(basil, -.05, -.18, 0); g.add(basil);
      const tec = S(new THREE.Mesh(new THREE.BoxGeometry(1.5, .12, LZ - .3), mt(0xb7e3c8, { transparent: true, opacity: .6 })), 'Örtü zarı', 'Tüylü hücrelerin tüycüklerinin üstüne uzanan jelimsi zardır. Taban zarı hareket edince tüycükler örtü zarına sürtünerek eğilir.', 'Tüycükleri eğer', 'mem'); at(tec, -.05, .34, 0); g.add(tec);
      const tecL = G(new THREE.Mesh(new THREE.BoxGeometry(.12, .5, LZ - .3), mt(0xb7e3c8, { transparent: true, opacity: .6 })), 'mem'); at(tecL, -.78, .12, 0); g.add(tecL);
      /* destek hücreleri ve Corti tüneli */
      const sup = S(new THREE.Mesh(new THREE.BoxGeometry(1.7, .12, LZ - .3), mt(0xd7b48a)), 'Destek hücreleri', 'Tüylü hücreleri taşıyan ve destekleyen hücrelerdir.', 'Destek', 'hc'); at(sup, .02, -.12, 0); g.add(sup);
      /* tüylü hücreler (örnekleme: her satır 12 hücre) */
      const IH = [], OH = [[], [], []]; const cellY = -.05;
      const ihM = mt(0x3be0c8, { emissive: 0x053a33 }), ohM = mt(0xff9a5c, { emissive: 0x3a1500 });
      const ihGeo = new THREE.CylinderGeometry(.1, .1, .35, 10);
      zs.forEach(z => {
        const ih = S(new THREE.Mesh(ihGeo, ihM.clone()), 'İç tüylü hücre', 'Tek sıra hâlinde dizilmiş işitme reseptörüdür. Titreşimlerin oluşturduğu hareketle tüycükleri eğilince sinirsel mesaj oluşur. Duyu epiteli yapısındaki mekanoreseptördür.', 'Mekanoreseptör · duyu epiteli', 'hc'); at(ih, -.45, cellY, z); g.add(ih); IH.push(ih);
        const tuft = G(new THREE.Mesh(new THREE.ConeGeometry(.12, .2, 8), mt(0xffffff, { emissive: 0x555555 })), 'hc'); at(tuft, -.45, .13, z); g.add(tuft); ih.userData.tuft = tuft;
        [0, 1, 2].forEach(r => { const oh = S(new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, .42, 10), ohM.clone()), 'Dış tüylü hücre', 'Üç sıra hâlinde dizilmiş işitme reseptörleridir. Tüycükleri örtü zarına değer. Duyu epiteli yapısındaki mekanoreseptörlerdir.', 'Mekanoreseptör · duyu epiteli', 'hc'); at(oh, .2 + r * .32, cellY, z); g.add(oh); OH[r].push(oh);
          const tf = G(new THREE.Mesh(new THREE.ConeGeometry(.09, .17, 8), mt(0xffffff, { emissive: 0x555555 })), 'hc'); at(tf, .2 + r * .32, .17, z); g.add(tf); oh.userData.tuft = tf; });
      });
      /* Corti tüneli (kemer) */
      for (let i = 0; i < NZ; i++) { const z = zs[i]; g.add(G(cylBetween([-.3, -.12, z], [-.02, .1, z], .028, mt(0xf1d6b0)), 'hc')); g.add(G(cylBetween([.18, -.12, z], [-.02, .1, z], .028, mt(0xf1d6b0)), 'hc')); }
      /* sinirler */
      zs.forEach((z, i) => { const f = G(curveTube([[-.45, -.25, z], [-1.0, -.3, z], [-1.5, -.42, z * .8]], .018, mt(0xf5d56a), 12), 'sin'); g.add(f); });
      const gang = S(ellip(.4, .3, LZ / 2 - .1, mt(0xb9a7ff, { transparent: true, opacity: .75 }), 20), 'Spiral ganglion (sinir hücre gövdeleri)', 'İşitme sinirinin hücre gövdelerinin toplandığı yerdir; tüylü hücrelerden gelen uyartıyı işitme sinirine aktarır.', 'Nöron gövdeleri', 'sin'); at(gang, -1.65, -.45, 0); g.add(gang);
      const nerve = S(curveTube([[-1.65, -.45, LZ / 2 - .1], [-1.65, -.45, LZ / 2 + .3], [-2.2, -.4, LZ / 2 + 1.0], [-3.5, -.2, LZ / 2 + 1.6]], .17, mt(0xf5c542, { emissive: 0x2b2100 }), 24), 'İşitme siniri', 'Korti organındaki reseptörlerde oluşan sinirsel mesajları beyne taşır.', 'Uyartıyı beyne iletir', 'sin'); g.add(nerve);
      const sp = pathFollower(0xffffff, .1, [V3(-.45, -.25, 0), V3(-1.5, -.42, 0), V3(-1.65, -.45, LZ / 2 - .2), V3(-2.2, -.4, LZ / 2 + 1.0), V3(-3.5, -.2, LZ / 2 + 1.6)], .22, 0); g.add(G(sp.orb, 'sin')); ticks.push(t => sp.tick(t));
      /* animasyon */
      const q = V3(0, 0, 0);
      const disp = (z, t) => { const env = Math.exp(-Math.pow((z / (LZ / 2) - api.peak) * 1.9, 2)); return api.amp * env * Math.sin(5.2 * z - t * api.speed); };
      ticks.push(t => {
        for (let i = 0; i < bpos.count; i++) bpos.setY(i, by[i] + disp(bpos.getZ(i), t)); bpos.needsUpdate = true;
        zs.forEach((z, i) => { const d = disp(z, t), a = Math.min(1, Math.abs(d) / Math.max(.02, api.amp) * (api.amp / .12)); IH[i].position.y = cellY + d; IH[i].userData.tuft.position.y = .13 + d; IH[i].userData.tuft.rotation.z = d * 3.2; IH[i].material.emissive.setRGB(a * .2 * (api.amp / .12), a * .9 * (api.amp / .12), a * .75 * (api.amp / .12));
          OH.forEach((row, r) => { const o = row[i]; o.position.y = cellY + d; o.userData.tuft.position.y = .17 + d; o.userData.tuft.rotation.z = d * 3; o.material.emissive.setRGB(a * .9 * (api.amp / .12), a * .35 * (api.amp / .12), 0); }); });
        tec.position.y = .34 + disp(0, t) * .1;
      });
      /* baskın modunda hücreler seçildiğinde vurgu için emissive baz değerini koru */
      return { g, sels, ticks, api };
    }
  };

  /* ============ DENGE ORGANI (ayrıntı) ============ */
  M3.denge = {
    title: 'Denge Organı (ayrıntı)', ico: '⚖️', tag: 'Mekanoreseptör · Duyu epiteli', cam: [0, 3.2, 9.6], target: [0, .2, 0], labScale: .8,
    layers: [['Yarım daire kanalı ampullası (dönme)', 'amp'], ['Tulumcuk/kesecik maküla (doğrusal hareket)', 'mac']],
    task: 'Sol tarafta yarım daire kanalının genişlemiş kısmını (ampulla), sağ tarafta tulumcuk/kesecik yüzeyini incele. “Dönme” hareketi sırasında sıvının cupulayı nasıl eğdiğini; “Eğilme/ivmelenme” sırasında otolit tabakasının tüylü hücreleri nasıl çektiğini gözle.',
    q: { q: 'Başın dönme hareketlerini algılayan yapı hangisidir?', o: ['Tulumcuk', 'Kesecik', 'Yarım daire kanalları', 'Östaki borusu'], a: 2, e: 'Yarım daire kanalları başın dönme hareketlerinin algılanmasında görevlidir. Tulumcuk ve kesecik ise yer çekimi, baş konumu ve doğrusal ivmelenme hakkında bilgi verir.' },
    build() {
      const { g, sels, ticks, S, G } = B(), api = { cup: 0, oto: 0, auto: true }, A = new THREE.Group(), Mc = new THREE.Group(); A.position.x = -3.2; Mc.position.x = 3.2; g.add(A, Mc);
      /* AMPULLA */
      const cn = S(new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, 3.4, 24, 1, true).rotateZ(Math.PI / 2), glass(0x7fe8c0, .22)), 'Yarım daire kanalı', 'Sıvı (endolenf) dolu kanaldır. Baş dönünce sıvı eylemsizlikle geride kalarak ampullanın içindeki cupulayı eğer.', 'Mekanoreseptör · denge (dönme)', 'amp'); cn.userData.low = true; A.add(cn);
      const am = S(ellip(.95, .85, .85, glass(0x7fe8c0, .3), 28), 'Ampulla', 'Kanalın genişlemiş bölümüdür; tüylü hücreler burada bulunur.', 'Mekanoreseptör · denge (dönme)', 'amp'); am.userData.low = true; at(am, 0, 0, 0); A.add(am);
      const crista = S(new THREE.Mesh(new THREE.CylinderGeometry(.55, .62, .18, 24), mt(0xff9a5c)), 'Tüylü hücreler (ampulla)', 'Ampulla tabanında yer alan, duyu epiteli yapısındaki mekanoreseptörlerdir. Cupulanın eğilmesiyle uyarılır.', 'Duyu epiteli · mekanoreseptör', 'amp'); at(crista, 0, -.62, 0); A.add(crista);
      const cupG = new THREE.Group(); at(cupG, 0, -.55, 0); A.add(cupG);
      const cup = S(new THREE.Mesh(new THREE.SphereGeometry(.62, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), glass(0xfff4b0, .55)), 'Cupula (jelimsi kubbe)', 'Tüylü hücrelerin tüycüklerini saran jelimsi kubbedir. Sıvının hareketiyle eğilir.', 'Eğilince reseptörler uyarılır', 'amp'); cupG.add(cup);
      for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283, r = i % 2 ? .3 : .45; cupG.add(G(cylBetween([Math.cos(a) * r, 0, Math.sin(a) * r], [Math.cos(a) * r, .62 - r * .55, Math.sin(a) * r], .012, mt(0xffffff)), 'amp')); }
      for (let i = 0; i < 8; i++) { const nn = G(cylBetween([Math.cos(i) * .3, -.7, Math.sin(i) * .3], [Math.cos(i) * .12, -1.2, Math.sin(i) * .12], .03, mt(0xf5c542)), 'amp'); A.add(nn); }
      const an = S(curveTube([[0, -1.2, 0], [0, -1.6, .2], [.8, -1.9, .5], [2.4, -2.1, 1.2]], .11, mt(0xf5c542, { emissive: 0x2b2100 }), 24), 'Denge siniri', 'Denge reseptörlerinden gelen mesajları beyne taşır.', 'Uyartıyı beyne iletir', 'amp'); A.add(an);
      const fl = []; for (let i = 0; i < 22; i++) { const d = glow(0x99ffd9, .045); A.add(G(d, 'amp')); fl.push({ d, p: Math.random(), y: (Math.random() - .5) * .6, z: (Math.random() - .5) * .6 }); }
      /* MAKÜLA */
      const base = S(new THREE.Mesh(new THREE.BoxGeometry(3.4, .4, 2.4), mt(0xb9d4f0)), 'Destek hücreleri (maküla)', 'Tulumcuk ve keseciğin tabanında tüylü hücrelere destek olan hücre tabakasıdır.', 'Destek', 'mac'); at(base, 0, -.9, 0); Mc.add(base);
      const hcs = [];
      for (let i = 0; i < 12; i++) for (let j = 0; j < 4; j++) {
        const x = -1.45 + i * .26, z = -.8 + j * .53, grp = new THREE.Group(); at(grp, x, -.7, z); Mc.add(grp);
        const c = S(new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, .5, 8), mt(0xff9a5c)), 'Tüylü hücre (maküla)', 'Tulumcuk ve keseciğin yüzeyindeki duyu epiteli yapısında mekanoreseptörlerdir. Üzerindeki otolit tabakası kayınca tüycükleri eğilir.', 'Duyu epiteli · mekanoreseptör', 'mac'); c.position.y = .25; grp.add(c);
        grp.add(G(cylBetween([0, .5, 0], [0, 1.1, 0], .012, mt(0xffffff)), 'mac')); hcs.push({ grp, c });
      }
      const gel = S(new THREE.Mesh(new THREE.BoxGeometry(3.4, .45, 2.4), glass(0xfff0b0, .55)), 'Jelimsi tabaka', 'Tüycükleri saran ve üzerinde otolitleri taşıyan jelimsi tabakadır.', 'Hareketi tüycüklere aktarır', 'mac'); at(gel, 0, .38, 0); Mc.add(gel);
      const rr = srand(12); const oto = S(instMesh(new THREE.OctahedronGeometry(.085), mt(0xffffff, { emissive: 0x555555, roughness: .3 }), 90, (i, d) => { d.position.set((rr() - .5) * 3.1, .72 + rr() * .1, (rr() - .5) * 2.1); d.rotation.set(rr() * 3, rr() * 3, rr() * 3); }), 'Otolitler (kalsiyum kristalleri)', 'Jelimsi tabakanın üzerindeki küçük kalsiyum karbonat kristalleridir. Ağırdırlar; baş eğilince veya vücut hızlanınca jelle birlikte kayarak tüylü hücreleri uyarırlar.', 'Yer çekimi · doğrusal ivme', 'mac'); Mc.add(oto);
      const mn = S(curveTube([[0, -1.1, 0], [0, -1.6, .2], [-.8, -1.9, .5], [-2.4, -2.1, 1.2]], .11, mt(0xf5c542, { emissive: 0x2b2100 }), 24), 'Denge siniri', 'Denge reseptörlerinden gelen mesajları beyne taşır.', 'Uyartıyı beyne iletir', 'mac'); Mc.add(mn);
      /* hareket */
      ticks.push(t => {
        let cp = api.cup, op = api.oto; if (api.auto) { cp = Math.sin(t * .9); op = Math.sin(t * .9 + 1); }
        cupG.rotation.z = -cp * .55; cup.material.opacity = .55; crista.material.emissive.setRGB(Math.abs(cp) * .8, Math.abs(cp) * .25, 0);
        fl.forEach(f => { f.p = (f.p + (cp * .012)) % 1; if (f.p < 0) f.p += 1; f.d.position.set(-1.6 + f.p * 3.2, f.y, f.z); });
        gel.position.x = op * .35; oto.position.x = op * .35;
        hcs.forEach(h => { h.grp.rotation.z = -op * .5; h.c.material.emissive.setRGB(Math.abs(op) * .5, Math.abs(op) * .15, 0); });
      });
      const sp = pathFollower(0xffffff, .09, [V3(0, -1.2, 0), V3(0, -1.6, .2), V3(.8, -1.9, .5), V3(2.4, -2.1, 1.2)], .22, 0); A.add(G(sp.orb, 'amp')); ticks.push(t => sp.tick(t));
      const sp2 = pathFollower(0xffffff, .09, [V3(0, -1.1, 0), V3(0, -1.6, .2), V3(-.8, -1.9, .5), V3(-2.4, -2.1, 1.2)], .22, .3); Mc.add(G(sp2.orb, 'mac')); ticks.push(t => sp2.tick(t));
      return { g, sels, ticks, api };
    }
  };

  window.EAR_VEST = vestibular;
})();
