const { useState, useEffect } = React

export function BugPagination({ filterBy, onSetFilterBy, lastPageIdx }) {
    const [pageIdxToEdit, setpageIdxToEdit] = useState(filterBy.pageIdx)

    useEffect(() => {
        onSetFilterBy({ pageIdx: pageIdxToEdit })
    }, [pageIdxToEdit])

    useEffect(() => {
        // setFilterByToEdit(filterBy)
    }, [filterBy])

    function handleChange(value) {
        var newValue = value
        if (value > lastPageIdx) newValue = 0
        else if (value < 0) newValue = lastPageIdx

        setpageIdxToEdit(newValue)
    }

    return <nav className="bug-pagination" aria-label="Bug list pagination">

        <button onClick={() => handleChange(pageIdxToEdit - 1)}>{'<'}</button>
        <span>{filterBy.pageIdx + 1}</span>
        <button onClick={() => handleChange(pageIdxToEdit + 1)}>{'>'}</button>
    </nav>
}