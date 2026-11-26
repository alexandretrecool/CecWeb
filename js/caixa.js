$("#cx_tar_bandeira").change(function () {
    if ($("#cx_tar_bandeira").val() !== "99") {
        $("#cx_tar_bandeira_outro").val("");
        $("#cx_tar_outro").hide();
    } else {
        $("#cx_tar_bandeira_outro").val("");
        $("#cx_tar_outro").show();
    }
    var caux = $("#cx_banco option:selected").text();
    $("#cx_tar_tipo_cre").prop("checked", caux.search("CRED") !== -1);
    $("#cx_tar_tipo_deb").prop("checked", caux.search("CRED") == -1);

    return;

});
function LimpaImp(llimpanota) {
    $("#cx_imp_nota1").val("");
    $("#cx_imp_row_imprimir").hide();
    $("#cx_imp_row_notas").html("");
    if (llimpanota) {
        $('#cx_imp_nota').val('');
    }
}


var nPix = 0;
var nPixEstado = 0;
var cPixEstado = '';
var nPixVez = 0;
var nPixTimeout = 0;
var nPixId = '';

$("#cx_pix_esp").click(function () {
    nPix = 0;
    nPixEstado = 1;
    cPixEstado = '';
    nPixVez = 0;
    VePix(true);
    return;
});
function PixFinaliza() {
    if (nPix != 0) {
        nPix.modal("hide");
    }
    nPix = bootbox.alert({
        message: nPixVez + "<br><br>" + cPixEstado,
        colorType: (nPixEstado <= 2 ? "warning" : (nPixEstado == 3 ? "success" : "danger")),
        buttons: {
            ok: {
                label: 'Confirmar'
            }
        },
        callback: function (e) {
            if (nPixEstado == 3) {
                $("#cx_documento").val(nPixId);
                cx_finaliza_caixa();
                return;
            }
        }
    });

}
function VePix(linicio) {
    if (nPix != 0) {
        nPix.modal("hide");
    }
    ++nPixVez;

    nPix = bootbox.alert({
        message: nPixVez + "<br><br>" + cPixEstado,
        colorType: (nPixEstado <= 2 ? "warning" : (nPixEstado == 3 ? "success" : "danger")),
        buttons: {
            ok: {
                label: 'Cancelar'
            }
        },

        callback: function () {
            clearTimeout(nPixTimeout);
            nPixEstado = 4;
            cPixEstado = "Finalizado pelo operador";
            PixFinaliza();
            return;
        }
    });

    $.ajax({
        method: "POST",
        url: curl + "caixa.php",
        async: true,
        cache: false,
        timeout: nTimeOut,
        data: {sid: sid,modo: "POS_VEPIX", npix: ncx_pix, inicio: linicio}
    }).done(function (e) {
        //nespera.modal("hide");

        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            nPix.modal("hide");
            return false;
        }

        if (aret.erro !== '00') {
            nPix.modal("hide");
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Caixa'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        nPixEstado = aret.estado;
        cPixEstado = aret.cestado;
        nPixId = aret.id;
        if (aret.estado < 3) {
            nPixTimeout = setTimeout(function () {
                VePix(false);
            }, 3000);
            return false;
        } else {
            PixFinaliza();
        }
        return false;
    }).fail(function (e, d) {
        //nespera.modal("hide");
        nPix.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ".", // message
                function () {
                }, // callback
                _tr('Caixa'), // title
                'Ok'                  // buttonName
                );
    });
    return false;

}

