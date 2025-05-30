/**
 * Universal Top Bar - Sistema de navegação unificado
 * Versão: 1.0.0
 * Autor: Sistema de Navegação Universal
 */

(function() {
    'use strict';
    
    // Namespace único para evitar conflitos
    const UniversalTopBar = {
        config: {
            // Configuração dos sites/produtos
            sites: [
                {
                    name: 'Site Principal',
                    url: 'https://seusite.com',
                    icon: '🏠'
                },
                {
                    name: 'Blog',
                    url: 'https://blog.seusite.com',
                    icon: '📝'
                },
                {
                    name: 'Loja',
                    url: 'https://loja.seusite.com',
                    icon: '🛒'
                },
                {
                    name: 'Suporte',
                    url: 'https://suporte.seusite.com',
                    icon: '🆘'
                }
            ],
            
            // URLs de busca (você pode configurar APIs próprias aqui)
            searchSuggestions: [
                'Produtos',
                'Serviços',
                'Suporte',
                'Blog',
                'Contato',
                'Sobre',
                'Preços',
                'Documentação'
            ],
            
            // Configurações visuais
            theme: {
                backgroundColor: 'rgba(128, 128, 128, 0.9)',
                textColor: '#ffffff',
                hoverColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                fontSize: '14px',
                height: '50px'
            }
        },
        
        // Cache para elementos DOM
        elements: {},
        
        // Estado do componente
        state: {
            isSearchOpen: false,
            searchValue: '',
            suggestions: []
        },
        
        // Inicialização
        init: function() {
            this.createStyles();
            this.createHTML();
            this.bindEvents();
            this.setupKeyboardNavigation();
        },
        
        // Criação dos estilos CSS
        createStyles: function() {
            if (document.getElementById('universal-topbar-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'universal-topbar-styles';
            style.textContent = `
                /* Universal Top Bar Styles */
                .utb-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: ${this.config.theme.height};
                    background: ${this.config.theme.backgroundColor};
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    z-index: 999999;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    font-size: ${this.config.theme.fontSize};
                    line-height: 1;
                }
                
                .utb-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }
                
                .utb-nav {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                
                .utb-menu-item {
                    color: ${this.config.theme.textColor};
                    text-decoration: none;
                    padding: 8px 12px;
                    border-radius: ${this.config.theme.borderRadius};
                    transition: background-color 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    white-space: nowrap;
                }
                
                .utb-menu-item:hover {
                    background: ${this.config.theme.hoverColor};
                    text-decoration: none;
                    color: ${this.config.theme.textColor};
                }
                
                .utb-search-container {
                    position: relative;
                    min-width: 300px;
                }
                
                .utb-search-input {
                    width: 100%;
                    height: 36px;
                    padding: 0 40px 0 12px;
                    border: 1px solid rgba(255,255,255,0.3);
                    border-radius: ${this.config.theme.borderRadius};
                    background: rgba(255,255,255,0.1);
                    color: ${this.config.theme.textColor};
                    font-size: ${this.config.theme.fontSize};
                    outline: none;
                    transition: all 0.2s ease;
                }
                
                .utb-search-input::placeholder {
                    color: rgba(255,255,255,0.7);
                }
                
                .utb-search-input:focus {
                    background: rgba(255,255,255,0.2);
                    border-color: rgba(255,255,255,0.5);
                }
                
                .utb-search-button {
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: ${this.config.theme.textColor};
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 2px;
                }
                
                .utb-search-button:hover {
                    background: ${this.config.theme.hoverColor};
                }
                
                .utb-suggestions {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: rgba(128, 128, 128, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: ${this.config.theme.borderRadius};
                    margin-top: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                    display: none;
                }
                
                .utb-suggestion-item {
                    padding: 10px 12px;
                    color: ${this.config.theme.textColor};
                    cursor: pointer;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    transition: background-color 0.2s ease;
                }
                
                .utb-suggestion-item:hover,
                .utb-suggestion-item.active {
                    background: ${this.config.theme.hoverColor};
                }
                
                .utb-suggestion-item:last-child {
                    border-bottom: none;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .utb-content {
                        padding: 0 10px;
                    }
                    
                    .utb-nav {
                        gap: 10px;
                    }
                    
                    .utb-menu-item {
                        padding: 6px 8px;
                        font-size: 13px;
                    }
                    
                    .utb-search-container {
                        min-width: 200px;
                    }
                }
                
                @media (max-width: 480px) {
                    .utb-menu-item span {
                        display: none;
                    }
                    
                    .utb-search-container {
                        min-width: 150px;
                    }
                }
                
                /* Ajuste do body para não sobrepor o conteúdo */
                body {
                    padding-top: ${this.config.theme.height} !important;
                }
            `;
            
            document.head.appendChild(style);
        },
        
        // Criação da estrutura HTML
        createHTML: function() {
            if (document.getElementById('universal-topbar')) return;
            
            const container = document.createElement('div');
            container.id = 'universal-topbar';
            container.className = 'utb-container';
            
            container.innerHTML = `
                <div class="utb-content">
                    <nav class="utb-nav">
                        ${this.config.sites.map(site => `
                            <a href="${site.url}" class="utb-menu-item" data-site="${site.name}">
                                <span>${site.icon}</span>
                                <span>${site.name}</span>
                            </a>
                        `).join('')}
                    </nav>
                    
                    <div class="utb-search-container">
                        <input 
                            type="text" 
                            class="utb-search-input" 
                            placeholder="Buscar em todos os sites..."
                            autocomplete="off"
                        >
                        <button class="utb-search-button" type="button">
                            🔍
                        </button>
                        <div class="utb-suggestions"></div>
                    </div>
                </div>
            `;
            
            document.body.insertBefore(container, document.body.firstChild);
            
            // Cache dos elementos
            this.elements = {
                container: container,
                searchInput: container.querySelector('.utb-search-input'),
                searchButton: container.querySelector('.utb-search-button'),
                suggestions: container.querySelector('.utb-suggestions')
            };
        },
        
        // Vinculação de eventos
        bindEvents: function() {
            // Evento de input na busca
            this.elements.searchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value);
            });
            
            // Evento de foco na busca
            this.elements.searchInput.addEventListener('focus', () => {
                if (this.state.searchValue) {
                    this.showSuggestions();
                }
            });
            
            // Evento de clique no botão de busca
            this.elements.searchButton.addEventListener('click', () => {
                this.performSearch(this.state.searchValue);
            });
            
            // Evento de submit no input
            this.elements.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch(this.state.searchValue);
                }
            });
            
            // Fechar sugestões ao clicar fora
            document.addEventListener('click', (e) => {
                if (!this.elements.container.contains(e.target)) {
                    this.hideSuggestions();
                }
            });
            
            // Tracking de cliques nos links (opcional)
            this.elements.container.addEventListener('click', (e) => {
                if (e.target.classList.contains('utb-menu-item')) {
                    this.trackNavigation(e.target.dataset.site);
                }
            });
        },
        
        // Configuração da navegação por teclado
        setupKeyboardNavigation: function() {
            let selectedIndex = -1;
            
            this.elements.searchInput.addEventListener('keydown', (e) => {
                const suggestions = this.elements.suggestions.querySelectorAll('.utb-suggestion-item');
                
                switch(e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
                        this.updateSelection(suggestions, selectedIndex);
                        break;
                        
                    case 'ArrowUp':
                        e.preventDefault();
                        selectedIndex = Math.max(selectedIndex - 1, -1);
                        this.updateSelection(suggestions, selectedIndex);
                        break;
                        
                    case 'Enter':
                        e.preventDefault();
                        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                            this.selectSuggestion(suggestions[selectedIndex].textContent);
                        } else {
                            this.performSearch(this.state.searchValue);
                        }
                        break;
                        
                    case 'Escape':
                        this.hideSuggestions();
                        selectedIndex = -1;
                        break;
                }
            });
        },
        
        // Manipulação da busca
        handleSearchInput: function(value) {
            this.state.searchValue = value;
            
            if (value.trim().length >= 2) {
                this.generateSuggestions(value);
                this.showSuggestions();
            } else {
                this.hideSuggestions();
            }
        },
        
        // Geração de sugestões
        generateSuggestions: function(query) {
            const filtered = this.config.searchSuggestions.filter(item => 
                item.toLowerCase().includes(query.toLowerCase())
            );
            
            this.state.suggestions = filtered.slice(0, 5);
            this.renderSuggestions();
        },
        
        // Renderização das sugestões
        renderSuggestions: function() {
            this.elements.suggestions.innerHTML = this.state.suggestions
                .map(suggestion => `
                    <div class="utb-suggestion-item" data-value="${suggestion}">
                        ${suggestion}
                    </div>
                `).join('');
            
            // Adicionar eventos de clique nas sugestões
            this.elements.suggestions.querySelectorAll('.utb-suggestion-item')
                .forEach(item => {
                    item.addEventListener('click', () => {
                        this.selectSuggestion(item.dataset.value);
                    });
                });
        },
        
        // Seleção de sugestão
        selectSuggestion: function(value) {
            this.elements.searchInput.value = value;
            this.state.searchValue = value;
            this.hideSuggestions();
            this.performSearch(value);
        },
        
        // Atualização da seleção visual
        updateSelection: function(suggestions, index) {
            suggestions.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
        },
        
        // Mostrar sugestões
        showSuggestions: function() {
            if (this.state.suggestions.length > 0) {
                this.elements.suggestions.style.display = 'block';
                this.state.isSearchOpen = true;
            }
        },
        
        // Esconder sugestões
        hideSuggestions: function() {
            this.elements.suggestions.style.display = 'none';
            this.state.isSearchOpen = false;
        },
        
        // Execução da busca
        performSearch: function(query) {
            if (!query.trim()) return;
            
            // Aqui você pode implementar a lógica de busca
            // Por enquanto, vamos fazer uma busca no Google restrita aos seus sites
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query + ' site:seusite.com OR site:blog.seusite.com OR site:loja.seusite.com')}`;
            
            // Abrir em nova aba
            window.open(searchUrl, '_blank');
            
            // Limpar busca
            this.elements.searchInput.value = '';
            this.state.searchValue = '';
            this.hideSuggestions();
            
            // Analytics (opcional)
            this.trackSearch(query);
        },
        
        // Tracking de navegação (opcional)
        trackNavigation: function(siteName) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'navigation', {
                    event_category: 'Universal TopBar',
                    event_label: siteName
                });
            }
        },
        
        // Tracking de busca (opcional)
        trackSearch: function(query) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'search', {
                    event_category: 'Universal TopBar',
                    event_label: query
                });
            }
        },
        
        // Método público para configuração
        configure: function(newConfig) {
            this.config = { ...this.config, ...newConfig };
            this.destroy();
            this.init();
        },
        
        // Método para destruir o componente
        destroy: function() {
            const existing = document.getElementById('universal-topbar');
            if (existing) {
                existing.remove();
            }
            
            const styles = document.getElementById('universal-topbar-styles');
            if (styles) {
                styles.remove();
            }
            
            // Remover padding do body
            document.body.style.paddingTop = '';
        }
    };
    
    // Auto-inicialização quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            UniversalTopBar.init();
        });
    } else {
        UniversalTopBar.init();
    }
    
    // Exposição global para configuração
    window.UniversalTopBar = UniversalTopBar;
    
})();