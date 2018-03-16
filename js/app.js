function startApp() {
    addRoutes();
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
    window.router.addRoute('pauseGame', PauseGame.pauseGame, false, CanvasRenderer.destroy);
    window.router.addRoute('scoreGame', PauseGame.scoreGame, false, CanvasRenderer.destroy);
    window.router.getRoute('mainMenu')();
}