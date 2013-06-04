var map = null;
var zoomComercios;
var tipoMapa = google.maps.MapTypeId.ROADMAP;

//var tipoMapa = google.maps.MapTypeId.HYBRID;

var markersArray = [];
var markerIcono =       'img/mapa/markerIcono.png';
var posActualIcono =    'img/mapa/posActualIcono.png';
var posActualPunto;
var posActualMostrado = 0;
var infoBubble1;
var contenidosInfoBubbleArray = new Array();

var latitud = 28.529760;
var longitud = -16.359320;

//------mapa
{
     /*
     * crearMapa. crea un mapa sin o existiese (singleton)
     */
    function crearMapa(){
        console.log(' ## crear mapa');
        posActualPunto = ObtenerPunto(latitud, longitud);
        if(map==null){
            var mapOptions = {
                    center : posActualPunto,
                    zoom : zoomComercios,
                    zoomControl : true,
                    zoomControlOptions : {
                        style : google.maps.ZoomControlStyle.LARGE,
                        position : google.maps.ControlPosition.TOP_LEFT
                    },
                    mapTypeControl : false,
                    mapTypeId : tipoMapa,
                    streetViewControl: false
                };
            //Incializar el mapa y los eventos
            map = new google.maps.Map(document.getElementById("map_canvas"),
                                      mapOptions);
            google.maps.event.addListener(map, 'click', quitarInfoBubble);
        }
        if (activarPhoneGap) {
            var watchID = navigator.geolocation.watchPosition(
                mostrarPosActual, 
                error, {maximumAge : 20}
            );
        }    
    }
    /*
     * mostrarMapaEspecifico. muestra el mapa General con todos los markers
     */
    function mostrarMapaGeneral(event){
        console.log('   mostrar mapa general');
        if(ComprobarConexion()){
            reiniciarMapa();
            zoomComercios= 14;
            console.log('el zoom utilizado en los comercios es '+zoomComercios);
            $.mobile.changePage($('#PaginaLocalizacion'));
            console.log('pagina cambiada');
            $('#PaginaLocalizacion').live('pageshow', function(e) {
                // Carga el preload
                console.log('cargar preload');
                $.mobile.loading('show', {
                    text : 'cargando',
                    textVisible : true,
                    textonly : true
                });
                    crearMapa(); 
                    aniadirMarcadoresComercios(event);
                // Se quita el loading y se desvincula el evento 'pageshow'
                $.mobile.loading('hide');
                $('#PaginaLocalizacion').unbind('pageshow');
            });
        }else{
            MostrarAlerta('No dispone de conexión a Internet.', 'ZCA dice:', 'vale');
        }
        PararEvento(event);
    }
    /*
     * mostrarMapaEspecifico.   muestra el mapa de un solo comercio
     */
    function mostrarMapaEspecifico(event,id){
        console.log('   mostrar mapa especifico');
        if(ComprobarConexion()){
            reiniciarMapa();
            zoomComercios=12;
            $.mobile.changePage($('#PaginaLocalizacion'));
            if(jQuery){            
                $('#PaginaLocalizacion').bind('pageshow', function(e) {
                // Carga el preload
                $.mobile.loading('show', {
                    text : 'cargando',
                    textVisible : true,
                    textonly : true
                });
                crearMapa(); 
                aniadirMarcadorComercio(event, id);
                // Se quita el loading y se desvincula el evento 'pageshow'
                $.mobile.loading('hide');
                $('#PaginaLocalizacion').unbind('pageshow');
                });
            }else{
                console.log('el problema es que jquery no esta activado');
                 var newscript = document.createElement('script');
                     newscript.type = 'text/javascript';
                     newscript.async = true;
                     newscript.src = 'http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.3.min.js';
                     (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(newscript);
            }
        }else{
            MostrarAlerta('No dispone de conexión a Internet.', 'ZCA dice:', 'vale');
        }
        PararEvento(event);
    }
    
    /*
     * reiniciarMapa.   pone todas las variables a null, borra todo los que se muestra en el mapa
     */
    function reiniciarMapa(){
        console.log('   reiniciar mapa');
        quitarTodosLosMarcadores(); //borra los marcadores del mapa y dejan de mostrarse
        quitarInfoBubble();         //cierra el infobubble, borra el infobubble y su configuración
        map= null;
        contenidosInfoBubbleArray = new Array();
    }
 }

//------marcadores
{
    /**
     * aniadirMarcadoresComercios.    obtiene la información de los marcadores y ejecuta las funciones que situan sus marcadores y almacenan su informacion
     */
     function aniadirMarcadoresComercios(event) {
            console.log('   añadir marcadores de comercios');
            for ( var z = 1; z <=4; z++) {
                $.getJSON(urlObtenerComerciosPorZona + "?callback=?",
                          {
                              'zona' : z
                          },
                          function(data) {
                              if (data) {
                                  $.each(data,function(i, item) {
                                      if (item['lista']) {
                                          $.each(item['lista'],function(b,item2) {
                                              var nombrezona = obtenerNombreZona(z);
                                              var nombreComercio = item2['NombreComercio'];
                                              var punto = ObtenerPunto(item2['Latitud'],item2['Longitud']);
                                              AniadirMarcador(punto,nombreComercio,markerIcono ,10);
                                              almacenarContenidoInfoBubble(nombreComercio, item2['Direccion'], nombrezona, item2['Id'],item2['Imagen'] );
                                              console.log('   cada marcador que se añade');
                                          });
                                      }
                                  });
                              }
                          });
            }
        }        
    }
    /**
     * aniadirMarcadorComercio.       obtiene la información del marcador y ejecuta las funciones que situan sus marcadores y almacenan su informacion
     * @param id.       el id del comercio para realizar la consulta
     */
     function aniadirMarcadorComercio(event, id){
        console.log('   añadir un marcador');
        var puntoCom;
        var latCom, longCom;
        if (ComprobarConexion()) { 
            $.getJSON(urlObtenerComerciosPorId + "?callback=?",
                    {
                        'Id' : id
                    },
                    function(data) {if (data) {
                        $.each(data,function(a, item) {
                                    var nombrezona = obtenerNombreZona(a);
                                    var nombreComercio = item['NombreComercio'];
                                    var punto = ObtenerPunto(item['Latitud'],item['Longitud']);
                                    almacenarContenidoInfoBubble(nombreComercio, item['Direccion'], nombrezona, id,item['Imagen'] );
                                    AniadirMarcador(punto,nombreComercio,markerIcono,10);
                                    console.log('   se añade el marcador');
                        });
                    }}
            );
        }
        else {
            MostrarAlerta('No dispone de conexión.');
        }
    }
     
     /**
     * ObtenerPunto. Devuelve un objeto del tipo google.map.LatLng para la latitud y
     * longitud pasada.
     * @param latitud       latitud de la posición
     * @param longitud      longitud de la posición
     * @return variable del tipo google.maps.LatLng
     */
    function ObtenerPunto(latitud, longitud) {
        try {
            var punto = new google.maps.LatLng(latitud, longitud);
        } catch (e) {
            console.log(e);
        }
        return punto;
    }
    
    /**
     * mostrarPosActual.    obtiene la latitud y longitud actual y añade el marcador necesario
     */
     function mostrarPosActual(position) {
        console.log('mostra pos actual');
        if(posActualMostrado==0 || latitud==position.coords.latitude && longitud==position.coords.longitude){
            latitud = position.coords.latitude;
            longitud = position.coords.longitude;
            console.log(latitud+'<-- latitud || longitud-->'+longitud);
            posActualPunto= ObtenerPunto(position.coords.latitude,position.coords.longitude);
            AniadirMarcador(posActualPunto, "Posición Actual",posActualIcono, 10);
            posActualMostrado=1;
           console.log("es el primero o no se ha movido");
        }else{
            console.log("no es el primero o se ha movido");
            latitud = position.coords.latitude;
            longitud = position.coords.longitude;
            console.log(latitud+'<-- latitud || longitud-->'+longitud);
            posActualPunto= ObtenerPunto(position.coords.latitude,position.coords.longitude);
             QuitarUltimoMarcador();
            AniadirMarcador(posActualPunto, "Posición Actual",posActualIcono, 10);
            posActualMostrado=1;
        }
     }
    /**
     * AniadirMarcador. Añade un nuevo marcado a la lista de marcadores actuales y
     * lo coloca en el mapa.
     * @param point     punto en formato google.maps.LatLng
     * @param longitud  longitud del punto
     * @param title     título a mostrar
     * @param icon      icono a establecer
     * @param depth     profundidad del icono
     */
    function AniadirMarcador(point, title, icon, depth) {
        marker = new google.maps.Marker({
            position : point,
            map : map,
            title : title,
            icon : icon,
            zIndex : depth
        });
        google.maps.event.addListener(marker, 'click', mostrarInfoBubble);
        markersArray.push(marker);
    }
    
    /**
     * QuitarUltimoMarcador. Elimina el último marcado añadido a la lista de
     * marcadores (normalmente la posición actual).
     */
    function QuitarUltimoMarcador() {
        if (markersArray !=null && markersArray.length > 0) {
            markersArray[markersArray.length - 1].setMap(null);
            markersArray.pop();
        }
    }
    
    
    /**
     * QuitarTodos los Marcadores. Elimina todos los marcadores del mapa //si no
     * funciona es el emulador
     */
    function quitarTodosLosMarcadores() {
        console.log(' quitar todos los marcadores');
        if(markersArray!=null){
            for (var i = markersArray.length - 1; i >= 0; i--) {
                markersArray[i].setMap(null);
                markersArray.pop();
            }
        }
    }
    function quitarInfoBubble(){
        if(infoBubble1!=null){
            infoBubble1.close();
        }
        infoBubble1= null;
    }

//----infoBubble
/**
 * mostrarInfoBubble. es el evento on click de los marcadores. cierra si hubiese alguno abierto, crea un nuevo infobubble con el contenido correspondiente al marker y lo muestra en el mapa
 */
{
function mostrarInfoBubble() {
    var encontrado = false;
    var marker = this;
    var infoBubbleOptions={
        map : map,
        position : marker.getPosition(),
        shadowStyle : 1,
        padding : 0,
        maxWidth : mediaW,
        maxHeight : mediaH,
        minWidth : mediaW,
        minHeight : mediaH,
        backgroundColor : '#F2C891',
        borderRadius : 10,
        arrowSize : 10,
        borderWidth : 1,
        borderColor : 'white',
        disableAutoPan : false,
        hideCloseButton : true,
        arrowPosition : 30,
        backgroundClassName : 'phoney',
        arrowStyle : 1
    };
    if(infoBubble1!=null){
        infoBubble1.close();
    }
    if (marker.title != "Posición Actual") {
        for (var i = 0; i < markersArray.length; i++) {
            if (marker.title == contenidosInfoBubbleArray[i][0]) {
                infoBubble1 = new InfoBubble(infoBubbleOptions);
                infoBubble1.setContent(contenidosInfoBubbleArray[i][1]);
                encontrado = true;
            }
            if (encontrado) {
                i = markersArray.length;
                infoBubble1.open(map, marker);
            }
        }
    }
}
/*
 * almacenarContenidoInfoBubble.    crear el contenido html del infobubble con la información recibida y almacena el contenido en el array contenidosInfoBubblesArray
 */
function almacenarContenidoInfoBubble(nombreComercio, direccion, nombrezona, id, imagen){
    var miniatura, contenido;
    
    if(!esNulo(imagen)){
        miniatura = '<img src="'+imagen+'"/>';
    }
    else{
        miniatura = '<img src="img/comercios/sinImagen.jpg"/>';
    }
    
    contenido = "<div id='tooltip'>"
    + "<a href='javascript:;' onClick='infoBubble1.close();' onTouchStart='infoBubble1.close();'>"
    +    "<div id='cerrarBubble'/>X</div>"
    + "</a>"
    + "<div id='titulodiv'><h3 id='titulotooltip'>"
    + nombreComercio
    + "</h3>"
    + "</div>"
    + "<div id='miniatura'>"
    + miniatura
    + "</div>"
    + "<div id='detallescomercio'>"
    + "<p id='parrafotooltip'>"
    + direccion
    + "&nbsp;&nbsp;</br>"
    + nombrezona
    + "</br>"
    + "<a  id='enlacetooltip' href='javascript:;' onClick='CargarDetallesComercio(event,"
    + id
    + ")'>Ver detalles...</a></p>"
    + "</div>"
    + "</div>";
    contenidosInfoBubbleArray.push([nombreComercio,contenido]);
} 
}
//-------------------------------
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
/**
 * error.   emite el codigo de error y el mensaje
 */
function error(error) {
        navigator.notification.alert("Código: " + error.code + "\nMensaje: "
                                     + error.message);error
}