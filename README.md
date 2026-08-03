# Sentinel Platform

Plataforma de preparación física adaptativa para profesionales operativos.

## Productos

- Sentinel Fire: primer producto, enfocado inicialmente en bomberos y bomberas de CDMX.
- Sentinel Platform Console: administración de contenido, organizaciones y configuración.
- Sentinel Decision Engine: motor transversal de readiness, misiones, progresión y seguridad.

## Estructura

- `apps/mobile-fire`: aplicación móvil React Native / Expo.
- `apps/api`: API modular con NestJS.
- `apps/platform-console`: consola administrativa web.
- `packages/design-system`: tokens y componentes compartidos.
- `packages/domain-types`: contratos y tipos de dominio.
- `packages/api-client`: cliente tipado para la API.
- `packages/decision-engine`: reglas y contratos del motor de decisiones.
- `infrastructure`: Docker y despliegue.
- `docs/adr`: decisiones de arquitectura.

## Primer arranque

```bash
corepack enable
pnpm install
pnpm dev
```

## Estado

Sprint 0: estructura inicial del monorepo.
