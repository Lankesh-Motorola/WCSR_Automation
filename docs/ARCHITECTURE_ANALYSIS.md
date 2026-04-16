# Playwright POM Architecture - Current State Analysis

**Date**: April 15, 2026  
**Project**: WCSR Automation - Playwright Test Framework

---

## Executive Summary

The project has a **POM foundation in place but real tests do NOT follow the POM pattern**. There is a structural mismatch between the intended architecture and the actual implementation.

### Current Score: 4/10
- ✅ POM structure defined
- ✅ Documentation present
- ✅ TypeScript config in place
- ❌ Real tests violate POM principles
- ❌ No page objects for actual application
- ❌ Hardcoded selectors in tests
- ❌ Config baseURL mismatch

---

## Project Structure (Actual)

```
WCSR Automation/
├── docs/
│   ├── ARCHITECTURE.md          ← Design intent (not fully followed)
│   └── ARCHITECTURE_ANALYSIS.md ← This file
├── src/
│   ├── locators/
│   │   ├── homePage.locators.ts ← Sample (unused in real tests)
│   │   └── docsPage.locators.ts ← Sample (unused in real tests)
│   └── pages/
│       ├── HomePage.ts          ← Sample (unused in real tests)
│       └── DocsPage.ts          ← Sample (unused in real tests)
├── tests/
│   ├── 01_WCSR_Login.spec.ts    ← REAL TEST - NOT USING POM ⚠️
│   ├── setup/
│   │   └── auth.setup.ts        ← Session storage setup
│   └── specs/
│       └── playwright-navigation.spec.ts ← Sample (not executed)
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── docs/README.md
└── .gitignore

```

---

## Layer-by-Layer Analysis

### 1) Configuration Layer

#### File: `playwright.config.ts`
**Status**: ✅ Partially Correct

```typescript
testDir: './tests/specs'  // ⚠️ Issue: Real tests are in ./tests root!
baseURL: 'https://playwright.dev'  // ⚠️ Issue: Should be actual app URL
```

**Issues**:
- `testDir` points to `./tests/specs` but actual test is `./tests/01_WCSR_Login.spec.ts`
- `baseURL` is hardcoded to Playwright docs site, not the actual WCSR application
- Setup file location hardcoded in `auth.setup.ts` doesn't align with config

#### File: `tsconfig.json`
**Status**: ✅ Correct

- Node types properly included
- Playwright test types included
- All source files included in compilation

#### File: `package.json`
**Status**: ✅ Adequate

```json
"scripts": {
  "test": "playwright test",
  "test:headed": "playwright test --headed",
  "test:ui": "playwright test --ui",
  "report": "playwright show-report"
}
```

Scripts are defined but won't find real tests due to config mismatch.

---

### 2) Test Layer (tests/*)

#### File: `tests/01_WCSR_Login.spec.ts`
**Status**: ❌ **Violates POM Principles**

**Problems Identified**:

1. **Hardcoded Selectors** (12 violations)
   ```typescript
   // ❌ Wrong: Direct selectors in test
   await page.locator('input[id="username"]').fill(VALID_USER);
   await page.locator('input[id="password"]').fill(VALID_PASS);
   await page.locator('button[title="Sign On"]').click();
   ```

2. **Inline Test Data** (mixed with test logic)
   ```typescript
   const LOGIN_URL = 'https://wms-dev-automtn.msiidcitgcloud.com/csrkodiak/login';
   const VALID_USER = 'wcsr_automation@moto.com';
   const VALID_PASS = 'Motorola@123';  // ⚠️ Credentials hardcoded
   ```

3. **No Page Object Usage**
   - Should use `LoginPage` class
   - Should use centralized locators
   - Currently bypasses all abstraction layers

4. **Incomplete Test Coverage** (12 test cases)
   - TC_01–TC_12 cover login scenarios
   - Missing assertions for success cases (marked with `// Add assertion here`)
   - Assertions for failures are weak (only checking button visibility)

5. **Test Organization Issues**
   - Located in `tests/` root instead of `tests/specs/`
   - Uses `test.describe()` and `test.beforeEach()` (good pattern)
   - File naming: `01_WCSR_Login.spec.ts` (numeric prefix instead of semantic naming)

#### File: `tests/setup/auth.setup.ts`
**Status**: ⚠️ **Incomplete Setup Pattern**

**Issues**:
- Hardcoded credentials (same as test)
- Hardcoded application URL
- No waitForURL configured (commented out)
- Storage path: `../playwright/.auth/user.json` doesn't match config
- No integration with `playwright.config.ts` projects

**Missing**:
- Configuration to use auth in other tests
- Storage state reuse pattern in other tests

---

### 3) Page Objects Layer (src/pages)

#### File: `src/pages/HomePage.ts`
**Status**: ✅ Structure Correct (but UNUSED)

```typescript
export class HomePage {
  constructor(private readonly page: Page) {}
  
  async goto(): Promise<void> { /* ... */ }
  getStartedLink(): Locator { /* ... */ }
  async clickGetStarted(): Promise<void> { /* ... */ }
}
```

**Assessment**: Good pattern, not applied to real application.

#### File: `src/pages/DocsPage.ts`
**Status**: ✅ Structure Correct (but UNUSED)

**Assessment**: Sample page object, not related to WCSR application.

