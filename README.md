# CineVR

CineVR est une experience de realite virtuelle web qui represente un cinema interactif. Le projet est concu pour un projet d'ecole : il montre une visite complete, claire et scriptee, avec une rue, deux gardiens a l'entree, un accueil organise, un choix de film, un ticket dynamique, un couloir avec verification de salle et une salle de cinema immersive.

## Objectif scolaire

L'objectif est de presenter une experience WebXR propre et comprehensible, proche dans l'esprit d'un rendu Delightex ou CoSpaces, mais realisee uniquement avec HTML, CSS, JavaScript, A-Frame et WebXR. Le projet reste statique et publiable sur GitHub Pages.

## Technologies utilisees

- HTML
- CSS
- JavaScript
- A-Frame
- WebXR
- Git
- GitHub Pages

Aucun framework, backend, service payant, moteur Unity ou base de donnees n'est utilise.

## Scenario complet

1. L'utilisateur arrive dans une rue devant le cinema CineVR.
2. Il voit une facade, une enseigne lumineuse, des affiches, des lampadaires et une porte.
3. Il clique sur la porte pour entrer.
4. Il arrive dans un accueil futuriste spacieux.
5. Un receptionniste stylise l'accueille derriere un comptoir.
6. Deux films sont disponibles : Big Buck Bunny et Sintel.
7. L'utilisateur clique sur une affiche pour voir le descriptif et une bande-annonce.
8. Il choisit le film voulu.
9. Un ticket est genere avec le bon film et la bonne salle.
10. Il va vers le couloir.
11. Le couloir affiche deux portes : Salle 1 et Salle 2.
12. Si la mauvaise salle est choisie, un message d'erreur apparait.
13. Si la bonne salle est choisie, la salle de cinema s'ouvre.
14. Il entre dans une vraie salle avec gradins, fauteuils, allee centrale, public stylise, projecteur et faisceau.
15. Il clique sur "S'asseoir" pour etre place progressivement dans un fauteuil.
16. Le bouton "Lancer la seance" devient disponible quand l'utilisateur est installe.
17. La video avec son original, ou une animation de remplacement, apparait sur l'ecran.
18. Pendant la projection, les panneaux et boutons de controle sont caches pour garder l'effet cinema.

## Fonctionnalites principales

- Experience VR en quatre scenes : rue, accueil, couloir, salle de cinema.
- Level design plus lisible avec zones separees, grands panneaux, fleches au sol et points de teleportation.
- Deplacement clavier avec `WASD`, `ZQSD` et fleches directionnelles.
- Deplacement VR au joystick si le casque et le navigateur exposent les axes WebXR.
- Interactions compatibles souris, curseur central et controleurs VR si disponibles.
- Deux gardiens a l'entree avec bulles de dialogue, salut anime et voix de synthese si disponible.
- Deux films configurables.
- Affiches cliquables.
- Descriptions lisibles et bandes-annonces reelles en MP4.
- Ticket dynamique repositionne apres le choix du film.
- Verification de la salle.
- Fallbacks visuels si les images ou videos sont absentes.
- Receptionniste avec bulle proche du personnage, sous-titres, animation et voix via Web Speech API quand le navigateur l'autorise.
- Ambiances sonores generees en Web Audio, avec bouton activer/couper le son.
- Salle finale avec gradins, 24 sieges, public stylise, assise animee, projecteur, faisceau et son de lancement.
- Les controles de la salle disparaissent pendant la projection.
- Code structure dans `script.js` avec fonctions reutilisables.

## Structure des fichiers

```text
cinevr/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── images/
    │   ├── .gitkeep
    │   ├── film1-poster.png
    │   └── film2-poster.png
    ├── videos/
    │   ├── .gitkeep
    │   ├── film1-trailer.mp4
    │   ├── film1.mp4
    │   ├── film2-trailer.mp4
    │   └── film2.mp4
    ├── models/
    │   └── .gitkeep
    ├── textures/
    │   └── .gitkeep
    └── sounds/
        └── .gitkeep
```

## Configuration des films

Les films sont configures dans `script.js`, dans le tableau `movies`.

