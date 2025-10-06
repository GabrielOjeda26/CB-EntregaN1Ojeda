const socket = io();

socket.on("updateProducts", (products) => {
  const tableBody = document.getElementById("productList");
  tableBody.innerHTML = "";
  products.forEach((p) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.title}</td>
      <td>$${p.price}</td>
      <td><button class="btn-delete" onclick="deleteProduct('${p.id}', '${p.title}')">🗑️</button></td>
    `;
    tableBody.appendChild(row);
  });
});

document.getElementById("btn-add").addEventListener("click", async () => {
  const { value: formValues } = await Swal.fire({
    title: "Agregar nuevo producto",
    html: `
      <input id="swal-input1" class="swal2-input" placeholder="Nombre del producto">
      <input id="swal-input2" type="number" class="swal2-input" placeholder="Precio">
    `,
    focusConfirm: false,
    confirmButtonText: "Agregar",
    preConfirm: () => {
      return {
        title: document.getElementById("swal-input1").value,
        price: parseFloat(document.getElementById("swal-input2").value)
      };
    }
  });

  if (formValues && formValues.title && !isNaN(formValues.price)) {
    socket.emit("newProduct", formValues);
    Swal.fire("✅ Producto agregado", "", "success");
  } else {
    Swal.fire("❌ Error", "Debes ingresar un nombre y precio válido", "error");
  }
});

function deleteProduct(id, title) {
  Swal.fire({
    title: `¿Eliminar "${title}"?`,
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      socket.emit("deleteProduct", id);
      Swal.fire("🗑️ Eliminado", `"${title}" fue eliminado.`, "success");
    }
  });
}
