import dynamic from 'next/dynamic'

const ForgotClient = dynamic(() => import('./ForgotClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-surface-bg">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
})

export default function ForgotPasswordPage() {
  return <ForgotClient />
}
