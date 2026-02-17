//Load counts from local storage
function loadCountsFromStorage() {
  const savedCount = localStorage.getItem("totalAttendees");
  const savedWaterCount = localStorage.getItem("waterCount");
  const savedZeroCount = localStorage.getItem("zeroCount");
  const savedPowerCount = localStorage.getItem("powerCount");
  const savedAttendees = localStorage.getItem("attendees");

  if (savedCount !== null) {
    document.getElementById("attendeeCount").textContent = savedCount;
  }
  if (savedWaterCount !== null) {
    document.getElementById("waterCount").textContent = savedWaterCount;
  }
  if (savedZeroCount !== null) {
    document.getElementById("zeroCount").textContent = savedZeroCount;
  }
  if (savedPowerCount !== null) {
    document.getElementById("powerCount").textContent = savedPowerCount;
  }

  //Load and display attendees
  if (savedAttendees !== null) {
    const attendees = JSON.parse(savedAttendees);
    attendees.forEach(function (attendee) {
      displayAttendee(attendee);
    });
  }

  //Update progress bar
  const count = parseInt(document.getElementById("attendeeCount").textContent);
  const maxCount = 50;
  const percentage = Math.round((count / maxCount) * 100) + "%";
  document.getElementById("progressBar").style.width = percentage;
}

//Function to display an attendee in the list
function displayAttendee(attendee) {
  const containerId = attendee.team + "Attendees";
  const container = document.getElementById(containerId);
  const attendeeNameDiv = document.createElement("div");
  attendeeNameDiv.className = "attendee-name";
  attendeeNameDiv.textContent = attendee.name;
  container.appendChild(attendeeNameDiv);
}

//Acquire Dom elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

//Load saved counts on page load
loadCountsFromStorage();

//Add event listener to the form
form.addEventListener("submit", function (event) {
  event.preventDefault();

  //Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  //Track attendance
  const attendeeCountElement = document.getElementById("attendeeCount");
  let count = parseInt(attendeeCountElement.textContent);
  const maxCount = 50;

  //Check if event is at capacity
  if (count >= maxCount) {
    const greetingElement = document.getElementById("greeting");
    greetingElement.textContent =
      "Event is at full capacity. No more check-ins available.";
    greetingElement.style.display = "block";
    greetingElement.classList.remove("success-message");
    greetingElement.style.backgroundColor = "#fecaca";
    greetingElement.style.color = "#7f1d1d";
    setTimeout(function () {
      greetingElement.style.display = "none";
    }, 5000);
    return;
  }

  count++;
  console.log(name, team, teamName);

  //Increment count
  attendeeCountElement.textContent = count;
  //Save total count to local storage
  localStorage.setItem("totalAttendees", count);
  console.log(`Current attendance count: ${count}`);

  //Update Progress Bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log(`Attendance percentage: ${percentage}`);
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage;

  //Update team counter
  const teamCounter = document.getElementById(team + "Count");
  const newTeamCount = parseInt(teamCounter.textContent) + 1;
  teamCounter.textContent = newTeamCount;
  //Save team count to local storage
  localStorage.setItem(team + "Count", newTeamCount);

  //Save attendee to local storage
  let attendees = [];
  const savedAttendees = localStorage.getItem("attendees");
  if (savedAttendees !== null) {
    attendees = JSON.parse(savedAttendees);
  }
  const newAttendee = {
    name: name,
    team: team,
    teamName: teamName,
  };
  attendees.push(newAttendee);
  localStorage.setItem("attendees", JSON.stringify(attendees));

  //Display attendee in the list
  displayAttendee(newAttendee);

  //Check if goal is reached
  if (count === maxCount) {
    //Find winning team
    const waterCount = parseInt(
      document.getElementById("waterCount").textContent,
    );
    const zeroCount = parseInt(
      document.getElementById("zeroCount").textContent,
    );
    const powerCount = parseInt(
      document.getElementById("powerCount").textContent,
    );

    let winningTeamName = "";
    let maxTeamCount = Math.max(waterCount, zeroCount, powerCount);

    if (waterCount === maxTeamCount) {
      winningTeamName = "Team Water Wise";
    } else if (zeroCount === maxTeamCount) {
      winningTeamName = "Team Net Zero";
    } else if (powerCount === maxTeamCount) {
      winningTeamName = "Team Renewables";
    }

    //Display celebration message
    const greetingElement = document.getElementById("greeting");
    const celebrationMessage = `🎉 Congratulations! Event goal reached! 🎉 ${winningTeamName} is the winning team!`;
    greetingElement.textContent = celebrationMessage;
    greetingElement.style.display = "block";
    greetingElement.classList.add("success-message");
    greetingElement.style.backgroundColor = "#fbbf24";
    greetingElement.style.color = "#78350f";

    setTimeout(function () {
      greetingElement.style.display = "none";
    }, 5000);

    form.reset();
    return;
  }

  //Welcome message
  const message = `Welcome, ${name}! You have checked in for the ${teamName} team.`;
  console.log(message);

  //Display greeting message
  const greetingElement = document.getElementById("greeting");
  greetingElement.textContent = message;
  greetingElement.style.display = "block";
  greetingElement.classList.add("success-message");

  //Hide message after 5 seconds
  setTimeout(function () {
    greetingElement.style.display = "none";
  }, 5000);

  form.reset();
});
