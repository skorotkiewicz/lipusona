// Simple TOML parser for our specific use case
export function parseToml(content) {
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
