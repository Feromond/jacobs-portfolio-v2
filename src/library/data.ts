import mishFergusonMosher2023 from '../assets/mishFergusonMosher2023.pdf'
import fergusonMosherDettmerMish2021 from '../assets/ns2021FergEtAlDas.pdf'
import strathconaLogo from '../assets/strathconaLogo.png'
import altaMlLogo from '../assets/altaml-logo.png'
import circuitStreamLogo from '../assets/circuitstreamlogo.png'
import uOfCLogo from '../assets/uofcLogo.png'
import metaLogo from '../assets/meta_logo_black.svg'
import budgetTrackerTuiScreenshot from '../assets/budget_tracker_tui_screenshot.png'
import portfolioWebsiteScreenshot from '../assets/portfolio_website_screenshot.png'
import rustSnakeGameScreenshot from '../assets/snake_game_screenshot.png'
import mlPipelineScreenshot from '../assets/ml_pipeline_screenshot.jpg'
import oldPortfolioScreenshot from '../assets/old_portfolio_screenshot.png'
import fftScreenshot from '../assets/fft_filtering_screenshot.png'
import extractFiletypeZipScreenshot from '../assets/extractfiletype_gui_screenshot.png'
import hypixelBazaarApiScreenshot from '../assets/hypixel_bazaar_api_screenshot.png'

export const projects = [
  {
    title: 'Budget Tracker TUI',
    githubUrl: 'https://github.com/Feromond/budget_tracker_tui',
    externalUrl: 'https://github.com/Feromond/budget_tracker_tui/releases',
    screenshotImage: budgetTrackerTuiScreenshot,
    languages: ['Rust', 'TUI', 'Finance', 'CLI'],
  },
  {
    title: 'My Portfolio Website',
    githubUrl: 'https://github.com/Feromond/jacobs-portfolio-v2',
    externalUrl: 'https://JacobMish.com',
    screenshotImage: portfolioWebsiteScreenshot,
    languages: ['React', 'TypeScript', 'CSS', 'Framer Motion'],
  },
  {
    title: 'Rust Snake Game',
    githubUrl: 'https://github.com/Feromond/rust_snake_game',
    externalUrl: 'https://github.com/Feromond/rust_snake_game/releases',
    screenshotImage: rustSnakeGameScreenshot,
    languages: ['Rust', 'GGEZ'],
  },
  {
    title: 'Machine Learning Pipeline',
    githubUrl: 'https://github.com/zamaniali1995/ml-pipeline',
    // externalUrl: '',
    screenshotImage: mlPipelineScreenshot,
    languages: ['Python', 'Flask', 'Sklearn', 'Scipy', 'Pandas'],
  },

  {
    title: 'My Legacy Portfolio Website',
    githubUrl: 'https://github.com/Feromond/jacob-mish-portfolio',
    externalUrl: 'https://jacobmish-old.netlify.app',
    screenshotImage: oldPortfolioScreenshot,
    languages: ['React', 'Javascript', 'Material UI'],
  },

  {
    title: 'Hypixel-API-Lib',
    githubUrl: 'https://github.com/Feromond/hypixel-api-lib',
    // externalUrl: '',
    // screenshotImage: '',
    languages: ['Python', 'Hypixel Api', 'Library', 'OOP'],
  },
  {
    title: 'Filtering Techniques',
    githubUrl: 'https://github.com/Feromond/FilteringTechniques',
    // externalUrl: '',
    screenshotImage: fftScreenshot,
    languages: ['Python', 'Numpy', 'Signal Processing'],
  },

  {
    title: 'Extract Filetype from ZIP GUI',
    githubUrl: 'https://github.com/Feromond/extract_filetype_from_zip_gui',
    externalUrl:
      'https://github.com/Feromond/extract_filetype_from_zip_gui/releases',
    screenshotImage: extractFiletypeZipScreenshot,
    languages: ['Rust', 'GUI', 'File Extraction', 'ZIP'],
  },
  {
    title: 'Hypixel Bazaar API',
    githubUrl: 'https://github.com/Feromond/hypixel-bazaar-api',
    externalUrl: 'https://github.com/Feromond/hypixel-bazaar-api/releases',
    screenshotImage: hypixelBazaarApiScreenshot,
    languages: ['Rust', 'API', 'Hypixel', 'Data Analysis'],
  },
]

