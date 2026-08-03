# ADR 0001: Monorepo and modular monolith

## Status

Accepted

## Context

Sentinel Platform will support a shared platform core and multiple vertical products.
The MVP must prioritize development speed, low operational complexity, and code reuse.

## Decision

Use a pnpm and Turborepo monorepo.
Use a NestJS modular monolith for the backend.
Use separate applications for Sentinel Fire mobile and Platform Console.

## Consequences

- Shared packages can be reused across applications.
- Deployment and local development remain simple.
- Domain boundaries must remain explicit.
- Modules may be extracted later only when operational evidence justifies it.
