/**
 * Configuração da Barra Superior Universal
 * Customize este arquivo de acordo com seus produtos/sites
 */

// Configuração personalizada (opcional)
if (typeof UniversalTopBar !== 'undefined') {
    UniversalTopBar.configure({
        // Seus sites/produtos
        sites: [
            {
                name: 'Home',
                url: 'https://seudominio.com',
                icon: '🏠'
            },
            {
                name: 'Blog',
                url: 'https://blog.seudominio.com',
                icon: '📝'
            },
            {
                name: 'Loja',
                url: 'https://loja.seudominio.com',
                icon: '🛒'
            },
            {
                name: 'Dashboard',
                url: 'https://app.seudominio.com',
                icon: '📊'
            },
            {
                name: 'Suporte',
                url: 'https://suporte.seudominio.com',
                icon: '🆘'
            },
            {
                name: 'Docs',
                url: 'https://docs.seudominio.com',
                icon: '📚'
            }
        ],
        
        // Sugestões de busca personalizadas
        searchSuggestions: [
            'Produtos',
            'Preços',
            'Planos',
            'Tutoriais',
            'API',
            'Integração',
            'Suporte',
            'Contato',
            'Sobre',
            'Blog',
            'Novidades',
            'Downloads'
        ],
        
        // Personalização visual
        theme: {
            backgroundColor: 'rgba(45, 55, 72, 0.95)', // Azul escuro
            textColor: '#ffffff',
            hoverColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '6px',
            fontSize: '14px',
            height: '55px'
        }
    });
}