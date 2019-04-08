export const environment = {
  production: true,
  apiurl: 'http://149.129.250.31:30001/api/v1/',
  branchCSVFileExampleUrl: 'http://adira-akses-dev.oss-ap-southeast-5.aliyuncs.com/branch/branch_2019040811570583.csv',
  enableAdiraEmailValidation: false,
  version: '1.0.3',
  versionDate: new Date(2019, 3, 2),
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
