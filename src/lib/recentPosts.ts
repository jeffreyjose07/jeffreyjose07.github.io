/**
 * Which posts the homepage's Recent Writing section shows, and in what order.
 *
 * Kept out of RecentWriting.tsx so that file exports only a component (React
 * Fast Refresh requires that), while the prerender entry can still import the
 * exact selection the component renders.
 */

export interface BlogPost {
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
 * The exact subset the component renders. Shared with the prerender so it seeds
 * the same list the component would compute — a seed of a different length
 * renders a different number of rows than the prerendered markup contains.
 * Sorts a copy, never the caller's array.
 */
export const selectRecentPosts = (all: BlogPost[]): BlogPost[] =>
  [...all].sort(byMostRecent).slice(0, POST_COUNT);
