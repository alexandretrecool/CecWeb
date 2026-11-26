function GeraSenha(ntam) {
    //alert(parseInt((Math.random()*10000)%62));
    var caux = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    while (true) {
        var csenha = "";
        for (var i = 0; i < ntam; i++) {
            csenha = csenha + caux.substr(parseInt((Math.random() * 100) % 62), 1);
        }
        if (!/[0-9]/g.test(csenha)) {
            //alert(csenha+"\rnumero");
            continue;
        }
        if (!/[a-z]/g.test(csenha)) {
            //alert(csenha+"\rminuscula");
            continue;
        }
        if (!/[A-Z]/g.test(csenha)) {
            //alert(csenha+"\rmaiuscula");
            continue;
        }
        break;
    }
    return csenha;
}

/* envia formulario por post em javascript*/
function post_to_url(path, params, method) {
    // params= {'ruc':'cnsft','men':'entre com o login'}
    method = method || 'post'; // Set method to post by default, if not specified.
    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement('form');
    form.setAttribute('method', method);
    form.setAttribute('action', path);
    for (var key in params) {
        var hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute('name', key);
        hiddenField.setAttribute('value', params[key]);
        form.appendChild(hiddenField);
    }
    document.body.appendChild(form);    // Not entirely sure if this is necessary
    form.submit();
}

