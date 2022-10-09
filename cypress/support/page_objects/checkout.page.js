class CheckoutPage {

    preencherCheckout(cupom, nome, sobrenome, empresa, endereco, numero, cidade, estado, cep, telefone, email, observacoes) {
        cy.get('.showcoupon').click()
        cy.get('#coupon_code').type(cupom)
        cy.get('.form-row-last > .button').click({ timeout: 10000 })
        cy.get('#billing_first_name').clear().type(nome)
        cy.get('#billing_last_name').clear().type(sobrenome)
        cy.get('#billing_company').clear().type(empresa)
        cy.get('#select2-billing_country-container').click().type('Brasil').get('[aria-selected="true"]').click()
        cy.get('#billing_address_1').clear().type(endereco)
        cy.get('#billing_address_2').clear().type(numero)
        cy.get('#billing_city').clear().type(cidade)
        cy.get('#select2-billing_state-container').click().type(estado + '{enter}')
        cy.get('#billing_postcode').clear().type(cep)
        cy.get('#billing_phone').clear().type(telefone)
        cy.get('#billing_email').clear().type(email)
        cy.get('#order_comments').clear().type(observacoes)
        cy.get('.wc_payment_method.payment_method_cod > label').click({ force: true })
        cy.get('#terms').check({ force: true })
        cy.get('#place_order').click()
        cy.wait(4000)
    }
}

export default new CheckoutPage()