(() => {
  "use strict";

  const holds = Array.from(document.querySelectorAll(".route-hold"));
  const climbStatus = document.getElementById("climb-status");
  const climbReset = document.getElementById("climb-reset");
  let nextHold = 0;

  holds.forEach((hold, index) => {
    hold.addEventListener("click", () => {
      if (nextHold === holds.length) return;
      if (index !== nextHold) {
        climbStatus.textContent = "Try hold " + (nextHold + 1) + " next.";
        return;
      }
      hold.classList.add("is-reached");
      nextHold += 1;
      climbReset.hidden = false;
      climbStatus.textContent = nextHold === holds.length
        ? "Route complete."
        : "Next hold: " + (nextHold + 1) + ".";
    });
  });
  climbReset.addEventListener("click", () => {
    nextHold = 0;
    holds.forEach(hold => hold.classList.remove("is-reached"));
    climbStatus.textContent = "Start at hold 1.";
    climbReset.hidden = true;
    holds[0].focus();
  });

  const keys = Array.from(document.querySelectorAll("[data-note]"));
  const phraseButton = document.getElementById("piano-phrase");
  const pianoStatus = document.getElementById("piano-status");
  let audio;

  async function enableAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) throw new Error("Web Audio unavailable");
    audio ||= new AudioContext();
    if (audio.state !== "running") await audio.resume();
  }

  function playNote(note, at) {
    const frequency = 440 * 2 ** ((note - 69) / 12);
    const envelope = audio.createGain();
    envelope.gain.setValueAtTime(.001, at);
    envelope.gain.exponentialRampToValueAtTime(.16, at + .012);
    envelope.gain.exponentialRampToValueAtTime(.001, at + .95);
    envelope.connect(audio.destination);

    // Combine quiet overtones with the fundamental for a plucked, piano-like attack.
    [1, .24, .09].forEach((amplitude, index) => {
      const voice = audio.createOscillator();
      const gain = audio.createGain();
      voice.frequency.value = frequency * (index + 1);
      gain.gain.value = amplitude;
      voice.connect(gain).connect(envelope);
      voice.start(at);
      voice.stop(at + .96);
      if (index === 0) voice.onended = () => envelope.disconnect();
    });
  }

  async function play(notes) {
    try {
      await enableAudio();
      const start = audio.currentTime + .015;
      notes.forEach((note, index) => playNote(note, start + index * .28));
      pianoStatus.textContent = "";
    } catch {
      pianoStatus.textContent = "Audio is unavailable in this browser.";
    }
  }

  keys.forEach(key => key.addEventListener("click", () => play([Number(key.dataset.note)])));
  phraseButton.addEventListener("click", () => play([60, 64, 67, 72, 71, 67, 65, 64, 62, 60]));
})();
