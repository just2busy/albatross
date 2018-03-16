function startApp() {
    addRoutes();
    addKeyEvents();
}

function addRoutes() {
    window.router.addRoute('mainMenu', MainMenu.initialize, true);
    window.router.addRoute('selectPackage', SelectPackage.initialize, true);
    window.router.addRoute('setPreferences', Preferences.initialize, true);
    window.router.addRoute('gameMode', GameMode.initialize, false, CanvasRenderer.destroy);
    window.router.addRoute('game', GameController.initialize, false, GameController.destroy);
    window.router.addRoute('advanceGame', GameController.advanceGame, false, CanvasRenderer.destroy);
    window.router.addRoute('resumeGame', GameController.resumeGame, false, CanvasRenderer.destroy);
    window.router.addRoute('restartGame', GameController.restartGame, false, CanvasRenderer.destroy);
    window.router.addRoute('pauseGame', GameModal.pauseGame, false, CanvasRenderer.destroy);
    window.router.addRoute('scoreGame', GameModal.scoreGame, false, CanvasRenderer.destroy);
    window.router.getRoute('mainMenu')();
}

function addKeyEvents() {
    GameController.addKeyEvents();
}