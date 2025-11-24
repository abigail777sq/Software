Se requiere implementar el módulo de cálculo de la nota final, alineado con los RF y RNF descritas. La solución puede desarrollarse en el lenguaje de programación de su preferencia y deberá ejecutarse desde la terminal. No es necesario implementar persistencia en base de datos ni una interfaz gráfica. Priorice una solución funcional, modular y correctamente estructurada dentro del tiempo disponible.

Requerimientos Funcionales

RF01: Como docente de UTEC podré registrar las evaluaciones de un estudiante, indicando para cada una la nota obtenida y su porcentaje de peso sobre la nota final.
(Variable: examsStudents).

RF02: Como docente podré registrar si el estudiante cumplió la asistencia mínima requerida por el reglamento académico de UTEC.
(Variable: hasReachedMinimumClasses).

RF03: Como docente podré registrar, para cada año académico, si los docentes del curso están de acuerdo en otorgar puntos extra a los estudiantes que cumplan ciertos criterios.
(Variable: allYearsTeachers con valores True/False).

RF04: Como docente podré solicitar el cálculo de la nota final de un estudiante, considerando evaluaciones, asistencia mínima y políticas de puntos extra.

RF05: Como docente podré visualizar el detalle del cálculo: promedio ponderado, penalización por inasistencias y puntos extra aplicados.
Requerimientos No Funcionales

RNF01: La cantidad máxima de evaluaciones por estudiante será de 10.

RNF02: El sistema deberá soportar simultáneamente hasta 50 usuarios concurrentes solicitando el cálculo.

RNF03: El cálculo de la nota final deberá ser determinista: con los mismos datos de entrada siempre deberá generar la misma nota final.

RNF04: El tiempo de cálculo deberá ser menor a 300 ms por solicitud.

Caso de Uso

Sistema: CS-GradeCalculator

Actor: Docente UTEC

Caso de Uso: CU0001 – Calcular nota final del estudiante

El docente ingresa a la aplicación.

La aplicación solicita los datos del estudiante (código o identificador).

El docente registra o revisa las evaluaciones con sus notas y pesos.

El docente indica si el estudiante alcanzó la asistencia mínima.

La aplicación consulta la política de puntos extra definida colectivamente (lista allYearsTeachers).

La aplicación calcula la nota final del estudiante.

La aplicación muestra la nota final y el detalle del cálculo.

Criterios
1. Cumplimiento de RF / RNF — 2 pts

Implementación correcta de RF01–RF05.

Cumplimiento de RNF01–RNF03 (límite de evaluaciones, determinismo del cálculo, manejo de casos borde).

No existen “atajos”: datos hardcodeados, cálculos fuera de las clases correspondientes.

Entradas y salidas bien definidas.

2. Diseño y Arquitectura OO — 2 pts

Separación clara de responsabilidades.

Uso adecuado y coherente de clases como Evaluation, GradeCalculator, AttendancePolicy, ExtraPointsPolicy, etc.

Bajo acoplamiento y alta cohesión entre componentes.

UML simple y coherente con el código final (no solamente copiado).

3. Calidad del Código — 2 pts

Aspectos evaluados:

Nombres significativos (no usar x1, dato, aux, etc.).

Ausencia de valores mágicos: uso adecuado de constantes o configuración.

Manejo correcto de errores y validaciones.

Comentarios relevantes (no repetitivos ni redundantes).

Formato consistente y código legible.

Se evaluará mediante SONARQUBE.

4. Pruebas Automatizadas — 2 pts

Se evalúan:

Tests unitarios que cubren:

Cálculo normal.

Caso sin asistencia mínima.

Caso con y sin puntos extra.

Casos borde (0 evaluaciones, pesos inválidos, asistencia negativa, etc.).

Claridad en los nombres de pruebas (shouldReturnXWhenY).

Cobertura mínima razonable (≥ 50% aceptable, ≥ 60% excelente).