var favoritosCargados = false;
var listaFavoritos = new Array();


function mostrarFavoritos(){
    if(listaFavoritos!=null){
        console.log('        Tabla Favoritos-------------');
        for(i = 0; i<listaFavoritos.length; i++){
            console.log('     #'+listaFavoritos[i].nombreComercio);
        }
        console.log('        ---------------------------');
    }
    else{
        console.log('listaFavoritos = vacia');
    }
    
    // Actualiza la lista con los favoritos
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
 * ConsultarFavoritos. 
 */
function obtenerFavoritos() {
    ZCABD.transaction(
        function consultarFavoritos(tx) { //auxiliar
            tx.executeSql("select * from FAVORITOS ", [], listarFavoritos);
        }, errorBD, oktx(' '));
    
}

/**
 * listarFavoritos. recibe el resultado de la consulta a la tabla favoritos y lo almacena en una lista
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
                }, errorBD, oktx('DB - Insertado:'+nombreComercio));
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
            console.log('BD - esFavorito: si');
        }
    }
    return existe;
}

/**
 *  eliminarFavorito. 
 */ 
function eliminarFavorito(nombreComercio) {
    var temp;
    var listaTemp = new Array();
    if(esFavorito(nombreComercio)) {
        ZCABD.transaction(function(tx) {
            tx.executeSql("DELETE FROM FAVORITOS WHERE nombreComercio like '"+nombreComercio+"'");
        }, errorBD, oktx('DB - Eliminado:'+nombreComercio));
        
        for (i = 0; i < listaFavoritos.length; i++){
            temp = listaFavoritos[i];
            if (temp.nombreComercio.toUpperCase != $.trim(nombreComercio).toUpperCase){
                listaTemp.push(listaFavoritos[i]);
            }
        }
        listaFavoritos = listaTemp;
        
        mostrarFavoritos();
    }
}
