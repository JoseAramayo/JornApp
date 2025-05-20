let formato = new Intl.NumberFormat('es-PY', { // dar formato de guaranies
	style: 'currency',
	currency: 'PYG',
});
const form = document.querySelector("form");
const fechaActual = new Date();
const anio = fechaActual.getFullYear();
document.getElementById("selectMes").value = fechaActual.getMonth();
var mes = parseInt(document.getElementById("selectMes").value);
let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
let jornal = [13453, 17489, 26906, 34978] //jornales x hora
document.getElementById("spanJornalDiurno").textContent = formato.format(jornal[0]);
document.getElementById("spanJornalNocturno").textContent = formato.format(jornal[1]);
document.getElementById("spanDiaFerDom").textContent = formato.format(jornal[2]);
document.getElementById("spanNocheFerDom").textContent = formato.format(jornal[3]);
let diasEnMes;

function generarTabla(mesSeleccionado) {
	diasEnMes = new Date(anio, mes + 1, 0).getDate(); // Cantidad de días en el mes actual
	for (let dia = 1; dia <= diasEnMes; dia++) {
		const fecha = new Date(anio, mes, dia);
		const diaSemana = fecha.toLocaleDateString("es-ES", { weekday: "long" });
		const fechaFormateada = fecha.toLocaleDateString("es-ES");
		const divRow = document.createElement("div");
		divRow.classList.add("divRow");
		divRow.innerHTML = `
				<div class="container">
					<div  class="columnChkBox">
						<input type="checkbox" class="checkBoxFerDom" id="checkBoxId${dia}">
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
						<input placeholder="HH" type="number" class="inputHE" min="0" max="23" id="HE${dia}" title="Hora de 00 a 23"  maxlength="2" required>
						<span>:</span>
						<input placeholder="MM" type="number" class="inputME" min="0" max="59"  id="ME${dia}" title="Minutos de 00 a 59" maxlength="2" required>
					</div>
				</div>
				<div class="container">
					<div class="columnHS">
						<input placeholder="HH" type="number" class="inputHS"  min="0" max="23"  id="HS${dia}" title="Hora de 00 a 23" maxlength="2" required>
						<span>:</span>
						<input placeholder="MM" type="number" class="inputMS" min="0" max="59" id="MS${dia}" title="Minutos de 00 a 59" maxlength="2" required>
					</div>
				</div>`;
		form.appendChild(divRow);
		//deshabilitar checkbox si es domingo
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
			});
			// Opcional: rellenar con 0 a la izquierda si es menor a 10
			input.addEventListener("blur", () => {
				let val = parseInt(input.value);
				if (!isNaN(val)) {
					input.value = val.toString().padStart(2, '0');
				}
			});
		});
	}
	// Aplica la función a cada clase con su rango
	validarInputRango("inputHE", 0, 23);
	validarInputRango("inputHS", 0, 23);
	validarInputRango("inputME", 0, 59);
	validarInputRango("inputMS", 0, 59);
};

document.addEventListener("DOMContentLoaded", function () {
	generarTabla();
	calcular();
});

document.getElementById("selectMes").addEventListener("change", function () {
	form.innerHTML = "";
	mes = parseInt(this.value);
	generarTabla(mes);
	calcular();
});

let horaEntrada, minutoEntrada, horaSalida, minutoSalida,
	horasDiurnas, horasNocturnas, checkBoxFerDom, totalDiurnas,
	totalNocturnas, totalDFerdom, totalNFerdom, diasLibres, horasExcel;

