/// <reference types="cypress" />
import CheckoutPage from '../support/page_objects/checkout.page'

describe('Exercício - Testes End-to-end - Fluxo de pedido na loja Ebac Shop', () => {
    /*  Como cliente 
        Quero acessar a Loja EBAC 
        Para fazer um pedido de 4 produtos 
        Fazendo a escolha dos produtos
        Adicionando ao carrinho
        Preenchendo todas opções no checkout
        E validando minha compra ao final */

    //Considere todas as boas práticas aprendidas em aula (comandos customizados, fixtures, pages, faker, etc)

    var faker = require('faker');

    //Login com Fixture e comando customizado
    beforeEach(() => {
        cy.fixture('perfil').then(dados => {
            cy.login(dados.usuario, dados.senha)
        })
    });

    //Print das ações realizadas
    afterEach(() => {
        cy.screenshot()
    });

    it('Deve adicionar produtos ao Carrinho', () => {
        //Adicionando Produtos via Comandos Customizados, redirecionando para o Checkout no final
        cy.addProdutos('Atlas Fitness Tank', 'XS', 'Blue', 4)
        cy.addProdutos('Argus All-Weather Tank', 'XS', 'Gray', 1)
        cy.addProdutos('Arcadio Gym Short', '32', 'Blue', 1)
        cy.addProdutos('Ajax Full-Zip Sweatshirt', 'L', 'Green', 1)
    });

    it('Deve realizar o Checkout', () => {
        let nameFaker = faker.name.firstName()
        let lastNameFaker = faker.name.lastName()
        let companyNameFaker = faker.company.companyName()
        let phoneFaker = faker.phone.phoneNumber('41 999108-7359')
        let mailFaker = faker.internet.email(nameFaker, lastNameFaker, 'mailtest.com.br', { allowSpecialCharacters: false })

        //Redirecionando para o Checkout
        cy.irParaCheckout()

        //Preenchendo Checkout via PageObject, utilizando alguns dados do Faker
        CheckoutPage.preencherCheckout(1, nameFaker, lastNameFaker, companyNameFaker, 'Avenida Brasil', '3010', 'Campinas', 'São Paulo', '81010-110', phoneFaker, mailFaker, 'Favor entrar em contato se a entrega for atrasar.')

        //Validando informações da tela Pedido Recebido, após concluir o Checkout
        cy.get('.woocommerce-notice').should('contain', 'Obrigado. Seu pedido foi recebido.')
        cy.get('tbody > :nth-child(1) > .woocommerce-table__product-name').should('contain', 'Atlas Fitness Tank - XS, Blue', 'x 4')
        cy.get(':nth-child(2) > .woocommerce-table__product-name').should('contain', 'Argus All-Weather Tank - XS, Gray', 'x 1')
        cy.get(':nth-child(3) > .woocommerce-table__product-name').should('contain', 'Arcadio Gym Short - 32, Blue', 'x 1')
        cy.get(':nth-child(4) > .woocommerce-table__product-name').should('contain', 'Ajax Full-Zip Sweatshirt - L, Green', 'x 1')
        cy.get('strong > .woocommerce-Price-amount > bdi').should('contain', 'R$183,00')
        cy.get('.woocommerce-order-overview__payment-method > strong').should('contain', 'Pagamento na entrega')
        cy.get('address').should('contain', nameFaker, lastNameFaker, companyNameFaker, 'Avenida Brasil', '3010', 'São Paulo', 'São Paulo', '84430000', phoneFaker, mailFaker)
    });
});