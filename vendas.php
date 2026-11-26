<?php
session_start();
$_SESSION["web"] = true;
session_write_close();
$lweb = true;
require './inc/config.php';
require_once './inc/versao.php';
$db = mysqli_connect($server, $user, $password, $database, $port);
if (mysqli_connect_error()) {
    die(mysqli_connect_error());
}

$cimp = '';
if (isset($_REQUEST["IMP"])) {
    $cimp = strtoupper($_REQUEST["IMP"]);
    if ($cimp) {
        $oimp = mysqli_fetch_array(mysqli_query($db, "select * from IMP_CFG_WEB WHERE NOME='" . $cimp . "' AND ATIVO='Y' "));
        if (!$oimp) {
            die("<h2>Impressora <strong>'" . $cimp . "'</strong> não configurada </h2>");
        }
        if ($oimp["OPERADORES"]) {
            $aaux = explode(",", $oimp["OPERADORES"]);
            if (array_search($_SESSION["usuario"], $aaux) === false) {
                die("<h2>Operador não autoriza a usar a Impressora <strong>'" . $cimp . "'</strong>  </h2>");
            }
        }
        $cimp = $oimp["NUMERO"] . "," . $cimp;
    }
}

function GetConfig($cConfig) {
    global $db;
    return mysqli_fetch_row(mysqli_query($db, "select $cConfig from CONFIGVD_WEB WHERE IS_DELETED='N' AND VENDEDOR='" . $_SESSION["vendedor"] . "'"))[0];
}

$aconfig = mysqli_fetch_array(mysqli_query($db, "select * from CONFIGVD_WEB where is_deleted='N' and vendedor=" . $_SESSION["vendedor"]));
?><!DOCTYPE html><html>
    <head>
        <title>Vnd:<?php echo $_SESSION["vendedor"] . "-" . $_SESSION["cvendedor"]; ?></title>
        <meta charset="utf-8" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <!-- WARNING: for iOS 7, remove the width=device-width and height=device-height attributes. See https://issues.apache.org/jira/brow se/CB-4323 -->
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

        <!--   <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" /> -->
        <!--        <meta http-equiv="Content-Security-Policy" content="default-src *  'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; script-src * 'unsafe-inline' 'unsafe-eval'; img-src * data: 'unsafe-inline'; connect-src *  'unsafe-inline' 'unsafe-eval'; frame-src *;">
        -->
        <meta http-equiv="Content-Security-Policy"
              content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;
              style-src * 'unsafe-inline';
              script-src * 'unsafe-inline' 'unsafe-eval';
              img-src * data: blob: 'unsafe-inline';
              connect-src *;
              frame-src *;">


        <link rel="stylesheet" href="assets/components/bootstrap/css/bootstrap.min.css">
        <link rel="stylesheet" href="assets/components/bootstrap/css/font-awesome.min.css">
        <link rel='stylesheet' href='assets/components/bootstrap/fonts/all.css' >
        <link rel="stylesheet" href="css/cec.css?v=<?php echo filemtime('css/cec.css'); ?>">
        <link rel="stylesheet" href="css/cec-modern.css?v=<?php echo filemtime('css/cec-modern.css'); ?>">

        <!-- <script type="text/javascript" src="cordova.js"></script> -->
        <script src="js/translate.js"></script>
        <script type="text/javascript" src="js/index.js"></script>


        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />


        <link rel="icon" href="img/favicon.svg" type="image/svg+xml">



        <script type="text/javascript">
            var veconfig = {};
