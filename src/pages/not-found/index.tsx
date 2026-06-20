import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_60%)]" />
      <div className="relative">
        <p className="bg-gradient-to-b from-white to-white/20 bg-clip-text text-[10rem] font-bold leading-none text-transparent md:text-[14rem]">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
        </div>
      </div>
      <h1 className="relative -mt-8 text-2xl font-bold tracking-tight text-white md:text-3xl">
        Page not found
      </h1>
      <p className="relative mt-3 max-w-sm text-sm text-white/40">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button
        className="relative mt-8 h-11 rounded-full bg-white px-7 text-sm font-medium text-neutral-900 shadow-2xl transition-all hover:bg-white/90 hover:shadow-white/20"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
    </div>
  )
}
