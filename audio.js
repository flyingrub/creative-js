class Audio {

    init() {
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        this.audioContext = new AudioContext();

        this.player = document.getElementById('player');
        // Source
        this.currentAudioSource = this.audioContext.createMediaElementSource(player);
        this.currentAudioSource.connect(this.audioContext.destination);

        // Analyser
        this.analyser = this.audioContext.createAnalyser();
        this.sampleRate = this.audioContext.sampleRate;
        this.analyser.smoothingTimeConstant = 0.9;
        this.analyser.fftSize = 1024;
        this.freqMax = this.sampleRate / 2;
        this.bufferLength = this.analyser.frequencyBinCount;
	    this.freqBinStep = this.freqMax / this.analyser.fftSize;
        this.analyser.maxDecibels = 0;
        this.analyser.minDecibels = -100;
        this.currentAudioSource.connect(this.analyser);
    }

    load(url) {
        this.player.setAttribute('src', url);
        this.player.load();
        this.player.play();
    }

    analyse() {
        this.freq = new Uint8Array(this.bufferLength);
        this.analyser.getByteFrequencyData(this.freq);

        let bass = [],
            kick = [],
            mid = [],
            high = [];

        for(let i = 1; i < this.bufferLength; i++) {
            let freq = this.freqBinStep * i;

            if (freq < 100) {
                bass.push(this.freq[i]);
            } else if (freq < 200) {
                kick.push(this.freq[i])
            } else if (freq < 2000) {
                mid.push(this.freq[i]);
            } else {
                high.push(this.freq[i]);
            }
        }

        let average = (array) => {
            let sum = array.reduce(function(a, b) { return a + b; });
            return sum / array.length / 255;
        }

        return {
            bass : average(bass),
            kick : average(kick),
            mid : average(mid),
            high : average(high),
            volume : average(this.freq)
        };
    }

    loadFromLocal(file) {
        let reader = new FileReader();
        reader.addEventListener('load', function(e) {
            let data = e.target.result;
            audio.audioContext.decodeAudioData(data,
                (buffer) => audio.playFromFile(buffer)
            );
        });
        reader.readAsArrayBuffer(file);
    }
}