```js
const movies = [
  {
    id: 1,
    title: "Big Buck Bunny",
    room: 1,
    description: "...",
    posterPath: "assets/images/film1-poster.png",
    trailerPath: "assets/videos/film1-trailer.mp4",
    moviePath: "assets/videos/film1.mp4"
  },
  {
    id: 2,
    title: "Sintel",
    room: 2,
    description: "...",
    posterPath: "assets/images/film2-poster.png",
    trailerPath: "assets/videos/film2-trailer.mp4",
    moviePath: "assets/videos/film2.mp4"
  }
];
```

## Assets inclus dans cette version

Les affiches et videos ont ete ajoutees dans les emplacements attendus par le projet :

- `assets/images/film1-poster.png`
- `assets/images/film2-poster.png`
- `assets/videos/film1-trailer.mp4`
- `assets/videos/film2-trailer.mp4`
- `assets/videos/film1.mp4`
- `assets/videos/film2.mp4`

Les videos ont ete encodees en MP4 H.264/AAC avec `+faststart` pour faciliter la lecture dans le navigateur et garder des fichiers legers pour GitHub Pages.

## Fonctions importantes

Les fonctions principales sont dans `script.js` :

- `updateKeyboardMovement(deltaTime)` : deplacement PC dans la direction regardee.
- `updateVRJoystickMovement(deltaTime)` : deplacement joystick VR si les axes sont disponibles.
- `movementSettings` et `joystickSettings` : reglages de vitesse, deadzone et inversion, desactives par defaut.
- `teleportTargets` : carte centralisee des destinations de teleportation.
- `createTeleportPoint(targetKey)`, `teleportTo(targetKey)`, `faceRigToward()` : teleportation de secours avec orientation vers l'objet logique.
- `createDialogueBubble()`, `showDialogueNearSpeaker()`, `showMessageNearPlayer()` : dialogues lisibles orientes vers le joueur.
- `createGuard()`, `animateGuardGreeting()`, `speakGuard()` : deux gardiens devant le cinema.
- `createReceptionist()`, `speakReceptionist()`, `animateReceptionistTalking()` : receptionniste anime avec voix et sous-titres.
- `prepareMovieVideo()`, `playMovieWithSound()`, `stopMovieVideo()`, `setMovieVolume()` : film final avec audio non muet apres clic utilisateur.
- `seatUser()`, `animateCameraToSeat()`, `showSeatTransitionMessage()` : installation assise.
- `createProjector()`, `startProjectorBeam()`, `stopProjectorBeam()` : projecteur et faisceau.
- `startMovieSession()`, `stopMovieSession()`, `hideCinemaControls()` : lancement propre de la seance.

## Comment modifier les titres

Ouvrir `script.js`, trouver `title`, puis remplacer le texte.

## Comment modifier les descriptions

Ouvrir `script.js`, trouver `description`, puis remplacer le texte. Il faut garder les guillemets autour de la phrase.

## Comment ajouter les affiches

Les affiches sont deja presentes. Pour les remplacer, garder exactement ces noms :

- `assets/images/film1-poster.png`
- `assets/images/film2-poster.png`

Si ces fichiers n'existent pas, CineVR utilise des affiches construites avec des formes A-Frame.

## Comment ajouter les bandes-annonces

Les bandes-annonces sont deja presentes. Pour les remplacer, garder exactement ces noms et utiliser le format MP4 :

- `assets/videos/film1-trailer.mp4`
- `assets/videos/film2-trailer.mp4`

Si les fichiers sont absents ou illisibles, une animation de remplacement apparait sur l'ecran de previsualisation.

## Comment ajouter les films complets

Les extraits de films sont deja presents. Pour les remplacer, garder exactement ces noms et utiliser le format MP4 :

- `assets/videos/film1.mp4`
- `assets/videos/film2.mp4`

Si les fichiers sont absents ou illisibles, une animation de remplacement apparait sur l'ecran de la salle.

## Lancer en local sur le port 5500

Depuis le dossier `cinevr`, lancer :

```bash
python -m http.server 5500
```

Puis ouvrir :

```text
http://localhost:5500
```

Si `python` ne fonctionne pas, essayer :

```bash
python3 -m http.server 5500
```

## Tester sur ordinateur

Sur ordinateur : regardez autour de vous avec la souris et cliquez sur les elements. Le curseur central permet aussi de viser les portes, affiches et boutons.

