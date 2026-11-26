<?php
/*
  session_reset();
  session_unset();
  session_start();
  $_SESSION = [];
 * 
 */

session_destroy();
$_SESSION = [];

/* inicia nova sessão */
session_start();

$_SESSION["web"] = 1;
session_write_close();
$lweb = 1;
require_once './inc/config.php';
require_once './inc/versao.php';
$cimp = '';
if (isset($_REQUEST["IMP"])) {
    $cimp = strtoupper($_REQUEST["IMP"]);
    $db = mysqli_connect($server, $user, $password, $database, $port);
    if (mysqli_connect_error()) {
        die(mysqli_connect_error());
    }

    $oimp = mysqli_fetch_array(mysqli_query($db, "select * from IMP_CFG_WEB WHERE NOME='" . $cimp . "' AND ATIVO='Y'"));
    if (!$oimp) {
        die("<h2>Impressora <strong>'" . $cimp . "'</strong> não configurada </h2>");
    }
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Vendas</title>
        <meta charset="utf-8" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

        <!-- CSP do Cordova é bem permissivo. Para browser funciona, mas considere restringir depois -->
        <meta http-equiv="Content-Security-Policy"
              content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;
              style-src * 'unsafe-inline';
              script-src * 'unsafe-inline' 'unsafe-eval';
              img-src * data: blob: 'unsafe-inline';
              connect-src *;
              frame-src *;">
        <meta http-equiv="Content-Security-Policy" content="default-src *  'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; script-src * 'unsafe-inline' 'unsafe-eval'; img-src * data: 'unsafe-inline'; connect-src *  'unsafe-inline' 'unsafe-eval'; frame-src *;">

        <link rel="stylesheet" href="assets/components/bootstrap/css/bootstrap.min.css">
        <link rel="stylesheet" href="assets/components/bootstrap/css/font-awesome.min.css">
        <link rel="stylesheet" href="assets/components/bootstrap/fonts/all.css">
        <link rel="stylesheet" href="css/cec.css?v=<?php echo filemtime('css/cec.css'); ?>">
        <link rel="stylesheet" href="css/cec-modern.css?v=<?php echo filemtime('css/cec-modern.css'); ?>">
        <link rel="icon" href="img/favicon.svg" type="image/svg+xml">

        <!-- ✅ REMOVIDO: cordova.js (não existe no browser) -->
        <!-- <script type="text/javascript" src="cordova.js"></script> -->

        <!-- ✅ Shim para rodar no browser (simula Cordova deviceready + dialogs) -->
        <script>
            (function () {
                // 1) Simula "deviceready" no browser para não quebrar index.js
                document.addEventListener("DOMContentLoaded", function () {
                    // Se algum código estiver esperando deviceready, disparamos
                    setTimeout(function () {
                        document.dispatchEvent(new Event("deviceready"));
                    }, 0);
                });

                // 2) Fallback do navigator.notification.prompt (Cordova dialogs)
                if (!window.navigator)
                    window.navigator = {};
                if (!navigator.notification)
                    navigator.notification = {};
                if (typeof navigator.notification.prompt !== "function") {
                    navigator.notification.prompt = function (message, callback, title, buttonLabels, defaultText) {
                        var input = window.prompt((title ? title + "\n\n" : "") + message, defaultText || "");
                        // no Cordova: results = { buttonIndex: 1..N, input1: "..." }
                        callback({buttonIndex: 1, input1: input});
                    };
                }
            })();
        </script>
        <?php
        $ajs = array();
        $ajs[] = "js/translate.js";
        $ajs[] = "js/index.js";
        echo "";
        foreach ($ajs as $value) {
            echo '         <script src="' . $value . "?v=" . filemtime($value) . '"></script>' . "\n";
        }
        ?>



        <!-- jQuery/Bootstrap locais -->
        <script src="assets/components/jquery/jquery.min.js"></script>
        <script src="assets/components/jquery-mask/jquery.mask.min.js"></script>
        <script src="assets/components/bootstrap/js/bootstrap.min.js"></script>
        <script src="assets/components/bootbox/mybootbox.js"></script>
        <script src="js/gets.js"></script>


        <style>
            .form-cli {
                font-size: 1em;
            }
            .tabprod  {
                font-size: 1em;
            }
            /* Regras essenciais do login mantidas aqui para evitar CSS antigo em cache. */
            #deviceready .event.received {
                color: #243447 !important;
                background: #ffffff !important;
            }
            #btenviar,
            #btenviar:hover,
            #btenviar:focus,
            #btenviar:active {
                color: #ffffff !important;
                background: #1769aa !important;
                border-color: #0d4778 !important;
            }
            #btenviar span,
            #btenviar .glyphicon {
                color: #ffffff !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
        </style>
        <script>