$("#cx_imp_buscar_nota").click(function () {
    var nnota = $("#cx_imp_nota").val();
    LimpaImp();
    $("#cx_notas_imp_sel_box").hide();
    if (!nnota) {
        return;
    }
    /*
     if (!vedigito(nnota)) {
     bootbox.alert({
     message: _tr("Nota inválida"),
     colorType: "success",
     callback: function (e) {
     }
     });
     return;
     }
     */
    $.ajax({
        method: "POST",
        url: curl + "caixa.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {sid: sid,modo: "VENOTA", nota: nnota}
    }).done(function (e) {
//nespera.modal("hide");
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }

        if (aret.erro !== '00') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Caixa'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (aret.lnota == 0) {
            $("#cx_imp_nota1").val(tiradigito(nnota));
            $("#cx_imp_row_imprimir").show();
            var caux = '<table class="table">';
            caux = caux + '<tr><th class="text_left">Nota:</th><td class="text-left">' + nnota + '<td><tr>';
            caux = caux + '<tr><th class="text_left">Cliente:</th><td class="text-left">' + aret.nota.cliente + '-' + aret.nota.ccliente + '<td><tr>';
            caux = caux + '<tr><th class="text_left">Emissão:</th><td class="text-left">' + aret.nota.data + ' ' + aret.nota.hora + '<td><tr>';
            caux = caux + '<tr><th class="text_left">Loja:</th><td class="text-left">' + aret.nota.loja + '-' + aret.nota.cloja + '<td><tr>';
            caux = caux + '<tr><th class="text_left">Valor:</th><td class="text-left">' + amoeda[1 - 1][0] + ' ' + NumberFormat(aret.nota.valor, amoeda[1 - 1][2], ",", ".") + '<td><tr>';
            caux = caux + '</table>';
            $("#cx_imp_row_notas").html(caux);
        } else if ((aret.notas).length > 0) {
            $("#cx_notas_imp_sel_box").show();
            $("#cx_notas_imp_sel").empty();
            $('#cx_notas_imp_sel').append($('<option>', {
                value: 0,
                text: _tr('Escolha uma nota')
            }));

            for (var i = 0; i < (aret.notas).length; i++) {
                $('#cx_notas_imp_sel').append($('<option>', {
                    value: aret.notas[i].nota,
                    text: aret.notas[i].nota + "-" + digito(aret.notas[i].nota) + "       " + NumberFormat(aret.notas[i].valor, amoeda[1 - 1][2], ",", ".") + "   " + aret.notas[i].ccliente
                }));
            }
            $('#cx_notas_imp_sel').focus();
            $('#cx_notas_imp_sel').openSelect();
            return;
        }
    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ".." + _tr('Adotando configurações local'), // message
                function () {
                    return false;
                }, // callback
                _tr('Caixa'), // title
                'Ok'                  // buttonName
                );
    });
});
$("#cx_notas_imp_sel").change(function () {
    $("#cx_notas_imp_sel_box").hide();
    if (!$("#cx_notas_imp_sel").val() || $("#cx_notas_imp_sel").val() == 0) {
        return;
    }
    $("#cx_imp_nota").val(poedigito($("#cx_notas_imp_sel").val()));
    $("#cx_imp_buscar_nota").click();
    return false;
});
$("#cx_imp_imprimir").click(function () {
    var nnota = $("#cx_imp_nota1").val()
    $.ajax({
        method: "POST",
        url: curl + "caixa.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {sid: sid,modo: "IMPRIME", anotas: [nnota]}
    }).done(function (e) {
        //nespera.modal("hide");

        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }

        if (aret.erro !== '00') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Caixa'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        //ImprimeNotasCx(aret.notas);
        ImprimeCab0(aret.notas, 0, true);
        LimpaImp(true);
        return false;
    }).fail(function (e, d) {
        //nespera.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + "...", // message
                function () {
                }, // callback
                _tr('Caixa'), // title
                'Ok'                  // buttonName
                );
    });
    return false;
});
var lfinalizando = false;
function cx_finaliza_caixa() {
    if (lfinalizando) {
        return false;
    }
    lfinalizando = true;
    //alert(VeCliNfe());
    if (!VeCliNfe()) {
        lfinalizando = false;
        return;
    }
    var nespera = bootbox.espera({
        message: _tr('Procesando'),
        MostraTempo: true,
        colorType: "danger"
    });
    clearInterval(nAjustaLock);
    var ntipo = 0;
    if ($("#cx_row_finalizar_tar").is(":visible")) {
        ntipo = !$("#cx_row_finalizar_tar").is(":visible") ? 0 : ($("#cx_tar_tipo_cre").prop("checked") ? 3 : 4);
    }
    $.ajax({
        method: "POST",
        url: curl + "caixa.php",
        async: true,
        cache: false,
        timeout: nTimeOut,
        data: {sid: sid,modo: "FINALIZA", documento: $("#cx_documento").val().trim(),
            tipo: ntipo,
            bandeira: $("#cx_tar_bandeira").val(),
            outro: $("#cx_tar_bandeira_outro").val(),
            nota: parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_cx_pix"))
        }
    }).done(function (e) {
        nespera.modal("hide");
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            lfinalizando = false;
            return false;
        }

        if (aret.erro !== '00') {
            lfinalizando = false;
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Caixa'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        //ImprimeCaixa2();
        ImprimeCaixa();
        if (aret.promo.numero) {
            ImprimePromo(aret.promo);
        }
//alert(aret.voucherimp[0]);     
        //ImprimeVoucher(aret.voucherimp);
        for (n = 0; n < aret.acuponsimp.length; n++) {
            ImprimeCupom(aret.acuponsimp[n], n + 1);
        }
//alert(aret.acupons.length);        

        ReIniciarCaixa(false);
        VeEstatus();
        $('html,body').scrollTop(0);
        lfinalizando = false;
        return false;
    }).fail(function (e, d) {
        lfinalizando = false;
        nespera.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + "....", // message
                function () {
                }, // callback
                _tr('Caixa'), // title
                'Ok'                  // buttonName
                );
    });

}
$("#cx_finalizar").click(function (e) {
    if (!$("#cx_documento").val().trim()) {
        navigator.notification.alert(
                _tr("Informe um Documento"), // message
                function () {
                }, // callback
                _tr('Caixa'), // title
                'Ok'                  // buttonName
                );
        return false;
    }
    if ($("#cx_row_finalizar_tar").is(":visible")) {
        if ($("#cx_tar_bandeira").val() == "0") {
            navigator.notification.alert(
                    _tr("Informe uma Bandeira"), // message
                    function () {
                    }, // callback
                    _tr('Caixa'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if ($("#cx_tar_bandeira").val() == "99" && !$("#cx_tar_bandeira_outro").val().trim()) {
            navigator.notification.alert(
                    _tr("Informe A DESCRIÇÃO DA BANDEIRA"), // message
                    function () {
                    }, // callback
                    _tr('Caixa'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }

    }
    navigator.notification.confirm(
            _tr("Finaliza a operação de caixa") + " ?", // message
            function (e) {
                if (e == 2) {
                    cx_finaliza_caixa();
                }
                return false;
            }, // callback
            _tr('Caixa'), // title
            [_tr('Não'), _tr('Ok')]
            );
    return false;
});
function AjustaLock() {
    $.ajax({
        method: "POST",
        url: curl + "caixa.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {sid: sid,modo: "AJUSTALOCK"}
    }).done(function (e) {
        return false;
    }).fail(function (e, d) {
    });
}
function RemoveNota(nnota) {
    if (!nnota) {
        return;
    }
    var nespera = bootbox.espera({
        message: _tr('Procesando'),
        MostraTempo: true,
        colorType: "danger"
    });
    $.ajax({
        method: "POST",
        url: curl + "caixa.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {sid: sid,modo: "DEL_NOTA", nota: nnota}
    }).done(function (e) {
        nespera.modal("hide");
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }

        if (aret.erro !== '00') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Caixa'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        CxMostraNota(aret);
        $("#cx_buscar_cliente_limpar").click();
        VeEstatus();
        return false;
    }).fail(function (e, d) {
        nespera.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ".....", // message
                function () {
                }, // callback
                _tr('Caixa'), // title
                'Ok'                  // buttonName
                );
    });
}
$('#cx_notas_sel').change(function () {
    var nnota = $('#cx_notas_sel').val();
    $('#cx_notas_sel').hide();
    var nespera = bootbox.espera({
        message: _tr('Procesando'),
        MostraTempo: true,
        colorType: "danger"
    });
    $.ajax({
        method: "POST",
        url: curl + "caixa.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {sid: sid,modo: "ADD_NOTA", nota: nnota}
    }).done(function (e) {
        nespera.modal("hide");
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }
        if (aret.erro !== '00') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Caixa'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        CxMostraNota(aret);
    return false;
    }).fail(function (e, d) {
        nespera.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ". .", // message
                function () {
                }, // callback
                _tr('Caixa'), // title
                'Ok'                  // buttonName
                );
    });
});
function MostraNotaCx(nnota) {
    if (!nnota) {
        return;
    }
    var nespera = bootbox.espera({
        message: _tr('Procesando'),
        MostraTempo: true,
        colorType: "danger"
    });
    $.ajax({
        method: "POST",
        url: curl + "caixa.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {sid: sid,modo: "VER_NOTA", nota: nnota}
    }).done(function (e) {
        nespera.modal("hide");
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }

        if (aret.erro !== '00') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Caixa'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        bootbox.alert({
            message: aret.tabela,
            colorType: "info",
            callback: function (e) {
            }
        });
        return false;
    }).fail(function (e, d) {
        nespera.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ".....", // message
                function () {
                }, // callback
                _tr('Caixa'), // title
                'Ok'                  // buttonName
                );
    });

}
function CxMostraNota(aret) {
    ncliente = 0;
    ccliente = "Geral";
    var caux = '<table class="table">\n\
        <tr>\n\
        <th class="text-left">Nota</th>\n\
        <th class="text-left" colspan="2">Cliente</th>\n\
        <th class="text-right">Valor</th>\n\
        <th></th>\n\
        </tr>';
    aNotasRec = [];
    aNotasRec = aret.notas;
    for (var i = 0; i < (aret.notas).length; i++) {
        if (i + 1 == (aret.notas).length) {
            ncliente = aret.notas[i].cliente;
            ccliente = aret.notas[i].ccliente;
        }
        //aNotasRec.push([aret.anotas[i].nota,aret.anotas[i].cliente,aret.anotas[i].ccliente,aret.anotas[i].valor]);
        caux = caux + '<tr>\n\
                       <td class="text-left" onclick="MostraNotaCx(' + aret.notas[i].nota + ')">' + aret.notas[i].nota + '-' + digito(aret.notas[i].nota) + '</td>\n\
                       <td class="text-right" style="font-size: .8em">' + aret.notas[i].cliente + '</td>\n\
                       <td class="text-left" style="font-size: .8em">' + aret.notas[i].ccliente + '</td>\n\
                       <td class="text-right">' + NumberFormat(aret.notas[i].valor, amoeda[1 - 1][2], ",", ".") + '</td>\n\
                       <td class="text-center"><span class="glyphicon glyphicon-trash text-danger" onclick="javascript:RemoveNota(' + aret.notas[i].nota + ')"></span></td>\n\
                       </tr>';
    }
    caux = caux + '</table>';
    $("#cx_row_nota").html(caux);
    $("#cx_row_nota").show();
    MostraTotal(aret);
    VeCliente(ncliente, '', '', '', true);
    VeEstatus();
}

