/* Calcule le contraste WCAG 2.1 de chaque paire réellement utilisée. */
const hex = h => h.replace('#', '').match(/../g).map(v => parseInt(v, 16));
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const L = rgb => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
const ratio = (a, b) => { const l1 = L(a), l2 = L(b); const [h, l] = l1 > l2 ? [l1, l2] : [l2, l1]; return (h + 0.05) / (l + 0.05); };
/* superposition d'une couleur semi-transparente sur un fond */
const over = (fg, alpha, bg) => hex(fg).map((c, i) => Math.round(alpha * c + (1 - alpha) * hex(bg)[i]));

const C = { vert: '#2C522A', encre: '#1E3A1D', jaune: '#FFDC59', creme: '#FFF9D7', papier: '#F4F2E8', blanc: '#FFFFFF' };

/* voile du hero, pire cas : opacité 0,84 par-dessus un pixel blanc de la photo */
const voileHero = over(C.encre, 0.84, C.blanc);
const voileHaut = over(C.encre, 0.52, C.blanc); /* haut du hero : aucun texte */

const paires = [
  ['texte courant', 'encre', 'papier', C.encre, C.papier, 4.5],
  ['texte courant (sections crème)', 'encre', 'creme', C.encre, C.creme, 4.5],
  ['titres et intertitres', 'vert', 'papier', C.vert, C.papier, 4.5],
  ['titres (sections crème)', 'vert', 'creme', C.vert, C.creme, 4.5],
  ['texte sur fond vert', 'creme', 'vert', C.creme, C.vert, 4.5],
  ['surtitre + labels sur vert', 'jaune', 'vert', C.jaune, C.vert, 4.5],
  ['texte du pied de page', 'creme', 'encre', C.creme, C.encre, 4.5],
  ['message loi Évin (pied)', 'jaune', 'encre', C.jaune, C.encre, 4.5],
  ['libellé des boutons jaunes', 'encre', 'jaune', C.encre, C.jaune, 4.5],
  ['libellé des boutons crème', 'encre', 'creme', C.encre, C.creme, 4.5],
  ['bordure des boutons (UI)', 'encre', 'jaune', C.encre, C.jaune, 3],
  ['badge ouvert (texte)', 'encre', 'jaune', C.encre, C.jaune, 4.5],
  ['badge fermé (texte)', 'encre', 'creme', C.encre, C.creme, 4.5],
  ['jour surligné du tableau', 'encre', 'jaune', C.encre, C.jaune, 4.5],
  ['hero — titre et adresse', 'creme', 'voile 0,84 sur blanc', C.creme, '#' + voileHero.map(v => v.toString(16).padStart(2, '0')).join(''), 4.5],
  ['hero — signature manuscrite', 'jaune', 'voile 0,84 sur blanc', C.jaune, '#' + voileHero.map(v => v.toString(16).padStart(2, '0')).join(''), 4.5],
  ['bande verticale ARCHERS (déco)', 'jaune', 'vert', C.jaune, C.vert, 3],
];

let echecs = 0;
console.log('paire'.padEnd(34) + 'avant/arrière'.padEnd(34) + 'ratio    exigé  verdict');
console.log('-'.repeat(96));
for (const [nom, na, nb, a, b, min] of paires) {
  const r = ratio(hex(a), hex(b));
  const ok = r >= min;
  if (!ok) echecs++;
  console.log(nom.padEnd(34) + `${na} sur ${nb}`.padEnd(34) + r.toFixed(2).padStart(5) + ':1' + String(min).padStart(7) + '   ' + (ok ? 'OK' : '*** ECHEC ***'));
}

console.log('\n--- Paire volontairement écartée du texte ---');
const jc = ratio(hex(C.jaune), hex(C.creme));
const jp = ratio(hex(C.jaune), hex(C.papier));
console.log(`jaune sur crème  : ${jc.toFixed(2)}:1  -> sous 3:1, donc JAMAIS de texte ni d'élément d'interface. Décor uniquement.`);
console.log(`jaune sur papier : ${jp.toFixed(2)}:1  -> idem.`);

console.log('\nHaut du hero (voile 0,52 sur blanc) : aucun texte ne s\'y trouve, seulement le logo.');
console.log('Couleur composite du voile bas : #' + voileHero.map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase());
console.log('\n' + (echecs ? `${echecs} PAIRE(S) EN ECHEC` : 'Toutes les paires porteuses de sens passent AA.'));
process.exit(echecs ? 1 : 0);
