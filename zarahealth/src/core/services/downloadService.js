function downloadJSONFile(kind, title, data) {
  const element = document.createElement("a");
  const file = new Blob([data], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = title + "_" + kind + "_data.json";
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}

export default downloadJSONFile;
