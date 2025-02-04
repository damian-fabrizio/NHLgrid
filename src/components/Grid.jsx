import { useEffect, useState } from "react";
import { teams } from "../../teams.js";
import { useRef } from "react";

function formatPlayer(randPlayer) {
  // handle edge case where player doesnt generate
  if (!randPlayer) return "";

  // Split the name into parts based on spaces
  const nameParts = randPlayer.split(" ");

  // if the name is broken up into 3 parts or more
  // meaning someone has 2 last names
  if (nameParts.length > 2) {
    // combine all parts of nameParts into single string except last part
    let firstName = nameParts.slice(0, -1).join(" ");
    // Get last part of name not joined above
    let lastName = nameParts[nameParts.length - 1];
    return (
      <>
        {firstName} <br /> {lastName}
      </>
    );
  } else {
    return (
      <>
        {nameParts[0]} <br /> {nameParts[1] || ""}
      </>
    );
  }
}
const Grid = () => {
  // set state for unformatted players that will display on menus
  const [player1, setPlayer1] = useState();
  const [player2, setPlayer2] = useState();
  const [player3, setPlayer3] = useState();
  const [player4, setPlayer4] = useState();
  const [player5, setPlayer5] = useState();
  const [player6, setPlayer6] = useState();

  // state for formatted players that will display on the grid
  const [formattedPlayer1, setFormattedPlayer1] = useState();
  const [formattedPlayer2, setFormattedPlayer2] = useState();
  const [formattedPlayer3, setFormattedPlayer3] = useState();
  const [formattedPlayer4, setFormattedPlayer4] = useState();
  const [formattedPlayer5, setFormattedPlayer5] = useState();
  const [formattedPlayer6, setFormattedPlayer6] = useState();

  // state for the teams arrays
  const [player1Teams, setPlayer1Teams] = useState();
  const [player2Teams, setPlayer2Teams] = useState();
  const [player3Teams, setPlayer3Teams] = useState();
  const [player4Teams, setPlayer4Teams] = useState();
  const [player5Teams, setPlayer5Teams] = useState();
  const [player6Teams, setPlayer6Teams] = useState();

  async function getPlayers() {
    try {
      // await for a response from fetch API
      const response = await fetch("everyNHLPlayerJan25.json");

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      // wait for response object to convert to json and store it in data
      const data = await response.json();
      // if data is null/doesnt exist, or if array of object's keys (data) is empty
      if (!data || Object.keys(data).length === 0) {
        console.error("Returned empty data");
        return null;
      }
      // console.log(data);

      // convert data object into an array of key value pairs
      // .reduce() iterates over each pair to gather filtered results
      // acc is the accumulator object that will hold the filtered data
      // destructure into separate key, value
      const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
        // Check if all required properties exist and are non-empty
        if (
          value.firstYear &&
          value.gamesPlayed &&
          value.teams &&
          value.teams.length > 0
        ) {
          // if properties exist, add them to the accumulator
          acc[key] = value;
        }
        return acc;
      }, {});

      const currentYear = new Date().getFullYear();
      // array of filteredData keys iterated over destructured into acc and key
      const validPlayer = Object.keys(filteredData).reduce((acc, key) => {
        // parse firstProSeason into an integer
        const firstProSeason = parseInt(
          // only take first 4 digits of the firstProSeason
          // in the object the string is formatted as "2005-06"
          // so only take 2005
          filteredData[key].firstYear.substring(0, 4)
        );

        if (
          // if teams property exists
          filteredData[key].teams &&
          // and the length of that array is at least 3
          // meaning the player has played for at least 3 different teams
          filteredData[key].teams.length >= 3 &&
          // parse gamesPlayed as an integer and only grab if value greater than 300
          parseInt(filteredData[key].gamesPlayed) >= 300 &&
          // make sure firstProSeason is somewhere between defined year and current year
          firstProSeason >= 2003 &&
          firstProSeason <= currentYear
        ) {
          // add the key value pair to the accumulator object
          acc[key] = filteredData[key];
        }
        return acc;
      }, {});

      // console the validPlayers variable so i can see how many players meet the criteria that i set
      console.log(
        "Valid Players:",
        validPlayer,
        Object.keys(validPlayer).length
      );

      // if validPlayers doesnt exist then return error
      if (Object.keys(validPlayer).length === 0) {
        console.error("error");
        return;
      }

      // store validPlayer variable in allValidPlayers variable
      let allValidPlayers = Object.keys(validPlayer);

      // display length of the json object array to the console
      // console.log(Object.keys(data).length);

      // randomPlayer variable holds a random player name from the json object array
      // generate 6 random players
      // the first 3 players can be totally random it doesnt matter
      // player 1 top
      let randomPlayer1 =
        allValidPlayers[Math.floor(Math.random() * allValidPlayers.length)];
      // console.log(randomPlayer1, validPlayer[randomPlayer1]);

      // player 2 top
      let randomPlayer2 =
        allValidPlayers[Math.floor(Math.random() * allValidPlayers.length)];
      // console.log(randomPlayer2, validPlayer[randomPlayer2]);

      // player 3 top
      let randomPlayer3 =
        allValidPlayers[Math.floor(Math.random() * allValidPlayers.length)];
      // console.log(randomPlayer3, validPlayer[randomPlayer3]);

      function findValidColumnPlayer(validPlayer, topRowPlayers) {
        // array called topRowPlayers that contains player names as strings. allValidPlayers object where each key is a name and the value is an array of teams. For each player name in topRowPlayers, .map() looks up that name in allValidPlayers and retrieves the array associated with with that name.
        // the arrow function is taking each player from the topRowPlayers array and returns corresponding value from allValidPlayers object.
        // array destructuring: retrieving first 3 elements from array that was returned by .map() method into three variables. each variable holds the array of teams for the respective topRowPlayers.
        const teamsArrays = topRowPlayers.map(
          (player) => validPlayer[player].teams
        );

        // create empty array to fill later
        let validColPlayerCandidate = [];

        // for each key value pair of validPlayer
        Object.entries(validPlayer).forEach(
          ([candidatePlayer, candidateDetails]) => {
            // candidateTeam is the array of teams
            let candidateTeam = candidateDetails.teams;
            // iterate through teach team in candidateTeam. variable will contain all teams shared between candidateTeam and first element of teamsArray, which is the first player's teams in topRowPlayers
            let commonWithRandomPlayer1 = candidateTeam.filter((team) =>
              teamsArrays[0].includes(team)
            );
            // find all teams shared between candidateTeam and second element of teamsArray and make sure it is not the same teams shared with the first player
            let commonWithRandomPlayer2 = candidateTeam.filter(
              (team) =>
                teamsArrays[1].includes(team) &&
                !commonWithRandomPlayer1.includes(team)
            );
            // same as above but make sure not in common with first two players
            let commonWithRandomPlayer3 = candidateTeam.filter(
              (team) =>
                teamsArrays[2].includes(team) &&
                !commonWithRandomPlayer1.includes(team) &&
                !commonWithRandomPlayer2.includes(team)
            );

            // see if there are viable relations with each topRowPlayer's teams
            if (
              commonWithRandomPlayer1.length > 0 &&
              commonWithRandomPlayer2.length > 0 &&
              commonWithRandomPlayer3.length > 0
            ) {
              // push the candidate players to the previously defined empty array
              validColPlayerCandidate.push(candidatePlayer);
            }
          }
        );
        // console.log("Viable candidates for side col: ", validColPlayerCandidate);
        return validColPlayerCandidate;
      }

      const topRowPlayers = [randomPlayer1, randomPlayer2, randomPlayer3];
      // apply findValidColumnPlayer function to the validPlayers and topRowPlayers
      const playerColCandidates = findValidColumnPlayer(
        validPlayer,
        topRowPlayers
      );

      // these next 3 players (column players) must match with the names and teams on top row
      // player 4 side
      let randomPlayer4 =
        playerColCandidates[
          Math.floor(Math.random() * playerColCandidates.length)
        ];
      // console.log(randomPlayer4, validPlayer[randomPlayer4]);

      // player 5 side
      let randomPlayer5 =
        playerColCandidates[
          Math.floor(Math.random() * playerColCandidates.length)
        ];
      // console.log(randomPlayer5, validPlayer[randomPlayer5]);

      // player 6 side
      let randomPlayer6 =
        playerColCandidates[
          Math.floor(Math.random() * playerColCandidates.length)
        ];
      // console.log(randomPlayer6, validPlayer[randomPlayer6]);

      // making sure no names are generated twice
      function verifyUniqueName(existingNames) {
        let generatedName;
        do {
          const index = Math.floor(Math.random() * allValidPlayers.length);
          generatedName = allValidPlayers[index];
        } while (existingNames.includes(generatedName));
        // while generatedName is part of the existing names (meaning theres a dupe)
        // continue to generate a random name (stored in generatedName) until this is false
        // once false, return that generatedName
        return generatedName;
      }
      // let all 6 player names generate
      // store them in this playerNames array
      const playerNames = [
        randomPlayer1,
        randomPlayer2,
        randomPlayer3,
        randomPlayer4,
        randomPlayer5,
        randomPlayer6,
      ];
      console.log("initial players: ", playerNames);

      // create an empty existingNames array to be filled later
      const uniqueNames = [];

      // forEach player in the playerNames array
      // if name is not(!) included in uniqueNames, push name to uniqueNames
      // else, if it IS included, then run the uniquePlayer function to generate a new name that is unique and then push it to the array
      playerNames.forEach((name) => {
        if (!uniqueNames.includes(name)) {
          uniqueNames.push(name);
        } else {
          let uniquePlayer = verifyUniqueName(uniqueNames);
          uniqueNames.push(uniquePlayer);
        }
      });
      console.log("unique names: ", uniqueNames);

      // pull each unique player from the array
      const uniquePlayer1 = uniqueNames[0];
      const uniquePlayer2 = uniqueNames[1];
      const uniquePlayer3 = uniqueNames[2];
      const uniquePlayer4 = uniqueNames[3];
      const uniquePlayer5 = uniqueNames[4];
      const uniquePlayer6 = uniqueNames[5];

      // return the name and teams array
      const result = {
        player1: {
          name: uniquePlayer1,
          teams: validPlayer[uniquePlayer1].teams,
        },
        player2: {
          name: uniquePlayer2,
          teams: validPlayer[uniquePlayer2].teams,
        },
        player3: {
          name: uniquePlayer3,
          teams: validPlayer[uniquePlayer3].teams,
        },
        player4: {
          name: uniquePlayer4,
          teams: validPlayer[uniquePlayer4].teams,
        },
        player5: {
          name: uniquePlayer5,
          teams: validPlayer[uniquePlayer5].teams,
        },
        player6: {
          name: uniquePlayer6,
          teams: validPlayer[uniquePlayer6].teams,
        },
      };

      console.log("playerdata", result);
      return result;
    } catch (error) {
      console.error("error in getPlayers()", error);
      return null;
    }
  }

  // get players stored locally
  async function getStoredPlayers() {
    const storedPlayers = localStorage.getItem("playerData");
    // if there are players in local storage
    if (storedPlayers) {
      try {
        // parse json string to an object
        const players = JSON.parse(storedPlayers);
        console.log("stored data", players);
        // if the players exist
        if (
          players.player1 &&
          players.player2 &&
          players.player3 &&
          players.player4 &&
          players.player5 &&
          players.player6
        ) {
          // if they exist then set them to the DOM
          setPlayers(players);
          return;
        } else {
          // otherwise remove the players from the storage
          console.error("Invalid players structure in localStorage:", players);
          localStorage.removeItem("playerData");
        }
      } catch (error) {
        console.error("Error parsing stored players:", error);
        localStorage.removeItem("playerData"); // Clear invalid data
      }
    }

    // generate new players instead
    console.log("no players in storage. calling getPlayers() now...");
    // wait for getPlayers function to run
    const newPlayers = await getPlayers();
    // if the players are generated
    if (newPlayers) {
      console.log("new players generated", newPlayers);
      // set the players to local storage and convert them to a json string
      localStorage.setItem("playerData", JSON.stringify(newPlayers));
      setPlayers(newPlayers);
    } else {
      console.error("Failed to generate new players");
    }
  }

  function setPlayers(players) {
    if (!players) {
      console.error(
        "Error. null or undefined data was tried to pass to setPlayers"
      );
      return;
    }
    // apply formatPlayer function to each player generated
    setFormattedPlayer1(formatPlayer(players.player1.name));
    setFormattedPlayer2(formatPlayer(players.player2.name));
    setFormattedPlayer3(formatPlayer(players.player3.name));
    setFormattedPlayer4(formatPlayer(players.player4.name));
    setFormattedPlayer5(formatPlayer(players.player5.name));
    setFormattedPlayer6(formatPlayer(players.player6.name));

    // also set unformatted player for purpose of using in menus and such. we only want the formatted version on the grid itself, not anywhere else. thats why we are setting two versions of player names
    setPlayer1(players.player1.name);
    setPlayer2(players.player2.name);
    setPlayer3(players.player3.name);
    setPlayer4(players.player4.name);
    setPlayer5(players.player5.name);
    setPlayer6(players.player6.name);

    setPlayer1Teams(players.player1.teams);
    setPlayer2Teams(players.player2.teams);
    setPlayer3Teams(players.player3.teams);
    setPlayer4Teams(players.player4.teams);
    setPlayer5Teams(players.player5.teams);
    setPlayer6Teams(players.player6.teams);
  }

  // when Play Again button is pressed reset everything, remove players from local storage and generate new players and set them to local storage
  const startNewGame = async () => {
    setGameOver(false);
    setShowSummary(false);
    setGuessCount(12);
    setScoreCount(0);
    setLogos({});

    localStorage.removeItem("playerData"); // clear stored data
    localStorage.removeItem("gameState"); // clear game state

    const newPlayers = await getPlayers(); // Fetch new players
    localStorage.setItem("playerData", JSON.stringify(newPlayers));
    setPlayers(newPlayers);
  };

  useEffect(() => {
    getStoredPlayers();
  }, []);

  // the menu for choosing teams
  const [isOpen, setIsOpen] = useState(false);
  // controls visibility of results button
  const [gameOver, setGameOver] = useState(false);
  // controls display of results summary pop up
  const [showSummary, setShowSummary] = useState(false);
  // the individual teams in the options menu
  const [selectedTeam, setSelectedTeam] = useState();
  // the cell clicked on by user is the active one
  const [activeCellId, setActiveCellId] = useState(null);
  // correct answer
  const [correctAnswer, setCorrectAnswer] = useState(null);
  // take data associated with the gameState key that is in local storage and parse it from a JSON string into an object stored in savedGameState variable, or empty object if nothing exists
  const savedGameState = JSON.parse(localStorage.getItem("gameState")) || {};
  // logos that appear in the grid cells. either use previously stored state or fresh empty object. same logic applies below for guesses and score
  const [logos, setLogos] = useState(savedGameState.logos || {});
  const [guessCount, setGuessCount] = useState(savedGameState.guessCount || 12);
  const [scoreCount, setScoreCount] = useState(savedGameState.scoreCount || 0);
  const [todaysDate, setTodaysDate] = useState();

  let menuRef = useRef();

  // after component mounts, run the effect. run the effect every time of of the three dependencies changes
  useEffect(() => {
    const gameState = {
      scoreCount,
      guessCount,
      logos,
    };
    // localStorage API can only store strings so convert the gameState to a string
    localStorage.setItem("gameState", JSON.stringify(gameState));
  }, [scoreCount, guessCount, logos]);

  // on component mount only set gameState
  useEffect(() => {
    if (savedGameState) {
      setScoreCount(scoreCount);
      setGuessCount(guessCount);
      setLogos(logos);
    }
  }, []);

  // on component mount only, set the current date
  useEffect(() => {
    const date = new Date();
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date
      .getFullYear()
      .toString()
      .substr(-2)}`;
    setTodaysDate(formattedDate);
  }, []);

  // the functionality for being able to click out of a menu/popup
  useEffect(() => {
    let handler = (e) => {
      if (menuRef.current && menuRef.current === e.target) {
        setIsOpen(false);
        setShowSummary(false);
        // console.log(menuRef.current);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  // when state of dependencies change to meet the conditions, set the state of gameOver and showSummary
  useEffect(() => {
    if (guessCount === 0 || scoreCount === 9) {
      setGameOver(true);
      setShowSummary(true);
    }
  }, [guessCount, scoreCount]);

  // toggle the results button on and off
  const toggleResultSummary = () => {
    setShowSummary((prev) => !prev);
  };

  // the "close" button on the pop up that simply closes the summary
  const closeSummary = () => {
    setShowSummary(false);
  };

  // the disabling of the scrollbar when either the teams menu is open or the end of game summary
  useEffect(() => {
    if (isOpen || showSummary === true) {
      document.body.classList.add("overflow-hidden", "pr-scrollbar", "bg-bg");
    } else {
      document.body.classList.remove(
        "overflow-hidden",
        "pr-scrollbar",
        "bg-bg"
      );
    }
  }, [isOpen, showSummary]);

  // not getting used right now. if i decide to have a new game refresh every 24 hours i will use this function
  function countdown() {
    const now = new Date();
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const midnight = new Date(tomorrow.setHours(0, 0, 0, 0));
    const difference = midnight - now;
    const hours = Math.floor(difference / 1000 / 60 / 60);
    const min = Math.floor(difference / 1000 / 60) % 60;
    const sec = Math.floor(difference / 1000) % 60;

    const formattedhours = hours.toString().padStart(2, "0");
    const formattedmin = min.toString().padStart(2, "0");
    const formattedsec = sec.toString().padStart(2, "0");

    // const countdownElement = document.getElementById("countdown");
    // countdownElement.textContent = `${formattedhours}:${formattedmin}:${formattedsec}`;
  }
  // setInterval(countdown, 100);

  // handle all 9 player comparisons based on active cell
  const handleSelect = (team) => {
    // create a new copy of logos as to not modify logos itself
    const newLogos = { ...logos, [activeCellId]: team.logoURL };
    console.log("active cell: ", activeCellId);
    console.log("Selected Team:", team.name);
    setSelectedTeam(team.name);

    if (activeCellId === "cell1") {
      // the correct answer will be the team selected that is common in both playerXTeams arrays
      const isCorrectAnswer =
        player1Teams.some((abbr) => team.abbr.includes(abbr)) &&
        player4Teams.some((abbr) => team.abbr.includes(abbr));
      setCorrectAnswer(isCorrectAnswer);
      // decrement guess
      setGuessCount((prevCount) => Math.max(prevCount - 1, 0));

      // if the correctAnswer exists, set that logo to the grid, increment the score, decrement the guess, close the menu. repeat for all 9 cells
      if (isCorrectAnswer) {
        console.log("correct match");
        setLogos(newLogos);
        setScoreCount((prevCount) => Math.max(prevCount + 1));
      } else {
        console.log("not a match");
        setIsOpen(!isOpen);
      }
      setIsOpen(!isOpen);
    } else if (activeCellId === "cell2") {
      const isCorrectAnswer =
        player2Teams.some((abbr) => team.abbr.includes(abbr)) &&
        player4Teams.some((abbr) => team.abbr.includes(abbr));
      setCorrectAnswer(isCorrectAnswer);
      // decrement guess
      setGuessCount((prevCount) => Math.max(prevCount - 1, 0));

      if (isCorrectAnswer) {
        console.log("correct match");
        setLogos(newLogos);
        setScoreCount((prevCount) => Math.max(prevCount + 1));
      } else {
        console.log("not a match");
        setIsOpen(!isOpen);
      }
      setIsOpen(!isOpen);
    } else if (activeCellId === "cell3") {
      const isCorrectAnswer =
        player3Teams.some((abbr) => team.abbr.includes(abbr)) &&
        player4Teams.some((abbr) => team.abbr.includes(abbr));
      setCorrectAnswer(isCorrectAnswer);
      // decrement guess
      setGuessCount((prevCount) => Math.max(prevCount - 1, 0));

      if (isCorrectAnswer) {
        console.log("correct match");
        setLogos(newLogos);
        setScoreCount((prevCount) => Math.max(prevCount + 1));
      } else {
        console.log("not a match");
        setIsOpen(!isOpen);
      }
      setIsOpen(!isOpen);
    } else if (activeCellId === "cell4") {
      const isCorrectAnswer =
        player1Teams.some((abbr) => team.abbr.includes(abbr)) &&
        player5Teams.some((abbr) => team.abbr.includes(abbr));
      setCorrectAnswer(isCorrectAnswer);
      // decrement guess
      setGuessCount((prevCount) => Math.max(prevCount - 1, 0));

      if (isCorrectAnswer) {
        console.log("correct match");
        setLogos(newLogos);
        setScoreCount((prevCount) => Math.max(prevCount + 1));
      } else {
        console.log("not a match");
        setIsOpen(!isOpen);
      }
      setIsOpen(!isOpen);
    } else if (activeCellId === "cell5") {
      const isCorrectAnswer =
        player2Teams.some((abbr) => team.abbr.includes(abbr)) &&
        player5Teams.some((abbr) => team.abbr.includes(abbr));
      setCorrectAnswer(isCorrectAnswer);
      // decrement guess
      setGuessCount((prevCount) => Math.max(prevCount - 1, 0));

      if (isCorrectAnswer) {
        console.log("correct match");
        setLogos(newLogos);
        setScoreCount((prevCount) => Math.max(prevCount + 1));
      } else {
        console.log("not a match");
        setIsOpen(!isOpen);
      }
      setIsOpen(!isOpen);
    } else if (activeCellId === "cell6") {
      const isCorrectAnswer =
        player3Teams.some((abbr) => team.abbr.includes(abbr)) &&
        player5Teams.some((abbr) => team.abbr.includes(abbr));
      setCorrectAnswer(isCorrectAnswer);
      // decrement guess
      setGuessCount((prevCount) => Math.max(prevCount - 1, 0));

      if (isCorrectAnswer) {
        console.log("correct match");
        setLogos(newLogos);
        setScoreCount((prevCount) => Math.max(prevCount + 1));
      } else {
        console.log("not a match");
        setIsOpen(!isOpen);
      }
      setIsOpen(!isOpen);
    } else if (activeCellId === "cell7") {
      const isCorrectAnswer =
        player1Teams.some((abbr) => team.abbr.includes(abbr)) &&
        player6Teams.some((abbr) => team.abbr.includes(abbr));
      setCorrectAnswer(isCorrectAnswer);
      // decrement guess
      setGuessCount((prevCount) => Math.max(prevCount - 1, 0));

      if (isCorrectAnswer) {
        console.log("correct match");
        setLogos(newLogos);
        setScoreCount((prevCount) => Math.max(prevCount + 1));
      } else {
        console.log("not a match");
        setIsOpen(!isOpen);
      }
      setIsOpen(!isOpen);
    } else if (activeCellId === "cell8") {
      const isCorrectAnswer =
        player2Teams.some((abbr) => team.abbr.includes(abbr)) &&
        player6Teams.some((abbr) => team.abbr.includes(abbr));
      setCorrectAnswer(isCorrectAnswer);
      // decrement guess
      setGuessCount((prevCount) => Math.max(prevCount - 1, 0));

      if (isCorrectAnswer) {
        console.log("correct match");
        setLogos(newLogos);
        setScoreCount((prevCount) => Math.max(prevCount + 1));
      } else {
        console.log("not a match");
        setIsOpen(!isOpen);
      }
      setIsOpen(!isOpen);
    } else if (activeCellId === "cell9") {
      const isCorrectAnswer =
        player3Teams.some((abbr) => team.abbr.includes(abbr)) &&
        player6Teams.some((abbr) => team.abbr.includes(abbr));
      setCorrectAnswer(isCorrectAnswer);
      // decrement guess
      setGuessCount((prevCount) => Math.max(prevCount - 1, 0));

      if (isCorrectAnswer) {
        console.log("correct match");
        setLogos(newLogos);
        setScoreCount((prevCount) => Math.max(prevCount + 1));
      } else {
        console.log("not a match");
        setIsOpen(!isOpen);
      }
      setIsOpen(!isOpen);
    } else {
      console.log("Something went wrong");
    }
  };

  // when a cell is clicked, set that cell to active and open the menu
  const toggleIsOpen = (cellId) => {
    console.log("Selected Cell:", cellId);
    setActiveCellId(cellId);
    setIsOpen((prev) => !prev);
  };

  // has the activeCellId dependency, this effect is not necessary really, just allows me to see each player's name and teams array in the console so that I can see the answers
  useEffect(() => {
    // prevents running this on initial render
    if (!activeCellId) return;

    let playerA = null,
      playerATeams = null;
    let playerB = null,
      playerBTeams = null;

    // this isnt actually necessary it just consoles the players so i can see what all of the answers are
    if (activeCellId === "cell1") {
      (playerA = player1), (playerATeams = player1Teams);
      (playerB = player4), (playerBTeams = player4Teams);
    } else if (activeCellId === "cell2") {
      (playerA = player2), (playerATeams = player2Teams);
      (playerB = player4), (playerBTeams = player4Teams);
    } else if (activeCellId === "cell3") {
      (playerA = player3), (playerATeams = player3Teams);
      (playerB = player4), (playerBTeams = player4Teams);
    } else if (activeCellId === "cell4") {
      (playerA = player1), (playerATeams = player1Teams);
      (playerB = player5), (playerBTeams = player5Teams);
    } else if (activeCellId === "cell5") {
      (playerA = player2), (playerATeams = player2Teams);
      (playerB = player5), (playerBTeams = player5Teams);
    } else if (activeCellId === "cell6") {
      (playerA = player3), (playerATeams = player3Teams);
      (playerB = player5), (playerBTeams = player5Teams);
    } else if (activeCellId === "cell7") {
      (playerA = player1), (playerATeams = player1Teams);
      (playerB = player6), (playerBTeams = player6Teams);
    } else if (activeCellId === "cell8") {
      (playerA = player2), (playerATeams = player2Teams);
      (playerB = player6), (playerBTeams = player6Teams);
    } else if (activeCellId === "cell9") {
      (playerA = player3), (playerATeams = player3Teams);
      (playerB = player6), (playerBTeams = player6Teams);
    } else {
      console.log("Something went wrong");
      return;
    }

    // keep it commented out for now
    // console.log(`PlayerA:`, playerA, playerATeams);
    // console.log(`PlayerB:`, playerB, playerBTeams);
  }, [activeCellId]);

  // for the rules button. when clicked, scroll all the way to bottom which is where the rules are located
  function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  // all of the front end stuff
  return (
    <section className="flex justify-center items-start max-h-screen w-full border-0">
      <div className="flex flex-col items-center w-full max-w-6xl border-0">
        <div className="flex gap-2 border-0">
          <div className="mx-auto max-w-6xl flex justify-between gap-2 mt-6 border-0">
            {/* <div className="rounded-lg flex items-center bg-white py-2 px-4">Rules</div> */}
            <div className="rounded-lg flex items-center text-white bg-cell-outline2 py-2 px-4 cursor-pointer">
              {todaysDate}
            </div>
            <div className="rounded-lg flex items-center text-white bg-cell-outline2 py-2 px-4 cursor-pointer">
              Hockey Matrix
            </div>
            <div
              className="rounded-lg flex items-center text-white bg-blue-800 py-2 px-4 cursor-pointer hover:bg-blue-700"
              onClick={scrollToBottom}
            >
              Rules
            </div>
            {/* <div className="rounded-lg flex items-center bg-white py-2 px-4">Rules</div> */}
          </div>
        </div>
        <div className="grid grid-cols-5 gap-1.5 mt-0 border-0">
          <div className="flex flex-col justify-center items-center rounded-lg lg:min-h-26 md:min-h-20 sm:min-h-16 text-gray-300 border-0"></div>

          {isOpen && (
            <div
              ref={menuRef}
              onClick={() => toggleIsOpen}
              className="fixed inset-0 bg-cell-outline2 bg-opacity-75 flex justify-center items-start pt-16 text-black"
            >
              <div className="text-center p-5 bg-bg2 rounded-lg text-gray-300 border-3 border-cell-outline2">
                <div className="text-sm">
                  {activeCellId === "cell1"
                    ? `${player1}` + " - " + `${player4}`
                    : ""}
                  {activeCellId === "cell2"
                    ? `${player2}` + " - " + `${player4}`
                    : ""}
                  {activeCellId === "cell3"
                    ? `${player3}` + " - " + `${player4}`
                    : ""}
                  {activeCellId === "cell4"
                    ? `${player1}` + " - " + `${player5}`
                    : ""}
                  {activeCellId === "cell5"
                    ? `${player2}` + " - " + `${player5}`
                    : ""}
                  {activeCellId === "cell6"
                    ? `${player3}` + " - " + `${player5}`
                    : ""}
                  {activeCellId === "cell7"
                    ? `${player1}` + " - " + `${player6}`
                    : ""}
                  {activeCellId === "cell8"
                    ? `${player2}` + " - " + `${player6}`
                    : ""}
                  {activeCellId === "cell9"
                    ? `${player3}` + " - " + `${player6}`
                    : ""}
                </div>
                <div className="border-b border-gray-600 w-3/4 flex mx-auto mt-2"></div>
                <div className="bg-bg2 overflow-auto max-h-80 p-2 mt-5 border-0">
                  {teams.map((team) => (
                    <div
                      key={team.name}
                      className="flex items-center p-1 rounded-lg hover:bg-blue-800 cursor-pointer"
                      onClick={() => handleSelect(team)}
                    >
                      <img
                        src={team.logoURL}
                        alt={team.name}
                        style={{ width: 35, marginRight: 10 }}
                      />
                      {team.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showSummary && (
            <div
              ref={menuRef}
              className="fixed inset-0 bg-cell-outline2 bg-opacity-75 flex justify-center items-start pt-20"
            >
              <div className="text-center p-5 bg-bg2 rounded-lg text-gray-300 border-3 border-cell-outline2">
                <div className="min-h-64 min-w-48 sm:min-h-80 sm:min-w-64 flex flex-col">
                  <span className="text-xl">Game Completed</span>
                  <div className="border-b border-gray-600 w-3/4 flex mx-auto mt-2"></div>
                  <span className="pt-2">Your Final Score</span>
                  <span className="mt-8 text-5xl font-bold">
                    {scoreCount}/9
                  </span>
                  <span className="mt-10 text-sm">Play again to try</span>
                  <span className="text-sm">a new game!</span>
                </div>
                <div className="flex justify-center gap-2">
                  <div
                    onClick={startNewGame}
                    className="rounded-lg flex items-center justify-center text-white bg-blue-800 py-2 px-4 cursor-pointer hover:bg-blue-700"
                  >
                    <span>Play Again</span>
                  </div>
                  <div
                    onClick={closeSummary}
                    className="rounded-lg flex items-center justify-center text-white bg-blue-800 py-2 px-4 cursor-pointer hover:bg-blue-700"
                  >
                    <span>Close</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* name col 1 */}
          <div
            className="flex justify-center items-center rounded-lg lg:min-h-26 md:min-h-20 sm:min-h-16 font-bold
            text-center text-xs sm:text-xs md:text-sm lg:text-md pt-4 text-gray-300 border-0"
            id="player1"
          >
            {formattedPlayer1}
          </div>
          {/* name col 2 */}
          <div
            className="flex justify-center items-center rounded-lg lg:min-h-26 md:min-h-20 sm:min-h-16 font-bold
            text-center text-xs sm:text-xs md:text-sm lg:text-md pt-4 text-gray-300"
            id="player2"
          >
            {formattedPlayer2}
          </div>
          {/* name col 3 */}
          <div
            className="flex justify-center items-center rounded-lg lg:min-h-26 md:min-h-20 sm:min-h-16 font-bold
            text-center text-xs sm:text-xs md:text-sm lg:text-md pt-4 text-gray-300 border-0"
            id="player3"
          >
            {formattedPlayer3}
          </div>

          <div
            className="flex flex-col justify-center items-center rounded-lg 
            pt-4 lg:min-h-26 md:min-h-20 sm:min-h-16 border-0 border-cell-outline2"
          ></div>

          {/* name row 1 */}
          <div
            className="flex justify-center items-center rounded-lg lg:min-h-26 md:min-h-20 sm:min-h-16 text-center text-xs sm:text-xs md:text-sm lg:text-md font-bold text-gray-300 text-center"
            id="player4"
          >
            {formattedPlayer4}
          </div>

          {/* logo cell 1 */}
          <div
            className={`aspect-square rounded-lg lg:min-h-26 md:min-h-20 sm:min-h-16 flex justify-center items-center border-3 border-cell-outline2 cursor-pointer hover:bg-cell-hover
            ${logos["cell1"] ? "bg-green-900 pointer-events-none" : ""}
            ${guessCount === 0 ? "pointer-events-none" : ""}`}
            onClick={() => {
              setActiveCellId("cell1");
              toggleIsOpen("cell1");
            }}
            id="cell1"
          >
            {logos["cell1"] && (
              <img
                className="max-w-3/4 max-h-3/4"
                src={logos["cell1"]}
                alt="N/A"
              />
            )}
          </div>

          {/* logo cell 2 */}
          <div
            className={`aspect-square rounded-lg lg:min-h-26 md:min-h-20 sm:min-h-16 flex justify-center items-center border-3 border-cell-outline2 cursor-pointer hover:bg-cell-hover 
            ${logos["cell2"] ? "bg-green-900 pointer-events-none" : ""}
            ${guessCount === 0 ? "pointer-events-none" : ""}`}
            onClick={() => {
              setActiveCellId("cell2");
              toggleIsOpen("cell2");
            }}
            id="cell2"
          >
            {logos["cell2"] && (
              <img
                className="max-w-3/4 max-h-3/4"
                src={logos["cell2"]}
                alt="N/A"
              />
            )}
          </div>

          {/* logo cell 3 */}
          <div
            className={`aspect-square rounded-lg lg:min-h-26 md:min-h-20 sm:min-h-16 flex justify-center items-center border-3 border-cell-outline2 cursor-pointer hover:bg-cell-hover 
            ${logos["cell3"] ? "bg-green-900 pointer-events-none" : ""}
            ${guessCount === 0 ? "pointer-events-none" : ""}`}
            onClick={() => {
              setActiveCellId("cell3");
              toggleIsOpen("cell3");
            }}
            id="cell3"
          >
            {logos["cell3"] && (
              <img
                className="max-w-3/4 max-h-3/4"
                src={logos["cell3"]}
                alt="N/A"
              />
            )}
          </div>
          {/* info cell 1 */}
          <div className="flex flex-col justify-center items-center rounded-lg lg:min-h-26 md:min-h-20 sm:min-h-16 border-0 border-cell-outline2">
            <span className="text-xs sm:text-xs md:text-sm lg:text-lg">
              Score
            </span>
            <span className="text-xs sm:text-md md:text-xl lg:text-3xl font-bold">
              {scoreCount}/9
            </span>
          </div>

          {/* name row 2 */}
          <div
            className="flex justify-center items-center rounded-lg lg:min-h-26 md:min-h-20 sm:min-h-16 text-center text-xs sm:text-xs md:text-sm lg:text-md font-bold text-gray-300"
            id="player5"
          >
            {formattedPlayer5}
          </div>

          {/* logo cell 4 */}
          <div
            className={`aspect-square rounded-lg lg:min-h-26 md:min-h-20 sm:min-h-16 flex justify-center items-center border-3 border-cell-outline2 cursor-pointer hover:bg-cell-hover 
            ${logos["cell4"] ? "bg-green-900 pointer-events-none" : ""}
            ${guessCount === 0 ? "pointer-events-none" : ""}`}
            onClick={() => {
              setActiveCellId("cell4");
              toggleIsOpen("cell4");
            }}
            id="cell4"
          >
            {logos["cell4"] && (
              <img
                className="max-w-3/4 max-h-3/4"
                src={logos["cell4"]}
                alt="N/A"
              />
            )}
          </div>

          {/* logo cell 5 */}
          <div
            className={`aspect-square rounded-lg lg:min-h-26 md:min-h-20 sm:min-h-16 flex justify-center items-center border-3 border-cell-outline2 cursor-pointer hover:bg-cell-hover 
            ${logos["cell5"] ? "bg-green-900 pointer-events-none" : ""}
            ${guessCount === 0 ? "pointer-events-none" : ""}`}
            onClick={() => {
              setActiveCellId("cell5");
              toggleIsOpen("cell5");
            }}
            id="cell5"
          >
            {logos["cell5"] && (
              <img
                className="max-w-3/4 max-h-3/4"
                src={logos["cell5"]}
                alt="N/A"
              />
            )}
          </div>

          {/* logo cell 6 */}
          <div
            className={`aspect-square rounded-lg lg:min-h-26 md:min-h-20 sm:min-h-16 flex justify-center items-center border-3 border-cell-outline2 cursor-pointer hover:bg-cell-hover 
            ${logos["cell6"] ? "bg-green-900 pointer-events-none" : ""}
            ${guessCount === 0 ? "pointer-events-none" : ""}`}
            onClick={() => {
              setActiveCellId("cell6");
              toggleIsOpen("cell6");
            }}
            id="cell6"
          >
            {logos["cell6"] && (
              <img
                className="max-w-3/4 max-h-3/4"
                src={logos["cell6"]}
                alt="N/A"
              />
            )}
          </div>

          {/* info cell 2 */}
          <div className="flex flex-col justify-center items-center rounded-lg lg:min-h-26 md:min-h-20 sm:min-h-16 border-0 border-cell-outline2">
            <span className="text-xs sm:text-xs md:text-sm lg:text-lg">
              Guesses
            </span>
            <span className="text-xs sm:text-md md:text-xl lg:text-3xl font-bold">
              {guessCount}
            </span>
          </div>

          {/* name row 3 */}
          <div
            className="flex justify-center items-center rounded-lg lg:min-h-26 md:min-h-20 sm:min-h-16 text-center text-xs sm:text-xs md:text-sm lg:text-md font-bold text-gray-300"
            id="player6"
          >
            {formattedPlayer6}
          </div>

          {/* logo cell 7 */}
          <div
            className={`aspect-square rounded-lg lg:min-h-26 md:min-h-20 sm:min-h-16 flex justify-center items-center border-3 border-cell-outline2  cursor-pointer hover:bg-cell-hover 
            ${logos["cell7"] ? "bg-green-900 pointer-events-none" : ""}
            ${guessCount === 0 ? "pointer-events-none" : ""}`}
            onClick={() => {
              setActiveCellId("cell7");
              toggleIsOpen("cell7");
            }}
            id="cell7"
          >
            {logos["cell7"] && (
              <img
                className="max-w-3/4 max-h-3/4"
                src={logos["cell7"]}
                alt="N/A"
              />
            )}
          </div>

          {/* logo cell 8 */}
          <div
            className={`aspect-square rounded-lg lg:min-h-26 md:min-h-20 sm:min-h-16 flex justify-center items-center border-3 border-cell-outline2 cursor-pointer hover:bg-cell-hover 
            ${logos["cell8"] ? "bg-green-900 pointer-events-none" : ""}
            ${guessCount === 0 ? "pointer-events-none" : ""}`}
            onClick={() => {
              setActiveCellId("cell8");
              toggleIsOpen("cell8");
            }}
            id="cell8"
          >
            {logos["cell8"] && (
              <img
                className="max-w-3/4 max-h-3/4"
                src={logos["cell8"]}
                alt="N/A"
              />
            )}
          </div>

          {/* logo cell 9 */}
          <div
            className={`aspect-square rounded-lg lg:min-h-26 md:min-h-20 sm:min-h-16 flex justify-center items-center border-3 border-cell-outline2 cursor-pointer hover:bg-cell-hover 
            ${logos["cell9"] ? "bg-green-900 pointer-events-none" : ""}
            ${guessCount === 0 ? "pointer-events-none" : ""}`}
            onClick={() => {
              setActiveCellId("cell9");
              toggleIsOpen("cell9");
            }}
            id="cell9"
          >
            {logos["cell9"] && (
              <img
                className="max-w-3/4 max-h-3/4"
                src={logos["cell9"]}
                alt="N/A"
              />
            )}
          </div>
          {/* info cell 3 */}
          <div className="flex flex-col justify-center items-center rounded-lg lg:min-h-26 md:min-h-20 sm:min-h-16 border-0 border-cell-outline2">
            {gameOver && (
              <div
                onClick={toggleResultSummary}
                className="rounded-lg flex items-center text-white bg-blue-800 py-2 px-3 cursor-pointer hover:bg-blue-700"
              >
                <span className="text-xs sm:text-xs md:text-sm lg:text-md">
                  Results
                </span>
              </div>
            )}
            {/* <span className="text-xs">Next Grid</span>
                <span className="text-xl font-bold" id="countdown" >-</span> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Grid;
