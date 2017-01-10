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

    return {
        get: get,
        set: set,
        logout: logout
    };
})();
