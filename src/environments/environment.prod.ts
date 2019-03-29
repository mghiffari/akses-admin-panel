export const environment = {
  production: true,
  apiurl: 'http://149.129.250.31:30001/api/v1/',
  enableAdiraEmailValidation: false,
  version: '1.0.2',
  versionDate: new Date(2019, 2, 26),
  tinyMceSettings: {
    inline: false,
    statusbar: false,
    browser_spellcheck: true,
    height: 320,
    plugins: ["lists", "table"],
    toolbar:
      "undo redo | formatselect | bold italic | forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table",
  }
};
