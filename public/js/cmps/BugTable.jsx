import { BugPreview } from "./BugPreview.jsx"
export function BugTable({ bugs, onRemoveBug, onEditBug }) {
    return (
        <table className="bug-table">
            <thead>
                <tr>
                    <td>Name</td>
                    <td>Description</td>
                    <td>Severity</td>
                    <td>Created by</td>
                    <td>Actions</td>
                </tr>
            </thead>
            <tbody>
                {bugs.map(bug =>
                    <BugPreview key={bug._id} bug={bug} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />)}
            </tbody>
        </table >
    )
}