import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

interface BlogPost {
  url: string;
  title: string;
  episode: string;
  date: string;
  tags: string[];
  description: string;
  readingTime: number;
  slug: string;
}

const POST_COUNT = 4;

/**
 * Newest first: by date, then by episode number.
 *
 * The episode tiebreak matters — posts are frequently published on the same day
 * (033, 034 and 035 all carry 2026-08-01), and comparing dates alone leaves those
 * in whatever order posts.json happens to use. Episode number is the real
 * publication order, so it decides ties rather than relying on sort stability.
 */
const byMostRecent = (a: BlogPost, b: BlogPost) =>
  b.date.localeCompare(a.date) ||
  Number(b.episode) - Number(a.episode);

/**
 * Surfaces the most recent long-form posts on the front page.
 *
 * The writing is the strongest evidence of how I work — real incidents,
 * measurements and post-mortems — so it should not sit one click away behind a
 * nav link. Data comes from public/blog/posts.json, which the blog build
 * generates on every deploy, so this stays current without a second source of
 * truth.
 */
const RecentWriting = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/blog/posts.json")
      .then((res) => {
        if (!res.ok) throw new Error(`posts.json returned ${res.status}`);
        return res.json();
      })
      .then((data: BlogPost[]) => {
        if (cancelled) return;
        const sorted = [...data].sort(byMostRecent);
        setPosts(sorted.slice(0, POST_COUNT));
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Render nothing rather than an empty shell if the feed is unavailable.
  if (failed || posts.length === 0) return null;

  return (
    <section id="writing" className="py-24 px-6 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Recent Writing</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Working logs from real systems — outages, migrations, and the
            failure modes that only show up in production.
          </p>
        </div>

        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <a
                href={`/blog/${post.slug}`}
                className="group block rounded-lg border border-border bg-background p-6 transition-colors hover:border-primary/60"
              >
                <div className="flex flex-wrap items-center gap-3 mb-2 text-sm text-muted-foreground">
                  <span className="font-mono text-primary">#{post.episode}</span>
                  <span>
                    {new Date(post.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingTime} min read</span>
                </div>

                <h3 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed line-clamp-3">
                  {post.description}
                </p>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            Read all posts
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default RecentWriting;
