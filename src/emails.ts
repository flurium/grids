import * as v from "valibot"
import { call, json } from "./utils"

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

/*

https://resend.com/docs/api-reference/introduction#rate-limit

*/
export const resend: SendEmail = async (email, token) => {
  const response = await call({
    route: "https://api.resend.com/emails",
    method: "POST",
    headers: {
      authorization: `bearer ${token}`,
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

  if (response == null) return false

  if (response.status == 401 || response.status == 403) {
    // api key is invalid
  }

  if (response.status == 429) {
    // rate limits are reached
    // check headers
  }

  return response.ok
}

/*

- only 1 reply to 
- no headers if limits are reached

*/
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
      bcc: input.bcc ? input.bcc.map((x) => ({ email: x })) : undefined,
      cc: input.cc ? input.cc.map((x) => ({ email: x })) : undefined,
      subject: input.subject,
      htmlContent: input.html,
      textContent: input.text,
      replyTo: input.replyTo
        ? {
            email: input.replyTo.at(0),
          }
        : undefined,
    },
  })
  if (response == null) return false

  if (response.status == 401 || response.status == 403) {
    // api key isn't correct
  }

  if (response.status == 429) {
    // too many request
  }

  return response.ok
}

/*

- allways return limits headers
https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api/rate-limits

- may do: Too many bad requests. Temporary block

- max(to + bcc + cc) = 1000
 

*/
export const sendGrid: SendEmail = async (input, token) => {
  const response = await call({
    route: "https://api.sendgrid.com/v3/mail/send",
    method: "POST",
    headers: {
      authorization: `bearer ${token}`,
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
  if (response == null) return false

  if (response.status == 401 || response.status == 403) {
    // token is invalid
    return false
  }

  if (response.status == 429) {
    // limits reached
    return false
  }

  if (response.status == 403) {
    // Too many bad requests.Temporary block
    // https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api/errors
    return false
  }

  return response.ok
}

/*

- secret is acctually 2 values: username and password, but in basic auth scheme

https://dev.mailjet.com/email/guides/send-api-v31/

*/
export const mailjet: SendEmail = async (input, secret) => {
  try {
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
    if (response == null) return false

    if (response.status == 401 || response.status == 403) {
      // incorrect key
    }

    if (response.status == 429) {
      // limits reached
    }

    if (response.ok) {
      const data = await json<{ Messages: { Status: "success" | "error" }[] }>(response)
      if (data == null) return false
      const message = data.Messages.at(0)
      if (message == null) return false
      return message.Status == "success"
    }

    return false
  } catch {
    return false
  }
}

/*

- max recipients = 50
- max size limit is 10 MB

*/
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
  if (response == null) return false

  if (response.status == 401) {
    // bad token
    return false
  }

  if (response.status == 429) {
    // limit is reached
    return false
  }

  return response.ok
}

/*

to - max 50 
cc - max 10
bcc - max 10
reply_to - only 1

https://developers.mailersend.com/api/v1/email.html#send-an-email
https://developers.mailersend.com/general.html#api-response

- should indicate if token is invalid
- limits can be reached, so we should put them into db

*/
export const mailerSender: SendEmail = async (input, token) => {
  const response = await call({
    route: "https://api.mailersend.com/v1/email",
    method: "POST",
    headers: {
      authorization: `bearer ${token}`,
    },
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
  if (response == null) return false
  if (response.status == 429) {
    // limits are reached
    // check headers
    return false
  }

  if (response.status == 401 || response.status == 403) {
    // token is invalid
    return false
  }

  return response.ok
}

type MailchimpData =
  | {
      email: string
      status: "sent" | "scheduled" | "rejected" | "invalid"
    }
  | {
      email: string
      status: "queued"
      queued_reason:
        | "attachments"
        | "multiple-recipients"
        | "free-trial-sends-exhausted"
        | "hourly-quota-exhausted"
        | "monthly-limit-reached"
        | "sending-paused"
        | "sending-suspended"
        | "account-suspended"
        | "sending-backlogged"
    }

/*

Can return status for each to email.
Should continue to send emails for emails that was rejected.
https://mailchimp.com/developer/transactional/api/messages/send-new-message/

*/
export const mailchimp: SendEmail = async (input, secret) => {
  const to: { email: string; type: "to" | "cc" | "bcc" }[] = []

  for (let i = 0; i < input.to.length; ++i) {
    to.push({ email: input.to[i], type: "to" })
  }

  if (input.cc) {
    for (let i = 0; i < input.cc.length; ++i) {
      to.push({ email: input.cc[i], type: "cc" })
    }
  }

  if (input.bcc) {
    for (let i = 0; i < input.bcc.length; ++i) {
      to.push({ email: input.bcc[i], type: "bcc" })
    }
  }

  const response = await call({
    route: "https://mandrillapp.com/api/1.0/messages/send",
    method: "POST",
    headers: {},
    body: {
      key: secret,
      message: {
        html: input.html,
        text: input.text,
        subject: input.subject,
        from_email: input.from.email,
        from_name: input.from.name,
        to: to,
      },
    },
  })
  if (response == null || !response.ok) return false

  const data = await json<MailchimpData[]>(response)
  if (data == null) return false
  // ?
  return data.at(0)?.status == "sent"
}
