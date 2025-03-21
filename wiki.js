/**
 * Functions for handling Wikipedia content in an iframe
 */

// Add the custom CSS file to the document
document.addEventListener("DOMContentLoaded", () => {
  // Add our custom CSS for Wikipedia
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "wiki-styles.css";
  document.head.appendChild(link);

  // Add a loaded class to the iframe when it's done loading
  const iframe = document.getElementById("wikipedia-frame");
  if (iframe) {
    iframe.addEventListener("load", () => {
      iframe.classList.add("loaded");
      console.log("Wikipedia iframe loaded");
    });
  }
});

function loadWikipediaContent(eventId) {
  try {
    const wikiUrl = warData[eventId].wikipediaUrl;
    const iframe = document.getElementById("wikipedia-frame");

    // Validate URL before setting
    let validUrl;
    try {
      validUrl = new URL(wikiUrl);
      // Make sure it's using http or https protocol
      if (!validUrl.protocol.match(/^https?:/)) {
        throw new Error("Invalid URL protocol");
      }
    } catch (urlError) {
      console.error("Invalid Wikipedia URL:", urlError);
      iframe.srcdoc = `
        <div class="wiki-error">
          <h3>Invalid Wikipedia URL</h3>
          <p>Please check the configuration and try again.</p>
        </div>
      `;
      return;
    }

    // Set up error handling
    iframe.onerror = () => {
      console.error("Failed to load Wikipedia content");
      iframe.srcdoc = `
        <div class="wiki-error">
          <h3>Failed to load Wikipedia content</h3>
          <p>Please check your internet connection and try again later.</p>
        </div>
      `;
    };

    // Set up load timeout
    const loadTimeout = setTimeout(() => {
      if (!iframe.classList.contains("loaded")) {
        console.warn("Wikipedia content load timeout");
        // Don't replace content, just add the loaded class to show what we have
        iframe.classList.add("loaded");
      }
    }, 10000); // 10 second timeout

    // Clear timeout when loaded
    iframe.addEventListener(
      "load",
      () => {
        clearTimeout(loadTimeout);
      },
      { once: true }
    );

    // Wikipedia needs cookies to function properly, so we need to allow same-origin
    // But we'll restrict other potentially problematic features
    iframe.setAttribute(
      "sandbox",
      "allow-scripts allow-same-origin allow-popups allow-forms"
    );

    // Add a referrerpolicy to restrict referrer information
    iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");

    // Add loading="lazy" to improve performance
    iframe.setAttribute("loading", "lazy");

    // Remove the loaded class while loading
    iframe.classList.remove("loaded");

    // Set the src to the validated URL
    iframe.src = validUrl.toString();

    console.log("Loading Wikipedia content from:", validUrl.toString());
  } catch (error) {
    console.error("Error loading Wikipedia content:", error);

    // Provide a fallback message
    const iframe = document.getElementById("wikipedia-frame");
    if (iframe) {
      iframe.srcdoc = `
        <div class="wiki-error">
          <h3>Error loading Wikipedia content</h3>
          <p>An unexpected error occurred. Please try again later.</p>
          <p>Error details: ${error.message}</p>
        </div>
      `;
      iframe.classList.add("loaded");
    }
  }
}

function syncWikipedia(dateStr, eventId) {
  const wikiMapping = warData[eventId].wikiContentMapping;
  const sectionId = wikiMapping[dateStr];

  if (!sectionId) {
    console.log(`No Wikipedia section mapping found for date: ${dateStr}`);
    return;
  }

  const iframe = document.getElementById("wikipedia-frame");
  if (!iframe) return;

  // Scroll to the specific section if it exists
  try {
    const targetElement = iframe.contentDocument.querySelector(sectionId);
    if (targetElement) {
      // Remove previous highlights
      const previousHighlights = iframe.contentDocument.querySelectorAll(
        ".highlighted-section"
      );
      previousHighlights.forEach((el) =>
        el.classList.remove("highlighted-section")
      );

      // Add highlight to new section
      targetElement.classList.add("highlighted-section");

      // Smooth scroll to the section
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Add highlight animation
      targetElement.style.animation = "highlightFade 2s ease-in-out";
    }
  } catch (e) {
    console.warn("Could not access iframe content:", e);
    // If we can't access the iframe directly, reload it with the section hash
    const wikiUrl = warData[eventId].wikipediaUrl;
    iframe.src = `${wikiUrl}${sectionId}`;
  }
}

// Add CSS for highlighting animation
const style = document.createElement("style");
style.textContent = `
    .highlighted-section {
        background-color: rgba(255, 255, 0, 0.2);
        transition: background-color 0.5s ease;
    }

    @keyframes highlightFade {
        0% { background-color: rgba(255, 255, 0, 0.4); }
        100% { background-color: rgba(255, 255, 0, 0.2); }
    }
`;
document.head.appendChild(style);

function updateWikiContent(event) {
  const date = `${event.date.year}-${String(event.date.month).padStart(
    2,
    "0"
  )}`;
  const sectionId = warData["imjin-war"].wikiContentMapping[date];

  if (sectionId) {
    fetchWikiSection(sectionId)
      .then((content) => {
        document.getElementById("wiki-content").innerHTML = content;
      })
      .catch((error) => {
        console.error("Failed to fetch Wikipedia content:", error);
      });
  }
}

function fetchWikiSection(sectionId) {
  const baseUrl = warData["imjin-war"].wikipediaUrl;
  // Implementation of Wikipedia API call here
  return fetch(`${baseUrl}${sectionId}`).then((response) => response.text());
}
