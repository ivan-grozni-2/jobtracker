import React, { useState, useEffect } from "react";

export default function FilterBar(params) {
    const [local, setLocal] = useState(params.filters)
    const [hid, setHid] = useState(true)

    useEffect(() => {
        setLocal(params.filters);
    }, [params.filters]);

    function handleInput(e) {
        const { name, value } = e.target;
        setLocal(prev => ({ ...prev, [name]: value }));
    }

    function applyFilters() {
        params.onChange(local);
    }

    return (
        <div className="filters">

            <div className="inputcontainer filter search">
                <input
                    className="input"
                    type="search"
                    name="search"
                    value={local.search}
                    onChange={handleInput}
                />
                <button className="secondary" onClick={() => params.onReset({search:local.search})}>🔍</button>
            </div>

            <button id="filter-toggle" className="secondary" onClick={() => setHid(prev => (!prev))}>filter</button>

            <div className={"filter-bar " + (hid ? 'hide' : '')}>
                <div className="inputcontainer filter">

                    <select name="status" className="input" value={local.status} onChange={handleInput} >
                        <option value="" >All</option>
                        <option value="applied" >Applied</option>
                        <option value="hired" >Hired</option>
                        <option value="rejected" >Rejected</option>
                        <option value="fired" >Fired</option>
                        <option value="resigned" >resigned</option>
                    </select>
                    <label className="inputName">status</label>
                </div>

                <div className="inputcontainer filter">
                    <select name="sort" className="input" value={local.sort} onChange={handleInput} >
                        <option value="applied_date:desc" >Newest application</option>
                        <option value="release_date:desc" >Newest released</option>
                        <option value="applied_date:asc" >Oldest application</option>
                        <option value="release_date:asc" >Oldest released</option>
                        <option value="status:asc" >Status</option>
                        <option value="company:asc" >company</option>
                        <option value="title:asc" >title</option>
                    </select>
                    <label className="inputName">sort</label>
                </div>

                <button onClick={applyFilters}>Apply</button>
            </div>
        </div>
    )

}