import { Page, Locator } from '@playwright/test';

// Your locators
export const mainPageLocators = {
  headerTitle: { text: 'Web based Customer Service Representative Tool', exact: true },
  
  // Updated to use the div and class structure you provided earlier
  welcomeHeading: { locator: 'div.page-title', text: 'Welcome to Customer Service Representative Tool!' },
  
  // Changed "filter" to "filterText" to make the usage below much cleaner
  subscriberManagementCard: { locator: 'div.card-title msi-card-title"]', filterText: 'Subscriber Management' },
  corporateManagementCard: { locator: 'div[class="card-title msi-card-title"]', filterText: 'Corporate Management' },
} as const;