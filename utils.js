let audio;

const hashCode = s => s.split('').reduce((a,b) => (((a << 5) - a) + b.charCodeAt(0))|0, 0)

window.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
        case 's':
            event.preventDefault();
            saveCanvas(document.title + random(), 'png');
            break;
        }
    }
});

function setupSeed() {
    var url = new URL(window.location.href);
    var seed = url.searchParams.get("seed");
    if (seed)
    {
        var seedNumber = hashCode(btoa(seed));
        randomSeed(seedNumber);
        noiseSeed(seedNumber);
    }
}

function initAudio() {
    audio = new Audio();
    audio.init();
    audio.load("https://onde.xyz/pbb");

    window.addEventListener('drop', (e) => {
        e.preventDefault();
        var files = e.dataTransfer.files
        if  (files.length > 0) {
            audio.loadFromLocal(files[0]);
        }
    }, false);
}