/**
 * React 18 does not recognise the camelCase `fetchPriority` prop: it logs an
 * "unknown prop" warning instead. The lowercase HTML attribute is passed
 * through to the DOM untouched, so Hero.tsx uses `fetchpriority`. @types/react
 * only declares the camelCase form, so declare the lowercase one here.
 *
 * Remove this file (and switch Hero.tsx to `fetchPriority`) after upgrading to
 * React 19, which supports the camelCase prop natively.
 */
import "react";

declare module "react" {
    interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
        fetchpriority?: "high" | "low" | "auto";
    }
}
