export const environment = {
  production: true,
  appName: 'Akses',
  apiurl: 'http://149.129.250.31:30001/api/v1/',
  branchCSVFileExampleUrl: 'http://adira-akses-dev.oss-ap-southeast-5.aliyuncs.com/branch/branch_2019040811570583.csv',
  enableAdiraEmailValidation: false,
  ersion: '1.0.20',
  versionDate: new Date(2019, 5, 20),
  tinyMceSettings: {
    inline: false,
    statusbar: false,
    browser_spellcheck: true,
    height: 320,
    plugins: ["lists", "table"],
    toolbar:
      "undo redo | formatselect | fontsizeselect | bold italic | forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table",
    menu: {
      file: { title: 'File', items: 'newdocument' },
      edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall' },
      insert: { title: 'Insert', items: 'inserttable' },
      view: { title: 'View', items: 'visualaid' },
      format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontsize align | removeformat' },
      table: { title: 'Table', items: 'inserttable tableprops deletetable row column cell' }
    }
  }
};
