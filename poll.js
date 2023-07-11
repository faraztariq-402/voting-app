import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc, addDoc, collection, getDocs,getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB2RepLJZn7OqzJH2zUYhliaxlBt5YBBDg",
    authDomain: "fir-polling-web.firebaseapp.com",
    projectId: "fir-polling-web",
    storageBucket: "fir-polling-web.appspot.com",
    messagingSenderId: "683684610212",
    appId: "1:683684610212:web:9e6d6d41d7ec477e422631"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  
// let pollVoteButton;


let pollContainer = document.querySelector("#pollContainer");
let pollRef;

document.querySelector("#addPoll").addEventListener("click", () => {
  Swal.fire({
    title: "Create a Poll",
    html: `
     <label class = 'labelAlert'>Voting Topic :</label><br> <input type="text" id="swalVotingTopic" placeholder="Voting Topic" required class= "alertInputs"><br>
     <label class = 'labelAlert'>Option 1 :</label><br>  <input type="text" id="swalOption1" placeholder="Option 1" required class= "alertInputs"><br>
     <label class = 'labelAlert'>Option 2 :</label><br>  <input type="text" id="swalOption2" placeholder="Option 2" required  class= "alertInputs"><br>
     <label class = 'labelAlert'>Option 3 :</label><br>  <input type="text" id="swalOption3" placeholder="Option 3" required class= "alertInputs"><br>
     <label class = 'labelAlert'>Option 4 :</label><br>  <input type="text" id="swalOption4" placeholder="Option 4" required class= "alertInputs"><br>
    `,
    showCancelButton: true,
    confirmButtonText: "Create Poll",
    cancelButtonText: "Cancel",
    
    preConfirm: () => {
      const votingTopicValue = document.querySelector("#swalVotingTopic").value;
      const option1Value = document.querySelector("#swalOption1").value;
      const option2Value = document.querySelector("#swalOption2").value;
      const option3Value = document.querySelector("#swalOption3").value;
      const option4Value = document.querySelector("#swalOption4").value;
      createPollInFirestore(votingTopicValue, option1Value, option2Value, option3Value, option4Value);
    },
  });
});

const createPollInFirestore = async (votingTopic, option1, option2, option3, option4) => {
  const options = [
    { option: option1, votes: 0 },
    { option: option2, votes: 0 },
    { option: option3, votes: 0 },
    { option: option4, votes: 0 },
  ];

  try {
    pollRef = await addDoc(collection(db, "polls"), {
      topic: votingTopic,
      options: options,
    });

    console.log("Poll added to Firestore successfully!");
    console.log("Poll ID:", pollRef.id);
    getAndDisplayPolls();
  } catch (error) {
    console.error("Error adding poll to Firestore:", error);
  }
};

const getAndDisplayPolls = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "polls"));

    pollContainer.innerHTML = '';

    if (querySnapshot.empty) {
      console.log("No polls found in Firestore.");
      return;
    }

    let pollExists = false;

    querySnapshot.forEach((doc) => {
      const pollData = doc.data();

      if (!pollData || !pollData.topic || !pollData.options) {
        console.log("Invalid poll data:", pollData);
        return;
      }

      pollExists = true;

      let completePoll = document.createElement("div");
      completePoll.classList.add("completePoll");

      let votingTopicDiv = document.createElement("div");
      votingTopicDiv.classList.add("votingTopic");
      let pollTopic = document.createElement("p");
      pollTopic.innerHTML = pollData.topic;
      votingTopicDiv.appendChild(pollTopic);

      let pollOption = document.createElement("div");
      pollOption.classList.add("polls");

      completePoll.appendChild(votingTopicDiv);
      completePoll.appendChild(pollOption);

      let totalVotes = 0;

      pollData.options.forEach((option) => {
        totalVotes += option.votes;
      });

      pollData.options.forEach((option) => {
        let optionInput = document.createElement("input");
        optionInput.type = "radio";
        optionInput.name = `option-${doc.id}`;
        optionInput.id = option.option;
        optionInput.value = option.option;

        let label = document.createElement("label");
        label.htmlFor = option.option;
        label.textContent = option.option;

        let span = document.createElement("span");
        span.id = option.option + "Percentage";
        const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(2) : 0;
        span.textContent = `${percentage}%`;
        if (percentage >= 70 && percentage <= 100) {
          span.style.color = 'darkgreen';
        } else {
          span.style.color = 'blue';
        }

        let pollOptionItem = document.createElement("div");
        pollOptionItem.classList.add("myPoll");
        pollOptionItem.appendChild(optionInput);
        pollOptionItem.appendChild(label);
        pollOptionItem.appendChild(span);

        pollOption.appendChild(pollOptionItem);
      });

      let pollVoteButton = document.createElement("button");
      pollVoteButton.textContent = "Add Vote";

      pollVoteButton.addEventListener("click", async () => {
        const selectedOption = document.querySelector(`input[name="option-${doc.id}"]:checked`);
        if (!selectedOption) {
          console.log("No option selected for poll:", doc.id);
          return;
        }

        const optionIndex = pollData.options.findIndex((option) => option.option === selectedOption.value);
        if (optionIndex === -1) {
          console.log("Invalid option selected for poll:", doc.id);
          return;
        }

        await addVoteToFirestore(doc.id, optionIndex, pollVoteButton);
      });

      completePoll.appendChild(pollVoteButton);

      pollContainer.appendChild(completePoll);
    });

    if (!pollExists) {
      console.log("No valid polls found in Firestore.");
      return;
    }

    console.log("Polls retrieved from Firestore successfully!");
  } catch (error) {
    console.error("Error retrieving polls from Firestore:", error);
  }
};

const addVoteToFirestore = async (pollId, optionIndex, button) => {
  try {
    const userId = auth.currentUser.uid;
    const userVoteDocRef = doc(db, "votes", pollId + "_" + userId);
    const userVoteDoc = await getDoc(userVoteDocRef);

    if (userVoteDoc.exists()) {
      console.log("User has already voted for this poll.");
      button.disabled = true;
   button.style.backgroundColor = 'gray'
   alert("You Have Already Voted For This Poll")
      return;
    }

    const pollDocRef = doc(db, "polls", pollId);
    const pollDoc = await getDoc(pollDocRef);

    if (!pollDoc.exists()) {
      console.log("Poll does not exist");
      return;
    }

    const pollData = pollDoc.data();
    const updatedOptions = [...pollData.options];
    updatedOptions[optionIndex].votes++;

    await updateDoc(pollDocRef, { options: updatedOptions });

    await setDoc(userVoteDocRef, { voted: true });

    console.log("Vote added to the poll successfully!");
    console.log("Poll ID:", pollId);
    console.log("Selected Option Index:", optionIndex);
    console.log("Selected Option:", updatedOptions[optionIndex].option);
    getAndDisplayPolls();
  } catch (error) {
    console.error("Error adding vote to the poll:", error);
  }
};

getAndDisplayPolls();