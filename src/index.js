const readline = require('node:readline');
const Evaluation = require('./model/Evaluation');
const GradeCalculator = require('./service/GradeCalculator');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const calculator = new GradeCalculator();
const evaluations = [];
let hasAttendance = true;
let teachersAgreement = [];

function showMenu() {
    console.log("\n=== CS-GradeCalculator ===");
    console.log("1. Agregar Evaluación");
    console.log(`2. Registrar Asistencia (Actual: ${hasAttendance ? "Cumplida" : "No Cumplida"})`);
    console.log("3. Registrar Política de Puntos Extra");
    console.log("4. Calcular Nota Final");
    console.log("5. Salir");
    rl.question("Seleccione una opción: ", handleInput);
}

function handleInput(choice) {
    switch (choice) {
        case '1':
            if (evaluations.length >= 10) {
                console.log("Error: Máximo 10 evaluaciones permitidas.");
                showMenu();
                break;
            }
            rl.question("Ingrese la nota (0-20): ", (scoreStr) => {
                rl.question("Ingrese el peso (%): ", (weightStr) => {
                    try {
                        const score = Number.parseFloat(scoreStr);
                        const weight = Number.parseFloat(weightStr);
                        if (Number.isNaN(score) || Number.isNaN(weight)) throw new Error("Debe ingresar números.");
                        evaluations.push(new Evaluation(score, weight));
                        console.log("Evaluación agregada.");
                    } catch (e) {
                        console.log(`Error: ${e.message}`);
                    }
                    showMenu();
                });
            });
            break;
        case '2':
            rl.question("¿El estudiante cumplió con la asistencia mínima? (s/n): ", (ans) => {
                hasAttendance = (ans.toLowerCase() === 's');
                showMenu();
            });
            break;
        case '3':
            console.log("Ingrese las decisiones de los docentes (s/n). Ingrese vacío para terminar.");
            teachersAgreement = [];
            collectVotes();
            break;
        case '4':
            try {
                const result = calculator.calculate(evaluations, hasAttendance, teachersAgreement);
                console.log("\n--- Resultado ---");
                console.log(`Promedio Ponderado: ${result.weightedAverage}`);
                console.log(`Penalización por Asistencia: -${result.penalty}`);
                console.log(`Puntos Extra: +${result.extraPoints}`);
                console.log(`NOTA FINAL: ${result.finalScore}`);
                console.log("-----------------");
            } catch (e) {
                console.log(`Error en el cálculo: ${e.message}`);
            }
            showMenu();
            break;
        case '5':
            console.log("Saliendo...");
            rl.close();
            break;
        default:
            console.log("Opción no válida.");
            showMenu();
            break;
    }
}

function collectVotes() {
    rl.question("Voto docente (s/n): ", (vote) => {
        if (vote === '') {
            console.log(`Registro completado: ${teachersAgreement}`);
            showMenu();
        } else {
            if (vote.toLowerCase() === 's' || vote.toLowerCase() === 'n') {
                teachersAgreement.push(vote.toLowerCase() === 's');
            } else {
                console.log("Entrada inválida.");
            }
            collectVotes();
        }
    });
}

let studentId = "";

function startApp() {
    console.log("=== CS-GradeCalculator ===");
    rl.question("Ingrese el código o identificador del estudiante: ", (id) => {
        studentId = id;
        console.log(`Estudiante: ${studentId}`);
        showMenu();
    });
}

if (require.main === module) {
    startApp();
}
