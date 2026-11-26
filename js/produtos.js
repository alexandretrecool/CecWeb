var cvd_quant_enviar;
var aGradeAdd = [];
function AlteraItem(ncodigo, nquant, nvalor, niva) {
    //navigator.vibrate(100);
    if (lseguro) {
        navigator.notification.alert(
                _tr("Não se pode alterar o item quando está lançado seguro. Remova os itens ou reinicie a nota"), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }

    $.ajax({
        method: "POST",
        url: curl + "index_p.php",
        cache: false,
        async: false, //espera o retorno
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid, orcamento: lorc, serie: nserie, modo: 1, ncodigo: ncodigo, vendedor: vendedor, loja: nloja, altera: 1}
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

        $("#vd_quant_produto").html(poedigito(ncodigo) + '-' + aret.prod[0].nome + "<br>" + _tr("Saldo Loja") + ": " + (parseInt(aret.prod[0].saldo) + nquant) + "<br>" + _tr("Saldo Geral") + ": " + (parseInt(aret.prod[0].saldot) + nquant));
        $("#vd_codigo").val(ncodigo);
        $("#vd_quant_quant").val(nquant);

        $("#vd_custo").val(arre_pre(aret.prod[0].custo * aret.prod[0].iva));
        $("#vd_minimo").val(arre_pre(aret.prod[0].minimo * aret.prod[0].iva));
        $("#vd_venda").val(arre_pre(aret.prod[0].venda * aret.prod[0].iva));
        $("#vd_promo").val(arre_pre(aret.prod[0].preco5 * aret.prod[0].iva));

//        $("#vd_quant_valor").val(NumberFormat(amoeda[nmoeda - 1][3] * parseFloat(nvalor), amoeda[nmoeda - 1][2], ',', ''));
        $("#vd_quant_valor").val(NumberFormat(parseFloat(nvalor), amoeda[nmoeda - 1][2], ',', ''));
        $("#vd_quant_enviar").attr("onclick", "AdicionaItem1(" + ncodigo + "," + nquant + ",false," + aret.prod[0].quantmax + "," + aret.prod[0].iva + ")");
        $("#vd_quant").modal("show");
        $("#vd_quant_fundo").addClass("bg-danger");
        $("#vd_quant_enviar_preco").attr("onclick", "AdicionaItemPreco(" + ncodigo + "," + ncliente + "," + niva + ")");
        $("#vd_ult_venda").html('');

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


function RemoveItem(ncodigo, nquant) {
    //navigator.vibrate(1000);

    navigator.notification.confirm(
            _tr("Remover item da nota") + "  ?", // message
            function (e) {
                if (e == 2) {
                    $.ajax({
                        method: "POST",
                        url: curl + "vendas.php",
                        cache: false,
                        async: false, //espera o retorno
                        timeout: nTimeOut,
                        data: {lj_preco: lj_preco, sid: sid, orcamento: lorc, serie: nserie, modo: 3, ncodigo: ncodigo, nquant: nquant, loja: nloja, seguro: lseguro}
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
                        lseguro = false;
                        MudaCampo();
                        $("#pd_codigo").val("");
                        $("#pd_nome").val("");
                        PdBuscar();
                        CarregaNota();
                        $('.nav-tabs a[href="#venda"]').tab('show');

                    }).fail(function (e, d) {
                        navigator.notification.alert(
                                _tr('Sem comunicação com o servidor'), // messageq2
                                function () {
                                }, // callback
                                _tr('Vendas'), // title
                                'Ok'                  // buttonName
                                );
                    });
                }
                return false;
            }, // callback
            _tr('Vendas'), // title
            [_tr('Não'), 'Ok']
            );
    return false;


}
function AdicionaItemPreco(ncodigo, ncli, niva) {

    $.ajax({
        method: "POST",
        url: curl + "vendas.php",
        cache: false,
        async: false, //espera o retorno
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid, orcamento: lorc, serie: nserie, modo: "PRECO_VENDA", ncodigo: ncodigo, ncliente: ncli}
    }).done(function (e) {
        var aretc = JSON.parse(e);
        if (!VeSid(aretc)) {
            return false;
        }
        if (aretc.erro !== '00') {
            navigator.notification.alert(
                    aretc.cerro, // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        var ctab = '<table width="20px" class="table table-striped"><tr><th>' + _tr('Qua') + '</th><th>' + _tr('Preço') + '</th><th>' + _tr('Data') + '</th><th>' + _tr('Cliente') + '</th></tr>';
        for (var i1 = 0; i1 < aretc.preco.length; i1++) {
            var ccli = ''
            if (ncli == parseInt(aretc.preco[i1].codcli)) {
                ccli = 'bg-success';
            }
            ctab = ctab + '<tr><td class="text-center">' + parseInt(aretc.preco[i1].quant) + '</td><td class="text-right ' + ccli + '">' + NumberFormat(arre_pre(amoeda[nmoeda - 1][3] * parseFloat(aretc.preco[i1].valor * niva)), amoeda[nmoeda - 1][2], ',', '') + '</td>';
            ctab = ctab + '<td class="text-center">' + aretc.preco[i1].data + '</td><td class="text-left">' + aretc.preco[i1].cliente + '</td></tr>';
        }
        ctab = ctab + '</table>';
        $("#vd_ult_venda").html(ctab);
    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor'), // messageq2
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
    });
}
function AdicionaItem1(ncodigo, nquantant, ldireto, nquantmax, niva) {
    var nquant = $("#vd_quant_quant").val();
    aGradeAdd = [];
    if (!nquant) {
        nquant = 0;
    } else {
        nquant = parseInt(nquant);
    }
    if (nquant < 1) {
        navigator.notification.alert(
                _tr('Informe uma quantidade'), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }
    if (!ncodigo || ncodigo == 0) {
        ncodigo = parseInt($("#vd_codigo").val())
    }
    if (!nquantant) {
        nquantant = 0;
    }
    var cattr = $("#vd_quant_enviar_preco").attr("onclick");
    $.ajax({
        method: "POST",
        url: curl + "index_p.php",
        cache: false,
        async: true, //espera o retorno
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid
            , modo: 77
            , orcamento: lorc
            , serie: nserie
            , codigo: ncodigo
            , quant: nquant - nquantant
            , vendedor: vendedor
            , loja: nloja
        }
    }).done(function (e) {
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }
        if (aret.erro !== '00') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                        $("#vd_quant_enviar_preco").attr("onclick", cattr);
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (nquant - nquantant > aret.loja && !ldireto) {
            var cmen = '';

            if (_nIdioma == 1) {
                cmen = "Quantidade " + (lorc ? "orçada" : "vendida") + " => " + (nquant - nquantant) + "\nUltrapassa o estoque da loja => " + aret.loja + (lorc || lSemEstLoj ? "\n\nContinua assim mesmo ?" : "");
            } else if (_nIdioma == 2) {
                cmen = "Cantidade " + (lorc ? "en presupuesto" : "vendida") + " => " + (nquant - nquantant) + "\nUltrapasa el stock de la tienda => " + aret.loja + (lorc || lSemEstLoj ? "\n\nContinua ?" : "");
            } else if (_nIdioma == 3) {
                cmen = "Amount in " + (lorc ? "budget" : "sale") + " => " + (nquant - nquantant) + "\nexceeds the store stock => " + aret.loja + (lorc || lSemEstLoj ? "\n\nContinue ?" : "");
            }
            navigator.notification.confirm(
                    cmen, // message
                    function (e) {
                        if (e == 2) {
                            AdicionaItem2(ncodigo, nquantant, ldireto, nquantmax, niva, aret.loja, aret.geral);
                            $("#vd_quant_enviar_preco").attr("onclick", cattr);
                        }
                        return false;
                    }, // callback
                    _tr('Vendas'), // title
                    lorc || lSemEstLoj ? [_tr("Cancelar"), 'Ok'] : ["ok"]                  // buttonName
                    );
            return false;
        }
        AdicionaItem2(ncodigo, nquantant, ldireto, nquantmax, niva, aret.loja, aret.geral);
        $("#vd_quant_enviar_preco").attr("onclick", cattr);
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


    return;


}
function AdicionaItem2(ncodigo, nquantant, ldireto, nquantmax, niva, nEstLoj, nEstGer) {
    var nquant = parseInt($("#vd_quant_quant").val());
    aGradeAdd = [];
    if (nquant - nquantant > nEstGer) {
        var cmen = "";
        if (_nIdioma == 1) {
            cmen = "Quantidade " + (lorc ? "orçada" : "vendida") + " => " + (nquant - nquantant) + "\nUltrapassa o estoque GERAL => " + nEstGer + (lorc || lSemEstGer ? "\n\nContinua assim mesmo ?" : "");
        } else if (_nIdioma == 2) {
            cmen = "Cantidade " + (lorc ? "en presupuesto" : "vendida") + " => " + (nquant - nquantant) + "\nUltrapasa el stock GENERAL => " + nEstGer + (lorc || lSemEstGer ? "\n\nContinua ?" : "");
        } else if (_nIdioma == 3) {
            cmen = "Amount in " + (lorc ? "budget" : "sale") + " => " + (nquant - nquantant) + "\nexceeds the general stock => " + nEstGer + (lorc || lSemEstGer ? "\n\nContinue ?" : "");
        }

        /*
         if (_nIdioma == 1) {
         cmen = "Quantidade " + (lorc ? "orçada" : "vendida") + " => " + (nquant - nquantant) + "\nUltrapassa o estoque GERAL => " + aret.loja + (lorc || lSemEstLoj ? "\n\nContinua assim mesmo ?" : "");
         } else if (_nIdioma == 2) {
         cmen = "Cantidade " + (lorc ? "en presupuesto" : "vendida") + " => " + (nquant - nquantant) + "\nUltrapasa el stock GENERAL => " + aret.loja + (lorc || lSemEstLoj ? "\n\nContinua ?" : "");
         } else if (_nIdioma == 3) {
         cmen = "Amount in " + (lorc ? "budget" : "sale") + " => " + (nquant - nquantant) + "\nexceeds the general stock => " + aret.loja + (lorc || lSemEstLoj ? "\n\nContinue ?" : "");
         }
         */
        navigator.notification.confirm(
                cmen, // message
                function (e) {
                    if (e == 2) {
                        AdicionaItem3(ncodigo, nquantant, ldireto, nquantmax, niva);
                    }
                    return false;
                }, // callback
                _tr('Vendas'), // title
                lorc || lSemEstGer ? [_tr("Cancelar"), 'Ok'] : ["ok"]                  // buttonName
                );
        return false;
    }
    AdicionaItem3(ncodigo, nquantant, ldireto, nquantmax, niva);
    return false;
}

function AdicionaItem3(ncodigo, nquantant, ldireto, nquantmax, niva) {
    var nquant = parseInt($("#vd_quant_quant").val());
    //navigator.vibrate(100);
    var aGradeAdd = [];

    cvd_quant_enviar = $("#vd_quant_enviar").attr("onclick");


    $("#vd_quant_enviar").attr("onclick", "");

    if (!ncodigo || ncodigo == 0) {
        ncodigo = parseInt($("#vd_codigo").val())
    }
    var naux = $("#vd_quant_valor").val();
    var nvalor = parseFloat(naux.replace(",", "."));
    var naux = $("#vd_minimo").val();
    var nminimo = parseFloat(naux.replace(",", ".")) * amoeda[nmoeda - 1][3];
    var naux = $("#vd_venda").val();
    var nmaximo = parseFloat(naux.replace(",", ".")) * amoeda[nmoeda - 1][3];
    var naux = $("#vd_custo").val();
    var ncusto = parseFloat(naux.replace(",", ".")) * amoeda[nmoeda - 1][3];
    var naux = $("#vd_venda").val();
    var nvenda = parseFloat(naux.replace(",", "."));
    var naux = $("#vd_promo").val();
    var npromo = parseFloat(naux.replace(",", "."));
    var naux = $("#vd_atacado").val();
    var natacado = parseFloat(naux.replace(",", "."));
    if (!nvenda) {
        nvenda = 0;
    }
    //alerta(npromo+"||"+nvalor);
    if (npromo - 0.01 > nvalor) {
        navigator.notification.alert(
                _tr('Não pode ser vendido abaixo do valor promocional'), //+"|"+npromo+"|"+nvalor), // message
                function () {
                    $("#vd_quant_valor").focus();
                    $("#vd_quant_enviar").attr("onclick", cvd_quant_enviar);
                    return false;
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }
    //verificar se é paraguaio
    /*
     nvenda = Math.floor(nvenda * 100) / 100;
     nminimo = Math.floor(nminimo * 100) / 100;
     nvalor = Math.floor(nvalor * 100) / 100;
     */


    nvenda = Exato(nvenda, amoeda[nmoeda - 1][2]);
    nminimo = Exato(nminimo, amoeda[nmoeda - 1][2]);
    nvalor = Exato(nvalor, amoeda[nmoeda - 1][2]);
    ncusto = Exato(ncusto, amoeda[nmoeda - 1][2]);

    if (lClientePyFull) {
        nminimo = nvenda;
    }
    if (!nquantant) {
        nquantant = 0;
    }
    if (!ldireto) {
        ldireto = false;
    }

    if (nquant < 1) {
        navigator.notification.alert(
                _tr('Informe uma quantidade'), // message
                function () {
                    $("#vd_quant_enviar").attr("onclick", cvd_quant_enviar);
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }
    if (nvalor <= 0) {
        navigator.notification.alert(
                _tr('Informe uma Valor válido'), // message
                function () {
                    $("#vd_quant_enviar").attr("onclick", cvd_quant_enviar);
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;

    }
    if ($("#lj_ck_n1").prop("checked") && nmodpedi == 556) {
        nminimo = nvenda * amoeda[nmoeda - 1][3];
    }
    if (!ldireto && nvalor < nminimo && nguia > 0) {
        navigator.notification.alert(
                _tr("Preço abaixo do mínimo.\nEm venda com guia o preço não pode ser inferior ao mínimo."), // message
                function () {
                    $("#vd_quant_enviar").attr("onclick", cvd_quant_enviar);
                    return false;
                }, // callback
                _tr('Vendas'), // title
                [_tr('Não'), 'Ok']
                );
        return false;
    }
    //custo
    if (!ldireto && nvalor < ncusto && !$("#vd_quant_valor").prop("disabled") && aConfig.IGNOCUST !== 'S') { //custo
        nModoAutoriza = (nvalor == ncusto ? 72 : 58);
        var laut = VeAut(nModoAutoriza);
        var catacado='';
        if (natacado>0 && natacado>nvalor){
            laut=false;
            catacado='(Atacado)';
        }
        if (!laut) {
            navigator.notification.confirm(
                    _tr("Preço abaixo do mínimo "+catacado+".\nSolicita autorização ?"), // message
//                    _tr("Preço abaixo do mínimo.\nSolicita autorização ?"), // message
                    function (e) {
                        if (e == 2) {
                            AutorizaPreco(ncodigo, nquant, nvalor / amoeda[nmoeda - 1][3], nminimo / amoeda[nmoeda - 1][3], nvenda, nquantant, niva, ncusto);
                            return false;
                        } else {
                            $("#vd_quant_enviar").attr("onclick", cvd_quant_enviar);
                        }
                    }, // callback
                    _tr('Vendas'), // title
                    [_tr('Não'), 'Ok']
                    );
            return false;
        }
    } else if (!ldireto && nvalor < nminimo && !$("#vd_quant_valor").prop("disabled")) { //minimo
        nModoAutoriza = 88;
        var laut = VeAut(nModoAutoriza);
        if (!laut) {
            navigator.notification.confirm(
                    _tr("Preço abaixo do mínimo.\nSolicita autorização ?"), // message
                    function (e) {
                        if (e == 2) {
                            AutorizaPreco(ncodigo, nquant, nvalor / amoeda[nmoeda - 1][3], nminimo / amoeda[nmoeda - 1][3], nvenda, nquantant, niva, 0);
                            return false;
                        } else {
                            $("#vd_quant_enviar").attr("onclick", cvd_quant_enviar);
                        }
                    }, // callback
                    _tr('Vendas'), // title
                    [_tr('Não'), 'Ok']
                    );
            return false;
        }
    } else if (!ldireto && nvalor > nmaximo && !$("#vd_quant_valor").prop("disabled")) { //maximo
        nModoAutoriza = 421; //SAIDAS_PRV

        var laut = VeAut(nModoAutoriza);
        if (!laut) {
            navigator.notification.confirm(
                    _tr("Preço acima do normal.\nSolicita autorização ?"), // message
                    function (e) {
                        if (e == 2) {
                            AutorizaPreco(ncodigo, nquant, nvalor / amoeda[nmoeda - 1][3], nmaximo / amoeda[nmoeda - 1][3], nvenda, nquantant, niva, 0);
                            return false;
                        } else {
                            $("#vd_quant_enviar").attr("onclick", cvd_quant_enviar);
                        }
                    }, // callback
                    _tr('Vendas'), // title
                    [_tr('Não'), 'Ok']
                    );
            return false;
        }
    }
    //quantidade máxima
    if (!nquantmax) {
        nquantmax = 0;
    }
    if (!ldireto && nquant > nquantmax) {
        var laut = VeAut(413);
        if (!laut) {
            navigator.notification.confirm(
                    _tr("Venda acima da quantidade permitida.\nSolicita autorização ?"), // message
                    function (e) {
                        if (e == 2) {
                            AutorizaQuant(ncodigo, nquant, nvalor, nminimo, nvenda, nquantant, nquantmax, niva);
                            return false;
                        } else {
                            $("#vd_quant_enviar").attr("onclick", cvd_quant_enviar);
                        }
                    }, // callback
                    _tr('Vendas'), // title
                    [_tr('Não'), 'Ok']
                    );
            return false;
        }
    }

    GravaItem(ncodigo, nquant, nvalor, nquantant, 0, false, niva);

}
function GravaItem(ncodigo, nquant, nvalor, nquantant, nautoriza, lsemseguro, niva, lfinaliza) {
    if (!lfinaliza) {
        lfinaliza = false;
    }
//alerta("Valor : "+nvalor);    
    var nesperaG = bootbox.espera({message: _tr("Aguarde, Gravando dados")});
    nesperaG.modal("show");
    sleep(100);
    $.ajax({
        method: "POST",
        url: curl + "vendas.php",
        async: true, //espera o retorno
        cache: false,
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid, orcamento: lorc, serie: nserie, modo: "GRAVA_ITEM", ncodigo: ncodigo, nquant: nquant,
            nvalor: nvalor / amoeda[nmoeda - 1][3], vendedor: vendedor, loja: nloja, nquantant: nquantant, nautoriza: nautoriza,
            seguro: lsemseguro, iva: niva}
    }).done(function (e) {
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            nesperaG.modal("hide");
            return false;
        }
        if (aret.erro !== '00') {
            nesperaG.modal("hide");
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
            nesperaG.modal("hide");
        }
        $("#vd_quant").modal("hide");
        CarregaNota();
        if (aConfigTbl.MANTEMCON !== 'Y') {
            $("#pd_nome").val("");
//            CarregaNota();
            if (!lfinaliza) {
                $('.nav-tabs a[href="#venda"]').tab('show');
//                PdBuscar();
            }
        } else {
            var caux = $("#pd_nome").val();
//            CarregaNota();
            $("#pd_nome").val(caux);
            if (!lfinaliza) {
                $('.nav-tabs a[href="#produtos"]').tab('show');
                PdBuscar();
            }
        }


        nesperaG.modal("hide");

        //sos celular
        if (!lsemseguro) {
            SosCelular(ncodigo, nquant, nvalor);
        }
        $("#pd_nome").focus();
        return false;

    }).fail(function (e, d) {
        nesperaG.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor'), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
    });


}
function AdicionaGrade1(ncodigo, nseq1, nseq2, nquan, npreco, nquantant, ldireto) {
    //navigator.vibrate(100);
    var nquant = (nquan == 0 ? parseInt($("#vd_quant_quant").val()) : nquan);
    var naux = $("#vd_quant_valor").val();
    var nvalor = parseFloat(naux.replace(",", "."));
    var niva = 0;
    aGradeAdd = [ncodigo, nseq1, nseq2, nquan, npreco, nquantant];

    $("#vd_quant_enviar").attr("onclick", "");


    if (!nquantant) {
        nquantant = 0;
    }
    if (npreco > 0) {
        nvalor = npreco;
    }


    var nquant = parseInt($("#vd_quant_quant").val());
    //navigator.vibrate(100);
    cvd_quant_enviar = $("#vd_quant_enviar").attr("onclick");

    $("#vd_quant_enviar").attr("onclick", "");

    if (!ncodigo || ncodigo == 0) {
        ncodigo = parseInt($("#vd_codigo").val())
    }

    var naux = $("#vd_quant_valor").val();
    var nvalor = parseFloat(naux.replace(",", "."));
    var naux = $("#vd_custo").val();
    var ncusto = parseFloat(naux.replace(",", ".")) * amoeda[nmoeda - 1][3];
    var naux = $("#vd_minimo").val();
    var nminimo = parseFloat(naux.replace(",", ".")) * amoeda[nmoeda - 1][3];
    var naux = $("#vd_venda").val();
    var nvenda = parseFloat(naux.replace(",", "."));
    var naux = $("#vd_promo").val();
    var npromo = parseFloat(naux.replace(",", "."));
    if (!nvenda) {
        nvenda = 0;
    }
    /*
     nvenda = Math.floor(nvenda * 100) / 100;
     nminimo = Math.floor(nminimo * 100) / 100;
     nvalor = Math.floor(nvalor * 100) / 100;
     */


    nvenda = Exato(nvenda, amoeda[nmoeda - 1][2]);
    nminimo = Exato(nminimo, amoeda[nmoeda - 1][2]);
    nvalor = Exato(nvalor, amoeda[nmoeda - 1][2]);
    if (!nquantant) {
        nquantant = 0;
    }
    if (npromo - 0.01 > nvalor) {
        navigator.notification.alert(
                _tr('Não pode ser vendido abaixo do valor promocional'), //+"|"+npromo+"|"+nvalor), // message
                function () {
                    $("#vd_quant_valor").focus();
                    return false;
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }

    if (!ldireto) {
        ldireto = false;
    }

    if (nquant < 1) {
        navigator.notification.alert(
                _tr('Informe uma quantidade'), // message
                function () {
                    $("#vd_quant_enviar").attr("onclick", cvd_quant_enviar);
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }

    if (nvalor <= 0) {
        navigator.notification.alert(
                _tr('Informe uma Valor válido'), // message
                function () {
                    $("#vd_quant_enviar").attr("onclick", cvd_quant_enviar);
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;

    }

    if ($("#lj_ck_n1").prop("checked") && nmodpedi == 556) {
        nminimo = nvenda * amoeda[nmoeda - 1][3];
    }

    if (!ldireto && nvalor < nminimo && nguia > 0) {
        navigator.notification.alert(
                _tr("Preço abaixo do mínimo.\nEm venda com guia o preço não pode ser inferior ao mínimo."), // message
                function () {
                    $("#vd_quant_enviar").attr("onclick", cvd_quant_enviar);
                    return false;
                }, // callback
                _tr('Vendas'), // title
                [_tr('Não'), 'Ok']
                );
        return false;
    }


    if (!ldireto && nvalor < nminimo && npromo == 0) { //!$("#vd_quant_valor").prop("disabled")) {//custo
        var laut = VeAut(nvalor == ncusto ? 72 : 58);
        if (!laut) {
            navigator.notification.confirm(
                    _tr("Grade Preço abaixo do mínimo.\nSolicita autorização ?"), // message
                    function (e) {
                        if (e == 2) {
                            AutorizaPreco(ncodigo, nquant, nvalor, nminimo, nvenda, nquantant, niva, ncusto);

                            return false;
                        } else {
                            $("#vd_quant_enviar").attr("onclick", cvd_quant_enviar);
                        }
                    }, // callback
                    _tr('Vendas'), // title
                    [_tr('Não'), 'Ok']
                    );
            return false;
        }
    } else if (!ldireto && nvalor < nminimo && !$("#vd_quant_valor").prop("disabled") && npromo == 0) {//preço mínimo
        var laut = VeAut(88);
        if (!laut) {
            navigator.notification.confirm(
                    _tr("Preço abaixo do mínimo.\nSolicita autorização ?"), // message
                    function (e) {
                        if (e == 2) {
                            AutorizaPreco(ncodigo, nquant, nvalor, nminimo, nvenda, nquantant, niva, 0);
                            return false;
                        } else {
                            $("#vd_quant_enviar").attr("onclick", cvd_quant_enviar);
                        }
                    }, // callback
                    _tr('Vendas'), // title
                    [_tr('Não'), 'Ok']
                    );
            return false;
        }
    }

    //quantidade máxima
    /*
     if (!nquantmax) {
     nquantmax = 0;
     }
     if (!ldireto && nquant > nquantmax) {
     var laut = VeAut(413);
     if (!laut) {
     navigator.notification.confirm(
     _tr("Venda acima da quantidade permitida.\nSolicita autorização ?"), // message
     function (e) {
     if (e == 2) {
     AutorizaQuant(ncodigo, nquant, nvalor, nminimo, nvenda, nquantant, nquantmax, niva);
     return false;
     } else {
     $("#vd_quant_enviar").attr("onclick", cvd_quant_enviar);
     }
     }, // callback
     _tr('Vendas'), // title
     [_tr('Não'), 'Ok']
     );
     return false;
     }
     }
     
     */





















    var nespera = bootbox.espera({message: _tr("Aguarde, Gravando dados")});
    $.ajax({
        method: "POST",
        url: curl + "vendas.php",
        cache: false,
        async: true, //espera o retorno
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid
            , modo: 62
            , ncodigo: ncodigo
            , nquant: nquant
            , nvalor: nvalor / amoeda[nmoeda - 1][3]
            , vendedor: vendedor
            , loja: nloja
            , nquantant: nquantant
            , seq1: nseq1
            , seq2: nseq2
            , orcamento: lorc
            , serie: nserie
        }
    }).done(function (e) {
        nespera.modal("hide");
        aGradeAdd = [];
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
        $("#vd_quant").modal("hide");
        $("#pd_codigo").val("");
        $("#pd_nome").val("");
        PdBuscar();
        CarregaNota();
        $('.nav-tabs a[href="#venda"]').tab('show');

    }).fail(function (e, d) {
        nespera.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor'), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
    });
    aGradeAdd = [];
    return false;

}
function AdicionaGrade2(ncodigo, nseq1, nseq2, nquant, npreven, nquantant, nminimo, nPromo) {
    //aret.codigo,aret.seq1,aret.seq2,aret.minimo,aret.venda,aret.gsaldo,aret.gsaldot
    $("#vd_minimo").val(arre_pre(nminimo));
    $("#vd_venda").val(arre_pre(npreven));
    for (var i = 0; i < agrade.length; i++) {
        if (agrade[i][0] == ncodigo && agrade[i][1] == nseq1 && agrade[i][2] == nseq2) {
            AdicionaGrade1(ncodigo, nseq1, nseq2, 1, agrade[i][4]);
            navigator.notification.alert(
                    "Adicionado mais um item do produto", // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
        }
    }
    $("#vd_quant_produto").html($("#pd_grade_pro").html()); // + "<br>" + arval1 + (aret.val1 == aret.val2 ? "" : " / " + aret.val2) + "<br>Saldo Loja: " + parseInt(aret.gsaldo) + "<br>Saldo Geral: " + parseInt(aret.gsaldot));
    $("#vd_codigo").val(ncodigo);
    $("#vd_quant_quant").val(nquant);
    $("#vd_quant_valor").prop("disabled", false);
    $("#vd_quant_valor").val($("#vd_venda").val());
    $("#vd_promo").val(nPromo);
    if (parseFloat(nPromo) == 0) {
        $("#vd_quant_valor").val(NumberFormat(arre_pre(amoeda[nmoeda - 1][3] * parseFloat(npreven)), amoeda[nmoeda - 1][2], ',', ''));
    } else {
        npreven = nPromo;
        nminimo = nPromo;
        $("#vd_quant_valor").val(NumberFormat(arre_pre(amoeda[nmoeda - 1][3] * parseFloat(nPromo)), amoeda[nmoeda - 1][2], ',', ''));
//        $("#vd_quant_valor").prop("disabled", true);
    }
    $("#vd_quant_enviar").attr("onclick", "AdicionaGrade1(" + ncodigo + "," + nseq1 + "," + nseq2 + ",0,0)");
    $("#vd_quant_fundo").removeClass("bg-danger");
    $("#vd_quant").modal("show");
    $("#pd_grade").modal("hide");


}
function AdicionaGrade(aret) {
    var ncodigo = aret.codigo;
    //aret.codigo,aret.seq1,aret.seq2,aret.minimo,aret.venda,aret.gsaldo,aret.gsaldot
    for (var i = 0; i < agrade.length; i++) {
        if (agrade[i][0] == aret.codigo && agrade[i][1] == aret.seq1 && agrade[i][2] == aret.seq2) {
            AdicionaGrade1(ncodigo, aret.seq1, aret.seq2, 1, agrade[i][4]);
            navigator.notification.alert(
                    _tr("Adicionado mais um item do produto"), // message
                    function () {
                        $("#pd_grade").modal("hide");
                        $('.nav-tabs a[href="#venda"]').tab('show');

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
    }
    $("#vd_quant_produto").html(poedigito(ncodigo) + '-' + aret.prod[0].nome + "<br>" + aret.val1 + (aret.val1 == aret.val2 ? "" : " / " + aret.val2) + "<br>" + _tr("Saldo Loja") + ": " + parseInt(aret.gsaldo) + "<br>" + _tr("Saldo Geral") + ": " + parseInt(aret.gsaldot));
    $("#vd_codigo").val(ncodigo);
    $("#vd_quant_quant").val("1");
    $("#vd_quant_valor").val(NumberFormat(arre_pre(amoeda[nmoeda - 1][3] * parseFloat(aret.prod[0].venda)), amoeda[nmoeda - 1][2], ',', ''));
    $("#vd_quant_enviar").attr("onclick", "AdicionaGrade1(" + ncodigo + "," + aret.seq1 + "," + aret.seq2 + ",0,0)");

    $("#vd_quant_fundo").removeClass("bg-danger");

    $("#vd_quant").modal("show");
    /*
     $("#vd_minimo").val(arre_pre(aret.prod[0].minimo * aret.prod[0].iva));
     $("#vd_venda").val(arre_pre(aret.prod[0].venda * aret.prod[0].iva));
     */

}


function AdicionaItem(ncodigo) {
    //var lok = false;
    aGradeAdd = [];

    if (aprodutos.length >= aConfig.PROFACT) {
        //navigator.vibrate(1000);
        let caux = _tr("Nota limitada a XXX produtos no máximo.").replace('XXX', aConfig.PROFACT);

        navigator.notification.alert(
                caux, // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;


    }


    if (lseguro) {
        //navigator.vibrate(1000);
        navigator.notification.alert(
                _tr("Seguro lançado. \nApenas 1 item por nota. Encerre a nota ou remova o item."), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;

    }
    for (var i = 0; i < aprodutos.length; i++) {
        if (aprodutos[i][0] == ncodigo) {
            //navigator.vibrate(1000);
            navigator.notification.alert(
                    _tr('Produto já lançado na nota'), // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
    }

    if (!lmultiloja) {
        $("#vd_multiloja").hide();
        $("#vd_loja").val(0);
    } else {

    }



    $.ajax({
        method: "POST",
        url: curl + "index_p.php",
        cache: false,
        async: false, //espera o retorno
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid, orcamento: lorc, serie: nserie, modo: "CONSULTA_PRO", ncodigo: ncodigo, vendedor: vendedor, loja: nloja}
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
        if (aret.prod[0].blocopro.trim() && !aret.prod[0].blocopro.trim().split("-").includes((nloja).toString())) {
            navigator.notification.alert(
                    _tr("Loja Atual") + ": " + nloja + "\n" + _tr("Não está na lista de lojas permitidas para venda deste ítem:") + "\n" + aret.prod[0].blocopro.trim(), // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;

        }
        $("#vd_quant_produto").html(poedigito(ncodigo) + '-' + aret.prod[0].nome + "<br>" + _tr("Saldo Loja") + ": " + parseInt(aret.prod[0].saldo) + "<br>" + _tr("Saldo Geral") + ": " + parseInt(aret.prod[0].saldot));
        $("#vd_codigo").val(ncodigo);
        $("#vd_quant_quant").val("1");
        $("#vd_quant_valor").val(NumberFormat(arre_pre(amoeda[nmoeda - 1][3] * parseFloat(aret.prod[0].venda * aret.prod[0].iva)), amoeda[nmoeda - 1][2], ',', ''));
        $("#vd_quant_enviar").attr("onclick", "AdicionaItem1(" + ncodigo + ",0,false," + aret.prod[0].quantmax + "," + aret.prod[0].iva + ")");
        $("#vd_custo").val(arre_pre(aret.prod[0].custo * aret.prod[0].iva));
        $("#vd_minimo").val(arre_pre(aret.prod[0].minimo * aret.prod[0].iva));
        $("#vd_venda").val(arre_pre(aret.prod[0].venda * aret.prod[0].iva));
        $("#vd_promo").val(arre_pre(aret.prod[0].preco5 * aret.prod[0].iva));
//        $("#vd_quant_valor").prop("disabled", parseInt(aret.prod[0].preco5 * aret.prod[0].iva) > 0);
        $("#vd_quant_valor").prop("disabled", false);
        $("#vd_quant_fundo").removeClass("bg-danger");
        $("#vd_quant").modal("show");
        $("#vd_quant_enviar_preco").attr("onclick", "AdicionaItemPreco(" + ncodigo + "," + ncliente + "," + aret.prod[0].iva + ")");
        $("#vd_ult_venda").html('');
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
function VeDescPro(ncodigo, cext, cpro) {
    $("#pd_detalhes_pro").html('');
    $("#pd_detalhes_pro_cab").html(_tr('Código') + ' : ' + ncodigo + "-" + digito(ncodigo));

    if (cext && cext !== '') {
        cext = (cext.replace('[[COD]]', ncodigo)).replace('[[CODDG]]', poedigito(ncodigo));
        $("#pd_detalhes_pro").load(cext);
        $("#pd_detalhes").modal('show');
        return false;

    } else {
        $.ajax({
            method: "POST",
            url: curl + "detalhes.php",
            async: false,
            cache: false,
            timeout: nTimeOut,
            data: {lj_preco: lj_preco, sid: sid, cod: ncodigo, orcamento: lorc, serie: nserie}
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
            var cstr = '<div class="alert-info" >\n\
                            <h3 class="text-left">' + poedigito(ncodigo) + '-<strong>' + aret.nome + '</stong></h3><h4>Web: ' + aret.nomeweb + '</h4></div><h4 >';
            cstr = cstr + aret["breve"] + '</h4>\n\
                        <table class="table table-bordered" style="font-size: ' + $(".tabprod").css("font-size") + '">\n\
                            <tbody>';
            for (var i = 0; i < (aret.det).length; i++) {
                cstr = cstr + '<tr><th class="text-right" style="width: 30%;">' + aret.det[i][0] + ':</th><td class="text-left" style="width: 70%;">' + aret.det[i][1] + '</td></tr>';
            }
            cstr = cstr + '</tbody></table><h5>' + aret.desc + '</h5>';

            $("#pd_detalhes_pro").html(cstr);
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

        $("#pd_detalhes").modal('show');
    }
    return false;
}


function VeLinkExt(ncodigo) {
    //var cext = (window.localStorage.getItem("cecvendas" + nempresa + "_imgext")).substr(4).trim();
    var cext = (veconfig.IMGEXT).substr(4).trim();
    cext = (cext.replace('[[COD]]', ncodigo)).replace('[[CODDG]]', poedigito(ncodigo));
    var nespera = bootbox.espera({message: _tr("Aguarde, consultando produtos")});
    nref = window.open(cext, "_system", "location=yes");
    //navigator.app.loadUrl(cext, { openExternal:true });
    nespera.modal("hide");
}
function VeFotoProExt(ncodigo) {
    var ccab = '';
    var cite = '';
    var nimg = 1;
//alert("pro");
    //var cext = (window.localStorage.getItem("cecvendas" + nempresa + "_imgext")).split(',');
    var cext = (veconfig.IMGEXT).split(',');
    cext = cext[0];
    cext = (cext.replace('[[COD]]', ncodigo)).replace('[[CODDG]]', poedigito(ncodigo));
    ccab = ccab + '<li data-target="#pd_carousel" data-slide-to="0" class="active"></li>';
    cite = cite + '<div class="item active"><img src="' + cext + '"></div> ';

    if (cext.substr(-6) == "_1.JPG") {
        ccab = ccab + '<li data-target="#pd_carousel" data-slide-to="1" ></li>';
        cite = cite + '<div class="item"><img src="' + cext.substr(0, cext.length - 6) + '_2.JPG"></div> ';
        ccab = ccab + '<li data-target="#pd_carousel" data-slide-to="2" ></li>';
        cite = cite + '<div class="item"><img src="' + cext.substr(0, cext.length - 6) + '_3.JPG"></div> ';

    }

    $("#pd_carousel_cab").html(ccab);
    $("#pd_carousel_ite").html(cite);
    $("#pd_imagem").modal('show');
    $("#pd_carousel").carousel(0);

}
function VeFotoPro(ncodigo) {
    var ccab = '';
    var cite = '';
    var nimg = 1;
    for (var i = 0; i < aconsulta.length; i++) {
        if (parseInt(aconsulta[i].codigo) == ncodigo) {
            nimg = parseInt(aconsulta[i].nimagem);
            if (nimg > 3) {
                nimg = 3;
            }
            for (var k = 0; k < nimg; k++) {
                ccab = ccab + '<li data-target="#pd_carousel" data-slide-to="' + k + (k == 0 ? '" class="active"' : '"') + '></li>';
                //cite = cite + '<div class="item' + (k == 0 ? ' active' : '') + '"><img src="http://192.168.12.100/produto/imagem1.php?cod=33970';
                //cite = cite + '"></div> ';
                cite = cite + '<div class="item' + (k == 0 ? ' active' : '') + '"><img src="';
                cite = cite + curl + 'cedula1.php?img=' + (k + 1) + '&pro=' + ncodigo + '"></div> ';
            }
            $("#pd_carousel_cab").html(ccab);
            $("#pd_carousel_ite").html(cite);
            $("#pd_imagem").modal('show');
            $("#pd_carousel").carousel(0);
        }
    }
}


function MostraProdutos() {
    var cstr = '';
    var nitens = 0;
    var ntotal = 0;
    var ndesco = 0;


    $("#lj_loja").prop('disabled', aprodutos.length > 0);
    if (aprodutos.length > 0) {
        cstr = '<table class="table table-bordered" style="font-size: ' + $(".tabprod").css("font-size") + '">\n\
                            <thead class="bg-warning text-warning">\n\
                                <tr>\n\
                                    <th colspan="1" >' + _tr('Produto') + '</th>\n\
                                    <th class="text-right"><a href="javascript:BtAutoriza()" class="btn btn-primary btn-lg" style="font-size: .8em;">\n\
                                        <span class="glyphicon glyphicon-hand-up"></span> Aut.\n\
                                        </a></th>\n\
                                    <th>' + _tr('Quant') + '</th>\n\
                                    <th>' + _tr('Unit') + '</th>\n\
                                    <th>' + _tr('Total') + '</th>\n\
                                    <th></th>\n\
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

            var lgrade = false;
            for (var k = 0; k < agrade.length; k++) {
                if (agrade[k][0] == aprodutos[i][0]) {
                    lgrade = true;
                    break;
                }
            }

            if (lgrade) {
                cstr = cstr + '<tr style="background: #ffff66; "><td scope="row">' + poedigito(aprodutos[i][0]) + '</td>';
                cstr = cstr + '<td>' + (aprodutos[i][1]).addSlashes() + "</td>";
                cstr = cstr + '<td>' + NumberFormat(nquant, 0) + '</td>';
                cstr = cstr + '<td>' + NumberFormat(nvalor, amoeda[nmoeda - 1][2]) + '</td>';
                cstr = cstr + '<td>' + NumberFormat(nquant * nvalor, amoeda[nmoeda - 1][2]) + '</td>';
                cstr = cstr + '<td>';
                if (aprodutos[i][7] !== '0') {
                    cstr = cstr + '<i class="fa fa-camera form-cli text-primary" onclick="VeFotoPro(' + aprodutos[i][0] + ')"></i>';
                }
                if (aprodutos[i][6] !== '0') {
                    cstr = cstr + '<br><i class="fa fa-file-text form-cli text-primary" onclick="VeDescPro(' + aprodutos[i][0] + ')"></i>';
                }
                cstr = cstr + '</td></tr>';

                for (var k = 0; k < agrade.length; k++) {
                    if (agrade[k][0] == aprodutos[i][0]) {
                        cstr = cstr + '<tr style="background: #ffffe6; "><td><i class="fa fa-remove form-cli text-warning" onclick="RemoveItemGra(' + aprodutos[i][0] + ',' + agrade[k][1] + ',' + agrade[k][2] + ',' + agrade[k][3] + ')"></i></td>';
                        cstr = cstr + '<td>' + agrade[k][5] + " / " + agrade[k][6] + '</td>';
                        cstr = cstr + '<td>' + agrade[k][3] + "</td><td></td><td></td><td></td></tr>";
                    }
                }
            } else {
                cstr = cstr + '<tr' + (aprodutos[i][11] != 0 ? ' style="background: #f5e6ff;"' : "") + '><td scope="row">' + poedigito(aprodutos[i][0]);
                if (!(aConfig["PER_SOS"] > 0 && aprodutos[i][10] != 0 && nquant == 1)) {
                    if (aprodutos[i][11] == 0) {
                        cstr = cstr + '<br><i class="fa fa-remove form-cli text-warning" onclick="RemoveItem(' + aprodutos[i][0] + ',' + nquant + ')"></i>';
                    }
                }
                //seguro lg
                if (aConfig["PER_SOS"] > 0 && aprodutos[i][9] == 0 && aprodutos[i][10] == 0 && nquant == 1) {
                    cstr = cstr + '<br><img src="img/seg_on.png"  id="seg_on' + i + '" height="25"  onclick="SegAdd(' + i + ',' + nvalor + ')"/>';
                } else if (aConfig["PER_SOS"] > 0 && aprodutos[i][9] != 0 && nquant == 1) {
                    cstr = cstr + '<br><img src="img/seg_off.png" id="seg_off' + i + '" height="25" onclick="SegRem(' + i + ')">';
                }
                //seguro pitzi
                if (nPaisClienteCec !== 1) {
                    if (aConfig["GARANT_EXT"] == "S" && aprodutos[i][11] == 0 && aprodutos[i][12] == 0) {
                        cstr = cstr + '<br><img src="img/seg_pit_on.png"  id="seg_on' + i + '" height="25"  onclick="SegAddPitzi(' + i + ',' + nvalor + ',' + nquant + ')"/>';
                    } else if (aConfig["GARANT_EXT"] == "S" && (aprodutos[i][12] != 0)) {
                        cstr = cstr + '<br><img src="img/seg_pit_off.png" id="seg_off' + i + '" height="25" onclick="SegRemPitzi(' + i + ')">';
                    }
                }

                cstr = cstr + '</td><td>';
                cstr = cstr + (aprodutos[i][1]).addSlashes();
                cstr = cstr + '</td><td>';
                cstr = cstr + NumberFormat(nquant, 0);
                if (!(aConfig["PER_SOS"] > 0 && aprodutos[i][10] != 0 && nquant == 1) &&
                        aprodutos[i][9] == 0) {
                    if (aprodutos[i][11] == 0 && aprodutos[i][12] == 0) {
                        cstr = cstr + '<br><i class="fa fa-plus-circle form-cli text-success" onclick="AlteraItem(' + aprodutos[i][0] + ',' + nquant + ',' + nvalor + ',' + aprodutos[i][11] + ')"></i>';
                    }
                }
                cstr = cstr + '</td><td>';
                cstr = cstr + NumberFormat(nvalor, amoeda[nmoeda - 1][2]) + '</td><td>';
                cstr = cstr + NumberFormat(nquant * nvalor, amoeda[nmoeda - 1][2]) + '</td><td>';
                if (aprodutos[i][7] !== '0') {
                    cstr = cstr + '<i class="fa fa-camera form-cli text-primary" onclick="VeFotoPro(' + aprodutos[i][0] + ')"></i>';
                }
                if (aprodutos[i][6] !== '0') {
                    cstr = cstr + '<br><i class="fa fa-file-text form-cli text-primary" onclick="VeDescPro(' + aprodutos[i][0] + ')"></i>';
                }
                cstr = cstr + '</td></tr>';
            }
        }
        cstr = cstr + '</tbody></table>';
    }
    $("#vd_table").html(cstr);
    $("#vd_itens").html(NumberFormat(nitens, 0));
    if (ndesco > 0) {
        $("#fn_desconto").css("display", "block");
        $("#fn_moeda_s").html(amoeda[nmoeda - 1][0]);

        $("#fn_valor_s").html(NumberFormat(ntotal, amoeda[nmoeda - 1][2]));
        $("#fn_valor_sf").html(NumberFormat(ndesco, amoeda[nmoeda - 1][2]));

    } else {
        $("#fn_desconto").css("display", "none");
    }
    nvalorfinal = ntotal - ndesco;
    $("#fn_valor").html(NumberFormat(ntotal - ndesco, amoeda[nmoeda - 1][2]));
    $("#vd_total").html(NumberFormat(ntotal - ndesco, amoeda[nmoeda - 1][2]));
    $("#lj_valor").html(NumberFormat(ntotal - ndesco, amoeda[nmoeda - 1][2]));
    $("#fn_itens").html(aprodutos.length + " / " + NumberFormat(nitens, 0));

    $("#vd_moeda").html(amoeda[nmoeda - 1][0]);
    $("#lj_moeda").html(amoeda[nmoeda - 1][0]);
    $("#fn_moeda").html(amoeda[nmoeda - 1][0]);
    //var nfonte = veconfig.FONTE;
    var nfonte = parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_fonte"));

    nfonte = (45 - (nfonte >= 5 ? 0 : (5 - nfonte) * 10));

    $("#seg_on").prop("height", nfonte);
    $("#seg_off").prop("height", nfonte);
    FiltraHistorico(0);
    ntotal = ntotal - ndesco;
    $("#vc_mostra").addClass("hidden");
    if ($("#lj_voucher").val().trim()) {
        $.ajax({
            method: "POST",
            url: curl + "voucher.php",
            async: true,
            cache: false,
            timeout: nTimeOut,
            data: {sid: sid, vendedor: vendedor, modo: "ANALISA", serie: nserie}
        }).done(function (e) {
            var aretv = JSON.parse(e);
            if (aretv.per > 0) {
                $("#vc_mostra").removeClass("hidden");
                $("#vc_val").html("-" + NumberFormat(parseFloat(aretv.val) * amoeda[nmoeda - 1][3], amoeda[nmoeda - 1][2]));
                $("#vc_per").html(NumberFormat(parseFloat(aretv.per), 2) + " %");
                $("#vc_tot").html("<strong>" + NumberFormat(ntotal - (parseFloat(aretv.val) * amoeda[nmoeda - 1][3]), amoeda[nmoeda - 1][2]) + "</strong>");
            }
        }).fail(function (e, d) {
            navigator.notification.alert(
                    _tr('Sem comunicação com o servidor') + "... .", // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
        });

    } else {



    }

}



function PdCamara() {
    cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (result.cancelled) {
                    return false;
                }
                var caux = result.text;
                if (!caux) {
                    navigator.notification.alert(
                            _tr("Erro na leitura"), // message
                            null, // callback
                            _tr('Produto'), // title
                            _tr('Erro')                  // buttonName
                            );
                    return false;
                }

                $("#pd_rbcodigo_d").prop("checked", true);
                $("#pd_rbcodigo_c").prop("checked", false);
                //$("#pd_ckcodigo").prop("checked", false);
                $("#pd_codigo").css("display", "none");
                $("#pd_nome").css("display", "block");
                caux = caux.trim();
                $("#pd_nome").val(trim(caux));
                //GRADE
                if (caux.length == 15 && caux.replace(/[0-9]/g, '') == '') {
                    caux = '#' + caux + "#";
                    $("#pd_nome").val(trim(caux));
                    $("#pd_buscar").click();
                    return false;
                }
                // NOVA GRADE
                //    $lgrade2 = ( strlen($codigo) == 17 && substr($codigo, 7, 1) == "-" && substr($codigo, 12, 1) == "-" );
                if (caux.length == 17 && caux.substr(7, 1) == "-" && caux.substr(12, 1) == "-") {
                    $("#pd_buscar").click();
                    return false;
                }

                var aaux = caux.split("-");
                if ((caux.replace(/[\-0-9]/gi, "")) == '' && aaux.length == 3) {
                    if (!vedigito(aaux[0])) {
                        navigator.notification.alert(
                                _tr("Código da grade não é válido"), // message
                                null, // callback
                                _tr('Produto'), // title
                                _tr('Erro')                  // buttonName
                                );
                        return false;
                    }
                    $("#pd_buscar").click();
                    return false;
                }

                //QRCode
                if (!(caux.substr(-1) == "*" && caux.substr(0, 1) == "*") && !vedigito(caux)) {
                    navigator.notification.alert(
                            _tr("Código da Grade não é válido"), // message
                            null, // callback
                            _tr('Produto'), // title
                            _tr('Erro')                  // buttonName
                            );
                    return false;
                    $("#pd_buscar").click();
                    return false;
                }
                $("#pd_buscar").click();
                return false;
            },
            function (error) {
                navigator.notification.alert(
                        _tr("Erro na leitura") + ": " + error, // message
                        null, // callback
                        _tr('Produto'), // title
                        _tr('Erro')                  // buttonName
                        );
                return false;
            },
            {
                preferFrontCamera: false, // iOS and Android
                showFlipCameraButton: true, // iOS and Android
                showTorchButton: true, // iOS and Android
                torchOn: false, // Android, launch with the torch switched on (if available)
                prompt: "Insira o QRCODE na area de leitura", // Android
                resultDisplayDuration: 5, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                formats: "QR_CODE,PDF_417,EAN13", // default: all but PDF_4 and RSS_EXPANDED
                orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
                disableAnimations: true, // iOS
                disableSuccessBeep: false // iOS
            }
    );

}

function PdBuscar() {
    var nloja = $("#lj_loja").val();
    //navigator.vibrate(100);
    if ($("#pd_codigo").css("display") == "block") {
        var codigo = $("#pd_codigo").val();
    } else {
        var codigo = $("#pd_nome").val();
    }
    if (!codigo) {
        $("#pd_table").html("");
        return;
    }
    //semloja
    if (!lSemLoja && (!nloja || parseInt(nloja) == 0)) {
        $('.nav-tabs a[href="#loja"]').tab('show');
        $("#lj_loja").focus();
        navigator.notification.alert(
                _tr("Selecione uma loja para consultar produtos"), // message
                function () {
                    //$('.nav-tabs a[href="#loja"]').tab('show');
                    $("#lj_loja").focus();
                    return true;
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }

    if (codigo.length < 3 && $("#pd_codigo").css("display") == "none") {
        navigator.notification.alert(
                "Informe pelo menos 3 caracteres", // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }
    var nespera = bootbox.espera({message: _tr("Aguarde, consultando produtos")});
    $.ajax({
        method: "POST",
        url: curl + "index_p.php",
        async: true,
        cache: false,
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid
            , orcamento: lorc
            , serie: nserie
            , codigo: codigo
            , modo: "CONSULTA_PRO"
            , loja: (nloja == 0 ? 1 : nloja)
            , vendedor: vendedor
            , saldo: $("#pd_saldo").prop("checked")
            , ckcodigo: ($("#pd_rbcodigo_c").prop("checked") ? "C" : ($("#pd_rbcodigo_r").prop("checked") ? "R" : ($("#pd_rbcodigo_dc").prop("checked") ? "DC" : ($("#pd_rbcodigo_da").prop("checked") ? "DA" : "D"))))
            , paiscli: $("#lj_ck_n2").prop("checked") ? 2 : 1
            , quant_con: $("#pd_quant_con").val()
            , exato: $("#pd_exato").prop("checked") ? 1 : 0
            , promo: $("#pd_promo").prop("checked") ? 1 : 0}
//            , ckcodigo: $("#pd_ckcodigo").prop("checked")
    }).done(function (e) {
        nespera.modal("hide");
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

        if (aret.grade == 1) {
            AdicionaGrade(aret);
            return false;
        }
        aconsulta = aret.prod;
        if (aconsulta.length == 0) {
            $("#pd_table").html("");
            navigator.notification.alert(
                    _tr("Nada Localizado"), // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;

        }
        var cstr = '<table class="table table-bordered" style="font-size: ' + $(".tabprod").css("font-size") + '">\n\
                            <thead class="bg-primary text-primary">\n\
                                <tr>\n\
                                    <th colspan="2">' + _tr('Produto') + ' &nbsp;&nbsp;&nbsp;(' + (aret.prod).length + ' itens)</th>';
        //if (window.localStorage.getItem("cecvendas" + nempresa + "_refer") == "1") {
        if (veconfig.REFER == "1") {
            cstr = cstr + '<th>' + _tr('Refer') + '</th>';

        }
        if (lminimo !== 'N') {
            cstr = cstr + '<th>' + _tr('Mínimo') + '</th>';
        }
        if (lvenda !== 'N') {
            cstr = cstr + '<th>' + _tr('Normal') + '</th>';
        }
        cstr = cstr + '<th>' + _tr('Saldo') + (nloja == 0 ? '(1)' : '') + '</th>\n\
                                    <th></th>\n\
                                </tr>\n\
                            </thead>\n\
                            <tbody>';
//        var acolor = [["", ""], ["000000", "f2f2f2"], ["f2f2f2", "000000"], ["ffffff", "0000ff"], ["ffffff", "00ff00"], ["cc6600", "000000"], ["ffffff", "cc6600"], ["339966", "f2f2f2"], ["f2f2f2", "339966"], ["ff0000", "f2f2f2"], ["ff0000", "000000"], ["0000ff", "339966"], ["66ff33", "000000"], ["339966", "000000"], ["cc00cc", "000000"], ["ffffff", "cc00cc"], ["ffff00", "000000"], ["ffff00", "f2f2f2"], ["ffffff", "ff0000"], ["ff0000", "0000ff"], ["66ff33", "ff0000"], ["ff0000", "339966"]];
        var acolor = [["", ""], ["000000", "f2f2f2"], ["f2f2f2", "000000"], ["ffffff", "000099"], ["ffffff", "00ff00"], ["cc6600", "000000"], ["ffffff", "cc6600"], ["339966", "f2f2f2"], ["f2f2f2", "339966"], ["ffaa00", "f2f2f2"], ["ffaa00", "000000"], ["000099", "339966"], ["66ff33", "000000"], ["339966", "000000"], ["cc00cc", "000000"], ["ffffff", "cc00cc"], ["ffff00", "000000"], ["ffff00", "f2f2f2"], ["ffffff", "ffaa00"], ["ffaa00", "000099"], ["66ff33", "ffaa00"], ["ffaa00", "339966"]];
        //var aext = (window.localStorage.getItem("cecvendas" + nempresa + "_imgext")).split(',');
        var aext = (veconfig.IMGEXT).trim().split(',');
        for (var i = 0; i < (aret.prod).length; i++) {
            var ncusto = (lj_preco != '' ? aret.prod[i].precot : aret.prod[i].custo);

            cstr = cstr + '<tr id="prod-con-' + i + '" onclick="MudaCorLinhaConsulta(' + i + ',' + aret.prod.length + ');"><td scope="row">' + (aret.prod[i].ativo == 'N' ? '<span class="bg-danger text-danger">*INAT*</span><br>' : '') + poedigito(aret.prod[i].codigo) + '<br>';
//            if (aret.prod[i].ltem == 0 && (aret.prod[i].saldo > 0 || aret.prod[i].saldot > 0) && (aret.prod[i].gradepro).trim() == '') {
            if (aret.prod[i].ltem == 0 && (aret.prod[i].gradepro).trim() == '' && nloja > 0) {
                cstr = cstr + '<i class="fa fa-cart-plus form-cli text-success" onclick="AdicionaItem(' + aret.prod[i].codigo + ')" ></i>';
            }
            if (aret.prod[i].ltem > 0) {
                cstr = cstr + '<i class="fa fa-cart-arrow-down form-cli text-warning" ></i>';
            }
            cstr = cstr + '</td>';
            cstr = cstr + '<td>';
            if ((aret.prod[i].gradepro).trim() !== '') {
                cstr = cstr + '<i class="fa fa-hashtag form-cli text-primary" onclick="VeGrade(' + aret.prod[i].codigo + ',' + parseFloat(aret.prod[i].preco5) + ' )"></i>';
            } else if (aret.prod[i].kitpro == 'S') {
                cstr = cstr + '<i class="fa fa-cubes form-cli text-primary" onclick="VeKit(' + aret.prod[i].codigo + ')"></i>';
            }
            cstr = cstr + '<span ';
            if (aret.prod[i].corpro1 > 1) {
                //cstr=cstr + '<strong class="form-cli" style="color: #'+acolor[aret.prod[i].corpro1][0]+'; background: #';
                //cstr=cstr + acolor[aret.prod[i].corpro1][1]+';"> * </strong>';
                //cstr=cstr + '<span  style="color: #'+acolor[aret.prod[i].corpro1][0]+'; background: #';
                //cstr=cstr + acolor[aret.prod[i].corpro1][1]+';">&nbsp;<i class="fa fa-heart form-cli" ></i>&nbsp;</span>';
                cstr = cstr + 'style="color: #' + acolor[aret.prod[i].corpro1][0] + '; background: #' + acolor[aret.prod[i].corpro1][1] + ';" ';
            }
            cstr = cstr + '>' + (aret.prod[i].nome).addSlashes() + '</span></td>';
            //if (window.localStorage.getItem("cecvendas" + nempresa + "_refer") == "1") {
            if (veconfig.REFER == "1") {
                cstr = cstr + '<td class="text-left">' + aret.prod[i].refer + '</td>';
            }
            if (lminimo !== 'N') {
                var cpreco = 'preco' + lminimo.toLocaleLowerCase();

                if (parseFloat(aret.prod[i].preco5) > 0) {
                    cstr = cstr + '<td class="text-right"><strong><span class="bg-danger text-danger">' + NumberFormat(arre_pre(amoeda[nmoeda - 1][3] * parseFloat(aret.prod[i].preco5 * aret.prod[i].iva)), amoeda[nmoeda - 1][2]) + '<br>PRM</span></strong>';
                } else {
                    cstr = cstr + '<td class="text-right" onclick="VePrecos(' + arre_pre(aret.prod[i].precoa * aret.prod[i].iva) + ',' + arre_pre(aret.prod[i].precob * aret.prod[i].iva) + ',' + arre_pre(aret.prod[i].precoc * aret.prod[i].iva) + ',' + arre_pre(aret.prod[i].precot * aret.prod[i].iva) + ',' + arre_pre(ncusto * aret.prod[i].iva) + ')">' + NumberFormat(arre_pre(amoeda[nmoeda - 1][3] * parseFloat(aret.prod[i][cpreco] * aret.prod[i].iva)), amoeda[nmoeda - 1][2]);
                }
                if (parseFloat(aret.prod[i].proquant) > 0) {
                    cstr = cstr + '<br><i class="fa fa-child form-cli text-warning" onclick="VePromo(' + aret.prod[i].proquant + ',' + aret.prod[i].codigo + ',' + parseFloat(aret.prod[i].preco5) + ')" ></i>';
                }
                cstr = cstr + '</td>';
            }
            if (lvenda !== 'N') {
                var cpreco = 'preco' + lvenda.toLocaleLowerCase();
//                cstr = cstr + '<td>' + NumberFormat(amoeda[nmoeda - 1][3] * parseFloat(aret.prod[i].venda), amoeda[nmoeda - 1][2]) + '</td>';
                if (parseFloat(aret.prod[i].preco5) > 0) {
                    cstr = cstr + '<td class="text-right" onclick="VePrecos(' + arre_pre(aret.prod[i].precoa * aret.prod[i].iva) + ',' + arre_pre(aret.prod[i].precob * aret.prod[i].iva) + ',' + arre_pre(aret.prod[i].precoc * aret.prod[i].iva) + ',' + arre_pre(aret.prod[i].precot * aret.prod[i].iva) + ',' + arre_pre(ncusto * aret.prod[i].iva) + ')"> <strong><span class="bg-danger text-danger">' + NumberFormat(arre_pre(amoeda[nmoeda - 1][3] * parseFloat(aret.prod[i].preco5 * aret.prod[i].iva)), amoeda[nmoeda - 1][2]) + '<br>PRM</span></strong>';
                    //cstr = cstr + '<td class="text-right" onclick="VePrecos(' + arre_pre(aret.prod[i].precoa * aret.prod[i].iva) + ',' + arre_pre(aret.prod[i].precob * aret.prod[i].iva) + ',' + arre_pre(aret.prod[i].precoc * aret.prod[i].iva) + ',' + arre_pre(aret.prod[i].precot * aret.prod[i].iva) + ',' + arre_pre(ncusto * aret.prod[i].iva) + ')">' + NumberFormat(arre_pre(amoeda[nmoeda - 1][3] * parseFloat(aret.prod[i][cpreco] * aret.prod[i].iva)), amoeda[nmoeda - 1][2]) + '</td>';
                } else {
                    cstr = cstr + '<td class="text-right" onclick="VePrecos(' + arre_pre(aret.prod[i].precoa * aret.prod[i].iva) + ',' + arre_pre(aret.prod[i].precob * aret.prod[i].iva) + ',' + arre_pre(aret.prod[i].precoc * aret.prod[i].iva) + ',' + arre_pre(aret.prod[i].precot * aret.prod[i].iva) + ',' + arre_pre(ncusto * aret.prod[i].iva) + ')">' + NumberFormat(arre_pre(amoeda[nmoeda - 1][3] * parseFloat(aret.prod[i][cpreco] * aret.prod[i].iva)), amoeda[nmoeda - 1][2]) + '</td>';

                }
            }
            cstr = cstr + '<td class="text-right ' + (aret.prod[i].saldot <= 0 ? "bg-danger" : (aret.prod[i].saldo <= 0 ? "bg-warning" : "")) + '" onclick="VeSaldoLoja(' + aret.prod[i].codigo + ')">' + NumberFormat(parseInt(aret.prod[i].saldo), 0) + '/' + NumberFormat(parseInt(aret.prod[i].psaldo), 0) + '<br>' + NumberFormat(parseInt(aret.prod[i].saldot), 0) + '/' + NumberFormat(parseInt(aret.prod[i].psaldot), 0) + '</td>';

            cstr = cstr + '<td>';
            if (aext && aext.length > 0 && aext[0] !== '' && aext[0].substr(0, 4) == "EXT:") {
                cstr = cstr + '<i class="fa fa-camera form-cli text-primary" onclick="VeLinkExt(' + aret.prod[i].codigo + ',\'' + aext[0] + '\')"></i>';
            } else {
                if (aext && aext.length > 0 && aext[0] !== '') {
                    cstr = cstr + '<i class="fa fa-camera form-cli text-primary" onclick="VeFotoProExt(' + aret.prod[i].codigo + ',\'' + aext[0] + '\')"></i>';
                } else {
                    if (parseInt(aret.prod[i].nimagem) > 0) {
                        cstr = cstr + '<i class="fa fa-camera form-cli text-primary" onclick="VeFotoPro(' + aret.prod[i].codigo + ')"></i>';
                    }
                }

                if (aext && aext.length > 1 && aext[1] !== '') {
                    cstr = cstr + '<i class="fa fa-file-text form-cli text-primary" onclick="VeDescPro(' + aret.prod[i].codigo + ',\'' + aext[1] + '\')"></i>';
                } else {
                    if (parseInt(aret.prod[i].detalhe) > 0) {
                        cstr = cstr + '<br><i class="fa fa-file-text form-cli text-primary" onclick="VeDescPro(' + aret.prod[i].codigo + ',\'\')"></i>';
                    }
                }
            }
            cstr = cstr + '</td></tr>';
        }
        cstr = cstr + '</tbody></table>';
        $("#pd_table").html(cstr);
        $("#pd_nome").focus();
        return true;
    }).fail(function (e, d) {
        nespera.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor'), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
    });


}
function MudaCorLinhaConsulta(nrow, nlen) {
    for (var i = 0; i < nlen; i++) {
        $("#prod-con-" + i).removeClass("bg-info");
        if (i == nrow) {
            $("#prod-con-" + i).addClass("bg-info");
        }
    }
}
function VeSaldoLoja(ncodigo) {
    $.ajax({
        method: "POST",
        url: curl + "index_p.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid, orcamento: lorc, serie: nserie, codigo: ncodigo, modo: 18, loja: nloja}
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

        bootbox.alert({
            message: aret.corpo,
            colorType: "info",
            callback: function () {
            }
        });
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
var nJanelaAtac = 0;
function MostraAtac(nPreco) {
    if (nJanelaAtac > 0) {
        clearTimeout(nJanelaAtac);
    }
    $("#m_preco_atac").html(nPreco);
    nJanelaAtac = setTimeout(function () {
        nJanelaAtac = 0;
        $("#m_preco_atac").html("");

    }, 1500);
}
function VePrecos(a, b, c, t, ct) {
    var caux = '<table class="table table-bordered">';
    if (lvercusto) {
        caux = caux + '<tr><td class="text-right">' + _tr('Custo') + '   : </td><td class="text-right">' + NumberFormat(amoeda[nmoeda - 1][3] * parseFloat(ct), amoeda[nmoeda - 1][2]) + '</td></tr>';
    }
    if (lmostraa) {
        caux = caux + '<tr><td class="text-right">' + _tr('Preço') + ' A : </td><td class="text-right">' + NumberFormat(amoeda[nmoeda - 1][3] * parseFloat(a), amoeda[nmoeda - 1][2]) + '</td></tr>';
    }
    if (lmostrab) {
        caux = caux + '<tr><td class="text-right">' + _tr('Preço') + ' B : </td><td class="text-right">' + NumberFormat(amoeda[nmoeda - 1][3] * parseFloat(b), amoeda[nmoeda - 1][2]) + '</td></tr>';
    }
    if (lmostrac) {
        caux = caux + '<tr><td class="text-right">' + _tr('Preço') + ' C : </td><td class="text-right" >' + NumberFormat(amoeda[nmoeda - 1][3] * parseFloat(c), amoeda[nmoeda - 1][2]) + '</td></tr>';
    }
    if (lmostrat) {
        //caux = caux + '<tr><td class="text-right">' + _tr('Preço') + ' ' + _tr('Atacado') + ' : </td><td class="text-right" >' + NumberFormat(amoeda[nmoeda - 1][3] * parseFloat(t), amoeda[nmoeda - 1][2]) + '</td></tr>';
        caux = caux + '<tr><td class="text-right">' + _tr('Preço') + ' ' + _tr('Atacado') + ' : </td><td class="text-right" onMouseOver="MostraAtac(\'' + NumberFormat(amoeda[nmoeda - 1][3] * parseFloat(t), amoeda[nmoeda - 1][2]) + '\')">XXXXX</td></tr>';
    }
    caux = caux + "</table>";
    bootbox.alert({
        message: caux,
        colorType: "info",
        callback: function () {
        }
    });

}
function VeNotas() {
    $.ajax({
        method: "POST",
        url: curl + "index_p.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid, orcamento: lorc, serie: nserie, modo: 63, vendedor: vendedor, loja: nloja, cliente: ncliente, venalteracliente: lVenAlteraCliente ? "1" : ""}
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

        var cstr = '<table class="table table-bordered" style="font-size: ' + $(".tabprod").css("font-size") + '">\n\
                            <thead class="bg-primary text-primary">\n\
                                <tr><th colspan="2">Nota</th><th>Data</th><th>Ite</th><th colspan="2">Valor</th>';
        if (ncliente == 0) {
            cstr = cstr + '<th>' + _tr('Cliente') + '</th>';
        }
        cstr = cstr + '</tr></thead>';

        cstr = cstr + "<tbody>";
        $("#lj_modal_cab").html(_tr("Selecione uma Nota"));
        for (var i = 0; i < (aret.not).length; i++) {
            cstr = cstr + '<tr>';
            //cstr = cstr + '<td scope="row"><input type="radio" name="lj_ck_not" onclick="$(\'#lj_notaalt\').val(' + poedigito(aret.not[i]["recno"]) + ');$(\'#lj_modal\').modal(\'hide\');AlteraNota();" ></td>';
            cstr = cstr + '<td scope="row"><input type="radio" name="lj_ck_not" onclick="AlteraNota1(' + poedigito(aret.not[i]["recno"]) + ');" ></td>';
            cstr = cstr + '<td>' + poedigito(aret.not[i]["recno"]) + "</td>";
            cstr = cstr + '<td>' + aret.not[i]["datasai"] + "</td>";
            cstr = cstr + '<td>' + NumberFormat(aret.not[i]["quansai"], 0) + "</td>";
            cstr = cstr + '<td>' + amoeda[aret.not[i]["moeda"] - 1][0] + "</td>";
            cstr = cstr + '<td>' + NumberFormat(aret.not[i]["valosai"] / amoeda[aret.not[i]["moeda"] - 1][3], amoeda[aret.not[i]["moeda"] - 1][2]) + "</td>";
            if (ncliente == 0) {
                cstr = cstr + '<td>' + aret.not[i]["codcli"] + "-" + aret.not[i]["nomcli"] + "</td>";
            } else if (i == 0) {
                $("#lj_modal_cab").html(_tr("Selecione uma Nota") + "<br>" + aret.not[i]["codcli"] + "-" + aret.not[i]["nomcli"]);
            }
            cstr = cstr + '</tr>';
        }
        cstr = cstr + '</tbody></table>';
        $("#lj_modal_corpo").html(cstr);
        $("#lj_modal").modal("show");






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






function VeKit(ncodigo) {
    $.ajax({
        method: "POST",
        url: curl + "index_p.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid, orcamento: lorc, serie: nserie, codigo: ncodigo, modo: 62, vendedor: nvendedor, loja: nloja}
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

        var cstr = '<table class="table table-bordered" style="font-size: ' + $(".tabprod").css("font-size") + '">\n\
                            <thead class="bg-primary text-primary">\n\
                                <tr><th>Código</th><th>' + _tr('Descrição') + '</th><th>' + _tr('Quant') + '<br>' + _tr('Kit') + '</th></tr></thead>';

        cstr = cstr + "<tbody>";
        for (var i = 0; i < (aret.pro).length; i++) {
            cstr = cstr + '<tr>';
            cstr = cstr + '<td scope="row">' + poedigito(aret.pro[i]["codigo"]) + "</td>";
            cstr = cstr + '<td>' + aret.pro[i]["nome"] + "</td>";
            cstr = cstr + '<td>' + NumberFormat(aret.pro[i]["quakit"], 0) + "</td>";
            cstr = cstr + '</tr>';
        }
        cstr = cstr + '</tbody></table>';
        $("#pd_detalhes_grade").html(cstr);
        $("#pd_grade_pro").html(poedigito(ncodigo) + "-" + aret.nome);
        $("#pd_grade").modal("show");






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




function VeGrade(ncodigo, nPromo) {
    $.ajax({
        method: "POST",
        url: curl + "index_p.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid, orcamento: lorc, serie: nserie, codigo: ncodigo, modo: 61}
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

        if (aret.blocopro.trim() && !aret.blocopro.trim().split("-").includes((nloja).toString())) {
            navigator.notification.alert(
                    _tr("Loja Atual") + ": " + nloja + "\n" + _tr("Não está na lista de lojas permitidas para venda deste ítem:") + "\n" + aret.blocopro.trim(), // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;

        }

        var cstr = '<table class="table table-bordered" style="font-size: ' + $(".tabprod").css("font-size") + '">\n\
                            <thead class="bg-primary text-primary">\n\
                                <tr>'
        for (var i = 0; i < (aret.cab).length; i++) {
            cstr = cstr + "<th" + (i == 0 ? ' colspan="2" >' : ">") + aret.cab[i] + "</th>";
        }
        cstr = cstr + "</tr><tbody>";

        for (var i = 0; i < (aret.pro).length; i++) {
            cstr = cstr + '<tr><td scope="row">';
            if (aret.pro[i][6] > 0) {
                cstr = cstr + '<i class="fa fa-cart-arrow-down form-cli text-warning" ></i>';
            } else {
                cstr = cstr + '<i class="fa fa-cart-plus form-cli text-success" onclick="AdicionaGrade2(' + ncodigo + ',' + aret.pro[i][2] + ',' + aret.pro[i][3] + ',1,' + aret.pro[i][5] + ',0,' + aret.pro[i][4] + ',' + nPromo + ')"  ></i>';
                /*(ncodigo, nseq1, nseq2, nquan, npreco,nquantant)*/
            }
            cstr = cstr + "</td><td>" + aret.pro[i][0] + '</td><td>' + aret.pro[i][1] + "</td>";
            for (var k = 3 + 4; k < (aret.pro[i]).length; k++) {
                cstr = cstr + '<td>' + aret.pro[i][k] + "</td>";
            }
            cstr = cstr + '</tr>';
        }
        cstr = cstr + '</tbody></table>';
        $("#pd_detalhes_grade").html(cstr);
        $("#pd_grade_pro").html(poedigito(ncodigo) + "-" + aret.nome);
        $("#pd_grade").modal("show");






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

function RemoveItemGra(ncodigo, nseq1, nseq2, nquant) {
    //navigator.vibrate(1000);
    navigator.notification.confirm(
            _tr("Remover item da nota") + "  ?", // message
            function (e) {
                if (e == 2) {
                    $.ajax({
                        method: "POST",
                        url: curl + "vendas.php",
                        cache: false,
                        async: false, //espera o retorno
                        timeout: nTimeOut,
                        data: {lj_preco: lj_preco, sid: sid, modo: 63, ncodigo: ncodigo, nquant: nquant, loja: nloja, seq1: nseq1, seq2: nseq2, orcamento: lorc, serie: nserie}
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

                        $("#pd_codigo").val("");
                        $("#pd_nome").val("");
                        PdBuscar();
                        CarregaNota();
                        $('.nav-tabs a[href="#venda"]').tab('show');

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
                return false;
            }, // callback
            _tr('Vendas'), // title
            [_tr(_tr('Não')), 'Ok']
            );
    return false;


}


function AutorizaInc() {
    //nmini1);
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
        data: {lj_preco: lj_preco, sid: sid, orcamento: lorc, serie: nserie, modo: 71, ncodigo: nacodigo,
            nquant: naquant,
            nquantant: naquantant,
            nvalor: navalor,
            nminimo: naminimo,
            nvenda: navenda, nsolicita: $("#pd_autoriza_ope").val(), cobs: $("#pd_obs").val(), nquantmax: naquantmax,
            ncusto: nacusto
        }
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

        EsperaAut();


    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor'), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    });


    //AutorizaPreco1(ncodigo, nquant, nvalor, nminimo, nvenda);
}


function AutorizaCan() {
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
                _tr('Sem comunicação com o servidor'), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    });
}






function AutorizaQuant(ncodigo, nquant, nvalor, nminimo, nvenda, nquantant, nquantmax, niva) {
    nacodigo = ncodigo;
    naquant = nquant;
    navalor = nvalor;
    naminimo = nminimo;
    navenda = nvenda;
    naquantant = nquantant;
    naquantmax = nquantmax;
    naiva = niva;
    lAutVendas = false;

    if (!naquantant) {
        naquantant = 0;
    }
    if (!naquantmax) {
        naquantmax = 0;
    }
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
function AutorizaPreco(ncodigo, nquant, nvalor, nminimo, nvenda, nquantant, niva, ncusto) {
    nacodigo = ncodigo;
    naquant = nquant;
    navalor = nvalor;
    naminimo = nminimo;
    navenda = nvenda;
    naquantant = nquantant;
    naquantmax = 0;
    naiva = niva;
    nacusto = ncusto;
    lAutVendas = false;

    if (!naquantant) {
        naquantant = 0;
    }
    //navigator.vibrate(800);

    VeAutorizadores();

    var cautoriza = '<select class="form-control" id="pd_autoriza_ope" style=" height: 50px;">';
    for (var i = 0; i < aautorizadores.length; i++) {
        cautoriza = cautoriza + '<option value="' + aautorizadores[i][0] + '" >' + aautorizadores[i][0] + '-' + aautorizadores[i][1] + '</option>';
    }
    cautoriza = cautoriza + '</select>';
    $("#pd_autoriza_ope_div").html(cautoriza);
    $("#pd_obs").val("");
    $("#pd_autoriza_can").css("visibility", "hidden");
    $("#pd_autoriza_inc").css("visibility", "visible");
    $("#pd_fechar").css("visibility", "visible");
    $("#pd_autoriza_ope").prop("disabled", false);
    $("#pd_obs").prop("disabled", false);

    $("#pd_autoriza").modal("show");

    //$("#pd_autoriza_inc").unbind('click');
    //$("#pd_autoriza_inc").removeAttr('onclick');


}

function EsperaAut() {
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
        data: {sid: sid, lj_preco: lj_preco, modo: 72, orcamento: lorc, serie: nserie, registro: nautoriza,
            ncodigo: ncodigo,
            ncusto: ncusto,
            nminimo: nminimo,
            nvenda: nvenda,
            nvalor: nvalor,
            nmodoautoriza: nModoAutoriza}

    }).done(function (e) {
        var aret = JSON.parse(e);
        if (parseInt(aret.erro) == 50) { //esperando
            njanela = setTimeout(EsperaAut, 2000);
            return false;
        }

        if (parseInt(aret.erro) == 40) { //negada
            if (njanela !== 0) {
                clearTimeout(njanela);
            }
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                        $("#vd_quant").modal("hide");
                        $("#pd_autoriza").modal("hide");
                        $("#vd_quant_enviar").attr("onclick", cvd_quant_enviar);
                        return false;
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
            var caux = $("#vd_quant_enviar").attr("onclick");//, "AdicionaItem1(" + ncodigo + ",0,false," + aret.prod[0].quantmax + "," + aret.prod[0].iva + ")");
            if (aGradeAdd.length > 0) {
                AdicionaGrade1(aGradeAdd[0], aGradeAdd[1], aGradeAdd[2], aGradeAdd[3], aGradeAdd[4], aGradeAdd[5], true);
            } else {
                AdicionaItem1(0, naquantant, true, naquantmax, naiva);
            }
            aGradeAdd = [];
            navigator.notification.alert(//concedida
                    aret.cerro,
                    function () {
                        $("#vd_quant").modal("hide");
                        $("#pd_autoriza").modal("hide");
                        $("#vd_quant_enviar").attr("onclick", cvd_quant_enviar);
                        return false;
                    },
                    _tr('Vendas'),
                    'Ok'
                    );
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
                _tr('Sem comunicação com o servidor'), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    });
}


function SosCelular(ncodigo, nquant, nvalor) {
    if (aprodutos.length != 1) {
        return false;
    }
    if (nquant !== 1) {
        return false;
    }
    $.ajax({
        method: "POST",
        url: curl + "vendas.php",
        cache: false,
        async: false,
        timeout: nTimeOut,
        data: {sid: sid, lj_preco: lj_preco, modo: 80, orcamento: lorc, serie: nserie, codigo: ncodigo}
    }).done(function (e) {
        var aret = JSON.parse(e);
        if (parseInt(aret.erro) == 40) { // sem seguro
            return false;
        }
        var caux = '<div class="row"> <span class=" alert-success "> <h2> ' + _tr('Adicionar seguro') + ' ?</h3></span></div>';
        if (aret.seg1 > 0) {
            caux = caux + '<div class="row"><h2>\n\
            &nbsp;&nbsp;&nbsp;<input type="radio" id="pd_seg1" name="pd_seg"  checked ><label for="pd_seg1" >' + NumberFormat(aret.seg1, 2) + '%&nbsp;&nbsp;&nbsp;' + amoeda[nmoeda - 1][0] + '&nbsp;' + NumberFormat(amoeda[nmoeda - 1][3] * nvalor * parseFloat(aret.seg1) / 100, amoeda[nmoeda - 1][2], ',', '') + ' </label></h2></div>';
        }
        if (aret.seg2 > 0) {
            caux = caux + '<div class="row"><h2>\n\
            &nbsp;&nbsp;&nbsp;<input type="radio" id="pd_seg2" name="pd_seg" ><label for="pd_seg1" >' + NumberFormat(aret.seg2, 2) + '%&nbsp;&nbsp;&nbsp;' + amoeda[nmoeda - 1][0] + '&nbsp;' + NumberFormat(amoeda[nmoeda - 1][3] * nvalor * parseFloat(aret.seg2) / 100, amoeda[nmoeda - 1][2], ',', '') + ' </label></h2></div>';
//            <input type="radio" id="pd_seg2" name="pd_seg"  ><label for="pd_seg2" >&nbsp;&nbsp;&nbsp;' + NumberFormat(aret.seg2, 2) + ' %</label>&nbsp;</h2></div>';
        }
        /*
         navigator.notification.confirm(
         caux, // message
         function (e) {
         if (e == 2) {
         GravaItem($("#pd_seg2").prop("checked")?aret.cod2:aret.cod1
         , nquant
         , nvalor*$("#pd_seg2").prop("checked")?aret.seg2:aret.seg1
         , 0
         , 0
         ,true);
         lseguro=true;
         CarregaNota();
         }
         return false;
         }, // callback
         _tr('Vendas'), // title
         [_tr('Não'), 'Ok']
         );
         */
        //navigator.vibrate(2000);
        bootbox.confirm({
            message: caux,
            colorType: "warning",
            sound: "warning",
            callback: function (e) {
                if (e) {
                    GravaItem($("#pd_seg2").prop("checked") ? aret.cod2 : aret.cod1
                            , nquant
                            , nvalor * ($("#pd_seg2").prop("checked") ? aret.seg2 : aret.seg1) / 100
                            , 0
                            , 0
                            , true
                            , 1);
                    lseguro = true;
                    MudaCampo();
                    CarregaNota();

                }
            }
        });

        return false;


    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + e.responseText + ' ' + d, // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    });

}
function VePromo(npromo, ncod) {
    $.ajax({
        method: "POST",
        url: curl + "index_p.php",
        cache: false,
        async: false,
        timeout: nTimeOut,
        data: {sid: sid, lj_preco: lj_preco, modo: 71, orcamento: lorc, serie: nserie, codigo: ncod, promo: npromo, loja: nloja}
    }).done(function (e) {
        var aret = JSON.parse(e);
        var caux = '<table class="table table-striped table-condensed"><tr><th class="text-right">Normal:</th><th>' + NumberFormat(amoeda[nmoeda - 1][3] * parseFloat(aret.tabela), amoeda[nmoeda - 1][2], ',', '') + "</th></tr>";

        for (var i = 1; i <= 13; i++) {
            caux = caux + '<tr><td class="text-right">' + i + (i == 13 ? " ou mais" : "") + " :</td><td> " + NumberFormat(amoeda[nmoeda - 1][3] * parseFloat(aret["p" + i]), amoeda[nmoeda - 1][2], ',', '') + "</td>";
        }
        caux = caux + "</table>"
        //navigator.vibrate(50);
        bootbox.alert({
            message: caux,
            colorType: "warning",
            sound: "warning",
            callback: function (e) {
            }
        });

        return false;


    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor.') + e.responseText + ' ' + d, // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    });
}



function VeAut(nAut) {
    var lret = false;
    $.ajax({
        method: "POST",
        url: curl + "vendas.php",
        cache: false,
        async: false,
        timeout: nTimeOut,
        data: {sid: sid, lj_preco: lj_preco, modo: 74, orcamento: lorc, serie: nserie, registro: nautoriza, senha: nAut}
    }).done(function (e) {
        var aret = JSON.parse(e);
        if (parseInt(aret.erro) !== 00) { //negada
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                        return lret;
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return lret;
        }
        if (aret.aut == "X") {
            lret = true;
        }

        return lret;


    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor'), // message
                function () {
                    return lret;
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return ret;
    });
    return lret;
}

function Exato(nnum, ndec) {
    if (!ndec) {
        ndec = 2;
    }
    var aaux = nnum.toString().split(".");
    if (aaux.length == 1) {
        aaux.push("00000");
    }
    var caux = aaux[0];
    if (ndec > 0) {
        caux = caux + "." + (aaux[1]).substr(0, ndec);
    }
    return parseFloat(caux);
}


function arre_pre(npreco) {
    var nresto;
    var nsoma;

    if (!larre_pre) {
        return npreco;
    }
    npreco = Math.round(npreco * 100)
    nresto = npreco % 10;
    if (nresto > 7) {
        nsoma = 10 - nresto;
    } else if (nresto >= 5 && nresto <= 7) {
        nsoma = (nresto - 5) * -1;
    } else if (nresto < 5 && nresto >= 3) {
        nsoma = 5 - nresto;
    } else if (nresto < 3) {
        nsoma = nresto * -1;
    } else {
        nsoma = 0;
    }

    npreco = npreco + nsoma;
    npreco = parseFloat(npreco / 100);
    //64460
    return npreco;
}



function SegRem(nPos) {
    var cmen = 'Remove seguro para o produto: <br><br><i><strong> ' + poedigito(aprodutos[nPos][0]) + "-" + aprodutos[nPos][1] + "</strong><br></span> ? ";
    bootbox.confirm({
        message: cmen,
        colorType: "warning",
        sound: "warning",
        callback: function (e) {
            if (e) {
                $.ajax({
                    method: "POST",
                    url: curl + "index_p.php",
                    cache: false,
                    async: false, //espera o retorno
                    timeout: nTimeOut,
                    data: {lj_preco: lj_preco, sid: sid, orcamento: lorc, serie: nserie, modo: "REM_SEG", ncodigo: aprodutos[nPos][0], vendedor: vendedor, loja: nloja}
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
                    CarregaNota();
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
function SegAdd(nPos, nvalor) {
//    nvalor = nvalor * 0.11;
    if (nPaisClienteCec !== 1) {
        nvalor = nvalor * 1.1;
    }
    nvalor = nvalor * (aConfig["PER_SOS"] / 100);
    var cmen = 'Adiciona seguro para o produto: <br><br><i><strong> ' + poedigito(aprodutos[nPos][0]) + "-" + aprodutos[nPos][1] + '</i></strong><br><br>No valor de : <span class="bg-danger text-danger"><strong> ' + NumberFormat(nvalor, amoeda[nmoeda - 1][2]) + "</strong></span> ? ";
    bootbox.confirm({
        message: cmen,
        colorType: "warning",
        sound: "warning",
        callback: function (e) {
            if (e) {
                $.ajax({
                    method: "POST",
                    url: curl + "index_p.php",
                    cache: false,
                    async: false, //espera o retorno
                    timeout: nTimeOut,
                    data: {lj_preco: lj_preco, sid: sid, orcamento: lorc, serie: nserie, modo: "ADD_SEG", ncodigo: aprodutos[nPos][0], vendedor: vendedor, loja: nloja, valor: nvalor / amoeda[nmoeda - 1][3]}
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
                    CarregaNota();
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
var ntelaseguro = null;
function SegAddPitzi(nPos, nvalor, nquant) {
//    nvalor = nvalor * 0.11;
    $.ajax({
        method: "POST",
        url: curl + "index_p.php",
        cache: false,
        async: false, //espera o retorno
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid, vendedor: vendedor, orcamento: lorc, serie: nserie
            , modo: "SEG_PITZI"
            , codigo: aprodutos[nPos][0]
            , valor: nvalor / amoeda[nmoeda - 1][3]
            , quant: nquant
            , cliente: ncliente
            , loja: nloja
            , moeda: nmoeda}
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
        if (aret.gar.length == 0) {
            bootbox.alert({
                message: "Sem seguro para o produto",
                colorType: "warning",
                callback: function () {
                }
            });
            return;
        }
        var caux = '<table class="table table-striped"> <tr><th></th><th colspan="2">Seguro</th><th>Quant</th><th>Vl.Prod</th><th>Vl.Seguro</th><th>Validade</th></tr>';
        for (var i = 0; i < aret.gar.length; i++) {
            caux += '<tr>';
            caux += '<td><input type="radio" name="pitzi" id="cl_pitzi_' + i + '" onclick="SelectPitzi(' + aret.gar[i].codigo + ',' + aprodutos[nPos][0] + ',' + nquant + ',' + nvalor + ' )" > </td>';
            caux += '<td>' + aret.gar[i].codigo + '</td>';
            caux += '<td>' + aret.gar[i].nome + '</td>';
            caux += '<td>' + aret.gar[i].quant + '</td>';
            caux += '<td>' + NumberFormat(aret.gar[i].valor, amoeda[nmoeda - 1][2], ',', '') + '</td>';
            caux += '<td>' + NumberFormat(aret.gar[i].valgar, amoeda[nmoeda - 1][2], ',', '') + '</td>';
            caux += '<td>' + aret.gar[i].tmax + '</td>';
            caux += '</tr>';
        }
        caux += '</table>';

        ntelaseguro = bootbox.alert({
            message: caux,
            colorType: "info",
            callback: function () {
            }
        });
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

    /*
     nvalor = nvalor * (aConfig["PER_SOS"] / 100);
     var cmen = 'Adiciona seguro para o produto: <br><br><i><strong> ' + poedigito(aprodutos[nPos][0]) + "-" + aprodutos[nPos][1] + '</i></strong><br><br>No valor de : <span class="bg-danger text-danger"><strong> ' + NumberFormat(nvalor, amoeda[nmoeda - 1][2]) + "</strong></span> ? ";
     bootbox.confirm({
     message: cmen,
     colorType: "warning",
     sound: "warning",
     callback: function (e) {
     if (e) {
     $.ajax({
     method: "POST",
     url: curl + "index_p.php",
     cache: false,
     async: false, //espera o retorno
     timeout: nTimeOut,
     data: {lj_preco: lj_preco, sid: sid, orcamento: lorc, serie: nserie, modo: "ADD_SEG", ncodigo: aprodutos[nPos][0], vendedor: vendedor, loja: nloja, valor: nvalor / amoeda[nmoeda - 1][3]}
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
     CarregaNota();
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
     */
}

function SelectPitzi(ncodigogar, nproduto, nquant, nvalor) {
    if (VeCliCpfGarantia(ncliente)) {
        GravaPitzi(ncodigogar, nproduto, nquant, nvalor);
    } else {
        ntelaseguro.modal("hide");
    }
    return;
}
function GravaPitzi(ncodigogar, nproduto, nquant, nvalor) {
    $.ajax({
        method: "POST",
        url: curl + "index_p.php",
        cache: false,
        async: true, //espera o retorno
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid, vendedor: vendedor, orcamento: lorc, serie: nserie
            , modo: "SEG_PITZI_ADD"
            , codigogar: ncodigogar
            , produto: nproduto
            , quant: nquant
            , cliente: ncliente
            , loja: nloja
            , valor: nvalor
            , moeda: nmoeda}
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
        ntelaseguro.modal("hide");

        ntelaseguro = bootbox.alert({
            message: "Seguro adicionado",
            colorType: "info",
            callback: function () {
                CarregaNota();
            }
        });
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

function SegRemPitzi(npos) {
    var ncodigo = aprodutos[npos][0];
    bootbox.confirm({
        message: "Elimina o seguro do produto ?",
        colorType: "warning",
        sound: "warning",
        callback: function (e) {
            if (e) {

                $.ajax({
                    method: "POST",
                    url: curl + "index_p.php",
                    cache: false,
                    async: false, //espera o retorno
                    timeout: nTimeOut,
                    data: {lj_preco: lj_preco, sid: sid, vendedor: vendedor, orcamento: lorc, serie: nserie
                        , modo: "SEG_PITZI_REM"
                        , produto: ncodigo
                        , cliente: ncliente
                    }
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
                    CarregaNota();
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
        }
    });
    return false;
    /*
     */
}