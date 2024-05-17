function isMobile() {
    const mobileUserAgentFragments = [
        'Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'IEMobile', 'Opera Mini'
    ];
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    for (let i = 0; i < mobileUserAgentFragments.length; i++) {
        if (userAgent.indexOf(mobileUserAgentFragments[i]) > -1) {
            return true;
        }
    }
    return false;
}