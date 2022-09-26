/// <reference types="cypress" />

context('Exercicio - Testes End-to-end - Fluxo de pedido', () => {
    /*  Como cliente 
        Quero acessar a Loja EBAC 
        Para fazer um pedido de 4 produtos 
        Fazendo a escolha dos produtos
        Adicionando ao carrinho
        Preenchendo todas opções no checkout
        E validando minha compra ao final */

    //Considere todas as boas práticas aprendidas em aula ( comandos customizados, fixtures, pages, faker, etc


    var faker = require('faker');


    beforeEach(() => {
        cy.visit('minha-conta')
        cy.fixture('perfil').then(dados => {
            cy.login(dados.usuario, dados.senha)
        })
    });

    afterEach(() => {
        cy.screenshot()
    });

    it('Deve fazer um pedido na loja Ebac Shop de ponta a ponta', () => {
        cy.visit('produtos/')



        //Adicionando Produto "Atlas Fitness Tank" através do QuickView da lista
        /*cy.get('[class="groups-button clearfix"]')
            .contains('[class="add-cart tbay-tooltip"]', 'Atlas Fitness Tank')
            .realHover()
            .children('[class="button yith-wcqv-button tbay-tooltip"]')
            .should('not.be.hidden')
            .click()
        cy.get('.button-variable-item-XS').click()
        cy.get(':nth-child(2) > .value > .variable-items-wrapper > .variable-item').click()
        cy.get('.input-text').clear().type('4')
        cy.get('.single_add_to_cart_button').click()
        cy.get('.woocommerce-message').should('contain', '4 × “Atlas Fitness Tank” foram adicionados no seu carrinho.')*/

        cy.get('.post-3680 > .product-block > .block-inner > .image > .groups-button')
            .children('[class="button yith-wcqv-button tbay-tooltip"]')
            .realHover()
            .should('not.be.hidden')
            .click()
            cy.get('.button-variable-item-XS').click()
            cy.get(':nth-child(2) > .value > .variable-items-wrapper > .variable-item').click()
            cy.get('.input-text').clear().type('4')
            cy.get('.single_add_to_cart_button').click()
            cy.get('.woocommerce-message').should('contain', '4 × “Atlas Fitness Tank” foram adicionados no seu carrinho.')

        //Adicionando Produtos da lista via Commands
        cy.addProdutos('Argus All-Weather Tank', 'M', 'Gray', 1)
        cy.addProdutos('Arcadio Gym Short', '32', 'Blue', 2)
        cy.addProdutos('Ajax Full-Zip Sweatshirt', 'L', 'Green', 3)
    });


})