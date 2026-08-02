function loginSistema(){
  const usuario = document.getElementById("usuario").value;
  const clave = document.getElementById("clave").value;
  const db = getDB();
  
  const encontrado = db.usuarios.find(
    u => u.usuario === usuario && u.clave === clave
  );

  if(encontrado){
    sessionStorage.setItem("usuarioActivo", JSON.stringify(encontrado));
    
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("erp-container").classList.remove("hidden");
    
    // Redirigir al dashboard al entrar
    if (typeof cargarRuta === 'function') {
      cargarRuta("dashboard");
    }
    
    return true;
  }

  alert("Datos incorrectos");
  return false;
}

function usuarioActual(){
  const user = sessionStorage.getItem("usuarioActivo");
  return user ? JSON.parse(user) : null;
}

function cerrarSesion(){
  sessionStorage.removeItem("usuarioActivo");
  location.reload();
}