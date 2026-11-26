function MudaMenu(nmenu) {
    //var nModo = parseInt(window.localStorage.getItem("cecvendas" + nempresa + "_modo"));
    var nModo=0;
    var menu1 = '  <div id=\'tabven\' class="row">\
                    <ul class="nav nav-tabs navbar-left" id="myNavbar">';
    if (nModo == 0) {
        menu1 = menu1 + '<li class="active"><a data-toggle="tab" href="#loja">   <i id="mn_1" class="fas fa-home"               style="font-size: 40px;"></i></a></li>';
    }
    menu1 = menu1 + '<li><a data-toggle="tab" href="#cliente">               <i id="mn_2" class="fas fa-address-card"       style="font-size: 40px;"></i></a></li>';
    if (lFactura ) {
        menu1 = menu1 + '<li><a data-toggle="tab" href="#de_cliente">               <i id="mn_17" class="fas fa-file-invoice-dollar"       style="font-size: 40px;"></i></a></li>';
    }
    menu1 = menu1 + '<li><a data-toggle="tab" href="#de_ocr">               <i id="mn_20" class="fas fa-robot"       style="font-size: 40px;"></i></a></li>';
    if (nModo == 0 && window.localStorage.getItem("cecvendas" + nempresa + "_vei") > 0) {
        menu1 = menu1 + '<li><a data-toggle="tab" href="#veiculo">               <i id="mn_16" class="fas fa-car"       style="font-size: 40px;"></i></a></li>';
    }
    if (nModo == 1) {
        menu1 = menu1 + '<li><a data-toggle="tab" href="#CaixaPix">               <span id="mn_18" class="glyphicon glyphicon-qrcode"       style="font-size: 40px;"></span></a></li>';
        menu1 = menu1 + '<li><a data-toggle="tab" href="#ImpCaixaPix" onclick="javascript:LimpaImp(true)">               <span id="mn_19" class="glyphicon glyphicon-print"       style="font-size: 40px;"></span></a></li>';
    }
    if (nModo == 0) {
        menu1 = menu1 + '<li><a data-toggle="tab" href="#historico">             <i id="mn_9" class="fas fa-history"            style="font-size: 40px;"></i></a></li>\
                        <li><a data-toggle="tab" href="#produtos" >              <i id="mn_4" class="fas fa-barcode"            style="font-size: 40px;"></i></a></li>\
                        <li><a data-toggle="tab" href="#venda" >                 <i id="mn_5" class="fas fa-cart-arrow-down"    style="font-size: 40px;"></i></a></li>\
                        <li><a data-toggle="tab" href="#finalizar">             <i id="mn_6" class="fas fa-credit-card"        style="font-size: 40px;"></i></a></li>\
                        <li ><a data-toggle="tab" href="#relatorio">            <i id="mn_10" class="fas fa-bar-chart"         style="font-size: 40px;"></i></a></li>\
                        <li id="menu_divida"><a data-toggle="tab" href="#divida"> <i id="mn_15" class="fas fa-hand-holding-usd"  style="font-size: 40px;"></i></a></li>\
                        <li><a data-toggle="tab" onclick=\'CarregaNota()\' href="#loja" class="bg-warning text-warning">\
                                <i id="mn_7" class="fas fa-refresh"            style="font-size: 40px;"></i></a></li>\
                        <li><a data-toggle="tab" onclick=\'ReIniciar(true)\' href="#loja" class="bg-danger text-danger">\
                        <i id="mn_8" class="fas fa-close"              style="font-size: 40px;"></i></a></li>\
                        <li><a data-toggle="tab" onclick=\'LogOut(true)\' href="#" class="bg-danger text-danger">\
                        <i id="mn_30" class="fas fa-sign-out-alt"              style="font-size: 40px;"></i></a></li>';
    } else {
        menu1 = menu1 + '<li><a data-toggle="tab" onclick=\'ReIniciarCaixa(true)\' href="#" class="bg-danger text-danger">\
                        <i id="mn_8" class="fas fa-close"              style="font-size: 40px;"></i></a></li>';

    }

    menu1 = menu1 + '    <li id="mn_menu_nota" style="font-size: 40px;float:right; display: none;">\
                            <select id="mn_nota" style="font-size: 40px;">\
                                <option value="1">1</option>\
                                <option value="2">2</option>\
                                <option value="3">3</option>\
                                <option value="4">4</option>\
                            </select>\
                        </li>\
\
                    </ul>\
                </div>\
                <div class="" style="position: fixed;left: 0;\
                     top: 0;\
                     width: 100%;\
                     height: 40px;\
                     z-index: 10;">\
                    <div class="text-left text-primary bg-primary" >\
                        <h3 class="" id="estatus" style="margin-top: 0px;padding-top: 0px;">\
                            ' + (nModo == 0, 'Esperando venda', 'Esperando Caixa') + '\
                        </h3>\
                    </div>\
                </div>\
                <div class="" style="position: fixed;right: 0;\
                     top: 0;\
                     width: auto;\
                     height: 40px;\
                     z-index: 11;">\
                     <span id="m_preco_atac" style="font-size:1.5em;"></span>\
                                <img src="img/consoft_transparent.png" height="53" />\
                    <img src="img/cec_transparent.png" height="53" />   \
                </div>\
\
';
    var menu2 = '<div id="tabven" class="row">\
                    <nav class="navbar navbar-default navbar-left" id="menu-principal" style="">\
                        <div class="navbar-header" >\
                            <button type="button" class="navbar-toggle img_size" onclick="$(\'#myNavbar\').toggle()">\
                                <span class="icon-bar"></span>\
                                <span class="icon-bar"></span>\
                                <span class="icon-bar"></span>\
                            </button>\
                            <span id="mn_menu_nota"  class="navbar-brand"  style="xfont-size: 40px;xfloat:left; display: none;">\
                                <span id="id_ttab_menu_nota">Sessão</span>\
                                <select id="mn_nota" class="navbar-default" style="xfont-size: 40px;">\
                                    <option value="1">1</option>\
                                    <option value="2">2</option>\
                                    <option value="3">3</option>\
                                    <option value="4">4</option>\
                                </select>\
                            </span>\
                        </div>\
\
                        <div class="collapse navbar-collapse" id="myNavbar" >\
                            <ul class="nav navbar-nav" >\
                                <li class="active"><a data-toggle="tab" href="#loja" onclick="$(\'#myNavbar\').toggle()">   <i id="mn_1" class="fas fa-home"               style="font-size: 40px;"></i>\
                                        <span id=\'id_menu_1\'>Home</span></a></li>\
                                <li><a data-toggle="tab" href="#cliente" onclick="$(\'#myNavbar\').toggle()">             <i id="mn_2" class="fas fa-address-card"       style="font-size: 40px;"></i>\
                                        <span id=\'id_menu_2\'>Cliente</span></a></li>';
    if (lFactura) {
        menu2 = menu2 + '<li><a data-toggle="tab" href="#de_cliente" onclick="$(\'#myNavbar\').toggle()">             <i id="mn_2" class="fas fa-file-invoice-dollar"       style="font-size: 40px;"></i>\
                                        <span id=\'id_menu_2\'>Cliente DE</span></a></li>';
    }
    if (window.localStorage.getItem("cecvendas" + nempresa + "_vei") > 0) {
        menu2 = menu2 + '<li><a data-toggle="tab" href="#veiculo" onclick="$(\'#myNavbar\').toggle()">             <i id="mn_2" class="fas fa-car"       style="font-size: 40px;"></i>';
    }
    menu2 = menu2 + '<li><a data-toggle="tab" href="#CaixaPix" onclick="$(\'#myNavbar\').toggle()">             <i id="mn_2" class="fas fa-th"       style="font-size: 40px;"></i>';
    menu2 = menu2 + '<span id=\'id_menu_16\'>Veículo</span></a></li>\
                                <li><a data-toggle="tab" href="#historico" onclick="$(\'#myNavbar\').toggle()">             <i id="mn_9" class="fas fa-history"            style="font-size: 40px;"></i>\
                                        <span id=\'id_menu_3\'>Histórico</span></a></li>\
                                <li><a data-toggle="tab" href="#produtos" onclick="$(\'#myNavbar\').toggle()">              <i id="mn_4" class="fas fa-barcode"            style="font-size: 40px;"></i>\
                                        <span id=\'id_menu_4\'>Produtos</span></a></li>\
                                <li><a data-toggle="tab" href="#venda" onclick="$(\'#myNavbar\').toggle()">                 <i id="mn_5" class="fas fa-cart-arrow-down"    style="font-size: 40px;"></i>\
                                        <span id=\'id_menu_5\'>Venda</span></a></li>\
                                <li><a data-toggle="tab" href="#finalizar" onclick="$(\'#myNavbar\').toggle()">             <i id="mn_6" class="fas fa-credit-card"        style="font-size: 40px;"></i>\
                                        <span id=\'id_menu_6\'>Finalizar</span></a></li>\
                                <li ><a data-toggle="tab" href="#relatorio" onclick="$(\'#myNavbar\').toggle()">            <i id="mn_10" class="fas fa-bar-chart"         style="font-size: 40px;"></i>\
                                        <span id=\'id_menu_10\'>Relatórios</span></a></li>\
                                <li id="menu_divida"><a data-toggle="tab" href="#divida" onclick="$(\'#myNavbar\').toggle()"> <i id="mn_15" class="fas fa-hand-holding-usd"  style="font-size: 40px;"></i>\
                                        <span id=\'id_menu_15\'>Dívidas</span></a></li>\
                                <li><a data-toggle="tab" onclick=\'$("#myNavbar").toggle();CarregaNota()\' href="#loja" >\
                                        <i id="mn_7" class="fas fa-refresh"            style="font-size: 40px;"></i>\
                                        <span id=\'id_menu_7\'>Atualizar</span></a></li>\
                                <li><a data-toggle="tab" onclick=\'$("#myNavbar").toggle();ReIniciar(true)\' href="#loja">\
                                        <i id="mn_8" class="fas fa-close"              style="font-size: 40px;"></i>\
                                        <span id=\'id_menu_8\'>Reiniciar</span></a></li>\
                                <li><a data-toggle="tab" onclick=\'$("#myNavbar").toggle();LogOut(true)\' href="#">\
                                        <i id="mn_30" class="fas fa-sign-out-alt"              style="font-size: 40px;"></i>\
                                        <span id=\'id_menu_8\'>Sair</span></a></li>\
                            </ul>\
                        </div>\
                    </nav>\
                </div>\
                <div class="" style="position: fixed;left: 0;\
                     top: 0;\
                     width: 100%;\
                     height: 40px;\
                     z-index: 10;">\
                    <div class="text-left text-primary bg-primary" >\
                        <h3 class="" id="estatus" style="margin-top: 0px;padding-top: 0px;">\
                            Esperando venda\
                        </h3>\
                    </div>\
                </div>\
';
    if (nmenu == 1) {
        $("#menu1").html(menu1);
    } else if (nmenu == 2) {
        $("#menu1").html(menu2);
    }

    return;
}
