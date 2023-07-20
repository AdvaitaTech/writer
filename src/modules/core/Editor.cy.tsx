import React from 'react'
import Editor from './Editor'

describe('<Editor />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Editor />)
  })
})