import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  blogNotes,
  contact,
  heroStats,
  hiringReasons,
  keywordMarquee,
  proofPoints,
  sectionCopy,
  services,
  storyTracks,
  testimonials
} from "../data/siteData";
import { ContactGlyph } from "../components/ContactGlyph";
import { projects } from "../data/projectCatalog";
import { portfolioSystems } from "../data/portfolioSystems";

export function HomePage() {
  const featuredProjects = projects.filter(
    (project) => project.featured && project.category !== "Portfolio Systems"
  );
  const featuredCategories = [
    "All",
    ...new Set(featuredProjects.map((project) => project.category))
  ];
  const [activeTrack, setActiveTrack] = useState(storyTracks[0].id);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePortfolioSlug, setActivePortfolioSlug] = useState(
    portfolioSystems[0]?.slug ?? ""
  );

  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));
    const storyNodes = Array.from(document.querySelectorAll("[data-story-panel]"));
    const siteNodes = Array.from(document.querySelectorAll("[data-site-panel]"));
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
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    const storyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.dataset.storyId) {
            setActiveTrack(entry.target.dataset.storyId);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "-18% 0px -45% 0px"
      }
    );

    const siteObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.dataset.siteSlug) {
            setActivePortfolioSlug(entry.target.dataset.siteSlug);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "-18% 0px -45% 0px"
      }
    );

    revealNodes.forEach((node) => {
      if (node.getBoundingClientRect().top < window.innerHeight * 0.92) {
        node.classList.add("is-visible");
        return;
      }

      revealObserver.observe(node);
    });
    storyNodes.forEach((node) => storyObserver.observe(node));
    siteNodes.forEach((node) => siteObserver.observe(node));

    return () => {
      revealObserver.disconnect();
      storyObserver.disconnect();
      siteObserver.disconnect();
    };
  }, [activeCategory]);

  const visibleProjects = useMemo(() => {
    if (activeCategory === "All") {
      return featuredCategories
        .slice(1)
        .map((category) =>
          featuredProjects.find((project) => project.category === category)
        )
        .filter(Boolean);
    }

    return featuredProjects
      .filter((project) => project.category === activeCategory)
      .slice(0, 6);
  }, [activeCategory, featuredCategories, featuredProjects]);

  const categoryHref =
    activeCategory === "All"
      ? "/projects"
      : `/projects?category=${encodeURIComponent(activeCategory)}`;
  const activePortfolio =
    portfolioSystems.find((portfolio) => portfolio.slug === activePortfolioSlug) ??
    portfolioSystems[0];

  const contactActions = [
    {
      href: `mailto:${contact.email}`,
      label: "Send email",
      kind: "email"
    },
    {
      href: `tel:${contact.phone.replace(/\s+/g, "")}`,
      label: "Call phone",
      kind: "phone"
    },
    {
      href: contact.links.linkedin,
      label: "Open LinkedIn",
      kind: "linkedin"
    },
    {
      href: contact.links.github,
      label: "Open GitHub",
      kind: "github"
    },
    {
      href: contact.links.resume,
      label: "Open resume",
      kind: "resume"
    },
    {
      href: contact.links.blog,
      label: "Open blog",
      kind: "blog"
    }
  ];

  return (
    <>
      <section className="hero" id="top">
        <img
          className="hero__media"
          src="/assets/projects/hero-command.jpg"
          alt="Operations room with many monitoring screens."
        />
        <div className="hero__shade" />
        <div className="hero__grid">
          <div className="hero__content">
            <p className="eyebrow">{sectionCopy.hero.eyebrow}</p>
            <h1>{sectionCopy.hero.title}</h1>
            <p className="hero__lead">{sectionCopy.hero.lead}</p>

            <div className="hero__actions">
              <a className="button" href="#projects">
                Explore the work
              </a>
              <Link className="button button--secondary" to="/projects">
                Open full catalog
              </Link>
              <a
                className="button button--ghost"
                href={contact.links.resume}
                target="_blank"
                rel="noreferrer"
              >
                View resume
              </a>
            </div>

            <div className="hero__availability">
              <span>{contact.location}</span>
              <span>{contact.availability}</span>
            </div>
          </div>

          <div className="hero__stats">
            {heroStats.map((stat) => (
              <article className="stat-card" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            {[...keywordMarquee, ...keywordMarquee].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="section__intro" data-reveal>
          <p className="eyebrow">{sectionCopy.overview.eyebrow}</p>
          <h2>{sectionCopy.overview.title}</h2>
          <p>{sectionCopy.overview.body}</p>
        </div>

        <div className="story">
          <div className="story__visual" data-reveal>
            {storyTracks.map((track) => (
              <article
                className={`story__panel ${track.id === activeTrack ? "is-active" : ""}`}
                key={track.id}
              >
                <img src={track.image} alt={track.alt} />
                <div className="story__panel-copy">
                  <p className="eyebrow">{track.eyebrow}</p>
                  <h3>{track.title}</h3>
                  <p>{track.metric}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="story__cards">
            {storyTracks.map((track, index) => (
              <article
                className="story-card"
                key={track.id}
                data-reveal
                data-story-panel
                data-story-id={track.id}
              >
                <span className="story-card__index">0{index + 1}</span>
                <h3>{track.title}</h3>
                <p>{track.description}</p>
                <ul className="bullet-list">
                  {track.outcomes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="highlights">
        <div className="section__intro" data-reveal>
          <p className="eyebrow">{sectionCopy.highlights.eyebrow}</p>
          <h2>{sectionCopy.highlights.title}</h2>
          <p>{sectionCopy.highlights.body}</p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" data-reveal key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul className="bullet-list bullet-list--compact">
                {service.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="proof-grid">
          {proofPoints.map((point) => (
            <article className="proof-card" data-reveal key={point.title}>
              <p className="proof-card__metric">{point.metric}</p>
              <h3>{point.title}</h3>
              <p>{point.detail}</p>
              <div className="tag-list">
                {point.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="reason-grid">
          {hiringReasons.map((reason) => (
            <article className="reason-card" data-reveal key={reason.title}>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
              <ul className="bullet-list bullet-list--compact">
                {reason.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="projects">
        <div className="section__intro" data-reveal>
          <p className="eyebrow">{sectionCopy.projects.eyebrow}</p>
          <h2>{sectionCopy.projects.title}</h2>
          <p>{sectionCopy.projects.body}</p>
        </div>

        <div className="chip-row" data-reveal>
          {featuredCategories.map((category) => {
            const count =
              category === "All"
                ? featuredProjects.length
                : featuredProjects.filter((project) => project.category === category).length;

            return (
              <button
                key={category}
                type="button"
                className={`chip ${activeCategory === category ? "is-active" : ""}`}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
              >
                <span>{category}</span>
                <strong>{count}</strong>
              </button>
            );
          })}
        </div>

        <div className="project-grid">
          {visibleProjects.map((project) => (
            <article className="project-card" data-reveal key={project.slug}>
              <div className="project-card__media">
                <img src={project.image} alt={project.alt} />
                <span className="project-card__year">{project.year}</span>
              </div>
              <div className="project-card__body">
                <p className="project-card__category">{project.category}</p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <p className="project-card__proof">{project.proof}</p>
                <div className="tag-list">
                  {project.stack.slice(0, 4).map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="link-row">
                  {project.links[0] ? (
                    <a href={project.links[0].url} target="_blank" rel="noreferrer">
                      {project.links[0].label}
                    </a>
                  ) : null}
                  <Link to={categoryHref}>See more</Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="section__actions" data-reveal>
          <Link className="button" to={categoryHref}>
            Browse the full catalog
          </Link>
        </div>
      </section>

      <section className="section" id="portfolio-system">
        <div className="section__intro" data-reveal>
          <p className="eyebrow">{sectionCopy.portfolio.eyebrow}</p>
          <h2>{sectionCopy.portfolio.title}</h2>
          <p>{sectionCopy.portfolio.body}</p>
        </div>

        <div className="story story--portfolio">
          <div className="story__visual story__visual--portfolio" data-reveal>
            {portfolioSystems.map((portfolio, index) => (
              <article
                className={`story__panel portfolio-panel ${portfolio.slug === activePortfolio.slug ? "is-active" : ""}`}
                key={portfolio.slug}
              >
                <img src={portfolio.image} alt={portfolio.alt} />
                <div className="story__panel-copy portfolio-panel__copy">
                  <div className="portfolio-panel__topline">
                    <p className="eyebrow">{portfolio.type}</p>
                    <span className="portfolio-panel__count">
                      {String(index + 1).padStart(2, "0")} / {String(portfolioSystems.length).padStart(2, "0")}
                    </span>
                  </div>
                  <h3>{portfolio.title}</h3>
                  <p>{portfolio.summary}</p>
                  <div className="link-row">
                    <a
                      href={portfolio.links[0]?.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {portfolio.links[0]?.label ?? "Open site"}
                    </a>
                    <Link to="/projects?category=Portfolio%20Systems">Open the catalog</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="story__cards portfolio-cards">
            {portfolioSystems.map((portfolio, index) => (
              <article
                className={`story-card portfolio-card ${portfolio.slug === activePortfolio.slug ? "is-active" : ""}`}
                data-reveal
                data-site-panel
                data-site-slug={portfolio.slug}
                key={portfolio.slug}
                onMouseEnter={() => setActivePortfolioSlug(portfolio.slug)}
                onFocus={() => setActivePortfolioSlug(portfolio.slug)}
              >
                <span className="story-card__index">0{index + 1}</span>
                <p className="project-card__category">{portfolio.type}</p>
                <h3>{portfolio.title}</h3>
                <p>{portfolio.summary}</p>
                <ul className="bullet-list bullet-list--compact">
                  {portfolio.outcomes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="tag-list">
                  {portfolio.stack.slice(0, 3).map((item) => (
                    <span className="tag" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
                <div className="link-row">
                  <a
                    href={portfolio.links[0]?.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {portfolio.links[0]?.label ?? "Open site"}
                  </a>
                  <Link to="/projects?category=Portfolio%20Systems">Open the catalog</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="insights">
        <div className="section__intro" data-reveal>
          <p className="eyebrow">{sectionCopy.insights.eyebrow}</p>
          <h2>{sectionCopy.insights.title}</h2>
          <p>{sectionCopy.insights.body}</p>
        </div>

        <div className="notes-layout">
          <div className="notes-column">
            {blogNotes.map((note) => (
              <article className="note-card" data-reveal key={note.title}>
                <p className="project-card__category">{note.category}</p>
                <h3>{note.title}</h3>
                <p>{note.summary}</p>
                <a href={note.link} target="_blank" rel="noreferrer">
                  {note.linkLabel}
                </a>
              </article>
            ))}
          </div>

          <div className="notes-column">
            {testimonials.map((testimonial) => (
              <article className="testimonial-card" data-reveal key={testimonial.name}>
                <p>"{testimonial.quote}"</p>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--cta" id="contact">
        <div className="contact-cta" data-reveal>
          <div>
            <p className="eyebrow">{sectionCopy.contact.eyebrow}</p>
            <h2>{sectionCopy.contact.title}</h2>
            <p>{sectionCopy.contact.body}</p>
          </div>

          <div className="contact-icon-grid" aria-label="Contact links">
            {contactActions.map((item) => (
              <a
                className="contact-icon"
                href={item.href}
                key={item.label}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={item.label}
                title={item.label}
              >
                <ContactGlyph kind={item.kind} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
