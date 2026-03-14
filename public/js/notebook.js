// Variáveis globais
let currentNotebookId = null;
let currentFilter = 'all';
let currentNoteId = null;

function startApp() {
    console.log("✅ notebook.js carregado!");
    checkAuth();
    loadNotebookData();
    setupEventListeners();
}

function checkAuth() {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    
    if (!userId) {
        window.location.href = "/login";
        return;
    }
    
    document.getElementById('userName').textContent = userName;
    
    // Pega o ID do caderno da URL
    const urlParams = new URLSearchParams(window.location.search);
    currentNotebookId = urlParams.get('id');
    
    if (!currentNotebookId) {
        window.location.href = "/dashboard";
    }
}

function setupEventListeners() {
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Fechar modais com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeNoteModal();
            closeViewModal();
        }
    });
}

function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    window.location.href = '/';
}

async function loadNotebookData() {
    try {
        // Carregar informações do caderno
        const userId = localStorage.getItem("userId");
        
        // Primeiro busca todos cadernos e filtra
        const response = await fetch(`/api/notebooks?userId=${userId}`);
        const data = await response.json();
        
        if (data.success) {
            const notebook = data.notebooks.find(n => n._id === currentNotebookId);
            if (notebook) {
                document.getElementById('notebookTitle').textContent = notebook.title;
                document.getElementById('notebookDescription').textContent = 
                    notebook.description || 'Sem descrição';
            }
        }
        
        // Carregar notas do caderno
        loadNotes();
        
    } catch (error) {
        console.error('Erro ao carregar caderno:', error);
        alert('Erro ao carregar dados do caderno');
    }
}

async function loadNotes() {
    try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(
            `/api/notebooks/${currentNotebookId}/notes?userId=${userId}`
        );
        const data = await response.json();
        
        if (data.success) {
            displayNotes(data.notes);
        }
    } catch (error) {
        console.error('Erro ao carregar notas:', error);
    }
}

