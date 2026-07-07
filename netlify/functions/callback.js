exports.handler = async function (event) {
  const { code } = event.queryStringParameters || {}

  if (!code) {
    return { statusCode: 400, body: 'Missing authorization code' }
  }

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  })

  const data = await response.json()

  if (data.error || !data.access_token) {
    return html(`
      window.opener.postMessage(
        'authorization:github:error:' + JSON.stringify({ error: ${JSON.stringify(data.error || 'auth_failed')} }),
        '*'
      )
    `)
  }

  return html(`
    var token = ${JSON.stringify(data.access_token)};
    function receiveMessage(e) {
      window.opener.postMessage(
        'authorization:github:success:' + JSON.stringify({ token: token, provider: 'github' }),
        e.origin
      );
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  `)
}

function html(script) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: `<!DOCTYPE html><html><body><script>(function(){${script}})()</scr` + `ipt></body></html>`,
  }
}
