import { createHash, randomInt, randomUUID } from 'node:crypto'
import nodemailer from 'nodemailer'

export type EmailCodePurpose = 'register' | 'password-reset'

interface EmailCodeRecord {
  hash: string
  expiresAt: number
  resendAt: number
  attempts: number
}

interface VerificationRecord {
  email: string
  purpose: EmailCodePurpose
  expiresAt: number
}

const normalizeEmail = (email: string) => email.trim().toLowerCase()
const recordKey = (email: string, purpose: EmailCodePurpose) =>
  `email-code:${purpose}:${createHash('sha256').update(normalizeEmail(email)).digest('hex')}`

const hashCode = (email: string, purpose: EmailCodePurpose, code: string) =>
  createHash('sha256')
    .update(`${normalizeEmail(email)}:${purpose}:${code}`)
    .digest('hex')

export const assertEmail = (email: unknown) => {
  if (
    typeof email !== 'string' ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: '请输入有效的邮箱地址',
    })
  }
  return normalizeEmail(email)
}

export const assertPurpose = (purpose: unknown): EmailCodePurpose => {
  if (purpose !== 'register' && purpose !== 'password-reset') {
    throw createError({ statusCode: 400, statusMessage: '无效的验证用途' })
  }
  return purpose
}

export const verifyTurnstile = async (token: unknown, remoteip?: string) => {
  const config = useRuntimeConfig()
  if (!config.turnstileSecret) {
    if (import.meta.dev) return
    throw createError({ statusCode: 503, statusMessage: '验证码服务尚未配置' })
  }
  if (typeof token !== 'string' || !token) {
    throw createError({ statusCode: 400, statusMessage: '请先完成人机验证' })
  }

  const result = await $fetch<{ success: boolean }>(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body: new URLSearchParams({
        secret: config.turnstileSecret,
        response: token,
        ...(remoteip ? { remoteip } : {}),
      }),
    }
  )
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: '人机验证失败，请重试',
    })
  }
}

export const sendEmailCode = async (
  email: string,
  purpose: EmailCodePurpose
) => {
  const config = useRuntimeConfig()
  const smtp = config.smtp
  if (!smtp.host || !smtp.user || !smtp.pass || !smtp.from) {
    throw createError({ statusCode: 503, statusMessage: '邮件服务尚未配置' })
  }

  const storage = useStorage('data')
  const key = recordKey(email, purpose)
  const previous = await storage.getItem<EmailCodeRecord>(key)
  if (previous && previous.resendAt > Date.now()) {
    throw createError({
      statusCode: 429,
      statusMessage: `请求过于频繁，请在 ${Math.ceil((previous.resendAt - Date.now()) / 1000)} 秒后重试`,
    })
  }

  const code = randomInt(0, 1_000_000).toString().padStart(6, '0')
  const now = Date.now()
  await storage.setItem<EmailCodeRecord>(key, {
    hash: hashCode(email, purpose, code),
    expiresAt: now + config.emailCode.expiresInSeconds * 1000,
    resendAt: now + config.emailCode.resendInSeconds * 1000,
    attempts: 0,
  })

  const action = purpose === 'register' ? '注册账户' : '找回密码'
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: { user: smtp.user, pass: smtp.pass },
  })

  try {
    await transporter.sendMail({
      from: smtp.from,
      to: email,
      subject: `【Falixer】${action}验证码`,
      text: `你的验证码是 ${code}。验证码将在 ${Math.ceil(config.emailCode.expiresInSeconds / 60)} 分钟后失效。若非本人操作，请忽略此邮件。`,
      html: `<div style="font-family:Arial,'Microsoft YaHei',sans-serif;max-width:560px;margin:auto;padding:32px;color:#171717"><h1 style="font-size:24px">Falixer 邮箱验证</h1><p>你正在${action}，验证码为：</p><div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:20px;background:#f5f5f5;border-radius:12px;text-align:center">${code}</div><p style="color:#666">验证码将在 ${Math.ceil(config.emailCode.expiresInSeconds / 60)} 分钟后失效。若非本人操作，请忽略此邮件。</p></div>`,
    })
  } catch (error) {
    await storage.removeItem(key)
    console.error('SMTP send failed:', error)
    throw createError({
      statusCode: 502,
      statusMessage: '验证码发送失败，请稍后重试',
    })
  }

  return {
    expiresIn: config.emailCode.expiresInSeconds,
    resendIn: config.emailCode.resendInSeconds,
  }
}

export const verifyEmailCode = async (
  email: string,
  purpose: EmailCodePurpose,
  code: unknown
) => {
  if (typeof code !== 'string' || !/^\d{6}$/.test(code)) {
    throw createError({ statusCode: 400, statusMessage: '请输入 6 位验证码' })
  }
  const config = useRuntimeConfig()
  const storage = useStorage('data')
  const key = recordKey(email, purpose)
  const record = await storage.getItem<EmailCodeRecord>(key)
  if (!record || record.expiresAt <= Date.now()) {
    if (record) await storage.removeItem(key)
    throw createError({
      statusCode: 410,
      statusMessage: '验证码已失效，请重新获取',
    })
  }
  if (record.attempts >= config.emailCode.maxAttempts) {
    await storage.removeItem(key)
    throw createError({
      statusCode: 429,
      statusMessage: '尝试次数过多，请重新获取验证码',
    })
  }
  if (record.hash !== hashCode(email, purpose, code)) {
    record.attempts += 1
    await storage.setItem(key, record)
    throw createError({ statusCode: 400, statusMessage: '验证码不正确' })
  }

  await storage.removeItem(key)
  const verificationToken = randomUUID()
  await storage.setItem<VerificationRecord>(
    `email-verification:${verificationToken}`,
    {
      email,
      purpose,
      expiresAt: Date.now() + config.emailCode.expiresInSeconds * 1000,
    }
  )
  return { verified: true, verificationToken }
}

export const consumeEmailVerification = async (
  token: unknown,
  email: string,
  purpose: EmailCodePurpose
) => {
  if (typeof token !== 'string' || !token) {
    throw createError({ statusCode: 403, statusMessage: '请先完成邮箱验证' })
  }
  const storage = useStorage('data')
  const key = `email-verification:${token}`
  const record = await storage.getItem<VerificationRecord>(key)
  if (
    !record ||
    record.expiresAt <= Date.now() ||
    record.email !== normalizeEmail(email) ||
    record.purpose !== purpose
  ) {
    if (record) await storage.removeItem(key)
    throw createError({
      statusCode: 403,
      statusMessage: '邮箱验证已失效，请重新验证',
    })
  }
  await storage.removeItem(key)
}
