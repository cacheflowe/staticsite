class StaticSite {

  constructor() {
    DOMUtil.addLoadedClass();
    requestAnimationFrame(() => this.init());
  }

  hasWebGL() {
    var canvas = document.createElement( 'canvas' ); return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );
  }

  init() {
    // init app store
    this.appStore = new AppStore();
    this.appStore.addListener(this);
    this.appStore.addListener(this, Constants.CUR_SCREEN);
    this.appStoreDebug = new AppStoreDebug();

    // init sound
    this.sounds = new Sounds();
    let playMp3 = true;
    let audioDebug = true;
    if(playMp3) {
      this.sounds.playSoundtrack();
      this.soundFFT = new SoundFFT(Howler.ctx, this.sounds.getSound(Sounds.audioFiles.MENU_LOOP)._sounds[0]._node);
      this.soundFFT.setDebug(audioDebug);
    } else {
      this.microphoneNode = new MicrophoneNode(Howler.ctx, (inputNode) => {
        this.soundFFT = new SoundFFT(Howler.ctx, inputNode);
        this.soundFFT.setDebug(audioDebug);
      });
    }

    // init graphics renderer
    this.threeScene = new ThreeScene(document.getElementById('three-scene'), 0x111111);
    _store.set(Constants.THREE_SCENE, this.threeScene.scene);
    _store.set(Constants.DEVICE_PIXEL_RATIO, window.devicePixelRatio);
    this.buildStats();

    // init 3d objects
    _store.set(Constants.AUDIO_VIZ_CONTAINER, new THREE.Object3D());
    this.threeScene.scene.add(_store.get(Constants.AUDIO_VIZ_CONTAINER));
    this.audioParticles = new AudioParticles();
    this.audioWaveforms = new AudioWaveforms();
    this.threeEnvironment = new ThreeEnvironment();

    // init cur screen state
    _store.set(Constants.CUR_SCREEN, Constants.HOME_SCREEN);

    // init browser interface & helpers
    this.initMobile();
    window.addEventListener('resize', () => this.resizeDebounced());

    // start raf
    this.prevTime = 0;
    requestAnimationFrame(() => this.animate());
  }

  initMobile() {
    MobileUtil.enablePseudoStyles();
    MobileUtil.setDeviceInputClass();
    MobileUtil.lockTouchScreen(true);
    if(MobileUtil.isIOS()) document.body.classList.add('ios');
    window.addEventListener('scroll', () => window.scrollTo(0,0));
  }

  buildStats() {
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( this.stats.dom );
  }

  // STORE/EVENTS ---------------------

  storeUpdated(key, value) {
    // console.log('????', key);
    if(key == StaticSite.SET_CUR_PATH) page(value);
    if(key == Constants.LOADING) {
      if(value == true) document.body.classList.add('loading');
      if(value == false) document.body.classList.remove('loading');
    }
  }

  // "ROUTES" --------------------

  CUR_SCREEN(section) {
    console.log('CUR_SCREEN', section);
  }

  // ANIMATE -----------------------

  animate() {
    this.perfStart();
    this.updateFFT();
    _store.set(Constants.FRAME_COUNT, _store.get(Constants.FRAME_COUNT) + 1 || 1);
    _store.set(Constants.ANIMATION_FRAME, true);
    requestAnimationFrame(() => this.animate());  // if(_store.get(Constants.FRAME_COUNT) < 600)
    this.threeScene.update();
    this.perfEnd();
  }

  updateFFT() {
    if(this.soundFFT) {
      this.soundFFT.update();
      if(this.soundFFT.getDetectedBeat()) _store.set(SoundFFT.BEAT, _store.get(SoundFFT.BEAT) + 1 || 1);
      _store.set(SoundFFT.FREQUENCIES, this.soundFFT.getSpectrum());
      _store.set(SoundFFT.WAVEFORM, this.soundFFT.getWaveform());
    }
  }

  perfStart() {
    if(!this.fpsEased) this.fpsEased = new EasingFloat(60, 15);
    if(this.stats) this.stats.begin();
  }

  perfEnd() {
    if(this.stats) this.stats.end();
    this.time = ( performance || Date ).now();
    this.fpsEased.setTarget(1000 / (this.time - this.prevTime));
    this.fpsEased.update();
    _store.set(Constants.FPS, this.fpsEased.value());
    _store.set(Constants.ANIM_ADJUST, 60/_store.get(Constants.FPS));
    this.prevTime = this.time;
  }

  // RESIZE -----------------------

  resizeDebounced(e) {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => this.resize(), 50);
  }

  resize() {
    this.threeScene.resize();
    _store.set(Constants.RESIZE, true);
  }

}

StaticSite.SET_CUR_PATH = 'SET_CUR_PATH';

window.app = new StaticSite();
