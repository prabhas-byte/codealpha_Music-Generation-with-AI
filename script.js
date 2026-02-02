let synth, loop;
let isPlaying = false;

const statusEl = document.getElementById('status');
const generateBtn = document.getElementById('generateBtn');
const stopBtn = document.getElementById('stopBtn');
const styleSelect = document.getElementById('styleSelect');
const bpmSlider = document.getElementById('bpm');
const bpmValue = document.getElementById('bpmValue');

bpmSlider.addEventListener('input', (e) => {
  bpmValue.textContent = e.target.value;
  Tone.Transport.bpm.value = parseInt(e.target.value);
});

function createSynth(style) {
  if (synth) synth.dispose();

  if (style === 'ambient') {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 2, decay: 1, sustain: 0.8, release: 4 }
    }).toDestination();
  } else if (style === 'arpeggio') {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.8 }
    }).toDestination();
  } else if (style === 'techno') {
    synth = new Tone.MembraneSynth().toDestination();
  } else if (style === 'jazz') {
    synth = new Tone.PolySynth(Tone.AMSynth, {
      harmonicity: 3.01,
      modulationIndex: 10,
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1 }
    }).toDestination();
  } else if (style === 'chiptune') {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'square' },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.1 }
    }).toDestination();
  } else if (style === 'piano') {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.4, release: 1.2 }
    }).toDestination();
  } else if (style === 'electronic') {
    synth = new Tone.FMSynth().toDestination();
  } else if (style === 'hiphop') {
    synth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 4
    }).toDestination();
  }
}

function generateLoop(style) {
  if (loop) loop.dispose();

  const bpm = parseInt(bpmSlider.value);
  Tone.Transport.bpm.value = bpm;

  const notes = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5'];
  let index = 0;

  loop = new Tone.Loop((time) => {
    let note;
    if (style === 'ambient' || style === 'jazz' || style === 'piano') {
      note = notes[Math.floor(Math.random() * notes.length)];
      synth.triggerAttackRelease(note, '4n', time);
    } else if (style === 'arpeggio' || style === 'electronic') {
      note = notes[index % notes.length];
      synth.triggerAttackRelease(note, '16n', time);
      index++;
    } else if (style === 'techno' || style === 'hiphop') {
      synth.triggerAttackRelease('C2', '8n', time);
    } else { // chiptune
      note = notes[Math.floor(Math.random() * 4)];
      synth.triggerAttackRelease(note, '8n', time);
    }
  }, '8n').start(0);
}

generateBtn.addEventListener('click', () => {
  const style = styleSelect.value;

  createSynth(style);
  generateLoop(style);

  Tone.Transport.start();
  isPlaying = true;

  statusEl.textContent = `Playing ${style.replace('-', ' ')} style...`;
  generateBtn.textContent = 'Regenerate';
  stopBtn.disabled = false;
});

stopBtn.addEventListener('click', () => {
  Tone.Transport.stop();
  isPlaying = false;
  statusEl.textContent = 'Stopped. Click Generate to play again.';
  stopBtn.disabled = true;
  generateBtn.textContent = 'Generate & Play';
});

// Start Tone.js context on user interaction (browser policy)
document.body.addEventListener('click', () => {
  if (Tone.context.state !== 'running') {
    Tone.start();
  }
}, { once: true });