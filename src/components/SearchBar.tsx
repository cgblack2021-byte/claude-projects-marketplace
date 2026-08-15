export default function SearchBar({ defaultValue }: { defaultValue?: string }) {
  return (
    <form method="get" action="/" role="search" className="flex gap-2">
      <input
        type="search"
        name="q"
        placeholder="Search projects..."
        defaultValue={defaultValue}
        className="input"
      />
      <button type="submit" className="btn-primary shrink-0">
        Search
      </button>
    </form>
  );
}
