# Playwright POM Architecture Documentation

## Objective

Define a scalable and maintainable UI automation architecture using Playwright and Page Object Model (POM).

## Layered design

### 1) Test layer (tests/specs)

Responsibilities:
- Describe user workflows and assertions
- Compose page object calls
- Avoid direct selectors in specs

Allowed:
- Test data setup
- High-level assertions

Avoid:
- Hardcoded selectors
- Repeated UI interaction logic

### 2) Page layer (src/pages)

Responsibilities:
- Encapsulate UI actions and page-specific behavior
- Expose meaningful methods (for example: clickGetStarted)
- Return locators only when assertions need them

Allowed:
- Navigation and action methods
- Small page-scoped helper methods

Avoid:
- Duplicating selector strings
- Cross-page business flows (unless creating a dedicated flow object)

### 3) Locator layer (src/locators)

Responsibilities:
- Keep selector metadata in one place
- Minimize selector drift impact

Rules:
- Store role/name or stable selector contracts
- Use semantic locator naming
- Keep values immutable with as const

## Current implementation map

- tests/specs/playwright-navigation.spec.ts
  - Contains scenario-level tests for navigation and title check.
- src/pages/HomePage.ts
  - Handles home page navigation and Get started interaction.
- src/pages/DocsPage.ts
  - Exposes installation heading locator.
- src/locators/homePage.locators.ts
  - Stores Home page selectors.
- src/locators/docsPage.locators.ts
  - Stores Docs page selectors.

## Configuration standards

File: playwright.config.ts
- testDir points to tests/specs
- baseURL is centralized to avoid repeated absolute URLs
- trace is enabled on first retry
- browser matrix includes chromium, firefox, webkit

File: package.json
- test commands are standardized for local and UI modes

## Naming conventions

- Page class: PascalCase + Page suffix
  - Example: HomePage, DocsPage
- Locator file: camelCase + .locators.ts
  - Example: homePage.locators.ts
- Spec file: kebab-case + .spec.ts
  - Example: playwright-navigation.spec.ts

## Code style conventions

- Keep methods focused and small
- One assertion intent per test when possible
- Reuse page objects, do not duplicate behavior in tests
- Prefer getByRole and accessible names for resilient selectors

## How to add a new page

1. Add locator contract in src/locators/newPage.locators.ts.
2. Add page object in src/pages/NewPage.ts.
3. Add or update tests in tests/specs.
4. Keep test files free from selector implementation details.

## How to add a new test flow

1. Instantiate required page objects in spec.
2. Use only page methods for interactions.
3. Assert using page-exposed locators or page-level assertion helpers.
4. Keep each test independent and deterministic.

## POM compliance checklist

- [x] Tests separated from page logic
- [x] Selectors separated into dedicated locator files
- [x] Base URL configured globally
- [x] Starter non-POM spec removed
- [x] Standard command scripts included

## Recommended next enhancements

- Add fixtures for page object creation
- Introduce test data builder layer
- Add linting and formatting rules
- Add CI pipeline with report artifact upload
