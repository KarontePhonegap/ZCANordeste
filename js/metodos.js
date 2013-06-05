//MÉTODOS. contiene las funciones de las que dependen otros métodos y scripts

//----páginas. estos métodos estan relacionados con distribucción y cambios de página
    
    
    var anchoImagen, tamHeader; 
    //ponen tope a la longitud del texto de las listas
    var maxi, maxisectores; 
    //ajustan el tamaño de los infobubbles (debe hacerse por código)
    var mediaH, mediaW;
    /**
     * DetectarDimensiones. Detecta cuales son las dimensiones de la pantalla para asi obtener el valor adecuado de varias variables
     */
    function DetectarDimensiones(){
        if (window.innerWidth >= 768) {
            tipoDispositivo = "iPad o tablet";
            anchoImagen = 768;

            maxi=30;
            maxisectores= 32;
            mediaW= 350;
            mediaH = 200;
            tamHeader=120;
        }
        else {
            if (window.innerWidth >= 640) {
                tipoDispositivo = "iPhone4";
                anchoImagen = 640;
                maxi=23;
                maxisectores=35;
                mediaW = 300;
                mediaH = 180;
                tamHeader= 100;
            }
            else {
                if (window.innerWidth >= 480) { 
                    tipoDispositivo = "Android grande";
                    anchoImagen = 480;
                    maxi=25;
                    maxisectores=22;
                    mediaW = 270;
                    mediaH = 160;
                    tamHeader=110;
                }
                else {
                    if(window.innerWidth >= 320){
                        tipoDispositivo = "iPhone3 o Android mediano";
                        anchoImagen = 320;
                        maxi=25;
                        maxisectores=25;
                        mediaW= 200;
                        mediaH= 130;
                        tamHeader= 75;
                    }
                    else{
                        tipoDispositivo = "Android pequeño";
                        anchoImagen=240;
                        maxi=24;
                        maxisectores=20;
                        mediaW=180;
                        mediaH= 111;
                        tamHeader= 75;
                    }
                }
            }
        }  
        $('.ui-content').height($('.ui-content').height()-tamHeader);      
    }
    
    /**
     * Volver. Retrocede una posiciónn en la historia (para el botón 'Atrás')
     */
    function Volver(e){
        history.back();
        e.stopPropagation();
        e.preventDefault();
        reescribirFiltros();
    }
    
    /**
     * Inicio. Vuelve a la pagina de inicio desde el tutorial
     * @param e
     * @returns
     */ 
    function Inicio(e){
        console.log('volviendo a inicio');
        posT = 0;
        $.mobile.changePage($('#PaginaInicial'));
        PararEvento(e);
        
    }
        
    /**
     * PararEvento. Para la propagación del evento pasado como parámetro.
     * @param event  evento que se desea parar
     */
    function PararEvento(event){
        event.stopPropagation();
        event.preventDefault();	
    }
    
    /**
     * CambiarPagina.   Cambia entre las Páginas del tutorial
     * @param posT      la posición actual del tutorial
     */
    function cambiarPagina(posT){
        switch(posT){
            case 1: $.mobile.changePage($('#PaginaTutorial1'));
                break;
            case 2: $.mobile.changePage($('#PaginaTutorial2'));
                break;
            case 3: $.mobile.changePage($('#PaginaTutorial3'));
                break;
            case 4: $.mobile.changePage($('#PaginaTutorial4'));
                break;
        }
    }
    
    
