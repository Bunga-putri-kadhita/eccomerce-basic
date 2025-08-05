document.addEventListener("DOMContentLoaded", async () => {
  const cartItemsEl = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");

  let products = [];

  // mengambil data cart dari localStorage
  function loadCartFromStorage() { // Ambil data dari localStorage
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : null;
  }

  // Simpan cart ke localStorage
  function saveCartToStorage() {
    localStorage.setItem("cart", JSON.stringify(products));
  }

  // mengisi dan menamppilkan produk pada cart I
  async function initializeCart() {
    const stored = loadCartFromStorage(); 

    if (stored && stored.length) { // Jika ada data di localStorage
      products = stored.map((item) => ({ // mengganti data menjadi array
        ...item,
        checked: item.checked !== undefined ? item.checked : true,
        quantity: item.quantity || 1,
      }));
      renderCartItems(); // menampilkan produk ke html
    } else {
      try {
        const res = await fetch("https://fakestoreapi.com/products?limit=3");
        const data = await res.json();

        products = data.map((item) => ({
          id: item.id,
          title: item.title,
          price: parseFloat(item.price.toFixed(2)),
          image: item.image,
          quantity: 1,
          checked: true,
        }));

        saveCartToStorage(); // Simpan ke localStorage
        renderCartItems();
      } catch (err) {
        cartItemsEl.innerHTML = `
          <tr>
            <td colspan="5" class="text-center text-red-500 py-4">Failed to load products</td>
          </tr>
        `;
      }
    }
  }

  // Render semua item di keranjang
  function renderCartItems() {
    cartItemsEl.innerHTML = ""; // Kosongkan dulu

    products.forEach((product, index) => {
      const tr = document.createElement("tr");
      tr.className = "border-b border-gray-100";

      tr.innerHTML = `
        <td class="p-3 text-center">
          <input
            type="checkbox"
            ${product.checked ? "checked" : ""}
            class="w-5 h-5 cursor-pointer"
            data-index="${index}"
          />
        </td>
        <td class="p-3 flex items-center gap-3">
          <img
            src="${product.image}"
            alt="${product.title}"
            class="w-12 h-12 object-contain"
          />
          <span class="font-semibold text-sm">${product.title}</span>
        </td>
        <td class="p-3 font-semibold">${formatPrice(product.price)}</td>
        <td class="p-3 text-center">
          <select
            class="border border-gray-300 rounded px-2 py-1 text-center quantity-select"
            data-index="${index}"
          >
            ${[...Array(10)]
              .map((_, i) => {
                const val = i + 1;
                return `<option value="${val}" ${
                  val === product.quantity ? "selected" : ""
                }>${val}</option>`;
              })
              .join("")}
          </select>
        </td>
        <td
          class="p-3 text-center cursor-pointer text-gray-600 hover:text-red-600"
          data-remove="${index}"
          title="Remove"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </td>
      `;

      cartItemsEl.appendChild(tr);
    });

    attachEventListeners();
    updateTotals();
  }

  // Pasang event listener: checkbox, dropdown quantity, dan tombol remove
  function attachEventListeners() {
    // Checkbox item
    cartItemsEl.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        products[idx].checked = e.target.checked;
        saveCartToStorage(); // Simpan ke localStorage
        updateTotals();
      });
    });

    // Dropdown quantity
    cartItemsEl.querySelectorAll(".quantity-select").forEach((select) => {
      select.addEventListener("change", (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        products[idx].quantity = parseInt(e.target.value, 10);
        saveCartToStorage(); // Simpan ke localStorage
        updateTotals();
      });
    });

    // Tombol remove item
    cartItemsEl.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.remove, 10);
        products.splice(idx, 1); // Hapus produk dari array
        saveCartToStorage(); // Simpan ke localStorage
        renderCartItems(); // Render ulang cart
      });
    });
  }

  // Hitung dan tampilkan subtotal & total
  function updateTotals() {
    let subtotal = 0;

    products.forEach((p) => {
      if (p.checked && !isNaN(p.price) && !isNaN(p.quantity)) {
        subtotal += p.price * p.quantity;
      }
    });

    subtotalEl.textContent = formatPrice(subtotal);
    totalEl.textContent = formatPrice(subtotal); // Asumsi ongkir = 0
  }

  // Format angka jadi "$xx.xx"
  function formatPrice(num) {
    return `$${num.toFixed(2)}`;
  }

  // Jalankan inisialisasi
  initializeCart();
});