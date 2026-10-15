
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';

import type { ProjectCase } from '@/content/projects';
import { publishedProjects } from '@/content/projects';

import styles from './ProjectShowcase.module.css';

type Device = 'desktop' | 'tablet' | 'mobile';

function DevicePreview({
  project,
  device,
}: {
  project: ProjectCase;
  device: Device;
}) {
  const image = project.visuals?.[device];

  if (!image) return null;

  return (
    <figure
      className={`${styles.device} ${styles[device]}`}
    >
      <div className={styles.deviceFrame}>

        {device !== 'mobile' && (
          <div
            className={styles.browserBar}
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
            <i>{project.title} / Preview</i>
          </div>
        )}

        {/* Actual image determines screen height */}
        <div className={styles.deviceScreen}>
          <img
            src={image}
            alt={`${project.title} ${device} ${
              project.visuals?.placeholders
                ? 'illustrative preview'
                : 'screenshot'
            }`}
            loading="lazy"
            decoding="async"
          />
        </div>

      </div>

      <figcaption>
        {device.toUpperCase()}
      </figcaption>
    </figure>
  );
}

export function CaseStudy({
  project,
}: {
  project: ProjectCase;
}) {
  const currentIndex = publishedProjects.findIndex(
    (entry) => entry.slug === project.slug
  );

  const nextProject =
    publishedProjects[
      (currentIndex + 1) % publishedProjects.length
    ];

  const hasNextProject =
    nextProject && nextProject.slug !== project.slug;

  return (
    <main className={styles.caseStudy}>

      {/* Breadcrumb */}

      <div className="container">
        <nav
          className={styles.breadcrumb}
          aria-label="Breadcrumb"
        >
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/projects">Projects</Link>
          <span>/</span>
          <span aria-current="page">
            {project.title}
          </span>
        </nav>
      </div>

      {/* HERO */}

      <section className={styles.detailHero}>
        <div className="container">

          <div className={styles.detailIntro}>
            <div className={styles.detailCopy}>
              <span className="eyebrow">
                PROJECT {String(currentIndex + 1).padStart(2, '0')}
                {' / '}
                {project.category}
              </span>

              <h1>
                {project.title}<em>.</em>
              </h1>

              <p>{project.summary}</p>

              <div className={styles.introActions}>
                <a
                  href="#project-gallery"
                  className={styles.exploreButton}
                >
                  Explore the Experience
                  <ArrowUpRight
                    size={18}
                    aria-hidden="true"
                  />
                </a>

                <Link
                  href="/projects"
                  className={styles.textAction}
                >
                  <ArrowLeft size={17} />
                  All Projects
                </Link>
              </div>
            </div>

            {/* Logo is separate from cover */}
            {project.visuals?.logo && (
              <div className={styles.heroLogo}>
                <img
                  src={project.visuals.logo}
                  alt={`${project.title} logo`}
                />
              </div>
            )}
          </div>

          {/* Full original cover */}

          <div className={styles.detailCover}>
            {project.visuals?.cover ? (
              <img
                src={project.visuals.cover}
                alt={`${project.title} cover`}
                className={styles.detailCoverImage}
                fetchPriority="high"
              />
            ) : (
              <div className={styles.coverFallback}>
                {project.title}
              </div>
            )}
          </div>

          <div className={styles.projectMeta}>
            <div>
              <span>PROJECT</span>
              <strong>{project.title}</strong>
            </div>

            <div>
              <span>FIELD</span>
              <strong>{project.category}</strong>
            </div>

            <div>
              <span>TYPE</span>
              <strong>AI Application</strong>
            </div>
          </div>

        </div>
      </section>

      {/* DESKTOP / TABLET / MOBILE */}

      <section
        className={styles.gallerySection}
        id="project-gallery"
      >
        <div className="container">

          <div className={styles.sectionHead}>
            <div>
              <span className="eyebrow">
                01 / PRODUCT SHOWCASE
              </span>
              <h2>
                See the experience<em>.</em>
              </h2>
            </div>

            <p>One product. Every screen.</p>
          </div>

          <div className={styles.deviceGallery}>
            <DevicePreview
              project={project}
              device="desktop"
            />

            <DevicePreview
              project={project}
              device="tablet"
            />

            <DevicePreview
              project={project}
              device="mobile"
            />
          </div>

          {project.visuals?.placeholders && (
            <p className={styles.placeholderNote}>
              Illustrative visual previews.
              Replace with real product screenshots.
            </p>
          )}

        </div>
      </section>

      {/* CASE STUDY */}

      <section className={styles.storySection}>
        <div className="container">

          <div className={styles.sectionHead}>
            <div>
              <span className="eyebrow">
                02 / CASE STUDY
              </span>
              <h2>
                Behind the build<em>.</em>
              </h2>
            </div>
          </div>

          <div className={styles.storyGrid}>
            <span className={styles.storyNumber}>
              01 / THE CHALLENGE
            </span>

            <div>
              <h3>The Problem</h3>
              <p>{project.problem}</p>
            </div>

            <span className={styles.storyNumber}>
              02 / MY ROLE
            </span>

            <div>
              <h3>The Approach</h3>
              <p>{project.role}</p>
            </div>
          </div>

          {/* Architecture */}

          {project.diagram && (
            <div className={styles.systemPanel}>

              <div className={styles.systemTop}>
                <span className="eyebrow">
                  03 / SYSTEM ARCHITECTURE
                </span>

                <span>CONCEPTUAL FLOW</span>
              </div>

              <div className={styles.systemFlow}>
                {project.diagram.nodes.map(
                  (node, index) => (
                    <div
                      className={styles.systemStep}
                      key={node.id}
                    >
                      <div className={styles.systemNode}>
                        <span>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <strong>{node.label}</strong>
                      </div>

                      {index <
                        project.diagram!.nodes.length - 1 && (
                        <ArrowRight
                          size={19}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Engineering Notes */}

          <div className={styles.insights}>
            <div className={styles.insightHeading}>
              <span className="eyebrow">
                04 / ENGINEERING NOTES
              </span>

              <h3>
                Decisions that matter.
              </h3>
            </div>

            <div className={styles.insightList}>
              {project.decisions.map(
                (decision, index) => (
                  <div key={index}>
                    <span>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p>{decision}</p>
                  </div>
                )
              )}
            </div>
          </div>

        </div>
      </section>

      {/* TECHNOLOGIES */}

      <section className={styles.finalSection}>
        <div className="container">

          <div className={styles.finalGrid}>
            <div>
              <span className="eyebrow">
                05 / TECHNOLOGIES
              </span>

              <h2>
                Built with purpose<em>.</em>
              </h2>

              <div className={styles.stackPills}>
                {project.stack?.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
            </div>

            <div className={styles.finalNotes}>
              <h3>Project Record</h3>

              <p>{project.outcomes}</p>
              <p>{project.limitations}</p>

              {project.evidence.map((entry) => {
                const external =
                  /^https?:\/\//.test(entry.href);

                return (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    className={styles.recordLink}
                    target={
                      external ? '_blank' : undefined
                    }
                    rel={
                      external
                        ? 'noopener noreferrer'
                        : undefined
                    }
                  >
                    {entry.label}
                    <ExternalLink
                      size={15}
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* PROJECT NAVIGATION */}

      <div className="container">
        <div className={styles.projectNavigation}>

          <Link href="/projects">
            <ArrowLeft size={17} />
            All Projects
          </Link>

          {hasNextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
            >
              Next: {nextProject.title}
              <ArrowRight size={18} />
            </Link>
          ) : (
            <Link href="/contact">
              Let's Connect
              <ArrowUpRight size={17} />
            </Link>
          )}

        </div>
      </div>

    </main>
  );
}
