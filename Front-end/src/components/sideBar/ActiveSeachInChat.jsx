const ActiveSeachInChat = () => {

  return (
    <div className="bg-transparent m-2 flex items-center justify-center py-3">
      <label className="bg-[rgba(255,255,255,0.1)] rounded-full flex  py-2.5 px-4 w-full gap-3 items-center">
        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input type="search" required placeholder="Search in chat" className="outline-none" />
      </label>
    </div>
  );
};

export default ActiveSeachInChat;
