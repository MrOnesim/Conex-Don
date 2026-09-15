export const site = {
  name: "CONEX & DON",
  concept: "L'HÉRITAGE EN MOUVEMENT",
  tagline: "Deux voix. Une histoire. Un héritage.",
  description:
    "Site officiel de Conex & Don, duo musical béninois originaire de Ouidah et d'Avédji. Afrobeat, amapiano, rap, humour et culture béninoise. Découverte, La Symphonie Béninoise, Mode Avion, Héritage Vivant, DESSIGUIMANZANBERA.",
  url: "https://conexetdon.com",
  locale: "fr_FR",
  contact: {
    bookingEmail: "booking.conexetdon@gmail.com",
    bookingPhone: "+229 01 96 19 98 70",
    management: "Équipe Conex & Don — Cotonou, Bénin",
  },
};

export const nav = [
  { href: "/", label: "HOME" },
  { href: "/histoire", label: "HISTOIRE" },
  { href: "/musique", label: "MUSIQUE" },
  { href: "/videos", label: "VIDÉOS" },
  { href: "/live", label: "LIVE" },
  { href: "/aloba", label: "ALOBA" },
  { href: "/epk", label: "EPK" },
  { href: "/booking", label: "BOOKING" },
];

export const socials = [
  { label: "YouTube", handle: "@ConexetDon", href: "https://www.youtube.com/@ConexetDon" },
  {
    label: "Spotify",
    handle: "Conex et Don",
    href: "https://open.spotify.com/artist/4vibJGQKsr8i8A5a1LizZ0",
  },
  {
    label: "Apple Music",
    handle: "Conex et Don",
    href: "https://music.apple.com/fr/artist/conex-et-don/1668784419",
  },
  {
    label: "Audiomack",
    handle: "conexetdonofficiel",
    href: "https://audiomack.com/conexetdonofficiel",
  },
  { label: "Instagram", handle: "@conexetdon", href: "https://instagram.com/conexetdon" },
  { label: "Facebook", handle: "conexetdon", href: "https://facebook.com/conexetdon" },
  { label: "TikTok", handle: "@conexdon", href: "https://tiktok.com/@conexdon" },
  { label: "X", handle: "@conexetdon", href: "https://x.com/conexetdon" },
];

export const stats = [
  { value: "100 K+", label: "Abonnés YouTube" },
  { value: "68,6 K", label: "Abonnés Audiomack" },
  { value: "6,95 M", label: "Lectures Audiomack cumulées" },
  { value: "21 787", label: "Auditeurs mensuels Spotify" },
];

export const awards = [
  {
    year: "2025",
    title: "Benin Showbiz Awards",
    detail: "Nommés — Meilleur Artiste Masculin",
  },
  {
    year: "2024",
    title: "FinAB",
    detail: "Distinction « Musique Influence »",
  },
];

export type DuoMember = {
  name: string;
  fullName: string;
  origin: string;
  role: string;
  image?: string;
  bio: string;
  style: string[];
  accent: string;
};

export const duo: Record<"conex" | "don", DuoMember> = {
  conex: {
    name: "CONEX",
    fullName: "Houngbedji Constant Exhaucé",
    origin: "Ouidah, Bénin",
    role: "La douceur mélodique",
    image: "/images/conex.jpeg",
    bio: `Conex, c'est la voix qui porte. Né à Ouidah, il apporte au duo ce qui manque au rap pur : la mélodie, le souffle, l'émotion qui reste après le morceau.

Il écrit des refrains qu'un public peut chanter sans connaître l'artiste. Sa douceur n'est jamais une faiblesse — c'est elle qui donne aux titres sociaux du duo leur dimension humaine.`,
    style: ["Mélodie", "Afrobeat", "Émotion", "Chant"],
    accent: "#6F4A32",
  },
  don: {
    name: "DON",
    fullName: "Acakpo Dieudonné",
    origin: "Avédji, Bénin",
    role: "Le flow direct",
    image: "/images/Don.jpeg",
    bio: `Don, c'est l'attaque. Originaire d'Avédji, il est celui qui a commencé : les premiers freestyles publiés sur TikTok en 2022, filmés dans le quotidien, viennent de lui.

Son flow est direct, virulent, drôle. Il observe la rue béninoise et la restitue sans la traduire — ni l'édulcorer.`,
    style: ["Flow", "Rap", "Humour", "Réalité"],
    accent: "#173F32",
  },
};

export type TimelineEntry = {
  year: string;
  title: string;
  kicker: string;
  body: string;
  image?: string;
  releaseSlug?: string;
  highlights: string[];
};

