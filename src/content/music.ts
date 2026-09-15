export type ReleaseKind = "album" | "ep" | "single" | "live";

export type StreamLinks = {
  spotify?: string;
  apple?: string;
  audiomack?: string;
  youtube?: string;
  deezer?: string;
  amazon?: string;
  boomplay?: string;
  youtubeId?: string;
};

export type TrackSeed = {
  position: number;
  title: string;
  featuring?: string;
  duration?: string;
  note?: string;
};

export type ReleaseSeed = {
  slug: string;
  title: string;
  kind: ReleaseKind;
  releaseDate: string;
  year: number;
  duration?: string;
  tagline: string;
  description: string;
  longDescription?: string;
  coverImage?: string;
  accent: string;
  label?: string;
  links: StreamLinks;
  featured?: boolean;
  tracks: TrackSeed[];
};

const SPOTIFY_ARTIST = "https://open.spotify.com/artist/4vibJGQKsr8i8A5a1LizZ0";
const APPLE_ARTIST = "https://music.apple.com/fr/artist/conex-et-don/1668784419";
const AUDIOMACK_ARTIST = "https://audiomack.com/conexetdonofficiel";
const YOUTUBE_CHANNEL = "https://www.youtube.com/@ConexetDon";
const DEEZER_ARTIST = "https://www.deezer.com/artist/199462157";
const AMAZON_SEARCH = "https://music.amazon.com/search/conex%20et%20don";

const base: StreamLinks = {
  spotify: SPOTIFY_ARTIST,
  apple: APPLE_ARTIST,
  audiomack: AUDIOMACK_ARTIST,
  youtube: YOUTUBE_CHANNEL,
  deezer: DEEZER_ARTIST,
  amazon: AMAZON_SEARCH,
};

