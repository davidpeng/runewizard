(function () {
    Sounds = {
        selectionChanged: loadSound('selectionChanged'),
        selected: loadSound('selected'),
        pageChanged: loadSound('pageChanged'),
        eliminated: loadSound('eliminated'),
        gravitated: loadSound('gravitated'),
        attacking: loadSound('attacking'),
        attacked: loadSound('attacked'),
        fallen: loadSound('fallen'),
        elevationChanged: loadSound('elevationChanged'),
        transformed: loadSound('transformed'),
        shielded: loadSound('shielded')
    };
    
    function loadSound(fileName) {
        return new Howl({
            urls: ['sounds/' + fileName + '.ogg', 'sounds/' + fileName + '.mp3']
        });
    }
})();