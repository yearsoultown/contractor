import type { ProfileFields } from '@/types';

// Maps profile field keys → contract form field names they can fill
export const PROFILE_TO_CONTRACT: Record<keyof ProfileFields, string[]> = {
  full_name: [
    'ClientName', 'ExecutorName', 'LandlordName', 'TenantName',
    'SellerName', 'BuyerName', 'EmployerName', 'EmployeeName',
    'DisclosingParty', 'ReceivingParty', 'LenderName', 'BorrowerName',
    'FreelancerName',
  ],
  company_name: [
    'ClientName', 'ExecutorName', 'LandlordName', 'TenantName',
    'SellerName', 'BuyerName', 'EmployerName',
    'DisclosingParty', 'ReceivingParty', 'LenderName', 'BorrowerName',
  ],
  iin: ['IIN', 'ClientIIN', 'EmployeeIIN', 'BorrowerIIN'],
  bin: ['BIN', 'CompanyBIN', 'EmployerBIN'],
  legal_address: ['LegalAddress', 'PropertyAddress', 'Address'],
  actual_address: ['ActualAddress', 'PropertyAddress', 'Address'],
  phone: ['Phone', 'ClientPhone', 'ExecutorPhone', 'ContactPhone'],
  email: ['Email', 'ClientEmail', 'ContactEmail'],
  iban: ['IBAN', 'BankAccount'],
  bik: ['BIK'],
};

// Reverse map: contract field name → profile field keys that can fill it
const contractToProfileKeys: Record<string, Array<keyof ProfileFields>> = {};
for (const [profileKey, contractFields] of Object.entries(PROFILE_TO_CONTRACT)) {
  for (const contractField of contractFields) {
    if (!contractToProfileKeys[contractField]) {
      contractToProfileKeys[contractField] = [];
    }
    contractToProfileKeys[contractField].push(profileKey as keyof ProfileFields);
  }
}

/**
 * Given a contract form field name and a profile, return the suggested value.
 * For individual profiles, prefer full_name over company_name.
 * For legal_entity profiles, prefer company_name.
 */
export function getSuggestionForField(
  fieldName: string,
  fields: ProfileFields,
  profileType: 'individual' | 'legal_entity'
): string | null {
  const profileKeys = contractToProfileKeys[fieldName];
  if (!profileKeys) return null;

  // Prefer type-appropriate name field
  const orderedKeys =
    profileType === 'legal_entity'
      ? ['company_name', 'full_name', ...profileKeys.filter((k) => k !== 'company_name' && k !== 'full_name')]
      : ['full_name', 'company_name', ...profileKeys.filter((k) => k !== 'full_name' && k !== 'company_name')];

  for (const key of orderedKeys) {
    if (profileKeys.includes(key as keyof ProfileFields)) {
      const val = fields[key as keyof ProfileFields];
      if (val) return val;
    }
  }
  return null;
}

/**
 * Fill all matching form fields from a profile.
 * Returns partial formData update.
 */
export function fillFromProfile(
  fields: ProfileFields,
  profileType: 'individual' | 'legal_entity',
  formFieldNames: string[]
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const fieldName of formFieldNames) {
    const suggestion = getSuggestionForField(fieldName, fields, profileType);
    if (suggestion) {
      result[fieldName] = suggestion;
    }
  }
  return result;
}