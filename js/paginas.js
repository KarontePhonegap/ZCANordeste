//variables--------------------------
{
    //webService
    var urlObtenerComerciosPorZona = 			"http://172.16.1.11/WSZCA/serviciosJSON.asmx/ObtenerComerciosPorZona";
    var urlObtenerZonas = 						"http://172.16.1.11/WSZCA/serviciosJSON.asmx/ObtenerZonas";
    var urlObtenerSectores = 					"http://172.16.1.11/WSZCA/serviciosJSON.asmx/ObtenerSectores";
    var urlObtenerComerciosPorSector = 			"http://172.16.1.11/WSZCA/serviciosJSON.asmx/ObtenerComerciosPorSector";
    var urlObtenerComerciosPorId= 				"http://172.16.1.11/WSZCA/serviciosJSON.asmx/ObtenerComerciosPorId";
    var urlObtenerImagenesPorComercio = 		"http://172.16.1.11/WSZCA/serviciosJSON.asmx/ObtenerImagenesPorComercio";
    
    
    // tutorial
    var textosTutorial = new Array();
    textosTutorial[1]="<img id='imgtextoTutorial1' src='img/transparente.png'/>";
    textosTutorial[2]="ZCA app es una aplicaciónn para localizar, ver y comprar en los comercios de la Comarca del Nordeste";
    textosTutorial[3]="Una guía detallada de comercios, descripción y servicios que ofrecen cada uno de ellos";
    textosTutorial[4]="Localiza un comercio, agrégalo a tus favoritos o mira los negocios que tienes a tu alrededor desde tu móvil";
    var posT = 0;
    
    var listaImagenesComercio = new Array();
    var indiceImagenesComercio = 0;
    
    var movil;
    var anchoImagen = document.innerWidth;
}
//-------------------------------------------------------------------------------------------

//Cargas de páginas-------------
/**
 * Cargar Zonas. carga la listview con las 4 zonas de la ZCA
 */
function CargarZonas(event){
    if(ComprobarConexion()){
        DetectarDimensiones();
        $.mobile.loading('show', {text: "Cargando", textVisible:true, textonly:true});
        $('#lstZonas').empty();
        $.getJSON(urlObtenerZonas + "?callback=?",
                  {},
                  function(data){
                      if (data){
                          $.each(data, function(i, item){
                              if(item['lista']){
                                  $.each(item['lista'], function(j, item2){	  
                                      $('#lstZonas').append('<li>'+ 
                                                            '<a href="javascript:;" onClick="CargarComerciosPorZona(event,'+item2['Id']+')" onTouchStart="CargarComerciosPorZona(event, '+item2['Id']+')">'+ 
                                                            '<img src=\'img/iconos/'+item2['Id']+'ico' + anchoImagen + '.png\' />' +
                                                            '<h3>' + item2['Nombre'] +'</h3>'+
                                                            '<span class="ui-li-count">'+item2['numComercios']+'</span>'+
                                                            '</a>'+
                                                            '</li>');
                                  });
                              }
                          });
                      }
                      $('#imagenZona').hide().fadeIn('fast');;
                      if ($('#lstZonas').hasClass('ui-listview')) {
                          $('#lstZonas').listview('refresh');
                      }
                      $.mobile.loading('hide');
                      $.mobile.changePage($('#PaginaZona'));
                  }
                 );
    }
    else {
        MostrarAlerta(alert_conexion_mensaje , alert_conexion_titulo , alert_conexion_boton);
    }
    PararEvento(event);
}

/**
 * CargarComerciosPorZona. carga la página que muestra TODOS los comercios de
 * una determinada zona de la ZCA en una listview
 * 
 * @param: zona zona de la que se desean cargar los comericos
 */