//----texto y filtros. métodos relacionados con recorte, filtro, comparación y generación de texto
    
    /**
     * transformarCadena. limita el número de caracteres que se muestra en las listas
     * @param: cadena cadena de caracteres a transformar
     * @param: maximo máximo de la cadena
     * @output: cadenatransformada cadena transformada
     */
    function transformarCadena(cadena, maximo){
        var cadenaTransformada=cadena;
        if(innerWidth<=768){
            console.log(anchoImagen)
            if(cadena.length>maximo){
                cadenaTransformada = (cadena).substring(0,maximo-3);
                cadenaTransformada+="...";
            }
        }
        return cadenaTransformada;
    }
    
    /**
     * filtrarComercios y filtrarSectores.  oculta los elementos lista que no coincidan en contenido con el parámetro introducido en el input que lanza esta función.
     * Si se borra todo el cuadro de texto se muestran todos los elementos de la lista de nuevo.
     */
    function filtrarComercios(){
        var tam_texto_buscador = $('#filtroComercios').val().length;
        var texto_buscador = $('#filtroComercios').val();
        if(!esNulo(texto_buscador)){
            var tamLista = $("#lstComercios li").length;
            for(var x = 0; x<tamLista; x++){
                var contenido_li_titulo_actual = $('#'+x+' h3').html();
                var contenido_li_direccion_actual = $('#'+x+' p').html();
                
                //mostramos u ocultamos los elementos mediante css
                if (buscarCoincidencia(contenido_li_titulo_actual, contenido_li_direccion_actual, texto_buscador)){
                    $('#'+x+'').show().removeClass('oculto');
                }
                else{
                    $('#'+x+'').hide().addClass('oculto');
                }
            }
        }
        if (texto_buscador == ""){
            $("#lstComercios li").show().removeClass('oculto');        
        }
        cebra('lstComercios');
    }
    
    function filtrarSectores(){
        var tam_texto_buscador = $('#filtroSectores').val().length;
        var texto_buscador = $('#filtroSectores').val();
        if(!esNulo(texto_buscador)){
            var tamLista = $("#lstSectores li").length;
            for(var x = 0; x<tamLista; x++){
                var contenido_li_titulo_actual = $('#sec'+x+' h3').html();
                if (buscarCoincidencia(contenido_li_titulo_actual, null, texto_buscador)){
                    $('#sec'+x+'').show().removeClass('oculto');
                }
                else{
                    $('#sec'+x+'').hide().addClass('oculto');
                }
            }
        }
        if (texto_buscador == ""){
            $("#lstSectores li").show().removeClass('oculto');
        }
        cebra('lstSectores');
    }
    
    /**
     * vaciarFiltros.   vacía el contenido de información del input al hacer clic sobre el con intención de escribir
     */
    function vaciarFiltros(){
        if(buscarCoincidencia($('#filtroSectores').val(), null, "Introduzca") || buscarCoincidencia($('#filtroComercios').val(), null, "Introduzca")){
            $('#filtroSectores').val("");
            $('#filtroComercios').val("");
        }
    }
    
    /**
     * reescribirFiltros.   reescribe el contenido informativo del input si el usuario lo ha dejado vacío y pierde el foco
     */
    function reescribirFiltros(){
        if(buscarCoincidencia($('#filtroSectores').val(), null, "") || buscarCoincidencia($('#filtroComercios').val(), null, "")){
            $('#filtroSectores').val("Introduzca un sector...");
            $('#filtroComercios').val("Introduzca un comercio o dirección...");
            $("#lstComercios li").show().removeClass('oculto');   
            $("#lstSectores li").show().removeClass('oculto');   
        }
    }
    
    /**
     * buscarCoincidencia.  devuelve verdadero si alguno de los dos primeros parámetros es igual al último (que es el introducido por input)
     * @param   titulo. el titulo del elemento de la lista
     * @param   subtitulo. el subtitulo o dirección del elemento lista (solo si los elementos representan comercios)
     * @param   parametro. el contenido del cuadro de búsqueda
     */
    function buscarCoincidencia(titulo, subtitulo, parametro){
        var resultado= false;
        if(titulo!=null && titulo.toLowerCase().indexOf(parametro.toLowerCase())!=-1){
            resultado = true;
        }
        if(subtitulo!=null && subtitulo.toLowerCase().indexOf(parametro.toLowerCase())!=-1){
            resultado =true;
        }
        return resultado;
    }
    
    /**
     * obtenerNombreZona. devuelve un valor string con el nombre de la zona
     * @param Id        id de la zona 
     */
    function obtenerNombreZona(Id){
        var nombrezona = "";
        switch (Id) {
            case 1: nombrezona = 'Tejina';                  break;
            case 2: nombrezona = 'Valle de Guerra';         break;
            case 3: nombrezona = 'Punta del Hidalgo';       break;
            case 4: nombrezona = 'Bajamar';                 break;
        }
        return nombrezona;
    }
    
    
