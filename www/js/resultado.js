var resultado = (function () {

    var urlSitio = "http://www.comunidadfusa.com";
    function init() {
        var resultado = window.localStorage.getItem("resultado");
        var audios = JSON.parse(resultado);
        console.log(audios);
        if (audios.length == 1) {
            mostrarGanador(audios);
        } else {
            mostrarEmpate(audios);
        }
    }

    function mostrarGanador(audios) {
        var ganador = audios[0];
        $("#resultadoPlayer01 a img").attr("src", urlSitio + ganador.avatar);
        $("#nombreGanador .nombreBandaGanadora a").text(ganador.nombreBanda);
        $("#nombreGanador .nombreBandaGanadora a").attr("href", urlSitio + "/bandas/" + ganador.url_fusa);
        $("#nombreGanador .nombreTema").text(ganador.nombreTema);
        ga_storage._trackEvent('resultado', 'ganador', 'banda', ganador.nombreBanda);
        ga_storage._trackEvent('resultado', 'ganador', 'cancion', ganador.nombreTema);
    }

    function mostrarEmpate(audios) {
        var local = audios[0];
        var visitante = audios[1];
        $("#resultadoPlayer01 a img").attr("src", urlSitio + local.avatar);
        $("#resultadoPlayer02 a img").attr("src", urlSitio + visitante.avatar);
        $("#nombreLocal .nombreBandaGanadora a").text(local.nombreBanda);
        $("#nombreVisitante .nombreBandaGanadora a").text(visitante.nombreBanda);
        $("#nombreLocal .nombreBandaGanadora a").attr("href", urlSitio + "/bandas/" + local.url_fusa);
        $("#nombreVisitante .nombreBandaGanadora a").attr("href", urlSitio + "/bandas/" + visitante.url_fusa);
        $("#nombreLocal .nombreTema").text(local.nombreTema);
        $("#nombreVisitante .nombreTema").text(visitante.nombreTema);
        
        ga_storage._trackEvent('resultado', 'empate', 'banda', local.nombreBanda);
        ga_storage._trackEvent('resultado', 'empate', 'cancion', local.nombreTema);
        ga_storage._trackEvent('resultado', 'empate', 'banda', visitante.nombreBanda);
        ga_storage._trackEvent('resultado', 'empate', 'cancion', visitante.nombreTema);
    }

    return {
        init: init
    };
})();
