export function Footer() {
  return (
    <footer className="border-t bg-neutral-50 py-8">
      <div className="container mx-auto px-4 text-center text-sm text-neutral-600">
        <p>&copy; {new Date().getFullYear()} AppIt. All rights reserved.</p>
      </div>
    </footer>
  )
}
