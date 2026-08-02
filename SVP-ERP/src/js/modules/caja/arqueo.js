/**
 * Lógica de Arqueo de Caja.
 * Compara el saldo registrado en el sistema con el efectivo físico contado.
 */
function realizarArqueo() {
  const sistema = Number(
    document.getElementById("saldoCaja")
      .innerText
      .replace("$", "")
  );

  const contado = Number(
    document.getElementById("efectivoContado")
      .value
  );

  const diferencia = contado - sistema;

  document.getElementById("resultadoArqueo").innerHTML = `
    <div class="mt-4 p-3 bg-white border-2 border-[#808080] shadow-inner text-[10px] font-bold uppercase">
      <div class="flex justify-between text-gray-500 mb-1">
        <span>Saldo Sistema:</span>
        <span class="font-mono">$${sistema.toFixed(2)}</span>
      </div>
      <div class="flex justify-between border-b border-gray-300 pb-1 mb-2">
        <span>Efectivo Físico:</span>
        <span class="font-mono">$${contado.toFixed(2)}</span>
      </div>
      <div class="text-center p-1 bg-gray-50 border border-gray-200">
        <span class="font-black italic ${diferencia >= 0 ? 'text-green-700' : 'text-red-700'}">
          ${diferencia >= 0 ? 'SOBRANTE' : 'FALTANTE'}: $${Math.abs(diferencia).toFixed(2)}
        </span>
      </div>
    </div>
  `;
}

// Registro global para acceso desde el botón de la vista
window.realizarArqueo = realizarArqueo;
