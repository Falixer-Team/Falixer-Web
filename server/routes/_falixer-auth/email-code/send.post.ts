import {
  assertEmail,
  assertPurpose,
  sendEmailCode,
  verifyTurnstile,
} from '../../../utils/email-verification'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = assertEmail(body?.email)
  const purpose = assertPurpose(body?.purpose)
  await verifyTurnstile(
    body?.captcha,
    getRequestIP(event, { xForwardedFor: true })
  )
  return await sendEmailCode(email, purpose)
})
