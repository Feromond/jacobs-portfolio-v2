import mishFergusonMosher2023 from '../assets/mishFergusonMosher2023.pdf'
import fergusonMosherDettmerMish2021 from '../assets/ns2021FergEtAlDas.pdf'

import kolenaLogo from '../assets/img/logos/kolena.webp'
import metaLogo from '../assets/img/logos/meta.svg'
import strathconaLogo from '../assets/img/logos/strathcona.svg'
import circuitStreamLogo from '../assets/img/logos/circuitstream.webp'
import altaMlLogo from '../assets/img/logos/altaml.webp'
import uOfCLogo from '../assets/img/logos/uofc.webp'

import ventraMark from '../assets/img/projects/ventra-mark.webp'
import ventraLinkShot from '../assets/img/projects/ventra-link.webp'
import ventraLinkIcon from '../assets/img/projects/ventra-link-icon.webp'
import ventraLinkTour from '../assets/video/ventra-link-tour.mp4'
import budgetTrackerShot from '../assets/img/projects/budget-tracker.webp'
import budgetTrackerIcon from '../assets/img/projects/budget-tracker-icon.webp'
import budgetTrackerTour from '../assets/video/budget-tour.mp4'
import fourInARowShot from '../assets/img/projects/four-in-a-row.webp'
import fourInARowIcon from '../assets/img/projects/four-in-a-row-icon.webp'

import hypixelSdkImage from '../assets/img/projects/hypixel-sdk.webp'
import hypixelBazaarTuiShot from '../assets/img/projects/hypixel-bazaar-tui.webp'
import ventraBotImage from '../assets/img/projects/ventra-bot.webp'
import ventraMinecraftShot from '../assets/img/projects/ventra-minecraft.webp'
import snakeShot from '../assets/img/projects/snake.webp'
import extractZipShot from '../assets/img/projects/extract-zip.webp'
import filteringShot from '../assets/img/projects/filtering.webp'
import mlPipelineShot from '../assets/img/projects/ml-pipeline.webp'

export const GITHUB_USER = 'Feromond'

export interface Link {
  label: string
  href: string
}

export interface Experience {
  title: string
  company: string
  url: string
  from: string
  to: string | null
  location: string
  summary: string
  highlights: string[]
  logo: string
  logoBg: string
  color: string
}

export interface FeaturedProject {
  title: string
  summary: string
  year: number
  category: ProjectCategory
  palette?: 'fern' | 'ledger'
  headline: string
  description: string
  icon: string
  image: string
  video?: string
  repo?: string
  stack: string
  install?: string
  links: Link[]
}

export interface Project {
  title: string
  description: string
  image: string
  icon?: string
  imageFit?: 'cover' | 'contain'
  focus?: string
  repo?: string
  href: string
  links: Link[]
  stack: string
  year: number
  category: ProjectCategory
  ventra?: boolean
  featured?: boolean
}

export type ProjectCategory = 'Apps' | 'Tools' | 'Data and ML' | 'Community'

export interface ArchivedProject {
  title: string
  note: string
  href: string
}

export const ventra = {
  name: 'Ventra Software',
  url: 'https://ventra.dev',
  mark: ventraMark,
  since: 2025,
}