<?php
echo "curl = '" . $curl . "';";
echo "nempresa = '" . $nempresa . "';";
echo "cversao = '" . $cversao . "';";
echo "ccomp = '" . $ccomp . "';";
echo "ncliente_def = '" . $ncliente_def . "';";
?>
        </script>
    </head>

    <body>
        <div class="container">
            <div class="app">
                <div id="deviceready" class="blink">
                    <p class="event listening">Connecting to Device</p>
                    <div class="event received">
                        <form onsubmit="VendasLogin();return false" autocomplete="off">
                            <div class="row">
                                <div class="col-xs-2">
                                    <img src="img/portuguese.png" class="form-cli" height="30" onclick="MudaIdioma(1)" />
                                </div>
                                <div class="col-xs-2">
                                    <img src="img/spanish.png" class="form-cli" height="30" onclick="MudaIdioma(2)" />
                                </div>
                                <div class="col-xs-2">
                                    <img src="img/english.png" class="form-cli" height="30" onclick="MudaIdioma(3)" />
                                </div>
                                <div class="col-xs-6 text-right">
                                    <h2 class="hidden">
                                        <span class="glyphicon glyphicon-signal text-danger" id="nt_signal" onclick="VeConexao(true)"></span>
                                        <span class="glyphicon glyphicon-remove text-danger" id="nt_signal1" onclick="VeConexao(true)"></span>
                                    </h2>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-xs-12 text-center">
                                    <img src="img/consoft_3d.svg" height="53" />
                                    <img src="img/Logo Cec AI.png" height="53" />   

                                    <img id="logo_cli" src="img/cliente.png" alt="" height="53" style="visibility: hidden;" />
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-xs-12 text-center">
                                    <h3 class="text-center">
                                        CEC WEB - <span id="id_cab">Vendas</span> -
                                        <strong><span id="n_version" class="tabprod"></span></strong>
                                    </h3>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-xs-12 text-center">
                                    <h3 class="text-left form-cli"><span id="id_vendedor">Vendedor</span>:</h3>
                                    <div class="input-group">
                                        <span class="input-group-addon form-cli">
                                            <i class="fa fa-user fa-lg" aria-hidden="true"></i>
                                        </span>
                                        <input type="text" id="user" class="form-control form-cli" size="20" maxlength="27"
                                               placeholder="Informe o Código, Nome ou E-mail" style="height: 60px;">
                                    </div>
                                </div>
                            </div>

                            <div class="row"><div class="col-xs-12 text-center">&nbsp;</div></div>

                            <div class="row">
                                <div class="col-xs-12 text-center">
                                    <h3 class="text-left form-cli"><span id="id_senha">Senha</span>:</h3>
                                    <div class="input-group">
                                        <span class="input-group-addon form-cli">
                                            <i class="fa fa-lock fa-lg" aria-hidden="true"></i>
                                        </span>
                                        <input type="password" id="senha" class="form-control form-cli" size="20" maxlength="27"
                                               placeholder="Informe a sua Senha" style="height: 60px;">
                                    </div>
                                    <div class="radio-inline">
                                        <label for="senhachange">Trocar senha</label>
                                        <input type="checkbox" id="senhachange" class="" style="height: 20px;">
                                    </div>
                                </div>
                            </div>
                            <div id="novasenha" class="hidden">
                                <div class="row">
                                    <div class="col-xs-12 text-center">
                                        <h3 class="text-left form-cli text-warning"><span id="id_senha">Nova Senha</span>:</h3>
                                        <div class="input-group">
                                            <span class="input-group-addon form-cli">
                                                <i class="fa fa-lock fa-lg text-warning bg-warning" aria-hidden="true"></i>
                                            </span>
                                            <input type="password" id="senha1" class="form-control form-cli" size="20" maxlength="27"
                                                   placeholder="Informe a nova senha" style="height: 60px;">
                                            <input type="password" id="senha2" class="form-control form-cli" size="20" maxlength="27"
                                                   placeholder="Repita a nova Senha" style="height: 60px;">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row"><div class="col-xs-12 text-center">&nbsp;<br>&nbsp;</div></div>

                            <div class="row">
                                <div class="col-xs-12 text-center">
                                    <div class="input-group">
                                        <span class="input-group-btn">
                                            <button id="btenviar" class="btn btn-primary" style="color:#fff;background-color:#1769aa;border-color:#0d4778;">
                                                <i class="fa fa-sign-in" aria-hidden="true"></i>
                                                <strong class="login-text">Login</strong>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="row"><div class="col-xs-12 text-center">&nbsp;<br><br>&nbsp;</div></div>

                            <div class="row">
                                <div class="col-xs-12 text-center">
                                    <h3 class="text-left form-cli"><span id="id_fonte">Tamanho da Fonte</span>:</h3>
                                    <div class="input-group">
                                        <span class="input-group-addon form-cli">
                                            <i class="fa fa-sort-alpha-desc fa-lg" aria-hidden="true"></i>
                                        </span>
                                        <select class="form-control form-cli" id="nfonte" style="height: 60px;">
                                            <option value="1">1</option><option value="2">2</option><option value="3">3</option>
                                            <option value="4">4</option><option value="5" selected>5</option>
                                            <option value="6">6</option><option value="7">7</option><option value="8">8</option>
                                            <option value="9">9</option><option value="10">10</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                    <div id="cordova-dialog-overlay" style="display:none;">
                        <div id="cordova-dialog-box">
                            <h3 id="cordova-dialog-title"></h3>
                            <p id="cordova-dialog-message"></p>
                            <input id="cordova-dialog-input" type="text" style="display:none;" />
                            <div id="cordova-dialog-buttons"></div>
                        </div>
                    </div>
                    <div class="row"><div class="col-xs-12">&nbsp;</div></div>
                    <div class="row"><div class="col-xs-12">&nbsp;</div></div>
                    <div class="row"><div class="col-xs-12">&nbsp;</div></div>
                    <div class="row"><div class="col-xs-12">&nbsp;</div></div>
                    <div class="row"><div class="col-xs-12">&nbsp;</div></div>

                </div>
            </div>
        </div>

        <!-- ✅ Seu script original (só protegi o app.initialize) -->
        <script>
            var sid = '';
            var nTimeOut = 8000;
            var atime = [];
            var ntimeurl = 0;
            var lorc = false;
            var nserie = 0;
            var nesperatempo = 0;
            var _nIdioma = 1;
            var nModoOpe = 0;
            var vendedor = 0;
            var llog = 0;
            var imp_web = '<?php echo $cimp; ?>';
            var cimp_web = '<?php echo $cimp; ?>';

            // ✅ Proteção: se app não existir por algum motivo, não quebra
            if (window.app && typeof app.initialize === "function") {
                app.initialize();
            } else {
                console.warn("app.initialize() não encontrado. Verifique js/index.js");
            }

            if (window.localStorage.getItem("cecvendas" + nempresa + "_idioma")) {
                _nIdioma = window.localStorage.getItem("cecvendas" + nempresa + "_idioma");
            }
            if (!_nIdioma || _nIdioma == 0)
                _nIdioma = 1;

            nModoOpe = parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_modo"));

            $("#senhachange").on("click",function(){
                if ($(this).prop("checked")){
                    $("#novasenha").removeClass("hidden");
                }else{
                    $("#novasenha").addClass("hidden");
                }
            });
            function MudaIdioma(nIdioma) {
                _nIdioma = nIdioma;
                window.localStorage.setItem("cecvendas" + nempresa + "_idioma", _nIdioma);
                _tr("Vendas", "id_cab");
                _tr("Vendedor", "id_vendedor");
                _tr("Senha", "id_senha");
                _tr("Tamanho da Fonte", "id_fonte");
                _tr("Informe o Código, Nome ou E-mail", "user", '', "placeholder");
                _tr("Informe a sua Senha", "senha", '', "placeholder");
            }
            MudaIdioma(_nIdioma);

            $("#btenviar").click(VendasLogin);

            if (!window.localStorage.getItem("cecvendas" + nempresa + "_fonte")) {
                window.localStorage.setItem("cecvendas" + nempresa + "_fonte", 5);
            }
            $("#nfonte").val(window.localStorage.getItem("cecvendas" + nempresa + "_fonte"));
            $("#nfonte").change(function () {
                var nfonte = parseInt($("#nfonte").val());
                window.localStorage.setItem("cecvendas" + nempresa + "_fonte", nfonte);
                AjustaFonte();
            });

            /*
             $("#n_version").on("click", function () {
             var d = new Date();
             atime.push(d.getTime());
             if (atime.length < 4) return;
             
             var npos = atime.length - 1;
             if (atime[npos] - atime[npos - 3] > 3000) return;
             
             atime = [];
             navigator.notification.prompt('Senha para alterar Dados:', function (results) {
             if (!results.input1) return false;
             
             var d = new Date();
             var naux = d.getDate() * d.getFullYear() * (d.getMonth() + 1) + 595850;
             var naux1 = d.getDate() * d.getFullYear() * (d.getMonth() + 1) + 425255;
             
             var lsenha = (parseInt(results.input1) == naux) || (parseInt(results.input1) == naux1);
             if (!lsenha) {
             lsenha = (results.input1 == window.localStorage.getItem("cecvendas" + nempresa + "_senha"));
             }
             if (lsenha) {
             window.location.href = "config.html";
             return false;
             } else {
             alert('Senha inválida');
             }
             }, 'Alterar Dados', ['Ok', 'Sair'], '');
             });
             */
            AjustaFonte();

            if (ntimeurl == 0) {
                ntimeurl = setTimeout(function () {
                    VeUrl();
                }, 1);
                //      }, 3000);
            }

            //    $("#logo_cli").prop("src", "img/cliente" + window.localStorage.getItem("cecvendas" + nempresa + "_cliente") + ".png");
            $("#logo_cli").prop("src", "img/cliente" + ncliente_def + ".png");
            $("#id_cab").html(_tr(parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_modo")) == 1 ? "Caixa" : "Vendas"));
            $("#id_vendedor").html(_tr(nModoOpe == 1 ? "Operador" : "Vendedor"));

            document.getElementById("cordova-dialog-buttons").addEventListener("keydown", function () {
                if (event.key === "Enter" || event.keyCode === 13) {
                    const firstButton = this.querySelector("button");
                    if (firstButton) {
                        firstButton.click();
                    }
                }
            }
            );

            $("input").attr("autocomplete", 'new-password');
        </script>
    </body>
</html>
