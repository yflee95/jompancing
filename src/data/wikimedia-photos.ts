/**
 * Wikimedia Commons — location photos (CC / public domain).
 * Uses direct upload.wikimedia.org URLs (thumb/960px links often 404).
 */

import type { FishingSpot } from "@/types";

export interface WikimediaPhoto {
  url: string;
  artist: string;
  license: string;
  filePage: string;
}

/** Spot slug → verified Commons image of the real location or immediate area */
export const WIKIMEDIA_SPOT_PHOTOS: Record<string, WikimediaPhoto> = {
  "danga-bay-jetty": {
    url: "https://upload.wikimedia.org/wikipedia/commons/1/13/Danga_Bay_recreational_park.jpg",
    artist: "Emran Kassim",
    license: "CC BY 2.0",
    filePage: "https://commons.wikimedia.org/wiki/File:Danga_Bay_recreational_park.jpg",
  },
  "pontian-coastal-rock": {
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Tanjung_Piai.jpg",
    artist: "Halimsamad",
    license: "CC BY-SA 4.0",
    filePage: "https://commons.wikimedia.org/wiki/File:Tanjung_Piai.jpg",
  },
  "klang-pond-fishing": {
    url: "https://upload.wikimedia.org/wikipedia/commons/1/19/Kuala_Lumpur_Malaysia_Sungai-Klang-03.jpg",
    artist: "CEphoto, Uwe Aranas",
    license: "CC BY-SA 3.0",
    filePage: "https://commons.wikimedia.org/wiki/File:Kuala_Lumpur_Malaysia_Sungai-Klang-03.jpg",
  },
  "tanjung-bungah-pier": {
    url: "https://upload.wikimedia.org/wikipedia/commons/2/25/Tanjong_Bungah%2C_George_Town%2C_Penang_2023.jpg",
    artist: "HundenvonPenang",
    license: "CC BY-SA 4.0",
    filePage: "https://commons.wikimedia.org/wiki/File:Tanjong_Bungah,_George_Town,_Penang_2023.jpg",
  },
  "stulang-laut-jetty": {
    url: "https://upload.wikimedia.org/wikipedia/commons/6/68/Johor_Straits_3.jpg",
    artist: "Slleong",
    license: "CC0",
    filePage: "https://commons.wikimedia.org/wiki/File:Johor_Straits_3.jpg",
  },
  "pulai-spring-pond": {
    url: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Skudai%2C_81300_Skudai%2C_Johor%2C_Malaysia_-_panoramio.jpg",
    artist: "henry8882111",
    license: "CC BY 3.0",
    filePage: "https://commons.wikimedia.org/wiki/File:Skudai,_81300_Skudai,_Johor,_Malaysia_-_panoramio.jpg",
  },
  "port-klang-north-port": {
    url: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Carl_Vinson_Carrier_Strike_Group_Arrives_at_Port_Klang%2C_Malaysia_%288817620%29.jpg",
    artist: "U.S. Navy (Nathan Jordan)",
    license: "Public domain",
    filePage: "https://commons.wikimedia.org/wiki/File:Carl_Vinson_Carrier_Strike_Group_Arrives_at_Port_Klang,_Malaysia_(8817620).jpg",
  },
  "teluk-cempedak-rocks": {
    url: "https://upload.wikimedia.org/wikipedia/commons/1/14/Kuantan_-_waves_breaking_over_rocks_at_Teluk_Cempedak_-_May_2024.jpg",
    artist: "Dominic Nelson",
    license: "CC BY-SA 4.0",
    filePage: "https://commons.wikimedia.org/wiki/File:Kuantan_-_waves_breaking_over_rocks_at_Teluk_Cempedak_-_May_2024.jpg",
  },
  "jesselton-point-kk": {
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Kota_Kinabalu_Jesselton_Point_0007.jpg",
    artist: "Stefan Fussan",
    license: "CC BY-SA 3.0",
    filePage: "https://commons.wikimedia.org/wiki/File:Kota_Kinabalu_Jesselton_Point_0007.jpg",
  },
  "kuching-waterfront-jetty": {
    url: "https://upload.wikimedia.org/wikipedia/commons/4/42/Kuching_Waterfront_Panorama.jpg",
    artist: "Jin",
    license: "CC BY 2.0",
    filePage: "https://commons.wikimedia.org/wiki/File:Kuching_Waterfront_Panorama.jpg",
  },
  "miri-marina-evening": {
    url: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Miri_28_October_2023_05.jpg",
    artist: "Yu Chu Chin",
    license: "CC BY-SA 4.0",
    filePage: "https://commons.wikimedia.org/wiki/File:Miri_28_October_2023_05.jpg",
  },
  "klebang-coastal": {
    url: "https://upload.wikimedia.org/wikipedia/commons/0/05/Klebang_Beach.JPG",
    artist: "Chongkian",
    license: "CC BY-SA 4.0",
    filePage: "https://commons.wikimedia.org/wiki/File:Klebang_Beach.JPG",
  },
  "port-dickson-breakwater": {
    url: "https://upload.wikimedia.org/wikipedia/commons/6/66/Downtown_Port_Dickson_south_view.jpg",
    artist: "AyyanD",
    license: "CC BY-SA 4.0",
    filePage: "https://commons.wikimedia.org/wiki/File:Downtown_Port_Dickson_south_view.jpg",
  },
  "lumut-marina-jetty": {
    url: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Twilight_in_Lumut_Beach%2C_Perak%2C_Malaysia.jpg",
    artist: "hams Nocete",
    license: "CC BY-SA 2.0",
    filePage: "https://commons.wikimedia.org/wiki/File:Twilight_in_Lumut_Beach,_Perak,_Malaysia.jpg",
  },
  "batu-ferringhi-surf": {
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Batu_Ferringhi%2C_George_Town%2C_Penang_2023.jpg",
    artist: "HundenvonPenang",
    license: "CC BY-SA 4.0",
    filePage: "https://commons.wikimedia.org/wiki/File:Batu_Ferringhi,_George_Town,_Penang_2023.jpg",
  },
  "putrajaya-lake-casting": {
    url: "https://upload.wikimedia.org/wikipedia/commons/0/06/Putrajaya_panorama_Jan_2007_b.JPG",
    artist: "Marku1988 / Gryffindor",
    license: "CC BY 2.5",
    filePage: "https://commons.wikimedia.org/wiki/File:Putrajaya_panorama_Jan_2007_b.JPG",
  },
  "desaru-coast-night": {
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Desaru_Beach.jpg",
    artist: "Chongkian",
    license: "CC BY-SA 4.0",
    filePage: "https://commons.wikimedia.org/wiki/File:Desaru_Beach.jpg",
  },
  "kukup-mangrove-jetty": {
    url: "https://upload.wikimedia.org/wikipedia/commons/4/46/Kukup_Golf_Resort.jpg",
    artist: "Chongkian",
    license: "CC BY-SA 4.0",
    filePage: "https://commons.wikimedia.org/wiki/File:Kukup_Golf_Resort.jpg",
  },
  "kuala-kedah-jetty": {
    url: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Kuala_Kedah_-_di_jeti.jpg",
    artist: "Malekhanif",
    license: "CC BY-SA 3.0",
    filePage: "https://commons.wikimedia.org/wiki/File:Kuala_Kedah_-_di_jeti.jpg",
  },
  "kota-bharu-pantai-dalam": {
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Bachok_Beach.jpg",
    artist: "E. Cooke-Russell",
    license: "Public domain",
    filePage: "https://commons.wikimedia.org/wiki/File:Bachok_Beach.jpg",
  },
  "kuala-terengganu-jetty": {
    url: "https://upload.wikimedia.org/wikipedia/commons/8/88/Kuala_Terengganu_Waterfront%2C_Kuala_Terengganu_20240227_124553.jpg",
    artist: "Wiki Farazi",
    license: "CC0",
    filePage: "https://commons.wikimedia.org/wiki/File:Kuala_Terengganu_Waterfront,_Kuala_Terengganu_20240227_124553.jpg",
  },
  "kuala-perlis-ferry-jetty": {
    url: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kuala_Perlis_Ferry_Terminal.jpg",
    artist: "Chongkian",
    license: "CC BY-SA 4.0",
    filePage: "https://commons.wikimedia.org/wiki/File:Kuala_Perlis_Ferry_Terminal.jpg",
  },
  "kl-lake-gardens": {
    url: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Perdana_Botanical_Gardens_in_2023_01.jpg",
    artist: "Renek78",
    license: "CC0",
    filePage: "https://commons.wikimedia.org/wiki/File:Perdana_Botanical_Gardens_in_2023_01.jpg",
  },
  "labuan-sea-sports-complex": {
    url: "https://upload.wikimedia.org/wikipedia/commons/6/61/Labuan_Financial_Park_-_01.JPG",
    artist: "JKT-c",
    license: "CC BY 3.0",
    filePage: "https://commons.wikimedia.org/wiki/File:Labuan_Financial_Park_-_01.JPG",
  },
};

export function isWikimediaImageUrl(src?: string | null): boolean {
  return Boolean(src?.includes("wikimedia.org"));
}

export function getWikimediaPhoto(slug: string): WikimediaPhoto | undefined {
  return WIKIMEDIA_SPOT_PHOTOS[slug];
}

export function applyWikimediaPhotos(spots: FishingSpot[]): FishingSpot[] {
  return spots.map((spot) => {
    const wiki = getWikimediaPhoto(spot.slug);
    if (!wiki) return spot;
    return {
      ...spot,
      imageUrl: wiki.url,
      photos: [wiki.url],
      photoAttribution: {
        artist: wiki.artist,
        license: wiki.license,
        filePage: wiki.filePage,
      },
    };
  });
}
