import { test, expect } from '@playwright/test';
import { MainPage } from '../../src/pages/MainPage';
import { SUBSCRIBER_TEST_DATA } from '../../src/constants';
import * as path from 'path';

// Tell Playwright to use the stored login session for all tests in this file
test.use({ storageState: path.join(__dirname, '../../playwright/.auth/user.json') });

test.describe('WCSR Tool - Home Page UI Validation Scenarios', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
  });

  // ---------------------------------------------------------
  // HEADER VERIFICATIONS
  // ---------------------------------------------------------

  test('TC_21: Verify header title text is displayed', async () => {
    await expect(mainPage.getHeaderTitle()).toBeVisible();
  });

  test('TC_22: Verify logged-in user email is displayed in the top right', async () => {
    await expect(mainPage.getUserEmail()).toBeVisible();
  });

  // ---------------------------------------------------------
  // MAIN BODY TEXT VERIFICATIONS
  // ---------------------------------------------------------

  test('TC_23: Verify main welcome heading is displayed', async () => {
    await expect(mainPage.getWelcomeHeading()).toBeVisible();
  });

  // ---------------------------------------------------------
  // ACTIONABLE CARDS/BUTTONS VERIFICATIONS
  // ---------------------------------------------------------

  test('TC_24: Verify "Subscriber Management" card is visible', async () => {
    await expect(mainPage.getSubscriberManagementCard()).toBeVisible();
  });

  test('TC_25: Verify "Corporate Management" card is visible', async () => {
    await expect(mainPage.getCorporateManagementCard()).toBeVisible();
  });

  //Verify Subscriber Management:
  test('TC_26: Verify clicking "Subscriber Management"', async () => {
    await mainPage.clickSubscriberManagement();
    //Verify View and Manage Subscribers
    await expect(mainPage.verifyViewandManageSubscribers()).toBeVisible();
    console.log('Verified: View and Manage Subscribers page is displayed after clicking Subscriber Management card');
    //Verify Create Subscriber
    await expect(mainPage.verifyCreateSubscriber()).toBeVisible();
    console.log('Verified: Create Subscriber page is displayed after clicking Subscriber Management card');
  });

  //Verify Phone Number, Email, System ID entry:
  test('TC_27: Verify entering Phone Number, Email, System ID in search box', async () => {
    await mainPage.clickSubscriberManagement();
    const searchBox = mainPage.clickEnterEmail_PhoneNumber_SystemID();
    await expect(searchBox).toBeVisible();
    await searchBox.fill(SUBSCRIBER_TEST_DATA.PHONE_NUMBER);
    await mainPage.clickViewBtn().click();

    //Verify error popup message
    await expect(mainPage.verifyPopUpMessage()).toBeVisible();
    console.log('Verified: Invalid Subscriber. Subscriber information not found.');
    //Close the popup
    await mainPage.clickClosePopupButton().click();
  });

  //Create New Subscriber:
  test('TC_28: Verify creating a new subscriber', async () => {
    await mainPage.clickSubscriberManagement();
    //Click on Create Subscriber
    await mainPage.clickCreateButton().click();

    //Enter Customer Phone Number
    await mainPage.enterCustomerPhoneNumber(SUBSCRIBER_TEST_DATA.PHONE_NUMBER);

    //Enter Name
    await mainPage.enterName(SUBSCRIBER_TEST_DATA.NAME);

    //Enter Corporate Name
    await mainPage.enterCorporateName(SUBSCRIBER_TEST_DATA.CORPORATE_NAME);

    //Enter Account ID
    await mainPage.enterAccountID(SUBSCRIBER_TEST_DATA.ACCOUNT_ID);

    //Click User Dropdown button
    await mainPage.clickUserDropdown();

    //Select User Option
    await mainPage.selectUserOption();

    //Click on Save button
    await mainPage.clickSaveBtn();
  });

  //Verify Newly created subscriber details:
  test('TC_29: Verify newly created subscriber details', async () => {
    await mainPage.clickSubscriberManagement();
    const searchBox = mainPage.clickEnterEmail_PhoneNumber_SystemID();
    await expect(searchBox).toBeVisible();
    await searchBox.fill(SUBSCRIBER_TEST_DATA.PHONE_NUMBER);
    await mainPage.clickViewBtn().click();
    //Verify Basic Information
    await expect(mainPage.verifyBasicInformation()).toBeVisible();
    //Print Basic Information details for the newly created subscriber
    const basicInfo = await mainPage.verifyBasicInformation().textContent();
    console.log('Basic Information details for the newly created subscriber:', basicInfo);
  });

  //Corporate Management Scenarios:
  test('TC_30: Verify Corporate Management card is visible', async () => {
    await expect(mainPage.getCorporateManagementCard()).toBeVisible();
  });

  test('TC_31: Verify clicking "Corporate Management"', async ({ page }) => {
    await mainPage.clickCorporateManagement();
    //Verify Launch Corporate Admin Tool
    await expect(mainPage.verifyLaunchCorporateAdmin_Tool()).toBeVisible();
    console.log('Verified: Launch Corporate Admin Tool page is displayed after clicking Corporate Management card');
    //Enter Corporate ID
    await mainPage.getEnterCorpID().fill(SUBSCRIBER_TEST_DATA.ACCOUNT_ID);
    //Click on Launch button
    const pagePromise = page.context().waitForEvent('page');
    await mainPage.clickLaunchBtn().click();
    const newPage = await pagePromise;

    //Wait for URL to load the PTT page
    await newPage.waitForURL(/.*cobalt-ngcatui\/index\.html/, { timeout: 60000, waitUntil: 'load' });

    //Verify PTT Heading on new page:
    const newPageMainPage = new MainPage(newPage);
    await expect(newPageMainPage.verifyPTTHeading()).toBeVisible();
    console.log('PTT Heading Visible');
    //Close the current tab
    await newPage.close();
    console.log('Closed the current tab');
  });

  //Delete the Subscriber
  test('TC_32: Verify deleting the subscriber', async () => {
    await mainPage.clickSubscriberManagement();
    const searchBox = mainPage.clickEnterEmail_PhoneNumber_SystemID();
    await expect(searchBox).toBeVisible();
    await searchBox.fill(SUBSCRIBER_TEST_DATA.PHONE_NUMBER);
    await mainPage.clickViewBtn().click();
    //Verify Basic Information
    await expect(mainPage.verifyBasicInformation()).toBeVisible();
    //Click on 3 dots:
    await mainPage.click3dots().click();
    //Click Delete Text
    await mainPage.clickDeleteText().click();
    //Click Popup Delete
    await mainPage.clickPopupDelete().click();

  });

  //Perform Logout scenaio
  test('TC_33: Verify Logout functionality', async ({ page }) => {
    //Click on Email Id
    await mainPage.getUserEmail().click();
    //Fetch all the details from the dropdown
    const dropdownOptions = page.locator('div.msi-dropdown');
    //Print the content
    const optionsCount = await dropdownOptions.count();
    console.log('Dropdown options:');
    for (let i = 0; i < optionsCount; i++) {
      const optionText = await dropdownOptions.nth(i).textContent();
      console.log(`Option ${i + 1}: ${optionText}`);
    }
    //Click Logout Option
    await mainPage.clickLogout().click();
  })

});