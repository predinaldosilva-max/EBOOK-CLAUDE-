> Versão 1.1.0: o acesso agora é validado no servidor; abertura e revalidação exigem internet. Orientações antigas sobre acesso local/offline foram substituídas. Consulte ../../IMPLANTACAO.md.

# Manual — USA WORK KIT

## 1. Primeros pasos

Desde la versión 1.0.2, usa solo celular: Safari en iPhone o Chrome en Android mediante la publicación HTTPS. Computadoras y tabletas están bloqueadas. Elige Español o PT-BR. No necesitas cuenta. El ZIP no es un instalador móvil; consulta HOSPEDAGEM.md. Usa la versión móvil del navegador y evita el modo privado.

Todos los valores son USD, las distancias son millas y el tiempo se indica en horas o minutos según la etiqueta. No hay conversiones ni cálculo de impuestos. Si el navegador no admite coma decimal, usa punto. Los resultados se muestran según el idioma elegido.

## 2. Entregas

Introduce pago, propina solo si no está incluida, millas totales con desplazamiento/regreso, costo operativo por milla, duración, espera y tu meta por hora. El costo no se fija automáticamente: considera combustible, mantenimiento y desgaste.

Bruto = pago + propina adicional; costo = millas × costo/milla; resultado = bruto − costo; por hora = resultado / ((minutos + espera)/60); por milla = bruto/millas. Cero millas produce “No calculable” para ese indicador. La duración debe ser positiva. Se rechazan entradas negativas, pero se muestran resultados negativos.

Ejemplo: 20 de pago + 5 de propina; 10 millas × 0,50; 25 minutos + 5 de espera → bruto 25, costo 5, resultado 20, 40/h y 2,50/milla.

Guarda la oferta A y cambia los campos para comparar B. La comparación dura solo la sesión. Registra la entrega una sola vez, después de completarla, con la fecha correcta. El historial suma hoy y desde el lunes hasta hoy; los ingresos brutos del historial abarcan todos los registros del módulo.

## 3. Trabajo

Por hora = tarifa × horas; por día = tarifa × días; por servicio = tarifa × cantidad. Semanal/proyecto: introduce el total completo. Horas y días cubren TODO ese período, no cada servicio. Deja cantidad en 1 cuando no corresponda.

Resultado = ingresos − gastos; por hora = resultado/horas. Proyección semanal = resultado/días trabajados × días planificados por semana (1–7). Mensual = semanal × 52/12. La proyección presupone el mismo ritmo. Guarda cada fuente con nombre y fecha. Todo el ingreso se atribuye a la fecha seleccionada; no se distribuye entre días. Para corregir un ingreso, elimínalo y vuelve a registrarlo.

## 4. Metas

Introduce meta, resultado acumulado después de gastos, días y horas restantes y resultado estimado por hora. Son datos manuales, independientes del historial; los borradores se guardan automáticamente.

Restante = máximo(0, meta − acumulado); diario = restante/días; horas necesarias = restante/ganancia por hora; progreso = acumulado/meta × 100. La barra se limita a 100%, el número puede superarlo. Proyección = acumulado + horas disponibles × ganancia/hora. Una meta ya alcanzada requiere cero horas. Con cero días o cero ganancia, los indicadores que no se puedan dividir muestran “No calculable”.

Actualiza la meta al empezar cada semana. Se conserva la meta actual, no un historial semanal. Los informes la identifican como un dato manual actual.

## 5. Gastos

Registra descripción, valor, vencimiento, categoría, tipo personal/profesional y estado pagado/pendiente. Guarda, edita, cambia el estado o elimina con confirmación. El filtro mensual sigue el vencimiento. Los totales incluyen pendientes; no representan solo efectivo pagado.

No registres nuevamente costos ya incluidos en entregas o ingresos de Trabajo. Los informes descuentan ambos y duplicarías el gasto. Este módulo puede contener los gastos adicionales aún no descontados.

## 6. Precios

Base = horas × remuneración deseada/hora + materiales + transporte + otros gastos. Precio = base/(1 − margen/100). El margen se calcula sobre el precio, no es un recargo sobre el costo, y debe ser menor del 100%. Resultado adicional = precio − base; la remuneración por tu tiempo ya forma parte de la base.

Ejemplo: 4 h × 25 + 20 + 10 = base 130. Margen 20% → precio 162,50; resultado adicional 32,50. Completa profesional, servicio, descripción, fecha y condiciones antes de imprimir. Elige Guardar como PDF en el sistema. No se incluyen impuestos, retenciones ni tarifas oficiales.

## 7. Mensajes

Hay diez tipos en inglés, portugués y español. Personaliza nombre, servicio, importe y fecha/hora. Escribe la fecha en el idioma del cliente. Los datos ausentes aparecen entre corchetes. Revisa y copia. Si el navegador bloquea el portapapeles, selecciona y copia manualmente. No se envían mensajes automáticamente.

## 8. Informes y respaldos

Elige fechas inicial y final, inclusive. Los ingresos siguen la fecha del registro y los gastos el vencimiento, pagados y pendientes. Resultado = ingresos − costos de ingresos − gastos adicionales. El CSV contiene actividades, totales y la meta actual si es válida; la impresión también agrupa fuentes de ingresos. CSV: UTF-8 con BOM, separador coma y campos entre comillas. El apóstrofo de seguridad impide interpretar contenido como fórmula. Al abrirlo en una hoja de cálculo, selecciona UTF-8 y coma.

PDF usa la impresión del navegador: elige Guardar como PDF o compartir desde el sistema. No es un documento fiscal.

Exporta JSON periódicamente y antes de borrar datos, cambiar de dispositivo, mover la carpeta local o actualizar. Para transferir, exporta en un dispositivo y restaura en el otro. Restaurar sustituye todo tras confirmar; no combina. Se rechazan archivos de más de 5 MB, versiones incompatibles, fechas inválidas y estructuras incorrectas. Máximo de 20 mil registros combinados; el almacenamiento real puede ser menor.

El respaldo no está cifrado. Guárdalo de forma segura. No introduzcas contraseñas, documentos, tarjetas ni datos bancarios. Si el navegador rechaza el guardado, los cambios quedan solo en la sesión: exporta antes de cerrar. Si los datos locales están dañados, se bloquea el guardado para no sobrescribirlos; restaura un respaldo válido.

## 9. Sin conexión

El paquete local contiene los archivos necesarios, pero el manejo de `file://` varía. La versión HTTPS guarda recursos tras la primera carga completa; verifica el estado en Informes y respaldo. El sistema puede borrar caché y datos por falta de espacio. No hay sincronización, garantía de persistencia ni funcionamiento sin conexión antes de la primera carga. Las pruebas en teléfonos reales están pendientes, como consta en TESTES.md.


## Acceso con contraseña — versión 1.0.3
Abre en el celular e introduce la contraseña entregada por el vendedor después de confirmar la compra. El navegador recuerda el acceso cuando el almacenamiento está disponible. Usa Bloquear acceso para cerrar el acceso sin borrar registros. Si borras los datos del navegador, deberás introducir la contraseña de nuevo. El respaldo JSON no incluye la contraseña. Esta versión no limita el acceso a un único dispositivo. Nunca entregues contraseñas de Kiwify ni de plataformas de trabajo.
