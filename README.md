# Le Bar des Archers — site du bar

Site d'une page pour **Le Bar des Archers**, 8 place de la Halle, 31310 Rieux-Volvestre.
HTML, CSS et JavaScript écrits à la main. Aucun framework, aucune étape de build,
aucune dépendance à installer, **aucune requête vers un service tiers** — donc
aucun cookie, et pas de bandeau de consentement à afficher.

---

## Changer un horaire (la seule manip courante)

1. Ouvrez `data/horaires.json` et modifiez `"ouverture"` / `"fermeture"` du jour concerné
   (pour un jour fermé, laissez `"creneaux": []` ; pour une fermeture après minuit,
   écrivez l'heure du lendemain, par exemple `"fermeture": "02:00"`).
2. Enregistrez : le tableau des horaires, la ligne « Aujourd'hui » et le badge
   Ouvert/Fermé du haut de page se mettent à jour tout seuls.
3. Recopiez les mêmes heures dans les **deux blocs `MIROIR HORAIRES`** de `index.html` —
   ils servent aux visiteurs sans JavaScript et à Google (JSON-LD).
4. Publiez (voir « Déployer » plus bas).

> L'étape 3 est facultative pour l'affichage courant, mais indispensable pour le
> référencement. `node outils/audit.js` vous prévient si les deux miroirs divergent.

---

## Prévisualiser

- **Le plus simple :** double-cliquez `index.html`. Tout fonctionne, badge compris.
- **Fidèle au vrai site** (nécessaire pour que `data/horaires.json` soit relu) :
  lancez un serveur local dans le dossier, puis ouvrez <http://localhost:4173>.
  Par exemple `npx serve -l 4173 .` ou `python -m http.server 4173`.

## Déployer

Le site est fait de fichiers statiques : **déposez le contenu du dossier tel quel.**

- **Netlify / GitHub Pages :** pointez sur la racine du dépôt, sans commande de build.
- **FTP OVH :** envoyez tout le contenu dans `www/`.

Avant la première mise en ligne, remplacez le domaine provisoire `lebardesarchers.fr`
par le vrai, dans `index.html` (canonical, Open Graph, JSON-LD),
`mentions-legales.html`, `robots.txt` et `sitemap.xml` :

```sh
grep -rl "lebardesarchers.fr" . --exclude-dir=.git
```

---

## Ce qu'il y a dans le dossier

```
index.html              la page du bar
mentions-legales.html   champs [À COMPLÉTER] à remplir avant mise en ligne
404.html                page d'erreur
data/horaires.json      SOURCE DES HORAIRES — le fichier que vous modifierez
assets/css/style.css    toute la mise en forme (un seul fichier)
assets/js/app.js        badge d'ouverture, galerie, animations (un seul fichier)
assets/fonts/           Montserrat et Caveat, servies depuis le site
assets/photos/          photos d'origine + versions AVIF / WebP / JPEG
assets/icons/           favicons
outils/                 scripts de vérification, à lancer avec Node
DECISIONS.md            les choix faits et pourquoi
TODO-CLIENT.md          ce qui reste à confirmer avec le bar
```

## Vérifier avant de publier

```sh
node outils/audit.js        # liens morts, images, titres, miroirs d'horaires
node outils/test-badge.js   # badge Ouvert/Fermé, 7 jours et passage de minuit
node outils/contrastes.js   # contrastes WCAG de chaque paire de couleurs
```

## Annoncer un concert

Le calendrier vit sur Instagram, à dessein : rien n'est codé en dur. Pour afficher
malgré tout une date précise, décommentez le bloc `EMPLACEMENT ÉVÉNEMENT PONCTUEL`
dans `index.html` (section « Les rendez-vous ») et déposez l'affiche sous le nom
`assets/photos/affiche-evenement.png`. **Pensez à recommenter le bloc une fois la
date passée** — une affiche périmée fait plus de mal qu'une absence d'affiche.

---

Site réalisé par Maxime Crtsz. Photos et logo fournis par le bar.
