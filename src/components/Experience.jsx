import { experience } from "../data/profileData.js";
import { SceneSection } from "./ScrollExperience.jsx";

export function Experience() {
  return (
    <SceneSection align="left" id="experience" kicker="02 / Firewall layers" title="Enterprise support traffic through firewall layers.">
      <div className="experience-feed">
        {experience.map((item) => (
          <article key={item.id}>
            <p className="card-kicker">
              {item.period} / {item.location}
            </p>
            <h3>{item.company}</h3>
            <p className="role-line">{item.role}</p>
            <p>{item.summary}</p>
            <ul>
              {item.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </SceneSection>
  );
}
