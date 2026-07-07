exports.handler = async function (event) {
  const host = event.headers['x-forwarded-host'] || event.headers['host']
  const callbackUrl = `https://${host}/.netlify/functions/callback`

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    scope: 'repo,user',
    redirect_uri: callbackUrl,
  })

  return {
    statusCode: 302,
    headers: { Location: `https://github.com/login/oauth/authorize?${params}` },
  }
}
