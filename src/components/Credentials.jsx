import { certifications, education } from "../data/profileData.js";
import { SceneSection } from "./ScrollExperience.jsx";

export function Certifications() {
  return (
    <SceneSection align="right" id="certifications" kicker="05 / Certifications" title="Certifications that support the technical work.">
      <div className="credential-overlay">
        {certifications.map((certification, index) => (
          <span key={certification}>
            {String(index + 1).padStart(2, "0")} / {certification}
          </span>
        ))}
      </div>
    </SceneSection>
  );
}

export function Education() {
  return (
    <SceneSection align="left" id="education" kicker="06 / Education" title="Cybersecurity depth over engineering foundations.">
      <div className="education-overlay">
        {education.map((item) => (
          <article key={item.degree}>
            <p className="card-kicker">{item.institution}</p>
            <h3>{item.degree}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </SceneSection>
  );
}
