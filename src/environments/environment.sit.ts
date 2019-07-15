// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  appName: 'Akses',
  apiurl: '//sit.aksesadirafinance.com/',
  branchCSVFileExampleUrl: 'http://adira-akses-dev.oss-ap-southeast-5.aliyuncs.com/branch/branch_2019040811570583.csv',
  endPoint: {
    updateAccount: 'msa-account',
    login: 'msap-login',
    lovType: 'msap-lov',
    createNotification: 'msap-notification',
    updateNotification: 'patch-notification'
  },
  enableAdiraEmailValidation: false,
  version: '1.0.21',
  versionDate: new Date(2019, 6, 11),
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


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.