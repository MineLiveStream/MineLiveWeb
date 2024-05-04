window.onload = function() {
    if (window.location.hash === "#login") {
        const loginDialog = document.getElementById('loginDialog');
        loginDialog.open = true;
    }
    typewriter.start();
    typewriter.typeString('我的世界，');
    startType().then(startType);
}
const typewriter = new Typewriter('#typewriter');
async function startType() {
    typewriter.typeString('宣传新服');
    typewriter.pauseFor(1000);
    typewriter.deleteChars(4);
    typewriter.pauseFor(500);
    typewriter.typeString('一键开播');
    typewriter.pauseFor(1000);
    typewriter.deleteChars(4);
    typewriter.pauseFor(500);
    typewriter.typeString('配置简单');
    typewriter.pauseFor(1000);
    typewriter.deleteChars(4);
    typewriter.pauseFor(500);
    typewriter.typeString('天天满人');
    typewriter.pauseFor(1000);
    typewriter.deleteChars(4);
}
