document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("CodeScape JS imported successfully!");
  },
  false
);

let editor = CodeMirror.fromTextArea(
  document.querySelector('#editor'), {
  mode: "javascript",
  theme: "tomorrow-night-bright",
  lineNumbers: true,
  autoCloseBrackets: true
}
);
editor.setSize('700', '150')
