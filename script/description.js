const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

async function productDetail(id) {
  const productContainer = document.getElementById("product");

  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!response.ok) {
      productContainer.innerHTML = `
        <div class="col-span-full text-center py-10 text-red-500">
          Produk tidak ditemukan
        </div>
      `;
      return;
    }

    const product = await response.json();

    productContainer.innerHTML = `
      <div class="flex flex-col md:flex-row gap-10 mt-20">
        <!-- Image -->
        <div class="flex-1 flex justify-center">
          <img src="${product.image}" alt="${product.title}" class="w-full max-w-sm object-contain bg-gray-100 p-4 rounded" />
        </div>

        <!-- Detail -->
        <div class="flex-1 space-y-6">
          <h2 class="text-2xl font-bold">${product.title}</h2>

          <div class="flex items-center gap-2">
            <div class="text-yellow-400 text-xl">★★★★☆</div>
            <p class="text-gray-500 text-sm">(150 Ratings)</p>
            <p class="text-green-600 font-semibold text-sm ml-2">| In Stock</p>
          </div>

          <p class="text-2xl font-bold text-gray-800">$${product.price}</p>

          <p class="text-gray-600 text-sm">
            Satisfaction Guaranteed. Return or exchange any order within 30 days. Designed and sold by Hafeez Center in the United States.
          </p>

          <!-- Quantity & Buy -->
          <div class="flex items-center gap-4">
            <div class="flex items-center border rounded overflow-hidden">
              <button class="px-3 py-1 text-lg font-bold bg-gray-200" onclick="decreaseQty()">−</button>
              <input id="qty" type="number" value="1" class="w-12 text-center outline-none" />
              <button class="px-3 py-1 text-lg font-bold bg-gray-200" onclick="increaseQty()">+</button>
            </div>
            <button id="buy-now-btn" class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded">Buy Now</button>
            <button class="add-to-cart-btn" data-id="1">🛒</button>
          </div>

          <!-- Delivery Info -->
          <div class="border rounded p-4 space-y-4 text-sm text-gray-700">
            <div>
              <strong>🚚 Free Delivery</strong><br />
              Enter your postal code for Delivery Availability
            </div>
            <div class="border-t pt-4">
              <strong>↩️ Return Delivery</strong><br />
              Free 30 Days Delivery Returns. <a href="#" class="text-blue-500 underline">Details</a>
            </div>
          </div>
        </div>
      </div>
    `;

    // Event add to cart
    const btn = productContainer.querySelector(".add-to-cart-btn");
    btn.addEventListener("click", () => addCart(product));

    // Event Buy Now
    const buyNowBtn = document.getElementById("buy-now-btn");
    buyNowBtn.addEventListener("click", () => {
      const qty = parseInt(document.getElementById("qty").value) || 1;

      const checkoutItem = {
        ...product,
        qty: qty,
      };

      localStorage.setItem("checkout", JSON.stringify(checkoutItem));
      window.location.href = "../html/co.html"; // Pergi ke halaman checkout
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    productContainer.innerHTML = `
      <div class="col-span-full text-center py-10 text-red-500">
        Terjadi kesalahan saat mengambil data produk
      </div>
    `;
  }
}

// Tambah ke cart
function addCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Produk berhasil ditambahkan ke keranjang!");
}

productDetail(productId);

// Qty handler
function increaseQty() {
  const qtyInput = document.getElementById("qty");
  qtyInput.value = parseInt(qtyInput.value) + 1;
}

function decreaseQty() {
  const qtyInput = document.getElementById("qty");
  if (parseInt(qtyInput.value) > 1) {
    qtyInput.value = parseInt(qtyInput.value) - 1;
  }
}
