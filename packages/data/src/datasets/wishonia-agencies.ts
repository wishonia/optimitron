/**
 * Wishonia's replacement agencies — pure data, no UI imports.
 *
 * Each entry describes a Wishonia digital agency that replaces one or more
 * Earth government agencies, including the code that does the replacing.
 */

export interface WishoniaAgencyStat {
  value: string;
  label: string;
  description?: string;
  color?: "pink" | "cyan" | "yellow" | "green";
}

/** What an agency actually optimizes for — stated vs revealed preference. */
export interface OptimizationMetric {
  /** Short metric name, e.g. "Papers Published" or "Median HALE" */
  metric: string;
  /** Why this is what they actually optimize for (or should). */
  description: string;
}

export interface WishoniaAgency {
  id: string;
  dName: string;
  replaces: string[];
  replacesAgencyName: string;
  /** Full Wishonia-voice explanation (1-3 sentences). Used for page hero, nav, metadata. */
  description: string;
  /** One-liner for compact UIs (tools page, slide-armory, index cards). */
  tagline: string;
  /** What the Earth agency actually optimizes for (the perverse incentive). */
  deprecatedMetrics: OptimizationMetric[];
  /** What the replacement optimizes for (the metric that matters). */
  optimalMetrics: OptimizationMetric[];
  stats: WishoniaAgencyStat[];
  codeHeader: string;
  replacementCode: string;
  codeLanguage: "solidity" | "typescript";
  codeExplanation: string;
  annualSavings: string;
  savingsComparison: string;
  wishoniaQuote: string;
  cardColor: "pink" | "cyan" | "yellow" | "green";
}

