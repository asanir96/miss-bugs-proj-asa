const { useState, useEffect } = React

export function BugSort({ filterBy, onSetFilterBy, uniqueLabels }) {

    const [sortByToEdit, setSortByToEdit] = useState({ sortBy: filterBy.sortBy, sortDir: filterBy.sortDir })
    console.log('sortByToEdit', sortByToEdit)
    useEffect(() => {
        onSetFilterBy(sortByToEdit)
    }, [sortByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        if (value === '↓') value = -1
        if (value === '↑') value = 1

        console.log('value', value)
        setSortByToEdit(prevSort => ({ ...prevSort, [field]: value }))
    }

    function onSubmitSort(ev) {
        ev.preventDefault()
        onSetFilterBy({ sortBy: sortByToEdit.sortBy, sortDir: sortByToEdit.sortDir })
    }

    function clearLabels() {
        setFilterByToEdit(prevFilter => ({ ...prevFilter, labels: [] }))
    }

    return (
        <form className="bug-sort" onSubmit={onSubmitSort}>
            <div>
                <label htmlFor="labels">Bug labels:</label>

                <select name="sortBy" id="" onChange={handleChange}>
                    <option value="title">Title</option>
                    <option value="severity" selected>Severity</option>
                    <option value="createdAt">Time of creation</option>
                </select>

                <input className={`sort-dir-btn ${sortByToEdit.sortDir === 1 ? 'selected' : ''}`} type="button" value="↑" onClick={handleChange} name="sortDir" />
                <input className={`sort-dir-btn ${sortByToEdit.sortDir === -1 ? 'selected' : ''}`} type="button" value="↓" onClick={handleChange} name="sortDir" />

                <button className="clear-btn" onClick={clearLabels}>Clear</button>
            </div>

        </form>
    )
}