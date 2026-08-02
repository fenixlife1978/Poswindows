const SVP_DB_KEY = "SVP_ERP_DATABASE";

function inicializarDB() {
  let db = localStorage.getItem(SVP_DB_KEY);

  if (!db) {
    localStorage.setItem(
      SVP_DB_KEY,
      JSON.stringify(window.SVP_SEED)
    );
  }
}

function getDB() {
  return JSON.parse(localStorage.getItem(SVP_DB_KEY));
}

function saveDB(data) {
  localStorage.setItem(SVP_DB_KEY, JSON.stringify(data));
}

function resetDB() {
  localStorage.removeItem(SVP_DB_KEY);
  inicializarDB();
  location.reload();
}

inicializarDB();