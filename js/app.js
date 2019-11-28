const Application = function() {
  this.tuner = new Tuner();
  this.notes = new Notes('.notes', this.tuner);
  this.meter = new Meter('.meter');
  this.frequencyBars = new FrequencyBars('.frequency-bars');
};

Application.prototype.start = function() {
  const self = this;

  this.tuner.onNoteDetected = function(note) {
    if (self.notes.isAutoMode) {
      if (self.lastNote === note.name) {
        self.update(note);
      } else {
        self.lastNote = note.name;
      }
    }
  };

  swal.fire(
      'Start Tuning!'
  ).then(function() {
    self.tuner.init();
    self.frequencyData = new Uint8Array(self.tuner.analyser.frequencyBinCount);
    document.getElementsByClassName("notes")[0].style.display = "initial";
  });

  this.updateFrequencyBars();

  self.tuner.init();
  self.frequencyData = new Uint8Array(self.tuner.analyser.frequencyBinCount);

};

Application.prototype.updateFrequencyBars = function() {
  if (this.tuner.analyser) {
    this.tuner.analyser.getByteFrequencyData(this.frequencyData);
    this.frequencyBars.update(this.frequencyData)
  }
  requestAnimationFrame(this.updateFrequencyBars.bind(this))
};

Application.prototype.update = function(note) {
  this.notes.update(note);
  this.meter.update((note.cents / 50) * 45)
};

// noinspection JSUnusedGlobalSymbols
Application.prototype.toggleAutoMode = function() {
  this.notes.toggleAutoMode()
};

const app = new Application();
app.start();
