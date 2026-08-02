
const db = require("../../database");

/**
 * Motor de Sincronización Híbrida para SVP ERP.
 * Trabaja primordialmente con SQLite y sincroniza a la nube si está activo.
 */
const SyncEngine = {
  isSyncing: false,
  checkInterval: null,

  /**
   * Inicia el ciclo de sincronización si la opción híbrida está activa.
   */
  init() {
    this.stop(); // Limpiar intervalos previos
    const config = db.prepare("SELECT sync_enabled FROM configuracion WHERE id=1").get();
    
    if (config && config.sync_enabled === 1) {
      console.log("SVP Cloud: Modo Híbrido Activo. Iniciando motor de sincronización.");
      this.checkInterval = setInterval(() => {
        if (navigator.onLine) {
          this.ejecutarSincronizacion();
        } else {
          this.actualizarUIStatus("Sin Conexión");
        }
      }, 60000); // Intenta sincronizar cada minuto
    } else {
      console.log("SVP Cloud: Modo Local Puro. Sincronización desactivada.");
      this.actualizarUIStatus("Solo Local");
    }
  },

  stop() {
    if (this.checkInterval) clearInterval(this.checkInterval);
  },

  async ejecutarSincronizacion() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    this.actualizarUIStatus("Sincronizando...");

    try {
      const config = db.prepare("SELECT * FROM configuracion WHERE id=1").get();
      if (!config.sync_api_url) throw new Error("URL Nube no configurada");

      // 1. Sincronizar Ventas Pendientes
      await this.pushTable("ventas", config);
      
      // 2. Sincronizar Clientes Nuevos
      await this.pushTable("clientes", config);

      // 3. Sincronizar Ajustes de Inventario
      await this.pushTable("movimientos_inventario", config);

      this.actualizarUIStatus("Sincronizado");
    } catch (error) {
      console.error("Error de sincronización:", error.message);
      this.actualizarUIStatus("Error Sync");
    } finally {
      this.isSyncing = false;
    }
  },

  /**
   * Envía registros PENDIENTES a la API segura.
   */
  async pushTable(tableName, config) {
    const pendientes = db.prepare(`SELECT * FROM ${tableName} WHERE sync_status = 'PENDIENTE' LIMIT 20`).all();
    
    if (pendientes.length === 0) return;

    // Simulación de llamada a API segura
    // En un entorno real se usaría: 
    // await fetch(config.sync_api_url + '/' + tableName, { method: 'POST', body: JSON.stringify(pendientes), ... })
    const success = await this.mockApiCall(tableName, pendientes);

    if (success) {
      const stmt = db.prepare(`UPDATE ${tableName} SET sync_status = 'SINCRONIZADO' WHERE id = ?`);
      const transaction = db.transaction((items) => {
        items.forEach(item => stmt.run(item.id));
      });
      transaction(pendientes);
      console.log(`SVP Cloud: ${pendientes.length} registros de ${tableName} subidos con éxito.`);
    }
  },

  async mockApiCall(table, data) {
    return new Promise((resolve) => setTimeout(() => resolve(true), 1500));
  },

  actualizarUIStatus(texto) {
    const el = document.getElementById("syncIndicator");
    if (el) {
      el.innerText = texto;
      const colors = {
        "Sincronizado": "text-green-600",
        "Sin Conexión": "text-red-600",
        "Sincronizando...": "text-blue-600",
        "Error Sync": "text-amber-600",
        "Solo Local": "text-gray-500"
      };
      el.className = `text-[8px] font-black uppercase italic ${colors[texto] || 'text-gray-500'}`;
    }
  }
};

window.SyncEngine = SyncEngine;
