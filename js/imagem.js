nEsperaOcr = 0;
function EnviaImagemOcr(cimg1, cimg2, nmodo, lEspera) {
    if (!cimg2 && nmodo == 1) {
        nmodo = 3;
    }
    if (!lEspera) {
        nEsperaOcr = bootbox.espera({
            message: _tr('Consultando AI ...'),
            MostraTempo: true,
            colorType: "info"
        });

    }
    var fileURL = (nmodo == 2 ? cimg2 : cimg1);

    var uri = encodeURI(curl + "upload_ocr.php");

    var options = new FileUploadOptions();

    options.fileKey = "file";
    options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";

//    options.mimeType = "text/plain";
    options.chunkedMode = false;

    var headers = {'headerParam': 'headerValue'};
    options.headers = headers;
    options.timeout = 75000;
    options.params = {"client": nSerialCec, "ord": nmodo}; //1-imagem 1 2-imagem2 3-sem imagem 2

    var ft = new FileTransfer();
    ft.upload(fileURL, uri, function (oResp) {
        var aret = JSON.parse(oResp.response);
        if (parseInt(aret.erro) == 98) {
            nEsperaOcr.modal("hide");
            navigator.notification.alert(
                    aret.cerro, // message
                    function () {
                    }, // callback
                    _tr('Vendas'), // title
                    'Ok'                  // buttonName
                    );
            return false;
        }
        if (parseInt(aret.erro) == 1) {
            EnviaImagemOcr(cimg1, cimg2, 2,true);
            return;
        }
        nEsperaOcr.modal("hide");
alert(oResp.response);        
        return;
    }, function () {
        nEsperaOcr.modal("hide");
        alert(e.http_status);
    }, options, true);

}
function CarregaImagem(nimagem) {
    //VeFoto(nimagem);
}
function CarregaImagemOcr(nimagem) {
    VeFotoOcr(nimagem, false);
}
function CarregaImagemOcrF(nimagem) {
    VeFotoOcr(nimagem, true);
}

//ajusta a url do apoio    
var nWidth = 1024;
var nHeight = 768;
var lDireto = true;

function config() {
    navigator.notification.alert(
            'Server: ' + curl +
            '\nLargura: ' + nWidth + "px" +
            "\nAltura: " + nHeight + "px" +
            "\nDireto: " + (lDireto == 1 ? "Sim" : "Não"), // message
            null, // callback
            'Configuração', // title
            'Ok'                  // buttonName
            );
}

//variaveis globais
var img1_url = '';
var img2_url = '';
var ncliente = '';
var lEnvioOk = 0;
var cVendedor = '';
var cOperador = '';
var cNome = '';
var cCedula = '';

// apos envio da imagem ao servidor 
function onFSuccess1(r) {
    var caux = r.response;
    if (!(caux.substr(0, 2) == "00")) {
        navigator.notification.confirm(
                _tr('Envio não foi bem sucedido.\aTentar novamente ? \n\nErro: ') + caux, // message
                function (nOp) {
                    if (nOp == 2) {
                        reiniciar(true);
                        return;
                    }
                }, // callback to invoke with index of button pressed
                _tr('Identidade'), // title
                _tr('Sim,Não')          // buttonLabels
                );
        return;

    }
}
function onFSuccess2(r) {
    var caux = r.response;
    var ncli = ncliente;
    if (!(caux.substr(0, 2) == "00")) {
        navigator.notification.confirm(
                _tr('Envio não foi bem sucedido.\aTentar novamente ? \n\nErro: ') + caux, // message
                function (nOp) {
                    if (nOp == 2) {
                        reiniciar(true);
                        return;
                    }
                }, // callback to invoke with index of button pressed
                _tr('Identidade'), // title
                _tr('Sim,Não')          // buttonLabels
                );
        return;

    } else {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                navigator.notification.alert(
                        _tr('Envio Ok'), // message
                        function () {
                            LimpaCli();
                            VeCliente(ncli);
                            //*// $('.nav-tabs a[href="#foto"]').tab('show');
                        }, // callback
                        _tr('Identidade'), // title
                        _tr('Ok')                  // buttonName
                        );
                //reiniciar(true);
            }
            return false;
        };
        xhr.onerror = function () {
            navigator.notification.alert(
                    _tr("Sem comunicação com o servidor"), // message
                    null, // callback
                    'ERRO', // title
                    'Erro'                  // buttonName
                    );

        };
        xhr.open('POST', curl + "upload_1.php", true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.timeout = 4000; // Set timeout to 4 seconds (4000 milliseconds)
        xhr.ontimeout = function () {
            alert(_tr("Sem comunicação com o servidor"));
        };
        xhr.send("cod=" + ncliente + "&nom=" + cNome);
    }
    return;
}
// erro do envio da imagem ao servidor
function onFError(error) {
    //    alert("Um Erro ocorreu: Code = " + error.code + "\nupload error source " + error.source + "\nupload error target " + error.target);
    navigator.notification.alert(
            _tr('Houve um erro no envio da Imagem ao servidor.\nPor favor, tente novamente \n Erro: ') + error.code, //+"\nSource: "+error.source+"\nTarget: "+error.target, // message
            null, // callback
            _tr('Identidade'), // title
            'Ok'                  // buttonName
            );
    return;
}