export const timeline: TimelineEntry[] = [
  {
    year: "2022",
    title: "TOUT A COMMENCÉ PAR DES FREESTYLES",
    kicker: "Naissance du duo",
    body: `Don commence à publier des freestyles sur TikTok, inspirés du quotidien et des réalités de ses compatriotes. Environ un mois plus tard, Conex le rejoint : le duo Conex & Don est né.

Pas de studio, pas de label, pas de plan. Un téléphone, une ville, deux amis d'enfance qui se connaissent depuis toujours.`,
    highlights: ["TikTok", "Freestyles", "Deux amis d'enfance"],
  },
  {
    year: "2023",
    title: "DÉCOUVERTE",
    kicker: "Premier EP — 13 avril 2023",
    body: `Cinq morceaux, dix-huit minutes : Dougbe, L'Alcool, Aventurier (feat. First King), Pardon chef, Trahison. Le premier projet officiel, distribué avec le Phoenix Label / ONErpm.

C'est aussi l'année où AYATO devient le morceau le plus identifié par le public.`,
    image: "/images/Découverte.jpg",
    releaseSlug: "decouverte",
    highlights: ["5 titres", "Phoenix Label / ONErpm", "Ayato"],
  },
  {
    year: "2024",
    title: "LA SYMPHONIE BÉNINOISE",
    kicker: "Premier album — février 2024",
    body: `Treize pistes avec le bonus. Un album construit autour de l'identité musicale béninoise et de la volonté de mettre en valeur différentes couleurs culturelles du pays.

Le duo cesse d'être une curiosité TikTok pour devenir un projet de scène nationale.`,
    image: "/images/SYMPHONIE-BÉNINOISE.webp",
    releaseSlug: "la-symphonie-beninoise",
    highlights: ["13 pistes", "Ayato", "Agbon", "Destination Dogbo"],
  },
  {
    year: "2024",
    title: "LE CONCERT — SYMPHONIE BÉNINOISE",
    kicker: "Live Experience",
    body: `Après l'album, le premier grand concert. L'album joué live, les titres de DÉCOUVERTE, et des invités : Vano Baby sur Côté, Tgang sur Agbon, Bobo Wê sur My Wife.

C'est là que naît la Live Experience Conex & Don.`,
    image: "/images/MAN-LON-ô.png",
    releaseSlug: "concert-symphonie-beninoise",
    highlights: ["Premier grand concert", "Vano Baby", "Tgang", "Bobo Wê"],
  },
  {
    year: "2024",
    title: "MODE AVION",
    kicker: "Deuxième album — 24 octobre 2024",
    body: `Sept titres plus urbains, plus secs : PERCER, TOR TOR (feat. Axel Merryl), PAUSE, VAMIDJO, COCA COLA, DI TOLOLO, WOTTO WOTTO.

Classé Afrobeat / Afrosounds par les plateformes, le projet parle de départ, de coupure et de percée.`,
    image: "/images/MODE-AVION.jpg",
    releaseSlug: "mode-avion",
    highlights: ["7 titres", "Tor Tor", "Wotto Wotto", "Axel Merryl"],
  },
  {
    year: "2025",
    title: "LA NOUVELLE GÉNÉRATION",
    kicker: "Sept singles",
    body: `AKA (6 mars), Minkanangbè (12 avril), Vivi (24 mai), Sessi (6 août), Dozo (25 octobre), Goslow avec OPA et Ghix (28 novembre), Guepard avec DJ Yann LeKiller et Axel Merryl (19 décembre).

Une année de rythme imposé : le duo publie, teste en live, ajuste, recommence.`,
    highlights: [
      "AKA",
      "Minkanangbè",
      "Vivi",
      "Sessi",
      "Dozo",
      "Goslow",
      "Guepard",
    ],
  },
  {
    year: "2026",
    title: "HÉRITAGE VIVANT",
    kicker: "Live expérience",
    body: `Quatre séquences : MEDLEY, DJO AGADO, DJIVÈDÉ, MI ZÉ GAN NOU WÉ / GOSPEL.

Un projet tourné vers la mémoire collective, la résilience, l'amour, la spiritualité, la vigilance et la gratitude. Le duo ne raconte plus seulement le quotidien : il transmet.`,
    image: "/images/HÉRITAGE-VIVANT.jpg",
    releaseSlug: "heritage-vivant-live",
    highlights: ["Medley", "Djo Agado", "Djivèdé", "Gospel"],
  },
  {
    year: "2026",
    title: "DESSIGUIMANZANBERA",
    kicker: "Tony X × Fanicko × Conex & Don — 7 mai 2026",
    body: `La dernière sortie identifiée du duo : 3 min 09 avec Tony X et Fanicko. Le titre a connu de très bons classements au Bénin, avec une première place dans plusieurs relevés.

Et l'histoire continue.`,
    image: "/images/DESSIGUIMANZANBERA.png",
    releaseSlug: "dessiguimanzanbera",
    highlights: ["3:09", "Tony X", "Fanicko", "#1 au Bénin"],
  },
];

