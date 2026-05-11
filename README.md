# NCERT Physics Simulation Platform

This repository contains the reusable architecture for a scalable educational simulation platform built around React, Next.js App Router, TypeScript, Tailwind CSS, Zustand, Recharts, KaTeX, and a PixiJS-ready rendering boundary.

## Architecture

The codebase is organized so that physics logic, runtime control, rendering, and instructional UI are all independent:

- `src/core`
  Pure framework-agnostic engines for math, vector operations, motion integration, and animation timing.
- `src/simulation-framework`
  Reusable product primitives for the canvas shell, control surfaces, formula display, charts, and parameter state.
- `src/templates`
  Domain templates for mechanics, waves, optics, electricity, and quantum simulations.
- `src/types`
  Shared interfaces for parameters, formulas, graphs, and scaffold configuration.

## Reusable APIs

- `createParameterStore(defaults)`
  Creates a strongly typed Zustand store with reset and batch updates.
- `useSimulationParameters()`
  Reads and mutates current simulation parameters from UI controls or runtime logic.
- `useAnimationFrame({ isRunning, onFrame })`
  Drives simulation loops using `requestAnimationFrame` with timestep clamping.
- `SimulationShell`
  Composes header, canvas, control panel, formulas, and graphs into a responsive simulation page.
- `SimulationCanvas`
  Exposes a mount boundary for PixiJS or another renderer while preserving layout and sizing.
- `SimulationControls`
  Builds an entire controls panel from `ParameterDefinition[]`.

## Template Strategy

Each template follows the same pattern:

- accepts a config object
- injects default parameter values through the shared provider
- renders the shared shell
- leaves rendering logic replaceable through canvas overlays or future renderer adapters

That keeps future simulation work configuration-first instead of copy-paste-first.

## Template Coverage

- `mechanics-template`
  Gravity, velocity, acceleration, collision, vector display, trail support.
- `wave-template`
  Oscillation, frequency, amplitude, phase, waveform-oriented configuration.
- `optics-template`
  Lens and ray-tracing oriented configuration with formula support.
- `electricity-template`
  Charge, field-line, voltage, and flow-oriented configuration.
- `quantum-template`
  Energy levels, photon events, electron emission, and probability-driven scenes.

## Extensibility

To build a new simulation later:

1. Choose the closest template.
2. Define parameter metadata and defaults.
3. Mount a PixiJS renderer into `SimulationCanvas`.
4. Feed live metrics into the chart system.
5. Add formulas and chapter-specific explanatory UI.

This repo intentionally stops before implementing final simulations so the architecture remains reusable across 100+ physics experiences.
