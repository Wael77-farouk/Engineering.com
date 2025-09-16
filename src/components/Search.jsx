const Search = ({ searchTerm, setSearchTerm, inputRef }) => {
  return (
    <div className="flex justify-center mt-6">
      <input
        type="text"
        placeholder="ابحث عن مشروع..."
        ref={inputRef}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border border-gray-300 rounded w-full max-w-md"
      />
    </div>
  );
};

export default Search;
