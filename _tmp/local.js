// category: "noun"
// examples: Array []
// id: 73
// pronunciation: "https://raw.githubusercontent.com/lipu-linku/ijo/main/kalama/kalaasi2023/meli.mp3"
// translation: "female, lady, woman"
// word: "meli"

import fs from "node:fs";

//------------------------

const category = (data, key) => {
  return data[key].pu_verbatim?.en
    ? data[key].pu_verbatim.en.split(" ")[0].toLowerCase().replace(/[()]/g, "")
    : "word";
};

const translation = (data, key) => {
  const kuTranslations = data[key].ku_data
    ? Object.entries(data[key].ku_data)
        .filter(([_, value]) => value >= 70)
        .map(([key]) => key)
        .join(", ")
    : "";

  return (
    kuTranslations ||
    (data[key].pu_verbatim?.en
      ? data[key].pu_verbatim.en.replace(/^[^(]*\(|\)[^)]*$/g, "")
      : "")
  );
};

const audioLink = (data, key) => {
  if (data[key].audio.length > 0) {
    const result = data[key].audio[0].link;
    return result.replace("/lipu-linku/", "/skorotkiewicz/");
  }

  return null;
};

//------------------------

const db = fs.readFileSync("./words.json").toString();
const results = JSON.parse(db);

const arr = [];

[results].map((data) => {
  const keys = Object.keys(data);
  const examples = [];
  let id = 0;

  keys.map((key) => {
    const obj = {
      id: id++,
      word: data[key].id,
      category: category(data, key),
      translation: translation(data, key),
      pronunciation: audioLink(data, key),
      examples,
    };
    arr.push(obj);
  });
});

console.log(arr);
