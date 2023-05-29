/*
 * @author  Pavan sana
 */
/// <reference types="cypress" />

import { cmhcCalculator } from '../support/cmhcCalculator'

describe('Mortgage Calculator', () => {

    beforeEach(() => {
      cy.visit('/')
    })
  
    /**
	 * GIVEN A Ratehub.ca's BC CMHC calculator
	 * WHEN user want to calculate mortagage loan
	 * AND enter principal amount
	 * THEN verify the down payment calculations
   * THEN verify total mortgage calculation
	 *
	 * @author Pavan_Sana
	 * Story: https://QA-001
	 */
    it('Verify total mortgage calculation for the principal anmount less than or equal to 500000 ', () => {
      cy.log('https://QA-001')
      
      // Get random principle amount that is less than 500k
      const principleAmount = cmhcCalculator.getRandomNumberLessThan500k()
      // Enter principle amount in the asking price input box
      cmhcCalculator.enterPrincipleAmount(principleAmount)

      //using  for loop iterate through all columns and get Down payment and insurance values
      for(let i=0; i<4; i++){
        // Get the default 5%, 10%, 15% and 20% down payments from the input box 
        cmhcCalculator.getDownPaymentValue(i).then(dPayment =>{
          cy.log("Actual down payment is " + dPayment)

          //Get the CMHC insurance value
          cmhcCalculator.getCmhcValue(i).then(actualCmhcValue =>{
            cy.log("Actual CMHC insurance is " + actualCmhcValue)

            //Verify the  total mortgage is displaying correctly or not
            cmhcCalculator.verifyTotalMortgageCalculation(principleAmount,dPayment,actualCmhcValue, i)
          })
        })
      } 
    })

  /**
	 * GIVEN A Ratehub.ca's BC CMHC calculator
	 * WHEN user want to edit down payment
	 * AND enter principle amount
   * And edit down payment percentage
   * THEN verify total mortgage calculation
	 *
	 * @author Pavan_Sana
	 * Story: https://QA-002
	 */
    it('Verify Down payment values calc on editing each down payment percentages input boxs and shows correct total mortgage calculation', () => {
      cy.log('https://QA-002')

      // Get random principle amount that is less than 500k
      const principleAmount = cmhcCalculator.getRandomNumberLessThan500k()
      // Enter principle amount in the asking price input box
      cmhcCalculator.enterPrincipleAmount(principleAmount)

      //using  for loop iterate through all columns and get Down payment and insurance values
      for(let i=0; i<4; i++){
        const percentages = cmhcCalculator.getfiveRandomPercents()
        for (let j=0; j< percentages.length; j++){
          cmhcCalculator.enterDownPaymentPercent(i, percentages[j])
          cmhcCalculator.verifyDownPaymentValueCalculation(percentages[j], principleAmount, i)

          cmhcCalculator.getDownPaymentValue(i).then(dPayment =>{
            cy.log("Actual down payment is " + dPayment)

            //Get the CMHC insurance value
            cmhcCalculator.getCmhcValue(i).then(actualCmhcValue =>{
              cy.log("Actual CMHC insurance is " + actualCmhcValue)

              //Verify the  total mortgage is displaying correctly or not
              cmhcCalculator.verifyTotalMortgageCalculation(principleAmount,dPayment,actualCmhcValue, i)
            })
          })
        }
      } 
    })


  /**
	 * GIVEN A Ratehub.ca's BC CMHC calculator
	 * WHEN user want check insurance value
	 * AND enter principal amount
   * And edit down payment percentage
	 * THEN verify the CMHC insurance value
   * THEN verify total mortgage calculation
	 *
	 * @author Pavan_Sana
	 * Story: https://QA-003
	 */
    it('Verify CMHC values withrespect to the Down Payment percentages and shows correct insurance and total mortgage calculation', () => {
      cy.log('https://QA-003')

      // Get random principle amount that is less than 500k
      const principleAmount = cmhcCalculator.getRandomNumberLessThan500k()
      // Enter principle amount in the asking price input box
      cmhcCalculator.enterPrincipleAmount(principleAmount)

      //using  for loop iterate through all columns and get Down payment and insurance values
      for(let i=0; i<4; i++){
        const percentages = cmhcCalculator.getRandomFiveCmhcPercents()
        cy.log(percentages)

        // Using for loop iterate with different down payment percentages
        for (let j=0; j< percentages.length; j++){
          cmhcCalculator.enterDownPaymentPercent(i, percentages[j])

          //Verify CMHC insurance values are matching with the limits given with respect to the downpayment percentages
          cmhcCalculator.verifyCmhcCalculation(percentages[j], principleAmount, i)

          cmhcCalculator.getDownPaymentValue(i).then(dPayment =>{
            cy.log("Actual down payment is " + dPayment)
            
            //Get the CMHC insurance value
            cmhcCalculator.getCmhcValue(i).then(actualCmhcValue =>{
              cy.log("Actual CMHC insurance is " + actualCmhcValue)

              //Verify the  total mortgage is displaying correctly or not
              cmhcCalculator.verifyTotalMortgageCalculation(principleAmount,dPayment,actualCmhcValue, i)
            })
          })
        }
      } 
    })


  /**
	 * GIVEN A Ratehub.ca's BC CMHC calculator
	 * WHEN principal amount is greater than 500k and less than 1 million user wants to check min downpayment 
	 * AND enter principal amount
	 * THEN verify the down payment percentage
   * THEN verify total mortgage calculation
	 *
	 * @author Pavan_Sana
	 * Story: https://QA-004
	 */
    it('Verify if the prinicple amount is b/w 500k and 1 million, the minimum downpayment is calculated as per new rule', () => {
      cy.log('https://QA-004')

      // Get random principle amount that is between 500k and 1 million
      const principleAmount = cmhcCalculator.getRandomNumberBtw500kAnd1Million()
      // Enter principle amount in the asking price input box
      cmhcCalculator.enterPrincipleAmount(principleAmount)

      const expectedDownPayment = cmhcCalculator.calculateMinDownPaymentPercent(principleAmount)
      cmhcCalculator.getMinDownPaymentPercent(0).then(actualDpayment =>{

        //Verify minimum down payment percent is displaying as per the new calculations
        //The new minimum down payment is 5% of the first $500,000, and 10% of any amount over $500,000
        expect(expectedDownPayment, "verifying minimum down payment").to.equal(actualDpayment)

        cmhcCalculator.getDownPaymentValue(0).then(dPayment =>{
          cy.log("Actual down payment is " + dPayment)
          
          //Get the CMHC insurance value
          cmhcCalculator.getCmhcValue(0).then(actualCmhcValue =>{
            cy.log("Actual CMHC insurance is " + actualCmhcValue)

            //Verify the  total mortgage is displaying correctly or not
            cmhcCalculator.verifyTotalMortgageCalculation(principleAmount,dPayment,actualCmhcValue, 0)
          })
        })
      })
    })

  /**
	 * GIVEN A Ratehub.ca's BC CMHC calculator
	 * WHEN principle amount is greater than 1 million user wants to check min downpayment 
	 * AND enter principal amount
	 * THEN verify the down payment percentage
   * AND edit the down payment to less than 20%
   * THEN verify the down payment percentage
	 *
	 * @author Pavan_Sana
	 * Story: https://QA-005
	 */
    it('Verify if the prinicple amount is greater than 1 million, the minimum downpayment is 20% and does not allow to enter less and zero insurance', () => {
      cy.log('https://QA-005')

      // Get random principle amount that is greater than 1 million
      const principleAmount = cmhcCalculator.getRandomNumberBtw1millionAnd100Million()
      // Enter principle amount in the asking price input box
      cmhcCalculator.enterPrincipleAmount(principleAmount)
      for(let i=0; i<4; i++){
        cmhcCalculator.getMinDownPaymentPercent(i).then(actualDpayment =>{

          // Verify the default down payment percent is greater than 19
          expect(parseInt(actualDpayment)).be.greaterThan(19)

          //Verify entering percentage less than 20 will not save
          cmhcCalculator.enterDownPaymentPercent(i, 5)
          cmhcCalculator.clickOnOutside()
          expect(parseInt(actualDpayment)).be.greaterThan(19)
        })
        cmhcCalculator.clickOnOutside()
        cy.wait(1000)
        cmhcCalculator.getCmhcValue(i).then(actualCmhcValue =>{
          // Verify if the P.A is greater than 1 million the CMHC insurance is zero
          cy.log("Actual CMHC insurance is " + actualCmhcValue)
          expect(parseInt(actualCmhcValue)).be.equal(0)

          cmhcCalculator.getDownPaymentValue(i).then(dPayment =>{
            cy.log("Actual down payment is " + dPayment)

          //Verify the  total mortgage is displaying correctly or not
          cmhcCalculator.verifyTotalMortgageCalculation(principleAmount,dPayment,0, i)
          })
        })
      }
    })


  /**
	 * GIVEN A Ratehub.ca's BC CMHC calculator
	 * WHEN user didn't enter principle amount
	 * AND click out side of input box
	 * THEN verify the error message
   * AND enter principal amount greater than 1 million
   * THEN verify the error message
	 *
	 * @author Pavan_Sana
	 * Story: https://QA-006
	 */
    it('Verify error messages', () => {
      cy.log('https://QA-006')

      cmhcCalculator.clickOnAskPriceInputBox()
      cmhcCalculator.clickOnOutside()
      //Verify the error message displayed when nothing entered in the input box
      cmhcCalculator.verifyEnterWholeNumberErrorMsg()

      cmhcCalculator.enterPrincipleAmount(100000000)
      //Verify the error message displayed when the number is greater than or equal to 1 million
      cmhcCalculator.verifyNumberLimitErrorMsg()
    })

  /**
	 * GIVEN A Ratehub.ca's BC CMHC calculator
	 * WHEN user wants to know about Down Payment and CMHC insurance rules
	 * AND click on down payment tool tip
	 * THEN verify the tool tip message
   * AND click on CMHC insurance tool tip
	 * THEN verify the tool tip message
	 *
	 * @author Pavan_Sana
	 * Story: https://QA-007
	 */
    
    it('Verify tool tips', () => {
      cy.log('https://QA-007')

      //Click on Down payment the tool tip
      cmhcCalculator.clickOnDownPaymentToolTip()

      //verify Down payment first point message
      cmhcCalculator.verifyDownPaymentToolTipFirstPoint()

      //verify Down payment second point message
      cmhcCalculator.verifyDownPaymentToolTipSecondPoint()

      //Verify Down payment Third point message
      cmhcCalculator.verifyDownPaymentToolTipThirdPoint()

      //Click outside to close the Down payment tool tip
      cmhcCalculator.clickOnOutside()

      //Click on CMHC insurance tool tip
      cmhcCalculator.clickOnCmhcToolTip()

      // Verify CMHC insurance tool tip message
      cmhcCalculator.verifyCmhcToolTipMsg()
    })

  })
  