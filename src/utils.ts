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

export async function json<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T
  } catch {
    return null
  }
}
