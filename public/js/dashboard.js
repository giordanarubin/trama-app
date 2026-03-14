function startApp() {
  console.log("dashboard.js carregado!");
  loginCheck();
  setupEventListeners();
}

function loginCheck() {
  try {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    if (!userId) {
      window.location.href = "/login";
      return;
    }
    if (userName) {
      document.getElementById('userName').textContent = userName;
    }
    fetchNotebooks(userId);

  } catch (error) {
    console.error("Erro ao mostrar dashboard:", error);
    alert("Erro de conexão com o servidor");
  }
}

function setupEventListeners() {
  // Botão logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
    
  // Fechar modal
  const closeModal = document.querySelector('.close-modal');
  if (closeModal) {
    closeModal.addEventListener('click', closeNotebookModal);
  }
    
  // Opções de cor
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      colorOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
}

function logout() {
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  window.location.href = '/';
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
    if (!container) return;
    container.innerHTML = '';

    const addCard = document.createElement('div');
    addCard.className = 'add-notebook-card';
    addCard.innerHTML = `
      <div class="plus-icon">+</div>
      <div>Criar Novo Caderno</div>
    `;
    addCard.onclick = openNotebookModal;
    container.appendChild(addCard);

    if (notebooks.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = `
        <h3>Nenhum caderno ainda</h3>
        <p>Clique no botão "+" para criar seu primeiro caderno!</p>
      `;
      container.appendChild(emptyState);
      return;
    }

    notebooks.forEach((notebook) => {
      const card = document.createElement('div');
      card.className = 'notebook-card';
            
      const createdDate = new Date(notebook.createdAt).toLocaleDateString('pt-BR');
            
      card.innerHTML = `
        <div class="notebook-color" style="background-color: ${notebook.coverColor}"></div>
        <h4 class="notebook-title">${notebook.title}</h4>
        ${notebook.description ? `<p class="notebook-description">${notebook.description}</p>` : ''}
        <p class="notebook-date">Criado em: ${createdDate}</p>
        <button class="delete-notebook" onclick="deleteNotebook('${notebook._id}', event)">🗑️</button>
      `;
            
      card.onclick = (e) => {
        if (!e.target.classList.contains('delete-notebook')) {
          openNotebook(notebook._id);
        }
      };            
      container.appendChild(card);
    });

  } catch (error) {
        console.log("Erro em showNotebooks:", error);
  }
}

function openNotebookModal() {
  const modal = document.getElementById('notebookModal');
  if (modal) {
    modal.style.display = 'flex';
    document.getElementById('notebookTitle').focus();
  }
}

function closeNotebookModal() {
  const modal = document.getElementById('notebookModal');
  if (modal) {
    modal.style.display = 'none';
    document.getElementById('notebookForm').reset();
        
    // Remove seleção de cores
    document.querySelectorAll('.color-option').forEach(opt => {
      opt.classList.remove('selected');
    });
  }
}

async function createNotebook() {
  try {
    const userId = localStorage.getItem("userId");
    const title = document.getElementById('notebookTitle').value.trim();
    const description = document.getElementById('notebookDescription').value.trim();
        
    // Pega cor selecionada
    const selectedColor = document.querySelector('.color-option.selected');
    const coverColor = selectedColor ? selectedColor.dataset.color : '#F5AAA0';
        
    if (!title) {
      alert('Título é obrigatório!');
      return;
    }
        
    const response = await fetch('/api/notebooks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        title: title,
        description: description,
        coverColor: coverColor
      })
    });
        
    const data = await response.json();
        
      if (data.success) {
        closeNotebookModal();
        fetchNotebooks(userId); // Recarrega lista
      } else {
        alert('Erro: ' + data.message);
      }

  } catch (error) {
    console.error('Erro ao criar caderno:', error);
    alert('Erro ao criar caderno');
  }
}

async function deleteNotebook(notebookId, event) {
  event.stopPropagation();
    
  if (!confirm('Tem certeza que deseja excluir este caderno?')) {return;}
    
  try {
    const userId = localStorage.getItem("userId");
        
    const response = await fetch(`/api/notebooks/${notebookId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: userId })
    });
        
    const data = await response.json();
        
    if (data.success) {
      fetchNotebooks(userId); // Recarrega lista
    } else {alert('Erro: ' + data.message)}

    } catch (error) {
      console.error('Erro ao deletar caderno:', error);
      alert('Erro ao deletar caderno');
    }
}

function openNotebook(notebookId) {
    window.location.href = `/notebook?id=${notebookId}`;
}

function showError(message) {
  const container = document.getElementById("notebooksContainer");
  if (container) {
    container.innerHTML = `<div class="empty-state"><p style="color: #F5AAA0;">${message}</p></div>`;
  }
}

// Expor funções globalmente para onclick
window.createNotebook = createNotebook;
window.closeNotebookModal = closeNotebookModal;
window.deleteNotebook = deleteNotebook;

document.addEventListener("DOMContentLoaded", startApp);
