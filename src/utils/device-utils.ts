/**
 * Utility functions for device detection
 */

/**
 * Checks if the current device is a mobile device (smartphone or tablet)
 * @returns true if the device is a mobile device, false otherwise
 */
export function isMobileDevice(): boolean {
  // Check if the user agent contains common mobile device identifiers
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Regular expression to match common mobile device identifiers
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  
  return mobileRegex.test(userAgent);
}