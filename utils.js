let audio;

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
