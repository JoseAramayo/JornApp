let metodo, arrayHoraEntrada, arrayMinutoEntrada, arrayHoraSalida, arrayMinutoSalida, //metodo por entrada y salida
    arrayHorasDiurnas, arrayHorasNocturnas, arrayCheckBoxFerDom, // validar si es diurna/nocturna y domingo o feriado
    arrayDiurnas, arrayNocturnas, hDiurnas, hNocturnas, // método por horas diurnas y nocturnas
    totalDiurnas, totalNocturnas, totalDFerdom, totalNFerdom, diasLibres, cantDiasDelmes, // acumuladores
    arrayDiasDeLaSemana,  // arrays para guardar fechas y dias 
    arrayDia; // array que guarda las fechas

let version = "2.0.0";
document.getElementById('spanAppVersion').textContent = version;

let formato = new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
});

const form = document.querySelector("form");

const fechaActual = new Date();
const anio = fechaActual.getFullYear();
document.getElementById("selectMes").value = fechaActual.getMonth();
var mes = parseInt(document.getElementById("selectMes").value);
let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
let jornal = [13938, 18119, 27875, 36238]

document.getElementById("spanJornalDiurno").textContent = formato.format(jornal[0]);
document.getElementById("spanJornalNocturno").textContent = formato.format(jornal[1]);
document.getElementById("spanDiaFerDom").textContent = formato.format(jornal[2]);
document.getElementById("spanNocheFerDom").textContent = formato.format(jornal[3]);

function cargarPorEntradaSalida() {
    const divTitulos = document.createElement("div");
    divTitulos.classList.add("divTitulos");
    divTitulos.innerHTML = `
        <div class="divTitulos">
            <div class="container">
                <h3 title="Feriado/Domingo">Fer/Dom</h3>
            </div>
            <div class="container">
                <h3>Día</h3>
            </div>
            <div class="container">
                <h3>Fecha</h3>
            </div>
            <div class="container">
                <h3>Entrada</h3>
            </div>
            <div class="container">
                <h3>Salida</h3>
            </div>
        </div>`;
    form.appendChild(divTitulos);
    arrayDiasDeLaSemana = [];
    arrayDia = [];
    cantDiasDelmes = new Date(anio, mes + 1, 0).getDate();
    for (let dia = 1; dia <= cantDiasDelmes; dia++) {
        const fecha = new Date(anio, mes, dia);
        const diaSemana = fecha.toLocaleDateString("es-ES", { weekday: "long" });

        arrayDiasDeLaSemana.push(diaSemana);
        arrayDiasDeLaSemana.push("-");
        arrayDia.push(dia);
        arrayDia.push("-")

        const fechaFormateada = fecha.toLocaleDateString("es-ES");
        const divRow = document.createElement("div");
        divRow.classList.add("divRow");
        divRow.innerHTML = `
				<div class="container">
					<div  class="columnChkBox">
						<input type="checkbox" class="arrayCheckBoxFerDom" id="checkBoxId${dia}">
					</div>
				</div>
				<div class="container">
					<div  class="columnDate">
						<span class="dateWeek" id="dayId${dia}">${diaSemana}</span>
					</div>
				</div>
				<div class="container">
					<div  class="columnWeek">
						<span class="date">${fechaFormateada}</span>
					</div>
				</div>
				<div class="container">
					<div class="columnHE">
						<input placeholder="--" type="number" class="inputHE" min="0" max="23" id="HE${dia}" title="Hora de 00 a 23"  maxlength="2" required>
						<span>:</span>
						<input placeholder="--" type="number" class="inputME" min="0" max="59"  id="ME${dia}" title="Minutos de 00 a 59" maxlength="2" required>
					</div>
				</div>
				<div class="container">
					<div class="columnHS">
						<input placeholder="--" type="number" class="inputHS"  min="0" max="23"  id="HS${dia}" title="Hora de 00 a 23" maxlength="2" required>
						<span>:</span>
						<input placeholder="--" type="number" class="inputMS" min="0" max="59" id="MS${dia}" title="Minutos de 00 a 59" maxlength="2" required>
					</div>
				</div>`;
        form.appendChild(divRow);
        if (diaSemana === "domingo") {
            const checkboxDom = document.getElementById(`checkBoxId${dia}`);
            checkboxDom.checked = true;
            checkboxDom.disabled = true;
        }
    }
    function validarInputRango(clase, min, max) {
        document.querySelectorAll(`.${clase}`).forEach(input => {
            input.addEventListener("input", () => {
                let val = parseInt(input.value);
                if (isNaN(val)) return;

                if (val < min) input.value = min;
                else if (val > max) input.value = max;

                if (input.value.length === 2) {
                    autoAdvance(input);
                }
            });
            input.addEventListener("blur", () => {
                let val = parseInt(input.value);
                if (!isNaN(val)) {
                    input.value = val.toString().padStart(2, '0');
                }
            });
        });
    }

    function autoAdvance(currentInput) {
        const allInputs = document.querySelectorAll('input[type="number"]');
        const inputArray = Array.from(allInputs);
        const currentIndex = inputArray.indexOf(currentInput);
        
        if (currentIndex !== -1 && currentIndex < inputArray.length - 1) {
            const nextInput = inputArray[currentIndex + 1];
            nextInput.focus();
        }
    }
    validarInputRango("inputHE", 0, 23);
    validarInputRango("inputHS", 0, 23);
    validarInputRango("inputME", 0, 59);
    validarInputRango("inputMS", 0, 59);
};