function CargarComerciosPorZona(event, zona){
    if(ComprobarConexion()){
        //		var numComerciosZona = 0;
        $.mobile.loading('show', {text: "Cargando", textVisible:true, textonly:true});
        $('#lstComercios').empty();
        var zonavar;
        var imagen;
        var countli=0;
        $.getJSON(urlObtenerComerciosPorZona + "?callback=?",
                  {
                      'zona': zona 
                  },function(data){
                      if (data){
                          $.each(data, function(i, item){
                              if(item['lista']){
                                  $.each(item['lista'], function(j, item2){
                                      numComerciosZona = j;
                                      var nombreComercio=transformarCadena((item2['NombreComercio'])+"", maxi);
                                      if(!esNulo(item2['Imagen'])){
                                          imagen = '<img src="'+item2['Imagen']+'"/>';
                                      }
                                      else{
                                          imagen = '<img src="img/comercios/sinImagen.jpg"/>';
                                      }
                                      $('#lstComercios').append('<li class="comercio" id="'+countli+'">'+
                                                                '<a href="javascript:;" onClick="CargarDetallesComercio(event,'+item2['Id']+')">'+
                                                                //'<img src=\'img/casamarina.jpg\'/>'+
                                                                imagen+
                                                                '<h3 class="nombreComercio">' + nombreComercio + '</h3>'+
                                                                '<p class="direccionComercio">' + item2['Direccion'] + '</p>'+
                                                                '</a>'+
                                                                '</li>');
                                      countli++;
                                      zonavar=item2['Zona'];
                                  });
                              }
                          });
                      }
                      //$('#lstComercios').attr({'data-filter': 'true', 'data-filter-placeholder': 'Filtrar comercios...'});
                      try{
                          $('#bannerZona')[0].className = '';
                          $('#bannerZona').addClass('bannerZona'+zona);
                          $('#bannerZona').html('<h1 id="nombreZonah1">'+obtenerNombreZona(zona)+'</h1>');
                      }
                      
                      catch(e){console.log(e.message);}
                      cebra('lstComercios');
                      if ($('#lstComercios').hasClass('ui-listview')) {
                          $('#lstComercios').listview('refresh');	
                      }
                      $.mobile.loading('hide');
                      $.mobile.changePage($('#PaginaComercios'));
                  }
                 );
    }
    else {
        MostrarAlerta(alert_conexion_mensaje , alert_conexion_titulo , alert_conexion_boton);
    }
    PararEvento(event);
}


/**
 * CargarSectores. Carga la página con la listview que contiene todos los
 * sectores de la ZCA
 */
function CargarSectores(event){
    if(ComprobarConexion()){
        $.mobile.loading('show', {text: "Cargando", textVisible:true, textonly:true});
        $('#lstSectores').empty();
        var countsectores = 0;
        $.getJSON(urlObtenerSectores + "?callback=?",{},
                  function(data){
                      if (data){
                          $.each(data, function(i, item){
                              if(item['lista']){
                                  $.each(item['lista'], function(j, item2){
                                      countsectores=j;
                                      var nombreSector=transformarCadena((item2['Nombre'])+"", maxisectores);
                                      $('#lstSectores').append('<li id=sec'+countsectores+'>'+
                                                               '<a href="javascript:;" onClick="CargarComerciosPorSector(event,'+item2['Id']+')">'+
                                                               <!--'<img id="flecha" src=\'img/iconos/flecha'+anchoImagen+'.png\'>'+-->
                                                               '<h3 id="nombreSector">' + nombreSector + '</h3>'+
                                                               '<span class="ui-li-count">'+item2['numComercios']+'</span>'+
                                                               '</a>'+
                                                               '</li>');
                                  });
                                  console.log(countsectores);
                              }
                          });
                      }
                      cebra('lstSectores');
                      $('#filtro').attr({'value': 'Nombre del sector a buscar...'});
                      $('#filtro').hide().fadeIn('fast');
                      if ($('#lstSectores').hasClass('ui-listview')) {
                          $('#lstSectores').listview('refresh');
                      }
                      $.mobile.loading('hide');
                      $.mobile.changePage($('#PaginaSector'));
                  }
                 );
    }
    else {
        MostrarAlerta(alert_conexion_mensaje , alert_conexion_titulo , alert_conexion_boton);
    }
    PararEvento(event);
}

