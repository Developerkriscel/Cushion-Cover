import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form className="searchbar" onSubmit={onSubmit}>
      <Search size={18} />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search Table Covers, Cushions, Aprons" />
    </form>
  );
}