//reiniciar o processo
function reiniciar(ldireto) {
    if (ldireto) {
        onConfirm(1);
        return;
    }
    navigator.notification.confirm(
            _tr('Confirma o reinicio do processo ? '), // message
            onConfirm, // callback to invoke with index of button pressed
            _tr('Identidade'), // title
            _tr('Sim,Não')          // buttonLabels
            );
}
function onConfirm(buttonIndex) {
    if (buttonIndex == 1) {
        document.getElementById("cliente1").style.display = "none";
        document.getElementById("cliente").style.display = "block";
        document.getElementById("foto1").style.display = "none";
        document.getElementById("foto2").style.display = "none";
        document.getElementById("ifoto1").src = "";
        document.getElementById("ifoto2").src = "";
        document.getElementById("reiniciar").style.display = "none";
        document.getElementById("finalizar").style.display = "none";
        document.getElementById('ifoto1').visibility = "hidden";
        document.getElementById('ifoto2').visibility = "hidden";
        img1_url = '';
        img2_url = '';
        return;
    }
}

// CAPTURAR A FOTO VEICULO
function VeiculoFoto() {
    if (!$("#vc_placa").val()) {
        navigator.notification.alert(
                _tr("Informe os dados do veículo e salve antes de agregar uma foto"), // message
                function () {
                }, // callback
                _tr('Veículo'), // title
                'Ok'                  // buttonName
                );
        return false;
    }
    navigator.notification.confirm(
            _tr('Fotografe agora'), // message
            function (e) {
                if (e == 1) {
                    navigator.camera.getPicture(VeionSuccess, VeionFail, {
                        quality: 75,
                        destinationType: Camera.DestinationType.FILE_URI,
                        targetWidth: nWidth,
                        targetHeight: nHeight,
                        correctOrientation: true,
                        allowEdit: false,
                        cameraDirection: 0
                    });
                }

            }, // callback to invoke with index of button pressed
            _tr('Veículo'), // title
            _tr('Sim,Não')          // buttonLabels
            );

}
function VeionSuccess(imageData) {

    var fileURL = imageData;
//    var uri = encodeURI(curl.replace(/https:\/\//gi, "http://") + "upload_vei.php");
    var uri = encodeURI(curl + "upload_vei.php");
//    alerta(curl.replace(/https:\/\//gi, "http://") + "upload.php");

    var options = new FileUploadOptions();

    options.fileKey = "file";
    options.fileName = $("#vc_placa").val() + "_" + ncliente + "_" + fileURL.substr(fileURL.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";

//    options.mimeType = "text/plain";
    options.chunkedMode = false;

    var headers = {'headerParam': 'headerValue'};
    options.headers = headers;
    options.timeout = 6000;

    var ft = new FileTransfer();
    ft.upload(fileURL, uri, VeionFSuccess, onFError, options, true);
}
function VeionFail(message) {
    alert(_tr('Falhou. Motivo: ') + message);
}



function VeionFSuccess(r) {
    var caux = r.response;
    if (!(caux.substr(0, 2) == "00")) {
        navigator.notification.confirm(
                _tr('Envio não foi bem sucedido.\aTentar novamente ? \n\nErro: ') + caux, // message
                function (nOp) {
                    if (nOp == 2) {
                        reiniciar(true);
                        return;
                    }
                }, // callback to invoke with index of button pressed
                _tr('Veículo'), // title
                _tr('Sim,Não')          // buttonLabels
                );
        return;

    }
    VeiculoLeFoto();
}




// CAPTURAR A FOTO OCR
function VeFotoOcr(nFoto, lFile) {
    nNum = nFoto;
    navigator.notification.confirm(
            _tr('Tire a foto da ' + (nNum == 1 ? "FRENTE" : "VERSO") + ' da cédula: '), // message
            function (nConf) {
                //nNum = 1;
                if (nConf == 1) {
                    navigator.camera.getPicture(function (e) {
                        $("#ocr_img" + nNum).prop("src", e);
                    }, function (e) {
                        alert(_tr('Falhou. Motivo:') + e);
                    }, {
                        quality: 75,
                        sourceType: (lFile ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA),
                        destinationType: Camera.DestinationType.FILE_URI,
                        targetWidth: nWidth,
                        targetHeight: nHeight,
                        correctOrientation: true,
                        allowEdit: false,
                        cameraDirection: 0
                    });
                }
                return;

            }, // callback to invoke with index of button pressed
            _tr('Identidade'), // title
            _tr('Sim,Não')          // buttonLabels
            );

}





// CAPTURAR A FOTO
function VeFoto(nFoto) {
    nNum = nFoto;
    navigator.notification.confirm(
            _tr('Tire a foto da ' + (nNum == 1 ? "FRENTE" : "VERSO") + ' da cédula: '), // message
            function (nConf) {
                nNum = 1;
                if (nConf == 1) {
                    navigator.camera.getPicture(onSuccess, function (e) {
                        alert(_tr('Falhou. Motivo:') + e);
                    }, {
                        quality: 75,
                        destinationType: Camera.DestinationType.FILE_URI,
                        targetWidth: nWidth,
                        targetHeight: nHeight,
                        correctOrientation: true,
                        allowEdit: false,
                        cameraDirection: 0
                    });
                }
                return;

            }, // callback to invoke with index of button pressed
            _tr('Identidade'), // title
            _tr('Sim,Não')          // buttonLabels
            );

}

function onSuccessOcr(imageData, nNum) {
    var fileURL = imageData;
    $("#ocr_img" + nNum).prop("src", imageData);

    options.mimeType = "image/jpeg";
//    options.mimeType = "text/plain";
    options.chunkedMode = false;

    var headers = {'headerParam': 'headerValue'};
    options.headers = headers;
    options.timeout = 6000;

    var ft = new FileTransfer();
    if (nNum == 1) {
        ft.upload(fileURL, uri, onFSuccess1, onFError, options, true);
    } else {
        ft.upload(fileURL, uri, onFSuccess2, onFError, options, true);
    }
    if (nNum == 1) {
        nNum = 2;
        navigator.notification.confirm(
                _tr('Tire a foto do VERSO da cédula: '), // message
                function () {
                    navigator.camera.getPicture(onSuccess, onFail, {
                        quality: 75,
                        destinationType: Camera.DestinationType.FILE_URI,
                        targetWidth: nWidth,
                        targetHeight: nHeight,
                        correctOrientation: true,
                        allowEdit: false,
                        cameraDirection: 0
                    });

                }, // callback to invoke with index of button pressed
                _tr('Identidade'), // title
                _tr('Sim,Não')          // buttonLabels
                );

    }
}





function onSuccess(imageData) {
    /*
     var image = document.getElementById('ifoto' + nNum);
     image.src = imageData;
     image.style.visibility = "visible";
     image.style.height = "150px";
     */
    if (nNum == 1) {
        img1_url = imageData;
    } else {
        img2_url = imageData;
    }
    var fileURL = imageData;
//    var uri = encodeURI(curl.replace(/https:\/\//gi, "http://") + "upload.php");
    var uri = encodeURI(curl + "upload.php");
    //alerta(curl.replace(/https:\/\//gi, "http://") + "upload.php");
    var options = new FileUploadOptions();
//alerta(uri);
    options.fileKey = "file";
    options.fileName = ncliente + "_" + nNum + "_" + fileURL.substr(fileURL.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
//    options.mimeType = "text/plain";
    options.chunkedMode = false;

    var headers = {'headerParam': 'headerValue'};
    options.headers = headers;
    options.timeout = 6000;

    var ft = new FileTransfer();
    if (nNum == 1) {
        ft.upload(fileURL, uri, onFSuccess1, onFError, options, true);
    } else {
        ft.upload(fileURL, uri, onFSuccess2, onFError, options, true);
    }
    if (nNum == 1) {
        nNum = 2;
        navigator.notification.confirm(
                _tr('Tire a foto do VERSO da cédula: '), // message
                function () {
                    navigator.camera.getPicture(onSuccess, onFail, {
                        quality: 75,
                        destinationType: Camera.DestinationType.FILE_URI,
                        targetWidth: nWidth,
                        targetHeight: nHeight,
                        correctOrientation: true,
                        allowEdit: false,
                        cameraDirection: 0
                    });

                }, // callback to invoke with index of button pressed
                _tr('Identidade'), // title
                _tr('Sim,Não')          // buttonLabels
                );

    }
}





function onFail(message) {
    alert(_tr('Falhou. Motivo:') + message);
}


//enviar fotos se não for direto

function enviar() {

    var uri = encodeURI(curl + "upload.php");
    var options = new FileUploadOptions();

    var aimg = [img1_url, img2_url];
    var fileURL = aimg[0];

    img1_url = '';
    img2_url = '';

    options.fileKey = "file";
    options.fileName = ncliente + "_1_" + fileURL.substr(fileURL.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.chunkedMode = false;

    var headers = {'headerParam': 'headerValue'};
    options.headers = headers;

    var ft = new FileTransfer();
    ft.upload(fileURL, uri, onFSuccess1, onFError, options, true);
}



/*
 // LER O QRCODE DO CLIENTE NA TELA
 function LeCli() {
 cVendedor = '';
 cOperador = '';
 cNome = '';
 cCedula = '';
 ncliente = '';
 img1_url = '';
 img2_url = '';
 
 cordova.plugins.barcodeScanner.scan(
 function (result) {
 if (!result.cancelled) {
 var aret = (result.text).split("|");
 var cli = '';
 
 cli = aret[0];
 if (aret.length > 1) {
 cVendedor = aret[1];
 }
 if (aret.length > 2) {
 cOperador = aret[2];
 }
 if (aret.length > 3) {
 cCedula = aret[3];
 }
 if (aret.length > 4) {
 cNome = aret[4];
 }
 
 if (!(cli.substr(0, 8) == 'CodCli:*') || !(cli.substr(-1, 1) == "*")) {
 navigator.notification.alert(
 'Código lido não é valido', // message
 null, // callback
 'Cliente', // title
 'Ok'                  // buttonName
 );
 return;
 
 }
 cli = (cli.substr(8));
 cli = cli.substr(0, cli.length - 1);
 ncliente = tiradigito(cli);
 
 if (!vedigito(cli)) {
 navigator.notification.alert(
 'Código lido não é valido', // message
 null, // callback
 'Cliente', // title
 'Ok'                  // buttonName
 );
 return;
 
 }
 var xhr = new XMLHttpRequest();
 xhr.onreadystatechange = function () {
 if (xhr.readyState == 4) {
 var oobj = JSON.parse(xhr.responseText);
 if (oobj[0] == 0) {
 navigator.notification.alert(
 'Código lido não é valido', // message
 null, // callback
 'Cliente', // title
 'Ok'                  // buttonName
 );
 return;
 }
 document.getElementById("cliente1").innerHTML = "Cliente: " + oobj[0] + '-' + oobj[1];
 document.getElementById("cliente1").style.display = "block";
 document.getElementById("cliente").style.display = "none";
 document.getElementById("foto1").style.display = "block";
 document.getElementById("foto2").style.display = "block";
 document.getElementById("reiniciar").style.display = "block";
 
 }
 };
 xhr.onerror = function () {
 navigator.notification.alert(
 'SERVIDOR NÃO RESPONDE', // message
 null, // callback
 'ERRO', // title
 'Erro'                  // buttonName
 );
 
 };
 xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
 xhr.timeout = 4000; // Set timeout to 4 seconds (4000 milliseconds)
 xhr.ontimeout = function () {
 alert("Servidor não respondeu ");
 };
 xhr.send("ope=1&cod=" + cli);
 }
 },
 function (error) {
 navigator.notification.alert(
 "Erro na leitura: " + error, // message
 null, // callback
 'Cliente', // title
 'Erro'                  // buttonName
 );
 },
 {
 preferFrontCamera: false, // iOS and Android
 showFlipCameraButton: true, // iOS and Android
 showTorchButton: true, // iOS and Android
 torchOn: false, // Android, launch with the torch switched on (if available)
 prompt: "Insira o QRCODE na area de leitura", // Android
 resultDisplayDuration: 5, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
 formats: "QR_CODE,PDF_417,EAN13", // default: all but PDF_417 and RSS_EXPANDED
 orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
 disableAnimations: true, // iOS
 disableSuccessBeep: false // iOS
 }
 );
 }
 
 
 */
