//DATABASE. obtiene la base de datos web sql y la crea de nuevo si no existe


/**--       PROPIEDADES      --**/
var ZCABD;
var i;
var existe = false;


/**
 * obtenerDB.   carga la base de datos, y llama otro método que crea las tablas si no existen
 */
function obtenerBD() {
    ZCABD = window.openDatabase("ZCADB", "1.0", "ZCADB", 400);
    ZCABD.transaction(comprobarBD, errorBD, okBD);
}

/**
 * comprobarBD. si la tabla no existe, la crea. 
 */
{
function comprobarBD (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS FAVORITOS (Id INTEGER, nombreComercio VARCHAR(100))');
    
}

function errorBD(err) {
    console.log("BD - ERROR: al procesar una consulta SQL: " + err.message + ", código: " + err.code);	
}

function okBD() {
    console.log("BD - OK: comprobada");
    mostrarFavoritos();
}
}
	
/**
 * OKtx.   emite un mensaje positivo si la transacción se a efectuado correctamente
 * @param   mensaje.    el mensaje personalizado del método que invoca este otro
 */
function oktx(mensaje){
        //quiero recuperar la lista
        console.log(mensaje);
        //mostrarFavoritos();
}