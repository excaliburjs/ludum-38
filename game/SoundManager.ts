class SoundManager {

   static init() {      
      SoundManager._updateMusicButton();
      SoundManager._updateMuteAllButton();

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
   }

   static stopBackgroundMusic() {   
      // stop bg music
      Resources.music.setLoop(false);
      Resources.music.stop();      
   }

   static muteBackgroundMusic() {
      Preferences.muteBackgroundMusic = true;

      // mute bg music
      Resources.music.setVolume(0);
      SoundManager._updateMusicButton();      
   }

   static unmuteBackgroundMusic() {
      Preferences.muteBackgroundMusic = false;

      // unmute bg music
      Resources.music.setVolume(Config.backgroundVolume);
      SoundManager._updateMusicButton();
   }

   static playPlayerSpotted(){
      Resources.playerSpottedSound.setVolume(Config.soundVolume);
      Resources.playerSpottedSound.play();
   }

   static playSpawnEnemy(){
      Resources.spawnEnemySound.setVolume(Config.soundVolume);
      Resources.spawnEnemySound.play();
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