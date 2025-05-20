// Simple TOML parser for our specific use case
function parseToml(content) {
  const result = {
    audio: [],
    representations: {},
    ku_data: {},
    pu_verbatim: {},
  };

  let currentSection = null;
  let currentArrayItem = null;

  // Process each line
  content.split("\n").map((lines) => {
    const line = lines.trim();

    // Skip comments and empty lines
    if (line.startsWith("#") || line === "") return;

    // Handle array sections like [[audio]]
    if (line.match(/^\[\[(\w+)\]\]$/)) {
      const sectionName = line.match(/^\[\[(\w+)\]\]$/)[1];
      currentSection = sectionName;
      currentArrayItem = {};
      if (!result[currentSection]) result[currentSection] = [];
      result[currentSection].push(currentArrayItem);
      return;
    }

    // Handle regular sections like [ku_data]
    if (line.match(/^\[([^\]]+)\]$/)) {
      const sectionName = line.match(/^\[([^\]]+)\]$/)[1];
      currentSection = sectionName;
      currentArrayItem = null;
      if (!result[currentSection]) result[currentSection] = {};
      return;
    }

    // Handle key-value pairs
    const keyValueMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
    if (keyValueMatch) {
      const key = keyValueMatch[1];
      let value = keyValueMatch[2];

      // Parse the value
      if (value.startsWith('"') && value.endsWith('"')) {
        // String value
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("[") && value.endsWith("]")) {
        // Array value
        value = value
          .substring(1, value.length - 1)
          .split(",")
          .map((value) => {
            const v = value.trim();
            if (v.startsWith('"') && v.endsWith('"')) {
              return v.substring(1, v.length - 1);
            }
            return v;
          });
      } else if (value === "true") {
        value = true;
      } else if (value === "false") {
        value = false;
      } else if (!Number.isNaN(Number.parseFloat(value))) {
        value = Number.parseFloat(value);
      }

      // Add the key-value pair to the current section or root
      if (currentArrayItem !== null) {
        currentArrayItem[key] = value;
      } else if (currentSection) {
        result[currentSection][key] = value;
      } else {
        result[key] = value;
      }
    }
  });

  return result;
}

// Function to convert our TOML files to JS objects
async function loadSymbolData() {
  let id = 1;

  try {
    // Use dynamic import.meta.glob to get all TOML files
    const symbolFiles = import.meta.glob("../symbols/*.toml", { as: "raw" });

    // Process each TOML file
    const symbolEntries = Object.entries(symbolFiles);

    // Load all symbol files in parallel
    const symbolsData = await Promise.all(
      symbolEntries.map(async ([path, importFn]) => {
        try {
          const content = await importFn();
          const filename = path.split("/").pop().replace(".toml", "");
          const data = parseToml(content);

          // Get the first audio link if available
          const audioLink =
            data.audio && data.audio.length > 0 ? data.audio[0].link : null;

          // Get the sitelen sitelen image link
          const sitelenSitelen = data.representations?.sitelen_sitelen || null;

          // Extract high-confidence translations from ku_data (value >= 70)
          const kuTranslations = data.ku_data
            ? Object.entries(data.ku_data)
                .filter(([_, value]) => value >= 70)
                .map(([key]) => key)
                .join(", ")
            : "";

          // Get category from pu_verbatim
          const category = data.pu_verbatim?.en
            ? data.pu_verbatim.en
                .split(" ")[0]
                .toLowerCase()
                .replace(/[()]/g, "")
            : "word";

          // Create examples array
          const examples = [];

          return {
            id: id++,
            word: data.word || filename,
            symbol: sitelenSitelen,
            pronunciation: audioLink,
            translation:
              kuTranslations ||
              (data.pu_verbatim?.en
                ? data.pu_verbatim.en.replace(/^[^(]*\(|\)[^)]*$/g, "")
                : ""),
            category: category,
            examples: examples,
          };
        } catch (error) {
          console.error(`Error processing ${path}:`, error);
          return null;
        }
      }),
    );

    // Filter out any null values and sort by word
    return symbolsData
      .filter(Boolean)
      .sort((a, b) => a.word.localeCompare(b.word));
  } catch (error) {
    console.error("Error loading symbol data:", error);
    return [];
  }
}

// Initialize with empty array, will be populated when the data is loaded
export let tokiPonaSymbols = [];

// Load the symbols data immediately
loadSymbolData().then((data) => {
  tokiPonaSymbols = data;
  console.log(`Loaded ${tokiPonaSymbols.length} Toki Pona symbols`);
});

// Export a function to get the symbols data programmatically
export async function getSymbols() {
  if (tokiPonaSymbols.length === 0) {
    tokiPonaSymbols = await loadSymbolData();
  }
  return tokiPonaSymbols;
}
