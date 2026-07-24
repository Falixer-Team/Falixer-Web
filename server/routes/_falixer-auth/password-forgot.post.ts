import {
  assertEmail,
  consumeEmailVerification,
} from '../../utils/email-verification'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = assertEmail(body?.email)
  await consumeEmailVerification(
    body?.verification_token,
    email,
    'password-reset'
  )

  return await $fetch(
    `${useRuntimeConfig().backendApiBase}/auth/password/forgot`,
    {
      method: 'POST',
      body: { email, captcha: body?.captcha },
    }
  )
})
