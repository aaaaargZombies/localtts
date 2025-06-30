const txtlog = document.getElementById("log");
const txtinput = document.getElementById("text");
const btnsubmit = document.getElementById("submit");
const audioContainer = document.getElementById("audioContainer");

function submit() {
  const texts = txtinput.value.split("\n").filter(Boolean);
  createAudio(texts);
  txtinput.value = "";
}

const createAudio = (txts) => {
  if (txts.length === 0) {
    console.log("all done");
  } else {
    const [txt, ...tail] = txts;
    logentry(txt);
    const text = encodeURI(txt);
    const audio = new Audio(`http://localhost:5000/?text=${text}`);
    audio.setAttribute("controls", "");
    audioContainer.appendChild(audio);
    audio.addEventListener("loadeddata", () => {
      createAudio(tail);
    });
  }
};

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