function MostraTotal(aret) {
    for (var i = 0; i < 4; i++) {
        if (amoeda[i][0]) {
            $("#cx_row_m" + (i + 1)).show();
            $("#cx_notas" + (i + 1)).html(NumberFormat(aret.total[i][0], amoeda[i][2], ",", "."));
            $("#cx_total" + (i + 1)).html(NumberFormat(aret.total[i][1], amoeda[i][2], ",", "."));
            if (aret.total[i][0] == aret.total[i][1]) {
                $("#cx_total_" + (i + 1)).removeClass("bg-warning");
                $("#cx_total_" + (i + 1)).addClass("bg-info");
            } else {
                $("#cx_total_" + (i + 1)).addClass("bg-warning");
                $("#cx_total_" + (i + 1)).removeClass("bg-info");
            }
        } else {
            $("#cx_row_m" + (i + 1)).hide();
        }
    }

}

$("#cx_conta,#cx_hist").change(function () {
    if ($("#cx_conta").val() > 0 && $("#cx_hist").val() > 0) {
        MostraCaixa(true);
    } else {
        MostraCaixa(false);
    }
    VeEstatus();
});
$("#cx_buscar_cliente_limpar").click(function () {
    /*
     if (!$("#cx_ccliente").val()){
     return false;
     }
     */
    $("#cx_notas_sel").empty();
    $("#cx_notas_sel").hide();
    $("#cx_ccliente").val("");
});
(function ($) {
    "use strict";
    $.fn.openSelect = function ()
    {
        return this.each(function (idx, domEl) {
            if (document.createEvent) {
                var event = document.createEvent("MouseEvents");
                event.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                domEl.dispatchEvent(event);
            } else if (element.fireEvent) {
                domEl.fireEvent("onmousedown");
            }
        });
    }
}(jQuery));
$("#cx_buscar_cliente").click(function () {
    /*
     if (!$("#cx_ccliente").val()){
     return false;
     }
     */
    $("#cx_notas_sel").empty();
    
    var nespera = bootbox.espera({
        message: _tr('Procesando'),
        MostraTempo: true,
        colorType: "danger"
    });
    $.ajax({
        method: "POST",
        url: curl + "caixa.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {sid: sid,modo: "CLIENTE", cliente: $("#cx_ccliente").val()}
    }).done(function (e) {
        nespera.modal("hide");
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }

        if (aret.erro !== '00') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Caixa'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        $('#cx_notas_sel').append($('<option>', {
            value: 0,
            text: _tr((aret.notas).length > 0 ? 'Selecione a nota' : 'Nenhuma nota encontrada')
        }));
        for (var i = 0; i < (aret.notas).length; i++) {
            $('#cx_notas_sel').append($('<option>', {
                value: aret.notas[i].nota,
                text: aret.notas[i].nota + "-" + digito(aret.notas[i].nota) + "       " + NumberFormat(aret.notas[i].valor, amoeda[1 - 1][2], ",", ".") + "   " + aret.notas[i].ccliente
            }));
        }
        $('#cx_notas_sel').show();
        $('#cx_notas_sel').focus();
        $('#cx_notas_sel').openSelect();
        return false;
    }).fail(function (e, d) {
        nespera.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ". ..", // message
                function () {
                }, // callback
                _tr('Caixa'), // title
                'Ok'                  // buttonName
                );
    });
});
$("#cx_banco").change(function () {
    var nespera = bootbox.espera({
        message: _tr('Procesando'),
        MostraTempo: true,
        colorType: "danger"
    });
    $.ajax({
        method: "POST",
        url: curl + "caixa.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {sid: sid,modo: "ALTERA", banco: $("#cx_banco").val(), documento: $("#cx_documento").val()}
    }).done(function (e) {
        nespera.modal("hide");
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }

        if (aret.erro !== '00') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Caixa'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        nMoedaBanco = aret.ban_moeda;
        MostraTotal(aret);
        /*
         for (var i = 0; i < 4; i++) {
         if (amoeda[i][0]) {
         $("#cx_row_m" + (i + 1)).show();
         $("#cx_notas" + (i + 1)).html(NumberFormat(aret.total[i][0], amoeda[i][2], ",", "."));
         $("#cx_total" + (i + 1)).html(NumberFormat(aret.total[i][1], amoeda[i][2], ",", "."));
         } else {
         $("#cx_row_m" + (i + 1)).hide();
         }
         }
         */
        VeEstatus();
        return false;
    }).fail(function (e, d) {
        nespera.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ". ...", // message
                function () {
                }, // callback
                _tr('Caixa'), // title
                'Ok'                  // buttonName
                );
    });
});
function CarregaCaixa() {


}
function MostraCaixa(lmostra) {
    $("#cx_notas_sel").empty();
    $("#cx_notas_sel").hide();
    for (var i = 0; i < 4; i++) {
        $("#cx_notas" + (i + 1)).html("");
        $("#cx_total" + (i + 1)).html("");
    }
    if (!lmostra) {
        $("#cx_conta").prop('disabled', false);
        $("#cx_hist").prop('disabled', false);
        $("#cx_conta").empty();
        $("#cx_hist").empty();
        $("#cx_banco").empty();
        $("#cx_ccliente").val("");
        $("#cx_ccliente").val("");
        $("#cx_row_nota").html("");
        $("#cx_documento").val("");
        $("#cx_row_banco").hide();
        $("#cx_row_cliente").hide();
        $("#cx_row_nota").hide();
        $("#cx_row_total").hide();
        $("#cx_row_finalizar").hide();
        $("#cx_row_finalizar1").hide();
        $("#cx_row_finalizar_tar").hide();
        return;
    }

    $("#cx_conta").prop('disabled', true);
    $("#cx_hist").prop('disabled', true);
    $("#cx_ccliente").val("");
    $("#cx_ccliente").val("");
    $("#cx_row_nota").html("");
    $("#cx_documento").val("");
    $("#cx_row_banco").show();
    $("#cx_row_cliente").show();
    $("#cx_row_nota").show();
    $("#cx_row_total").show();
    $("#cx_row_finalizar").hide();
    $("#cx_row_finalizar1").hide();
    $("#cx_row_finalizar_tar").hide();
    var nespera = bootbox.espera({
        message: _tr('Procesando'),
        MostraTempo: true,
        colorType: "danger"
    });
    $.ajax({
        method: "POST",
        url: curl + "caixa.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {sid: sid,modo: "INICIO", conta: $("#cx_conta").val(), hist: $("#cx_hist").val()}
    }).done(function (e) {
        nespera.modal("hide");
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }

        if (aret.erro !== '00') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Caixa'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        return false;
    }).fail(function (e, d) {
        nespera.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ". ....", // message
                function () {
                }, // callback
                _tr('Caixa'), // title
                'Ok'                  // buttonName
                );
    });
}
function ReIniciarCaixa(lpergunta) {
    uaux = this;
    if (lpergunta) {
        navigator.vibrate(1500);
        navigator.notification.confirm(
                _tr("Reinicia o CAIXA") + " ?", // message
                function (e) {
                    if (e == 2) {
                        ReIniciarCaixa(false);
                        ZerarCaixa();
                        VeEstatus();
                    }
                    return false;
                }, // callback
                _tr('Caixa'), // title
                [_tr('Não'), _tr('Ok')]
                );
        return false;
    }
    MostraCaixa(false);
    var nespera = bootbox.espera({
        message: _tr('Procesando'),
        MostraTempo: true,
        colorType: "danger"
    });
    $.ajax({
        method: "POST",
        url: curl + "caixa.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {sid: sid,modo: "RESET"}
    }).done(function (e) {
        nespera.modal("hide");
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }

        if (aret.erro !== '00') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Caixa'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        $('#cx_conta').append($('<option>', {
            value: 0,
            text: ""
        }));
        var nconta = 0;
        for (var i = 0; i < (aret.conta).length; i++) {
            if (i == 0 && (aret.conta).length == 1) {
                nconta = aret.conta[i][0];
            }
            $('#cx_conta').append($('<option>', {
                value: aret.conta[i][0],
                text: aret.conta[i][1]
            }));
        }
        $('#cx_conta').val(nconta);
        $('#cx_hist').append($('<option>', {
            value: 0,
            text: ""
        }));
        var nhist = 0;
        for (var i = 0; i < (aret.hist).length; i++) {
            if (i == 0 && (aret.hist).length == 1) {
                nhist = aret.hist[i][0];
            }
            $('#cx_hist').append($('<option>', {
                value: aret.hist[i][0],
                text: aret.hist[i][1]
            }));
        }
        $('#cx_hist').val(nhist);
        $('#cx_banco').append($('<option>', {
            value: 0,
            text: ""
        }));
        aBancosRec = {};
        for (var i = 0; i < (aret.banco).length; i++) {
            aBancosRec[aret.banco[i][0]] = aret.banco[i][2];
            $('#cx_banco').append($('<option>', {
                value: aret.banco[i][0],
                text: aret.banco[i][1]
            }));
        }
        $('#cx_banco').val(0);
        aOperadorRec = aret.operador;
        aNotasRec = [];
        if (nconta > 0 && nhist > 0) {
            MostraCaixa(true);
        }
        $('.nav-tabs a[href="#CaixaPix"]').click();
        return false;
    }).fail(function (e, d) {
        nespera.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ".. .", // message
                function () {
                }, // callback
                _tr('Caixa'), // title
                'Ok'                  // buttonName
                );
    });
}

