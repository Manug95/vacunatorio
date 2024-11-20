# Argentina-Vacuna
## Especificación del problema

El programa de vacunación del Ministerio de salud de la Nación Argentina se encarga de comprar y
gestionar las miles o millones de vacunas que Argentina compra a los diferentes Laboratorios
internacionales para cumplir con el calendario de vacunación obligatorio.

Bajo este contexto, se nos encarga el desarrollo de una aplicación web que permita gestionar la
trazabilidad de cada dosis desde que es adquirida por el Ministerio hasta que es
administrada/aplicada a cada persona.

Cada vacuna adquirida se mantiene en depósitos que tiene el Ministerio de Salud a la espera de
ser distribuidas a alguna de las provincias.

Cada vacuna tiene exactamente una dosis, del cual se conoce su laboratorio, tipo de vacuna (BCG,
Doble Viral, Triple Viral, etc), nombre comercial, país de origen, fecha de fabricación, vencimiento,
fecha de compra y fecha de adquisición (cuando llega al país). Las vacunas vienen embaladas en
cajas de diferentes cantidades identificadas con un número escaneable de lote-proveedor.

Las vacunas son enviadas a las distintas provincias para que ellas sean administradas. Tener en
cuenta que de un mismo lote-proveedor se pueden distribuir distintas cantidades a distintas
provincias. (Esto implica que el sistema debe proveer algún mecanismo para poder discriminar
cada lote distribuido a cada provincia)

Una vez distribuidas a las provincias, un programa de vacunación provincial es el encargado de
almacenarlas, distribuirlas a los centros de vacunación y administrarlas.

El programa provincial controlará el estado de las vacunas, las almacenará en depósito y registrará
la llegada de estas. En caso de existir vacunas que hayan sufrido un percance (roturas, perdidas de
frio, etc) todo el lote recibido será registrado como descartado (indicando un motivo).
Posteriormente cuando deban enviarse al centro de vacunación se registrará la fecha, cantidad de
dosis (por lote) y centro de vacunación al que serán enviadas.

Ya en el centro de vacunación una vez que la vacuna es aplicada al paciente, personal autorizado
registra la siguiente información: Nombre y Apellido, DNI, Fecha de Nacimiento, teléfono, mail,
genero, Localidad, Provincia y fecha de aplicación. Se registra también el centro de vacunación, el
enfermero que aplico la dosis y el lote-proveedor aplicado.

El sistema debe marcar como vencidas todas las vacunas que hayan cumplido su vencimiento y no
hayan sido aplicadas. Además, cuando se intente registrar la aplicación de una vacuna vencida
presentará una “Alerta importante” indicando la situación. Además, el sistema también permitirá
que en cualquier punto se puedan registrar el descarte de una vacuna, o lote ya sea por mal
estado o por vencimiento de esta. (Fecha de descarte, forma de descarte, motivo y persona a
cargo)

El sistema debe permitir al programa provincial registrar la información necesaria para poder
reasignar una partida de vacunas de un centro de vacunación a otro.

El sistema debe poder proveer la información necesaria para que el Ministerio de Salud de la
Nación pueda gestionar, distribuir y realizar las compras necesarias con la mejor eficiencia posible.

Algunos de los reportes que serán necesarios contar son:  
*  CSLT1: Cantidad de vacunas compradas a cada laboratorio por rango de fecha.  
*  CSLT2: Listado de lotes-proveedores por tipo de vacuna discriminando cuantas dosis se
   encuentran almacenadas en nación, en distribución, almacenadas en provincia, en
   centros de vacunación, aplicadas, descartadas y vencidas.  
*  CSLT3: Listado de stock disponible para vacunar por tipo de vacuna por provincia (No se
   consideran vacunas que estén en depósito de nación ni en distribución).  
*  CSLT4: Listado de personas por provincia, centro de vacunación y tipo de vacunas a las
   cuales se aplicó vacuna vencida.  
*  CSLT5: Listado de cantidad de vacunas vencidas (que no hayan sido registradas como
   descartadas) sumarizados por lotes-proveedor, provincia y centro de vacunación.  
*  CSLT6: Cantidad de personas vacunadas por tipo de vacuna por provincia y localidad.