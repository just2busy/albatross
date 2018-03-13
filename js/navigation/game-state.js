var GameState = (function() {
    return {
        containerId: 'container',
        containerWidth: 700,
        containerHeight: 300,
        package: null,
        gameOver: false,
        difficulty: { name: 'easy',
            blur_size: 3,
            lap_thres: 1,
            eigen_thres: 1,
            match_threshold: 40,
            number_points: 2000
        },
        gameMode: null,
        randomize: false,
        maxPages: null,
        paused: false,
        preferences: {
            font: 'Comic Sans MS',
            fontColor: 'rgba(255,0,0,1)'
        },

        setOption: function(option, value) {
            switch(option) {
                case 'gameMode': this.gameMode = value; break;
                case 'randomize': this.randomize = value; break;
                case 'difficulty': this.difficulty = value; break;
                case 'maxPages': this.maxPages = value; break;
            }
        },

        getOption: function(property) {
            switch(property) {
                case 'gameMode': return this.gameMode;
                case 'randomize': return this.randomize;
                case 'difficulty': return this.difficulty;
                case 'maxPages': return this.maxPages;
            }
        },

        resetState: function() {
            this.package = null;
            this.gameMode = null;
            this.randomize = false;
            this.maxPages = null;
            this.paused = false;
        },

        validate: function() {
            var validationMessages = [];
            if (!this.package) {
                validationMessages.push('No package was selected');
            }
            if (!this.gameMode) {
                validationMessages.push('No game mode was selected');
            }
            if (!this.difficulty) {
                validationMessages.push('No game difficulty was selected');
            }
            return validationMessages;
        }
    }
});

(function() {
    window.gameState = new GameState();
})();