window.onload = function() {
    replaceTextAndAddClass();
}

function replaceTextAndAddClass() {
    const h2Element = document.getElementById('text');
    const words = ['宣传新服', '一键开播', '配置简单', '天天满人'];
    let text = h2Element.textContent;
    let cut = true;
    let world = "";
    let index = 0;
    setInterval(() => {
        if (text.length === 5) {
            cut = false;
            index++;
            if (index > words.length) index = 0;
            world = words[index];
        } else if (text.length === 9) {
            cut = true;
        }
        if (cut) {
            text = text.slice(0, -1);
            h2Element.textContent = text;
        } else {
            text += world[text.length - 5];
            h2Element.textContent = text;
        }
    }, 200);
}