import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';

const BASE_URL = "http://localhost:5000/api/v1";
const GlobalContext = React.createContext();

//calulation of Income

const addIncomeAPI = async (incomeData, setIncomes, setError) => {
    try {
        const response = await axios.post(`${BASE_URL}/add-income`, incomeData);
        setIncomes(prevIncomes => [...prevIncomes, incomeData]);
        await getIncomes(setIncomes);
    } catch (err) {
        console.error("Error adding income:", err);
        setError(err.response?.data?.message || "Error occurred while adding income");
    }
}

export const getIncomes = async (setIncomes) => {
    const response = await axios.get(`${BASE_URL}/get-income`)
    setIncomes(response.data)
    console.log(response.data)
}

const deleteIncomeAPI = async (id, setIncomes, setError) => {
    try {
        await axios.delete(`${BASE_URL}/delete-income/${id}`);
        await getIncomes(setIncomes);
        setIncomes(prevIncomes => prevIncomes.filter(income => income._id !== id));
    } catch (err) {
        console.error("Error deleting income:", err);
        setError(err.response?.data?.message || "Error occurred while deleting income");
    }
};

const totalIncome = (incomes) => {
    if (!incomes || incomes.length === 0) return 0; 

    return incomes.reduce((total, income) => {
        const amount = Number(income.amount);
        if (!isNaN(amount)) {
            return total + amount; 
        }
        return total; 
    }, 0);
};

//calculation of expense

const addExpensesAPI = async (expenseData, setExpenses, setError) => {
    try {
        const response = await axios.post(`${BASE_URL}/add-expense`, expenseData);
        setExpenses(prevExpenses => [...prevExpenses, expenseData]);
        await getExpenses(setExpenses);
    } catch (err) {
        console.error("Error adding Expense:", err);
        setError(err.response?.data?.message || "Error occurred while adding Expense");
    }
}

const totalExpenses = (expenses) => {
    if (!expenses || expenses.length === 0) return 0; 

    return expenses.reduce((total, Expense) => {
        const amount = Number(Expense.amount);
        if (!isNaN(amount)) {
            return total + amount; 
        }
        return total; 
    }, 0);
};

export const getExpenses = async (setExpenses) => {
    const response = await axios.get(`${BASE_URL}/get-expense`)
    setExpenses(response.data)
    console.log(response.data)
}

const deleteExpensesAPI = async (id, setExpenses, setError) => {
    try {
        await axios.delete(`${BASE_URL}/delete-expense/${id}`);
        await getExpenses(setExpenses);
        setExpenses(prevExpenses => prevExpenses.filter(Expense => Expense._id !== id));
    } catch (err) {
        console.error("Error deleting expense:", err);
        setError(err.response?.data?.message || "Error occurred while deleting expense");
    }
};

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    const addIncome = (incomeData) => addIncomeAPI(incomeData, setIncomes, setError);
    const deleteIncome = (id) => deleteIncomeAPI(id, setIncomes, setError);
    const fetchIncomes = () => getIncomes(setIncomes);

    const addExpense = (expenseData) => addExpensesAPI(expenseData, setExpenses, setError);
    const deleteExpense = (id) => deleteExpensesAPI(id, setExpenses, setError);
    const fetchExpense = () => getExpenses(setExpenses);

    useEffect(() =>{
        fetchIncomes();
    },[]);

    useEffect(() =>{
        fetchExpense();
    },[]);

    return (
        <GlobalContext.Provider value={{ 
            incomes,
            addIncome, 
            getIncomes,
            deleteIncome,
            totalIncome,
            fetchIncomes,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            fetchExpense
             }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};

export default GlobalContext;
