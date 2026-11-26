var nModoAutoriza = 0;
function VeNotaSep(nnota, lsepara) {
    bootbox.confirm({
        message: lsepara ? "<B>COLOCA</b> a nota em Separação ?" : "<B>RETIRA</B> a nota da separação ?",
        colorType: "warning",
        sound: "warning",
        callback: function (e) {
            if (e) {
                $.ajax({
                    method: "POST",
                    url: curl + "vendas.php",
                    cache: false,
                    async: false, //espera o retorno
                    timeout: nTimeOut,
                    data: {lj_preco: lj_preco, sid: sid, orcamento: lorc, serie: nserie, nota: nnota, modo: "NOTA_SEP", modo1: lsepara, vendedor: vendedor, loja: nloja}
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
                                _tr('Vendas'), // title
                                'Ok'                  // buttonName
                                );
                        return false;
                    }
                    $("#rl_refresh").click();
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
        }
    });
}
function AutorizaIncG() {
    //navigator.vibrate(100);
    if (njanela !== 0) {
        clearTimeout(njanela);
    }
    $("#pd_autoriza_inc").css("visibility", "hidden");
    $("#pd_autoriza_can").css("visibility", "visible");
    $("#pd_fechar").css("visibility", "hidden");
    $("#pd_autoriza_ope").prop("disabled", true);
    $("#pd_obs").prop("disabled", true);
    $.ajax({
        method: "POST",
        url: curl + "vendas.php",
        cache: false,
        async: true, //espera o retorno
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid, wvalven: wvalven, wvalmin: wvalmin, vendedor: nvendedor, orcamento: lorc, serie: nserie, modo: "PED_AUT_GERAL_1", nsolicita: $("#pd_autoriza_ope").val(), cobs: $("#pd_obs").val()}
    }).done(function (e) {
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }
        if (parseInt(aret.erro) !== 0) {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        nautoriza = aret.registro;
        EsperaAutG();
    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ".", // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    });
    //AutorizaPreco1(ncodigo, nquant, nvalor, nminimo, nvenda);
}


function EsperaAutG() {
    if (njanela !== 0) {
        clearTimeout(njanela);
    }
    var ncodigo = parseInt($("#vd_codigo").val());

    var naux = $("#vd_quant_valor").val();
    var nvalor = parseFloat(naux.replace(",", "."));

    var naux = $("#vd_minimo").val();
    var nminimo = parseFloat(naux.replace(",", ".")) * amoeda[nmoeda - 1][3];

    var naux = $("#vd_custo").val();
    var ncusto = parseFloat(naux.replace(",", ".")) * amoeda[nmoeda - 1][3];

    var naux = $("#vd_venda").val();
    var nvenda = parseFloat(naux.replace(",", "."));

    $.ajax({
        method: "POST",
        url: curl + "vendas.php",
        cache: false,
        async: false,
        timeout: nTimeOut,
        data: {sid: sid, lj_preco: lj_preco, modo: 82, orcamento: lorc, serie: nserie, registro: nautoriza,
            ncodigo: ncodigo,
            ncusto: ncusto,
            nminimo: nminimo,
            nvenda: nvenda,
            nvalor: nvalor,
            nmodoautoriza: nModoAutoriza}

    }).done(function (e) {
        var aret = JSON.parse(e);
        if (parseInt(aret.erro) == 50) { //esperando
            njanela = setTimeout(EsperaAutG, 2000);
            return false;
        }

        if (parseInt(aret.erro) == 40) { //negada
            if (njanela !== 0) {
                clearTimeout(njanela);
            }
            $("#vd_quant").modal("hide");
            $("#pd_autoriza").modal("hide");
//            $("vd_modal_aut_sol").modal("hide");
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (parseInt(aret.erro) == 10) {
            if (njanela !== 0) {
                clearTimeout(njanela);
            }
            $("#vd_quant").modal("hide");
            $("#pd_autoriza").modal("hide");
            $("#vd_modal_aut").modal("hide");
            /*
             navigator.notification.alert(//concedida
             aret.cerro,
             function () {
             CarregaNota();
             },
             _tr('Vendas'),
             'Ok'
             );
             */

            bootbox.alert({
                message: aret.cerro,
                colorType: "success",
                callback: function (e) {
                    CarregaNota();
                }
            });
            return false;
        }
        if (njanela !== 0) {
            clearTimeout(njanela);
        }
        navigator.notification.alert(//erro diverso
                aret.cerro,
                function () {
                    $("#pd_autoriza").modal("hide");
                },
                _tr('Vendas'),
                'Ok'
                );
        return false;
    }).fail(function (e, d) {
        if (njanela !== 0) {
            clearTimeout(njanela);
        }
        $("#pd_autoriza").modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + "..", // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    });
}

function AutorizaCanG() {
    //navigator.vibrate(100);
    $("#pd_autoriza_can").css("visibility", "hidden");
    if (njanela !== 0) {
        clearTimeout(njanela);
    }
    $.ajax({
        method: "POST",
        url: curl + "vendas.php",
        cache: false,
        async: true,
        timeout: nTimeOut,
        data: {sid: sid, lj_preco: lj_preco, modo: 73, orcamento: lorc, serie: nserie, registro: nautoriza}
    }).done(function (e) {
        var aret = JSON.parse(e);
        /*            if (!VeSid(aret)) {
         return false;
         }
         */
        navigator.notification.alert(
                _tr("Solicitação Cancelada"), // message
                function () {
                    $("#pd_autoriza").modal("hide");
                    $("#vd_quant_enviar").attr("onclick", cvd_quant_enviar);
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }).fail(function (e, d) {
        if (njanela !== 0) {
            clearTimeout(njanela);
        }
        $("#pd_autoriza").modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + "...", // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    });
}


function AutorizaTotal() {
    /*
     nacodigo = ncodigo;
     naquant = nquant;
     navalor = nvalor;
     naminimo = nminimo;
     navenda = nvenda;
     naquantant = nquantant;
     naquantmax = nquantmax;
     naiva=niva;
     if (!naquantant) {
     naquantant = 0;
     }
     if (!naquantmax) {
     naquantmax = 0;
     }
     */
    //navigator.vibrate(800);
    VeAutorizadores();

    var cautoriza = '<select class="form-control" id="pd_autoriza_ope" style=" height: 50px;">';
    for (var i = 0; i < aautorizadores.length; i++) {
        cautoriza = cautoriza + '<option value="' + aautorizadores[i][0] + '" >' + aautorizadores[i][0] + '-' + aautorizadores[i][1] + '</option>';
    }
    cautoriza = cautoriza + '</select>';
    $("#pd_autoriza").modal("show");
    $("#pd_autoriza_ope_div").html(cautoriza);
    $("#pd_obs").val("");
    $("#pd_autoriza_can").css("visibility", "hidden");
    $("#pd_autoriza_inc").css("visibility", "visible");
    $("#pd_fechar").css("visibility", "visible");
    $("#pd_autoriza_ope").prop("disabled", false);
    $("#pd_obs").prop("disabled", false);
    //$("#pd_autoriza_inc").unbind('click');
    //$("#pd_autoriza_inc").removeAttr('onclick');


}

$("#vd_modal_aut_sol").on("click", function () {
    var nquant = aprodutos.length;
    var asolicita = [];
    wvalven = 0;
    wvalmin = 0;
    for (var i = 0; i < aprodutos.length; i++) {
        var nvalor = Math.round((parseFloat(($('#vd_aut_valor_' + aprodutos[i][0]).val()).replace(',', '.')) / amoeda[nmoeda - 1][3]) * 100);
        var nbase = Math.round((parseFloat(aprodutos[i][3])) * 100);
        asolicita.push([aprodutos[i][0], nbase / 100]);
        if (nvalor == nbase) {
            nquant = nquant - 1;
            continue;
        }
        if (nvalor > nbase) {
            navigator.notification.alert(
                    _tr("Código") + ": " + poedigito(aprodutos[i][0]) + "\n" + _tr("Valor solicitado está maior que o vendido"), // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (nvalor <= 0) {
            navigator.notification.alert(
                    _tr("Valor dever ser maior que") + " 0", // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        asolicita[i][1] = nvalor / 100;
    }
    if (nquant == 0) {
        navigator.notification.alert(
                _tr("Nenhum valor a autorizar"), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }

    lAutVendas = true;
    $.ajax({
        method: "POST",
        url: curl + "vendas.php",
        async: false,
        cache: false,
        timeout: nTimeOut * 2,
        data: {lj_preco: lj_preco, sid: sid, orcamento: lorc, serie: nserie, vendedor: vendedor, cliente: ncliente, modo: "PEDE_AUT_TUDO", solicita: asolicita}
    }).done(function (e) {
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }
        if (aret.erro == '99') {
            alerta(e);
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                        return false;
                    }, // callback
                    _tr('Vendas'), // title
                    _tr('Ok')                  // buttonName
                    );
            return false;
        }

        wvalven = aret.wvalven;
        wvalmin = aret.wvalmin;
        AutorizaTotal();
        return false;
    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + "....", // message
                function () {
                    ZerarNota();
                    ReIniciar();
                    CarregaNota();
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    });
});
function BtAutoriza() {
    var cstr = '';
    var nitens = 0;
    var ntotal = 0;
    var ndesco = 0;
    if (aprodutos.length == 0) {
        return;
    }
//    cstr = '<table class="table table-bordered" style="font-size: ' + $(".tabprod").css("font-size") + '">\n\
    cstr = '<table class="table table-bordered" style="font-size: 0.9em;">\n\
                            <thead class="bg-warning text-warning">\n\
                                <tr>\n\
                                    <th colspan="1" >' + _tr('Produto') + '</th>\n\
                                    <th>' + _tr('Quant') + '</th>\n\
                                    <th>' + _tr('Unit') + '</th>\n\
                                    <th>' + _tr('Total') + '</th>\n\
                                </tr>\n\
                            </thead>\n\
                            <tbody>\n\
                    ';
    for (var i = 0; i < aprodutos.length; i++) {
        var nquant = parseInt(aprodutos[i][2]);
        var nvalor = parseFloat(aprodutos[i][3]) * amoeda[nmoeda - 1][3];
        var ndesc = parseFloat(aprodutos[i][8]);
        nitens = nitens + nquant;
        ntotal = ntotal + (nquant * nvalor);
        ndesco = ndesco + (nquant * ndesc);
        cstr = cstr + '<tr><td scope="row">' + poedigito(aprodutos[i][0]) + ' - ';
        cstr = cstr + (aprodutos[i][1]).addSlashes();
        cstr = cstr + '</td><td>';
        cstr = cstr + NumberFormat(nquant, 0);
        cstr = cstr + '</td><td>';
        cstr = cstr + NumberFormat(nvalor, amoeda[nmoeda - 1][2]);
        cstr = cstr + '<br><input type="tel" id="vd_aut_valor_' + aprodutos[i][0] + '" class="form-control text-left form-cli form-cli1" value="' + NumberFormat(nvalor, amoeda[nmoeda - 1][2]) + '" style="font-size: 0.9em;">';
        cstr = cstr + '</td><td>';
        cstr = cstr + NumberFormat(nquant * nvalor, amoeda[nmoeda - 1][2]);
        cstr = cstr + '</td></tr>';
    }
    cstr = cstr + '</tbody></table>';
    $("#vd_modal_aut_corpo").html(cstr);
    $("#vd_modal_aut").modal("show");
    for (var i = 0; i < aprodutos.length; i++) {
        $('#vd_aut_valor_' + aprodutos[i][0]).mask('####0,00', {reverse: true});
    }

    return;
}
function Finaliza() {
    if ((aConfig.TIPO_CSHBK) == undefined || parseInt(aConfig.TIPO_CSHBK) !== 2) {
        Finaliza0();
    } else {
        VeCashBack();
    }
}
acash = [];
function VeCashBack() {

    $.ajax({
        method: "POST",
        url: curl + "vendas.php",
        async: false,
        cache: false,
        timeout: nTimeOut * 2,
        data: {lj_preco: lj_preco, sid: sid, orcamento: lorc, serie: nserie, vendedor: vendedor, cliente: ncliente, modo: "VECASH"}
    }).done(function (e) {
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }
        if (aret.cashok == 0) {
            Finaliza0();
            return false;
        }

        var chtml = '<div class="row alert alert-warning"><div class="col-12">\n<input type="radio" id="fn_cbk0" name="fn_cbk" value="0"><label for="fn_cbk0">Nenhum</label></div>\n';
        for (var i = 0; i < aret.cashpro.length; i++) {
            chtml = chtml + '<div class="col-12"><input type="radio" id="fn_cbk' + aret.cashpro[i][0] + '" name="fn_cbk" value="' + aret.cashpro[i][0] + '"><label for="fn_cbk' + aret.cashpro[i][0] + '">' + aret.cashpro[i][0] + " - " + aret.cashpro[i][1] + '   Valor: U$' + NumberFormat(aret.cashpro[i][2], amoeda[0][2]) + '  Credito: R$ ' + NumberFormat(aret.cashpro[i][3], amoeda[0][2]) + '</label></div>\n';
        }
        acash = aret.cashpro;
        chtml = chtml + '</div>\
                    <div class="row">\
                        <div class="md-12 text-right">\
                            <span class="input-group text-right">\
                                <span class="btn btn-warning" id="fn_cbk_cancel" onclick="CanCashBack()" >\
                                    Cancelar\
                                </span>\
                                &nbsp;&nbsp;\
                                <span class="btn btn-success" id="fn_cbk_ok" onclick="FinCashBack()">\
                                    Ok\
                                </span>\
                            </span>\
                        </div>\
                    </div>';

        $("#pd_cashback_pro").html(chtml);
        $("#pd_cashback").modal("show");


        return false;
    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ". .", // message
                function () {
                    ZerarNota();
                    ReIniciar();
                    CarregaNota();
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    });

}
$("#fn_cbk_cancel").click(function () {
    $("#pd_cashback").modal("hide");
});

function CanCashBack() {
    $("#pd_cashback").modal("hide");
}
function FinCashBack() {
    var ncodigo = 0;
    var cCelular = '';
    if ($("#fn_cbk0").prop("checked")) {
        $("#pd_cashback").modal("hide");
        Finaliza0();
        return false;
    }
    for (var i = 0; i < acash.length; i++) {
        if ($("#fn_cbk" + acash[i][0]).prop("checked")) {
            ncodigo = i + 1;
        }

    }
    if (ncodigo == 0) {
        navigator.notification.alert(
                _tr("Selecione uma opção"), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;

    }

    $.ajax({
        method: "POST",
        url: curl + "funcoes.php",
        async: false,
        cache: false,
        timeout: nTimeOut * 2,
        data: {sid: sid, modo: "CELULAR", cliente: ncliente}
    }).done(function (e) {
        var aret = JSON.parse(e);
        cCelular = aret.celular;
    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ".....", // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    });

    //if (!ValidaFoneBr($("#de_cl_celular").val(), true, false, true)) {
    if (!ValidaFoneBr(cCelular, true, false, true)) {
        $("#pd_cashback").modal("hide");
        $('.nav-tabs a[href="#de_cliente"]').tab('show');
        $("#de_cl_celular").focus();
        return false;
    }
    --ncodigo;
    GravaItem(acash[ncodigo][4], 1, acash[ncodigo][2], 0, 0, false, 0, true);
    $("#pd_cashback").modal("hide");
    $('.nav-tabs a[href="#finalizar"]').tab('show');
    //Finaliza0();
    return false;
}

function ValidaFoneBr(cFone, lCelular, lSemMensagem, lNaoVazio) {
    var cMenCel = "Informe o telefone celular no formato:\n\n +55 XX 9XXXX XXXX  ";
    var cMenFix = "Informe o telefone fixo no formato:\n\n+55 XX XXXX XXXX";

    if (!cFone) {
        if (lNaoVazio) {
            navigator.notification.alert(
                    (lCelular ? cMenCel : cMenFix) + ". .", // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        return true;
    }

    cFone = cFone.trim();
    if (cFone.substr(0, 3) == "+55") {
        cFone = cFone.substr(0);
    }

    if (lCelular) {
        //45998313601
        if (cFone.length !== 11 || cFone.substr(0, 1) == "0" || cFone.substr(1, 1) == "0" || cFone.substr(2, 1) !== "9" || cFone.substr(3, 1) == "0" || (cFone.replace(' ', '')).length != cFone.length) {

            if (!lSemMensagem) {
                navigator.notification.alert(
                        cMenCel + ". .", // message
                        function () {
                        }, // callback
                        _tr('Vendas'), // title
                        'Ok'                  // buttonName
                        );
            }

            return false;
        }
    } else {
        //4530282650
        if (cFone.length !== 10 || cFone.substr(0, 1) == "0" || cFone.substr(1, 1) == "0" || cFone.substr(2, 1) == "0" || cFone.substr(2, 1) !== "9" || cFone.substr(2, 1) == "8" || cFone.substr(2, 1) == "7" || (cFone.replace(' ', '')).length != cFone.length) {
            if (!lSemMensagem) {
                navigator.notification.alert(
                        cMenFix + ". .", // message
                        function () {
                        }, // callback
                        _tr('Vendas'), // title
                        'Ok'                  // buttonName
                        );
            }

            return false;
        }
    }


    return true;
}

function Finaliza0() {

    //navigator.vibrate(100);
    if (aprodutos.length == 0) {
        //navigator.vibrate(1000);
        navigator.notification.alert(
                _tr("Nota sem nenhum produto"), // message
                function () {
                    $('.nav-tabs a[href="#venda"]').tab('show');
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }
    if (ncliente == 0) {
        //navigator.vibrate(1000);
        navigator.notification.alert(
                _tr("Cliente não informado"), // message
                function () {
                    $('.nav-tabs a[href="#cliente"]').tab('show');
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }
    /* loja correlativa */
    if ((!$("#lj_lojacor").val() || $("#lj_lojacor").val() == 0) && alojacor.length > 0) {
        //navigator.vibrate(1000);
        navigator.notification.alert(
                _tr("Selecione a LOJA CORRELATIVA"), // message
                function () {
                    $('.nav-tabs a[href="#loja"]').tab('show');
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }
    /**/
    if (lclibloq) {
        //navigator.vibrate(1000);
        navigator.notification.alert(
                _tr("Cliente BLOQUEADO"), // message
                function () {
                    $('.nav-tabs a[href="#cliente"]').tab('show');
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }
    if ($("#vc_placa").val() && veconfig["vei"]) {
        if (!VeVeiculo()) {
            navigator.notification.alert(
                    _tr('Corrija o cadastro do veículo'), // message
                    function () {
                        $('.nav-tabs a[href="#veiculo"]').tab('show');
                        return false;
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        } else {
            $("#vc_salvar").click();
        }
    }

    if (lFactura) {
        var cmail = (trim($("#de_cl_mail").val())).toUpperCase();
        $.ajax({
            method: "POST",
            url: curl + "funcoes.php",
            async: false,
            cache: false,
            timeout: nTimeOut * 2,
            data: {sid: sid, modo: "CLIFATURA", cliente: ncliente}
        }).done(function (e) {
            var aret = JSON.parse(e);
            if (!VeSid(aret)) {
                return false;
            }
            if (aret.erro !== '00') {
                navigator.notification.alert(
                        aret.cerro, // message
                        function (e) {
                            return false;
                        }, // callback
                        _tr('Vendas'), // title
                        _tr('Ok')                  // buttonName
                        );
                return false;
            }
            if (!cmail) {
                let caux = _tr("Para cliente sem e-mail, informar") + ":\nCLIENTE NO TIENE CORREO ELECTRONICO";
                caux += '<br><input type="text" name="de_cl_mail_fin" id="de_cl_mail_fin" class="form-control text-left form-cli form-cli1" value="" size="30" maxlength="40" style="text-transform:lowercase" autocomplete="off">';
                bootbox.confirm({
                    message: caux,
                    colorType: "primary",
                    sound: "primary",
                    defaultConfirm: false,
                    callback: function (e) {
                        if (e) {
                            $("#de_cl_mail").val($("#de_cl_mail_fin").val().toUpperCase().trim());
                            Finaliza0();
                            return false;
                        }
                    }
                });

                return false;
            }
            if (cmail !== "CLIENTE NO TIENE CORREO ELECTRONICO" && !ValidaMail(cmail)) {
                navigator.notification.alert(
                        _tr("E-mail inválido para o Documento Eletrônico") + "\n" + cmail, // message
                        function (e) {
                            $("#de_cl_mail").val("");
                            return false;
                        }, // callback
                        _tr('Vendas'), // title
                        _tr('Ok')                  // buttonName
                        );
                return false;
            }
            Finaliza2();
        }).fail(function (e, d) {
            navigator.notification.alert(
                    _tr('Sem comunicação com o servidor') + ".....", // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        });
    } else {
        Finaliza2();
    }
}
function Finaliza2() {
//VERIFICA SE NOTA JÁ FOI ENVIADA
    $.ajax({
        method: "POST",
        url: curl + "index_c.php",
        async: false,
        cache: false,
        timeout: nTimeOut * 2,
        data: {lj_preco: lj_preco, sid: sid, orcamento: lorc, serie: nserie, vendedor: vendedor, cliente: ncliente, modo: "VE_DOUBLE"}
    }).done(function (e) {
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }
        if (aret.erro == '99') {
            navigator.notification.confirm(
                    _tr("Nota já finalizada no CEC\n sob nº ") + aret.nota + '-' + aret.digito + "\n\n" + _tr("Considera a nota finalizada") + " ?", // message
                    function (e) {
                        if (e == 2) {
                            NotaDouble();
                        }
                        return false;
                    }, // callback
                    _tr('Vendas'), // title
                    [_tr("Não"), _tr('Ok')]                  // buttonName
                    );
            return false;
        }
        Finaliza1();
    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + "......", // message
                function () {
                    ZerarNota();
                    ReIniciar();
                    CarregaNota();
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    });
}



function NotaDouble() {
    $.ajax({
        method: "POST",
        url: curl + "index_c.php",
        async: false,
        cache: false,
        timeout: nTimeOut * 2,
        data: {lj_preco: lj_preco, sid: sid, orcamento: lorc, serie: nserie, vendedor: vendedor, cliente: ncliente, modo: "DEL_DOUBLE"}
    }).done(function (e) {
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }
        if (aret.erro != '00') {
            navigator.notification.alert(
                    _tr("Erro zerando nota"), // message
                    function (e) {
                        return false;
                    }, // callback
                    _tr('Vendas'), // title
                    _tr('Ok')                  // buttonName
                    );
            return false;
        }
        ZerarNota();
        ReIniciar();
        CarregaNota();
        return false;
    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ". .", // message
                function () {
                    ZerarNota();
                    ReIniciar();
                    CarregaNota();
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    });
}

function Finaliza1() {
    var ntotal = 0;
    for (var i = 0; i < aprodutos.length; i++) {
        ntotal = ntotal + aprodutos[0][2] * aprodutos[i][3];
    }


//    var ncliente_ant=ncliente;
//    var nloja_ant=nloja;
//ver limiote e foto
    if (ntotal > nLimiteFoto) {
        $.ajax({
            method: "POST",
            url: curl + "index_c.php",
            async: false,
            cache: false,
            timeout: nTimeOut * 2,
            data: {lj_preco: lj_preco, sid: sid, orcamento: lorc, serie: nserie, vendedor: vendedor, cliente: ncliente, modo: 25}
        }).done(function (e) {
            var aret = JSON.parse(e);
            if (!VeSid(aret)) {
                return false;
            }
            if (aret.erro == '99') {
                navigator.notification.alert(
                        aret.cerro, // message
                        function () {
                        }, // callback
                        _tr('Vendas'), // title
                        'Ok'                  // buttonName
                        );
                return false;
            }
            if (parseInt(aret.foto) == 0) {
                //navigator.vibrate(1000);
                if (nLimiteFoto > 0) {
                    navigator.notification.confirm(
                            _tr("Cliente sem foto\nVenda ultrapassa") + " " + amoeda[0][0] + NumberFormat(nLimiteFoto, amoeda[0][2]) + "\n\n" + _tr("Continua assim mesmo") + " ?", // message
                            function (e) {
                                if (e == 1) {
                                    FinalizaF();
                                }
                                return false;
                            }, // callback
                            _tr('Vendas'), // title
                            ['Ok', 'Cancelar']                  // buttonName
                            );
                } else {
                    navigator.notification.confirm(
                            _tr("Cliente sem foto de cédula identidade. Cadastre antes de prosseguir"), // message
                            function (e) {
                                return false;
                            }, // callback
                            _tr('Vendas'), // title
                            ['Ok', 'Cancelar']                  // buttonName
                            );
                }
                return false;
            }
            if (parseInt(aret.foto) == 1) {
                //navigator.vibrate(1000);
                navigator.notification.confirm(
                        _tr("Cliente COM APENAS 1 FOTO.\n\n\nEstá tudo certo ???\nVenda ultrapassa ") + amoeda[0][0] + NumberFormat(nLimiteFoto, amoeda[0][2]) + "\n\n" + _tr("Continua assim mesmo") + " ?", // message
                        function (e) {
                            if (e == 1) {
                                FinalizaF()
                            }
                            return false;
                        }, // callback
                        _tr('Vendas'), // title
                        'Ok'                  // buttonName
                        );
                return false;
            }
            FinalizaF();
        }).fail(function (e, d) {
            navigator.notification.alert(
                    _tr('Sem comunicação com o servidor') + ". . .", // message
                    function () {
                        CarregaNota();
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        });
        return false;
    }
    FinalizaF();
    return false;
}

var nEsperaLocal = 0;
function FinalizaF() {
    nEsperaLocal = bootbox.espera({
        message: _tr('Gravando no servidor.\nNão interrompa o processo nem mude de aplicativo ...'),
        MostraTempo: true,
        colorType: "danger"
    });
    //if (!window.localStorage.getItem("cecvendas" + nempresa + "_loc_fin")) {
    if (!veconfig["loc_fin"]) {
        FinalizaF1();
        return false;
    }
    Localizacao1(true, 5, 10);
    return false;
}

function FinalizaF1() {
    var ntotal = 0;
    var ncliente_ant = ncliente;
    var nloja_ant = nloja;
    var nlojacor_ant = nlojacor;
    var cplaca_ant = $("#vc_placa").val();
    var aBar = [];
    var cPdf = '';
    var nespera = nEsperaLocal;
    //ver limiote e foto

    //finalizar


    var aImp = [];
    for (var i = 0; i < aprodutos.length; i++) {
        var caux = aprodutos[i][1];
        cPdf = cPdf + '<tr><td>' + aprodutos[i][0] + '-' + digito(aprodutos[i][0]) + '</td><td>' + aprodutos[i][1];
        for (var k = 0; k < agrade.length; k++) {
            if (agrade[k][0] == aprodutos[i][0]) {
                caux = caux + "\n" + ('......' + agrade[k][3]).substr(-6) + " - " + agrade[k][5] + " - " + agrade[k][6];
                cPdf = cPdf + '<br>' + ('......' + agrade[k][3]).substr(-6) + " - " + agrade[k][5] + " - " + agrade[k][6];
            }
        }
        cPdf = cPdf + "</td><td>" + NumberFormat(aprodutos[i][2], 0) + "</td>";
        cPdf = cPdf + "<td>" + NumberFormat(aprodutos[i][3], amoeda[0][2]) + "</td>";
        cPdf = cPdf + "<td>" + NumberFormat(aprodutos[i][2] * aprodutos[i][3], amoeda[0][2]) + "</td></tr>";
        //imprimir preços
        //*****************************************
        //if (window.localStorage.getItem("cecvendas" + nempresa + "_impprod_pre") == "1") {
        if (veconfig["impprod_pre"] == "1") {
            caux = caux + "\n" + ("              " + aprodutos[i][2]).substr(-6) + " x " + (NumberFormat(aprodutos[i][3], amoeda[0][2])).substr(-9) + " = " + (NumberFormat(aprodutos[i][2] * aprodutos[i][3], amoeda[0][2])).substr(-9);
            aImp.push([aprodutos[i][0], caux, aprodutos[i][2], aprodutos[i][3]]);
        } else {
            //caux ='';// caux + "\n" + (aprodutos[i][2]).substr(-6); 
            aImp.push([aprodutos[i][0], caux, aprodutos[i][2], aprodutos[i][3]]);

        }
        if (false) {
            caux = caux + "\n" + ("              " + aprodutos[i][2]).substr(-6) + " x " + (NumberFormat(aprodutos[i][3], amoeda[0][2])).substr(-9) + " = " + (NumberFormat(aprodutos[i][2] * aprodutos[i][3], amoeda[0][2])).substr(-9);
            aImp.push([aprodutos[i][0], caux, aprodutos[i][2], aprodutos[i][3]]);
        }
    }
//cPdf = cPdf + "</table></body></html>";
    $.ajax({
        method: "POST",
        url: curl + "vendas.php",
        async: true,
        cache: false,
        timeout: nTimeOut * 5,
        data: {
            lj_preco: lj_preco
            , sid: sid
            , orcamento: lorc
            , serie: nserie
            , finalizar: true
            , modo: "FINALIZAR_NOTA"
            , vendedor: vendedor
            , obs: $("#fn_obs").val()
            , moeda: amoeda
            , moedafim: veconfig["moedafim"]
            , carga: $("#fn_carga").val()
        }
    }).done(function (e) {
        nespera.modal("hide");
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }
        if (aret.erro != '00') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        var cCli = $("#cl_codigo").val() + "-" + ($("#cl_nome").val()).trim();
        ntotal = nvalorfinal;
        ReIniciar();
        CarregaNota();
        //navigator.vibrate(3000);
        var ncli = veconfig["cliente"];
        if (!ncli || ncli == '0') {
            ncli = '';
        }








        var nimp = parseInt(veconfig["imp"]);
        var aopcoes = ['Ok', 'Compartilhar'];
        var cbema = veconfig["bema"];
        var cauto = (imp_web ? imp_web : veconfig["impauto"]);
        //sem impressao


        if (nimp > 0) {
            if (cbema || cauto) {
                nimp = 0;
                aopcoes = ['Ok', _tr('Ver Web'), _tr('Imprimir')];
            } else {
                if (nimp == 1) {
                    aopcoes = ['Ok', _tr('Ver WEb'), _tr('Imprimir')];
                }
            }
        } else {
            aopcoes = ['Ok', _tr('Ver WEb')];

        }
        var cnotas = '';
        for (var k = 0; k < (aret.nota).length; k++) {
            cnotas = cnotas + "\n" + (aret.nota[k] + 0) + "-" + digito(aret.nota[k]) + "      Pacote:" + aret.pacote[k];
        }
        navigator.notification.confirm(
                (!lorc ? _tr("VENDA FINALIZADA") : _tr("ORÇAMENTO FINALIZADO")) + " " + _tr("COM SUCESSO\n\nNota(s)") + " nº" + cnotas, //+aret.mensagem, // message
                function (e) {
                    if (e == 2) {
                        for (var k = 0; k < (aret.nota).length; k++) {
                            ImprimePdf(aret.nota[k]);
                        }
                        VeMantemCliente(ncliente_ant, nloja_ant, cplaca_ant, nlojacor_ant);

                        //$('.nav-tabs a[href="#loja"]').tab('show');
                        //VeMantemCliente(ncliente_ant, nloja_ant);
                    } else if (e == 3) {
                        var caux = cbema ? cbema : cauto;
                        if (caux) {
                            var aimp = caux.split("-");
                            var nvias = parseInt(veconfig["bema_vias"]);
                            if (nvias == 0) {
                                nvias = 1;
                            }
                            var caux = _tr('Escolha a impressora') + ':<br><select id="ibema">  ';
                            for (var ii = 0; ii < aimp.length; ii++) {
                                var nbema = (aimp[ii]).split(",");
                                caux = caux + '<option value="' + nbema[0] + '" > ' + aimp[ii] + '</option>';
                            }
                            caux = caux + "</select>";
                            if (nvias > 1) {
                                caux = caux + '<br>' + _tr('Quantas vias') + '?:<br><select id="ibema_vias">  ';
                                for (var i = 1; i <= 5; i++) {
                                    caux = caux + '<option value="' + i + '" ' + (nvias == i ? "selected" : "") + '> ' + i + '</option> ';
                                }
                                caux = caux + "</select>";
                            }
                            ImprimeBema(caux, aimp, aret, ncliente_ant, nloja_ant, cplaca_ant, cbema);
                            VeMantemCliente(ncliente_ant, nloja_ant, cplaca_ant, nlojacor_ant);
                        } else {
                            var nimpmodelo = parseInt(veconfig["tipimp"]);
                            if (nimpmodelo == 1) {
                                ImprimeNota2(aBar, aret, cCli, aImp, ntotal, ncliente_ant, nloja_ant, nespera, ncli);
                                $('.nav-tabs a[href="#loja"]').tab('show');
                                VeMantemCliente(ncliente_ant, nloja_ant, cplaca_ant, nlojacor_ant);
                            } else if (nimpmodelo == 0) {
                                ImprimeNota1(aBar, aret, cCli, aImp, ntotal, ncliente_ant, nloja_ant, nespera, ncli);
                                //$('.nav-tabs a[href="#loja"]').tab('show');
                                //VeMantemCliente(ncliente_ant, nloja_ant);
                                VeMantemCliente(ncliente_ant, nloja_ant, cplaca_ant, nlojacor_ant);
                            } else if (nimpmodelo == 2) {
                                ImprimeCaixa(aret.nota, true);
                                VeMantemCliente(ncliente_ant, nloja_ant, cplaca_ant, nlojacor_ant);
                            }
                        }
                    } else {
                        //$('.nav-tabs a[href="#loja"]').tab('show');
                        //VeMantemCliente(ncliente_ant, nloja_ant);
                        VeMantemCliente(ncliente_ant, nloja_ant, cplaca_ant, nlojacor_ant);
                    }
                    $('.nav-tabs a[href="#loja"]').tab('show');
                    //VeMantemCliente(ncliente_ant, nloja_ant, cplaca_ant);
                }, // callback
                _tr('Vendas'), // title
                aopcoes                 // buttonName
                );
    }).fail(function (e, d, f) {
        nespera.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ' - ' + _tr('Finalizar') + ' \n' + d + "\n" + f, // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
    });
    var aaux = [];
    for (var i = 0; i < aImp.length; i++) {
        aaux.push([aImp[i][0], aImp[i][1]]);
    }
    for (var i = 0; i < 20; i++) {
        aaux.push([window.localStorage.getItem("cecvendas" + nempresa + "_hisc_" + i), window.localStorage.getItem("cecvendas" + nempresa + "_hisn_" + i)]);
    }
    for (var i = 0; i < 20; i++) {
        window.localStorage.setItem("cecvendas" + nempresa + "_hisc_" + i, aaux[i][0]);
        window.localStorage.setItem("cecvendas" + nempresa + "_hisn_" + i, aaux[i][1]);
    }

    return false;
}

function VeMantemCliente(ncli, nloj, cplaca_ant, nlojacor_ant) {
    /*
     navigator.notification.confirm(
     _tr("Mantem cliente para a próxima nota") + " ?", // message
     function (e) {
     if (e == 2) {
     nloja = nloj;
     nlojacor = nlojacor_ant;
     
     $("#lj_loja").val(nloja);
     $("#lj_lojacor").val(nlojacor);
     $("#lj_loja").change();
     $("#lj_lojacor").change();
     $("#lj_lojacor").val(nlojacor);
     VeCliente(ncli, '');
     if (cplaca_ant) {
     navigator.notification.confirm(
     _tr("Mantem Veículo para a próxima nota") + " ?", // message
     function (e) {
     if (e == 2) {
     
     $("#vc_placa").val(cplaca_ant);
     $("#vc_buscar_placa").click();
     return false;
     }
     return false;
     }, // callback
     _tr('Vendas'), // title
     [_tr('Não'), _tr('Ok')]
     );
     }
     return false;
     }
     return false;
     }, // callback
     _tr('Vendas'), // title
     [_tr('Não'), _tr('Ok')]
     );
     return false;
     */
    let caux = '<span style="font-size: 1.5em;">' + _tr("Mantem cliente para a próxima nota") + " ?</span>";
    bootbox.confirm({
        message: caux,
        colorType: "primary",
        sound: "primary",
        defaultConfirm: false,
        callback: function (e) {
            if (e) {
                nloja = nloj;
                nlojacor = nlojacor_ant;

                $("#lj_loja").val(nloja);
                $("#lj_lojacor").val(nlojacor);
                $("#lj_loja").change();
                $("#lj_lojacor").change();
                $("#lj_lojacor").val(nlojacor);
                VeCliente(ncli, '');
                if (cplaca_ant) {
                    bootbox.confirm({
                        message: _tr("Mantem Veículo para a próxima nota") + " ?",
                        colorType: "primary",
                        sound: "primary",
                        function(e) {
                            if (e) {

                                $("#vc_placa").val(cplaca_ant);
                                $("#vc_buscar_placa").click();
                                return false;
                            }
                            return false;
                        } // callback
                    });

                }
            }
        }
    });
    return false;
}

function VeEstatus() {
    var cestatus = '';
    if ($('#lj_ck_n1').prop('checked')) {
        cestatus = cestatus + '<img class="img_size" src="img/paraguay.png" style="height: ' + $("#img_nacionalidade").css('height') + ';">';
    } else {
        cestatus = cestatus + '<img class="img_size" src="img/mundo.png" style="height: ' + $("#img_nacionalidade").css('height') + ';">';
    }


    cestatus = cestatus + (nserie + 1) + "-";
    var cclass = 'primary';
    if (nModoOpe == 0) {
        $("#pd_consulta").show();
        $("#pd_consulta1").hide();
        if (nloja == 0) {
            if (!lSemLoja) { //        semloja
                $("#pd_consulta").hide();
                $("#pd_consulta1").show();
            }
            cestatus = cestatus + _tr('Esperando LOJA');
            cclass = 'warning';
        } else if (aprodutos.length == 0) {
            cestatus = cestatus + _tr('Esperando INICIAR') + ' ' + (!lorc ? _tr('VENDA') : _tr("ORÇAMENTO"));
            cclass = 'primary';
        } else if (aprodutos.length > 0) {
            cestatus = cestatus + (!lorc ? _tr('VENDA iniciada') : _tr('ORÇAMENTO iniciado'));
            cclass = 'success';
        }
        if (ncliente == 0) {
            cestatus = cestatus + ' - ' + _tr('Cliente não informado')
            if (cclass == 'success') {
                cclass = 'primary';
            }
        } else if (lclibloq) {
            cestatus = cestatus + ' - ' + _tr('Cliente bloqueado')
            cclass = 'danger';
        }
        $("#estatus").removeClass("text-primary bg-primary text-warning bg-warning text-success bg-success text-danger bg-danger");
        $("#estatus").addClass("text-" + cclass + " bg-" + cclass);
        $("#estatus").html(cestatus);
        $("#ft_vendedor").html(_tr(" Vend") + ": " + nvendedor + "-" + cvendedor + _tr("  Lj") + ": " + $("#lj_loja :selected").text());
        if ($('#lj_ck_p3').prop("checked")) {
            $("#lj_prazo").show();
        } else {
            $("#lj_prazo").hide();
        }
        CarregaSerie();
    } else {
        $("#ft_vendedor").html(aOperadorRec[0] + "-" + aOperadorRec[1]);
        cestatus = "";
        if ($("#cx_conta").val() == 0) {
            cestatus = cestatus + " " + _tr("Esperado Conta");
        } else if ($("#cx_hist").val() == 0) {
            cestatus = cestatus + " " + _tr("Esperado Histórico");
        } else if (aNotasRec.length == 0) {
            cestatus = cestatus + " " + _tr("Esperado Nota");
        } else if (aNotasRec.length == 1) {
            cestatus = cestatus + " 1 " + _tr("Nota Carregada");
        } else if (aNotasRec.length > 1) {
            cestatus = cestatus + " " + aNotasRec.length + " " + _tr("Notas Carregadas");
        }
        $("#estatus").html(cestatus);
        if (aNotasRec.length > 0 && $("#cx_banco").val() > 0) {
            $("#cx_row_finalizar").show();
            $("#cx_row_finalizar1").show();
            if (aBancosRec[$("#cx_banco").val()] < 2) {
                $("#cx_row_finalizar_tar").show();
                $("#cx_tar_bandeira").val(0);
                $("#cx_tar_bandeira").change();
                $("#cx_pix_rec").hide();
            } else {
                $("#cx_row_finalizar_tar").hide();
                $("#cx_pix_rec").show();
            }
        } else {
            $("#cx_row_finalizar").hide();
            $("#cx_row_finalizar1").hide();
            $("#cx_row_finalizar_tar").hide();
        }
        if (aNotasRec.length >= nLimiteNotasRec) {
            $("#cx_buscar_cliente").prop("disabled", true);
            $("#cx_buscar_cliente_limpar").prop("disabled", true);
            $("#cx_ccliente").prop("disabled", true);
        } else {
            $("#cx_buscar_cliente").prop("disabled", false);
            $("#cx_buscar_cliente_limpar").prop("disabled", false);
            $("#cx_ccliente").prop("disabled", false);
        }
    }

//    $("#tabven").css("margin-top",$("#estatus").height());
    $("#tabven").css("margin-top", $("#estatus").height());
}
function MudaLoja() {
    var nlj = parseInt($("#lj_loja").val());


    if (nloja != NaN && nlj != NaN) {
        if (nlj == nloja) {
            return;
        }
    }
    nloja = nlj;

    MudaCampo();
    VeEstatus();
    return false;
}
function MudaLojaCor() {
    var nlj = parseInt($("#lj_lojacor").val());
    if (nlojacor != NaN && nlj != NaN) {
        if (nlj == nlojacor) {
            return;
        }
    }
    nlojacor = nlj;

    MudaCampo();
    return false;
}
function MudaMoeda(nmoe, lForce) {

    if (!lForce && (nmoe == nmoeda || nloja == 0)) {
        return;
    }
    nmoeda = nmoe;
    MudaCampo();
    $("#lj_moeda").html(amoeda[nmoeda - 1][0]);
    $("#fn_moeda").html(amoeda[nmoeda - 1][0]);
    $("#vd_moeda").html(amoeda[nmoeda - 1][0]);
    $("#fn_moeda").html(amoeda[nmoeda - 1][0]);
    if (amoeda[nmoeda - 1][2] == 2) {
        $('#vd_quant_valor').mask('######0,00', {reverse: true});
    } else {
        $('#vd_quant_valor').mask('#########0', {reverse: true});
    }
    PdBuscar();
    MostraProdutos();
}
function MudaPagamento(npag) {
    if (nloja == 0) {
        return;
    }
    $("#fn_pagamento").html(npag == 3 ? "Prazo" + " - " + $("#lj_prazo").val() + " dias" : (npag == 2 ? _tr("Cartão de Crédito") : _tr("Dinheiro")));
    if (npag == 3) {
        $("#lj_prazo").css("display", "block");
    } else {
        $("#lj_prazo").css("display", "none");
    }
    MudaCampo();
}
function MudaNacionalidade(nnasc) {
    $("#fn_nacionalidade").html(nnasc == 2 ? _tr("Estrangeiro") : _tr("Paraguaio"));
    MudaCampo();
    PdBuscar();
    VeEstatus();
    if (nloja == 0) {
        return;
    }
}
//muda o campo no arquivo tablet_cab
function MudaCampo() {
    if (nModoOpe == 0) {
        $.ajax({
            method: "POST",
            url: curl + "vendas.php",
            cache: false,
            async: false, //espera o retorno
            timeout: nTimeOut,
            data: {lj_preco: lj_preco, sid: sid, modo: 1
                , vendedor: vendedor
                , moeda: nmoeda
                , nacionalidade: $('#lj_ck_n1').prop("checked")
                , pagamento: ($('#lj_ck_p3').prop("checked") ? 3 : ($('#lj_ck_p2').prop("checked") ? 2 : 1))
                , loja: nloja
                , lojacor: nlojacor
                , seguro: (lseguro ? 1 : 0)
                , cliente: ncliente
                , orcamento: lorc
                , serie: nserie
                , prazo: ($('#lj_ck_p3').prop("checked") ? $("#lj_prazo").val() : 0)
                , prisma: $("#vc_prisma").val()
                , placa: $("#vc_placa").val()
                , marca: $("#vc_marca").val()
                , modelo: $("#vc_modelo").val()
                , cor: $("#vc_cor").val()
                , classe: $("#vc_classe").val()
                , tipo: $("#vc_tipo").val()
                , kilomet: $("#vc_kilomet").val()
                , ano: $("#vc_ano").val()
                , voucher: $("#lj_voucher").val()
            }
        }).done(function (e) {
            var aret = JSON.parse(e);
            if (!VeSid(aret)) {
                return false;
            }
            if (aret.erro != '00') {
                navigator.notification.alert(
                        aret.cerro, // message
                        function () {
                        }, // callback
                        _tr('Vendas'), // title
                        'Ok'                  // buttonName
                        );
                return false;
            }
            return false;
        }).fail(function (e, d) {
            navigator.notification.alert(
                    _tr('Sem comunicação com o servidor') + ". . . .", // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
        });
    }
}

function ZerarNota() {
    $.ajax({
        method: "POST",
        url: curl + "index_c.php",
        cache: false,
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid, vendedor: vendedor, zerar: true, orcamento: lorc, serie: nserie}
    }).done(function (e) {
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }
        if (aret.erro == '99') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        VeEstatus();
        return false;
    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ". ..", // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
    });
}

function ReIniciar(lpergunta) {
    uaux = this;
    if (lpergunta) {
        //navigator.vibrate(1500);
        navigator.notification.confirm(
                _tr("Reinicia a nota") + " ?", // message
                function (e) {
                    if (e == 2) {
                        ReIniciar();
                        ZerarNota();
                    }
                    return false;
                }, // callback
                _tr('Vendas'), // title
                [_tr('Não'), _tr('Ok')]
                );
        return false;
    }
    /*
     var lpag_1 = window.localStorage.getItem("cecvendas" + nempresa + "_conf_pag_1") == "1";
     var lpag_2 = window.localStorage.getItem("cecvendas" + nempresa + "_conf_pag_2") == "1";
     var lpag_3 = window.localStorage.getItem("cecvendas" + nempresa + "_conf_pag_3") == "1";
     if (window.localStorage.getItem("cecvendas" + nempresa + "_refer") == "1") {
     */
    var lpag_1 = veconfig["conf_pag_1"] == "1";
    var lpag_2 = veconfig["conf_pag_2"] == "1";
    var lpag_3 = veconfig["conf_pag_3"] == "1";
    if (veconfig["refer"] == "1") {
        $("#pd_rbcodigo_r").show();
        $("#c_referencia").show();
    } else {
        $("#pd_rbcodigo_r").hide();
        $("#c_referencia").hide();

    }

    $("#lj_ck_p1").prop('disabled', !lpag_1);
    $("#lj_ck_p2").prop('disabled', !lpag_2);
    $("#lj_ck_p3").prop('disabled', !lpag_3);
    $("#lj_pagamento_cab").show();
    if (lpag_1 && !lpag_2 && !lpag_3) {
        $("#lj_ck_p1").prop('checked', true);
        $("#lj_pagamento_cab").hide();
    } else if (!lpag_1 && lpag_2 && !lpag_3) {
        $("#lj_ck_p2").prop('checked', true);
        $("#lj_pagamento_cab").hide();
    } else if (!lpag_1 && !lpag_2 && lpag_3) {
        $("#lj_ck_p3").prop('checked', true);
        $("#lj_pagamento_cab").hide();
    } else {
        $("#lj_ck_p1").prop('checked', true);
    }

    if (!lpag_1) {
        $("#lj_ck_p1").hide();
        $("#lj_l_np1").hide();
    } else {
        $("#lj_ck_p1").show();
        $("#lj_l_np1").show();
    }
    if (!lpag_2) {
        $("#lj_ck_p2").hide();
        $("#lj_l_np2").hide();
    } else {
        $("#lj_ck_p2").show();
        $("#lj_l_np2").show();
    }
    if (!lpag_3) {
        $("#lj_ck_p3").hide();
        $("#lj_l_np3").hide();
    } else {
        $("#lj_ck_p3").show();
        $("#lj_l_np3").show();
    }
    $("#lj_ck_n1").prop("checked", true);
    //$("#lj_ck_p1").prop("checked", true);
    $("#lj_voucher").val("");
    $("#lj_guia").val("");
    $("#lj_ck_m" + nMoedaInicio).prop("checked", true);
    $("#lj_valor").html("");
    $("#cl_ft_1,#ft_1").attr("src", "img/noimage.png");
    $("#cl_ft_2,#ft_2").attr("src", "img/noimage.png");
    $('#tabven1').removeClass("active");
    $('#tabven2').removeClass("active");
    $('#tabven3').removeClass("active");
    $('#tabven4').removeClass("active");
    $('#tabven5').removeClass("active");
    $('#tabven6').removeClass("active");
    $('#tabven7').removeClass("active");
    $('#tabven1').addClass("active");
    LimpaCli();
    $("#pd_codigo").val("");
    $("#pd_nome").val("");
    $("#pd_table").html("");
    $("#vd_moeda").html("");
    $("#vd_itens").html("");
    $("#vd_total").html("");
    $("#vd_table").html("");
    $("#fn_obs").val("");
    //   $("#fn_finalizar").prop("disabled", true);

    $("#lj_loja").prop('disabled', false);
    $("#lj_ck_ven_ven").prop('disabled', false);
    $("#lj_ck_ven_orc").prop('disabled', false);
    $("#lj_ck_ven_orc_ven").prop('disabled', false);
    $("#lj_notaalt").val("");
    $("#lj_notaalt").prop('disabled', false);
    $("body").css("background", lorc ? "#ffffb3" : "#cce6ff");
    $("#lj_ck_ven_ven").prop('checked', !lorc);
    $("#lj_ck_ven_orc").prop('checked', lorc);
    $("#lj_prazo").hide();
    $("#lj_prazo").val('');
    //veiculo
    $("#vc_prisma").val("");
    $("#vc_placa").val("");
    $("#vc_marca").val("");
    $("#vc_modelo").val("");
    $("#vc_classe").val("");
    $("#vc_ano").val("");
    $("#vc_kilomet").val("");
    $("#vc_cor").val("");
    $("#vc_det").hide()

    //nmoeda = 1;
    //nmoeda = window.localStorage.getItem("cecvendas" + nempresa + "_moedaini");
    nmoeda = veconfig["moedaini"];
    if (!nmoeda || nmoeda == 0) {
        nmoeda = 1;
    }
    $("#lj_ck_m" + nmoeda).click();
    AjustaConfig();
    nloja = 0;
    if (aloja.length == 1) {
        nloja = aloja[0][0];
        if (typeof nloja === 'string' || nloja instanceof String) {
            nloja = parseInt(nloja);
        }
    }

    ncliente = 0;
    aprodutos = [];
    aconsulta = [];
    lseguro = false;
    lDistribuidor = 9999999999;
    nClienteAnterior = 0;
    //ler o config
    /*
     var aret;
     $.ajax({
     method: "POST",
     url: curl + "index_c.php",
     async: false,
     cache: false,
     timeout: nTimeOut,
     data: {sid: sid, modo: "VE_CONFIG"}
     }).done(function (e) {
     aret = JSON.parse(e);
     aConfig = aret;
     }).fail(function (e, d) {
     aConfig = {};
     });
     */
    if (aConfig.FAT_SFOTO == "S") {
        nLimiteFoto = 9999999999;
    } else {
        //nLimiteFoto = parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_limitefoto"));
        nLimiteFoto = parseInt(veconfig["limitefoto"]);
    }
// VER CUSTOS
    lvercusto = false;
    $.ajax({
        method: "POST",
        url: curl + "vendas.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid, vendedor: vendedor, modo: "VE_AUT_NIVEL", orcamento: lorc, serie: nserie, senha: 66}
    }).done(function (e) {
        var aret = JSON.parse(e);
        lvercusto = aret.aut == "X";
        larre_pre = aret.arre_pre == "S";
    }).fail(function (e, d) {
    });
    $.ajax({
        method: "POST",
        url: curl + "index_c.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid, vendedor: vendedor, loja: true, orcamento: lorc, serie: nserie}
    }).done(function (e) {
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }

        if (aret.erro == '99') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
//variaveis de estoque
        lSemEstLoj = aret.semesto == "S";
        lSemEstGer = aret.semeger == "S";
        aloja = aret.aloja;
        nmodpedi = aret.modpedi;

        $('#lj_loja').empty();
        if (aloja.length > 1) {
            $('#lj_loja').append($('<option>', {
                value: 0,
                text: ''
            }));
            $('#lj_loja_cab').show();
        } else {
            $('#lj_loja_cab').hide();
        }
        for (var i = 0; i < aloja.length; i++) {
            $('#lj_loja').append($('<option>', {
                value: aloja[i][0],
                text: aloja[i][0] + '-' + aloja[i][1]
            }));
        }
        //loja correlativa
        alojacor = aret.alojacor;
        $('#lj_lojacor').empty();
        if (alojacor.length > 1) {
            $('#lj_lojacor').append($('<option>', {
                value: 0,
                text: ''
            }));
            $('#lj_lojacor_cab').show();
        } else {
            $('#lj_lojacor_cab').hide();
        }
        if (alojacor.length > 0) {
            for (var i = 0; i < alojacor.length; i++) {
                $('#lj_lojacor').append($('<option>', {
                    value: alojacor[i][0],
                    text: alojacor[i][0] + '-' + alojacor[i][1]
                }));
            }
        }
        if (alojacor.length == 1) {
            $('#lj_lojacor').val(alojacor[0][0]);
        }
//zona 
        azona = aret.azona;
        nmodpedi = aret.modpedi;
        $('#cl_zona').empty();
        for (var i = 0; i < azona.length; i++) {
            $('#cl_zona').append($('<option>', {
                value: azona[i][0],
                text: azona[i][0] + '-' + azona[i][1]
            }));
        }

        if (azona.length > 0) {
            $('#cl_zona').val(azona[0][0]);
        }



        amoeda = aret.amoeda;
        $("#lj_moeda").html(amoeda[0][0]);
        $("#fn_moeda").html(amoeda[0][0]);
        for (var i = 0; i < 4; i++) {
            if (amoeda[i][0] == 'US$' || amoeda[i][0] == 'U$' || (amoeda[i][1]).substr(0, 5) == 'DOLAR') {
                $("#mi" + (i + 1)).prop("src", "img/usa.png");
                $("#cx_m" + (i + 1)).prop("src", "img/usa.png");
            } else if (amoeda[i][0] == 'R$' || amoeda[i][0] == 'RS$' || (amoeda[i][1]).substr(0, 3) == 'REA') {
                $("#mi" + (i + 1)).prop("src", "img/brazil.png");
                $("#cx_m" + (i + 1)).prop("src", "img/brazil.png");
            } else if (amoeda[i][0] == 'GS$' || amoeda[i][0] == 'G$' || amoeda[i][0] == 'GS' || (amoeda[i][1]).substr(0, 7) == 'GUARANI') {
                $("#mi" + (i + 1)).prop("src", "img/paraguay.png");
                $("#cx_m" + (i + 1)).prop("src", "img/paraguay.png");
            } else if (amoeda[i][0] == 'P$' || amoeda[i][0] == 'PS$' || (amoeda[i][1]).substr(0, 4) == 'PESO') {
                $("#mi" + (i + 1)).prop("src", "img/argentina.png");
                $("#cx_m" + (i + 1)).prop("src", "img/argentina.png");
            }

        }
        if (aloja.length == 1) {
            $("#lj_loja").val(aloja[0][0]);
            $("#lj_loja").change();
        }
        if (lpergunta) {
            $("#lj_loja").change();
            $("#lj_lojacor").change();
            return false;
        }
    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ".. .", // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
    });
}

function CarregaSerie() {
    /*
     for (var i = 1; i <= numnotas; i++) {
     $("#mn_1" + i).html(i);
     }
     */
    /*
     $('#mn_nota').empty();
     for (var i = 1; i <= numnotas; i++) {
     $('#mn_nota').append($('<option>', {
     value: i,
     text: i
     }));
     }
     */
    if (nModoOpe == 0) {
        $.ajax({
            method: "POST",
            url: curl + "vendas.php",
            async: true,
            cache: false,
            timeout: nTimeOut * 3,
            data: {sid: sid, lj_preco: lj_preco, vendedor: vendedor
                , modo: 57
                , orcamento: lorc
            }
        }).done(function (e) {
            var aret = JSON.parse(e);
            if (!VeSid(aret)) {
                return false;
            }
            if (aret.erro != '00') {
                navigator.notification.alert(
                        aret.cerro, // message
                        function () {

                        }, // callback
                        _tr('Vendas'), // title
                        'Ok'                  // buttonName
                        );
                return false;
            }
            /*
             for (var i = 0; i < numnotas; i++) {
             
             if (aret.pedido[i][1] > 0) {
             $("#mn_1" + (i + 1)).html((i + 1) + "**");
             } else if (aret.pedido[i][0] > 0) {
             $("#mn_1" + (i + 1)).html((i + 1) + "*");
             } else {
             $("#mn_1" + (i + 1)).html((i + 1) + "");
             }
             //$("#mn_1"+(i+1)).css("font-size","0.9em");
             $("#mn_1" + (i + 1)).removeClass("text-danger");
             $("#mn_1" + (i + 1)).addClass("text-primary");
             $("#mn_1" + (i + 1)).css("font-weight", "");
             $("#mn_1" + (i + 1)).css("text-decoration", "");
             }
             //$("#mn_1"+(nnota)).css("font-size","1.2em");
             $("#mn_1" + (nserie + 1)).addClass("text-danger");
             $("#mn_1" + (nserie + 1)).removeClass("text-primary");
             $("#mn_1" + (nserie + 1)).css("font-weight", "bold");
             $("#mn_1" + (nserie + 1)).css("text-decoration", "underline overline");
             */
            return false;
        }).fail(function (e, d) {
            $("#rl_emissao").html("");
            $("#rl_tabela").html("");
            navigator.notification.alert(
                    _tr('Sem comunicação com o servidor') + ".. ..", // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
        });
    }
}

function CarregaNota() {
    var nEspera = bootbox.espera({
        message: 'Carregando dados ...'
    });
    $.ajax({
        method: "POST",
        url: curl + "index_c.php",
        async: true,
        cache: false,
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid, vendedor: vendedor, carrega: true, orcamento: lorc, serie: nserie}
    }).done(function (e) {
        nEspera.modal("hide");
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            nEspera.modal("hide");
            return false;
        }
        if (aret.erro == '99') {
            nEspera.modal("hide");
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (aret.loja) {
            ncliente = aret.cliente;
            nloja = aret.loja;
            nlojacor = aret.lojacor;
            nmoeda = aret.moeda;
            $("#lj_lojacor").val(aret.lojacor);
            if (nmoeda == 0) {
                nmoeda = 1;
            }
            norc = aret.orcamento;
            if (typeof ncliente === 'string'
                    || ncliente instanceof String) {
                ncliente = parseInt(ncliente);
            }
            if (typeof nloja === 'string'
                    || nloja instanceof String) {
                nloja = parseInt(nloja);
            }
            if (typeof nmoeda === 'string'
                    || nmoeda instanceof String) {
                nmoeda = parseInt(nmoeda);
            }
            if (typeof norc === 'string'
                    || norc instanceof String) {
                norc = parseInt(norc);
            }
            lorc = (norc == 1);
            lseguro = (parseInt(aret.seguro) == 1);
            $("#lj_ck_n" + aret.nacional).prop("checked", true);
            $("#lj_ck_p" + aret.pagament).prop("checked", true);
            $("#lj_voucher").val(aret.voucher);
            $("#lj_prazo").val(aret.prazo);
            $("#lj_ck_ven_ven").prop("checked", !lorc);
            $("#lj_ck_ven_orc").prop("checked", lorc);
            nlojacor = aret.lojacor;
            nloja = aret.loja;
            $("#lj_lojacor").val(aret.lojacor);
            $("#lj_loja").val(aret.loja);
            $("#lj_notaalt").val(poedigito(aret.notaalt));
            $("#lj_guia").val(aret.guia + '-' + aret.cguia);
            $("#lj_ck_m" + nmoeda).prop("checked", true);
            $("#lj_moeda").html(amoeda[nmoeda - 1][0]);
            $("#fn_moeda").html(amoeda[nmoeda - 1][0]);
            $("#lj_valor").html(NumberFormat(parseInt(aret.total), amoeda[nmoeda - 1][2]));
            //veiculo
            $("#vc_placa").val(aret.placa);
            $("#vc_marca").val(aret.marca);
            $("#vc_modelo").val(aret.modelo);
            $("#vc_cor").val(aret.cor);
            $("#vc_classe").val(aret.classe);
            $("#vc_tipo").val(aret.tipo);
            $("#vc_ano").val(aret.ano);
            $("#vc_kilomet").val(aret.kilomet);
            $("#vc_prisma").val(aret.prisma);
            if (!$("#vc_placa").val()) {
                $("#vc_det").hide();
            } else {
                $("#vc_det").show();
            }
        }
//Cliente
        $("body").css("background", lorc ? "#ffffb3" : "#cce6ff");
        $("#ft_vendedor").html("Vend: " + nvendedor + "-" + cvendedor + "  Lj: " + $("#lj_loja :selected").text());
        $("#cl_codigo").attr("disabled", false);
        VeCliente(parseInt(aret.cliente), '');
        //produtos
        aprodutos = aret.prod;
        /*caux ="";
         for (var i=0;i<aprodutos.length;i++){
         caux=caux+aprodutos[i][3]+"\n";
         }
         */
        agrade = aret.grade;
        MudaNacionalidade($("#lj_ck_n2").prop("checked") ? 2 : 1);
        MudaPagamento($("#lj_ck_p3").prop("checked") ? 3 : ($("#lj_ck_p2").prop("checked") ? 2 : 1));

        VeEstatus();
        $("#lj_ck_ven_ven").prop("disabled", parseInt(aret.codigos) > 0);
        $("#lj_ck_ven_orc").prop("disabled", parseInt(aret.codigos) > 0);
        $("#lj_ck_ven_orc_ven").prop("disabled", parseInt(aret.codigos) > 0);
        $("#lj_loja").prop("disabled", parseInt(aret.codigos) > 0);
        $("#lj_notaalt").prop("disabled", parseInt(aret.codigos) > 0);
        MostraProdutos();
        CarregaHistorico();
        MudaMoeda(nmoeda, true);
        //if (parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_vei")) == 1) {
        if (parseInt(veconfig["vei"]) == 1) {
            VeiculoLeFoto();
        }
        $("#lj_ck_p" + aret.pagament).prop("checked", true);
        $("#lj_prazo").val(aret.prazo);
        MudaCampo();
        nEspera.modal("hide");
        return false;
    }).fail(function (e, d) {
        nEspera.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + "... .", // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
    });
}
function VeCambio() {
    var adias = [];
    $.ajax({
        method: "POST",
        url: curl + "index_c.php",
        cache: false,
        async: false,
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid, cambio: true, orcamento: lorc, serie: nserie}
    }).done(function (e) {
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }
        if (aret.erro == '99') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        amoeda = aret.amoeda;
        for (var i = 0; i < 4; i++) {
            if (amoeda[i][0] == 'US$' || amoeda[i][0] == 'U$' || (amoeda[i][1]).substr(0, 5) == 'DOLAR') {
                $("#mi" + (i + 1)).prop("src", "img/usa.png");
                $("#cx_m" + (i + 1)).prop("src", "img/usa.png");
            } else if (amoeda[i][0] == 'R$' || amoeda[i][0] == 'RS$' || (amoeda[i][1]).substr(0, 3) == 'REA') {
                $("#mi" + (i + 1)).prop("src", "img/brazil.png");
                $("#cx_m" + (i + 1)).prop("src", "img/brazil.png");
            } else if (amoeda[i][0] == 'GS$' || amoeda[i][0] == 'G$' || amoeda[i][0] == 'GS' || (amoeda[i][1]).substr(0, 7) == 'GUARANI') {
                $("#mi" + (i + 1)).prop("src", "img/paraguay.png");
                $("#cx_m" + (i + 1)).prop("src", "img/paraguay.png");
            } else if (amoeda[i][0] == 'P$' || amoeda[i][0] == 'PS$' || (amoeda[i][1]).substr(0, 4) == 'PESO') {
                $("#mi" + (i + 1)).prop("src", "img/argentina.png");
                $("#cx_m" + (i + 1)).prop("src", "img/argentina.png");
            }

        }
        adias = aret.amoedaant;
        return adias;
    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ".... .", // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
    });
    return adias;
}

function m_cambio(cstr) {
    bootbox.alert({
        message: cstr,
        colorType: "info",
        timeOut: 20000,
        callback: function (e) {
        }
    });
}

$("#i_cambio").on("click", function () {
    var adias = VeCambio();
    var caux = '<table class="table table-bordered">';
    for (var i = 0; i < amoeda.length; i++) {
        caux = caux + '<tr><td class="row"><img class="img_size" width="' + ($("#mn_1").width() * 2) + 'px" src="';
        if (amoeda[i][0] == 'US$' || amoeda[i][0] == 'U$' || (amoeda[i][1]).substr(0, 5) == 'DOLAR') {
            caux = caux + "img/usa.png";
        } else if (amoeda[i][0] == 'R$' || amoeda[i][0] == 'RS$' || (amoeda[i][1]).substr(0, 3) == 'REA') {
            caux = caux + "img/brazil.png";
        } else if (amoeda[i][0] == 'GS$' || amoeda[i][0] == 'G$' || amoeda[i][0] == 'GS' || (amoeda[i][1]).substr(0, 7) == 'GUARANI') {
            caux = caux + "img/paraguay.png";
        } else if (amoeda[i][0] == 'P$' || amoeda[i][0] == 'PS$' || (amoeda[i][1]).substr(0, 4) == 'PESO') {
            caux = caux + "img/argentina.png";
        }
        caux = caux + '" alt=""></td><td>' + amoeda[i][1] + '</td><td>' + amoeda[i][0] + "</td><td>" + NumberFormat(amoeda[i][3], amoeda[i][2]) + '</td>\
        <td onclick="m_cambio(\'<table class=table><tr><td colspan=3>' + amoeda[i][0] + '</td></tr>';
        var nind = 0;
        for (var x = 0; x < adias.length; x++) {
            caux = caux + '<tr><td>' + adias[x][4] + '</td>';
            caux = caux + '<td >' + NumberFormat(adias[x][i], amoeda[i][2]) + '</td>';
            if (x < adias.length - 1) {
                nind = (((adias[x][i] * 100) / (adias[x + 1][i] * 100)) * 100);
                caux = caux + '<td>' + (nind == 100 ? '' : (NumberFormat(nind - 100, 2) + " %")) + '</td>';
            } else {
                caux = caux + "<td></td>";
            }
            caux = caux + '</tr>';
        }
        caux = caux + '</table>\')">';
        if (amoeda[i][3] < adias[1][i]) {
            caux = caux + '<i class="fas fa-arrow-alt-circle-down form-cli" style="color: red;"></i></td>';
        } else if (amoeda[i][3] > adias[1][i]) {
            caux = caux + '<i class="fas fa-arrow-alt-circle-up form-cli" style="color: #ffad33;"></i></td>';
        } else {
            caux = caux + '<i class="fab fa-creative-commons-nd form-cli" style="color: green;"></i></td>';
        }


        caux = caux + "</td></tr>";
    }
    caux = caux + "</table>";
    bootbox.alert({
        message: caux,
        colorType: "warning",
        timeOut: 20000,
        callback: function (e) {
        }
    });
});
function Imprime2(ccab, aqr, ccorpo, crod) {
    var caux = aqr[0];
    var cimg = "";
    $.ajax({
        method: "POST",
        url: curl + "img/logoimp.php",
        async: false,
        cache: false,
        timeout: nTimeOut * 5,
        data: {sid: sid}
    }).done(function (e) {
        if (e) {
            cimg = e;
        }

    }).fail(function (e, d, f) {
    });
    Imprime2_1(caux, cimg, ccab, aqr, ccorpo, crod);
    /*
     navigator.notification.confirm(
     "Imprimir Novamente ?", //+aret.mensagem, // message
     function (e) {
     if (e == 1) {
     Imprime2_1(caux, cimg, aqr, ccorpo, crod);
     navigator.notification.confirm(
     "Imprimir Novamente ?", //+aret.mensagem, // message
     function (e) {
     if (e == 1) {
     Imprime2_1(caux, cimg, aqr, ccorpo, crod);
     }
     }, // callback
     _tr('Vendas'), // title
     ["Sim", "Não"]               // buttonName
     );
     }
     }, // callback
     _tr('Vendas'), // title
     ["Sim", "Não"]               // buttonName
     );
     //}
     //ImpQr1();
     */

}
function Imprime2_1(caux, cimg, ccab, aqr, ccorpo, crod, nvia) {
    if (!nvia) {
        nvia = 1;
    }
    if (nvia > 1) {
        crod = crod + "\n **** Via: " + nvia + " ****";
    }
    if (caux) {
        BTPrinter.connect(function (data) {
            BTPrinter.printQrCode(function (data) {
                sleep(2000);
                BTPrinter.printText(function (data) {
                    BTPrinter.disconnect(function (data) {
                    }, function (err) {
                        alert(_tr("Erro desconectando impressora\n") + err);
                    });
                }, function (err) {
                    alert(_tr("Erro Imprimindo texto\n") + err);
                }, String.fromCharCode(27, 64, 27, 33, 8, 27, 97, 0) + ccab + ccorpo + crod + "\n\n\n\n\n");
            }, function (err) {
                alert(_tr("Erro Imprimindo QR\n") + err);
            }, caux, 1, 49, 32, 50);
        }, function (err) {
            alert(_tr("Erro conectando à impressora\n") + err)
        }, "IposPrinter");
    } else if (cimg) {

        BTPrinter.connect(function (data) {
            BTPrinter.printBase64(function (data) {
                sleep(2000);
                BTPrinter.printText(function (data) {
                    BTPrinter.disconnect(function (data) {
                    }, function (err) {
                        alert(_tr("Erro desconectando impressora\n") + err);
                    })
                }, function (err) {
                    alert(_tr("Erro Imprimindo texto\n") + err);
                }, String.fromCharCode(27, 64, 27, 33, 8, 27, 97, 0) + ccab + ccorpo + crod + "\n\n\n\n\n");
            }, function (err) {
                alert(_tr("Erro Imprimindo Imagem\n") + err)
            }, cimg, "1");
        }, function (err) {
            alert(_tr("Erro conectando à impressora\n") + err)
        }, "IposPrinter");

    } else {
        BTPrinter.connect(function (data) {
            BTPrinter.printText(function (data) {
                BTPrinter.disconnect(function (data) {
                }, function (err) {
                    alert(_tr("Erro desconectando impressora\n") + err);
                })
            }, function (err) {
                alert(_tr("Erro Imprimindo texto\n") + err);
            }, String.fromCharCode(27, 64, 27, 33, 8, 27, 97, 0) + ccab + ccorpo + crod + "\n\n\n\n\n");
        }, function (err) {
            alert(_tr("Erro conectando à impressora\n") + err)
        }, "IposPrinter");

    }
    navigator.notification.confirm(
            "Imprimir Novamente ?.", //+aret.mensagem, // message
            function (e) {
                if (e == 1) {
                    nvia = nvia + 1;
                    Imprime2_1(caux, cimg, ccab, aqr, ccorpo, crod, nvia);
                }
            }, // callback
            _tr('Vendas'), // title
            ["Sim", "Não"]               // buttonName
            );

}

function ImprimeNota2(aBar, aret, cCli, aImp, ntotal, ncliente_ant, nloja_ant, nespera, ncli) {
    var cnotas = '';
    for (var k = 0; k < (aret.nota).length; k++) {
        cnotas = cnotas + "\n" + (aret.nota[k] + 0) + "-" + digito(aret.nota[k]) + "      " + _tr("Pacote") + ":" + aret.pacote[k];
    }
    /*
     navigator.notification.confirm(
     (!lorc ? "VENDA FINALIZADA" : "ORÇAMENTO FINALIZADO") + " COM SUCESSO\n\nNota nº " + cnotas, //+aret.mensagem, // message
     function (nresp) {
     $('.nav-tabs a[href="#loja"]').tab('show');
     if (nresp == 1) {
     //IMPRIMIR NA IMPRESSORA
     */
    $.ajax({
        method: "POST",
        url: curl + "vendas.php",
        async: true,
        cache: false,
        timeout: nTimeOut * 5,
        data: {sid: sid, lj_preco: lj_preco, imprimir: true, orcamento: lorc, serie: nserie, nota: aret.nota[k]}
    }).done(function (e) {
        var aret1 = JSON.parse(e);
        //if (nresp == 1) {
        var ccab = '';
        for (var i = 0; i < (aret1.cab).length; i++) {
            ccab = ccab + aret1.cab[i] + "\n";
        }

        var crod = '';
        for (var i = 0; i < (aret1.rod).length; i++) {
            crod = crod + aret1.rod[i] + "\n";
        }

        var ccorpo = '';
        var aqr = [];
        for (var k = 0; k < (aret.nota).length; k++) {
            //ccorpo = ccorpo + "\n" + _tr("Nota") + ": " + String.fromCharCode(29, 33, 8) + aret.nota[k] + "-" + digito(aret.nota[k]) + String.fromCharCode(29, 33, 0);
//            if (parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_qrcode")) == 1) {
            if (parseInt(veconfig["qrcode"]) == 1) {
                aqr.push(poedigito(aret.nota[k]));
            }
        }
        ccorpo = ccorpo + "\n" + _tr("Emi") + ".: " + aret.emissao + "\n";
        ccorpo = ccorpo + _tr("Cli") + ".: " + cCli + "\n\n";
        var cpro = '';
//        if (parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_impprod")) == 1) {
        if (parseInt(veconfig["impprod"]) == 1) {
            ccorpo = ccorpo + "\n " + _tr("QUANT PRODUTO") + "\n";
            for (var i = 0; i < aImp.length; i++) {
                ccorpo = ccorpo + "------ -------------------------\n";
                var cnome = (aImp[i][1]).trim().replace("    ", " ").replace("   ", " ").replace("  ", " ").replace("  ", " ").replace("  ", " ").replace("  ", " ");
                cpro = ('000000' + aImp[i][2]).substr(-6) + " " + poedigito(aImp[i][0]) + '-' + cnome + "\n";
                ccorpo = ccorpo + cpro;
            }
            ccorpo = ccorpo + '----------------------------\n';
            cpro = _tr("Total") + ": " + String.fromCharCode(29, 33, 8) + (amoeda[0][0]) + " " + NumberFormat(ntotal, amoeda[0][2]) + String.fromCharCode(29, 33, 0) + "\n";
            ccorpo = ccorpo + cpro;
        }

        Imprime2(ccab, aqr, ccorpo, crod);

    }).fail(function (e, d, f) {
        nespera.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ' - ' + _tr('Finalizar') + ' \n' + d + "\n" + f, // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
    });
    /*
     }
     $('.nav-tabs a[href="#loja"]').tab('show');
     VeMantemCliente(ncliente_ant, nloja_ant);
     
     }, // callback
     _tr('Vendas'), // title
     ["Imprimir", "Compartilhar", 'Ok']                  // buttonName
     );
     */


}
function ImprimeNota1(aBar, aret, cCli, aImp, ntotal, ncliente_ant, nloja_ant, nespera, ncli) {
    //if (parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_barcode")) == 1) {
    if (parseInt(veconfig["barcode"]) == 1) {
        for (var k = 0; k < (aret.nota).length; k++) {
//                aBar.push('');
            var xhr1 = new XMLHttpRequest();
            xhr1.onload = function () {
                var reader = new FileReader();
                reader.onloadend = function () {
                    var caux = reader.result;
                    caux = caux.substr(22);
                    aBar.push(caux);
                }
                reader.readAsDataURL(xhr1.response);
            };
            xhr1.open('GET', curl + "barcode/barcode.php?code=" + aret.nota[k] + "&mode=bmp&scale=4");
            xhr1.responseType = 'blob';
            xhr1.send();
            sleep(1000);
        }
    }
    if (!cBmp) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                cBmp = reader.result;
                cBmp = cBmp.substr(27);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', "img/cab" + ncli + ".bmp");
        xhr.responseType = 'blob';
        xhr.send();
        sleep(1000);
    }
    var cnotas = '';
    for (var k = 0; k < (aret.nota).length; k++) {
        cnotas = cnotas + "\n" + (aret.nota[k] + 0) + "-" + digito(aret.nota[k]) + "      " + _tr("Pacote") + ":" + aret.pacote[k];
    }
    $.ajax({
        method: "POST",
        url: curl + "vendas.php",
        async: true,
        cache: false,
        timeout: nTimeOut * 5,
        data: {sid: sid, lj_preco: lj_preco, imprimir: true, orcamento: lorc, serie: nserie}
    }).done(function (e) {
        var aret1 = JSON.parse(e);
        if (cBmp.length > 0) {
            window.sunmiInnerPrinter.printBitmap(cBmp, 216, 120);
            sleep(1000);
        }
        var ccab = '\n';
        for (var i = 0; i < (aret1.cab).length; i++) {
            ccab = ccab + aret1.cab[i] + "\n";
        }

        var crod = '';
        for (var i = 0; i < (aret1.rod).length; i++) {
            crod = crod + aret1.rod[i] + "\n";
        }

        window.sunmiInnerPrinter.printTextWithFont(ccab, "Arial", 32);
        sleep(50);
        for (var k = 0; k < (aret.nota).length; k++) {
            window.sunmiInnerPrinter.printTextWithFont("\n" + _tr("Nota") + ": " + aret.nota[k] + "-" + digito(aret.nota[k]) + "\n", "Arial", 32);
            sleep(50);
            //if (parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_qrcode")) == 1) {
            if (parseInt(veconfig[ "qrcode"]) == 1) {
                window.sunmiInnerPrinter.printQRCode(poedigito(aret.nota[k]), 10, 4);
                sleep(1000);
            }

            //if (parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_barcode")) == 1) {
            if (parseInt(veconfig["barcode"]) == 1) {
                window.sunmiInnerPrinter.printBitmap(aBar[k], 324, 180);
                sleep(1000);
                window.sunmiInnerPrinter.printTextWithFont("\n", "Arial", 32);
            }
            window.sunmiInnerPrinter.printTextWithFont("\n", "Arial", 32);
        }
        window.sunmiInnerPrinter.printTextWithFont(_tr("Emi") + ".: " + aret.emissao + "\n", "Arial", 32);
        sleep(50);
        window.sunmiInnerPrinter.printTextWithFont(_tr("Cli") + ".: " + cCli + "\n\n", "Arial", 32);
        sleep(50);
        var cpro = '';
        //if (parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_impprod")) == 1) {
        if (parseInt(veconfig["impprod"]) == 1) {
            window.sunmiInnerPrinter.printTextWithFont("\n " + _tr("QUANT PRODUTO") + "\n", "Arial", 20);
            sleep(50);
            for (var i = 0; i < aImp.length; i++) {
                window.sunmiInnerPrinter.printTextWithFont("------ -------------------------------\n", "Arial", 20);
                sleep(50);
                var cnome = (((((((aImp[i][1]).trim()).replace("    ", " ")).replace("   ", " ")).replace("  ", " ")).replace("  ", " ")).replace("  ", " ")).replace("  ", " ");
                cpro = ('000000' + aImp[i][2]).substr(-6) + " " + poedigito(aImp[i][0]) + '-' + cnome + "\n";
                window.sunmiInnerPrinter.printTextWithFont(cpro, "Arial", 20);
                sleep(50);
            }
            window.sunmiInnerPrinter.printTextWithFont('----------------------------\n', "Arial", 26);
            sleep(50);
            cpro = _tr("Total") + ": " + (amoeda[0][0]) + " " + NumberFormat(ntotal, amoeda[0][2]);
            window.sunmiInnerPrinter.printTextWithFont(cpro, "Arial", 40);
            sleep(50);
        }
        window.sunmiInnerPrinter.printTextWithFont("\n\n" + crod + "\n\n\n\n", "Arial", 32);
    }).fail(function (e, d, f) {
        nespera.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ' - ' + _tr('Finalizar') + ' \n' + d + "\n" + f, // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
    });
    /*
     }
     $('.nav-tabs a[href="#loja"]').tab('show');
     VeMantemCliente(ncliente_ant, nloja_ant);
     
     }, // callback
     _tr('Vendas'), // title
     ["Imprimir", 'Ok']                  // buttonName
     );
     */
}
function ImprimePdf(nNota) {
    var ncli = veconfig["cliente"];
    //var ncli = veconfig["cliente"];
    if (!ncli || ncli == '0') {
        ncli = '';
    }
    $.ajax({
        method: "POST",
        url: curl + "vendas.php",
        async: true,
        cache: false,
        timeout: nTimeOut * 5,
        data: {sid: sid, lj_preco: lj_preco, modo: 'NOTA_PDF', modelo: 1, orcamento: lorc, nota: nNota}
    }).done(function (e) {
        var aret = JSON.parse(e);
        var caux = aret.html;
        /*        
         const div = document.createElement('div');
         div.innerHTML = caux;
         document.body.appendChild(div);
         
         html2pdf()
         .set({
         margin: 10,
         filename: 'arquivo.pdf',
         html2canvas: { scale: 2 },
         jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
         })
         .from(div)
         .save()
         .then(() => div.remove());
         
         
         */
        if (veconfig["nomenota"]) {
            //caux = caux.replace('[[NOMEEMP]]', window.localStorage.getItem("cecvendas" + nempresa + "_nomenota"));
            caux = caux.replace('[[NOMEEMP]]', veconfig["nomenota"]);
        } else {
            caux = caux.replace('[[NOMEEMP]]', lorc ? _tr("Orçamento de Mercadorias") : _tr("Pedido de Mercadorias"));
        }
        if (!cLogoRel) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var reader = new FileReader();
                reader.onloadend = function () {
                    cLogoRel = reader.result;
                    caux = caux.replace('[[LOGOEMP]]', cLogoRel);
                    EviaPdfBySocial((lorc ? "oc_" : "nt_") + poedigito(nNota) + ".pdf", caux);
                }
                reader.readAsDataURL(xhr.response);
            };
            xhr.responseType = 'blob';
            xhr.open('GET', "img/cliente" + ncli + ".png", true);
            xhr.send();
        } else {
            caux = caux.replace('[[LOGOEMP]]', cLogoRel);
            EviaPdfBySocial((lorc ? "oc_" : "nt_") + poedigito(nNota) + ".pdf", caux);
        }
        /*
         navigator.notification.alert(
         'Escolha a forma de compartilhar o PDF', // message
         function () {
         }, // callback
         _tr('Vendas'), // title
         'Ok'                  // buttonName
         );
         */
    }).fail(function (e, d, f) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ' - ' + _tr('Finalizar') + ' \n' + d + "\n" + f, // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
    });
    /*
     var cHtml = '<html><head>\n\
     <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">\n\
     <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>\n\
     <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>\n\
     <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>\n\
     </head><body>';
     cHtml = cHtml + '<table class="table">';
     cHtml = cHtml + '<tr><th class="text-right">Nota : </th><td>' + aret.nota[k] + '-' + digito(aret.nota[k]) + '</td>\n\
     <th class="text-right">Emissão: </th><td> ' + aret1.nota["data"] + " " + aret1.nota["hora"] + "</td></tr></table>";
     cHtml = cHtml + '<table class="table table-striped">';
     cHtml = cHtml + cPdf;
     
     cHtml = cHtml + "</table></body></html>";
     EviaPdfBySocial("nt_" + poedigito(aret.nota[k]) + ".pdf", cHtml);
     */
}
var nNotaVant = 0;
var aNotaV = [];
function VeNotaV(nNota) {
    for (var i = 0; i < aNotaV.length; i++) {
        $("#ntv_" + aNotaV[i]).hide();
    }
    if (nNotaVant == nNota) {
        nNotaVant = 0;
        return;
    }
    nNotaVant = nNota;
    $.ajax({
        method: "POST",
        url: curl + "vendas.php",
        async: true,
        cache: false,
        timeout: nTimeOut * 5,
        data: {sid: sid, lj_preco: lj_preco, modo: "VENOTAV", nota: nNota}
    }).done(function (e) {
        var aret = JSON.parse(e);
        $("#ntv_" + nNota).show();
        $("#ntvc_" + nNota).html(aret.tabela);
    }).fail(function (e, d, f) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + '  \n' + d + "\n" + f, // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
    });
}

function AjustaConfig() {
    $.ajax({
        method: "POST",
        url: curl + "index_c.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {sid: sid, modo: "CONFIG"}
    }).done(function (e) {
        var aret = JSON.parse(e);
        if (aret.erro == '99') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        lcarga = (aret.carga == "S");
        if (lcarga) {
            $("#fn_carga").empty();
            $('#fn_carga').append($('<option>', {
                value: 0,
                text: _tr("Nenhuma")
            }));
            for (var i = 0; i < aret.acarga.length; i++) {
                $('#fn_carga').append($('<option>', {
                    value: aret.acarga[i][0],
                    text: aret.acarga[i][0] + ' - ' + aret.acarga[i][1]
                }));
            }
            $('#fn_comcarga').show();
        } else {
            $('#fn_comcarga').hide();
        }
        return false;
    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + ". ..", // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
    });
}


function ImprimeNotas(nNota) {



    //var nimp = parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_imp"));
    var nimp = parseInt(veconfig["imp"]);
    var aopcoes = ['Ok', 'Compartilhar'];
    //var cbema = window.localStorage.getItem("cecvendas" + nempresa + "_bema");
    //var cauto = window.localStorage.getItem("cecvendas" + nempresa + "_impauto");
    var cbema = veconfig["bema"];
    var cauto = (imp_web ? imp_web : veconfig["impauto"]);
    /*
     if (cbema || cauto) {
     nimp = 0;
     aopcoes = ['Cancelar', _tr('Compartilhar'), _tr('Imprimir')];
     } else {
     if (nimp == 1) {
     aopcoes = ['Cancelar', _tr('Compartilhar'), _tr('Imprimir')];
     }
     }
     */
    if (nimp > 0) {
        if (cbema || cauto) {
            nimp = 0;
            aopcoes = ['Ok', _tr('Ver Web'), _tr('Imprimir')];
        } else {
            if (nimp == 1) {
                aopcoes = ['Ok', _tr('Ver WEb'), _tr('Imprimir')];
            }
        }
    } else {
        aopcoes = ['Ok', _tr('Ver WEb')];

    }

    var cnotas = nNota + "-" + digito(nNota);
    navigator.notification.confirm(
            "Nota  nº" + cnotas, //+aret.mensagem, // message
            function (e) {
                if (e == 2) {
                    ImprimePdf(nNota);
                } else if (e == 3) {
                    var caux = cbema ? cbema : cauto;
                    if (caux) {
                        var aimp = caux.split("-");
                        //var nvias = parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_bema_vias"));
                        var nvias = parseInt(veconfig["bema_vias"]);
                        if (nvias == 0) {
                            nvias = 1;
                        }
                        var caux = _tr('Escolha a impressora') + ':<br><select id="ibema">  ';
                        for (var ii = 0; ii < aimp.length; ii++) {
                            var nbema = (aimp[ii]).split(",");
                            caux = caux + '<option value="' + nbema[0] + '" > ' + aimp[ii] + '</option>';
                        }
                        caux = caux + "</select>";
                        if (nvias > 1) {
                            caux = caux + '<br>' + _tr('Quantas vias') + '?:<br><select id="ibema_vias">  ';
                            for (var i = 1; i <= 5; i++) {
                                caux = caux + '<option value="' + i + '" ' + (nvias == i ? "selected" : "") + '> ' + i + '</option> ';
                            }
                            caux = caux + "</select>";
                        }
                        var aret = {nota: [nNota]};
                        ImprimeBema(caux, aimp, aret, 0, 0, '', cbema, true);
                    } else {
                        var caux = cbema ? cbema : cauto;
                        if (caux) {
                            var aimp = caux.split("-");
                            var caux = _tr('Escolha a impressora') + ':<br><select id="ibema">  ';
                            for (var ii = 0; ii < aimp.length; ii++) {
                                var nbema = (aimp[ii]).split(",");
                                caux = caux + '<option value="' + nbema[0] + '" > ' + aimp[ii] + '</option>';
                            }
                            caux = caux + "</select>";
                            bootbox.alert({
                                message: caux,
                                colorType: "success",
                                timeOut: (aimp.length == 1 ? 30 : 30000),
                                callback: function (e) {
                                    $.ajax({
                                        method: "POST",
                                        url: curl + "nota.php",
                                        async: false,
                                        cache: false,
                                        timeout: 10000,
                                        data: {sid: sid, nota: poedigito(nNota)
                                            , nmnt_imp: veconfig["nmnt_imp"]
                                            , nomeemp: veconfig["nomeemp"]
                                            , mostra_cot: veconfig["mostra_cot"]
                                            , lveiculo: veconfig["vei"]
                                            , ctipo: cbema ? "bema" : "auto"
                                            , cnomeimp: veconfig["bema"] + "-" + (imp_web ? imp_web : veconfig["impauto"])
                                        }
                                    }).done(function (e) {
                                        //return false;
                                    }).fail(function (e, d) {
                                        navigator.notification.alert(
                                                _tr('Sem comunicação com o servidor') + ". " + _tr('Adotando configurações local'), // message
                                                function () {
                                                    return false;
                                                }, // callback
                                                _tr('Vendas'), // title
                                                'Ok'                  // buttonName
                                                );
                                    });
                                }
                            });
                        }
                    }


                    /*
                     var caux = cbema ? cbema : cauto;
                     if (caux) {
                     var aimp = caux.split("-");
                     var caux = _tr('Escolha a impressora') + ':<br><select id="ibema">  ';
                     for (var ii = 0; ii < aimp.length; ii++) {
                     var nbema = (aimp[ii]).split(",");
                     caux = caux + '<option value="' + nbema[0] + '" > ' + aimp[ii] + '</option>';
                     }
                     caux = caux + "</select>";
                     bootbox.alert({
                     message: caux,
                     colorType: "success",
                     timeOut: (aimp.length == 1 ? 30 : 30000),
                     callback: function (e) {
                     $.ajax({
                     method: "POST",
                     url: curl + "nota.php",
                     async: false,
                     cache: false,
                     timeout: 10000,
                     data: {sid: sid,nota: poedigito(nNota)
                     , nmnt_imp: window.localStorage.getItem("cecvendas" + nempresa + "_nmnt_imp")
                     , nomeemp: window.localStorage.getItem("cecvendas" + nempresa + "_nomeemp")
                     , mostra_cot: window.localStorage.getItem("cecvendas" + nempresa + "_mostra_cot")
                     , lveiculo: window.localStorage.getItem("cecvendas" + nempresa + "_vei")
                     , ctipo: cbema ? "bema" : "auto"
                     , cnomeimp: window.localStorage.getItem("cecvendas" + nempresa + "_bema")+"-"+window.localStorage.getItem("cecvendas" + nempresa + "_impauto")
                     }
                     }).done(function (e) {
                     //return false;
                     }).fail(function (e, d) {
                     navigator.notification.alert(
                     _tr('Sem comunicação com o servidor') + ". " + _tr('Adotando configurações local'), // message
                     function () {
                     return false;
                     }, // callback
                     _tr('Vendas'), // title
                     'Ok'                  // buttonName
                     );
                     });
                     }
                     });
                     }
                     * 
                     */
                }
            }, // callback
            _tr('Vendas'), // title
            aopcoes                 // buttonName
            );
}




function ImprimeBema(caux, aimp, aret, ncliente_ant, nloja_ant, cplaca_ant, cbema, lreimp = false) {
//                                VeMantemCliente(ncliente_ant, nloja_ant, cplaca_ant);
    bootbox.alert({
        message: caux,
        colorType: "success",
        timeOut: (aimp.length == 1 ? 30 : 30000),
        callback: function (e) {
            for (var k = 0; k < (aret.nota).length; k++) {
                var pdata = {sid: sid, lj_preco: lj_preco, nota: poedigito(aret.nota[k]), orcamento: lorc, impressora: $("#ibema").val(), vias: $("#ibema_vias").val()
                    , nmnt_imp: veconfig["nmnt_imp"]
                    , nomeemp: veconfig["nomeemp"]
                    , mostra_cot: veconfig["mostra_cot"]
                    , lveiculo: veconfig["vei"]
                    , ctipo: cbema.trim() ? "bema" : "auto"
                    , cnomeimp: ((imp_web ? imp_web : veconfig["impauto"])).trim()
                    , lreimp: lreimp
                };
                $.ajax({
                    method: "POST",
                    url: curl + "nota.php",
                    async: false,
                    cache: false,
                    timeout: 10000,
                    data: pdata
                }).done(function (e) {
                    navigator.notification.confirm(
                            "Imprimir novamente ?..",
                            function (e) {
                                if (e == 1) {
                                    //VeMantemCliente(ncliente_ant, nloja_ant, cplaca_ant);

                                    return true;
                                } else {
                                    lreimp = true;
                                    ImprimeBema(caux, aimp, aret, ncliente_ant, nloja_ant, cplaca_ant, cbema, lreimp);
                                    return false;

                                }
                                return false;
                            }, // callback
                            _tr('Vendas'), // title
                            [_tr('Não'), _tr('Ok')]                  // buttonName
                            );
                }).fail(function (e, d) {
                    navigator.notification.alert(
                            _tr('Sem comunicação com o servidor') + ". " + _tr('Adotando configurações local'), // message
                            function () {
                                return false;
                            }, // callback
                            _tr('Vendas'), // title
                            'Ok'                  // buttonName
                            );
                    return true;
                });
                //return false;
            }
            //$('.nav-tabs a[href="#loja"]').tab('show');
            //VeMantemCliente(ncliente_ant, nloja_ant);
        }
    });
}
                            