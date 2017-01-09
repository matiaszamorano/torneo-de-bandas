var opcionesGanadorTorneo = (function() {

    function cargarListasReproduccion() {
        comunidadfusa.service.listasReproduccion.getListasDeUsuario({
            idUsuario: idUsuario,
            success: function(data) {
                if (data.length == 0) {
                    data.push({id: null, nombre: "Sin listas de reproducción"});
                }
                $('#lista-de-reproduccion-template').tmpl(data).appendTo(".listas-reproduccion");
                agregarComportamientoLista();
            }
        });
    }

    function agregarComportamientoLista() {
        $(".listas-reproduccion").on("click", "li", function() {
            var $this = $(this);
            var id_lista = $this.attr("data-id");
            var id_audio = $this.parent().attr("audio_id");
            if (!id_lista) {
                return false;
            }
            comunidadfusa.service.listasReproduccion.agregarAudioAListaReproduccion({
                data: {
                    "id": id_lista,
                    "audio_id": id_audio
                },
                success: function(data) {
                    mostrarOcultarMensaje("Agregaste el tema correctamente en tu lista de reproducción!", id_audio);
                },
                error: function(data) {
                    mostrarOcultarMensaje("Ocurrió un error al agregar el tema en tu lista de reproducción", id_audio);
                }
            });
            return false;
        });
    }

    function mostrarOcultarMensaje(mensaje, id_audio) {
        var selector = "#ganador-opciones-mensajes_" + id_audio;
        $(selector).empty();
        $('#mensaje-lista-template').tmpl({mensaje: mensaje}).appendTo(selector);
        $(selector).slideDown("fast");
        setTimeout(function() {
            $(selector).slideUp("fast");
        }, 5000);
    }


    function init() {
        cargarListasReproduccion();
    }

    return {
        init: init
    };
})();
