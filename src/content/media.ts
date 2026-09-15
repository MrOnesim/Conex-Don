export type VideoSeed = {
  slug: string;
  title: string;
  category: string;
  year: number;
  youtubeId?: string;
  searchQuery: string;
  image?: string;
  accent: string;
  description: string;
};

const q = (term: string) => `Conex et Don ${term}`;

export const videos: VideoSeed[] = [
  {
    slug: "dessiguimanzanbera-video",
    title: "DESSIGUIMANZANBERA",
    category: "Clip officiel",
    year: 2026,
    youtubeId: "skYAk6-hxfs",
    searchQuery: q("DESSIGUIMANZANBERA Tony X Fanicko"),
    image: "/images/DESSIGUIMANZANBERA.jpg",
    accent: "#9E382C",
    description: "Tony X × Fanicko × Conex & Don. La dernière sortie du duo.",
  },
  {
    slug: "heritage-vivant-video",
    title: "HÉRITAGE VIVANT",
    category: "Live expérience",
    year: 2026,
    youtubeId: "oGZLv0Vc7aU",
    searchQuery: q("HÉRITAGE VIVANT live expérience"),
    image: "/images/HÉRITAGE-VIVANT.jpg",
    accent: "#173F32",
    description:
      "Mémoire, résilience, spiritualité et gratitude : la live expérience en quatre séquences.",
  },
  {
    slug: "vivi-video",
    title: "VIVI",
    category: "Clip officiel",
    year: 2025,
    youtubeId: "4PUk77xnkTo",
    searchQuery: q("VIVI"),
    image: "/images/DESTINATION-DOGBO.png",
    accent: "#D6A83A",
    description: "Afrobeat et culture béninoise — profiter de la vie après l'effort.",
  },
  {
    slug: "tchiza-video",
    title: "TCHIZA",
    category: "Visualizer",
    year: 2026,
    youtubeId: "ulkWdCiONm0",
    searchQuery: q("TCHIZA"),
    accent: "#6F4A32",
    description: "Visualizer — chapitre 2026.",
  },
  {
    slug: "guepard-video",
    title: "GUEPARD",
    category: "Clip officiel",
    year: 2025,
    youtubeId: "YpdbAP24cAY",
    searchQuery: q("GUEPARD Axel Merryl DJ Yann LeKiller"),
    accent: "#D6A83A",
    description: "Avec DJ Yann LeKiller et Axel Merryl.",
  },
  {
    slug: "goslow-video",
    title: "GOSLOW",
    category: "Clip officiel",
    year: 2025,
    youtubeId: "7YDc638pK5k",
    searchQuery: q("GOSLOW OPA Ghix"),
    accent: "#173F32",
    description: "Avec OPA et Ghix.",
  },
  {
    slug: "dozo-video",
    title: "DOZO",
    category: "Clip officiel",
    year: 2025,
    youtubeId: "7rRaliwbLBc",
    searchQuery: q("DOZO"),
    accent: "#9E382C",
    description: "Amapiano rythmé et conscient.",
  },
  {
    slug: "sessi-video",
    title: "SESSI",
    category: "Visualizer",
    year: 2025,
    youtubeId: "5QIGaxmfcHs",
    searchQuery: q("SESSI"),
    accent: "#6F4A32",
    description: "Un titre à la dimension spirituelle forte.",
  },
  {
    slug: "minkanangbe-video",
    title: "MINKANANGBÈ",
    category: "Clip officiel",
    year: 2025,
    youtubeId: "_ow952jm9w0",
    searchQuery: q("Minkanangbè"),
    accent: "#173F32",
    description: "Sortie du 12 avril 2025.",
  },
  {
    slug: "aka-video",
    title: "AKA",
    category: "Clip officiel",
    year: 2025,
    youtubeId: "2XNM_8JIaMs",
    searchQuery: q("AKA"),
    accent: "#9E382C",
    description: "Énergie, persévérance et commentaire social.",
  },
  {
    slug: "wotto-wotto-video",
    title: "WOTTO WOTTO",
    category: "Clip officiel",
    year: 2024,
    youtubeId: "ddy8MadW1XI",
    searchQuery: q("WOTTO WOTTO"),
    accent: "#D6A83A",
    description: "Extrait de MODE AVION.",
  },
  {
    slug: "tor-tor-video",
    title: "TOR TOR",
    category: "Clip officiel",
    year: 2024,
    youtubeId: "vllxgUV41bM",
    searchQuery: q("TOR TOR Axel Merryl"),
    accent: "#6F4A32",
    description: "feat. Axel Merryl — MODE AVION.",
  },
  {
    slug: "ayato-video",
    title: "AYATO",
    category: "Clip officiel",
    year: 2024,
    youtubeId: "jIKZsZIXhs0",
    searchQuery: q("AYATO"),
    image: "/images/AYATO.png",
    accent: "#9E382C",
    description: "Le morceau le plus identifié par le public.",
  },
  {
    slug: "agbon-video",
    title: "AGBON",
    category: "Clip officiel",
    year: 2024,
    youtubeId: "Qr8N9jdR6sk",
    searchQuery: q("AGBON"),
    image: "/images/SYMPHONIE-BÉNINOISE.webp",
    accent: "#6F4A32",
    description: "LA SYMPHONIE BÉNINOISE.",
  },
  {
    slug: "concert-symphonie-video",
    title: "CONCERT SYMPHONIE BÉNINOISE",
    category: "Live",
    year: 2024,
    youtubeId: "oJ0F0mMlh2M",
    searchQuery: q("Concert Symphonie Béninoise live"),
    image: "/images/MAN-LON-ô.png",
    accent: "#D6A83A",
    description: "Le premier grand concert du duo.",
  },
];

