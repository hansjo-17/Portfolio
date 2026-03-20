const loginForm = document.getElementById("adminLoginForm");
const loginMessage = document.getElementById("loginMessage");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        loginMessage.textContent = data.message;
        localStorage.setItem("isAdminLoggedIn", "true");
        window.location.href = "admin-dashboard.html";
      } else {
        loginMessage.textContent = data.message;
      }
    } catch (error) {
      loginMessage.textContent = "Something went wrong";
    }
  });
}

const contactsList = document.getElementById("contactsList");
const certificatesList = document.getElementById("certificatesList");
const certificateForm = document.getElementById("certificateForm");
const certMessage = document.getElementById("certMessage");

if (window.location.pathname.includes("admin-dashboard.html")) {
  const isLoggedIn = localStorage.getItem("isAdminLoggedIn");

  if (isLoggedIn !== "true") {
    window.location.href = "admin-login.html";
  }

  loadContacts();
  loadCertificates();
}

async function loadContacts() {
  if (!contactsList) return;

  try {
    const response = await fetch("http://localhost:5000/api/contacts");
    const contacts = await response.json();

    contactsList.innerHTML = "";

    contacts.forEach((contact) => {
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerHTML = `
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <p><strong>Message:</strong> ${contact.message}</p>
        <button onclick="deleteContact(${contact.id})">Delete</button>
      `;
      contactsList.appendChild(div);
    });
  } catch (error) {
    contactsList.innerHTML = "<p>Failed to load contacts</p>";
  }
}

async function deleteContact(id) {
  try {
    const response = await fetch(`http://localhost:5000/api/contacts/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();
    alert(data.message);
    loadContacts();
  } catch (error) {
    alert("Failed to delete contact");
  }
}

if (certificateForm) {
  certificateForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("certTitle").value;
    const issuer = document.getElementById("certIssuer").value;
    const file_name = document.getElementById("certFileName").value;

    try {
      const response = await fetch("http://localhost:5000/api/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, issuer, file_name })
      });

      const data = await response.json();
      certMessage.textContent = data.message;
      certificateForm.reset();
      loadCertificates();
    } catch (error) {
      certMessage.textContent = "Failed to add certificate";
    }
  });
}

async function loadCertificates() {
  if (!certificatesList) return;

  try {
    const response = await fetch("http://localhost:5000/api/certificates");
    const certificates = await response.json();

    certificatesList.innerHTML = "";

    certificates.forEach((certificate) => {
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerHTML = `
        <p><strong>Title:</strong> ${certificate.title}</p>
        <p><strong>Issuer:</strong> ${certificate.issuer}</p>
        <p><strong>File:</strong> ${certificate.file_name}</p>
        <button onclick="editCertificate(${certificate.id}, '${certificate.title}', '${certificate.issuer}', '${certificate.file_name}')">Edit</button>
        <button onclick="deleteCertificate(${certificate.id})">Delete</button>
      `;
      certificatesList.appendChild(div);
    });
  } catch (error) {
    certificatesList.innerHTML = "<p>Failed to load certificates</p>";
  }
}

async function deleteCertificate(id) {
  try {
    const response = await fetch(`http://localhost:5000/api/certificates/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();
    alert(data.message);
    loadCertificates();
  } catch (error) {
    alert("Failed to delete certificate");
  }
}
function editCertificate(id, title, issuer, file_name) {
  document.getElementById("certTitle").value = title;
  document.getElementById("certIssuer").value = issuer;
  document.getElementById("certFileName").value = file_name;

  certificateForm.onsubmit = async (e) => {
    e.preventDefault();

    const updatedTitle = document.getElementById("certTitle").value;
    const updatedIssuer = document.getElementById("certIssuer").value;
    const updatedFileName = document.getElementById("certFileName").value;

    try {
      const response = await fetch(`http://localhost:5000/api/certificates/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: updatedTitle,
          issuer: updatedIssuer,
          file_name: updatedFileName
        })
      });

      const data = await response.json();
      alert(data.message);

      certificateForm.reset();
      loadCertificates();

      // restore original add behavior
      location.reload();

    } catch (error) {
      alert("Failed to update certificate");
    }
  };
}
function logout() {
  localStorage.removeItem("isAdminLoggedIn");
  window.location.href = "admin-login.html";
}