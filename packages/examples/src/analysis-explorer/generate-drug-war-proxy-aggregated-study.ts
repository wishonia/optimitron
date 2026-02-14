import {
  runAggregatedDrugWarProxyStudy,
  writeAggregatedDrugWarProxyStudyFiles,
} from "./drug-war-proxy-aggregated-study.js";

function main(): void {
  const study = runAggregatedDrugWarProxyStudy();
  const paths = writeAggregatedDrugWarProxyStudyFiles(study);
  console.log("Generated aggregated drug-enforcement study:");
  console.log(`- Markdown: ${paths.markdownPath}`);
  console.log(`- JSON: ${paths.jsonPath}`);
}

main();
