window.SVP_SEED = {
  empresa: {
    id: 1,
    nombre: "Empresa Demo Venezuela",
    rif: "J-00000000-0",
    direccion: "",
    tasa: 0,
    moneda: "USD",
    iva: 16
  },
  usuarios: [
    {
      id: 1,
      usuario: "admin",
      clave: "1234",
      rol: "Administrador",
      permisos: [
        "ventas",
        "compras",
        "productos",
        "usuarios",
        "configuracion"
      ]
    }
  ],
  productos: [
    {
      id: 1,
      codigo: "0001",
      nombre: "Producto Demo",
      categoria: "General",
      costo: 5,
      precio: 10,
      stock: 100
    }
  ],
  categorias: ["General"],
  clientes: [],
  proveedores: [],
  ventas: [],
  compras: [],
  movimientos: [],
  movimientosCaja: []
};
