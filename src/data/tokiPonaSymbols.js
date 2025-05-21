import { parseToml } from "./parseToml.js";

// Function to convert our TOML files to JS objects
async function loadSymbolData() {
  let id = 1;

  try {
    // Use dynamic import.meta.glob to get all TOML files
    const symbolFiles = import.meta.glob("./symbols/*.toml", {
      query: "?raw",
      import: "default",
    });

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

          // Get the word which will be used with the custom font
          const word = data.word || filename;

          return {
            id: id++,
            word,
            pronunciation: audioLink,
            translation:
              kuTranslations ||
              (data.pu_verbatim?.en
                ? data.pu_verbatim.en.replace(/^[^(]*\(|\)[^)]*$/g, "")
                : ""),
            category,
            examples,
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