//----imagenes. métodos relacionados con carga de imagenes desde la base de datos, y establecer mediante código dinámico algunas fotos (método necesario por incopatibilidad en algunos dispositivos)
    /**
    * obtenerImagenesComercio.    obtiene imagenes por comercio y si existen, muestra un enlace a la galería en la #PaginaDetallesComercio
    * @param  Id.  el id del comercio
    */
    function obtenerImagenesComercio(Comercio){
        console.log('obtieniendo imagenes comercio');
        $.mobile.loading('show', {text: "Cargando", textVisible:true, textonly:true});
               $.getJSON(urlObtenerImagenesPorComercio + "?callback=?",
                          {
                              'comercio': Comercio
                          },
                          function(data){
                              listaImagenesComercio = new Array();
                              if (data){
                                  $.each(data, function(i, item){
                                    if(item['lista']){
                                      $.each(item['lista'], function(j, item2){
                                        console.log(item2['Url']);
                                        listaImagenesComercio.push(''+item2['Url']+'');
                                        
                                      });
                                    }    
                                  });
                              }	
                              $('#galeria-boton').empty();
                            if(!esNulo(listaImagenesComercio)){
                                cargarImagenesComercio();
                                //cargar boton de la galeria
                                $('#galeria-boton').html('<a href="#PaginaGaleria-lista" id="galeria-boton-link" class="ui-btn-up-a boton-detalle">Ver galería de imágenes<i class="icon-picture"></i></a>');
                                $('#galeria-boton').show();
                            }
                            else{
                                $('#galeria-boton').hide();
                            }
                            numImagenesComercio=listaImagenesComercio.length;
                            console.log('numero de imagenes del comercio '+Comercio+' = '+numImagenesComercio);
                          }
                );
        $.mobile.loading('hide');
    }
    
    /**
     * cargarImagenesComercio.  con la lista de imagenes obtenida en el método "obtenerImagenesComercio" va insertando cada una en la página galería.
     * al pulsar una de estas imágenes se ejecutará la librería "photoswipe" y mostrará cada imagen en el mayor tamaño posible
     */
    function cargarImagenesComercio(){
        console.log('cargando imagenes comercio');
        for(var i = 0; i<listaImagenesComercio.length; i++){
            console.log(listaImagenesComercio[i]);
            $('#galeria-lista').append('<a href='+listaImagenesComercio[i]+'  rel="external" class="galeria-link" data-transition="pop">'+
                                       '<img src='+listaImagenesComercio[i]+' class="galeria-imagen" />'+
                                       '</a>');
        }
        var myPhotoSwipe = $("#galeria-lista a").photoSwipe({enableMouseWheel: false,enableKeyboard: false});
        
    }
    
    /**
     * cambiarImagenesPaginaPrincipal. establece dinámicamente las imágenes de los botones de la página inicio
     */
    function cambiarImagenesPaginaPrincipal(){
        var inicio = 'img/btn/inicio'+ anchoImagen + '.png';
        var localizacion = 'img/btn/localizacion'+ anchoImagen + '.png';
        var descuentos = 'img/btn/descuentos'+ anchoImagen + '.png';
        var favoritos = 'img/btn/favoritos'+ anchoImagen + '.png';
        var tutorial = 'img/btn/tutorial'+ anchoImagen + '.png';
        var facebook = 'img/btn/facebook'+ anchoImagen + '.png';
        
        $('#imgOpcionInicio').attr({'src': inicio});
        $('#imgOpcionLocalizacion').attr({'src': localizacion});
        $('#imgOpcionDescuentos').attr({'src': descuentos});
        $('#imgOpcionFavoritos').attr({'src': favoritos});
        $('#imgOpcionTutorial').attr({'src': tutorial});
        $('#imgOpcionFacebook').attr({'src': facebook});
    }


