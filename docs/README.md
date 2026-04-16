# WCSR Automation - Playwright POM Framework

This project follows a Page Object Model (POM) architecture with a dedicated locator layer.

## Architecture at a glance

- tests/specs: test scenarios only
- src/pages: page objects with reusable actions and page behavior
- src/locators: selector contracts used by page objects
- docs: architecture and implementation standards

## Project structure

```text
.
|-- docs/
|   `-- ARCHITECTURE.md
|-- src/
|   |-- locators/
|   |   |-- docsPage.locators.ts
|   |   `-- homePage.locators.ts
|   `-- pages/
|       |-- DocsPage.ts
|       `-- HomePage.ts
|-- tests/
|   `-- specs/
|       `-- playwright-navigation.spec.ts
|-- playwright.config.ts
`-- package.json
```

## How this POM is implemented

1. Tests in tests/specs call page object methods only.
2. Page objects in src/pages contain business actions and reusable page logic.
3. Locator definitions in src/locators keep selectors centralized and easy to maintain.
4. Global test behavior is in playwright.config.ts (baseURL, reporter, retries, projects).

## Commands

- npm test
- npm run test:headed
- npm run test:ui
- npm run report

## Why this helps

- Better maintainability when UI changes
- Reusable page actions across multiple tests
- Clear separation between test intent and implementation details
- Lower duplication and easier debugging

For full standards and extension guidelines, see ARCHITECTURE.md.

For a running log of day-to-day changes and debugging notes, see DAILY_ACTIVITY_LOG.md.
