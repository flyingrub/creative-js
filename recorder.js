frames = [];
var recorder;

function exportVideo(e) {
  var blob = new Blob(frames);
  var vid = document.createElement('video');
  vid.id = 'recorded'
  vid.controls = true;
  vid.src = URL.createObjectURL(blob);
  document.body.appendChild(vid);
  vid.play();
}

function record() {
  let stream = document.querySelector('canvas').captureStream(30);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = e => {
    if (e.data.size) {
      frames.push(e.data);
    }
  };
  recorder.onstop = exportVideo;
  recorder.start();
}

function shouldEndRecord() {
  if(frameCount == framesNumber - 1) {
    if (recorder != null) {
      recorder.stop();
    }
  }
}