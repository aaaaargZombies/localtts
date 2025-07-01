const txtlog = document.getElementById("log");
const txtinput = document.getElementById("text");
const btnsubmit = document.getElementById("submit");
const audioContainer = document.getElementById("audioContainer");

const createAudio = () => {
  const queue = [];
  let idle = true;

  const performEffect = () => {
    idle = false;
    if (queue.length === 0) {
      idle = true;
    } else {
      const txt = queue.shift();
      const text = encodeURI(txt);
      const audio = new Audio(`http://localhost:5000/?text=${text}`);
      audio.setAttribute("controls", "");
      audioContainer.appendChild(audio);
      audio.addEventListener("loadeddata", () => {
        performEffect();
      });
    }
  };

  const offer = (t) => {
    logentry(t);
    queue.push(t);
    if (idle) {
      performEffect();
    }
  };

  return offer;
};

const offer = createAudio();

function submit() {
  const texts = txtinput.value.split("\n").filter(Boolean);
  texts.forEach((text) => {
    offer(text);
  });
  txtinput.value = "";
}

function logentry(input) {
  const timestamp = new Date().toLocaleTimeString();
  txtlog.value += timestamp + " : " + input + "\n\n";
}

btnsubmit.addEventListener("click", () => {
  submit();
});

txtinput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    submit();
  }
});

txtinput.focus();
