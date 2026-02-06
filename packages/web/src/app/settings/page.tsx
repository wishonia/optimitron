import { Card, CardHeader } from "@/components/Card";

interface ApiKeyConfig {
  name: string;
  description: string;
  placeholder: string;
  required: boolean;
  docUrl: string;
}

const apiKeys: ApiKeyConfig[] = [
  {
    name: "OpenAI API Key",
    description: "Used for natural language processing of health records (C-CDA, FHIR) and conversational data entry.",
    placeholder: "sk-...",
    required: false,
    docUrl: "https://platform.openai.com/api-keys",
  },
  {
    name: "Fitbit Client ID",
    description: "OAuth client credentials for syncing Fitbit activity, sleep, and heart rate data.",
    placeholder: "22XXXX",
    required: false,
    docUrl: "https://dev.fitbit.com/apps",
  },
  {
    name: "Oura Personal Access Token",
    description: "Personal access token for importing sleep, readiness, and HRV data from Oura Ring.",
    placeholder: "OURA_...",
    required: false,
    docUrl: "https://cloud.ouraring.com/personal-access-tokens",
  },
  {
    name: "Google Fit OAuth",
    description: "Google OAuth credentials for syncing activity and nutrition data from Google Fit.",
    placeholder: "Configure OAuth →",
    required: false,
    docUrl: "https://console.developers.google.com/",
  },
];

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure API keys and application preferences. All keys are stored locally
          in your browser — they are never sent to any server.
        </p>
      </div>

      {/* Privacy banner */}
      <div className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <div className="flex items-start gap-3">
          <span className="text-xl">🔒</span>
          <div>
            <p className="text-sm font-medium text-emerald-400">Your Keys Stay Local</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              API keys are stored in your browser&apos;s localStorage and used only for direct
              API calls from your device. They are never transmitted to Optomitron servers.
            </p>
          </div>
        </div>
      </div>

      {/* API Keys */}
      <Card className="mb-8">
        <CardHeader
          icon="🔑"
          title="API Key Management"
          description="Add your personal API keys to enable data source connections and AI features"
        />
        <div className="space-y-6">
          {apiKeys.map((key) => (
            <div key={key.name} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    {key.name}
                    {key.required && (
                      <span className="text-xs text-red-400 font-normal">Required</span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {key.description}
                  </p>
                </div>
                <a
                  href={key.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-500 hover:text-primary-400 shrink-0"
                >
                  Docs ↗
                </a>
              </div>
              <div className="flex gap-2 mt-3">
                <input
                  type="password"
                  placeholder={key.placeholder}
                  disabled
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm placeholder-gray-400 cursor-not-allowed"
                />
                <button
                  disabled
                  className="px-4 py-2 rounded-lg bg-primary-600/50 text-white text-sm font-medium cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-400">
          API key management will be functional once the local storage layer is implemented.
        </p>
      </Card>

      {/* Preferences */}
      <Card className="mb-8">
        <CardHeader
          icon="⚙️"
          title="Application Preferences"
          description="Customize your Optomitron experience"
        />
        <div className="space-y-4">
          {/* Theme */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <div>
              <div className="text-sm font-medium">Theme</div>
              <div className="text-xs text-gray-500">Dark mode is enabled by default</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed">
                Light
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs bg-primary-600 text-white cursor-not-allowed">
                Dark
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed">
                System
              </button>
            </div>
          </div>

          {/* Units */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <div>
              <div className="text-sm font-medium">Measurement Units</div>
              <div className="text-xs text-gray-500">Metric or imperial units for health data</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg text-xs bg-primary-600 text-white cursor-not-allowed">
                Metric
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed">
                Imperial
              </button>
            </div>
          </div>

          {/* Jurisdiction */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <div>
              <div className="text-sm font-medium">Jurisdiction</div>
              <div className="text-xs text-gray-500">For policy recommendations and politician alignment</div>
            </div>
            <select
              disabled
              className="px-3 py-1.5 rounded-lg text-xs bg-gray-200 dark:bg-gray-700 border-0 text-gray-500 cursor-not-allowed"
            >
              <option>United States (Federal)</option>
            </select>
          </div>

          {/* Anonymous sharing */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <div>
              <div className="text-sm font-medium">Anonymous Data Sharing</div>
              <div className="text-xs text-gray-500">
                Share anonymized effect sizes to help build population-level knowledge (Layer 3)
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-11 h-6 rounded-full bg-gray-300 dark:bg-gray-600 relative cursor-not-allowed">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Data management */}
      <Card>
        <CardHeader
          icon="💾"
          title="Data Management"
          description="Export, backup, or clear your local data"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            disabled
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:border-primary-500/50 transition-colors cursor-not-allowed opacity-60"
          >
            <div className="text-2xl mb-2">📤</div>
            <div className="text-sm font-medium">Export All Data</div>
            <div className="text-xs text-gray-500 mt-1">Download as JSON</div>
          </button>
          <button
            disabled
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:border-primary-500/50 transition-colors cursor-not-allowed opacity-60"
          >
            <div className="text-2xl mb-2">📥</div>
            <div className="text-sm font-medium">Import Backup</div>
            <div className="text-xs text-gray-500 mt-1">Restore from JSON</div>
          </button>
          <button
            disabled
            className="p-4 rounded-xl border border-red-500/30 text-center hover:border-red-500/50 transition-colors cursor-not-allowed opacity-60"
          >
            <div className="text-2xl mb-2">🗑️</div>
            <div className="text-sm font-medium text-red-400">Clear All Data</div>
            <div className="text-xs text-gray-500 mt-1">Remove everything</div>
          </button>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          Data management functions will be available once the local storage layer is implemented.
        </p>
      </Card>
    </div>
  );
}
