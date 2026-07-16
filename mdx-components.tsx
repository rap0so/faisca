import type { MDXComponents } from "mdx/types";
import { SquashStretchDemo } from "@/components/mdx/demos/SquashStretchDemo";
import { StaggerDemo } from "@/components/mdx/demos/StaggerDemo";
import { TransitionDemo } from "@/components/mdx/demos/TransitionDemo";
import {
  Analogia,
  Aprofundamento,
  Demo,
  Dica,
  Meta,
} from "@/components/mdx/MdxComponents";

/**
 * Required by @next/mdx (App Router). Makes the custom lesson blocks available
 * inside every .mdx file without per-file imports.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Analogia,
    Demo,
    Aprofundamento,
    Dica,
    Meta,
    TransitionDemo,
    SquashStretchDemo,
    StaggerDemo,
    ...components,
  };
}
