"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertCircle } from "@/lib/icons"

interface WitnessConfig {
  ai_witness_enabled: boolean
  live_video_enabled: boolean
  in_person_enabled: boolean
  ai_witness_price: number | null
  live_video_price: number | null
  in_person_price: number | null
}

export function WitnessModalitySelector() {
  const [config, setConfig] = useState<WitnessConfig>({
    ai_witness_enabled: true,
    live_video_enabled: true,
    in_person_enabled: true,
    ai_witness_price: null,
    live_video_price: null,
    in_person_price: null,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/cmra/witness-config")
      if (!response.ok) throw new Error("Failed to fetch config")
      const data = await response.json()
      setConfig(data)
    } catch (error) {
      console.error("[v0] Error fetching witness config:", error)
      setMessage({ type: "error", text: "Failed to load configuration" })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    // Validate at least one method is enabled
    if (!config.ai_witness_enabled && !config.live_video_enabled && !config.in_person_enabled) {
      setMessage({
        type: "error",
        text: "At least one witness method must be enabled",
      })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch("/api/cmra/witness-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save configuration")
      }

      setMessage({
        type: "success",
        text: "Witness configuration saved successfully",
      })
    } catch (error) {
      console.error("[v0] Error saving witness config:", error)
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to save configuration",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/3"></div>
          <div className="h-4 bg-slate-700 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Witness Method Configuration</h3>
        <p className="text-slate-400 text-sm">
          Configure which witness methods are available to your customers and set optional custom pricing.
        </p>
      </div>

      <div className="space-y-6">
        {/* AI Witness */}
        <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.ai_witness_enabled}
                  onChange={(e) => setConfig({ ...config, ai_witness_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
              <span className="text-white font-medium">AI Witness</span>
            </div>
            <p className="text-slate-400 text-sm mb-3">Instant automated witness verification using AI</p>
            <div className="flex items-center gap-2">
              <label className="text-slate-400 text-sm">Custom Price:</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Default pricing"
                value={config.ai_witness_price || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    ai_witness_price: e.target.value ? Number.parseFloat(e.target.value) : null,
                  })
                }
                disabled={!config.ai_witness_enabled}
                className="w-32 px-3 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <span className="text-slate-400 text-sm">USD</span>
            </div>
          </div>
        </div>

        {/* Live Video */}
        <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.live_video_enabled}
                  onChange={(e) => setConfig({ ...config, live_video_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
              <span className="text-white font-medium">Live Video Call</span>
            </div>
            <p className="text-slate-400 text-sm mb-3">Scheduled video call with authorized employee</p>
            <div className="flex items-center gap-2">
              <label className="text-slate-400 text-sm">Custom Price:</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Default pricing"
                value={config.live_video_price || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    live_video_price: e.target.value ? Number.parseFloat(e.target.value) : null,
                  })
                }
                disabled={!config.live_video_enabled}
                className="w-32 px-3 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <span className="text-slate-400 text-sm">USD</span>
            </div>
          </div>
        </div>

        {/* In-Person */}
        <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.in_person_enabled}
                  onChange={(e) => setConfig({ ...config, in_person_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
              <span className="text-white font-medium">In-Person</span>
            </div>
            <p className="text-slate-400 text-sm mb-3">Customer visits CMRA location for witness verification</p>
            <div className="flex items-center gap-2">
              <label className="text-slate-400 text-sm">Custom Price:</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Default pricing"
                value={config.in_person_price || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    in_person_price: e.target.value ? Number.parseFloat(e.target.value) : null,
                  })
                }
                disabled={!config.in_person_enabled}
                className="w-32 px-3 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <span className="text-slate-400 text-sm">USD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-900/20 border border-green-700"
              : "bg-red-900/20 border border-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <p className={`text-sm ${message.type === "success" ? "text-green-300" : "text-red-300"}`}>{message.text}</p>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          {saving ? "Saving..." : "Save Configuration"}
        </button>
      </div>
    </div>
  )
}
