import { html } from "hono/html"
import type { HtmlEscapedString } from "hono/utils/html"

type Children = HtmlEscapedString | HtmlEscapedString[]

const Layout = (props: {
  title: string
  description: string
  children: Children
}) => html`
  <!DOCTYPE html>
  <html lang="en" style="scroll-behavior: smooth;">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${props.title}</title>
      <meta name="description" content="${props.description}" />
      <meta name="author" content="Roman Koshchei" />
      <script src="https://unpkg.com/htmx.org@1.9.4/dist/htmx.min.js"></script>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"
      />
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
      </style>
      <link
        rel="icon"
        type="image/x-icon"
        href="https://raw.githubusercontent.com/flurium/grids/main/assets/favicon.ico"
      />
    </head>
    <body class="container">
      ${props.children}
    </body>
  </html>
`

export const Message = (props: { success?: boolean; children: string }) => {
  return (
    <div
      class={`py-3 px-4 mb-4 rounded border max-w-2xl m-auto
       ${
         props.success == undefined || props.success == false
           ? "border-red-500 bg-red-100 text-red-700"
           : "border-green-500 bg-green-100 text-green-700"
       }
       `}
    >
      {props.children}
    </div>
  )
}

export const Landing = () => (
  <Layout
    title="Grids | Services never go down"
    description="Developing off grid isn't real, so you must be on as MANY grids as possible. Grid will provide fast and cost effective way to do so."
  >
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
            Because you use several services, you can get more free plan resources. It's
            great for startups. Every business should be started for free.
          </p>
        </details>
        <details>
          <summary>Never go down</summary>
          <p>
            Grids is a serverless thing. Each request is independent of others. If someone
            tryes to attack us, you will not notice, because you are separetad. And even
            if cloud platform will go down, we have backup deployments on other platforms.
          </p>
        </details>
        <details>
          <summary>All over the globe</summary>
          <p>
            As I said before we are serverless. So our API is disrubited around whole
            world. You will make request to the closes one automatically. It will give you
            the fastest responses.
          </p>
        </details>
        <details>
          <summary>Speed</summary>
          <p>
            The technologies we choose are fast to run and fast to develop with. You get
            speed during calling API. We get speed to fix bugs and add new functionality.
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
    </main>

    <footer class="between">
      <span>© 2023 Flurium. All rights reserved.</span>
      <span>Made with 💛 in Ukraine.</span>
    </footer>
  </Layout>
)
