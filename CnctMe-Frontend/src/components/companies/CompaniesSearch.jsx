import Input from "../ui/Input";
import Button from "../ui/Button";

const CompaniesSearch = ({ search, setSearch, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row">
      <div className="group relative flex-1">
        {/* Search Icon */}
        <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
          <svg
            className="h-5 w-5 text-[#8998A6] transition-colors group-focus-within:text-[#0A66C2]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
            />
          </svg>
        </div>

        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies by name, industry, or location..."
          className="pl-11"
        />
      </div>

      <Button type="submit" className="md:w-auto">
        Search
      </Button>
    </form>
  );
};

export default CompaniesSearch;
