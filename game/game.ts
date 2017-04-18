/// <reference path="../bower_components/excalibur/dist/excalibur.d.ts" />

var game = new ex.Engine({
    width: 800,
    height: 600
});

// create an asset loader
var loader = new ex.Loader();
var resources = {

    /* include resources here */
    //txPlayer: new ex.Texture("assets/tex/player.png")

};

// queue resources for loading
for (var r in resources) {
    loader.addResource(resources[r]);
}

// uncomment loader after adding resources
game.start(/* loader */).then(() => {

    // start your game!

});