import type { HomeCell } from './index'

// The root page of the element template (step 314-2). The hero says what this is and what to do next; the line below it
// says the page is public. `/<lang>/architect/build/…` gets this element's id at render time.
export const en: HomeCell = {
  title: 'Your element starts here',
  description: 'This is the starter template of a node element. Your Claude Code agent will build it into your product.',
  keywords: '',
  blocks: [
    {
      kind: 'hero-centered',
      pill: 'Element template',
      title: 'Your element starts here',
      description: 'This is the starter template of a node element. Your Claude Code agent builds it into your product: sign in to the subscription, open the terminal and describe what you need.',
      cta: { label: 'Sign in to subscription', href: '/en/architect/build/subscription' },
      secondary: { label: 'Open the terminal', href: '/en/architect/build/terminal' },
    },
    { kind: 'p', text: 'You are on the root page. It is not protected by any protocol.' },
  ],
}
