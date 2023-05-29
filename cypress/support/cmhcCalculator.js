export class CmhcCalculator {
    enterPrincipleAmount(amount){
        cy.get('#askingPrice').type(amount)
    }

    // this function returns a random number between 1 and 500000(inclusive
    getRandomNumberLessThan500k() {
        return Math.floor(Math.random() * 500000) + 1;
    }
     
    // this function returns a random number between 500000 and 1000000(exclusive)
    getRandomNumberBtw500kAnd1Million() {
        return Math.floor(Math.random() * 499999) + 500001;
    }

    // this function returns a random number between 1 million (inclusive) and less than 100 million.
    getRandomNumberBtw1millionAnd100Million() {
        return Math.floor(Math.random() * 99000000) + 1000000;
    }

    enterDownPaymentPercent(columnNumber, percent){
        cy.get(`[id='scenarios[${columnNumber}].downPaymentPercent']`).clear().type(percent)
    }

    calculateMinDownPaymentPercent(amount) {
        if (amount <= 500000) {
          return 5.0; // 5% down payment for homes priced at or below $500,000
        } else if(amount > 500000 && amount < 1000000) {
            
        //The new minimum down payment is 5% of the first $500,000, and 10% of any amount over $500,000
          const downPayment = ((25000+((amount - 500000) * 0.1)) / amount) * 100; // 5% on the first $500,000, 10% on any amount over $500,000
          const rounded =  Math.ceil(downPayment * 10) / 10; // Round to the nearest tenth
          return rounded.toFixed(1); // Format the rounded value with one decimal place
        } else if(amount>= 1000000){
            return 20.0
        }
      }

    getMinDownPaymentPercent(columnNumber){
       return cy.get(`[id="scenarios[${columnNumber}].downPaymentPercent"]`).invoke('val').then((text) => {
            const dPayment = text.replace("%", '');
            return dPayment
        })
    }

    calculateDownPaymentValue(percent, amount){
        return (amount * percent) / 100
    }

    getDownPaymentValue(columnNumber) { 
        const loc = `[id='scenarios[${columnNumber}].downPaymentDollars']`;
        return cy.get(loc).invoke('val').then((text) =>{
            const dPayment = text.replace(/[$,]/g, '');
            const value = parseInt(dPayment, 10);
            return value;
        });
      }
      

    verifyMinDownPaymentValueCalculation(downPayment){
        cy.get('[id-"scenarios[0].downPaymentDollars"]').invoke('value').then(val =>{
            const cleanedStr = val.replace(/[$,]/g, '')
            const value = parseInt(cleanedStr, 10)
            expect(value,'verifying downpayment calculation ').to.equal(downPayment)
        })
    }
    verifyDownPaymentValueCalculation(percent, principalAmount, columnNumber){
        const expectedValue = this.calculateDownPaymentValue(percent, principalAmount)
        this.getDownPaymentValue(columnNumber).then(actualValue =>{
            cy.log("Actual down payment is " + actualValue)

            // Round off the value to next whole number to match with the design
            const roundedValue = Math.ceil(expectedValue);
            expect(actualValue,'verifying downpayment calculation ').to.equal(roundedValue)
        })
     
    }

    getfiveRandomPercents(){
        const numbers = []
        for (let i = 0; i < 5; i++) {
            const randomNum = Math.floor(Math.random() * 96) + 5;
            numbers.push(randomNum)
        }
        return numbers
    }
    getRandomOneDecimalPercentageInRange(min, max) {
        const randomNumber = Math.random() * (max - min) + min;
        const randomPercent = Math.floor(randomNumber * 10) / 10;
        return randomPercent.toFixed(1);
      }
      
    getRandomFiveCmhcPercents() {
        const percents = [];
      
        percents.push(this.getRandomOneDecimalPercentageInRange(5, 9.9));
        percents.push(this.getRandomOneDecimalPercentageInRange(10, 14.9));
        percents.push(this.getRandomOneDecimalPercentageInRange(15, 19.9));
        percents.push(this.getRandomOneDecimalPercentageInRange(20, 100));
      
        for (let i = 4; i < 5; i++) {
          const randomPercent = this.getRandomOneDecimalPercentageInRange(5, 100);
          percents.push(randomPercent);
        }
      
        return percents;
      }
      
    calculateInsuranceValue(percentage, principalAmount) {
        const mortgage = principalAmount - (principalAmount*percentage/100)
        if (percentage >= 5 && percentage <= 9.99) {
          return (4 / 100) * mortgage;
        } else if (percentage >= 10 && percentage <= 14.99) {
          return (3.10 / 100) * mortgage;
        } else if (percentage >= 15 && percentage <= 19.99) {
          return (2.80 / 100) * mortgage;
        } else if (percentage > 20) {
          return 0;
        } else {
          return 'Percentage is not within the specified ranges.';
        }
    }

    getCmhcValue(columnNumber){
        var loc = "[data-name='cmhcInsurance-col-" + columnNumber + "']"
        return cy.get(loc).invoke('text').then(val =>{
        const cleanedStr = val.replace(/[$,]/g, '')
        const value = parseInt(cleanedStr, 10)
        return value
        })
    }

    verifyCmhcCalculation(percent,principalAmount, columnNumber){

        // Round off the value to nearest whole number to match with the design
        const expectedValue = Math.round(this.calculateInsuranceValue(percent, principalAmount))
        this.getCmhcValue(columnNumber).then(actualValue =>{
        expect(actualValue,'verifying insurance calculation ').to.equal(expectedValue)
        })
    }
    

    verifyTotalMortgageCalculation(principalAmount, downPayment, cmhcInsurance, columnNumber){
    
        const expectedValue = principalAmount - downPayment + cmhcInsurance

        var loc = "[data-name='totalMortgage-col-" + columnNumber + "']"
        cy.get(loc).invoke('text').then(val =>{
        const cleanedStr = val.replace(/[$,]/g, '')
        const actualValue = parseInt(cleanedStr, 10)
        expect(actualValue,'verifying Total Mortgage calculation').to.equal(expectedValue)
        })
    }

    clickOnOutside(){
        cy.contains('Down payment').dblclick()
    }

    clickOnAskPriceInputBox(){
        cy.get('#askingPrice').click()
    }

    verifyEnterWholeNumberErrorMsg(){
        cy.get('.topContainer').within(error =>{
            //Verify the error message displayed when nothing entered in the input box
            cy.wrap(error).should('contain', 'Please enter a whole number')
          })
    }
    verifyNumberLimitErrorMsg(){
        cy.get('.topContainer').within(error =>{
            //Verify the error message displayed when the number is greater than or equal to 1 million
            cy.wrap(error).should('contain', 'Number must be less than 100 million')
          })
    }
    clickOnDownPaymentToolTip(){
        cy.contains('Down payment').parent('div').find('.tooltip').click()
    }

    verifyDownPaymentToolTipFirstPoint(){
        
            cy.fixture('/toolTipMessages.json').then(data =>{
               const msg = data.downPayment.firstPoint
            cy.contains(msg).should('be.visible')
            })      
    }

    verifyDownPaymentToolTipSecondPoint(){
        cy.fixture('/toolTipMessages.json').then(data =>{
           const msg = data.downPayment.secondPoint
        cy.contains(msg).should('be.visible')
        })
    }

    verifyDownPaymentToolTipThirdPoint(){
        cy.fixture('/toolTipMessages.json').then(data =>{
           const msg = data.downPayment.thirdPoint
        cy.contains(msg).should('be.visible')
        })
    }

    clickOnCmhcToolTip(){
        cy.get ('.question-mark-icon').eq(1).click()
    }

    verifyCmhcToolTipMsg(){
        cy.fixture('/toolTipMessages.json').then(data =>{
           const msg = data.cmhcInsurance
        cy.contains(msg).should('be.visible')
        })
    }
      
}

export const cmhcCalculator = new CmhcCalculator();

