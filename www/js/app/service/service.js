torneoDeBandas.service = (function () {
    var BASE_URI = url_fusa_home + "/servicios";
    var BASE_URI_TORNEO = BASE_URI + "/juegos/torneo-de-bandas";

    function get(uri) {
        return $.get(uri);
    }

    function post(uri, data) {
        return $.post(uri, data);
    }

    function put(uri, data) {
        return $.ajax({
            contentType: 'application/json; charset=UTF-8',
            url: uri,
            type: 'PUT',
            data: data,
            dataType: 'json'
        });
    }

    function eliminar(uri, data) {
        return $.ajax({
            contentType: 'application/json; charset=UTF-8',
            url: uri,
            data: data,
            type: 'DELETE'
        });
    }

    return {
        baseURI: BASE_URI,
        baseURITorneo: BASE_URI_TORNEO,
        get: get,
        post: post
    };
})();
