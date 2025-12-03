function startApp() {
  console.log("dashboard.js carregado!");
  loginCheck();
}

function loginCheck() {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      window.location.href = "/";
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

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    if (data.success) {
      showNotebooks(data.notebooks);
    }
  } catch (error) {
    console.error(error);
  }
};

function showNotebooks(notebooks) {

};

document.addEventListener("DOMContentLoaded", startApp);
