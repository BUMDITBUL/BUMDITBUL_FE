import Image from "next/image";
import Link from "next/link";

export default function MainNav() {
  return (
    <nav className="flex items-center justify-between px-10 py-3 shrink-0 border-b border-white/10">
      <Link href="/">
        <Image src="/images/logo.svg" alt="범딧불" width={32} height={32} />
      </Link>
      <Link href="/profile" className="w-7 h-7 rounded-full overflow-hidden block">
        <Image src="/images/icon/default_profile.svg" alt="프로필" width={28} height={28}
              unoptimized
            />
      </Link>
    </nav>
  );
}