/**
 * CargarcomerciosPorSector. carga la página que muestra los comercios de un
 * determinado sector de la ZCA en una listview
 * 
 * @param: sector sector del que se desean cargar los comercios
 */
function CargarComerciosPorSector(event, sector){
    if(ComprobarConexion()){
        var imagen;
        $.mobile.loading('show', {text: "Cargando", textVisible:true, textonly:true});
        $('#lstComercios').empty();
        var countlicomercios =0;
        $.getJSON(urlObtenerComerciosPorSector + "?callback=?",
                  {
                      'sector': sector
                  },function(data){
                      if (data){
                          $.each(data, function(i, item){
                              if(item['lista']){
                                  $.each(item['lista'], function(j, item2){
                                      numComerciosSector = j; 
                                      var nombreComercio=transformarCadena((item2['NombreComercio'])+"");
                                      if(!esNulo(item2['Imagen'])){
                                          imagen = '<img src="'+item2['Imagen']+'"/>';
                                      }
                                      else{
                                          imagen = '<img src="img/comercios/sinImagen.jpg"/>';
                                      }
                                      $('#lstComercios').append('<li id="'+countlicomercios+'">'+
                                                                '<a href="javascript:;" onClick="CargarDetallesComercio(event,'+item2['Id']+')">'+
                                                                imagen+
                                                                '<h3>' + nombreComercio + '</h3>'+
                                                                '<p>' + item2['Direccion'] + '</p>'+
                                                                '</a>'+
                                                                '</li>');
                                      imagen = "    ";						  
                                      countlicomercios++;
                                  });
                              }
                          });
                      }
                      cebra('lstComercios');
                      //$('#lstComercios').attr({'data-filter': "true", "data-filter-placeholder": 'Filtrar comercios...'});
                      if ($('#lstComercios').hasClass('ui-listview')) {
                          $('#lstComercios').listview('refresh');	
                      }
                      $.mobile.loading('hide');
                      $.mobile.changePage($('#PaginaComercios'));
                  }
                 );
    }
    else {
        MostrarAlerta(alert_conexion_mensaje , alert_conexion_titulo , alert_conexion_boton);
    }
    PararEvento(event);
}

/**
 * CargarDetallesComercios. Carga la página que contiene mayor detalle un
 * comercio. permite agregarlo a favoritos, llamar, enviar un email o pasar a
 * otra página para visualizarlo en el mapa
 * 
 * @param: Id Identificaciónn del comercio del que se desea mostrar el detalle
 */
