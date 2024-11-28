const hamBurger = document.querySelector(".toggle-btn");

hamBurger.addEventListener("click", function () {
  document.querySelector("#sidebar").classList.toggle("expand");
});

document.getElementById('addBridgeForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('bridgeName').value;
  const arp = document.getElementById('arp').value;
  const protocolMode = document.querySelector('input[name="protocolMode"]:checked').value;
  const vlanFiltering = document.getElementById('vlanFiltering').checked;

  console.log("Form data:", { name, arp, protocolMode, vlanFiltering });

  fetch('/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          name,
          arp,
          "protocol-mode": protocolMode,
          "vlan-filtering": vlanFiltering
      })
  })
  .then(res => res.json())
  .then(data => {
      console.log("Response data:", data);
      alert(data.message || data.error);
      if (data.message) location.reload();
  })
  .catch(err => console.error("Fetch error:", err));
});

document.querySelectorAll('.delete-btn').forEach(button => {
  button.addEventListener('click', function () {
    const id = this.getAttribute('data-id');
    
    if (confirm("Are you sure you want to delete this bridge?")) {
      fetch(`/delete/${id}`, { method: 'DELETE' })
        // .then(res => {
        //   if (res.ok) {
        //     return res.json();  // Menangani respons JSON jika berhasil
        //   }
        //   throw new Error('Failed to delete');  // Jika respons tidak OK, lempar error
        // })
        // .then(data => {
        //   console.log("Response data:", data);
        //   alert(data.message || data.error);  // Tampilkan pesan dari API

        //   if (data.message) {
        //     // Menghapus elemen bridge dari tampilan tanpa memuat ulang halaman
        //     const bridgeRow = this.closest('tr');  // Mengambil baris <tr> yang berisi tombol delete
        //     if (bridgeRow) {
        //       bridgeRow.remove();  // Hapus baris dari DOM
        //     }
        //   }
        // })
        // .catch(err => {
        //   console.error("Error deleting bridge:", err);
        //   alert("Failed to delete the bridge.");
        // });
        location.reload();
    }
  });
});



document.querySelectorAll('.edit-btn').forEach(button => {
  button.addEventListener('click', function () {
    const id = this.getAttribute('data-id');
    const newName = prompt("Enter new name:");
    const newMac = prompt("Enter new MAC Address:");
    if (newName && newMac) {
      fetch(`/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, "mac-address": newMac })
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message || data.error);
          location.reload();
        });
    }
  });
});

document.querySelectorAll('.detail-btn').forEach(button => {
  button.addEventListener('click', function () {
      const bridgeId = this.getAttribute('data-id');
      console.log("Fetching details for bridge ID:", bridgeId);

      fetch(`/bridge/${bridgeId}`)
          .then(res => {
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              return res.json();
          })
          .then(data => {
              console.log("Bridge details:", data);

              const detailsList = document.getElementById('bridgeDetailsList');
              detailsList.innerHTML = '';

              for (const [key, value] of Object.entries(data)) {
                  const listItem = document.createElement('li');
                  listItem.className = 'list-group-item';
                  listItem.textContent = `${key}: ${value}`;
                  detailsList.appendChild(listItem);
              }

              // Tampilkan modal
              const modal = new bootstrap.Modal(document.getElementById('bridgeDetailModal'));
              modal.show();
          })
          .catch(err => {
              console.error("Error fetching bridge details:", err);
              alert("Failed to fetch bridge details. Please check your setup.");
          });
  });
});
