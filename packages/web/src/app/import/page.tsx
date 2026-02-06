import { Card, CardHeader } from "@/components/Card";

interface DataSource {
  name: string;
  icon: string;
  description: string;
  dataTypes: string[];
  status: "available" | "coming-soon" | "beta";
  importMethod: "file-upload" | "api-connect" | "manual";
}

const dataSources: DataSource[] = [
  {
    name: "Apple Health",
    icon: "🍎",
    description: "Import your complete health history from iPhone — sleep, steps, heart rate, workouts, nutrition, and more.",
    dataTypes: ["Sleep", "Steps", "Heart Rate", "Workouts", "Nutrition", "Blood Pressure", "Body Mass"],
    status: "available",
    importMethod: "file-upload",
  },
  {
    name: "Fitbit",
    icon: "⌚",
    description: "Connect your Fitbit account for continuous sync of activity, sleep, and heart rate data.",
    dataTypes: ["Steps", "Sleep", "Heart Rate", "Active Minutes", "SpO2"],
    status: "available",
    importMethod: "api-connect",
  },
  {
    name: "Oura Ring",
    icon: "💍",
    description: "Import sleep stages, readiness scores, activity, and HRV data from your Oura Ring.",
    dataTypes: ["Sleep Stages", "Readiness", "HRV", "Temperature", "Activity"],
    status: "available",
    importMethod: "api-connect",
  },
  {
    name: "Google Fit",
    icon: "🏃",
    description: "Sync activity, nutrition, and body measurements from Google Fit and connected devices.",
    dataTypes: ["Steps", "Workouts", "Nutrition", "Weight", "Heart Rate"],
    status: "beta",
    importMethod: "api-connect",
  },
  {
    name: "Garmin",
    icon: "🧭",
    description: "Import detailed training, sleep, stress, and body battery data from Garmin Connect.",
    dataTypes: ["Training", "Sleep", "Stress", "Body Battery", "SpO2", "HRV"],
    status: "coming-soon",
    importMethod: "api-connect",
  },
  {
    name: "Whoop",
    icon: "🟢",
    description: "Recovery scores, strain, sleep performance, and HRV from your Whoop strap.",
    dataTypes: ["Recovery", "Strain", "Sleep Performance", "HRV"],
    status: "coming-soon",
    importMethod: "api-connect",
  },
  {
    name: "MyFitnessPal",
    icon: "🍽️",
    description: "Import detailed nutrition tracking — calories, macros, micronutrients, and meal logs.",
    dataTypes: ["Calories", "Macros", "Micronutrients", "Meals"],
    status: "coming-soon",
    importMethod: "api-connect",
  },
  {
    name: "Cronometer",
    icon: "📗",
    description: "Comprehensive nutrition data with detailed micronutrient tracking.",
    dataTypes: ["Calories", "Macros", "Micronutrients", "Biometrics"],
    status: "coming-soon",
    importMethod: "file-upload",
  },
  {
    name: "CSV / JSON Upload",
    icon: "📄",
    description: "Import any time series data from a CSV or JSON file. Map columns to variables and timestamps.",
    dataTypes: ["Any time series data"],
    status: "available",
    importMethod: "file-upload",
  },
  {
    name: "Manual Entry",
    icon: "✏️",
    description: "Manually log symptoms, mood, supplements, medications, and any other variable.",
    dataTypes: ["Symptoms", "Mood", "Supplements", "Medications", "Custom"],
    status: "available",
    importMethod: "manual",
  },
];

function statusBadge(status: DataSource["status"]) {
  switch (status) {
    case "available":
      return <span className="text-xs font-medium px-2 py-0.5 rounded-full text-green-500 bg-green-500/10">Available</span>;
    case "beta":
      return <span className="text-xs font-medium px-2 py-0.5 rounded-full text-amber-500 bg-amber-500/10">Beta</span>;
    case "coming-soon":
      return <span className="text-xs font-medium px-2 py-0.5 rounded-full text-gray-400 bg-gray-400/10">Coming Soon</span>;
  }
}

