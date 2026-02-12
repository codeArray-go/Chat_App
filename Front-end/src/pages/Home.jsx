import NavigationBar from "../components/NavigationBar"

const Home = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-between">
      <div className="bg-[#06070ae7] border-r border-[#20202080] h-screen w-14 backdrop-blur-xl">
        <NavigationBar />
      </div>
      <div className="h-full w-[calc(100vw-3.5rem)] bg-[#0d1117]">
        hi
      </div>
    </div>
  )
}

export default Home