/** Keyed record of all Wishonia agencies. Use `AGENCIES.dfed` for direct access. */
export const AGENCIES = {
  dfed: {
    id: "dfed",
    dName: "Algorithmic Reserve",
    replaces: ["fed"],
    replacesAgencyName: "Federal Reserve System",
    description:
      "Twelve people in a room deciding how much your money is worth. On my planet, we call that a hostage situation.",
    tagline: "0% inflation anchored to productivity — new money via UBI, not banks",
    deprecatedMetrics: [
      { metric: "2% Annual Inflation Target", description: "Deliberately devalues every paycheck by 2%/year. They call this 'price stability.' Your grandparents call it 'why a house costs 40x what it used to.'" },
      { metric: "Bank Profitability", description: "New money goes to banks first. They lend it out before prices adjust. By the time it reaches you, the purchasing power is already gone." },
      { metric: "Institutional Self-Preservation", description: "111 years, zero audits. The Fed's primary achievement is making everyone too busy to question why 12 people control the money supply." },
    ],
    optimalMetrics: [
      { metric: "Median Real After-Tax Income", description: "The only monetary policy metric that matters: can a normal person buy more stuff this year than last year?" },
      { metric: "0% Inflation Rate", description: "Fixed supply anchored to productivity growth. Your money buys more over time, not less." },
      { metric: "Equal Distribution of New Money", description: "Productivity gains distributed as UBI, not funnelled through banks to asset holders first." },
    ],
    stats: [
      {
        value: "12",
        label: "Board Members",
        description: "Unelected humans controlling money for 330 million people",
        color: "pink",
      },
      {
        value: "~23,000",
        label: "Employees",
        description: "Staff across 12 regional Federal Reserve Banks",
        color: "yellow",
      },
      {
        value: "$5.5B",
        label: "Annual Budget",
        description: "Operating expenses of the Federal Reserve System",
        color: "cyan",
      },
      {
        value: "96%",
        label: "Dollar Devalued",
        description: "Purchasing power lost since the Fed was created in 1913",
        color: "pink",
      },
    ],
    codeHeader: "12 unelected humans → 1 constructor parameter",
    replacementCode: `// WishToken.sol — the entire monetary policy
constructor(
    address _treasury,
    uint256 _initialSupply,  // Fixed. Forever. No meetings.
    uint256 _taxRateBps      // 0.5% — replaces the entire IRS
) ERC20("Wish", "WISH") Ownable(msg.sender) {
    maxSupply = _initialSupply;  // Set once. Can never increase.
    _mint(msg.sender, _initialSupply);
}

// That's it. No board meetings. No interest rate decisions.
// No quantitative easing. No money printer. Just math.`,
    codeLanguage: "solidity",
    codeExplanation:
      "The total supply of $WISH is set once at deployment and enforced by the contract. No entity can create more. Productivity gains manifest as gentle deflation — your money buys more over time, not less.",
    annualSavings: "96% of your purchasing power",
    savingsComparison:
      "Since 1913, the dollar has lost 96 cents of every dollar. Under fixed supply, that theft is mathematically impossible.",
    wishoniaQuote:
      "Your central bank has one job: manage the money supply. In 111 years they've managed to destroy 96% of it. On my planet we'd call that a bug report, not a mandate.",
    cardColor: "pink",
  },
  dirs: {
    id: "dirs",
    dName: "Automated Revenue Service",
    replaces: ["irs"],
    replacesAgencyName: "Internal Revenue Service",
    description:
      "Six lines of code. That's all it took.",
    tagline: "Six lines of Solidity replace 74,000 pages of tax code",
    deprecatedMetrics: [
      { metric: "Tax Code Complexity", description: "74,000 pages. Every loophole is a feature, not a bug — it's how donors get paid back." },
      { metric: "Compliance Burden", description: "6.1 billion hours/year of citizen time. An entire profession ('accountant') exists to decode rules you wrote for yourselves." },
      { metric: "Audit Revenue", description: "83,000 employees optimizing for catching mistakes in a system designed to produce them." },
    ],
    optimalMetrics: [
      { metric: "Revenue per Dollar of Overhead", description: "0.5% transaction tax collects the same revenue at ~0% administrative cost." },
      { metric: "Zero Citizen Filing Time", description: "No forms, no deadlines, no accountants. Tax happens automatically on every transfer." },
      { metric: "Zero Loopholes", description: "Can't lobby a smart contract. Can't offshore a protocol. The tax is unavoidable because it's the protocol." },
    ],
    stats: [
      {
        value: "83,000",
        label: "Employees",
        description: "Full-time IRS staff interpreting the tax code",
        color: "pink",
      },
      {
        value: "$12.3B",
        label: "Annual Budget",
        description: "Cost to run the IRS each year",
        color: "yellow",
      },
      {
        value: "74,000",
        label: "Pages of Tax Code",
        description: "The Internal Revenue Code and associated regulations",
        color: "cyan",
      },
      {
        value: "6.1B hrs",
        label: "Annual Filing Time",
        description: "Hours Americans spend on tax compliance each year",
        color: "pink",
      },
    ],
    codeHeader: "74,000 pages of tax code → 6 lines of Solidity",
    replacementCode: `// WishToken._update() — replaces the entire IRS
function _update(address from, address to, uint256 value) internal override {
    // Skip tax on mints, burns, or exempt addresses
    if (from == address(0) || to == address(0) || taxExempt[from]) {
        super._update(from, to, value);
        return;
    }
    uint256 taxAmount = (value * taxRateBps) / 10_000;  // 0.5% of every transfer
    super._update(from, treasury, taxAmount);            // Tax → treasury (automatic)
    super._update(from, to, value - taxAmount);          // Rest → recipient
}
// No filing. No audits. No loopholes. No accountants. No evasion.`,
    codeLanguage: "solidity",
    codeExplanation:
      "Every transfer automatically deducts 0.5% and sends it to the treasury. No filing, no forms, no audits, no compliance departments, no offshore accounts. The tax is unavoidable because it's built into the protocol.",
    annualSavings: "$212B+",
    savingsComparison:
      "$12.3B direct IRS budget + $200B+ in annual compliance costs eliminated. That's $640 per American per year just in paperwork savings.",
    wishoniaQuote:
      "83,000 people interpreting 74,000 pages to do what six lines of code does automatically. And you wonder where your taxes go.",
    cardColor: "cyan",
  },
  dssa: {
    id: "dssa",
    dName: "Universal Security Administration",
    replaces: ["ssa"],
    replacesAgencyName: "Social Security Administration + Welfare Bureaucracy",
    description:
      "You spend more administering help than you spend helping. That's not a safety net — that's a jobs programme for administrators.",
    tagline: "UBI replaces 83 welfare programs with one for-loop",
    deprecatedMetrics: [
      { metric: "Means-Testing Accuracy", description: "Optimizing for 'did we correctly decide who deserves to eat' instead of just feeding everyone." },
      { metric: "Fraud Prevention Rate", description: "Spending more catching the 1.5% who cheat than it would cost to just give everyone the money." },
      { metric: "Caseworker Employment", description: "80+ overlapping programs, each with its own bureaucracy, each justifying its own existence." },
    ],
    optimalMetrics: [
      { metric: "Poverty Rate", description: "One number. Is it going down? Good. Is it zero? Done." },
      { metric: "Zero Humans Falling Through Cracks", description: "UBI via World ID. If you're human, you qualify. No applications, no wait, no committee deciding if you deserve lunch." },
      { metric: "Admin Cost as % of Disbursement", description: "Current system: up to 50% overhead. UBI for-loop: ~0%." },
    ],
    stats: [
      {
        value: "$1.1T",
        label: "Annual Admin Overhead",
        description: "Cost of administering means-tested welfare programs",
        color: "pink",
      },
      {
        value: "80+",
        label: "Overlapping Programs",
        description: "Federal means-tested welfare programs with separate bureaucracies",
        color: "yellow",
      },
      {
        value: "~45 days",
        label: "Average Processing Time",
        description: "Wait time for SNAP, Medicaid, or disability applications",
        color: "cyan",
      },
      {
        value: "$0",
        label: "To People Who Fall Through Cracks",
        description: "Millions who qualify but never navigate the paperwork",
        color: "pink",
      },
    ],
    codeHeader: "80+ welfare programs → 1 function call",
    replacementCode: `// UBIDistributor.distributeUBI() — replaces the entire welfare system
function distributeUBI() external {                             // Anyone can call this
    uint256 balance = wishToken.balanceOf(address(this));       // How much is in the pot
    uint256 perCitizen = balance / citizenList.length;          // Split equally

    for (uint256 i = 0; i < citizenList.length; i++) {
        wishToken.safeTransfer(citizenList[i], perCitizen);    // Send to every citizen
    }
}
// No applications. No case workers. No means testing.
// No fraud investigation. No waiting. Just equal splits.`,
    codeLanguage: "solidity",
    codeExplanation:
      "Every verified citizen (World ID) gets an equal share. No applications, no case workers, no means-testing, no fraud investigation, no processing delays. The entire welfare bureaucracy becomes a for-loop.",
    annualSavings: "$1.1 trillion",
    savingsComparison:
      "That's more than the GDP of the Netherlands. Spent not on helping people, but on deciding which people deserve help.",
    wishoniaQuote:
      "You spend more money deciding who deserves help than you spend helping them. That's not a safety net. That's a jobs programme for form designers.",
    cardColor: "yellow",
  },
  dfec: {
    id: "dfec",
    dName: "Aligned Election Commission",
    replaces: ["fec"],
    replacesAgencyName: "Federal Election Commission + Campaign Finance System",
    description:
      "Your politicians are funded by the people they're supposed to regulate. You call this 'campaign finance.' I call it 'bribery with extra steps.'",
    tagline: "Politicians funded by alignment score, not donor checks",
    deprecatedMetrics: [
      { metric: "Donor Access Preserved", description: "0.01% of the population provides the majority of campaign funds. The FEC's job is to make sure this stays legal." },
      { metric: "Incumbent Re-Election Rate", description: "94% of incumbents win. The campaign finance system is an incumbent protection racket that files paperwork." },
      { metric: "Dark Money Facilitated", description: "67% increase in undisclosed spending since Citizens United. The FEC has 6 commissioners and they deadlock on purpose." },
    ],
    optimalMetrics: [
      { metric: "Citizen-Politician Alignment Score", description: "One number per politician: how closely do their votes match what citizens actually want? Public. Immutable. Updated in real-time." },
      { metric: "Policy Outcomes vs Citizen Preferences", description: "Did the things people voted for actually happen? And did outcomes improve?" },
      { metric: "Campaign Funding Proportional to Alignment", description: "Represent citizens well → get funded. Represent donors well → get nothing." },
    ],
    stats: [
      {
        value: "$4.7B",
        label: "2024 Election Spending",
        description: "Total campaign spending in the 2024 US federal election cycle",
        color: "pink",
      },
      {
        value: "$3.7B",
        label: "Annual Lobbying",
        description: "Reported federal lobbying expenditures per year",
        color: "yellow",
      },
      {
        value: "67%",
        label: "Dark Money Growth",
        description: "Increase in undisclosed political spending since Citizens United",
        color: "cyan",
      },
      {
        value: "0.01%",
        label: "Mega-Donors",
        description: "Share of population providing majority of campaign funds",
        color: "pink",
      },
    ],
    codeHeader: "PACs + lobbyists + dark money → 1 allocation function",
    replacementCode: `// PoliticalIncentiveAllocator.allocate() — replaces campaign finance
function allocate(bytes32 jurisdiction, bytes32[] leaves,
    bytes32[][] proofs, uint256[] scores) external {
    for (uint256 i = 0; i < leaves.length; i++) {
        bool valid = oracle.verifyScore(jurisdiction, leaves[i], proofs[i]);
        if (!valid || scores[i] < minimumAlignmentScore) continue;
        // Fund proportional to citizen alignment — not donor alignment
        uint256 weight = scores[i] - minimumAlignmentScore;
        uint256 share = (balance * weight) / totalWeight;
        stablecoin.safeTransfer(politician.campaignWallet, share);
    }
}
// Politicians funded by how well they represent citizens.
// Not by how much they pleased their donors.`,
    codeLanguage: "solidity",
    codeExplanation:
      "Politicians receive campaign funding proportional to their Citizen Alignment Score — how closely their votes match citizen preferences. Below minimum alignment? $0. No donors, no PACs, no dark money. Just math measuring representation.",
    annualSavings: "$8.4B+",
    savingsComparison:
      "Eliminates $4.7B in campaign spending + $3.7B in lobbying. More importantly: eliminates the incentive for politicians to serve donors instead of citizens.",
    wishoniaQuote:
      "Your politicians are funded by the people they're supposed to regulate. You call this 'campaign finance.' I call it 'bribery with extra steps.'",
    cardColor: "green",
  },
  dgao: {
    id: "dgao",
    dName: "Decentralized Accountability Office",
    replaces: ["gao"],
    replacesAgencyName: "Government Accountability Office",
    description:
      "You pay 3,400 humans to audit a ledger that could audit itself. Then you wait eighteen months for the results.",
    tagline: "Every fund flow on IPFS — impossible to quietly delete",
    deprecatedMetrics: [
      { metric: "Reports Published", description: "900+ reports/year. Impressive output. 33% of recommendations are ignored. Impressive futility." },
      { metric: "Audit Cycle Time", description: "18 months from start to published report. By then the money is spent, the people are gone, and the next scandal has started." },
      { metric: "Sampling Coverage", description: "Can only audit a fraction of government spending. The rest is trusted on faith. Which is how you get $35 trillion in debt." },
    ],
    optimalMetrics: [
      { metric: "Real-Time Transaction Visibility", description: "Every government transaction visible in seconds, not 18 months. On IPFS. Immutable." },
      { metric: "Zero Ability to Hide Spending", description: "When the ledger is public, there's nothing to audit. The transparency IS the accountability." },
      { metric: "100% Coverage", description: "Every transaction, not a sample. Every department, not a rotation. Always, not periodically." },
    ],
    stats: [
      {
        value: "3,400",
        label: "Auditors",
        description: "GAO employees investigating government spending",
        color: "pink",
      },
      {
        value: "$803M",
        label: "Annual Budget",
        description: "Cost to audit how the government spends money",
        color: "yellow",
      },
      {
        value: "~18 months",
        label: "Average Audit Time",
        description: "Time from audit start to published report",
        color: "cyan",
      },
      {
        value: "33%",
        label: "Recommendations Ignored",
        description: "GAO recommendations that agencies fail to implement",
        color: "pink",
      },
    ],
    codeHeader: "3,400 auditors × 18 months → the blockchain itself",
    replacementCode: `// No function needed. The blockchain IS the audit.
//
// Every transaction is:
//   ✓ Public          — anyone can read it
//   ✓ Immutable       — no one can alter it
//   ✓ Real-time       — visible in seconds, not 18 months
//   ✓ Deterministic   — smart contracts execute exactly as written
//   ✓ Free            — no $803M/yr budget required
//
// WishocraticTreasury.distribute() is permissionless.
// Anyone can verify that funds went to the right places
// by reading the chain. That's it. That's the audit.`,
    codeLanguage: "solidity",
    codeExplanation:
      "When every government transaction is on a public blockchain, auditing is free, instant, and automatic. There's nothing to investigate because there's nothing to hide. The ledger is the audit.",
    annualSavings: "$803M",
    savingsComparison:
      "Plus: real-time accountability instead of 18-month delays. Plus: 100% coverage instead of sampling. Plus: citizens can audit directly instead of trusting auditors.",
    wishoniaQuote:
      "You pay 3,400 humans $803 million a year to audit a ledger. My ledger audits itself. It's called a blockchain. You invented it and then didn't use it. My planet banned this as performance art in year six.",
    cardColor: "cyan",
  },
  dcbo: {
    id: "dcbo",
    dName: "Optimal Policy Generator",
    replaces: ["cbo"],
    replacesAgencyName: "Congressional Budget Office",
    description:
      "275 humans spend months guessing what a bill will cost. The algorithm does it in 200 milliseconds and shows its work.",
    tagline: "Grade every policy A–F by what actually happened",
    deprecatedMetrics: [
      { metric: "Bills Scored per Session", description: "Throughput of a process that takes 2-4 months per bill. By the time it's scored, the political moment has passed." },
      { metric: "Political Neutrality Perception", description: "The CBO is 'nonpartisan' in the same way a referee is neutral — everyone screams at them and the rules keep changing." },
      { metric: "Forecast Accuracy (Low)", description: "CBO deficit projections are routinely off by hundreds of billions. The 10-year forecast is astrology with spreadsheets." },
    ],
    optimalMetrics: [
      { metric: "Policy Grade Accuracy (A–F)", description: "Every policy graded by what actually happened when someone tried it. Cross-country causal inference, not projection." },
      { metric: "Evidence Quality Score", description: "Weighted by study rigor, precision, and recency. Shows its work. Can't be lobbied." },
      { metric: "Time to Score: Milliseconds", description: "200ms, not 4 months. The algorithm doesn't need to convene a meeting." },
    ],
    stats: [
      {
        value: "275",
        label: "Analysts",
        description: "CBO staff scoring legislation and economic forecasts",
        color: "pink",
      },
      {
        value: "~$62M",
        label: "Annual Budget",
        description: "Cost to operate the Congressional Budget Office",
        color: "yellow",
      },
      {
        value: "2-4 months",
        label: "Time to Score a Bill",
        description: "How long it takes to produce a cost estimate for one piece of legislation",
        color: "cyan",
      },
      {
        value: "Political",
        label: "Pressure on Scoring",
        description: "Elected officials routinely pressure CBO for favorable scores",
        color: "pink",
      },
    ],
    codeHeader: "275 analysts × 4 months → 1 function call",
    replacementCode: `// budgetImpactScore() — replaces CBO scoring
export function calculateWES(estimates: EffectEstimate[]): WESCalculationResult {
    let totalWeightedScore = 0;
    for (const est of estimates) {
        const wQ = qualityWeight(est.method);    // How rigorous was the study?
        const wP = precisionWeight(est.se);      // How precise is the estimate?
        const wR = recencyWeight(est.year);      // How recent is the evidence?
        totalWeightedScore += wQ * wP * wR;      // Combine all three
    }
    const score = Math.min(1, totalWeightedScore / K);  // Normalize to 0-1
    return { score, grade: scoreToGrade(score) };        // A through F
}
// No political pressure. No months of delay.
// Evidence-graded A through F. Shows its work.`,
    codeLanguage: "typescript",
    codeExplanation:
      "Every spending category gets a Welfare Evidence Score based on study quality, precision, and recency. Grade A means strong causal evidence of welfare impact. Grade F means no demonstrated benefit. The algorithm scores in milliseconds and can't be lobbied.",
    annualSavings: "$62M",
    savingsComparison:
      "The money is small. The real savings: bills scored in milliseconds instead of months, evidence-graded instead of politically pressured, and every citizen can verify the methodology.",
    wishoniaQuote:
      "275 humans spend months guessing what a bill will cost. The algorithm does it in 200 milliseconds and shows its work. But sure, let the humans keep guessing.",
    cardColor: "yellow",
  },
  domb: {
    id: "domb",
    dName: "Optimal Budget Generator",
    replaces: ["omb"],
    replacesAgencyName: "Office of Management and Budget",
    description:
      "535 politicians decide how to spend $6.8 trillion. None of them asked you. The eigenvector asks everyone.",
    tagline: "Find the cheapest high performer per budget category",
    deprecatedMetrics: [
      { metric: "Presidential Budget Proposal Completion", description: "500 staff spend a year writing a document that Congress ignores. The budget is decided by horse-trading, not analysis." },
      { metric: "Political Alignment of Allocations", description: "Money flows to districts of powerful committee chairs, not to where it produces the most welfare per dollar." },
      { metric: "Zero Citizens Consulted", description: "535 politicians decide how to spend $6.8 trillion. The number of citizens whose preferences are formally measured: zero." },
    ],
    optimalMetrics: [
      { metric: "Citizen Preference Satisfaction", description: "8 billion pairwise comparisons aggregated by eigenvector. The budget reflects what people actually want, not what lobbyists negotiated." },
      { metric: "Welfare per Dollar (Diminishing Returns)", description: "Each category funded to the point where the next dollar stops helping. Your government has never modelled diminishing returns." },
      { metric: "Cross-Country Efficiency Benchmarking", description: "Singapore spends $3K/person on healthcare and lives to 84. America spends $12K and lives to 78. The algorithm notices." },
    ],
    stats: [
      {
        value: "~500",
        label: "OMB Staff",
        description: "Employees preparing the President's annual budget proposal",
        color: "pink",
      },
      {
        value: "$120M",
        label: "Annual Budget",
        description: "Cost to run the Office of Management and Budget",
        color: "yellow",
      },
      {
        value: "535",
        label: "Politicians Deciding",
        description: "Members of Congress who approve the final budget through horse-trading",
        color: "cyan",
      },
      {
        value: "0",
        label: "Citizens Asked",
        description: "Number of citizens whose budget preferences are formally measured",
        color: "pink",
      },
    ],
    codeHeader: "535 politicians horse-trading → 8 billion citizens tapping",
    replacementCode: `// WishocraticTreasury.updateWeights() — replaces budget allocation
function updateWeights(
    bytes32[] calldata ids,       // Budget categories (education, health, etc.)
    uint256[] calldata weights,   // Eigenvector from citizen pairwise comparisons
    uint256 participants,         // How many citizens voted
    uint256 comparisons           // Total pairwise comparisons ("education or defense?")
) external {
    for (uint256 i = 0; i < ids.length; i++) {
        allocationWeights[ids[i]] = weights[i];  // Set each category's share
    }
    // Weights must sum to 10000 (100.00%)
    // ~10 taps per citizen → stable eigenvector → budget allocation
}
// No lobbying. No earmarks. No pork barrel. Just citizen preferences.`,
    codeLanguage: "solidity",
    codeExplanation:
      "Citizens do ~10 pairwise comparisons ('education or infrastructure?'). Eigenvector decomposition produces stable budget weights from millions of comparisons. The weights are posted on-chain and funds are distributed proportionally. No lobbyists, no horse-trading.",
    annualSavings: "$120M",
    savingsComparison:
      "The real value: $6.8 trillion in federal spending allocated by citizen preferences instead of donor preferences. That's the largest reallocation of democratic power in history.",
    wishoniaQuote:
      "535 politicians decide how to spend $6.8 trillion. None of them asked you. The eigenvector asks everyone and costs nothing.",
    cardColor: "pink",
  },
  dcensus: {
    id: "dcensus",
    dName: "Decentralized Census Bureau",
    replaces: ["census"],
    replacesAgencyName: "United States Census Bureau",
    description:
      "You spend fourteen billion dollars to count everyone once every ten years. I return citizenCount() in fifty milliseconds.",
    tagline: "citizenCount() returns in 50ms — no $14B survey needed",
    deprecatedMetrics: [
      { metric: "Decennial Headcount Accuracy", description: "One count, every 10 years. Your entire congressional apportionment is based on data that's already 5 years stale on average." },
      { metric: "Survey Response Rate", description: "Declining every decade. The 2020 Census cost $14.2B and still missed ~5% of the population — disproportionately the poorest." },
      { metric: "Processing Time (8 Months)", description: "Data collection to published results: 8 months. By the time you see the data, it's already wrong." },
    ],
    optimalMetrics: [
      { metric: "Real-Time Population Count", description: "citizenCount() returns in 50ms. Updated the instant someone registers. Always current." },
      { metric: "Zero Undercount", description: "Registration is incentivized by UBI — if you want your monthly payment, you register. The hardest-to-reach populations have the strongest incentive." },
      { metric: "Continuous Demographic Data", description: "Census data isn't collected once a decade — it's a live stream. Policy decisions use this-morning's data, not last-decade's." },
    ],
    stats: [
      {
        value: "$14.2B",
        label: "2020 Census Cost",
        description: "Total cost of the most recent decennial census",
        color: "pink",
      },
      {
        value: "Once / Decade",
        label: "Frequency",
        description: "Constitutional mandate: count everyone every 10 years",
        color: "yellow",
      },
      {
        value: "~8 months",
        label: "Processing Time",
        description: "Time from data collection to published results",
        color: "cyan",
      },
      {
        value: "~5%",
        label: "Undercount Rate",
        description: "Estimated missed population in hard-to-reach communities",
        color: "pink",
      },
    ],
    codeHeader: "$14.2 billion + 10-year wait → 1 view function",
    replacementCode: `// UBIDistributor.citizenCount() — replaces the Census Bureau
function citizenCount() external view returns (uint256) {
    return citizenList.length;  // Real-time. Sybil-resistant. Free.
}

// Every citizen registers once with World ID (proof of unique personhood).
// The count updates instantly when someone registers.
// No door-to-door canvassing. No mail-in forms. No undercount.
// No $14.2 billion. Just one line that returns a number.`,
    codeLanguage: "solidity",
    codeExplanation:
      "World ID provides cryptographic proof of unique personhood. When citizens register for UBI, the population count updates in real-time. No door-knocking, no mail-in forms, no processing delays, no undercount of marginalized communities.",
    annualSavings: "$1.4B/yr",
    savingsComparison:
      "Amortized annual cost of the Census. Plus: real-time data instead of decade-old snapshots. Plus: zero undercount because registration is incentivized by UBI.",
    wishoniaQuote:
      "You spend fourteen billion dollars to count everyone once every ten years. I return citizenCount() in fifty milliseconds. Every time someone asks.",
    cardColor: "green",
  },
  dih: {
    id: "dih",
    dName: "Optimal Institutes of Health",
    replaces: ["nih", "fda", "hhs", "dea", "va"],
    replacesAgencyName: "National Institutes of Health + FDA",
    description:
      "You spend $47 billion a year on medical research and 3.3% of it funds actual trials. The rest funds grant proposals about trials. It's like buying 4.7 million cars and spending $1 on a mechanic.",
    tagline: "97% clinical trials, 3% overhead — the exact mirror of your NIH",
    deprecatedMetrics: [
      { metric: "Papers Published", description: "The NIH optimizes for publications, not patients. Scientists spend 50-67% of their time writing grant proposals instead of doing science." },
      { metric: "Grant Renewal Rate", description: "The incentive is to produce preliminary results that justify the next grant, not to produce cures. Cures end funding." },
      { metric: "Career Risk Minimization (FDA)", description: "Approving a drug that harms 100 people = career over. Delaying a drug that could save 100,000 = nobody notices. The FDA optimizes for the first risk, not the second." },
      { metric: "Pharma Profit Margins (FDA)", description: "8.2 years of exclusivity after safety is proven. Not because it takes that long — because the delay IS the business model." },
    ],
    optimalMetrics: [
      { metric: "Patients in Clinical Trials", description: "97% of budget on pragmatic trials, 3% on overhead. The exact mirror of the NIH. 30x more patients, 30x more data, 30x more cures." },
      { metric: "Median Healthy Life Expectancy (HALE)", description: "The only number that matters. Are people living longer without disease? Everything else is overhead." },
      { metric: "Cost per DALY Averted", description: "$0.84 per DALY averted with pragmatic trials. Traditional system: ~$50,000. A 60,000x efficiency gap." },
      { metric: "Time from Safety Proof to Patient Access", description: "Zero years. If it's proven safe, patients can access it. No 8.2-year queue while people die waiting." },
    ],
    stats: [
      {
        value: "$47B",
        label: "NIH Annual Budget",
        description: "Total annual funding for the National Institutes of Health",
        color: "pink",
      },
      {
        value: "3.3%",
        label: "Spent on Trials",
        description: "Share of NIH budget that actually funds clinical trials — ~$1.55B of $47B",
        color: "yellow",
      },
      {
        value: "$27,800",
        label: "Cost Per Patient (Traditional)",
        description: "Average cost per patient in a traditional randomized controlled trial",
        color: "cyan",
      },
      {
        value: "50-67%",
        label: "Scientists Writing Grants",
        description: "Share of researchers' time spent writing grant proposals instead of doing science",
        color: "pink",
      },
    ],
    codeHeader: "$27,800/patient traditional trials → $929/patient pragmatic trials (30x cheaper)",
    replacementCode: `// dIH allocation — replaces the NIH grant bureaucracy
// Instead of grant committees, funding follows patients.

function allocateSubsidy(patient) {
    const severity = diseaseDALYs(patient.condition);  // How severe is it?
    const subsidy = severity * SUBSIDY_PER_DALY;       // Funding proportional to burden
    return subsidy;                                     // Patient chooses which trial to join
}

// NIH: $47B/yr → 3.3% funds trials → $27,800/patient → 3-5% of cancer patients in trials
// dIH: 97% funds trials → $929/patient → 30x more patients → 30x more cures
//
// No grant committees. No 40-minute rejections. No 50% of scientists' time wasted.
// Sick people choose trials. Money follows them. Results get published. All of them.`,
    codeLanguage: "typescript",
    codeExplanation:
      "Instead of scientists spending half their careers writing grant proposals that get 40 minutes of review, dIH subsidises patients directly. Funding is proportional to disease burden (DALYs). Patients choose which pragmatic trial to join. At $929/patient instead of $27,800, the same money runs 30x more trials with 30x more patients. All results — positive and negative — are published in an open data commons.",
    annualSavings: "$45.5B",
    savingsComparison:
      "Redirecting 97% of the NIH budget to pragmatic trials instead of grant bureaucracy. Same $47B, but 30x more patients treated, 30x more data generated, and scientists spend their time on science instead of paperwork.",
    wishoniaQuote:
      "Your scientists spend half their lives writing essays about why they should be allowed to try curing diseases. Then a committee spends forty minutes rejecting them. You spend $47 billion a year on this. 3.3% of it touches a patient. On my planet, we cured disease in year 340. We did not have grant committees.",
    cardColor: "cyan",
  },
  ddod: {
    id: "ddod",
    dName: "Department of Peace",
    replaces: ["dod", "tsa", "state"],
    replacesAgencyName: "Department of Defense (née Department of War)",
    description:
      "War is a negative-sum game and the spreadsheet agrees. We don't have a Department of War because — and I want to be precise here — war is fucking stupid.",
    tagline: "We don't have one",
    deprecatedMetrics: [
      { metric: "Defense Contractor Revenue", description: "$886B/year in US military spending. The top 5 contractors made $196B in 2023. Peace is bad for business." },
      { metric: "Geopolitical Influence", description: "800+ military bases in 80+ countries. The metric is 'presence' not 'outcome.' Nobody measures whether any of this makes anyone safer." },
      { metric: "Jobs in Congressional Districts", description: "The F-35 has parts made in 45 states. Not because it needs them — because that makes it impossible to cancel. The plane is a jobs program that occasionally flies." },
    ],
    optimalMetrics: [
      { metric: "Years Without Armed Conflict", description: "On Wishonia: 4,225 consecutive years. On Earth: 0. At no point in recorded history." },
      { metric: "Human Lives Not Ended", description: "4.5 million post-WWII deaths from US operations alone. The optimal number is zero." },
      { metric: "Resources Redirected to Health", description: "604:1 military-to-clinical-trial ratio. Redirect 1% and you fund the entire dFDA. Redirect 10% and you cure most diseases within a decade." },
    ],
    stats: [
      {
        value: "$2.72T",
        label: "Global Military/yr",
        description: "Annual global military spending (SIPRI 2024)",
        color: "pink",
      },
      {
        value: "604:1",
        label: "Mil : Clinical Trial Ratio",
        description: "Dollars on weapons per dollar on curing disease",
        color: "pink",
      },
      {
        value: "0.6×",
        label: "Military ROI",
        description: "Economic multiplier per dollar. Healthcare returns 3.5×.",
        color: "yellow",
      },
      {
        value: "4.5M+",
        label: "War Deaths Since 1945",
        description: "Post-WWII deaths from US military operations alone",
        color: "pink",
      },
    ],
    codeHeader: "The Department of Defense → 0 lines of code",
    replacementCode: `// There is no replacement code.
// You do not need a smart contract to not kill people.
// That is the entire implementation.

// Dispute resolution: Wishocratic preference aggregation
// + binding arbitration scored by the Optimizer.
// Takes six minutes. Nobody dies.
// See: WishocraticTreasury.sol, Optimizer.ts`,
    codeLanguage: "solidity",
    codeExplanation:
      "War is a negative-sum game. Every participant ends up with less than they started with, including the 'winner.' Disputes are resolved with data, binding arbitration, and an optimisation function that finds the allocation where both parties are measurably better off.",
    annualSavings: "$2.72T",
    savingsComparison:
      "Enough to provide clean water for every human, end homelessness, fund all clinical trials, and eliminate hunger — and still have $2.4 trillion left over.",
    wishoniaQuote:
      "In 1947 they renamed the Department of War to the Department of Defense. The wars did not become more defensive. They just sounded nicer. Since the rebrand: 13+ wars, 0 defensive.",
    cardColor: "pink",
  },

  dcongress: {
    id: "dcongress",
    dName: "Open Congress",
    replaces: ["congress"],
    replacesAgencyName: "United States Congress",
    description:
      "Every citizen votes on the budget. Takes two minutes. Your Congress takes two years and still gets it wrong.",
    tagline: "Every citizen votes on the budget — takes two minutes",
    deprecatedMetrics: [
      { metric: "Bills Passed per Session", description: "Quantity of legislation, not quality of outcomes. A Congress that passes 300 bad laws is rated higher than one that passes 10 good ones." },
      { metric: "Re-Election Rate", description: "94% of incumbents win. The system optimizes for keeping its current occupants employed, not for producing good governance." },
      { metric: "Donor Satisfaction", description: "Campaign donors get 760% ROI on lobbying investments. Citizens get a 'thank you for your input' form letter." },
    ],
    optimalMetrics: [
      { metric: "Citizen Preference Alignment", description: "Does the budget match what 8 billion people actually want? Measured by Wishocratic pairwise comparison, not by what 535 people horse-traded." },
      { metric: "Welfare Outcome per Dollar", description: "Did the money produce more health, more income, less suffering? The only scorecard that matters." },
    ],
    stats: [
      { value: "535", label: "Members", description: "Humans deciding a $6.8T budget with no formal preference measurement", color: "pink" },
      { value: "94%", label: "Incumbency Rate", description: "Re-election rate for sitting members of Congress", color: "yellow" },
      { value: "~20%", label: "Approval Rating", description: "Public approval of Congress — lowest of any institution", color: "cyan" },
    ],
    codeHeader: "535 politicians horse-trading → 8 billion citizens tapping",
    replacementCode: `// Wishocracy — replaces Congressional budget allocation
// Citizens do ~10 pairwise comparisons ("education or defense?")
// Eigenvector decomposition produces stable budget weights
// See: WishocraticTreasury.updateWeights()`,
    codeLanguage: "solidity",
    codeExplanation:
      "Each citizen makes ~10 pairwise comparisons between budget priorities. Eigenvector aggregation produces a stable allocation that reflects the preferences of everyone who participated — not just the 535 who got elected.",
    annualSavings: "$0",
    savingsComparison:
      "The value isn't cost savings — it's $6.8 trillion in federal spending allocated by citizen preferences instead of donor preferences.",
    wishoniaQuote:
      "You elect 535 humans, send them to a building, and then act surprised when they do what their donors want instead of what you want. The system is working exactly as designed. Just not for you.",
    cardColor: "yellow",
  },

  dtreasury: {
    id: "dtreasury",
    dName: "Automated Treasury",
    replaces: ["treasury", "irs", "fed", "ssa"],
    replacesAgencyName: "Treasury + IRS + Federal Reserve + Social Security",
    description:
      "0.5% transaction tax, UBI, and Wishocratic allocation — in one currency. Your seventy-four-thousand-page tax code is not invited.",
    tagline: "One currency, one tax, one safety net — no tax code required",
    deprecatedMetrics: [
      { metric: "Tax Revenue Collected", description: "The current system spends $546B/year in compliance costs to collect taxes. The overhead is the product." },
      { metric: "Inflation Target Met", description: "The Fed targets 2% annual theft from every paycheck and calls it 'price stability.'" },
      { metric: "Welfare Fraud Prevented", description: "Spending more catching the 1.5% who cheat than it would cost to just give everyone the money." },
    ],
    optimalMetrics: [
      { metric: "Revenue per Dollar of Overhead", description: "0.5% automatic transaction tax: same revenue, ~0% administrative cost." },
      { metric: "Poverty Rate", description: "UBI keeps everyone above the poverty line. No applications, no caseworkers, no cracks to fall through." },
      { metric: "Purchasing Power Stability", description: "0% inflation. Your money buys more over time, not less." },
    ],
    stats: [
      { value: "74,000", label: "Tax Code Pages", description: "Pages of Internal Revenue Code and regulations", color: "pink" },
      { value: "$546B", label: "Compliance Cost", description: "Annual cost of tax compliance in the US", color: "yellow" },
      { value: "80+", label: "Welfare Programs", description: "Overlapping federal means-tested welfare programs", color: "cyan" },
    ],
    codeHeader: "Four agencies → one token contract",
    replacementCode: `// WishToken.sol handles all four functions:
// 1. Currency (ERC-20 token)
// 2. Tax (0.5% on every transfer → treasury)
// 3. Monetary policy (fixed supply, 0% inflation)
// 4. Welfare (UBI distribution to all verified citizens)
// See: WishToken.sol, UBIDistributor.sol, WishocraticTreasury.sol`,
    codeLanguage: "solidity",
    codeExplanation:
      "A single token contract replaces four government agencies. The 0.5% transaction tax replaces the IRS. Fixed supply replaces the Fed. UBI distribution replaces welfare. Wishocratic allocation replaces Congressional budgeting.",
    annualSavings: "$758B+",
    savingsComparison:
      "IRS compliance ($546B) + welfare admin overhead ($212B+) eliminated. Plus: 96% of purchasing power no longer stolen by inflation.",
    wishoniaQuote:
      "You have four agencies, 74,000 pages of rules, 83,000 employees, and 80 welfare programs — all doing what one smart contract does in six lines. And you wonder where your taxes go.",
    cardColor: "pink",
  },

  dfda: {
    id: "dfda",
    dName: "Decentralized FDA",
    replaces: ["fda"],
    replacesAgencyName: "Food and Drug Administration",
    description:
      "Your FDA makes treatments wait 8.2 years AFTER they've been proven safe. Just sitting there. Being safe. While people die. This replaces the queue with maths.",
    tagline: "Real-time Outcome Labels & Treatment Rankings",
    deprecatedMetrics: [
      { metric: "Approval Queue Length", description: "8.2 years from safety proof to patient access. The delay IS the business model — it protects pharma exclusivity, not patients." },
      { metric: "Career Risk Minimization", description: "Approving a drug that harms 100 = career over. Blocking a drug that could save 100,000 = nobody notices. The FDA optimizes for the first." },
      { metric: "Regulatory Fee Revenue", description: "75% of drug review costs are paid by the companies being reviewed. The regulator is funded by the regulated." },
    ],
    optimalMetrics: [
      { metric: "Time from Safety Proof to Patient Access", description: "Zero. If it's proven safe, patients can access it immediately." },
      { metric: "Real-Time Outcome Labels", description: "Every treatment gets a continuously-updated label showing effectiveness, side effects, and optimal dosage from real-world data." },
      { metric: "Treatment Rankings by Condition", description: "For any condition, see all treatments ranked by effectiveness, safety, and confidence — updated in real-time." },
    ],
    stats: [
      { value: "8.2 yrs", label: "Efficacy Lag", description: "Average delay from safety proof to FDA approval", color: "pink" },
      { value: "102M", label: "Deaths in Queue", description: "Estimated deaths waiting for treatments already proven safe", color: "pink" },
      { value: "$2.6B", label: "Cost per Drug", description: "Average cost to bring one drug to market through the FDA process", color: "yellow" },
    ],
    codeHeader: "8.2-year queue → real-time outcome data",
    replacementCode: `// The dFDA replaces the approval queue with continuous evidence:
// Stage 1: Real-world evidence from existing data ($1/patient)
// Stage 2: Pragmatic trials in routine care ($929/patient)
// Every treatment gets an Outcome Label — updated in real-time
// See: dfda.earth for the full specification`,
    codeLanguage: "typescript",
    codeExplanation:
      "Instead of a binary approve/reject gate, treatments get continuously-updated Outcome Labels showing what actually happens when real humans take them. Doctors and patients see effectiveness, side effects, and confidence levels — from millions of data points, not a single trial of 200 people.",
    annualSavings: "$0",
    savingsComparison:
      "The value is measured in lives, not dollars. 102 million people died waiting for treatments that were already proven safe.",
    wishoniaQuote:
      "Your FDA has two speeds: 'not yet' and 'too late.' The queue exists because a bureaucrat who approves a drug that hurts 100 people gets fired, but a bureaucrat who blocks a drug that could save 100,000 gets promoted. The incentives are perfect — for killing people slowly.",
    cardColor: "cyan",
  },
} satisfies Record<string, WishoniaAgency>;

/** Backwards-compatible array (derived from AGENCIES record). */
export const WISHONIA_AGENCIES: WishoniaAgency[] = Object.values(AGENCIES);

/** Look up an agency by ID. Use `AGENCIES.dfed` for known IDs instead. */
export function getWishoniaAgency(id: string): WishoniaAgency | undefined {
  return (AGENCIES as Record<string, WishoniaAgency>)[id];
}

export function getWishoniaAgencies(): WishoniaAgency[] {
  return WISHONIA_AGENCIES;
}

export function getWishoniaReplacementFor(earthAgencyId: string): WishoniaAgency | undefined {
  return WISHONIA_AGENCIES.find(a => a.replaces.includes(earthAgencyId));
}
