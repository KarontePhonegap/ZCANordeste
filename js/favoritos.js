//FAVORITOS. gestiona todo lo referente a los favoritos y la #PaginaFavoritos


/**--       PROPIEDADES      --**/
var favoritosCargados = false;
var listaFavoritos = new Array();


/**
 *  mostrarFavoritos.   imprime por consola la lista de favoritos si esta no es nula y también los muestra en la interfaz de la aplicación
 */
function mostrarFavoritos(){
    if(listaFavoritos!=null){
        console.log('-Tabla Favoritos-------------');
        for(i = 0; i<listaFavoritos.length; i++){
            console.log('   #'+listaFavoritos[i].nombreComercio);
        }
        console.log('-----------------------------');
    }
    else{
        console.log('listaFavoritos = vacia');
    }
    
    // Actualiza la lista de favoritos de la #PaginaFavoritos
    $('#lstFavoritos').empty();
    for (var x=0; x<listaFavoritos.length; x++) {
        $('#lstFavoritos').append('<li>'+'<a href="javascript:;" onClick="CargarDetallesComercio(event,'+listaFavoritos[x].Id+')">'+ 
                                  '<h3>'+listaFavoritos[x].nombreComercio+'</h3>'+
                                  '</a>'+
                                  '</li>');
    }
    
    if ($('#lstFavoritos').hasClass('ui-listview')) {
        $('#lstFavoritos').listview('refresh');
    }
}


/**
 * agregarQuitarFavorito. agrega un comercio a los favoritos y cambia el color del botón al pulsar el botón favorito en la página de su detalle.
 * @param: Id Identificaciónn del comercio que se desea agregar a favoritos
 */
function agregarQuitarFavorito(event, Id){
    var nombreItem;
    $.getJSON(urlObtenerComerciosPorId + "?callback=?",{'Id': Id},
              function(data){
                  if (data){
                      $.each(data, function(i, item){
                          nombreItem = item['NombreComercio'];
                          if(!esFavorito(nombreItem)){
                              console.log('agregando favorito');
                              insertarFavorito(Id, nombreItem);
                              $('#favoritobtn a > span').addClass('marcado');
                              
                          }else{
                              console.log('eliminando favorito');
                              eliminarFavorito(nombreItem);
                              $('#favoritobtn a > span').removeClass('marcado');
                          }
                      });
                  }
              }
             );
    PararEvento(event);
    $.mobile.loading('hide');
    $.mobile.changePage($('#PaginaDetalleComercio'));
}

/**
 * obtenerFavoritos.    a partir de la consulta obtine una lista que posteriormente pasa por parámetro a la función listarFavoritos
 */
function obtenerFavoritos() {
    ZCABD.transaction(
        function consultarFavoritos(tx) { //auxiliar
            tx.executeSql("select * from FAVORITOS ", [], listarFavoritos);
        }, errorBD, oktx(' '));
    
}

/**
 * listarFavoritos. recibe el resultado de la consulta efectuada por obtenerFavoritos() y la almacena en el array auxiliar listaFavoritos
 * @params  tx y results
 */
function listarFavoritos(tx, results) {
    listaFavoritos=[];
    var len = results.rows.length;
    if (len>0){
        for(i=0; i<len; i++) {			
            var favorito = results.rows.item(i);
            listaFavoritos.push({'Id': favorito.Id,'nombreComercio': $.trim(favorito.nombreComercio)});
        }
    }
    mostrarFavoritos();
}

/**
 * eliminarTodo. borra todas las tablas de la base de datos
 */
function eliminarTodo() {
    ZCABD.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS FAVORITOS');
        oktx('TODO eliminado');
    }, errorBD);
}

/**
 *  insertarFavorito. añade un elemento a la tabla de favoritos
 *  @params : nombreComercio 	el nombre del comercio que se desea extraer
 */ 
function insertarFavorito(id, nombreComercio) {
    if(!esFavorito(nombreComercio)) {
        try{
            ZCABD.transaction(
                function insertar(tx) {
                    tx.executeSql("INSERT INTO FAVORITOS (Id, nombreComercio) VALUES("+id+",'"+ $.trim(nombreComercio)+"')");               
                }, errorBD, oktx('favoritos - Insertado:'+nombreComercio));
        }catch(e){
            e.message();
        }
        
        // Inserción del favorito en la lista actual
        listaFavoritos.push({'Id': id,'nombreComercio': nombreComercio});
        mostrarFavoritos();
    }
}

function esFavorito(nom){
    console.log('ble');
    existe = false;
    console.log('tamaño lista favoritos'+listaFavoritos.length);
    for(i = 0; i<listaFavoritos.length; i++){
        if(listaFavoritos[i].nombreComercio==nom){
            existe=true;
        }
    }
    return existe;
}

/**
 *  eliminarFavorito.   si el comercio recibido es favorito lo elimina de la base de datos por su nombre. 
 *  También copia todos los favoritos que no son dicho comercio y los amacena en una tabla auxiliar que después igual a listaFavoritos
 */ 
function eliminarFavorito(nombreComercio) {
    var temp;
    var listaTemp = new Array();
    if(esFavorito(nombreComercio)) {
        ZCABD.transaction(function(tx) {
            tx.executeSql("DELETE FROM FAVORITOS WHERE nombreComercio like '"+nombreComercio+"'");
        }, errorBD, oktx('favoritos - Eliminado:'+nombreComercio));
        
        for (i = 0; i < listaFavoritos.length; i++){
            temp = listaFavoritos[i];
            
            console.log('lista'+temp.nombreComercio.toUpperCase());
            console.log('comercio'+$.trim(nombreComercio).toUpperCase());
            
            if (temp.nombreComercio.toUpperCase() != $.trim(nombreComercio).toUpperCase()){
                listaTemp.push(listaFavoritos[i]);
            }
        }
        listaFavoritos = listaTemp;
        mostrarFavoritos();
    }
}
