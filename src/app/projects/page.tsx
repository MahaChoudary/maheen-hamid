
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { publishedProjects } from '@/content/projects';
import { canonicalFor } from '@/lib/seo';
import styles from '@/features/projects/ProjectShowcase.module.css';

export const metadata = {
  ...canonicalFor('/projects'),
  title: 'Projects',
  description: 'AI applications and engineering case studies.',
};

export default function Projects() {
  return (
    <main className={styles.projectsMain}>
      <div className="container">

        <header className={styles.listingHeading}>
          <div>
            <span className="eyebrow">
              02 / SELECTED WORK
            </span>

            <h1>
              Ideas made <em>real.</em>
            </h1>

            <p>
              AI systems, thoughtfully built and presented.
            </p>
          </div>

          <span className={styles.projectCount}>
            {String(publishedProjects.length).padStart(2, '0')}
            {' '}PROJECTS
          </span>
        </header>

        <div id="project-evidence" className={styles.cardsGrid}>
          {publishedProjects.map((project, index) => (
            <article
              className={styles.projectCard}
              key={project.slug}
            >
              {/* Full cover without cropping */}

              <Link
                href={`/projects/${project.slug}`}
                className={styles.cardCover}
                aria-label={`Explore ${project.title}`}
              >
                {project.visuals?.cover ? (
                  <img
                    src={project.visuals.cover}
                    alt={`${project.title} project cover`}
                    className={styles.coverImage}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                ) : (
                  <div className={styles.coverFallback}>
                    {project.title}
                  </div>
                )}
              </Link>

              {/* Project information */}

              <div className={styles.cardDetails}>
                <div className={styles.cardCopy}>

                  <span className="eyebrow">
                    {project.category}
                  </span>

                  <div className={styles.cardTitleRow}>
                    {project.visuals?.logo && (
                      <span className={styles.cardLogo}>
                        <img
                          src={project.visuals.logo}
                          alt={`${project.title} logo`}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                    )}

                    <h2>{project.title}</h2>
                  </div>

                  <p>{project.summary}</p>

                  <div className={styles.stackPills}>
                    {project.stack?.slice(0, 4).map((tool) => (
                      <span key={tool}>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className={styles.exploreButton}
                >
                  Explore My Project
                  <ArrowUpRight
                    size={18}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.endNote}>
          <span>
            MORE AI ENGINEERING WORK COMING SOON
          </span>

          <Link href="/lab">
            Visit the Lab
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

      </div>
    </main>
  );
}