function cargarPorHorasTrabajadas() {
    const divTitulos = document.createElement("div");
    divTitulos.classList.add("divTitulos");
    divTitulos.innerHTML = `
        <div class="divTitulos">
            <div class="container">
                <h3 title="Feriado/Domingo">Fer/Dom</h3>
            </div>
            <div class="container">
                <h3>Día</h3>
            </div>
            <div class="container">
                <h3>Fecha</h3>
            </div>
            <div class="container">
                <h3>Diurnas</h3>
            </div>
            <div class="container">
                <h3>Nocturnas</h3>
            </div>
        </div>`;
    form.appendChild(divTitulos);

    arrayDiasDeLaSemana = [];
    arrayDia = [];
    cantDiasDelmes = new Date(anio, mes + 1, 0).getDate();
    for (let dia = 1; dia <= cantDiasDelmes; dia++) {
        const fecha = new Date(anio, mes, dia);
        const diaSemana = fecha.toLocaleDateString("es-ES", { weekday: "long" });

        arrayDiasDeLaSemana.push(diaSemana);
        arrayDiasDeLaSemana.push("-");
        arrayDia.push(dia);
        arrayDia.push("-")

        const fechaFormateada = fecha.toLocaleDateString("es-ES");
        const divRow = document.createElement("div");
        divRow.classList.add("divRow");
        divRow.innerHTML = `
				<div class="container">
					<div  class="columnChkBox">
						<input type="checkbox" class="arrayCheckBoxFerDom" id="checkBoxId${dia}">
					</div>
				</div>
				<div class="container">
					<div  class="columnDate">
						<span class="dateWeek" id="dayId${dia}">${diaSemana}</span>
					</div>
				</div>
				<div class="container">
					<div  class="columnWeek">
						<span class="date">${fechaFormateada}</span>
					</div>
				</div>
				<div class="container">
					<div class="columnHE">
						<input placeholder="--" type="number" class="inputHE" id="HD${dia}"  maxlength="2" required>
					</div>
				</div>
				<div class="container">
					<div class="columnHS">
						<input placeholder="--" type="number" class="inputHS" id="HN${dia}" maxlength="2" required>
					</div>
				</div>`;
        form.appendChild(divRow);
        if (diaSemana === "domingo") {
            const checkboxDom = document.getElementById(`checkBoxId${dia}`);
            checkboxDom.checked = true;
            checkboxDom.disabled = true;
        }
    }
};

function textoInformativo() {
    const textoInformativo = document.createElement("p");
    textoInformativo.classList.add("p-texto-informativo");
    textoInformativo.innerHTML = "Selecciona un método de carga.";
    form.appendChild(textoInformativo);
}

document.addEventListener("DOMContentLoaded", function () {
    textoInformativo();
});