export const publications = [
  {
    title:
      'Distributed Acoustic Sensing and Machine Learning: Rockfall Detection at Mt. Meager, B.C.',
    authors: 'Mish, J., Ferguson, R., Mosher, C.',
    conference:
      'NSG2023 29th European Meeting of Environmental and Engineering Geophysics, Sep 2023, Volume 2023, p.1 - 5',
    year: 2023,
    link: 'https://doi.org/10.3997/2214-4609.202320030',
    additional: '',
    pdf: mishFergusonMosher2023,
  },
  {
    title:
      'Distributed Acoustic Sensing of daylight on a glacier in Canada: Hotspot Monitoring',
    authors: 'Ferguson, R., Mosher, C., Dettmer, J., & Mish, J.',
    conference:
      'NSG2021 27th European Meeting of Environmental and Engineering Geophysics',
    year: 2021,
    link: 'https://doi.org/10.3997/2214-4609.202120218',
    additional: '',
    pdf: fergusonMosherDettmerMish2021,
  },
  {
    title: 'Javaseis cloud: A cloud-native framework for seismic io.',
    authors: 'Mosher, C. M., S. Sood, R. J. Ferguson, and Mish, J.',
    conference: '2022 Rice Oil & Gas HPC Conference',
    year: 2022,
    link: 'https://www.youtube.com/watch?v=fhp6-SSGkXg',
    additional: 'Video Recording, Houston, United States',
    pdf: '',
  },
]

export const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/Feromond',
    icon: 'Github',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/jacob-mish-25915722a/',
    icon: 'LinkedIn',
  },
  {
    name: 'Email',
    url: 'mailto:jacobpmish@gmail.com',
    icon: 'Blog',
  },
]

export const experiences = [
  {
    title: 'Software Engineer',
    company: 'Meta Platforms, Inc.',
    duration: 'February 2025 - Present',
    description: [
      'Working on Foundations & Monitization for Meta GenAI.',
      'Develop and maintain UI components using React, enhancing the user experience for data labeling workflows.',
      'Contribute to backend development in Hack/PHP, optimizing system performance.',
      'Debug, monitor, and resolve issues to ensure system reliability.',
      'Write and maintain test cases to improve stability and prevent regressions.',
      'Collaborate with cross-functional teams to enhance system functionality.',
    ],
    logo: metaLogo,
  },
  {
    title: 'Data Developer',
    company: 'Strathcona Resources LTD.',
    duration: 'March 2023 - February 2025',
    description: [
      'Developed a web app saving $350,000 yearly, featuring Azure Single Sign-On authentication, managed group-based permissions, and integration with multiple APIs, centralizing access to diverse tools for enhanced user experience.',
      'Utilized LLM Transformers to create a Q&A chatbot with contextual knowledge of company HR documentation.',
      'Utilize various REST APIs to collect data, automate tasks, and gather insights for business intelligence purposes.',
      'Design and develop curated tables from raw data to provide valuable insights for various teams across the organization.',
      'Create automated workflows (ETLs) for efficient data collection, cleaning, and transformation, generating curated data ready for analysis and visualization.',
      'Optimize cloud compute costs by configuring ideal settings for specific tasks and improving script runtime efficiency.',
      'Implement data validation, data transformation, and data quality checks to ensure data consistency and accuracy.',
      'Stay current with industry trends and best practices in data engineering and technologies to continuously improve data infrastructure and workflows.',
    ],
    logo: strathconaLogo,
  },
  {
    title: 'AI/Machine Learning Consultant (Contract)',
    company: 'CircutStream',
    duration: 'October 2023 - May 2024',
    description: [
      'Spearheaded the creation of the capstone project, a sophisticated Discord bot that integrates OpenAI APIs and traditional machine learning models, like recommender systems.',
      'Collaborated in the development of a comprehensive Machine Learning Pre-University Course, focusing on practical, student-centered learning',
      'Assisted in the meticulous planning of the course schedule, ensuring a coherent and progressive learning experience',
      'Played a key role in curating and determining the course content for each session, aligning theoretical knowledge with practical application',
      'Engineered the Discord bot to offer interactive and personalized topic recommendations, enhancing user engagement and the learning experience',
      'Continuously validated and refined course content and the final project, guaranteeing accuracy, relevance, and high educational value.',
    ],
    logo: circuitStreamLogo,
  },
  {
    title: 'Associate Machine Learning Developer (4-Month Contract)',
    company: 'AltaML',
    duration: 'September 2022 - December 2022',
    description: [
      'Implemented tree-based regression algorithms for predicting the permeability of rock core images with an accuracy of 94%, saving the client upwards of $10 million dollars.',
      'Conducted error analysis to further improve model performance.',
      'Prepared visualizations and presented weekly updates to clients.',
      'Developed a Machine Learning pipeline from scratch on Azure.',
      'Competed in a Microsoft-hosted hackathon, and created an application utilizing Natural Language Processing (NLP) to extract moods from journals.',
    ],
    logo: altaMlLogo,
  },
  {
    title: 'Undergraduate Researcher',
    company: 'University Of Calgary',
    duration: 'December 2020 – February 2022',
    description: [
      'Published and presented as primary speaker at EAGE Edinburgh',
      'Used Machine Learning / Convolutional Neural Networks (CNNs) from Python Tensorflow to Detect Near Surface Geohazards from Distributed Acoustic Sensing (DAS) Data',
      'Utilized signal processing techniques to filter and process raw data',
      'Worked with AWS cloud computing to store and handle large data volumes',
      'Generated figures and graphics to display analysis and results',
      'Built interpretation of results from statistical analysis',
      'Published in Near Surface Geoscience Conference & Exhibition',
    ],
    logo: uOfCLogo,
  },
]