function ImprimeCupom(cAux, i) {
    if (!cAux) {
        return;
    }

    navigator.notification.alert(
            "Imprimir Cupom " + (i), // message
            function () {
                var cImg;
                var xhr = new XMLHttpRequest();
                xhr.onerror = function () {
                    BTPrinter.connect(function (data) {
                        ImprimeCupomCx(cAux);
                    }, function (err) {
                        alert(_tr("Erro conectando à impressora\n") + err)
                    }, "IposPrinter");
                };
                xhr.onload = function () {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        cImg = reader.result;
                        BTPrinter.connect(function (data) {
                            BTPrinter.printBase64(function (data) {
                                ImprimeCupomCx(cAux);
                            }, function (err) {
                                alert("Erro Imprimindo Imagem. " + err);
                            }, cImg, '0'); //base64 string, align center
                        }, function (err) {
                            alert(_tr("Erro conectando à impressora\n") + err)
                        }, "IposPrinter");

                    };
                    reader.readAsDataURL(xhr.response);
                };
                xhr.open('GET', "img/cliente_nota" + window.localStorage.getItem("cecvendas" + nempresa + "_cliente") + ".png");
                xhr.responseType = 'blob';
                xhr.send();
            }, // callback
            _tr('Caixa'), // title
            'Ok'                  // buttonName
            );
    return false;
}

