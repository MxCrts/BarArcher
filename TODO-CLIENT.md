# À faire confirmer par le bar

Liste de tout ce qui a été laissé en attente plutôt qu'inventé.
Il ne reste **qu'un seul point vraiment bloquant** : les mentions légales.

---

## Le message à envoyer au bar

Tout ce qui manque tient en un message. À copier-coller tel quel :

> Bonjour, le site est prêt et en ligne. Il me manque des informations que vous
> seuls avez. Deux minutes de réponse suffisent :
>
> **Obligatoire pour la loi (mentions légales)**
> 1. Le nom exact de la société, sa forme (SARL, SAS, entreprise individuelle…)
>    et son numéro **SIRET**
> 2. La **catégorie et le numéro de votre licence de débit de boissons**
> 3. Le nom et le prénom de la personne responsable du site
> 4. Une adresse e-mail de contact, et un téléphone (ou « non communiqué »)
> 5. Le **médiateur de la consommation** auquel vous adhérez (c'est obligatoire
>    pour un commerce qui reçoit des clients — si vous n'en avez pas encore, il
>    faut y adhérer, ça coûte quelques dizaines d'euros par an)
>
> **Ce qui ferait le plus de différence sur le site**
> 6. **Six prix indicatifs** : demi pression, pinte, verre de vin, apéritif,
>    café, soft. Même approximatifs (« à partir de 3 € ») c'est ce que les gens
>    cherchent en premier après les horaires
> 7. La **restauration sur place**, c'est quoi exactement ? (planches, tapas,
>    plats du jour ?) C'est annoncé sur votre affiche et c'est un vrai argument
> 8. Une fourchette de prix générale : plutôt « moins de 10 € » ou « 10–20 € » ?
> 9. Des **bières locales** à mettre en avant ?
> 10. Avez-vous un **numéro de téléphone** que je peux publier ?
> 11. Les horaires du tableau sont-ils bons hors été, et jusqu'à quand valent-ils ?
>
> **Si vous en avez sous la main**
> 12. Trois ou quatre photos de plus, prises en fin de journée : la salle en
>     service, la terrasse occupée, un plan large de la place.

---

## Bloquant avant de communiquer sur le site

### 1. Mentions légales — les champs `[À COMPLÉTER]`
Dans `mentions-legales.html`, surlignés en jaune sur la page. Il en reste **onze**,
tous détenus par le bar :
- raison sociale exacte, forme juridique, capital social le cas échéant
- **numéro SIRET** et immatriculation RCS
- numéro de TVA intracommunautaire, si l'établissement y est assujetti
- **catégorie et numéro de la licence de débit de boissons**
- nom et prénom du **directeur de la publication**
- une adresse de contact (courriel), et un téléphone ou la mention « non communiqué »
- le **médiateur de la consommation** auquel l'établissement adhère (obligatoire pour
  un commerce recevant des consommateurs, art. L612-1 du code de la consommation)

L'**hébergeur** n'est plus à compléter : le site étant sur GitHub Pages, les trois
lignes ont été remplies avec les coordonnées publiques de GitHub, Inc.

> Le site fonctionne et est indexable en l'état ; ce point bloque le fait d'en faire
> la promotion, pas son existence.

---

## Réglé depuis la dernière version

### 2. Nom de domaine — *réglé, à revoir si le bar en achète un*
Le site déclarait partout `lebardesarchers.fr`, qui n'existe pas : canonical, sitemap
et Open Graph pointaient dans le vide. Ils pointent maintenant vers l'adresse à laquelle
le site répond réellement, <https://mxcrts.github.io/BarArcher/>. Le référencement
fonctionne donc dès maintenant.
Si le bar prend un vrai domaine, c'est une commande à passer (`README.md`).

### 3. Horaires — *heure de fermeture confirmée*
| | |
|---|---|
| Lundi, mardi | fermé |
| Mercredi, jeudi | 14h – 21h |
| Vendredi, samedi | 16h – minuit |
| Dimanche | 9h – 14h |

**Confirmé : vendredi et samedi, c'est minuit pile.** Le badge bascule donc sur « Fermé »
à 00h00 et le JSON-LD annonce `23:59` (convention Google pour les fermetures tardives).
`data/horaires.json` est juste, rien à changer.
Reste à valider le reste du tableau, et surtout : **ces horaires sont annoncés comme
« horaires d'été »** — il faudra dire jusqu'à quand ils valent (point 11 du message).

### 4. Coordonnées GPS — *fait et vérifié*
`43.2578 / 1.2010` remplace la position approximative du brief dans le JSON-LD. Contrôle
indépendant : le relevé OpenStreetMap de la place de la Halle donne `43.25770 / 1.20132`,
soit ~20 m d'écart. L'épingle tombe au bon endroit.

