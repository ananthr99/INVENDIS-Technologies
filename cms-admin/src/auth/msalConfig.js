export const msalConfig = {
  auth: {
    clientId: '1e93ea33-4b52-49bf-bc3e-a7471ae18500',
    authority: 'https://login.microsoftonline.com/f8809024-638d-4570-9652-cb9c094a5faa',
    redirectUri: import.meta.env.PROD
      ? 'https://ananthr99.github.io/INVENDIS-Technologies/cms-admin'
      : 'http://localhost:5173/cms-admin/',
    postLogoutRedirectUri: import.meta.env.PROD
      ? 'https://ananthr99.github.io/INVENDIS-Technologies/cms-admin'
      : 'http://localhost:5173/cms-admin/',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
}

export const loginRequest = {
  scopes: ['User.Read'],
}

export const ALLOWED_EMAILS = [
  'ananth.r@invendis.com',
  'ananya.chengta@invendis.com',
]
