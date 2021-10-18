const { Link } = ReactRouterDOM
import { bugService } from "../services/bug.service.js";
import { userService } from './../services/user.service.js';
export class BugDetails extends React.Component {
    state = {
        loggedInUser: null,
        bug: null
    }

    async componentDidMount() {
        const loggedInUser = userService.getLoggedinUser()
        if (!loggedInUser) {
            this.props.history.push('/');
            return;
        }
        const bugId = this.props.match.params.bugId;
        if (!bugId) {
            this.props.history.push('/');
            return;
        }

        const bug = await bugService.getById(bugId)
        this.setState({ bug, loggedInUser })
    }

    onEditBug = async (bug) => {
        const severity = +prompt('Severity? (1-3)');
        if (severity > 3 || severity < 1) return;
        const bugToSave = { ...bug, severity }
        try {
            const savedBug = await bugService.update(bugToSave)
            console.log('Updated Bug:', savedBug);
            this.setState({ bug: savedBug })
        } catch (err) {
            alert(err)
        }
    }

    render() {
        const { bug, loggedInUser } = this.state;
        if (!bug) return <h1>No bug...</h1>
        const date = new Date(bug.created_at);
        console.log(bug);
        return (
            <div className="bug-details">
                <h1>Name: {bug.name}</h1>
                <h1>Description: {bug.description}</h1>
                <h2>Severity: {{
                    1: 'Nah',
                    2: 'Medium',
                    3: 'Very very'
                }[bug.severity]}</h2>
                <h1>Created by: {bug.creator}</h1>
                <h1>Created at: {date.toLocaleString("he-IL")}</h1>
                {loggedInUser.username === bug.creator
                    || loggedInUser.is_admin ?
                    <button onClick={() => { this.onEditBug(bug) }}>Edit</button>
                    : ''}
                <button><Link to={`/`}>Back</Link></button>
            </div>
        )
    }
}