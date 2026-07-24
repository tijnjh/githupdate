# githupdate

githupdate is a client-only React application that builds a release feed from the public
repositories starred by a GitHub user.

## Stack

- React and Vite
- TanStack Router for client-side routing
- TanStack Query for GitHub and ungh data fetching
- Jotai for persisted user, repository, and theme state
- Microsoft Fluent UI for the interface
- Valibot for API response validation

There is no server runtime or full-stack framework. The production build is a static SPA in
`dist/`.

## Development

```sh
pnpm install
pnpm dev
```

## Validation and production build

```sh
pnpm check
pnpm lint
pnpm build
```

When deploying, configure the static host to serve `index.html` as the fallback for application
routes such as `/owner/repository`.
