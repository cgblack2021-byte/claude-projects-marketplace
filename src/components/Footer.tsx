import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-black/5">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 text-sm text-ink/50 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Logo className="h-5 w-5" />
          <span>Claude Projects Marketplace</span>
        </div>
        <p>© {new Date().getFullYear()} Claude Projects Marketplace.</p>
      </div>
    </footer>
  );
}
