torneoDeBandas.service.usuario = (function () {
    var usuario;
    var storage = window.localStorage;

    function get() {
        usuario = JSON.parse(storage.getItem("fusa-usuario"));
        return usuario;
    }

    function set(fusaUsuario) {
        storage.setItem("fusa-usuario", JSON.stringify(fusaUsuario));
        usuario = fusaUsuario;
    }

    function logout() {
        storage.removeItem("fusa-usuario");
    }

    function estaLogueado() {
        if (get())
            return true;
        else
            return false;
    }
    
    function getPuntaje() {
        console.log("Falta puntaje del jugador");
    }

    return {
        get: get,
        set: set,
        logout: logout,
        estaLogueado: estaLogueado,
        getPuntaje: getPuntaje
    };
})();
