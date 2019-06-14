# Jump BackEnd

Is a web service developed on NodeJs with Postgresql for a freelancer app.

## Getting Started

In order to create de DataBase, uncomment the line in dbJump.js

    sequelize.sync({force: true})

Run once the program and comment again. Also, run the file JumpPrueba.sql in order to get the sample data for proving the app.
In the last file, thre are some needed triggers.


## CRUD of user

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
## CRUD of job.

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

## Authors

* **Oscar Guarnizo**
* **Fernando Zhapa**
