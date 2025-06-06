import React from "react";
import "./index.css";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  User,
  GraduationCap,
  Briefcase,
  Code,
} from "lucide-react";

const About = () => {
  const skills = [
    { name: "HTML", percentage: 76, color: "orange" },
    { name: "CSS", percentage: 62, color: "blue" },
    { name: "JavaScript", percentage: 47, color: "yellow" },
    { name: "Java", percentage: 63, color: "red" },
    { name: "React", percentage: 73, color: "cyan" },
    { name: "PHP", percentage: 58, color: "purple" },
    { name: "C#", percentage: 68, color: "green" },
    { name: "Python", percentage: 51, color: "indigo" },
  ];

  return (
    <div className="about-container">
      <div className="about-content">
        {/* Header */}
        <div className="about-header">
            <h1>About The Developer</h1>
          <div className="about-avatar">
            <User className="icon" />
          </div>
          <h2 className="name">Godfred Tawiah</h2>
          <p className="title">Web Developer</p>
          <p className="bio">
            I am Godfred Tawiah, a skilled and ambitious web developer with a
            passion for building dynamic and user-friendly websites. With a
            strong foundation in coding and a keen interest in innovative
            technologies, I am dedicated to delivering high-quality solutions
            that exceed expectations. I am excited to bring my creativity,
            expertise, and enthusiasm to every project I take on.
          </p>
        </div>

        {/* Contact Info */}
        <div className="contact-grid">
          <div className="contact-card">
            <Globe className="icon" />
            <h3>Website</h3>
            <a href="https://godfredtportflioone.netlify.app">
              godfredtportflioone.netlify.app
            </a>
          </div>
          <div className="contact-card">
            <Mail className="icon" />
            <h3>Email</h3>
            <a href="mailto:tawiahgodfred59@gmail.com">
              tawiahgodfred59@gmail.com
            </a>
          </div>
          <div className="contact-card">
            <Phone className="icon" />
            <h3>Phone</h3>
            <p>+233500005065</p>
          </div>
          <div className="contact-card">
            <MapPin className="icon" />
            <h3>Location</h3>
            <p>Accra & Koforidua, Ghana</p>
          </div>
          <div className="contact-card">
            <GraduationCap className="icon" />
            <h3>Degree</h3>
            <p>BSc. Information Technology</p>
          </div>
          <div className="contact-card">
            <Briefcase className="icon" />
            <h3>Freelance</h3>
            <span className="freelance-status">Available</span>
          </div>
        </div>

        {/* Skills */}
        <div className="skills-section">
          <div className="skills-header">
            <Code className="icon" />
            <h2>Technical Skills</h2>
          </div>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div key={index} className="skill-bar">
                <div className="skill-label">
                  <span>{skill.name}</span>
                  <span>{skill.percentage}%</span>
                </div>
                <div className="progress-background">
                  <div
                    className={`progress-fill ${skill.color}`}
                    style={{ width: `${skill.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Experience */}
        <div className="info-grid">
          <div className="info-card">
            <div className="info-header">
              <GraduationCap className="icon" />
              <h2>Education</h2>
            </div>
            <div className="timeline">
              <div className="timeline-item">
                <span className="date blue">2022 - 2025</span>
                <h3>Degree in Information Technology</h3>
                <p>
                  I earned a Bachelor's Degree in Information Technology from
                  University of Ghana, graduating in 2025/2026. Throughout my
                  studies, I developed a solid foundation in computer systems,
                  software development, and data management, with practical
                  skills in programming languages, database administration,
                  preparing me for a successful career in the tech industry.
                </p>
              </div>
              <div className="timeline-item">
                <span className="date green">2018 - 2021</span>
                <h3>WASSCE Certificate in Business</h3>
                <p>
                  I completed my secondary education with a Business focus,
                  studying Financial Accounting, Business Management, Elective
                  Mathematics, and Elective ICT. This led to obtaining my WASSCE
                  certificate and developing skills in financial analysis,
                  business planning, data analysis, and digital literacy
                </p>
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="info-header">
              <Briefcase className="icon" />
              <h2>Experience</h2>
            </div>
            <div className="timeline">
              <div className="timeline-item">
                <span className="date purple">2022 - 2025</span>
                <h3>Experience in Information Technology</h3>
                <p>
                  I have academic experience and skills gained through my
                  studies in Information Technology at the University of Ghana,
                  where I developed a solid foundation in web applications,
                  software development, and data management, with practical
                  skills in programming languages, database administration,
                  system adminstrations and network security including digital
                  forensics and network security
                </p>
              </div>
              <div className="timeline-item">
                <span className="date orange">Feb - Apr 2024</span>
                <h3>I.T Attachment Experience</h3>
                <p>
                  During my attachment at Koforidua Regional Hospital, I gained
                  hands-on experience in IT skills like Windows installation,
                  networking, IP configuration, server setup, and cable
                  terminating. This experience helped me apply theoretical
                  knowledge, develop problem-solving skills, and enhance my
                  understanding of IT concepts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
