# Technical Documentation - Horse Racing Game

**Live URL:** https://diceus-horse-race-task.netlify.app/

## Introduction

Horse Racing Game is an interactive horse racing application built with Vue.js. The application enables generating random horses, creating a race schedule consisting of 6 rounds, and visualizing animated races with results.

## Project Architecture

### Technologies

- **Vue.js 3.5.22** - Frontend framework with Composition API
- **TypeScript** - Static typing for better code quality
- **Pinia** - State management (the latest standard in Vue ecosystem, replacing Vuex)
- **PrimeVue 4.4.1** - UI component library
- **Vue I18n** - Internationalization
- **Vite** - Build tool and dev server
- **Vitest** - Testing framework for unit tests
- **Playwright** - Testing framework for E2E tests
- **Sass** - CSS preprocessor

### Project Structure

```
src/
├── components/          # Vue components
│   ├── Race/           # Race-related components
│   │   ├── RaceHeader/ # Header with control buttons
│   │   ├── RaceTrack/  # Race track with animations
│   │   ├── RaceResults/# Race results
│   │   └── RaceHorseList/ # Horse list
│   └── Layouts/        # Layout components
├── stores/             # Pinia stores
│   └── useRaceStore.ts # Main store managing race state
├── composables/        # Vue composables (reusable logic)
│   ├── useHorseGenerator.ts    # Random horse generation
│   ├── useProgramGenerator.ts  # Race schedule generation
│   └── useRaceSimulation.ts    # Race simulation
├── constants/          # Application constants
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── i18n/               # Translation files
└── assets/             # Static assets (images, sounds)
```

## Technical Decisions

### State Management - Pinia

Instead of Vuex, **Pinia** was chosen as it is currently the official and recommended standard for state management in Vue.js. Pinia offers:

- Better TypeScript support
- Simpler API without mutations
- Better developer tools
- Modular store structure
- Composition API support

The `useRaceStore` manages:

- Horse list
- Race schedule
- Current race state
- Horse positions during race
- Round results

### UI Framework - PrimeVue

**PrimeVue** was selected as the UI component library to test its capabilities. During implementation, it became clear that:

- PrimeVue works better with **Tailwind CSS** than with traditional SCSS
- Using Tailwind allows for faster styling and better consistency
- For future projects, migration to Tailwind is recommended for better PrimeVue integration

The current implementation uses SCSS, but for future projects, using PrimeVue with Tailwind CSS is recommended.

### Responsiveness

The project focuses mainly on **application logic** and desktop functionality. Mobile responsiveness was not a priority, which allowed for:

- Focusing on implementing complex race logic
- Thoroughly testing animations and simulation
- Ensuring application stability
- Implementing comprehensive test coverage

## Application Logic

### Horse Generation

The `useHorseGenerator` composable is responsible for:

- Generating 20 random horses with unique colors
- Randomly selecting horse names from a predefined list
- Assigning random condition values (1-100)
- Randomly selecting horses for individual rounds

### Schedule Generation

The `useProgramGenerator` composable creates a schedule of 6 rounds:

- Each round has a specified distance (1200m, 1400m, 1600m, 1800m, 2000m, 2200m)
- 10 horses are randomly selected from a pool of 20 available horses for each round
- Horses can repeat between rounds

### Race Simulation

The `useRaceSimulation` composable implements:

- **Horse speed calculation** based on:
  - Horse condition (base speed)
  - Momentum (random form fluctuations)
  - Instant randomness (additional randomness)
- **Real-time position updates**
- **Horse sorting** by distance traveled
- **Round completion detection**

### Animation

Horse animation utilizes:

- `requestAnimationFrame` for smooth animations
- CSS transitions for positioning
- Real-time calculations with deltaTime
- Updates every ~16ms (60 FPS)

## Testing

### Unit Tests (Vitest)

The project includes comprehensive unit tests:

- **Components** (22 tests):
  - RaceHeader - button and interaction tests
  - RaceTrack - track display tests
  - RaceResults - results tests
  - RaceHorseList - horse list tests
  - RaceLayout - layout tests

- **Composables** (30 tests):
  - useHorseGenerator - horse generation tests
  - useProgramGenerator - schedule generation tests
  - useRaceSimulation - race simulation tests

- **Stores** (15 tests):
  - useRaceStore - state management tests

**Total: 67 unit tests**

### E2E Tests (Playwright)

End-to-end tests cover main user scenarios:

- Interface display
- Race schedule generation
- Race start
- Pausing/resuming race
- Race restart
- Results display

**Total: 12 E2E tests**

### Mocking

Tests use:

- Mocks for PrimeVue Toast
- Mocks for i18n (returning keys instead of translations)
- Mocks for composables
- Mocks for requestAnimationFrame and performance.now()

## Features

### Main Features

1. **Horse generation** - Random generation of 20 horses with unique properties
2. **Schedule generation** - Creating 6 rounds with random horse selection
3. **Animated race** - Real-time visualization of horse movement
4. **Race control** - Start, pause, resume, restart
5. **Results** - Displaying results for each round with medals for top 3
6. **Sounds** - Playing sound after each round completion

### Additional Features

- **Race restart** - Ability to reset the entire race
- **Tooltips** - Horse information during race
- **Internationalization** - Multi-language support (currently English)
- **Responsive buttons** - Automatic enable/disable based on state

## Code Organization

### Principles

1. **Composition API** - All components use `<script setup>`
2. **TypeScript** - Full typing for type safety
3. **Composables** - Extracting business logic into composables
4. **Single Responsibility** - Each module has one responsibility
5. **DRY** - Avoiding code repetition
6. **Testability** - Code designed with testing in mind

### Design Patterns

- **Store Pattern** - Pinia store for global state
- **Composition Pattern** - Reusable logic in composables
- **Component Pattern** - Modular Vue components
- **Observer Pattern** - Watchers for reactivity

## Configuration

### Build

- **Vite** - Fast build tool
- **TypeScript** - Compilation with type checking
- **Sass** - SCSS compilation to CSS

### Development

- **Hot Module Replacement** - Instant change refresh
- **TypeScript checking** - Type verification during development
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Performance

### Optimizations

- **requestAnimationFrame** - Smooth 60 FPS animations
- **Computed properties** - Calculation caching
- **Lazy loading** - Components loaded on demand
- **Efficient updates** - Minimizing re-renders

### Metrics

- Schedule generation time: < 100ms
- Horse position updates: ~16ms (60 FPS)
- Application load time: < 1s

## Future Improvements

1. **Tailwind CSS** - Migration from SCSS to Tailwind for better PrimeVue integration
2. **Mobile responsiveness** - Adding full support for mobile devices
3. **More languages** - Expanding i18n with additional languages
4. **CSS animations** - Optimizing animations using CSS transforms
5. **Web Workers** - Moving simulation calculations to Web Workers
6. **PWA** - Transforming into a Progressive Web App

## Conclusions

The project was implemented with emphasis on:

- **Clean architecture** - Modular structure ready for scaling
- **Code quality** - TypeScript, tests, linting
- **Functionality** - Full implementation of requirements
- **Testability** - High test coverage (67 unit + 12 E2E)

Key lessons:

- Pinia is an excellent choice for new Vue projects
- PrimeVue works better with Tailwind than with SCSS
- Focusing on logic before UI allows for solid implementation

## Running the Project

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e

# Linting
npm run lint
```

## Author

Project implemented as a case study for Diceus.
