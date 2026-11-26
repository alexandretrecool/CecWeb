$("#de_buscar").change(function () {
    if (!$(this).val()) {
        $("#de_modal").modal("hide");
        return false;
    }
    var aaux = ($(this).val()).split("|");
    $("#de_cl_cidade_num").val(aaux[0]);
    $("#de_cl_cidade").val(aaux[1]);
    $("#de_cl_estado").val(aaux[2]);
    $("#de_modal").modal("hide");
    return true;
}); 
$("#de_cl_cidade").on("blur", function () {
    $("#de_cl_cidade_num").val("");
    if (!$(this).val()) {
        return false;
    }
    if ($("#de_cl_pais").val() == 600) {

        var nespera = bootbox.espera({
            message: _tr('Consultando o servidor ...')
        });
        $.ajax({
            method: "POST",
            url: curl + "funcoes.php",
            async: true,
            cache: false,
            timeout: nTimeOut * 3,
            data: {sid: sid, modo: 'CIDADEPY', cidade: $("#de_cl_cidade").val()}
        }).done(function (e) {
            nespera.modal("hide");
            var aret = JSON.parse(e);
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
            if (aret.cidade.length == 0) {
                navigator.notification.alert(
                        _tr("CIDADE não encontrada"), // message
                        function () {

                        }, // callback
                        _tr('Vendas'), // title
                        'Ok'                  // buttonName
                        );
                return false;

            }

            $("#de_buscar").empty();
            $('#de_buscar').append($('<option>', {
                value: "",
                text: ''
            }));
            for (var i = 0; i < aret.cidade.length; i++) {
                $('#de_buscar').append($('<option>', {
                    value: aret.cidade[i][0] + "|" + aret.cidade[i][1] + "|" + aret.cidade[i][3],
                    text: aret.cidade[i][1] + " / " + aret.cidade[i][3]
                }));
            }
            $("#de_modal").modal("show");
            if (aret.cidade.length == 1) {
                $("#de_buscar").val(aret.cidade[i][0] + "|" + aret.cidade[i][1] + "|" + aret.cidade[i][3]);
                $("#de_buscar").change();
            }
            return false;
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
});

$("#de_cl_celular").on("blur", function () {
    return VeCelular();
});
function VeCelular() {
    var ctelefone = trim($("#de_cl_celular").val());
    var npais = $("#de_cl_pais").val();
    var cformato;
    ctelefone = LimpaTel(ctelefone);
    if (!ctelefone) {
        return true;
    }
    if (npais == 600) {
        cformato = "\n\nFormato: (09XX) xxx-xxx ";
        if (!/^[0-9]+$/.test(ctelefone)) {
            navigator.notification.alert(
                    _tr("Celular inválido") + cformato, // message
                    function () {

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (ctelefone.substr(0, 1) !== '0') {
            navigator.notification.alert(
                    _tr("Celular inválido") + ". " + _tr("Deve começar com 0") + cformato, // message
                    function () {

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (ctelefone.substr(1, 1) !== '9') {
            navigator.notification.alert(
                    _tr("Este número não é de celular.") + cformato, // message
                    function () {

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (ctelefone.length < 10) {
            navigator.notification.alert(
                    _tr("Celular muito pequeno") + cformato, // message
                    function () {

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        /*
         if (ctelefone.substr(0, 1) != '0' || ctelefone.substr(1, 1) == '0') {
         navigator.notification.alert(
         _tr("Celular inválido") + ". " + _tr("Debe começar com 0"), // message
         function () {
         
         }, // callback
         _tr('Vendas'), // title
         'Ok'                  // buttonName
         );
         return false;
         }
         if (ctelefone.substr(1, 1) !== '9') {
         navigator.notification.alert(
         _tr("Este número não é de celular."), // message
         function () {
         
         }, // callback
         _tr('Vendas'), // title
         'Ok'                  // buttonName
         );
         return false;
         }
         if (ctelefone.length < 10) {
         navigator.notification.alert(
         _tr("Celular muito pequeno"), // message
         function () {
         
         }, // callback
         _tr('Vendas'), // title
         'Ok'                  // buttonName
         );
         return false;
         }
         */
    } else if (npais == 76) {
        cformato = "\n\nFormato: (DD) 9xxxx-xxxx ";
        if (!/^[0-9]+$/.test(ctelefone)) {
            navigator.notification.alert(
                    _tr("Celular inválido") + cformato, // message
                    function () {

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (ctelefone.substr(0, 2) == "55" && ctelefone.length == 13) {
            ctelefone = ctelefone.substr(2);
            $("#de_cl_celular").val(ctelefone);
        }
        if (ctelefone.substr(0, 1) == "0") {
            ctelefone = ctelefone.substr(1);
            $("#de_cl_celular").val(ctelefone);
        }

        //45998313601
        //12345678901
        if (
                ctelefone.length !== 11 ||
                ctelefone.substr(2, 1) !== "9" ||
                ctelefone.substr(1, 1) == "0"
                ) {
            navigator.notification.alert(
                    _tr("Celular inválido") + cformato, // message
            
            
                    function () {

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;

        }
    } else {
        if (ctelefone.length < 6) {
            navigator.notification.alert(
                    _tr("Celular muito pequeno"), // message
                    function () {

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;

        }

    }
    return true;

}
$("#de_cl_fone").on("blur", function () {
    return VeTelefone();
});
function VeTelefone() {
    var ctelefone = trim($("#de_cl_fone").val());
    var npais = $("#de_cl_pais").val();
    var cformato;
    ctelefone = LimpaTel(ctelefone);
    if (!ctelefone) {
        return true;
    }

    if (npais == 600) {
        cformato = "\n\nFormato: (0DD) xxxxxxxx ";
        if (!/^[0-9]+$/.test(ctelefone)) {
            navigator.notification.alert(
                    _tr("Telefone inválido") + cformato, // message
                    function () {

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (ctelefone.substr(0, 1) !== '0' || ctelefone.substr(1, 1) == '0') {
            navigator.notification.alert(
                    _tr("Telefone inválido") + ". " + _tr("Deve começar com 0") + cformato, // message
                    function () {

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (ctelefone.substr(1, 1) == '9') {
            navigator.notification.alert(
                    _tr("Este número é de celular. Informe um telefone fixo") + cformato,
                    function () {

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (ctelefone.length < 9) {
            navigator.notification.alert(
                    _tr("Telefone muito pequeno") + cformato, // message
                    function () {

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
    } else if (npais == 76) {
        cformato = "\n\nFormato: (DD) xxxx-xxxx";
        if (ctelefone.length < 10) {
            navigator.notification.alert(
                    _tr("Telefone muito pequeno") + cformato, // message
                    function () {

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;

        }
        //4530282650
        if (ctelefone.substr(0,1) =="0" ||
            ctelefone.substr( 1, 1 ) == "0" ||
            ctelefone.substr( 2, 1 ) == "0" ||
            ctelefone.substr( 2, 1 ) == "9" ||
            ctelefone.substr( 2, 1 ) == "8" ||
            ctelefone.substr( 2, 1 ) == "7" ||
            LimpaRg( ctelefone ).length !== ctelefone.length ){
            navigator.notification.alert(
                    _tr('Telefone fixo COM FORMATO INVÁLIDO ')+cformato, // message
                    function () {

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;

            }
        } else {
        if (ctelefone.length < 6) {
            navigator.notification.alert(
                    _tr("Telefone muito pequeno"), // message
                    function () {

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;

        }

    }
    return true;

}
$("#de_cl_mail").on("blur", function () {
    $(this).val($(this).val().trim().toLowerCase());
    return VerificaEmail();
});
function VerificaEmail() {
    var cmail = trim($("#de_cl_mail").val());
    if ((cmail).toUpperCase() == "CLIENTE NO TIENE CORREO ELECTRONICO") {
        return true;
    }
    if (!cmail) {
        navigator.notification.alert(
                _tr('Si el cliente no dispone de correo, informar:') + ' "CLIENTE NO TIENE CORREO ELECTRONICO"',
                function () {

                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }

    if (!ValidaMail(cmail)) {
        navigator.notification.alert(
                _tr("E-mail inválido"), // message
                function () {

                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;

    }
    return true;

}
$("#de_cl_cep").on("blur", function () {
    if ($("#de_cl_pais").val() != 76) {
        return true;
    }
    var nespera = bootbox.espera({
        message: 'Consultando o servidor ...'
    });
    $.ajax({
        method: "POST",
        url: curl + "funcoes.php",
        async: true,
        cache: false,
        timeout: nTimeOut * 3,
        data: {sid: sid, modo: 'CEP', cep: $("#de_cl_cep").val()}
    }).done(function (e) {
        nespera.modal("hide");
        //alert(e);
        var aret = JSON.parse(e);
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
        if (!aret.existe) {
            navigator.notification.alert(
                    _tr("CEP não encontrado"), // message
                    function () {

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;

        }
        $("#de_cl_cidade").val(aret.localidade);
        $("#de_cl_estado").val(aret.uf);
        $("#de_cl_endereco").val(aret.logradouro);
        $("#de_cl_bairro").val(aret.bairro);
        return false;
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


});
$("#de_cl_ruc").on("blur", function () {
    if ($("#de_cl_nat").val() == 2) { //NAO CONTRIBUINTE
        $("#de_cl_ruc").val("");
        return true;
    }
    if ($("#de_cl_pais").val() != 600) {
        return true;
    }
    if ($("#de_cl_ruc").val() == 0 || !$("#de_cl_ruc").val()) {
        return true;
    }
    if (!VeDigitoRuc($("#de_cl_ruc").val())) {
        navigator.notification.alert(
                _tr("RUC inválido"), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }
    var nespera = bootbox.espera({
        message: 'Consultando o servidor ...'
    });
    $.ajax({
        method: "POST",
        url: curl + "funcoes.php",
        async: true,
        cache: false,
        timeout: nTimeOut * 3,
        data: {sid: sid, modo: 'RUCSIFEN', ruc: TiraDigitoRuc($("#de_cl_ruc").val())}
    }).done(function (e) {
        nespera.modal("hide");
        //alert(e);
        var aret = JSON.parse(e);
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
        if (!aret.razao && aret.ccodres) {
            navigator.notification.alert(
                    aret.ccodres, // message
                    function () {

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (aret.razao !== $("#de_cl_nome").val()) {
            navigator.notification.confirm(
                    _tr("Nome em SET é diferente do informado. Atualiza com as informações de SET ?"), // message
                    function (e) {
                        if (e == 1) {
                            $("#de_cl_nome").val(aret.razao);
                        }
                    }, // callback
                    _tr('Vendas'), // title
                    ['Atualizar', 'Não Atualizar']
                    );
            return false;


        }
        return false;
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


});

$("#de_cl_btsalvar_inc").on("click", function () {

    
    if (!lFactura) {
        return true;
    }
    var ncliente = $("#cl_codigo").val();
    var npais = $("#de_cl_pais").val();
    var nnat = $("#de_cl_nat").val();
    var ntipo_ope = $("#de_cl_tipo_ope").val();
    var ncon = $("#de_cl_con").val();
    var cruc = $("#de_cl_ruc").val();
    var cnome = $("#de_cl_nome").val();
    var cfantasia = $("#de_cl_fantasia").val();
    var ccep = $("#de_cl_cep").val();
    var ccidade = $("#de_cl_cidade").val();
    var ncidade_num = $("#de_cl_cidade_num").val();
    var cestado = $("#de_cl_estado").val();
    var cendereco = $("#de_cl_endereco").val();
    var cnumero = trim($("#de_cl_numero").val());
    var cbairro = $("#de_cl_bairro").val();
    var ntip_doc = $("#de_cl_tip_doc").val();
    $("#de_cl_documento").val(trim($("#de_cl_documento").val()));
    var cdocumento = $("#de_cl_documento").val();
    var ctelefone = LimpaTel($("#de_cl_fone").val());
    var ccelular = LimpaTel($("#de_cl_celular").val());
    var cmail = ($("#de_cl_mail").val()).trim();
    var ccpf = $("#de_cl_cpf").val();

    if (!ncliente || ncliente == 0) {
        navigator.notification.alert(
                _tr("Cadastre o cliente primeiramente."), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }
    if (!npais || npais == 0) {
        navigator.notification.alert(
                _tr("Informe um país"), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }

    if (npais != 600) {
        nnat = 2;
    } else if (nnat == 0) {
        navigator.notification.alert(
                _tr("Informe uma Natureza"), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;
    }

    if (npais != 600) {
        ntipo_ope = 4;
    } else if (ntipo_ope == 4) {
        navigator.notification.alert(
                _tr("Tipo de operação inválida para o País"), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;

    } else if (ntipo_ope == 1 && nnat == 2) {
        navigator.notification.alert(
                _tr("Tipo de operação  inválida para NÃO CONTRIBUINTE"), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;

    }

    if (nnat == 2) {
        cruc = "";
    } else {
        if (cruc.length < 5 || !VeDigitoRuc(cruc)) {
            navigator.notification.alert(
                    _tr("RUC inválido"), // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
    }
    if (cnome.length < 6) {
        navigator.notification.alert(
                _tr("NOME inválido"), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;

    }
    if (npais == 76) {
        if (ccep.length < 8) {
            navigator.notification.alert(
                    _tr("CEP inválido"), // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (ccpf && !isCPF(ccpf)) {
            navigator.notification.alert(
                    _tr("CPF inválido"), // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
    } else {
        ccpf = '';
    }
    if (ccidade.length < 3) {
        navigator.notification.alert(
                _tr("CIDADE inválida"), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;

    }
    if (npais == 600 && ncidade_num <= 0) {
        navigator.notification.alert(
                _tr("CIDADE inválida"), // message
        
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;

    }

    if (cestado.length < 2) {
        navigator.notification.alert(
                _tr("ESTADO/DEPARTAMENTO inválido"), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;

    }
    if (cendereco.length < 3) {
        navigator.notification.alert(
                _tr("ENDEREÇO inválido"), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;

    }
    if (nnat==1 && cnumero.length<1){
        navigator.notification.alert(
                _tr("Obrigatório informar Número do imóvel quando cliente contribuinte"), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;

        
    }
    if (!VeRg(cdocumento)) {
        navigator.notification.alert(
                _tr("CÉDULA inválida. Use letras e números"), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;


    }
    if (cdocumento.length < 6) {
        navigator.notification.alert(
                _tr("CÉDULA inválida. Muito pequena."), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;


    }
    if (!VeTelefone()) {
        return false;
    }
    if (!VeCelular()) {
        return false;
    }
    if (!ctelefone && !ccelular) {
        navigator.notification.alert(
                _tr("Informe um Telefone e/ou Celular"), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;

    }
    if (!VerificaEmail()) {
        return false;
    }
    var latualizacec=false;
    navigator.notification.confirm(
                    _tr("Atualiza os dados principais com base nos da FACTURA ?"), // message
                    function (e) {
                        if (e == 1) {
                            latualizacec=true
                        }
                        GravaClienteCec(ncliente,
            npais,
            nnat,
            ntipo_ope,
            ncon,
            cruc,
            cnome,
            cfantasia,
            ccep,
            ccidade,
            ncidade_num,
            cestado,
            cendereco,
            cnumero,
            cbairro,
            ntip_doc,
            cdocumento,
            ctelefone,
            ccelular,
            cmail,
            ccpf,
            latualizacec);
                    }, // callback
                    _tr('Vendas'), // title
                    ['Atualizar', 'Não Atualizar']
                    );
            return false;


});


function GravaClienteCec(ncliente,
            npais,
            nnat,
            ntipo_ope,
            ncon,
            cruc,
            cnome,
            cfantasia,
            ccep,
            ccidade,
            ncidade_num,
            cestado,
            cendereco,
            cnumero,
            cbairro,
            ntip_doc,
            cdocumento,
            ctelefone,
            ccelular,
            cmail,
            ccpf,
            latualizacec){
    var nespera = bootbox.espera({
        message: _tr('Gravando Cliente') + ' ...'
    });
    
    
    $.ajax({
        method: "POST",
        url: curl + "funcoes.php",
        async: true,
        cache: false,
        timeout: nTimeOut * 3,
        data: {sid: sid, modo: 'INCLUICLI', codigo: ncliente,
            pais: npais,
            nat: nnat,
            tipo_ope: ntipo_ope,
            con: ncon,
            ruc: cruc,
            nome: cnome,
            fantasia: cfantasia,
            cep: ccep,
            cidade: ccidade,
            cidade_num: ncidade_num,
            estado: cestado,
            endereco: cendereco,
            numero: cnumero,
            bairro: cbairro,
            tip_doc: ntip_doc,
            documento: cdocumento,
            telefone: ctelefone,
            celular: ccelular,
            mail: cmail,
            cpf: ccpf,
            atualizacec: latualizacec
        }
    }).done(function (e) {
        nespera.modal("hide");
//alert(e);
        var aret = JSON.parse(e);
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
        VeCliente(parseInt(ncliente),'','','',true);
        return false;
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
$("#de_cl_nat").on("change", function () {
    if ($(this).val() == 4 && $("#de_cl_pais").val() == 600) {
        $(this).val(2);
        navigator.notification.alert(
                _tr("OPERAÇÃO inválida para o País"), // message
                function () {
                }, // callback
                _tr('Vendas'), // title
                'Ok'                  // buttonName
                );
        return false;

    }
});
$("#de_cl_tipo_ope").on("change", function () {
    if ($(this).val() == 2) {
        $("#de_cl_ruc").val("");
    }
});

$("#de_cl_pais").on("change", function () {
    var npais = $(this).val();
    if (!npais) {
        return false;
    }
    try {
        $("#de_cl_celular").unmask();
        $("#de_cl_fone").unmask();
    } catch(e) {
        
    }

    if (npais == 76) { //brasil
        $("#de_cl_nat").val(2);
        $("#de_cl_tipo_ope").val(4);
        $("#de_cl_con").val(1);
        $("#de_cl_tip_doc").val(3);
        $("#de_cl_ruc").attr("disabled", true);
        $("#de_cl_cep").attr("disabled", false);
        $("#de_cl_nat").attr("disabled", true);
        $("#de_cl_tipo_ope").attr("disabled", true);
        $("#de_cl_con").attr("disabled", true);
        $("#de_cl_celular").mask("(00) 00000-0000", {reverse: false, clearIfNotMatch: false});
        $("#de_cl_fone").mask("(00) 0000-0000", {reverse: false, clearIfNotMatch: false});

        $("#de_cl_celular").attr("placeholder", "(DD) 12345-6789");
        $("#de_cl_fone").attr("placeholder", "(DD) 1234-5678");

    } else if (npais == 600) { //paraguay
        $("#de_cl_nat").val(2);
        $("#de_cl_tipo_ope").val(2);
        $("#de_cl_con").val(1);
        $("#de_cl_tip_doc").val(1);
        $("#de_cl_ruc").attr("disabled", false);
        $("#de_cl_cep").attr("disabled", true);
        $("#de_cl_nat").attr("disabled", false);
        $("#de_cl_tipo_ope").attr("disabled", false);
        $("#de_cl_con").attr("disabled", false);
        $("#de_cl_celular").mask("(0000) 000-000", {reverse: false, clearIfNotMatch: false});
        $("#de_cl_fone").mask("(000) 00000000", {reverse: false, clearIfNotMatch: false});
        $("#de_cl_celular").attr("placeholder", "(0DDD) 123-456");
        $("#de_cl_fone").attr("placeholder", "(0DD) 12345678");
    } else {
        $("#de_cl_nat").val(2);
        $("#de_cl_tipo_ope").val(4);
        $("#de_cl_con").val(1);
        $("#de_cl_tip_doc").val(3);
        $("#de_cl_ruc").attr("disabled", true);
        $("#de_cl_cep").attr("disabled", true);
        $("#de_cl_nat").attr("disabled", true);
        $("#de_cl_tipo_ope").attr("disabled", true);
        $("#de_cl_con").attr("disabled", true);
        $("#de_cl_celular").prop("data-mask", "0000000000000");
        $("#de_cl_fone").prop("data-mask", "0000000000000");
        $("#de_cl_celular").attr("placeholder", "123456789012");
        $("#de_cl_fone").attr("placeholder", "123456789012");

    }
});

function CarregaClienteDe(nCliente) {
//alert(nCliente);
    if (!nCliente) {
        //$('.nav-tabs a[href="#de_cliente"]').tab('hide');
        $('#de_cl_det').hide();
        return;
    }
    var nespera = bootbox.espera({
        message: 'Consultando o servidor ...'
    });

    $.ajax({
        method: "POST",
        url: curl + "funcoes.php",
        async: true,
        cache: false,
        timeout: nTimeOut * 3,
        data: {sid: sid, modo: 'DECLIENTE', cliente: nCliente}
    }).done(function (e) {
        nespera.modal("hide");
        var aret = JSON.parse(e);
        if (aret.erro != '00' && aret.erro != '10') {
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {

                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (aret.erro == '10') {
        }

        $("#de_cl_pais").val(aret.cli.pais_num);
        $("#de_cl_pais").change();

        $("#de_cl_nat").val(aret.cli.natureza);
        $("#de_cl_tipo_ope").val(aret.cli.ope_tipo);
        $("#de_cl_con").val(aret.cli.cont_tipo);
        $("#de_cl_ruc").val(aret.cli.ruc == 0 ? "" : aret.cli.ruc);
        $("#de_cl_nome").val(aret.cli.nome);
        $("#de_cl_fantasia").val(aret.cli.fantasia);
        $("#de_cl_cep").val(aret.cli.cep);
        $("#de_cl_cidade").val(aret.cli.cidade);
        $("#de_cl_cidade_num").val(aret.cli.cidade_num);
        $("#de_cl_estado").val(aret.cli.estado);
        $("#de_cl_endereco").val(aret.cli.endereco);
        $("#de_cl_numero").val(aret.cli.numero);
        $("#de_cl_tip_doc").val(aret.cli.doc_tipo);
        $("#de_cl_bairro").val(aret.cli.bairro);
        $("#de_cl_documento").val(aret.cli.iden_num);
        $("#de_cl_fone").val(aret.cli.telefone);
        $("#de_cl_celular").val(aret.cli.celular);
        $("#de_cl_mail").val(aret.cli.email);
        $("#de_cl_cpf").val(aret.cli.cpf);

        $('#de_cl_fone').trigger('input');
        $('#de_cl_celular').trigger('input');

        $('#de_cl_det').show();

        return false;
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
function CarregaPais() {
    $.ajax({
        method: "POST",
        url: curl + "funcoes.php",
        async: true,
        cache: false,
        timeout: nTimeOut * 3,
        data: {sid: sid, modo: 'PAIS'}
    }).done(function (e) {
        var aret = JSON.parse(e);
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
        $("#de_cl_pais").empty();
        $('#de_cl_pais').append($('<option>', {
            value: 0,
            text: ''
        }));
        for (var i = 0; i < aret.pais.length; i++) {
            $('#de_cl_pais').append($('<option>', {
                value: aret.pais[i][0],
                text: aret.pais[i][1]
            }));
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

    return false;

}

function DigitoRuc(cRuc) {
    return new DigitGenerator().getDigitoVerificadorBase11(cRuc);
}
function VeDigitoRuc(cRuc) {
    return cRuc.substr(-1) == DigitoRuc(cRuc.substr(0, cRuc.length - 1))
}
function TiraDigitoRuc(cRuc) {
    return cRuc.substr(0, cRuc.length - 1)
}

class DigitGenerator {

    getDigitoVerificadorBase11(ruc) {
        return this.getDigitoVerificador(ruc, 11);
    }

    getDigitoVerificador(ruc, base) {

        var k = 2;
        var total = 0;
        var valueOfZero = "0".charCodeAt(0);

        var alRevez = this.invertirCadena(this.eliminarNoDigitos(ruc));

        for (var i = 0; i < alRevez.length; i++) {
            var numero = alRevez.charCodeAt(i);
            total += (numero - valueOfZero) * k++;
            if (k > base)
                k = 2;
        }

        var resto = total % base;

        if (resto > 1)
            return base - resto;
        else
            return 0;
    }

    invertirCadena(cadena) {
        return cadena.split("").reverse().join("");
    }

    eliminarNoDigitos(ruc) {
        var toRet = "";
        for (var i = 0; i < ruc.length; i++) {
            // si no es caracter, lo converitmos a su valor numérico
            if (isNaN(parseInt(ruc[i], 10))) {
                toRet += ruc.charCodeAt(i);
            } else {
                toRet += ruc[i];
            }
        }
        return toRet;
    }
}



function ValidaMail(v) {
    var cini = v.substr(0, 1);
    var cfim = v.substr(-1);
    var lret = /^[0-9a-zA-Z\-\@\_.]+$/.test(v) && /@.*$/.test(v);
    lret = lret && /\..*$/.test(v);
    lret = lret && cfim.match(/[A-Za-z]/) != null;
    lret = lret && (cini.match(/[A-Za-z]/) != null || cini.match(/[0-9]/) != null);

    return lret;
}

function VeRg(cRg) {
    if (!cRg) {
        return false;
    }
    return /^[0-9a-zA-z]+$/.test(cRg);
}

function LimpaRg(cRg) {
    return cRg.replace(/[^0-9a-zA-Z]/g, "");
}
function LimpaTel(cTel) {
    return cTel.replace(/[^0-9]/g, "");
}