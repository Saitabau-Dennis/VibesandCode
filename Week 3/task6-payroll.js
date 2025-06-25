// Task 6: Payroll Calculation
class Payroll {
  calculateEmployeePay(baseSalary, hoursWorked) {
    const regularHours = Math.min(hoursWorked, 40);
    const overtimeHours = Math.max(hoursWorked - 40, 0);
    const hourlyRate = baseSalary / 40; // Assuming base salary is for 40 hours

    // Calculate gross pay
    const regularPay = regularHours * hourlyRate;
    const overtimePay = overtimeHours * hourlyRate * 1.5;
    const grossPay = regularPay + overtimePay;

    // Apply progressive tax
    let incomeTax = 0;
    if (grossPay <= 500) {
      incomeTax = grossPay * 0.1;
    } else if (grossPay <= 1000) {
      incomeTax = 500 * 0.1 + (grossPay - 500) * 0.2;
    } else {
      incomeTax = 500 * 0.1 + 500 * 0.2 + (grossPay - 1000) * 0.3;
    }

    // Social security deduction
    const socialSecurity = grossPay * 0.062;

    // Net pay
    const netPay = grossPay - incomeTax - socialSecurity;

    return {
      regularHours,
      overtimeHours,
      hourlyRate: Math.round(hourlyRate * 100) / 100,
      regularPay: Math.round(regularPay * 100) / 100,
      overtimePay: Math.round(overtimePay * 100) / 100,
      grossPay: Math.round(grossPay * 100) / 100,
      incomeTax: Math.round(incomeTax * 100) / 100,
      socialSecurity: Math.round(socialSecurity * 100) / 100,
      netPay: Math.round(netPay * 100) / 100,
    };
  }
}

// Test the payroll
console.log("6. Payroll:");
const payroll = new Payroll();
const payInfo = payroll.calculateEmployeePay(800, 45);
console.log(payInfo);