function ImprimeVoucher(aPromo) {
    if (!aPromo.length > 0) {
        return;
    }
    navigator.notification.alert(
            "Imprimir VOucher", // message
            function () {
                var cImg;
                var xhr = new XMLHttpRequest();
                xhr.onerror = function () {
                    BTPrinter.connect(function (data) {
                        ImprimeVoucherCx(aPromo);
                    }, function (err) {
                        alert(_tr("Erro conectando à impressora\n") + err)
                    }, "IposPrinter");
                };
                xhr.onload = function () {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        cImg = reader.result;
                        BTPrinter.connect(function (data) {
                            BTPrinter.printBase64(function (data) {
                                ImprimeVoucherCx(aPromo);
                            }, function (err) {
                                alert("Erro Imprimindo Imagem. " + err);
                            }, cImg, '0'); //base64 string, align center
                        }, function (err) {
                            alert(_tr("Erro conectando à impressora\n") + err)
                        }, "IposPrinter");

                    };
                    reader.readAsDataURL(xhr.response);
                };
                xhr.open('GET', "img/cliente_nota" + window.localStorage.getItem("cecvendas" + nempresa + "_cliente") + ".png");
                xhr.responseType = 'blob';
                xhr.send();
            }, // callback
            _tr('Caixa'), // title
            'Ok'                  // buttonName
            );
    return false;



}


function ImprimePromo(aPromo) {
    navigator.notification.alert(
            "Imprimir cupom de SORTEIO", // message
            function () {
                var cImg;
                var xhr = new XMLHttpRequest();
                xhr.onerror = function () {
                    BTPrinter.connect(function (data) {
                        ImprimePromoCx(aPromo);
                    }, function (err) {
                        alert(_tr("Erro conectando à impressora\n") + err)
                    }, "IposPrinter");
                };
                xhr.onload = function () {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        cImg = reader.result;
                        BTPrinter.connect(function (data) {
                            BTPrinter.printBase64(function (data) {
                                ImprimePromoCx(aPromo);
                            }, function (err) {
                                alert("Erro Imprimindo Imagem. " + err);
                            }, cImg, '0'); //base64 string, align center
                        }, function (err) {
                            alert(_tr("Erro conectando à impressora\n") + err)
                        }, "IposPrinter");

                    };
                    reader.readAsDataURL(xhr.response);
                };
                xhr.open('GET', "img/cliente_nota" + window.localStorage.getItem("cecvendas" + nempresa + "_cliente") + ".png");
                xhr.responseType = 'blob';
                xhr.send();
            }, // callback
            _tr('Caixa'), // title
            'Ok'                  // buttonName
            );
    return false;



}

var P_RESET = String.fromCharCode(27, 64); //ESC @
var P_FONT1 = String.fromCharCode(27, 33, 48); //
var P_FONT2 = String.fromCharCode(27, 33, 50); //
var P_UNDER_ON = String.fromCharCode(27, 45, 1); //ESC - 1
var P_UNDER_OFF = String.fromCharCode(27, 45, 0); //ESC - 0
var P_LINE_SPACE_DEF = String.fromCharCode(27, 50); //ESC 2
var P_HOME = String.fromCharCode(27, 60); //ESC <
var P_NEG_ON = String.fromCharCode(27, 69, 1); //ESC E 1
var P_NEG_OFF = String.fromCharCode(27, 69, 0); //ESC E 0
var P_DOUBLE_ON = String.fromCharCode(27, 71) + "1"; //ESC G 1
var P_DOUBLE_OFF = String.fromCharCode(27, 71) + "0"; //ESC G 0
var P_FONTA = String.fromCharCode(27, 77, 0); //ESC M 0
var P_FONTB = String.fromCharCode(27, 77, 1); //ESC M 1
var P_FONTC = String.fromCharCode(27, 77, 2); //ESC M 2
var P_FONTD = String.fromCharCode(27, 77, 3); //ESC M 3
var P_LEFT = String.fromCharCode(27, 97, 0); //ESC a 0
var P_CENTER = String.fromCharCode(27, 97, 1); //ESC a 1
var P_RIGHT = String.fromCharCode(27, 97, 2); //ESC a 2
var P_INVERT_ON = String.fromCharCode(29, 66, 1); //
var P_INVERT_OFF = String.fromCharCode(29, 66, 0); //
var P_SIZE_DOUBLE_H = String.fromCharCode(29, 33, 32); //
var P_SIZE_DOUBLE_V = String.fromCharCode(29, 33, 1); //
var P_SIZE_DOUBLE_HV = String.fromCharCode(29, 33, 33); //GS !

var P_CHAR_NORMAL = 0;
var P_CHAR_COND = 1;
var P_CHAR_BOLD = 8;

function ImprimeCupomCx(ccab) {

    BTPrinter.printTextSizeAlign(function (data) {
        BTPrinter.disconnect(function (data) {
        }, function (err) {
            alert(_tr("Erro desconectando impressora\n") + err);
        })
    }, function (err) {
        alert(_tr("Erro imprimindo\n") + err);
    }, ccab, '0', '0')//string, size, align


}

function ImprimePromoCx(aPromo) {
    ccab = P_RESET + P_FONT1;
    ccab = ccab + P_NEG_ON + P_CENTER + "\r\n" + P_FONT2 + "** CELLSHOP **" + "\r\n";
    ccab = ccab + P_DOUBLE_ON + "\r\n\r\n*CUPOM SORTEIO*" + "\r\n\r\n";
    ccab = ccab + "================================" + "\r\n";
    ccab += P_NEG_OFF + P_LEFT + P_FONT1 + aPromo.data + " " + aPromo.hora + " Cupom Nr.:" + P_NEG_ON + aPromo.numero + "\n";
    ccab += P_NEG_OFF + P_LEFT + "Pedido: " + aPromo.nota + "\n";
    ccab += P_NEG_OFF + P_LEFT + "Cli: " + P_NEG_ON + aPromo.cliente + "-" + aPromo.ccliente + "\n";
    ccab += P_NEG_OFF + P_LEFT + "Direcc: " + aPromo.endereco + "\n\n";
    ccab += P_NEG_OFF + P_LEFT + "Ciudad: " + aPromo.cidade + "-" + aPromo.estado + "\n";
    ccab += P_NEG_OFF + P_LEFT + "Fone: " + aPromo.telefone + "\n";
    ccab = ccab + "================================" + "\n";
    ccab = ccab + "** Participante del sorteo **" + "\n";
    ccab += "\n\n\n\n";

    BTPrinter.printTextSizeAlign(function (data) {
        BTPrinter.disconnect(function (data) {
        }, function (err) {
            alert(_tr("Erro desconectando impressora\n") + err);
        })
    }, function (err) {
        alert(_tr("Erro imprimindo\n") + err);
    }, ccab, '0', '0')//string, size, align


}







