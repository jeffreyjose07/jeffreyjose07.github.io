---
title: "Redesigning the Portfolio: Teal, Fonts, and Timelines"
date: "2026-05-19"
tags: ["design", "frontend", "portfolio", "ui-design", "animation", "css"]
description: "A deep audit of the portfolio revealed broken animations, a split design system, and the violet monoculture. Here's how I fixed it."
readingTime: 6
wordCount: 950
---

I've been staring at this portfolio for months. It looked fine. Sections were polished, animations ran smoothly, the glassmorphism felt premium. Or so I thought.

Running a proper design audit against current frontend trends changed that. Quickly.

## What the Audit Found

The first thing that jumped out was something I'd describe as a **split personality problem**. The Hero, Projects, and Contact sections used my Tailwind CSS custom property system — `bg-background`, `text-primary`, `glass-card` — everything properly tokenized. But Skills and Experience were hardcoding raw utility classes: `bg-gray-800`, `text-gray-600`, `bg-blue-600`. They came from a different project, and it showed. Scrolling through the portfolio felt like visiting two different websites stapled together.

The second issue was more embarrassing: **two animations were completely broken**. The floating blobs in the Hero used `animate-float`, and Skills/Experience used `animate-slide-up`. Neither keyframe was defined in `tailwind.config.ts`. They just silently failed — the elements appeared without animation, and I'd never noticed because the degradation was invisible.

Third: **all animations fired on page load**, not when sections entered the viewport. Elements deep in the page had already "animated" before a user could possibly see them. The effect was wasted.

And then there was the elephant in the room: **electric violet everywhere**, paired with Inter and Outfit. The same purple-gradient-on-dark combo that's on roughly every developer portfolio generated in the last two years. Not a good look when you're trying to stand out.

## Fixing the Foundation

I started with the quick wins. Added the missing `float` and `slide-up` keyframes to `tailwind.config.ts`. Also slowed the hero's pulsing mesh animation from 4 seconds to 8 — at 4s it was subtly nauseating on long page dwell.

For scroll-triggered animations, I wrote a small `useInView` hook using the browser's native `IntersectionObserver` API. Each section now carries a ref, and animations only trigger when the element crosses the viewport threshold. The hook disconnects the observer after the first trigger — no repeated firing, no React render loops.

```typescript
export function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}
```

Twenty-five lines. No library needed.

## The Color System

I replaced the violet primary — `hsl(263 70% 50%)` — with **emerald teal** at `hsl(162 75% 38%)`. The choice wasn't arbitrary. Teal at that lightness sits in a useful spot: dark enough to pass WCAG AA contrast on white backgrounds, vivid enough to glow against dark ones. The companion gradient goes teal-to-cyan, which has a directional warmth that violet-to-purple lacks.

The gradient text on the name now reads white-to-teal in dark mode, and teal-to-cyan in light mode. The mesh background radials, the glow border effect, the section dividers — all updated to match. It's a surprisingly large surface area when you start counting.

## Typography

Swapped **Inter** for **Plus Jakarta Sans** as the body font, and **Outfit** for **Syne** as the heading font. Syne is wide and geometric at heavy weights — it brings a kind of confident authority that Outfit's roundness doesn't. Plus Jakarta Sans has more character than Inter while staying clean enough for long-form reading. Both are available on Google Fonts and load with the same preconnect strategy.

The pairing feels more deliberate. Less off-the-shelf.

## Skills and Experience: Proper Redesigns

The Skills section got torn down and rebuilt. The old version was a flat badge cloud inside gray cards — every skill had identical visual weight, so `Kubernetes` sat next to `Unit Testing` as equals. That's not how expertise actually works.

The new layout has two tiers. **Signature expertise** — Spring Boot & WebFlux, Apache Kafka, Microservices Architecture, Kubernetes & GCP, PostgreSQL & MongoDB, Reactive Programming — displayed as larger bordered cards with category tags. Below that, a **full toolkit** organized by domain (Languages, Data, DevOps, Architecture, Quality). Recruiters scanning in six seconds see the differentiators first.

Experience got a more significant transformation. The old stacked card layout was a direct CV-to-web translation — readable, but forgettable. I replaced it with a **vertical timeline**: a connector line runs down the left side on desktop, with timeline dots marking each role, dates on a perpendicular axis, and entries that stagger-animate in on scroll. The career arc becomes visually legible at a glance.

## The Smaller Fixes

A few things that don't make headlines but matter:

The Contact section had three hardcoded `text-white` labels for Email, Phone, and Location. They worked in dark mode. In light mode, white text on a near-white background — invisible. Fixed to `text-muted-foreground`.

The Hero subtitle was vague: *"Code craftsman • Tech explorer • Minimalist"*. Pretty, but says nothing about what I actually do. Changed to *"Senior Backend Engineer • Distributed Systems • 6 yrs @ Jio"*. Concrete. Scannable.

The academic projects section had its heading in `text-muted-foreground` — visually de-emphasized to the point of looking apologetic. Given these are worth showing, gave them a proper gradient heading treatment.

And the footer now closes with a small monospace line: `> crafted with care, deployed with confidence`. A nod to the terminal aesthetic of the blog.

## Reflecting on Design Complacency

The honest thing to admit is that most of these issues weren't introduced all at once. They accumulated — a section copied from somewhere, a color variable updated in one place but not another, an animation added without checking the keyframe existed. Design debt works exactly like technical debt: it's quiet until you look directly at it.

Running an explicit audit forced the looking. The portfolio is sharper for it.

---

*All changes are live. The build is clean, the animations fire when they should, and the violet is gone.*
