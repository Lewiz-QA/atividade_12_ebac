/// <reference types="cypress" />
import CheckoutPage from '../support/page_objects/checkout.page'

context('Exercício - Testes End-to-end - Fluxo de pedido na loja Ebac Shop', () => {
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
    let mailFaker = faker.internet.email(nameFaker, lastNameFaker, 'mailtest.com.br', { allowSpecialCharacters: false })

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

    it('Deve fazer um pedido na loja Ebac Shop de ponta a ponta', () => {
        //Adicionando Produtos via Comandos Customizados, redirecionando para o Checkout no final
        cy.addProdutos('Atlas Fitness Tank', 'XS', 'Blue', 4, false)
        //cy.addProdutos('Argus All-Weather Tank', 'XS', 'Gray', 1, false)
        //cy.addProdutos('Arcadio Gym Short', '32', 'Blue', 1, false)
        //cy.addProdutos('Ajax Full-Zip Sweatshirt', 'L', 'Green', 1, true)

        //Obtendo valor do Carrinho para compará-lo depois com o valor do Pedido Recebido
        cy.get('.sub-title > .woocommerce-Price-amount > bdi').invoke('text').as('cartValue')

        //Preenchendo Checkout via PageObject, utilizando alguns dados do Faker
        CheckoutPage.preencherCheckout(1, nameFaker, lastNameFaker, companyNameFaker, 'Rua Teste', '3010', 'Campinas', 'São Paulo', '81010-110', phoneFaker, mailFaker, 'Favor entrar em contato se a entrega for atrasar.')

        //Obtendo valor do Pedido Recebido
        cy.get('strong > .woocommerce-Price-amount > bdi').invoke('text').as('checkoutValue')

        //Validando informações da tela Pedido Recebido, após concluir o Checkout
        cy.get('.woocommerce-notice').should('contain', 'Obrigado. Seu pedido foi recebido.')
        cy.get('@checkoutValue').then((checkoutValue) => {
            cy.get('@cartValue').then((cartValue) => {
                expect(cartValue).to.eq(checkoutValue)
            })
        })
    })
})