document.getElementById("select-metodo").addEventListener("change", function () {
    metodo = document.getElementById("select-metodo").value;
    document.getElementById("selectMes").disabled = false;
    if (metodo === "0") {
        form.innerHTML = "";
        textoInformativo();
    } else if (metodo === "1") {
        form.innerHTML = "";
        cargarPorEntradaSalida();
        // calcularPorEntradaSalida();
    } else {
        form.innerHTML = "";
        cargarPorHorasTrabajadas();
        // calcularPorHorasTrabajadas();
    }
    calcular()
});

document.getElementById("selectMes").addEventListener("change", function () {
    metodo = document.getElementById("select-metodo").value;
    form.innerHTML = "";
    mes = parseInt(this.value);
    if (metodo === "1") {
        cargarPorEntradaSalida();
        // calcularPorEntradaSalida();

    } else if (metodo === "2") {
        cargarPorHorasTrabajadas();
        // calcularPorHorasTrabajadas();
    }
    calcular()
});

function reiniciarVariables() {
    arrayHoraEntrada = [];
    arrayMinutoEntrada = [];
    arrayHoraSalida = [];
    arrayMinutoSalida = [];
    arrayHorasDiurnas = [];
    arrayHorasNocturnas = [];
    arrayCheckBoxFerDom = [];
    arrayDiurnas = [];
    arrayNocturnas = [];
    totalDiurnas = 0;
    totalNocturnas = 0;
    totalDFerdom = 0;
    totalNFerdom = 0;
    diasLibres = 0;
}

function mostrarResultados() {
    totalDiurnas = parseFloat(totalDiurnas.toFixed(1));
    totalNocturnas = parseFloat(totalNocturnas.toFixed(1));
    totalDFerdom = parseFloat(totalDFerdom.toFixed(1));
    totalNFerdom = parseFloat(totalNFerdom.toFixed(1));
    let cobroDiurnas = totalDiurnas * jornal[0]
    let cobroNocturnas = totalNocturnas * jornal[1]
    let cobroDiaFerDom = totalDFerdom * jornal[2];
    let cobroNocheFerDom = totalNFerdom * jornal[3];
    let totalBruto = cobroDiurnas + cobroNocturnas + cobroDiaFerDom + cobroNocheFerDom;
    let descIPS = totalBruto * 0.09;
    let total = totalBruto - descIPS;
    document.getElementById("spanTotalDiurnas").textContent = totalDiurnas;
    document.getElementById("spanTotalNocturnas").textContent = totalNocturnas;
    document.getElementById("spanTotalDFerDom").textContent = totalDFerdom;
    document.getElementById("spanTotalNFerDom").textContent = totalNFerdom;
    document.getElementById("spanCobroDiurnas").textContent = formato.format(Math.round(cobroDiurnas));
    document.getElementById("spanCobroNocturnas").textContent = formato.format(Math.round(cobroNocturnas));
    document.getElementById("spanCobroDiaFerDom").textContent = formato.format(Math.round(cobroDiaFerDom));
    document.getElementById("spanCobroNocheFerDom").textContent = formato.format(Math.round(cobroNocheFerDom));
    document.getElementById("spanDescIPS").textContent = formato.format(Math.round(descIPS));
    document.getElementById("spandiasLibres").textContent = diasLibres;
    document.getElementById("spanTotalBruto").textContent = formato.format(Math.round(totalBruto));
    document.getElementById("spanTotalNeto").textContent = formato.format(Math.round(total));
}

//  *************** NUEVO BLOQUE *************** 
let inputsLlenos, inputsVacios;

const INICIO_DIURNAS = 6;
const INICIO_NOCTURNAS = 20;
const MEDIA_NOCHE = 24;

let inputHE, inputME, inputHS, inputMS;

