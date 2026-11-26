"use client"

import { openConsentSettings } from "@/components/consent/consent-provider"

export default function CookieSettingsLink() {
  return (
    <button type="button" onClick={openConsentSettings} className="text-left underline">
      Ustawienia cookies
    </button>
  )
}
