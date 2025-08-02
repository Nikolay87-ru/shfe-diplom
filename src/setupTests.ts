import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import { ReadableStream, TransformStream } from 'web-streams-polyfill'

declare global {
  interface TextDecoderOptions {
    stream?: boolean
  }

  interface TextDecodeOptions {
    stream?: boolean
  }

  type BufferSource = ArrayBufferView | ArrayBuffer

  interface TextDecoder {
    decode(input?: BufferSource | null, options?: TextDecoderOptions): string
  }

  var TextDecoder: {
    new(label?: string, options?: TextDecoderOptions): TextDecoder
    prototype: TextDecoder
  }

  var TextEncoder: {
    new(): {
      encode(input?: string): Uint8Array
    }
    prototype: {
      encode(input?: string): Uint8Array
    }
  }

  var ReadableStream: typeof globalThis.ReadableStream
  var TransformStream: typeof globalThis.TransformStream
}

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder

if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = ReadableStream as typeof global.ReadableStream
}

if (typeof global.TransformStream === 'undefined') {
  global.TransformStream = TransformStream as typeof global.TransformStream
}
