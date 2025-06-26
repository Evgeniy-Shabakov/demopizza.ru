import { OS_TYPE } from "./data-types/os-type"
import { BROWSER_TYPE } from "./data-types/browser-type"

export function detectOS() {
   const userAgent = navigator.userAgent || navigator.vendor || window.opera

   if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return OS_TYPE.IOS
   }

   if (/android/i.test(userAgent)) {
      return OS_TYPE.ANDROID
   }

   return null
}

export function detectBrowser() {
   const userAgent = navigator.userAgent.toLowerCase();
   const vendor = navigator.vendor?.toLowerCase() || "";

   // Яндекс.Браузер (основан на Chromium, но имеет свой userAgent)
   if (userAgent.includes("yabrowser")) {
      return BROWSER_TYPE.YANDEX;
   }

   // Chrome (проверяем vendor, чтобы отличить от Safari)
   if (userAgent.includes("chrome") && vendor.includes("google inc")) {
      return BROWSER_TYPE.CHROME;
   }

   // Safari (исключаем Chrome, т.к. он тоже содержит 'safari')
   if (userAgent.includes("safari") && vendor.includes("apple")) {
      return BROWSER_TYPE.SAFARI;
   }

   // Opera
   if (userAgent.includes("opr") || userAgent.includes("opera")) {
      return "Opera";
   }

   // Firefox
   if (userAgent.includes("firefox")) {
      return "Firefox";
   }

   // Edge (Chromium)
   if (userAgent.includes("edg/")) {
      return "Microsoft Edge (Chromium)";
   }

   // Edge (Legacy)
   if (userAgent.includes("edge")) {
      return "Microsoft Edge (Legacy)";
   }

   // Internet Explorer
   if (userAgent.includes("msie") || userAgent.includes("trident/")) {
      return "Internet Explorer";
   }

   return null
}

export function isPWA() {
   return window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone;
}