//----facebook. métodos relacionados con la conexión a facebook situada en www.yoamotejina.com/facebook
        //TODO. intentar que los inAppBrowser:
            //-lancen la función al abrirse
            //-se cierren automáticamente al haber terminado con el proceso
    
    //http://stackoverflow.com/questions/15666258/phonegap-build-open-external-page-in-inappbrowser-or-childbrowser-with-no-tool
    //http://tar.mx/log/inappbrowser-esa-nueva-maravilla-de-phonegap/
    
    
    /**
     * SOLUCIÓN AL PROBLEMA DE CERRAR ESTAS PÁGINAS
     Lo que hago, es un truco como el siguiente: pongo un botón en la ventana inAppBrowser o una liga, que vaya a una hoja en blanco llamada sigraciasbye.html. 
     Algo como <a href=”sigraciasbye.html”> cerrar ventana </a> y tengo un código como este:

                var ventana = window.open('http://myserver.com/','_blank','location=no');
                ventana.addEventListener('loadstart',cerrado);
                
                //luego, la función:
                function cerrado(evento) {
                   if(evento.url.match(/sigraciasbye/)) {
                      ventana.close();
                      ventana.removeEventListener('loadstart');
                   }
                }
     *
     */
     
     
     /** 
      ESTE ES OTRO EJEMPLO QUE TAMPOCO ENTIENDO
      I open the browser with this:
        <a href="#" onclick="openInAppBrowserBlank('http://www.mypage.asp?userId=1');">open InAppBrowser</a>
        
        var ref = null;
        function openInAppBrowserBlank(url)
        {
            try {
        ref = window.open(encodeURI(url),'_blank','location=no'); //encode is needed if you want to send a variable with your link if not you can use ref = window.open(url,'_blank','location=no');
                 ref.addEventListener('loadstop', LoadStop);
                 ref.addEventListener('exit', Close);
            }
            catch (err)    
            {
                alert(err);
            }
        }
        function LoadStop(event) {
                 if(event.url == "http://www.mypage.com/closeInAppBrowser.html"){
        // alert("fun load stop runs");
                     ref.close();
                 }    
            }
        function Close(event) {
                 ref.removeEventListener('loadstop', LoadStop);
                 ref.removeEventListener('exit', Close);
            } 
        
        And to close the InAppBrowser from the page that I opened in the browser(http://www.mypage.asp) I have a button-link like this.
        
        <a href="http://www.mypage.com/closeInAppBrowser.html"></a>
      */
    /**
     *loginFacebookBrowser. abre un nuevo inAppBrowser con una pagina web que permite loguearse en facebook
     */
     function loginFacebookBrowser(event){
        console.log('pagina comercios '+$('#PaginaComercios').val());
        var ref = window.open('http://www.yoamotejina.com/facebook/login.html', '_blank','location=no');
        ref.addEventListener('loadstart', function(event) { console.log(event.type + ' - ' + event.url); } );
        ref.addEventListener('loadstop', function(event) { console.log(event.type + ' - ' + event.url); } );
        ref.addEventListener('exit', function(event) { console.log(event.type); } );
        PararEvento(event);
     }
     
     /**
      *logoutFacebookBrowser.   abre un nuevo inAppBrowser con una página que permite cerrar sesión en facebook
      */
     function logoutFacebookBrowser(event){
        var ref = window.open('http://www.yoamotejina.com/facebook/logout.html', '_blank','location=no');
        ref.addEventListener('loadstart', function(event) { console.log(event.type + ' - ' + event.url); } );
        ref.addEventListener('loadstop', function(event) { 
                                console.log(event.type + ' - ' + event.url);
                             if (event.url.match("mobile/close")) {
                                    ref.close();
                              }
        });
        ref.addEventListener('exit', function(event) { console.log(event.type); } );
        PararEvento(event);
     }
    /**
     *postearFacebookBrowser.   abre un nuevo inAppBrowser que permite compartir en la biografía del usuario la información de un comercio
     */
    function postearFacebookBrowser(event){
        if(!esNulo(comercioFacebook)){
            var ref = window.open('http://www.yoamotejina.com/facebook/post.html?nombre='+comercioFacebook[0]+'&direccion='+comercioFacebook[1]+'&descripcion='+comercioFacebook[2],'_blank','location=yes');
            ref.addEventListener('loadstart', function(event) { console.log(event.type + ' - ' + event.url); } );
            ref.addEventListener('loadstop', function(event) { console.log(event.type + ' - ' + event.url); } );
            ref.addEventListener('exit', function(event) { console.log(event.type); } );
            comercioFacebook=null;
        }
    PararEvento(event);
    }

    /**
     * verZCAFacebookBrowser.   abre un nuevo inAppBrowser mostrando el perfil de facebook de la asociación
     */
    function verZCAFacebookBrowser(event, comercio){
                var ref = window.open('http://www.facebook.com/ZcaNordeste', '_blank','location=yes');
                ref.addEventListener('loadstart', function(event) { console.log(event.type + ' - ' + event.url); } );
                ref.addEventListener('loadstop', function(event) { console.log(event.type + ' - ' + event.url); } );
                ref.addEventListener('exit', function(event) { console.log(event.type); } );
        PararEvento(event);
     }