function validarYCargarHoras(indice) {
    let inputHE = document.getElementById(`HE${indice + 1}`);
    let inputME = document.getElementById(`ME${indice + 1}`);
    let inputHS = document.getElementById(`HS${indice + 1}`);
    let inputMS = document.getElementById(`MS${indice + 1}`);

    inputsLlenos =
        inputHE.value !== "" &&
        inputME.value !== "" &&
        inputHS.value !== "" &&
        inputMS.value !== "";

    inputsVacios =
        inputHE.value === "" &&
        inputME.value === "" &&
        inputHS.value === "" &&
        inputMS.value === "";

    if (!inputsLlenos && !inputsVacios) {
        alert("Algunas casillas están incompletas. Intenta otra vez.")
    } else {
        arrayHoraEntrada.push(parseInt(inputHE.value) || 0);
        arrayMinutoEntrada.push(parseInt(inputME.value) || 0);
        arrayHoraSalida.push(parseInt(inputHS.value) || 0);
        arrayMinutoSalida.push(parseInt(inputMS.value) || 0);
        arrayMinutoEntrada[indice] /= 60;
        arrayMinutoSalida[indice] /= 60;
        arrayHoraEntrada[indice] += parseFloat(arrayMinutoEntrada[indice].toFixed(2));
        arrayHoraSalida[indice] += parseFloat(arrayMinutoSalida[indice].toFixed(2));
    }
}

function esDiaLibre(indice) {
    diasLibres += 1;
    arrayHorasDiurnas[indice] = 0;
    arrayHorasNocturnas[indice] = 0;
}

function esFeriadoDomingo(indice, valor) {
    if (arrayHoraEntrada[indice] >= INICIO_DIURNAS && arrayHoraEntrada[indice] < INICIO_NOCTURNAS) {
        if (arrayHoraSalida[indice] <= INICIO_NOCTURNAS) {
            arrayHorasDiurnas[indice] = arrayHoraSalida[indice] - arrayHoraEntrada[indice];
            totalDFerdom += arrayHorasDiurnas[indice];
            arrayHorasNocturnas[indice] = 0;
        } else {
            arrayHorasDiurnas[indice] = INICIO_NOCTURNAS - arrayHoraEntrada[indice];
            arrayHorasNocturnas[indice] = arrayHoraSalida[indice] - INICIO_NOCTURNAS;
            totalDFerdom += arrayHorasDiurnas[indice];
            totalNFerdom += arrayHorasNocturnas[indice];
        }
    } else if ((arrayHoraEntrada[indice] >= INICIO_NOCTURNAS && arrayHoraEntrada[indice] < MEDIA_NOCHE)) {
        arrayHorasNocturnas[indice] = arrayHoraSalida[indice] - arrayHoraEntrada[indice];
        totalNFerdom += arrayHorasNocturnas[indice];
        arrayHorasDiurnas[indice] = 0;
    } else if (arrayHoraEntrada[indice] >= 0 && arrayHoraEntrada[indice] < INICIO_DIURNAS) {
        if (arrayHoraSalida[indice] === MEDIA_NOCHE) {
            arrayHoraSalida[indice] = 0;
        }
        if (arrayHoraSalida[indice] <= INICIO_DIURNAS) {
            arrayHorasNocturnas[indice] = arrayHoraSalida[indice] - arrayHoraEntrada[indice];
            totalNFerdom += arrayHorasNocturnas[indice];
            arrayHorasDiurnas[indice] = 0;
        } else {
            arrayHorasNocturnas[indice] = INICIO_DIURNAS - arrayHoraEntrada[indice];
            arrayHorasDiurnas[indice] = arrayHoraSalida[indice] - INICIO_DIURNAS;
            totalDFerdom += arrayHorasDiurnas[indice];
            totalNFerdom += arrayHorasNocturnas[indice];
        }
    }
}

