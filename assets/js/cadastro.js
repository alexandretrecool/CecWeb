/* 
    Created on : May 2, 2017, 10:34:27 AM
    Author     : Cristiano Kemmer
*/

function VeCedula() {
    $("#cedula").css("background-color", "");

    if ($("#cedula").val() == '') {
        return;
    }
    $.ajax({
        method: "POST",
        url: "out_clicedula.php",
        cache: false,
        data: {cod: $("#cedula").val(), mod: "1",orcamento: lorc}
    })
    .done(function (e) {
        var aret = JSON.parse(e);
        if (aret.erro == "99" || aret.erro == "11") {
            erro(aret.cerro, "Erro");
            return false;
        }
        //clienete não existe
        if (aret.erro == "01") {
            $("input").val("");
            $("#foto1").attr("src", "resource/frente.png");
            $("#foto2").attr("src", "resource/verso.png");
            //alert("Cédula ainda não cadastrada");
            //$("#cedula").focus();
            alerta1("Cédula ainda não cadastrada", "", "", "email");

            return false;
        }
        if (aret.erro == "02") {
            $("#email").val(aret.email);
            $("#nome").val(aret.nome);
            $("#endereco").val(aret.endereco);
            $("#cep").val(aret.cep);
            $("#cidade").val(aret.cidade);
            $("#estado").val(aret.estado);
            $("#pais").val(aret.pais);
            $("#celular").val(aret.celular);
            $("#telefone").val(aret.telefone);
            $("#skype").val(aret.skype);
            $("#foto1").attr("src", aret.foto1);
            $("#foto2").attr("src", aret.foto2);
            return true;
        }
    })
    .fail(function (e) {
        alerta1('Erro acessando servidor');
    });
}

function storageAvailable(type) {
    try {
        var storage = window[type],
                x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return false;
    }
}

function exibirPopover(campoID, mensagem) {
    $(campoID).attr("data-toggle", "tooltip");
    $(campoID).attr("title", "");
    $(campoID).attr("data-content", mensagem);

    $(campoID).popover({placement: 'bottom'}).popover('show');
}

function fecharPopover(campoID) {
    $(campoID).popover('destroy');
}

var validar_Flags = {
    
    sucesso: function(campoID) {
        $(campoID).closest('.input-group').addClass('has-success has-feedback');
        $(campoID).closest('.input-group').append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span><span class="sr-only">(success)</span>');
    },
    
    erro: function(campoID, mensagem) {
        $(campoID).closest('.input-group').addClass('has-error has-feedback');
        $(campoID).closest('.input-group').append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span><span class="sr-only">(error)</span>');
        exibirPopover(campoID, mensagem);
    },
    
    aviso: function(campoID, mensagem) {
        $(campoID).closest('.input-group').addClass('has-warning has-feedback');
        $(campoID).closest('.input-group').append('<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true"></span><span class="sr-only">(warning)</span>');
        exibirPopover(campoID, mensagem);
    },
    
    limpar: function(campoID) {
        /* Limpar formatação de validação existente */
        $(campoID).closest('.input-group').removeClass("has-success has-error has-warning has-feedback");
        $(campoID).nextAll().remove();

        /* Limpar Popover */
        fecharPopover(campoID);
    }
};

function validar_SeExiste(campo, valor)
{
    if(valor !== "") {
        $.ajax({
            url: "validacao.php",
            method: "POST",
            dataType: "json",
            data: {
                campo: campo
                ,valor: valor
                ,orcamento: lorc
            }

        }).done(function(json) {
            
            if(json) {
                if(json.status === 'erro') {
                    validar_Flags.erro("#" + campo, json.descricao);
                    
                } else if(json.status === 'sucesso') {
                    validar_Flags.sucesso("#" + campo);
                }
            }
        });
    }
}

function validarCedula() {
    var valor = $("#cedula").val();
    
    if(valor !== '' && valor.length < 6) {
        validar_Flags.erro("#cedula", "Cédula está inconsistente");
        return;
    }
    
    validar_SeExiste("cedula", valor);
}

function validarEmail() {
    var valor = $("#email").val();

    if(valor !== "" && !isEmail(valor)) {
        validar_Flags.erro("#email", "Favor inserir um email em formato válido");
        return;
    }
    
    validar_SeExiste("email", valor);
}

function validarNome() {
    var valor = $("#nome").val();
    
    if(valor !== '') {
        var nomeArr = [];
        valor.split(' ').forEach(function(v) { if(v !== '') nomeArr.push(v); });
        
        if(nomeArr.length < 2 || nomeArr[0].length < 2) {
            validar_Flags.erro("#nome", "Nome está inconsistente");
            return;
        }
    }
    
    validar_SeExiste("nome", valor);
}

