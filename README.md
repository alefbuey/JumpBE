## Para crear la base de de datos

Descomentar la linea 65 en userModels.js

    sequelize.sync({force: true})

Correr una vez el programa y volver a comentar. Adicionalmente, puedes correr el JumpPrueba.sql para tener
datos con los cuales probar la aplicación. Además en esta parte se encuentran algunos triggers necesarios.

## CRUD de user

##select

```json
{ 
"email"	:	"felipe96@gmail.com",	
"password" : "f1234"
}
```
##create
```json

{
"name"		: "Felipe",
"lastname"	: "Castro",
"birthdate"	: "1996-04-21",
"gender" : "M",
"email"	:	"felipe96@gmail.com",	
"password" : "f1234",
"idlocation": "4"
}
```
## CRUD de job.

##select
```json
{
    "id" : "2",     
    "idemployer" : "2"
}
```
##create
```json
{
	"idemployer" : "4",
	"mode" :	   "2",
	"title" :	   "Crear un videojuego",
	"description":	"Crear un juego de rol MMORPG con las sig...",
	"jobcost"	:	"15000.00",	
	"jobcostcovered": "15000.00",		
	"datestart"	: "2019-02-15",
	"dateend": "2020-02-15",
	"datepostend":	"2019-05-15",	
	"numbervacancies":	"5"	

}
```
##update
```json
{
	"id" : "4",
	"updateData" : {
		"description" : "Un juego de celular"
	}
}
```