function importButton(source: DataSource) {
  const disabled = source.status === "coming-soon";
  const baseClasses = "px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0";

  if (disabled) {
    return (
      <button className={`${baseClasses} bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed`} disabled>
        Coming Soon
      </button>
    );
  }

  switch (source.importMethod) {
    case "file-upload":
      return (
        <button className={`${baseClasses} bg-primary-600 text-white hover:bg-primary-700`}>
          📤 Upload File
        </button>
      );
    case "api-connect":
      return (
        <button className={`${baseClasses} bg-primary-600 text-white hover:bg-primary-700`}>
          🔗 Connect
        </button>
      );
    case "manual":
      return (
        <button className={`${baseClasses} bg-primary-600 text-white hover:bg-primary-700`}>
          ✏️ Log Entry
        </button>
      );
  }
}

export default function ImportPage() {
  const available = dataSources.filter((s) => s.status === "available");
  const beta = dataSources.filter((s) => s.status === "beta");
  const comingSoon = dataSources.filter((s) => s.status === "coming-soon");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Import Data</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
          Connect your health data sources. All data is processed locally in your browser —
          nothing is sent to our servers. The more data you track, the better the causal
          inference engine can find what actually works for you.
        </p>
      </div>

      {/* Privacy notice */}
      <div className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <div className="flex items-start gap-3">
          <span className="text-xl">🔒</span>
          <div>
            <p className="text-sm font-medium text-emerald-400">Layer 1: Digital Twin Safe</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Your raw health data never leaves your device. The @optomitron/optimizer engine
              runs entirely in TypeScript with zero server dependency. You can optionally share
              anonymized effect sizes to help build population-level knowledge.
            </p>
          </div>
        </div>
      </div>

      {/* Available sources */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          Available Now
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {available.map((source) => (
            <Card key={source.name} className="flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{source.icon}</span>
                  <div>
                    <h3 className="font-semibold">{source.name}</h3>
                    {statusBadge(source.status)}
                  </div>
                </div>
                {importButton(source)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex-grow">
                {source.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {source.dataTypes.map((dt) => (
                  <span
                    key={dt}
                    className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  >
                    {dt}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Beta sources */}
      {beta.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            Beta
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beta.map((source) => (
              <Card key={source.name} className="flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{source.icon}</span>
                    <div>
                      <h3 className="font-semibold">{source.name}</h3>
                      {statusBadge(source.status)}
                    </div>
                  </div>
                  {importButton(source)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex-grow">
                  {source.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {source.dataTypes.map((dt) => (
                    <span
                      key={dt}
                      className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                    >
                      {dt}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Coming soon */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-400" />
          Coming Soon
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comingSoon.map((source) => (
            <Card key={source.name} className="flex flex-col opacity-60">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{source.icon}</span>
                  <div>
                    <h3 className="font-semibold">{source.name}</h3>
                    {statusBadge(source.status)}
                  </div>
                </div>
                {importButton(source)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex-grow">
                {source.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {source.dataTypes.map((dt) => (
                  <span
                    key={dt}
                    className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  >
                    {dt}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Data requirements */}
      <Card>
        <CardHeader
          icon="📊"
          title="Data Requirements for Causal Inference"
          description="What the @optomitron/optimizer engine needs to generate reliable insights"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { metric: "≥ 30", label: "Aligned data pairs", desc: "For each predictor-outcome combination" },
            { metric: "≥ 5", label: "Predictor changes", desc: "Distinct values in the predictor variable" },
            { metric: "≥ 5", label: "Outcome changes", desc: "Distinct values in the outcome variable" },
            { metric: "≥ 10%", label: "Baseline fraction", desc: "Data points before intervention" },
          ].map((req) => (
            <div key={req.label} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="text-2xl font-bold text-primary-500 font-mono">{req.metric}</div>
              <div className="text-sm font-medium mt-1">{req.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{req.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