const experienceEntries: Experience[] = [
  {
    title: 'Senior Software Engineer',
    company: 'Kolena',
    url: 'https://www.kolena.com',
    from: '2026-03',
    to: null,
    location: 'Remote',
    summary:
      'I work across the Kolena Agents platform, with a focus on backend systems.',
    highlights: [
      'Launched self-serve signup so new customers could create a workspace and start using Kolena on their own.',
      'Built the Kolena Agents app for iPhone and iPad on my own, from the first design to the App Store release. Customers can upload files, track agent runs, and review results on mobile.',
      'Built a usage API and Python SDK so customers could track Kolena credits in their own reporting tools.',
      'Added credit balances and usage alerts so customers could see what they had left and know when they were approaching a limit.',
      'Made file sync roughly 10× faster across all cloud integrations while using a fraction of the memory.',
    ],
    logo: kolenaLogo,
    logoBg: 'transparent',
    color: '#8b5cf6',
  },
  {
    title: 'Software Engineer',
    company: 'Meta',
    url: 'https://www.meta.com',
    from: '2025-02',
    to: null,
    location: 'Remote',
    summary: 'I work on Foundations and Monetization for Meta GenAI.',
    highlights: [
      'Helped product teams meet tight deadlines by narrowing urgent requests to the changes they needed for release.',
      'Became a go-to engineer when teams needed a quick technical answer or help getting a release ready.',
      'Built and maintained the React tools that teams used to label data for Meta GenAI.',
      'Improved the performance of Hack/PHP services supporting Foundations and Monetization.',
      'Worked with partner teams to resolve production issues and added regression tests to catch repeat failures.',
    ],
    logo: metaLogo,
    logoBg: '#ffffff',
    color: '#0a84ff',
  },
  {
    title: 'Data Developer',
    company: 'Strathcona Resources',
    url: 'https://www.strathconaresources.com',
    from: '2023-03',
    to: '2025-02',
    location: 'Calgary, AB',
    summary:
      'Internal web apps, ETL pipelines, and LLM tooling for business intelligence.',
    highlights: [
      'Built a web app saving $350,000 a year, with Azure single sign-on, group-based permissions, and integrations with multiple APIs to centralize access to internal tools.',
      'Used LLM transformers to build a Q&A chatbot with contextual knowledge of company HR documentation.',
      'Pulled data from many REST APIs into curated tables used by teams across the organization.',
      'Built automated ETL workflows with validation and quality checks, keeping data accurate and ready for analysis.',
      'Cut cloud compute costs by tuning cluster settings per workload and speeding up scripts.',
    ],
    logo: strathconaLogo,
    logoBg: '#ffffff',
    color: '#3fb950',
  },
  {
    title: 'AI/ML Consultant',
    company: 'CircuitStream',
    url: 'https://circuitstream.com',
    from: '2023-10',
    to: '2024-05',
    location: 'Contract',
    summary:
      'Co-developed a pre-university machine learning course and its capstone project.',
    highlights: [
      'Led the capstone project: a Discord bot combining OpenAI APIs with traditional ML models such as recommender systems.',
      'Co-developed a practical, student-centered Machine Learning pre-university course.',
      'Planned the course schedule and curated content for each session, pairing theory with hands-on practice.',
      'Built personalized topic recommendations into the bot to make learning more interactive.',
    ],
    logo: circuitStreamLogo,
    logoBg: '#ffffff',
    color: '#ff9f0a',
  },
  {
    title: 'Associate ML Developer',
    company: 'AltaML',
    url: 'https://www.altaml.com',
    from: '2022-09',
    to: '2022-12',
    location: 'Contract',
    summary:
      'Tree-based models predicting rock permeability from core images with 94% accuracy.',
    highlights: [
      'Implemented tree-based regression models predicting the permeability of rock core images with 94% accuracy, saving the client upwards of $10 million.',
      'Ran error analysis to further improve model performance.',
      'Prepared visualizations and presented weekly updates to the client.',
      'Built a machine learning pipeline from scratch on Azure.',
      'Competed in a Microsoft-hosted hackathon with an NLP app that extracts moods from journals.',
    ],
    logo: altaMlLogo,
    logoBg: '#000000',
    color: '#64d2ff',
  },
  {
    title: 'Undergraduate Researcher',
    company: 'University of Calgary',
    url: 'https://www.ucalgary.ca',
    from: '2020-12',
    to: '2022-02',
    location: 'Calgary, AB',
    summary:
      'CNNs for detecting near-surface geohazards in Distributed Acoustic Sensing data.',
    highlights: [
      'Used convolutional neural networks in TensorFlow to detect near-surface geohazards from Distributed Acoustic Sensing (DAS) data.',
      'Published and presented as primary speaker at EAGE Near Surface Geoscience in Edinburgh.',
      'Applied signal processing techniques to filter and process raw data.',
      'Stored and processed large data volumes on AWS.',
    ],
    logo: uOfCLogo,
    logoBg: '#ffffff',
    color: '#ff453a',
  },
]

const endKey = (e: Experience) => e.to ?? '9999-12'

export const experiences = [...experienceEntries].sort(
  (a, b) => endKey(b).localeCompare(endKey(a)) || b.from.localeCompare(a.from)
)