function validarTelefone() {
    var valor = $("#telefone").val();
    validar_SeExiste("telefone", valor);
}

function validarCelular() {
    var valor = $("#celular").val();
    validar_SeExiste("celular", valor);
}

function validarCEP() {
    var valor = $("#cep").val();
    
    if(valor == '') {
        validar_Flags.aviso('#cep', "Insira um CEP");
    
    } else if(valor.length != 10) {
        validar_Flags.erro("#cep", "CEP está inconsistente");
    }
}

function popularGrupoCliente() {
    
    var selectGrupoCliente = "#grupo";
    
    $(selectGrupoCliente).html('');
    $(selectGrupoCliente).html('<option value="">-- Selecione o Grupo --</option>');
    
    $.ajax({
        url: "out_grpcli.php",
        method: "GET",
        dataType: "json"
        
    }).done(function(json) {
        for(var grupo in json) {
            if(json.hasOwnProperty(grupo)) {
                var option = '<option value="' + json[grupo] + '">' + grupo + '</option>';
                $(selectGrupoCliente).append(option);
            }
        }
    });
}

/* Métodos para seleção de autocomplete do typeahead */
var typeahead_Methods = {
    init: function(fieldID) {
        var fieldName_ID = fieldID.replace('#', '') + "_id";
        var fieldName_Name = fieldID.replace('#', '') + "_name";
        
        // Create two <input> fields to hold typeahead ID and Name.
        // Useful when reloading the page, preserving the form data, when
        // cleaning and when returning to a valid state.
        // Using HTML elements instead of data-* attributes to provide more
        // accessibility and less dependability on Javascript.
        
        var idInput = document.createElement('input');
        var nameInput = document.createElement('input');
        
        idInput.id = idInput.name = fieldName_ID;
        nameInput.id = nameInput.name = fieldName_Name;
        idInput.type = nameInput.type = "hidden";
        
        /* Check for data stored */
        if(storageAvailable('localStorage')) {
            if( localStorage.getItem(fieldName_ID) 
                && localStorage.getItem(fieldName_Name)
                && $(fieldID).val() === localStorage.getItem(fieldName_Name) ) {
                
                idInput.value = localStorage.getItem(fieldName_ID);
                nameInput.value = localStorage.getItem(fieldName_Name);
            
            } else {
                // Cleans the field (whether it has any value), as it's inconsistent
                $(fieldID).val('');
                // Guarantee consistency
                localStorage.removeItem(fieldName_ID);
                localStorage.removeItem(fieldName_Name);
            }
        }
        
        $(fieldID).parent().append(idInput);
        $(fieldID).parent().append(nameInput);
    },
    
    matcher: function(pool) {
        return function findMatches(query, cb) {
            var matches, substringRegex;

            matches = [];
            substringRegex = new RegExp(query, 'i');

            $.each(pool, function(i, obj) {
                if(substringRegex.test(obj.name))
                    matches.push(obj);
            });

            cb(matches);
        };
    },
    
    selector: function(e, obj) {
        var inputID_ID = "#" + $(e.target).attr('id') + "_id";
        var inputName_ID = "#" + $(e.target).attr('id') + "_name";

        /* Selected data from typeahead */
        var ID = obj.id;
        var name = obj.name;
        
        $(inputID_ID).val(ID);
        $(inputName_ID).val(name);
        
        /* Set localStorage */
        if(storageAvailable('localStorage')) {
            localStorage.setItem(inputID_ID.replace('#', ''), ID);
            localStorage.setItem(inputName_ID.replace('#', ''), name);
        }
    },
    
    cleaner: function(e) {
        var inputID_ID = "#" + $(e.target).attr('id') + "_id";
        var inputName_ID = "#" + $(e.target).attr('id') + "_name";

        /* Previously selected and current data on field */
        var ID = $(inputID_ID).val();
        var name = $(inputName_ID).val();
        var currentOnField = $(e.target).val();

        if(ID !== undefined && name !== undefined) {
            if(currentOnField !== "") {
                $(e.target).val(name);
                return;
            }
        }

        /* Cleaning... */
        $(inputID_ID).val('');
        $(inputName_ID).val('');
        $(e.target).val('');
        
        /* Cleaning localStorage */
        if(storageAvailable('localStorage')) {
            localStorage.removeItem(inputID_ID.replace('#', ''));
            localStorage.removeItem(inputName_ID.replace('#', ''));
        }
    }
};

