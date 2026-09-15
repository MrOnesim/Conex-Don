# Audit visuel & direction artistique — Conex & Don

> Audit complet des 15 pages + composants globaux du site officiel
> (Next.js 16 App Router, Tailwind CSS v4, lecteur YouTube intégré, PostgreSQL/Drizzle).
> Branche : `arena/01a0a5c9-conex-don` — 15/09/2026.

---

## 1. Ce que le site a déjà de fort (à préserver)

- **Identité éditoriale brute et cohérente** : Anton (display condensé capitales), Instrument
  Serif italique pour le « & » et les citations, Inter pour le texte. Palette terre :
  `ink #080808`, `bone #F5F2EA`, `gold #D6A83A`, `clay #9E382C`, `earth`, `forest`.
- **Textures signature** : grain photographique, trame `weave`, `dotgrid`, images **duotone**
  qui retrouvent leurs couleurs au survol — excellente idée, désormais généralisée.
- **Mouvement maîtrisé** : reveals (`rise`, `wipe`, `reveal-mask`), marquee, Ken Burns,
  curseur éditorial `data-cursor`, transitions de page via `template.tsx`.
- **Lecteur audio persistant** (dock + overlay LISTEN) : vraie fonctionnalité différenciante.
- **Sérieux technique** : SEO/structured data, OG images générées, RSS, sitemap, RGPD/cookies,
  accessibilité (skip-link, aria, `prefers-reduced-motion`).

Le site n'avait donc pas besoin d'une refonte, mais d'une **passe de finition** :
corriger les accidents CSS, régler l'échelle typographique, uniformiser les détails.

---

## 2. Bugs visuels détectés puis corrigés

