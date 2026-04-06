import { NonRetriableError } from "inngest"
import { NodeExecutor } from "../../types"
import ky, { Options as KyOptions } from "ky"

type HttpRequestData = {
  variableName?: string
  endpoint?: string
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: string
}

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  if (!data.endpoint) {
    //todo - publish error state
    throw new NonRetriableError("HTTP Request node: No endpoint configured")
  }

  const result = await step.run(`http-request-${nodeId}`, async () => {
    const variableName = data.variableName || `http-request-${nodeId}`
    const endpoint = data.endpoint!
    const method = data.method || "GET"

    const options: KyOptions = {
      method,
    }

    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.body = data.body
    }

    const response = await ky(endpoint, options)
    const contentType = response.headers.get("content-type")
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text()

    return {
      ...context,
      [variableName]: {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
      },
    }
  })

  return result
}