export const releases: ReleaseSeed[] = [
  {
    slug: "dessiguimanzanbera",
    title: "DESSIGUIMANZANBERA",
    kind: "single",
    releaseDate: "2026-05-07",
    year: 2026,
    duration: "3:09",
    tagline: "Tony X × Fanicko × Conex & Don",
    description:
      "Trois voix béninoises sur un seul morceau. La dernière sortie officielle du duo.",
    longDescription:
      "Sorti le 7 mai 2026, DESSIGUIMANZANBERA réunit Conex & Don, Tony X et Fanicko autour d'une énergie commune. Le titre s'est imposé rapidement dans les classements béninois et confirme le duo comme l'un des moteurs de la nouvelle scène nationale.",
    coverImage: "/images/DESSIGUIMANZANBERA.png",
    accent: "#9E382C",
    links: {
      spotify: "https://open.spotify.com/album/7h9ycuGhCE5VPrSI8GfmgF",
      apple: "https://music.apple.com/fr/album/dessiguimanzanbera-feat-tony-x-fanicko-single/1896251360",
      audiomack: AUDIOMACK_ARTIST,
      youtube: "https://www.youtube.com/watch?v=skYAk6-hxfs",
      youtubeId: "skYAk6-hxfs",
      deezer: "https://www.deezer.com/album/975395241",
      amazon: AMAZON_SEARCH,
    },
    featured: true,
    tracks: [
      {
        position: 1,
        title: "DESSIGUIMANZANBERA",
        featuring: "Tony X, Fanicko",
        duration: "3:09",
        note: "Single — 7 mai 2026",
      },
    ],
  },
  {
    slug: "heritage-vivant-live",
    title: "HÉRITAGE VIVANT LIVE",
    kind: "live",
    releaseDate: "2026",
    year: 2026,
    duration: "Live expérience",
    tagline: "Mémoire · Résilience · Gratitude",
    description:
      "Une live expérience en quatre séquences, entre mémoire collective et spiritualité.",
    longDescription:
      "HÉRITAGE VIVANT n'est pas un projet de plus dans la discographie : c'est une live expérience. Quatre séquences traversent la mémoire collective, la résilience, l'amour, la spiritualité, la vigilance et la gratitude. Le duo y convoque ce qui l'a fait — la rue, la famille, la culture — et le transforme en cérémonie contemporaine.",
    coverImage: "/images/HÉRITAGE-VIVANT.jpg",
    accent: "#173F32",
    links: {
      ...base,
      apple: "https://music.apple.com/fr/album/h%C3%A9ritage-vivant-live-ep/1879149561",
      deezer: "https://www.deezer.com/album/916424881",
      youtube: "https://www.youtube.com/watch?v=oGZLv0Vc7aU",
      youtubeId: "oGZLv0Vc7aU",
    },
    featured: true,
    tracks: [
      { position: 1, title: "MEDLEY", duration: "—", note: "Ouverture" },
      { position: 2, title: "DJO AGADO", duration: "—" },
      { position: 3, title: "DJIVÈDÉ", duration: "—" },
      { position: 4, title: "MI ZÉ GAN NOU WÉ / GOSPEL", duration: "—", note: "Final" },
    ],
  },
  {
    slug: "tchiza",
    title: "TCHIZA",
    kind: "single",
    releaseDate: "2026",
    year: 2026,
    tagline: "Single 2026",
    description: "Nouveau chapitre 2026, entre écriture du quotidien et groove.",
    coverImage: "/images/Tchiza.jpg",
    accent: "#6F4A32",
    links: {
      ...base,
      apple: "https://music.apple.com/fr/album/tchiza-single/1882391877",
      deezer: "https://www.deezer.com/album/932548751",
      youtube: "https://www.youtube.com/watch?v=ulkWdCiONm0",
      youtubeId: "ulkWdCiONm0",
    },
    tracks: [{ position: 1, title: "TCHIZA", duration: "—" }],
  },
  {
    slug: "guepard",
    title: "GUEPARD",
    kind: "single",
    releaseDate: "2025-12-19",
    year: 2025,
    tagline: "DJ Yann LeKiller × Axel Merryl × Conex & Don",
    description: "Vitesse, instinct et dépassement. Sortie du 19 décembre 2025.",
    coverImage: "/images/AKPOR.png",
    accent: "#D6A83A",
    links: {
      ...base,
      apple: "https://music.apple.com/us/album/guepard-single/1862638983",
      deezer: "https://www.deezer.com/album/880606172",
      youtube: "https://www.youtube.com/watch?v=YpdbAP24cAY",
      youtubeId: "YpdbAP24cAY",
    },
    tracks: [
      {
        position: 1,
        title: "GUEPARD",
        featuring: "DJ Yann LeKiller, Axel Merryl",
        duration: "—",
      },
    ],
  },
  {
    slug: "goslow",
    title: "GOSLOW",
    kind: "single",
    releaseDate: "2025-11-28",
    year: 2025,
    tagline: "OPA × Conex & Don × Ghix",
    description: "Ralentir pour mieux tenir. Sortie du 28 novembre 2025.",
    coverImage: "/images/AYATO.png",
    accent: "#173F32",
    links: {
      ...base,
      apple: "https://music.apple.com/us/album/goslow-single/1850986181",
      deezer: "https://www.deezer.com/album/850973252",
      youtube: "https://www.youtube.com/watch?v=7YDc638pK5k",
      youtubeId: "7YDc638pK5k",
    },
    tracks: [
      { position: 1, title: "GOSLOW", featuring: "OPA, Ghix", duration: "—" },
    ],
  },
  {
    slug: "dozo",
    title: "DOZO",
    kind: "single",
    releaseDate: "2025-10-25",
    year: 2025,
    tagline: "Amapiano conscient",
    description:
      "Un amapiano rythmé et conscient, traversé par l'humour habituel du duo.",
    coverImage: "/images/BABA-OSHE.png",
    accent: "#9E382C",
    links: {
      ...base,
      apple: "https://music.apple.com/fr/album/dozo-single/1845242138",
      deezer: "https://www.deezer.com/album/835439882",
      youtube: "https://www.youtube.com/watch?v=7rRaliwbLBc",
      youtubeId: "7rRaliwbLBc",
    },
    tracks: [{ position: 1, title: "DOZO", duration: "—" }],
  },
  {
    slug: "sessi",
    title: "SESSI",
    kind: "single",
    releaseDate: "2025-08-06",
    year: 2025,
    tagline: "Dimension spirituelle",
    description: "Un titre à la dimension spirituelle forte, sorti le 6 août 2025.",
    coverImage: "/images/COTE.png",
    accent: "#6F4A32",
    links: {
      ...base,
      apple: "https://music.apple.com/bj/song/1831412197",
      deezer: "https://www.deezer.com/album/799955891",
      youtube: "https://www.youtube.com/watch?v=5QIGaxmfcHs",
      youtubeId: "5QIGaxmfcHs",
    },
    tracks: [{ position: 1, title: "SESSI", duration: "—" }],
  },
  {
    slug: "vivi",
    title: "VIVI",
    kind: "single",
    releaseDate: "2025-05-24",
    year: 2025,
    tagline: "Profiter de la vie",
    description:
      "Afrobeat et culture béninoise : profiter de la vie après les efforts accomplis.",
    coverImage: "/images/DESTINATION-DOGBO.png",
    accent: "#D6A83A",
    links: {
      ...base,
      apple: "https://music.apple.com/fr/album/vivi-single/1811121646",
      deezer: "https://www.deezer.com/album/748786091",
      youtube: "https://www.youtube.com/watch?v=4PUk77xnkTo",
      youtubeId: "4PUk77xnkTo",
    },
    tracks: [{ position: 1, title: "VIVI", duration: "—" }],
  },
  {
    slug: "minkanangbe",
    title: "MINKANANGBÈ",
    kind: "single",
    releaseDate: "2025-04-12",
    year: 2025,
    tagline: "Single",
    description: "Sortie du 12 avril 2025.",
    coverImage: "/images/MINKA-NANGBE.jpeg",
    accent: "#173F32",
    links: {
      ...base,
      apple: "https://music.apple.com/us/album/minkanangb%C3%A8-single/1808119811",
      deezer: "https://www.deezer.com/album/739827191",
      youtube: "https://www.youtube.com/watch?v=_ow952jm9w0",
      youtubeId: "_ow952jm9w0",
    },
    tracks: [{ position: 1, title: "MINKANANGBÈ", duration: "—" }],
  },
  {
    slug: "aka",
    title: "AKA",
    kind: "single",
    releaseDate: "2025-03-06",
    year: 2025,
    tagline: "Énergie · Persévérance",
    description:
      "Énergie, persévérance et commentaire social, tourné vers la jeunesse béninoise.",
    coverImage: "/images/AKA.jpg",
    accent: "#9E382C",
    links: {
      ...base,
      apple: "https://music.apple.com/fr/album/aka-single/1799615093",
      deezer: "https://www.deezer.com/album/720033251",
      youtube: "https://www.youtube.com/watch?v=2XNM_8JIaMs",
      youtubeId: "2XNM_8JIaMs",
    },
    tracks: [{ position: 1, title: "AKA", duration: "—" }],
  },
  {
    slug: "mode-avion",
    title: "MODE AVION",
    kind: "album",
    releaseDate: "2024-10-24",
    year: 2024,
    duration: "7 titres",
    tagline: "Deuxième album studio",
    description:
      "Sept titres classés Afrobeat / Afrosounds : le départ, la pause, la percée.",
    longDescription:
      "Sorti le 24 octobre 2024, MODE AVION est le deuxième projet studio du duo. Sept titres qui racontent un mouvement : partir, couper le monde quelques heures, puis percer. Un projet plus urbain, plus sec, porté par des titres devenus des moments de concert.",
    coverImage: "/images/MODE-AVION.jpg",
    accent: "#080808",
    links: {
      ...base,
      apple: "https://music.apple.com/us/album/mode-avion/1772396300",
      deezer: "https://www.deezer.com/album/651304321",
      youtube: "https://www.youtube.com/watch?v=ddy8MadW1XI",
      youtubeId: "ddy8MadW1XI",
    },
    featured: true,
    tracks: [
      { position: 1, title: "PERCER" },
      { position: 2, title: "TOR TOR", featuring: "Axel Merryl" },
      { position: 3, title: "PAUSE" },
      { position: 4, title: "VAMIDJO" },
      { position: 5, title: "COCA COLA" },
      { position: 6, title: "DI TOLOLO" },
      { position: 7, title: "WOTTO WOTTO" },
    ],
  },
  {
    slug: "concert-symphonie-beninoise",
    title: "CONCERT SYMPHONIE BÉNINOISE",
    kind: "live",
    releaseDate: "2024",
    year: 2024,
    duration: "Live",
    tagline: "Le premier grand concert",
    description:
      "La Symphonie Béninoise jouée live, avec invités et public : la naissance de la Live Experience.",
    longDescription:
      "Après la sortie de l'album, le duo monte sur scène pour son premier grand concert. Le live reprend l'album, y ajoute les titres de DÉCOUVERTE et une série d'invités. C'est là que naît la Live Experience Conex & Don.",
    coverImage: "/images/MAN-LON-ô.png",
    accent: "#9E382C",
    links: {
      ...base,
      apple: "https://music.apple.com/fr/album/concert-symphonie-beninoise/1751280071",
      deezer: "https://www.deezer.com/album/599550422",
      youtube: "https://www.youtube.com/watch?v=oJ0F0mMlh2M",
      youtubeId: "oJ0F0mMlh2M",
    },
    tracks: [
      { position: 1, title: "La Course" },
      { position: 2, title: "Baba Oshe" },
      { position: 3, title: "Follow You Go" },
      { position: 4, title: "Trahison" },
      { position: 5, title: "Akpor" },
      { position: 6, title: "Hevioso Difin" },
      { position: 7, title: "Pardon Chef" },
      { position: 8, title: "Côté", featuring: "Vano Baby" },
      { position: 9, title: "Agbon", featuring: "Tgang" },
      { position: 10, title: "My Wife", featuring: "Bobo Wê" },
      { position: 11, title: "Alcool" },
      { position: 12, title: "Dougbe" },
      { position: 13, title: "Ayato" },
    ],
  },
  {
    slug: "la-symphonie-beninoise",
    title: "LA SYMPHONIE BÉNINOISE",
    kind: "album",
    releaseDate: "2024-02",
    year: 2024,
    duration: "13 titres (avec bonus)",
    tagline: "Premier album",
    description:
      "Treize pistes construites autour de l'identité musicale béninoise et de ses couleurs culturelles.",
    longDescription:
      "LA SYMPHONIE BÉNINOISE est le premier album de Conex & Don, sorti en février 2024. Treize pistes dont un bonus, une intention claire : mettre en valeur les différentes couleurs culturelles du Bénin. C'est le chapitre fondateur, celui qui a fait passer le duo du freestyle TikTok à la scène nationale.",
    coverImage: "/images/SYMPHONIE-BÉNINOISE.webp",
    accent: "#6F4A32",
    label: "Phoenix Label / ONErpm",
    links: {
      ...base,
      apple: "https://music.apple.com/fr/album/la-symphonie-beninoise/1731321203",
      audiomack: "https://audiomack.com/conexetdonofficiel/album/la-symphonie-beninoise",
      deezer: "https://www.deezer.com/album/548187582",
      youtube: "https://www.youtube.com/watch?v=jIKZsZIXhs0",
      youtubeId: "jIKZsZIXhs0",
    },
    featured: true,
    tracks: [
      { position: 1, title: "FOLLOW YOU GO" },
      { position: 2, title: "BABA OSHE" },
      { position: 3, title: "AGBON" },
      { position: 4, title: "AKPOR" },
      { position: 5, title: "MAN LON O" },
      { position: 6, title: "EYA" },
      { position: 7, title: "DESTINATION DOGBO" },
      { position: 8, title: "MY WIFE" },
      { position: 9, title: "COTE" },
      { position: 10, title: "AYATO", note: "Le titre le plus identifié par le public" },
      { position: 11, title: "WANYINAN" },
      { position: 12, title: "AGAVOU DJOMIDO" },
      { position: 13, title: "DOUGBE REMIX" },
    ],
  },
  {
    slug: "decouverte",
title: "DÉCOUVERTE",
    kind: "ep",
    releaseDate: "2023-04-13",
    year: 2023,
    duration: "18 min",
    tagline: "Premier EP — 5 titres",
    description:
      "Le premier projet officiel : cinq morceaux, dix-huit minutes, une entrée en matière.",
    coverImage: "/images/Découverte.jpg",
    accent: "#173F32",
    label: "Phoenix Label / ONErpm",
    links: {
      ...base,
      apple: "https://music.apple.com/us/album/d%C3%A9couverte-ep/1681807799",
      deezer: "https://www.deezer.com/album/428461887",
      youtube: "https://www.youtube.com/watch?v=ryqAVbJhb-4",
      youtubeId: "ryqAVbJhb-4",
    },
    tracks: [
      { position: 1, title: "Dougbe" },
      { position: 2, title: "L'Alcool" },
      { position: 3, title: "Aventurier", featuring: "First King" },
      { position: 4, title: "Pardon chef" },
      { position: 5, title: "Trahison" },
    ],
  },
];

export const releaseBySlug = (slug: string) =>
  releases.find((release) => release.slug === slug);

export const trackTotal = releases.reduce(
  (total, release) => total + release.tracks.length,
  0,
);
