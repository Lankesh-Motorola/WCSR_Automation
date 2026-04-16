# WCSR Automation - Debugging Summary

## Issue Found
**Main Page Tests (TC_23-TC_27) Failing**: Tests navigating to the home page were showing a "Loggedout Successfully" error page instead of the expected home page content.

## Root Cause Analysis
1. **App Display**: When navigating to `https://wms-dev-automtn.msiidcitgcloud.com/csrkodiak/index.html#/wcsr/home`, the Angular app renders the `<app-csr-logout>` component instead of `<app-wcsr-home>` component
2. **Session Issue**: The Plawright `storageState` based session reuse wasn't working properly for this route
3. **Content Missing**: The page showed only:
   - Header: "Web based Customer Service Representative Tool" ✓ (TC_21 passes)
   - Error Message: "Unexpected Error" / "Loggedout Successfully" ✗
   - Footer: Copyright text  
   - Missing: Welcome heading, description, instructions, management cards (TC_22-TC_27 fail)

## Fixes Applied

### 1. Removed Session State Storage (auth based tests)
- **Changed**: Removed `test.use({ storageState: 'playwright/.auth/user.json' })` from mainpage tests
- **Reason**: Session reuse wasn't working; app redirects to logout for stored sessions
- **File**: `tests/specs/02_WCSR_MainLP.spec.ts`

### 2. Implemented Fresh Login for Each Test
- **Changed**: Each mainpage test now performs a fresh login via `LoginPage`  
- **Why**: Ensures valid session context for each test execution
- **Code Pattern**:
```typescript
test('TC_XX: ...', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('wcsr_automation@moto.com', 'Motorola@123');
  
  const mainPage = new MainPage(page);
  await mainPage.goto();
  // ... assertions
});
```

### 3. Simplified Navigation Strategy
- **Changed**: MainPage.goto() now navigates to base `index.html` instead of hash route
- **Reason**: Let Angular routing handle navigation after auth is established
- **File**: `src/pages/MainPage.ts`

### 4. Reverted Auth Setup Changes
- **Changed**: Removed intermediate home page navigation in auth.setup.ts
- **Why**: Prevents cookies from becoming invalid/expired before session save
- **File**: `tests/setup/auth.setup.ts`

### 5. Updated Config
- **Changed**: Removed `storageState` and `dependencies: ['setup']` from mainpage project
- **Reason**: Tests no longer depend on setup project; perform own auth
- **File**: `playwright.config.ts`

## Test Status
- **TC_01-TC_20** (Login Tests): ✅ All 20 PASSING (unchanged)
- **TC_21** (Header Title): ✅ PASSING - `"Web based Customer Service Representative Tool"` is rendered
- **TC_22-TC_27** (Main Content): ⚠️ UNDER INVESTIGATION - Elements still not found on page

## Investigation Needed
The main page elements (welcome heading, description, instructions, cards) are not being rendered even after successful login. This could be:

1. **Route Issue**: `/wcsr/home` may not be the correct home page route
2. **Component Guard**: Auth guard might be preventing component load
3. **App Behavior**: The app may not have these UI elements on the rendered home page
4. **Timing Issue**: Elements might load async after page load completes

## Recommended Next Steps

1. **Inspect Actual Rendered Content**:
   - Run debug test to capture page HTML after fresh login
   - Compare actual page structure with expected locators

2. **Verify Route Correctness**:
   - Check browser network tab to see what request is made
   - Verify the app is correctly redirecting/loading home component

3. **Check App Implementation**:
   - Look at app source code to see what components render for `/wcsr/home`
   - Verify UI elements (welcome heading, description, cards) actually exist

4. **Alternative Navigation**:
   - Try navigating through different app routes (e.g., menu links instead of direct URL)
   - See if home page loads correctly from app navigation

## Files Modified
- ✏️ `tests/specs/02_WCSR_MainLP.spec.ts` - Fresh login per test
- ✏️ `src/pages/MainPage.ts` - Simplified navigation  
- ✏️ `tests/setup/auth.setup.ts` - Reverted to simple auth save
- ✏️ `playwright.config.ts` - Removed session state config

## Test Artifacts Generated
- `page_screenshot.png` - Screenshot of rendered page (shows error message)
- `page_html.txt` - Full page HTML content
- `page_text.txt` - Visible text content on page