export type EventSeed = {
  title: string;
  city: string;
  country: string;
  venue: string;
  eventDate: string;
  status: "upcoming" | "archive";
  note: string;
  ticketUrl?: string;
  image?: string;
};

export const events: EventSeed[] = [
  {
    title: "GRAND RASSEMBLEMENT ALOBA",
    city: "À annoncer",
    country: "Bénin",
    venue: "Date & lieu à dévoiler",
    eventDate: "À annoncer",
    status: "upcoming",
    note:
      "En septembre 2026, Conex & Don ont annoncé la préparation d'un grand rassemblement avec leur public, pour célébrer le chemin parcouru depuis leurs débuts. Inscrivez-vous pour être prévenu en premier.",
  },
  {
    title: "HÉRITAGE VIVANT — LIVE EXPÉRIENCE",
    city: "Bénin",
    country: "Bénin",
    venue: "Live expérience",
    eventDate: "2026",
    status: "archive",
    note:
      "La live expérience en quatre séquences : Medley, Djo Agado, Djivèdé, Mi zé gan nou wé / Gospel.",
    image: "/images/HÉRITAGE-VIVANT.jpg",
  },
  {
    title: "CONCERT SYMPHONIE BÉNINOISE",
    city: "Cotonou",
    country: "Bénin",
    venue: "Premier grand concert",
    eventDate: "2024",
    status: "archive",
    note:
      "L'album joué live, avec Vano Baby, Tgang, Bobo Wê et le public béninois.",
    image: "/images/SYMPHONIE-BÉNINOISE.webp",
  },
  {
    title: "SORTIE MODE AVION — SHOWCASE",
    city: "Bénin",
    country: "Bénin",
    venue: "Showcase",
    eventDate: "24 octobre 2024",
    status: "archive",
    note: "Présentation du deuxième album studio, MODE AVION, en public.",
    image: "/images/MODE-AVION.jpg",
  },
];

export type NewsSeed = {
  slug: string;
  title: string;
  category: "MUSIC" | "LIVE" | "PRESS" | "BEHIND THE SCENES" | "ANNONCE";
  excerpt: string;
  body: string;
  publishedAt: string;
  source?: string;
  sourceUrl?: string;
  image?: string;
};

