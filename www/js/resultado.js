var resultado = (function () {
    function init() {
        var resultado = window.localStorage.getItem("resultado");
        var audios = JSON.parse(resultado);
        if (audios.length == 1) {
            console.log("gano uno");
        } else {
            console.log("empate");
        }
    }

    return {
        init: init
    };
})();
