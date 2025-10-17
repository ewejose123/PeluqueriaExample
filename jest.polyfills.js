/**
 * @note The block below contains polyfills for Node.js globals
 * required for Jest to function when running JSDOM tests.
 * These NEED to be require's and not import's
 * since there are no types for these modules.
 */
const { TextDecoder, TextEncoder } = require('util')

Object.defineProperty(global, 'TextDecoder', {
  value: TextDecoder,
})

Object.defineProperty(global, 'TextEncoder', {
  value: TextEncoder,
})

// Polyfill for Next.js API routes - use built-in Node.js APIs
Object.defineProperty(global, 'Request', {
  value: globalThis.Request || class MockRequest {
    constructor(input, init = {}) {
      // Use Object.defineProperty to set read-only properties
      Object.defineProperty(this, 'url', {
        value: typeof input === 'string' ? input : input.url,
        writable: false,
        enumerable: true,
        configurable: false
      })
      Object.defineProperty(this, 'method', {
        value: init.method || 'GET',
        writable: false,
        enumerable: true,
        configurable: false
      })
      Object.defineProperty(this, 'headers', {
        value: new Map(Object.entries(init.headers || {})),
        writable: false,
        enumerable: true,
        configurable: false
      })
    }
  },
})

Object.defineProperty(global, 'Response', {
  value: globalThis.Response || class MockResponse {
    constructor(body, init = {}) {
      this.body = body
      this.status = init.status || 200
      this.statusText = init.statusText || 'OK'
      this.headers = new Map(Object.entries(init.headers || {}))
    }
    
    async json() {
      return JSON.parse(this.body)
    }
    
    static json(data, init = {}) {
      return new MockResponse(JSON.stringify(data), {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...init.headers
        }
      })
    }
  },
})

Object.defineProperty(global, 'Headers', {
  value: globalThis.Headers || class MockHeaders extends Map {
    constructor(init) {
      super()
      if (init) {
        Object.entries(init).forEach(([key, value]) => {
          this.set(key, value)
        })
      }
    }
  },
})

Object.defineProperty(global, 'URL', {
  value: globalThis.URL || require('url').URL,
})

Object.defineProperty(global, 'URLSearchParams', {
  value: globalThis.URLSearchParams || require('url').URLSearchParams,
})
