import "./style.css";
import { Elm } from "./src/Main.elm";

if (process.env.NODE_ENV === "development") {
  const ElmDebugTransform = await import("elm-debug-transformer");

  ElmDebugTransform.register({
    simple_mode: true,
  });
}

const root = document.querySelector("#app div");
const app = Elm.Main.init({ node: root });

const audioTasks = () => {
  const queue = [];
  const audioElements = {};
  let idle = true;

  /**
   * Limit the amount of audio we attempt to create in one go.
   * The user can request as much as they like without overwhelming
   * the cpu.
   */
  const createAudio = () => {
    idle = false;
    if (queue.length === 0) {
      idle = true;
    } else {
      const [id, txt] = queue.shift();
      const text = encodeURI(txt);
      const audio = new Audio(`http://localhost:5000/?text=${text}`);
      audio.addEventListener("ended", (event) => {
        app.ports.audioEnded.send(id);
        console.log("Audio ended it had an ID:", id);
      });
      audio.addEventListener("loadeddata", () => {
        audioElements[id] = audio;
        console.log("loaded some data");
        createAudio();
      });
    }
  };

  const offer = (text, id) => {
    queue.push([id, text]);
    if (idle) {
      createAudio();
    }
  };

  const play = (id) => {
    const audio = audioElements[id];
    if (audio) {
      audio.play();
    } else {
      console.log("no audio at that address");
    }
  };

  const stop = () => {
    Object.values(audioElements).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  };

  const pause = () => {
    Object.values(audioElements).forEach((audio) => {
      audio.pause();
    });
  };

  return { offer, play, stop, pause };
};

const { offer, play, stop, pause } = audioTasks();

app.ports.sendText.subscribe(([text, id]) => {
  offer(text, id);
});

app.ports.playText.subscribe((id) => {
  play(id);
});

app.ports.pauseText.subscribe(() => pause());