function calcular() {
	diasEnMes = new Date(anio, mes + 1, 0).getDate(); // Cantidad de días en el mes actual

	horaEntrada = [];
	minutoEntrada = [];
	horaSalida = [];
	minutoSalida = [];
	horasDiurnas = [];
	horasNocturnas = [];
	checkBoxFerDom = [];
	totalDiurnas = 0;
	totalNocturnas = 0;
	totalDFerdom = 0;
	totalNFerdom = 0;
	diasLibres = 0;
	horasExcel = [];

	for (let i = 0; i < diasEnMes; i++) {
		let c = i + 1; //

		//Guardar datos en arreglos
		let inputHE = document.getElementById(`HE${c}`);
		let inputME = document.getElementById(`ME${c}`);
		let inputHS = document.getElementById(`HS${c}`);
		let inputMS = document.getElementById(`MS${c}`);
		if (inputHE && inputME && inputHS && inputMS) {
			let horaE = parseInt(inputHE.value) || 0;
			let minuE = parseInt(inputME.value) || 0;
			let horaSa = parseInt(inputHS.value) || 0;
			let minuSa = parseInt(inputMS.value) || 0;
			horaEntrada.push(horaE);
			minutoEntrada.push(minuE);
			horaSalida.push(horaSa);
			minutoSalida.push(minuSa);
		}

		//Minutos a horas (decimal)
		minutoEntrada[i] /= 60;
		minutoSalida[i] /= 60;
		horaEntrada[i] += parseFloat(minutoEntrada[i].toFixed(2));
		horaSalida[i] += parseFloat(minutoSalida[i].toFixed(2));

		let checkbox = document.getElementById(`checkBoxId${c}`);

		//Calculo de horas diurnas, nocturnas, Dia/Noche FerDom.
		if (checkbox && checkbox.checked) {
			checkBoxFerDom[i] = c;
			// console.log("cumple condicion");
			if (horaEntrada[i] == 0 && horaSalida[i] == 0) {
				// console.log("Dia libre");
				diasLibres += 1;
			} else {
				if (horaSalida[i] === 0) {
					horaSalida[i] = 24;
				}
				if (horaEntrada[i] >= 6 && horaEntrada[i] < 20) {
					// console.log("Entrada diurna")
					if (horaSalida[i] <= 20) {
						// console.log("Salida diurna")
						horasDiurnas[i] = horaSalida[i] - horaEntrada[i];
						totalDFerdom += horasDiurnas[i];
					} else {
						// console.log("Salida nocturna")
						horasDiurnas[i] = 20 - horaEntrada[i];
						horasNocturnas[i] = horaSalida[i] - 20;
						totalDFerdom += horasDiurnas[i];
						totalNFerdom += horasNocturnas[i];
					}
				} else if ((horaEntrada[i] >= 20 && horaEntrada[i] < 24)) {
					// console.log("Entrada y salida nocturna ");
					horasNocturnas[i] = horaSalida[i] - horaEntrada[i];
					totalNFerdom += horasNocturnas[i];
				} else if (horaEntrada[i] >= 0 && horaEntrada[i] < 6) {
					if (horaSalida[i] === 24) {
						horaSalida[i] = 0;
					}
					if (horaSalida[i] <= 6) {
						horasNocturnas[i] = horaSalida[i] - horaEntrada[i];
						totalNFerdom += horasNocturnas[i];
					} else {
						horasNocturnas[i] = 6 - horaEntrada[i];
						horasDiurnas[i] = horaSalida[i] - 6;
						totalDFerdom += horasDiurnas[i];
						totalNFerdom += horasNocturnas[i];
					}
				}
			}
		} else {
			checkBoxFerDom[i] = 0;
			if (horaEntrada[i] == 0 && horaSalida[i] == 0) {
				// console.log("Dia libre");
				diasLibres += 1;
			} else {
				if (horaSalida[i] === 0) {
					horaSalida[i] = 24;
				}
				if (horaEntrada[i] >= 6 && horaEntrada[i] < 20) {
					// console.log("Entrada diurna")
					if (horaSalida[i] <= 20) {
						// console.log("Salida diurna")
						horasDiurnas[i] = horaSalida[i] - horaEntrada[i];
						totalDiurnas += horasDiurnas[i];
					} else {
						// console.log("Salida nocturna")
						horasDiurnas[i] = 20 - horaEntrada[i];
						horasNocturnas[i] = horaSalida[i] - 20;
						totalDiurnas += horasDiurnas[i];
						totalNocturnas += horasNocturnas[i];
					}
				} else if ((horaEntrada[i] >= 20 && horaEntrada[i] < 24)) {
					// console.log("Entrada y salida nocturna ");
					horasNocturnas[i] = horaSalida[i] - horaEntrada[i];
					totalNocturnas += horasNocturnas[i];
				} else if (horaEntrada[i] >= 0 && horaEntrada[i] < 6) {
					if (horaSalida[i] === 24) {
						horaSalida[i] = 0;
					}
					if (horaSalida[i] <= 6) {
						horasNocturnas[i] = horaSalida[i] - horaEntrada[i];
						totalNocturnas += horasNocturnas[i];
					} else {
						horasNocturnas[i] = 6 - horaEntrada[i];
						horasDiurnas[i] = horaSalida[i] - 6;
						totalDiurnas += horasDiurnas[i];
						totalNocturnas += horasNocturnas[i];
					}
				}
			}
		}
		horasExcel.push(horasDiurnas[i]);
		horasExcel.push(horasNocturnas[i]);
	}
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
	btnSave.disabled = false;
	//control de datos en consola
	console.log("Diurnas: ", horasDiurnas);
	console.log("Nocturnas: ", horasNocturnas);
}

