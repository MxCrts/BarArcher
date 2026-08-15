# Décisions

Ce que j'ai tranché seul, faute d'information, et pourquoi. Les points qui demandent
une confirmation du bar sont dans `TODO-CLIENT.md`.

---

## Structure : six blocs, moitié moins de défilement

La première version comptait dix sections et se lisait comme un dépliant : trop long
pour un bar de village, où la visite dure trente secondes et sert à répondre à trois
questions — *c'est ouvert ? c'est où ? ça coûte combien ?*

La refonte fusionne et raccourcit :

| avant | après |
|---|---|
| hero 100dvh | hero **82dvh** — on voit dépasser le bloc suivant, le site s'annonce court |
| bandeau infos + horaires + venir *(3 sections)* | **un seul bloc « Horaires & adresse »**, deux colonnes |
| ardoise en 4 cartes encadrées | **la carte, en tête de page**, six lignes sur filets |
| histoire *(200 mots)* + avis *(4 encadrés)* | **un bloc**, texte ramené à ~110 mots, avis en liste |
| rendez-vous en section pleine | **une bande**, une phrase, un bouton |

Six blocs au lieu de dix, et chacun plus court : le défilement est divisé par deux.

**La carte passe en premier**, avant les horaires. C'est contre-intuitif pour un bar,
mais c'est ce que dit la mesure : 86 % des clients consultent la carte avant de se
déplacer, et l'ordre de référence des sites de restaurants performants place le menu
juste après le hero. Le statut Ouvert/Fermé, lui, reste dans le hero — il répond à la
question la plus urgente sans le moindre défilement.

**Épuration :** les surtitres manuscrits par section ont disparu au profit d'un simple
label en capitales ; les cadres, bordures de 2-3 px et fonds de cartes ont été
remplacés par des filets à 16 % d'opacité ; le motif d'arche ne subsiste que sur les
photos et le plan, au lieu de six emplacements. Il reste beaucoup plus de blanc.

---

## Identité visuelle

### Palette relevée sur les fichiers, pas inventée
Les hex sont échantillonnés directement dans `logo.png` et les deux affiches.

| Jeton | Hex | Origine |
|---|---|---|
| `--vert` | `#2C522A` | fond du logo, couleur dominante des affiches |
| `--jaune` | `#FFDC59` | l'arc et le lettrage du logo |
| `--creme` | `#FFF9D7` | le papier des post-it de l'affiche du mois |
| `--encre` | `#1E3A1D` | **dérivé** — vert assombri, pour le texte courant |
| `--papier` | `#F4F2E8` | **dérivé** — crème refroidi, fond de page |

Deux valeurs dérivées, pas une de plus. Le crème de marque (`#FFF9D7`) est trop jaune
pour tenir sur toute la hauteur d'une page ; il sert de surface chaude par sections,
et `--papier` prend le fond général.

### Le jaune ne porte jamais d'information
Calculé, pas jugé à l'œil : **jaune sur crème = 1,27:1**, jaune sur papier = 1,20:1.
Très en dessous des 3:1 minimum. Le jaune n'est donc utilisé que :
- **sur fond vert ou encre**, où il passe largement (6,66:1 et 9,32:1) ;
- **comme fond**, avec du texte encre par-dessus (9,32:1) ;
- **comme aplat décoratif** cerné d'un trait vert (le repère du bar sur le plan).

Un liseré jaune prévu sur l'aparté « on vous attend au bar ! » a été repassé en vert
pour cette raison : sur crème, il était invisible.

`node outils/contrastes.js` recalcule les 17 paires utilisées. Toutes passent AA.

### Typographie
- **Display — Montserrat 800**, capitales, interlettrage resserré. C'est la grotesque
  géométrique très grasse la plus proche du lettrage du logo.
