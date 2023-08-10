import { Hono } from "hono"
import { serveStatic } from "hono/cloudflare-workers"
import * as v from "valibot"
import { Landing, Message } from "./frontend"
import { Email, brevo, resend } from "./emails"
import { call } from "./utils"

type EnvVars = {
  TELEGRAM_API_KEY: string
  TELEGRAM_CHAT_ID: string
}
const app = new Hono<{ Bindings: EnvVars }>()

app.get("/", (c) => c.html(<Landing />))

app.get(
  "/public/*",
  serveStatic({
    root: "./",
    rewriteRequestPath: (path) => path.replace("/public", "/"),
  })
)

const waitlistSchema = v.object({
  name: v.optional(v.string("Name is missing.")),
  email: v.string("Email is missing.", [v.email("Email isn't valid.")]),
})

async function sendTelegramMessage(
  message: string,
  apiKey: string,
  chatId: string
): Promise<boolean> {
  const res = await call({
    method: "POST",
    route: `https://api.telegram.org/bot${apiKey}/sendMessage`,
    headers: {
      accept: "application/json",
    },
    body: {
      chat_id: chatId,
      text: message,
    },
  })
  return res != null && res.ok
}

app.post("/", async (c) => {
  const parsed = await v.safeParseAsync(waitlistSchema, await c.req.parseBody())
  if (!parsed.success) return c.html(<Message>{parsed.error.message}</Message>)

  const sended = await sendTelegramMessage(
    `Grids waitlist\nName: ${parsed.data.name}\nEmail: ${parsed.data.email}`,
    c.env.TELEGRAM_API_KEY,
    c.env.TELEGRAM_CHAT_ID
  )
  if (!sended) {
    return c.html(
      <Message>Can't add to waitlist right now. Try later or contact us.</Message>
    )
  }

  return c.html(
    <Message success>Successfully subscribed! Your great way begins.</Message>
  )
})

// app.post("/emails", async (ctx) => {
//   const parsed = await v.safeParseAsync(emailSchema, await ctx.req.json())
//   if (!parsed.success) return ctx.status(400)

//   const uid = "uct-cpc-qcp-oyp"

//   const services = emails.filter((x) => x.uid == uid)

//   for (let i = 0; i < services.length; ++i) {
//     const service = services[i]

//     const sended = await sendEmail(parsed.data, service.provider, service.secret)
//     if (sended) return ctx.status(200)
//   }

//   return ctx.status(500)
// })

export default app

//
// Email services

export async function sendEmail(email: Email, provider: string, secret: string) {
  if (provider == "resend") return await resend(email, secret)
  if (provider == "brevo") return await brevo(email, secret)
  return false
}