Controles utiles :

- `W` ou `Z` : avancer dans la direction regardee.
- `S` : reculer.
- `A` ou `Q` : aller a gauche.
- `D` : aller a droite.
- Fleche haut, bas, gauche, droite : memes directions.
- Points cyan au sol : teleportation rapide vers les zones importantes.
- Les points cyan orientent aussi la vue vers le comptoir, les posters, les portes ou l'ecran selon la destination.
- Bouton "Activer le son" : demarre l'audio Web apres une interaction utilisateur, puis devient "Couper le son".
- Dans la salle : "S'asseoir" deplace la camera vers une place, puis "Lancer la seance" devient disponible.

Parcours a tester :

- Rue vers accueil.
- Affiche Big Buck Bunny.
- Generation du ticket Salle 1.
- Couloir et mauvaise salle.
- Bonne salle et lancement de seance.
- Verifier que les boutons de controle disparaissent pendant le film.
- Meme test avec Sintel et Salle 2.

## Tester avec un casque VR

1. Publier le projet sur GitHub Pages.
2. Copier le lien HTTPS genere par GitHub Pages, par exemple `https://MON-NOM-UTILISATEUR.github.io/cinevr/`.
3. Allumer le casque VR.
4. Connecter le casque au Wi-Fi.
5. Ouvrir le navigateur du casque, par exemple Meta Quest Browser.
6. Taper ou coller le lien GitHub Pages.
7. Attendre le chargement de la scene A-Frame.
8. Cliquer sur le bouton VR affiche par A-Frame.
9. Utiliser la tete pour regarder autour.
10. Utiliser le curseur ou les controleurs pour interagir.
11. Tester le joystick si le casque et le navigateur le permettent.
12. Utiliser les points cyan de teleportation si le joystick n'est pas disponible.
13. Tester le parcours complet : Rue -> Accueil -> Choix du film -> Ticket -> Couloir -> Salle -> Film.

Le projet VR ne s'installe pas comme une application : il s'ouvre comme un site web dans le navigateur du casque.

Le joystick VR depend du navigateur, du casque et des controleurs. Si les axes WebXR ne sont pas exposes, CineVR reste utilisable avec la teleportation et les clics.

## Si le bouton VR ne s'affiche pas

Verifier :

- Le site doit etre ouvert en HTTPS.
- Le projet doit etre publie sur GitHub Pages.
- Il ne faut pas ouvrir le projet en `file://`.
- Le navigateur du casque doit supporter WebXR.
- A-Frame doit etre charge correctement.
- Le fichier `index.html` doit contenir une balise `<a-scene>`.
- Recharger la page.
- Tester d'abord sur ordinateur avec `http://localhost:5500`.

## Publier sur GitHub Pages

1. Aller sur GitHub.
2. Creer un depot nomme `cinevr`.
3. Ne pas cocher "Add a README file" si ce README existe deja.
4. Copier l'URL : `https://github.com/MON-NOM-UTILISATEUR/cinevr.git`.
5. Executer les commandes ci-dessous.
6. Aller dans `Settings`.
7. Aller dans `Pages`.
8. Choisir `Deploy from a branch`.
9. Choisir la branche `main`.
10. Choisir le dossier `/` ou `/root` selon l'interface.
11. Cliquer sur `Save`.
12. Attendre le deploiement.
13. Ouvrir `https://MON-NOM-UTILISATEUR.github.io/cinevr/`.

Commandes Git :

```bash
git init
git add .
git commit -m "Initial commit - CineVR"
git branch -M main
git remote add origin https://github.com/MON-NOM-UTILISATEUR/cinevr.git
git push -u origin main
```

Remplacer `MON-NOM-UTILISATEUR` par le nom du compte GitHub avant d'executer `git remote add origin`.

Ne pas dire que le projet est heberge tant que ces etapes n'ont pas ete faites.

## Problemes possibles et solutions

