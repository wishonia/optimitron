// Ambient types for styled-jsx (used by Next.js)
// This augments React's StyleHTMLAttributes to accept the `jsx` and `global` props.
import "react";

declare module "react" {
  interface StyleHTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}
