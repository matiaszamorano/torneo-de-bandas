var torneoBandas = (function () {
    var audios = [];
    var partido = null;
    var segundos = 15;
    var intervalo;
    var recarga;
    var autoplay;
    var partidoFinalizado;

    function getAudiosPartido(options) {
        var url = baseURILayout + "/servicios/juegos/torneo-de-bandas/audios";
        if (torneoDeBandas.service.usuario.estaLogueado()) {
            url += "?id_usuario=" + torneoDeBandas.service.usuario.get().id + "&mobile=1"
        }
        $.ajax({
            type: "GET",
            dataType: "json",
            url: url,
            cache: false,
            beforeSend: options.beforeSend,
            success: options.success
        });
    }

    function guardarResultadoPartido(options) {
        var url = baseURILayout + "/servicios/juegos/torneo-de-bandas/partido/resultado";

        $.ajax({
            type: "POST",
            dataType: "html",
            data: options.data,
            url: url,
            beforeSend: options.beforeSend,
            success: options.success
        });
    }

    function mostrarCargando(url) {
        $('div#cargando').show();
    }

    function ocultarCargando() {
        $('div#cargando').hide();
    }
    function obtenerAudios() {
        getAudiosPartido({
            beforeSend: mostrarCargando(),
            success: function (data) {
                audios = data.audios;
                partido = data.partido;
                $('#player01').attr('data-id', data.audios[0].id);
                $('#player02').attr('data-id', data.audios[1].id);
                inicializarReproductores();
                inicializarPasosDelJuego();
                inicializarResultados();

                ocultarCargando();
            }
        });
    }

    function inicializarPasosDelJuego() {

        $("#partido-opciones").on("click", "#btJugar", function () {
            jugar($(this));
            return false;
        });
    }

    function jugar() {
        ga_storage._trackEvent('partido', 'reproduciendo', 'player', 1);
        mostrarCargando();
        $("#btVerPosiciones").hide();
        $(".jugador1 .notas-musicales img").css("visibility", "visible");
        ejecutarPlay("player01", "play");
        temaActivo = 1;
        ocultarCargando();
    }

    function timerDescendiente() {
        var theSecsBox = $("#numsecs");
        $('.flip-top').html(segundos);
        $("#clock-ticker").show();
        clearInterval(intervalo);
        intervalo = setInterval(function () {
            var currentSeconds = theSecsBox.text();
            if (currentSeconds == 0) {
                clearInterval(intervalo);
            } else {
                theSecsBox.html(currentSeconds - 1);
            }
        }, 1000);
    }

    function inicializarReproductores() {

        var tiempoMinimoJugadorUno = true;
        var tiempoMinimoJugadorDos = true;

        $("#nextPlayer1").live("click", function () {
            ejecutarNext();
            return false;
        });

        $("#stopPlayer2").live("click", function () {
            ejecutarStop();
            return false;
        });



        $(".torneo-bandas-audio-player").jPlayer({
            ready: function () {
                var id = $(this).parent(".jugador").attr("data-id");
                $(this).jPlayer("setMedia", {
                    mp3: path_audios + "/" + id
                });
                if (autoplay) {
                    $("#btJugar").click();
                }
                if ($(this).data("jugar") == 1) {
                    jugar();
                }
            },
            swfPath: jPlayerSwfPath,
            play: function (event) {
                $(this).jPlayer("pauseOthers");
            },
            playing: function (event) {
                if (!partidoFinalizado) {
                    timerDescendiente();
                }
            },
            timeupdate: function (event) {
                if (recarga) {
                    return;
                }
                var jugador = $(this).parent(".jugador").attr("id");
                if (event.jPlayer.status.currentTime >= segundos) {
                    if ((jugador == "player01") && tiempoMinimoJugadorUno) {
                        mostrarCargando();
                        $("#clock-ticker").hide();
                        $("#playPlayer1").hide();
                        $("#nextPlayer1").css("visibility", "visible");
                        ocultarCargando();
                        tiempoMinimoJugadorUno = false;

                    }
                    if ((jugador == "player02") && tiempoMinimoJugadorDos) {
                        mostrarCargando();
                        $("#clock-ticker").hide();
                        $("#playPlayer2").hide();
                        $("#stopPlayer2").css("visibility", "visible");
                        ocultarCargando();
                        tiempoMinimoJugadorDos = true;

                    }

                }
            },
            ended: function () {
                if (recarga) {
                    $(".btReload").show();
                    $(".btPause").hide();
                }
            },
            preload: "auto",
            volume: "1",
            solution: "html, flash"
        });

        $("#reloadPlayer1").live("click", function () {
            ejecutarRecargar(1);
            return false;
        });

        $("#reloadPlayer2").live("click", function () {
            ejecutarRecargar(2);
            return false;
        });

        $("#pausePlayer1").live("click", function () {
            ejecutarPausar(1);
            return false;
        });

        $("#pausePlayer2").live("click", function () {
            ejecutarPausar(2);
            return false;
        });
    }

    function ejecutarRecargar(nroPlayer) {
        recarga = true;
        $(".btReload").show();
        $(".btPause").hide();
        $("#reloadPlayer" + nroPlayer).hide();
        $("#pausePlayer" + nroPlayer).show();
        ejecutarPlay("player0" + nroPlayer, "play");
        ga_storage._trackEvent('partido', 'recargar', 'player', nroPlayer);
    }

    function ejecutarPausar(nroPlayer) {
        $("#reloadPlayer" + nroPlayer).show();
        $("#pausePlayer" + nroPlayer).hide();
        $("#reproductorPlayer0" + nroPlayer).jPlayer("pause");
        ga_storage._trackEvent('partido', 'pausar', 'player', nroPlayer);
    }

    function ejecutarPlay(playerId, orden) {
        var $player = $("#" + playerId + " .torneo-bandas-audio-player");
        $player.jPlayer(orden);
    }

    function ejecutarNext() {
        $("#escuchaUno img").hide();
        $("#escuchaDos img").css("display", "block");
        $(".jugador1 .notas-musicales img").css("visibility", "hidden");
        $(".jugador2 .notas-musicales img").css("visibility", "visible");
        $("#reproductorPlayer01").jPlayer("stop");
        ejecutarPlay("player02", "play");
        $("#nextPlayer1").hide();
        ga_storage._trackEvent('partido', 'reproduciendo', 'player', 2);
    }

    function ejecutarStop() {
        partidoFinalizado = true;
        $("#reproductorPlayer02").jPlayer("stop");
        $("#escuchaDos").hide();
        $("#escucha").hide();
        $("#stopPlayer2").hide();
        $(".notas-musicales img").css("visibility", "hidden");
        $(".resultadoPartido").show();
        $(".btReload").show();
        $("#elegiGanador img").css("display", "block");
        ga_storage._trackEvent('partido', 'reproduciendo', 'stop', 1);
    }

    function inicializarResultados() {
        var data = {
            id_local: audios[0].id,
            id_visitante: audios[1].id,
            partido: partido,
            mobile: true
        };
        $(".resultadoPartido").live("click", function () {
            data.resultado = $(this).attr("data-resultado");
            ga_storage._trackEvent('partido', 'resultado', 'ganador', data.resultado);
            guardarResultadoPartido({
                data: data,
                beforeSend: mostrarCargando(),
                success: function (data) {
                    window.localStorage.setItem("resultado", data);
                    var audios = JSON.parse(data);
                    if (audios.length == 1) {
                        // ganó uno
                        window.location = "ganador.html";
                    } else {
                        //empate
                        window.location = "empate.html";
                    }
                    ocultarCargando();
                }
            });
            return false;
        });
    }

    function init(ap) {
        partidoFinalizado = false;
        window.localStorage.setItem("resultado", "");
        autoplay = ap * 1;
        obtenerAudios();
    }

    return {
        init: init
    };
})();
