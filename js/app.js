function startApp() {
    window.router.addRoute('mainMenu', MainMenu.initialize, true);
    window.router.addRoute('selectPackage', SelectPackage.initialize, true);
    window.router.addRoute('gameMode', GameMode.initialize, false, AppGI.destroy);
    window.router.addRoute('game', GameController.initialize, false, GameController.destroy);
    window.router.addRoute('advanceGame', GameController.advanceGame, false, AppGI.destroy);
    window.router.addRoute('resumeGame', GameController.resumeGame, false, AppGI.destroy);
    window.router.addRoute('restartGame', GameController.restartGame, false, AppGI.destroy);
    window.router.addRoute('pauseGame', PauseGame.pauseGame, false, AppGI.destroy);
    window.router.addRoute('scoreGame', PauseGame.scoreGame, false, AppGI.destroy);
    window.router.getRoute('mainMenu')();
}