function displayNotes(notes) {
    const container = document.getElementById('notesContainer');
    
    if (notes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Nenhuma nota ainda</h3>
                <p>Clique em "Nova Nota" para criar sua primeira anotação!</p>
            </div>
        `;
        return;
    }
    
    // Aplicar filtro
    let filteredNotes = notes;
    if (currentFilter === 'favorites') {
        filteredNotes = notes.filter(n => n.isFavorite);
    }
    
    if (filteredNotes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Nenhuma nota encontrada com este filtro</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredNotes.map(note => createNoteCard(note)).join('');
}

function createNoteCard(note) {
    const date = new Date(note.updatedAt).toLocaleDateString('pt-BR');
    const preview = note.content.replace(/<[^>]*>/g, '').substring(0, 100);
    
    return `
        <div class="note-card ${note.isFavorite ? 'favorite' : ''}" 
             onclick="viewNote('${note._id}')"
             style="background-color: ${note.color}">
            <h3>${note.title}</h3>
            <div class="note-preview">${preview}${preview.length >= 100 ? '...' : ''}</div>
            ${note.tags && note.tags.length ? `
                <div class="note-tags">
                    ${note.tags.map(tag => `<span class="note-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            <div class="note-footer">
                <span>${date}</span>
                ${note.isFavorite ? '<span class="note-favorite active">⭐</span>' : ''}
            </div>
        </div>
    `;
}

// ========== CRUD DE NOTAS ==========

function openCreateNoteModal() {
    currentNoteId = null;
    document.getElementById('modalTitle').textContent = 'Nova Nota';
    document.getElementById('noteForm').reset();
    document.getElementById('noteContent').innerHTML = '';
    document.getElementById('noteId').value = '';
    document.getElementById('noteNotebookId').value = currentNotebookId;
    
    // Reset cor selecionada
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector('.color-option[data-color="#FFFFFF"]').classList.add('selected');
    
    document.getElementById('noteModal').style.display = 'flex';
    document.getElementById('noteTitle').focus();
}

function closeNoteModal() {
    document.getElementById('noteModal').style.display = 'none';
}

async function saveNote() {
    try {
        const userId = localStorage.getItem("userId");
        const noteId = document.getElementById('noteId').value;
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('noteContent').innerHTML;
        const selectedColor = document.querySelector('.color-option.selected');
        const color = selectedColor ? selectedColor.dataset.color : '#FFFFFF';
        const isFavorite = document.getElementById('noteFavorite').checked;
        
        // Processar tags
        const tagsInput = document.getElementById('noteTags').value;
        const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t);
        
        const noteData = {
            notebookId: currentNotebookId,
            userId: userId,
            title: title,
            content: content,
            color: color,
            isFavorite: isFavorite,
            tags: tags
        };
        
        let url = '/api/notes';
        let method = 'POST';
        
        if (noteId) {
            url = `/api/notes/${noteId}`;
            method = 'PUT';
        }
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noteData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            closeNoteModal();
            loadNotes(); // Recarrega lista
        } else {
            alert('Erro: ' + data.message);
        }
    } catch (error) {
        console.error('Erro ao salvar nota:', error);
        alert('Erro ao salvar nota');
    }
}

async function viewNote(noteId) {
    try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`/api/notebooks/${currentNotebookId}/notes?userId=${userId}`);
        const data = await response.json();
        
        if (data.success) {
            const note = data.notes.find(n => n._id === noteId);
            if (note) {
                currentNoteId = noteId;
                document.getElementById('viewNoteTitle').textContent = note.title;
                document.getElementById('viewNoteContent').innerHTML = note.content || '';
                document.getElementById('viewNoteDate').textContent = 
                    `Criado em: ${new Date(note.createdAt).toLocaleDateString('pt-BR')}`;
                
                // Tags
                const tagsContainer = document.getElementById('viewNoteTags');
                if (note.tags && note.tags.length) {
                    tagsContainer.innerHTML = note.tags.map(t => 
                        `<span class="note-tag">${t}</span>`
                    ).join('');
                } else {
                    tagsContainer.innerHTML = '';
                }
                
                // Favorito
                const favBadge = document.getElementById('viewNoteFavorite');
                if (note.isFavorite) {
                    favBadge.classList.add('show');
                } else {
                    favBadge.classList.remove('show');
                }
                
                document.getElementById('viewNoteModal').style.display = 'flex';
            }
        }
    } catch (error) {
        console.error('Erro ao carregar nota:', error);
    }
}

function closeViewModal() {
    document.getElementById('viewNoteModal').style.display = 'none';
    currentNoteId = null;
}

function editCurrentNote() {
    closeViewModal();
    editNote(currentNoteId);
}

async function editNote(noteId) {
    try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`/api/notebooks/${currentNotebookId}/notes?userId=${userId}`);
        const data = await response.json();
        
        if (data.success) {
            const note = data.notes.find(n => n._id === noteId);
            if (note) {
                document.getElementById('modalTitle').textContent = 'Editar Nota';
                document.getElementById('noteId').value = note._id;
                document.getElementById('noteTitle').value = note.title;
                document.getElementById('noteContent').innerHTML = note.content || '';
                document.getElementById('noteTags').value = note.tags ? note.tags.join(', ') : '';
                document.getElementById('noteFavorite').checked = note.isFavorite;
                
                // Selecionar cor
                document.querySelectorAll('.color-option').forEach(opt => {
                    opt.classList.remove('selected');
                    if (opt.dataset.color === note.color) {
                        opt.classList.add('selected');
                    }
                });
                
                document.getElementById('noteModal').style.display = 'flex';
            }
        }
    } catch (error) {
        console.error('Erro ao carregar nota para edição:', error);
    }
}

async function deleteCurrentNote() {
    if (!confirm('Tem certeza que deseja excluir esta nota?')) return;
    
    try {
        const userId = localStorage.getItem("userId");
        
        const response = await fetch(`/api/notes/${currentNoteId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            closeViewModal();
            loadNotes(); // Recarrega lista
        } else {
            alert('Erro: ' + data.message);
        }
    } catch (error) {
        console.error('Erro ao deletar nota:', error);
        alert('Erro ao deletar nota');
    }
}

// ========== FUNÇÕES DO EDITOR ==========

function formatText(format) {
    document.execCommand(format, false, null);
    document.getElementById('noteContent').focus();
}

function insertList() {
    document.execCommand('insertUnorderedList', false, null);
}

// ========== BUSCA E FILTROS ==========

function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    searchBar.classList.toggle('hidden');
    if (!searchBar.classList.contains('hidden')) {
        document.getElementById('searchInput').focus();
    }
}

async function searchNotes() {
    const query = document.getElementById('searchInput').value;
    if (query.length < 3) {
        if (query.length === 0) loadNotes();
        return;
    }
    
    try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(
            `/api/notes/search?userId=${userId}&query=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        
        if (data.success) {
            displayNotes(data.notes);
        }
    } catch (error) {
        console.error('Erro na busca:', error);
    }
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('searchBar').classList.add('hidden');
    loadNotes();
}

function filterNotes(filter) {
    currentFilter = filter;
    
    // Atualizar botões ativos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadNotes(); // Recarrega e o displayNotes aplica o filtro
}

// ========== CORES ==========

document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.color-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        this.classList.add('selected');
    });
});

// Inicialização
document.addEventListener("DOMContentLoaded", startApp);
