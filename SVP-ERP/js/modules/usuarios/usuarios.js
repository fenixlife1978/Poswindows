function cargarUsuarios() {
  const db = getDB();
  const tabla = document.getElementById("tablaUsuarios");

  if (!tabla) return;

  tabla.innerHTML = "";

  db.usuarios.forEach(u => {
    tabla.innerHTML += `
      <tr>
        <td>${u.usuario}</td>
        <td>${u.rol}</td>
        <td>Activo</td>
        <td>
          <button class="action-btn edit">
            Editar
          </button>
        </td>
      </tr>
    `;
  });
}

function nuevoUsuario() {
  abrirModal(
    "Nuevo Usuario",
    `
    <div class="form-group">
      <label>Nombre de Usuario</label>
      <input id="nuevoUsuario" placeholder="Ej: perez.jose">
    </div>
    <div class="form-group">
      <label>Contraseña</label>
      <input id="nuevaClave" type="password" placeholder="Contraseña">
    </div>
    <div class="form-group">
      <label>Rol del Sistema</label>
      <select id="nuevoRol">
        <option>Administrador</option>
        <option>Vendedor</option>
        <option>Cajero</option>
      </select>
    </div>
    `,
    () => {
      const db = getDB();
      const usuario = document.getElementById("nuevoUsuario").value;
      const clave = document.getElementById("nuevaClave").value;
      const rol = document.getElementById("nuevoRol").value;

      if (!usuario || !clave) {
        alert("Usuario y contraseña son obligatorios");
        return;
      }

      db.usuarios.push({
        id: Date.now(),
        usuario: usuario,
        clave: clave,
        rol: rol
      });

      saveDB(db);
      cerrarModal();
      cargarUsuarios();
    }
  );
}
