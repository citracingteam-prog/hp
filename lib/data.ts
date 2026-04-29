import heroImagesJson from "@/content/hero-images.json";
import membersJson from "@/content/members.json";
import historyJson from "@/content/history.json";
import racesJson from "@/content/races.json";
import sponsorsJson from "@/content/sponsors.json";

export type Member = {
  id: string;
  name: string;
  reading: string;
  role: string;
  squad: string;
  year: string;
  photo?: string;
  photoOffsetY?: number;
};

export type Race = {
  id: string;
  name: string;
  date: string;
  location: string;
  image: string;
  status: "upcoming" | "finished";
};

export type SupportWay = {
  id: string;
  label: string;
  title: string;
  description: string;
  examples: string[];
  give: string[];
};

export type Stat = {
  label: string;
  value: number;
  suffix?: string;
  note?: string;
};

export type NavItem = {
  label: string;
  href: string;
};

export type HistoryEntry = {
  year: string;
  event: string;
  headline: string;
  detail?: string;
  highlight?: boolean;
};

export type Company = {
  name: string;
  url?: string;
  logo?: string;
  description?: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "ABOUT", href: "#about" },
  { label: "HISTORY", href: "#history" },
  { label: "MEMBERS", href: "#members" },
  { label: "CALENDAR", href: "#calendar" },
  { label: "SUPPORT", href: "#sponsorship" },
  { label: "SPONSORS", href: "#sponsors" },
  { label: "CONTACT", href: "#contact" },
];

export const TEAM_MISSION = {
  tagline: "PUSH THE LIMIT.",
  subline: "CIT-Racing Team — 2026 Formula Student Japan",
  pillars: [
    {
      title: "ENGINEERING",
      body: "企画・設計・製造・走行まで、一台のフォーミュラカーを学生の手で完遂する。フレーム、パワートレイン、サスペンション、コックピット—— 班ごとの専門性が集まり、毎年新しいマシンが生まれる。",
    },
    {
      title: "HERITAGE",
      body: "2002年の結成から20年以上。現役メンバーの背中には、60名を超えるOB・OGと、学内外の技術パートナーが並ぶ。受け継がれる知見が、挑戦の土台になっている。",
    },
    {
      title: "CHALLENGE",
      body: "2025年・第23回大会で総合18位、ベスト車検賞(ICV)を受賞。チーム史上最高成績を塗り替え続ける。次は2026年、全国のトップを狙う。",
    },
  ],
};

export const MEMBERS: Member[] = membersJson as Member[];

export const STATS: Stat[] = [
  { label: "結成からの歩み", value: 24, suffix: "年", note: "2002年結成" },
  { label: "2025 全日本大会", value: 18, suffix: "位", note: "チーム史上最高" },
  { label: "協賛企業", value: sponsorsJson.length, suffix: "社", note: "技術・物品・資金" },
  { label: "OB・OG ネットワーク", value: 60, suffix: "+名", note: "産業界で活躍中" },
];

export const HISTORY: HistoryEntry[] = historyJson as HistoryEntry[];

export const RACES: Race[] = racesJson as Race[];

export const SUPPORT_WAYS: SupportWay[] = [
  {
    id: "financial",
    label: "01 / FUNDING",
    title: "活動資金のご支援",
    description:
      "マシン製作、大会遠征、部品購入など、チーム運営全般に充てさせていただきます。金額の大小は問いません。",
    examples: [
      "部品・材料費の一部補助",
      "大会遠征（静岡・エコパ）の交通費",
      "試験走行の会場費",
    ],
    give: [
      "マシン・ピットウェアへのロゴ掲出",
      "公式サイト・SNSでのご紹介",
      "活動報告書のお届け",
    ],
  },
  {
    id: "material",
    label: "02 / PARTS & TECH",
    title: "物品・技術のご提供",
    description:
      "現物での協力も大歓迎です。使われていない機材・部品・素材・試作サービスなど、形を問わずご相談ください。",
    examples: [
      "カーボン・アルミ等の素材提供",
      "機械加工・3Dプリント・溶接の協力",
      "計測機器・工具の貸与",
      "CFD / CAE ソフトのライセンス",
    ],
    give: [
      "技術協力パートナーとしてご紹介",
      "開発レポート・データの共有",
      "学生エンジニアとの技術交流",
    ],
  },
  {
    id: "facility",
    label: "03 / SPACE",
    title: "場所・設備のご提供",
    description:
      "試験走行場、工場見学、展示スペースなど、学生だけでは届かない環境をお借りできたら嬉しいです。",
    examples: [
      "テストコース・駐車場の貸与",
      "工場見学・実務体験の機会",
      "展示・発表スペースの提供",
    ],
    give: [
      "イベント・発表会へのご招待",
      "活動の様子を記事・動画化してご共有",
    ],
  },
  {
    id: "mentor",
    label: "04 / MENTORSHIP",
    title: "メンタリング・キャリア支援",
    description:
      "学生の成長そのものへのご支援。技術指導、インターン機会、OB/OGネットワークなど、長期的な関わりをお願いできる方を探しています。",
    examples: [
      "技術レビュー・アドバイス",
      "インターン・採用直結の接点",
      "OB/OG ネットワークへの参画",
    ],
    give: [
      "定例ミーティングでの接点",
      "学生メンバーとの継続的な関係",
    ],
  },
];

export const SPONSORS: Company[] = sponsorsJson as Company[];

export const SPECIAL_THANKS: string[] = [
  "日本大学生産工学部 自動車工学リサーチ・センター",
  "日本大学生産工学部 機械工学科 実習工場",
  "日本大学 理工学部",
  "CIT-Racing OB・OG会",
];

export const CONTACT_INFO = {
  email: "citracingteam@gmail.com",
  x: "https://twitter.com/cit_racing_team",
  xHandle: "@CIT_Racing_Team",
  instagram: "https://www.instagram.com/citracingteam",
  instagramHandle: "@citracingteam",
  website: "https://citracingteam.wixsite.com/cit-racing",
  address: "〒275-8575 千葉県習志野市泉町1-2-1 日本大学生産工学部 津田沼キャンパス 9号館",
  access: "京成本線 京成大久保駅から徒歩10分",
};

export const TEAM_VIDEO = {
  title: "TEAM VIDEO",
  label: "活動の様子を見る",
  driveFileId: "1Dlw7T9JkNmAZf6Q3mt8ywFAvh4JUmPhl",
  embedUrl:
    "https://drive.google.com/file/d/1Dlw7T9JkNmAZf6Q3mt8ywFAvh4JUmPhl/preview",
  externalUrl:
    "https://drive.google.com/file/d/1Dlw7T9JkNmAZf6Q3mt8ywFAvh4JUmPhl/view",
};

export const HERO_MEDIA = {
  videoSrc:
    "https://videos.pexels.com/video-files/2103099/2103099-uhd_3840_2160_30fps.mp4",
  posterSrc:
    "https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&w=1920&q=80",
  featureSrc: heroImagesJson.featureImages[0] ?? "/S__25518083_0.jpg",
  featureImages: heroImagesJson.featureImages,
};
