export const environment = {
  production: true,
  apiurl: '//prod.aksesadirafinance.com/',
  msPaymentApiUrl: 'http://149.129.250.31:30011/api/v1/',
  endPoint: {
    updateAccount: 'msa-account',
    login: 'msap-login',
    lovType: 'msap-lov',
    createNotification: 'msap-notification',
    updateNotification: 'patch-notification'
  },
  enableAdiraEmailValidation: true,
  version: '1.0.21',
  versionDate: new Date(2019, 6, 11)
};