- Page blanche : verifier la connexion Internet, car A-Frame est charge depuis `https://aframe.io`.
- Videos absentes : ajouter les fichiers MP4 dans `assets/videos`.
- Affiches absentes : ajouter les PNG dans `assets/images`.
- Clics qui ne marchent pas : ouvrir via un serveur local, pas en double-cliquant sur le fichier HTML.
- Mauvaise salle bloquee : c'est normal, le ticket choisit la salle correcte.
- Bouton VR absent : tester en HTTPS sur GitHub Pages avec un navigateur WebXR.
- Son absent : cliquer d'abord sur "Activer le son", puis relancer la bande-annonce ou la seance.
- Film final muet : verifier que le navigateur n'a pas coupe l'onglet, que le bouton son n'est pas sur "Couper le son", et que le MP4 contient bien une piste audio.
- Joystick VR absent : utiliser les points cyan de teleportation ; certains navigateurs WebXR n'exposent pas les axes des controleurs.

## Limites du projet

- Les objets sont crees surtout avec des primitives A-Frame pour garantir un fonctionnement sans telechargement externe.
- Les videos incluses sont des extraits compresses pour rester adaptees a un site statique et a GitHub Pages.
- Les sons sont generes par Web Audio plutot que par des fichiers audio externes.
- La voix du receptionniste et des gardiens depend de la Web Speech API du navigateur.
- Le deplacement joystick VR depend du casque, du navigateur et des controleurs.
- Le test dans un vrai casque VR reste a faire par l'utilisateur.
- A-Frame est charge par CDN, donc une connexion Internet est utile.

## Ameliorations possibles

- Remplacer les extraits video par des versions plus longues si le poids reste raisonnable.
- Remplacer certains objets primitifs par des modeles `.glb` ou `.gltf`.
- Ajouter de vrais fichiers audio dans `assets/sounds/` si une ambiance plus cinema est souhaitee.
- Ajouter des textures de sol, mur et tissu pour remplacer certaines couleurs plates.
- Ajouter plus de variations au public de la salle.
- Optimiser les modeles 3D avec Blender ou gltfpack.

## Presentation orale courte

"CineVR est une experience de realite virtuelle web qui permet a un utilisateur de visiter un cinema futuriste. Le projet utilise HTML, CSS, JavaScript, A-Frame et WebXR. L'utilisateur commence dans la rue, entre dans le cinema, consulte deux films disponibles, regarde leurs descriptions et bandes-annonces, choisit un film, recoit un ticket, suit les fleches vers la bonne salle, s'assoit dans une salle avec gradins et lance la seance avec projecteur et faisceau lumineux. Le projet est concu comme une visite interactive scriptee, compatible avec ordinateur et casque VR."

## Credits et licences

Les films utilises dans cette demonstration sont des courts-metrages Blender Open Movie. Ils doivent etre utilises avec attribution selon leur licence Creative Commons.

- Big Buck Bunny : Blender Foundation / Blender Open Movie.
- Sintel : Blender Foundation / Blender Open Movie.

Les affiches et videos placees dans `assets/` viennent des fichiers fournis par l'utilisateur, puis les videos ont ete encodees en MP4 web. Avant une presentation publique ou une publication durable, verifier que les affiches utilisees correspondent bien aux licences et attributions des Blender Open Movies.

Aucun modele 3D externe n'a ete integre dans cette version. Les objets visibles sont construits avec des primitives A-Frame.

Ne pas utiliser :

- films commerciaux ;
- bandes-annonces YouTube telechargees illegalement ;
- affiches protegees ;
- marques reelles sans autorisation.

Pour chaque asset ajoute plus tard, noter :

- nom du fichier ;
- source ;
- auteur ;
- licence ;
- lien ;
- usage dans le projet.

## Checklist de test

