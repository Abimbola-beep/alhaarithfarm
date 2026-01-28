let productsData = null;

fetch("data/products.json")
  .then((res) => res.json())
  .then((data) => {
    productsData = data;
    renderProducts(data.products);
  });

function renderProducts(products) {
  const container = document.getElementById("productList");

  products.forEach((product) => {
    const div = document.createElement("div");
    div.className = "product-item";

    div.innerHTML = `
      <h3>${product.id}</h3>

      <label>Price (₦)</label>
      <input type="number" value="${product.price}" data-id="${product.id}" class="price-input" />

      <label>Stock Status</label>
      <select data-id="${product.id}" class="stock-select">
        <option value="true" ${product.inStock ? "selected" : ""}>In Stock</option>
        <option value="false" ${!product.inStock ? "selected" : ""}>Out of Stock</option>
      </select>
    `;

    container.appendChild(div);
  });
}

document.getElementById("downloadJson").addEventListener("click", () => {
  document.querySelectorAll(".price-input").forEach((input) => {
    const product = productsData.products.find(
      (p) => p.id === input.dataset.id,
    );
    product.price = Number(input.value);
  });

  document.querySelectorAll(".stock-select").forEach((select) => {
    const product = productsData.products.find(
      (p) => p.id === select.dataset.id,
    );
    product.inStock = select.value === "true";
  });

  const blob = new Blob([JSON.stringify(productsData, null, 2)], {
    type: "application/json",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "products.json";
  link.click();
});
