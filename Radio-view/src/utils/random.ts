/**
 * Generate a random email
 * @returns a random email
 */
export function generateRandomEmail() {
  return `test-${Math.floor(Math.random() * 1000000)}@example.com`;
}

/**
 * Generate a random system name
 * @param edited - if the system name is for editing
 * @returns a random system name
 */
export function generateRandomSystemName(edited?: boolean) {
  if (edited) {
    return `Test System Integration test edited ${Math.floor(Math.random() * 1000000)}`;
  }
  return `Test System Integration test ${Math.floor(Math.random() * 1000000)}`;
}

/**
 * Generate a random system alias
 * @returns a random system alias
 */
export function generateRandomAlias() {
  return `TSIN`;
}

/**
 * Generate a random contact name
 * @returns a random contact name
 */
export function generateRandomContactName() {
  return `Test User ${Math.floor(Math.random() * 1000000)}`;
}

/**
 * Generate a random contact phone
 * @returns a random contact phone
 */
export function generateRandomContactPhone() {
  return `+15203780407`;
}

/**
 * Generate a random site name
 * @param edited - if the site name is for editing
 * @returns a random site name
 */
export function generateRandomSiteName(edited?: boolean) {
  if (edited) {
    return `Test Site Integration test edited ${Math.floor(Math.random() * 1000000)}`;
  }
  return `Test Site Integration test ${Math.floor(Math.random() * 1000000)}`;
}

/**
 * Generate a random address
 * @returns a random address
 */

export function generateRandomAddress() {
  return `Test Address ${Math.floor(Math.random() * 1000000)}`;
}

/**
 * Generate a random clinician first name max 30 characters
 * @returns a random clinician first name
 */
export function generateRandomClinicianFirstName() {
  return `Integration Test Clinician${Math.floor(Math.random() * 10)}`;
}

/**
 * Generate a random clinician last name
 * @returns a random clinician last name
 */
export function generateRandomClinicianLastName(edited?: boolean) {
  if (edited) {
    return "Edited";
  }
  return "New";
}

/**
 * Generate a random date of birth
 * @returns a random date of birth in MM/DD/YYYY format
 */
export function generateRandomDOB() {
  return "01/01/1990";
}