- `index.html` charge `style.css`.
- `index.html` charge `script.js`.
- A-Frame se charge.
- La rue apparait au demarrage.
- La rue est decoree et reconnaissable.
- Les deux gardiens sont visibles de chaque cote de l'entree.
- Les gardiens affichent des bulles et saluent l'utilisateur.
- La porte fonctionne.
- Les points de teleportation fonctionnent.
- Le deplacement clavier `WASD` / `ZQSD` fonctionne.
- `W` ou `Z` avance vers ce que l'utilisateur regarde.
- `S` recule, `A` ou `Q` va a gauche, `D` va a droite.
- Les fleches directionnelles suivent les memes directions.
- Les teleporteurs envoient vers des destinations centralisees dans `teleportTargets`.
- Apres teleportation, la vue est orientee vers l'objet attendu.
- Le joystick VR est teste si un casque compatible est disponible.
- L'accueil futuriste apparait.
- Le receptionniste apparait.
- Le dialogue du receptionniste s'affiche dans une bulle proche du personnage.
- La voix du receptionniste se lance apres interaction si le navigateur l'autorise.
- Le bouton audio active et coupe le son.
- Les deux films apparaissent.
- Le clic sur une affiche affiche les details.
- La bande-annonce ou son fallback apparait.
- Le bouton "Choisir ce film" fonctionne.
- Le ticket correspond au film choisi.
- Le bouton "Aller vers les salles" fonctionne.
- Le couloir apparait.
- Les fleches pointent vers la bonne salle.
- La mauvaise salle affiche une erreur.
- La bonne salle ouvre la salle.
- La salle contient 24 sieges organises en gradins.
- La salle contient du public stylise.
- Le bouton "S'asseoir" deplace doucement la camera vers une place.
- Le bouton "Lancer la seance" apparait apres l'installation.
- La video avec son ou le fallback apparait.
- Le volume du film est audible si le MP4 contient une piste audio et si le son est active.
- Le projecteur et son faisceau apparaissent.
- Les panneaux et boutons de controle disparaissent pendant le film.
- Le bouton recommencer fonctionne.
- Les chemins sont relatifs.
- Le projet fonctionne sans vraies videos.
- Le projet fonctionne sans vraies affiches.
- Le test local utilise `http://localhost:5500`.

## Tests effectues

- Controle syntaxique `node --check script.js` : OK.
- Test ordinateur local sur le port 5500 : effectue avec `http://127.0.0.1:5500`.
- Test Chrome headless via DevTools Protocol : OK.
- Console navigateur sur session fraiche : aucune erreur JavaScript et aucune erreur de ressource bloquante.
- Favicon local `favicon.ico` : HTTP 200.
- Chargement de `index.html`, `style.css` et `script.js` : OK.
- Chargement HTTP des affiches et videos dans `assets/` : OK.
- Scene de rue visible au demarrage : OK.
- Deux gardiens visibles a l'entree : OK.
- Bulles et salut des gardiens : OK.
- Affiches reelles visibles dans la rue et dans l'accueil : OK.
- Clic sur la porte vers l'accueil : OK.
- Parametres de deplacement non inverses : `invertForwardBackward = false`, `invertLeftRight = false`.
- Navigation clavier corrigee et mesuree : `W`/`Z` avance vers `-Z`, `S` recule vers `+Z`, `A`/`Q` va vers `-X`, `D` va vers `+X`.
- Fleches clavier corrigees et mesurees : haut avance, bas recule, gauche va a gauche, droite va a droite.
- Test camera tournee : apres rotation de regard vers la droite, `W` avance vers la nouvelle direction regardee.
- Joystick VR configure avec `deadzone = 0.15`, `speed = 2.0`, `invertX = false`, `invertY = false`.
- Deplacement du pointeur puis clic sur les affiches et boutons : OK.
- Points de teleportation visibles et discrets : OK.
- Teleporteurs accueil verifies : Comptoir, Poster Big Buck Bunny, Poster Sintel, Ecran, Vers salles.
- Teleporteurs couloir verifies : Debut couloir, Salle 1, Salle 2.
- Teleporteurs salle verifies : Entree salle, Siege avec hauteur assise `1.2`.
- Orientation apres teleportation verifiee : comptoir face receptionniste, posters face affiches, portes face salles, siege face ecran.
- Clic sur l'affiche Big Buck Bunny : OK, bande-annonce reelle `film1-trailer.mp4` visible.
- Ticket Big Buck Bunny vers Salle 1 : OK.
- Bouton "Aller vers les salles" lisible apres generation du ticket : OK.
- Mauvaise salle pour Big Buck Bunny : message d'erreur OK.
- Bonne salle pour Big Buck Bunny : ouverture de la salle OK.
- Salle Big Buck Bunny : gradins, sieges, public et projecteur visibles.
- Film Big Buck Bunny reel `film1.mp4` visible dans la salle : OK.
- Pendant `film1.mp4` : controles caches, faisceau projecteur visible, pas de bouton Menu.
- Clic sur l'affiche Sintel : OK, bande-annonce reelle `film2-trailer.mp4` visible.
- Ticket Sintel vers Salle 2 : OK.
- Bonne salle pour Sintel : ouverture de la salle OK.
- Assise animee : OK, le bouton "Lancer la seance" apparait apres installation.
- Film Sintel reel `film2.mp4` visible dans la salle : OK.
- Son du film Sintel : `muted = false`, volume `0.85`, lecture active dans Chrome headless.
- Pendant `film2.mp4` : controles caches, faisceau projecteur visible, pas de bouton Menu.
- Re-selection d'une affiche : OK, l'ancienne video est arretee proprement.
- Reset apres film : video arretee et retour rue OK.
- Captures desktop/mobile : canvas non vide, scene visible.
- Test GitHub Pages : a faire apres publication.
- Test casque VR : a faire dans un navigateur WebXR compatible.

