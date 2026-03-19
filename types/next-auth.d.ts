// types/next-auth.d.ts
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id:           string
      email:        string
      name:         string
      image?:       string
      accountType:  string
      agentProfile?: {
        id:    string
        plan:  string
        badge: string
      } | null
    }
  }

  interface JWT {
    id:           string
    accountType:  string
    agentProfile?: any
  }
}
