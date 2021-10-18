import { userService } from './../services/user.service.js';
import { bugService } from './../services/bug.service.js';
export class UserDetails extends React.Component {
    state = {
        user: null,
        bugCount: 0
    }

    componentDidMount() {
        this.getUserDetails();
    }

    getUserDetails = async () => {
        var userId = this.props.match.params.userId;
        if (!userId) {
            this.props.history.push("/");
            return;
        }
        const data = await userService.getById(userId)
        if (!data) {
            this.props.history.push("/");
            return;
        } else {
            const { user, bugCount } = data;
            this.setState({ user, bugCount })
        }
    }

    render() {
        const { user, bugCount } = this.state;
        if (!user) return (<h1>Login or signup first!</h1>)
        return (
            <section className="user-details">
                <h1>User: {user.username}</h1>
                <h2>Bug count: {bugCount}</h2>
            </section>
        )
    }
}