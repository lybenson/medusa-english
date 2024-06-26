import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// data: {"id":"chatcmpl-9aIfUAX7HS7WTpYVzesfZxSc2kYTd","object":"chat.completion.chunk","created":1718438596,"model":"gpt-3.5-turbo-0125","system_fingerprint":null,"choices":[{"index":0,"delta":{"content":"一"},"logprobs":null,"finish_reason":null}]}
export function parseEventStream(message: string) {
  const pattern = /data:\s*({.*?})\s*\n/g

  const result: {
    id: string
    object: string
    created: number
    model: string
    system_fingerprint: any
    choices: {
      index: number
      delta: {
        content: string
      }
      logprobs: any
      finish_reason: any
    }[]
  }[] = []

  let match
  while ((match = pattern.exec(message)) !== null) {
    const jsonStr = match[1]
    result.push(JSON.parse(jsonStr))
  }

  return result
}

export const parseTTSStream = (message: string) => {
  let headers: Record<'X-RequestId' | 'Content-Type' | 'Path', string> | {} = {}

  message
    .slice(0, message.indexOf('\r\n\r\n'))
    .split('\r\n')
    .forEach((line) => {
      const [key, value] = line.split(':', 2)
      headers[key as 'X-RequestId' | 'Content-Type' | 'Path'] = value
    })

  const data = message.slice(message.indexOf('\r\n\r\n') + 4)

  return { headers, data }
}
