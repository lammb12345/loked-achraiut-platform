import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4" dir="rtl">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-500">הדף לא נמצא</p>
      <Link to="/" className={buttonVariants()}>חזרה לבית</Link>
    </div>
  )
}