//----dispositivo y notificaciones  
    /**
     * esMovil. obtiene mediante userAgent el tipo de dispositivo en el que se ejecuta y devuelve true si es un móvil
     * @returns boolean
     */
    function esMovil(){
        var resultado=false;
        var userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.search("android") > -1){
            resultado=true;
            movil = 'android';
        }else{
            if (userAgent.search("iPhone") > -1){
                resultado=true;
                movil = 'iphone';
            }else{
                if (userAgent.search("iPad") > -1){
                    resultado=true;
                    movil = 'ipad';
                }else{
                    if (userAgent.search("iPod") > -1){
                        resultado=true;
                        movil = 'ipod';
                    }else{
                        if (userAgent.search("blackberry") > -1 || userAgent.search("bb10") > -1){
                            resultado=true;
                            movil = 'blackberry';
                        }else{
                            if (userAgent.search("Windows Phone") > -1 || userAgent.search("MSIE") > -1){
                                resultado=true;
                                movil = 'windowsPhone';
                            }else{
                                movil = 'no';
                            }
                        }
                    }
                }
            }
        }
        return resultado;
    } 
    
    /**
     * ComprobarConexion.   comprueba si existe conexión de algún tipo. en caso afirmativo devuelve true
     */
    function ComprobarConexion(){
        var valor = false;
        
        if (activarPhoneGap) {
            var networkState = navigator.connection.type;
            
            switch(networkState) {
                case Connection.ETHERNET:
                    valor = true;
                    break;
                case Connection.WIFI:
                    valor = true;
                    break;
                case Connection.CELL_2G:
                    valor = true;
                    break;
                case Connection.CELL_3G:
                    valor = true;
                    break;
                case Connection.CELL_4G:
                    valor = true;
                    break;
                case Connection.NONE:
                    valor = false;
                    break;
                default:
                    valor = false;
                    break;
            }
        }
        else {
            valor = true;
        }
        return valor; 
    }
    
    /**
     *MostrarAlerta.    muestra un pop up con un mensaje.
     * @params  mensaje, titulo, boton
     */    
    function MostrarAlerta(mensaje, titulo, boton){
        if (activarPhoneGap) {
            navigator.notification.alert(mensaje, '' , titulo, boton);
        }
        else {
            alert(mensaje);
        }
    }
    
     /**
     * error.   emite el codigo de error y el mensaje
     */
    function error(error) {
        navigator.notification.alert("Código: " + error.code + "\nMensaje: " + error.message);
    }
    
//----otras.
    
    /**
     * esNulo. Comprueba que una cadena es nula, vacía, string en blanco o indefinida
     * usada para no añadir campos inecesarios en la PaginaDetallesComercio y en otros casos que se necesite comprobar el contenido de una cadena
     */
    function esNulo(item){
        var resultado = true;
        if(item.toString()!= null && item.toString()!= undefined && item.toString()!=' ' && item.toString()!=''){
            resultado = false;
        }
        return resultado;
    }
    
    /**
     * cebra.   cada vez que se ejecuta, elimina las clases impar y par y las aplica de nuevo de forma intercalada a los elementos de la lista
     * @param   element.    el elemento lista al que se le aplicará el estilo cebrado.
     */
    function cebra(element){
        $('#'+element+' li').removeClass('impar par');
        $('#'+element+' li').not('.oculto').filter(':odd').addClass('par');
        $('#'+element+' li').not('.oculto').filter(':even').addClass('impar');
    }

//------------------------------	