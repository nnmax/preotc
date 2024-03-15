// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { CSSProperties } from 'react'

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style, @typescript-eslint/no-shadow
  interface CSSProperties {
    // Allow any CSS Custom Properties
    [index: `--${string}`]: string | number
  }
}
