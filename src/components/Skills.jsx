import { skillClusters } from "../data/profileData.js";
import { SceneSection } from "./ScrollExperience.jsx";

export function Skills() {
  return (
    <SceneSection align="left" id="skills" kicker="04 / Topology clusters" title="Skills orbiting the fibre cable as routed clusters.">
      <div className="skills-overlay">
        {skillClusters.map((cluster) => (
          <article key={cluster.label}>
            <strong>{cluster.label}</strong>
            <p>{cluster.items.join(" / ")}</p>
          </article>
        ))}
      </div>
    </SceneSection>
  );
}
