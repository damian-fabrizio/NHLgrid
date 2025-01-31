const Rules = () => {
  return (
    <section className="flex justify-center items-start min-h-screen w-full mt-8 p-4 border-0">
        <div className="flex flex-col items-center h-full w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl 
        py-6 px-8 mt-6 rounded-lg border-3 border-cell-outline2 text-xs sm:text-sm md:text-md lg:text-md">
            <h4 className="text-4xl border-0">Rules</h4>
            <div className="pt-4">
            <p className="p-2">There are nine squares that are the intersection of six different players</p>
            <p className="p-2">Select a square to choose a team that both players have played for at some point in their careers</p>
            <p className="p-2">If your answer is a correct match, that team's logo will appear in the square shared by those two players and a point will be added to your total score out of 9. An incorrect guess will simply remove a guess from the total remaining</p>
            <p className="p-2">You may use the same team multiple times if they are a fit in a different square</p>
            <p className="p-2">There sometimes are multiple possible answers for a given square. If you either complete the grid, or run out of guesses, the grid will lock and your score will be final. Hit "Play Again" to generate a new grid</p>
            </div>
        </div>
    </section>
  )
}

export default Rules