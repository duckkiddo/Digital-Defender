export interface AccessibilitySettings {
  fontSize: "small" | "medium" | "large" | "extra-large"
  highContrast: boolean
  reducedMotion: boolean
  screenReaderMode: boolean
  keyboardNavigation: boolean
  audioEnabled: boolean
  autoplay: boolean
}

export interface UserSettings {
  accessibility: AccessibilitySettings
  language: "en" | "es" | "fr"
  theme: "light" | "dark" | "system"
  notifications: boolean
  dataCollection: boolean
}

const defaultSettings: UserSettings = {
  accessibility: {
    fontSize: "medium",
    highContrast: false,
    reducedMotion: false,
    screenReaderMode: false,
    keyboardNavigation: true,
    audioEnabled: true,
    autoplay: false,
  },
  language: "en",
  theme: "system",
  notifications: true,
  dataCollection: false,
}

export function getSettings(): UserSettings {
  if (typeof window === "undefined") return defaultSettings

  const stored = localStorage.getItem("digital-defenders-settings")
  if (!stored) return defaultSettings

  try {
    return { ...defaultSettings, ...JSON.parse(stored) }
  } catch {
    return defaultSettings
  }
}

export function saveSettings(settings: Partial<UserSettings>): void {
  if (typeof window === "undefined") return

  const current = getSettings()
  const updated = {
    ...current,
    ...settings,
    accessibility: {
      ...current.accessibility,
      ...(settings.accessibility || {}),
    },
  }

  localStorage.setItem("digital-defenders-settings", JSON.stringify(updated))

  // Apply settings to document
  applyAccessibilitySettings(updated.accessibility)
}

export function applyAccessibilitySettings(settings: AccessibilitySettings): void {
  if (typeof document === "undefined") return

  const root = document.documentElement

  // Font size
  root.classList.remove("text-sm", "text-base", "text-lg", "text-xl")
  switch (settings.fontSize) {
    case "small":
      root.classList.add("text-sm")
      break
    case "medium":
      root.classList.add("text-base")
      break
    case "large":
      root.classList.add("text-lg")
      break
    case "extra-large":
      root.classList.add("text-xl")
      break
  }

  // High contrast
  if (settings.highContrast) {
    root.classList.add("high-contrast")
  } else {
    root.classList.remove("high-contrast")
  }

  // Reduced motion
  if (settings.reducedMotion) {
    root.classList.add("reduce-motion")
  } else {
    root.classList.remove("reduce-motion")
  }

  // Screen reader mode
  if (settings.screenReaderMode) {
    root.classList.add("screen-reader-mode")
  } else {
    root.classList.remove("screen-reader-mode")
  }
}

export function resetAllData(): void {
  if (typeof window === "undefined") return

  const confirmReset = window.confirm(
    "Are you sure you want to reset all your progress and settings? This action cannot be undone.",
  )

  if (confirmReset) {
    localStorage.removeItem("digital-defenders-progress")
    localStorage.removeItem("digital-defenders-settings")
    localStorage.removeItem("digital-defenders-name")
    window.location.reload()
  }
}

export function exportUserData(): void {
  if (typeof window === "undefined") return

  const progress = localStorage.getItem("digital-defenders-progress")
  const settings = localStorage.getItem("digital-defenders-settings")
  const name = localStorage.getItem("digital-defenders-name")

  const data = {
    progress: progress ? JSON.parse(progress) : null,
    settings: settings ? JSON.parse(settings) : null,
    name: name || null,
    exportDate: new Date().toISOString(),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `digital-defenders-data-${new Date().toISOString().split("T")[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
}