**Missing Page Objects** (for actual application):
- ❌ `LoginPage.ts` - for WCSR login functionality
- ❌ `DashboardPage.ts` - for post-login workflows
- ❌ Other application pages

---

### 4) Locators Layer (src/locators)

#### File: `src/locators/homePage.locators.ts`
**Status**: ✅ Pattern Correct (but UNUSED)

```typescript
export const homePageLocators = {
  getStartedLink: { role: 'link', name: 'Get started' }
} as const;
```

**Assessment**: Good semantic naming and immutability.

#### File: `src/locators/docsPage.locators.ts`
**Status**: ✅ Pattern Correct (but UNUSED)

**Missing Locators** (for actual application):
- ❌ `loginPage.locators.ts` - username, password, sign-on button, etc.
- ❌ `dashboardPage.locators.ts` - post-login page elements

---

### 5) Documentation Layer (docs/*)

#### File: `docs/ARCHITECTURE.md`
**Status**: ⚠️ **Good Intent, Not Implemented**

- Defines the 3-layer POM pattern correctly
- Provides naming conventions
- Provides guidelines for extension
- **Problem**: Real tests don't follow these guidelines

#### File: `docs/README.md`
**Status**: ✅ **Clear Project Overview**

- Explains architecture intent
- Provides command list
- Explains benefits

---

## Code Quality Issues

### 1. Selector Strategy
- **Current**: Mix of `id`, `title` attribute, role-based selectors
- **Issue**: `input[id="username"]` is brittle and not semantic
- **Recommendation**: Use `getByRole()`, `getByLabel()`, or `getByTestId()`

### 2. Test Data Management
- **Current**: Hardcoded in test file and setup file
- **Issue**: No centralized configuration or environment support
- **Recommendation**: Create `.env` file with environment variables

### 3. Assertion Strategy
- **Current**: Weak assertions (only button visibility)
- **Issue**: Doesn't verify actual login success
- **Recommendation**: Assert on page navigation, dashboard elements

### 4. Error Handling
- **Current**: None
- **Issue**: Failures not descriptive
- **Recommendation**: Add try-catch or error messages

### 5. Timeout Management
- **Current**: Using Playwright defaults
- **Issue**: May timeout on slow network
- **Recommendation**: Add explicit wait strategies

---

## Compliance Checklist

| Principle | Required | Actual | Status |
|-----------|----------|--------|--------|
| Tests separate from selectors | ✅ | ❌ | **FAIL** |
| Page objects for pages | ✅ | ❌ | **FAIL** |
| Locator files centralized | ✅ | ❌ | **FAIL** |
| Config-driven baseURL | ✅ | ❌ | **FAIL** |
| testDir consistent with actual tests | ✅ | ❌ | **FAIL** |
| TypeScript support | ✅ | ✅ | **PASS** |
| Documentation present | ✅ | ✅ | **PASS** |
| Test command scripts | ✅ | ✅ | **PASS** |

**Overall Compliance**: 3/8 (37.5%)

---

## Architectural Debt Summary

### Critical Issues (Blocks execution)
1. ❌ Config `testDir` doesn't match actual test location
2. ❌ Config `baseURL` doesn't match actual application

### High Priority (Violates POM)
1. ❌ No `LoginPage` page object for actual application
2. ❌ No `loginPage.locators.ts` file
3. ❌ Hardcoded selectors in test file (12 violations)
4. ❌ Hardcoded credentials in test file

### Medium Priority (Incomplete setup)
1. ⚠️ Auth setup not integrated with config
2. ⚠️ Test organization: file in wrong location
3. ⚠️ Missing post-login page objects

### Low Priority (Code quality)
1. ⚠️ Weak assertions (missing success criteria)
2. ⚠️ No error handling
3. ⚠️ No environment variable support

---

## Next Steps Recommendation

### Phase 1: Fix Configuration (Day 1)
1. Update `playwright.config.ts` to include actual test location
2. Update `baseURL` to point to WCSR application
3. Integrate auth.setup.ts with config

### Phase 2: Create POM for Login (Day 1)
1. Create `src/locators/loginPage.locators.ts`
2. Create `src/pages/LoginPage.ts`
3. Refactor test to use page object

### Phase 3: Create Test Data Layer (Day 2)
1. Create `.env` file with credentials and URLs
2. Create test data builder
3. Remove hardcoded strings from tests

### Phase 4: Enhance & Extend (Day 2+)
1. Add dashboard page object
2. Add more complete assertions
3. Add error scenarios
4. Move test to proper location (specs/)

---

## Key Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Tests following POM | 0/1 | 1/1 | ❌ |
| Page objects for app | 0 | 3+ | ❌ |
| Locator files for app | 0 | 3+ | ❌ |
| Tests in proper folder | 0/1 | 1/1 | ❌ |
| Hardcoded selectors | 12 | 0 | ❌ |
| Hardcoded credentials | 2 files | 0 files | ❌ |

---

## Conclusion

The project has a **solid architectural foundation** with good documentation, but the **real implementation is not following the defined patterns**. The existing sample page objects and locator files demonstrate the intent, but the actual WCSR login tests bypass all abstraction layers and use hardcoded selectors.

**Recommendation**: Execute Phase 1 + Phase 2 refactoring to align real tests with the architecture documentation.

