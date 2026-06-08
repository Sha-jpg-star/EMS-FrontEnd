"use client";
import { createContext, useContext, useState } from "react";

const PayrollContext = createContext<any>(null);

export const PayrollProvider = ({ children }: { children: React.ReactNode }) => {
  const [payrollData, setPayrollData] = useState<any[]>([]);
  return (
    <PayrollContext.Provider value={{ payrollData, setPayrollData }}>
      {children}
    </PayrollContext.Provider>
  );
};
export const usePayroll = () => useContext(PayrollContext);