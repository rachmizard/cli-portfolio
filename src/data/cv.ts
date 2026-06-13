// CV / resume data for the WinWord CV viewer window.
// Pure data module — no JSX, no logic, no React imports.

export interface ContactLink {
  label: string;
  value: string;
  href?: string;
}

export interface ExperienceRole {
  title: string;
  period: string;
}

export interface Experience {
  company: string;
  location: string;
  roles: ExperienceRole[];
  bullets: string[];
}

export interface Education {
  school: string;
  location: string;
  period: string;
  degree: string;
  note?: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface PortfolioLink {
  label: string;
  href: string;
  note?: string;
}

export interface Resume {
  name: string;
  title: string;
  location: string;
  contacts: ContactLink[];
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: SkillGroup[];
  certifications: string[];
  portfolio: PortfolioLink[];
}

export const RESUME: Resume = {
  name: "RACHMIZARD",
  title: "Full-Stack JavaScript Developer",
  location: "Bandung, Indonesia",
  contacts: [
    {
      label: "Email",
      value: "rachmizard11072000@gmail.com",
      href: "mailto:rachmizard11072000@gmail.com",
    },
    {
      label: "LinkedIn",
      value: "Rachmizard Z.",
      href: "https://www.linkedin.com/in/rachmizard",
    },
  ],
  summary:
    "A hard working and persistent web developer with over 5 years of experience. Previously worked in several information technology companies, both as front-end and back-end. Proven skills in React and the Next.js framework with TypeScript, mobile development using React Native and Flutter, and Node.js / Express web service APIs as a full-stack JavaScript developer.",
  experience: [
    {
      company: "Staffinc",
      location: "Jakarta Indonesia",
      roles: [
        {
          title: "Frontend Developer",
          period: "September 2021 – Present",
        },
      ],
      bullets: [
        "Created and implemented software solutions based on the specific requirements of products.",
        "Reduced the risk associated with excessive code by eliminating unused codebase, enhancing code reusability and test coverage.",
        "Engaged in the complete software development lifecycle: solution design, coding, code review, debugging, testing, and deployment.",
        "Collaborated with various stakeholder teams to address compliance and product enhancement needs.",
        "Utilised Next.js with a dynamic blend of JavaScript and TypeScript to build a responsive, user-friendly interface that integrated seamlessly with backend functionality.",
        "Maintained critical core application assets and artefacts, ensuring the software ecosystem's resilience and sustainability.",
        "Contributed to optimizations enhancing the speed and scalability of web applications by identifying and addressing performance bottlenecks.",
        "Translated intricate designs and wireframes into meticulously crafted, high-quality, user-centred code.",
        "Transformed Product Requirements Documents (PRDs) into comprehensive Software Design Documents (SDDs) to align concept and implementation for new features.",
      ],
    },
    {
      company: "PT Smooets Teknologi Outsourcing",
      location: "Bandung Indonesia",
      roles: [
        {
          title: "Frontend Developer",
          period: "April 2020 – September 2021",
        },
        {
          title: "Backend Developer",
          period: "June 2019 – March 2020",
        },
      ],
      bullets: [
        "Designed and built software solutions tailored to meet the specific requirements of clients.",
        "Deployed on-demand product updates and patches as needed.",
        "Assessed the practicality and viability of software prototypes.",
        "Made necessary code adjustments to resolve issues and eliminate bugs.",
        "Oversaw the ongoing maintenance of web applications.",
      ],
    },
    {
      company: "Birutekno Inc.",
      location: "Bandung Indonesia",
      roles: [
        {
          title: "Backend Developer",
          period: "May 2018 – February 2019",
        },
      ],
      bullets: [
        "Participated in designing web RESTful APIs.",
        "Maintained web applications.",
        "Fixed bugs and errors.",
        "Enhanced the previous codebase by increasing reusability.",
      ],
    },
  ],
  education: [
    {
      school: "Universitas Informatika dan Bisnis Indonesia",
      location: "Bandung",
      period: "September 2020 – Present",
      degree: "Bachelor of Computer Science in Informatics",
      note: "Employee Class Program",
    },
    {
      school: "Vocational High School 13",
      location: "Bandung",
      period: "July 2015 – July 2018",
      degree: "Software Engineering",
    },
  ],
  skills: [
    {
      label: "Frameworks / Systems",
      items: [
        "React",
        "React Native",
        "Flutter",
        "Node.js",
        "Next.js",
        "Express.js",
        "NestJS",
        "MongoDB",
        "SQL",
        "Firebase",
      ],
    },
    {
      label: "Languages",
      items: ["JavaScript / TypeScript", "PHP", "Dart"],
    },
    {
      label: "Spoken",
      items: ["Bahasa Indonesia (Fluent)", "English (Conversational)"],
    },
  ],
  certifications: [
    "React JS Course — Progate",
    "React - The Complete Guide (inc. Hooks, React Router, Redux) — Udemy",
    "JavaScript (Intermediate) — HackerRank",
    "JavaScript (Basic) — HackerRank",
    "Fullstack JavaScript Developer — BWA (Build With Angga)",
    "Go: The Complete Developer's Guide (Golang) — Udemy",
  ],
  portfolio: [
    {
      label: "rachmizard-portofolio-website.vercel.app",
      href: "https://rachmizard-portofolio-website.vercel.app",
      note: "Still improving",
    },
  ],
};
