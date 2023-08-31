import React from "react";
import {useState, useEffect, useCallback} from "react";
import * as constants from "./constants";
import {openDatabase, addItem, getAllItems} from "./persistence";

export default function CostsApplication() {
    const [name, setName] = useState('');
    const [sum, setSum] = useState();
    const [category, setCategory] = useState('FOOD');
    const [month, setMonth] = useState(0);
    const [year, setYear] = useState(new Date().getFullYear());
    const [description, setDescription] = useState('');
    const [isValid, setIsValid] = useState(false);

    const [yearFilter, setYearFilter] = useState(-1);
    const [monthFilter, setMonthFilter] = useState(-1);

    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);


    const handleFilteredItems = useCallback(() => {
        let tempItems = [...items];

        if (yearFilter !== -1) {
            tempItems = tempItems.filter(x => x.year === yearFilter);
        }

        if (monthFilter !== -1) {
            tempItems = tempItems.filter(x => x.month === monthFilter);
        }

        setFilteredItems(tempItems);
    }, [items, monthFilter, yearFilter]);

    useEffect(() => {
        handleFilteredItems();
    }, [handleFilteredItems, items]);

    useEffect(() => {
        handleFilteredItems();
    }, [handleFilteredItems, yearFilter, monthFilter]);


    useEffect(() => {
        async function fetchData() {
            const db = await openDatabase();
            const costItems = await getAllItems(db);
            setItems(costItems);
            setFilteredItems(costItems);
        }

        fetchData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const db = await openDatabase();
        const item = {
            name,
            sum,
            category,
            month,
            year,
            description
        };

        await addItem(db, item);

        const costItems = await getAllItems(db);
        setItems(costItems);
        resetForm();
    }


    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
    }

    const handleSumChange = (e) => {
        const value = e.target.value;
        setSum(Number(value));
    }

    const resetForm = () => {
        setName('');
        setSum();
        setCategory('FOOD');
        setMonth(0);
        setYear(new Date().getFullYear());
        setDescription('');
        setIsValid(false);
    }

    const isFormValid = useCallback(() => {
        return name !== undefined && name !== null && name.trim() !== "" && sum !== null && sum !== undefined && !isNaN(sum) && Number(sum) > 0;
    }, [name, sum]);

    useEffect(() => {
        const isValid = isFormValid();
        setIsValid(isValid);
    }, [isFormValid, sum, name]);

    return (<div className="flex mt-10">
        <div className="w-[300px] border rounded p-4">
            <h1 className="mb-[30px] text-center text-lg add-item-color">Add new item:</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-[20px] flex justify-between">
                    <label className="text-purple-100">Name:</label>
                    <input className="w-[180px] pl-[4px]"
                           value={name}
                           onChange={handleNameChange}
                    />
                </div>
                <div className="mb-[20px] flex justify-between">
                    <label className="text-purple-100">Category:</label>
                    <select className="w-[180px] pl-[4px]" onChange={e => setCategory(e.target.value)}>
                        {constants.CATEGORIES.map((categoryItem, index) => <option key={index}
                                                                                   value={categoryItem}>{categoryItem}</option>)}
                    </select>
                </div>
                <div className="mb-[20px] flex justify-between">
                    <label className="text-purple-100">Month:</label>
                    <select className="w-[180px] pl-[4px]" onChange={e => setMonth(Number(e.target.value))}>
                        {constants.MONTHS.map((monthItem, index) => <option key={index}
                                                                            value={monthItem.value}>{monthItem.key}</option>)}
                    </select>
                </div>
                <div className="mb-[20px] flex justify-between">
                    <label className="text-purple-100">Year:</label>
                    <select className="w-[180px] pl-[4px]" onChange={e => setYear(Number(e.target.value))}>
                        {constants.YEARS.map((yearItem, index) => <option key={index}
                                                                          value={yearItem}>{yearItem}</option>)}
                    </select>
                </div>
                <div className="mb-[20px] flex justify-between">
                    <label className="text-purple-100">Sum:</label>
                    <input
                        className="w-[180px] pl-[4px]"
                        type="number"
                        value={!sum ? "" : sum}
                        onChange={handleSumChange}
                    />
                </div>
                <div className="mb-[20px]">
                    <label className="text-purple-100">Description:</label>
                    <textarea className="block w-full mt-[10px]" value={description}
                              onChange={e => setDescription(e.target.value)}/>
                </div>
                <input disabled={!isValid}
                       className={"justify-center border w-full rounded text-white bg-purple-600 " + (isValid ? "bg-purple-600" : "bg-slate-500")}
                       type="submit" value="Submit"/>
            </form>
        </div>
        <div className="flex-1 ml-20 px-20 py-2 border rounded">
            <h1 className="mb-[30px] text-center text-lg add-item-color">List view:</h1>
            <div className="flex">

                <select className="w-[180px] pl-[4px] mr-10" onChange={e => setYearFilter(Number(e.target.value))}>
                    <option value={-1}>All</option>
                    {constants.YEARS.map((yearItem, index) => <option key={index}
                                                                      value={yearItem}>{yearItem}</option>)}
                </select>

                <select className="w-[180px] pl-[4px]" onChange={e => setMonthFilter(Number(e.target.value))}>
                    <option value={-1}>All</option>
                    {constants.MONTHS.map((monthItem, index) => <option key={index}
                                                                        value={monthItem.value}>{monthItem.key}</option>)}
                </select>
            </div>
            <div>
                <div className="p-2 mt-10 text-purple-100 border grid gap-4 grid-cols-6">
                    <span>Name:</span>
                    <span>Category:</span>
                    <span>Month:</span>
                    <span>Year:</span>
                    <span>Sum:</span>
                    <span>Description:</span>
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                    {filteredItems.map(item =>
                        <div className="p-2 text-purple-300 border grid gap-4 grid-cols-6">
                            <span>{item.name}</span>
                            <span>{item.category}</span>
                            <span>{constants.MONTHS.find(x => x.value === item.month).key}</span>
                            <span>{item.year}</span>
                            <span>{item.sum}$</span>
                            <span className="break-all">{item.description}</span>
                        </div>)}
                </div>
            </div>
        </div>
    </div>)
}