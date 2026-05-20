import { ExternalLink } from "lucide-react";
import { projects } from "../data/profileData.js";
import { SceneSection } from "./ScrollExperience.jsx";

export function Projects({ activeProject, onHoverScene, setActiveProject }) {
  const selected = projects.find((project) => project.id === activeProject) ?? projects[0];

  return (
    <SceneSection align="right" id="projects" kicker="03 / Projects and labs" title="Network-security projects and labs.">
      <div className="project-overlay">
        <div className="project-selector" aria-label="Project endpoint selector">
          {projects.map((project, index) => (
            <button
              className={selected.id === project.id ? "is-active" : ""}
              key={project.id}
              type="button"
              onClick={() => setActiveProject(project.id)}
              onMouseEnter={() => {
                setActiveProject(project.id);
                onHoverScene?.("projects");
              }}
              onMouseLeave={() => onHoverScene?.(null)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {project.title}
            </button>
          ))}
        </div>
        <article className="project-detail-overlay">
          <p className="card-kicker">{selected.subtitle}</p>
          <h3>{selected.title}</h3>
          <dl>
            <div>
              <dt>Problem</dt>
              <dd>{selected.problem}</dd>
            </div>
            <div>
              <dt>Tools</dt>
              <dd>{selected.tools.join(" / ")}</dd>
            </div>
            <div>
              <dt>Outcome</dt>
              <dd>{selected.outcome}</dd>
            </div>
          </dl>
          <div className="tag-row">
            {selected.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          {selected.links.length > 0 ? (
            <div className="overlay-actions overlay-actions--compact">
              {selected.links.map((link) => (
                <a href={link.href} key={link.href} rel="noreferrer" target="_blank">
                  {link.label} <ExternalLink size={14} aria-hidden="true" />
                </a>
              ))}
            </div>
          ) : null}
        </article>
      </div>
    </SceneSection>
  );
}
