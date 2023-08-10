export async function call(info: {
  route: string
  method: "POST" | "GET" | "PATCH" | "PUT" | "DELETE"
  headers: object
  body: object
}): Promise<Response | null> {
  try {
    return await fetch(info.route, {
      method: info.method,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        ...info.headers,
      },
      body: JSON.stringify(info.body),
    })
  } catch {
    return null
  }
}
