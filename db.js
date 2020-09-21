var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user:'root',
  password: 'root',
  database:'density' 
});

connection.connect();

// connection.end()
module.exports = connection;


// INSERT INTO location_data (ALIAS, NAME, LAST_NAME, LAST_NAME1, COUNTRY, STATE, CITY, LONGITUDE, ALTITUDE, DOB, ID_ESC, GEN, PROFESSION, PIC_PROFILE) VALUES ('PANCHO VILLA', 'FRANCISCO JAVIER', 'VILLA', 'MARTINEZ', 'USA', 'TEXAS', 'MCALLE', CAST(36.185510 AS Decimal(9, 6)), CAST(-97.235926 AS Decimal(9, 6)), CAST('1976-01-01' AS Date), 1, '1988-1991', 'CIRUJANO', "")
// INSERT INTO location_data (ALIAS, NAME, LAST_NAME, LAST_NAME1, COUNTRY, STATE, CITY, LONGITUDE, ALTITUDE, DOB, ID_ESC, GEN, PROFESSION, PIC_PROFILE) VALUES ('JUAN CHARRASCAS', 'JUAN ALBERTO', 'PEREZ', 'LOPEZ', 'MEXICO', 'NUEVO LEO', 'MONTERREY', CAST(32.678856 AS Decimal(9, 6)), CAST(-105.282724 AS Decimal(9, 6)), CAST('1982-01-01' AS Date), 1, '1993-1996', 'ING. INDUSTRIAL', "")
// CREATE TABLE location_data (
// 	ID_CAN int NOT NULL,
// 	ALIAS varchar(50) NOT NULL,
// 	NAME varchar(50) NOT NULL,
// 	LAST_NAME varchar(50) NOT NULL,
// 	LAST_NAME1 varchar(50) NOT NULL,
// 	COUNTRY varchar(50) NOT NULL,
// 	STATE varchar(50) NOT NULL,
// 	CITY varchar(50) NOT NULL,
// 	LONGITUDE decimal(9, 6) NOT NULL,
// 	ALTITUDE decimal(9, 6) NOT NULL,
// 	DOB date NOT NULL,
// 	ID_ESC int NOT NULL,
// 	GEN varchar(10) NOT NULL,
// 	PROFESSION varchar(50) NOT NULL,
// 	PIC_PROFILE varchar(1000) NOT NULL,
//  CONSTRAINT PK_CAN_DATA PRIMARY KEY CLUSTERED (ID_CAN ASC)
//  )