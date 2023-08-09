import * as v from "valibot"
import { call } from "./utils"

export const emailSchema = v.object({
  from: v.object({
    name: v.optional(v.string()),
    email: v.string([v.email()]),
  }),
  to: v.array(v.string([v.email()])),
  subject: v.string(),
  bcc: v.optional(v.array(v.string())),
  cc: v.optional(v.array(v.string())),
  replyTo: v.optional(v.array(v.string())),
  html: v.string(),
  text: v.string(),
})

export type Email = v.Output<typeof emailSchema>

type SendEmail = (email: Email, secret: string) => Promise<boolean>

export const resend: SendEmail = async (email, secret) => {
  const response = await call({
    route: "https://api.resend.com/emails",
    method: "POST",
    headers: {
      authorization: `bearer ${secret}`,
    },
    body: {
      from: email.from.name
        ? `${email.from.name} <${email.from.email}>`
        : email.from.email,
      bcc: email.bcc,
      cc: email.cc,
      reply_to: email.replyTo,
      to: email.to,
      subject: email.subject,
      text: email.text,
      html: email.html,
    },
  })
  return response != null && response.ok
}

export const brevo: SendEmail = async (input, secret) => {
  const response = await call({
    route: "https://api.brevo.com/v3/smtp/email",
    method: "POST",
    headers: {
      "api-key": secret,
    },
    body: {
      sender: {
        name: input.from.name,
        email: input.from.email,
      },
      to: input.to.map((x) => ({ email: x })),
      subject: input.subject,
      htmlContent: input.html,
      textContent: input.text,
      // TODO: bcc, cc, replyTo
    },
  })
  return response != null && response.ok
}