export const navbarData = {
  navigator: [
    { name: 'Home', icon: 'Home' },
    { name: 'About', icon: 'User' },
    { name: 'Experience', icon: 'Briefcase' },
    { name: 'Projects', icon: 'Code' },
    { name: 'Contact', icon: 'Mail' },
  ],
}

export const skills = [
  // Programming Languages
  { name: 'Python', category: 'Programming' },
  { name: 'TypeScript', category: 'Programming' },
  { name: 'JavaScript', category: 'Programming' },
  { name: 'Rust', category: 'Programming' },
  { name: 'SQL', category: 'Programming' },
  { name: 'PHP/Hack', category: 'Programming' },
  { name: 'Go', category: 'Programming' },
  { name: 'Java', category: 'Programming' },
  { name: 'Swift', category: 'Programming' },

  // Frontend
  { name: 'React', category: 'Frontend' },
  { name: 'React Native', category: 'Frontend' },
  { name: 'HTML/CSS', category: 'Frontend' },
  { name: 'Framer Motion', category: 'Frontend' },

  // Backend
  { name: 'Node.js', category: 'Backend' },
  { name: 'REST APIs', category: 'Backend' },
  { name: 'Flask', category: 'Backend' },
  { name: 'GraphQL', category: 'Backend' },

  // Data Science & ML
  { name: 'Machine Learning', category: 'Data Science' },
  { name: 'TensorFlow', category: 'Data Science' },
  { name: 'PyTorch', category: 'Data Science' },
  { name: 'Data Visualization', category: 'Data Science' },
  { name: 'LLM Transformers', category: 'Data Science' },
  { name: 'NLP', category: 'Data Science' },
  { name: 'Recommender Systems', category: 'Data Science' },
  { name: 'Signal Processing', category: 'Data Science' },

  // Database
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Databricks SQL', category: 'Database' },
  { name: 'Microsoft SQL Server', category: 'Database' },
  { name: 'Oracle SQL', category: 'Database' },

  // Cloud & DevOps
  { name: 'AWS', category: 'Cloud' },
  { name: 'Azure', category: 'Cloud' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'Git/GitHub', category: 'DevOps' },
  { name: 'Azure DevOps', category: 'DevOps' },
  { name: 'GitLab', category: 'DevOps' },
  { name: 'Firebase', category: 'Cloud' },

  // Data Engineering
  { name: 'ETL Pipelines', category: 'Data Engineering' },
  { name: 'Databricks', category: 'Data Engineering' },
  { name: 'Data Validation', category: 'Data Engineering' },
  { name: 'Data Transformation', category: 'Data Engineering' },

  // Visualization
  { name: 'Plotly', category: 'Visualization' },
  { name: 'Matplotlib', category: 'Visualization' },
  { name: 'Seaborn', category: 'Visualization' },
  { name: 'Tableau', category: 'Visualization' },
  { name: 'PowerBI', category: 'Visualization' },

  // Tools & Frameworks
  { name: 'Streamlit', category: 'Framework' },
  { name: 'Azure ML Studio', category: 'Tool' },
  { name: 'SSO Authentication', category: 'Security' },
]
