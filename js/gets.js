var objBrow,LAST_ERR_VALUE="",errorCode=0;
var ERRO=REPET_ERR=false;
var LAST_FIELD=CURRENT_FIELD=LAST_ERR_FIELD=null;
var SZ_DATE=8,
SZ_CEP=8,
SZ_ACCOUNT=7,
SZ_AG_ACCOUNT=11,
SZ_AG_SAVINGS=SZ_AG_ACCOUNT, 
SZ_MONEY=15,
SZ_FLOAT=10,
SZ_CPF=11,
SZ_CNPJ=14,
SZ_CPF_CNPJ=SZ_CNPJ,
SZ_PERCENT=6,
SZ_BRANCH=4,
SZ_MONTH_YEAR=6,
SZ_TIME=4,
MAX_VALUE=99999999999999.99,
SP='&nbsp;',
CR='<br>';

function alerta(uaux){
    return alert(uaux);
}
function NumberFormat1(nvalor, ndec) {
    nvalor = nvalor.toFixed(parseFloat(ndec));
    if (nvalor.substring(0, 1) == '+') {
        nvalor = nvalor.substring(1);
    }
    if (nvalor.substr(-1)=='.'){
       nvalor=nvalor.substr(0,nvalor.length-1); 
    }
    return nvalor;
}

function MyTransform(nval,ntam,lsemdecimal,cpreenche){
    if (!lsemdecimal){
        lsemdecimal=false;
    }
    if (!cpreenche){
        cpreenche=" ";
    }
    if (!ntam){
        ntam=10;
    }
    return (cpreenche.repeat(20)+NumberFormat(nval,lsemdecimal?0:2,",",".",true)).substr(ntam*-1);
}

function NumberFormat(nval,ndec,csepdec,csepmil,lzero){
    if (!nval){
        nval=0;
    }
    if (!ndec){
        ndec=0;
    }
    if (!csepdec){
        csepdec=".";
    }
    if (!csepmil){
        csepmil="";
    }
    var caux=nval.toString();
    var aaux=caux.split(".");
    var cint=aaux[0];
    var cdec='';
    if (aaux.length>1){
    	cdec=aaux[1];
    }
    cdec=cdec+'0000000000';
    var cret='';
    if (ndec>0){
        cret=csepdec+cdec.substr(0,ndec);
    }
	if (cint==''){
    	cret="0"+cret;
    }else{
    	var ntam=cint.length;
        var lini=true;
        while (ntam>0){
        	caux=cint.substr(-3);
            if (caux!=''){
            	cret=caux+(lini?"":csepmil)+cret;
            }
            ntam=ntam-3;
            lini=false;
            cint=cint.substr(0,ntam);
        }
    }
    if (lzero){
    	caux=cret.replace(/0/g,'').replace(csepmil,'').replace(csepdec,'');
        if (caux==''){
        	cret='';
        }
    }
    return cret;
}
function NumberFormatX(nval,ndec,csepdec,csepmil,lzero){
    var nvalor;
    var caux;
    var caux1;
    var caux2;
    var i; 
    var nmul="1";
    var lmenos=false;
    if (nval<0){
        lmenos=true;
        nval=nval*-1;
    }
    if (lzero==undefined){
        lzero=false;
    }
    if (csepdec==undefined){
        csepdec=',';
    }
    if (csepmil==undefined){
        csepmil='.';
    }
    nvalor=parseFloat(nval);
    for (i=1;i<=ndec;i++){
        nmul=nmul+"0";
    }
    
    nmul=parseInt(nmul);
    nvalor=Math.floor(nvalor*nmul)/nmul;
    if (lzero && nvalor==0){
        return '';
    }
    caux=(Math.floor(nvalor)).toString();
    caux1='';
    caux2='';
    for (i=0;i<caux.length;i++){
        caux2=(caux.substr(caux.length-i-1,1)).toString();
        if (i%3==0 && i!=0){
          caux2+=csepmil;
        }
        caux1=caux2+caux1;
    }
    if (ndec>0){
       caux1=caux1+csepdec;
       if (nvalor<1){
           nvalor=nvalor+1000;
       }
       caux=(Math.floor(nvalor*10000000000)).toString();
       caux=caux.substr(-10);
       for (i=0;i<ndec;i++){
          caux1=caux1+caux.substr(i,1);
       }
    }
    if (lmenos){
        caux1="-"+caux1;
    }
    return caux1;
}

