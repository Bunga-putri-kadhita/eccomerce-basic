// script.js
async function fetchProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const products = await res.json();

    const grid = document.getElementById("product-grid");

    products.forEach((product) => {
      const rating = product.rating?.rate || 0;
      const rounded = Math.round(rating);

      const card = document.createElement("div");
      card.className = "bg-white p-4 rounded shadow hover:shadow-lg transition";

      card.innerHTML = `
        <a href="description.html?id=${product.id}">
          <img src="${product.image}" alt="${
        product.title
      }" class="h-40 object-contain mx-auto mb-2" />
          <h3 class="text-sm font-semibold mb-1 truncate">${product.title}</h3>
          <p class="text-red-500 font-bold mb-1">$${product.price}</p>
          <div class="text-yellow-400 text-sm flex items-center">
            ${"★".repeat(rounded)}${"☆".repeat(5 - rounded)}
            <span class="ml-2 text-gray-600 text-xs">(${rating.toFixed(
              1
            )})</span>
          </div>
        </a>
        <button class="add-to-cart-btn ">🛒</button>
      `;

      // Tambahkan event klik untuk menambahkan ke cart
      card.querySelector(".add-to-cart-btn").addEventListener("click", (e) => {
        e.preventDefault(); // Supaya tidak ikut membuka link
        addToCart(product); // Tambah ke cart
      });

      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Gagal mengambil produk:", error);
  }
}

// Fungsi untuk menambahkan produk ke keranjang (localStorage)
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Jika produk sudah ada di cart, tambahkan qty
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`Produk "${product.title}" telah ditambahkan ke keranjang!`);
}

// Panggil fungsi saat halaman selesai dimuat
window.onload = fetchProducts;
