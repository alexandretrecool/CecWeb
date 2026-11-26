var curl = 'https://192.168.12.110/CellVendasPhp/';
var acliente = [["emai", 1], ["nasc", 1], ["sexo", 1], ["tipo", 1], ["cep", 1], ["ende", 1], ["comp", 1], ["bair", 1], ["uf", 1], ["publ", 1], ["tele", 1], ["celu", 1], ["what", 1]];
var lj_preco = '';
var nempresa = '1';
var cversao = '2.1.44';
var ccomp = '3';
var nLocalizacao = 0;
var ncliente_def = '';

////$.support.cors = true;
//$.mobile.allowCrossDomainPages = true;
var app = {
    // Application Constructor

    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        /*
         cordova.getAppVersion.getVersionNumber(function (version) {
         curl = window.localStorage.getItem("cecvendas" + nempresa + "_url") + version + "/";
         var aver = version.split(".");
         var cver = ("000" + aver[0]).substr(-3) + ("000" + aver[1]).substr(-3) + ("000" + aver[2]).substr(-3);
         var caux = '';
         if (parseInt(cver) % 2 == 1 && parseInt(cver)) {
         caux = "b";
         }
         if (ccomp) {
         caux = caux + "cp" + ccomp;
         }
         document.getElementById("n_version").innerHTML = "V: " + version + caux;
         
         //VeVersao(version);
         cversao = version;
         //VeVersaoPhp();
         
         
         
         
         });
         //      */
        document.getElementById("n_version").innerHTML = "V: " + cversao;
        checkConnection();

        setTimeout(VeConexao, 15000);


    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        //console.log('Received Event: ' + id);


    }

};


//app.initialize();
function AjustaFonte() {
    var nfonte = parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_fonte"));
    var nfonte1 = 10 + nfonte;
    var nfonte2 = 5 + nfonte;
    var nfonte3 = 6 + nfonte;
    $(".form-cli").css("font-size", (nfonte1 / 10) + "em");
    $("h1").css("font-size", ((nfonte2 + 16) / 10) + "em");
    $("h2").css("font-size", ((nfonte2 + 11) / 10) + "em");
    $("h3").css("font-size", ((nfonte2 + 06) / 10) + "em");
    $("h4").css("font-size", ((nfonte2 + 03) / 10) + "em");
    $("h5").css("font-size", ((nfonte2 + 00) / 10) + "em");
    $(".tabprod").css("font-size", ((nfonte3 + 00) / 10) + "em");
    /*
     for (var i = 1; i <= 8; i++) {
     $("#mn_" + i).css("font-size", (40 - (nfonte >= 5 ? 0 : (5 - nfonte) * 5)) + "px");
     }
     */
    $("[id^='mn_']").css("font-size", (30 - (nfonte >= 5 ? 0 : (5 - nfonte) * 5)) + "px");
//    $(".img_size").css("height", (80 - (nfonte >= 5 ? 0 : (5 - nfonte) * 10)) + "px");
    $(".img_size").css("height", (60 - (nfonte >= 5 ? 0 : (5 - nfonte) * 10)) + "px");
    $(".img_size2").css("height", (45 - (nfonte >= 5 ? 0 : (5 - nfonte) * 10)) + "px");


//    $("label[id^='lj_l_']").css("width", (92 - (nfonte >= 5 ? 0 : (5 - nfonte) * 10)) + "px");
    $("label[id^='lj_l_']").css("width", (72 - (nfonte >= 5 ? 0 : (5 - nfonte) * 10)) + "px");

    $(".img_size1").css("height", (60 - (nfonte >= 5 ? 0 : (5 - nfonte) * 10)) + "px");
    $("#lj_l_orc_ven").css("width", (128 - (nfonte >= 5 ? 0 : (5 - nfonte) * 10)) + "px");

    var nmul = 1;
    if (nfonte == 1) {
        nmul = 2.4;
    } else if (nfonte == 2) {
        nmul = 2.2;
    } else if (nfonte == 3) {
        nmul = 2.0;
    } else if (nfonte == 4) {
        nmul = 1.8;
    } else if (nfonte == 5) {
        nmul = 1.6;
    } else if (nfonte == 6) {
        nmul = 1.5;
    } else if (nfonte == 7) {
        nmul = 1.4;
    } else if (nfonte == 8) {
        nmul = 1.3;
    } else if (nfonte == 9) {
        nmul = 1.2;
    } else if (nfonte == 10) {
        nmul = 1.1;
    }
    nmul = nmul - 0.2;
    $("#mn_nota").css("font-size", ((25 - (nfonte >= 5 ? 0 : (5 - nfonte) * 5)) * nmul) + "px");
    $("#mn_menu_nota").css("font-size", ((25 - (nfonte >= 5 ? 0 : (5 - nfonte) * 5)) * nmul) + "px");
    $("#myNavbar").css("font-size", ((25 - (nfonte >= 5 ? 0 : (5 - nfonte) * 5)) * nmul) + "px");

}

