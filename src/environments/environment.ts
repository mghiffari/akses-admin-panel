// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiurl: 'http://149.129.250.31:30001/api/v1/',
  msPaymentApiUrl: 'http://149.129.250.31:30011/api/v1/',
  endPoint: {
    updateAccount: 'account',
    login: 'auth/login',
    lovType: 'lov',
    createNotification: 'notification',
    updateNotification: 'notification'
  },
  enableAdiraEmailValidation: false,
  version: '1.0.26',
  versionDate: new Date(2019, 7, 13)
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