/*autenticar a seguranca da senha */
function veSecurity(val, tamanho) {

    lseg = 0;
    if (val.length >= tamanho && val.search(/[a-z]/) != -1 && val.search(/[A-Z]/) != -1 && val.search(/[0-9]/) != -1
            || val.length >= tamanho && val.search(/[a-z]/) != -1 && val.search(/[A-Z]/) != -1 && val.search(/[@!#$%&*+=?|-]/)
            || val.length >= tamanho && val.search(/[a-z]/) != -1 && val.search(/[@!#$%&*+=?|-]/) != -1 && val.search(/[0-9]/)
            || val.length >= tamanho && val.search(/[@!#$%&*+=?|-]/) != -1 && val.search(/[A-Z]/) != -1 && val.search(/[0-9]/)) {
        lseg = 3;

    } else {
        if (val.length >= tamanho && val.search(/[a-z]/) != -1 && val.search(/[A-Z]/) != -1
                || val.length >= tamanho && val.search(/[a-z]/) != -1 && val.search(/[0-9]/) != -1
                || val.length >= tamanho && val.search(/[a-z]/) != -1 && val.search(/[@!#$%&*+=?|-]/) != -1
                || val.length >= tamanho && val.search(/[A-Z]/) != -1 && val.search(/[0-9]/) != -1
                || val.length >= tamanho && val.search(/[A-Z]/) != -1 && val.search(/[@!#$%&*+=?|-]/) != -1
                || val.length >= tamanho && val.search(/[0-9]/) != -1 && val.search(/[@!#$%&*+=?|-]/) != -1) {
            lseg = 2;
        } else {
            if (val.length >= tamanho) {
                lseg = 1;
            }
        }
    }
    return lseg;
}

function Security(val, tamanho) {

    document.getElementById('d_baixa').style.background = 'white';
    document.getElementById('d_media').style.background = 'white';
    document.getElementById('d_alta').style.background = 'white';
    if (val == "")
    {
        document.getElementById('d_baixa').style.background = 'white';
        document.getElementById('d_media').style.background = 'white';
        document.getElementById('d_alta').style.background = 'white';

        return;
    }
    if (val.length < tamanho)
    {
        document.getElementById('d_baixa').style.background = 'white';
        document.getElementById('d_media').style.background = 'white';
        document.getElementById('d_alta').style.background = 'white';

        return;
    }


    if (val.length >= tamanho && val.search(/[a-z]/) != -1 && val.search(/[A-Z]/) != -1 && val.search(/[0-9]/) != -1
            || val.length >= tamanho && val.search(/[a-z]/) != -1 && val.search(/[A-Z]/) != -1 && val.search(/[@!#$%&*+=?|-]/)
            || val.length >= tamanho && val.search(/[a-z]/) != -1 && val.search(/[@!#$%&*+=?|-]/) != -1 && val.search(/[0-9]/)
            || val.length >= tamanho && val.search(/[@!#$%&*+=?|-]/) != -1 && val.search(/[A-Z]/) != -1 && val.search(/[0-9]/))
    {
        document.getElementById('d_baixa').style.background = 'green';
        document.getElementById('d_media').style.background = 'green';
        document.getElementById('d_alta').style.background = 'green';

    } else {
        if (val.length >= tamanho && val.search(/[a-z]/) != -1 && val.search(/[A-Z]/) != -1
                || val.length >= tamanho && val.search(/[a-z]/) != -1 && val.search(/[0-9]/) != -1
                || val.length >= tamanho && val.search(/[a-z]/) != -1 && val.search(/[@!#$%&*+=?|-]/) != -1
                || val.length >= tamanho && val.search(/[A-Z]/) != -1 && val.search(/[0-9]/) != -1
                || val.length >= tamanho && val.search(/[A-Z]/) != -1 && val.search(/[@!#$%&*+=?|-]/) != -1
                || val.length >= tamanho && val.search(/[0-9]/) != -1 && val.search(/[@!#$%&*+=?|-]/) != -1) {

            document.getElementById('d_baixa').style.background = 'yellow';
            document.getElementById('d_media').style.background = 'yellow';
            document.getElementById('d_alta').style.background = 'white';

        } else {
            if (val.length >= tamanho)
            {
                document.getElementById('d_baixa').style.background = 'red';
                document.getElementById('d_media').style.background = 'white';
                document.getElementById('d_alta').style.background = 'white';

            }
        }
    }
}
/* desabilita teclas */
function desabilite(oObj) {
    oObj.disabled = true;
    return true;
}

/* digito verificador */

function empty(cvar) {
    cvar = cvar.replace(/ /gi, '');
    return (cvar.length == 0);
}
function vedigito(ndig) {
    return ve_digito(ndig);
}
function ve_digito(ndig) {
    ndv = 0;

    ndv = ndig % 10;
    return (ndv == digito(Math.floor(ndig / 10)));
}

function poe_digito(ndig) {
    return ((ndig * 10) + digito(ndig));
}
function poedigito(ndig) {
    return ((ndig * 10) + digito(ndig));
}
function tira_digito(ndig) {
    return Math.floor(ndig / 10);
}

function tiradigito(ndig) {
    return Math.floor(ndig / 10);
}

function digito(ndig) {
    somapar = 0;
    somaimpar = 0;
    nint = 0;
    ndvr = 0;

    nint = '00000000000' + ndig;
    nint = nint.substring(nint.length - 12, nint.length);

    for (i = 0; i < 12; ++i) {
        if (i % 2 == 1) {
            somapar += Math.floor(nint.substr(i, 1));
        } else {
            somaimpar += Math.floor(nint.substr(i, 1));
        }
    }
    ndvr = somaimpar + (somapar * 3);
    ndvr = ndvr % 10;
    ndvr = 10 - ndvr;
    if (ndvr > 9) {
        ndvr = 0;
    }
    return ndvr;
}


function E_Valido(uPar, cTipo, cMen) {
    var cStr;
    var nTam = 0;
    var cAux = '';
    var cMensagem = '';
    var nDia, nMes, nAno, nAux;

    if (uPar == null) {
        return true;
    }
    cStr = uPar.value.replace(/ /g, '');

    if (cMen == null) {
        cMensagem = 'Campo no es valido';
    } else {
        cMensagem = cMen
    }
    if (cStr.length == 0) {
        alert(cMensagem);
        uPar.focus();
        return false;
    }

    if (cTipo == 'N' || cTipo == 'n') {
        cAux = cStr.replace(/[0123456789.-]/g, '');
        if (cAux.length > 0) {
            alert(cMensagem);
            uPar.focus();
            return false;
        }
    }
    if (cTipo == 'D' || cTipo == 'd') {
        cAux = cStr.replace(/\//g, '');
        cAux = cAux.replace(/ /g, '');
        if (cAux.length < 8) {
            uPar.focus();
            return false;
        }
        nAno = cStr.substring(4);
        nMes = cStr.substring(2, 4);
        nDia = cStr.substring(0, 2);

        if (nAno < 1900 || nAno > 2100) {
            alert(cMensagem);
            uPar.focus();
            return false;
        }
        if (nMes < 1 || nMes > 12) {
            alert(cMensagem);
            uPar.focus();
            return false;
        }
        if (nMes == 02) {
            nAux = 28;
            if (nAno % 4 == 0) {
                nAux = 29;
            }
        } else {
            nAux = 31;
            if (nMes == 4 || nMes == 6 || nMes == 9 || nMes == 11) {
                nAux = 30;
            }
        }
        if (nDia == 0 || nDia > nAux) {
            alert(cMensagem);
            uPar.focus();
            return false;
        }
    }
    return true;
}


//    DATA

function DateValidation(d) {
    this.dtSrc = d;
    this.dtValue = "";
    this.isDate = _isDate;
    this.getDateValue = function () {
        return(this.dtValue);
    };
    this.getMonthDateValue = function () {
        return(this.dtValue.slice(3));
    }
}
function _isDate() {
    var vrs = /^(0[1-9]|[1-2][0-9]|3[0-1])(0[1-9]|1[0-2])(\d{2}|19\d{2}|20\d{2})$/.exec(justNumbersStr(this.dtSrc));
    if (!vrs || vrs.length < 4)
        return false;
    var d = parseInt(vrs[1], 10), m = parseInt(vrs[2], 10), a = parseInt(vrs[3], 10);
    if (a < 100)
        a += (a < 30 ? 2000 : 1900);
    if (/^(4|6|9|11)$/.test(m) && d == 31)
        return false;
    if (m == 2) {
        var bissexto = (((a % 4 == 0) && a % 100 != 0) || a % 400 == 0);
        if (d > 29 || (d == 29 && !bissexto))
            return false;
    }
    this.dtValue = repeatStr(d, "0", 2) + "/" + repeatStr(m, "0", 2) + "/" + a;
    return true;
}
function DateObj(d) {
    d = trim(d);
    if (!d)
        return;
    var t = d.length;
    if (t == 10 || t == 8 || t == 6) {
        this.isValid = true;
        this.srcDate = d;
        this.date = d.replace(/\//g, "");
        this.day = this.date.slice(0, 2);
        this.month = this.date.slice(2, 4);
        this.year = this.date.slice(4);
        var a = parseInt(this.year, 10);
        if (a < 100) {
            a += (a < 30 ? 2000 : 1900);
            this.year = String(a);
        }

        this.daysTo = _DaysTo;
        this.lesserThan = function (d) {
            return Number(this.year + this.month + this.day) < Number(d.year + d.month + d.day)
        };
        this.biggerThan = function (d) {
            return !this.lesserThan(d) && !this.equal(d)
        };
        this.equal = function (d) {
            return this.date == d.date.replace(/\//g, "");
        };
        this.biggerOrEqualThan = function (d) {
            return this.biggerThan(d) || this.equal(d)
        };
        this.lesserOrEqualThan = function (d) {
            return this.lesserThan(d) || this.equal(d)
        };
    } else
        this.isValid = false;
}
function _DaysTo(d) {
    var msDay = 24 * 60 * 60 * 1000;
    var s = new Date(this.month + "/" + this.day + "/" + this.year);
    var f = new Date(d.month + "/" + d.day + "/" + d.year);
    return Math.floor((f.getTime() - s.getTime()) / msDay);
}
function isInInterval(dtIn, dtFi, pIn, pFi, msg1, msg2, msg3) {
    var iDt = new DateObj(dtIn), fDt = new DateObj(dtFi);
    var iPer = new DateObj(pIn), fPer = new DateObj(pFi);
    if (!msg1 || msg1 == "")
        msg1 = 'Data inicial maior que a data final. Digite novamente.';
    if (!msg2 || msg2 == "")
        msg2 = 'Data inicial fora do per�odo dispon�vel. Digite novamente.';
    if (!msg3 || msg3 == "")
        msg3 = 'Data final fora do per�odo dispon�vel. Digite novamente.';
    if (iDt.isValid && fDt.isValid && iPer.isValid && fPer.isValid) {
        if (fDt.lesserThan(iDt)) {
            alert(msg1);
            return false;
        } else if (iDt.lesserThan(iPer)) {
            alert(msg2);
            return false;
        } else if (fPer.lesserThan(fDt)) {
            alert(msg3);
            return false;
        }
        return true;
    }
}
function DatasValidas(dtIn, dtFi, msg1) {
    var iDt = new DateObj(dtIn), fDt = new DateObj(dtFi);
    if (!msg1 || msg1 == "")
        msg1 = 'Data inicial maior que a data final. Digite novamente.';
    if (iDt.isValid && fDt.isValid) {
        if (fDt.lesserThan(iDt)) {
            alert(msg1);
            return false;
        }
        return true;
    }
}

function isInDaysLimit(dtIn, dtFi, dias, msg) {
    if (!msg)
        msg = "O intervalo entre as datas n�o pode ultrapassar " + dias + (dias > 1 ? " dias" : " dia") + ". Digite novamente.";
    var sDt = new DateObj(dtIn), fDt = new DateObj(dtFi);
    if (sDt.isValid && fDt.isValid) {
        if ((sDt.daysTo(fDt) + 1) > dias) {
            alert(msg);
            return false;
        }
        return true;
    }
}








// VALIDA��O




var objBrow, LAST_ERR_VALUE = "", errorCode = 0;
var ERRO = REPET_ERR = false;
var LAST_FIELD = CURRENT_FIELD = LAST_ERR_FIELD = null;
var SZ_DATE = 8,
        SZ_CEP = 8,
        SZ_ACCOUNT = 7,
        SZ_AG_ACCOUNT = 11,
        SZ_AG_SAVINGS = SZ_AG_ACCOUNT,
        SZ_MONEY = 15,
        SZ_FLOAT = 10,
        SZ_CPF = 11,
        SZ_CNPJ = 14,
        SZ_CPF_CNPJ = SZ_CNPJ,
        SZ_PERCENT = 6,
        SZ_BRANCH = 4,
        SZ_MONTH_YEAR = 6,
        SZ_TIME = 4,
        MAX_VALUE = 99999999999999.99;
function formatCamp(campo, tp, par1, par2, par3) {
    var ie = (brow().isIE() && !brow().isMac()), v = brow().getVersion();
    var b = parent.buttons;
    if (ie && (v >= 5 && v < 5.2) && b && b.myBarra && b.myBarra.clicked == true) {
        parent.buttons.myBarra.clicked = false;
        eval("try{campo.focus();}catch(e){}");
        return false;
    }
    var nArg = formatCamp.arguments.length;

    if (campo.value == '' && tp == 'money2') {
        campo.value = 0;
    }
    if (campo.value == '' && tp == 'integer') {
        campo.value = 0;
    }
    if (campo.value == '' && tp == 'float') {
        campo.value = 0.00;
    }
    if (campo.value == '' && tp == 'money') {
        campo.value = 0, 00;
    }

    ERRO = false;
    var vr = trim(campo.value);
    if (!campo || !vr || vr.length == 0) {
        if (/^(neg_)?(money2)$/.test(tp)) {
            campo.value = "0";
        } else if (/^(neg_)?(money)$/.test(tp)) {
            campo.value = "0,00";
        }
        return false;
    }
    if (nArg == 2)
        par1 = "";
    if (tp == "interval") {
        if (nArg <= 4)
            par3 = "";
        return formatType(campo, tp, par3, par1, par2);
    } else
        return formatType(campo, tp, par1);
}
function formatType(f, tp, msgErr, adarg1, adarg2) {
    if (tp == "none") {
        f.value = removeSpcChars(f.value);
        return true;
    }
    var vr = unformatField(f.value, tp, f.type);
    LAST_FIELD = f;
    var ret = isValidValue(vr, tp, adarg1, adarg2);
    if (!ret) {
        showError(tp, msgErr);
        return false;
    } else if (!_isRE(tp))
        f.value = getFmtValue((typeof ret == "boolean") ? vr : ret, tp);
    ERRO = false;
    return true;
}
function removeSpcChars(vr, type) {
    var ret = "", re = /197|198|208|215|216|222|223|229|230|240|247|248/, c = 0, s = String(vr);
    for (var i = 0; i < s.length; i++) {
        c = s.charCodeAt(i);
        if ((c > 31 && c < 253 && (c < 127 || c > 191) && !re.test(c)) || (type == "textarea" && (c == 9 || c == 13 || c == 10)))
            ret += s.charAt(i);
    }
    return ret;
}
function validaConteudo1(event, el, tp, campo) {
    var caux, key, cvalor;
    var lret = false;
    if (campo.value === undefined || campo.value === '') {
        return;
    }
    if (tp == 'none') {
        return;
    }
    cvalor = campo.value;
    caux = cvalor;
    caux = caux.substr(caux.length - 1);
    key = removeSpcChars(caux, el.type);
    if (key == "")
        return false;
    var tp_sp = /^sp_/.test(tp);
    if (_isRE(tp))
        lret = tp.test(key);
    else if (/^(percent|(neg_)?(numeric|float(\d{0,1})|money(\d{0,1})))$/.test(tp)) {
        lret = isNumeric(key) || (!/money2/.test(tp) && !/numeric/.test(tp) && key == "," && el.value.indexOf(",") == -1) || (/^neg_/.test(tp) && key == "-" && el.value.indexOf("-") == -1);
    } else if (/^(sp_)?alfanumeric$/.test(tp))
        lret = isAlfaNumeric(key) || (tp_sp && key == " ");
    else if (/^(sp_)?textnumber$/.test(tp))
        lret = isTextNumber(key) || (tp_sp && key == " ");
    else {
        switch (tp) {
            case "email":
                lret = true;
            case "uppercase":
                lret = true;
            case "text":
            case "full_name":
                lret = isAlfa(key) || /[ ]/.test(key);
            case "text_entry":
                lret = isTextNumber(key) || /[\.\-\/\,=\(\)\\\[\]\*\&\+\@\%\$\#\}\{\_\<\>\?\:\;]|\s/.test(key);
            case "default":
                lret = !/'|"/.test(key);
            default:
                lret = isNumeric(key);
        }
    }
    if (!lret) {
        caux = cvalor;
        caux = caux.substr(0, caux.length - 1);
        campo.value = caux;
    }
    return lret;
}
function validaConteudo(event, el, tp, campo) {
    var t = (typeof event.which != "undefined" && event.which != null ? event.which : event.keyCode), key;
    if (tp == 'none' || t < 20)
        return true;
    key = removeSpcChars(String.fromCharCode(t), el.type);
    //alert(campo.value);
    //key=(campo.value).substr((campo.value).length-1);
    if (key == "")
        return false;
    var tp_sp = /^sp_/.test(tp);
    if (_isRE(tp))
        return tp.test(key);
    else if (/^(percent|(neg_)?(numeric|float(\d{0,1})|money(\d{0,1})))$/.test(tp)) {
        return isNumeric(key) || (!/money2/.test(tp) && !/numeric/.test(tp) && key == "," && el.value.indexOf(",") == -1) || (/^neg_/.test(tp) && key == "-" && el.value.indexOf("-") == -1);
    } else if (/^(sp_)?alfanumeric$/.test(tp))
        return isAlfaNumeric(key) || (tp_sp && key == " ");
    else if (/^(sp_)?textnumber$/.test(tp))
        return isTextNumber(key) || (tp_sp && key == " ");
    else {
        switch (tp) {
            case "email":
                return true;
            case "uppercase":
                return true;
            case "text":
            case "full_name":
                return isAlfa(key) || /[ ]/.test(key);
            case "text_entry":
                return isTextNumber(key) || /[\.\-\/\,=\(\)\\\[\]\*\&\+\@\%\$\#\}\{\_\<\>\?\:\;]|\s/.test(key);
            case "default":
                return !/'|"/.test(key);
            default:
                return isNumeric(key);
        }
    }
}
function _getNDec(t) {
    var arr = t.match(/(\d+)\s*$/);
    return arr ? parseInt(arr[1], 10) : 2;
}
function unformatField(valor, tipo, inputType) {
    var t = (arguments.length < 1) ? "default" : String(tipo),
            vr = trim(removeSpcChars((typeof valor == "object" ? valor.value : valor), (inputType ? inputType : valor.type)));
    if (!vr || vr.length == 0)
        return "";
    if (/^(date|month_year|time|ag_account|ag_savings|branch|account|cep|(neg_)?numeric|interval)$/.test(t)) {
        vr = (/^neg_/.test(t) && vr.indexOf("-") == 0 ? "-" : "") + justNumbersStr(vr);
    } else if (/^(percent|(neg_)?(float(\d{0,1})|money(\d{0,1})))$/.test(t)) {
        vr = toFloat(vr, _getNDec(t));

    } else {
        if (/^(cpf|cnpj|cpf_cnpj)$/.test(t)) {
            vr = justNumbersStr(vr);
            var isCPF = tipo == "cpf" || (tipo == "cpf_cnpj" && vr.length <= SZ_CPF);
            vr = repeatStr(vr, "0", isCPF ? SZ_CPF : SZ_CNPJ);
            if (parseInt(vr, 10) == 0)
                vr = "";
        } else if (t == "email")
            vr = trim(vr)
    }
    if (typeof valor == "object")
        valor.value = vr;
    return vr;
}
function removeCaracs(f, type) {
    if (_isRE(type))
        return;
    var vr = unformatField(f.value, type, f.type);
    if (f.value != vr)
        f.value = vr;
    if (type == "money2") {
        f.value = toFloat(f.value, 0).replace(",", "");
    }
    focusNetscape(f);

}
function _isRE(re) {
    return typeof re == "object" && typeof re.test == "function";
}
function isValidValue(vr, tp, adarg1, adarg2) {
    var re, isNum = isNumeric(vr);
    if (_isRE(tp))
        return tp.test(vr);
    else if (/^(ag_account|ag_savings|account|branch|cep)$/.test(tp))
        return isNum && vr.length == eval("SZ_" + tp.toUpperCase());
    else if (/^(percent|(neg_)?(float(\d{0,1})|money(\d{0,1})))$/.test(tp))
        return (!/^neg_/.test(tp) && vr.indexOf("-") != -1 ? false : isFloatNumber(vr));
    /*xxxxxxxxxxxxx*/
    else if (/textnumber$/.test(tp))
        return isTextNumber((tp.indexOf("sp_") == 0) ? removeStr(vr, " ") : vr);
    else if (/text_entry$/.test(tp))
        return isTextNumber(vr.replace(/[\.\-\/\,=]|\s/g, ""));
    else if (/alfanumeric$/.test(tp))
        return isAlfaNumeric((tp.indexOf("sp_") == 0) ? removeStr(vr, " ") : vr);
    else {
        switch (tp) {
            case "time":
                switch (vr.length) {
                    case 1:
                        vr = "0" + vr + "00";
                        break;
                    case 2:
                        vr += "00";
                        break;
                    case 3:
                        vr = "0" + vr + "0";
                        break;
                }
                vr = repeatStr(vr, "0", 4, "right");
                return(isNum && /^([0-1]\d[0-5]\d)|(2[0-3][0-5]\d)$/.test(vr)) ? vr : null;
            case "date":
                var obj = new DateValidation(vr);
                return (isNum && obj.isDate()) ? obj : null;
            case "month_year":
                var obj = new DateValidation("01" + vr);
                return (isNum && obj.isDate()) ? obj : null;
            case "text":
                return isAlfa(vr.replace(/[ ]/g, ""));
            case "full_name":
                return isFullName(vr);
            case "email":
                return isEmail(vr);
            case "cpf":
                return isCPF(vr);
            case "cnpj":
                return isCNPJ(vr);
            case "cpf_cnpj":
                return (vr.length <= SZ_CPF) ? isCPF(vr) : isCNPJ(vr);
            case "interval":
                vr = parseInt(vr, 10);
                return vr >= adarg1 && vr <= adarg2;
            case "default":
                return !/'|"/.test(vr);
            default:
                return true;
        }
    }
}
function getFmtValue(vr, tp) {
    if (tp == "cpf_cnpj")
        tp = (vr.length <= SZ_CPF) ? "cpf" : "cnpj";
    if (/^(neg_)?money/.test(tp))
        return fmtMoney(vr, _getNDec(tp), tp);
    else {
        switch (tp) {
            case "time":
                return vr.slice(0, 2) + ":" + vr.slice(2, 4);
            case "date":
                return vr.getDateValue();
            case "month_year":
                return vr.getMonthDateValue();
            case "ag_account":
                return vr.slice(0, 4) + "-" + vr.slice(4, 9) + "-" + vr.slice(9, 11);
            case "ag_savings":
                return vr.slice(0, 4) + "-" + vr.slice(4, 10) + "-" + vr.slice(10, 11);
            case "account":
                return vr.slice(0, 5) + "-" + vr.slice(5, 7);
            case "cep":
                return vr.slice(0, 5) + "-" + vr.slice(5, 8);
            case "uppercase":
            case "full_name":
                return vr.toUpperCase();
            case "cpf":
                return vr.slice(0, 3) + "." + vr.slice(3, 6) + "." + vr.slice(6, 9) + "-" + vr.slice(9, 11);
            case "cnpj":
                return vr.slice(0, 2) + "." + vr.slice(2, 5) + "." + vr.slice(5, 8) + "/" + vr.slice(8, 12) + "-" + vr.slice(12, 14);
            default:
                return vr;
        }
    }
}
function fmtMoney(vr, ndec, tp) {

    var neg = vr.indexOf("-") == 0;
    if (verifyMaxValue(vr)) {
        ERRO = true;
        if (tp == 'money2') {
            return "0";
        } else {
            return "0,00";
        }
    }
    if (tp == 'money2') {
        vr = toFloat(vr, 0);
    } else {
        vr = toFloat(vr, ndec);
    }
    var vraux = "", p, pDec = vr.indexOf(","), vrDec = vr.slice(pDec + 1);
    for (var i = pDec; i > (neg ? 1 : 0); i--) {
        p = i - pDec;
        if (i != pDec && (p % 3 == 0))
            vraux += ".";
        vraux += vr.charAt(i - 1);
    }
    return (neg ? "-" : "") + invertStr(vraux) + (tp == "money2" ? "" : "," + vrDec);
}
function setMaxValue(vr) {
    MAX_VALUE = vr;
}
function verifyMaxValue(vr) {
    return vr.length > 0 && (parseFloat(vr) > MAX_VALUE);
}
function toFloat(src, ndec) {
    src = trim(src);
    if (!/^\-?([0-9]|\.)*\,{0,1}[0-9]*$/.test(src) || src.charAt(0) == ".")
        return src;
    var tam = src.length, pDec = src.indexOf(",");
    if (src.length == 0)
        src = "0";
    if (pDec == -1) {
        var p = src.indexOf(".");
        if (p != -1 && p == (tam - ndec - 1))
            src = src.replace(/\.(\d*)$/, ",$1");
        else
            return removeStr(src, ".") + "," + repeatNStr("0", ndec);
        pDec = src.indexOf(",");
    }
    src = removeStr(src, ".");
    if (pDec == 0)
        return "0" + src + repeatNStr("0", ndec + 1 - src.length);
    else {
        if (pDec > (tam - ndec - 1))
            src += repeatNStr("0", pDec - (tam - ndec - 1));
        pDec = src.indexOf(",");
        return parseInt(src.slice(0, pDec), 10) + src.slice(pDec, pDec + ndec + 1);
    }
}
function saltaCampo(ev, field, tp, size) {
    var tc, max = size, nargs = saltaCampo.arguments.length;
    if (/^(neg_)?float/.test(tp))
        max = (nargs > 3) ? size : SZ_FLOAT;
    else if (/^(neg_)?money/.test(tp)) {
        if (!verifyMaxValue(field.value))
            max = (nargs > 3) ? size : SZ_MONEY;
        else
        if (tp == "money2") {
            field.value = "0";

        } else {
            field.value = "0,00";
        }
    } else if (/^(date|month_year|time|cpf|cnpj|cpf_cnpj|cep|account|branch|percent|ag_account|ag_savings)$/.test(tp))
        max = eval("SZ_" + tp.toUpperCase());
    /*
     else if(/^(full_name|text|text_entry|uppercase|interval|(sp_)?alfanumeric|(sp_)?textnumber|default|(neg_)?numeric|email)$/.test(tp))
     max=size;
     */
    tc = brow().isNetscape() ? ev.which : ev.keyCode;
    if (String(field.value).length >= max && tc >= 48) {
        autoSkip(field);
        return true;
    } else
        return false;
}
function showError(type, msgU) {
    ERRO = true;
    var b = brow(), canShow = true;
    if (typeof type == "object" && !_isRE(type)) {
        alert(msgU);
        focusCamp(type);
        return;
    }
    if (b.isIE() && parseInt(b.getMajorver(), 10) < 5) {
        if (CURRENT_FIELD && LAST_ERR_FIELD == CURRENT_FIELD && LAST_ERR_VALUE == CURRENT_FIELD.value) {
            REPET_ERR = true;
            CURRENT_FIELD.value = LAST_ERR_VALUE = "";
            LAST_ERR_FIELD = null;
            canShow = false;
        } else {
            LAST_ERR_FIELD = CURRENT_FIELD;
            LAST_ERR_VALUE = (CURRENT_FIELD ? CURRENT_FIELD.value : null);
            REPET_ERR = false;
        }
    }
    if (canShow) {
        var m = ". Digite novamente.";
        switch (type) {
            case "date":
                msg = "Fecha no es valida" + m;
                break;
            case "time":
                msg = "Hora no es valida" + m;
                break;
            case "ag_account":
                msg = "Sucursal/Cuenta corrente incorrectos" + m;
                break;
            case "ag_savings":
                msg = "Sucursal/Cuonta incorrectos" + m;
                break;
            case "branch":
                msg = "Sucursal no es valida" + m;
                break;
            case "account":
                msg = "Cuonta no es valida" + m;
                break;
            case "cep":
                msg = "CEP invalido" + m;
                break;
            case "email":
                msg = "E-mail incorrecto" + m;
                break;
            case "cpf":
                msg = "CPF invalido" + m;
                break;
            case "cnpj":
                msg = "CNPJ invalido" + m;
                break;
            case "cpf_cnpj":
                msg = "CPF/CNPJ invalido" + m;
                break;
            case "month_year":
                msg = "Mes y ano no validos" + m;
                break;
            case "full_name":
                switch (errorCode) {
                    case 0:
                        msg = "Nombre invalido." + m;
                        break;
                    case 1:
                        msg = "Informe el apelido.";
                        break;
                    case 2:
                        msg = "Informe el primero nombre con mas de 2 caracteres.";
                        break;
                    case 3:
                        msg = "Informe al nome sin caracteres repetidos mas de 3 vezes.";
                        break;
                }
                break;
            default:
                msg = "Valor invalido" + m;
        }
        alert((!msgU || msgU == "") ? msg : msgU);
    }
    if (brow().isNetscape())
        LAST_FIELD.value = "";
    if (LAST_FIELD)
        LAST_FIELD.focus();
}
function focusCamp(f) {
    if (brow().isNetscape())
        f.value = "";
    else
        f.focus();
    ERRO = true;
}
function focusNetscape(f) {
    CURRENT_FIELD = f;
    var b = brow();
    if (b.isNetscape()) {
        if (ERRO) {
            LAST_FIELD.focus();
            ERRO = false;
        }
    } else if (b.isIE() && parseInt(b.getMajorver(), 10) > 4)
        if (f.select)
            f.select();
}
function focusField(f) {
    if (!f) {
        alert("focusField: Campo no achado.");
        return;
    }
    var ie = (brow().isIE() && !brow().isMac()), v = brow().getVersion(), b = parent.buttons;
    if (ie && (v >= 5 && v < 5.2) && b && b.myBarra) {
        var tp = f.type;
        if (tp && /^(text|password)$/.test(tp) && f.onblur && /formatCamp\(/.test(f.onblur)) {
            if (!window.event)
                window.focus();
        } else
            b.myBarra.clicked = false;
    }
    f.focus();
}
function brow() {
    if (typeof objBrow != "object")
        objBrow = new Browser();
    return objBrow;
}
function repeatNStr(vr, n) {
    var r = "", i;
    for (i = 0; i < n; i++)
        r += vr;
    return r;
}
function unformatFields(form) {
    var f, i, tp;
    if (!form)
        return;
    for (i = 0; i < form.length; i++) {
        f = form.elements[i];
        if (f.type == "text") {
            tp = getFieldType(f);
            if (tp) {
                vr = unformatField(f.value, tp);
                f.value = (!vr ? "" : vr);
            }
        }
    }
}
function getFieldType(f) {
    var blur = f.onblur;
    if (!blur)
        return null;
    var c = changeStr(removeStr(blur.toString(), " "), "\'", "\"");
    c = c.replace(/[\n\t]/g, "").toLowerCase();
    var ret = /^.*formatcamp\((.*)\).*$/.exec(c)[1];
    return ret.split1("\"")[1];
}
function isTextNumber(v) {
    return /^[0-9a-zA-Z������������������������\(\)\\\[\]\*\&\+\@\%\$\#\}\{\_\<\>\?\:\;]+$/.test(v);
}
function isFloatNumber(n) {
    return /^\-?\d+(,\d+|\d*)$/.test(n);
}







//   ESTRUTURA��O





function Browser() {
    this.name = this.platform = "Unknown";
    this.majorver = this.version = this.minorver = "";
    this.mozilla = false;
    this.init = _Init;
    this.getName = function () {
        return this.name
    };
    this.getMinorver = function () {
        return this.minorver
    };
    this.getMajorver = function () {
        return this.majorver
    };
    this.getVersion = function () {
        return parseFloat(this.version, 10)
    };
    this.getPlatform = function () {
        return this.platform
    };
    this.isIE = function () {
        return(this.name == "IE")
    };
    this.isNetscape = function () {
        return(this.name == "Netscape")
    };
    this.isMozilla = function () {
        return this.mozilla
    };
    this.isWindows = function () {
        return _has(this.platform, ["Windows", "WinNT"])
    };
    this.isWinNT = function () {
        return _has(this.platform, ["WinNT", "Windows NT"])
    };
    this.isWin95 = function () {
        return _has(this.platform, ["Win95", "Windows 95"])
    };
    this.isWin98 = function () {
        return _has(this.platform, ["Win98", "Windows 98"])
    };
    this.isLinux = function () {
        return _has(this.platform, "Unix")
    };
    this.isMac = function () {
        return _has(this.platform, "Mac");
    };
    this.init();
}

function _Init() {
    var ua = navigator.userAgent, t = "", ts = "", i, bv;
    bv = ua.slice(0, ua.indexOf("("));
    ts = ua.slice(ua.indexOf("(") + 1, ua.indexOf(")")).split1(";");
    for (i = 0; i < ts.length; i++) {
        t = ts[i].trim();
        if (_has(t, ["MSIE", "Opera"]))
            bv = t;
        else if (_has(t, ["X11", "SunOS", "Linux"]))
            this.platform = "Unix";
        else if (_has(t, ["Mac", "PPC", "Win"]))
            this.platform = t;
    }
    var idx = bv.indexOf("MSIE"), lo = "";
    if (idx >= 0)
        bv = bv.slice(idx);
    if (bv.slice(0, 7) == "Mozilla") {
        lo = "";
        this.name = "Netscape";
        if (ua.indexOf("Gecko/") != -1) {
            if (/Netscape/.test(ua)) {
                var v = /([^\/]+)\s*$/.exec(ua);
                if (v && v.length > 1)
                    lo = v[1] + " ";
            } else {
                this.mozilla = true;
                var v = /rv:([^\)]+)\)/.exec(ua);
                if (v && v.length > 1)
                    lo = v[1] + " ";
            }
        }
        if (lo == "")
            lo = bv.slice(8);
    } else if (bv.slice(0, 4) == "MSIE") {
        this.name = "IE";
        lo = bv.slice(5);
    } else if (bv.slice(0, 27) == "Microsoft Internet Explorer") {
        this.name = "IE";
        lo = bv.slice(28);
    } else if (bv.slice(0, 5) == "Opera") {
        this.name = "Opera";
        lo = bv.slice(6);
    }
    lo = lo.trim();
    i = lo.indexOf(" ");
    if (i >= 0)
        this.version = lo.slice(0, i);
    else
        this.version = lo;
    j = this.version.indexOf(".");
    if (j >= 0) {
        this.majorver = this.version.slice(0, j);
        this.minorver = this.version.slice(j + 1);
    } else
        this.majorver = this.version;
}

function _has(s, a) {
    s = String(s);
    if (typeof (a) == "string")
        return s.indexOf(a) != -1;
    else {
        for (var i = 0; i < a.length; i++)
            if (s.indexOf(a[i]) != -1)
                return true;
        return false;
    }
}
function _TRIM() {
    var s = 0, e = this.length;
    while (s < e && this.charAt(s) == ' ')
        s++;
    while (e > 0 && this.charAt(e - 1) == ' ')
        e--;
    return this.slice(s, e);
}
String.prototype.trim = _TRIM;

function random(r1, r2) {
    return Math.round(Math.random() * (r2 - r1)) + (r2 > r1 ? r1 : r2);
}
function trim(s) {
    return String(s).replace(/^\s+/, "").replace(/\s+$/, "");
}

function autoSkip(field, orient) {
    var ind = -1, f = field.form;
    for (i = 0; i < f.elements.length; i++)
        if (field == f.elements[i]) {
            ind = i;
            break;
        }
    focusCampByPos(f, ind, orient);
}


function autoFocus(f) {
    focusCampByPos((arguments.length == 0 ? document.forms[0] : f), -1);
}
function focusCampByPos(fr, ind, orient) {
    orient = orient ? orient : "down";
    var iNext = (orient == "down" ? 1 : -1), el;
    if ((typeof fr.elements[ind + iNext]) == "undefined") {
        if (ind != -1)
            if (fr.elements[ind] && fr.elements[ind].blur)
                fr.elements[ind].blur();
        return;
    }
    for (var i = ind + iNext; i < fr.elements.length; i += iNext) {
        el = fr.elements[i];
        if (/^(text|password|select.*|radio|checkbox.*)$/.test(el.type) && !el.disabled) {
            el.focus();
            return;
        }
    }
    if (fr.elements[ind] && fr.elements[ind].blur)
        fr.elements[ind].blur();
}
function isEmail(v) {
    return /^[0-9a-zA-Z\-\@\_.]+$/.test(v) && /@.*$/.test(v) && /\..*$/.test(v);
}
function isNumeric(v) {
    return /^[0-9]+$/.test(v);
}
function isAlfa(v) {
    return /^[a-zA-Z������������������������]+$/.test(v);
}
function isAlfaNumeric(v) {
    return /^[0-9a-zA-Z]+$/.test(v);
}
function invertStr(s) {
    var t = "", i;
    for (i = 0; i < s.length; i++)
        t = s.charAt(i) + t;
    return t;
}
function removeStr(src, arg) {
    var v = (typeof arg == "string") ? [arg] : arg;
    var r = "";
    for (var i = 0; i < v.length; i++)
        r = changeStr(src, v[i], "");
    return r;
}
function repeatStr(src, str, size, orient) {
    var r = String(src);
    if (!orient)
        orient = "left";
    while (r.length < size)
        r = orient.toLowerCase() == "right" ? (r + str) : (str + r);
    return r;
}
function changeStr(src, from, to)
{
    src = String(src);
    var i, li = 0, lFrom = from.length, dst = "";
    while ((i = src.indexOf(from, li)) != -1) {
        dst += src.substring(li, i) + to;
        li = i + lFrom;
    }
    dst += src.substring(li);
    return dst;
}

function justNumbersStr(s) {
    return String(s).replace(/\D*/g, "");
}

function onlySameNumber(s) {
    return isNumeric(s) && (new RegExp("^(" + s.charAt(0) + ")(\\1)*$")).test(s);
}

function _SPLT(c) {
    var r = [], t = "", i, l = this.length;
    if (l == 0)
        return null;
    for (i = 0; i < l; i++) {
        var ch = this.slice(i, i + 1);
        if (ch == c) {
            r.push(t);
            t = "";
        } else
            t += ch;
    }
    r.push(t);
    return r;
}

function _PSH(i) {
    this[this.length] = i;
    return this.length;
}
function _POP() {
    l = this[this.length - 1];
    this.length = Math.max(this.length - 1, 0);
    return l;
}

function _SPLI(ind, c) {
    var t = arguments.length, i;
    if (t == 0)
        return ind;
    if (typeof ind != "number")
        ind = 0;
    if (ind < 0)
        ind = Math.max(0, this.length + ind);
    if (ind > this.length) {
        if (t > 2)
            ind = this.length;
        else
            return [];
    }
    if (t < 2)
        c = this.length - ind;
    c = (typeof c == "number") ? Math.max(0, c) : 0;
    rmv = this.slice(ind, ind + c);
    end = this.slice(ind + c);
    this.length = ind;
    for (i = 2; i < t; i++)
        this[this.length] = arguments[i];
    for (i = 0; i < end.length; i++)
        this[this.length] = end[i];
    return rmv;
}

function _SHF() {
    var r = this[0];
    this.splice(0, 1);
    return r;
}








function relogio(nPar) {
    var nSegundos;
    var R = new Date();
    var ano;
    var nSec;
    var nHor;
    var nMin;
    var nHorF;
    var nMinF;
    var nSecF;
    var tempo_f;

    var nSegundos = (new Date().getSeconds() + (new Date().getMinutes() * 60) + (new Date().getHours() * 60 * 60));
    tempo_f = tempo_final - nSegundos

    if (tempo_f < 0) {
        tempo_f = 0
    }

    if (tempo_final > 0) {
        nSecF = (tempo_f) % 60;
        nHorF = Math.floor((tempo_f) / (60 * 60));
        nMinF = Math.floor((tempo_f - nSecF - (nHorF * 60 * 60)) / 60);
    }

    nSegundos = nSegundos + SecDif;

    nSec = nSegundos % 60;
    nHor = Math.floor(nSegundos / (60 * 60));
    nMin = Math.floor((nSegundos - nSec - (nHor * 60 * 60)) / 60);


    if (tempo_final > 0) {
        if (nSecF < 10) {
            document.images.sdF.src = '/0.JPG';
            document.images.suF.src = '/' + nSecF + '.JPG';
        } else {
            document.images.sdF.src = '/' + Math.floor(nSecF / 10) + '.JPG';
            document.images.suF.src = '/' + (nSecF % 10) + '.JPG';
        }
        if (nMinF < 10) {
            document.images.mdF.src = '/0.JPG';
            document.images.muF.src = '/' + nMinF + '.JPG';
        } else {
            document.images.mdF.src = '/' + Math.floor(nMinF / 10) + '.JPG';
            document.images.muF.src = '/' + (nMinF % 10) + '.JPG';
        }
        if (nHorF < 10) {
            document.images.hdF.src = '/0.JPG';
            document.images.huF.src = '/' + nHorF + '.JPG';
        } else {
            document.images.hdF.src = '/' + Math.floor(nHorF / 10) + '.JPG';
            document.images.huF.src = '/' + (nHorF % 10) + '.JPG';
        }
    }

    if (nSec < 10) {
        document.images.sd.src = '/0.JPG';
        document.images.su.src = '/' + nSec + '.JPG';
    } else {
        document.images.sd.src = '/' + Math.floor(nSec / 10) + '.JPG';
        document.images.su.src = '/' + (nSec % 10) + '.JPG';
    }
    if (nMin < 10) {
        document.images.md.src = '/0.JPG';
        document.images.mu.src = '/' + nMin + '.JPG';
    } else {
        document.images.md.src = '/' + Math.floor(nMin / 10) + '.JPG';
        document.images.mu.src = '/' + (nMin % 10) + '.JPG';
    }
    if (nHor < 10) {
        document.images.hd.src = '/0.JPG';
        document.images.hu.src = '/' + nHor + '.JPG';
    } else {
        document.images.hd.src = '/' + Math.floor(nHor / 10) + '.JPG';
        document.images.hu.src = '/' + (nHor % 10) + '.JPG';
    }

    if (R.getDate() < 10) {
        document.images.dd.src = '/0.JPG';
        document.images.du.src = '/' + R.getDate() + '.JPG';
    } else {
        document.images.dd.src = '/' + Math.floor(R.getDate() / 10) + '.JPG';
        document.images.du.src = '/' + (R.getDate() % 10) + '.JPG';
    }
    if (R.getMonth() < 9) {
        document.images.nd.src = '/0.JPG';
        document.images.nu.src = '/' + (R.getMonth() + 1) + '.JPG';
    } else {
        document.images.nd.src = '/' + Math.floor((R.getMonth() + 1) / 10) + '.JPG';
        document.images.nu.src = '/' + ((R.getMonth() + 1) % 10) + '.JPG';
    }
    ano = R.getYear() % 100;
    if (ano < 10) {
        document.images.ad.src = '/0.JPG';
        document.images.au.src = '/' + ano + '.JPG';
    } else {
        document.images.hd.src = '/' + Math.floor(ano / 10) + '.JPG';
        document.images.au.src = '/' + (ano % 10) + '.JPG';
    }
    ;

    if (nPar != 1) {
        setTimeout('relogio()', 1000);
    }

}


Array.prototype.shift = _SHF;
Array.prototype.splice = _SPLI;
Array.prototype.pop = _POP;
Array.prototype.push = _PSH;
String.prototype.split1 = _SPLT;







function Caption1() {
//     JAVASCRIPT INCLUDE FILE - (c) J R Stockton  >= 2003-09-01
//             http://www.merlyn.demon.co.uk/include1.js
//       Routines may be copied, but URL must not be linked to.
}

var Inc1T = 0

function VSF() {
    document.writeln(// After Michael Donn
            '<a href="view-source:' + this.location + '">View Source File<\/a>')
}


// DynWrite(target, text) (Jim Ley) works on controls, after page load :
// it is a computed function :

// Classify browser :

function GetDocVars() { // set 4 Globals; called in include1.js
    nCheck = 0
    if (DocDom = (document.getElementById ? true : false))
        nCheck++ // NS6 also IE5
    if (DocLay = (document.layers ? true : false))
        nCheck++ // NS4
    if (DocAll = (document.all ? true : false))
        nCheck++ // IE4
}
GetDocVars() // call *here*

// if (nCheck!=1) alert('Browser classification problem!  nCheck = ' +
//  String(nCheck) + '\nPlease let me know how the page works and what' +
//  ' the\nbrowser is; and, if possible, what needs to be done about it.')
function ReportDocVars() {
    if (nCheck == 0)
        document.write(' None of DocDom, DocLay, DocAll is set;',
                ' Dynamic Write will fail.'.italics(), '<p>')
    if (DocDom)
        document.write(' DocDom is set. ')
    if (DocLay)
        document.write(' DocLay is set. ')
    if (DocAll)
        document.write(' DocAll is set. ')
}

function TableDocVars() {
    document.writeln('<br><br><table summary="Browser class info"',
            ' bgcolor=blue align=center cellpadding=10 border=4>',
            '<tr><th bgcolor=wheat>For the displaying computer :</th>',
            '</tr><tr><td bgcolor=gainsboro align=center>',
            'Your browser gives<br>',
            '<b>DocAll = ', DocAll, ' ; DocDom = ', DocDom,
            ' ; DocLay = ', DocLay, '.</b><br>',
            'Check : ', nCheck, ' browser classification(s) set.',
            '</td></tr></table>')
}


// Define Function DynWrite(Where, What) to suit browser :
DocStr = ''
if (DocLay)
    DocStr = "return document.layers['NS_'+id]"
if (DocAll)
    DocStr = "return document.all[id]"
if (DocDom)
    DocStr = "return document.getElementById(id)"
GetRef = new Function("id", DocStr)

// DocLay = true ; DocAll = DocDom = false // Simulate NS4.7
DynWarn = 0

if (DocStr == '') {
    DynWrite = new Function("return false")
} else {
    if (DocAll || DocDom) {
        DynWrite = new Function("id", "S", "GetRef(id).innerHTML=S; return true")
    }
    // if (DocLay) DynWrite=new Function("id", "S", "var x=GetRef(id).document;"+
    //  "x.open('text/html'); x.write(S); x.close(); return true")
    if (DocLay)
        DynWrite = new Function(
                "if (0==DynWarn++)" +
                " alert('DynWrite not supported in \".layers\" browsers');" +
                "return false")
}


function NoDynLay() {
    if (DocLay)
        document.writeln(
                '<p><i>Dynamic Writing in a ".layers" browser such as yours ',
                'is difficult and I cannot now test it.  Therefore, ',
                'I don\'t now attempt it. An alert will be given in the ',
                'first use in each load/reload of a page.<\/i>')
}

// DynWrite() end.



// General Utilities :

function LS(x) {
    return String(x).replace(/\b(\d)\b/g, '0$1')
}

function LZ(x) {
    return(x < 0 || x > 9 ? "" : "0") + x
}

function LZZ(x) {
    return(x < 0 || x > 99 ? "" + x : "0" + LZ(x))
}

if (String.prototype && !String.prototype.substr) {
    String.prototype.substr =
            new Function("J", "K", "return this.substring(J, J+K)")
}

function TrimS() { // Grant Wagner = String.prototype.trim
    return (this.toString() ?
            this.toString().replace(/\s+$|^\s*/g, "") : "")
}
String.prototype.trim = TrimS

function Sign(y) {
    return(y > 0 ? '+' : y < 0 ? '-' : ' ')
}

function Prfx(Q, L, c) {
    var S = Q + "" // ??
    // if (!c) var c = ' '
    if (c.length > 0)
        while (S.length < L) {
            S = c + S
        }
    ;
    return S
}

function StrU(X, M, N) { // X>=0.0
    var T, S = new String(Math.round(X * Number("1e" + N)))
    if (/\D/.test(S)) {
        return '' + X
    }
    with (new String(Prfx(S, M + N, '0')))
        return substring(0, T = (length - N)) + '.' + substring(T)
}

function StrT(X, M, N) {
    return Prfx(StrU(X, 1, N), M + N + 2, ' ')
}

function StrS(X, M, N) {
    return Sign(X) + StrU(Math.abs(X), M, N)
}

function StrW(X, M, N) {
    return Prfx(StrS(X, 1, N), M + N + 2, ' ')
}

if (!Number.toFixed) { // 20030313
    Number.prototype.toFixed = // JL
            new Function('n',
                    '  /* toFixed */ if (!n) n=0\n  return StrS(this, 1, n)')
}


function SigFigNo(X, N) {
    var p = Math.pow(10, N - Math.ceil(Math.log(Math.abs(X)) / Math.LN10))
    return isFinite(p) ? Math.round(X * p) / p : X
}


function SigFigExp(X, N) { // N<22
    if (X == 0)
        return SigFigExp(1, N).replace(/\+1/, ' 0')
    var p = Math.floor(Math.log(Math.abs(X)) / Math.LN10)
    if (!isFinite(p))
        return X
    return (X > 0 ? '+' : "") + String(
            Math.round(X * Math.pow(10, N - p - 1))).replace(/(\d)/, "$1.") +
            (p >= 0 ? "e+" : "e-") + LZ(Math.abs(p))
} // All OK?


function Div(a, b) {
    return Math.floor(a / b)
}

function Mod(a, b) {
    return a - Math.floor(a / b) * b
}


var IxIt = 0, BoxX = 68


function Depict(X, Y, S, Hue) { // String S is shown and returned
    if (!Hue)
        Hue = "blue"
    var AutoID = "Auto" + ++IxIt
    document.writeln("<form name=", AutoID, ">",
            "<table align=center bordercolor=", Hue, " border=3><tr><td>",
            "<textarea name=N cols=", X, " rows=", Y, " readonly>",
            "<\/textarea><\/td><\/tr><\/table><\/form>")
    document.forms[AutoID].elements["N"].value = S
    return S
}


function ShowFF() { // Args are functions, last Arg is box height
    var Len = --arguments.length, S = ""
    for (var j = 0; j < Len; j++) {
        if (j > 0)
            S += "\n\n"
        S += arguments[j].toString()
    } // ???  but replace < > &  ???
    Depict(BoxX, arguments[Len], S, "lightgreen")
}


function ShowDo(Fn, Ht) {
    Depict(BoxX, Ht, Fn.toString(), "red");
    Fn()
}


function eIVSF() {
    Depict(46, 1,
            "  For the code, view the source of this page", "black")
}


var BID = 0

function PopCode(btn) {
    var Wndw = window.open("", "X" + new Date().getTime(), // /scr-bar?
            "height=" + (16 * btn.btnargs[1] + 40) + ",width=" + (8 * BoxX + 40) +
            ",resizable")
    Wndw.document.write(
            '<textarea rows=', btn.btnargs[1], ' cols=', BoxX, '>')
    for (var J = 0; J < btn.btnargs[0].length; J++) {
        if (J != 0)
            Wndw.document.write('\n\n')
        Wndw.document.write(btn.btnargs[0][J].toString())
    }
    Wndw.document.write('<\/textarea>')
    Wndw.document.close() /* DU */
}

function Btn() {
    var I = 'JJ' + BID++ // var BID = 0 precedes these
    document.write("<form name=", I, ">",
            "<input type=button name=N value='Pop Up Code'",
            " onClick='PopCode(this)'><\/form>")
    document.close() // DU
    document.forms[I].elements["N"].btnargs = arguments
}



var Inc1B = 0
// end.










// ESCREVE O TEMPO E A MESAGEM NO CAMPO DIV TEMPO
function tempo(nTempo, cStr) {
    if (nTempo == '[[TEMPO]]' || nTempo == '' || nTempo == 0) {
        DynWrite('tempo', '');
        return false;
    }

    DynWrite('tempo', cStr + nTempo);

}

function relogio_texto(nPar, cTexto, cTexto1, lTime) {
    var nSegundos;
    var R = new Date();
    var ano;
    var nSec;
    var nHor;
    var nMin;
    var nHorF;
    var nMinF;
    var nSecF;
    var tempo_f;
    var cHora;
    var cData;
    var cHoraF;
    var nDia;
    var nMes;
    var nAno;
    var cTeste;
    var cTexto11;
    var aSemana = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    var nSegundos = (R.getSeconds() + (R.getMinutes() * 60) + (R.getHours() * 60 * 60));
    tempo_f = tempo_final - nSegundos;


    if (tempo_f < 0) {
        tempo_f = 0
    }
    ;

    if (tempo_final > 0) {
        nSecF = (tempo_f) % 60;
        nHorF = Math.floor((tempo_f) / (60 * 60));
        nMinF = Math.floor((tempo_f - nSecF - (nHorF * 60 * 60)) / 60);
    }

    nSegundos = nSegundos + SecDif;

    nSec = nSegundos % 60;
    nHor = Math.floor(nSegundos / (60 * 60));
    nMin = Math.floor((nSegundos - nSec - (nHor * 60 * 60)) / 60);


    nDia = R.getDate();
    nMes = R.getMonth();
    nAno = R.getYear();

    if (nHor > 23) {
        nDia = nDia + Math.floor(nHor / 24);
        nHor = nHor % 24;
        R = new Date((nMes + 1) + '/' + nDia + '/' + nAno);
        nDia = R.getDate();
        nMes = R.getMonth();
        nAno = R.getYear();
    }
    nAno = nAno % 100;


    cHora = nSec;
    if (nSec < 10) {
        cHora = '0' + cHora
    }
    ;
    cHora = nMin + ':' + cHora;
    if (nMin < 10) {
        cHora = '0' + cHora
    }
    ;
    cHora = nHor + ':' + cHora;
    if (nHor < 10) {
        cHora = '0' + cHora
    }
    ;

    cData = '';
    if (nDia < 10) {
        cData = '0'
    }
    ;
    cData = cData + nDia + '/';

    if (nMes < 9) {
        cData = cData + '0'
    }
    ;
    cData = cData + (nMes + 1) + '/';

    if (nAno < 10) {
        cData = cData + '0'
    }
    ;
    cData = cData + nAno;

    cTexto11 = '' + cTexto1;

    if (cTexto11 == 'undefined') {
        cTexto11 = '';
    }

    cTeste = '' + cTexto;

    if (cTeste == 'undefined') {
        cTeste = '';
    }

    if (nPar != 1) {
        DynWrite('hora', cTeste + cData + '-' + aSemana[R.getDay()] + '-' + cHora);
    } else {
        DynWrite('hora', cHora);
        DynWrite('data', cData);
    }
    if (lTime != '0') {
        setTimeout('relogio_texto(' + nPar + ',"' + cTeste + '","' + cTexto11 + '")', 1000);
    }


    if (tempo_final > 0) {
        cHoraF = nSecF;
        if (nSecF < 10) {
            cHoraF = '0' + cHoraF
        }
        ;
        cHoraF = nMinF + ':' + cHoraF;
        if (nMinF < 10) {
            cHoraF = '0' + cHoraF
        }
        ;
        cHoraF = nHorF + ':' + cHoraF;
        if (nHorF < 10) {
            cHoraF = '0' + cHoraF
        }
        ;
        DynWrite('horaf', cTexto11 + cHoraF);
    }

}


function NumberFormat(nvalor, ndec) {
    nvalor = nvalor.toFixed(parseFloat(ndec));
    if (nvalor.substring(0, 1) == '+') {
        nvalor = nvalor.substring(1);
    }

    return nvalor;
}
function float2moeda(num) {


    num = parseFloat(num);
    x = 0;

    if (num < 0) {
        num = Math.abs(num);
        x = 1;
    }
    if (isNaN(num))
        num = '0';
    cents = Math.floor((num * 100 + 0.5) % 100);

    num = Math.floor((num * 100 + 0.5) / 100).toString();

    if (cents < 10)
        cents = '0' + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + '.' + num.substring(num.length - (4 * i + 3));

    ret = num + ',' + cents;
    if (x == 1)
        ret = ' - ' + ret;
    return ret;

}
function moeda2float(moeda) {
    moeda = moeda.replace(/\./g, "");

    moeda = moeda.replace(",", ".");

    return parseFloat(moeda);

}

function Ajax() {
    if (window.ActiveXObject)
        return new ActiveXObject("Microsoft.XMLHTTP");
    else if (window.XMLHttpRequest)
        return new XMLHttpRequest();
    else {
        alert("Seu browser não suporta AJAX.");
        return null;
    }
}

function MyRound(nValor, nDec) {
    nMul = "1";
    for (i = 0; i < nDec; i++) {
        nMul = nMul + "0";
    }
    nValor = nValor * parseFloat(nMul);
    nValor = Math.round(nValor);
    nValor = nValor / parseFloat(nMul);
    return nValor;
}
function id(cNome) {
    return document.getElementById(cNome);
}

function cursoroff() {
    if (lmobile == undefined || !lmobile) {
        array = document.getElementsByTagName('*');
        for (i = 0; i < array.length; i++) {
            if (array[i].name != undefined && array[i].name != '') {
                array[i].style.cursor = 'wait';
            }
        }
    } else {
        document.body.style.cursor = 'wait';
    }
}
function cursoron() {
    if (lmobile == undefined || !lmobile) {
        array = document.getElementsByTagName('*');
        for (i = 0; i < array.length; i++) {
            if (array[i].name != undefined && array[i].name != '') {
                array[i].style.cursor = 'default';
            }
        }
    } else {
        document.body.style.cursor = 'wait';
    }
}

function relogio_texto1(cCampo, nIdioma, nDif, cTexto, lSemData, lSemSemana, lSemHora) {
    var R = new Date();
    var caux;
    var csaida = "";

    if (nDif != 0) {
        nAux = R.getTime() + (nDif);
        R = new Date(nAux);
    }
    if (lSemData == undefined) {
        lSemData = false;
    }
    if (lSemSemana == undefined) {
        lSemSemana = false;
    }
    if (lSemHora == undefined) {
        lSemHora = false;
    }

    if (!lSemHora) {
        //segundos
        caux = '0' + R.getSeconds();
        csaida = caux.substr(-2, 2);
        //minutos
        caux = '0' + R.getMinutes();
        csaida = caux.substr(-2, 2) + ":" + csaida;
        //horas
        caux = '0' + R.getHours();
        csaida = caux.substr(-2, 2) + ":" + csaida;
    }
    //semana
    naux = R.getDay();

    if (cTexto == undefined) {
        cTexto = "";
    }
    if (nIdioma == 2) {
        aSemana = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    } else if (nIdioma == 1) {
        aSemana = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    } else {
        aSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    }
    if (!lSemSemana) {
        csaida = aSemana[naux] + " " + csaida;
    }
    if (!lSemData) {
        //anos
        csaida = " " + csaida;
        caux = '0' + R.getFullYear();
        csaida = caux.substr(-2, 2) + csaida;


        //meses
        caux = '0' + (R.getMonth() + 1);
        csaida = caux.substr(-2, 2) + "/" + csaida;
        //dias
        caux = '0' + R.getDate();
        csaida = caux.substr(-2, 2) + "/" + csaida;
    }
    DynWrite(cCampo, cTexto + " " + csaida);
    setTimeout('relogio_texto1("' + cCampo + '",' + nIdioma + ',' + nDif + ',"' + cTexto + '",' + lSemData + ',' + lSemSemana + ',' + lSemHora + ')', 1000);
    return;

}
function isCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf == '')
        return false;

    // Elimina CPFs invalidos conhecidos
    if (cpf.length != 11 ||
            cpf == "00000000000" ||
            cpf == "11111111111" ||
            cpf == "22222222222" ||
            cpf == "33333333333" ||
            cpf == "44444444444" ||
            cpf == "55555555555" ||
            cpf == "66666666666" ||
            cpf == "77777777777" ||
            cpf == "88888888888" ||
            cpf == "99999999999")
        return false;

    // Valida 1o digito
    add = 0;
    for (i = 0; i < 9; i ++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;

    // Valida 2o digito
    add = 0;
    for (i = 0; i < 10; i ++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;

    return true;
}
function isCGC(cnpj) {
    return isCNPJ(cnpj);
}
function isCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '')
        return false;

    if (cnpj.length != 14)
        return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
            cnpj == "11111111111111" ||
            cnpj == "22222222222222" ||
            cnpj == "33333333333333" ||
            cnpj == "44444444444444" ||
            cnpj == "55555555555555" ||
            cnpj == "66666666666666" ||
            cnpj == "77777777777777" ||
            cnpj == "88888888888888" ||
            cnpj == "99999999999999")
        return false;

    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0, tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return false;

    return true;
}

function Idioma(cPt, cEs, cUs) {
    var cIdioma = "US";
    if (navigator.browserLanguage) {
        cIdioma = navigator.browserLanguage;
    } else if (navigator.language) {
        cIdioma = navigator.language;
    }
    cIdioma = cIdioma.substr(0, 2).toUpperCase();
    if (cEs == undefined) {
        cEs = cPt;
    }
    if (cUs == undefined) {
        cUs = cPt;
    }
    if (cIdioma == "PT") {
        return cPt;
    } else if (cIdioma == "ES") {
        return cEs;
    } else {
        return cUs;
    }
}



//validacoes de campos                            
$(".input_email").css("text-transform", "lowercase");
$(".input_email").blur(function () {
    if (this.value != '' && !isEmail(this.value)) {
        alert(Idioma("Email não é válido", "Email no es valido", "invalid mail") + " ==> " + this.value);
        this.value = '';
        this.focus();
    }
    ;
});


$('.input_hora').attr('size', 8);
$('.input_hora').mask('000000', {reverse: true,
    placeholder: "__:__:__"});
$(".input_hora").blur(function () {
    ValidaHora(this);
});

$('.input_data').attr('size', 10);
$('.input_data').mask('00000000', {reverse: true,
    placeholder: "__/__/____"});
$(".input_data").blur(function () {
    ValidaData(this);
});

$('.input_dec2,.input_dec0,.input_dec3').attr('size', 18);
$('.input_dec2,.input_dec0,.input_dec3').mask('##################', {reverse: true});
$(".input_dec2").blur(function () {
    ValidaValor(this, 2);
});
$(".input_dec0").blur(function () {
    ValidaValor(this, 0);
});
$(".input_dec3").blur(function () {
    ValidaValor(this, 3);
});

function ValidaData(cData) {
    var oDat = new DateValidation(cData.value);
    if ((cData.value).trim() == '') {
        return true;
    }
    if (!oDat.isDate()) {
        alert(Idioma("Data inválida", "Fecha no es valida", "Invalid date") + " => " + cData.value);
        cData.value = '';
        cData.focus();
        return;
    }
    cData.value = oDat.getDateValue();
    return true;

}
function ValidaHora(cHora) {
    var cRet;
    var cAux = cHora.value;
    var nHora, nMinuto, nSegundo;
    cAux = cAux.replace(/:/g, "");
    if ((cHora.value).trim() == '') {
        return true;
    }
    cAux = cAux + "000000";
    nHora = parseInt(cAux.substr(0, 2));
    if (nHora > 23) {
        alert(Idioma("Hora inválida", "Hora no es valida", "Invalid time") + " => " + cHora.value);
        cHora.value = '';
        cHora.focus();
        return;
    }
    cRet = ("00" + nHora.toString()).substr(-2);
    nMinuto = parseInt(cAux.substr(2, 2));
    if (nMinuto > 59) {
        alert(Idioma("Hora inválida", "Hora no es valida", "Invalid time") + " => " + cHora.value);
        cHora.value = '';
        cHora.focus();
        return;
    }
    cRet = cRet + ":" + ("00" + nMinuto.toString()).substr(-2);
    nSegundo = parseInt(cAux.substr(4, 2));
    if (nSegundo > 59) {
        alert(Idioma("Hora inválida", "Hora no es valida", "Invalid time") + " => " + cHora.value);
        cHora.value = '';
        cHora.focus();
        return;
    }
    cRet = cRet + ":" + ("00" + nSegundo.toString()).substr(-2);
    cHora.value = cRet;
}
function ValidaValor(nValor, nDec) {
    var nVal;
    var nDiv = parseInt("1" + ("0000000000").substr(0, nDec));
    var cInt = '', cDec = '';

    var caux = nValor.value;
    caux = caux.replace(/\./g, "");
    caux = caux.replace(/,/g, "");
    caux = caux.replace(/ /g, "");
    nVal = parseInt(caux);
    if (isNaN(nVal) || nVal == 0) {
        return true;
    }
    caux = (Math.floor(nVal / nDiv)).toString();

    var nD = 0;
    for (var i = caux.length; i > 0; i--) {
        cInt = caux.substr(i - 1, 1) + cInt;
        ++nD;
        if (nD % 3 == 0 && i != 1) {
            cInt = "." + cInt;
        }
    }
    if (nDiv > 1) {
        cDec = "," + ("0000000000" + (nVal % nDiv).toString()).substr(nDec * -1);
    }
    nValor.value = cInt + cDec;
}
