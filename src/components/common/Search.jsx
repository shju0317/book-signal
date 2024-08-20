import { IoSearchCircle } from "react-icons/io5";

const Search = () => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="도서명을 입력하세요"
        className="w-48 border-b border-black p-1 bg-transparent"
      />
      <button><IoSearchCircle size={32}/></button>
    </div>
  )
}

export default Search