export const featuredProjects: FeaturedProject[] = [
  {
    title: 'Ventra Link',
    summary: 'Private, peer-to-peer messages and calls.',
    year: 2026,
    category: 'Apps',
    palette: 'fern',
    headline: 'Messages and calls that go straight to them.',
    description:
      'Private, peer-to-peer messaging with voice and video calls up to 4K. End-to-end encrypted, with no account, no phone number, and nobody in the middle.',
    icon: ventraLinkIcon,
    image: ventraLinkShot,
    video: ventraLinkTour,
    stack: 'Rust · macOS, Windows, Linux, iOS, Android',
    links: [
      { label: 'Learn more', href: 'https://ventra.dev/ventra-link' },
      { label: 'App Store', href: 'https://apps.apple.com/app/id6824746233' },
      {
        label: 'Releases',
        href: 'https://github.com/Feromond/ventra-link-releases/releases',
      },
    ],
  },
  {
    title: 'Budget Tracker',
    summary: 'A keyboard-driven budget tracker for the terminal.',
    year: 2025,
    category: 'Tools',
    palette: 'ledger',
    headline: 'Your whole budget, from the keyboard.',
    description:
      'Track spending, adjust your budget over time, and keep tabs on investments and debt payoff from the terminal. Your data stays in one SQLite file on your machine.',
    icon: budgetTrackerIcon,
    image: budgetTrackerShot,
    video: budgetTrackerTour,
    repo: 'budget-tracker-tui',
    stack: 'Rust · SQLite · Homebrew and crates.io',
    install: 'brew install budget-tracker',
    links: [
      { label: 'Learn more', href: 'https://ventra.dev/budget-tracker' },
      {
        label: 'GitHub',
        href: 'https://github.com/Feromond/budget-tracker-tui',
      },
    ],
  },
]

export const projects: Project[] = [
  {
    title: 'Hypixel SDK',
    description:
      'A typed, async Rust SDK for the Hypixel API, with Python bindings built using PyO3.',
    image: hypixelSdkImage,
    focus: 'center 42%',
    repo: 'hypixel-sdk',
    href: 'https://github.com/Feromond/hypixel-sdk',
    links: [
      { label: 'crates.io', href: 'https://crates.io/crates/hypixel-sdk' },
      { label: 'PyPI', href: 'https://pypi.org/project/hypixel-sdk/' },
    ],
    stack: 'Rust · Python',
    year: 2026,
    category: 'Tools',
  },
  {
    title: 'Hypixel Bazaar TUI',
    description:
      'Live SkyBlock bazaar prices in the terminal, with search, spreads, and order book charts.',
    image: hypixelBazaarTuiShot,
    repo: 'hypixel-bazaar-tui',
    href: 'https://github.com/Feromond/hypixel-bazaar-tui',
    links: [
      {
        label: 'crates.io',
        href: 'https://crates.io/crates/hypixel-bazaar-tui',
      },
    ],
    stack: 'Rust · Ratatui',
    year: 2025,
    category: 'Tools',
  },
  {
    title: '4 In A Row Solver',
    description:
      'Play four in a row against a solver that searches every move ahead, on iPhone, iPad, and Mac.',
    image: fourInARowShot,
    icon: fourInARowIcon,
    repo: 'connect_four_solver',
    href: 'https://ventra.dev/four-in-a-row',
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/app/id6757250440' },
    ],
    stack: 'Swift · Rust',
    year: 2025,
    category: 'Apps',
    ventra: true,
  },
  {
    title: 'Ventra Minecraft',
    description:
      'I’ve run the same Minecraft world for friends and family since 2019. It has its own modpack and a live map.',
    image: ventraMinecraftShot,
    href: 'https://ventra.dev/minecraft',
    links: [{ label: 'Live map', href: 'https://map.ventra.dev' }],
    stack: 'Server ops · Modrinth',
    year: 2019,
    category: 'Community',
    ventra: true,
  },
  {
    title: 'Ventra Bot',
    description:
      'A Discord bot with custom commands for the Ventra Minecraft server and community.',
    image: ventraBotImage,
    focus: 'center 34%',
    repo: 'ventra-bot',
    href: 'https://github.com/Feromond/ventra-bot',
    links: [],
    stack: 'Python · Discord API',
    year: 2025,
    category: 'Community',
    ventra: true,
  },
  {
    title: 'Rust Snake Game',
    description:
      'A small snake game with wall and self collisions, growth, and a high score.',
    image: snakeShot,
    repo: 'rust_snake_game',
    href: 'https://github.com/Feromond/rust_snake_game',
    links: [],
    stack: 'Rust · GGEZ',
    year: 2024,
    category: 'Apps',
  },
  {
    title: 'Extract Filetype from ZIP',
    description:
      'Pull only the file types you want out of one or many ZIP archives into a flat folder.',
    image: extractZipShot,
    imageFit: 'contain',
    repo: 'extract_filetype_from_zip_gui',
    href: 'https://github.com/Feromond/extract_filetype_from_zip_gui',
    links: [],
    stack: 'Rust · Desktop GUI',
    year: 2025,
    category: 'Apps',
  },
  {
    title: 'Filtering Techniques',
    description:
      'Prediction, bandpass, and matched filters applied to geophysical signal data.',
    image: filteringShot,
    repo: 'FilteringTechniques',
    href: 'https://github.com/Feromond/FilteringTechniques',
    links: [],
    stack: 'Python · NumPy',
    year: 2022,
    category: 'Data and ML',
  },
  {
    title: 'Machine Learning Pipeline',
    description:
      'A template ML pipeline with a Flask front end for training and serving models.',
    image: mlPipelineShot,
    imageFit: 'contain',
    href: 'https://github.com/zamaniali1995/ml-pipeline',
    links: [],
    stack: 'Python · Flask · scikit-learn',
    year: 2023,
    category: 'Data and ML',
  },
]

