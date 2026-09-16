export function BugPreview({bug}) {
    return <article className="bug-preview">
        <p className="title">{bug.title}</p>
        <p>Severity: <span>{bug.severity}</span></p>
        <div className="bug-labels">
            {bug.labels && bug.labels.map(label => {
                return <div className="bug-label" key={`bug-label-${label}`}>{label}</div>
            })}
        </div>
    </article>
}