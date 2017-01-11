var torneoBandas = (function () {
    var audios = [];
    var partido = null;
    var segundos = 1;
    var intervalo;
    var recarga;
    var autoplay;

    function getAudiosPartido(options) {
        var url = baseURILayout + "/servicios/juegos/torneo-de-bandas/audios";
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

    function jugar($boton) {
        mostrarCargando();
        timerDescendiente();
//        $boton.hide();
        $("#btVerPosiciones").hide();
        $("#escuchaUno img").css("visibility", "visible");
        ejecutarPlay("player01", "play");
        $("#player01").addClass("playerActivo");
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
                jugar();
            },
            swfPath: jPlayerSwfPath,
            play: function (event) {
                $(this).jPlayer("pauseOthers");
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
                        $("#nextPlayer1").show();
                        ocultarCargando();
                        tiempoMinimoJugadorUno = false;

                    }
                    if ((jugador == "player02") && tiempoMinimoJugadorDos) {
                        mostrarCargando();
                        $("#clock-ticker").hide();
                        $("#playPlayer2").hide();
                        $("#stopPlayer2").show();
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
    }

    function ejecutarPausar(nroPlayer) {
        $("#reloadPlayer" + nroPlayer).show();
        $("#pausePlayer" + nroPlayer).hide();
        $("#reproductorPlayer0" + nroPlayer).jPlayer("pause");
    }

    function ejecutarPlay(playerId, orden) {
        var $player = $("#" + playerId + " .torneo-bandas-audio-player");
        $player.jPlayer(orden);
    }

    function ejecutarNext() {
        $("#escuchaUno img").hide();
        $("#escuchaDos img").css("display", "block");
        timerDescendiente();
        $("#reproductorPlayer01").jPlayer("stop");
        ejecutarPlay("player02", "play");
        $("#player01").removeClass("playerActivo");
        $("#player02").addClass("playerActivo");
        $("#nextPlayer1").hide();
    }

    function ejecutarStop() {
        $("#player02").removeClass("playerActivo");
        $("#reproductorPlayer02").jPlayer("stop");
        $("#escuchaDos").hide();
        $("#stopPlayer2").hide();
        $("#elegirResultado").css("display", "block");
        $(".btReload").show();
        $("#elegiGanador img").css("display", "block");
    }

    function inicializarResultados() {
        var data = {
            id_local: audios[0].id,
            id_visitante: audios[1].id,
            partido: partido
        };
        $(".resultadoPartido").live("click", function () {
            data.resultado = $(this).attr("data-resultado");
            guardarResultadoPartido({
                data: data,
                beforeSend: mostrarCargando(),
                success: function (data) {
                    $("#contenidoDelTorneo").empty();
                    $("#contenidoDelTorneo").html(data);
                    ocultarCargando();
                }
            });
            return false;
        });
    }

    function init(ap) {
        autoplay = ap * 1;
        obtenerAudios();
    }

    return {
        init: init
    };
})();
