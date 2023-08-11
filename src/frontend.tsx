import { html } from "hono/html"
import type { HtmlEscapedString } from "hono/utils/html"

type Children = HtmlEscapedString | HtmlEscapedString[]

const Layout = (props: { children: Children }) => {
  const title = "Grids: Make services never go down."
  const description =
    "Developing off grid isn't real, so you must be on as MANY grids as possible. Grids will provide a fast and cost-effective way to utilize numerous services. without becoming overly dependent on any one of them."

  return html`
    <!DOCTYPE html>
    <html lang="en" style="scroll-behavior: smooth;">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>${title}</title>
        <meta name="description" content="${description}" />

        <meta property="og:url" content="https://grids.fluriumteam.workers.dev/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta
          property="og:image"
          content="https://grids.fluriumteam.workers.dev/public/og.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="grids.fluriumteam.workers.dev" />
        <meta property="twitter:url" content="https://grids.fluriumteam.workers.dev/" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${description}" />
        <meta
          name="twitter:image"
          content="https://grids.fluriumteam.workers.dev/public/og.png"
        />

        <link rel="icon" type="image/png" href="/public/favicon.png" sizes="16x16" />
        <link rel="shortcut icon" type="image/x-icon" href="/public/favicon.ico" />
        <link rel="stylesheet" href="/public/pico.min.css" />
        <style>
          [data-theme="light"],
          :root:not([data-theme="dark"]) {
            --primary: #3949ab;
            --primary-hover: #303f9f;
            --primary-focus: rgba(57, 73, 171, 0.125);
            --primary-inverse: #fff;
          }

          @media only screen and (prefers-color-scheme: dark) {
            :root:not([data-theme]) {
              --primary: #3949ab;
              --primary-hover: #3f51b5;
              --primary-focus: rgba(57, 73, 171, 0.25);
              --primary-inverse: #fff;
            }
          }

          .between {
            display: flex;
            justify-content: space-between;
          }

          .px {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }

          .block {
            display: block;
          }
        </style>
        <script src="/public/htmx.min.js" defer></script>
      </head>
      <body class="container">
        ${props.children}
      </body>
    </html>
  `
}
export const Message = (props: { success?: boolean; children: string }) => {
  return (
    <p>
      {props.success == undefined || props.success == false ? (
        <mark>{props.children}</mark>
      ) : (
        <ins> {props.children}</ins>
      )}
    </p>
  )
}

export const Landing = () => (
  <Layout>
    {/* <nav>
      <ul>
        <li>
          <a href="/#welcome">
            <strong>Grids</strong>
          </a>
        </li>
      </ul>
      <ul>
        <li>
          <a class="px" href="/#benefits">
            Benefits
          </a>
        </li>
        <li>
          <a class="px" href="/#how-it-works">
            How it works
          </a>
        </li>
        <li>
          <a class="px" href="https://github.com/flurium/grids" target="_blank">
            GitHub
          </a>
        </li>
        <li>
          <a href="/#waitlist" role="button" class="px">
            Join waitlist
          </a>
        </li>
      </ul>
    </nav> */}

    <main>
      <section id="welcome">
        <h1>Grids: Make services never go down.</h1>
        <p>
          Developing off grid isn't real, so you must be on as MANY grids as possible.
          Grids will provide a fast and cost-effective way to utilize numerous services
          without becoming overly dependent on any one of them.
        </p>

        <a href="/#waitlist" role="button">
          Join waitlist!
        </a>
      </section>

      <section id="benefits">
        <h2>Benefits</h2>

        <details>
          <summary>Cost effective</summary>
          <p>
            Using multiple services provides extra free plan resources, making it
            particularly beneficial for startups. Starting a business without initial
            costs is a favorable approach that every entrepreneur should consider.
          </p>
        </details>
        <details>
          <summary>Never go down</summary>
          <p>
            Grids operate as a serverless solution. Each request functions independently
            from others. In the event of an attempted attack, it would go unnoticed due to
            the isolation. Moreover, even if a cloud platform experiences downtime, we
            have backup deployments on alternative platforms.
          </p>
        </details>
        <details>
          <summary>All over the globe</summary>
          <p>
            Like I mentioned earlier, we're using a serverless setup, which means our API
            is spread out all over the world. Whenever you make a request, it'll
            automatically go to the closest server, giving you the quickest responses.
          </p>
        </details>
        <details>
          <summary>Speed</summary>
          <p>
            We go for technologies that are fast to use and easy to develop with. This
            means you experience speed when you call our API, and we're able to quickly
            address any bugs or add new features.
          </p>
        </details>
      </section>

      <section id="how-it-works">
        <h2>How it works?</h2>

        <ul>
          <li>You provide keys for services.</li>
          <li>We loop through services, analyze usage limits, and find suitable ones.</li>
          <li>If service fails, we go to the next available one.</li>
        </ul>
      </section>

      <section id="waitlist">
        <h2>Join the Waitlist</h2>
        <p>
          By signing up to our waitlist, you will be first in line to know when we launch
          and getting early access.
        </p>

        <div id="message"></div>
        <form hx-post="/" hx-target="#message" hx-swap="innerHTML">
          <input placeholder="Name" name="name" />
          <input type="email" name="email" placeholder="Email" />
          <button type="submit">Secure your spot</button>
        </form>
      </section>
      <section>
        <hgroup style="margin:0;">
          <h2>Pricing</h2>
          <h3>Pricing plans are experimental and may change over time.</h3>
        </hgroup>
        <div class="grid">
          <article>
            <header>
              <hgroup style="margin:0;">
                <h3>Hobby</h3>
                <h4>Ideal to start with during development.</h4>
              </hgroup>
            </header>
            <h5>Free</h5>
            <ul>
              <li>Up to 100 requests/day</li>
              <li>Up to 2 services integration</li>
              <li>Community support</li>
            </ul>
            <footer>
              <a href="/#waitlist" role="button" class="secondary outline block">
                Get started
              </a>
            </footer>
          </article>
          <article>
            <header>
              <hgroup style="margin:0;">
                <h3>Pro</h3>
                <h4>Exactly for You. Pay as you go without concerns.</h4>
              </hgroup>
            </header>

            <h5>1$ per 5000 requests/mo</h5>

            <ul>
              <li>Unlimited requests/day</li>
              <li>Unlimited services integration</li>
              <li>Email support</li>
            </ul>
            <footer>
              <a href="/#waitlist" role="button" class="primary block">
                Get started
              </a>
            </footer>
          </article>
          <article>
            <header>
              <hgroup style="margin:0;">
                <h3>Custom</h3>
                <h4>For enterprise companies or potential partners.</h4>
              </hgroup>
            </header>
            <h5>Let's talk!</h5>
            <ul>
              <li>Unlimited requests/day</li>
              <li>Unlimited services integration</li>
              <li>Personal call/text support</li>
            </ul>
            <footer>
              <a href="/#waitlist" role="button" class="outline block">
                Contact us
              </a>
            </footer>
          </article>
        </div>
      </section>
    </main>

    <footer class="between">
      <span>© 2023 Flurium. All rights reserved.</span>
      <span>Made with 💛 in Ukraine.</span>
    </footer>
  </Layout>
)
