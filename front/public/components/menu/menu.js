// Função para carregar o menu a partir de um arquivo HTML
import { loadJS } from '/assets/js/helpers.js';

export const loadMenu = async (containerMenuId, tipo = 'default') => {
    try {
        // Verificar se a rota atual é a página de login
        if (window.location.pathname === '/page/login.html') {
            const container = document.getElementById(containerMenuId);
            if (container) {
                container.style.display = 'none'; // Esconde o menu
            }
            console.log('Menu ocultado na página de login.');
            return; // Não carregar o menu
        }

        const response = await fetch(`/components/menu/menu-${tipo}.html`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar o menu: ${response.statusText}`);
        }

        const menu = await response.text();
        const container = document.getElementById(containerMenuId);
        if (!container) {
            throw new Error(`Elemento com ID "${containerMenuId}" não encontrado.`);
        }

        container.innerHTML = menu;
        loadJS(containerMenuId); // Carrega os scripts do menu
    } catch (error) {
        console.error('Erro ao carregar o menu:', error);
    }
};