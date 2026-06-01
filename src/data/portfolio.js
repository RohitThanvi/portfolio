export const ADMIN_CREDENTIALS = {
  username: "rohit",
  password: "admin2025"
};

export const defaultData = {
  hero: {
    name: "Rohit Thanvi",
    tagline: "AI/ML Engineer",
    subtitle: "Building intelligent systems at the intersection of research and production.",
    email: "rohitthanvi2005@gmail.com",
    github: "RohitThanvi",
    linkedin: "rohitthanvi",
    phone: "+91 84418 93995"
  },
  about: {
    bio: `AI/ML engineering undergraduate at SKIT Jaipur with a relentless focus on building systems that matter — from production-grade LLM pipelines to real-time cognitive fatigue detection for industrial workers. I work at the intersection of deep learning research and scalable engineering, where models need to run in the real world, not just on paper.`,
    bio2: `My work spans custom transformer architectures, edge-deployable neural networks, geospatial intelligence platforms, and distributed backend systems. I've built at ISRO, led engineering teams at Brudite, and contributed to systems that serve users across five countries.`,
    cgpa: "8.99",
    college: "Swami Keshvanand Institute of Technology",
    degree: "B.Tech in Computer Science Engineering",
    year: "2023 – Present"
  },
  research: [
    {
      id: 1,
      title: "Accepted Research Paper — NICE TEAS 2026",
      conference: "International Interdisciplinary Conference on Emerging Technologies, Engineering & Applied Sciences 2026",
      status: "Accepted for Presentation",
      year: "2026",
      description: "Research accepted and selected for presentation at NICE TEAS 2026, an international-level interdisciplinary conference focusing on emerging technologies and applied sciences."
    }
  ],
  experience: [
    {
      id: 1,
      company: "Indian Space Research Organisation (ISRO)",
      role: "Project Intern",
      period: "Aug 2025 – Sep 2025",
      location: "Jaipur, India",
      bullets: [
        "Cut manual validation time by 35% by engineering 6 Python-based anomaly-detection pipelines automating aerospace telemetry data quality checks across multi-source datasets.",
        "Spearheaded design of a proprietary code analysis platform replacing external scanners, securing analysis of 1.2 million lines of aerospace software under NDA.",
        "Authored an internal technical report on AI-based process automation adopted as a reference for future AI integration initiatives at the facility."
      ]
    },
    {
      id: 2,
      company: "Brudite Pvt. Ltd.",
      role: "Software Engineering Intern",
      period: "Jun 2025 – Aug 2025",
      location: "Jaipur, India",
      bullets: [
        "Delivered sub-2s LLM response latency at concurrent load by designing and building the FastAPI backend for MindGrid, an AI debate platform, with PostgreSQL for persistent session state.",
        "Led a team of 5 interns through full-stack delivery — scoping REST API contracts, reviewing pull requests, and coordinating integration milestones.",
        "Implemented an ELO-based ranking engine paired with an LLM argument-evaluation module, applying prompt engineering and tool/function calling to score debate quality programmatically."
      ]
    },
    {
      id: 3,
      company: "Software Technology Parks of India (STPI)",
      role: "Software Engineering Intern",
      period: "Jun 2025 – Aug 2025",
      location: "Jaipur, India",
      bullets: [
        "Reduced environment-related deployment failures by 50% by containerizing 4 microservices with Docker, standardizing runtime configs across dev and staging environments.",
        "Contributed to backend API design and frontend integration (FastAPI + React) within a 3-member agile team, delivering REST endpoints consumed by a production web application."
      ]
    }
  ],
  projects: [
    {
      id: 1,
      name: "IndicSLM",
      fullName: "Project SLM: An Indic Language Model",
      description: "A 16M-parameter decoder-only transformer trained on Indian history and Hindu philosophy, featuring BitLinear ternary quantization for 94% memory reduction and Multi-Head Latent Attention for 16× KV-cache compression.",
      tech: ["PyTorch", "Transformers", "BPE Tokenization", "BitLinear", "MLA", "DDP"],
      highlights: [
        "94% memory footprint reduction via 1.58-bit ternary quantization",
        "16× KV-cache compression with Multi-Head Latent Attention",
        "97.9% embedding table RAM reduction with custom 8K BPE tokenizer"
      ],
      category: "LLM / Research",
      github: "https://github.com/RohitThanvi",
      color: "#C9A84C"
    },
    {
      id: 2,
      name: "MindGrid",
      fullName: "MindGrid: AI Debate Platform",
      description: "Production AI debate platform with sub-2s LLM response latency at concurrent load. Features an ELO-based ranking engine paired with an LLM argument-evaluation module that scores debate quality programmatically.",
      tech: ["FastAPI", "PostgreSQL", "LLM Tool-calling", "ELO Ranking", "React", "Python"],
      highlights: [
        "Sub-2s LLM response latency under concurrent load",
        "ELO-based ranking engine with AI argument evaluation",
        "Full-stack delivery leading a team of 5 interns"
      ],
      category: "Full-Stack / AI",
      github: "https://github.com/RohitThanvi/Mind-Grid.git",
      color: "#2563EB"
    },
    {
      id: 3,
      name: "Project Vayu",
      fullName: "Project Vayu: Geospatial Intelligence Platform",
      description: "AI-powered conversational geospatial intelligence platform deployed to production serving users across 5 countries with <8s end-to-end response time. Integrates Llama 3.3 with Google Earth Engine.",
      tech: ["FastAPI", "React", "Google Earth Engine", "Llama 3.3", "RAG", "Sentinel-2"],
      highlights: [
        "Live in production — 5 countries, <8s end-to-end latency",
        "LLM tool-calling to translate natural language into Earth Engine API calls",
        "Processes 9 environmental metrics across Sentinel-2/Landsat/MODIS datasets"
      ],
      category: "AI / Geospatial",
      github: "https://github.com/RohitThanvi/Vayu.git",
      link: "#",
      color: "#10B981"
    },
    {
      id: 4,
      name: "NeuroPace Worker",
      fullName: "NeuroPace Worker: Cognitive Fatigue Detection",
      description: "Real-time cognitive fatigue detection system for industrial workers using EEG wearables. Features a Temporal Convolutional Attention Network (TCAN) architecture with IEC 60601-1 compliance alignment.",
      tech: ["EEG", "TCAN", "PyTorch", "OpenBCI Cyton", "Signal Processing", "IEC 60601-1"],
      highlights: [
        "Potential collaboration with Tsinghua University iWearables Center",
        "TCAN architecture with electrode impedance monitoring",
        "Bland-Altman validation against OpenBCI Cyton"
      ],
      category: "Wearable AI / Research",
      github: "https://github.com/RohitThanvi",
      color: "#8B5CF6"
    },
    {
      id: 5,
      name: "BioLock",
      fullName: "BioLock: ECG/EEG Biometric Authentication",
      description: "Adversarial-resistant biometric authentication system using ECG/EEG signals. Achieves 99.8% classification accuracy on controlled datasets, targeting high-security deployments in banking and aerospace.",
      tech: ["CNN", "ECG/EEG", "PyTorch", "Biometrics", "Signal Processing"],
      highlights: [
        "99.8% classification accuracy on controlled datasets",
        "Identity-space encoding 2^256 unique biometric signatures",
        "Targeting banking and aerospace high-security deployments"
      ],
      category: "Security / AI",
      github: "https://github.com/RohitThanvi",
      color: "#EF4444"
    },
    {
      id: 6,
      name: "RohitChess",
      fullName: "RohitChess 1.0: Custom Chess Engine",
      description: "A complete UCI-compliant chess engine in C++ targeting 1800–2000 Elo. Built with 0x88 board representation, iterative deepening alpha-beta pruning, Zobrist hashing, and MVV-LVA move ordering.",
      tech: ["C++", "UCI Protocol", "Alpha-Beta Pruning", "Zobrist Hashing", "0x88"],
      highlights: [
        "Target rating: 1800–2000 Elo",
        "0x88 board representation with iterative deepening",
        "Zobrist hashing + MVV-LVA move ordering"
      ],
      category: "Systems / C++",
      github: "https://github.com/RohitThanvi/Chess-Engine.git",
      color: "#F59E0B"
    }
  ],
  skills: {
    languages: ["Python", "C++", "Java", "SQL", "JavaScript"],
    aiml: ["PyTorch", "Transformers", "LLMs", "RAG Pipelines", "BPE Tokenization", "BitLinear Quantization", "Anomaly Detection", "Signal Processing", "EEG/ECG", "CNN", "LSTM"],
    backend: ["FastAPI", "Flask", "REST APIs", "Microservice Architecture", "Docker", "Linux"],
    cloud: ["Google Earth Engine", "Render", "Vercel", "Docker", "CI/CD"],
    databases: ["PostgreSQL", "MongoDB", "MySQL", "Vector Search"],
    certs: ["Certified Ethical Hacker (CEH)", "Google Data Analytics"]
  }
};