function ImprimeCaixa(aNot, lsempreco) {
    var ccab = String.fromCharCode(29, 33, 8) + "Comprovante de Pagamento" + String.fromCharCode(29, 33, 0);
    var crod = "Apresente este cupom no TOTEM \npara emitir sua nota";
    var ccorpo = '';
    var aqr = [];
    var cqr = "";
    var nsoma = 0;
    var ndig = 0;
    var anotas = [];
    if (aNot) {
        for (var k = 0; k < aNot.length; k++) {
            anotas.push(aNot[k]);
        }

    } else {
        for (var k = 0; k < aNotasRec.length; k++) {
            anotas.push(aNotasRec[k].nota);
        }
    }
    $.ajax({
        method: "POST",
        url: curl + "caixa.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {sid: sid,modo: "IMPRIME", anotas: anotas}
    }).done(function (e) {
//nespera.modal("hide");

        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }

        if (aret.erro !== '00') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Caixa'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
//ImprimeNotasCx(aret.notas);
        ImprimeCab0(aret.notas, 0, false, lsempreco);
        return false;
    }).fail(function (e, d) {
//nespera.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ".. ..", // message
                function () {
                }, // callback
                _tr('Caixa'), // title
                'Ok'                  // buttonName
                );
    });
}


function ImprimeVoucherCx(aPromo) {
    /*
     ccab = P_RESET+P_FONT1;
     ccab = ccab + P_NEG_ON + P_CENTER+ "\r\n"+P_FONT2  + "** CELLSHOP **" + "\r\n";
     ccab = ccab +  P_DOUBLE_ON + "\r\n\r\n*CUPOM SORTEIO*" + "\r\n\r\n";
     ccab = ccab + "================================" + "\r\n";
     ccab += P_NEG_OFF + P_LEFT + P_FONT1 + aPromo.data + " " + aPromo.hora + "  Cupom Nr.:" + P_NEG_ON + aPromo.numero + "\n";
     ccab += P_NEG_OFF + P_LEFT + "Pedido: " + aPromo.nota + "\n";
     ccab += P_NEG_OFF + P_LEFT + "Cli: " + P_NEG_ON + aPromo.cliente + "-" + aPromo.ccliente + "\n";
     ccab += P_NEG_OFF + P_LEFT + "Direcc: " + aPromo.endereco + "\n\n";
     ccab += P_NEG_OFF + P_LEFT + "Ciudad: " + aPromo.cidade + "-" + aPromo.estado + "\n";
     ccab += P_NEG_OFF + P_LEFT + "Fone: " + aPromo.telefone + "\n";
     ccab = ccab + "================================" + "\n";
     ccab = ccab + "** Participante del sorteo **" + "\n";
     ccab += "\n\n\n\n";
     */
    BTPrinter.printTextSizeAlign(function (data) {
        BTPrinter.disconnect(function (data) {
        }, function (err) {
            alert(_tr("Erro desconectando impressora\n") + err);
        })
    }, function (err) {
        alert(_tr("Erro imprimindo\n") + err);
    }, aPromo[0], '0', '0')//string, size, align


}







function ImprimeCaixa(aNot, lsempreco) {
    var ccab = String.fromCharCode(29, 33, 8) + "Comprovante de Pagamento" + String.fromCharCode(29, 33, 0);
    var crod = "Apresente este cupom no TOTEM \npara emitir sua nota";
    var ccorpo = '';
    var aqr = [];
    var cqr = "";
    var nsoma = 0;
    var ndig = 0;
    var anotas = [];
    var nNota = parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_cx_nota"));
    if (isNaN(nNota)){
        nNota=0;
    }
    if (aNot) {
        for (var k = 0; k < aNot.length; k++) {
            anotas.push(aNot[k]);
        }

    } else {
        for (var k = 0; k < aNotasRec.length; k++) {
            anotas.push(aNotasRec[k].nota);
        }
    }
    $.ajax({
        method: "POST",
        url: curl + "caixa.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {sid: sid,modo: "IMPRIME", anotas: anotas, nota: nNota}
    }).done(function (e) {
//nespera.modal("hide");

        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }

        if (aret.erro !== '00') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Caixa'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
//ImprimeNotasCx(aret.notas);
        ImprimeCab0(aret.notas, 0, false, lsempreco);
        return false;
    }).fail(function (e, d) {
//nespera.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ".. ..", // message
                function () {
                }, // callback
                _tr('Caixa'), // title
                'Ok'                  // buttonName
                );
    });
}
function ImprimeCab0(anotas, npos, lsegunda, lsempreco) {
    var anot = [anotas[npos]];
    ImprimeCab(anot, lsegunda, lsempreco);
    if (anotas.length > npos + 1) {
        bootbox.alert({
            message: "Aguarde o término da impressão e tecle OK para imprimir a próxima nota (" + (npos + 1) + ")",
            colorType: "success",
            callback: function (e) {
                npos = npos + 1;
                ImprimeCab0(anotas, npos, lsegunda);
            }
        });
    }
}