- **Accent — Caveat 700.** Une seule famille manuscrite couvre les deux usages demandés :
  en capitales pour les jours et les micro-labels, en bas-de-casse pour les apartés
  (« on vous attend au bar ! », « aujourd'hui », légendes de photos). C'est la main
  qu'on retrouve sur les affiches du bar.
- **Texte courant — pile système** (`system-ui`, Segoe UI, Roboto, San Francisco…).
  **C'est un choix discutable, assumé :** une troisième police auto-hébergée coûtait
  ~20 Ko pour un gain de caractère nul sur du texte de labeur, alors que Caveat mange
  déjà 49 Ko. La pile système est neutre, lisible, et pèse zéro octet.
- `size-adjust: 118%` sur Caveat : sa hauteur d'x est basse, elle décrochait à côté
  des deux autres.

Les deux `.woff2` sont servies depuis `assets/fonts/`, sous-ensemble latin uniquement
(Œ/œ et tous les accents français inclus). Montserrat est préchargée : c'est la police
du titre du hero.

### L'arche et la bande ARCHERS
L'ogive du logo est aussi celle des arcades de la halle et des porches du village.
Après épuration, elle ne subsiste qu'à **deux endroits** : le masque des quatre photos
de la galerie, et le cadre du plan. C'est la seule audace de forme ; tout le reste est
droit. Elle était initialement présente à six endroits — c'était une manie, plus un
motif.

La bande verticale `ARCHERS` de l'affiche est reprise en bordure droite fixe à partir
de 62em, jaune sur vert. **En dessous de 62em elle disparaît** : sur un petit écran, la
barre d'actions occupe déjà le bas, une bande latérale en plus aurait été de
l'encombrement. Le corps de page réserve sa largeur via `padding-right`, ce qui évite
tout `100vw` et donc tout débordement horizontal.

---

## Contenu et droit

### Rien d'inventé
Aucun téléphone, aucun prix, aucune marque de bière, aucun nom de patron, aucune date
d'événement. L'ardoise nomme des catégories (« Bières », « Vins de la région »,
« Apéritifs », « Cafés et softs ») avec des formulations qui ne s'engagent sur rien de
vérifiable, et chaque bloc porte un commentaire `<!-- PRIX: à remplir -->`.

### Loi Évin
Le message sanitaire figure dans le pied de page de la page d'accueil, des mentions
légales et de la 404. Contrainte suivie dans l'écriture : la communication sur l'alcool
reste **informative et objective**. Pas de scène de consommation, pas de valorisation
de l'ivresse, pas d'adjectif qui vante l'effet. Les textes parlent du lieu, de l'histoire
et des horaires ; les boissons sont énumérées, pas célébrées. La photo de comptoir est
documentaire (elle montre les fresques et le bar), et non une mise en scène.
Les mentions légales rappellent l'interdiction de vente aux mineurs (art. L3342-1 CSP).

### Les avis
Les quatre verbatims sont repris tels quels, avec prénom, note et mention « avis Google ».
Aucun carrousel automatique : ils sont tous visibles d'un coup. `aggregateRating` ne
contient que les chiffres réels (4,7 sur 7 avis).

### `priceRange` absent du JSON-LD
Le brief le demandait, mais je n'ai aucune donnée de prix. Écrire `€€` aurait été
inventer. Le champ est laissé de côté et signalé dans `TODO-CLIENT.md`.

### Pas de rue nommée sur le plan
Le plan devait porter deux ou trois noms de rues. Je ne connais avec certitude que
« place de la Halle ». Inventer des noms de rues dans un village de 2 500 habitants,
c'est se faire prendre en une seconde par le premier voisin qui visite le site. Le plan
ne nomme donc que ce qui est vérifié : la place, la halle, le bar et sa cathédrale.
La `<figcaption>` annonce « plan indicatif, pas à l'échelle ».

### La rose des vents en moins
Elle figurait sur le plan. Retirée à la relecture : sur un dessin explicitement « pas à
l'échelle », une flèche nord affirme une orientation que personne n'a vérifiée.
Un accessoire qui décore un peu et ment un peu.

---

## Technique

### Comment le site tient ses deux promesses contradictoires
Il devait à la fois (a) marcher en double-cliquant `index.html` et sans JavaScript, et
(b) n'avoir qu'un seul fichier d'horaires à modifier. En `file://`, `fetch()` est bloqué :
impossible de tout piloter depuis le JSON.

La solution retenue : **le tableau HTML porte les horaires en attributs `data-creneaux`
et sert de source de repli**. Le script les lit immédiatement — le badge est donc juste
même hors ligne, en double-clic ou sans réseau. Dès que `data/horaires.json` est
accessible (c'est-à-dire sur le site déployé), il écrase ces valeurs et redevient la
référence. Les deux copies sont balisées `MIROIR HORAIRES` et `outils/audit.js` échoue
si elles divergent. C'est le compromis le moins mauvais, et il est vérifiable.

### Horaires : minuit et fuseau
Un créneau dont la fermeture est **inférieure ou égale** à l'ouverture passe minuit.
`16:00 → 00:00` ferme donc à minuit pile : à 00h30, le bar est fermé. Si le bar passe
un jour à `02:00`, la logique gère le débordement sur le lendemain sans rien changer
d'autre. L'heure est toujours lue à **Europe/Paris** via `Intl`, jamais l'horloge de
l'appareil — un visiteur en vacances à l'étranger voit le bon statut.
35 assertions couvrent 7 jours × 10 moments (`outils/test-badge.js`).

### `closes: "23:59"` dans le JSON-LD
Pour vendredi et samedi, `"closes": "00:00"` est ambigu pour Google (00:00→00:00 signifie
« fermé »). J'utilise `23:59`, la convention documentée pour les fermetures tardives.
Une minute d'écart, contre un risque de mauvaise interprétation dans les résultats de
recherche. Lundi et mardi sont bien présents, avec `00:00 → 00:00`, qui code « fermé ».

### Photos
Deux photos réelles seulement. Plutôt que de meubler, j'ai **recadré** : la façade et son
enseigne peinte, et la fresque du tir au papogay sont des extraits de ces deux photos.
Ce sont de vraies images du lieu, jamais retouchées au-delà du cadrage. Les recadrages
ne sont pas agrandis au-delà de leur taille native (530 à 900 px), donc pas de flou
d'interpolation ; c'est la limite des sources.

### `404.html` en chemins absolus
Seule exception à la règle des chemins relatifs : une page 404 peut être servie depuis
n'importe quelle profondeur d'URL. Elle ne fonctionne donc pas en double-clic, ce qui
est sans conséquence.

### Domaine provisoire
`lebardesarchers.fr` est un **réglage**, pas un fait sur le bar : il faut le remplacer
partout avant mise en ligne (procédure dans `README.md`). Il apparaît dans le canonical,
l'Open Graph, le JSON-LD, `robots.txt` et `sitemap.xml`.

### Pas de menu mobile
La page est courte et linéaire. Un tiroir hamburger aurait ajouté du JavaScript, un piège
de focus de plus et une cible à ne pas rater, pour naviguer dans six sections qu'on
atteint en glissant le pouce. En mobile, seule la barre d'actions reste — deux boutons,
jamais trois — et elle s'efface tant que le hero est à l'écran.

### Budget tenu
HTML + CSS + JS + polices = **144 Ko** sur 150 autorisés, dont 68 Ko de polices.
JavaScript : **9,7 Ko** non minifié sur 10 autorisés. Les icônes répétées (étoiles,
épingle, Instagram) sont factorisées en `<symbol>`/`<use>`, ce qui a rendu 4 Ko d'HTML.
