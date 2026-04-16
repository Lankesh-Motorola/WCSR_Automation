export const loginPageLocators = {
  usernameInput: {
    selector: 'input[id="username"]',
  },
  passwordInput: {
    selector: 'input[id="password"]',
  },
  signOnButton: {
    selector: 'button[title="Sign On"]',
  },
  headerText: {
    text: 'WCSR Tool - Sign On',
  },
} as const;
