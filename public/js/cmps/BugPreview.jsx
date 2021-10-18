const { Link } = ReactRouterDOM
export function BugPreview({ bug, onRemoveBug }) {
    return (
        <tr key={bug._id} className="bug-preview">
            <td>
                <Link to={`/bug/${bug._id}`}>
                    {bug.name}
                </Link>
            </td>
            <td>{bug.description}</td>
            <td>{bug.severity}</td>
            <td><Link to={`/user/${bug.creator_id}`}>{bug.creator}</Link></td>
            <td>
                <button onClick={() => {
                    onRemoveBug(bug._id)
                }}>x</button>
               
            </td>
        </tr>
    )
}