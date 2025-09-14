//  *************** BLOQUE ORIGINAL *************** 
// function calcularPorEntradaSalida() {
//     cantDiasDelmes = new Date(anio, mes + 1, 0).getDate();
//     reinicarVariables();
//     for (let i = 0; i < cantDiasDelmes; i++) {
//         let c = i + 1;

//         let inputHE = document.getElementById(`HE${c}`);
//         let inputME = document.getElementById(`ME${c}`);
//         let inputHS = document.getElementById(`HS${c}`);
//         let inputMS = document.getElementById(`MS${c}`);

//         const inputsLlenos =
//             inputHE.value !== "" &&
//             inputME.value !== "" &&
//             inputHS.value !== "" &&
//             inputMS.value !== "";

//         const inputsVacios =
//             inputHE.value === "" &&
//             inputME.value === "" &&
//             inputHS.value === "" &&
//             inputMS.value === "";

//         if (!inputsLlenos && !inputsVacios) {
//             alert("Algunas casillas están incompletas. Intenta otra vez.")
//             break;
//         } else {
//             arrayHoraEntrada.push(parseInt(inputHE.value) || 0);
//             arrayMinutoEntrada.push(parseInt(inputME.value) || 0);
//             arrayHoraSalida.push(parseInt(inputHS.value) || 0);
//             arrayMinutoSalida.push(parseInt(inputMS.value) || 0);
//         }

//         arrayMinutoEntrada[i] /= 60;
//         arrayMinutoSalida[i] /= 60;
//         arrayHoraEntrada[i] += parseFloat(arrayMinutoEntrada[i].toFixed(2));
//         arrayHoraSalida[i] += parseFloat(arrayMinutoSalida[i].toFixed(2));

//         let checkbox = document.getElementById(`checkBoxId${c}`);

//         if (checkbox && checkbox.checked) {
//             arrayCheckBoxFerDom[i] = c;
//             if (arrayHoraEntrada[i] == 0 && arrayHoraSalida[i] == 0) {
//                 diasLibres += 1;
//                 arrayHorasDiurnas[i] = 0;
//                 arrayHorasNocturnas[i] = 0;
//             } else {
//                 if (arrayHoraSalida[i] === 0) {
//                     arrayHoraSalida[i] = 24;
//                 }
//                 if (arrayHoraSalida[i] < arrayHoraEntrada[i]) {
//                     alert("La Hora de Salida no puede ser menor a la Entrada. Intenta otra vez.")
//                     break;
//                 }
//                 if (arrayHoraEntrada[i] >= 6 && arrayHoraEntrada[i] < 20) {
//                     if (arrayHoraSalida[i] <= 20) {
//                         arrayHorasDiurnas[i] = arrayHoraSalida[i] - arrayHoraEntrada[i];
//                         totalDFerdom += arrayHorasDiurnas[i];
//                         arrayHorasNocturnas[i] = 0;
//                     } else {
//                         arrayHorasDiurnas[i] = 20 - arrayHoraEntrada[i];
//                         arrayHorasNocturnas[i] = arrayHoraSalida[i] - 20;
//                         totalDFerdom += arrayHorasDiurnas[i];
//                         totalNFerdom += arrayHorasNocturnas[i];
//                     }
//                 } else if ((arrayHoraEntrada[i] >= 20 && arrayHoraEntrada[i] < 24)) {
//                     arrayHorasNocturnas[i] = arrayHoraSalida[i] - arrayHoraEntrada[i];
//                     totalNFerdom += arrayHorasNocturnas[i];
//                     arrayHorasDiurnas[i] = 0;
//                 } else if (arrayHoraEntrada[i] >= 0 && arrayHoraEntrada[i] < 6) {
//                     if (arrayHoraSalida[i] === 24) {
//                         arrayHoraSalida[i] = 0;
//                     }
//                     if (arrayHoraSalida[i] <= 6) {
//                         arrayHorasNocturnas[i] = arrayHoraSalida[i] - arrayHoraEntrada[i];
//                         totalNFerdom += arrayHorasNocturnas[i];
//                         arrayHorasDiurnas[i] = 0;
//                     } else {
//                         arrayHorasNocturnas[i] = 6 - arrayHoraEntrada[i];
//                         arrayHorasDiurnas[i] = arrayHoraSalida[i] - 6;
//                         totalDFerdom += arrayHorasDiurnas[i];
//                         totalNFerdom += arrayHorasNocturnas[i];
//                     }
//                 }
//             }
//         } else {
//             arrayCheckBoxFerDom[i] = 0;
//             if (arrayHoraEntrada[i] == 0 && arrayHoraSalida[i] == 0) {
//                 diasLibres += 1;
//                 arrayHorasDiurnas[i] = 0;
//                 arrayHorasNocturnas[i] = 0;
//             } else {
//                 if (arrayHoraSalida[i] === 0) {
//                     arrayHoraSalida[i] = 24;
//                 }
//                 if (arrayHoraSalida[i] < arrayHoraEntrada[i]) {
//                     alert("La Hora de Salida no puede ser menor a la Entrada. Intenta otra vez.")
//                     break;
//                 }
//                 if (arrayHoraEntrada[i] >= 6 && arrayHoraEntrada[i] < 20) {
//                     if (arrayHoraSalida[i] <= 20) {
//                         arrayHorasDiurnas[i] = arrayHoraSalida[i] - arrayHoraEntrada[i];
//                         totalDiurnas += arrayHorasDiurnas[i];

//                         arrayHorasNocturnas[i] = 0;
//                     } else {
//                         arrayHorasDiurnas[i] = 20 - arrayHoraEntrada[i];
//                         arrayHorasNocturnas[i] = arrayHoraSalida[i] - 20;
//                         totalDiurnas += arrayHorasDiurnas[i];
//                         totalNocturnas += arrayHorasNocturnas[i];
//                     }
//                 } else if ((arrayHoraEntrada[i] >= 20 && arrayHoraEntrada[i] < 24)) {
//                     arrayHorasNocturnas[i] = arrayHoraSalida[i] - arrayHoraEntrada[i];
//                     totalNocturnas += arrayHorasNocturnas[i];

//                     arrayHorasDiurnas[i] = 0;
//                 } else if (arrayHoraEntrada[i] >= 0 && arrayHoraEntrada[i] < 6) {
//                     if (arrayHoraSalida[i] === 24) {
//                         arrayHoraSalida[i] = 0;
//                     }
//                     if (arrayHoraSalida[i] <= 6) {
//                         arrayHorasNocturnas[i] = arrayHoraSalida[i] - arrayHoraEntrada[i];
//                         totalNocturnas += arrayHorasNocturnas[i];
//                         arrayHorasDiurnas[i] = 0;
//                     } else {
//                         arrayHorasNocturnas[i] = 6 - arrayHoraEntrada[i];
//                         arrayHorasDiurnas[i] = arrayHoraSalida[i] - 6;
//                         totalDiurnas += arrayHorasDiurnas[i];
//                         totalNocturnas += arrayHorasNocturnas[i];
//                     }
//                 }
//             }
//         }
//     }
//     mostrarResultados();
// }