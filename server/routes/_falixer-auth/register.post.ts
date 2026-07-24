import {
  assertEmail,
  consumeEmailVerification,
} from '../../utils/email-verification'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = assertEmail(body?.email)
  await consumeEmailVerification(body?.verification_token, email, 'register')

  const response = await $fetch.raw(
    `${useRuntimeConfig().backendApiBase}/auth/register`,
    {
      method: 'POST',
      body: {
        name: body?.name,
        email,
        password: body?.password,
        captcha: body?.captcha,
      },
    }
  )
  for (const cookie of response.headers.getSetCookie()) {
    appendResponseHeader(event, 'set-cookie', cookie)
  }
  return response._data
})
