/**
 * Photo Gallery Page JavaScript
 * Extracted from photo-gallery.html embedded scripts
 */

// Simple photo gallery page initialization
document.addEventListener("DOMContentLoaded", async function () {
  // Initialize unified integrator
  if (typeof AnniversaryWebsiteIntegrator !== "undefined") {
    const integrator = new AnniversaryWebsiteIntegrator();
    await integrator.init();
  } else {
    // Fallback initialization
    console.log(
      "🎯 Photo gallery page loaded - unified components will handle initialization",
    );

    // Initialize AOS if available
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
      });
    }
  }
});
