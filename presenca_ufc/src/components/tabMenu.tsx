'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabMenu({ id }: Readonly<{ id: string }>) {
  const pathname = usePathname()
  const base = `/dashboard/classe/${id}`

  const isPresencas = pathname === base

  return (
    <div className="relative flex border-b border-gray-200">
      <Link
        href={base}
        className="w-1/2 py-2 text-center text-xl font-medium text-gray-900"
      >
        Presenças
      </Link>

      <Link
        href={`${base}/lesson`}
        className="w-1/2 py-2 text-center text-xl font-medium text-gray-900"
      >
        QR Code
      </Link>

      <span
        className={[
          "pointer-events-none absolute bottom-0 left-0 h-0.5 w-1/2 bg-gray-900",
          "transition-transform duration-200 ease-out",
          isPresencas ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      />
    </div>
  )
}