function FechaSid() {
    $.ajax({
        method: "POST",
        url: curl + "index_c.php",
        async: false,
        cache: false,
        timeout: nTimeOut * 2,
        data: {sid: sid, vendedor: vendedor
            , modo: "FECHA_SID"
            , orcamento: lorc
            , serie: nserie
        }
    }).done(function (e) {
//        window.location.href = "index.php";
        let cimp = imp_web;
        if (cimp) {
            cimp = "?IMP=" + cimp.split(",")[1];
        }
        window.location.href = "index.php" + cimp;
        return false;
    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor'), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
    });

}
document.addEventListener("backbutton", onBackKeyDown, false);

function onBackKeyDown() {
    if (nModoOpe == 0) {
        if (vendedor) {
            navigator.notification.confirm(
                    _tr("Sair da nota") + " ?", // message
                    function (e) {
                        if (e == 2) {
                            if (aprodutos.length > 0) {
                                navigator.notification.confirm(
                                        _tr("Reinicia a nota") + " ?", // message
                                        function (e) {
                                            if (e == 2) {
                                                ReIniciar();
                                                ZerarNota();
                                            }
                                            FechaSid();
                                            return false;
                                        }, // callback
                                        _tr('Vendas'), // title
                                        [_tr('Não'), 'Ok']
                                        );
                            } else {
                                ReIniciar();
                                ZerarNota();
                                FechaSid();
                            }
                            return false;
                        }
                        return false;
                    }, // callback
                    _tr('Vendas'), // title
                    [_tr('Não'), 'Ok']
                    );
        }
    } else if (nModoOpe == 1) {
        navigator.notification.confirm(
                _tr("Sair do caixa") + " ?", // message
                function (e) {
                    if (e == 2) {
                        ReIniciarCaixa(false);
                        FechaSid();
                        return false;
                    }
                    return false;
                }, // callback
                _tr('Vendas'), // title
                [_tr('Não'), 'Ok']
                );
    }

    return false;

}

