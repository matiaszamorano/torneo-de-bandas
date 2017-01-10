login = (function () {

    function init() {
        initForm();
        $(".fusa-js-desplegar-menu").remove();
        $(".fusa-js-menu-usuario").remove();
        $("footer").remove();
        $("a.navbar-brand").attr("href", "#");
        $("a.navbar-brand").removeAttr("rel");
    }

    function initForm() {
        $("#login").on("submit", "#form_login", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $form = $(this);
            var email = $form.find("#form_email").val().trim();
            var clave = $form.find("#form_clave").val().trim();
            limpiarError();
            if ((email === "") || (clave === "")) {
                mostrarError("Ingresa un email y clave");
                return;
            }
            var url = torneoDeBandas.service.baseURI + "/app/login";
            var data = {
                "email": email,
                "clave": clave
            };

            torneoDeBandas.service.post(url, data)
                    .done(function (data) {
                        torneoDeBandas.service.usuario.set(data["usuario"]);
                        window.location = "index.html";
                    })
                    .fail(function (error) {
                        $("#spin").addClass("hide");
                        console.log(error);
                    });
            $("#spin").removeClass("hide");
        });
    }


    function limpiarError() {
        mostrarError("");
        var $error = $("#login_error");
        $error.addClass("hide");
    }

    function mostrarError(mensaje) {
        var $error = $("#login_error");
        var $li = $error.find(".login .error_list");
        $li.text(mensaje);
        $error.removeClass("hide");
    }

    return {
        init: init
    };

})();