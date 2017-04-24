class SoundManager {

   static init() {      
      if (Preferences.muteBackgroundMusic) {
         SoundManager.muteBackgroundMusic();
      }
      if (Preferences.muteAll) {
         SoundManager.muteAll();
      }

      $('#mute-music').on('click', () => {
         if (Preferences.muteBackgroundMusic) {
            SoundManager.unmuteBackgroundMusic();
         } else {
            SoundManager.muteBackgroundMusic();
         }
         savePreferences();
         return false;
      })

      $('#mute-all').on('click', () => {
         if (Preferences.muteAll) {
            SoundManager.unmuteAll();
         } else {
            SoundManager.muteAll();
         }
         savePreferences();
         return false;
      })
   }

   static muteAll() {
      Preferences.muteAll = true;
      Preferences.muteBackgroundMusic = true;

      for (var r in Resources) {
         let snd = Resources[r]
         if (snd instanceof ex.Sound) {            
            snd.setVolume(0);
         }
      }
      SoundManager.muteBackgroundMusic();
      SoundManager._updateMuteAllButton();
   }

   static unmuteAll() {
      Preferences.muteAll = false;
      Preferences.muteBackgroundMusic = false;      

      for (var r in Resources) {
         let snd = Resources[r]
         if (snd instanceof ex.Sound) {    
            snd.setVolume(Config.soundVolume);
            
         }
      }
      SoundManager.unmuteBackgroundMusic();
      SoundManager._updateMuteAllButton();
   }

   static startBackgroundMusic() {
      // start bg music
      Resources.music.setVolume(Preferences.muteBackgroundMusic ? 0 : Config.backgroundVolume);
      Resources.music.setLoop(true);
      Resources.music.play();

      Resources.ominousMusic.setVolume(0);
      Resources.ominousMusic.setLoop(true);
      Resources.ominousMusic.play();
   }

   static stopBackgroundMusic() {   
      // stop bg music
      Resources.music.setLoop(false);
      Resources.music.stop();   
      Resources.ominousMusic.setLoop(false);
      Resources.ominousMusic.stop();       
   }

   static muteBackgroundMusic() {
      Preferences.muteBackgroundMusic = true;

      // mute bg music
      Resources.music.setVolume(0);
      Resources.ominousMusic.setVolume(0);
      SoundManager._updateMusicButton();      
   }

   static unmuteBackgroundMusic() {
      Preferences.muteBackgroundMusic = false;

      // unmute bg music
      Resources.music.setVolume(Config.backgroundVolume);
      Resources.ominousMusic.setVolume(0);
      SoundManager._updateMusicButton();
   }

   static playPlayerSpotted(){
      Resources.playerSpottedSound.play();
   }

   static playSpawnEnemy(){
      Resources.spawnEnemySound.play();
   }

   static playSpawnFood(){
      Resources.spawnFoodSound.play();
   }

   static _playingEnemyCheckoutSequence = false;
   static playEnemyCheckout() {
      if (SoundManager._playingEnemyCheckoutSequence) return;
      SoundManager._playingEnemyCheckoutSequence = true;
      var times = gameRandom.integer(1, Config.foodSpawnCount);
      var wait = 200;
      
      // temporarily dampen sounds
      // TODO player checkout should restore values
      SoundManager.dampenCheckoutSounds();
   
      for (let i = 0; i < times; i++) {
         setTimeout(() => !State.gameOver && Resources.checkoutSound.play(), i * wait);
      }

      setTimeout(() => {
         if (State.gameOver) {
            SoundManager._afterEnemyCheckout();
            return;
         }
         Resources.registerSound.play().then(SoundManager._afterEnemyCheckout);
      }, wait * times + 300);
   }

   private static _afterEnemyCheckout() {
      SoundManager._playingEnemyCheckoutSequence = false;
      SoundManager.restoreCheckoutSounds();
   }

   static playPlayerCheckout() {

      // restore checkout sounds in case enemy just checked out
      SoundManager.restoreCheckoutSounds();      
   }

   static updateDynamicEnemyPlayerMusic() {
      if (Preferences.muteBackgroundMusic || State.gameOver) return;

      // Find all enemies currently chasing player
      const chasingEnemies = scnMain.enemies.filter(e => e.isAttacking);
      const thresholdDistance = Config.enemyChaseMusicRadius;
      var closestDistance: number = thresholdDistance;

      for (var e of chasingEnemies) {
         var playerVector = player.pos.sub(e.pos);
         if (closestDistance && playerVector.magnitude() < closestDistance) {
            closestDistance = playerVector.magnitude();
         } else if (!closestDistance) {
            closestDistance = playerVector.magnitude();
         }
      }

      // Clamp to threshold
      closestDistance = Math.min(closestDistance, thresholdDistance);

      // Use closest vector as scale variable for music volume
      const closeFactor = (closestDistance / thresholdDistance) * Config.backgroundVolume;
      
      // set volume to scale
      Resources.music.setVolume(closeFactor);
      Resources.ominousMusic.setVolume(Config.backgroundVolume - closeFactor);
      
   }

   private static dampenCheckoutSounds() {
      if (!Preferences.muteAll) {
         Resources.checkoutSound.setVolume(Config.soundVolume * 0.6);
         Resources.registerSound.setVolume(Config.soundVolume * 0.6);
      }
   }

   private static restoreCheckoutSounds() {
      if (!Preferences.muteAll) {
         Resources.checkoutSound.setVolume(Config.soundVolume);
         Resources.registerSound.setVolume(Config.soundVolume);
      }
   }

   private static _updateMusicButton() {
      $('#mute-music i').get(0).className = classNames('fa', { 
         'fa-music': !Preferences.muteBackgroundMusic, 
         'fa-play': Preferences.muteBackgroundMusic 
      });
   }

   private static _updateMuteAllButton() {
      $('#mute-all i').get(0).className = classNames('fa', { 
         'fa-volume-up': !Preferences.muteAll, 
         'fa-volume-off': Preferences.muteAll 
      });
   }
}