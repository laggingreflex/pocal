const defaults = {}

defaults.firefoxApiKeyJwtIssuer = {
  type: 'string',
  description: 'Firefox API Key - JWT issuer',
  message: 'Get it from https://addons.mozilla.org/en-US/developers/addon/api/key',
  prompt: true
  // required: true
}
defaults.firefoxApiKeyJwtSecret = {
  type: 'string',
  description: 'Firefox API Key - JWT secret',
  message: 'Get it from https://addons.mozilla.org/en-US/developers/addon/api/key',
  prompt: true
  // required: true
}

export default defaults
