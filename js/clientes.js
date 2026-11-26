function FiltraHistorico(nmodo) {
    var ahist = [];
    var ccod = (trim($("#ht_codigo").val())).toUpperCase();
    var cnot = trim($("#ht_nota").val());
    var lnot;
    var lcod;
    if (nmodo == 1) {
        ccod = ccod.substr(0, ccod.length - 1);
    }
    if (nmodo == 2) {
        cnot = cnot.substr(0, cnot.length - 1);
    }

    var cstr = '<table class="table table-bordered" style="font-size: ' + $(".tabprod").css("font-size") + '">\n\
                            <thead class="bg-primary text-primary">\n\
                                <tr>\n\
                                    <th colspan="2">' + _tr('Produto') + ' </th>\n\
                                    <th>' + _tr('Qua') + '</th>\n\
                                    <th>' + _tr('Preço') + '</th>\n\
                                    <th>' + _tr('Data') + '</th>\n\
                                    <th>' + _tr('Nota') + '</th>\n\
                                </tr>\n\
                            </thead>\n\
                            <tbody>';
    for (var i = 0; i < (ahistorico).length; i++) {
        if (ccod == '') {
            lcod = true;
        } else {
            //lcod=(ahistorico[i][0]).search(ccod)!=-1;
            lcod = (ccod == (ahistorico[i][0]).substr(0, ccod.length));
            if (!lcod) {
                lcod = (ahistorico[i][1]).indexOf(ccod) >= 0;
            }
        }
        if (cnot == '') {
            lnot = true;
        } else {
            //lnot=(ahistorico[i][5]).search(cnot)!=-1;
            lnot = (cnot == (ahistorico[i][5]).substr(0, cnot.length));
        }
        if (lnot && lcod) {
            ahist.push(ahistorico[i]);
            var ltem = false;
            for (var k = 0; k < aprodutos.length; k++) {
                if (ahistorico[i][0] == aprodutos[k][0]) {
                    ltem = true;
                }
            }
            cstr = cstr + '<tr style="font-size: .9em;' + (ltem ? 'color: red' : '') + ' ">';
            cstr = cstr + '<td scope="row">' + poedigito(ahistorico[i][0]) + '</td>';
            cstr = cstr + '<td scope="row">' + ahistorico[i][1] + '</td>';
            cstr = cstr + '<td scope="row">' + NumberFormat(ahistorico[i][2], 0) + '</td>';
            cstr = cstr + '<td scope="row">' + NumberFormat(amoeda[nmoeda - 1][3] * parseFloat(ahistorico[i][3]), amoeda[nmoeda - 1][2]) + "</td>";
            cstr = cstr + '<td scope="row">' + ahistorico[i][4] + '</td>';
            cstr = cstr + '<td scope="row">' + NumberFormat(ahistorico[i][5], 0) + '</td>';
            cstr = cstr + '</tr>';
        }
    }
    /*    
     for (var i = 0; i < (ahist).length; i++) {
     cstr = cstr + '<tr style="font-size: .8em;">';
     cstr = cstr + '<td scope="row">' + poedigito(ahist[i][0]) + '</td>';
     cstr = cstr + '<td scope="row">' + ahist[i][1] + '</td>';
     cstr = cstr + '<td scope="row">' + NumberFormat(ahist[i][2], 0) + '</td>';
     cstr = cstr + '<td scope="row">' + NumberFormat(amoeda[nmoeda - 1][3] * parseFloat(ahist[i][3]), amoeda[nmoeda - 1][2]) + "</td>";
     cstr = cstr + '<td scope="row">' + ahist[i][4] + '</td>';
     cstr = cstr + '<td scope="row">' + NumberFormat(ahist[i][5], 0) + '</td>';
     cstr = cstr + '</tr>';
     }
     */
    cstr = cstr + '</tbody></table>';
    $("#thistorico").html(cstr);

}
function CarregaHistorico() {
    $("#thistorico").html("");
    $("#ht_codigo").val("");
    $("#ht_nota").val("");

    if (ncliente == 0) {
        return;
    }
    $.ajax({
        method: "POST",
        url: curl + "index_c.php",
        cache: false,
        async: false, //espera o retorno
        timeout: nTimeOut,
        data: {sid: sid, lj_preco: lj_preco, sid: sid, modo: 26
            , modoc: 'HIST_VEND'
            , loja: nloja
            , cliente: ncliente
            , orcamento: lorc
            , serie: nserie
        }
    }).done(function (e) {
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }
        if (aret.erro != '00') {
            //navigator.vibrate(1000);
            navigator.notification.alert(
                    aret.cerro + "*.", // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        ahistorico = aret.prod;
        FiltraHistorico();
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

function VeCep() {
    var ccep = ($("#cl_cep").val()).trim();
    if (!ccep) {
        return false;
    }
    if (ccep.length < 8) {
        //navigator.vibrate(1000);
        navigator.notification.alert(
                _tr("CEP não é válido"), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }

    $.ajax({
        method: "POST",
        url: curl + "index_c.php",
        cache: false,
        async: false, //espera o retorno
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid, modo: 20
            , modoc: "VE_CEP"
            , vendedor: vendedor
            , cep: $("#cl_cep").val()
            , orcamento: lorc
            , serie: nserie
        }
    }).done(function (e) {
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }
        if (aret.erro != '00') {
            //navigator.vibrate(1000);
            navigator.notification.alert(
                    aret.cerro + "*..", // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (aret.lok == 0) {
            navigator.notification.alert(
                    "CEP não localizado na base", // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;

        }
        if (aret.lok != 0) {
            if (($("#cl_endereco").val()).trim() == '') {
                $("#cl_endereco").val(aret.tp_logradouro + " " + aret.logradouro);
            }
            if (($("#cl_bairro").val()).trim() == '') {
                $("#cl_bairro").val(aret.bairro);
            }
            if (($("#cl_cidade").val()).trim() == '') {
                $("#cl_cidade").val(aret.cidade);
            }
            if (!$("#cl_uf").val()) {
                $("#cl_uf").val("");
            }
            if (($("#cl_uf").val()).trim() == '') {
                $("#cl_uf").val(aret.UF);
            }
            var luf = $("#cl_uf").val() !== '' && aret.UF && $("#cl_uf").val() != aret.UF;
            var lbairro = $("#cl_bairro").val() !== '' && aret.bairro && $("#cl_bairro").val() != aret.bairro;
            var lcidade = $("#cl_cidade").val() !== '' && aret.cidade && $("#cl_cidade").val() != aret.cidade;
            var lendereco = $("#cl_endereco").val() !== '' && (aret.tp_logradouro + " " + aret.logradouro).trim() && $("#cl_endereco").val() != (aret.tp_logradouro + " " + aret.logradouro);
            if (luf || lbairro || lcidade || lendereco) {
                var cstr = _tr("Os dados encontrado no CEP são diferentes") + ":\n";
                if (lendereco) {
                    cstr = cstr + "\n*" + _tr("ENDEREÇO") + ":\n   " + $("#cl_endereco").val() + "\n   " + (aret.tp_logradouro + " " + aret.logradouro);
                }
                if (lbairro) {
                    cstr = cstr + "\n*" + _tr("BAIRRO") + ":\n   " + $("#cl_bairro").val() + "\n   " + aret.bairro;
                }
                if (lcidade) {
                    cstr = cstr + "\n*" + _tr("CIDADE") + ":\n   " + $("#cl_cidade").val() + "\n   " + aret.cidade;
                }
                if (luf) {
                    cstr = cstr + "'\n*" + _tr("UF") + ":\n   " + $("#cl_uf").val() + "\n   " + aret.UF;
                }
                navigator.notification.confirm(
                        cstr, // message
                        function (e) {
                            if (e == 2) {
                                if (lendereco || ($("#cl_endereco").val()).trim() == '') {
                                    $("#cl_endereco").val(aret.tp_logradouro + " " + aret.logradouro);
                                }
                                if (lbairro || ($("#cl_bairro").val()).trim() == '') {
                                    $("#cl_bairro").val(aret.bairro);
                                }
                                if (lcidade || ($("#cl_cidade").val()).trim() == '') {
                                    $("#cl_cidade").val(aret.cidade);
                                }
                                if (luf || ($("#cl_uf").val()).trim() == '') {
                                    $("#cl_uf").val(aret.UF);
                                }
                            }
                            return false;
                        }, // callback
                        _tr('Vendas'), // title
                        ['Não', 'Ok']
                        );

            }

        }
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

function VeCepWeb() {
    var caux = ($("#cl_cep").val()).trim();
    var ccep = '';
    caux = caux.match(/[0-9]/g);

    for (var i = 0; i < caux.length; i++) {
        ccep = ccep + caux[i];
    }

    if (!ccep) {
        return false;
    }
    if (ccep.length < 8) {
        //navigator.vibrate(1000);
        navigator.notification.alert(
                _tr("CEP não é válido"), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }
    $.ajax({
        method: "GET",
        url: "https://viacep.com.br/ws/" + ccep + "/json/",
        cache: false,
        async: false, //espera o retorno
        timeout: nTimeOut
    }).done(function (e) {
        var aret = e;
        if (!aret || aret.erro !== undefined) {
            VeCep();
            return false;
            //navigator.vibrate(1000);
            navigator.notification.alert(
                    "CEP Não localizado", // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }

        aret.logradouro = (aret.logradouro).toUpperCase();
        aret.complemento = (aret.complemento).toUpperCase();
        aret.bairro = (aret.bairro).toUpperCase();
        aret.localidade = (aret.localidade).toUpperCase();
        aret.uf = (aret.uf).toUpperCase();

        if (($("#cl_endereco").val()).trim() == '') {
            $("#cl_endereco").val(aret.logradouro);
        }
        if (($("#cl_bairro").val()).trim() == '') {
            $("#cl_bairro").val(aret.bairro);
        }
        if (($("#cl_cidade").val()).trim() == '') {
            $("#cl_cidade").val(aret.localidade);
        }
        if (!$("#cl_uf").val()) {
            $("#cl_uf").val("");
        }
        if (($("#cl_uf").val()).trim() == '') {
            $("#cl_uf").val(aret.uf);
        }
        var luf = $("#cl_uf").val() !== '' && aret.UF && $("#cl_uf").val() != aret.UF;
        var lbairro = $("#cl_bairro").val() !== '' && aret.bairro && $("#cl_bairro").val() != aret.bairro;
        var lcidade = $("#cl_cidade").val() !== '' && aret.localidade && $("#cl_cidade").val() != aret.localidade;
        var lendereco = $("#cl_endereco").val() !== '' && (aret.logradouro).trim() && $("#cl_endereco").val() != aret.logradouro;
        if (luf || lbairro || lcidade || lendereco) {
            var cstr = _tr("Os dados encontrado no CEP são diferentes") + ":\n";
            if (lendereco) {
                cstr = cstr + "\n*" + _tr("ENDEREÇO") + ":\n   " + $("#cl_endereco").val() + "\n   " + (aret.logradouro);
            }
            if (lbairro) {
                cstr = cstr + "\n*" + _tr("BAIRRO") + ":\n   " + $("#cl_bairro").val() + "\n   " + aret.bairro;
            }
            if (lcidade) {
                cstr = cstr + "\n*" + _tr("CIDADE") + ":\n   " + $("#cl_cidade").val() + "\n   " + aret.localidade;
            }
            if (luf) {
                cstr = cstr + "'\n*" + _tr("UF") + ":\n   " + $("#cl_uf").val() + "\n   " + aret.uf;
            }
            navigator.notification.confirm(
                    cstr, // message
                    function (e) {
                        if (e == 2) {
                            if (lendereco || ($("#cl_endereco").val()).trim() == '') {
                                $("#cl_endereco").val(aret.logradouro);
                            }
                            if (lbairro || ($("#cl_bairro").val()).trim() == '') {
                                $("#cl_bairro").val(aret.bairro);
                            }
                            if (lcidade || ($("#cl_cidade").val()).trim() == '') {
                                $("#cl_cidade").val(aret.localidade);
                            }
                            if (luf || ($("#cl_uf").val()).trim() == '') {
                                $("#cl_uf").val(aret.uf);
                            }
                        }
                        return false;
                    }, // callback
                    _tr('Vendas'), // title
                    ['Não', 'Ok']
                    );


        }
        return false;
    }).fail(function (e, d) {
        VeCep();
        return false;
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor'), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
    });

}


function AlteraCliente() {
    var acli = [];
    //acli.push(["rg", "rg"]);
    //acli.push(["codigo", "codigo"]);
    acli.push(["cpf", "cpf"]);
    acli.push(["mail", "mail"]);
    acli.push(["nome", "nome"]);
    acli.push(["nasc", "nasc"]);
    acli.push(["pais", "pais"]);
    acli.push(["cep", "cep"]);
    acli.push(["endereco", "endereco"]);
    acli.push(["complemento", "complemen"]);
    acli.push(["bairro", "bairro"]);
    acli.push(["uf", "uf"]);
    acli.push(["cidade", "cidade"]);
    acli.push(["telefone", "telefone"]);
    acli.push(["celular", "celular"]);
    acli.push(["whats", "whatsapp"]);
    acli.push(["sexo_m", ""]);
    acli.push(["sexo_f", ""]);
    acli.push(["sexo_o", ""]);
    acli.push(["tipo_v", ""]);
    acli.push(["tipo_a", ""]);
    acli.push(["tipo_i", ""]);
    acli.push(["publicidade", ""]);
    for (var i = 0; i < acli.length; i++) {
        $("#cl_" + acli[i][0]).attr("disabled", false);
    }
    if ($("#cl_pais").val() !== "BRA") {
        $("#cl_cep").attr("disabled", true);
    }
    $("#cl_alterar_ini").css("display", "none");
    $("#cl_alterar").css("display", "block");
    $("#cl_incluir").css("display", "none");


}
function AltCli(linc, lforcename) {
    //navigator.vibrate(100);
    var acli = [];
    acli.push(["nome", _tr("um Nome")]);
    acli.push(["pais", _tr("um Pais")]);
    //acli.push(["endereco", "um Endereco"]);
    acli.push(["cidade", _tr("uma Cidade")]);
    acli.push(["rg", _tr("um RG")]);

    if (!lforcename) {
        lforcename = false;
    }

    var caux = '';
    for (var i = 0; i < acli.length; i++) {
        if (($("#cl_" + acli[i][0]).val()).trim() == '') {
            caux = caux + '\n' + _tr('Informe') + ' ' + acli[i][1];
        }
    }
// var acliente = [["emai",1], ["nasc",1], ["sexo",1], ["tipo",1], ["cep",1], ["ende",1], ["comp",1], ["bair",1], ["uf",1], ["publ",1], ["tele",1], ["celu",1], ["what",1]];
    if (acliente[0][1] == 2) {
        if (trim($("#cl_mail").val()) == "") {
            caux = caux + '\n' + _tr('Informe um email');
        }
    }
    if (acliente[1][1] == 2) {
        if (trim($("#cl_nasc").val()) == "" || $("#cl_nasc").val() <= '1915-01-01') {
            caux = caux + '\n' + _tr('Informe uma data de nascimento');
        }
    }
    if (acliente[2][1] == 2) {
        if (!$("#cl_sexo_m").prop("checked") && !$("#cl_sexo_f").prop("checked") && !$("#cl_sexo_o").prop("checked")) {
            caux = caux + '\nInforme um sexo';
        }
    }
    if (acliente[3][1] == 2) {
        if (!$("#cl_tipo_v").prop("checked") && !$("#cl_tipo_a").prop("checked") && !$("#cl_tipo_i").prop("checked")) {
            caux = caux + '\nInforme um tipo';
        }
    }
    if (acliente[4][1] == 2) {
        if ((trim($("#cl_cep").val())).length < 8) {
            caux = caux + '\nInforme um CEP';
        }
    }
    if (acliente[5][1] == 2) {
        if (trim($("#cl_endereco").val()) == "") {
            caux = caux + '\nInforme um Endereço';
        }
    }
    if (acliente[6][1] == 2) {
        if (trim($("#cl_complemento").val()) == "") {
            caux = caux + '\nInforme um complemento';
        }
    }
    if (acliente[7][1] == 2) {
        if (trim($("#cl_bairro").val()) == "") {
            caux = caux + '\nInforme um Bairro';
        }
    }
    if (acliente[8][1] == 2) {
        if (trim($("#cl_uf").val()) == "") {
            caux = caux + '\nInforme um Estado';
        }
    }
    if (acliente[10][1] == 2) {
        if (trim($("#cl_telefone").val()) == "") {
            caux = caux + '\nInforme um Telefone';
        }
    }
    if (acliente[11][1] == 2) {
        if (trim($("#cl_celular").val()) == "") {
            caux = caux + '\nInforme um celular';
        }
    }
    if (acliente[12][1] == 2) {
        if (trim($("#cl_whats").val()) == "") {
            caux = caux + '\nInforme um WhatsApp';
        }
    }
    if ($("#cl_cpf").val() && !isCPF($("#cl_cpf").val())) {
        caux = caux + '\nCPF inválido';
    }

    if (caux) {
        //navigator.vibrate(1000);
        navigator.notification.alert(
                caux + "*...", // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;

    }
    var ncodigo = 0;
    if (!linc) {
        ncodigo = parseInt($("#cl_codigo").val());
    }
    var nespera = bootbox.espera({
        message: 'Consultando o servidor ...'
    });
    $.ajax({
        method: "POST",
        url: curl + "index_c.php",
        cache: false,
        async: false, //espera o retorno
        timeout: nTimeOut,
        data: {sid: sid, lj_preco: lj_preco, modo: 10, modoc: 'CLI_ALT', vendedor: vendedor, loja: nloja
            , codigo: ncodigo
            , rg: $("#cl_rg").val()
            , cpf: $("#cl_cpf").val()
            , mail: $("#cl_mail").val()
            , nome: $("#cl_nome").val()
            , nasc: $("#cl_nasc").val()
            , pais: $("#cl_pais").val()
            , cep: $("#cl_cep").val()
            , endereco: $("#cl_endereco").val()
            , complemento: $("#cl_complemento").val()
            , bairro: $("#cl_bairro").val()
            , uf: $("#cl_uf").val()
            , cidade: $("#cl_cidade").val()
            , telefone: LimpaTel($("#cl_telefone").val())
            , celular: LimpaTel($("#cl_celular").val())
            , whats: $("#cl_whats").val()
            , sexo: ($("#cl_sexo_m").prop("checked") ? 1 : ($("#cl_sexo_f").prop("checked")?2:3))
            , tipo: $("#cl_tipo_v").prop("checked") ? 1 : ($("#cl_tipo_a").prop("checked") ? 2 : 3)
            , publicidade: $("#cl_publicidade").prop("checked") ? "Y" : "N"
            , orcamento: lorc
            , forcename: lforcename
            , serie: nserie
            , preferencial: $("#cl_preferencial").prop("checked") ? "Y" : "N"
            , zona: $("#cl_zona").val()
            , marca: acl_marca
            , grupo: acl_grupo
        }
    }).done(function (e) {
        var aret = JSON.parse(e);
        nespera.modal("hide");
        if (!VeSid(aret)) {
            return false;
        }
        //forcar duplicidade de nome
        if (aret.erro == '50') {
            navigator.notification.confirm(
                    aret.cerro + "\nCadastra assim mesmo ?", // message
                    function (e) {
                        if (e == 1) {
                            AltCli(linc, true);
                            return;
                        }
                    }, // callback
                    _tr('Vendas'), // title
                    ['Cadastrar', 'Não Cadastrar']                  // buttonName
                    );
            return false;
        }

        if (aret.erro !== '00') {
            navigator.notification.alert(
                    aret.cerro + "*....", // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        $("#cl_codigo").attr("disabled", false);
        ncliente = aret.codigo;
        VeCliente(parseInt(aret.codigo), '');
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
    return false;
}
function VeCliente(ncli = '', crg = '', cemail = '', cnome = '', lforce = false, ccpf = '') {
    if ($("#cl_codigo").attr("disabled") && !lforce) {
        LimpaCli();
        return false;
    }
    LimpaCli();
    if (!ncli && !crg && !cemail && !cnome && !ccpf) {
        return;
    }
    if (!ncli) {
        ncli = 0;
    }
    if (!crg) {
        crg = '';
    }
    if (!cemail) {
        cemail = '';
    }
    if (!cnome) {
        cnome = '';
    }
    if (ncli == 0 && crg == '' && cemail == '' && cnome == '' && ccpf == '') {
        return;
    }
    //navigator.vibrate(100);
    $("#cl_buscar_cod").hide();


    var nespera = bootbox.espera({
        message: 'Consultando o servidor ...'
    });

    $.ajax({
        method: "POST",
        url: curl + "cliente.php",
        async: false,
        cache: false,
        timeout: nTimeOut,
        data: {sid: sid, lj_preco: lj_preco, cliente: ncli, rg: crg, mail: cemail, nome: cnome, orcamento: lorc, serie: nserie, cpf: ccpf}
    }).done(function (e) {
        $("#cl_buscar_cod").show();
        nespera.modal("hide");
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            return false;
        }
        if (aret.erro == '77') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                        var ref = cordova.InAppBrowser.open(encodeURI(aret.url), '_blank', 'location=yes');
                        $("#cl_rg").val(crg);
                        return false;
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;

        }
        if (aret.erro == '99') {
            navigator.notification.alert(
                    aret.cerro + "*.....", // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (aret.regicli != '' && aret.vencido > 0) {
            navigator.notification.alert(
                    'Cliente é distribuidor e está com o registro vencido.\n\nVenceu em: ' + aret.vencto_reg + '\n\n IVA será aplicado se for o caso', // message
                    function () {
                        VeCliente1(ncli, crg, cemail, cnome, aret, ccpf);
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;

        }
        VeCliente1(ncli, crg, cemail, cnome, aret, ccpf);
        return false;

    }).fail(function (e, d) {
        $("#cl_buscar_cod").show();
        nespera.modal("hide");
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor') + " .", // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
    });


}

function VeCliente1(ncli, crg, cemail, cnome, aret, ccpf) {
    lClientePyFull=0;
    CarregaClienteDe(0);
    if (aret.erro == 1) {
        $("#cl_rg").val(crg);
        $("#cl_codigo").val(ncli);
        $("#cl_cpf").val(aret.cpf);
        if (crg != '' || ccpf) {
            //navigator.vibrate(1000);
            navigator.notification.confirm(
                    "Cliente não encontrado. Incluir cliente ?", // message
                    function (e) {
                        if (e == 2) {
                            LimpaCli();
                            $("#cl_rg").val(crg);
                            $("#cl_cpf").val(ccpf);
                            $("#cl_codigo").attr("disabled", true);
                            $("#cl_rg").attr("disabled", crg != '');
                            $("#cl_cpf").attr("disabled", ccpf != '');
                            $("#cl_det").css("display", "block");
                            $("#cl_incluir").css("display", "block");
                        } else {
                            LimpaCli();
                        }
                        AjustaCampoCli();
                        return false;
                    }, // callback
                    _tr('Vendas'), // title
                    ['Não', 'Ok']
                    );
            return false;

        } else {
            //navigator.vibrate(1000);
            navigator.notification.alert(
                    "Cliente não localizado", // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
        }
        return false;


    }
    if (aret.erro == 2) {
//            var cstr = '';
        $("#cl_ft_1,#ft_1").attr("src", "img/frente.png");
        $("#cl_ft_2,#ft_2").attr("src", "img/verso.png");
        $("#cl_modal_cab").html("Selecione um cliente");
        var cstr = '<table class="table table-striped">';
        cstr = cstr + "<tr><th colspan=2>Rg/RUC</th><th>Nome</th><th>Código</th></tr>";
        for (var i = 0; i < (aret.nomes).length; i++) {
            //cstr = cstr + '<tr style="font-size: ' + $(".tabprod").css("font-size") + '"><td><input type="radio" name="cl_nomes" onclick="VeCliente(' + aret.nomes[i][0] + ',\'\');$(\'#cl_modal\').modal(\'hide\');"></td><td>' + aret.nomes[i][2] + '</td><td>' + aret.nomes[i][1] + '</td><td>' + aret.nomes[i][0] + '</td></tr>';
            cstr = cstr + '<tr style="font-size: ' + $(".tabprod").css("font-size") + '"><td><input type="radio" name="cl_nomes" onclick="VeCliente(' + aret.nomes[i][0] + ',\'\');$(\'#cl_modal\').modal(\'hide\');"></td><td>' + aret.nomes[i][2] + '</td><td>' + aret.nomes[i][1] + '</td><td>' + aret.nomes[i][0] + '</td>'+
                    '<td><img height="30px" src="img/'+(aret.nomes[i][3]==1?'paraguay.png':(aret.nomes[i][4]==76?"brazil.png":(aret.nomes[i][3]==32?"argentina.png":"mundo.png")))+'"></td></tr>';
        }
        cstr = cstr + "</table>";
        $("#cl_modal_corpo").html(cstr);
        $("#cl_modal").modal('show');

        return false;
    }
    lClientePyFull=aret.clientepyfull;
//        IF ( ::cCli ) ->codigo == vecfg( "CLIECON2" )
    if (!ncli || ncli == 0) {
        ncli = aret.codigo;
    }
    if (aConfig["CLIECON2"] == ncli) {
        CarregaClienteDe(0);
    } else {
        CarregaClienteDe(ncli);
    }


    $("#fn_cliente").html(aret.codigo + "-" + aret.nome);
    var acli = [];
    acli.push(["rg", "rg"]);
    acli.push(["cpf", "cpf"]);
    acli.push(["codigo", "codigo"]);
    acli.push(["mail", "mail"]);
    acli.push(["nome", "nome"]);
    acli.push(["nasc", "nasc"]);
    acli.push(["pais", "pais"]);
    acli.push(["cep", "cep"]);
    acli.push(["endereco", "endereco"]);
    acli.push(["complemento", "complemen"]);
    acli.push(["bairro", "bairro"]);
    acli.push(["uf", "uf"]);
    acli.push(["cidade", "cidade"]);
    acli.push(["telefone", "telefone"]);
    acli.push(["celular", "celular"]);
    acli.push(["whats", "whatsapp"]);
    acli.push(["zona", "zona"]);



    for (var i = 0; i < acli.length; i++) {
        $("#cl_" + acli[i][0]).val(aret[acli[i][1]]);
        $("#cl_" + acli[i][0]).attr("disabled", true);
    }
    $("#cl_det").css("display", "block");
    if (aret.sexo == 1) {
        $("#cl_sexo_m").prop("checked", true);
    } else if(aret.sexo==2) {
        $("#cl_sexo_f").prop("checked", true);
    } else  {
        $("#cl_sexo_o").prop("checked", true);
    }
    $("#cl_sexo_m").attr("disabled", true);
    $("#cl_sexo_f").attr("disabled", true);
    $("#cl_sexo_o").attr("disabled", true);
    if (aret.tipo == 3) {
        $("#cl_tipo_i").prop("checked", true);
    } else if (aret.tipo == 2) {
        $("#cl_tipo_a").prop("checked", true);
    } else {
        $("#cl_tipo_v").prop("checked", true);
    }
    $("#cl_tipo_v").attr("disabled", true);
    $("#cl_tipo_a").attr("disabled", true);
    $("#cl_tipo_i").attr("disabled", true);
    $("#cl_publicidade").prop("checked", aret.aceitamail == 'Y');
    $("#cl_publicidade").attr("disabled", true);

    //foto
    if (aret.imagem1 == "0") {
        $("#cl_ft_1,#ft_1").attr("src", "img/frente.png");
    } else {
        $("#cl_ft_1,#ft_1").attr("src", curl + "cedula1.php?img=1&cod=" + aret.codigo + "&serie=" + ((new Date()).getSeconds()));
    }

    if (aret.imagem2 == "0") {
        $("#cl_ft_2,#ft_2").attr("src", "img/verso.png");
    } else {
        $("#cl_ft_2,#ft_2").attr("src", curl + "cedula1.php?img=2&cod=" + aret.codigo + "&serie=" + ((new Date()).getSeconds()));
    }
    $("#cl_alterar_ini").css("display", "block");
    if (lNCadCliCec) {
        $("#cl_alterar_ini").css("display", "none");
        $("#cl_cedula").css("display", "none");
    }
//    $("#cl_alterar_ini").css("display","block");
    if (aret.imagem1 > 0) {
        $("#cl_imagem1").removeClass("fa-user-times");
        $("#cl_imagem1").addClass("fa-user-plus");
        $("#cl_btimagem1").removeClass("btn-danger");
        $("#cl_btimagem1").addClass("btn-success");
    } else {
        $("#cl_imagem1").removeClass("fa-user-plus");
        $("#cl_imagem1").addClass("fa-user-times");
        $("#cl_btimagem1").removeClass("btn-success");
        $("#cl_btimagem1").addClass("btn-danger");
    }
    if (aret.imagem2 > 0) {
        $("#cl_imagem2").removeClass("fa-user-times");
        $("#cl_imagem2").addClass("fa-user-plus");
        $("#cl_btimagem2").removeClass("btn-danger");
        $("#cl_btimagem2").addClass("btn-success");
    } else {
        $("#cl_imagem2").removeClass("fa-user-plus");
        $("#cl_imagem2").addClass("fa-user-times");
        $("#cl_btimagem2").removeClass("btn-success");
        $("#cl_btimagem2").addClass("btn-danger");
    }
    if (lDistribuidor!=9999999999 && !lDistribuidor && aret.regicli && aprodutos.length > 0){
        ncliente = 0;
        nguia = 0;
        LimpaCli();
        //navigator.vibrate(1000);
        navigator.notification.alert(
                "O cliente que está na venda\n** NÃO É DISTRIBUIDOR **,\nporém você já lançou produtos e está tentando mudar para\n** PARAGUAIO distribuidor **\n Elimine os produtos da nota ou a reinicie", // message
                function () {
                    VeCliente(nClienteAnterior);
                    return;
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
        
    }
    if (lDistribuidor!=9999999999 && lDistribuidor && !aret.regicli && aprodutos.length > 0){
        ncliente = 0;
        nguia = 0;
        LimpaCli();
        //navigator.vibrate(1000);
        navigator.notification.alert(
                "O cliente que está na venda\n** É DISTRIBUIDOR **,\nporém você já lançou produtos e está tentando mudar para\n** não distribuidor **\n Elimine os produtos da nota ou a reinicie", // message
                function () {
                    VeCliente(nClienteAnterior);
                    return;
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
        
    }
    if (aret.paiscli == 1 && !$("#lj_ck_n1").prop("checked") && aprodutos.length > 0) {
        ncliente = 0;
        nguia = 0;
        LimpaCli();
        //navigator.vibrate(1000);
        navigator.notification.alert(
                "O cliente que você selecionou É PARAGUAIO,\nporém você já lançou produtos como sendo a cliente EXTRANGEIROS (sem iva). Elimine os produtos da nota ou a reinicie", // message
                function () {
                    VeCliente(nClienteAnterior);
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;

    } else {
        $("#lj_ck_n" + aret.paiscli).prop("checked", true);
        $("#lj_ck_n1").attr("disabled", true);
        $("#lj_ck_n2").attr("disabled", true);
    }

    lDistribuidor=aret.regicli;
    nClienteAnterior=aret.codigo;
    acl_marca = aret.marca.split('-');
    for (var i = 0; i < acl_marca.length; i++) {
        acl_marca[i] = parseInt(acl_marca[i]);
    }
    acl_grupo = aret.grupo.split('-');
    for (var i = 0; i < acl_grupo.length; i++) {
        acl_grupo[i] = parseInt(acl_grupo[i]);
    }
    if (aret.nasc !== '1000-01-01') {
        $("#cl_preferencial").prop('checked', true);
        $("#c_form_preferencial").removeClass("hidden");
    } else {
        $("#cl_preferencial").prop('checked', false);
        $("#c_form_preferencial").addClass("hidden");
    }

    nPaisClienteCec = parseInt(aret.paiscli);

    ncliente = parseInt(aret.codigo);
    AjustaCampoCli();
    nguia = parseInt(aret.nguia);

    $("#lj_guia").val("");
    if (nguia && nguia > 0) {
        $("#lj_guia").val(nguia + "-" + aret.cguia);
    }

    //if (parseInt($("#lj_prazo").val()) !== 0) {
    $("#lj_prazo").val(aret.przcli);
    //}
    if (parseInt(aret.przcli) + 0 > 0) {
        $("#lj_prazo").prop("disabled", true);
        if ($("#lj_ck_p3").css("display") == "block") {
            $("#lj_ck_p3").prop("checked", true);
        }
    } else {
        $("#lj_prazo").prop("disabled", false);
    }
    var npag = $("#lj_ck_p3").prop("checked") ? 3 : ($("#lj_ck_p2").prop("checked") ? 2 : 1);
    $("#fn_pagamento").html(npag == 3 ? "Prazo" + " - " + $("#lj_prazo").val() + " dias" : (npag == 2 ? _tr("Cartão de Crédito") : _tr("Dinheiro")));

    //limpa o relatorio cliente
    $("#dv_selecione").hide();
    $("#dv_cab").show();
    $("#dv_botao").show();
    $("#dv_data").show();
    $("#dv_tabela").html("");

    $("#dfoto").show();
    //
    CarregaHistorico();
    MudaCampo();
    if (aret.blocli == "S") {
        $("#cl_bloq").show();
        //ncliente=0;
        lclibloq = true;
    } else {
        $("#cl_bloq").hide();
        lclibloq = false;
    }
    VeEstatus();
    Localizacao1(false);
    return false;
}










function AjustaCampoCli() {
    for (var i = 0; i < acliente.length; i++) {
        if (acliente[i][1] == 0) {
            $("#c_" + acliente[i][0]).css("display", "none");
        } else {
            $("#c_" + acliente[i][0]).css("display", "block");
        }

    }
}







function LimpaCli() {
    ncliente = 0;
    nguia = 0;
    acl_marca = [];
    acl_grupo = [];
    lclibloq = false;

    //limpa o relatorio cliente
    $("#dv_selecione").show();
    $("#dv_cab").hide();
    $("#dv_botao").hide();
    $("#dv_data").hide();
    $("#dv_tabela").html("");

    $("#dfoto").hide();

    $("#c_form_preferencial").addClass("hidden");
    $("#cl_tipo_i").prop("checked", false);
    $("#cl_tipo_a").prop("checked", false);
    $("#cl_tipo_v").prop("checked", true);


    //
    $("#lj_guia").val("");
    $("#cl_bloq").hide();
    $("#cl_det").css("display", "none");
    $("#fn_cliente").html("");
    var acli = [];
    $("#cl_ft_1,#ft_1").attr("src", "img/frente.png");
    $("#cl_ft_2,#ft_2").attr("src", "img/verso.png");

    acli.push(["rg", "rg"]);
    acli.push(["cpf", "cpf"]);
    acli.push(["codigo", "codigo"]);
    acli.push(["mail", "mail"]);
    acli.push(["nome", "nome"]);
    acli.push(["nasc", "nasc"]);
    acli.push(["pais", "pais"]);
    acli.push(["cep", "cep"]);
    acli.push(["endereco", "endereco"]);
    acli.push(["complemento", "complemen"]);
    acli.push(["bairro", "bairro"]);
    acli.push(["uf", "uf"]);
    acli.push(["cidade", "cidade"]);
    acli.push(["telefone", "telefone"]);
    acli.push(["celular", "celular"]);
    acli.push(["whats", "whatsapp"]);

    for (var i = 0; i < acli.length; i++) {
        $("#cl_" + acli[i][0]).val("");
        $("#cl_" + acli[i][0]).attr("disabled", false);
    }
    $("#cl_pais").val(600);
    $("#cl_sexo_m").prop("checked", true);
    $("#cl_sexo_m").attr("disabled", false);
    $("#cl_sexo_f").attr("disabled", false);
    $("#cl_sexo_o").attr("disabled", false);
    $("#cl_tipo_v").prop("checked", true);
    $("#cl_tipo_v").attr("disabled", false);
    $("#cl_tipo_a").attr("disabled", false);
    $("#cl_tipo_i").attr("disabled", false);
    $("#cl_publicidade").prop("checked", true);
    $("#cl_publicidade").attr("disabled", false);
    $("#cl_cep").attr("disabled", true);
    $("#lj_ck_n1").attr("disabled", false);
    $("#lj_ck_n2").attr("disabled", false);
    $("#cl_preferencial").prop("checked", false);


    $("#cl_alterar_ini").css("display", "none");
    $("#cl_alterar").css("display", "none");
    $("#cl_incluir").css("display", "none");

    $("#pd_codigo").val("");
    $("#pd_nome").val("");

    $("#de_cl_pais").val(600);
    $("#de_cl_nat").val(2);
    $("#de_cl_tipo_ope").val(2);
    $("#de_cl_con").val(1);
    $("#de_cl_cl_ruc").val("");
    $("#de_cl_nome").val("");
    $("#de_cl_fantasia").val("");
    $("#de_cl_cep").val("");
    $("#de_cl_cidade").val("");
    $("#de_cl_cidade_num").val("");
    $("#de_cl_estado").val("");
    $("#de_cl_endereco").val("");
    $("#de_cl_numero").val("");
    $("#de_cl_bairro").val("");
    $("#de_cl_tip_doc").val(1);
    $("#de_cl_documento").val("");
    $("#de_cl_cpf").val("");
    $("#de_cl_fone").val("");
    $("#de_cl_celular").val("");
    $("#de_cl_mail").val("");

    PdBuscar();


    /*
     
     $("#cl_det").css("display", "none");
     $("#cl_rg").attr("disabled", false);
     $("#cl_codigo").attr("disabled", false);
     $("#cl_rg").val("");
     $("#cl_codigo").val("");
     
     $("#cl_mail").val("");
     $("#cl_nome").val("");
     $("#cl_nasc").val("1900-01-01");
     $("#cl_sexo_m").prop("checked", true);
     $("#cl_tipo_v").prop("checked", true);
     $("#cl_pais").val("");
     $("#cl_cep").val("");
     $("#cl_endereco").val("");
     $("#cl_complemento").val("");
     $("#cl_bairro").val("");
     $("#cl_uf").val("");
     $("#cl_cidade").val("");
     $("#cl_publicidade").prop("checked", true);
     $("#cl_telefone").val("");
     $("#cl_celular").val("");
     $("#cl_whats").val("");
     $("#cl_salvar").prop("disabled", true);
     */
}

function CarregaCliente() {
//    if (!window.localStorage.getItem("cecvendas" + nempresa + "_local") || window.localStorage.getItem("cecvendas" + nempresa + "_local") == 0) {
    if (!veconfig.local || veconfig.local == 0) {
        for (var i = 0; i < acliente.length; i++) {
            //acliente[i][1] = window.localStorage.getItem("cecvendas" + nempresa + "_c_" + acliente[i][0]);
            acliente[i][1] = veconfig["c_" + acliente[i][0]];
        }
        /*
        lvenda = window.localStorage.getItem("cecvendas" + nempresa + "_venda");
        lminimo = window.localStorage.getItem("cecvendas" + nempresa + "_minimo");
        lmostraa = window.localStorage.getItem("cecvendas" + nempresa + "_mostraa") == "1";
        lmostrab = window.localStorage.getItem("cecvendas" + nempresa + "_mostrab") == "1";
        lmostrac = window.localStorage.getItem("cecvendas" + nempresa + "_mostrac") == "1";
        lmostrat = window.localStorage.getItem("cecvendas" + nempresa + "_mostrat") == "1";
        */
         
        lvenda = veconfig.venda;
        lminimo = veconfig.minimo;
        lmostraa = veconfig.mostraa == "1";
        lmostrab = veconfig.mostrab == "1";
        lmostrac = veconfig.mostrac == "1";
        lmostrat = veconfig.mostrat == "1";
        return false;
    }

    $.ajax({
        method: "POST",
        url: curl + "index_c.php",
        async: false,
        cache: false,
        timeout: 10000,
        data: {sid: sid, lj_preco: lj_preco, modo: 81
            , modoc: 'CLI_LOAD'
            , orcamento: lorc
            , serie: nserie
        }
    }).done(function (e) {
        var aret = JSON.parse(e);
        for (var i = 0; i < acliente.length; i++) {
            acliente[i][1] = aret.cli["cl_" + (i + 1)];
        }
        lvenda = (aret.cli["venda"]).trim();
        lminimo = (aret.cli["minimo"]).trim();
        lmostraa = aret.cli["mostraa"] == "1";
        lmostrab = aret.cli["mostrab"] == "1";
        lmostrac = aret.cli["mostrac"] == "1";
        lmostrat = aret.cli["mostrat"] == "1";
        return false;
    }).fail(function (e, d) {
        navigator.notification.alert(
                'Sem comunicação com o servidor. Adotando configuraqções local', // message
                function () {
                    for (var i = 0; i < acliente.length; i++) {
                        //acliente[i][1] = window.localStorage.getItem("cecvendas" + nempresa + "_c_" + acliente[i][0]);
                        acliente[i][1] = veconfig["c_" + acliente[i][0]];
                    }
                    return false;
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    });
    return false;


}


function VeCliCpfGarantia(ncli) {
    var lret = true;
    $.ajax({
        method: "POST",
        url: curl + "index_p.php",
        cache: false,
        async: false, //espera o retorno
        timeout: nTimeOut,
        data: {lj_preco: lj_preco, sid: sid, vendedor: vendedor, orcamento: lorc, serie: nserie
            , modo: "SEG_PITZI_CPF"
            , cliente: ncli
        }
    }).done(function (e) {
        var aret = JSON.parse(e);
        if (!VeSid(aret)) {
            lret = false;
            return lret;
        }
        if (aret.erro !== '00') {
            bootbox.alert({
                message: "<strong>Problemas com o Cadastro do cliente.</strong><BR>Corrija os dados no cadastro<br><br>" + aret.cerro,
                colorType: "danger",
                callback: function () {
                    lret = false;
                    return lret;
                }
            });
            lret = false;
            return lret;
        }

        lret = true;
        return lret;
    }).fail(function (e, d) {
        navigator.notification.alert(
                _tr('Sem comunicação com o servidor'), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
    });
    return lret;
}