export const archivedProjects: ArchivedProject[] = [
  {
    title: 'Hypixel-API-Lib',
    note: 'Superseded by Hypixel SDK',
    href: 'https://github.com/Feromond/hypixel-api-lib',
  },
  {
    title: 'Hypixel Bazaar API',
    note: 'Superseded by Hypixel Bazaar TUI',
    href: 'https://github.com/Feromond/hypixel-bazaar-api',
  },
  {
    title: 'Legacy portfolio',
    note: 'React and Material UI',
    href: 'https://jacobmish-old.netlify.app',
  },
]

export interface Publication {
  title: string
  authors: string
  venue: string
  venueShort: string
  place?: string
  year: number
  type: 'Paper' | 'Talk'
  role: string
  link: string
  pdf: string
}

const publicationEntries: Publication[] = [
  {
    title:
      'Distributed Acoustic Sensing and Machine Learning: Rockfall Detection at Mt. Meager, B.C.',
    authors: 'Mish, J., Ferguson, R., Mosher, C.',
    venue:
      'NSG2023, 29th European Meeting of Environmental and Engineering Geophysics',
    venueShort: 'NSG2023',
    place: 'Edinburgh',
    year: 2023,
    type: 'Paper',
    role: 'First author and presenter',
    link: 'https://doi.org/10.3997/2214-4609.202320030',
    pdf: mishFergusonMosher2023,
  },
  {
    title: 'Javaseis Cloud: A cloud-native framework for seismic IO',
    authors: 'Mosher, C. M., Sood, S., Ferguson, R. J., Mish, J.',
    venue: '2022 Rice Oil & Gas HPC Conference',
    venueShort: 'Rice HPC 2022',
    place: 'Houston',
    year: 2022,
    type: 'Talk',
    role: 'Co-author',
    link: 'https://www.youtube.com/watch?v=fhp6-SSGkXg',
    pdf: '',
  },
  {
    title:
      'Distributed Acoustic Sensing of daylight on a glacier in Canada: Hotspot Monitoring',
    authors: 'Ferguson, R., Mosher, C., Dettmer, J., Mish, J.',
    venue:
      'NSG2021, 27th European Meeting of Environmental and Engineering Geophysics',
    venueShort: 'NSG2021',
    year: 2021,
    type: 'Paper',
    role: 'Co-author',
    link: 'https://doi.org/10.3997/2214-4609.202120218',
    pdf: fergusonMosherDettmerMish2021,
  },
]

export const publications = [...publicationEntries].sort(
  (a, b) => b.year - a.year
)

export const contactLinks = {
  email: 'mailto:jacobpmish@gmail.com',
  linkedin: 'https://www.linkedin.com/in/jacob-mish/',
  github: 'https://github.com/Feromond',
  ventra: 'https://ventra.dev',
}

export const navItems = [
  { id: 'home', label: 'Home', icon: 'Home' },
  { id: 'about', label: 'About', icon: 'User' },
  { id: 'experience', label: 'Experience', icon: 'Briefcase' },
  { id: 'projects', label: 'Projects', icon: 'Code' },
  { id: 'contact', label: 'Contact', icon: 'Mail' },
] as const

export const skillGroups = [
  {
    label: 'Languages',
    items: ['Rust', 'Python', 'TypeScript', 'Swift', 'SQL', 'Hack/PHP'],
  },
  {
    label: 'Apps and web',
    items: ['React', 'SwiftUI', 'Node.js', 'Terminal UIs'],
  },
  {
    label: 'Data and ML',
    items: ['PyTorch', 'LLMs', 'Data pipelines', 'Signal processing'],
  },
  {
    label: 'Platforms',
    items: ['AWS', 'Azure', 'Cloudflare', 'Databricks', 'PostgreSQL'],
  },
]