<?php
foreach ($aconfig as $key => $value) {
    if (!is_numeric($key)) {
        echo 'veconfig["' . $key . '"]=' . (is_numeric($value) ? $value : "'" . $value . "'") . ";";
        echo 'veconfig["' . strtolower($key) . '"]=' . (is_numeric($value) ? $value : "'" . $value . "'") . ";";
    }
}
?>

        </script>
        <style>
            /* Computador */
            .videoCamera {
                width: 600px;
                max-width: 100%;
                height: auto;
            }

            /* Celular */
            @media screen and (max-width: 768px) {
                .videoCamera {
                    width: 100%;
                    height: auto;
                }
            }




            .blink {
                animation: blink-animation 1s steps(2, start) infinite;
            }
            @keyframes blink-animation {
                50% {
                    opacity: 0;
                }
            }
            .prefer{
                background: #00ffff;
            }
            .modal-body{
                max-height: calc(100vh - 150px);
                overflow-y: auto;
            }
            .foot {
                position: fixed;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 40px;
                z-index: 10;
            }
            .tabprod  {
                font-size: 1em;
            }
            #pd_imagem,#vd_quant,#pd_detalhes,#pd_autoriza{
                top: 130px;
            }
            #pd_imagem,#pd_foto{
                width: 100%;
            }
            input[id^='lj_ck_'] {
                visibility: hidden;
            }

            label[id^='lj_l_'] {
                display: block;
                border: 6px solid #fff;
                border-radius: 10px;
                width: 84px;
                float: left;
            }

            input[type="radio"]:checked+label[id^='lj_l_'] {
                border-color: #f00;
            }
            .img_size {
                height: 80px;
            }
            .img_size1 {
                height: 80px;
            }
            .img_size2 {
                height: 45px;
            }
            .form-cli1 {
                height: 45px;
            }
            .form-cli {
                font-size: 1.5em;
            }

        </style>
    </head>


    <body >
        <div class="container" id="pg_inicio" style="display:block;">
            <div class="row" >
                <div class="text-center" >
                    <img id='logo_cli' src="img/cliente.png" alt="" height="53"  />
                </div>

                <div class="text-center bg-warning text-warning" >
                    <h3>Carregando sistema</h3>
                    <i class="fa fa-spinner fa-spin" style="font-size:50px"></i>
                </div>
            </div>
        </div>
        <div class="container" id="pg_principal" style="display:none;">
            <div id="menu1" style="display:block;">        

            </div>
            <div class="tab-content" >
                <!--loja-->
                <div id="loja" class="tab-pane fade in active">
                    <div class="row">
                    </div>
                    <div class="row">
                        <div class="col-xs-4">
                            <h3><span id="id_vendaorc">Venda/<br>Orçamento:</span></h3>
                        </div>
                        <div class="col-xs-8 radio-inline">
                            <br>                            
                            <input type="radio" id="lj_ck_ven_ven" name="lj_venda" checked><label for="lj_ck_ven_ven"       id="lj_l_venda">    <img class="img_size" src="img/vendas.png"></label>

                            <input type="radio" id="lj_ck_ven_orc" name="lj_venda">        <label for="lj_ck_ven_orc"       id="lj_l_orca" >    <img class="img_size" src="img/orcamentos.png"> </label>

                            <input type="radio" id="lj_ck_ven_orc_ven" name="lj_venda">    <label for="lj_ck_ven_orc_ven"   id="lj_l_orc_ven" > <img class="img_size1" src="img/orc_ven.png"> </label>
                        </div>
                    </div>


                    <div class="row ">
                        <div class="col-xs-4">
                            <h3><span id="id_nacionalidade">Nacionalidade</span>:<br>&nbsp;</h3>
                        </div>
                        <div class="col-xs-8 radio-inline">
                            <br>                            
                            <input type="radio" id="lj_ck_n1" name="lj_nacionalidade"        ><label for="lj_ck_n1" id="lj_l_nl2"><img class="img_size" src="img/paraguay.png" id='img_nacionalidade'  ></label>
                            <input type="radio" id="lj_ck_n2" name="lj_nacionalidade" checked><label for="lj_ck_n2" id="lj_l_nl1"><img class="img_size" src="img/mundo.png"> </label>
                        </div>
                    </div>
                    <div id="lj_pagamento_cab">
                        <div class="row ">
                            <div class="col-xs-4">
                                <h3><span id="id_pagamento">Forma de<br> pagamento</span>:</h3>
                            </div>
                            <div class="col-xs-5  radio-inline">
                                <br>                            
                                <input type="radio" id="lj_ck_p1" name="lj_pagamento" value="1" checked ><label for="lj_ck_p1" id="lj_l_np1"><img class="img_size" src="img/money.png" ></label>
                                <input type="radio" id="lj_ck_p2" name="lj_pagamento" value="2">        <label for="lj_ck_p2" id="lj_l_np2"><img class="img_size" src="img/card.png"> </label>
                                <input type="radio" id="lj_ck_p3" name="lj_pagamento" value="3">        <label for="lj_ck_p3" id="lj_l_np3"><img class="img_size" src="img/prazo.png"> </label>
                            </div>
                            <div class="col-xs-3">
                                <br>                            
                                <input type="number" id="lj_prazo" class="form-control form-cli" value="30" style="height: 50px; display: none">
                            </div>
                        </div>
                    </div>
                    <div  id="lj_loja_cab">
                        <div class="row ">
                            <div class="col-xs-4">
                                <h3><span id="id_loja">Loja</span>:<br>&nbsp;</h3>
                            </div>
                            <div class="col-xs-8 ">
                                <br>                            
                                <select class="form-control form-cli" id="lj_loja" style=" height: 50px;">
                                </select>                    
                            </div>
                        </div>
                    </div>
                    <div  id="lj_lojacor_cab">
                        <div class="row" id="loja_corr">
                            <div class="col-xs-4">
                                <h3><span id="id_loja_cor">Loja Corr.</span>:<br>&nbsp;</h3>
                            </div>
                            <div class="col-xs-8 ">
                                <br>                            
                                <select class="form-control form-cli" id="lj_lojacor" style=" height: 50px;">
                                </select>                    
                            </div>
                        </div>
                    </div>
                    <div class="row ">
                        <div class="col-xs-4">
                            <h3><span id="id_nota">Nota para<br> alterar</span>:</h3>
                        </div>
                        <div class="col-xs-5">

                            <div class="input-group" >
                                <br>                            
                                <input type="number" id="lj_notaalt" class="form-control form-cli" value="" style="height: 50px;">
                            </div>
                        </div>
                        <div class="col-xs-3">
                            <br>
                            <span class="input-group">
                                <span class="btn btn-success" style="height: 50px;"  id="lj_buscar_notaalt" >
                                    <i class="fa fa-search form-cli"  ></i>
                                </span>
                            </span>    
                        </div>
                    </div>
                    <div class="row ">
                        <div class="col-xs-4">
                            <h3><span id="id_moeda">Moeda</span>:<br>&nbsp;</h3>
                        </div>
                        <div class="col-xs-8 radio-inline">
                            <br>                            
                            <input type="radio" name="moeda" id="lj_ck_m1" value="1" checked /><label for="lj_ck_m1" id='lj_l_mi1'><img class="img_size" id="mi1" src="img/usa.png" alt=""></label>
                            <input type="radio" name="moeda" id="lj_ck_m2" value="2" /><label for="lj_ck_m2" id='lj_l_mi2'><img class="img_size" id="mi2" src="img/usa.png" alt=""></label>
                            <input type="radio" name="moeda" id="lj_ck_m3" value="3" /><label for="lj_ck_m3" id='lj_l_mi3'><img class="img_size" id="mi3" src="img/usa.png" alt=""></label>
                            <input type="radio" name="moeda" id="lj_ck_m4" value="4" /><label for="lj_ck_m4" id='lj_l_mi4'><img class="img_size" id="mi4" src="img/usa.png" alt=""></label>
                        </div>
                    </div>

                    <div class="row ">
                        <div class="col-xs-4">
                            <h3><span id="id_total">Total</span>:</h3>
                        </div>
                        <div class="col-xs-8">
                            <div class="text-center">
                                <!--
                            <div class="input-group">
                                <h2 class="input-group-addon" style="height: 80px;" id="lj_moeda">R$</h2>
                                <h2 class="input-group-addon text-left" style="font-weight: bold;height: 80px;background: rgb(255,251,164)" id="lj_valor">1.000,00</h2>
                            </div>
                                -->
                                <h2 class="input-group-addon alert alert-info" id="lj_moeda">R$</h2>
                                <h2 class="input-group-addon text-left alert alert-warning" style="font-weight: bold" id="lj_valor">1.000,00</h2>

                                <span class="tabprod"></span>
                            </div>
                        </div>
                    </div>                    


                    <div class="row " id="vd_voucher">
                        <div class="col-xs-4">
                            <h3><span id="id_voucher">Voucher</span>:<br>&nbsp;</h3>
                        </div>
                        <div class="col-xs-8">
                            <br>                            
                            <input type="text" id="lj_voucher" class="form-control form-cli" value="" style="height: 50px;">
                        </div>
                    </div>
                    <div class="row ">
                        <div class="col-xs-4">
                            <h3><span id="id_guia">Guia</span>:<br>&nbsp;</h3>
                        </div>
                        <div class="col-xs-8">
                            <br>                            
                            <input type="text" id="lj_guia" class="form-control form-cli" value="" style="height: 50px;" readonly>
                        </div>
                    </div>
                    <!--
                                        <div class="row ">
                                            <h3>Total:</h3>
                                        </div>
                                        <div class="row ">
                                            <div class="text-center">
                                                <div class="input-group">
                    
                                                    <h2 class="input-group-addon" style="height: 80px;" id="lj_moeda">R$</h2>
                                                    <h2 class="input-group-addon text-left" style="font-weight: bold;height: 80px;background: rgb(255,251,164)" id="lj_valor">1.000,00</h2>
                                                </div>
                                                <span class="tabprod"></span>
                                            </div>
                                        </div>
                    -->
                    <!-- notas -->
                    <div id="lj_modal" class="modal fade" role="dialog">
                        <div class="modal-dialog modal-lg">

                            <!-- Modal content-->
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title" id="lj_modal_cab">Selecione uma Nota</h4>
                                </div>
                                <div class="modal-body" id="lj_modal_corpo">
                                </div>
                            </div>

                        </div>
                    </div>                    


                </div>


                <!--DE ocr-->
                <div id="de_ocr" class="tab-pane fade">
                    <div class="row  alert alert-warning text-center" id="cl_ocr_men">
                        <strong><span id="id_ocr_men1">Reconhecimento de dados por IA </span></strong>
                    </div>
                    <div class="row"  id="cl_OCR">
                        <div class="col-xs-3 text-center">
                            <span >Cédula Frente </span>
                        </div>
                        <div class="col-xs-1">
                            <div class="input-group text-center" >
                                <button class="btn btn-primary" type="button" id="cl_btocrc1">
                                    <i class="fa fa-camera form-cli" id="cl_ocrcc1"></i>
                                </button>
                            </div>

                        </div>
                        <div class="col-xs-1">
                            <div class="input-group text-center" >
                                <button class="btn btn-primary" type="button" id="cl_btocrf1">
                                    <i class="fa fa-folder-open form-cli" id="cl_ocrc1"></i>
                                </button>
                            </div>

                        </div>

                        <div class="col-xs-3 text-center">
                            <span >Cédula Verso </span>
                        </div>
                        <div class="col-xs-1">
                            <div class="input-group text-center" >
                                <button class="btn btn-primary" type="button" id="cl_btocrc2">
                                    <i class="fa fa-camera form-cli" id="cl_ocrcc2"></i>
                                </button>
                            </div>

                        </div>
                        <div class="col-xs-1">
                            <div class="input-group text-center" >
                                <button class="btn btn-primary" type="button" id="cl_btocrf2">
                                    <i class="fa fa-folder-open form-cli" id="cl_ocrc2"></i>
                                </button>
                            </div>

                        </div>

                        <div class="col-xs-2">
                            <div class="input-group text-center" >
                                <button class="btn btn-success" type="button" id="cl_btsaveocr" >
                                    <span >Processar</span>
                                    <i class="glyphicon glyphicon-cloud-upload" id="cl_ocr3"></i>
                                </button>
                            </div>
                        </div>
                    </div>


                    <div class="row"  style="padding: 10px; border: 1px solid #4CAF50;">
                        <div class="col-xs-6"  style="padding: 5px;">
                            <img src="" id="ocr_img1" alt="" style="max-width: 100%;"/>
                        </div>    
                        <div class="col-xs-6" style="padding: 5px;">
                            <img src="" id="ocr_img2" alt="" style="max-width: 100%;"/>
                        </div>    
                    </div>    


                </div>





                <!--DE cliente-->
                <div id="de_cliente" class="tab-pane fade">

                    <div id="de_cl_det" style="display: block;">
                        <div class="row   ">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_de_pais">País:</span>
                                <select id="de_cl_pais" class="form-control form-cli form-cli1">
                                    <option value=""></option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_natureza">Natureza:</span>
                                <select id="de_cl_nat" class="form-control form-cli form-cli1" >
                                    <option value="2">No Contribuyente</option>
                                    <option value="1">Contribuyente</option>
                                </select>
                            </div>
                        </div>
                        <div class="row ">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_tipo_ope">Tipo Operación:</span>
                                <select id="de_cl_tipo_ope" class="form-control form-cli form-cli1" >
                                    <option value="2">B2C-Consumidor</option>
                                    <option value="1">B2B-Comercio</option>
                                    <option value="3">B2G-Governo</option>
                                    <option value="4">B2F-Exterior</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_tipo_con">Tipo Contrib.:</span>
                                <select id="de_cl_con" class="form-control form-cli form-cli1" >
                                    <option value="1">Física</option>
                                    <option value="2">Jurídica</option>
                                </select>
                            </div>
                        </div>
                        <div class="row   " id="de_ruc">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_de_cep">RUC:</span>
                                <input type="number" name="de_cl_ruc" id="de_cl_ruc" class="form-control text-left form-cli form-cli1" value="" data-mask="0000000000">
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_de_cep">Nombre:</span>
                                <input type="text" name="de_cl_nome" id="de_cl_nome" class="form-control text-left form-cli form-cli1" value="" style="text-transform: uppercase">
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_de_fantasia">Fantasia:</span>
                                <input type="text" name="de_cl_fantasia" id="de_cl_fantasia" class="form-control text-left form-cli form-cli1" value="" style="text-transform: uppercase">
                            </div>
                        </div>


                        <div class="row   " id="de_c_cep">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_de_cep">CEP:</span>
                                <input type="number" name="de_cep" id="de_cl_cep" class="form-control text-left form-cli form-cli1" value="" data-mask="00000000">
                            </div>
                        </div>
                        <div class="row   ">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_de_cidade">Cidade:</span>
                                <input type="text" name="de_cidade" id="de_cl_cidade" class="form-control text-left form-cli form-cli1" value="" size="30" maxlength="30"  style="text-transform: uppercase">
                                <input type="hidden" name="de_cl_cidade_num" id="de_cl_cidade_num">
                            </div>
                        </div>
                        <div class="row   ">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_de_uf">Estado:</span>
                                <input type="text" name="de_estado" id="de_cl_estado" class="form-control text-left form-cli form-cli1" value="" size="30" maxlength="30"  style="text-transform: uppercase">
                            </div>
                        </div>
                        <div class="row   " id="de_c_ende">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_de_endereco">Endereço:</span>
                                <input type="text" name="de_endereco" id="de_cl_endereco" class="form-control text-left form-cli form-cli1" value="" size="40" maxlength="40"  style="text-transform: uppercase">
                            </div>
                        </div>
                        <div class="row   " id="de_c_comp">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_de_numero">Número:</span>
                                <input type="text" name="de_numero" id="de_cl_numero" class="form-control text-left form-cli form-cli1" value="" size="10" maxlength="10"  style="text-transform: uppercase">
                            </div>
                        </div>
                        <div class="row   " id="de_c_bair">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_de_bairro">Bairro:</span>
                                <input type="text" name="de_bairro" id="de_cl_bairro" class="form-control text-left form-cli form-cli1" value="" size="15" maxlength="15"  style="text-transform: uppercase">
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_tip_doc">Tipo Doc:</span>
                                <select id="de_cl_tip_doc" class="form-control form-cli form-cli1" >
                                    <option value="1">Cédula paraguaya</option>                         
                                    <option value="3">Cédula extranjera</option>
                                    <option value="2">Pasaporte</option>
                                    <option value="4">Carnet de residencia</option>
                                    <option value="5">Innominado</option>                               
                                    <option value="6">Tarjeta Diplomática de exoneración fiscal</option>
                                </select>
                            </div>
                        </div>
                        <div class="row   ">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_de_doc">Documento:</span>
                                <input type="text" name="de_documento" id="de_cl_documento" class="form-control text-left form-cli form-cli1" value="" size="30" maxlength="30"  style="text-transform: uppercase">
                            </div>
                        </div>
                        <div class="row   ">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_de_doc">CPF:</span>
                                <input type="number" name="de_cpf" id="de_cl_cpf" class="form-control text-left form-cli form-cli1" value=""    data-mask="00000000000">
                            </div>
                        </div>
                        <div class="row   " id="de_c_tele">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_de_fone">Fone:</span>
                                <input type="tel" name="de_fone" id="de_cl_fone" class="form-control text-left form-cli form-cli1" value="" size="20" maxlength="20" data-mask="0000000000000000000" >
                            </div>
                        </div>
                        <div class="row   " id="de_c_celu">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_de_cel">Cel:</span>
                                <input type="tel" name="de_celular" id="de_cl_celular" class="form-control text-left form-cli form-cli1" value="" size="15" maxlength="15" data-mask="000000000000000" >
                            </div>
                        </div>



                        <div class="row " id="c_emai">
                            <div class="input-group">
                                <span class="input-group-addon form-cli form-cli1" id="id_email">Email:</span>
                                <input type="text" name="de_cl_mail" id="de_cl_mail" class="form-control text-left form-cli form-cli1" value="" size="30" maxlength="40" style="text-transform:lowercase ">
                            </div>
                        </div>







                        <div class="row   ">
                            &nbsp;
                        </div>
                        <div class="row ">
                            <div id="de_cl_incluir" >
                                <span class="input-group-btn text-center form-cli">
                                    <button id="de_cl_btsalvar_inc" class="btn btn-success" >
                                        <span class="glyphicon glyphicon-save form-cli" id="id_de_save888">Salvar</span>
                                    </button>
                                </span>
                            </div>

                        </div>

                        <div class="row " id="cl_cl_cedula">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1  ctirarfoto" id="cl_id_ced1">Cédula Frente:</span>
                                <button class="btn btn-success" type="button" id="cl_cl_frente">
                                    <i class="fa fa-user-times form-cli" ></i>
                                </button>
                                <div class="hidden" id="cl_cl_capturaF"> 
                                    <button class="btn btn-primary" onclick="tirarFoto('F', 'cl_')">Capturar</button>
                                    <button class="btn btn-warning" onclick="CancelarFoto()">Cancelar</button>
                                    <canvas class="hidden" id="cl_canvasF" width="600" height="400"></canvas>
                                </div>
                                <div class="hidden" id="cl_cl_dvideoF">
                                    <video id="cl_videoF" class="videoCamera" autoplay playsinline></video>
                                </div>


                                <span class="input-group-addon form-cli form-cli1 ctirarfoto" id="cl_id_ced2">Verso:</span>
                                <button class="btn btn-success" type="button" id="cl_cl_verso">
                                    <i class="fa fa-user-times form-cli" ></i>
                                </button>
                                <div class="hidden" id="cl_cl_capturaV"> 
                                    <button class="btn btn-primary" onclick="tirarFoto('V', 'cl_')">Capturar</button>
                                    <button class="btn btn-warning" onclick="CancelarFoto()">Cancelar</button>
                                    <canvas class="hidden" id="cl_canvasV" width="600" height="400"></canvas>
                                </div>
                                <div class="hidden" id="cl_cl_dvideoV">
                                    <video id="cl_videoV" class="videoCamera" autoplay playsinline></video>
                                </div>



                            </div>
                        </div>

                        <div id="cl_dfoto">
                            <div class="row ">
                                <h3><span id="id_foto21412fdsf">Foto do RG - Frente</span></h3>
                            </div>
                            <div class="row ">
                                <span class="text-center">
                                    <img src="img/frente.png" style="width: 80%;height: auto;" id="cl_ft_1" >
                                </span>
                            </div>
                            <div class="row ">
                                <hr>
                            </div>

                            <div class="row ">
                                <h3><span id="id_foto8980d9">Foto do RG - Verso</span></h3>
                            </div>
                            <div class="row ">
                                <span class="text-center">
                                    <img src="img/verso.png" style=" width: 80%;height: auto;" id="cl_ft_2">
                                </span>
                            </div>
                        </div>


                    </div>


                </div>


                <!--cliente-->
                <div id="cliente" class="tab-pane fade">
                    <div class="row  alert alert-danger text-center" id="cl_bloq">
                        <strong><span id="id_cliente_blo">CLIENTE BLOQUEADO</span></strong>
                    </div>
                    <div class="row   ">
                        <div class="input-group" >
                            <span class="input-group-addon form-cli form-cli1" id="id_codigo">Código:</span>
                            <input type="number" name="codigo" id="cl_codigo" class="form-control text-left form-cli form-cli1" value="" >
                            <span class="input-group-btn">
                                <button class="btn btn-success" type="button" id="cl_buscar_cod">
                                    <i class="fa fa-search form-cli"></i>
                                </button>
                            </span>    
                        </div>
                    </div>
                    <div class="row   ">
                        <div class="input-group" >
                            <span class="input-group-addon form-cli form-cli1" id="id_rg">RG:</span>
                            <input type="text" name="rg" id="cl_rg" class="form-control text-left form-cli form-cli1" value="" size="15" maxlength="15" data-mask="AAAAAAAAAAAAAAA" style="text-transform: uppercase">
                        </div>
                        <div class="input-group" >
                            <span class="input-group-addon form-cli form-cli1" id="id_cpf">CPF:</span>
                            <input type="number" name="cl_cpf" id="cl_cpf" class="form-control text-left form-cli form-cli1" value=""  data-mask="99999999999" >
                        </div>
                    </div>
                    <div class="row ">
                        <div class="input-group" >
                            <span class="input-group-addon form-cli form-cli1" id="id_nome">Nome:</span>
                            <input type="text" name="nome" id="cl_nome" class="form-control text-left form-cli form-cli1" value="" size="30" maxlength="40"   style="text-transform: uppercase">
                        </div>
                    </div>
                    <div class="row " id="c_emai">
                        <div class="input-group">
                            <span class="input-group-addon form-cli form-cli1" id="id_email">Email:</span>
                            <input type="text" name="mail" id="cl_mail" class="form-control text-left form-cli form-cli1" value="" size="30" maxlength="40" style="text-transform:lowercase ">
                        </div>
                    </div>




                    <div id="cl_det" style="display: block;">
                        <!--
                        <div class="row " id="c_emai">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1">Email:</span>
                                <input type="text" name="mail" id="cl_mail" class="form-control text-left form-cli form-cli1" value="" size="45" maxlength="45" 
                                       style="text-transform:lowercase ">
                            </div>
                        </div>
                        <div class="row   ">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1">Nome:</span>
                                <input type="text" name="nome" id="cl_nome" class=" form-cli form-cli1 form-control text-left" value="" size="30" maxlength="40"  style="text-transform: uppercase">
                            </div>
                        </div>
                        -->
                        <div class="row   " id="c_nasc">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_nasc">Nasc:</span>
                                <input type="date" name="nasc" id="cl_nasc" class="form-control text-left form-cli form-cli1" value="" size="10" maxlength="10"  >
                            </div>
                        </div>
                        <div class="row   " id="c_sexo">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_sexo">Sexo:</span>
                                <div class="form-control form-cli form-cli1">
                                    <input type="radio" name="sexo" id="cl_sexo_m" checked> <label for="cl_sexo_m" ><span id="id_masc">Masculino</span></label>
                                    <input type="radio" name="sexo" id="cl_sexo_f" > <label for="cl_sexo_f"><span  id="id_femi">Feminino</span></label>
                                    <input type="radio" name="sexo" id="cl_sexo_o" > <label for="cl_sexo_o"><span  id="id_outr">Outros</span></label>
                                </div>
                            </div>
                        </div>
                        <div class="row   ">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_pais">País:</span>
                                <select id="cl_pais" class="form-control form-cli form-cli1">

                                    <option value=""></option>
                                    <option value="BRA">Brasil</option>
                                    <option value="PRY">Paraguai</option>
                                    <option value="ARG">Argentina</option>
                                    <option value="AFG">Afeganistão</option>
                                    <option value="ZAF">África do Sul</option>
                                    <option value="ALB">Albânia</option>
                                    <option value="DEU">Alemanha</option>
                                    <option value="AND">Andorra</option>
                                    <option value="AGO">Angola</option>
                                    <option value="AIA">Anguilla</option>
                                    <option value="ATG">Antígua e Barbuda</option>
                                    <option value="SAU">Arábia Saudita</option>
                                    <option value="DZA">Argélia</option>
                                    <option value="ARM">Armênia</option>
                                    <option value="ABW">Aruba</option>
                                    <option value="AUS">Austrália</option>
                                    <option value="AUT">Áustria</option>
                                    <option value="AZE">Azerbaijão</option>
                                    <option value="BHS">Bahamas</option>
                                    <option value="BGD">Bangladesh</option>
                                    <option value="BRB">Barbados</option>
                                    <option value="BHR">Barein</option>
                                    <option value="BEL">Bélgica</option>
                                    <option value="BLZ">Belize</option>
                                    <option value="BEN">Benin</option>
                                    <option value="BMU">Bermuda</option>
                                    <option value="BLR">Bielorússia</option>
                                    <option value="BOL">Bolívia</option>
                                    <option value="BES">Bonaire, Santo Eustáquio e Saba</option>
                                    <option value="BIH">Bósnia-Herzegovina</option>
                                    <option value="BWA">Botsuana</option>
                                    <option value="BRN">Brunei</option>
                                    <option value="BGR">Bulgária</option>
                                    <option value="BFA">Burkina Faso</option>
                                    <option value="BDI">Burundi</option>
                                    <option value="BTN">Butão</option>
                                    <option value="CPV">Cabo Verde</option>
                                    <option value="CMR">Camarões</option>
                                    <option value="KHM">Camboja</option>
                                    <option value="CAN">Canadá</option>
                                    <option value="KAZ">Casaquistão</option>
                                    <option value="QAT">Catar</option>
                                    <option value="TCD">Chade</option>
                                    <option value="CHL">Chile</option>
                                    <option value="CHN">China</option>
                                    <option value="HKG">China, Hong Kong</option>
                                    <option value="MAC">China, Macao</option>
                                    <option value="CYP">Chipre</option>
                                    <option value="SGP">Cingapura</option>
                                    <option value="COL">Colômbia</option>
                                    <option value="COM">Comores</option>
                                    <option value="COG">Congo</option>
                                    <option value="PRK">Coréia do Norte</option>
                                    <option value="KOR">Coréia do Sul</option>
                                    <option value="CIV">Costa do Marfim</option>
                                    <option value="CRI">Costa Rica</option>
                                    <option value="HRV">Croácia</option>
                                    <option value="CUB">Cuba</option>
                                    <option value="CUW">Curaçao</option>
                                    <option value="DNK">Dinamarca</option>
                                    <option value="DJI">Djibouti</option>
                                    <option value="DMA">Dominica</option>
                                    <option value="EGY">Egito</option>
                                    <option value="SLV">El Salvador</option>
                                    <option value="ARE">Emirados Árabes Unidos</option>
                                    <option value="ECU">Equador</option>
                                    <option value="ERI">Eritréia</option>
                                    <option value="SVK">Eslováquia</option>
                                    <option value="SVN">Eslovênia</option>
                                    <option value="ESP">Espanha</option>
                                    <option value="USA">Estados Unidos da América</option>
                                    <option value="EST">Estônia</option>
                                    <option value="ETH">Etiópia</option>
                                    <option value="FJI">Fiji</option>
                                    <option value="PHL">Filipinas</option>
                                    <option value="FIN">Finlândia</option>
                                    <option value="FRA">França</option>
                                    <option value="GAB">Gabão</option>
                                    <option value="GMB">Gâmbia</option>
                                    <option value="GHA">Gana</option>
                                    <option value="GEO">Geórgia</option>
                                    <option value="GIB">Gibraltar</option>
                                    <option value="GRD">Granada</option>
                                    <option value="GRC">Grécia</option>
                                    <option value="GRL">Groenlândia</option>
                                    <option value="GUM">Guam</option>
                                    <option value="GTM">Guatemala</option>
                                    <option value="GGY">Guernsey</option>
                                    <option value="GUY">Guiana</option>
                                    <option value="GUF">Guiana Francesa</option>
                                    <option value="GIN">Guiné</option>
                                    <option value="GNQ">Guiné Equatorial</option>
                                    <option value="GNB">Guiné-Bissau</option>
                                    <option value="HTI">Haiti</option>
                                    <option value="NLD">Holanda</option>
                                    <option value="HND">Honduras</option>
                                    <option value="HUN">Hungria</option>
                                    <option value="YEM">Iêmen</option>
                                    <option value="IMN">Ilha de Man</option>
                                    <option value="GLP">Ilha Guadalupe</option>
                                    <option value="NFK">Ilha Norfolk</option>
                                    <option value="REU">Ilha Reunião</option>
                                    <option value="ALA">Ilhas Alanda</option>
                                    <option value="CYM">Ilhas Cayman</option>
                                    <option value="COK">Ilhas Cook</option>
                                    <option value="">Ilhas do Canal</option>
                                    <option value="FRO">Ilhas Faeroe</option>
                                    <option value="FLK">Ilhas Falkland</option>
                                    <option value="MNP">Ilhas Marianas</option>
                                    <option value="MHL">Ilhas Marshall</option>
                                    <option value="SLB">Ilhas Salomão</option>
                                    <option value="TCA">Ilhas Turks e Caicos</option>
                                    <option value="VIR">Ilhas Virgens</option>
                                    <option value="VGB">Ilhas Virgens Britânicas</option>
                                    <option value="WLF">Ilhas Wallis e Futuna</option>
                                    <option value="IND">Índia</option>
                                    <option value="IDN">Indonésia</option>
                                    <option value="IRN">Irã</option>
                                    <option value="IRQ">Iraque</option>
                                    <option value="IRL">Irlanda</option>
                                    <option value="ISL">Islândia</option>
                                    <option value="ISR">Israel</option>
                                    <option value="ITA">Itália</option>
                                    <option value="JAM">Jamaica</option>
                                    <option value="JPN">Japão</option>
                                    <option value="JEY">Jersey</option>
                                    <option value="JOR">Jordânia</option>
                                    <option value="KIR">Kiribati</option>
                                    <option value="KWT">Kuwait</option>
                                    <option value="LAO">Laos</option>
                                    <option value="LSO">Lesoto</option>
                                    <option value="LVA">Letônia</option>
                                    <option value="LBN">Líbano</option>
                                    <option value="LBR">Libéria</option>
                                    <option value="LBY">Líbia</option>
                                    <option value="LIE">Liechtenstein</option>
                                    <option value="LTU">Lituânia</option>
                                    <option value="LUX">Luxemburgo</option>
                                    <option value="MKD">Macedônia</option>
                                    <option value="MDG">Madagáscar</option>
                                    <option value="MYS">Malásia</option>
                                    <option value="MWI">Malauí</option>
                                    <option value="MDV">Maldivas</option>
                                    <option value="MLI">Mali</option>
                                    <option value="MLT">Malta</option>
                                    <option value="MAR">Marrocos</option>
                                    <option value="MTQ">Martinica</option>
                                    <option value="MUS">Maurício</option>
                                    <option value="MRT">Mauritânia</option>
                                    <option value="MYT">Mayotte</option>
                                    <option value="MEX">México</option>
                                    <option value="MMR">Mianma</option>
                                    <option value="FSM">Micronésia</option>
                                    <option value="MOZ">Moçambique</option>
                                    <option value="MDA">Moldávia</option>
                                    <option value="MCO">Mônaco</option>
                                    <option value="MNG">Mongólia</option>
                                    <option value="MNE">Montenegro</option>
                                    <option value="MSR">Montserrat</option>
                                    <option value="NAM">Namíbia</option>
                                    <option value="NRU">Nauru</option>
                                    <option value="NPL">Nepal</option>
                                    <option value="NIC">Nicarágua</option>
                                    <option value="NER">Níger</option>
                                    <option value="NGA">Nigéria</option>
                                    <option value="NIU">Niue</option>
                                    <option value="NOR">Noruega</option>
                                    <option value="NCL">Nova Caledônia</option>
                                    <option value="NZL">Nova Zelândia</option>
                                    <option value="OMN">Omã</option>
                                    <option value="PLW">Palau</option>
                                    <option value="PSE">Palestina</option>
                                    <option value="PAN">Panamá</option>
                                    <option value="PNG">Papua Nova Guiné</option>
                                    <option value="PAK">Paquistão</option>
                                    <option value="PER">Peru</option>
                                    <option value="PCN">Pitcairn</option>
                                    <option value="PYF">Polinésia Francesa</option>
                                    <option value="POL">Polônia</option>
                                    <option value="PRI">Porto Rico</option>
                                    <option value="PRT">Portugal</option>
                                    <option value="KEN">Quênia</option>
                                    <option value="KGZ">Quirguistão</option>
                                    <option value="GBR">Reino Unido</option>
                                    <option value="CAF">República Centro Africana</option>
                                    <option value="COD">República Democrática do Congo</option>
                                    <option value="DOM">República Dominicana</option>
                                    <option value="CZE">República Tcheca</option>
                                    <option value="ROU">Romênia</option>
                                    <option value="RWA">Ruanda</option>
                                    <option value="RUS">Rússia (Federação Russa)</option>
                                    <option value="ESH">Saara Ocidental</option>
                                    <option value="MAF">Saint Martin (parte francesa)</option>
                                    <option value="SXM">Saint Martin (parte holandesa)</option>
                                    <option value="SPM">Saint Pierre e Miquelon</option>
                                    <option value="WSM">Samoa</option>
                                    <option value="ASM">Samoa Americana</option>
                                    <option value="SMR">San Marino</option>
                                    <option value="SHN">Santa Helena</option>
                                    <option value="LCA">Santa Lúcia</option>
                                    <option value="BLM">São Bartolomeu</option>
                                    <option value="KNA">São Cristóvão e Nevis</option>
                                    <option value="STP">São Tome e Príncipe</option>
                                    <option value="VCT">São Vicente e Granadinas</option>
                                    <option value=" ">Sark</option>
                                    <option value="SYC">Seichelles</option>
                                    <option value="SEN">Senegal</option>
                                    <option value="SLE">Serra Leoa</option>
                                    <option value="SRB">Sérvia</option>
                                    <option value="SYR">Síria</option>
                                    <option value="SOM">Somália</option>
                                    <option value="LKA">Sri Lanka</option>
                                    <option value="SWZ">Suazilândia</option>
                                    <option value="SSD">Sudão do Sul</option>
                                    <option value="SDN">Sudão</option>
                                    <option value="SWE">Suécia</option>
                                    <option value="CHE">Suíça</option>
                                    <option value="SUR">Suriname</option>
                                    <option value="SJM">Svalbard e Jan Mayen Islands</option>
                                    <option value="TJK">Tadjiquistão</option>
                                    <option value="THA">Tailândia</option>
                                    <option value="TZA">Tanzânia</option>
                                    <option value="TLS">Timor Leste</option>
                                    <option value="TGO">Togo</option>
                                    <option value="TKL">Tokelau</option>
                                    <option value="TON">Tonga</option>
                                    <option value="TTO">Trinidad e Tobago</option>
                                    <option value="TUN">Tunísia</option>
                                    <option value="TKM">Turcomenistão</option>
                                    <option value="TUR">Turquia</option>
                                    <option value="TUV">Tuvalu</option>
                                    <option value="UKR">Ucrânia</option>
                                    <option value="UGA">Uganda</option>
                                    <option value="URY">Uruguai</option>
                                    <option value="UZB">Uzbequistão</option>
                                    <option value="VUT">Vanuatu</option>
                                    <option value="VAT">Vaticano</option>
                                    <option value="VEN">Venezuela</option>
                                    <option value="VNM">Vietnã</option>
                                    <option value="ZMB">Zâmbia</option>
                                    <option value="ZWE">Zimbábue</option>

                                </select>
                            </div>
                        </div>
                        <div class="row   " id="c_cep">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_cep">CEP:</span>
                                <input type="number" name="cep" id="cl_cep" class="form-control text-left form-cli form-cli1" value="" data-mask="00000000">
                            </div>
                        </div>
                        <div class="row   " id="c_ende">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_endereco">Endereço:</span>
                                <input type="text" name="endereco" id="cl_endereco" class="form-control text-left form-cli form-cli1" value="" size="40" maxlength="40"  style="text-transform: uppercase">
                            </div>
                        </div>
                        <div class="row   " id="c_comp">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" >Compl:</span>
                                <input type="text" name="complemento" id="cl_complemento" class="form-control text-left form-cli form-cli1" value="" size="20" maxlength="20"  style="text-transform: uppercase">
                            </div>
                        </div>
                        <div class="row   " id="c_bair">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_bairro">Bairro:</span>
                                <input type="text" name="bairro" id="cl_bairro" class="form-control text-left form-cli form-cli1" value="" size="15" maxlength="15"  style="text-transform: uppercase">
                            </div>
                        </div>
                        <div class="row " id="c_uf">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_uf">Uf:</span>
                                <select id="cl_uf" class="form-control form-cli form-cli1" >

                                    <option value=""></option>
                                    <option value="AC">AC-Acre</option>                   
                                    <option value="AL">AL-Alagoas</option>                   
                                    <option value="AM">AM-Amazonas</option>                   
                                    <option value="AP">AP-Amapá</option>                   
                                    <option value="BA">BA-Baia</option>                   
                                    <option value="CE">CE-Ceará</option>                   
                                    <option value="DF">DF-Distrito Federal</option>                   
                                    <option value="ES">ES-Espírito Santo</option>                   
                                    <option value="GO">GO-Goais</option>                   
                                    <option value="MA">MA-Maranhão</option>                   
                                    <option value="MG">MG-Minas Gerais</option>                   
                                    <option value="MS">MS-Mato Grosso do Sul</option>                   
                                    <option value="MT">MT-Mato Grosso</option>                   
                                    <option value="PA">PA-Pará</option>                   
                                    <option value="PB">PB-Paraiba</option>                   
                                    <option value="PE">PE-Pernambuco</option>                   
                                    <option value="PI">PI-Piau[i</option>                   
                                    <option value="PR">PR-Paraná</option>                   
                                    <option value="RJ">RJ-Rio de Janeiro</option>                   
                                    <option value="RN">RN-Rio Grande do Norte</option>                   
                                    <option value="RO">RO-Rondônia</option>                   
                                    <option value="RR">RR-Roraima</option>                   
                                    <option value="RS">RS-Rio Grande do Sul</option>                   
                                    <option value="SC">SC-Santa Catarina</option>                   
                                    <option value="SE">SE-Sergipe</option>                   
                                    <option value="SP">SP-São Paulo</option>                   
                                    <option value="TO">TO-Tocantis</option>                   

                                </select>
                            </div>
                        </div>
                        <div class="row   ">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_cidade">Cidade:</span>
                                <input type="text" name="cidade" id="cl_cidade" class="form-control text-left form-cli form-cli1" value="" size="30" maxlength="30"  style="text-transform: uppercase">
                            </div>
                        </div>
                        <div class="row   " id="c_tele">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_fone">Fone:</span>
                                <input type="tel" name="telefone" id="cl_telefone" class="form-control text-left form-cli form-cli1" value="" size="15" maxlength="15" data-mask="+000(000) 00000-0000" >
                            </div>
                        </div>
                        <div class="row   " id="c_celu">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_cel">Cel:</span>
                                <input type="tel" name="celular" id="cl_celular" class="form-control text-left form-cli form-cli1" value="" size="15" maxlength="15" data-mask="+000(000) 00000-0000" >
                            </div>
                        </div>
                        <div class="row   " id="c_what">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_whats">Whats:</span>
                                <input type="tel" name="whats" id="cl_whats" class="form-control text-left form-cli form-cli1" value="" size="15" maxlength="15" data-mask="+000(000) 00000-0000" >
                            </div>
                        </div>
                        <div  class="hidden">
                            <div class="row   " id="c_preferencial">
                                <div class="input-group" >
                                    <span class="input-group-addon form-cli form-cli1 prefer" id="id_pref_ace">Preferencial:</span><div class="form-control form-cli form-cli1">  
                                        <input type="checkbox" name="preferencial" id="cl_preferencial" ></div>
                                </div>
                            </div>
                            <div id="c_form_preferencial" class="hidden">
                                <div class="row   " id="c_tipo">
                                    <div class="input-group" >
                                        <span class="input-group-addon form-cli form-cli1 prefer" id="id_tipo" >Tipo:</span>

                                        <div class="form-control form-cli form-cli1">
                                            <input type="radio" name="tipo" id="cl_tipo_v" checked> <label for="cl_tipo_v" ><span id="id_masc">Varejo</span></label>
                                            <input type="radio" name="tipo" id="cl_tipo_a" > <label for="cl_tipo_a"><span  id="id_femi">Atacado</span></label>
                                            <input type="radio" name="tipo" id="cl_tipo_i" > <label for="cl_tipo_i"><span  id="id_indi">Indicador</span></label>
                                        </div>
                                    </div>
                                </div>
                                <div class="row   " id="c_zona">
                                    <div class="input-group" >
                                        <span class="input-group-addon form-cli form-cli1 prefer" id="id_zona">Zona:</span>
                                        <select id="cl_zona" class="form-control form-cli form-cli1">

                                            <option value=""></option>
                                            <option value="1">Geral</option>

                                        </select>
                                    </div>
                                </div>
                                <div class="row   " id="c_marca">
                                    <div class="input-group" >
                                        <span class="input-group-addon prefer" id="id_zona">Marca:</span>
                                        <div class="form-control ">      
                                            <span class="glyphicon glyphicon-chevron-down" id="cl_marca_down"></span>
                                        </div>
                                        <span class="input-group-addon prefer" id="id_grupo">Categoria:</span>
                                        <div class="form-control ">      
                                            <span class="glyphicon glyphicon-chevron-down" id="cl_grupo_down"></span>
                                        </div>
                                    </div>
                                </div>


                                <div class="row   " id="c_publ">
                                    <div class="input-group" >
                                        <span class="input-group-addon form-cli form-cli1" id="id_mail_ace">Aceita Publ p/ Email:</span><div class="form-control form-cli form-cli1">  

                                            <input type="checkbox" name="publicidade" id="cl_publicidade" ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row " id="cl_cedula">
                        <div class="input-group" >
                            <span class="input-group-addon form-cli form-cli1 ctirarfoto" id="id_ced1">Cédula Frente:</span>
                            <button class="btn btn-success ctirarfoto" type="button" id="cl_frente">
                                <i class="fa fa-user-times form-cli" ></i>
                            </button>
                            <div class="hidden" id="cl_capturaF"> 
                                <button class="btn btn-primary" onclick="tirarFoto('F', '')">Capturar</button>
                                <button class="btn btn-warning" onclick="CancelarFoto()">Cancelar</button>
                                <canvas class="hidden" id="canvasF" width="600" height="400"></canvas>
                            </div>
                            <!--
                            <div class="hidden" id="cl_dvideoF">
                                <video id="videoF" width="600" autoplay></video>
                            </div>
                            -->
                            <div class="hidden" id="cl_dvideoF">
                                <video id="videoF" class="videoCamera" autoplay playsinline></video>
                            </div>

                            <span class="input-group-addon form-cli form-cli1 ctirarfoto" id="id_ced2">Verso:</span>
                            <button class="btn btn-success" type="button" id="cl_verso">
                                <i class="fa fa-user-times form-cli" ></i>
                            </button>
                            <div class="hidden" id="cl_capturaV"> 
                                <button class="btn btn-primary" onclick="tirarFoto('V', '')">Capturar</button>
                                <button class="btn btn-warning" onclick="CancelarFoto()">Cancelar</button>
                                <canvas class="hidden" id="canvasV" width="600" height="400"></canvas>
                            </div>
                            <div class="hidden" id="cl_dvideoV">
                                <video id="videoV" class="videoCamera" autoplay playsinline></video>
                            </div>



                        </div>
                    </div>
                    <div class="row   ">
                        &nbsp;
                    </div>
                    <div class="row ">
                        <div id="cl_incluir" style="display: none;">
                            <span class="input-group-btn text-center form-cli">
                                <button id="cl_btcancelari" class="btn btn-info" >
                                    <span class="glyphicon glyphicon-refresh form-cli" id="id_ic_inc">Cancelar</span>
                                </button>
                                &nbsp;&nbsp;
                                <button id="cl_btlimpar" class="btn btn-warning" >
                                    <span class="glyphicon glyphicon-refresh form-cli" id="id_ic_lim">Limpar</span>
                                </button>
                                &nbsp;&nbsp;
                                <button id="cl_btsalvar_inc" class="btn btn-success" >
                                    <span class="glyphicon glyphicon-save form-cli" id="id_save888">Salvar</span>
                                </button>
                            </span>
                        </div>
                        <div id="cl_alterar_ini" style="display: none;">
                            <span class="input-group-btn text-center form-cli">
                                <button id="cl_btalterar" class="btn btn-warning" >
                                    <span class="glyphicon glyphicon-save form-cli" id="id_alt324324">Alterar</span>
                                </button>
                            </span>
                        </div>
                        <div id="cl_alterar" style="display: none;">
                            <span class="input-group-btn text-center form-cli">
                                <button id="cl_btcancelara" class="btn btn-info" >
                                    <span class="glyphicon glyphicon-refresh form-cli" id="id_can9fi">Cancelar</span>
                                </button>
                                &nbsp;&nbsp;
                                <button id="cl_btsalvar_alt" class="btn btn-success" >
                                    <span class="glyphicon glyphicon-save form-cli" id="id_save133124">Salvar</span>
                                </button>
                            </span>
                        </div>


                        <div id="dfoto">
                            <div class="row ">
                                <h3><span id="id_foto21412">Fotos do RG - Frente</span></h3>
                            </div>
                            <div class="row ">
                                <span class="text-center">
                                    <img src="img/frente.png" style="width: 80%;height: auto;" id="ft_1" >
                                </span>
                            </div>
                            <div class="row ">
                                <hr>
                            </div>

                            <div class="row ">
                                <h3><span id="id_foto89809">Fotos do RG - Verso</span></h3>
                            </div>
                            <div class="row ">
                                <span class="text-center">
                                    <img src="img/verso.png" style=" width: 80%;height: auto;" id="ft_2">
                                </span>
                            </div>
                        </div>







                    </div>


                </div>

                <!--CaixaPix-->
                <div id="CaixaPix" class="tab-pane fade">
                    <div class="row well well-sm" >
                        <div class="input-group" >
                            <span class="input-group-addon form-cli form-cli1" id="id_cx_cli333">Conta:</span>
                            <select id="cx_conta" class="form-control form-cli form-cli1">
                                <option value="1">CAIXA</option>
                                <option value="2">CAIXA PIX</option>
                            </select>
                        </div>
                        <div class="input-group" >
                            <span class="input-group-addon form-cli form-cli1" id="id_cx_cli35">Histor.:</span>
                            <select id="cx_hist" class="form-control form-cli form-cli1">
                                <option value="1">hist1</option>
                                <option value="2">hist2</option>
                            </select>
                        </div>
                    </div>

                    <div class="row" id="cx_row_banco">
                        <div class="input-group" >
                            <span class="input-group-addon form-cli form-cli1" id="id_cx_cli56">Banco:</span>
                            <select id="cx_banco" class="form-control form-cli form-cli1">
                                <option value="1">PIX CRASIL</option>
                                <option value="2">PIX DRASIL</option>
                            </select>
                        </div>
                    </div>
                    <div class="row" id="cx_row_cliente">
                        <div class="input-group" >
                            <span class="input-group-addon form-cli form-cli1" id="id_cx_cli82">Cli/Nota:</span>
                            <input type="text" name="cx_ccliente" id="cx_ccliente" class="form-control text-left form-cli form-cli1" value="" size="20" maxlength="20"  style="text-transform: uppercase">
                            <span class="input-group-btn">
                                <button class="btn btn-warning" type="button" id="cx_buscar_cliente_limpar">
                                    <i class="fa fa-rotate-left form-cli"></i>
                                </button>
                            </span>    
                            <span class="input-group-btn">
                                <button class="btn btn-success" type="button" id="cx_buscar_cliente">
                                    <i class="fa fa-search form-cli"></i>
                                </button>
                            </span>    
                        </div>
                        <div class="input-group" >
                            <select id="cx_notas_sel" class="form-control form-cli form-cli1">
                            </select>
                        </div>
                    </div>
                    <div class="row" id="cx_row_nota">
                        <table class="table">
                            <tr>
                                <th class="text-left">Nota</th>
                                <th class="text-center">Cliente</th>
                                <th class="text-right">Valor</th>
                                <th></th>
                            </tr>
                            <tr>
                                <td class="text-left">1234657</td>
                                <td class="text-center">2223</td>
                                <td class="text-right">333,00</td>
                                <td class="text-center"><span class="glyphicon glyphicon-trash text-danger"></span></td>
                            </tr>
                            <tr>
                                <td class="text-left">1234657</td>
                                <td class="text-center">2223</td>
                                <td class="text-right">333,00</td>
                                <td class="text-center"><span class="glyphicon glyphicon-trash text-danger"></span></td>
                            </tr>
                            <tr>
                                <td class="text-left">1234657</td>
                                <td class="text-center">2223</td>
                                <td class="text-right">333,00</td>
                                <td class="text-center"><span class="glyphicon glyphicon-trash text-danger"></span></td>
                            </tr>
                        </table>
                    </div>
                    <div id="cx_row_total">
                        <div class="row">
                            <div class="col-xs-2">
                            </div>
                            <div class="col-xs-5 text-center">
                                <span class="form-cli form-cli1" id="id_cx_cli12">Total Notas:</span>
                            </div>
                            <div class="col-xs-5 text-center">
                                <span class="form-cli form-cli1" id="id_cx_cli49">Total+%:</span>
                            </div>
                        </div>
                        <div class="row" id="cx_row_m1">
                            <div class="col-xs-2 text-center">
                                <img id="cx_m1" src="img/usa.png" height="30" alt=""/>
                            </div>
                            <div class="col-xs-5 text-right bg-info">
                                <span id="cx_notas1" class="form-cli form-cli1"></span>
                            </div>
                            <div class="col-xs-5 text-right bg-info" id="cx_total_1">
                                <span id="cx_total1" class="form-cli form-cli1">1650,00 </span>
                            </div>
                        </div>
                        <div class="row" id="cx_row_m2">
                            <div class="col-xs-2 text-center">
                                <img id="cx_m2" src="img/usa.png" height="30" alt="" />
                            </div>
                            <div class="col-xs-5 text-right bg-info">
                                <span id="cx_notas2" class="form-cli form-cli1"></span>
                            </div>
                            <div class="col-xs-5 text-right bg-info" id="cx_total_2">
                                <span id="cx_total2" class="form-cli form-cli1">1650,00 </span>
                            </div>
                        </div>
                        <div class="row" id="cx_row_m3">
                            <div class="col-xs-2 text-center">
                                <img id="cx_m3" src="img/usa.png" height="30" alt="" />
                            </div>
                            <div class="col-xs-5 text-right bg-info">
                                <span id="cx_notas3" class="form-cli form-cli1"></span>
                            </div>
                            <div class="col-xs-5 text-right bg-info" id="cx_total_3">
                                <span id="cx_total3" class="form-cli form-cli1">1650,00 </span>
                            </div>
                        </div>
                        <div class="row" id="cx_row_m4">
                            <div class="col-xs-2 text-center">
                                <img id="cx_m4" src="img/usa.png" height="30" alt=""/>
                            </div>
                            <div class="col-xs-5 text-right bg-info">
                                <span id="cx_notas4" class="form-cli form-cli1"></span>
                            </div>
                            <div class="col-xs-5 text-right bg-info" id="cx_total_4">
                                <span id="cx_total4" class="form-cli form-cli1">1650,00 </span>
                            </div>
                        </div>
                    </div>
                    <div class="row" id="cx_row_finalizar">
                        <div class="input-group" >
                            <span class="input-group-addon form-cli form-cli1" id="id_cx_cli0">Documento:</span>
                            <input type="text" name="cx_documento" id="cx_documento" class="form-control text-left form-cli form-cli1" value="" size="10" maxlength="10"  style="text-transform: uppercase">
                        </div>
                    </div>
                    <div id="cx_row_finalizar_tar">
                        <div class="row" >
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_cx_ccli0">Tipo Cartão:</span>
                                <div class="form-control form-cli form-cli1">
                                    <input type="radio"  name="cx_tar_tipo" id="cx_tar_tipo_deb" value="D" checked /><label for="cx_tar_tipo_deb" id='cx_tar_tipo_deb_l'><span id="id_cx_31234">Débito</span> </label>
                                    <input type="radio"  name="cx_tar_tipo" id="cx_tar_tipo_cre" value="C" /><label for="cx_tar_tipo_cre" id='cx_tar_tipo_cre_l'><span id="id_cx_31b234">Crédito</span> </label>
                                </div>
                            </div>
                        </div>
                        <div class="row" >
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_cx_clci56">Bandeira:</span>
                                <select id="cx_tar_bandeira" class="form-control form-cli form-cli1">
                                    <option value="0" selected="">Escolha a Bandeira</option>
                                    <option value="1">Visa</option>
                                    <option value="2">Mastercad</option>
                                    <option value="3">American Express</option>
                                    <option value="4">Maestro</option>
                                    <option value="5">Panal</option>
                                    <option value="6">Cabal</option>
                                    <option value="99">Outro</option>
                                </select>
                            </div>
                        </div>
                        <div class="row" id="cx_tar_outro">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_cx_clcie56">Outra Band:</span>
                                <input type="text" name="cx_tar_bandeira_outro" id="cx_tar_bandeira_outro" class="form-control text-left form-cli form-cli1" value="" size="10" maxlength="20"  style="text-transform: uppercase">
                            </div>
                        </div>
                    </div>
                    <div id="cx_row_finalizar1">
                        <div class="row text-center">
                            &nbsp;
                        </div>
                        <div class="row text-center">
                            <span class="input-group-btn">
                                <button class="btn btn-success" type="button" id="cx_finalizar">
                                    <span class="glyphicon glyphicon-download-alt">Finalizar</span>
                                </button>
                            </span>    
                            <span id="cx_pix_rec" class="input-group-btn" >
                                <button class="btn btn-warning" type="button" id="cx_pix_esp">
                                    <span class="glyphicon glyphicon-qrcode">Pix</span>
                                </button>
                            </span>    
                        </div>
                    </div>
                </div>



                <div id="ImpCaixaPix" class="tab-pane fade">
                    <div class="row well well-sm" >
                        <div class="input-group" >
                            <span class="input-group-addon form-cli form-cli1" id="id_imp_cx_cli">REIMPRESSÃO DE NOTA</span>
                        </div>
                    </div>

                    <div class="row" id="cx_imp_row_nota">
                        <div class="input-group" >
                            <span class="input-group-addon form-cli form-cli1" id="id_imp_cx_cli_0">Nt/Cliente:</span>
                            <input type="text" name="cx_imp_nota" id="cx_imp_nota" class="form-control text-left form-cli form-cli1" value="" >
                            <input type="hidden" name="cx_imp_nota1" id="cx_imp_nota1"  value="" >
                            <span class="input-group-btn">
                                <button class="btn btn-success" type="button" id="cx_imp_buscar_nota">
                                    <i class="fa fa-search form-cli"></i>
                                </button>
                            </span>    
                        </div>
                        <div class="input-group" id="cx_notas_imp_sel_box" style="display: none">
                            <select id="cx_notas_imp_sel" class="form-control form-cli form-cli1">
                            </select>
                        </div>

                    </div>
                    <div class="row" id="cx_imp_row_notas">
                    </div>
                    <div class="row text-center" id="cx_imp_row_imprimir">
                        <br>
                        <button type="button" class="btn btn-primary" id="cx_imp_imprimir"><span>Imprimir </span><span class="glyphicon glyphicon-print" ></span></button>
                    </div>
                </div>


                <!--Veiculo-->
                <div id="veiculo" class="tab-pane fade">
                    <div class="row   ">
                        <div class="input-group" >
                            <span class="input-group-addon form-cli form-cli1" id="id_vc_prisca">Prisma:</span>
                            <input type="number" name="vc_prisma" id="vc_prisma" class="form-control text-left form-cli form-cli1" value="" style="text-transform: uppercase" data-mask="00">
                        </div>
                    </div>
                    <div class="row   ">
                        <div class="input-group" >
                            <span class="input-group-addon form-cli form-cli1" id="id_vc_placa">Placa:</span>
                            <input type="text" name="vc_placa" id="vc_placa" class="form-control form-cli form-cli1" value="" size="15" maxlength="15" style="text-transform: uppercase" data-mask="AAAAAAAA">
                            <span class="input-group-btn">
                                <button class="btn btn-success" type="button" id="vc_buscar_placa">
                                    <i class="fa fa-search form-cli"></i>
                                </button>
                            </span>    
                        </div>
                    </div>
                    <div id="vc_det" style="display: none;">
                        <div class="row   ">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_vc_marca">Marca:</span>
                                <input type="text" name="vc_marca" id="vc_marca" class="form-control text-left form-cli form-cli1" value="" size="15" maxlength="15" style="text-transform: uppercase">
                                <span class="input-group-btn">
                                    <button class="btn btn-success" type="button" id="vc_buscar_marca">
                                        <i class="fa fa-search form-cli"></i>
                                    </button>
                                </span>    
                            </div>
                        </div>
                        <div class="row   ">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_vc_modelo">Modelo:</span>
                                <input type="text" name="vc_modelo" id="vc_modelo" class="form-control text-left form-cli form-cli1" value="" size="15" maxlength="15" style="text-transform: uppercase">
                                <span class="input-group-btn">
                                    <button class="btn btn-success" type="button" id="vc_buscar_modelo">
                                        <i class="fa fa-search form-cli"></i>
                                    </button>
                                </span>    
                            </div>
                        </div>
                        <div class="row   ">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_vc_cor">Cor:</span>
                                <input type="text" name="vc_cor" id="vc_cor" class="form-control text-left form-cli form-cli1" value="" size="15" maxlength="15" style="text-transform: uppercase">
                                <span class="input-group-btn">
                                    <button class="btn btn-success" type="button" id="vc_buscar_cor">
                                        <i class="fa fa-search form-cli"></i>
                                    </button>
                                </span>    
                            </div>
                        </div>
                        <div class="row   ">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_vc_tipo">Tipo:</span>
                                <input type="text" name="vc_tipo" id="vc_tipo" class="form-control text-left form-cli form-cli1" value="" size="15" maxlength="30" style="text-transform: uppercase">
                            </div>
                        </div>
                        <div class="row   ">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_vc_ano">Ano:</span>
                                <input type="number" name="vc_ano" id="vc_ano" class="form-control text-left form-cli form-cli1" value="" style="text-transform: uppercase" data-mask="9999">
                                <span class="input-group-addon form-cli form-cli1" id="id_vc_km">Km:</span>
                                <input type="number" name="vc_kilomet" id="vc_kilomet" class="form-control text-left form-cli form-cli1" value="" style="text-transform: uppercase" data-mask="9999999">
                            </div>
                        </div>
                        <div class="row   ">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_vc_classe">Classe:</span>
                                <select id="vc_classe" class="form-control form-cli form-cli1">

                                    <option value=""></option>
                                    <option value="1">Passeio</option>
                                    <option value="2">Camionete</option>
                                    <option value="3">Caminhão</option>
                                    <option value="4">Ônibus</option>
                                    <option value="5">SUV</option>
                                    <option value="6">Van</option>
                                    <option value="7">Moto</option>
                                    <option value="9">Outros</option>
                                </select>
                            </div>
                        </div>
                        <div class="row text-center" >
                            <div class="text-center col-xs-6">
                                <button id="vc_salvar" class="btn btn-success" > 
                                    <span class="glyphicon glyphicon-save form-cli" id="id_8h89hhvf">Salvar</span> 
                                </button>
                            </div>
                            <div class="text-center col-xs-6">
                                <button id="vc_img_inc" class="btn btn-warning" > 
                                    <span class="glyphicon glyphicon-camera form-cli" id="id_8h89hgcch"></span> 
                                    <span class="glyphicon glyphicon-upload form-cli" id="id_8h89hgcchg"></span> 
                                </button>
                            </div>
                        </div>
                        <div class="row" id="vc_img">

                        </div>
                    </div>

                </div>






                <!-- veiculo buscar -->
                <div id="vc_modal" class="modal fade" role="dialog">
                    <div class="modal-dialog">

                        <!-- Modal content-->
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title" id="vc_modal_cab"><span id="id_cli43t54v32r">Selecione</span></h4>
                            </div>
                            <div class="modal-body" id="vc_modal_corpo">
                                <input type="hidden" id="vc_buscar_tipo">
                                <select id="vc_buscar" class="form-control form-cli form-cli1" >

                                    <option value=""></option>
                                </select>
                            </div>
                        </div>

                    </div>
                </div>                    
                <!-- cidade buscar -->
                <div id="de_modal" class="modal fade" role="dialog">
                    <div class="modal-dialog">

                        <!-- Modal content-->
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title" id="vc_modal_cab"><span id="id_cli33434v32">Seleccione una Ciudad</span></h4>
                            </div>
                            <div class="modal-body" id="de_modal_corpo">
                                <input type="hidden" id="de_buscar_cid">
                                <select id="de_buscar" class="form-control form-cli form-cli1" >

                                    <option value=""></option>
                                </select>
                            </div>
                        </div>

                    </div>
                </div>                    


                <!-- cliente -->
                <div id="cl_modal" class="modal fade" role="dialog">
                    <div class="modal-dialog">

                        <!-- Modal content-->
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title" id="cl_modal_cab"><span id="id_cli43t52">Selecione um cliente</span></h4>
                            </div>
                            <div class="modal-body" id="cl_modal_corpo">
                                <p></p>
                            </div>
                        </div>

                    </div>
                </div>                    

                <div id="cl_modal_marca" class="modal fade" role="dialog">
                    <div class="modal-dialog">

                        <!-- Modal content-->
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title" id="cl_modal_cab_marca"><span id="id_cl54488">Selecione as marcas de interesse</span></h4>
                            </div>
                            <div class="modal-body" id="cl_modal_corpo_marca">
                                <p></p>
                            </div>
                            <div class="modal-footer">
                                <button id="cl_marca_can" class="btn btn-warning" onclick="$('#cl_modal_marca').modal('hide')" > 
                                    <span class="glyphicon glyphicon-save form-cli" id="id_sol53547jh">Cancelar </span> 
                                </button>
                                <button id="cl_marca_inc" class="btn btn-success" > 
                                    <span class="glyphicon glyphicon-save form-cli" id="id_sol3389hh">Ok</span> 
                                </button>
                            </div>
                        </div>

                    </div>
                </div>                    
                <div id="cl_modal_grupo" class="modal fade" role="dialog">
                    <div class="modal-dialog">

                        <!-- Modal content-->
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title" id="cl_modal_cab_grupo"><span id="id_cli6564388">Selecione Categorias de interesse</span></h4>
                            </div>
                            <div class="modal-body" id="cl_modal_corpo_grupo">
                                <p></p>
                            </div>
                            <div class="modal-footer">
                                <button id="cl_grupo_can" class="btn btn-warning"  onclick="$('#cl_modal_grupo').modal('hide')" > 
                                    <span class="glyphicon glyphicon-save form-cli" id="id_sol5898347jh">Cancelar </span> 
                                </button>
                                <button id="cl_grupo_inc" class="btn btn-success" > 
                                    <span class="glyphicon glyphicon-save form-cli" id="id_sol88559hh">Ok</span> 
                                </button>
                            </div>
                        </div>

                    </div>
                </div>                    

                <!--fotto-->
                <div id="fotto" class="tab-pane fade">
                    <div id="dfotto">
                        <div class="row ">
                            <h3><span id="id_foto5423f">Fotos do RG - Frente</span></h3>
                        </div>
                        <div class="row ">
                            <span class="text-center">
                                <img src="img/frente.png" style="width: 80%;height: auto;" id="ft_1" >
                            </span>
                        </div>
                        <div class="row ">
                            <hr>
                        </div>

                        <div class="row ">
                            <h3><span id="id_foto9948">Fotos do RG - Verso</span></h3>
                        </div>
                        <div class="row ">
                            <span class="text-center">
                                <img src="img/verso.png" style=" width: 80%;height: auto;" id="ft_2">
                            </span>
                        </div>
                    </div>
                </div>
                <!--relatorio-->
                <div id="relatorio" class="tab-pane fade">
                    <div class="row  bg-info">
                        &nbsp;&nbsp;<input type="radio" name="rl_modo" id="rl_venda" value="V" /><label for="rl_venda" id='rl_venda_l'><span id="id_vendas131234">Vendas</span> </label>
                        &nbsp;&nbsp;&nbsp;<input type="radio" name="rl_modo" id="rl_nota" value="N" checked /><label for="rl_nota" id='rl_nota_l'><span id="id_notas2354">Notas</span> </label>
                        &nbsp;&nbsp;&nbsp;<input type="radio" name="rl_modo" id="rl_divida" value="N" /><label for="rl_nota" id='rl_divida_l'><span id="id_notas2354xx">Dívida</span> </label>

                        <span class='pull-right'>
                            <button class="btn btn-success" type="button" id="rl_refresh" >
                                <i class="fa fa-refresh form-cli"></i>
                            </button>
                            &nbsp;
                        </span>
                    </div>

                    <div class="row  form-group bg-info" id='rl_data' style="display: none;">
                        <label for="rl_datai"><span id="id_dat324">Datas</span>:</label>
                        <input type="date" id="rl_datai">
                        <label for="rl_dataf"><span id="id_a354325">a</span></label>
                        <input type="date" id="rl_dataf">
                    </div>

                    <div class="row  bg-primary">
                        <span  class='pull-left' id='rl_emissao'></span>
                        <span  class='pull-right' id='rl_credito'></span>
                    </div>
                    <div class="row ">
                        <div id="rl_tabela">
                        </div>
                    </div>
                </div>


                <!--divida-->
                <div id="divida" class="tab-pane fade">
                    <div class='row  alert alert-danger text-center' id="dv_selecione"> 
                        <strong><span id="id_cli77ch">Selecione o Cliente</span></strong>
                    </div>
                    <div class="row  bg-info">
                        <span class='pull-center ' id="dv_cab" style="display: none; "> <strong><span id="id_divcli324">Divida de Cliente</span> </strong></span>
                        <span class="form-group bg-info" id='dv_data' style="display: none;">
                            <label class="checkbox-inline"><input type="checkbox" id="dv_atz" checked><span id="id_divcli5859">Atrasado</span></label>
                            <label class="checkbox-inline"><input type="checkbox" id="dv_ven" checked><span id="id_divcli88fjh">A vencer</span></label>
                            <label class="checkbox-inline"><input type="checkbox" id="dv_ok"><span id="id_divclih78">Pagas</span></label>                        

                        </span>
                        <span class='pull-right' id="dv_botao" style="display: none; ">
                            <button class="btn btn-success" type="button" id="dv_refresh" >
                                <i class="fa fa-refresh form-cli"></i>
                            </button>
                            &nbsp;
                        </span>
                    </div>


                    <div class="row ">
                        <div id="dv_tabela">
                        </div>
                    </div>
                </div>


                <!--historico-->
                <div id="historico" class="tab-pane fade">
                    <div class="row ">
                        <div class="input-group" >
                            <span class="input-group-addon form-cli form-cli1" id="id_pd4535">Pd:</span>
                            <input type="text" name="ht_codigo" id="ht_codigo" class="form-control text-left form-cli form-cli1 text-uppercase" value="" >
                            <span class="input-group-addon form-cli form-cli1" id="id_pd8r9">Nt:</span>
                            <input type="number" name="ht_nota" id="ht_nota" class="form-control text-left form-cli form-cli1" value="" >
                        </div>
                    </div>

                    <div class="row " id="thistorico">
                    </div>

                </div>

                <!--produtos-->
                <div id="produtos" class="tab-pane fade">
                    <div class="row alert alert-danger text-center" id="pd_consulta1" style="display: block;">
                        <strong>
                            <span id="id_ljcon455">Selecione a Loja para consultar Produtos</span>
                        </strong>
                    </div>

                    <div id="pd_consulta" style="display: none;">
                        <div class="row ">
                            <div class="col-xs-6">
                                <div class="input-group">
                                    <!--
                                    <span class="form-cli" style="">
                                        <label for="pd_ckcodigo">
                                            <span id="id_sal8859">Código</span>
                                        </label>
                                        <input  type="checkbox" id="pd_ckcodigo">
                                    </span>
                                    -->
                                    <label class="radio-inline"> <input type="radio" name="pd_rbcodigo" id="pd_rbcodigo_d" value="D" > Descrição Exata</label>
                                    <label class="radio-inline"> <input type="radio" name="pd_rbcodigo" id="pd_rbcodigo_dc" value="DC" checked> Desc.Contida </label>
                                    <label class="radio-inline"> <input type="radio" name="pd_rbcodigo" id="pd_rbcodigo_da" value="DA" > Desc.Aprox. </label>
                                    <label class="radio-inline"> <input type="radio" name="pd_rbcodigo" id="pd_rbcodigo_c" value="C" > Código </label>
                                    <label class="radio-inline" id="c_referencia"> <input type="radio" name="pd_rbcodigo" id="pd_rbcodigo_r" value="R"> Refer. </label>

                                </div>
                            </div>
                            <div class="col-xs-3">
                                <div class="input-group">
                                    <span class="form-cli" style="">
                                        <label for="pd_saldo">
                                            <span id="id_sal988590">S/Saldo</span>
                                        </label>
                                        <input  type="checkbox" id="pd_saldo"> 
                                    </span>
                                    <span class="form-cli hidden" style="">
                                        <label for="pd_exato">
                                            <span id="id_salv1590">Exato</span>
                                        </label>
                                        <input  type="checkbox" id="pd_exato" checked> 
                                    </span>
                                    <span class="form-cli" style="">
                                        <label for="pd_promo">
                                            <span id="id_sal1gg590">Promo</span>
                                        </label>
                                        <input  type="checkbox" id="pd_promo" > 
                                        <span id="m_preco_atac1" style="font-size:1em;"></span>
                                    </span>
                                </div>
                            </div>
                                <div class="col-xs-3 input-group  form-cli form-group form-inline">
                                    <label for="pd_quant_con" id="id_sal9885900">
                                        Itens Pág:
                                    </label>
                                    <select class="" id="pd_quant_con" >
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                        <option value="200">200</option>
                                    </select>
                                </div>
                        </div>
                        <!--
                                                <div class="row ">
                                                    <div class="input-group">
                                                        <input type="number" id="pd_codigo" class="form-control text-left form-cli" value="" maxlength="13"  style="height: 70px;display: none">
                                                        <input type="text"   id="pd_nome"   class="form-control text-left form-cli" value="" size="20" maxlength="20"  style="text-transform: uppercase;height: 70px;display: block">
                                                        <span class="input-group-btn">
                                                            <button class="btn btn-success" type="button" id="pd_buscar">
                                                                <i class="fa fa-search form-cli"></i>
                                                            </button>
                                                            <br>
                                                            <button class="btn btn-warning" type="button" id="pd_clear" onclick="$('#pd_codigo').val('');$('#pd_nome').val('');$('#pd_' + ($('#pd_codigo').css('display') == 'block' ? 'codigo' : 'nome')).focus();">
                                                                <i class="fa fa-recycle form-cli"></i>
                                                            </button>
                                                        </span>    
                                                        <span class="">&nbsp;</span>
                                                        <span class="input-group-btn">
                                                            <button class="btn btn-info" type="button" id="pd_anterior">
                                                                <i class="fa fa-database form-cli"></i>
                                                            </button>
                                                            <br>
                                                            <button class="btn btn-success" type="button" id="pd_camara">
                                                                <i class="fa fa-camera form-cli"></i>
                                                            </button>
                                                        </span>
                                                    </div>
                                                </div> -->
                        <div class="row ">
                            <div class="input-group">
                                <input type="number" id="pd_codigo" class="form-control text-left form-cli" value="" maxlength="13"  style="display: none">
                                <input type="text"   id="pd_nome"   class="form-control text-left form-cli" value="" size="20" maxlength="20"  style="text-transform: uppercase;display: block" >
                                <span class="input-group-btn">
                                    <button class="btn btn-success" type="button" id="pd_buscar">
                                        <i class="fa fa-search form-cli"></i>
                                    </button>
                                    <button class="btn btn-warning" type="button" id="pd_clear" onclick="$('#pd_codigo').val('');$('#pd_nome').val('');$('#pd_' + ($('#pd_codigo').css('display') == 'block' ? 'codigo' : 'nome')).focus();">
                                        <i class="fa fa-recycle form-cli"></i>
                                    </button>
                                    <button class="btn btn-info" type="button" id="pd_anterior">
                                        <i class="fa fa-database form-cli"></i>
                                    </button>
                                    <button class="btn btn-success hidden" type="button" id="pd_camara">
                                        <i class="fa fa-camera form-cli"></i>
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="row " id="pd_table">
                        <table class="table table-bordered tabprod">
                            <thead class="bg-primary text-primary">
                                <tr class=" form-cli">
                                    <th colspan="2"><span id="id_prod4535432">Produto</span></th>
                                    <th><span id="id_">Mínimo</span></th>
                                    <th><span id="id_">Normal</span></th>
                                    <th><span id="id_">Saldo</span></th>
                                    <th></th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>



                <!--venda-->
                <div id="venda" class="tab-pane fade">
                    <div class="row   ">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th class="bg-primary text-right ">
                                        <span class="form-cli"> Itens:</span>
                                    </th>
                                    <th class="bg-warning text-left form-cli">
                                        <span id="vd_itens">10</span>
                                    </th>
                                    <th class="bg-primary text-right form-cli">
                                        <span>Total:</span>
                                    </th>
                                    <th class="bg-warning text-center form-cli">
                                        <span id="vd_moeda">US$</span>
                                    </th>
                                    <th class="bg-warning text-left form-cli">
                                        <span id="vd_total">1,000.00</span>
                                    </th>
                                </tr>
                            </thead>
                        </table>
                    </div>

                    <!-- Autoriza em grupo -->
                    <div id="vd_modal_aut" class="modal fade" role="dialog">
                        <div class="modal-dialog modal-lg">

                            <!-- Modal content-->
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title" id="vd_modal_aut_cab"><span id="id_aut_ods999">Informe o valor de cada produto</span></h4>
                                </div>
                                <div class="modal-body" id="vd_modal_aut_corpo">
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-warning" data-dismiss="modal"><span id="id_aut_qe23e44">Fechar</span></button>
                                    <button type="button" class="btn btn-primary" id="vd_modal_aut_sol"><span id="id_aut_qe23e">Solicitar</span></button>

                                </div>
                            </div>

                        </div>
                    </div>                    


                    <div class="row " id="vd_table">
                        <table class="table table-bordered">
                            <thead class="bg-warning text-warning">
                                <tr>
                                    <th colspan="2">Produto</th>
                                    <th>Quant</th>
                                    <th>Unit</th>
                                    <th>Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <!--
                                <tr>
                                    <th scope="row ">1735561&nbsp;<i class="fa fa-remove form-cli text-warning"></i></th>
                                    <td>TESTE DE NOME DE PRODUTO PARA A VENDA A CLIENTE FINAL</td>
                                    <td>2.00&nbsp;<i class="fa fa-plus-circle form-cli text-success"></i></td>
                                    <td>17.00</td>
                                    <td>34.00</td>
                                    <td><i class="fa fa-camera form-cli text-primary"></i><i class="fa fa-wpforms form-cli text-primary"></i></td>
                                </tr>
                                <tr>
                                    <th scope="row ">1735561&nbsp;<i class="fa fa-remove form-cli text-warning"></i></th>
                                    <td>TESTE DE NOME DE PRODUTO PARA A VENDA A CLIENTE FINAL</td>
                                    <td>2.00&nbsp;<i class="fa fa-plus-circle form-cli text-success"></i></td>
                                    <td>17.00</td>
                                    <td>34.00</td>
                                    <td><i class="fa fa-camera form-cli text-primary"></i><i class="fa fa-wpforms form-cli text-primary"></i></td>
                                </tr>
                                <tr>
                                    <th scope="row ">1735561&nbsp;<i class="fa fa-remove form-cli text-warning"></i></th>
                                    <td>TESTE DE NOME DE PRODUTO PARA A VENDA A CLIENTE FINAL</td>
                                    <td>2.00&nbsp;<i class="fa fa-plus-circle form-cli text-success"></i></td>
                                    <td>17.00</td>
                                    <td>34.00</td>
                                    <td><i class="fa fa-camera form-cli text-primary"></i><i class="fa fa-wpforms form-cli text-primary"></i></td>
                                </tr>
                                <tr>
                                    <th scope="row ">1735561&nbsp;<i class="fa fa-remove form-cli text-warning"></i></th>
                                    <td>TESTE DE NOME DE PRODUTO PARA A VENDA A CLIENTE FINAL</td>
                                    <td>2.00&nbsp;<i class="fa fa-plus-circle form-cli text-success"></i></td>
                                    <td>17.00</td>
                                    <td>34.00</td>
                                    <td><i class="fa fa-camera form-cli text-primary"></i><i class="fa fa-wpforms form-cli text-primary"></i></td>
                                </tr>
                                -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!--finalizar-->
                <div id="finalizar" class="tab-pane fade">
                    <div class="row   ">
                        <h3><span id="id_finsdfg889">Finalizar</span></h3>
                    </div>



                    <div class="row ">
                        <div class="text-center">
                            <div class="input-group" style="width: 100%;" >
                                <span class="input-group-addon form-cli" style="width: 25%;" id="id_cli88er7">Cliente:</span>
                                <span class="form-control text-left form-cli" id="fn_cliente" style="width: 100%;" >JOÃO DA SILVA</span>
                            </div>
                        </div>
                    </div>
                    <div class="row ">
                        <div class="text-center">
                            <div class="input-group" style="width: 100%;" >
                                <span class="input-group-addon form-cli"  style="width: 25%;"  ><span id="id_tipo32494jfj">Tipo</span>:</span>
                                <div class="form-control text-left form-cli" id="fn_nacionalidade" style="width: 100%;">Paraguaio</div>
                            </div>
                        </div>
                    </div>
                    <div class="row ">
                        <div class="text-center">
                            <div class="input-group" style="width: 100%;" >
                                <span class="input-group-addon form-cli"  style="width: 25%;"  ><span id="id_adsdas88f8">Pagamento</span>:</span>
                                <div class="form-control text-left form-cli" id="fn_pagamento" style="width: 100%;">CASH</div>
                            </div>
                        </div>
                    </div>
                    <div class="row ">
                        <div class="text-center">
                            <div class="input-group" style="width: 100%;" >
                                <span class="input-group-addon form-cli"  style="width: 25%;"  ><span id="id_item4285rjj">Itens</span>:</span>
                                <div class="form-control text-left form-cli" id="fn_itens" style="width: 100%;">2 / 17</div>
                            </div>
                        </div>
                    </div>
                    <div class="row " id="fn_desconto" style="display: none;">
                        <div class="text-center">
                            <div class="input-group" style="width: 100%;" >
                                <span class="input-group-addon form-cli"  style="width: 15%;" >Sub:</span>
                                <span class="input-group-addon form-cli"  id="fn_moeda_s" >R$</span>
                                <div class="form-control text-left form-cli" id="fn_valor_s" >1.000,00</div>
                                <span class="input-group-addon form-cli" >-</span>
                                <div class="form-control text-left form-cli" id="fn_valor_sf" >1.000,00</div>
                            </div>
                        </div>
                    </div>
                    <div class="row ">
                        <div class="text-center">
                            <div class="input-group" style="width: 100%;" >
                                <span class="input-group-addon form-cli"  style="width: 15%;" >Total..:</span>
                                <span class="input-group-addon form-cli"  id="fn_moeda" style="width: 10%;" >R$</span>
                                <div class="form-control text-left form-cli" id="fn_valor" style="width: 100%;" >1.000,00</div>
                            </div>
                        </div>
                    </div>
                    <div id="vc_mostra" class="hidden">
                        <div class="row " >
                            <div class="text-center">
                                <div class="input-group" style="width: 100%;" >
                                    <span class="input-group-addon form-cli"  style="width: 15%;" >Desc.Voucher.:</span>
                                    <span class="input-group-addon form-cli"  id="vc_per" style="width: 10%;" >10%</span>
                                    <div class="form-control text-left form-cli" id="vc_val" style="width: 100%;" >1.000,00</div>
                                </div>
                            </div>
                        </div>
                        <div class="row " >
                            <div class="text-center">
                                <div class="input-group" style="width: 100%;" >
                                    <span class="input-group-addon form-cli"  style="width: 25%;" >Total Líquido..:</span>
                                    <div class="form-control text-left form-cli" id="vc_tot" style="width: 100%;" >1.000,00</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row " id="fn_comcarga" style="display: none;">
                        <div class="text-center">
                            <div class="input-group" style="width: 100%;" >
                                <span class="input-group-addon form-cli"  style="width: 15%;" >Carga..:</span>
                                <select class="form-control form-cli" id="fn_carga" style=" height: 50px;">
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row ">
                        &nbsp;
                    </div>
                    <div class="row ">
                        <div class="input-group form-cli text-center" >
                            <span class="input-group-btn">
                                <button id="fn_finalizar" class="btn btn-success" >
                                    <span class="glyphicon glyphicon-save"></span>
                                    Finalizar
                                </button>
                            </span>

                        </div>
                    </div>
                    <div class="row   ">
                        <div class="form-group form-cli">
                            <label for="fn_obs"><span id="id_obsdfdadsfj34">Observações</span>:</label>
                            <textarea class="form-control form-cli" rows="5" id="fn_obs"></textarea>
                        </div>                    
                    </div>

                </div>
            </div>
            <div class="foot text-left bg-info text-info">
                <!--
                <div class="row ">
                     <span><button class="btn btn-success" type="button" id="i_cambio"><i class="fa fa-money" style="font-size: 1.5em;height: 30px;"></i></button></span>
                <span id="ft_vendedor" style="font-size: 1.2em"></span>
                </div>
                -->
                <div class="row ">
                    <div class="col-xs-2">
                        <button class="btn btn-success" type="button" id="i_cambio"><i class="fa fa-money" style="font-size: 1.5em;height: 30px;"></i></button>
                    </div>
                    <div class="col-xs-7">
                        <span id="ft_vendedor" style="font-size: 1.2em"></span>
                    </div>
                    <div class="col-xs-1 text-right">
                        <span id="ft_versao" style="font-size: 1.2em">V: <?php echo $cversao; ?></span>
                    </div>
                    <div class="col-xs-2 text-right">
                        <span id="ft_timer" style="font-size: 1.2em">00:00:00</span>
                    </div>
                </div>
            </div>
        </div>


        <!--janela de quantidades-->
        <div class="modal fade" id="vd_quant" tabindex="-2" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true" data-backdrop="static">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header"  id="vd_quant_fundo">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" class="form-cli">&times;</span>
                        </button>
                        <h4 class="modal-title" id="vd_quant_produto"><span id="id_pro787f7">Produto</span></h4>
                    </div>
                    <div class="modal-body">
                        <!--
                        <div class="row   " id="vd_multiloja" >
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1">Loja:</span>
                                <select id="vd_loja" class="form-control text-left form-cli form-cli1" >
                                </select>
                            </div>
                        </div>
                        -->
                        <div class="row   ">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_pdqu5747">Quant:</span>
                                <input type="hidden" id="vd_codigo" value="" >
                                <input type="tel" id="vd_quant_quant" class="form-control text-left form-cli form-cli1" value="" >
                            </div>
                        </div>
                        <div class="row   ">
                            <div class="input-group" >
                                <span class="input-group-addon form-cli form-cli1" id="id_val577858">Valor:</span>
                                <input type="tel" id="vd_quant_valor" class="form-control text-left form-cli form-cli1" value="">
                                <input type="hidden" id="vd_atacado" value="">
                                <input type="hidden" id="vd_minimo" value="">
                                <input type="hidden" id="vd_custo" value="">
                                <input type="hidden" id="vd_venda" value="">
                                <input type="hidden" id="vd_promo" value="">
                            </div>
                        </div>
                        <div class="row   ">
                            &nbsp; 
                        </div>
                        <div class="row   ">
                            <div class="text-center">
                                <div class="input-group form-cli" >
                                    <span class="glyphicon glyphicon-question-sign" onclick="" id="vd_quant_enviar_preco"></span>
                                    <span class="input-group-btn">
                                        <button id="vd_quant_enviar" class="btn btn-success" onclick="" >
                                            <span class="glyphicon glyphicon-plus-sign"></span>
                                            <span id="id_adci9988">Adicionar</span>
                                        </button>
                                    </span>
                                </div>
                            </div>

                        </div>
                        <div class="row " id="vd_ult_venda" style="font-size: 0.8em;">

                        </div>

                    </div>
                </div>
            </div>
        </div>

        <!--janela de imagem-->
        <div class="modal fade" id="pd_imagem" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true" data-backdrop="static">
            <div class="modal-dialog" role="document" >
                <div class="modal-content">
                    <div class="modal-header">
                        <!--<h5 class="modal-title" id="pd_linha1">Produto</h5>-->
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" class="form-cli">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div id="pd_carousel" class="carousel slide" data-ride="carousel"   data-interval="10000">
                            <!-- Indicators -->
                            <ol class="carousel-indicators" id="pd_carousel_cab">
                                <li data-target="#pd_carousel" data-slide-to="0" class="active"></li>
                                <li data-target="#pd_carousel" data-slide-to="1"></li>
                                <li data-target="#pd_carousel" data-slide-to="2"></li>
                            </ol>

                            <!-- Wrapper for slides -->
                            <div class="carousel-inner" role="listbox" id="pd_carousel_ite">
                                <div class="item active">
                                    <img src="img/noimage.png">
                                </div>
                                <div class="item">
                                    <img src="img/noimage.png">
                                </div>
                                <div class="item">
                                    <img src="img/noimage.png">
                                </div>
                            </div>

                            <!-- Left and right controls -->
                            <a class="left carousel-control" href="#pd_carousel" role="button" data-slide="prev">
                                <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                                <span class="sr-only" id="id_ant8548dj">Anterior</span>
                            </a>
                            <a class="right carousel-control" href="#pd_carousel" role="button" data-slide="next">
                                <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                                <span class="sr-only" id="id_proxjf88">Próxima</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--janela de detalhes-->
        <div class="modal fade" id="pd_detalhes" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true" data-backdrop="static">
            <div class="modal-dialog" role="document" >
                <div class="modal-content">
                    <div class="modal-header">
                        <span id="pd_detalhes_pro_cab"></span>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" class="form-cli">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" id="pd_detalhes_pro">
                        <div class="alert-info" >
                            <h3 class="text-left">1234-Nome do produto<br>Web: Nome do produto na web</h3> 
                        </div>
                        <h4 >Este é um produto para consolar vuivas e afins. Não reconmendado usar ligado na tomada.</h4>
                        <table class="table table-bordered">
                            <tbody>
                                <tr>
                                    <th class="text-right">Cor:</th>
                                    <td class="text-left">Preto</td>
                                </tr>
                                <tr>
                                    <th class="text-right">Tamanho:</th>
                                    <td class="text-left">Negão</td>
                                </tr>
                                <tr>
                                    <th class="text-right">Satisfação:</th>
                                    <td class="text-left">Total</td>
                                </tr>
                                <tr>
                                    <th class="text-right">Nível de dor:</th>
                                    <td class="text-left">Alto</td>
                                </tr>
                                <tr>
                                    <th class="text-right">Lubrificado:</th>
                                    <td class="text-left">Não</td>
                                </tr>
                            </tbody>
                        </table>
                        <h5>Este é um produto para consolar vuivas e afins. Não reconmendado usar ligado na tomada.</h5>


                    </div>
                </div>
            </div>
        </div>
        <!--janela de cashback-->
        <div class="modal fade" id="pd_cashback" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true" data-backdrop="static">
            <div class="modal-dialog" role="document" >
                <div class="modal-content">
                    <div class="modal-header">
                        <span id="pd_cashback_cab" class=" alert alert-danger">OFEREÇA O Cash Back ao Cliente</span>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" class="form-cli">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" id="pd_cashback_pro">


                    </div>
                </div>
            </div>
        </div>



        <!--veiculo imagem-->
        <div class="modal fade" id="vc_imagem" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true" data-backdrop="static">
            <div class="modal-dialog" role="document" >
                <div class="modal-content">
                    <div class="modal-header">
                        <div id="vc_imagem_obs" class="bg-info text-info"></div>
                        <button type="button" class="text-danger" id="vc_imagem_del">
                            <span class="fas fa-trash-restore"></span>
                        </button>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" class="form-cli">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" >
                        <div class="row">
                            <img class="" src="#" id="vc_imagem_img" style="width: 100%; height: auto;" onclick="MudaImgTam()"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--janela de grade-->
        <div class="modal fade" id="pd_grade" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true" data-backdrop="static">
            <div class="modal-dialog" role="document" >
                <div class="modal-content">
                    <div class="modal-header">
                        <div id="pd_grade_pro" class="bg-info text-info"></div>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" class="form-cli">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" id="pd_detalhes_grade">

                    </div>
                </div>
            </div>
        </div>



        <!--janela de operador de autorizacao-->
        <div class="modal fade" id="pd_autoriza" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true" data-backdrop="static">
            <div class="modal-dialog" role="document" >
                <div class="modal-content">
                    <div class="modal-header bg-info">
                        <div class="bg-info text-info"><span id="id_ope435435">Selecione o Operador</span>: </div>
                        <button id="pd_fechar" type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" class="form-cli">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body bg-warning" id="pd_autoriza_det">
                        <div class="row  form-cli" id="pd_autoriza_ope_div">
                            <select class="form-control form-cli" id="pd_autoriza_ope" style=" height: 50px;">
                            </select>
                        </div>
                        <div class="row   ">
                            <div class="form-group form-cli">
                                <label for="pd_obs"><span id="id_obs7578k">Observações</span>:</label>
                                <textarea class="form-control form-cli" rows="5" id="pd_obs"></textarea>
                            </div>                    
                        </div>
                        <div class="row  form-cli text-center" id="pd_bt_inc">
                            <span class="text-center" style="width: 100%">
                                <button id="pd_autoriza_can" class="btn btn-warning" > 
                                    <span class="glyphicon glyphicon-save form-cli" id="id_sol5347jh">Cancelar Solicitação</span> 
                                </button>
                                <button id="pd_autoriza_inc" class="btn btn-success" > 
                                    <span class="glyphicon glyphicon-save form-cli" id="id_sol889hh">Solicitar</span> 
                                </button>
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>




        <div><p>&nbsp;</div>
        <div><p>&nbsp;<br><br><br><br><br><br><br><br><br><br>&nbsp;</div>



        <div id="cordova-dialog-overlay" style="display:none;">
            <div id="cordova-dialog-box">
                <h3 id="cordova-dialog-title"></h3>
                <p id="cordova-dialog-message"></p>
                <input id="cordova-dialog-input" type="text" style="display:none;" />
                <div id="cordova-dialog-buttons"></div>
            </div>
        </div>

        <?php
        $ajs = array();
        $ajs[] = "assets/components/jquery/jquery.min.js";
        $ajs[] = "assets/components/jquery-mask/jquery.mask.min.js";
        $ajs[] = "assets/components/bootstrap/js/bootstrap.min.js";
        $ajs[] = "assets/components/bootbox/mybootbox.js";
        $ajs[] = "js/produtos.js";
        $ajs[] = "js/clientes.js";
        $ajs[] = "js/vendas.js";
        $ajs[] = "js/caixa.js";
        $ajs[] = "js/imagem.js";
        $ajs[] = "js/gets.js";
        $ajs[] = "js/menu.js";
        $ajs[] = "js/funcoes.js";
        $ajs[] = "assets/components/bootstrap/js/html2pdf.bundle.min.js";
        echo "";
        foreach ($ajs as $value) {
            echo '         <script src="' . $value . "?v=" . filemtime($value) . '"></script>' . "\n";
        }
        ?>

        <script type="text/javascript">
            var nTimeOut = 20000;
<?php
echo "curl = '" . $curl . "';\n";
echo "nempresa = '" . $nempresa . "';\n";
echo "cversao = '" . $cversao . "';\n";
echo "ccomp = '" . $ccomp . "';\n";
echo "ncliente_def = '" . $ncliente_def . "';\n";
echo "sid = '" . $_SESSION["sid"] . "';\n";
echo "vendedor = '" . $_SESSION["codigo"] . "';\n";
echo "nvendedor = '" . $_SESSION["codigo"] . "';\n";
echo "cvendedor = '" . $_SESSION["nome"] . "';\n";
echo "nmoeda = " . (GetConfig("moedaini") + 0) . ";\n";
echo "nLimiteFoto = " . (GetConfig("limitefoto") + 0) . ";\n";
echo "nModoOpe = 0;\n";
echo "\n\n";
?>
            //curl = window.localStorage.getItem("cecvendas" + nempresa + "_url") + window.localStorage.getItem("cecvendas_versao") + "/";
            /*var nLimiteFoto = parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_limitefoto"));
             var sid = window.localStorage.getItem("cecvendas" + nempresa + "_sid");
             var vendedor = window.localStorage.getItem("cecvendas" + nempresa + "_codigo");
             var nvendedor = window.localStorage.getItem("cecvendas" + nempresa + "_codigo");
             var cvendedor = window.localStorage.getItem("cecvendas" + nempresa + "_nome");
             var nModoOpe = parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_modo"));
             */
            var amoeda = [["", "", 2, 0], ["", "", 2, 0], ["", "", 2, 0], ["", "", 2, 0]];
            var uaux;
            var aprodutos = [];
            var aconsulta = [];
            var ncliente = 0;
            var ccliente = 'Geral';
            var nloja = 0;
            //var nmoeda = window.localStorage.getItem("cecvendas" + nempresa + "_moedaini");
            var agrade = [];
            var nesperaaut = 0;
            var aautorizadores;
            var nautoriza = 0;
            var njanela = 0;
            var lseguro = false;
            var nacodigo;
            var naquant;
            var naquantant;
            var naquantmax;
            var navalor;
            var naminimo;
            var navenda;
            var naiva;
            var lgravando = false;
            var nmodpedi = 0;
            var nvalorfinal = 0;
            var cBmp = '';
            var cLogoRel = '';
            var aloja = [];
            var ahistorico = [];
            var npopcli = 0;
            var nguia = 0;
            var lvenda = "A";
            var lminimo = "C";
            var lmostraa = false;
            var lmostrab = false;
            var lmostrac = false;
            var lmostrat = false;
            var lorc = false;
            var norc_pos = 0;
            var nserie = 0;
            var numnotas = 1;
            var lmultiloja;
            var lclibloq = false;
            var lSemEstLoj = false;
            var lSemEstGer = false;
            var lAutVendas = false;
            var wvalven = 0;
            var wvalmin = 0;
            var lvercusto = false;
            var lcarga = false;
            var acl_marca = [];
            var acl_grupo = [];
            var larre_pre = false;
            var aConfig = {};
            var aConfigTbl = {};
            var cLocIni = "";
            var cLocFin = "";
            var lFactura = false;

            var lSemLoja = false; //consultar estoque sem informa loja
            var lVenAlteraCliente = false; // pode alterar notas de outros vendedores
            //CAIXA
            var nCaixaConta = 0;
            var nCaixaHist = 0;
            var aNotasRec = [];
            var aOperadorRec = [0, ""];
            var nAjustaLock = 0;
            var nMoedaBanco = 1;
            var nLimiteNotasRec = 7;
            var ncx_pix = 0;
            //carrega config
            var aret;
            var aBancosRec = {};
            var nPaisClienteCec = 0;
            var alojacor = [];
            var nlojacor = 0;
            var lNCadCliCec = false;
            var lNCadCliFat = false;
            var nSerialCec = 0;
            var lDistribuidor = 9999999999;
            var nClienteAnterior = 0;
            var lClientePyFull = 0;
            var imp_web = '<?php echo ($cimp ? $cimp : ''); ?>';
            var cimp_web = '<?php echo $cimp; ?>';
            llog = 1;
            $.ajax({
                method: "POST",
                url: curl + "index_c.php",
                async: false,
                cache: false,
                timeout: nTimeOut,
                data: {sid: sid, modo: "VE_CONFIG"}
            }).done(function (e) {
                aret = JSON.parse(e);
                aConfig = aret.config;
                aConfigTbl = aret.configtbl;
                lNCadCliCec = aret.tabletcfg.NCADCLICEC == 'Y';
                lNCadCliFat = aret.tabletcfg.NCADCLIFAT == 'Y';
                nSerialCec = aret.serial_cec;
            }).fail(function (e, d) {
                aConfig = {};
                aConfigTbl = {};
            });
            if (aConfig.VOUCH_VDA !== "S") {
                $("#vd_voucher").addClass("hidden");
            }
            lFactura = aConfig.SIFEN == "S" && !lNCadCliFat;
            lSemLoja = aConfigTbl.SEMLOJA == 'Y'; //consultar estoque sem informa loja
            lVenAlteraCliente = aConfigTbl.VENALTCLI == 'Y'; // pode alterar notas de outros vendedores

<?php
echo "nMenuTipo= " . GetConfig("menutipo") . ";\n";
echo "lj_preco= " . GetConfig("lj_preco") . ";\n";
echo "multiloja= " . GetConfig("multiloja") . ";\n";
?>
            if (!nMenuTipo || nMenuTipo == 0) {
                nMenuTipo = 1;
            }
            MudaMenu(nMenuTipo);
            //lj_preco = window.localStorage.getItem("cecvendas" + nempresa + "_lj_preco");
            if (!lj_preco) {
                lj_preco = '';
            }
            if (!nmoeda || nmoeda == 0) {
                nmoeda = 1;
            }
            if (!VeVersaoPhp()) {
                //window.location.href = "index.php";
                let cimp = imp_web;
                if (cimp) {
                    cimp = "?IMP=" + cimp.split(",")[1];
                }
                window.location.href = "index.php" + cimp;
            }
            $("#lj_prazo").change(function () {
                var npag = $("#lj_ck_p3").prop("checked") ? 3 : ($("#lj_ck_p2").prop("checked") ? 2 : 1);
                $("#fn_pagamento").html(npag == 3 ? "Prazo" + " - " + $("#lj_prazo").val() + " dias" : (npag == 2 ? _tr("Cartão de Crédito") : _tr("Dinheiro")));
                MudaCampo();
            });
            $("[id^=lj_ck_p]").click(function () {
                var npag = $("#lj_ck_p3").prop("checked") ? 3 : ($("#lj_ck_p2").prop("checked") ? 2 : 1);
                $("#fn_pagamento").html(npag == 3 ? "Prazo" + " - " + $("#lj_prazo").val() + " dias" : (npag == 2 ? _tr("Cartão de Crédito") : _tr("Dinheiro")));
                MudaCampo();
            });

            $("#rl_venda").click(function(){
                let d = new Date();
                d.setDate(d.getDate() - 1);

                $("#rl_datai").val(d.toISOString().substr(0, 10));
                $("#rl_dataf").val(((new Date()).toISOString()).substr(0, 10));
            });

            $("#rl_nota,#rl_divida").click(function(){
                let d = new Date();
                d.setDate(d.getDate() - 10);

                $("#rl_datai").val(d.toISOString().substr(0, 10));
                $("#rl_dataf").val(((new Date()).toISOString()).substr(0, 10));
            });

            /*
            let d = new Date();
            d.setDate(d.getDate() - 1);

            $("#rl_datai").val(d.toISOString().substr(0, 10));
            //$("#rl_datai").val(((new Date()).toISOString()).substr(0, 10));
            $("#rl_dataf").val(((new Date()).toISOString()).substr(0, 10));
            // $("#dv_dataf").val(((new Date()).toISOString()).substr(0, 10));
            //                                if (!window.localStorage.getItem("cecvendas" + nempresa + "_divida") || window.localStorage.getItem("cecvendas" + nempresa + "_divida") == "0") {
            */
            $("#rl_nota").click();
            if (!veconfig.divida || veconfig.divida == "0") {
                $("#menu_divida").hide();
            }


            //voucher
            $("#lj_voucher").blur(function () {
                if (!$(this).val()) {
                    MudaCampo();
                    MostraProdutos();
                    return true;
                }
                if (lorc) {
                    $(this).val("");
                    MudaCampo();
                    MostraProdutos();
                    return true;
                }
                if ($("#lj_loja").val() == "0") {
                    navigator.notification.alert(
                            "Informe a loja primeiro", // message
                            function () {
                                MudaCampo();
                                MostraProdutos();
                                $("#lj_loja").focus();
                                $("#lj_voucher").val("");
                                return false;
                            }, // callback
                            _tr('Vendas'), // title
                            'Ok'                  // buttonName
                            );
                    return false;

                }
                if (ncliente == 0) {
                    navigator.notification.alert(
                            "Informe um cliente antes de informar o Voucher", // message
                            function () {
                                MudaCampo();
                                MostraProdutos();
                                $("#lj_voucher").val("");
                                return false;
                            }, // callback
                            _tr('Vendas'), // title
                            'Ok'                  // buttonName
                            );
                    return false;

                }
                $.ajax({
                    method: "POST",
                    url: curl + "index_c.php",
                    async: true,
                    cache: false,
                    timeout: nTimeOut * 3,
                    data: {sid: sid
                        , vendedor: vendedor
                        , voucher: $("#lj_voucher").val()
                        , modo: "VE_VOUCHER"
                        , cliente: ncliente
                        , serie: nserie
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
                                    MudaCampo();
                                    MostraProdutos();
                                    $("#lj_voucher").val("");
                                    return false;
                                }, // callback
                                _tr('Vendas'), // title
                                'Ok'                  // buttonName
                                );
                        return false;
                    }
                    MudaCampo();
                    MostraProdutos();
                    bootbox.alert({
                        message: aret.voucher,
                        colorType: "info",
                        timeOut: 20000,
                        callback: function (e) {
                        }
                    });
                    return true;
                }).fail(function (e, d) {
                    $("#rl_emissao").html("");
                    $("#rl_tabela").html("");
                    navigator.notification.alert(
                            _tr('Sem comunicação com o servidor'), // message
                            function () {
                            }, // callback
                            _tr('Vendas'), // title
                            'Ok'                  // buttonName
                            );
                });


                return false;


            });

            lmultiloja = (multiloja && multiloja == "1");
            $("#mn_nota").on("change", function () {
                MudaNota(this.value);
            });
            $("#dv_ok,#dv_atz,#dv_ven").on("click", function () {
                $("#dv_tabela").html("");
                return true;
            });
            $("#cl_marca_inc").on("click", function () {
                acl_marca = [];
                $("input[name^='cl_marca_cod_']").each(function () {
                    if (this.checked) {
                        acl_marca.push(parseInt((this.name).replace('cl_marca_cod_', '')));
                    }
                });
                $("#cl_modal_marca").modal('hide');
            });

            $("#pd_quant_con").change(function () {
                window.localStorage.setItem("cecvendas" + nempresa + "_quant_con", $(this).val());
                if ($("#pd_rbcodigo_c").prop("checked")) {
                    $("#pd_codigo").focus();
                } else {
                    $("#pd_nome").focus();
                }

            });
            $("#cl_grupo_inc").on("click", function () {
                acl_grupo = [];
                $("input[name^='cl_grupo_cod_']").each(function () {
                    if (this.checked) {
                        acl_grupo.push(parseInt((this.name).replace('cl_grupo_cod_', '')));
                    }
                });
                $("#cl_modal_grupo").modal('hide');
            });
            $("#de_cl_pais").attr("onLoad", CarregaPais());

            $("#de_cl_cpf").on("blur", function () {
                var cCpf = $("#de_cl_cpf").val();
                if (cCpf && !isCPF(cCpf)) {
                    navigator.notification.alert(
                            "CPF Inválido", // message
                            function () {

                            }, // callback
                            _tr('Vendas'), // title
                            'Ok'                  // buttonName
                            );
                    return false;
                }
            });
            $("#cl_marca_down").on("click", function () {
                var nespera = bootbox.espera({
                    message: _tr('Consultando o servidor') + " ...",
                    MostraTempo: true
                });
                $.ajax({
                    method: "POST",
                    url: curl + "index_c.php",
                    async: true,
                    cache: false,
                    timeout: nTimeOut * 3,
                    data: {sid: sid, modo: 'CLI_MARCA'}
                }).done(function (e) {
                    var aret = JSON.parse(e);
                    nespera.modal('hide');
                    //if (!VeSid(aret)) {
                    //    return false;
                    //}
                    if (aret.erro != '00') {
                        navigator.notification.alert(
                                aret.cerro + "-....", // message
                                function () {

                                }, // callback
                                _tr('Vendas'), // title
                                'Ok'                  // buttonName
                                );
                        return false;
                    }
                    var caux = "";
                    for (var i = 0; i < aret.marca.length; i++) {
                        caux = caux + '<input type="checkbox" name="cl_marca_cod_' + aret.marca[i][0] + '" id="cl_marca_cod_' + aret.marca[i][0] + '" ';
                        if (acl_marca.indexOf(parseInt(aret.marca[i][0])) !== -1) {
                            caux = caux + "checked";
                        }
                        caux = caux + '> ' + aret.marca[i][0] + '-' + aret.marca[i][1] + ' <br>';
                    }
                    $("#cl_modal_corpo_marca").html(caux);
                    $("#cl_modal_marca").modal("show");
                    return false;
                }).fail(function (e, d) {
                    nespera.modal('hide');
                    $("#rl_emissao").html("");
                    $("#rl_tabela").html("");
                    navigator.notification.alert(
                            _tr('Sem comunicação com o servidor'), // message
                            function () {
                            }, // callback
                            _tr('Vendas'), // title
                            'Ok'                  // buttonName
                            );
                });


                return false;

            });
            $("#cl_grupo_down").on("click", function () {
                var nespera = bootbox.espera({
                    message: _tr('Consultando o servidor') + " ...",
                    MostraTempo: true
                });
                $.ajax({
                    method: "POST",
                    url: curl + "index_c.php",
                    async: true,
                    cache: false,
                    timeout: nTimeOut * 3,
                    data: {sid: sid, modo: 'CLI_GRUPO'}
                }).done(function (e) {
                    var aret = JSON.parse(e);
                    nespera.modal('hide');
                    //if (!VeSid(aret)) {
                    //    return false;
                    //}
                    if (aret.erro != '00') {
                        navigator.notification.alert(
                                aret.cerro + "-....", // message
                                function () {

                                }, // callback
                                _tr('Vendas'), // title
                                'Ok'                  // buttonName
                                );
                        return false;
                    }
                    var caux = "";
                    for (var i = 0; i < aret.grupo.length; i++) {
                        caux = caux + '<input type="checkbox" name="cl_grupo_cod_' + aret.grupo[i][0] + '" id="cl_grupo_cod_' + aret.grupo[i][0] + '" ';
                        if (acl_grupo.indexOf(parseInt(aret.grupo[i][0])) !== -1) {
                            caux = caux + "checked";
                        }
                        caux = caux + '> ' + aret.grupo[i][0] + '-' + aret.grupo[i][1] + ' <br>';
                    }
                    $("#cl_modal_corpo_grupo").html(caux);
                    $("#cl_modal_grupo").modal("show");
                    return false;

                    /*
                     var caux = "";
                     for (var i = 0; i < aret.grupo.length; i++) {
                     caux = caux + '<input type="checkbox" name="cl_grupo_cod_' + aret.grupo[i][0] + '" id="cl_grupo_cod_' + aret.grupo[i][0] + '"> ' + aret.grupo[i][0] + '-' + aret.grupo[i][1] + ' <br>';
                     }
                     
                     $("#cl_modal_corpo_grupo").html(caux);
                     $("#cl_modal_grupo").modal("show");
                     return false;
                     */
                }).fail(function (e, d) {
                    nespera.modal('hide');
                    $("#rl_emissao").html("");
                    $("#rl_tabela").html("");
                    navigator.notification.alert(
                            _tr('Sem comunicação com o servidor'), // message
                            function () {
                            }, // callback
                            _tr('Vendas'), // title
                            'Ok'                  // buttonName
                            );
                });


                return false;

            });
            $("#cl_preferencial").on("click", function () {
                var lmostra = $("#cl_preferencial").prop("checked");
                if (lmostra) {
                    $("#c_form_preferencial").removeClass("hidden");
                } else {
                    $("#c_form_preferencial").addClass("hidden")();

                }

            });

            function MudaNota(nnota) {
                if (!nnota) {
                    nnota = 1;
                }
                if (nnota - 1 == nserie) {
                    return;
                }
                nserie = nnota - 1;
                CarregaNota();
                $("#pd_codigo").val('');
                $("#pd_nome").val('');
                $("#pd_buscar").click();
                //$("#myNavbar").toggle()
            }
            function orc_efe(nnota) {
                var nespera = bootbox.espera({
                    message: _tr('Consultando o servidor') + " ...",
                    MostraTempo: true
                });
                $.ajax({
                    method: "POST",
                    url: curl + "vendas.php",
                    async: true,
                    cache: false,
                    timeout: nTimeOut * 3,
                    data: {sid: sid, vendedor: vendedor
                        , lj_preco: lj_preco
                        , modo: 56
                        , nota: nnota
                        , cliente: ncliente
                        , orcamento: lorc
                        , serie: nserie
                    }
                }).done(function (e) {
                    var aret = JSON.parse(e);
                    nespera.modal('hide');
                    if (!VeSid(aret)) {
                        return false;
                    }
                    if (aret.erro != '00') {
                        navigator.notification.alert(
                                aret.cerro + "-....", // message
                                function () {

                                }, // callback
                                _tr('Vendas'), // title
                                'Ok'                  // buttonName
                                );
                        return false;
                    }
                    $("#lj_modal").modal('hide');
                    CarregaNota();
                    //VeEstatus();
                    return false;
                }).fail(function (e, d) {
                    nespera.modal('hide');
                    $("#rl_emissao").html("");
                    $("#rl_tabela").html("");
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
            function orc_pro(nnota, npos, ntam) {

                for (var i = 1; i <= ntam; i++) {
                    $("#orc_pro_" + i).html("");
                }
                if (norc_pos == npos) {
                    norc_pos = 0;
                    return;
                }
                norc_pos = npos;
                $.ajax({
                    method: "POST",
                    url: curl + "vendas.php",
                    async: true,
                    cache: false,
                    timeout: nTimeOut * 3,

                    data: {sid: sid, vendedor: vendedor
                        , lj_preco: lj_preco
                        , modo: 55
                        , nota: nnota
                        , orcamento: lorc
                        , serie: nserie
                    }
                }).done(function (e) {
                    var aret = JSON.parse(e);
                    if (!VeSid(aret)) {
                        return false;
                    }
                    if (aret.erro != '00') {
                        navigator.notification.alert(
                                aret.cerro + "-.....", // message
                                function () {

                                }, // callback
                                _tr('Vendas'), // title
                                'Ok'                  // buttonName
                                );
                        return false;
                    }
                    $("#orc_pro_" + npos).html(aret.tabela);
                    return false;
                }).fail(function (e, d) {
                    $("#rl_emissao").html("");
                    $("#rl_tabela").html("");
                    navigator.notification.alert(
                            _tr('Sem comunicação com o servidor'), // message
                            function () {
                            }, // callback
                            _tr('Vendas'), // title
                            'Ok'                  // buttonName
                            );
                });

            }
            $("#lj_ck_ven_ven,#lj_ck_ven_orc").change(function () {
                lorc = $("#lj_ck_ven_orc").prop("checked");
                if (lorc) {
                    $("body").css("background", "#ffffb3");
                } else {
                    $("body").css("background", "#cce6ff");
                }
                MudaCampo();
                VeEstatus();
            });


            $("#lj_ck_ven_orc_ven").change(function () {
                if ($("#lj_ck_ven_orc_ven").prop("checked")) {
                    if (!ncliente) {
                        navigator.notification.alert(
                                _tr("Selecione um cliente para efetivar algum orçamento"), // message
                                function () {
                                    $("#lj_ck_ven_orc").prop("checked", true);
                                    $("#lj_ck_ven_orc").change();
                                    return false;
                                }, // callback
                                _tr('Vendas'), // title
                                'Ok'                  // buttonName
                                );
                        return false;
                    }

                    var nespera = bootbox.espera({
                        message: _tr('Consultando o servidor') + " ...",
                        MostraTempo: true
                    });
                    norc_pos = 0;
                    //$("#oc_body").html('');
                    $.ajax({
                        method: "POST",
                        url: curl + "vendas.php",
                        async: true,
                        cache: false,
                        timeout: nTimeOut * 3,
                        data: {sid: sid, vendedor: vendedor
                            , lj_preco: lj_preco
                            , modo: 53
                            , cliente: ncliente
                            , orcamento: lorc
                            , serie: nserie
                        }
                    }).done(function (e) {
                        var aret = JSON.parse(e);
                        nespera.modal("hide");
                        if (!VeSid(aret)) {
                            return false;
                        }
                        if (aret.erro != '00') {
                            navigator.notification.alert(
                                    aret.cerro + "-......", // message
                                    function () {
                                        $("#rl_emissao").html("");
                                        $("#rl_tabela").html("");
                                    }, // callback
                                    _tr('Vendas'), // title
                                    'Ok'                  // buttonName
                                    );
                            return false;
                        }
                        //$("#oc_body").html(aret.tabela);
                        $("#lj_modal_corpo").html(aret.tabela);
                        $("#lj_modal_cab").html(_tr("Selecione um Orçamento"));
                        $("#lj_modal").modal('show');
                        $("#lj_ck_ven_ven").click();
                        return false;
                    }).fail(function (e, d) {
                        nespera.modal("hide");
                        $("#rl_emissao").html("");
                        $("#rl_tabela").html("");
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

<?php
echo "rldata=" . GetConfig("rldata") . ";\n";
echo "var aMoeVen = [" . GetConfig("moe_ven_1") . ", " . GetConfig("moe_ven_1") . ", " . GetConfig("moe_ven_1") . ", " . GetConfig("moe_ven_1") . "];\n";
?>
            var nTotal = 0;
            for (var i = 0; i <= 3; i++) {
                //aMoeVen[i - 1] = parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_moe_ven_" + i));
                nTotal = nTotal + aMoeVen[i];
            }




            $("#rl_data").show();
            if (rldata && rldata == "1") {
                //$("#rl_data").show();
            } else {
                $("#rl_datai").attr("disabled", true);
                $("#rl_dataf").attr("disabled", true);
            }
            // moedas vendas
            /*
             var aMoeVen = [0, 0, 0, 0];
             var nTotal = 0;
             for (var i = 1; i <= 4; i++) {
             aMoeVen[i - 1] = parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_moe_ven_" + i));
             nTotal = nTotal + parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_moe_ven_" + i));
             }
             */
            if (nTotal == 0) {
                for (var i = 1; i <= 4; i++) {
                    aMoeVen[i - 1] = 1;
                    // window.localStorage.setItem("cecvendas" + nempresa + "_moe_ven_" + i, "1");
                }
            }
            var lMarcou = false;
            var nMoedaInicio = 1;
            for (var i = 1; i <= 4; i++) {
                $("#lj_ck_m" + i).prop("checked", false);
                if (aMoeVen[i - 1] == 0) {
                    $("#lj_ck_m" + i).addClass("hide");
                    $("#lj_l_mi" + i).addClass("hide");
                } else {
                    $("#lj_ck_m" + i).removeClass("hide");
                    $("#lj_l_mi" + i).removeClass("hide");
                    if (!lMarcou) {
                        lMarcou = true;
                        nMoedaInicio = i;
                        $("#lj_ck_m" + i).prop("checked", true);
                    }
                }
            }

            $("#dv_refresh").on("click", function () {

                var nespera = bootbox.espera({
                    message: _tr('Consultando o servidor') + " ...",
                    MostraTempo: true
                });

                $("#dv_tabela").html("");

                $.ajax({
                    method: "POST",
                    url: curl + "vendas.php",
                    async: true,
                    cache: false,
                    timeout: nTimeOut * 3,
                    data: {sid: sid, vendedor: vendedor
                        , lj_preco: lj_preco
                        , atz: $("#dv_atz").prop("checked")
                        , ven: $("#dv_ven").prop("checked")
                        , ok: $("#dv_ok").prop("checked")
                        , modo: 54
                        , cliente: ncliente
                        , orcamento: lorc
                        , serie: nserie
                    }
                }).done(function (e) {
                    var aret = JSON.parse(e);
                    nespera.modal("hide");
                    if (!VeSid(aret)) {
                        return false;
                    }

                    if (aret.erro == '20') {
                        navigator.notification.alert(
                                aret.cerro + "-.......", // message
                                function () {
                                    //$("#rl_emissao").html(" Relatórios de vendas  ");
                                    //$("#rl_tabela").html("");
                                }, // callback
                                _tr('Vendas'), // title
                                'Ok'                  // buttonName
                                );
                        return false;
                    }
                    if (aret.erro != '00') {
                        navigator.notification.alert(
                                aret.cerro + "-........", // message
                                function () {
                                    $("#rl_emissao").html("");
                                    $("#rl_tabela").html("");
                                }, // callback
                                _tr('Vendas'), // title
                                'Ok'                  // buttonName
                                );
                        return false;
                    }
                    $("#dv_tabela").html(aret.tabela);
                    return false;
                }).fail(function (e, d) {
                    nespera.modal("hide");
                    $("#rl_tabela").html("");
                    navigator.notification.alert(
                            _tr('Sem comunicação com o servidor'), // message
                            function () {
                            }, // callback
                            _tr('Vendas'), // title
                            'Ok'                  // buttonName
                            );
                });

            });






















            $("#rl_refresh").on("click", function () {
                var dini = $("#rl_datai").val();
                var dfim = $("#rl_dataf").val();
                var hoje = (((new Date()).toISOString()).substr(0, 10)).replace('-', '');
                var lnota = $("#rl_nota").prop("checked");

                if ($("#rl_divida").prop("checked")) {
                    if (!ncliente || ncliente == 0) {
                        return;
                    }
                    var nespera = bootbox.espera({
                        message: _tr('Consultando o servidor') + " ...",
                        MostraTempo: true
                    });

                    $.ajax({
                        method: "POST",
                        url: curl + "cliente.php",
                        async: true,
                        cache: false,
                        timeout: nTimeOut * 3,
                        data: {sid: sid, modo: "VEDIVIDA"
                            , cliente: ncliente
                        }
                    }).done(function (e) {
                        var aret = JSON.parse(e);
                        nespera.modal("hide");
                        if (!VeSid(aret)) {
                            return false;
                        }
                        $("#rl_credito").hide();

                        if (aret.erro !== '00') {
                            navigator.notification.alert(
                                    aret.cerro + "-.", // message
                                    function () {
                                        //$("#rl_emissao").html(" Relatórios de vendas  ");
                                        //$("#rl_tabela").html("");
                                    }, // callback
                                    _tr('Vendas'), // title
                                    'Ok'                  // buttonName
                                    );
                            return false;
                        }

                        //                                            $("#rl_emissao").html(" " + _tr("Emissão") + ": " + aret.emissao);
                        $("#rl_emissao").html("");

                        $("#rl_tabela").html(aret.tabela);
                        return false;
                    }).fail(function (e, d) {
                        nespera.modal("hide");
                        $("#rl_emissao").html("");
                        $("#rl_tabela").html("");
                        navigator.notification.alert(
                                _tr('Sem comunicação com o servidor'), // message
                                function () {
                                }, // callback
                                _tr('Vendas'), // title
                                'Ok'                  // buttonName
                                );
                    });

                } else {
                    if (parseInt(dini.replace("-", "")) > parseInt(dfim.replace("-", "")) || parseInt(dini.replace("-", "")) > hoje || parseInt(dfim.replace("-", "")) > hoje) {
                        navigator.notification.alert(
                                _tr("As datas são inválidas"), // message
                                function () {
                                }, // callback
                                _tr('Vendas'), // title
                                'Ok'                  // buttonName
                                );
                        return false;
                    }
                    //dini='2012-01-01';
                    //dfim='2018-02-28';

                    var di = new Date(dini + " 00:00:01");
                    var df = new Date(dfim + " 00:00:01");

                    var ndias = parseInt((df - di) / (24 * 3600 * 1000));
                    if (ndias > (lnota ? 2 : 62) && !$("#rl_datai").attr("disabled") ) {
                        navigator.notification.alert(
                                _tr("Periodo permitido é apenas") + " 2 " + (lnota ? "dias" : "meses"), // message
                                function () {
                                }, // callback
                                _tr('Vendas'), // title
                                'Ok'                  // buttonName
                                );
                        return false;
                    }

                    var nespera = bootbox.espera({
                        message: _tr('Consultando o servidor') + " ...",
                        MostraTempo: true
                    });



                    $.ajax({
                        method: "POST",
                        url: curl + "vendas.php",
                        async: true,
                        cache: false,
                        timeout: nTimeOut * 3,
                        data: {sid: sid, vendedor: vendedor
                            , lj_preco: lj_preco
                            , modo: "NOTA_REFRESH"
                            , hini: <?php echo "'" . GetConfig("rlini") . "'\n"; ?>
                            , hfim: <?php echo "'" . GetConfig("rlfim") . "'\n"; ?>
                            , credito: <?php echo GetConfig("rlcredito") . "\n"; ?>
                            , lveiculo: <?php echo GetConfig("vei") . "\n"; ?>
                            , dini: dini
                            , dfim: dfim
                            , orcamento: lorc
                            , serie: nserie
                            , nota: lnota
                        }
                    }).done(function (e) {
                        var aret = JSON.parse(e);
                        nespera.modal("hide");
                        if (!VeSid(aret)) {
                            return false;
                        }
                        if (aret.credito) {
                            $("#rl_credito").html(" " + _tr("Creditos") + ": " + aret.credito);
                            $("#rl_credito").show();
                        } else {
                            $("#rl_credito").hide();

                        }
                        if (aret.erro == '20') {
                            navigator.notification.alert(
                                    aret.cerro + "-.", // message
                                    function () {
                                        //$("#rl_emissao").html(" Relatórios de vendas  ");
                                        //$("#rl_tabela").html("");
                                    }, // callback
                                    _tr('Vendas'), // title
                                    'Ok'                  // buttonName
                                    );
                            return false;
                        }
                        if (aret.erro != '00') {
                            navigator.notification.alert(
                                    aret.cerro + "-..", // message
                                    function () {
                                        $("#rl_emissao").html("");
                                        $("#rl_tabela").html("");
                                    }, // callback
                                    _tr('Vendas'), // title
                                    'Ok'                  // buttonName
                                    );
                            return false;
                        }
                        $("#rl_emissao").html(" " + _tr("Emissão") + ": " + aret.emissao);

                        $("#rl_tabela").html(aret.tabela);
                        aNotaV = aret.antv;
                        return false;
                    }).fail(function (e, d) {
                        nespera.modal("hide");
                        $("#rl_emissao").html("");
                        $("#rl_tabela").html("");
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
            $("#cl_btcancelari,#cl_btcancelara").on("click", function () {
                ncliente = 0;
                nguia = 0;
                MudaCampo();
                $("#cl_buscar_cod").click();
            });
            $("#lj_buscar_notaalt").on("click", function () {
                if (aprodutos.length > 0) {
                    navigator.notification.alert(
                            _tr('Nota já iniciada'), // message
                            function () {
                                $("#lj_loja").focus();
                                return false;
                            }, // callback
                            _tr('Vendas'), // title
                            'Ok'                  // buttonName
                            );
                    return false;
                }
                if ($("#lj_notaalt").val() == "0") {
                    $("#lj_notaalt").val("");
                }
                if ($("#lj_notaalt").val()) {
                    AlteraNota();
                    return;
                }
                if (nloja == 0) {
                    navigator.notification.alert(
                            _tr('Escolha uma loja para consultar notas'), // message
                            function () {
                                $("#lj_loja").focus();
                                return false;
                            }, // callback
                            _tr('Vendas'), // title
                            'Ok'                  // buttonName
                            );
                    return false;
                }
                VeNotas();
                return false;
            });
            $("#lj_notaalt").on("blur", AlteraNota);
            function AlteraNota1(nNota) {
                $('#lj_modal').modal('hide')
                $('#lj_notaalt').val(nNota);
                AlteraNota();
            }
            function AlteraNota() {
                if (!$("#lj_notaalt").val()) {
                    return false;
                }
                if (aprodutos.length > 0) {
                    navigator.notification.alert(
                            _tr('Nota já iniciada. Impossível alterar outra'), // message
                            function () {
                                $("#lj_notaalt").val("");
                                return false;
                            }, // callback
                            _tr('Vendas'), // title
                            'Ok'                  // buttonName
                            );
                    return false;
                }
                if (!vedigito($("#lj_notaalt").val())) {
                    navigator.notification.alert(
                            _tr('Nota Inválida'), // message
                            function () {
                                $("#lj_notaalt").val("");
                                return false;
                            }, // callback
                            _tr('Vendas'), // title
                            'Ok'                  // buttonName
                            );
                    return false;

                }
                lorc = false;
                $.ajax({
                    method: "POST",
                    url: curl + "vendas.php",
                    async: false,
                    cache: false,
                    timeout: nTimeOut,

                    data: {sid: sid, lj_preco: lj_preco, vendedor: vendedor, orcamento: lorc, serie: nserie, modo: "ALTERA_NOTA", nota: $("#lj_notaalt").val()}
                }).done(function (e) {
                    var aret = JSON.parse(e);
                    if (!VeSid(aret)) {
                        return false;
                    }
                    if (aret.erro != '00') {
                        navigator.notification.alert(
                                aret.cerro + "-...", // message
                                function () {
                                    $("#lj_notaalt").val("");
                                }, // callback
                                _tr('Vendas'), // title
                                'Ok'                  // buttonName
                                );
                        return false;
                    }
                    nNotaAlt = $("#lj_notaalt").val();
                    CarregaNota();
                    $("#lj_notaalt").val(nNotaAlt);

                    navigator.notification.alert(
                            _tr("Nota") + " " + $("#lj_notaalt").val() + " " + _tr("deletada\nNota agora em alteração."), // message
                            function () {
                                //$("#lj_notaalt").val("");
                                $('.nav-tabs a[href="#venda"]').tab('show')
                            }, // callback
                            _tr('Vendas'), // title
                            'Ok'                  // buttonName
                            );
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
            ;
            $("#pd_anterior").on('click', function () {
                $("#cl_modal_cab").html(_tr("Selecione um produto"));

                var cstr = '<table class="table table-striped">';
                cstr = cstr + "<tr><th colspan=2>Código</th><th>Descrição</th></tr>";
                for (var i = 0; i < 20; i++) {

                    if (window.localStorage.getItem("cecvendas" + nempresa + "_hisc_" + i) && window.localStorage.getItem("cecvendas" + nempresa + "_hisc_" + i) !== "null") {
                        cstr = cstr + '<tr style="font-size: ' + $(".tabprod").css("font-size") + '"><td>#' + (i + 1) + '<input type="radio" name="pd_historico" onclick="VeHistorico(' + window.localStorage.getItem("cecvendas" + nempresa + "_hisc_" + i) + ');$(\'#cl_modal\').modal(\'hide\');">';
                        cstr = cstr + '</td><td>' + poedigito(window.localStorage.getItem("cecvendas" + nempresa + "_hisc_" + i)) + '</td><td>' + window.localStorage.getItem("cecvendas" + nempresa + "_hisn_" + i) + '</td></tr>';
                    }
                    /*
                     if (veconfig["hisc_" + i] && veconfig["hisc_" + i] !== "null") {
                     cstr = cstr + '<tr style="font-size: ' + $(".tabprod").css("font-size") + '"><td>#' + (i + 1) + '<input type="radio" name="pd_historico" onclick="VeHistorico(' + veconfig["hisc_" + i] + ');$(\'#cl_modal\').modal(\'hide\');">';
                     cstr = cstr + '</td><td>' + poedigito(window.localStorage.getItem("cecvendas" + nempresa + "_hisc_" + i)) + '</td><td>' + veconfig["hisn_" + i] + '</td></tr>';
                     }
                     */
                }
                cstr = cstr + "</table>";
                $("#cl_modal_corpo").html(cstr);
                $("#cl_modal").modal('show');
                return false;

            });
            function VeHistorico(ncod) {
                $("#pd_rbcodigo_c").prop('checked', true);
                //$("#pd_ckcodigo").prop('checked', true);
                $("#pd_nome").css("display", "none");
                $("#pd_codigo").css("display", "block");
                $("#pd_codigo").val(poedigito(ncod));
                $("#pd_buscar").click();
            }
            document.getElementById("ht_codigo").addEventListener("keydown", function () {
                const key = event.key;
                if (key === "Backspace") {
                    FiltraHistorico(1);
                    return false;
                }
            });
            document.getElementById("ht_nota").addEventListener("keydown", function () {
                const key = event.key;
                if (key === "Backspace") {
                    FiltraHistorico(2);
                    return false;
                }
            });

            document.getElementById("cordova-dialog-buttons").addEventListener("keydown", function () {
                if (event.key === "Enter" || event.keyCode === 13) {
                    const firstButton = this.querySelector("button");
                    if (firstButton) {
                        firstButton.click();
                    }
                }
            }
            );




            $("#ht_codigo,#ht_nota").on('keyup', function (e) {

                //if ((e.which >= 48 && e.which <= 57)) {
                FiltraHistorico(0);
                return true;
                //}
                //return false;
            });
            $("#cl_cpf").on("keyup", function (e) {
                if ($("#cl_cpf").val().length >= 11 && !isCPF($("#cl_cpf").val())) {
                    navigator.notification.alert(
                            _tr('CPF inválido'), // message
                            function () {
                                $("#cl_cpf").val("");
                            }, // callback
                            _tr('Vendas'), // title
                            'Ok'                  // buttonName
                            );
                }
                if ((e.which == 13) || (e.which == 9) || (e.keyCode == 13) || (e.keyCode == 9)) {
                    var cid = $(this).attr("id");
                    var cval = $(this).val();
                    if ($("#cl_rg").val()) {
                        return;
                    }
                    $("#cl_buscar_cod").click();
                }
            });
            $("#cl_codigo,#cl_rg,#cl_nome,#cl_mail").on("keyup", function (e) {
                if ((e.which == 13) || (e.which == 9) || (e.keyCode == 13) || (e.keyCode == 9)) {
                    var cid = $(this).attr("id");
                    var cval = $(this).val();
                    if ((cid == "cl_nome" || cid == "cl_mail") && ($("#cl_rg").val() || $("#cl_cpf").val())) {
                        return;
                    }
                    $("#cl_buscar_cod").click();
                }
            });

            $("#pd_codigo,#pd_nome").on('keyup', function (e) {
                if ((e.which == 13)) {
                    $("#pd_buscar").focus();
                    $("#pd_buscar").click();
                } else {
                    $("#pd_table").html("");
                }
                return true;
            });

            $("#pd_autoriza_inc").on("click", function () {
                if (lAutVendas) {
                    AutorizaIncG();
                } else {
                    AutorizaInc();
                }
            });
            $("#pd_autoriza_can").on("click", AutorizaCan);


            $("[id^=cl_btimagem]").click(function () {
                var nesta = ($(this).attr("id")).substr(-1);
                if ($("#cl_incluir").css("display") == "block" || $("#cl_alterar").css("display") == "block") {
                    navigator.notification.alert(
                            _tr("Salve os dados antes de carregar uma imagem"), // message
                            function () {
                            }, // callback
                            _tr('Vendas'), // title
                            'Ok'                  // buttonName
                            );
                    $("#lj_ck_n" + nesta).prop("checked", false);
                    $("#lj_ck_n" + (3 - nesta)).prop("checked", true);
                    return false;
                }
                CarregaImagem(nesta);
            });
            $("[id^=cl_btocrc]").click(function () {
                var nesta = ($(this).attr("id")).substr(-1);
                CarregaImagemOcr(nesta);
            });
            $("[id^=cl_btocrf]").click(function () {
                var nesta = ($(this).attr("id")).substr(-1);
                CarregaImagemOcrF(nesta);
            });
            $("#cl_btsaveocr").click(function () {
                var cimg1 = $("#ocr_img1").prop("src");
                var cimg2 = $("#ocr_img1").prop("src");
                if (!cimg1 && !cimg2) {
                    navigator.notification.alert(
                            _tr("Carregue pelo menos a primeira imagem"), // message
                            function () {
                            }, // callback
                            _tr('Vendas'), // title
                            'Ok'                  // buttonName
                            );
                    return false;
                }
                EnviaImagemOcr(cimg1, cimg2, 1);
            });
            $("#vc_img_inc").click(function () {
                VeiculoFoto();
                //VeiculoLeFoto();
            });

            function DelVeiImg(nrecno) {
                //navigator.vibrate(1000);
                navigator.notification.confirm(
                        _tr("Remover a Imagem") + "  ?", // message
                        function (e) {
                            if (e == 2) {
                                $.ajax({
                                    method: "POST",
                                    url: curl + "veiculo.php",
                                    cache: false,
                                    timeout: nTimeOut,
                                    data: {sid: sid, modo: "VEIMGDEL", recno: nrecno}
                                }).done(function (e) {
                                    $("#vc_imagem").modal("hide");
                                    VeiculoLeFoto();
                                }).fail(function (e, d) {
                                    navigator.notification.alert(
                                            _tr('Sem comunicação com o servidor'), // message
                                            function () {
                                            }, // callback
                                            _tr('Veiculo'), // title
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
            var lTamOriginal = 0;
            function VeVeiImg(nrecno) {

                $.ajax({
                    method: "POST",
                    url: curl + "veiculo.php",
                    cache: false,
                    timeout: nTimeOut,
                    data: {sid: sid, modo: "VEIMGRECNO", recno: nrecno}
                }).done(function (e) {
                    var aret = JSON.parse(e);
                    if (aret.erro != '00') {
                        navigator.notification.alert(
                                aret.cerro + "-....", // message
                                function () {

                                }, // callback
                                _tr('Veiculo'), // title
                                'Ok'                  // buttonName
                                );
                        return false;
                    }
                    $("#vc_imagem_del").attr("onClick", "DelVeiImg(" + nrecno + ")");
                    $("#vc_imagem_obs").html(aret.obs);
                    $("#vc_imagem_img").css("height", "auto");
                    $("#vc_imagem_img").css("width", "100%");
                    $("#vc_imagem_img").attr("src", "data:image/png;base64," + aret.img);
                    $("#vc_imagem").modal("show");
                    lTamOriginal = 0;
                    return false;
                }).fail(function (e, d) {
                    navigator.notification.alert(
                            _tr('Sem comunicação com o servidor') + ' - ' + _tr('Finalizar') + ' \n' + d + "\n" + f, // message
                            function () {
                            }, // callback
                            _tr('Veiculo'), // title
                            'Ok'                  // buttonName
                            );
                });




            }
            function MudaImgTam() {
                var atamanho = ["200%", "300%", "400%", "500%", "600%", "", "100%"];
                $("#vc_imagem_img").css("width", atamanho[lTamOriginal]);
                lTamOriginal++;
                if (lTamOriginal > 6) {
                    lTamOriginal = 0;
                }
            }
            function VeiculoLeFoto() {
                $.ajax({
                    method: "POST",
                    url: curl + "veiculo.php",
                    cache: false,
                    timeout: nTimeOut,
                    data: {sid: sid, modo: "VEIMG", placa: $("#vc_placa").val()}
                }).done(function (e) {
                    var aret = JSON.parse(e);
                    if (aret.erro != '00') {
                        navigator.notification.alert(
                                aret.cerro + "-....", // message
                                function () {

                                }, // callback
                                _tr('Veiculo'), // title
                                'Ok'                  // buttonName
                                );
                        return false;
                    }
                    var csaida = '';
                    var k = 0
                    for (var i = 0; i < (aret.img).length; i++) {
                        if (k % 4 == 0) {
                            if (k > 0) {
                                csaida = csaida + "</div>";
                            }
                            csaida = csaida + '<div class="row text-center" style="padding: 5px;">';
                        }
                        csaida = csaida + "<div class='col-xs-3 text-center'><img onclick='VeVeiImg(" + aret.img[i][3] + ")' src='data:image/png;base64," + aret.img[i][2] + "' width='50'/></div>"
                        k++;
                    }
                    if (k > 0) {
                        csaida = csaida + "</div>";
                    }
                    $("#vc_img").html(csaida);
                    return false;
                }).fail(function (e, d) {
                    navigator.notification.alert(
                            _tr('Sem comunicação com o servidor') + ' - ' + _tr('Finalizar') + ' \n' + d + "\n" + f, // message
                            function () {
                            }, // callback
                            _tr('Veiculo'), // title
                            'Ok'                  // buttonName
                            );
                });
            }
            $("#fn_finalizar").click(Finaliza);
            /*    
             $("#pd_codigo").keyup(function () {
             $("#pd_table").html("");
             });
             $("#pd_nome").keyup(function () {
             $("#pd_table").html("");
             });
             */
            $("#pd_codigo").mask("#############", {reverse: false});
            //$("#pd_nome").mask("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", {reverse: false});
            //$("#vc_placa").mask("AAAAAAAA", {reverse: false});


            //$("#pd_ckcodigo").change(function () {
            $("#pd_rbcodigo_c,#pd_rbcodigo_r,#pd_rbcodigo_d,#pd_rbcodigo_dc,#pd_rbcodigo_da").change(function () {
                $("#pd_nome").val("");
                $("#pd_codigo").val("");
                //if ($("#pd_ckcodigo").prop("checked")) {
                if ($("#pd_rbcodigo_c").prop("checked")) {
                    $("#pd_codigo").css("display", "block");
                    $("#pd_codigo").focus();
                    $("#pd_nome").css("display", "none");
                } else {
                    $("#pd_codigo").css("display", "none");
                    $("#pd_nome").css("display", "block");
                    $("#pd_nome").focus();
                }
            });

            // Atalhos da consulta de produtos:
            // Alt+C seleciona Código e Alt+D seleciona Descrição.
            $(document).off("keydown.pdAtalhos").on("keydown.pdAtalhos", function (e) {
                if (!e.altKey || e.ctrlKey || e.metaKey || !$("#produtos").hasClass("active")) {
                    return;
                }

                var tecla = String(e.key || "").toLowerCase();
                var controle = tecla === "c" ? "#pd_rbcodigo_c" :
                        tecla === "d" ? "#pd_rbcodigo_d" : "";

                if (!controle) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();
                if (!$(controle).prop("checked")) {
                    $(controle).trigger("click");
                } else {
                    $(tecla === "c" ? "#pd_codigo" : "#pd_nome").focus();
                }
            });
            $("#cl_cep").blur(VeCepWeb);

            $("#cl_pais").change(function () {
                if (this.value == "BRA") {
                    $("#cl_celular").mask("(00) 00000-0000", {reverse: false});
                    $("#cl_whats").mask("(00) 00000-0000", {reverse: false});
                    $("#cl_telefone").mask("(00) 0000-0000", {reverse: false});

                    $("#cl_celular").attr("placeholder", "(DD) 12345-6789");
                    $("#cl_whats").attr("placeholder", "(DD) 12345-6789");
                    $("#cl_telefone").attr("placeholder", "(DD) 1234-5678");

                    $("#cl_cep").prop("disabled", false);
                } else if (this.value == "PGY") {
                    $("#cl_celular").mask("(000) 000-000", {reverse: false});
                    $("#cl_whats").mask("(000) 000-000", {reverse: false});
                    $("#cl_telefone").mask("(00) 000000000", {reverse: false});

                    $("#cl_celular").attr("placeholder", "(DDD) 123-456");
                    $("#cl_whats").attr("placeholder", "(DDD) 123-456");
                    $("#cl_telefone").attr("placeholder", "(DD) 12345678");
                    $("#cl_cep").prop("disabled", false);
                } else {
                    $("#cl_celular").prop("data-mask", "0000000000000");
                    $("#cl_whats").prop("data-mask", "0000000000000");
                    $("#cl_telefone").prop("data-mask", "0000000000000");

                    $("#cl_celular").attr("placeholder", "123456789012");
                    $("#cl_whats").attr("placeholder", "123456789012");
                    $("#cl_telefone").attr("placeholder", "123456789012");


                    $("#cl_cep").prop("disabled", true);
                    $("#cl_cep").val("");
                }
            });

            $("#cl_btsalvar_alt").click(function () {
                AltCli(false);
            });
            $("#cl_btsalvar_inc").click(function () {
                AltCli(true);

            });
            $("#cl_btalterar").click(AlteraCliente);
            $("#vc_buscar_marca,#vc_buscar_modelo,#vc_buscar_cor").click(function () {
                var cnome = ($(this).attr("id")).substr(10);
                var nespera = bootbox.espera({
                    message: _tr('Consultando ...'),
                    MostraTempo: true,
                    colorType: "info"
                });

                $.ajax({
                    method: "POST",
                    url: curl + "veiculo.php",
                    cache: false,
                    timeout: nTimeOut,
                    data: {sid: sid, modo: "VE" + cnome, marca: $("#vc_marca").val()}
                }).done(function (e) {
                    var aret = JSON.parse(e);
                    nespera.modal('hide');
                    if (!VeSid(aret)) {
                        return false;
                    }
                    if (aret.erro != '00') {
                        navigator.notification.alert(
                                aret.cerro + "-....", // message
                                function () {

                                }, // callback
                                _tr('Vendas'), // title
                                'Ok'                  // buttonName
                                );
                        return false;
                    }
                    $('#vc_buscar').empty();

                    $('#vc_buscar').append($('<option>', {
                        value: "",
                        text: ""
                    }));


                    for (var i = 0; i < (aret.dados).length; i++) {
                        $('#vc_buscar').append($('<option>', {
                            value: aret.dados[i],
                            text: aret.dados[i]
                        }));
                    }
                    $('#vc_buscar').show().focus().click();
                    $('#vc_buscar').attr("size", (aret.dados).length);
                    $('#vc_modal_cab').html("Selecione : ");
                    $("#vc_buscar_tipo").val(cnome);
                    $('#vc_modal').modal("show");

                    return false;
                }).fail(function (e, d) {
                    nespera.modal("hide");
                    navigator.notification.alert(
                            _tr('Sem comunicação com o servidor') + ' - ' + _tr('Finalizar') + ' \n' + d + "\n" + f, // message
                            function () {
                            }, // callback
                            _tr('Veiculo'), // title
                            'Ok'                  // buttonName
                            );
                });

            });
            $("#vc_buscar").change(function () {
                $("#vc_" + $("#vc_buscar_tipo").val()).val($("#vc_buscar").val());
                $("#vc_modal").modal("hide");
                return false;
            });
            $("#vc_salvar").click(function () {
                if (VeVeiculo()) {
                    MudaCampo();
                }
                return true;
            });
            function VeVeiculo() {
                var cmen = "";
                if (!$("#vc_placa").val()) {
                    cmen = cmen + _tr("Informe:") + " " + _tr("Placa:") + " \n";
                }
                if (!$("#vc_marca").val()) {
                    cmen = cmen + _tr("Informe:") + " " + _tr("Marca:") + " \n";
                }
                if (!$("#vc_modelo").val()) {
                    cmen = cmen + _tr("Informe:") + " " + _tr("Modelo:") + " \n";
                }
                if (!$("#vc_cor").val()) {
                    cmen = cmen + _tr("Informe:") + " " + _tr("Cor:") + " \n";
                }
                if ($("#vc_ano").val() + 0 < 1930) {
                    cmen = cmen + _tr("Informe:") + " " + _tr("Ano:") + " \n";
                }
                if ($("#vc_kilomet").val() + 0 <= 0) {
                    cmen = cmen + _tr("Informe:") + " " + _tr("Km:") + " \n";
                }
                if ($("#vc_classe").val() + 0 == 0) {
                    cmen = cmen + _tr("Informe:") + " " + _tr("Classe:") + " \n";
                }
                if (cmen) {
                    navigator.notification.alert(
                            _tr(cmen), // message
                            function () {
                                return true;
                            }, // callback
                            _tr('Veículo'), // title
                            'Ok'                  // buttonName
                            );
                    return false;
                }
                return true;
            }
            $("#vc_buscar_placa").click(function () {
                var cplaca = $("#vc_placa").val();
                $("#vc_salvar").hide();
                $("#vc_det").css("display", "none");
                $("#vc_img").html("");

                if (cplaca.length < 6) {
                    navigator.notification.alert(
                            _tr("Informe a placa do Veículo com no mínimo 6 caracteres/números"), // message
                            function () {
                            }, // callback
                            _tr('Veículo'), // title
                            'Ok'                  // buttonName
                            );
                    $("#vc_det" + nesta).css("display", "none");
                    return false;
                }
                cplaca = cplaca.toUpperCase().trim();
                if (cplaca !== cplaca.replace(/[^a-z0-9]/gi, '')) {
                    navigator.notification.alert(
                            _tr("Caracteres inválidos na Placa"), // message
                            function () {
                            }, // callback
                            _tr('Veículo'), // title
                            'Ok'                  // buttonName
                            );
                    $("#vc_det").css("display", "none");
                    return false;
                }
                var nespera = bootbox.espera({
                    message: _tr('Consultando ...'),
                    MostraTempo: true,
                    colorType: "info"
                });

                $.ajax({
                    method: "POST",
                    url: curl + "veiculo.php",
                    cache: false,
                    timeout: nTimeOut,
                    data: {sid: sid, modo: "VEPLACA", placa: cplaca}
                }).done(function (e) {
                    var aret = JSON.parse(e);
                    nespera.modal('hide');
                    if (!VeSid(aret)) {
                        return false;
                    }
                    if (aret.erro != '00') {
                        navigator.notification.alert(
                                aret.cerro + "-....", // message
                                function () {

                                }, // callback
                                _tr('Vendas'), // title
                                'Ok'                  // buttonName
                                );
                        return false;
                    }
                    if (aret.vei.placa) { //tem a placa
                        $("#vc_ano").val(aret.vei.ano);
                        $("#vc_classe").val(aret.vei.classe);
                        $("#vc_cor").val(aret.vei.cor);
                        $("#vc_kilomet").val(aret.vei.kilomet);
                        $("#vc_modelo").val(aret.vei.modelo);
                        $("#vc_marca").val(aret.vei.marca);
                        $("#vc_tipo").val(aret.vei.tipo);
                        $("#vc_det").css("display", "block");

                        $("#vc_ano").prop("disabled", true);
                        $("#vc_classe").prop("disabled", true);
                        $("#vc_cor").prop("disabled", true);
                        $("#vc_kilomet").prop("disabled", false);
                        $("#vc_modelo").prop("disabled", true);
                        $("#vc_marca").prop("disabled", true);
                        $("#vc_tipo").prop("disabled", true);

                        $("#vc_buscar_marca").prop("disabled", true);
                        $("#vc_buscar_modelo").prop("disabled", true);
                        $("#vc_buscar_cor").prop("disabled", true);

                        if (!$("#cl_codigo").val()) {
                            $("#cl_codigo").val(aret.vei.cliente);
                            $("#cl_buscar_cod").click();
                        }
                        $("#vc_salvar").show();
                        $("#vc_salvar").click();
                        VeiculoLeFoto();
                        return false;
                    } else {
                        $("#vc_ano").prop("disabled", false);
                        $("#vc_classe").prop("disabled", false);
                        $("#vc_cor").prop("disabled", false);
                        $("#vc_kilomet").prop("disabled", false);
                        $("#vc_modelo").prop("disabled", false);
                        $("#vc_marca").prop("disabled", false);
                        $("#vc_tipo").prop("disabled", false);
                        $("#vc_det").css("display", "block");

                        $("#vc_buscar_marca").prop("disabled", false);
                        $("#vc_buscar_modelo").prop("disabled", false);
                        $("#vc_buscar_cor").prop("disabled", false);

                        $("#vc_ano").val("");
                        $("#vc_classe").val("");
                        $("#vc_cor").val("");
                        $("#vc_kilomet").val("");
                        $("#vc_modelo").val("");
                        $("#vc_marca").val("");
                        $("#vc_tipo").val("");

                        navigator.notification.alert(
                                _tr("Placa não localizada."), // message
                                function () {
                                }, // callback
                                _tr('Veículo'), // title
                                'Ok'                  // buttonName
                                );
                        $("#vc_salvar").show();
                        VeiculoLeFoto();
                        return false;

                    }
                }).fail(function (e, d) {
                    nespera.modal("hide");
                    navigator.notification.alert(
                            _tr('Sem comunicação com o servidor') + ' - ' + _tr('Finalizar') + ' \n' + d + "\n" + f, // message
                            function () {
                            }, // callback
                            _tr('Veiculo'), // title
                            'Ok'                  // buttonName
                            );
                });




            });
            $("#cl_buscar_cod").click(function () {
                var ncli = 0;
                if ($("#cl_codigo").val()) {
                    ncli = parseInt($("#cl_codigo").val());
                }
                VeCliente(ncli, $("#cl_rg").val(), $("#cl_mail").val(), $("#cl_nome").val(), false, $("#cl_cpf").val());
                return false;
            });

            $("#cl_limpar").click(LimpaCli);

            $("#pd_camara").click(PdCamara);

            $("#pd_buscar").click(PdBuscar);

            $("[id^='lj_ck_m']").change(function () {
                MudaMoeda(this.value);
            });
            $("[id^='lj_ck_n']").change(function () {
                var nesta = ($(this).attr("id")).substr(-1);
                if (aprodutos.length > 0) {
                    navigator.notification.alert(
                            _tr("Não pode ser mudada a nacionalidade após produtos inseridos. Elimine os produtos da nota ou a reinicie"), // message
                            function () {
                            }, // callback
                            _tr('Vendas'), // title
                            'Ok'                  // buttonName
                            );
                    $("#lj_ck_n" + nesta).prop("checked", false);
                    $("#lj_ck_n" + (3 - nesta)).prop("checked", true);

                    return false;
                }
                MudaNacionalidade($(this).prop("id") == "lj_ck_n1" ? 1 : 2);

            });
            $("[id^='lj_ck_p']").change(function () {
                MudaPagamento($(this).prop("id") == "lj_ck_p3" ? 3 : ($(this).prop("id") == "lj_ck_p2" ? 2 : 1));
                if ($('#lj_ck_p3').prop("checked")) {
                    $("#lj_prazo").show();
                } else {
                    $("#lj_prazo").hide();
                }

            });
            $("#lj_loja").change(MudaLoja);
            $("#lj_lojacor").change(MudaLojaCor);

            $("#vd_quant_quant").mask("####", {reverse: true});
            $('#vd_quant_valor').mask('######0,00', {reverse: true});

            //numnotas = parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_ntsimult"));
            numnotas = veconfig["ntsimult"];
            if (!numnotas || numnotas == 0) {
                numnotas = 1;
            }
            if (numnotas > 4) {
                numnotas = 4;
            }
            $('#mn_nota').empty();
            for (var i = 1; i <= numnotas; i++) {
                $('#mn_nota').append($('<option>', {
                    value: i,
                    text: "Pd " + i
                }));
            }
            if (numnotas > 1) {
                $("#mn_menu_nota").show();
            }
            /*
             CarregaCliente();
             
             ReIniciar();
             CarregaNota();
             //VeEstatus();
             AjustaFonte();
             VeAutorizadores();
             */
            $("span").each(function () {
                var cid = $(this).attr("id");
                if (cid && cid.substr(0, 3) == 'id_') {
                    _tr($("#" + cid).html(), cid);
                }
            });
            $("#pg_inicio").css("display", "none");
            $("#pg_principal").css("display", "block");


            function Localizacao1(lfinal, nTempo, nTempoLocal) {
                var nTimeOut = 10000;
                if (!lfinal) {
                    lfinal = false;
                }
                if (lfinal && !veconfig["loc_fin"]) {
                    return false;
                }
                if (!lfinal && !veconfig["loc_ini"]) {
                    return false;
                }
                if (nTempo) {
                    nTimeOut = nTempo * 1000;
                }
                var options = {
                    enableHighAccuracy: false,
                    maximumAge: (nTempoLocal ? nTempoLocal : 5) * 60 * 1000, // 3 minutos da posicao
                    timeout: nTimeOut // tempo de espera
                }
                var watchID = navigator.geolocation.getCurrentPosition(function (position) {
                    var clocal = "Lat:" + position.coords.latitude + ",Lon:" + position.coords.longitude + ",Pre:" + position.coords.accuracy + ",Tmp:";

                    clocal = clocal + new Date().toISOString().slice(0, 19);
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
                }, options);
            }
            //Localizacao1(false);
            CarregaCliente();
            if (nModoOpe == 0) {
                ReIniciar();
                CarregaNota();
            } else {
                ReIniciarCaixa(false);
                CarregaCaixa();
                VeCambio();
                nAjustaLock = setInterval(AjustaLock, 20000);
            }
            //VeEstatus();
            AjustaFonte();
            VeAutorizadores();
            VeEstatus();
            var naux = window.localStorage.getItem("cecvendas" + nempresa + "_quant_con");
            if (!naux) {
                naux = 50;
            }
            $("#pd_quant_con").val(naux);

            $("#cx_pix_rec").hide();
            ncx_pix = veconfig[ "cx_pix"];
            if (nModoOpe == 1) { //caixa
                if (ncx_pix > 0) {
                    $("#cx_pix_rec").show();
                }
                $('.nav-tabs a[href="#CaixaPix"]').click();
            }
            nLocalizacao = veconfig["loc_temp"] * 60 * 1000;

            if (nLocalizacao) {
                setTimeout(AtivaLocation, 5000);
            }
            var ostream;
            $("#cl_frente,#cl_verso,#cl_cl_frente,#cl_cl_verso").click(function () {
                let cindex = ($(this).attr("id").substr(0, 5) == "cl_cl" ? "cl_" : "");
                let cmodo = ($(this).prop("id") == cindex + "cl_frente" ? "F" : "V");
                $("#" + cindex + "cl_capturaF,#" + cindex + "cl_capturaV,#" + cindex + "cl_dvideoF,#" + cindex + "cl_dvideoV").addClass("hidden");
                $("#" + cindex + "cl_dvideo" + cmodo + ",#" + cindex + "cl_captura" + cmodo).removeClass("hidden");
                const video = document.getElementById(cindex + 'video' + cmodo);
                /*    
                 navigator.mediaDevices.getUserMedia({video: true})
                 .then(s => {
                 ostream = s;
                 video.srcObject = ostream;
                 });
                 */
                $(".ctirarfoto").hide();
                navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: {ideal: "environment"}
                    },
                    audio: false
                })
                        .then(s => {
                            ostream = s;
                            video.srcObject = ostream;
                        })
                        .catch(erro => {
                            console.error("Erro ao abrir câmera:", erro);
                        });
                //   .then(stream => video.srcObject = stream);
                $("#" + cindex + "cl_frente,#" + cindex + "cl_verso").addClass("hidden");

            });
            /*
             async function iniciarCamera(video) {
             try {
             const stream = await navigator.mediaDevices.getUserMedia({
             audio: false,
             video: {
             facingMode: {exact: "environment"}
             }
             });
             
             video.srcObject = stream;
             await video.play();
             
             } catch (erro) {
             console.error("Erro ao abrir câmera:", erro);
             alert(erro);
             }
             }
             */
            function CancelarFoto() {
                $("#cl_capturaF,#cl_capturaV,#cl_dvideoF,#cl_dvideoV,#cl_cl_capturaF,#cl_cl_capturaV,#cl_cl_dvideoF,#cl_cl_dvideoV").addClass("hidden");
                $("#cl_frente,#cl_verso,#cl_cl_frente,#cl_cl_verso").removeClass("hidden");
                ostream.getTracks().forEach(track => track.stop());
                $(".ctirarfoto").show();
                //video.srcObject = null;
            }
            function tirarFoto(cModo, cindex) {
                const canvas = document.getElementById(cindex + 'canvas' + cModo);
                const ctx = canvas.getContext('2d');
                if (cModo == "F") {
                    canvas.width = (cindex ? cl_videoF.videoWidth : videoF.videoWidth);
                    canvas.height = (cindex ? cl_videoF.videoHeight : videoF.videoHeight);
                    ctx.drawImage((cindex ? cl_videoF : videoF), 0, 0, canvas.width, canvas.height);
                    $("#cl_ft_1,#ft_1").prop("src", canvas.toDataURL('image/jpeg', 1.0));
                    canvas.toBlob(function (blob) {
                        enviarImagem(blob, 1);
                    }, 'image/jpeg', 1.0); // qualidade

                } else {
                    canvas.width = (cindex ? cl_videoV.videoWidth : videoV.videoWidth);
                    canvas.height = (cindex ? cl_videoV.videoHeight : videoV.videoHeight);
                    ctx.drawImage((cindex ? cl_videoV : videoV), 0, 0, canvas.width, canvas.height);
                    $("#cl_ft_2,#ft_2").prop("src", canvas.toDataURL('image/jpeg', 1.0));
                    canvas.toBlob(function (blob) {
                        enviarImagem(blob, 2);
                    }, 'image/jpeg', 1.0); // qualidade
                }
                CancelarFoto();
                //const imagem = canvas.toDataURL('image/jpeg', 1.0); // qualidade máxima
            }
            function enviarImagem(blob, nNum) {
                const formData = new FormData();
                let fileName = ncliente + "_" + nNum + "_foto.jpg";

                formData.append('file', blob, fileName);

                fetch(curl + 'upload.php', {
                    method: 'POST',
                    body: formData
                })
                        .then(res => res.text())
                        .then(resp => console.log(resp))
                        .catch(err => console.error(err));
            }
            $('a[href="#produtos"]').on('shown.bs.tab', function () {
                $('#pd_nome').focus();
            });
            $("#pd_saldo,#pd_exato,#pd_promo").click(function () {
                if ($("#pd_rbcodigo_c").prop("checked")) {
                    $("#pd_codigo").focus();
                } else {
                    $("#pd_nome").focus();
                }
            });
            var ntimesid = 9999999;
            function timesid() {
                $.ajax({
                    method: "POST",
                    url: curl + "timesid.php",
                    cache: false,
                    timeout: 2000
                }).done(function (segundos) {
                    ntimesid = segundos;
                    /*
                     if (segundos <= 0) {
                     FechaSid();
                     window.location = "index.php";
                     }
                     segundos = parseInt(segundos / 10) * 10;
                     let h = Math.floor(segundos / 3600);
                     let m = Math.floor((segundos % 3600) / 60);
                     let s = segundos % 60;
                     
                     $("#ft_timer").html(`${String(h).padStart(2, '0')}:` +
                     `${String(m).padStart(2, '0')}:` +
                     `${String(s).padStart(2, '0')}`);
                     });
                     */
                });
            }
            timesid();
            setInterval(timesid, 15000);

            setInterval(function () {
                var segundos = ntimesid;
                var lclick = false;
                ntimesid = ntimesid - 1;
                if (segundos < 2 * 60) {
                    lclick = true;
                    $("#ft_timer").addClass("alert alert-danger blink");
                } else {
                    $("#ft_timer").removeClass("alert alert-danger blink");
                }
                if (segundos <= 0) {
                    FechaSid();
                    //window.location = "index.php";
                    let cimp = imp_web;
                    if (cimp) {
                        cimp = "?IMP=" + cimp.split(",")[1];
                    }
                    window.location.href = "index.php" + cimp;
                }
                //segundos = parseInt(segundos / 10) * 10;
                let h = Math.floor(segundos / 3600);
                let m = Math.floor((segundos % 3600) / 60);
                let s = segundos % 60;

                $("#ft_timer").html("<strong>" + (lclick ? "Clique para continuar" : "") + `${String(h).padStart(2, '0')}:` +
                        `${String(m).padStart(2, '0')}:` +
                        `${String(s).padStart(2, '0')}` + "&nbsp;&nbsp;</strong>");

            }, 1000);
            $("#ft_timer").click(function () {
                $.ajax({
                    method: "POST",
                    url: curl + "timesid.php",
                    cache: false,
                    timeout: 2000,
                    data: {modo: "REFRESH", sid: sid}
                }).done(function (segundos) {
                    //alerta(segundos);
                    ntimesid = segundos;
                });
            });
            $("input").attr("autocomplete", 'new-password');
        </script>



    </body>
</html>
