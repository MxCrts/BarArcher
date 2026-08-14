# À faire confirmer par le bar

Liste de tout ce que j'ai laissé en attente plutôt que de l'inventer.
Les trois premiers points bloquent la mise en ligne, le reste peut suivre.

---

## Bloquant avant publication

### 1. Mentions légales — les champs `[À COMPLÉTER]`
Dans `mentions-legales.html`, surlignés en jaune sur la page :
- raison sociale exacte, forme juridique, capital social le cas échéant
- **numéro SIRET** et immatriculation RCS
- numéro de TVA intracommunautaire, si l'établissement y est assujetti
- **catégorie et numéro de la licence de débit de boissons**
- nom et prénom du **directeur de la publication**
- une adresse de contact (courriel), et un téléphone ou la mention « non communiqué »
- nom, adresse et téléphone de **l'hébergeur** retenu
- le **médiateur de la consommation** auquel l'établissement adhère (obligatoire pour
  un commerce recevant des consommateurs, art. L612-1 du code de la consommation)

### 2. Le nom de domaine
Le site utilise le domaine provisoire `lebardesarchers.fr`. Il faut décider du vrai
domaine, puis le remplacer partout (procédure dans `README.md`, une commande).
Tant que ce n'est pas fait, les balises canoniques et le sitemap pointent dans le vide.

### 3. Validation des horaires
Le tableau reprend ce qui a été relevé au bar en période estivale :

| | |
|---|---|
| Lundi, mardi | fermé |
| Mercredi, jeudi | 14h – 21h |
| Vendredi, samedi | 16h – minuit |
| Dimanche | 9h – 14h |

À confirmer, et surtout : **est-ce que « minuit » vendredi et samedi veut dire minuit
pile, ou plutôt 1h / 2h du matin ?** Le badge « Ouvert / Fermé » en dépend directement.
Le site les présente comme des horaires d'été indicatifs, en renvoyant vers Instagram
pour le programme de la semaine — c'est volontaire, mais il faut que le bar valide
cette formulation.

---

## À confirmer ensuite

### 4. Coordonnées GPS
`43.2647, 1.1789` est une position approximative, reprise du brief. Elle est publiée
dans le JSON-LD lu par Google. À affiner (un relevé sur place ou la fiche Google
Business suffit) pour que l'épingle tombe sur la bonne façade.

### 5. Le plan dessiné à la main
Le plan de la section « Venir » situe le bar sur la place, la halle au centre et la
cathédrale comme repère. **Sa géométrie n'a pas été vérifiée** et il est annoncé comme
indicatif. Deux questions :
- la position relative bar / halle / cathédrale est-elle à peu près juste ?
- souhaitez-vous y faire figurer des noms de rues ? Je n'en ai ajouté aucun faute de
  les connaître avec certitude (voir `DECISIONS.md`).

### 6. Un téléphone ?
Le site n'affiche aucun numéro : il n'y en a pas de public. Instagram est présenté comme
le canal de contact. Si un numéro existe, il mérite d'être ajouté — c'est ce que les gens
cherchent en premier après les horaires.

### 7. La fourchette de prix
Le champ `priceRange` du JSON-LD est volontairement absent : je n'invente pas de prix.
Une indication du type « moins de 10 € » ou « 10–20 € » permettrait de le renseigner,
et Google l'affiche dans les résultats.

### 8. L'ardoise
Les quatre catégories sont volontairement génériques et sans prix ni marques.
Chaque bloc contient un commentaire `<!-- PRIX: à remplir -->` prêt à recevoir des
tarifs. Y a-t-il des choses à mettre en avant que le site tait aujourd'hui — bières
locales, planches, restauration sur place ? *(L'affiche du mois d'août mentionne
« restauration sur place » : à confirmer, car ce n'est écrit nulle part sur le site.)*

### 9. Les concerts
Volontairement, aucune date n'est codée en dur : elles seraient périmées en quelques
semaines. Un emplacement commenté est prêt dans `index.html`, avec la marche à suivre
dans `README.md`. Deux affiches réelles ont été conservées dans le dépôt
(`assets/photos/affiche-du-mois.png` et `affiche-evenement.png`) mais **ne sont pas
affichées** : elles portent des dates. Si vous voulez publier l'affiche du mois, il
suffit de remplacer le fichier et de décommenter le bloc.

### 10. Les avis Google
Quatre avis sont cités avec prénom et note. Ils sont publics, mais un mot au bar (et
idéalement aux auteurs) ne coûte rien. La note globale affichée (4,7 sur 7 avis) devra
être mise à jour quand elle bougera — elle est écrite à deux endroits d'`index.html`,
dans le bandeau et dans le JSON-LD.

### 11. Le crédit du site
Le pied de page indique « Site réalisé par Maxime Crtsz » avec un lien vide (`href="#"`).
À remplacer par une vraie URL, ou à retirer.

### 12. Les photos
Deux photos seulement, prises au téléphone. Elles font le travail, mais la galerie
gagnerait beaucoup à trois ou quatre images de plus, prises en fin de journée sur la
terrasse : le lieu est photogénique et il est sous-vendu. Utiles en particulier :
la salle en service, la terrasse occupée, un plan large de la place.

---

## Point d'attention technique

**Aucun outil de mesure d'audience n'est installé** — c'est ce qui permet au site de
n'avoir aucun cookie et donc aucun bandeau de consentement. Si vous voulez un jour
savoir combien de personnes consultent le site, dites-le : il existe des solutions
sans cookie et conformes RGPD, mais c'est un choix à faire en connaissance de cause.