function CargarDetallesComercio(event, Id){
    if(ComprobarConexion()){
        indiceImagenesComercio =0;
        $.mobile.loading('show', {text: "Cargando", textVisible:true, textonly:true});
        var contacto;
        comercio_feed ='';
        descripcion_feed ='';
        foto_feed ="";
        $.getJSON(urlObtenerComerciosPorId + "?callback=?",{'Id': Id},
                  function(data){
                      var nombre, descripcion, direccion;                      
                      if (data){
                          $.each(data, function(i, item){
                              var nomZona = obtenerNombreZona(item['Zona']);
                              $('#banner').html("<div id='bannerZona' class='bannerZona"+item['Zona']+"'><h1 id='nombreZonah1'>"+nomZona+"</h1></div>");
                              $('#titulodetalle').html(item['NombreComercio']); 
                              comercio_feed=item['NombreComercio'];
                              nombre = item['NombreComercio'];
                              if(!esNulo(item['Direccion'])){
                                  contacto='<p><i class="icon-road"></i>'+item['Direccion']+'</br>';
                                  direccion = item['Direccion'];
                              }
                              if(!esNulo(item['Telefono'])){
                                  contacto+='<a href=tel:'+item['Telefono']+'><i class="icon-phone"></i>'+item['Telefono']+'</a></br>';
                              }
                              if(!esNulo(item['Telefono2'])){
                                  contacto+='<a href=tel:'+item['Telefono2']+'><i class="icon-phone"></i>'+item['Telefono2']+'</a></br>';
                              }
                              if(!esNulo(item['Email'])){
                                  contacto+='<a href=mailto:'+item['Email']+'><i class="icon-envelope-alt"></i>'+item['Email']+'</a></p>';
                              }
                              $('#contenidodetalle').html(contacto);
                              contacto =' ';
                              if(!esNulo(item['Descripcion'])){
                                      $('#descripcionParrafo').show(); 
                                  $('#descripcionParrafo').html(item['Descripcion']); 
                                  descripcion_feed=item['Descripcion'];
                                  descripcion = item['Descripcion'];
                              }
                              else{
                                    $('#descripcionParrafo').hide(); 
                                    descripcion = '';
                              }
                              
                              if(!esNulo(item['Imagen'])){
                                  $('#imgdetalle').attr({'src': ''+item['Imagen']+''});
                                  foto_feed=item['Imagen'];
                              }
                              else{
                                  $('#imgdetalle').attr({'src': 'img/comercios/sinImagen.jpg'});
                                  foto_feed="img/comercios/sinImagen.jpg";
                              }
                              $('#favoritobtn').attr({'onClick': 'agregarQuitarFavorito(event,'+Id+');'});
                              $('#favoritobtn a > span').removeClass('marcado');
                              if(esFavorito(item['NombreComercio'])){
                                  $('#favoritobtn a > span').addClass('marcado');
                              }
                              $('#mapabtn').attr({'onClick': 'mostrarMapaEspecifico(event,'+Id+');'});
                          });
                      }	
                      
                      $('#galeria-lista').empty();
                      obtenerImagenesComercio(Id);
                      //$('#fb-boton').html('<a href="javascript:;" id="fb-boton-link" onclick="publishStory();" class="ui-btn-up-a boton-detalle">Compartir en Facebook<i class="icon-facebook-sign"></i></a>');
                      $('#fb-boton').html('<a href="javascript:;" id="fb-boton-link" onclick="postearFacebookBrowser('+event+','+nombre+','+direccion+','+descripcion+');" class="ui-btn-up-a boton-detalle">Compartir en Facebook<i class="icon-facebook-sign"></i></a>');
                      $('#ContentDiv').hide().fadeIn('fast');	
                      $('#lstNavBarDetalle').hide().fadeIn('fast');
                      $('#favoritobtn a > span').hide().fadeIn('fast');
                      $('#galeria-lista').hide().fadeIn('fast');	
                      $.mobile.loading('hide');
                      $.mobile.changePage($('#PaginaDetalleComercio'));
                  });
    }
    else {
        MostrarAlerta(alert_conexion_mensaje , alert_conexion_titulo , alert_conexion_boton);
    }
    PararEvento(event);
}


/**
 * CargarFavoritos. Muestra la página que contiene los elementos de la web SQL
 * database table ("favoritos") en una list view.
 */
function CargarFavoritos(event){
    if(ComprobarConexion()){
        if(listaFavoritos.length>0){
            $.mobile.loading('show', {text: "Cargando", textVisible:true, textonly:true});
            DetectarDimensiones();
            mostrarFavoritos();
            $.mobile.loading('hide');
            $.mobile.changePage($('#PaginaFavoritos'));
            porFavoritos=true;
        }else{
            MostrarAlerta('Actualmente su lista de favoritos está vacía. Para agregar un favorito acceda a la información de un comercio y haga clic en el botón "Favorito"' , 'ZCA: Lista de favoritos vacía' , 'vale');
        }
    }
    else {
        MostrarAlerta(alert_conexion_mensaje , alert_conexion_titulo , alert_conexion_boton);
    }
    PararEvento(event);
}