function _TRIM(){
    var s=0,e=this.length;
    while(s<e&&this.charAt(s)==' ')s++;
    while(e>0&&this.charAt(e-1)==' ')e--;
    return this.slice(s,e);
}
String.prototype.trim=_TRIM;

function random(r1,r2){
    return Math.round(Math.random()*(r2-r1))+ (r2>r1?r1:r2);
}
function trim(s){
    return String(s).replace(/^\s+/,"").replace(/\s+$/,"");
}

function validaConteudo(event, el, tp) {
    var t = (typeof event.which != "undefined" && event.which != null ? event.which : event.keyCode), key;
    if (tp == 'none' || t < 20)
        return true;
    key = removeSpcChars(String.fromCharCode(t), el.type);
    if (key == "")
        return false;
    var tp_sp = /^sp_/.test(tp);
    if (_isRE(tp))
        return tp.test(key);
    else if (/^(percent|(neg_)?(numeric|float(\d{0,1})|money(\d{0,1})))$/.test(tp)) {
        return isNumeric(key) || (!/numeric/.test(tp) && key == "," && el.value.indexOf(",") == -1) || (/^neg_/.test(tp) && key == "-" && el.value.indexOf("-") == -1);
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


function removeCaracs(f, type) {
    if (_isRE(type))
        return;
    var vr = unformatField(f.value, type, f.type);
    if (f.value != vr)
        f.value = vr;
    focusNetscape(f);
}


function formatCamp(campo, tp, par1, par2, par3) {
    var ie = (brow().isIE() && !brow().isMac()), v = brow().getVersion();
    var b = parent.buttons;
    if (ie && (v >= 5 && v < 5.2) && b && b.myBarra && b.myBarra.clicked == true) {
        parent.buttons.myBarra.clicked = false;
        eval("try{campo.focus();}catch(e){}");
        return false;
    }
    var nArg = formatCamp.arguments.length;

    if (campo.value == '' && tp == 'integer') {
//        campo.value=0;
        campo.value = '';
    }
    if (campo.value == '' && tp == 'float') {
//        campo.value=0.00;
        campo.value = '';
    }
    if (campo.value == '' && tp == 'money') {
//        campo.value=0,00;
        campo.value = '';
    }

    ERRO = false;
    var vr = trim(campo.value);
    
    
    if (!campo || !vr || vr.length == 0) {
        if (/^(neg_)?(money|money2)$/.test(tp))
            campo.value = "0,00";
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


function saltaCampo(ev, field, tp, size) {
    var tc, max = size, nargs = saltaCampo.arguments.length;
    if (/^(neg_)?float/.test(tp))
        max = (nargs > 3) ? size : SZ_FLOAT;
    else if (/^(neg_)?money/.test(tp)) {
        if (!verifyMaxValue(field.value))
            max = (nargs > 3) ? size : SZ_MONEY;
        else
            field.value = "0,00";
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
    }
    else
        return false;
}


function _isRE(re){
    return typeof re=="object" && typeof re.test=="function";
}

function unformatField(valor,tipo,inputType){
    var t=(arguments.length<1)?"default":String(tipo),
    vr=trim(removeSpcChars((typeof valor=="object"?valor.value:valor),(inputType?inputType:valor.type)));
    if(!vr||vr.length==0)return "";
    if(/^(date|month_year|time|ag_account|ag_savings|branch|account|cep|(neg_)?numeric|interval)$/.test(t))
        vr=(/^neg_/.test(t)&&vr.indexOf("-")==0?"-":"")+justNumbersStr(vr);
    else if(/^(percent|(neg_)?(float(\d{0,1})|money(\d{0,1})))$/.test(t))vr=toFloat(vr,_getNDec(t));
    else{
        if(/^(cpf|cnpj|cpf_cnpj)$/.test(t)){
            vr=justNumbersStr(vr);
            var isCPF=tipo=="cpf"||(tipo=="cpf_cnpj" && vr.length<=SZ_CPF);
            vr=repeatStr(vr,"0",isCPF?SZ_CPF:SZ_CNPJ);
            if(parseInt(vr,10)==0)vr="";
        }else if(t=="email")vr=trim(vr)
    }
    if(typeof valor=="object")valor.value=vr;
    return vr;
}



function removeSpcChars(vr,type){
    var ret="",re=/197|198|208|215|216|222|223|229|230|240|247|248/,c=0,s=String(vr);
    for(var i=0;i<s.length;i++){
        c=s.charCodeAt(i);
        if((c>31&&c<253&&(c<127||c>191)&&!re.test(c))||(type=="textarea"&& (c==9||c==13||c==10)))ret+=s.charAt(i);
    }
    return ret;
}
function brow(){
    if(typeof objBrow!="object")objBrow=new Browser();
    return objBrow;
}
function focusNetscape(f){
    CURRENT_FIELD=f;
    var b=brow();
    if(b.isNetscape()){
        if(ERRO){
            LAST_FIELD.focus();
            ERRO=false;
        }
    }else if(b.isIE()&& parseInt(b.getMajorver(),10)>4)if(f.select)f.select();
}
function Browser(){
    this.name=this.platform="Unknown";
    this.majorver=this.version=this.minorver="";
    this.mozilla=false;
    this.init=_Init;
    this.getName=function(){
        return this.name
    };
    this.getMinorver=function(){
        return this.minorver
    };
    this.getMajorver=function(){
        return this.majorver
    };
    this.getVersion=function(){
        return parseFloat(this.version,10)
    };
    this.getPlatform=function(){
        return this.platform
    }; 
    this.isIE=function(){
        return(this.name=="IE")
    };
    this.isNetscape=function(){
        return(this.name=="Netscape")
    };
    this.isMozilla=function(){
        return this.mozilla
    };
    this.isWindows=function(){
        return _has(this.platform,["Windows","WinNT"])
    };
    this.isWinNT=function(){
        return _has(this.platform,["WinNT","Windows NT"])
    };
    this.isWin95=function(){
        return _has(this.platform,["Win95","Windows 95"])
    };
    this.isWin98=function(){
        return _has(this.platform,["Win98","Windows 98"])
    };
    this.isLinux=function(){
        return _has(this.platform,"Unix")
    };
    this.isMac=function(){
        return _has(this.platform,"Mac");
    };
    this.init();
}
function _Init(){
    var ua=navigator.userAgent,t="",ts="",i,bv;
    bv=ua.slice(0,ua.indexOf("("));
    ts=ua.slice(ua.indexOf("(")+1,ua.indexOf(")")).split(";");
    for(i=0;i<ts.length;i++){
        t=ts[i].trim();
        if(_has(t,["MSIE","Opera"]))bv=t;
        else if(_has(t,["X11","SunOS","Linux"]))this.platform="Unix";
        else if(_has(t,["Mac","PPC","Win"]))this.platform=t;
    }
    var idx=bv.indexOf("MSIE"),lo="";
    if(idx>=0)bv=bv.slice(idx);
    if(bv.slice(0,7)=="Mozilla"){
        lo="";
        this.name="Netscape";
        if(ua.indexOf("Gecko/")!=-1){
            if(/Netscape/.test(ua)){
                var v=/([^\/]+)\s*$/.exec(ua);
                if(v&&v.length>1)lo=v[1]+" ";
            }else{
                this.mozilla=true;
                var v=/rv:([^\)]+)\)/.exec(ua);
                if(v&&v.length>1)lo=v[1]+" ";
            }
        }
        if(lo=="")lo=bv.slice(8);
    }else if (bv.slice(0,4)=="MSIE"){
        this.name="IE";
        lo=bv.slice(5);
    }else if (bv.slice(0,27)=="Microsoft Internet Explorer"){
        this.name="IE";
        lo=bv.slice(28);
    }else if (bv.slice(0,5)=="Opera"){
        this.name="Opera";
        lo=bv.slice(6);
    }
    lo=lo.trim();
    i=lo.indexOf(" ");
    if(i>=0)this.version=lo.slice(0,i);
    else this.version=lo;
    j=this.version.indexOf(".");
    if(j>=0){
        this.majorver=this.version.slice(0,j);
        this.minorver=this.version.slice(j+1);
    }else this.majorver=this.version;
}
function _has(s,a){
    s=String(s);
    if(typeof(a)=="string")return s.indexOf(a)!=-1;
    else{
        for(var i=0;i<a.length;i++)if(s.indexOf(a[i])!=-1)return true;
        return false;
    }
}
function isEmail(v){
    return /^[0-9a-zA-Z\-\@\_.]+$/.test(v) && /@.*$/.test(v) && /\..*$/.test(v);
}
function isNumeric(v){
    return /^[0-9]+$/.test(v);
}
function isAlfa(v){
    return /^[a-zA-Z������������������������]+$/.test(v);
}
function isAlfaNumeric(v){
    return /^[0-9a-zA-Z]+$/.test(v);
}
function invertStr(s){
    var t="",i;
    for(i=0;i<s.length;i++)t=s.charAt(i)+t;
    return t;
}
function verifyMaxValue(vr){
    return vr.length>0 &&(parseFloat(vr)>MAX_VALUE);
}
function formatType(f,tp,msgErr,adarg1,adarg2){
    if(tp=="none"){
        f.value=removeSpcChars(f.value);
        return true;
    }
    var vr=unformatField(f.value,tp,f.type);
    LAST_FIELD=f;
    var ret=isValidValue(vr,tp,adarg1,adarg2);
    if(!ret){
        showError(tp,msgErr);
        return false;
    }
    else if(!_isRE(tp))f.value=getFmtValue((typeof ret=="boolean")?vr:ret,tp);
    ERRO=false;
    return true;
}
function toFloat(src,ndec){
    src=trim(src);
    if(!/^\-?([0-9]|\.)*\,{0,1}[0-9]*$/.test(src)||src.charAt(0)==".")return src;
    var tam=src.length,pDec=src.indexOf(",");
    if(src.length==0)src="0";
    if(pDec==-1){
        var p=src.indexOf(".");
        if(p!=-1&&p==(tam-ndec-1))src=src.replace(/\.(\d*)$/,",$1");
        else return removeStr(src,".")+","+repeatNStr("0",ndec);
        pDec=src.indexOf(",");
    }
    src=removeStr(src,".");
    if(pDec==0)return "0"+src+repeatNStr("0",ndec+1-src.length);
    else{
        if(pDec>(tam-ndec-1))src+=repeatNStr("0",pDec-(tam-ndec-1));
        pDec=src.indexOf(",");
        return parseInt(src.slice(0,pDec),10)+src.slice(pDec,pDec+ndec+1);
    }
}

function _getNDec(t){
    var arr=t.match(/(\d+)\s*$/);
    return arr?parseInt(arr[1],10):2;
}
function removeStr(src,arg){
    var v=(typeof arg=="string")?[arg]:arg;
    var r="";
    for(var i=0;i<v.length;i++)r=changeStr(src,v[i],"");
    return r;
}
function changeStr(src,from,to)
{
    src=String(src);
    var i,li=0,lFrom= from.length,dst="";
    while((i=src.indexOf(from,li))!=-1){
        dst+=src.substring(li,i)+to;
        li=i+lFrom;
    }
    dst+=src.substring(li);
    return dst;
}
function repeatNStr(vr,n){
    var r="",i;
    for(i=0;i<n;i++)r+=vr;
    return r;
}
function isValidValue(vr,tp,adarg1,adarg2){
    var re,isNum=isNumeric(vr);
    if(_isRE(tp))return tp.test(vr);
    else if(/^(ag_account|ag_savings|account|branch|cep)$/.test(tp))
        return isNum && vr.length==eval("SZ_"+tp.toUpperCase());
    else if(/^(percent|(neg_)?(float(\d{0,1})|money(\d{0,1})))$/.test(tp))
        return (!/^neg_/.test(tp)&&vr.indexOf("-")!=-1?false:isFloatNumber(vr));
    /*xxxxxxxxxxxxx*/
    else if(/textnumber$/.test(tp))
        return isTextNumber((tp.indexOf("sp_")==0)?removeStr(vr," "):vr);
    else if(/text_entry$/.test(tp))
        return isTextNumber(vr.replace(/[\.\-\/\,=]|\s/g,""));
    else if(/alfanumeric$/.test(tp))
        return isAlfaNumeric((tp.indexOf("sp_")==0)?removeStr(vr," "):vr);
    else{
        switch(tp){
            case "time":
                switch(vr.length){
                    case 1:
                        vr="0"+vr+"00";
                        break;
                    case 2:
                        vr+="00";
                        break;
                    case 3:
                        vr="0"+vr+"0";
                        break;
                }
                vr=repeatStr(vr,"0",4,"right");
                return(isNum && /^([0-1]\d[0-5]\d)|(2[0-3][0-5]\d)$/.test(vr))?vr:null;
            case "date":
                var obj=new DateValidation(vr);
                return (isNum && obj.isDate())?obj:null;
            case "month_year":
                var obj=new DateValidation("01"+vr);
                return (isNum && obj.isDate())?obj:null;
            case "text":
                return isAlfa(vr.replace(/[ ]/g,""));
            case "full_name":
                return isFullName(vr);
            case "email":
                return isEmail(vr);
            case "cpf":
                return isCPF(vr);
            case "cnpj":
                return isCNPJ(vr);
            case "cpf_cnpj":
                return (vr.length <=SZ_CPF)?isCPF(vr):isCNPJ(vr);
            case "interval":
                vr=parseInt(vr,10);
                return vr>=adarg1 && vr<=adarg2;
            case "default":
                return !/'|"/.test(vr);
            default:
                return true;
        }
    }
}
function getFieldType(f){
    var blur=f.onblur;
    if(!blur)return null;
    var c=changeStr(removeStr(blur.toString()," "),"\'","\"");
    c=c.replace(/[\n\t]/g,"").toLowerCase();
    var ret=/^.*formatcamp\((.*)\).*$/.exec(c)[1];
    return ret.split("\"")[1];
}
function isTextNumber(v){
    return /^[0-9a-zA-Z������������������������\(\)\\\[\]\*\&\+\@\%\$\#\}\{\_\<\>\?\:\;]+$/.test(v);
}
function isFloatNumber(n){
    return /^\-?\d+(,\d+|\d*)$/.test(n);
}
function getFmtValue(vr,tp){
    if(tp=="cpf_cnpj")tp=(vr.length <=SZ_CPF)?"cpf":"cnpj";
    if(/^(neg_)?money/.test(tp))return fmtMoney(vr,_getNDec(tp));
    else{
        switch(tp){
            case "time":
                return vr.slice(0,2)+":"+vr.slice(2,4); 
            case "date":
                return vr.getDateValue();
            case "month_year":
                return vr.getMonthDateValue();
            case "ag_account":
                return vr.slice(0,4)+"-"+vr.slice(4,9)+"-"+vr.slice(9,11);
            case "ag_savings":
                return vr.slice(0,4)+"-"+vr.slice(4,10)+"-"+vr.slice(10,11);
            case "account":
                return vr.slice(0,5)+"-"+vr.slice(5,7);
            case "cep":
                return vr.slice(0,5)+"-"+vr.slice(5,8);
            case "uppercase":case "full_name":
                return vr.toUpperCase();
            case "cpf":
                return vr.slice(0,3)+"."+vr.slice(3,6)+"."+ vr.slice(6,9)+ "-"+vr.slice(9,11);
            case "cnpj":
                return vr.slice(0,2)+"."+vr.slice(2,5)+"."+vr.slice(5,8)+"/"+vr.slice(8,12)+"-"+vr.slice(12,14);
            default:
                return vr;
        }
    }
}
function fmtMoney(vr,ndec){
    var neg=vr.indexOf("-")==0;
    if(verifyMaxValue(vr)){
        ERRO=true;
        return "0,00";
    }
    vr=toFloat(vr,ndec);
    var vraux="",p,pDec=vr.indexOf(","),vrDec=vr.slice(pDec+1);
    for(var i=pDec;i>(neg?1:0);i--){
        p=i-pDec;
        if(i!=pDec&&(p%3==0))vraux+=".";
        vraux+=vr.charAt(i-1);
    }
    return (neg?"-":"")+invertStr(vraux)+","+vrDec;
}
function autoSkip(field,orient){
    var ind=-1,f=field.form;
    if (field.form==null){
        return;
    }

    for(i=0;i<f.elements.length;i++)
        if(field==f.elements[i]){
            ind=i;
            break;
        }
    focusCampByPos(f,ind,orient);
}


function autoFocus(f){
    focusCampByPos((arguments.length==0?document.forms[0]:f),-1);
}
function justNumbersStr(s){
    return String(s).replace(/\D*/g,"");
}
function onlySameNumber(s){
    return isNumeric(s)&& (new RegExp("^("+s.charAt(0)+")(\\1)*$")).test(s);
}
function DateValidation(d){
    this.dtSrc=d;
    this.dtValue="";
    this.isDate=_isDate;
    this.getDateValue=function() {
        return(this.dtValue);
    };
    this.getMonthDateValue=function() {
        return(this.dtValue.slice(3));
    } 
}
function _isDate(){
    var vrs=/^(0[1-9]|[1-2][0-9]|3[0-1])(0[1-9]|1[0-2])(\d{2}|19\d{2}|20\d{2})$/.exec(justNumbersStr(this.dtSrc));
    if(!vrs || vrs.length<4)return false;
    var d=parseInt(vrs[1],10),m=parseInt(vrs[2],10),a=parseInt(vrs[3],10);		
    if(a<100)a+=(a<30?2000:1900);
    if(/^(4|6|9|11)$/.test(m) && d==31)return false;
    if(m==2){
        var bissexto=(((a%4==0)&&a%100!=0)||a%400==0);
        if(d>29 ||(d==29 && !bissexto))return false;
    }
    this.dtValue=repeatStr(d,"0",2)+"/"+repeatStr(m,"0",2)+"/"+a;
    return true;
}
function DateObj(d){
    d=trim(d);
    if(!d)return;
    var t=d.length;
    if(t==10||t==8||t==6){
        this.isValid=true;
        this.srcDate=d;
        this.date=d.replace(/\//g,"");
        this.day=this.date.slice(0,2);
        this.month=this.date.slice(2,4);
        this.year=this.date.slice(4);
        var a=parseInt(this.year,10);
        if(a<100){
            a+=(a<30?2000:1900);
            this.year=String(a);
        }

        this.daysTo=_DaysTo;
        this.lesserThan=function(d){
            return Number(this.year+this.month+this.day) < Number(d.year+d.month+d.day)
        };
        this.biggerThan=function(d){
            return !this.lesserThan(d)&& !this.equal(d)
        };
        this.equal=function(d){
            return this.date==d.date.replace(/\//g,"");
        };
        this.biggerOrEqualThan=function(d){
            return this.biggerThan(d)||this.equal(d)
        };
        this.lesserOrEqualThan=function(d){
            return this.lesserThan(d)||this.equal(d)
        };
    }else this.isValid=false;
}
function repeatStr(src,str,size,orient){
    var r=String(src);
    if(!orient)orient="left";
    while(r.length < size)r=orient.toLowerCase()=="right"?(r+str):(str+r);
    return r;
}


function showError(type,msgU){
    ERRO=true;
    var b=brow(),canShow=true;
    if(typeof type=="object" && !_isRE(type)){
        alert(msgU);
        focusCamp(type);
        return;
    }
/*alert(type);
    if(b.isIE() && parseInt(b.getMajorver(),10)<5){
        if(CURRENT_FIELD && LAST_ERR_FIELD==CURRENT_FIELD && LAST_ERR_VALUE==CURRENT_FIELD.value){
            REPET_ERR=true;
            CURRENT_FIELD.value=LAST_ERR_VALUE="";
            LAST_ERR_FIELD=null;
            canShow=false;
        }else{
            LAST_ERR_FIELD=CURRENT_FIELD;
            LAST_ERR_VALUE=(CURRENT_FIELD?CURRENT_FIELD.value:null);
            REPET_ERR=false;
        }
    }
 */
    if(canShow){
        var m=". Digite novamente.";
        switch(type){
            case "date":
                msg="Data inválida"+m;
                break;
            case "time":
                msg="Hora inválida"+m;
                break;
            case "cep":
                msg="CEP invalido"+m;
                break;
            case "email":
                msg="E-mail incorrecto"+m;
                break;
            case "cpf":
                msg="CPF invalido"+m;
                break;
            case "cnpj":
                msg="CNPJ invalido"+m;
                break;
            case "cpf_cnpj":
                msg="CPF/CNPJ invalido"+m;
                break;
            case "month_year":
                msg="Mês e ano inválido"+m;
                break;
            case "full_name":
                switch(errorCode){
                    case 0:
                        msg="Nombe inválido."+m;
                        break;
                    case 1:
                        msg="Informe o Sobrenome";
                        break;
                    case 2:
                        msg="Informe o primeiro nome com masi de 2 caracteres.";
                        break;
                    case 3:
                        msg="Informe o nome sem caracteres repetidos mais de 3 vezes.";
                        break;
                }
                break;
            default:
                msg="Valor invalido"+m;
        }
        alert((!msgU || msgU=="")?msg:msgU);
    }
    CURRENT_FIELD.value='';
    CURRENT_FIELD.focus();

    //    if(brow().isNetscape())LAST_FIELD.value="";

//    if(LAST_FIELD)LAST_FIELD.focus();
}

function vedigito(ndig){
    return ve_digito(ndig);
}
function ve_digito(ndig){
    var ndv = 0 ;

    ndv=ndig%10;
    return (ndv==digito(Math.floor(ndig/10)));
}

function poe_digito(ndig){
    return ((ndig*10)+digito(ndig));
}
function poedigito(ndig){
    return ((ndig*10)+digito(ndig));
}
function tira_digito(ndig){
    return Math.floor(ndig/10);
}

function tiradigito(ndig){
    return Math.floor(ndig/10);
}

function digito(ndig){
    var somapar = 0 ;
    var somaimpar = 0 ;
    var nint = 0 ;
    var ndvr = 0 ;
    var i;
    
    nint='00000000000'+ndig;
    nint=nint.substring(nint.length-12,nint.length);

    for (i=0;i<12;++i){
        if (i%2==1){
            somapar+=Math.floor(nint.substr(i,1));
        }else{
            somaimpar+=Math.floor(nint.substr(i,1));
        }
    }
    ndvr = somaimpar + (somapar*3) ;
    ndvr = ndvr%10 ;
    ndvr = 10-ndvr ;
    if (ndvr>9) {
        ndvr = 0 ;
    }
    return ndvr;
}

    function vecampo(ctabela, ccampo, cwhere) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST',  curl+'mesa.php', false);
        xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp.send('modo=999&tab=' + ctabela + '&cam=' + encodeURI(ccampo) + '&whe=' + encodeURI(cwhere));
        return xmlhttp.responseText;
    }

function NumberDesformat(cnum){
    cnum=String(cnum);
    cnum=cnum.replace('.','');
    cnum=cnum.replace(',','.');
    return cnum;
}
function Left(str, n){
	if (n <= 0)
	    return "";
	else if (n > String(str).length)
	    return str;
	else
	    return String(str).substring(0,n);
}
function Right(str, n){
    if (n <= 0)
       return "";
    else if (n > String(str).length)
       return str;
    else {
       var iLen = String(str).length;
       return String(str).substring(iLen, iLen - n);
    }
}
if (!String.prototype.hasOwnProperty('addSlashes')) {
    String.prototype.addSlashes = function() {
        return this.replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
             .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
             .replace(/"/g, '&quot;')
             .replace(/\\/g, '\\\\')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/\u0000/g, '\\0');
        }
}









/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;   /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = "";  /* base-64 pad character. "=" for strict RFC compliance   */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s)    { return rstr2hex(rstr_md5(str2rstr_utf8(s))); }
function b64_md5(s)    { return rstr2b64(rstr_md5(str2rstr_utf8(s))); }
function any_md5(s, e) { return rstr2any(rstr_md5(str2rstr_utf8(s)), e); }
function hex_hmac_md5(k, d)
  { return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
function b64_hmac_md5(k, d)
  { return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
function any_hmac_md5(k, d, e)
  { return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of a raw string
 */
function rstr_md5(s)
{
  return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
}

/*
 * Calculate the HMAC-MD5, of a key and some data (raw strings)
 */
function rstr_hmac_md5(key, data)
{
  var bkey = rstr2binl(key);
  if(bkey.length > 16) bkey = binl_md5(bkey, key.length * 8);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
  return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
}

/*
 * Convert a raw string to a hex string
 */
function rstr2hex(input)
{
  try { hexcase } catch(e) { hexcase=0; }
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var output = "";
  var x;
  for(var i = 0; i < input.length; i++)
  {
    x = input.charCodeAt(i);
    output += hex_tab.charAt((x >>> 4) & 0x0F)
           +  hex_tab.charAt( x        & 0x0F);
  }
  return output;
}

/*
 * Convert a raw string to a base-64 string
 */
function rstr2b64(input)
{
  try { b64pad } catch(e) { b64pad=''; }
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var output = "";
  var len = input.length;
  for(var i = 0; i < len; i += 3)
  {
    var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > input.length * 8) output += b64pad;
      else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
    }
  }
  return output;
}

/*
 * Convert a raw string to an arbitrary string encoding
 */
function rstr2any(input, encoding)
{
  var divisor = encoding.length;
  var i, j, q, x, quotient;

  /* Convert to an array of 16-bit big-endian values, forming the dividend */
  var dividend = Array(Math.ceil(input.length / 2));
  for(i = 0; i < dividend.length; i++)
  {
    dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
  }

  /*
   * Repeatedly perform a long division. The binary array forms the dividend,
   * the length of the encoding is the divisor. Once computed, the quotient
   * forms the dividend for the next step. All remainders are stored for later
   * use.
   */
  var full_length = Math.ceil(input.length * 8 /
                                    (Math.log(encoding.length) / Math.log(2)));
  var remainders = Array(full_length);
  for(j = 0; j < full_length; j++)
  {
    quotient = Array();
    x = 0;
    for(i = 0; i < dividend.length; i++)
    {
      x = (x << 16) + dividend[i];
      q = Math.floor(x / divisor);
      x -= q * divisor;
      if(quotient.length > 0 || q > 0)
        quotient[quotient.length] = q;
    }
    remainders[j] = x;
    dividend = quotient;
  }

  /* Convert the remainders to the output string */
  var output = "";
  for(i = remainders.length - 1; i >= 0; i--)
    output += encoding.charAt(remainders[i]);

  return output;
}

/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input)
{
  var output = "";
  var i = -1;
  var x, y;

  while(++i < input.length)
  {
    /* Decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
    {
      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      i++;
    }

    /* Encode output as utf-8 */
    if(x <= 0x7F)
      output += String.fromCharCode(x);
    else if(x <= 0x7FF)
      output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0xFFFF)
      output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0x1FFFFF)
      output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                    0x80 | ((x >>> 12) & 0x3F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
  }
  return output;
}

/*
 * Encode a string as utf-16
 */
function str2rstr_utf16le(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                  (input.charCodeAt(i) >>> 8) & 0xFF);
  return output;
}

function str2rstr_utf16be(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                   input.charCodeAt(i)        & 0xFF);
  return output;
}

/*
 * Convert a raw string to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binl(input)
{
  var output = Array(input.length >> 2);
  for(var i = 0; i < output.length; i++)
    output[i] = 0;
  for(var i = 0; i < input.length * 8; i += 8)
    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
  return output;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2rstr(input)
{
  var output = "";
  for(var i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
  return output;
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */
function binl_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);
}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}


function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
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

function padl(cstr,ntam,cfill){
    if (!cfill){
        cfill=' ';
    }
    if (!ntam){
        ntam=10;
    }
    cstr=cfill.repeat(ntam)+cstr.trim();
    return cstr.substr(ntam*-1);
}
function padr(cstr,ntam,cfill){
    if (!cfill){
        cfill=' ';
    }
    if (!ntam){
        ntam=10;
    }
    cstr=cstr.trim()+cfill.repeat(ntam);
    return cstr.substr(0,ntam);
}


function padc(cstr,ntam,cfill){
    if (!cfill){
        cfill=' ';
    }
    if (!ntam){
        ntam=10;
    }
    cstr=cfill.repeat(Math.floor(ntam/2))+cstr.trim()+cfill.repeat(ntam);
    return cstr.substr(0,ntam);
    
}











