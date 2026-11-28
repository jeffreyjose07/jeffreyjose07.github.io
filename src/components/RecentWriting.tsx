import { useEffect, useState } from "react";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { selectRecentPosts, type BlogPost } from "@/lib/recentPosts";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Format a `YYYY-MM-DD` post date without timezone shifts.
 */
const formatPostDate = (iso: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso).trim());
  if (!match) return String(iso);
  const [, year, month, day] = match;
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`;
};

/**
 * Posts baked into the page by the prerender step (`scripts/prerender.js`).
 */
const seededPosts = (): BlogPost[] => {
  if (typeof window === "undefined") return [];
  const seeded = (window as { __RECENT_POSTS__?: BlogPost[] }).__RECENT_POSTS__;
  if (!Array.isArray(seeded)) return [];
  return selectRecentPosts(seeded);
};

/**
 * Surfaces the most recent long-form posts on the front page.
 */
const RecentWriting = () => {
  const [posts, setPosts] = useState<BlogPost[]>(seededPosts);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Already have what the page was built with; don't re-fetch on every load.
    // Reads the seed rather than `posts` so the effect keeps an empty dep list.
    if (seededPosts().length > 0) return;

    let cancelled = false;

    fetch("/blog/posts.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: BlogPost[]) => {
        if (cancelled) return;
        setPosts(selectRecentPosts(data));
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (failed || posts.length === 0) return null;

  return (
    <section id="writing" className="py-24 px-4 sm:px-6 relative border-t border-border/40">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono font-semibold uppercase tracking-widest text-primary mb-3">
              // 01. WRITING
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground">
              Recent Writing
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-2 leading-relaxed">
              Working logs from real systems — outages, migrations, and the
              failure modes that only show up in production.
            </p>
          </div>

          <a
            href="/blog/"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-primary hover:text-primary-glow border border-primary/25 bg-primary/10 hover:bg-primary/20 px-3.5 py-2 rounded-lg transition-all shrink-0 self-start sm:self-auto"
          >
            <span>Read all posts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <a
                href={`/blog/${post.slug}/`}
                className="group block dev-card dev-card-highlight p-5 sm:p-6 md:p-7 relative transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/25">
                      #{post.episode}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      {formatPostDate(post.date)}
                    </span>
                    <span aria-hidden="true" className="text-border">·</span>
                    <span className="inline-flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      {post.readingTime} min
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </div>

                <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors mb-2 tracking-tight">
                  {post.title}
                </h3>

                <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                  {post.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-2 py-0.5 rounded bg-secondary/80 text-muted-foreground border border-border/50 group-hover:border-primary/20 group-hover:text-foreground transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default RecentWriting;
