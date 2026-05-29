export interface ChartBlock {
  kind: "chart";
  title: string;
  caption?: string;
  bars: { label: string; value: number; display?: string }[];
}
export interface TableBlock {
  kind: "table";
  title?: string;
  columns: string[];
  rows: string[][];
}
export interface CalloutBlock {
  kind: "callout";
  tone?: "info" | "finding" | "warn";
  title: string;
  body: string;
}
export interface ProseBlock {
  kind: "prose";
  title?: string;
  body: string;
}
export type ReportBlock = ChartBlock | TableBlock | CalloutBlock | ProseBlock;

export interface ReportData {
  heading: string;
  intro: string;
  metrics: { label: string; value: string }[];
  blocks: ReportBlock[];
}

export type Followup = { title: string; body: string };

export type AgentName = "Insight" | "Rating";

export type LifecycleStage = {
  id: string;
  label: string;
  agent: AgentName;
  title: string;
  body: string;
  report: ReportData;
  followups: Followup[];
  seo: {
    title: string;
    description: string;
    h1: string;
  };
};

export const lifecycleStages: LifecycleStage[] = [
  {
    id: "market-research",
    label: "Market Research",
    agent: "Insight",
    title: "Market analysis used to take at least a week",
    body: "Now you can read multiple rate filings or ingest multiple raters from any source in hours. Run your book of exposures through several raters simultaneously and compare the results. Ingest filings, public data, and proprietary data sources in almost any file format into one vault. The Insight Agent extracts factor tables, base rates, and rating algorithms into a queryable table so your team can compare competitive material against your in-force book.",
    seo: {
      title: "Market Research and Competitive Analysis · Tesora",
      h1: "Ingest any competitive data and analyze it in hours",
      description: "Ingest past filings, public data, and proprietary data sources in almost any file format. The Insight Agent extracts factor tables, base rates, and rating algorithms into a queryable table so your team can compare competitive material against your in-force book.",
    },
    report: {
      heading: "Rate filing diff: Carrier A",
      intro: "Effective change vs filed prior version. Indexed against your in-force book.",
      metrics: [
        { label: "Factors changed", value: "14" },
        { label: "Rate level", value: "+3.8%" },
        { label: "Territory moves", value: "6" },
        { label: "Filed pages", value: "87" },
      ],
      blocks: [
        {
          kind: "prose",
          title: "Material changes",
          body: "Base rate +3.8%. Six territory factors widened, with LA Basin up 6.2 points. A construction class adjustment (CCM 1.10 for ≥3-story Class B) was added.",
        },
        {
          kind: "chart",
          title: "Territory factor moves (Δ vs prior version)",
          caption: "Data source: rate filing, Carrier A",
          bars: [
            { label: "LA Basin", value: 6.2, display: "+6.2%" },
            { label: "Bay Area", value: 4.1, display: "+4.1%" },
            { label: "Inland Empire", value: 3.8, display: "+3.8%" },
            { label: "Sacramento", value: 2.1, display: "+2.1%" },
            { label: "San Diego", value: 1.4, display: "+1.4%" },
            { label: "Central Valley", value: 0.9, display: "+0.9%" },
          ],
        },
        {
          kind: "callout",
          tone: "finding",
          title: "Finding",
          body: "Your in-force book has 38% concentration in LA Basin. At the new factor, expect a 2.4% gross rate-on-rate pickup before any UW response.",
        },
        {
          kind: "table",
          title: "Top changed factors",
          columns: ["Factor", "Prior", "Filed", "Δ"],
          rows: [
            ["Base rate", "$1,194", "$1,240", "+3.8%"],
            ["LA Basin territory", "1.31", "1.39", "+6.2%"],
            ["≥3-story CCM", "n/a", "1.10", "new"],
            ["Med pay limit", "$5,000", "$7,500", "+50%"],
          ],
        },
      ],
    },
    followups: [
      { title: "Create a report comparing five raters", body: "Show visualizations any way you want, smartly constructed with minimal code." },
      { title: "Which company has the lowest rate in territory XYZ", body: "Quickly do competitive analysis, slicing through any factors in the raters." },
      { title: "Versus prior version", body: "Compare against the prior version of the rater and call out the largest factor changes." },
    ],
  },
  {
    id: "loss-modeling",
    label: "Loss Modeling",
    agent: "Insight",
    title: "Trained to help you fit to any data",
    body: "Limited average severity curves, credibility factors, on-balance factors. The entire actuarial toolkit you will need.",
    seo: {
      title: "GLM Loss Modeling and Curve Fitting for Actuaries · Tesora",
      h1: "Loss modeling and curve fitting, audited end to end",
      description: "GLMs, credibility weighting, severity fits, and segmentation studies on your data. The Insight Agent runs the assembly so actuaries stay in charge of every decision.",
    },
    report: {
      heading: "Severity Fit: CGL, AY 2018–2024",
      intro: "Lognormal severity fit, 12,840 claims, credibility-weighted to ISO industry prior.",
      metrics: [
        { label: "Claims used", value: "12,840" },
        { label: "E[severity]", value: "$48,217" },
        { label: "CV", value: "2.31" },
        { label: "Cred. weight", value: "0.62" },
      ],
      blocks: [
        {
          kind: "prose",
          title: "Fit quality",
          body: "Anderson-Darling p = 0.31, no tail divergence. Trimming the top three losses moves the mean by 4.2%. The ISO prior pulled credibility weight to 0.62 for the smaller class segments.",
        },
        {
          kind: "chart",
          title: "Expected severity by class ($K)",
          caption: "Data source: book_losses.cgl_2018_2024",
          bars: [
            { label: "Premises Ops", value: 31, display: "$31K" },
            { label: "Products", value: 58, display: "$58K" },
            { label: "Tools/Equip", value: 42, display: "$42K" },
            { label: "Hired Auto", value: 71, display: "$71K" },
            { label: "Property Damage", value: 26, display: "$26K" },
          ],
        },
        {
          kind: "callout",
          tone: "finding",
          title: "Selected fit",
          body: "Lognormal beats gamma by 72 AIC points. Hired Auto severity is 2.3× book mean. Segment it out of the base class before reserving.",
        },
        {
          kind: "table",
          title: "Segment fit",
          columns: ["Segment", "N", "E[X]", "99th pct"],
          rows: [
            ["Premises Ops", "5,210", "$31,408", "$612K"],
            ["Products", "2,184", "$58,012", "$1.4M"],
            ["Tools/Equip", "1,890", "$42,331", "$880K"],
            ["Hired Auto", "1,672", "$71,229", "$2.1M"],
          ],
        },
      ],
    },
    followups: [
      { title: "The full curve-fitting toolkit", body: "GLMs, box plots, severity fits, and the rest are first-class. The agents do the math. You stay in charge." },
      { title: "Large loss and clash cover handling", body: "Trim, smooth, or segment the tail however you need it. Reproducible against the same assumptions every time." },
      { title: "For advice", body: "AI that is trained actuarially can help you perform better analyses." },
    ],
  },
  {
    id: "rating-deployment",
    label: "Rating Deployment",
    agent: "Rating",
    title: "From Excel rater to live API, fully audited",
    body: "Source raters from internal Excel files or external SERFF filings. The Rating Agent rebuilds the model and deploys it however you want: a callable pricing API, a GUI for underwriters, or a versioned Excel file. Author, reviewer, and approver are separate people. Every promotion is recorded.",
    seo: {
      title: "Rating Engine Deployment and Versioning · Tesora",
      h1: "Deploy a rater without waiting on IT",
      description: "Source raters from SERFF filings or Excel. Deploy to a callable pricing API with versioning, regression tests, and separate author, reviewer, and approver identities.",
    },
    report: {
      heading: "Rater Promotion: CGL v2.4 → v2.5",
      intro: "Promoting v2.5 to production. Author, reviewer, and approver are separate people.",
      metrics: [
        { label: "Test cases", value: "38/38" },
        { label: "Avg Δ premium", value: "+2.8%" },
        { label: "In-force re-rated", value: "14,221" },
        { label: "Outliers >10%", value: "89" },
      ],
      blocks: [
        {
          kind: "prose",
          title: "Trauma study",
          body: "Re-rated the in-force book at v2.5. 92% of policies move within ±5%. 89 outliers traced to two new schedule debits. The round-trip test suite passes against the filed rate manual.",
        },
        {
          kind: "chart",
          title: "Premium delta distribution (% of book)",
          caption: "Data source: in_force.policy as of 2026-05-01",
          bars: [
            { label: "< -10%", value: 0.6, display: "0.6%" },
            { label: "-5%", value: 12.4, display: "12.4%" },
            { label: "0%", value: 51.2, display: "51.2%" },
            { label: "+5%", value: 28.8, display: "28.8%" },
            { label: "+10%", value: 6.3, display: "6.3%" },
            { label: "> +10%", value: 0.7, display: "0.7%" },
          ],
        },
        {
          kind: "callout",
          tone: "warn",
          title: "Gate check",
          body: "89 outliers exceed the ±10% guardrail. Promotion will block until each is reviewed or the guardrail is widened with a signed override.",
        },
        {
          kind: "table",
          title: "Promotion record",
          columns: ["Step", "Identity", "Timestamp"],
          rows: [
            ["Author", "Author A", "May 16, 09:12"],
            ["Reviewer", "Reviewer B", "May 17, 14:33"],
            ["Approver", "Chief Actuary", "May 18, 11:07"],
          ],
        },
      ],
    },
    followups: [
      { title: "Add experience modifier", body: "Add an experience modifier input and a schedule credit/debit input, with the matching premium adjustment." },
      { title: "Show territory factor table", body: "Surface the territory factor lookup table that this rater is reading from, in-place." },
      { title: "Show multiplier breakdown", body: "Add a panel that walks through every multiplier and shows the rolling premium step by step." },
      { title: "Add audit provenance panel", body: "Show the provenance citations for every constant in this rater (rate manual page, reviewer, hash)." },
      { title: "Run a trauma study", body: "Re-rate the in-force book at the proposed version and show the distribution of premium changes." },
    ],
  },
  {
    id: "reserving",
    label: "Reserving",
    agent: "Insight",
    title: "Agents that can handle reserving make smarter pricing decisions",
    body: "Chain ladder, Bornhuetter-Ferguson, and Cape Cod methods, run side by side on the same triangle. The reserving actuary owns the selection.",
    seo: {
      title: "Actuarial Reserving: Chain Ladder, Bornhuetter-Ferguson, Cape Cod · Tesora",
      h1: "Reserving on the same data schema as pricing",
      description: "Chain ladder, Bornhuetter-Ferguson, Cape Cod indications side by side. The same data schema powering pricing and rating, now driving IBNR and ultimate loss selection.",
    },
    report: {
      heading: "Indications: three method comparison",
      intro: "Three reserving methods run on the same triangle. Selection sits with the reserving actuary.",
      metrics: [
        { label: "Chain ladder", value: "$128.4M" },
        { label: "Bornhuetter-Ferguson", value: "$129.6M" },
        { label: "Cape Cod", value: "$127.1M" },
        { label: "Spread", value: "1.9%" },
      ],
      blocks: [
        {
          kind: "prose",
          title: "Method comparison",
          body: "Three methods run on the same triangle. Chain ladder and Bornhuetter-Ferguson within 0.9%. Cape Cod sits 1.0% below chain ladder. All three within a tight band, no method clearly preferred without further actuarial review.",
        },
        {
          kind: "chart",
          title: "Ultimate loss by method ($M)",
          caption: "Data source: claims.paid_cumulative",
          bars: [
            { label: "Chain ladder", value: 128.4, display: "$128.4M" },
            { label: "BF", value: 129.6, display: "$129.6M" },
            { label: "Cape Cod", value: 127.1, display: "$127.1M" },
          ],
        },
        {
          kind: "callout",
          tone: "finding",
          title: "Selection note",
          body: "Three indications, tight 1.9% band. The Insight Agent surfaces the methods; the reserving actuary owns the selection.",
        },
      ],
    },
    followups: [
      { title: "Switch to Bornhuetter-Ferguson", body: "Re-run reserves under Bornhuetter-Ferguson with an a-priori loss ratio." },
      { title: "Add tail factor analysis", body: "Fit a tail factor beyond the latest observed development period." },
      { title: "Slice by segment", body: "Slice reserves by hazard group and surface differences." },
      { title: "Compare additional methods", body: "Add Berquist-Sherman or another method to the indication comparison." },
    ],
  },
];
