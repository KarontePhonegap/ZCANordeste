// JavaScript Document/*--- PROPIEDADES ---*/
var ZCABD;
var i;
var existe = false;


/**
 * obtenerDB.   carga la base de datos, y llama otro método que crea las tablas si no existen
 */
function obtenerBD() {
    console.log('zcabd '+ZCABD);
    ZCABD = window.openDatabase("ZCADB", "1.0", "ZCADB", 2000000);
    console.log('contenido del objeto zcabd '+ZCABD);
    ZCABD.transaction(comprobarBD, errorBD, okBD);
}

/**
 * comprobarBD. si la tabla no existe, la crea. Si lo logra produce un mensaje positivo y si no uno negativo
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
 * transaccionOK.   emite un mensaje positivo
 * @param   mensaje.    el mensaje personalizado del método que invoca este otro
 */
function oktx(mensaje){
        //quiero recuperar la lista
        console.log(mensaje);
        //mostrarFavoritos();
}