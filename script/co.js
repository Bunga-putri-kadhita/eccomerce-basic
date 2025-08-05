document.addEventListener("DOMContentLoaded", () => {
  const productListEl = document.getElementById("product-list");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  const placeOrderBtn = document.querySelector("button.mt-6.w-full");
  const popup = document.getElementById("popup-success");

  let products = [];

  function loadProducts() {
    const checkoutRaw = localStorage.getItem("checkout");
    if (checkoutRaw) {
      const co = JSON.parse(checkoutRaw);
      return [
        {
          id: co.id,
          title: co.title,
          price: co.price,
          image: co.image,
          quantity: co.qty || 1,
        },
      ];
    }
    const cartRaw = localStorage.getItem("cart");
    if (cartRaw) {
      const cart = JSON.parse(cartRaw);
      return cart
        .filter((item) => item.checked)
        .map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: item.quantity || 1,
        }));
    }
    return [];
  }

  function formatPrice(num) {
    return `$${num.toFixed(2)}`;
  }

  function updateTotals() {
    let subtotal = 0;
    products.forEach((p) => {
      subtotal += p.price * p.quantity;
    });
    subtotalEl.textContent = formatPrice(subtotal);
    totalEl.textContent = formatPrice(subtotal);
  }

  function renderCartItems() {
    productListEl.innerHTML = "";
    if (products.length === 0) {
      productListEl.innerHTML = `
        <div class="text-center text-gray-500 py-4">
          Keranjang kosong. Silakan kembali ke cart untuk memilih produk.
        </div>`;
      subtotalEl.textContent = formatPrice(0);
      totalEl.textContent = formatPrice(0);
      return;
    }
    products.forEach((p) => {
      const div = document.createElement("div");
      div.className = "flex justify-between items-center border-b pb-3 mb-3";
      div.innerHTML = `
        <div class="flex items-center gap-4">
          <img src="${p.image}" alt="${
        p.title
      }" class="w-16 h-16 object-cover" />
          <span class="font-medium">${p.title}</span>
        </div>
        <div class="text-right">
          <div>${formatPrice(p.price)}</div>
          <div class="flex items-center justify-end gap-2 mt-1">
            <span>Qty:</span>
            <input type="number" class="quantity-input w-12 border rounded text-center"
                   data-id="${p.id}" data-price="${p.price}"
                   value="${p.quantity}" min="1" />
            <span class="item-total">${formatPrice(p.price * p.quantity)}</span>
          </div>
        </div>
      `;
      productListEl.appendChild(div);
    });
    attachQuantityListeners();
    updateTotals();
  }

  function attachQuantityListeners() {
    document.querySelectorAll(".quantity-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        const id = parseInt(e.target.dataset.id, 10);
        const qty = parseInt(e.target.value, 10) || 1;
        const product = products.find((p) => p.id === id);
        if (!product) return;
        product.quantity = qty;
        const price = parseFloat(e.target.dataset.price);
        e.target.nextElementSibling.textContent = formatPrice(price * qty);

        const checkoutRaw = localStorage.getItem("checkout");
        if (checkoutRaw) {
          const co = JSON.parse(checkoutRaw);
          if (co.id === id) {
            co.qty = qty;
            localStorage.setItem("checkout", JSON.stringify(co));
          }
        } else {
          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          const idx = cart.findIndex((it) => it.id === id);
          if (idx > -1) {
            cart[idx].quantity = qty;
            localStorage.setItem("cart", JSON.stringify(cart));
          }
        }
        updateTotals();
      });
    });
  }

  placeOrderBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (products.length === 0) {
      alert("Keranjang kosong! Silakan pilih produk terlebih dahulu.");
      return;
    }
    popup.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Inisialisasi
  products = loadProducts();
  renderCartItems();
});