### 5. Le plan dessiné à la main — *géométrie vérifiée*
Elle ne l'était pas, elle l'est : positions relatives contrôlées contre OpenStreetMap
(le bar à l'ouest de la place, la halle au centre, la cathédrale ~170 m à l'est, l'Arize
au sud et à l'ouest). Le dessin est juste, détail dans `DECISIONS.md`.
**Une seule question reste :** souhaitez-vous des noms de rues sur le plan ? Le seul
vérifié en plus de « place de la Halle » est la **place Monseigneur de Lastic**, devant
la cathédrale. Il n'a pas été ajouté : le dessin est volontairement nu.

### 9. Les concerts — *les dates s'affichent, et s'effacent seules*
Deux dates de votre affiche du mois sont maintenant sur le site : **vendredi 21 août
(Beer Pong Night)** et **samedi 22 août (Café Color, soul / funk)**.

Aucun risque de date périmée : chaque ligne porte sa date de fin, disparaît d'elle-même
le lendemain, et le bloc entier s'efface quand il n'en reste plus aucune. Sans
JavaScript, il ne s'affiche pas du tout. **Il n'y a donc rien à surveiller.**
Ajouter une date = copier une ligne (`README.md`).

Les deux affiches (`affiche-du-mois.png`, `affiche-evenement.png`) restent **non
publiées** : elles pèsent ~700 Ko chacune, cinq fois le poids de la page entière. Il
faut les convertir en WebP avant de les afficher — procédure dans `README.md`.

### 11. Le crédit du site — *fait*
Pied de page et mentions légales : « Maxime Cortes », lien vers le portfolio.

---

## À confirmer ensuite

### 6. Un téléphone ?
Le site n'affiche aucun numéro : il n'y en a pas de public, et il n'en figure sur aucune
des deux affiches. Instagram est présenté comme le canal de contact. Si un numéro existe,
il mérite d'être ajouté — c'est ce que les gens cherchent en premier après les horaires.

### 7. La fourchette de prix
Le champ `priceRange` du JSON-LD est volontairement absent : je n'invente pas de prix.
Une indication du type « moins de 10 € » ou « 10–20 € » permettrait de le renseigner,
et Google l'affiche dans les résultats.

### 8. Les prix de la carte — le manque le plus visible
**C'est le point qui rapporterait le plus, et de loin.** 86 % des gens consultent la
carte d'un bar avant de venir ; la nôtre annonce six catégories sans un seul chiffre.
Six prix indicatifs suffisent (demi pression, pinte, verre de vin, apéritif, café, soft).
Chaque ligne a déjà son emplacement vide dans `index.html` : le remplir prend dix
minutes, la mise en page suit toute seule (procédure dans `README.md`).

En attendant, le site affiche « les prix sont sur l'ardoise, au bar » — c'est vrai,
mais ça fait rebrousser chemin à une partie des visiteurs.

Deux questions au passage : y a-t-il des **bières locales** à mettre en avant ?
Et **« restauration sur place »**, relevé sur l'affiche du mois, est désormais annoncé
en bas de la carte — mais en trois mots, faute de savoir ce que ça recouvre. Dire s'il
s'agit de planches, de tapas ou de plats permettrait d'en faire un véritable argument.

### 10. Les avis Google
Quatre avis sont cités avec prénom et note. Ils sont publics, mais un mot au bar (et
idéalement aux auteurs) ne coûte rien. La note globale affichée (4,7 sur 7 avis) devra
être mise à jour quand elle bougera — elle est écrite à deux endroits d'`index.html`,
dans le bandeau et dans le JSON-LD.

### 12. Les photos
Deux photos seulement, prises au téléphone. Elles font le travail, mais la galerie
gagnerait beaucoup à trois ou quatre images de plus, prises en fin de journée sur la
terrasse : le lieu est photogénique et il est sous-vendu. Utiles en particulier :
la salle en service, la terrasse occupée, un plan large de la place.

---

## Points d'attention technique

**Aucun outil de mesure d'audience n'est installé** — c'est ce qui permet au site de
n'avoir aucun cookie et donc aucun bandeau de consentement. Si vous voulez un jour
savoir combien de personnes consultent le site, dites-le : il existe des solutions
sans cookie et conformes RGPD, mais c'est un choix à faire en connaissance de cause.

**Le JavaScript dépasse de 2 % le plafond fixé** (10,2 Ko au lieu de 10), à cause des
dates auto-expirantes. C'est assumé et documenté dans `DECISIONS.md` ; si le plafond doit
être tenu à la lettre, il suffit de retirer le bloc « Prochaines dates » — on retombe à
9,5 Ko et le site revient à son état précédent, sans dates.
