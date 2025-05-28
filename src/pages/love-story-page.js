/**
 * Love Story Page JavaScript
 * Extracted from love-story.html embedded scripts
 */

// Simple love story page initialization
document.addEventListener("DOMContentLoaded", async function () {
  // Initialize unified integrator
  if (typeof AnniversaryWebsiteIntegrator !== "undefined") {
    const integrator = new AnniversaryWebsiteIntegrator();
    await integrator.init();
  } else {
    // Fallback initialization
    console.log(
      "🎯 Love story page loaded - unified components will handle initialization",
    );

    // Initialize AOS if available
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true,
        offset: 120,
      });
    }
  }
});