/* Callback após input */
var countdown = function(func, wait, extraFunc) {
    if(wait === undefined)
        var wait = 700;
    var timeout;
    
    return function() {
        if(extraFunc !== undefined)
            extraFunc();

        if(timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(func, wait);
    };
};




$(document).ready(function() {
    /* Handlers */
    $(document).on('blur', '#cedula', VeCedula);
    $(document).on('click', '#btSalvar', function(e) {
        e.preventDefault();
        Salvar();
    });
    
    /* Validações após digitacao */
    var wait = 1000;
    
    // Callback para limpar os campos
    var extraFunc = function(campoID) {
        return function() {
            validar_Flags.limpar(campoID);
        };
    };

    $(document).on('input', '#nome',    countdown(validarNome,   wait, extraFunc('#nome')));
    $(document).on('input', '#cedula',  countdown(validarCedula, wait, extraFunc('#cedula')));
    $(document).on('input', '#email',   countdown(validarEmail,  wait, extraFunc('#email')));
    
    var paisFunc = function() {
        console.log('paisFunc');
        var valor = $("#pais").val();
        var ID = $("#pais_id").val();
        
        if(valor !== '' && ID === 'BR') {
            $("#cep").prev().html('CEP (BR) *');
            $(document).off('input', "#cep");
            $(document).on('input', '#cep', countdown(validarCEP, wait, extraFunc('#cep')));
            validarCEP()
        
        } else {
            validar_Flags.limpar('#cep');
            $("#cep").prev().html('CEP (BR)');
            $(document).off('input', '#cep');
        }
    };

    /* Popular campos */
    popularGrupoCliente();
    
    /* Máscaras */
    $("#telefone").mask('(00) 0000-0000');
    $("#celular").mask('(00) 0000-00009');
    $("#celular")
        .blur(function() {
            if($(this).val().length == 15){ // Celular com 9 dígitos + 2 dígitos DDD e 4 da máscara
               $('#celular').mask('(00) 00000-0009');   // O 9 é o digito opcional: Permite modificações na máscara de acordo com estado
            } else {
               $('#celular').mask('(00) 0000-00009');
            }
         });
    
    /* Typeaheads */
    // Estado (UF)
    var auf = [
        {id:'AC', name:'AC'},
        {id:'AL', name:'AL'},
        {id:'AP', name:'AP'},
        {id:'AM', name:'AM'},
        {id:'BA', name:'BA'},
        {id:'CE', name:'CE'},
        {id:'DF', name:'DF'},
        {id:'ES', name:'ES'},
        {id:'GO', name:'GO'},
        {id:'MA', name:'MA'},
        {id:'MT', name:'MT'},
        {id:'MS', name:'MS'},
        {id:'MG', name:'MG'},
        {id:'PA', name:'PA'},
        {id:'PB', name:'PB'},
        {id:'PR', name:'PR'},
        {id:'PE', name:'PE'},
        {id:'PI', name:'PI'},
        {id:'RJ', name:'RJ'},
        {id:'RN', name:'RN'},
        {id:'RS', name:'RS'},
        {id:'RO', name:'RO'},
        {id:'RR', name:'RR'},
        {id:'SC', name:'SC'},
        {id:'SP', name:'SP'},
        {id:'SE', name:'SE'},
        {id:'TO', name:'TO'}
    ];
    typeahead_Methods.init('#estado');
    $('#estado').typeahead(
        {
            hint: false,
            highlight: true,
            minLength: 1
        },
        {
            name: 'auf', 
            source: typeahead_Methods.matcher(auf), 
            display: function(obj) { return obj.name; }
        }
    );
    $('#estado').bind('typeahead:select', typeahead_Methods.selector);
    $('#estado').bind('typeahead:close', typeahead_Methods.cleaner);
    
    // País
    var apais = [
        {id: 'BR', name: 'BRAZIL'},
        {id: 'PY', name: 'PARAGUAY'}, 
        {id: 'AR', name: 'ARGENTINA'}, 
        {id: 'UY', name: 'URUGUAY'}, 
        {id: 'CL', name: 'CHILE'}, 
        {id: 'VE', name: 'VENEZUELA'}
    ];
    typeahead_Methods.init('#pais');
    $('#pais').typeahead(
        { 
            hint: false, 
            highlight: true, 
            minLength: 1 
        },
        { 
            name: 'apais',
            source: typeahead_Methods.matcher(apais),
            display: function(obj) { return obj.name; }
        }
    );
    $('#pais').bind('typeahead:select', function(e, obj) {
        typeahead_Methods.selector(e, obj);
    });
    $('#pais').bind('typeahead:close', function(e, obj) {
        typeahead_Methods.cleaner(e, obj);
    });
    $('#pais').bind('typeahead:change', paisFunc);
    paisFunc(); // Executar pela primeira vez, recarregando o status
});