import * as v from "valibot"
import { call } from "./utils"

export const emailSchema = v.object({
  from: v.object({
    name: v.optional(v.string()),
    email: v.string([v.email()]),
  }),
  to: v.array(v.string([v.email()]), [v.minLength(1)]),
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

export const sendGrid: SendEmail = async (input, secret) => {
  const response = await call({
    route: "https://api.sendgrid.com/v3/mail/send",
    method: "POST",
    headers: {
      authorization: `bearer ${secret}`,
    },
    body: {
      personalizations: [
        {
          to: input.to.map((x) => ({ email: x })),
        },
      ],
      from: {
        email: input.from.email,
        name: input.from.name,
      },
      reply_to: {
        email: input.replyTo,
      },
      subject: input.subject,
      content: [
        {
          type: "text/plain",
          value: input.text,
        },
        {
          type: "text/html",
          value: input.html,
        },
      ],
    },
  })
  return response != null && response.ok
}

export const mailjet: SendEmail = async (input, secret) => {
  const response = await call({
    route: "https://api.mailjet.com/v3.1/send",
    method: "POST",
    headers: {
      authorization: `basic ${secret}`,
    },
    body: {
      Messages: [
        {
          From: {
            Email: input.from.email,
            Name: input.from.name,
          },
          To: input.to.map((x) => ({ Email: x })),
          Cc: input.cc
            ? input.cc.map((x) => ({
                Email: x,
                Name: x,
              }))
            : undefined,
          Bcc: input.bcc
            ? input.bcc.map((x) => ({
                Email: x,
                Name: x,
              }))
            : undefined,
          ReplyTo:
            input.replyTo && input.replyTo.length > 0
              ? {
                  Email: input.replyTo.at(0),
                }
              : undefined,
          Subject: input.subject,
          TextPart: input.text,
          HTMLPart: input.html,
        },
      ],
    },
  })

  return response != null && response.ok
}

export const postmark: SendEmail = async (input, secret) => {
  const response = await call({
    route: "https://api.postmarkapp.com/email",
    method: "POST",
    headers: {
      "X-Postmark-Server-Token": secret,
    },
    body: {
      From: input.from.name
        ? `${input.from.name} <${input.from.email}>`
        : input.from.email,
      To: input.to.join(","),
      Cc: input.cc ? input.cc.join(",") : undefined,
      Bcc: input.bcc ? input.bcc.join(",") : undefined,
      Subject: input.subject,
      HtmlBody: input.html,
      TextBody: input.text,
      ReplyTo: input.replyTo ? input.replyTo.join(",") : undefined,
    },
  })
  return response != null && response.ok
}

/*

to - max 50 
cc - max 10
bcc - max 10
reply_to - only 1

https://developers.mailersend.com/api/v1/email.html#send-an-email

*/
export const mailerSender: SendEmail = async (input, secret) => {
  const response = await call({
    route: "https://api.mailersend.com/v1/email",
    method: "POST",
    headers: {},
    body: {
      from: {
        email: input.from.email,
        name: input.from.name,
      },
      to: input.to.map((x) => ({ email: x })),
      cc: input.cc ? input.cc.map((x) => ({ email: x })) : undefined,
      bcc: input.bcc ? input.bcc.map((x) => ({ email: x })) : undefined,
      reply_to:
        input.replyTo && input.replyTo.length > 0
          ? {
              email: input.replyTo.at(0),
            }
          : undefined,
      subject: input.subject,
      text: input.text,
      html: input.html,
    },
  })

  return response != null && response.ok
}
