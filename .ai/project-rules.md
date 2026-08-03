# Sentinel Platform Project Rules

## Product model

Sentinel Platform is the shared SaaS platform.
Sentinel Fire is the first vertical product.

## Engineering principles

- Use TypeScript in strict mode.
- Prefer a modular monolith over microservices.
- Keep Platform Core separate from Fire-specific behavior.
- The LLM never overrides deterministic safety rules.
- Shared code belongs in packages.
- Mobile must support offline-first workout execution.
- Do not introduce Kubernetes for the MVP.
- Use explicit DTOs and typed contracts.
- Avoid premature abstractions.
- Every critical decision must be explainable and versioned.

## Code quality

- Keep modules small and cohesive.
- Avoid any unless technically unavoidable and documented.
- Validate external inputs.
- Never commit secrets.
- Add tests for business and safety rules.
- Use conventional commits.