function CargarFacebook(event){
    if(ComprobarConexion()){
        //TODO comprobar si está logueado y mostrar los botones de distinta forma
        $('#contentFacebook').html('<a href="javascript:;" id="fb-login-link" class="fb-links">'+
                                   '<div id="fb-login-div" class="fb-btn">'+
                                   '<i class="icon-signin iconoF"></i>Iniciar Sesión en Facebook'+
                                   '</div>'+
                                   '</a>'+
                                   '<a href="javascript:;" id="fb-logout-link" class="fb-links">'+
                                   '<div id="fb-logout-div" class="fb-btn">'+
                                   '<i class="icon-signout iconoF"></i>Cerrar Sesión en Facebook'+
                                   '</div>'+
                                   '</a>'+
                                   '<a href="javascript:;" id="fb-zca-link" class="fb-links">'+
                                   '<div id="fb-zca-div" class="fb-btn">'+
                                   '<i class="icon-group iconoF"></i>Zona Comercial Abierta en Facebook'+
                                   '</div>'+
                                   '</a>');
        $('#fb-login-link').attr({'onclick': 'loginFacebookBrowser(event);'});      
//        $('#fb-login-link').attr({'onclick': 'abrirAppInBrowser();'});      
        $('#fb-logout-link').attr({'onclick': 'logoutFacebookBrowser(event);'});    
        $('#fb-zca-link').attr({'onclick': 'verZCAFacebookBrowser(event);'});                       
                                   
                                   $('#contentFacebook').hide().fadeIn('fast');
                                   $.mobile.loading('hide');
        $.mobile.changePage($('#PaginaFacebook'));
    }
    else {
        MostrarAlerta(alert_conexion_mensaje , alert_conexion_titulo , alert_conexion_boton);
    }
    PararEvento(event);
}

