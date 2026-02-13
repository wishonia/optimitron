#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DRY_RUN = process.argv.includes('--dry-run');

const SKIP_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.next',
  '.turbo',
]);

const TEXT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.prisma',
  '.yml',
  '.yaml',
]);

const REPLACEMENTS = [
  // Relationship/type names first (longest first).
  ['UnitVariableRelationship', 'NOf1VariableRelationship'],
  ['unitVariableRelationships', 'nOf1VariableRelationships'],
  ['unitVariableRelationship', 'nOf1VariableRelationship'],
  ['UnitVariableRelationships', 'NOf1VariableRelationships'],

  // Core model/type names.
  ['UnitVariableStatistics', 'NOf1VariableStatistics'],
  ['calculateUnitVariableStatistics', 'calculateNOf1VariableStatistics'],
  ['aggregateUnitVariableRelationships', 'aggregateNOf1VariableRelationships'],
  ['toUnitVariableRelationship', 'toNOf1VariableRelationship'],
  ['UnitVariableDefaultUnit', 'NOf1VariableDefaultUnit'],
  ['UnitRelPredictorGlobal', 'NOf1RelPredictorGlobal'],
  ['UnitRelOutcomeGlobal', 'NOf1RelOutcomeGlobal'],
  ['unitRelationshipsAsPredictor', 'nOf1RelationshipsAsPredictor'],
  ['unitRelationshipsAsOutcome', 'nOf1RelationshipsAsOutcome'],
  ['numberOfUnitVariables', 'numberOfNOf1Variables'],
  ['UnitVariable', 'NOf1Variable'],
  ['unitVariables', 'nOf1Variables'],
  ['unitVariableId', 'nOf1VariableId'],
  ['unitVariable', 'nOf1Variable'],
];

function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  return TEXT_EXTENSIONS.has(ext);
}

async function walk(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.name !== '.conductor') {
      continue;
    }
    if (SKIP_DIRS.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, files);
      continue;
    }
    if (entry.isFile() && shouldProcessFile(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function applyReplacements(text) {
  let output = text;
  for (const [from, to] of REPLACEMENTS) {
    output = output.split(from).join(to);
  }
  return output;
}

async function main() {
  const files = await walk(ROOT);
  const changedFiles = [];
  const selfPath = path.resolve(
    ROOT,
    'scripts',
    'rename-unit-variable-to-nof1.mjs',
  );

  for (const filePath of files) {
    if (path.resolve(filePath) === selfPath) {
      continue;
    }
    const original = await fs.readFile(filePath, 'utf8');
    const updated = applyReplacements(original);
    if (updated === original) continue;

    changedFiles.push(path.relative(ROOT, filePath));
    if (!DRY_RUN) {
      await fs.writeFile(filePath, updated, 'utf8');
    }
  }

  console.log(
    `${DRY_RUN ? '[dry-run] ' : ''}Updated ${changedFiles.length} file(s).`,
  );
  for (const file of changedFiles) {
    console.log(`- ${file}`);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
