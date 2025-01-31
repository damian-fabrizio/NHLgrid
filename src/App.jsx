import Grid from "./components/Grid"
import Rules from "./components/Rules"
const App = () => {
  return (
    <div className="flex flex-col min-h-screen min-w-full items-center justify-center bg-bg text-white border-0">
      <div className="container mx-auto font-Nunito font-medium">
        <Grid />
        <Rules />
      </div>

    </div>
  )
}

export default App