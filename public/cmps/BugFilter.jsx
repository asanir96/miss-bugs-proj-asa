const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy, uniqueLabels }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break

            case 'checkbox':
                value = target.checked
                break

            case 'select-one':
                value = target.value
        }

        if (field === 'labels') {
            setFilterByToEdit(prevFilter => {
                return !prevFilter.labels.includes(value) ? ({ ...prevFilter, labels: [...prevFilter.labels, value] }) : prevFilter
            })
        }
        else setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    function clearLabels() {
        setFilterByToEdit(prevFilter => ({ ...prevFilter, labels: [] }))
    }

    const { txt, minSeverity } = filterByToEdit
    return (
        <form className="bug-filter" onSubmit={onSubmitFilter}>
            <p>Filter</p>

            <div>
                <label htmlFor="txt">Text: </label>
                <input value={txt} onChange={handleChange} type="text" placeholder="Search title / desc." id="txt" name="txt" />
            </div>

            <div>
                <label htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity || ''} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />
            </div>

            <div>
                <label htmlFor="labels">Bug labels:</label>

                <select name="labels" id="" onChange={handleChange}>
                    {uniqueLabels && uniqueLabels.map(label => {
                        return <option key={`label-${label}`} value={label}>{label}</option>
                    })}
                </select>
                <button className="clear-btn" onClick={clearLabels}>Clear</button>
            </div>

            <div className="selected-labels">{filterByToEdit.labels && filterByToEdit.labels.map(label => {
                return <div className="selected-label" key={`selected-label-${label}`}>{label}</div>
            })}</div>
        </form>
    )
}