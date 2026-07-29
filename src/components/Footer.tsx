export function Footer() {
  return (
    <footer className="border-t border-line-soft py-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 md:flex-row md:items-start md:justify-between lg:px-10">
        <div>
          <p className="text-[15px] font-semibold tracking-tight text-ink">
            Amazon Hydro Sense
          </p>
          <p className="mt-2 max-w-[40ch] text-sm leading-relaxed text-ink-dim">
            Continuous water-quality monitoring for Amazonian rivers.
          </p>
        </div>
        <p className="text-sm text-ink-dim">© 2026 Amazon Hydro Sense</p>
      </div>
    </footer>
  );
}