## Optimisation video avec ffmpeg

Exemple pour creer une bande-annonce legere :

```bash
ffmpeg -i film1.mp4 -ss 00:00:10 -t 00:00:25 -vf scale=1280:-2 -c:v libx264 -crf 28 -c:a aac assets/videos/film1-trailer.mp4
```

```bash
ffmpeg -i film2.mp4 -ss 00:00:20 -t 00:00:25 -vf scale=1280:-2 -c:v libx264 -crf 28 -c:a aac assets/videos/film2-trailer.mp4
```

Recommandations :

- Bandes-annonces : 10 a 30 secondes.
- Films finaux : extraits de 30 secondes a 2 minutes.
- Format : MP4.
- Resolution : 720p.
- Poids recommande : moins de 50 Mo par video.
- Eviter les fichiers de plus de 100 Mo.
- Ne pas utiliser Git LFS comme solution principale pour ce projet scolaire.

## Qualite visuelle et decoration

Chaque scene contient un blockout logique puis de la decoration :

- Rue : route, trottoir, facade, porte, affiches, lampadaires, bancs, potelets.
- Accueil : grand hall, comptoir, receptionniste, LED, colonnes, bornes de tickets, panneaux holographiques.
- Couloir : murs, plafond, portes, fleches au sol, lumières et rappel du ticket.
- Salle : ecran, cadre, murs sombres, allee centrale, gradins, public stylise, projecteur, faisceau et 24 sieges.

Les fonctions de creation sont separees dans `script.js` pour faciliter les remplacements par des modeles 3D.

## Fichiers media actuellement inclus

- `assets/images/film1-poster.png`
- `assets/images/film2-poster.png`
- `assets/videos/film1-trailer.mp4`
- `assets/videos/film2-trailer.mp4`
- `assets/videos/film1.mp4`
- `assets/videos/film2.mp4`

## Objets 3D gratuits recommandes

Objets utiles a chercher :

- fauteuil de cinema ;
- comptoir de reception ;
- porte moderne ;
- borne de ticket ;
- lampadaire ;
- panneau lumineux ;
- texture de beton ;
- texture de metal ;
- texture de moquette sombre ;
- enceintes murales ;
- spots lumineux.

## Plateformes utilisees ou recommandees

Aucun asset externe n'est telecharge dans cette version. Plateformes recommandees :

- Poly Haven : HDRI, textures, certains modeles, souvent CC0.
- Kenney : objets low-poly propres et legers.
- ambientCG : textures PBR gratuites.
- Sketchfab : seulement si le modele est gratuit, telechargeable et avec licence compatible.

Toujours verifier la licence avant d'integrer un asset.

## Remplacement des primitives par des modeles `.glb` ou `.gltf`

Dans `script.js`, les fonctions suivantes sont prevues pour etre remplacees progressivement :

- `createReceptionDesk()`
- `createReceptionist()`
- `createCinemaSeat()`
- `createDoor()`
- `createMoviePoster()`
- `createTicketMachine()`
- `createNeonSign()`
- `createDecorativeColumn()`
- `createFuturisticPanel()`

Methode conseillee :

1. Ajouter un fichier `.glb` dans `assets/models/`.
2. Garder les memes positions du `sceneLayouts`.
3. Remplacer ou completer la primitive par :

```html
<a-entity gltf-model="assets/models/nom-du-modele.glb"></a-entity>
```

4. Conserver une zone cliquable primitive pour les portes, affiches et boutons.
