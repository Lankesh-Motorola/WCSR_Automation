import { Page, Locator } from '@playwright/test';
import { mainPageLocators } from '../locators/mainPage.locators';
import { APP_URLS, TEST_CREDENTIALS } from '../constants';

export class MainPage {
  constructor(private readonly page: Page) { }

  async goto(): Promise<void> {
    await this.page.goto(APP_URLS.HOME_URL);
    await this.page.waitForLoadState('networkidle');
  }

  // Header elements
  getHeaderTitle(): Locator {
    return this.page.getByText(mainPageLocators.headerTitle.text, {
      exact: mainPageLocators.headerTitle.exact, // Tip: Change exact to false in your locators file if this fails
    });
  }

  getUserEmail(): Locator {
    return this.page.getByText(TEST_CREDENTIALS.USERNAME);
  }

  getWelcomeHeading(): Locator {
    // Replaces getByRole with getByText for a generic element
    return this.page.getByText('Welcome to Customer Service Representative Tool!', { exact: false });
  }

  getDescriptionText(): Locator {
    return this.page.getByText(/management options/i);
  }

  getSubscriberInstruction(): Locator {
    return this.page.getByText(/Subscriber/i).first();
  }

  getCorporateInstruction(): Locator {
    return this.page.getByText(/Corporate/i).first();
  }

  getSubscriberManagementCard(): Locator {
    return this.page.getByText('Subscriber Management', { exact: true });
  }

  getCorporateManagementCard(): Locator {
    return this.page.getByText('Corporate Management', { exact: true });
  }

  async clickSubscriberManagement(): Promise<void> {
    await this.getSubscriberManagementCard().click();
  }

  async clickCorporateManagement(): Promise<void> {
    await this.getCorporateManagementCard().click();
  }

  verifyViewandManageSubscribers(): Locator {
    return this.page.getByText('View and Manage Subscribers', { exact: true });
  }

  clickEnterEmail_PhoneNumber_SystemID(): Locator {
    return this.page.locator('input[placeholder="Enter Email, Phone Number or System ID"]');
  }

  clickViewBtn(): Locator {
    return this.page.getByRole('button', { name: 'View' });
  }

  verifyPopUpMessage(): Locator {
    return this.page.getByText('Invalid Subscriber. Subscriber information not found.', { exact: true });
  }

  clickClosePopupButton(): Locator {
    return this.page.locator('msi-icon[name="ic_remove"]')
  }

  verifyCreateSubscriber(): Locator {
    return this.page.getByText(' Create Subscribers ', { exact: true });
  }

  clickCreateButton(): Locator {
    return this.page.getByRole('button', { name: 'Create' });
  }

  async enterCustomerPhoneNumber(phoneNumber: string): Promise<void> {
    await this.page.locator('input[placeholder="Customer Phone Number"]').fill(phoneNumber);
  }

  async enterName(name: string): Promise<void> {
    await this.page.locator('input[placeholder="Name"]').fill(name);
  }

  async enterCorporateName(corporateName: string): Promise<void> {
    await this.page.locator('input[placeholder="Corporate Name"]').fill(corporateName);
  }

  async enterAccountID(accountID: string): Promise<void> {
    await this.page.locator('input[placeholder="Account ID"]').fill(accountID);
  }

  async clickUserDropdown(): Promise<void> {
    const dropdown = this.page.locator('#sub-clienttype:has-text("User")');
    await dropdown.waitFor({ state: 'visible', timeout: 15000 });
    await dropdown.click();
  }

  async selectUserOption(): Promise<void> {
    const option = this.page.locator('.msi-select-option-ellipsis:has-text("Handset Standard")');
    await option.waitFor({ state: 'visible', timeout: 15000 });
    await option.click();
  }

  async clickSaveBtn() {
    const saveBtn = this.page.locator('.msi-btn:has-text("Save")').first();
    await saveBtn.waitFor({ state: 'visible', timeout: 15000 });
    await saveBtn.click();
  }

  verifyBasicInformation(): Locator {
    return this.page.locator('app-details');
  }

  verifyLaunchCorporateAdmin_Tool(): Locator {
    return this.page.getByText('Launch Corporate Admin Tool', { exact: true });
  }

  getEnterCorpID(): Locator {
    return this.page.locator('input[placeholder="Enter Corporate ID"]');
  }

  clickLaunchBtn(): Locator {
    return this.page.getByText('Launch', { exact: true });
  }

  async switchToNewTab(): Promise<Page> {
    const context = this.page.context();
    let pages = context.pages();

    // If the new page hasn't appeared yet, wait for it
    if (pages.length < 2) {
      await context.waitForEvent('page', { timeout: 15000 });
      pages = context.pages();
    }

    // Get the latest opened tab
    const newPage = pages[pages.length - 1];
    await newPage.bringToFront();
    return newPage;
  }

  //Verify PTT Users heading (h3 tag)
  verifyPTTHeading(): Locator {
    return this.page.locator('h3:has-text("PTT Users")');
  }

  click3dots(): Locator {
    return this.page.locator('div svg-icon.msi-dropdown-trigger-closed')
  }

  clickDeleteText(): Locator {
    return this.page.getByText('Delete')
  }

  clickPopupDelete(): Locator {
    return this.page.getByRole('button', { name: 'Delete' });
  }

  clickLogout(): Locator {
    return this.page.getByText('Logout', { exact: true });
  }


}