export const biography = {
  short: `Conex & Don, duo musical béninois formé de Houngbedji Constant Exhaucé (Conex, Ouidah) et Acakpo Dieudonné (Don, Avédji). Amis d'enfance, ils se lancent en 2022 avec des freestyles publiés sur TikTok, avant d'enchaîner l'EP DÉCOUVERTE (2023), l'album LA SYMPHONIE BÉNINOISE (2024), MODE AVION (2024) puis la live expérience HÉRITAGE VIVANT (2026).`,

  long: `Conex & Don, c'est l'histoire de deux amis d'enfance devenus l'un des duos les plus reconnaissables de la nouvelle scène musicale béninoise.

Houngbedji Constant Exhaucé, alias Conex, est originaire de Ouidah. Acakpo Dieudonné, alias Don, est originaire d'Avédji. Leur histoire commune précède leur notoriété numérique : ils se connaissent avant les caméras, avant les plateformes, avant les salles.

Le duo prend véritablement forme en 2022, lorsque Don commence à publier des freestyles sur TikTok, inspirés du quotidien et des réalités de ses compatriotes. Environ un mois plus tard, Conex le rejoint. La complémentarité est immédiate : Conex apporte la douceur mélodique, Don se distingue par des flows plus directs et virulents. Ensemble, ils utilisent l'humour, le langage populaire et l'observation du quotidien pour raconter des réalités béninoises.

En avril 2023 sort DÉCOUVERTE, un EP de cinq titres distribué avec le Phoenix Label / ONErpm. En février 2024, LA SYMPHONIE BÉNINOISE, premier album de treize pistes, affirme une ambition : mettre en valeur les différentes couleurs culturelles du Bénin. Le duo en tire son premier grand concert, CONCERT SYMPHONIE BÉNINOISE, avec Vano Baby, Tgang et Bobo Wê.

Le 24 octobre 2024, MODE AVION ouvre un deuxième champ : sept titres classés Afrobeat / Afrosounds, plus urbains, plus secs. L'année 2025 devient celle du rythme imposé — AKA, Minkanangbè, Vivi, Sessi, Dozo, Goslow, Guepard — entre afrobeat, amapiano conscient et collaborations.

En 2026, le duo change d'échelle de sens avec HÉRITAGE VIVANT LIVE, une live expérience en quatre séquences autour de la mémoire collective, de la résilience, de l'amour, de la spiritualité, de la vigilance et de la gratitude. La même année, DESSIGUIMANZANBERA, avec Tony X et Fanicko, confirme leur place dans les classements nationaux.

Conex & Don combinent afrobeat, amapiano, rap, humour, culture béninoise et storytelling. Ils ont été distingués au FinAB 2024 (« Musique Influence ») et figuraient parmi les nommés des Benin Showbiz Awards 2025.`,
};

export const heritage = {
  title: "HÉRITAGE VIVANT",
  quote:
    "Nous ne sommes pas seulement héritiers d'une histoire. Nous en sommes la continuité.",
  sequences: [
    {
      index: "01",
      title: "MEDLEY",
      theme: "Mémoire",
      image: "/images/MEDLEY.png",
      body: "Le rappel de tout ce qui a précédé : les freestyles, les titres, les voix, le public.",
    },
    {
      index: "02",
      title: "DJO AGADO",
      theme: "Résilience",
      image: "/images/AGADO.png",
      body: "Ce qui tient debout quand tout vacille. La famille, la rue, la patience.",
    },
    {
      index: "03",
      title: "DJIVÈDÉ",
      theme: "Vigilance",
      image: "/images/Djivèdé.png",
      body: "Observer, comprendre, ne pas se laisser prendre. La lucidité comme héritage.",
    },
    {
      index: "04",
      title: "MI ZÉ GAN NOU WÉ / GOSPEL",
      theme: "Gratitude",
      image: "/images/Mi-ze-gan-gospel.png",
      body: "Le remerciement final. La spiritualité comme point d'orgue.",
    },
  ],
};

export const technicalRider = [
  "Scène minimum 8 m × 6 m, hauteur sous plafond 4 m",
  "Retour scène : 4 wedges + 2 retours latéraux",
  "Console FOH numérique (Yamaha CL5, Midas M32 ou équivalent)",
  "2 micros vocaux sans fil Shure SM58 / KSM9HS + émetteurs",
  "Monitoring in-ears sur demande (2 systems stéréo)",
  "Backline : clavier/DJ setup, 2 DAW stands, alimentation 220 V",
  "Lumière : 12 parc LED + 4 heads + haze (selon fiche technique détaillée)",
  "Loges : 2, eau, nourriture chaude, serviettes",
  "Équipe locale : 1 régisseur, 1 ingénieur son, 1 responsable scène",
];