function VendasLogin() {
//                LeCli();
    //navigator.vibrate(100);
    var cuser = $("#user").val().toUpperCase();
    var csenha = $("#senha").val().toUpperCase();
    if (!cuser &&!csenha){
        $("#user").focus();
        return;
    }
    if (cuser.trim() == '') {
        navigator.notification.alert(
                "Informe o código ou nome do usuário", // message
                function () {
                    $("#user").focus();
                    return;
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;

    }
    if (csenha.trim() == '') {
        /*
         navigator.notification.alert(
         'Informe o Senha', // message
         function () {
         $("#senha").focus()
         }, // callback
         _tr('Vendas'), // title
         'Ok'                  // buttonName
         );
         */
        //nespera.modal("hide");
        navigator.notification.alert(
                "Informe uma senha válida", // message
                function () {
                    $("#senha").focus();
                    return;

                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
        $("#senha").focus();
        return false;
    }
        var csenha1 = $("#senha1").val().trim();
        var csenha2 = $("#senha2").val().trim();
    if ($("#senhachange").prop("checked")) {
        if (!csenha1) {
            navigator.notification.alert(
                    "Informe a nova senha e a confirmação", // message
                    function () {
                        $("#senha1").focus();
                        return;
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (!csenha2) {
            navigator.notification.alert(
                    "Informe a nova senha e a confirmação", // message
                    function () {
                        $("#senha2").focus();
                        return;

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (csenha1 !== csenha2) {
            navigator.notification.alert(
                    "Nova senha e a confirmação são diferentes", // message
                    function () {
                        $("#SENHA1").focus();
                        return;

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (csenha1 == csenha) {
            navigator.notification.alert(
                    "Nova senha e atual são as mesmas", // message
                    function () {
                        $("#senha1").focus();
                        return;

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        const regra = /^(?=.*[a-z])(?=.*\d).{6,}$/i;
        if (!regra.test(csenha1.toLowerCase())) {
            navigator.notification.alert(
                    "Nova senha deve conter letras e numeros, com no mínimo 6 caracteres", // message
                    function () {
                        $("#senha1").focus();
                        return;

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;

        }
    }else{
        csenha1 = "";
        csenha2 = "";
        
    }
    var nespera = bootbox.espera({
        message: _tr('Consultando o servidor') + ' ...'
    });
    nespera.modal("show");
    if (!VeVersaoPhp()) {
        nespera.modal("hide");
        return false;
    }
    $("#user").val("");
    $("#senha").val("");
    $.ajax({
        method: "POST",
        url: curl + "index_c.php",
        cache: false,
        async: false,
        timeout: 5000, //nTimeOut,
        data: {sid: sid, user: cuser, senha: csenha, modo: "LOG_IN", nmodo: nModoOpe
            , orcamento: lorc
            , serie: nserie
            , senha1: csenha1
            , senha2: csenha2
        }
    }).done(function (e) {
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            nespera.modal('hide');
            return false;
        }
        if (aret.erro == '99') {
            nespera.modal('hide');
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                        $("#user").focus();
                        $("#senhachange").prop("checked", false);
                        $("#senha1").val("");
                        $("#senha2").val("");
                        $("#novasenha").addClass("hidden");
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }

        
        $.ajax({
            method: "POST",
            url: "sid.php",
            cache: false,
            async: false,
            timeout: 5000, //nTimeOut,
            data: {sid: aret.sid, usuario: aret.usuario, cusuario: aret.cusuario, codigo: aret.codigo, nome: aret.nome, modo: "LOG_IN"
            }
        }).done(function (e) {
            setTimeout(function () {
                nespera.modal('hide');
                window.location.href = "vendas.php" + (imp_web ? "?IMP=" + imp_web : "");
            }, 2000);

        }).fail(function (e, d, f) {
        });
//        window.location.href = "vendas.php";
        return false;

    }).fail(function (e, d, f) {
        nespera.modal('hide');
        navigator.notification.beep(3);
        navigator.notification.alert(
                _tr("Sem comunicação com o servidor ou versão inválida") + "\n" + e.status + "\n" + e.responseText + "\nd:" + d + "\nf:" + f, // + '...'+e.responseText, //+e.responseText, // message
                function () {
//                                    $("#user").focus()
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
    });

}
var nlojaurl = 0;

function VeLojaUrl(nloja, lforce) {
    nlojaurl.modal('hide');
    if (nloja == 1) {
        nempresa = '';
    } else {
        nempresa = (nloja - 1) + '';
    }
    curl = window.localStorage.getItem("cecvendas" + nempresa + "_url") + cversao + "/";
    SelecionaEmp(lforce)
    curl = window.localStorage.getItem("cecvendas" + nempresa + "_url") + cversao + "/";
    nModoOpe = parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_modo"));

}

function VeUrl(lforce) {
    var aempresas = [''];


    if (!lforce) {
        lforce = false;
    }

    for (var i = 1; i < 4; i++) {
        if (window.localStorage.getItem("cecvendas" + i + "_nomeemp")) {
            aempresas.push(i + '');
        }
    }
    if (aempresas.length == 1) {
        nempresa = '';
        SelecionaEmp(lforce);
        return false;
    }

    var caux = '<div class="alert alert-warning">' + _tr("Selecione a Empresa") + ': </div>';
    for (var i = 0; i < aempresas.length; i++) {
        var naux = parseInt(aempresas[i]) + 1;
        if (isNaN(naux)) {
            naux = 1;
        }
        caux = caux + '<div class="radio"><label><input type="radio" name="rloja" id="lj_' + naux + '" onclick="VeLojaUrl(' + naux + ',' + lforce + ')">';
        if (window.localStorage.getItem("cecvendas" + aempresas[i] + "_nomeemp")) {
            caux = caux + window.localStorage.getItem("cecvendas" + aempresas[i] + "_nomeemp");
        } else {
            caux = caux + _tr('Empresa') + " " + naux
        }
        caux = caux + '</label></div>';
    }
    nlojaurl = bootbox.alert({
        message: caux,
        colorType: "success",
        sound: "success",
        callback: function () {
            VeUrl();

            return false;
        }
    });
    return false;





}

function SelecionaEmp(lforce) {
    //var curl = curl;
    var nmoedafim = window.localStorage.getItem("cecvendas" + nempresa + "_moedafim");
    var nimp = window.localStorage.getItem("cecvendas" + nempresa + "_imp");
    var nimpprod = window.localStorage.getItem("cecvendas" + nempresa + "_impprod");
    var csenha = window.localStorage.getItem("cecvendas" + nempresa + "_senha");
    window.localStorage.setItem("cecvendas_atual", nempresa);
    window.localStorage.setItem("cecvendas_versao", cversao);
    $("#nfonte").val(window.localStorage.getItem("cecvendas" + nempresa + "_fonte", nfonte));
    AjustaFonte();
    for (var i = 0; i < acliente.length; i++) {
        acliente[i][1] = window.localStorage.getItem("cecvendas" + nempresa + "_c_" + acliente[i][0]);
    }

    if (ntimeurl != 0) {
        clearTimeout(ntimeurl);
    }

    if (!lforce) {
        lforce = false;
    }

//    $("#logo_cli").prop("src", "img/cliente" + window.localStorage.getItem("cecvendas" + nempresa + "_cliente") + ".png");
    $("#logo_cli").prop("src", "img/cliente" + ncliente_def + ".png");
    $("#logo_cli").css("visibility", "visible");

    if (lforce || !curl || !nmoedafim || !nimp || !nimpprod) {
//        window.location.href = "config.html";
        return false;
    }

    $("#id_cab").html(_tr(parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_modo")) == 1 ? "Caixa" : "Vendas"));
    nLocalizacao = parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_loc_temp")) * 60 * 1000;
    if (nLocalizacao) {
        setTimeout(AtivaLocation, 5000);
    }

    return;
}


function VeSid(aret) {
    if (aret.erro == "33") {
        navigator.notification.alert(
                _tr('Tempo Expirado') + '. \n' + aret.cerro, // message
                function () {
                    let cimp = imp_web;
                    if (cimp) {
                        cimp = "?IMP=" + cimp.split(",")[1];
                    }
                    window.location.href = "index.php" + cimp;
                    return false;
                },
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }
    return true;
}


function VeAutorizadores() {
    $.ajax({
        method: "POST",
        url: curl + "vendas.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {sid: sid, modo: 101
            , orcamento: lorc
            , serie: nserie
        }
    }).done(function (e) {
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }
        if (parseInt(aret.erro) != 0) {
            aautorizadores = aret.autoriza;
            return false;
        }
        aautorizadores = aret.autoriza;
        return false;

    }).fail(function (e, d, f) {
        //nespera.modal('hide');
        alert(_tr("Sem comunicação com o servidor"));
        return false;
    });

}

/*
 $("#n_version").click(function(){
 var d=new Date();
 atime.push(d.getTime());
 if (atime.length<4){
 return;
 }
 var npos=atime.length-1;
 if (atime[npos]-atime[npos-3] > 3000 ){
 return;
 }
 atime=[];
 VeUrl(true);
 });
 */

function VeVersaoPhp() {
    var cVersaoInstalada = cversao;
    var lret = false;
    $.ajax({
        method: "POST",
        url: curl + "versao.php",
        cache: false,
        async: false, //espera o retorno
        timeout: 3000
    }).done(function (e) {
        var aret = JSON.parse(e);

        var ains = cVersaoInstalada.split('.');
        var nins = parseInt(ains[0] * 1000000) + parseInt(ains[1] * 1000) + parseInt(ains[2]);
        var amin = (aret.min).split('.');
        var nmin = parseInt(amin[0] * 1000000) + parseInt(amin[1] * 1000) + parseInt(amin[2]);
        var amax = (aret.max).split('.');
        var nmax = parseInt(amax[0] * 1000000) + parseInt(amax[1] * 1000) + parseInt(amax[2]);
        var acec_inst = (aret.cec_inst).split('.');
        var ninst = parseInt(acec_inst[0] * 1000000) + parseInt(acec_inst[1] * 1000);
        var acec_need = (aret.cec_need).split('.');
        var nneed = parseInt(acec_need[0] * 1000000) + parseInt(acec_need[1] * 1000);


        if (nins < nmin || nins > nmax) {
            navigator.notification.confirm(
                    "Versão instalada no PHP incompatível.\n\nMínima: " + aret.min + "\nMáxima: " + aret.max + "\nInstalada: " + cVersaoInstalada,
                    function (e) {
                        setTimeout(function () {
                            MOForceAppClose.forceAppClose();
                        }, 3000);
                        lret = false;
                        return false;
                    },
                    _tr('Vendas'),
                    ['Ok']
                    );
            lret = false;
            return false;
        }
        if (ninst < nneed) {
            navigator.notification.confirm(
                    "Versão do CEC instalada deve ser maior ou igual a " + aret.cec_need + "\nAtual: " + aret.cec_inst,
                    function (e) {
                        setTimeout(function () {
                            MOForceAppClose.forceAppClose();
                        }, 3000);
                        lret = false;
                        return false;
                    },
                    _tr('Vendas'),
                    ['Ok']
                    );
            lret = false;
            return false;
        }
        lret = true;
        return true;
    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr("Sem comunicação com o servidor") + ". ." + e.StatusCode + "\n" + e.responseText, // message
                function () {
                    lret = false;
                    return false;
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        lret = false;
        return false;
    });
    return lret;
}
function VeVersao(cVersaoInstalada) {
    var cdir = trim(curl);
    var cVersaoInstalada;
    if (cdir == '') {
        return -1;
    }
    cdir = cdir + "versao/last.txt";
    $.ajax({
        url: cdir,
        async: false,
        cache: false,
        timeout: nTimeOut
    }).done(function (data, textStatus, jqXHJR) {
        var data1 = data.split("\n");
        data1 = (data1[0]).split(".");
        var cversaosite = data1[0] + "." + data1[1] + "." + data1[2];
        data1 = cVersaoInstalada.split(".");
        var cversaolocal = data1[0] + "." + data1[1] + "." + data1[2];
        if (cversaolocal < cversaosite) {
            navigator.notification.confirm(
                    "Nova Versão disponível. Atualiza ?",
                    function (e) {
                        if (e == 2) {
                            var uri = curl + 'versao/CecVendas.' + cversaosite + ".apk";
                            //alert(uri);
                            navigator.app.loadUrl(uri, {openExternal: true});
                            setTimeout(function () {
                                MOForceAppClose.forceAppClose();
                            }, 3000);
                        }
                        return false;
                    },
                    _tr('Vendas'),
                    [_tr('Não'), 'Ok']
                    );
        }
        return false;
    }).fail(function (e, d, f) {
        return -1;
    });

}

function VeVence() {
    var nvence = 0;

    var xhttp = new XMLHttpRequest();
    var curl1 = curl + "vendas.php?modo=77&cliente=" + window.localStorage.getItem("cecvendas" + nempresa + "_cliente");
    xhttp.open("GET", curl1, false);
    xhttp.timeout = 2000;
    xhttp.send();
    var cret = xhttp.responseText;
    if (cret) {
        var aret = JSON.parse(cret);
        nvence = parseInt(aret.vence);
    }
    return nvence;
}
function VeConexao(lforce = false) {
    if (true) {
        return false;
    }
    var networkState = navigator.connection.type;
    var nrefresh = 15; //segundos

    var states = {};
    states[Connection.UNKNOWN] = _tr('Conexão desconhecida');
    states[Connection.ETHERNET] = _tr('Conexão Ethernet');
    states[Connection.WIFI] = _tr('Conexão WiFi');
    states[Connection.CELL_2G] = _tr('Conexão Cell 2G');
    states[Connection.CELL_3G] = _tr('Conexão Cell 3G');
    states[Connection.CELL_4G] = _tr('Conexão Cell 4G');
    states[Connection.CELL] = _tr('Conexão Cell generic');
    states[Connection.NONE] = _tr('Sem conexão');

    var lconnection = !(networkState == Connection.NONE || networkState == Connection.UNKNOWN);
    if (!lconnection || lforce) {
        navigator.notification.alert(
                _tr("Tipo de conexão") + ": " + states[networkState], // message
                function () {
                    setTimeout(VeConexao, nrefresh * 1000);
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return lconnection;
    }
    setTimeout(VeConexao, nrefresh * 1000);
    return lconnection;
}
function checkConnection() {
    if (true) {
        return false;
    }
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = _tr('Conexão desconhecida');
    states[Connection.ETHERNET] = _tr('Conexão Ethernet');
    states[Connection.WIFI] = _tr('Conexão WiFi');
    states[Connection.CELL_2G] = _tr('Conexão Cell 2G');
    states[Connection.CELL_3G] = _tr('Conexão Cell 3G');
    states[Connection.CELL_4G] = _tr('Conexão Cell 4G');
    states[Connection.CELL] = _tr('Conexão Cell generic');
    states[Connection.NONE] = _tr('Sem conexão');


    var lconnection = !(networkState == Connection.NONE || networkState == Connection.UNKNOWN);
    if (!lconnection) {
        navigator.notification.alert(
                _tr("Tipo de conexão") + ": " + states[networkState], // message
                function () {

                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );

    }
    return lconnection;
}

checkConnection();





/* ENVIAR PDF POR WHATS */

function EviaPdfBySocial(fileName, pdfhtml) {
//        var fileName = "myPdfFile.pdf";
    var novaJanela = window.open('', 'Nota_Gerada');

    novaJanela.document.open();
    novaJanela.document.write(pdfhtml);
    novaJanela.document.close();
    /*
     var options = {
     documentSize: 'A6',
     type: 'base64'
     };
     
     pdf.fromData(pdfhtml, options)
     .then(function (base64) {
     // To define the type of the Blob
     var contentType = "application/pdf";
     var folderpath = cordova.file.externalRootDirectory + "Download/"; //you can select other folders
     savebase64AsPDF(folderpath, fileName, base64, contentType);
     })
     .catch((err) => alert(err));
     */
}





function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

function savebase64AsPDF(folderpath, filename, content, contentType) {
    var DataBlob = b64toBlob(content, contentType);

    window.resolveLocalFileSystemURL(folderpath, function (dir) {
        //alert("Access to the directory granted succesfully");
        dir.getFile(filename, {create: true}, function (file) {
            file.createWriter(function (fileWriter) {
                fileWriter.write(DataBlob);
//                window.plugins.socialsharing.share(null, null, folderpath + filename);

                if (filename.substr(0, 2) == "nt") {
                    var csubject = _tr("Seu pedido de número") + " : " + (filename.substr(3)).replace(".pdf", '');
                } else {
                    var csubject = _tr("Seu Orçamento de número") + " : " + (filename.substr(3)).replace(".pdf", '');
                }
                var options = {
                    message: _tr('Arquivo PDF em anexo'), // not supported on some apps (Facebook, Instagram)
                    subject: csubject, // fi. for email
                    files: [folderpath + filename], // an array of filenames either locally or remotely
                    chooserTitle: _tr('Compartilhar PDF com') + ' :' // Android only, you can override the default share sheet title,
                };

                var onSuccess = function (result) {
                    RemoverArquivo(folderpath, filename);
                };

                var onError = function (msg) {
                    RemoverArquivo(folderpath, filename);
                    alert(_tr("Erro compartilhando arquivo") + ":\n \n" + msg);
                };

                window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

            }, function () {
                alert(_tr('Não posso salvar o arquivo temporário no caminho') + ' ' + folderpath);
            });
        });
    }, function () {
        alert(_tr('Erro salvando arquivo temporário'))
    });
}

function RemoverArquivo(path, filename) {

    window.resolveLocalFileSystemURL(path, function (dir) {
        dir.getFile(filename, {create: false}, function (fileEntry) {
            fileEntry.remove(function () {
                // The file has been removed succesfully
            }, function (error) {
                // Error deleting the file
            }, function () {
                // The file doesn't exist
            });
        });
    });
}




//var nLocalizacao = parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_loc_temp")) * 60 * 1000;
function Localizacao_temp(nTempo) {
    var nTimeOut = 10000;
    //var curl = window.localStorage.getItem("cecvendas" + nempresa + "_url") + window.localStorage.getItem("cecvendas_versao") + "/";
    var curl = veconfig.versao + "/";
    if (nTempo) {
        nTimeOut = nTempo * 1000;
    }
    var options = {
        enableHighAccuracy: true,
        maximumAge: 15 * 60 * 1000, // 3 minutos da posicao
        timeout: nTimeOut // tempo de espera
    }

    var watchID = navigator.geolocation.getCurrentPosition(function (position) {
        var clocal = "Lat:" + position.coords.latitude + ",Lon:" + position.coords.longitude + ",Pre:" + position.coords.accuracy + ",Tmp:";

        clocal = clocal + new Date().toISOString().slice(0, 19);

        var d = new Date();

        //var cbuffer = window.localStorage.getItem("cecvendas" + nempresa + "_loc_buf");
        var cbuffer = veconfig.loc_buf;
        //cbuffer = (cbuffer ? (cbuffer + "\n") : "") + window.localStorage.getItem("cecvendas" + nempresa + "_vend_ant");
        cbuffer = (cbuffer ? (cbuffer + "\n") : "") + veconfig.vend_ant;
        cbuffer += "|" + (llog);
        cbuffer += "|" + (parseInt(d.getTime() / 1000) - (d.getTimezoneOffset() * 60)).toString();
        cbuffer += "|" + clocal;

        //window.localStorage.setItem("cecvendas" + nempresa + "_loc_buf", cbuffer);
        window.localStorage.setItem("cecvendas" + nempresa + "_loc_buf", cbuffer);

        $.ajax({
            method: "POST",
            url: curl + "localizacao.php",
            cache: false,
            timeout: nTimeOut,
            data: {modo: "LOCAL_TEMP", vendedor: window.localStorage.getItem("cecvendas" + nempresa + "_vend_ant"), local: clocal, log: llog, buffer: cbuffer}
        }).done(function (e) {
            //alerta(window.localStorage.getItem("cecvendas" + nempresa + "_loc_buf"));
            window.localStorage.setItem("cecvendas" + nempresa + "_loc_buf", '');
            setTimeout(Localizacao_temp, nLocalizacao);
            return false;
        }).fail(function (e, d) {
            setTimeout(Localizacao_temp, nLocalizacao);
            return false;
        });

    }, function (error) {
        var clocal = 'Erro de localizacao \n';
        if (error.code == error.PERMISSION_DENIED) {
            clocal = clocal + 'Nao autorizado acesso a localizacao';
        }
        if (error.code == error.POSITION_UNAVAILABLE) {
            clocal = clocal + 'Nao avaliavel localizacao';
        }
        if (error.code == error.TIMEOUT) {
            clocal = clocal + 'Tempo expirado';
        }
        $.ajax({
            method: "POST",
            url: curl + "localizacao.php",
            cache: false,
            timeout: nTimeOut,
//            data: {sid: sid, modo: "LOCAL_TEMP", vendedor: vendedor, serie: nserie, local: clocal}
            data: {modo: "LOCAL_TEMP", vendedor: window.localStorage.getItem("cecvendas" + nempresa + "_vend_ant"), local: clocal, log: llog}
        }).done(function (e) {
            setTimeout(Localizacao_temp, nLocalizacao);
            return false;
        }).fail(function (e, d) {
            setTimeout(Localizacao_temp, nLocalizacao);
            return false;
        });

        /*
         $.ajax({
         method: "POST",
         url: curl + "localizacao.php",
         cache: false,
         timeout: nTimeOut,
         data: {sid: sid, modo: "LOCAL", vendedor: vendedor, serie: nserie, local: clocal, final: lfinal}
         }).done(function (e) {
         if (lfinal) {
         FinalizaF1();
         }
         return false;
         }).fail(function (e, d) {
         if (lfinal) {
         FinalizaF1();
         }
         return false;
         });
         */
        return false;
    }, options);
}

function AtivaLocation() {
    /*
     * AndroidManifest.xml
     *     <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
     <uses-permission android:name="android.permission.WAKE_LOCK" />
     <uses-permission android:name="android.FOREGROUND_SERVICE_DATA_SYNC" />
     
     */
    cordova.plugins.backgroundMode.on('activate', function () {
        cordova.plugins.backgroundMode.disableWebViewOptimizations();
    });
    cordova.plugins.backgroundMode.enable();
    Localizacao_temp();

}




window.navigator.notification = {

    alert: function (message, callback, title = "Alert", buttonName = "OK") {
        showDialog({
            message,
            title,
            buttons: [buttonName],
            callback: function (index) {
                if (callback)
                    callback();
            }
        });
    },

    confirm: function (message, callback, title = "Confirm", buttonLabels = ["OK", "Cancel"]) {
        showDialog({
            message,
            title,
            buttons: buttonLabels,
            callback: function (index) {
                if (callback)
                    callback(index);
            }
        });
    },

    prompt: function (message, callback, title = "Prompt", buttonLabels = ["OK", "Cancel"], defaultText = "") {
        showDialog({
            message,
            title,
            buttons: buttonLabels,
            input: true,
            defaultText,
            callback: function (index, value) {
                if (callback) {
                    callback({
                        buttonIndex: index,
                        input1: value
                    });
                }
            }
        });
    }

};


function showDialog(options) {
    const overlay = document.getElementById("cordova-dialog-overlay");
    const title = document.getElementById("cordova-dialog-title");
    const message = document.getElementById("cordova-dialog-message");
    const input = document.getElementById("cordova-dialog-input");
    const buttonsDiv = document.getElementById("cordova-dialog-buttons");

    title.innerText = options.title;
    message.innerText = options.message;

    buttonsDiv.innerHTML = "";
    if (options.input) {
        input.style.display = "block";
        input.value = options.defaultText || "";
        input.onkeyup = function (e) {
            if (e.key === "Enter" || e.keyCode === 13) {
                e.preventDefault();

                const firstButton = buttonsDiv.querySelector("button");
                if (firstButton) {
                    firstButton.click();
                }
            }
        };

    } else {
        input.style.display = "none";
    }



    options.buttons.forEach((btn, index) => {
        const button = document.createElement("button");
        button.innerText = btn;

        button.onclick = function () {
            overlay.style.display = "none";

            if (options.input) {
                options.callback(index + 1, input.value);
            } else {
                options.callback(index + 1);
            }
        };

        buttonsDiv.appendChild(button);
    });

    overlay.style.display = "flex";

    if (options.input) {
        setTimeout(function () {
            input.focus();
            input.select();
        }, 100);
    }
    if (options.buttons) {
        const firstButton = buttonsDiv.querySelector("button");
        if (firstButton) {
            firstButton.focus();
        }
    }
}

var config_geral;

function LogOut() {
    navigator.notification.confirm(
            _tr("Sair do APP") + " ?", // message
            function (e) {
                if (e == 2) {
                    FechaSid();
                    //window.location = "index.php";
                    let cimp = imp_web;
                    if (cimp) {
                        cimp = "?IMP=" + cimp.split(",")[1];
                    }
                    window.location.href = "index.php" + cimp;
                }
                return false;
            }, // callback
            _tr('Vendas'), // title
            [_tr('Não'), 'Ok']
            );

}