function esDiaNormal(indice) {
    if (arrayHoraEntrada[indice] >= INICIO_DIURNAS && arrayHoraEntrada[indice] < INICIO_NOCTURNAS) {
        if (arrayHoraSalida[indice] <= INICIO_NOCTURNAS) {
            arrayHorasDiurnas[indice] = arrayHoraSalida[indice] - arrayHoraEntrada[indice];
            totalDiurnas += arrayHorasDiurnas[indice];
            arrayHorasNocturnas[indice] = 0;
        } else {
            arrayHorasDiurnas[indice] = INICIO_NOCTURNAS - arrayHoraEntrada[indice];
            arrayHorasNocturnas[indice] = arrayHoraSalida[indice] - INICIO_NOCTURNAS;
            totalDiurnas += arrayHorasDiurnas[indice];
            totalNocturnas += arrayHorasNocturnas[indice];
        }
    } else if ((arrayHoraEntrada[indice] >= INICIO_NOCTURNAS && arrayHoraEntrada[indice] < MEDIA_NOCHE)) {
        arrayHorasNocturnas[indice] = arrayHoraSalida[indice] - arrayHoraEntrada[indice];
        totalNocturnas += arrayHorasNocturnas[indice];

        arrayHorasDiurnas[indice] = 0;
    } else if (arrayHoraEntrada[indice] >= 0 && arrayHoraEntrada[indice] < INICIO_DIURNAS) {
        if (arrayHoraSalida[indice] === MEDIA_NOCHE) {
            arrayHoraSalida[indice] = 0;
        }
        if (arrayHoraSalida[indice] <= INICIO_DIURNAS) {
            arrayHorasNocturnas[indice] = arrayHoraSalida[indice] - arrayHoraEntrada[indice];
            totalNocturnas += arrayHorasNocturnas[indice];
            arrayHorasDiurnas[indice] = 0;
        } else {
            arrayHorasNocturnas[indice] = INICIO_DIURNAS - arrayHoraEntrada[indice];
            arrayHorasDiurnas[indice] = arrayHoraSalida[indice] - INICIO_DIURNAS;
            totalDiurnas += arrayHorasDiurnas[indice];
            totalNocturnas += arrayHorasNocturnas[indice];
        }
    }
}

function calcularPorEntradaSalida() {
    cantDiasDelmes = new Date(anio, mes + 1, 0).getDate();
    reiniciarVariables();
    for (let i = 0; i < cantDiasDelmes; i++) {
        let c = i + 1;
        validarYCargarHoras(i);
        if (arrayHoraSalida[i] === 0) arrayHoraSalida[i] = MEDIA_NOCHE;
        if (arrayHoraSalida[i] < arrayHoraEntrada[i]) {
            alert("La hora de salida no puede ser menor a la entrada.")
            break;
        } else {
            let checkbox = document.getElementById(`checkBoxId${c}`);
            checkbox.checked ? arrayCheckBoxFerDom[i] = c : arrayCheckBoxFerDom[i] = 0;
            if (arrayHoraEntrada[i] == 0 && arrayHoraSalida[i] == MEDIA_NOCHE) {
                esDiaLibre(i);
            } else {
                checkbox.checked ? esFeriadoDomingo(i, c) : esDiaNormal(i);
            }
        }
    }
    mostrarResultados();
}

function calcularPorHorasTrabajadas() {
    reiniciarVariables();
    cantDiasDelmes = new Date(anio, mes + 1, 0).getDate();

    for (let i = 0; i < cantDiasDelmes; i++) {
        let c = i + 1;
        let inputHD = document.getElementById(`HD${c}`);
        let inputHN = document.getElementById(`HN${c}`);

        arrayDiurnas.push(parseFloat(inputHD.value) || 0);
        arrayNocturnas.push(parseFloat(inputHN.value) || 0);

        let checkbox = document.getElementById(`checkBoxId${c}`);

        if (checkbox && checkbox.checked) {
            arrayCheckBoxFerDom[i] = c;
            if (arrayDiurnas[i] == 0 && arrayNocturnas[i] == 0) {
                diasLibres += 1;
                arrayHorasDiurnas[i] = 0;
                arrayNocturnas[i] = 0;
            } else {
                totalDFerdom += arrayDiurnas[i];
                totalNFerdom += arrayNocturnas[i]
            }
        } else {
            arrayCheckBoxFerDom[i] = 0;
            if (arrayDiurnas[i] == 0 && arrayNocturnas[i] == 0) {
                diasLibres += 1;
                arrayDiurnas[i] = 0;
                arrayNocturnas[i] = 0;
            } else {
                totalDiurnas += arrayDiurnas[i];
                totalNocturnas += arrayNocturnas[i]
            }
        }
    }
    mostrarResultados();
}

