export const projects = [
  {
    title: 'Machine Learning Pipeline',
    githubUrl: 'https://github.com/zamaniali1995/ml-pipeline',
    // externalUrl: '',
    languages: ['Python', 'Flask', 'Sklearn', 'Scipy', 'Pandas'],
  },
  {
    title: 'My Portfolio Website',
    githubUrl: 'https://github.com/Feromond/jacob-mish-portfolio',
    externalUrl: 'https://JacobMish.com',
    languages: ['React', 'TypeScript', 'CSS', 'Framer Motion'],
  },
  {
    title: 'Rust Snake Game',
    githubUrl: 'https://github.com/Feromond/rust_snake_game',
    externalUrl:
      'https://github.com/Feromond/rust_snake_game/releases/tag/v1.0.0',
    languages: ['Rust', 'GGEZ'],
  },
  {
    title: 'Hypixel Bazaar Api',
    githubUrl: 'https://github.com/Feromond/hypixel-bazaar-api',
    externalUrl: '',
    languages: ['Rust', 'Hypixel Api'],
  },
  {
    title: 'Filtering Techniques',
    githubUrl: 'https://github.com/Feromond/FilteringTechniques',
    externalUrl: '',
    languages: ['Python', 'Numpy', 'Signal Processing'],
  },
  {
    title: 'Fast Fourier Transform In Rust',
    githubUrl: 'https://github.com/Feromond/fft_rust',
    externalUrl: '',
    languages: ['Rust', 'Python', 'Streamlit'],
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
    pdf: 'src/library/mishFergusonMosher2023.pdf',
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
    pdf: 'src/library/ns2021FergEtAlDas.pdf',
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
    title: 'Data Developer',
    company: 'Strathcona Resources LTD.',
    duration: 'March 2023 - Present',
    description: [
      'Utilized LLM Transformers to create a Q&A chatbot with contextual knowledge of company HR documentation.',
      'Developed a web app featuring Azure Single Sign-On authentication, managed group-based permissions, and integration with multiple APIs, centralizing access to diverse tools for enhanced user experience.',
      'Utilize various REST APIs to collect data, automate tasks, and gather insights for business intelligence purposes.',
      'Design and develop curated tables from raw data to provide valuable insights for various teams across the organization.',
      'Create automated workflows for efficient data collection, cleaning, and transformation, generating curated data ready for analysis and visualization.',
      'Optimize cloud compute costs by configuring ideal settings for specific tasks and improving script runtime efficiency.',
      'Implement data validation, data transformation, and data quality checks to ensure data consistency and accuracy.',
      'Stay current with industry trends and best practices in data engineering and technologies to continuously improve data infrastructure and workflows.',
    ],
  },
  {
    title: 'AI/Machine Learning Consultant (Contract)',
    company: 'CircutStream',
    duration: 'October 2023 - Present',
    description: [
      'Spearheaded the creation of the capstone project, a sophisticated Discord bot that integrates OpenAI APIs and traditional machine learning models, like recommender systems.',
      'Collaborated in the development of a comprehensive Machine Learning Pre-University Course, focusing on practical, student-centered learning',
      'Assisted in the meticulous planning of the course schedule, ensuring a coherent and progressive learning experience',
      'Played a key role in curating and determining the course content for each session, aligning theoretical knowledge with practical application',
      'Engineered the Discord bot to offer interactive and personalized topic recommendations, enhancing user engagement and the learning experience',
      'Continuously validated and refined course content and the final project, guaranteeing accuracy, relevance, and high educational value.',
    ],
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
  },
  {
    title: 'Undergraduate Researcher',
    company: 'University Of Calgary',
    duration: 'December 2020 – February 2022',
    description: [
      'Published and presented as primary speaker at EAGE Edinburgh',
      'Used Machine Learning / Convolutional Neural Networks (CNN’s) from Python Tensorflow to Detect Near Surface Geohazards from Distributed Acoustic Sensing (DAS) Data',
      'Utilized signal processing techniques to filter and process raw data',
      'Worked with AWS cloud computing to store and handle large data volumes',
      'Generated figures and graphics to display analysis and results',
      'Built interpretation of results from statistical analysis',
      'Published in Near Surface Geoscience Conference & Exhibition',
    ],
  },
]

export const navbarData = {
  navigator: [
    { name: 'Home' },
    { name: 'About' },
    { name: 'Projects' },
    { name: 'Contact' },
  ],
}
