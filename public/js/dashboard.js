function startApp() {
  console.log("dashboard.js carregado!");
  loginCheck();
}

function loginCheck() {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      window.location.href = "/login";
      return;
    }
    if (userId) {
      fetchNotebooks(userId);
    }
  } catch (error) {
    console.error("Erro ao mostrar dashboard:", error);
    alert("Erro de conexão com o servidor");
  }
}

async function fetchNotebooks(userId) {
  try {
    //busca cadernos no backend
    const response = await fetch(`/api/notebooks?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("DADOS:", data);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    if (data.success) {
      showNotebooks(data.notebooks);
    }
  } catch (error) {
    console.log(error);
  }
}

function showNotebooks(notebooks) {
  try {
    const container = document.getElementById("notebooksContainer");
    if (notebooks.length === 0) {
      console.log("Sem cadernos para mostrar.");
      container.innerHTML = '<p>Nenhum caderno encontrado. Crie seu primeiro!</p>';
      return;
    }
    notebooks.forEach((notebook) => {
        const card = document.createElement('div');
        const title = document.createElement('h4');
        title.textContent = notebook.title;
        card.appendChild(title);
        container.appendChild(card);
    });
  } catch (error) {
        console.log("Erro em showNotebooks:", error);
  }
}

document.addEventListener("DOMContentLoaded", startApp);
