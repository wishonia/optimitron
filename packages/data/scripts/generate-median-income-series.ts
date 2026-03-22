import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildEurostatMedianIncomeSeries,
  buildPipMedianIncomeSeries,
  renderGeneratedMedianIncomeModule,
} from '../src/datasets/median-income-series-build.ts';
import { fetchEurostatMedianDisposableIncomeSeries } from '../src/fetchers/eurostat-income.ts';
import { fetchPIPIncomeSeries } from '../src/fetchers/world-bank-pip.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main(): Promise<void> {
  const pipRecords = await fetchPIPIncomeSeries({
    welfareType: 'income',
    period: { startYear: 1981, endYear: new Date().getUTCFullYear() },
  });
  const eurostatRecords = await fetchEurostatMedianDisposableIncomeSeries({
    period: { startYear: 1995, endYear: new Date().getUTCFullYear() },
  });

  const generatedRecords = [
    ...buildPipMedianIncomeSeries(pipRecords),
    ...buildEurostatMedianIncomeSeries(eurostatRecords),
  ];
  const metadata = {
    generatedAt: new Date().toISOString(),
    recordCount: generatedRecords.length,
    sources: ['Eurostat EU-SILC', 'World Bank PIP'] as const,
    caveats: [
      'This generated snapshot includes strict after-tax Eurostat EU-SILC records plus broad-coverage World Bank PIP fallback records.',
      'PIP median income is not guaranteed to be after-tax disposable income and should be treated as fallback coverage.',
      'Eurostat real PPP records are derived from EU-SILC national-currency medians using Eurostat HICP inflation and the World Bank private-consumption PPP conversion factor.',
      'PIP rows may include interpolated years; use isInterpolated metadata or excludeInterpolated filters when you need survey-only observations.',
      'OECD IDD after-tax disposable-income derivation utilities exist in the library, but the OECD bulk API is rate-limited and is not bundled into this generated snapshot yet.',
    ],
  };
  const moduleSource = renderGeneratedMedianIncomeModule(
    generatedRecords,
    metadata,
  );

  const outputDir = path.resolve(__dirname, '../src/generated');
  const outputPath = path.join(outputDir, 'median-income-series.ts');
  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, moduleSource, 'utf8');

  console.log(
    `Wrote ${generatedRecords.length} generated median-income records to ${outputPath}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