export const news: NewsSeed[] = [
  {
    slug: "grand-rassemblement-aloba",
    title: "Conex & Don annoncent un grand rassemblement pour célébrer leur parcours",
    category: "ANNONCE",
    excerpt:
      "Le duo prépare un grand moment avec son public. Date et lieu n'ont pas encore été dévoilés.",
    body: `En septembre 2026, Conex & Don ont annoncé la préparation d'un grand rassemblement avec leur public, destiné à célébrer le chemin parcouru depuis leurs débuts sur TikTok.

La date et le lieu n'étaient pas encore dévoilés au moment de l'annonce. Ce rendez-vous s'inscrit dans la continuité d'HÉRITAGE VIVANT : faire de la scène un lieu de mémoire partagée avec ceux qui suivent le duo depuis les freestyles de 2022.

Inscrivez-vous à la liste ALOBA pour recevoir l'information en premier.`,
    publishedAt: "Septembre 2026",
    source: "Bénin Web TV",
    sourceUrl:
      "https://beninwebtv.bj/benin-conex-et-don-annoncent-un-grand-rassemblement-pour-celebrer-leur-parcours/",
    image: "/images/HÉRITAGE-VIVANT.jpg",
  },
  {
    slug: "dessiguimanzanbera-sortie",
    title: "DESSIGUIMANZANBERA : Conex & Don réunis avec Tony X et Fanicko",
    category: "MUSIC",
    excerpt:
      "Nouvelle sortie le 7 mai 2026. Un morceau de 3:09 qui a rapidement grimpé dans les classements béninois.",
    body: `Sortie du 7 mai 2026 — 3 min 09.

DESSIGUIMANZANBERA réunit Conex & Don, Tony X et Fanicko sur un seul titre. Le morceau a connu de très bons classements au Bénin, avec une première place dans plusieurs relevés.

C'est actuellement la dernière sortie officielle identifiée du duo sur les plateformes.`,
    publishedAt: "7 mai 2026",
    image: "/images/DESSIGUIMANZANBERA.jpg",
  },
  {
    slug: "heritage-vivant-live",
    title: "HÉRITAGE VIVANT : la live expérience en quatre séquences",
    category: "LIVE",
    excerpt:
      "Medley, Djo Agado, Djivèdé, Mi zé gan nou wé / Gospel : un projet pensé comme une cérémonie.",
    body: `HÉRITAGE VIVANT LIVE est présenté comme une live expérience, et non comme une simple sortie musicale.

Le projet traverse quatre grandes séquences : MEDLEY, DJO AGADO, DJIVÈDÉ et MI ZÉ GAN NOU WÉ / GOSPEL. Le concept tourne autour de la mémoire, de l'héritage, de la culture, de la résilience, de la spiritualité et de la gratitude.

« Nous ne sommes pas seulement héritiers d'une histoire. Nous en sommes la continuité. »`,
    publishedAt: "2026",
    image: "/images/HÉRITAGE-VIVANT.jpg",
  },
  {
    slug: "benin-showbiz-awards-2025",
    title: "Nommés dans la catégorie Meilleur Artiste Masculin — Benin Showbiz Awards 2025",
    category: "PRESS",
    excerpt:
      "Le duo figurait parmi les nommés des Benin Showbiz Awards 2025.",
    body: `Conex & Don figuraient parmi les nommés dans la catégorie Meilleur Artiste Masculin des Benin Showbiz Awards 2025.

Une reconnaissance qui vient saluer une année 2025 marquée par sept sorties : AKA, Minkanangbè, Vivi, Sessi, Dozo, Goslow et Guepard.`,
    publishedAt: "2025",
    source: "Benin Showbiz Awards",
    sourceUrl: "https://beninshowbizawards.com/bsa-2025",
  },
  {
    slug: "finab-2024-musique-influence",
    title: "FinAB 2024 : distinction « Musique Influence »",
    category: "PRESS",
    excerpt:
      "Le duo a été distingué dans le cadre du FinAB 2024, en catégorie Musique Influence.",
    body: `Conex & Don ont été distingués dans le cadre du FinAB 2024, avec une distinction « Musique Influence ».

Le prix arrive après la sortie de LA SYMPHONIE BÉNINOISE et du CONCERT SYMPHONIE BÉNINOISE : deux projets qui ont installé le duo dans le paysage musical béninois.`,
    publishedAt: "2024",
    source: "FinAB",
    sourceUrl: "https://site.finab.bj/pdfs/2024.pdf",
  },
  {
    slug: "guepard-avec-axel-merryl",
    title: "GUEPARD avec DJ Yann LeKiller et Axel Merryl",
    category: "MUSIC",
    excerpt: "Sortie du 19 décembre 2025 : vitesse, instinct et dépassement.",
    body: `GUEPARD est sorti le 19 décembre 2025, en collaboration avec DJ Yann LeKiller et Axel Merryl.

Le titre clôt une année 2025 particulièrement dense pour le duo, avec sept singles publiés.`,
    publishedAt: "19 décembre 2025",
  },
  {
    slug: "mode-avion-deuxieme-album",
    title: "MODE AVION : le deuxième album studio",
    category: "MUSIC",
    excerpt:
      "Sorti le 24 octobre 2024, sept titres classés Afrobeat / Afrosounds.",
    body: `MODE AVION est sorti le 24 octobre 2024.

Sept titres : PERCER, TOR TOR (feat. Axel Merryl), PAUSE, VAMIDJO, COCA COLA, DI TOLOLO et WOTTO WOTTO. Les plateformes classent le projet dans l'Afrobeat / Afrosounds.`,
    publishedAt: "24 octobre 2024",
    image: "/images/MODE-AVION.jpg",
  },
  {
    slug: "la-symphonie-beninoise-premier-album",
    title: "LA SYMPHONIE BÉNINOISE : le premier album",
    category: "MUSIC",
    excerpt:
      "Treize pistes avec bonus, construites autour de l'identité musicale béninoise.",
    body: `Sorti en février 2024, LA SYMPHONIE BÉNINOISE est le premier album de Conex & Don.

Treize pistes avec le bonus, dont AYATO, devenu le morceau le plus identifié par le public. Le projet est construit autour de l'identité musicale béninoise et de la volonté de mettre en valeur différentes couleurs culturelles du pays.`,
    publishedAt: "Février 2024",
    image: "/images/SYMPHONIE-BÉNINOISE.webp",
  },
  {
    slug: "2022-les-freestyles",
    title: "2022 : tout a commencé par des freestyles",
    category: "BEHIND THE SCENES",
    excerpt:
      "Don publie ses premiers freestyles sur TikTok. Un mois plus tard, Conex le rejoint.",
    body: `Avant les albums, il y a eu des téléphones, des cours de maison et des freestyles filmés à la va-vite.

En 2022, Don commence à publier des freestyles sur TikTok, inspirés du quotidien et des réalités de ses compatriotes. Environ un mois plus tard, Conex le rejoint : le duo Conex & Don naît de cette complicité d'enfance.`,
    publishedAt: "2022",
  },
];

export const alobaSeed = [
  {
    displayName: "Rachelle",
    handle: "@rachelle.cnt",
    city: "Cotonou",
    mood: "Aloba !",
    message:
      "J'ai écouté HÉRITAGE VIVANT trois fois d'affilée. Mes parents ne parlent pas français entre eux, et j'ai entendu leur langue dans un morceau du duo. Merci.",
  },
  {
    displayName: "Koffi",
    handle: "@koffi_zkp",
    city: "Porto-Novo",
    mood: "Mode avion",
    message:
      "PERCER en boucle dans le taxi le matin. Le morceau m'a tenu toute l'année 2024.",
  },
  {
    displayName: "Fatou",
    handle: "@fatou.dj",
    city: "Ouidah",
    mood: "Ayato forever",
    message:
      "Quand AYATO est sorti, tout le quartier connaissait les paroles. C'était notre hymne.",
  },
  {
    displayName: "Sètondji",
    handle: "@setondji.bj",
    city: "Dogbo",
    mood: "Destination Dogbo",
    message:
      "DESTINATION DOGBO, c'est la première fois que j'entends ma ville dans un album national. Grand respect.",
  },
];
