const typewriter = new Typewriter('#typewriter', {
    loop: true
}).typeString('我的世界，')
    .typeString('宣传新服')
    .pauseFor(1000)
    .deleteChars(4)
    .pauseFor(500)
    .typeString('一键开播')
    .pauseFor(1000)
    .deleteChars(4)
    .pauseFor(500)
    .typeString('配置简单')
    .pauseFor(1000)
    .deleteChars(4)
    .pauseFor(500)
    .typeString('天天满人')
    .pauseFor(1000)
    .deleteChars(4)
    .start();