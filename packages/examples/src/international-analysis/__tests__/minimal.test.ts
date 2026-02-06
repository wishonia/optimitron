import { describe, it, expect } from 'vitest';
import { generateHealthComparison } from '../generate-health-comparison.js';
import { generateDrugPolicyComparison } from '../generate-drug-policy-comparison.js';
import { generateEducationComparison } from '../generate-education-comparison.js';

describe('all generator imports', () => {
  it('should import all generators', () => {
    expect(typeof generateHealthComparison).toBe('function');
    expect(typeof generateDrugPolicyComparison).toBe('function');
    expect(typeof generateEducationComparison).toBe('function');
  });
});
