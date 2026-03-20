const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !subject || !message) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        contactForm.reset();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Failed to send message");
    }
  });
}
const certificatesContainer = document.getElementById("certificatesContainer");

async function loadPortfolioCertificates() {
  if (!certificatesContainer) return;

  try {
    const response = await fetch("http://localhost:5000/api/certificates");
    const certificates = await response.json();

    certificatesContainer.innerHTML = "";

    certificates.forEach((certificate) => {
      const certCard = document.createElement("a");
      certCard.classList.add("cert-item");
      certCard.href = `CERTIFICATES/${certificate.file_name}`;
      certCard.target = "_blank";

      let iconClass = "fa-solid fa-code";

      if (certificate.title.toLowerCase().includes("cyber")) {
        iconClass = "fa-solid fa-shield-halved";
      } else if (certificate.title.toLowerCase().includes("node")) {
        iconClass = "fa-brands fa-node-js";
      } else if (certificate.title.toLowerCase().includes("github")) {
        iconClass = "fa-solid fa-code";
      } else if (certificate.title.toLowerCase().includes("front end")) {
        iconClass = "fa-solid fa-code";
      }

      certCard.innerHTML = `
        <i class="${iconClass}"></i>
        <p>${certificate.title}(${certificate.issuer})</p>
      `;

      certificatesContainer.appendChild(certCard);
    });
  } catch (error) {
    certificatesContainer.innerHTML = "<p>Failed to load certificates</p>";
  }
}

loadPortfolioCertificates();