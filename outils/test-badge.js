/* Vérifie le badge ouvert/fermé sur les 7 jours x plusieurs moments,
   en évaluant directement le code de production extrait de app.js. */
const fs = require('fs');
const src = fs.readFileSync('C:/BarArcher/assets/js/app.js', 'utf8');
const debut = src.indexOf('var NOMS =');
const fin = src.indexOf('function texteCreneaux');
const finBloc = src.indexOf('function appliquer');
const chunk = src.slice(debut, finBloc);
if (debut < 0 || finBloc < 0) throw new Error('extraction impossible');

const sandbox = { $$: () => [], Intl, Date, Math, String, console };
const fn = new Function('$$', 'Intl', 'Date', 'Math', 'String',
  chunk + '\n return {enMinutes, enHeure, statut, phrase, texteCreneaux, semaineDepuisJson, maintenantParis, veille, lendemain, NOMS};');
const M = fn(sandbox.$$, Intl, Date, Math, String);

const data = JSON.parse(fs.readFileSync('C:/BarArcher/data/horaires.json', 'utf8'));
const semaine = M.semaineDepuisJson(data);

const JOURS = ['', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const MOMENTS = [
  ['00:30', 30], ['08:00', 480], ['10:00', 600], ['13:30', 810], ['14:00', 840],
  ['15:00', 900], ['16:00', 960], ['20:59', 1259], ['21:00', 1260], ['23:30', 1410],
];

let lignes = [];
for (let iso = 1; iso <= 7; iso++) {
  for (const [lbl, min] of MOMENTS) {
    const s = M.statut(semaine, iso, min);
    lignes.push(`${JOURS[iso].padEnd(9)} ${lbl}  ${(s.ouvert ? 'OUVERT' : 'fermé ')}  ${M.phrase(s)}`);
  }
  lignes.push('');
}
console.log(lignes.join('\n'));

/* ---- assertions ---- */
const T = [];
const ok = (nom, cond) => T.push((cond ? 'OK   ' : 'ECHEC') + '  ' + nom);
const st = (iso, min) => M.statut(semaine, iso, min);

ok('lundi 15h fermé', !st(1, 900).ouvert);
ok('lundi 15h -> ouvre mercredi', M.phrase(st(1, 900)) === 'ouvre mercredi à 14h');
ok('mardi 15h -> ouvre demain à 14h', M.phrase(st(2, 900)) === 'ouvre demain à 14h');
ok('mercredi 13h59 fermé -> ouvre à 14h', M.phrase(st(3, 839)) === 'ouvre à 14h');
ok('mercredi 14h00 ouvert', st(3, 840).ouvert);
ok('mercredi 20h59 ouvert -> ferme à 21h', st(3, 1259).ouvert && M.phrase(st(3, 1259)) === 'ferme à 21h');
ok('mercredi 21h00 fermé -> ouvre demain à 14h', !st(3, 1260).ouvert && M.phrase(st(3, 1260)) === 'ouvre demain à 14h');
ok('jeudi 22h -> ouvre demain à 16h', M.phrase(st(4, 1320)) === 'ouvre demain à 16h');
ok('vendredi 15h59 fermé', !st(5, 959).ouvert);
ok('vendredi 16h ouvert -> ferme à minuit', st(5, 960).ouvert && M.phrase(st(5, 960)) === 'ferme à minuit');
ok('vendredi 23h59 encore ouvert', st(5, 1439).ouvert);
ok('vendredi 23h59:59 -> encore ouvert, samedi 00h00 -> fermé', st(5, 1439).ouvert && !st(6, 0).ouvert);
ok('SAMEDI 00h30 fermé (vendredi ferme A minuit pile)', !st(6, 30).ouvert);
ok('samedi 00h30 -> ouvre à 16h', M.phrase(st(6, 30)) === 'ouvre à 16h');
ok('samedi 08h fermé -> ouvre à 16h', !st(6, 480).ouvert && M.phrase(st(6, 480)) === 'ouvre à 16h');
ok('DIMANCHE 00h30 fermé (samedi ferme A minuit pile)', !st(7, 30).ouvert);
ok('dimanche 08h59 fermé -> ouvre à 9h', !st(7, 539).ouvert && M.phrase(st(7, 539)) === 'ouvre à 9h');
ok('dimanche 09h ouvert -> ferme à 14h', st(7, 540).ouvert && M.phrase(st(7, 540)) === 'ferme à 14h');
ok('dimanche 14h fermé -> ouvre mercredi à 14h', !st(7, 840).ouvert && M.phrase(st(7, 840)) === 'ouvre mercredi à 14h');
ok('LUNDI 00h30 fermé (dimanche ne passe pas minuit)', !st(1, 30).ouvert);
ok('lundi 00h30 -> ouvre mercredi à 14h', M.phrase(st(1, 30)) === 'ouvre mercredi à 14h');
ok('mardi 23h -> ouvre demain à 14h', M.phrase(st(2, 1380)) === 'ouvre demain à 14h');
ok('format midi', M.enHeure(720) === 'midi');
ok('format minuit', M.enHeure(0) === 'minuit');
ok('format 16h30', M.enHeure(990) === '16h30');
ok('format 9h', M.enHeure(540) === '9h');
ok('texte creneaux vendredi', M.texteCreneaux(semaine[5]) === '16h – minuit');
ok('texte creneaux lundi = null', M.texteCreneaux(semaine[1]) === null);

/* Cas qui déborde vraiment sur le lendemain : le patron passe samedi à 16h-02h. */
const tardif = M.semaineDepuisJson({
  jours: [
    { iso: 1, creneaux: [] }, { iso: 2, creneaux: [] },
    { iso: 3, creneaux: [{ ouverture: '14:00', fermeture: '21:00' }] },
    { iso: 4, creneaux: [{ ouverture: '14:00', fermeture: '21:00' }] },
    { iso: 5, creneaux: [{ ouverture: '16:00', fermeture: '00:00' }] },
    { iso: 6, creneaux: [{ ouverture: '16:00', fermeture: '02:00' }] },
    { iso: 7, creneaux: [{ ouverture: '09:00', fermeture: '14:00' }] }
  ]
});
const stt = (iso, min) => M.statut(tardif, iso, min);
ok('16h-02h : samedi 23h30 ouvert', stt(6, 1410).ouvert);
ok('16h-02h : DIMANCHE 01h00 encore ouvert', stt(7, 60).ouvert);
ok('16h-02h : dimanche 01h00 -> ferme à 2h', M.phrase(stt(7, 60)) === 'ferme à 2h');
ok('16h-02h : dimanche 02h00 fermé -> ouvre à 9h', !stt(7, 120).ouvert && M.phrase(stt(7, 120)) === 'ouvre à 9h');
ok('16h-02h : samedi 15h fermé -> ouvre à 16h', !stt(6, 900).ouvert);
ok('16h-02h : tableau affiche 16h – 2h', M.texteCreneaux(tardif[6]) === '16h – 2h');

/* Cas limite : semaine entièrement fermée -> message honnête, pas de plantage. */
const vide = M.semaineDepuisJson({ jours: [1, 2, 3, 4, 5, 6, 7].map(i => ({ iso: i, creneaux: [] })) });
ok('semaine vide -> pas de plantage', M.phrase(M.statut(vide, 3, 900)) === 'horaires publiés sur Instagram');

console.log('\n===== ASSERTIONS =====');
console.log(T.join('\n'));
const echecs = T.filter(l => l.startsWith('ECHEC')).length;
console.log(`\n${T.length - echecs}/${T.length} passent.`);
process.exit(echecs ? 1 : 0);
