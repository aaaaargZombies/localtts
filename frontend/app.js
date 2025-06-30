const txtlog = document.getElementById("log");
const txtinput = document.getElementById("text");
const btnsubmit = document.getElementById("submit");
const audioContainer = document.getElementById("audioContainer");

const queue = [];

const performEffect = () => {
  console.log("PERFORM:", Date.now());
  if (queue.length === 0) {
    setTimeout(performEffect, 500);
  } else {
    console.log("Stuff in the queue");
    const txt = queue.shift();
    logentry(txt);
    const text = encodeURI(txt);
    const audio = new Audio(`http://localhost:5000/?text=${text}`);
    audio.setAttribute("controls", "");
    audioContainer.appendChild(audio);
    audio.addEventListener("loadeddata", () => {
      performEffect();
    });
  }
};

performEffect();

function submit() {
  console.log("Submitting");
  const texts = txtinput.value.split("\n").filter(Boolean);
  texts.forEach((text) => {
    queue.push(text);
  });
  txtinput.value = "";
}

function logentry(input) {
  const timestamp = new Date().toLocaleTimeString();
  txtlog.value += "\n" + timestamp + " : " + input + "\n---";
}

btnsubmit.addEventListener("click", () => {
  submit();
});

txtinput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    submit();
  }
});

txtlog.value += "\n" + "---";
txtinput.focus();
