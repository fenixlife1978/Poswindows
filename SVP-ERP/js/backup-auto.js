function backupAutomatico(){
const db=getDB();

localStorage.setItem(
"SVP_ERP_LAST_BACKUP",
JSON.stringify({
fecha:
new Date()
.toISOString(),
data:db
})
);
}

setInterval(
backupAutomatico,
60000
);