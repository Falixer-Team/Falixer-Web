import {
  assertEmail,
  assertPurpose,
  verifyEmailCode,
} from '../../../utils/email-verification'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await verifyEmailCode(
    assertEmail(body?.email),
    assertPurpose(body?.purpose),
    body?.code
  )
})
