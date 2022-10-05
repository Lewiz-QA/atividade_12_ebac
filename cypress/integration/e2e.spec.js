/// <reference types="cypress" />
import EnderecoPage from '../support/page_objects/endereco.page'

context('Exercicio - Testes End-to-end - Fluxo de pedido', () => {
    /*  Como cliente 
        Quero acessar a Loja EBAC 
        Para fazer um pedido de 4 produtos 
        Fazendo a escolha dos produtos
        Adicionando ao carrinho
        Preenchendo todas opções no checkout
        E validando minha compra ao final */

    //Considere todas as boas práticas aprendidas em aula (comandos customizados, fixtures, pages, faker, etc)

    var faker = require('faker');

    let nameFaker = faker.name.firstName()
    let lastNameFaker = faker.name.lastName()
    let companyNameFaker = faker.company.companyName()
    let phoneFaker = faker.phone.phoneNumber('41 999108-7359')
    let mailFaker = faker.internet.email()

    //Login com Fixture e comando customizado
    beforeEach(() => {
        cy.visit('minha-conta')
        cy.fixture('perfil').then(dados => {
            cy.login(dados.usuario, dados.senha)
        })
    });

    //Print das ações realizadas
    afterEach(() => {
        cy.screenshot()
    });

    it('Deve fazer um pedido na loja Ebac Shop de ponta a ponta', () => {
        cy.visit('produtos/')

        //Adicionando mais 3 Produtos da lista via Commands
        cy.addProdutos('Atlas Fitness Tank', 'XS', 'Blue', '4')
        cy.addProdutos('Argus All-Weather Tank', 'XS', 'Gray', 1)
        cy.addProdutos('Arcadio Gym Short', '32', 'Blue', 2)
        cy.addProdutos('Ajax Full-Zip Sweatshirt', 'L', 'Green', 3)
        
        //Conferindo Quantidade de Itens do Carrinho (badge do header)
        cy.get('.dropdown-toggle > .mini-cart-items').should('contain', 10)

        //Redirecionando para o Checkout
        cy.get('.dropdown-toggle > .text-skin > .icon-basket').click()
        cy.get('#cart > .dropdown-menu > .widget_shopping_cart_content > .mini_cart_content > .mini_cart_inner > .mcart-border > .buttons > .checkout').click()

        //Preenchendo Cupom no Checkout
        cy.get('.showcoupon').click()
        cy.get('#coupon_code').type('1')
        cy.get('.form-row-last > .button').click()
        cy.get('.woocommerce-message').should('contain', 'Código de cupom aplicado com sucesso.')

        //Preenchendo Checkout via PageObject
        EnderecoPage.preencherCheckout(nameFaker, lastNameFaker, companyNameFaker, 'Avenida Brasil', '3010', 'São Paulo', 'São Paulo', '84430000', phoneFaker, mailFaker, 'Favor avisar se a entrega for atrasar.')

        //Validando informações da tela Pedido Recebido, após Checkout
        cy.get('.woocommerce-notice').should('contain', 'Obrigado. Seu pedido foi recebido.')
        cy.get('strong > .woocommerce-Price-amount > bdi').should('contain', 'R$341,00')
        cy.get('.woocommerce-order-overview__payment-method > strong').should('contain', 'Pagamento na entrega')
        cy.get('address').should('contain', nameFaker, lastNameFaker, companyNameFaker, 'Avenida Brasil', '3010', 'São Paulo', 'São Paulo', '84430000', phoneFaker, mailFaker)

        //Validando informaçoes na lista de Pedidos
        cy.visit('minha-conta/orders/')
        cy.get(':nth-child(1) > .woocommerce-orders-table__cell-order-total').should('contain', 'R$341,00 de 10 itens')
        cy.get(':nth-child(1) > .woocommerce-orders-table__cell-order-status').should('contain', 'Processando')

        //Validando informaçoes do Pedido realizado
        cy.get(':nth-child(1) > .woocommerce-orders-table__cell-order-actions > .woocommerce-button').click()

        cy.get('tbody > :nth-child(1) > .woocommerce-table__product-name').should('contain', 'Atlas Fitness Tank - XS, Blue', '× 4')
        cy.get(':nth-child(2) > .woocommerce-table__product-name').should('contain', 'Argus All-Weather Tank - XS, Gray', '× 1')
        cy.get(':nth-child(3) > .woocommerce-table__product-name').should('contain', 'Arcadio Gym Short - 32, Blue', '× 2')
        cy.get(':nth-child(4) > .woocommerce-table__product-name').should('contain', 'Ajax Full-Zip Sweatshirt - L, Green', '× 3')

        cy.get(':nth-child(1) > .woocommerce-table__product-total').should('contain', 'R$72,00')
        cy.get(':nth-child(2) > .woocommerce-table__product-total').should('contain', 'R$22,00')
        cy.get(':nth-child(3) > .woocommerce-table__product-total').should('contain', 'R$40,00')
        cy.get(':nth-child(4) > .woocommerce-table__product-total').should('contain', 'R$207,00')

        cy.get(':nth-child(2) > td').should('contain', 'Pagamento na entrega')
        cy.get('address').should('contain', nameFaker, lastNameFaker, companyNameFaker, 'Avenida Brasil', '3010', 'São Paulo', 'São Paulo', '84430000', phoneFaker, mailFaker)

    });

})