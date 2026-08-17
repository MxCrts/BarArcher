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

## Ajouter les prix

Les prix sont le premier manque du site : 86 % des gens consultent la carte d'un bar
avant de s'y rendre, et la nôtre n'en affiche aucun. Chaque ligne de la section
« La carte » (dans `index.html`) contient un emplacement vide, prêt à recevoir le sien :

```html
<span class="carte__prix"></span>          <!-- avant  -->
<span class="carte__prix">à partir de 3 €</span>   <!-- après -->
```

Tant qu'il est vide, il ne s'affiche pas — rien d'autre à toucher, pas de mise en page
à reprendre. Six lignes à remplir, dix minutes de travail.

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

Le site est actuellement servi sur GitHub Pages, à
<https://mxcrts.github.io/BarArcher/> — c'est cette adresse que déclarent la balise
canonique, l'Open Graph, le JSON-LD, `robots.txt` et `sitemap.xml`.

**Si le bar prend un nom de domaine**, il faut la remplacer aux 11 endroits
concernés (`index.html`, `mentions-legales.html`, `robots.txt`, `sitemap.xml`),
en une commande :

```sh
grep -rl "mxcrts.github.io/BarArcher" . --exclude-dir=.git
sed -i 's|https://mxcrts.github.io/BarArcher|https://le-vrai-domaine.fr|g' \
  index.html mentions-legales.html robots.txt sitemap.xml
```

Et pensez à corriger l'hébergeur dans `mentions-legales.html` s'il change aussi.

---

## Annoncer une date (elle s'effacera toute seule)

Dans la section « Concerts & rendez-vous » d'`index.html`, le bloc
`Prochaines dates` contient une ligne par date :

```html
<li data-fin="2026-08-21"><b>Vendredi 21 août</b> <span>Beer Pong Night</span></li>
```

Copiez une ligne, changez `data-fin` (au format `AAAA-MM-JJ`), le jour et le nom.
**Le lendemain de `data-fin`, la ligne disparaît d'elle-même**, et le bloc entier
s'efface quand il n'en reste aucune : il n'y a jamais de date périmée à l'écran,
même si personne ne s'en occupe. `node outils/audit.js` indique combien de dates
sont encore à venir.

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

## Afficher l'affiche d'une soirée

Pour les dates elles-mêmes, voir « Annoncer une date » plus haut : c'est automatique.
Pour mettre en avant **l'affiche** d'une soirée, décommentez le bloc
`EMPLACEMENT ÉVÉNEMENT PONCTUEL` dans `index.html` (section « Concerts & rendez-vous »)
et déposez l'image sous le nom `assets/photos/affiche-evenement.png`.

Contrairement aux lignes de dates, **une affiche ne s'efface pas toute seule** : elle
est dans le HTML, pas dans une ligne datée. Pensez à recommenter le bloc quand la
date est passée. Deux remarques :

- les affiches livrées par le bar pèsent ~700 Ko en PNG ; convertissez-les en WebP
  (ou JPEG de qualité 80) avant publication, sinon la page double de poids ;
- l'`<img>` doit garder ses attributs `width`, `height`, `alt` et `loading="lazy"`,
  sans quoi `node outils/audit.js` refuse de passer.

---

Site réalisé par [Maxime Cortes](https://mxcrts.github.io/PortFolio/).
Photos, logo et affiches fournis par le bar.