function ImprimeCab(anotas, lsegunda, lsempreco) {
    var cImg;
    var xhr = new XMLHttpRequest();
    xhr.onerror = function () {
        for (i = 0; i < anotas.length; i++) {
            if (anotas.length > 1 && i + 1 != anotas.length) {
            }
            anota = anotas[i];
            lpara = false;
            BTPrinter.connect(function (data) {
                ImprimeNotasCx(anota, lsegunda, lsempreco);
            }, function (err) {
                alert(_tr("Erro conectando à impressora\n") + err)
            }, "IposPrinter");
        }
    };
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            cImg = reader.result;
            for (i = 0; i < anotas.length; i++) {
                if (anotas.length > 1 && i + 1 != anotas.length) {
                }
                anota = anotas[i];
                lpara = false;
                BTPrinter.connect(function (data) {
                    BTPrinter.printBase64(function (data) {
                        ImprimeNotasCx(anota, lsegunda, lsempreco);
                    }, function (err) {
                        alert("Erro Imprimindo Imagem. " + err);
                    }, cImg, '0'); //base64 string, align center
                }, function (err) {
                    alert(_tr("Erro conectando à impressora\n") + err)
                }, "IposPrinter");
            }
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', "img/cliente_nota" + window.localStorage.getItem("cecvendas" + nempresa + "_cliente") + ".png");
    xhr.responseType = 'blob';
    xhr.send();
}
function ImprimeNotasCx(anotas, lsegunda, lsempreco) {
    var nNota = parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_cx_nota"));
    if (isNaN(nNota)){
        nNota=0;
    }
    cbarra = anotas.barra;
    ccab = "";
    if (nNota == 0) {
        if (lsegunda) {
            ccab += ccab + "\n" + String.fromCharCode(27, 33, 57, 29, 66, 1) + "* REIMPRESSAO *" + "\n";
        }
        if (lsempreco) {
            ccab += ccab + "\n" + String.fromCharCode(27, 33, 57, 29, 66, 1) + " * PRESUPUESTO *" + "\n";
        }
        ccab = ccab + String.fromCharCode(27, 33, 0, 29, 66, 0);
        ccab = ccab + "\nEmi: " + anotas.data + " " + anotas.hora + "\n";
        ccab = ccab + ("Cli: " + anotas.cliente + "-" + anotas.ccliente).substr(0, 32) + "\n";
        ccab = ccab + "Loj: " + anotas.loja + "-" + anotas.cloja + "\n";
        if (aOperadorRec[0]) {
            ccab = ccab + padr("Ope: " + aOperadorRec[0] + "-" + aOperadorRec[1], 32) + "\n";
        } else {
            ccab = ccab + padr("Ope: " + window.localStorage.getItem("cecvendas" + nempresa + "_usuario") + "-" + window.localStorage.getItem("cecvendas" + nempresa + "_cusuario"), 32) + "\n";


        }
        cpro = "------- ----- -------- ---------\n";
        cpro = cpro + String.fromCharCode(27, 69, 1) + "Codigo  Quant" + (!lsempreco ? " Unitario     Total\n" : "\n");
        cpro = cpro + "Descricao" + String.fromCharCode(27, 69, 0) + "\n";
        nvalor = 0;
        nquant = 0;
        for (var i = 0; i < (anotas.produtos).length; i++) {
            nvalor = nvalor + (anotas.produtos[i].preco * anotas.produtos[i].quant);
            nquant = nquant + parseInt(anotas.produtos[i].quant);
            cpro = cpro + "\n" + String.fromCharCode(27, 69, 1) + (" ".repeat(10) + anotas.produtos[i].codigo).substr(-6) + anotas.produtos[i].digito + String.fromCharCode(27, 69, 0);
            cpro = cpro + " " + MyTransform(anotas.produtos[i].quant, 5, true);
            if (!lsempreco) {
                cpro = cpro + " " + MyTransform(anotas.produtos[i].preco, 8);
                cpro = cpro + " " + MyTransform(anotas.produtos[i].preco * anotas.produtos[i].quant, 9);
            }
            cpro = cpro + "\n" + (anotas.produtos[i].nome).substr(0, 32) + "\n";
        }
        cpro = cpro + "------- ----- -------- ---------\n";
        if (!lsempreco) {
            cpro = cpro + String.fromCharCode(27, 69, 1) + "        " + MyTransform(nquant, 5, true) + "          " + MyTransform(nvalor, 9) + "\n";
        } else {
            cpro = cpro + String.fromCharCode(27, 69, 1) + "Total de Itens: " + MyTransform(nquant, 5, true) + "\n";
        }
        //cpro = cpro + "9999999 99999 9.999,99 99.999,99\n";

        crod = String.fromCharCode(27, 69, 1) + "\n\n** LOCAL DE RETIRADA: **\n" + anotas.entrega;
        crod +="\n\nEste e o seu UNICO comprovante  \n";
        crod +=    "de pagamento e documento de \n";
        crod +=    "retirada de seus produtos. Nao\n";
        crod +=    "perca nem repasse a terceiros.";
        crod = crod + "\n\n\n\n";
    }else if (nNota==1){ //atacado Games
        ccab += String.fromCharCode(27, 69, 1) + "     *** ATACADO GAMES ***\n\n"+String.fromCharCode(27, 69, 0);
        ccab += "\nZona: "+anotas.zona+"-"+anotas.czona+"\n\n";
        
        if (lsegunda) {
            ccab += ccab + "\n" + String.fromCharCode(27, 33, 57, 29, 66, 1) + "* REIMPRESSAO *" + "\n"+ String.fromCharCode(27, 33, 57, 29, 66, 0);
        }
        if (lsempreco) {
            ccab += ccab + "\n" + String.fromCharCode(27, 33, 57, 29, 66, 1) + " * PRESUPUESTO *" + "\n"+ String.fromCharCode(27, 33, 57, 29, 66, 0);
        }
        ccab = ccab + String.fromCharCode(27, 33, 0, 29, 66, 0);
        ccab = ccab + "\nEmi: " + anotas.data + " " + anotas.hora + "\n";
        ccab = ccab + ("Cli: " + anotas.cliente + "-" + anotas.ccliente).substr(0, 32) + "\n";
        ccab = ccab + "Loj: " + anotas.loja + "-" + anotas.cloja + "\n";
        if (aOperadorRec[0]) {
            ccab = ccab + padr("Ope: " + aOperadorRec[0] + "-" + aOperadorRec[1], 32) + "\n";
        } else {
            ccab = ccab + padr("Ope: " + window.localStorage.getItem("cecvendas" + nempresa + "_usuario") + "-" + window.localStorage.getItem("cecvendas" + nempresa + "_cusuario"), 32) + "\n";


        }
        cpro = "------- ----- -------- ---------\n";
        //cpro = cpro + String.fromCharCode(27, 69, 1) + "Codigo  Quant" + (!lsempreco ? " Unitario     Total\n" : "\n");
        cpro = cpro + String.fromCharCode(27, 69, 1) + "Codigo  Quant" + (!true ? " Unitario     Total\n" : "\n");
        cpro = cpro + "Descricao" + String.fromCharCode(27, 69, 0) + "\n";
        nvalor = 0;
        nquant = 0;
        for (var i = 0; i < (anotas.produtos).length; i++) {
            nvalor = nvalor + (anotas.produtos[i].preco * anotas.produtos[i].quant);
            nquant = nquant + parseInt(anotas.produtos[i].quant);
            cpro = cpro + "\n" + String.fromCharCode(27, 69, 1) + (" ".repeat(10) + anotas.produtos[i].codigo).substr(-6) + anotas.produtos[i].digito + String.fromCharCode(27, 69, 0);
            cpro = cpro + " " + MyTransform(anotas.produtos[i].quant, 5, true);
            if (!true) {
                cpro = cpro + " " + MyTransform(anotas.produtos[i].preco, 8);
                cpro = cpro + " " + MyTransform(anotas.produtos[i].preco * anotas.produtos[i].quant, 9);
            }else{
                cpro = cpro + " $$$$$$$$";
                cpro = cpro + " $$$$$$$$$";
                
            }
            cpro = cpro + "\n" + (anotas.produtos[i].nome).substr(0, 32) + "\n";
        }
        cpro = cpro + "------- ----- -------- ---------\n";
        if (!lsempreco) {
            cpro = cpro + String.fromCharCode(27, 69, 1) + "        " + MyTransform(nquant, 5, true) + "          " + MyTransform(nvalor, 9) + "\n";
        } else {
            cpro = cpro + String.fromCharCode(27, 69, 1) + "Total de Itens: " + MyTransform(nquant, 5, true) + "\n";
        }
        //cpro = cpro + "9999999 99999 9.999,99 99.999,99\n";

        crod = String.fromCharCode(27, 69, 1) + "\n\n** LOCAL DE RETIRADA: **\n* PACOTE " + anotas.pacote+" *"; //anotas.entrega;
        //          12345678901234567890123456789012
        crod +="\n\nEste e o seu UNICO comprovante  \n";
        crod +=    "de pagamento e documento de \n";
        crod +=    "retirada de seus produtos. Nao\n";
        crod +=    "perca nem repasse a terceiros.";
        crod = crod + "\n\n\n\n";
        
    }
    BTPrinter.printBarcode(function (data) {
        BTPrinter.printTextSizeAlign(function (data) {
            BTPrinter.printTextSizeAlign(function (data) {
                BTPrinter.printTextSizeAlign(function (data) {
                    BTPrinter.disconnect(function (data) {
                    }, function (err) {
                        alert(_tr("Erro desconectando impressora\n") + err);
                    })
                }, function (err) {
                    alert(_tr("Erro imprimindo\n") + err);
                }, crod, '0', '0')//string, size, align

            }, function (err) {
                alert(_tr("Erro imprimindo\n") + err);
            }, cpro, '0', '0')//string, size, align
        }, function (err) {
            alert(_tr("Erro imprimindo\n") + err);
        }, ccab, '0', '0')//string, size, align
    }, function (err) {
        alert(_tr("Erro Imprimindo Barras\n") + err)
    }, 2, cbarra, 1, 2, 0, 64);
    /*
     nsoma = nsoma + aNotasRec[k].nota;
     cqr = cqr + aNotasRec[k].nota + "-";
     ccorpo = ccorpo + "\n" + _tr("Nota") + ": " + String.fromCharCode(29, 33, 8) + aNotasRec[k].nota + "-" + digito(aNotasRec[k].nota) + String.fromCharCode(29, 33, 0);
     //aqr.push(poedigito(aNotasRec[k].nota));
     ccorpo = ccorpo + "\n--------------------------" + "\n";
     const d = new Date();
     ccorpo = ccorpo + "\n" + _tr("Rec") + ".: " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " " + d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + "\n";
     ccorpo = ccorpo + _tr("Cli") + ".: " + aNotasRec[0].cliente + "-" + aNotasRec[0].ccliente + "\n";
     ccorpo = ccorpo + "\n--------------------------" + "\n";
     ccorpo = ccorpo + _tr("Valores Recebidos") + ":\n";
     ccorpo = ccorpo + String.fromCharCode(29, 33, 8) + amoeda[nMoedaBanco - 1][0] + " " + $("#cx_total" + nMoedaBanco).html() + String.fromCharCode(29, 33, 0) + "\n";
     ccorpo = ccorpo + "\n--------------------------" + "\n";
     
     ndig = digito(nsoma);
     nsoma = nsoma * 10 + ndig;
     ndig = digito(nsoma);
     nsoma = nsoma * 10 + ndig;
     ndig = digito(nsoma);
     nsoma = nsoma * 10 + ndig;
     ndig = digito(nsoma);
     nsoma = nsoma * 10 + ndig;
     ndig = digito(nsoma);
     nsoma = nsoma * 10 + ndig;
     ndig = nsoma % 100000;
     cqr = cqr + ndig;
     
     BTPrinter.connect(function (data) {
     
     var system = 0; / * Barcode system, defined as "m" at https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=128 * /
     var data1 = "123456789012"; / * Barcode data, according to barcode system * /
     var align = 1; / * 0, 1, 2 * /
     var position = 2; / * Text position: https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=125 * /
     
     var font = 0; /* Font for HRI characters: https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=126 * /
     var height = 64; /* Set barcode height: https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=127* /
     BTPrinter.printBarcode(function (data) {
     BTPrinter.disconnect(function (data) {
     }, function (err) {
     alert(_tr("Erro desconectando impressora\n") + err);
     return;
     })
     
     }, function (err) {
     }, system, data1, align, position, font, height);
     
     
     
     }, function (err) {
     alert(_tr("Erro conectando à impressora\n") + err)
     }, "IposPrinter");
     
     var data = "https://github.com/CesarBalzer/Cordova-Plugin-BTPrinter";
     var align = 1; / * 0, 1, 2 * /
     var model = 49; / * https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=140 * /
     var size = 32; / * https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=141 * /
     var eclevel = 50; / * https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=142 * /
     BTPrinter.connect(function (data) {
     
     BTPrinter.printQrCode(function (data) {
     
     sleep(2000);
     BTPrinter.printText(function (data) {
     
     var system = 0; / * Barcode system, defined as "m" at https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=128 * /
     var data1 = "012345678901"; / * Barcode data, according to barcode system * /
     var align = 1; / * 0, 1, 2 * /
     var position = 2; / * Text position: https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=125 * /
     
     var font = 0; / * Font for HRI characters: https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=126 * /
     var height = 64; / * Set barcode height: https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=127* /
     BTPrinter.printBarcode(function (data) {
     
     }, function (err) {
     }, system, data1, align, position, font, height);
     
     
     BTPrinter.disconnect(function (data) {
     }, function (err) {
     alert(_tr("Erro desconectando impressora\n") + err);
     })
     }, function (err) {
     alert(_tr("Erro Imprimindo Texto\n") + err);
     }, String.fromCharCode(27, 64, 27, 33, 8, 27, 97, 0) + ccab + ccorpo + crod + "\n\n\n\n\n");
     }, function (err) {
     alert(_tr("Erro Imprimindo QR\n") + err);
     }, data, align, model, size, eclevel);
     }, function (err) {
     alert(_tr("Erro conectando à impressora\n") + err)
     }, "IposPrinter");
     
     */
}


function VeCliNfe() {
    var nClienteNf = aNotasRec[0].cliente;
    var lret = false;
    $.ajax({
        method: "POST",
        url: curl + "caixa.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {sid: sid,modo: "VECLIENTENF", cliente: nClienteNf}
    }).done(function (e) {

        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }

        if (aret.erro !== '00') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Caixa'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        lret = true;
        return true;
    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ".", // message
                function () {
                }, // callback
                _tr('Caixa'), // title
                'Ok'                  // buttonName
                );
    });
    return lret;
}