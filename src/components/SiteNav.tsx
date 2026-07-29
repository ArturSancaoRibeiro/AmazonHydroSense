import Image from "next/image";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center px-6 lg:px-10">
        <Image
          src="/brand/logo.png"
          alt="Amazon Hydro Sense"
          width={845}
          height={288}
          priority
          className="h-9 w-auto"
        />
      </div>
    </header>
  );
}
