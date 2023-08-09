import { html } from "hono/html"
import type { HtmlEscapedString } from "hono/utils/html"

type Children = HtmlEscapedString | HtmlEscapedString[]

const Layout = (props: {
  title: string
  description: string
  children: Children
}) => html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${props.title}</title>
      <meta name="description" content="${props.description}" />
      <meta name="author" content="Roman Koshchei" />
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="https://unpkg.com/htmx.org@1.9.4"></script>
      <link
        rel="icon"
        type="image/x-icon"
        href="https://raw.githubusercontent.com/flurium/grids/main/assets/favicon.ico"
      />
    </head>
    <body>
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
    <header class="sticky top-0 bg-white border-b border-gray-200 m-auto max-w-screen-xl px-6 py-4 flex justify-between items-center">
      <nav class="text-2xl font-bold">
        <a href="/#welcome" class="text-amber-500">
          Grids
        </a>
      </nav>
      <nav class="flex gap-4">
        <a
          class="decoration-2 underline decoration-gray-300 hover:decoration-amber-400"
          href="/#how-it-works"
        >
          How it works
        </a>
        <a
          class="decoration-2 underline decoration-gray-300 hover:decoration-amber-400"
          href="https://github.com/flurium/grids"
          target="_blank"
        >
          GitHub
        </a>
        <a
          class="decoration-2 underline decoration-gray-300 hover:decoration-amber-400"
          href="/#waitlist"
        >
          Join waitlist
        </a>
      </nav>
    </header>

    <main class="m-auto max-w-screen-xl px-6">
      <section id="welcome" class="pt-20 mb-10">
        <a
          class="flex rounded-full py-2 px-4 items-center border border-gray-200 gap-4 
        w-fit m-auto bg-gray-100 hover:bg-gray-50 mb-6"
          href="https://github.com/flurium/grids"
          target="_blank"
        >
          Star us on GitHub
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#fbbf24"
            class="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <h1 class="sm:text-7xl text-5xl font-bold text-center">
          Make services never go down.
        </h1>
        <h2 class="text-center m-auto mt-8 mb-6 text-lg text-gray-700 max-w-4xl">
          Developing off grid isn't real, so you must be on as MANY grids as possible.
          Grids will provide a fast and cost-effective way to utilize numerous services
          without becoming overly dependent on any one of them.
        </h2>

        <a
          class="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white block w-fit 
          rounded text-lg font-semibold m-auto"
          href="/#waitlist"
        >
          Join waitlist!
        </a>
      </section>

      <section id="how-it-works" class="pt-32 mb-10">
        <h3 class="text-4xl font-bold text-center">How it works?</h3>

        <ul class="flex flex-col my-12 text-lg">
          <li>You provide keys for services.</li>
          <hr class=" bg-gray-200 my-4" />
          <li>We loop through services, analyze usage limits, and find suitable ones.</li>
          <hr class=" bg-gray-200 my-4" />
          <li>If service fails, we go to the next available one.</li>
        </ul>

        <div class="grid grid-rows-5 sm:grid-rows-1 sm:grid-cols-5 justify-items-center">
          <div
            class="bg-red-100 border border-red-500 text-red-500 flex 
          justify-center items-center w-full h-20 rounded"
          >
            Service 1
          </div>
          <div
            class="grid grid-cols-[1fr_4px_1fr] sm:grid-cols-1 sm:grid-rows-[1fr_4px_1fr]
            sm:gap-0 gap-2 w-full"
          >
            <span class="text-red-500 justify-self-end self-center sm:justify-self-center">
              Fail
            </span>
            <div
              class="sm:w-full sm:h-1 sm:border-y sm:border-x-0 border-red-500 bg-red-100
              h-full w-1 border-x"
            />
          </div>
          <div
            class="bg-green-100 border border-green-600 w-full h-20 rounded 
            text-green-600 flex justify-center items-center"
          >
            Service 2
          </div>
          <div class="w-full grid grid-rows-[1fr_4px_1fr] grid-cols-[1fr_4px_1fr]">
            <span class="text-green-600 col-start-3 sm:col-start-1 place-self-center">
              Success
            </span>
            <div
              class="w-full h-1 bg-green-100 border-y border-green-600 row-start-2
              col-start-2 col-span-2 border-l sm:border-l-0 sm:border-r sm:col-start-1 
              sm:row-start-2"
            />
            <div
              class="h-full w-full bg-green-100 border-x border-green-600
              col-start-2 row-start-1 sm:row-start-3 "
            />
          </div>
          <div
            class="bg-gray-100 border border-gray-300 text-gray-500 w-full h-20 
            rounded flex justify-center items-center"
          >
            Service 3
          </div>
        </div>
      </section>

      <section id="waitlist" class="pt-32 mb-10">
        <h3 class="text-4xl font-bold text-center">Join the Waitlist</h3>
        <p class="text-center m-auto text-gray-700 max-w-4xl mt-2 mb-8">
          By signing up to our waitlist, you will be first in line to know when we launch
          and getting early access.
        </p>

        <div id="message"></div>
        <form
          class="max-w-2xl flex flex-col gap-4 m-auto"
          hx-post="/"
          hx-target="#message"
          hx-swap="innerHTML"
        >
          <input
            class="outline-none px-4 py-3 bg-gray-100 focus:bg-gray-50 border border-gray-200 rounded"
            placeholder="Name"
            name="name"
          />
          <input
            class="outline-none px-4 py-3 bg-gray-100 focus:bg-gray-50 border border-gray-200 rounded"
            type="email"
            name="email"
            placeholder="Email"
          />
          <button
            class="outline-none px-4 py-3 bg-gray-100 hover:bg-gray-50 border border-gray-200 rounded"
            type="submit"
          >
            Secure your spot
          </button>
        </form>
      </section>
    </main>

    <footer class="mt-32 px-6 pb-8 flex flex-col sm:flex-row items-center gap-2 justify-between">
      <span>© 2023 Flurium. All rights reserved.</span>
      <span>Made with 💛 in Ukraine.</span>
    </footer>
  </Layout>
)
