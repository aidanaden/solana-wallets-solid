import { SolanaMobileWalletAdapterWalletName } from "@solana-mobile/wallet-adapter-mobile"
import { type Adapter, WalletReadyState } from "@solana/wallet-adapter-base"

export enum Environment {
  DESKTOP_WEB,
  MOBILE_WEB,
}

type Config = Readonly<{
  adapters: Adapter[]
  userAgentString: string | null
}>

function isWebView(userAgentString: string) {
  return /(WebView|Version\/.+(Chrome)\/(\d+)\.(\d+)\.(\d+)\.(\d+)|; wv\).+(Chrome)\/(\d+)\.(\d+)\.(\d+)\.(\d+))/i.test(
    userAgentString,
  )
}

export function isOnAndroid(ua: string) {
  return /android/i.test(ua)
}

export function isInWebView(ua: string) {
  return /(WebView|Version\/.+(Chrome)\/(\d+)\.(\d+)\.(\d+)\.(\d+)|; wv\).+(Chrome)\/(\d+)\.(\d+)\.(\d+)\.(\d+))/i.test(
    ua,
  )
}

export function getEnvironment({ adapters, userAgentString }: Config): Environment {
  if (
    adapters.some(
      adapter =>
        adapter.name !== SolanaMobileWalletAdapterWalletName &&
        adapter.readyState === WalletReadyState.Installed,
    )
  ) {
    /**
     * There are only two ways a browser extension adapter should be able to reach `Installed` status:
     *
     *     1. Its browser extension is installed.
     *     2. The app is running on a mobile wallet's in-app browser.
     *
     * In either case, we consider the environment to be desktop-like.
     */
    return Environment.DESKTOP_WEB
  }
  if (
    userAgentString &&
    // Step 1: Check whether we're on a platform that supports MWA at all.
    /android/i.test(userAgentString) &&
    // Step 2: Determine that we are *not* running in a WebView.
    !isWebView(userAgentString)
  ) {
    return Environment.MOBILE_WEB
  } else {
    return Environment.DESKTOP_WEB
  }
}

/**
 * Users on iOS can be redirected into a wallet's in-app browser automatically,
 * if that wallet has a universal link configured to do so
 * But should not be redirected from within a webview, eg. if they're already
 * inside a wallet's browser
 * This function can be used to identify users who are on iOS and can be redirected
 *
 * @returns true if the user can be redirected
 */
export function isIosAndRedirectable() {
  // SSR: return false
  if (typeof window === "undefined" || !navigator) {
    return false
  }

  const userAgent = navigator.userAgent.toLowerCase()

  // if on iOS the user agent will contain either iPhone or iPad
  // caveat: if requesting desktop site then this won't work
  const isIos = userAgent.includes("iphone") || userAgent.includes("ipad")

  // if in a webview then it will not include Safari
  // note that other iOS browsers also include Safari
  // so we will redirect only if Safari is also included
  const isSafari = userAgent.includes("safari")

  return isIos && isSafari
}

export function detectedFirst(state: WalletReadyState, a: Adapter, b: Adapter) {
  let sort: number = 0
  const isDetected = (c: Adapter) => c.readyState === state
  if (isDetected(a) && !isDetected(b)) {
    sort = -1
  }
  if (!isDetected(a) && isDetected(b)) {
    sort = 1
  }
  return sort
}
