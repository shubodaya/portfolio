import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { contact, sectionCopy } from "../data/siteData";
import { projectCategories, projects } from "../data/projectCatalog";

export function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState(
    requestedCategory && projectCategories.includes(requestedCategory)
      ? requestedCategory
      : "All"
  );

  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -5% 0px"
      }
    );

    revealNodes.forEach((node) => {
      if (node.getBoundingClientRect().top < window.innerHeight * 0.92) {
        node.classList.add("is-visible");
        return;
      }

      revealObserver.observe(node);
    });

    return () => {
      revealObserver.disconnect();
    };
  }, [activeCategory]);

  useEffect(() => {
    if (requestedCategory && projectCategories.includes(requestedCategory)) {
      setActiveCategory(requestedCategory);
      return;
    }

    setActiveCategory("All");
  }, [requestedCategory]);

  const visibleProjects = useMemo(() => {
    if (activeCategory === "All") {
      return projects;
    }

    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);

    if (category === "All") {
      setSearchParams({});
      return;
    }

    setSearchParams({ category });
  };

  return (
    <section className="section section--projects-page" id="top">
      <div className="page-hero">
        <p className="eyebrow">{sectionCopy.catalog.eyebrow}</p>
        <h1>{sectionCopy.catalog.title}</h1>
        <p>{sectionCopy.catalog.body}</p>

        <div className="hero__availability hero__availability--page">
          <span>{projects.length} total projects and portfolio systems</span>
          <span>{projectCategories.length - 1} categories</span>
          <span>{contact.availability}</span>
        </div>
      </div>

      <div className="chip-row" data-reveal>
        {projectCategories.map((category) => {
          const count =
            category === "All"
              ? projects.length
              : projects.filter((project) => project.category === category).length;

          return (
            <button
              key={category}
              type="button"
              className={`chip ${activeCategory === category ? "is-active" : ""}`}
              onClick={() => handleCategoryChange(category)}
              aria-pressed={activeCategory === category}
            >
              <span>{category}</span>
              <strong>{count}</strong>
            </button>
          );
        })}
      </div>

      <div className="catalog-list">
        {visibleProjects.map((project, index) => (
          <article
            className={`catalog-card ${index % 2 === 1 ? "is-reversed" : ""}`}
            id={project.slug}
            data-reveal
            key={project.slug}
          >
            <div className="catalog-card__media">
              {project.image ? (
                <img src={project.image} alt={project.alt} />
              ) : (
                <div className="catalog-card__placeholder">
                  <span>{project.category}</span>
                  <strong>{project.title}</strong>
                </div>
              )}
            </div>

            <div className="catalog-card__content">
              <div className="catalog-card__topline">
                <p className="project-card__category">{project.category}</p>
                <span>{project.year}</span>
              </div>
              <h2>{project.title}</h2>
              <p className="catalog-card__type">{project.type}</p>
              <p>{project.summary}</p>
              <p className="catalog-card__proof">{project.proof}</p>

              <div className="catalog-card__section">
                <h3>What it shows</h3>
                <ul className="bullet-list bullet-list--compact">
                  {project.outcomes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="catalog-card__section">
                <h3>Stack and focus</h3>
                <div className="tag-list">
                  {project.stack.map((item) => (
                    <span className="tag" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="link-row">
                {project.links.map((link) => (
                  <a href={link.url} key={link.url} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="catalog-cta" data-reveal>
        <p className="eyebrow">{sectionCopy.catalogCta.eyebrow}</p>
        <h2>{sectionCopy.catalogCta.title}</h2>
        <p>{sectionCopy.catalogCta.body}</p>
        <div className="contact-cta__actions">
          <Link className="button" to={{ pathname: "/", hash: "#contact" }}>
            Go to contact
          </Link>
          <Link className="button button--secondary" to="/">
            Back to landing page
          </Link>
        </div>
      </div>
    </section>
  );
}