/**
 * CargarTutorial. carga la página que muestra todas las pestañas del tutorial.
 * 
 * @param: contador posiciónn actual por si el el botónn que lanza el evento es
 *         la flecha de avance
 */
{
    function CargarTutorial(event, contador){
        if(ComprobarConexion()){
            $.mobile.loading('show', {text: "Cargando", textVisible:true, textonly:true});
            $('#ContentDiv').empty();   
            posT++;
            if(posT<5){
                $('#texto').hide().fadeIn(200);		
                $('#imagen').hide().fadeIn(200);	
                $('#marcador').hide().fadeIn(200);
                cambiarPagina(posT);
            }else{
                $.mobile.changePage($('#PaginaInicial'));
                posT=0;
            }
            $.mobile.loading('hide');
        }
        else {
            MostrarAlerta(alert_conexion_mensaje , alert_conexion_titulo , alert_conexion_boton);
        }
        PararEvento(event);    
    }
    
    function CargarTutorial1(event){
        if(ComprobarConexion()){	    
            $.mobile.loading('show', {text: "Cargando", textVisible:true, textonly:true});
            $('#ContentDiv').empty();
            console.log('estoy en la pagina tutorial '+1);
            $('#texto').hide().fadeIn('fast');      
            $('#imagen').hide().fadeIn('fast'); 
            $('#marcador').hide().fadeIn('fast');
            posT=1;
            posT++;
            $.mobile.changePage($('#PaginaTutorial1'));
            $.mobile.loading('hide');
        }
        else {
            MostrarAlerta(alert_conexion_mensaje , alert_conexion_titulo , alert_conexion_boton);
        }
        PararEvento(event);
    }
    
    function CargarTutorial2(event){
        if(ComprobarConexion()){	
            $.mobile.loading('show', {text: "Cargando", textVisible:true, textonly:true});
            $('#ContentDiv').empty();
            $('#texto').hide().fadeIn('fast');      
            $('#imagen').hide().fadeIn('fast'); 
            $('#marcador').hide().fadeIn('fast');
            posT=2;
            posT++;
            $.mobile.changePage($('#PaginaTutorial2'));
            $.mobile.loading('hide');
        }
        else {
            MostrarAlerta(alert_conexion_mensaje , alert_conexion_titulo , alert_conexion_boton);
        }
        PararEvento(event);    
    }
    
    function CargarTutorial3(event){
        if(ComprobarConexion()){	
            $.mobile.loading('show', {text: "Cargando", textVisible:true, textonly:true});
            $('#ContentDiv').empty();
            $('#texto').hide().fadeIn('fast');      
            $('#imagen').hide().fadeIn('fast'); 
            $('#marcador').hide().fadeIn('fast');
            posT=3;
            posT++;
            $.mobile.changePage($('#PaginaTutorial3'));
            $.mobile.loading('hide');
        }
        else {
            MostrarAlerta(alert_conexion_mensaje , alert_conexion_titulo , alert_conexion_boton);
        }
        PararEvento(event);    
    }
    
    function CargarTutorial4(event){
        if(ComprobarConexion()){	
            $.mobile.loading('show', {text: "Cargando", textVisible:true, textonly:true});
            $('#ContentDiv').empty();
            $('#texto').hide().fadeIn('fast');      
            $('#imagen').hide().fadeIn('fast'); 
            $('#marcador').hide().fadeIn('fast');
            posT=4;
            posT++;
            $.mobile.changePage($('#PaginaTutorial4'));
            $.mobile.loading('hide');
        }
        else {
            MostrarAlerta(alert_conexion_mensaje , alert_conexion_titulo , alert_conexion_boton);
        }
        PararEvento(event);    
    }
    
    /**
 * DescargarTutorial.
 */
    function DescargarTutorial(event, contador){
        if(ComprobarConexion()){	
            $.mobile.loading('show', {text: "Cargando", textVisible:true, textonly:true});
            $('#ContentDiv').empty();   
            posT--;
            if(posT>0){
                $('#texto').hide().fadeIn(200);      
                $('#imagen').hide().fadeIn(200); 
                $('#marcador').hide().fadeIn(200);
                cambiarPagina(posT);
            }
            else{
                $.mobile.changePage($('#PaginaInicial'));
                posT=0;
            }
            $.mobile.loading('hide');
        }
        else {
            MostrarAlerta(alert_conexion_mensaje , alert_conexion_titulo , alert_conexion_boton);
        }
        PararEvento(event);    
    }
    
    /**Eventos*/
    // derecha
    
    $('#PaginaTutorial1').on('swiperight', function(event){
        $.mobile.changePage($('#PaginaInicial'));
        posT=0;
        PararEvento(event);
    });
    $('#PaginaTutorial2').on('swiperight', function(event){
        $.mobile.changePage($('#PaginaTutorial1'));
        posT=1;
        PararEvento(event);
    });
    $('#PaginaTutorial3').on('swiperight', function(event){
        $.mobile.changePage($('#PaginaTutorial2'));
        posT=2;
        PararEvento(event);
    });
    $('#PaginaTutorial4').on('swiperight', function(event){
        $.mobile.changePage($('#PaginaTutorial3'));
        posT=3;
        PararEvento(event);
    });
    
    // izquierda
    $('#PaginaTutorial1').on('swipeleft', function(event){
        $.mobile.changePage($('#PaginaTutorial2'));
        posT=2;
        PararEvento(event);
    });
    $('#PaginaTutorial2').on('swipeleft', function(event){
        $.mobile.changePage($('#PaginaTutorial3'));
        posT=3;
        PararEvento(event);
    });
    $('#PaginaTutorial3').on('swipeleft', function(event){
        $.mobile.changePage($('#PaginaTutorial4'));
        posT=4;
        PararEvento(event);
    });
    $('#PaginaTutorial4').on('swipeleft', function(event){
        $.mobile.changePage($('#PaginaInicial'));
        posT=0;
        PararEvento(event);
    });
    /*
    document.getElementById('PaginaSector').getElementsByClassName('ui-input-text').addEventListener(function(){
        console.log('has escrito');
        cebra('lstSectores');
    },'change',false);
      */  
}
// JavaScript Document