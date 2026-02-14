import NavigationBar from "../components/sideBar/NavigationBar"

const Home = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-between">
      <NavigationBar />
      <div className="h-full w-full bg-[#0d1117]">
        hi
      </div>
    </div>
  )
}

export default Home