| # | Problème | Fichier | Correction |
|---|----------|---------|------------|
| 1 | Octet corrompu (U+FFFD) dans `box-shadow` → ombre de survol invalide | `globals.css` | `rgba(0,0,0,0.2)` restauré |
| 2 | `.link-underline` : aucun état `:hover` → soulignement animé mort (header, contact) | `globals.css` | règle `:hover/:focus-visible` ajoutée |
| 3 | `.glass` : `border: 1px rgba(...)` sans style → bordure ignorée | `globals.css` | `border: 1px solid rgba(...)` |
| 4 | `.glass-border::after` : `calc(inherit + 2px)` invalide | `globals.css` | `border-radius: inherit` |
| 5 | **Typo responsive inversée** : le H1 du Hero et le titre ALOBA rétrécissaient entre 640 et 1024 px (`sm:` plus petit que la base) | `Hero.tsx`, `page.tsx` | échelles `clamp()` monotones mobile → desktop |
| 6 | **Flash de thème** (FOUC) : classe `dark` codée en dur, thème clair appliqué après hydratation | `layout.tsx` | script inline pré-peinture (localStorage + `prefers-color-scheme`) |
| 7 | Thème clair : sélection de texte illisible (or clair + texte clair), or peu contrasté | `globals.css` | sélection toujours `#080808` sur or ; or clair foncé à `#8A6A12` (≥ 4.5:1) ; duotone en `multiply` pour fondre les images dans le papier |
| 8 | Skeletons hors charte : coins arrondis (`rounded*`) + `animate-pulse` générique, et `<Suspense>` inutile autour du fallback | 10 fichiers `loading.tsx` | composant partagé `Skeleton` (angles vifs + balayage lumineux `.skeleton`), Suspense supprimés |
| 9 | Numérotation éditoriale en double sur l'accueil (deux « 06 », deux « 07 ») | `sections.tsx`, pages | indices paramétrables ; accueil = 01→12 sans trou |
| 10 | Chips de catégories **décoratives** sur `/videos` (alors que `/musique` filtre vraiment) | `VideoWall.tsx`, `videos/page.tsx` | filtres interactifs + compteur, même design que la discographie |
| 11 | `group-hover:` orphelin sur le filet du Hero (aucun parent `group`) | `Hero.tsx` | remplacé par le filet signature `.hairline-gold` (dégradé or→argile) |
| 12 | Réfs React mises à jour pendant le render (erreur lint `react-hooks/refs`) | `player.tsx` | synchronisation en `useEffect` |
| 13 | Runtime Edge déprécié sur `/api/og` (avertissement Next 16) | `api/og/route.tsx` | `runtime = "nodejs"` |
| 14 | Captures PWA du manifest affichant « CONEX `&amp;` DON » (double échappement historique) | `public/screenshots/*` | nouveaux visuels 1376×768 conformes à la charte + `manifest.json` à jour |
| 15 | Scripts codemod one-shot à la racine (`add-focus.js`, `fixcss.js`…) en **erreur de parsing ESLint** | `eslint.config.mjs` | ignorés (à supprimer si vous confirmez qu'ils sont obsolètes) |
| 16 | Utilities CSS mortes et trompeuses (`text-ink-on-bone`, …), 3 blocs `prefers-reduced-motion` dupliqués | `globals.css` | supprimés / fusionnés |

Vérifications : `npm run typecheck` ✓ · `npm run lint` 0 erreur ✓ · `npm test` 20/20 ✓ ·
`npm run build` ✓ (16 routes).

---

## 3. La passe « rendu visuel » appliquée

1. **Signature lumineuse des chargements** — chaque skeleton reprend la grille éditoriale
   réelle (kicker, titre géant, grille 3 colonnes à hairlines) avec un balayage or discret,
   au lieu de rectangles gris arrondis. Le site « reste dans la marque » même en attendant.
2. **Révélation couleur généralisée** — le duotone qui se colore au survol (déjà présent sur
   la discographie et le mur vidéo) est étendu aux portraits du duo, à la une presse,
   aux archives live, aux vignettes Héritage et à la pochette du dock lecteur.
   C'est devenu le geste interactif signature du site.
3. **Filet or→argile** — dégradé signature posé sous le Hero (`hairline-gold`), réutilisable
   pour les barres de progression et séparateurs forts.
4. **Dock lecteur** : pochette qui se colore au survol, bordure or, halo lumineux sur la
   barre de progression colorée par projet (`track.accent`).
5. **Focus visibles globaux** (`:focus-visible` or, offset 3 px) — cohérents avec la charte,
   plus seulement en `reduced-motion`.
6. **Numérotation éditoriale continue** sur l'accueil (01 Histoire → 12 Booking) :
   la page se lit comme un sommaire de magazine.
7. **Thème clair « papier »** crédible : images duotone en `multiply`, grain allégé,
   or assombri pour le contraste AA.

---

## 4. Analyse page par page

| Page | État | Observations & suite possible |
|------|------|-------------------------------|
| `/` Accueil | ★★★★☆ | Hero désormais monotone 2.75→8.5 rem ; sommaire 01→12 complet. Idée : ancrer la barre d'années du Hero en navigation cliquable vers `/histoire#2022…`. |
| `/histoire` | ★★★★☆ | Timeline sticky année/image très réussie. Idée : progressBar verticale dorée synchronisée au scroll. |
| `/musique` | ★★★★☆ | Filtres + grille hairline efficaces. Idée : tri par année décroissante déjà OK ; ajouter un filtre « décennie » inutile — non. |
| `/musique/[slug]` | ★★★★☆ | Fiche complète (tracklist, crédits, liens). Idée : surligner la piste en cours de lecture dans le dock (état partagé). |
| `/videos` | ★★★★★ | Filtres interactifs + masonry + modale lecteur : cohérent avec `/musique`. |
| `/live` | ★★★★☆ | Hero « prochainement » + archives. Idée : compte à rebours avant le rassemblement ALOBA 2026. |
| `/aloba` | ★★★★☆ | Mur communautaire + formulaire. Idée : masonry comme VideoWall pour les messages avec photos. |
| `/epk` | ★★★★☆ | Dense mais clair ; export PDF présent. Idée : sommaire sticky latéral sur desktop. |
| `/press` & `/press/[slug]` | ★★★★☆ | Une éditoriale + liste hairline ; color-reveal ajouté. |
| `/booking` | ★★★★☆ | Formulaire + aside contacts. Idée : récapitulatif sticky de la demande en cours de saisie. |
| `/contact`, `/legal`, `/search` | ★★★★☆ | Sobres et cohérents ; boutons cookies désormais à angles vifs. |
| 404 / error | ★★★★☆ | « HÉ ? » parfait dans le ton ; skeleton/error alignés sur la charte. |
| Overlay LISTEN | ★★★★★ | Ken Burns + visualizer `mix-blend-difference` : le moment fort du site. |

---

## 5. Recommandations à plus long terme (non bloquantes)

1. **Self-host des polices** (`next/font`) pour supprimer le warning ESLint et le round-trip
   Google Fonts — nécessite un accès réseau au build (non disponible dans ce sandbox).
2. **Supprimer les scripts codemod** racine (`add-focus.js`, `fixcss.js`, …) une fois confirmés
   obsolètes : ils polluent la racine et cassent le parsing ESLint.
3. **Photos réelles retravaillées** : fournir des masters HDR pour un duotone plus profond
   (le grain actuel compense des JPEG parfois plats).
4. **Lighthouse en CI** : budget perf (LCP Hero) avec les images `priority` déjà en place.
5. **Mode clair : variante « papier journal »** (fond `#F5F2EA`, encre `#12100F`, filets or)
   déjà atteignable via les variables — à affiner avec de vraies captures écran.

---

## 7. Passe « extraordinaire » (v2) — effets implémentés

Sept effets supplémentaires, tous coupés si `prefers-reduced-motion`, tous sans dépendance :

1. **Cartes empilées épinglées — Héritage Vivant** (`sections.tsx`) : les 4 séquences de la
   live expérience 2026 deviennent des cartes opaques `position: sticky` décalées
   (top 104 px + 26 px × n) qui se fichent au sommet et s'empilent pendant le scroll.
   Barre d'accent cyclée or / argile / forêt / terre, ombre portée vers le haut pour
   la profondeur. Pur CSS, aucun JS.
2. **Titre-photographie** (`type-photo`) : le mot **ALOBA** de l'accueil contient la photo
   de la communauté, recadrée en `background-clip: text` avec un panoramique lent de 26 s
   (garde `@supports` : repli en couleur pleine si non supporté).
3. **Filet de progression de lecture** (`ScrollProgress`) : 2 px or → argile fixé sous le bord
   haut, `scaleX` uniquement (zéro reflow), z-[70] au-dessus du header.
4. **Compteurs animés** (`CountUp`) : les stats (100 K+, 68,6 K, 6,95 M, 21 787) montent à
   l'entrée dans le viewport, format français préservé (espaces, virgule, suffixe).
5. **Inclinaison vélocité des marquees** (`VelocitySkew`) : les bandes défilantes (accueil,
   footer, musique, aloba) se tordent de ±2° pendant le scroll puis reviennent à plat —
   effet « tissu entraîné ». Boucle rAF auto-stopée au repos.
6. **Mur ALOBA en cartes postales** (`AlobaSection` + `.postcard`) : messages légèrement
   inclinés (−1° → +1,2°), morceau de ruban adhésif en haut, redressement + lévitation au
   survol avec halo or.
7. **Respiration Ken Burns du Hero** : la photographie de fond drift très lentement
   (`.kenburns`), en plus de la parallaxe existante au scroll.
8. **Titres révélés mot à mot partout** : `SectionHead` et `PageHeader` passent par
   `RevealWords` (masque par mot, stagger 60-70 ms) — les 15 pages partagent désormais la
   même entrée en matière éditoriale.

### Et aussi, côté confort de preview
- `next.config.ts` : `allowedDevOrigins: ["**.e2b.app"]` — le HMR du dev server n'est plus
  bloqué derrière le proxy de l'aperçu live Arena.

## 8. Idées restantes (si vous voulez pousser encore plus loin)

- **Timeline horizontale épinglée** sur `/histoire` (scroll vertical → translation
  horizontale des années 2022→2026), via Lenis déjà présent dans les dépendances.
- **Transition de route « rideau or »** : wipe 400 ms entre deux pages (App Router template).
- **Disque vinyle** dans l'overlay LISTEN : rainures coniques + rotation quand `playing`.
- **Waveform réelle** : analyser l'audio via WebAudio n'est pas possible avec l'iframe
  YouTube ; alternative = formes d'onde pré-calculées par titre (JSON) dessinées en SVG.
- **Curseur magnétique** sur les CTA du Hero (translation ±6 px suivant la souris).
- **Mode « papier journal »** du thème clair : fond bone, encre ink, filets or (variables
  déjà prêtes).


```bash
npm install
# DATABASE_URL requis (fallback seed automatique sinon)
npm run dev      # http://localhost:3000
npm run lint && npm run typecheck && npm test && npm run build
```
