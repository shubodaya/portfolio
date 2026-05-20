import { about } from "../data/profileData.js";
import { SceneSection } from "./ScrollExperience.jsx";

export function About() {
  return (
    <SceneSection align="right" id="about" kicker="01 / Network security" title={about.title}>
      <p>{about.body}</p>
      <div className="signal-list">
        {about.nodes.map((node, index) => (
          <article key={node.label}>
            <span>{String(index + 1).padStart(2, "0")} / {node.label}</span>
            <strong>{node.title}</strong>
            <p>{node.detail}</p>
          </article>
        ))}
      </div>
    </SceneSection>
  );
}
