/* Audit statique : liens morts, images sans alt/dimensions, risques de débordement,
   hiérarchie des titres, requêtes tierces. */
const fs = require('fs'), path = require('path');
const R = 'C:/BarArcher/';
let pb = [];
const ko = m => pb.push('KO   ' + m);
const info = m => console.log('     ' + m);

const pages = ['index.html', 'mentions-legales.html', '404.html'];

/* ---- 1. toutes les ressources référencées existent ---- */
for (const p of pages) {
  const html = fs.readFileSync(R + p, 'utf8');
  const sansCommentaires = html.replace(/<!--[\s\S]*?-->/g, '');
  const refs = new Set();
  const push = re => { let m; while ((m = re.exec(sansCommentaires))) refs.add(m[1]); };
  push(/(?:src|href)="([^"#][^"]*)"/g);
  for (const m of sansCommentaires.matchAll(/srcset="([^"]+)"/g))
    m[1].split(',').forEach(s => refs.add(s.trim().split(/\s+/)[0]));
  for (const m of sansCommentaires.matchAll(/imagesrcset="([^"]+)"/g))
    m[1].split(',').forEach(s => refs.add(s.trim().split(/\s+/)[0]));

  for (const r of refs) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(r)) continue;
    const chemin = r.split('#')[0].split('?')[0]; if (!chemin) continue;
    const cible = chemin.startsWith('/') ? R + chemin.slice(1) : R + chemin;
    if (!fs.existsSync(cible)) ko(`${p} → ressource introuvable : ${r}`);
  }
}

/* ---- 2. images : alt, width, height ---- */
for (const p of pages) {
  const html = fs.readFileSync(R + p, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const t = m[0];
    if (!/\balt=/.test(t)) ko(`${p} → <img> sans alt : ${t.slice(0, 80)}`);
    if (!/\bwidth=/.test(t) || !/\bheight=/.test(t)) ko(`${p} → <img> sans width/height : ${t.slice(0, 80)}`);
    if (/id="lightbox-img"/.test(t)) continue;
    if (!/loading="lazy"/.test(t) && !/fetchpriority="high"/.test(t) && p === 'index.html')
      ko(`${p} → <img> ni lazy ni prioritaire : ${t.slice(0, 80)}`);
  }
}

/* ---- 3. hiérarchie des titres ---- */
for (const p of pages) {
  const html = fs.readFileSync(R + p, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const niveaux = [...html.matchAll(/<h([1-6])\b/g)].map(m => +m[1]);
  const h1 = niveaux.filter(n => n === 1).length;
  if (h1 !== 1) ko(`${p} → ${h1} <h1> (il en faut exactement 1)`);
  for (let i = 1; i < niveaux.length; i++)
    if (niveaux[i] > niveaux[i - 1] + 1) ko(`${p} → saut de niveau h${niveaux[i - 1]} → h${niveaux[i]}`);
  info(`${p} : titres ${niveaux.join(' ')}`);
}

/* ---- 4. risques de débordement horizontal ---- */
const css = fs.readFileSync(R + 'assets/css/style.css', 'utf8');
const index = fs.readFileSync(R + 'index.html', 'utf8');
if (/(?:max-)?width:\s*100vw/.test(css)) ko('width:100vw en CSS : risque de débordement avec la bande fixe');
if (/\b100vw\b/.test(index.replace(/(?:image)?sizes="[^"]*"/g, ''))) ko('100vw hors attribut sizes dans index.html');
if (/overflow-x:\s*hidden/.test(css)) ko('overflow-x:hidden trouvé (pansement)');
const largeursFixes = [...css.matchAll(/(?:^|[;{]|\s)(?:min-)?width:\s*(\d{3,})px/g)].map(m => +m[1]).filter(v => v > 320);
if (largeursFixes.length) ko('largeur fixe > 320px : ' + largeursFixes.join(', '));
/* nowrap n'est toléré que sur des jetons courts qui ne doivent pas se couper
   (la classe d'évitement visuel, et le prix d'une ligne de carte). */
const nowrapTolere = ['.hors-ecran', '.carte__prix'];
for (const m of css.matchAll(/([^{}]+)\{[^}]*white-space:\s*nowrap[^}]*\}/g)) {
  const sel = m[1].trim().split('\n').pop().trim();
  if (!nowrapTolere.some(t => sel.includes(t))) ko('white-space:nowrap sur un sélecteur non prévu : ' + sel);
}

/* ---- 5. aucune requête tierce au runtime ---- */
const runtime = index + fs.readFileSync(R + 'assets/js/app.js', 'utf8') + css;
const tiers = [...runtime.matchAll(/(?:fetch|XMLHttpRequest|@import|url\()\s*\(?["']?(https?:\/\/[^"')\s]+)/g)];
if (tiers.length) ko('requête tierce au runtime : ' + tiers.map(m => m[1]).join(', '));

/* ---- 6. cohérence des deux miroirs d'horaires ---- */
const json = JSON.parse(fs.readFileSync(R + 'data/horaires.json', 'utf8'));
const table = {};
for (const m of index.matchAll(/data-iso="(\d)"\s+data-creneaux="([^"]*)"/g)) table[+m[1]] = m[2];
for (const j of json.jours) {
  const attendu = j.creneaux.map(c => c.ouverture + '-' + c.fermeture).join(',');
  if (table[j.iso] !== attendu) ko(`miroir désynchronisé ${j.nom} : tableau "${table[j.iso]}" vs json "${attendu}"`);
}
const ldMatch = index.match(/"openingHoursSpecification":\s*\[([\s\S]*?)\n  \]/);
info('JSON-LD openingHoursSpecification : ' + (ldMatch ? 'présent' : 'ABSENT'));
if (!ldMatch) ko('openingHoursSpecification absent du JSON-LD');
try { JSON.parse(index.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]); info('JSON-LD : syntaxe valide'); }
catch (e) { ko('JSON-LD invalide : ' + e.message); }

/* ---- 7. ancres internes ---- */
const ids = new Set([...index.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
for (const m of index.matchAll(/href="#([^"]+)"/g)) if (!ids.has(m[1])) ko('ancre morte : #' + m[1]);

/* ---- 8. vestiges de chantier ---- */
for (const p of pages) {
  const brut = fs.readFileSync(R + p, 'utf8');
  const visible = brut.replace(/<!--[\s\S]*?-->/g, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  if (/lorem ipsum/i.test(visible)) ko(p + ' → lorem ipsum');
  if (/\bTODO\b|\bFIXME\b|\bXXX\b/.test(visible)) ko(p + ' → TODO visible dans le rendu');
  if (p !== 'mentions-legales.html' && /À COMPLÉTER/.test(visible)) ko(p + ' → « À COMPLÉTER » visible hors mentions légales');
}

/* ---- 9. dialog + accessibilité de base ---- */
if (!/<dialog/.test(index)) ko('pas de <dialog> pour la galerie');
if (!/class="evitement"/.test(index)) ko('pas de lien d\'évitement');
for (const m of index.matchAll(/<button\b[^>]*>/g))
  if (!/aria-label/.test(m[0]) && !/class="galerie__bouton"/.test(m[0])) info('bouton sans aria-label (vérifier le texte interne) : ' + m[0].slice(0, 60));

console.log('\n===== AUDIT =====');
console.log(pb.length ? pb.join('\n') : 'Aucun problème détecté.');
process.exit(pb.length ? 1 : 0);
