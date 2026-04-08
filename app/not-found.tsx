import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center text-center px-4 pt-16">
      <div>
        <div className="text-[#FFC700] text-8xl font-black leading-none mb-4">404</div>
        <h1 className="text-white text-2xl font-bold mb-3">Page Not Found</h1>
        <p className="text-gray-400 mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
          <Link href="/inventory" className="btn-secondary">
            View Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}