function reiniciar() {
	location.reload();
}

function imprimir() {
	let name = '';
	while (!name) {
		name = prompt('Ingresa tu nombre y apellido, por favor.')
		name = name.trim().replace(/\s+/g, '_');
	}
	const originTitle = document.title
	document.title = `JornApp_${meses[mes]}_${name}.`;
	window.print();
	document.title = originTitle;
}

function guardar() {
	const datos = {
		horaEntrada: horaEntrada,
		horaSalida: horaSalida,
		checkBoxFerDom: checkBoxFerDom
	};
	const jsonDatos = JSON.stringify(datos, null, 2);
	const blob = new Blob([jsonDatos], { type: "application/json" });
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = `${meses[mes]}_${anio}_horas.json`;
	link.click();
	URL.revokeObjectURL(link.href);
	btnSave.disabled = true;
}

document.getElementById("importarJson").addEventListener("change", function (event) {
	const file = event.target.files[0];
	if (!file) return;
	const reader = new FileReader();
	reader.onload = function (e) {
		try {
			const contenido = e.target.result;
			const datos = JSON.parse(contenido);
			// Cargar valores en los campos del formulario
			for (let i = 0; i < datos.horaEntrada.length; i++) {
				const c = i + 1;
				// Separar horas y minutos
				const entrada = datos.horaEntrada[i];
				const salida = datos.horaSalida[i];
				const horaE = Math.floor(entrada);
				const minutoE = Math.round((entrada - horaE) * 60);
				const horaS = Math.floor(salida);
				const minutoS = Math.round((salida - horaS) * 60);
				document.getElementById(`HE${c}`).value = horaE.toString().padStart(2, "0");
				document.getElementById(`ME${c}`).value = minutoE.toString().padStart(2, "0");
				document.getElementById(`HS${c}`).value = horaS === 24 ? "00" : horaS.toString().padStart(2, "0");
				document.getElementById(`MS${c}`).value = minutoS.toString().padStart(2, "0");
				// Activar checkbox si estaba marcado
				const check = document.getElementById(`checkBoxId${c}`);
				if (datos.checkBoxFerDom[i] !== 0 && check) {
					check.checked = true;
				} else if (check) {
					check.checked = false;
				}
			}
			calcular();
			alert("Datos importados correctamente.");
		} catch (error) {
			console.error("Error al leer el archivo JSON:", error);
			alert("El archivo no tiene un formato válido.");
		}
	};
	reader.readAsText(file);
});

function Export() {
	const worksheet = XLSX.utils.json_to_sheet(horasExcel);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Horas");
	XLSX.writeFile(workbook, "Horas.xlsx")
}
