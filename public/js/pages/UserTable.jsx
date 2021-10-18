const { Link } = ReactRouterDOM
import { userService } from '../services/user.service.js';
export class UserTable extends React.Component {
    state = {
        users: []
    }

    async componentDidMount() {
        const users = await userService.getUsers()
        this.setState({ users })
    }

    onRemoveuser = async (id) => {
        const users = await userService.deleteUser(id)
        this.setState({ users })
    }

    render() {
        const { users } = this.state;
        if (!users) return (<h1>no users!</h1>)
        return (
            <table className="user-table">
                <thead>
                    <tr>
                        <td>Username</td>
                        <td>ID</td>
                        <td>Fullname</td>
                        <td>Actions</td>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user =>
                        <tr key={user._id} className="user-preview">
                            <td>
                                <Link to={`/user/${user._id}`}>
                                    {user.username}
                                </Link>
                            </td>
                            <td>
                                {user._id}
                            </td>
                            <td>{user.fullname}</td>
                            <td>
                                <button onClick={() => {
                                    this.onRemoveuser(user._id)
                                }}>x</button>

                            </td>
                        </tr>)}
                </tbody>
            </table >
        )
    }
}