function calcular() {
    if (metodo === "1") {
        calcularPorEntradaSalida();
    } else if (metodo === "2") {
        calcularPorHorasTrabajadas();
    } else {
        alert("Primero selecciona un método de carga.");
    }
}

function reiniciar() {
    location.reload();
}

function imprimir() {
    const originTitle = document.title
    document.title = `JornApp_${meses[mes]}_${anio}.`;
    window.print();
    document.title = originTitle;
}

function guardar() {
    metodo = document.getElementById("select-metodo").value;
    if (metodo === "1") {
        calcular();
        const datos = {
            Hora_De_Entrada: arrayHoraEntrada,
            Hora_De_Salida: arrayHoraSalida,
            arrayCheckBoxFerDom: arrayCheckBoxFerDom
        };
        const jsonDatos = JSON.stringify(datos, null, 2);
        const blob = new Blob([jsonDatos], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${meses[mes]}_${anio}_horas_entrada_salida.json`;
        link.click();
        URL.revokeObjectURL(link.href);

    } else if (metodo === "2") {
        calcular();
        const datos = {
            Horas_Diurnas: arrayDiurnas,
            Horas_Nocturnas: arrayNocturnas,
            arrayCheckBoxFerDom: arrayCheckBoxFerDom
        };
        const jsonDatos = JSON.stringify(datos, null, 2);
        const blob = new Blob([jsonDatos], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${meses[mes]}_${anio}_horas_trabajadas.json`;
        link.click();
        URL.revokeObjectURL(link.href);
    } else {
        alert("No hay datos para guardar.");
    }
}

function exportEntradaSalida() {
    calcularPorEntradaSalida();
    const horasExcel = [];
    const tags = [];
    for (let i = 0; i < cantDiasDelmes; i++) {
        tags.push("D");
        tags.push("N");
        horasExcel.push(arrayHorasDiurnas[i])
        horasExcel.push(arrayHorasNocturnas[i])
    }

    const matriz = [arrayDia, arrayDiasDeLaSemana, tags, horasExcel]
    const worksheet = XLSX.utils.aoa_to_sheet(matriz);

    worksheet['!merges'] = [];
    for (let i = 0; i < arrayDiasDeLaSemana.length; i++) {
        worksheet['!merges'].push({
            s: { r: 1, c: i * 2 },
            e: { r: 1, c: i * 2 + 1 }
        });
        worksheet['!merges'].push({
            s: { r: 0, c: i * 2 },
            e: { r: 0, c: i * 2 + 1 }
        });
    };
    crearYDescargarExcel(worksheet)
}

function exportHorasTrabajadas() {
    calcularPorHorasTrabajadas();
    const horasExcel = [];
    const tags = [];
    for (let i = 0; i < cantDiasDelmes; i++) {
        tags.push("D");
        tags.push("N");
        horasExcel.push(arrayDiurnas[i])
        horasExcel.push(arrayNocturnas[i])
    }

    const matriz = [arrayDia, arrayDiasDeLaSemana, tags, horasExcel]
    const worksheet = XLSX.utils.aoa_to_sheet(matriz);

    worksheet['!merges'] = [];
    for (let i = 0; i < arrayDiasDeLaSemana.length; i++) {
        worksheet['!merges'].push({
            s: { r: 1, c: i * 2 },
            e: { r: 1, c: i * 2 + 1 }
        });
        worksheet['!merges'].push({
            s: { r: 0, c: i * 2 },
            e: { r: 0, c: i * 2 + 1 }
        });
    };
    crearYDescargarExcel(worksheet)
}

function pedirNombre() { }

function crearYDescargarExcel(worksheet) {
    let name = 'a';
    do {
        name = prompt('Ingresa tu nombre y apellido, por favor.')
        name = name.trim().replace(/\s+/g, '_');
    } while (!name)
    workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Horas_${meses[mes]}_${anio}`);
    XLSX.writeFile(workbook, `JornApp_Horas_${meses[mes]}_${anio}_${name}.xlsx`);
}

function Export() {
    metodo = document.getElementById("select-metodo").value;
    if (metodo === "1") {
        exportEntradaSalida();
    } else if (metodo === "2") {
        exportHorasTrabajadas();
    } else {
        alert("No hay datos para exportar.");
    }
}

function importarEntradaSalida(consNombreArchivo, constReader) {
    document.getElementById("select-metodo").value = "1";
    metodo = "1";
    const mesDelArchivo = meses.find(mes => consNombreArchivo.includes(mes));
    mes = meses.indexOf(mesDelArchivo);
    form.innerHTML = ``;
    cargarPorEntradaSalida();
    document.getElementById("selectMes").value = mes;
    document.getElementById("selectMes").disabled = false;
    constReader.onload = function (e) {
        try {
            const contenido = e.target.result;
            const datos = JSON.parse(contenido);
            for (let i = 0; i < datos.Hora_De_Entrada.length; i++) {
                const c = i + 1;
                const entrada = datos.Hora_De_Entrada[i];
                const salida = datos.Hora_De_Salida[i];
                const horaE = Math.floor(entrada);
                const minutoE = Math.round((entrada - horaE) * 60);
                const horaS = Math.floor(salida);
                const minutoS = Math.round((salida - horaS) * 60);
                document.getElementById(`HE${c}`).value = horaE.toString().padStart(2, "0");
                document.getElementById(`ME${c}`).value = minutoE.toString().padStart(2, "0");
                document.getElementById(`HS${c}`).value = horaS === 24 ? "00" : horaS.toString().padStart(2, "0");
                document.getElementById(`MS${c}`).value = minutoS.toString().padStart(2, "0");
                const check = document.getElementById(`checkBoxId${c}`);
                if (datos.arrayCheckBoxFerDom[i] !== 0 && check) {
                    check.checked = true;
                } else if (check) {
                    check.checked = false;
                }
            }
            calcularPorEntradaSalida();
            alert(`Datos cargados correctamente: ${consNombreArchivo}`);
        } catch (error) {
            console.log("Error al leer archivo JSON:", error)
            alert("Error al leer archivo");
        }
    };
}

function importarHorasTrabajadas(consNombreArchivo, constReader) {
    document.getElementById("select-metodo").value = "2";
    metodo = "2";
    const mesDelArchivo = meses.find(mes => consNombreArchivo.includes(mes));
    mes = meses.indexOf(mesDelArchivo);
    form.innerHTML = ``;
    cargarPorHorasTrabajadas();
    document.getElementById("selectMes").value = mes;
    document.getElementById("selectMes").disabled = false;
    constReader.onload = function (e) {
        try {
            const contenido = e.target.result;
            const datos = JSON.parse(contenido);
            for (let i = 0; i < datos.Horas_Diurnas.length; i++) {
                const c = i + 1;
                const diurnas = datos.Horas_Diurnas[i];
                const nocturnas = datos.Horas_Nocturnas[i];
                document.getElementById(`HD${c}`).value = diurnas.toString();
                document.getElementById(`HN${c}`).value = nocturnas.toString();
                const check = document.getElementById(`checkBoxId${c}`);
                if (datos.arrayCheckBoxFerDom[i] !== 0 && check) {
                    check.checked = true;
                } else if (check) {
                    check.checked = false;
                }
            }
            calcularPorHorasTrabajadas();
            alert(`Datos cargados correctamente: ${consNombreArchivo}`);
        } catch (error) {
            console.log("Error al leer archivo JSON:", error)
            alert("Error al leer archivo");
        }
    };
}

document.getElementById("importarJson").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;
    const nombreArchivo = file.name;
    const reader = new FileReader();
    if (nombreArchivo.includes("horas_entrada_salida")) {
        importarEntradaSalida(nombreArchivo, reader);
    } else if (nombreArchivo.includes("horas_trabajadas")) {
        importarHorasTrabajadas(nombreArchivo, reader);
    } else {
        alert("El archivo no cumple el formato requerido.");
    }
    reader.readAsText(file);
});

function toggleContenido() {
    const contenido = document.getElementById('contenido');
    contenido.classList.toggle('mostrar');
}

document.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target.tagName === "INPUT") {
        e.preventDefault();
        const inputs = Array.from(document.querySelectorAll("input"));
        const i = inputs.indexOf(e.target);
        if (inputs[i + 1]) inputs[i + 1].focus();
    }
});
